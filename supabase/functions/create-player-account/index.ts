import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const admin = createClient(supabaseUrl, serviceRole);
    const { data: role } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    if (!role) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body = await req.json();
    const { email, password, full_name, player_id } = body as { email?: string; password?: string; full_name?: string; player_id?: string };
    if (!email || !password || !player_id) {
      return new Response(JSON.stringify({ error: 'email, password, and player_id required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Check existing user by email
    let userId: string | null = null;
    const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = existing?.users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) {
      userId = found.id;
    } else {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: full_name || '' },
      });
      if (createErr || !created.user) {
        return new Response(JSON.stringify({ error: createErr?.message || 'Failed to create user' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      userId = created.user.id;
    }

    // Link the auth user to the player record
    const { error: linkErr } = await admin
      .from('players')
      .update({ user_id: userId })
      .eq('id', player_id);
    if (linkErr) {
      return new Response(JSON.stringify({ error: linkErr.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Send welcome email via Resend (optional)
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
          body: JSON.stringify({
            from: 'College Fairway Advisors <contact@cfa.golf>',
            to: [email],
            subject: 'Your College Fairway Advisors Player Site is Ready',
            html: `
              <p>Hi ${full_name || 'there'},</p>
              <p>Your recruiting website has been set up. You can log in and edit your bio, photos, tournament results and videos here:</p>
              <p><strong>Login:</strong> <a href="https://www.cfa.golf/player/login">https://www.cfa.golf/player/login</a></p>
              <p><strong>Email:</strong> ${email}<br/>
              <strong>Temporary password:</strong> ${password}</p>
              <p>Please change your password after first login.</p>
              <p>— College Fairway Advisors</p>
            `,
          }),
        });
      } catch (_) { /* non-fatal */ }
    }

    return new Response(JSON.stringify({ ok: true, user_id: userId }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
