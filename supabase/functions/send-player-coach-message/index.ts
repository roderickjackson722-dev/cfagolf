import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { player_id, coach_name, coach_email, coach_phone, coach_college, message, send_copy } = await req.json();
    if (!player_id || !coach_name || !coach_email || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: player } = await supabase.from('players').select('full_name, contact_email, slug').eq('id', player_id).maybeSingle();
    if (!player) return new Response(JSON.stringify({ error: 'Player not found' }), { status: 404, headers: corsHeaders });

    const recipients = [player.contact_email, 'contact@cfa.golf'].filter(Boolean);
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (RESEND_API_KEY && recipients.length) {
      const html = `
        <h2>New coach inquiry for ${player.full_name}</h2>
        <p><strong>Coach:</strong> ${coach_name}${coach_college ? ` (${coach_college})` : ''}</p>
        <p><strong>Email:</strong> ${coach_email}</p>
        ${coach_phone ? `<p><strong>Phone:</strong> ${coach_phone}</p>` : ''}
        <hr/>
        <p style="white-space:pre-wrap">${message.replace(/</g, '&lt;')}</p>
        <hr/>
        <p style="font-size:12px;color:#666">Sent via cfa.golf/p/${player.slug}</p>
      `;
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'College Fairway Advisors <contact@cfa.golf>',
          to: recipients,
          reply_to: coach_email,
          subject: `New coach inquiry for ${player.full_name}`,
          html,
        }),
      });

      if (send_copy) {
        const ack = `
          <h2>Thanks for reaching out about ${player.full_name}</h2>
          <p>This is a copy of the inquiry you just sent.</p>
          <p>${player.full_name} (or their team) will be in touch shortly. You can reach them directly at <a href="mailto:${player.contact_email || 'contact@cfa.golf'}">${player.contact_email || 'contact@cfa.golf'}</a>.</p>
          <hr/>
          <p style="white-space:pre-wrap">${message.replace(/</g, '&lt;')}</p>
          <hr/>
          <p style="font-size:12px;color:#666">College Fairway Advisors · cfa.golf/p/${player.slug}</p>
        `;
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'College Fairway Advisors <contact@cfa.golf>',
            to: [coach_email],
            subject: `Copy of your inquiry to ${player.full_name}`,
            html: ack,
          }),
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
