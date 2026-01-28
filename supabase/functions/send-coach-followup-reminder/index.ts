import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ReminderRequest {
  contactId?: string; // Send for specific contact
  userId?: string; // Send all due reminders for user
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { contactId, userId }: ReminderRequest = await req.json();

    // Build query for contacts with follow-up dates
    let query = supabase
      .from("coach_contacts")
      .select(`
        id,
        school_name,
        coach_name,
        coach_title,
        email,
        follow_up_date,
        notes,
        status,
        user_id
      `)
      .not("follow_up_date", "is", null);

    if (contactId) {
      query = query.eq("id", contactId);
    } else if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: contacts, error: contactsError } = await query;

    if (contactsError) {
      throw new Error(`Failed to fetch contacts: ${contactsError.message}`);
    }

    if (!contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No contacts with follow-up dates found", sent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get user profiles for email addresses
    const userIds = [...new Set(contacts.map(c => c.user_id))];
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, email, full_name")
      .in("user_id", userIds);

    if (profilesError) {
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
    const results: { contactId: string; success: boolean; error?: string }[] = [];

    // Send reminder emails
    for (const contact of contacts) {
      const profile = profileMap.get(contact.user_id);
      if (!profile?.email) {
        results.push({ contactId: contact.id, success: false, error: "No user email found" });
        continue;
      }

      const firstName = profile.full_name?.split(" ")[0] || "there";
      const followUpDate = new Date(contact.follow_up_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      try {
        await resend.emails.send({
          from: "CFA Golf <contact@cfa.golf>",
          to: [profile.email],
          subject: `Follow-up Reminder: ${contact.coach_name} at ${contact.school_name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #166534; margin-bottom: 10px;">Coach Follow-up Reminder 📧</h1>
              </div>
              
              <p style="font-size: 16px;">Hey ${firstName},</p>
              
              <p style="font-size: 16px;">This is a friendly reminder about your scheduled follow-up with a college coach:</p>
              
              <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: white; padding: 25px; border-radius: 12px; margin: 25px 0;">
                <h2 style="margin: 0 0 15px 0; font-size: 20px;">📅 Follow-up Due: ${followUpDate}</h2>
                <table style="width: 100%; font-size: 15px;">
                  <tr>
                    <td style="padding: 5px 0; color: rgba(255,255,255,0.8);">School:</td>
                    <td style="padding: 5px 0; font-weight: bold;">${contact.school_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: rgba(255,255,255,0.8);">Coach:</td>
                    <td style="padding: 5px 0; font-weight: bold;">${contact.coach_name}${contact.coach_title ? ` (${contact.coach_title})` : ""}</td>
                  </tr>
                  ${contact.email ? `
                  <tr>
                    <td style="padding: 5px 0; color: rgba(255,255,255,0.8);">Coach Email:</td>
                    <td style="padding: 5px 0;"><a href="mailto:${contact.email}" style="color: white;">${contact.email}</a></td>
                  </tr>
                  ` : ""}
                  <tr>
                    <td style="padding: 5px 0; color: rgba(255,255,255,0.8);">Status:</td>
                    <td style="padding: 5px 0; text-transform: capitalize;">${contact.status?.replace("_", " ") || "Initial"}</td>
                  </tr>
                </table>
              </div>
              
              ${contact.notes ? `
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #166534; font-size: 14px;">📝 Your Notes:</h3>
                <p style="margin: 0; font-size: 14px; color: #4b5563;">${contact.notes}</p>
              </div>
              ` : ""}
              
              <h3 style="color: #166534; margin-top: 25px;">Tips for Your Follow-up:</h3>
              <ul style="font-size: 15px; padding-left: 20px;">
                <li>Reference your previous conversation or meeting</li>
                <li>Share any recent tournament results or achievements</li>
                <li>Ask specific questions about the program</li>
                <li>Express your continued interest in their school</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://cfagolf.lovable.app/coach-tracker" style="display: inline-block; background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">View in Coach Tracker</a>
              </div>
              
              <p style="font-size: 16px;">Good luck with your outreach!</p>
              
              <p style="font-size: 16px;">
                Best,<br>
                <strong>The CFA Golf Team</strong>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="font-size: 13px; color: #6b7280; text-align: center;">
                Questions? Reply to this email or reach out at <a href="mailto:contact@cfa.golf" style="color: #166534;">contact@cfa.golf</a>
              </p>
            </body>
            </html>
          `,
        });

        results.push({ contactId: contact.id, success: true });
        console.log(`Reminder sent for contact ${contact.id} to ${profile.email}`);
      } catch (emailError: unknown) {
        const errorMessage = emailError instanceof Error ? emailError.message : String(emailError);
        results.push({ contactId: contact.id, success: false, error: errorMessage });
        console.error(`Failed to send reminder for contact ${contact.id}:`, emailError);
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(
      JSON.stringify({ success: true, sent: successCount, total: results.length, results }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error sending coach follow-up reminders:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
