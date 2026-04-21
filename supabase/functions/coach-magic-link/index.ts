import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function generatePassword(length = 14): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let out = "";
  const rand = new Uint32Array(length);
  crypto.getRandomValues(rand);
  for (let i = 0; i < length; i++) out += chars[rand[i] % chars.length];
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { coach_id, mode = "magic_link" } = await req.json();
    const { data: coach } = await admin
      .from("coaches")
      .select("id, email, full_name, user_id")
      .eq("id", coach_id)
      .maybeSingle();
    if (!coach) {
      return new Response(JSON.stringify({ error: "Coach not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (mode === "reset_password") {
      const newPassword = generatePassword();
      await admin.auth.admin.updateUserById(coach.user_id, {
        password: newPassword,
      });
      if (RESEND_API_KEY) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "College Fairway Advisors <contact@cfa.golf>",
            to: [coach.email],
            subject: "Your CFA Coach Portal Password Was Reset",
            html: `
              <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
                <h2 style="color:#1B4332;">Password Reset</h2>
                <p>Hi ${coach.full_name},</p>
                <p>Your password has been reset. Use the temporary password below to log in.</p>
                <div style="background:#F5F1E8;padding:16px;border-radius:8px;">
                  <p><strong>Login:</strong> <a href="https://www.cfa.golf/coach/login">https://www.cfa.golf/coach/login</a></p>
                  <p><strong>Email:</strong> ${coach.email}</p>
                  <p><strong>Temporary Password:</strong> <code>${newPassword}</code></p>
                </div>
              </div>`,
          }),
        });
      }
      return new Response(
        JSON.stringify({ ok: true, temp_password: newPassword }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Magic link
    const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: coach.email,
      options: { redirectTo: "https://www.cfa.golf/coach/dashboard" },
    });
    if (linkErr || !link) {
      return new Response(JSON.stringify({ error: linkErr?.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const actionLink = link.properties?.action_link;

    if (RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "College Fairway Advisors <contact@cfa.golf>",
          to: [coach.email],
          subject: "Your CFA Coach Portal Login Link",
          html: `
            <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
              <h2 style="color:#1B4332;">One-Click Login</h2>
              <p>Hi ${coach.full_name},</p>
              <p>Click the button below to log in to your coach portal. This link expires in 1 hour.</p>
              <p><a href="${actionLink}" style="display:inline-block;background:#1B4332;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Log In to Coach Portal</a></p>
            </div>`,
        }),
      });
    }

    return new Response(JSON.stringify({ ok: true, action_link: actionLink }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
