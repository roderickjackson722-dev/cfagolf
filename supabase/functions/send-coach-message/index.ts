import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const body = await req.json();
    const { coach_id, sender_name, sender_email, message, sender_user_id } = body;

    if (!coach_id || !sender_name || !sender_email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: coach } = await admin
      .from("coaches")
      .select("id, full_name, email, college_name, is_active")
      .eq("id", coach_id)
      .maybeSingle();
    if (!coach || !coach.is_active) {
      return new Response(JSON.stringify({ error: "Coach not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: insertErr } = await admin.from("coach_messages").insert({
      coach_id,
      sender_name,
      sender_email,
      message,
      sender_user_id: sender_user_id ?? null,
    });
    if (insertErr) {
      return new Response(JSON.stringify({ error: insertErr.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "College Fairway Advisors <contact@cfa.golf>",
            to: [coach.email],
            reply_to: sender_email,
            subject: `New message from ${sender_name} on your CFA profile`,
            html: `
              <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
                <h2 style="color:#1B4332;">New Message</h2>
                <p><strong>${sender_name}</strong> (${sender_email}) sent you a message via your CFA coach profile:</p>
                <blockquote style="border-left:3px solid #1B4332;padding:12px 16px;background:#F5F1E8;margin:16px 0;">
                  ${message.replace(/\n/g, "<br/>")}
                </blockquote>
                <p>View in your inbox: <a href="https://www.cfa.golf/coach/dashboard">https://www.cfa.golf/coach/dashboard</a></p>
              </div>`,
          }),
        });
      } catch (e) {
        console.error("Resend error", e);
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
