import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WelcomeEmailRequest {
  email: string;
  fullName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName }: WelcomeEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const firstName = fullName?.split(' ')[0] || 'there';
    const calendlyLink = "https://calendly.com/contact-cfa/30min";

    const emailResponse = await resend.emails.send({
      from: "CFA Golf <contact@cfa.golf>",
      to: [email],
      subject: "Welcome to CFA Golf - Let's Schedule Your Onboarding Call!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #166534; margin-bottom: 10px;">Welcome to CFA Golf! 🏌️</h1>
          </div>
          
          <p style="font-size: 16px;">Hey ${firstName},</p>
          
          <p style="font-size: 16px;">Congratulations on joining College Fairway Advisors! You've just taken a huge step toward your college golf recruiting journey.</p>
          
          <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: white; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
            <h2 style="margin: 0 0 15px 0; font-size: 20px;">🎯 Your First Step: Schedule Your Onboarding Call</h2>
            <p style="margin: 0 0 20px 0; font-size: 15px;">Let's get you set up for success! Book your 30-minute onboarding meeting with our team.</p>
            <a href="${calendlyLink}" style="display: inline-block; background-color: white; color: #166534; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Schedule Your Onboarding Call</a>
          </div>
          
          <h3 style="color: #166534; margin-top: 30px;">What You'll Get From Your Onboarding:</h3>
          <ul style="font-size: 15px; padding-left: 20px;">
            <li>A personalized walkthrough of all CFA Golf tools</li>
            <li>Strategic guidance tailored to your recruiting goals</li>
            <li>Tips on maximizing your scholarship opportunities</li>
            <li>Direct access to our recruiting expertise</li>
          </ul>
          
          <h3 style="color: #166534; margin-top: 25px;">Your CFA Golf Toolkit:</h3>
          <ul style="font-size: 15px; padding-left: 20px;">
            <li><strong>College Database</strong> - Search 1,300+ programs</li>
            <li><strong>Target School Builder</strong> - Organize your dream schools</li>
            <li><strong>Coach Tracker</strong> - Manage coach communications</li>
            <li><strong>Tournament Log</strong> - Track your competitive results</li>
            <li><strong>Scholarship Calculator</strong> - Compare financial offers</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cfagolf.lovable.app/login" style="display: inline-block; background-color: #166534; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Login to Your Toolkit</a>
          </div>
          
          <p style="font-size: 16px; margin-top: 25px;">We're excited to help you find your perfect college golf fit!</p>
          
          <p style="font-size: 16px;">
            Best,<br>
            <strong>Rod Jackson</strong><br>
            <em>Founder, College Fairway Advisors</em>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 13px; color: #6b7280; text-align: center;">
            Questions? Reply to this email or reach out at <a href="mailto:contact@cfa.golf" style="color: #166534;">contact@cfa.golf</a>
          </p>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
