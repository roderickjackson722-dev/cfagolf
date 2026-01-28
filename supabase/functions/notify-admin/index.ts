import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "contact@cfa.golf";

interface VisitorNotification {
  type: "visitor";
  visitorId: string;
  pageUrl?: string;
  referrer?: string;
  country?: string;
  region?: string;
  city?: string;
  timestamp: string;
}

interface SignupNotification {
  type: "signup";
  email?: string;
  fullName?: string;
  graduationYear?: number;
  handicap?: number;
  highSchool?: string;
  state?: string;
  city?: string;
  phone?: string;
  timestamp: string;
}

type NotificationPayload = VisitorNotification | SignupNotification;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: NotificationPayload = await req.json();
    
    let subject: string;
    let htmlContent: string;

    if (payload.type === "visitor") {
      subject = "🌐 New Site Visitor - CFA Golf";
      const timestamp = new Date(payload.timestamp).toLocaleString("en-US", {
        timeZone: "America/New_York",
        dateStyle: "medium",
        timeStyle: "short",
      });
      
      // Build location string
      const locationParts = [payload.city, payload.region, payload.country].filter(Boolean);
      const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "Unknown location";
      
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2d5a27; border-bottom: 2px solid #2d5a27; padding-bottom: 10px;">
            New Site Visitor
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>📍 Location:</strong> ${locationStr}</p>
            <p style="margin: 8px 0;"><strong>🔗 Page:</strong> ${payload.pageUrl || "Home"}</p>
            <p style="margin: 8px 0;"><strong>↩️ Referrer:</strong> ${payload.referrer || "Direct visit"}</p>
            <p style="margin: 8px 0;"><strong>⏰ Time:</strong> ${timestamp}</p>
            <p style="margin: 8px 0; color: #888; font-size: 11px;"><strong>Visitor ID:</strong> ${payload.visitorId}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated notification from CFA Golf.
          </p>
        </div>
      `;
    } else if (payload.type === "signup") {
      subject = "🎉 New Signup - CFA Golf";
      const timestamp = new Date(payload.timestamp).toLocaleString("en-US", {
        timeZone: "America/New_York",
        dateStyle: "medium",
        timeStyle: "short",
      });
      
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2d5a27; border-bottom: 2px solid #2d5a27; padding-bottom: 10px;">
            🎉 New User Signup!
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Contact Information</h3>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${payload.email || "Not provided"}</p>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${payload.fullName || "Not provided"}</p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${payload.phone || "Not provided"}</p>
            
            <h3 style="margin-top: 20px; color: #333;">Location</h3>
            <p style="margin: 8px 0;"><strong>City:</strong> ${payload.city || "Not provided"}</p>
            <p style="margin: 8px 0;"><strong>State:</strong> ${payload.state || "Not provided"}</p>
            
            <h3 style="margin-top: 20px; color: #333;">Golf Profile</h3>
            <p style="margin: 8px 0;"><strong>High School:</strong> ${payload.highSchool || "Not provided"}</p>
            <p style="margin: 8px 0;"><strong>Graduation Year:</strong> ${payload.graduationYear || "Not provided"}</p>
            <p style="margin: 8px 0;"><strong>Handicap:</strong> ${payload.handicap !== null && payload.handicap !== undefined ? payload.handicap : "Not provided"}</p>
            
            <p style="margin: 16px 0 0 0; color: #666; font-size: 12px;"><strong>Signed up at:</strong> ${timestamp}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated notification from CFA Golf.
          </p>
        </div>
      `;
    } else {
      throw new Error("Invalid notification type");
    }

    const emailResponse = await resend.emails.send({
      from: "CFA Golf <notifications@cfa.golf>",
      to: [ADMIN_EMAIL],
      subject,
      html: htmlContent,
    });

    console.log(`Admin notification sent (${payload.type}):`, emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error sending admin notification:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
