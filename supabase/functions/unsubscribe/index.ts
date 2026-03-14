import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      // Show a simple HTML confirmation page
      return new Response(
        `<!DOCTYPE html>
        <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribe - CFA Golf</title></head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 60px auto; text-align: center; padding: 20px;">
          <h2 style="color: #166534;">CFA Golf</h2>
          <p style="color: #666;">No email address provided. If you believe this is an error, please contact <a href="mailto:contact@cfa.golf">contact@cfa.golf</a>.</p>
        </body></html>`,
        { status: 400, headers: { "Content-Type": "text/html", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Mark subscriber as inactive
    const { error } = await supabase
      .from("email_subscribers")
      .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
      .eq("email", email);

    if (error) {
      console.error("Unsubscribe error:", error);
    }

    // Always show success page (even if email wasn't found, for privacy)
    return new Response(
      `<!DOCTYPE html>
      <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Unsubscribed - CFA Golf</title></head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 60px auto; text-align: center; padding: 20px;">
        <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <h2 style="color: #166534; margin-bottom: 10px;">✅ You've been unsubscribed</h2>
          <p style="color: #666; font-size: 15px; line-height: 1.6;">
            <strong>${email}</strong> has been removed from the CFA Golf mailing list. You will no longer receive monthly recruiting tips.
          </p>
          <p style="color: #999; font-size: 13px; margin-top: 20px;">
            Changed your mind? Email <a href="mailto:contact@cfa.golf" style="color: #166534;">contact@cfa.golf</a> to re-subscribe.
          </p>
          <a href="https://cfagolf.lovable.app" style="display: inline-block; margin-top: 20px; background-color: #166534; color: white; padding: 10px 24px; text-decoration: none; border-radius: 8px; font-size: 14px;">Visit CFA Golf</a>
        </div>
      </body></html>`,
      { status: 200, headers: { "Content-Type": "text/html", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Unsubscribe error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
