import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, role, testimonial } = await req.json();

    if (!name || !testimonial || testimonial.length < 10) {
      return new Response(
        JSON.stringify({ error: "Name and testimonial are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2d5a3d; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px;">
          ⭐ New Customer Testimonial Received
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; color: #555; width: 120px;">Name:</td>
            <td style="padding: 8px 12px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; color: #555;">Role:</td>
            <td style="padding: 8px 12px;">${role || "Not provided"}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #f5f5f0; border-left: 4px solid #2d5a3d; border-radius: 4px;">
          <h3 style="margin: 0 0 8px 0; color: #2d5a3d;">Testimonial:</h3>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${testimonial}</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">
          Submitted on ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}
        </p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "College Fairway Advisors <contact@cfa.golf>",
        to: ["contact@cfa.golf"],
        subject: `⭐ New Testimonial from ${name}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend error:", errorText);
      throw new Error("Failed to send email");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
