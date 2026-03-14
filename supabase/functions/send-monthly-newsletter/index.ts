import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UNSUBSCRIBE_URL = "https://hmycumiukfdbfhplgbri.supabase.co/functions/v1/unsubscribe";

interface Tip {
  subject: string;
  title: string;
  tip: string;
  action_items: string[];
}

function getMonthlyEmailHtml(tip: Tip, subscriberName?: string, subscriberEmail?: string) {
  const firstName = subscriberName?.split(' ')[0] || 'Golf Family';
  const unsubLink = `${UNSUBSCRIBE_URL}?email=${encodeURIComponent(subscriberEmail || '')}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

        <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0 0 5px 0; font-size: 24px;">${tip.title}</h1>
          <p style="margin: 0; opacity: 0.9; font-size: 14px;">Monthly Recruiting Tip from CFA Golf</p>
        </div>

        <div style="padding: 30px;">
          <p style="font-size: 16px;">Hey ${firstName},</p>

          <p style="font-size: 15px; line-height: 1.7;">${tip.tip}</p>

          <div style="background: #f0fdf4; border-left: 4px solid #166534; padding: 20px; border-radius: 0 8px 8px 0; margin: 25px 0;">
            <h3 style="color: #166534; margin: 0 0 12px 0; font-size: 16px;">📋 This Month's Action Items:</h3>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
              ${(tip.action_items || []).map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cfagolf.lovable.app/login" style="display: inline-block; background-color: #166534; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">Open Your CFA Toolkit →</a>
          </div>

          <p style="font-size: 15px;">Keep grinding — your college golf future is being built right now!</p>

          <p style="font-size: 15px;">
            Best,<br>
            <strong>Rod Jackson</strong><br>
            <em>Founder, College Fairway Advisors</em>
          </p>
        </div>

        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; margin: 0;">
            You're receiving this because you subscribed to CFA Golf recruiting tips.<br>
            <a href="${unsubLink}" style="color: #166534;">Unsubscribe</a> · <a href="https://cfagolf.lovable.app" style="color: #166534;">Visit CFA Golf</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { month_index, test_email } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const targetMonth = month_index !== undefined ? month_index : new Date().getMonth();

    // Fetch tip from database
    const { data: tipData, error: tipError } = await supabase
      .from("newsletter_tips")
      .select("subject, title, tip, action_items")
      .eq("month_index", targetMonth)
      .single();

    if (tipError || !tipData) {
      throw new Error(`No newsletter tip found for month ${targetMonth}: ${tipError?.message}`);
    }

    // If test_email is provided, send only to that address
    if (test_email) {
      const emailResponse = await resend.emails.send({
        from: "CFA Golf <contact@cfa.golf>",
        to: [test_email],
        subject: `[TEST] ${tipData.subject}`,
        html: getMonthlyEmailHtml(tipData as Tip, "Test User", test_email),
      });

      console.log("Test email sent:", emailResponse);
      return new Response(
        JSON.stringify({ success: true, sent: 1, test: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch all active subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from("email_subscribers")
      .select("id, email, full_name")
      .eq("is_active", true);

    if (fetchError) throw new Error(`Failed to fetch subscribers: ${fetchError.message}`);
    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No active subscribers", sent: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < subscribers.length; i += 10) {
      const batch = subscribers.slice(i, i + 10);

      const results = await Promise.allSettled(
        batch.map(sub =>
          resend.emails.send({
            from: "CFA Golf <contact@cfa.golf>",
            to: [sub.email],
            subject: tipData.subject,
            html: getMonthlyEmailHtml(tipData as Tip, sub.full_name || undefined, sub.email),
          })
        )
      );

      for (const result of results) {
        if (result.status === "fulfilled") {
          sent++;
        } else {
          failed++;
          errors.push(result.reason?.message || "Unknown error");
        }
      }

      if (i + 10 < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Monthly newsletter sent: ${sent} success, ${failed} failed out of ${subscribers.length}`);

    return new Response(
      JSON.stringify({ success: true, sent, failed, total: subscribers.length, errors: errors.slice(0, 5) }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error sending monthly newsletter:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
