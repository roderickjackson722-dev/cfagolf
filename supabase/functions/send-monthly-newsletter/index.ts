import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rotating monthly tips — index by month (0-11)
const monthlyTips = [
  {
    subject: "January Recruiting Tip: Set Your Goals for the Year",
    title: "🎯 Start the Year Strong",
    tip: "January is the perfect time to set clear recruiting goals. Identify your target schools, update your tournament schedule, and reach out to coaches with your winter training updates. College coaches love hearing from motivated athletes who plan ahead.",
    actionItems: [
      "Update your player profile with fall semester grades",
      "Register for upcoming spring WAGR-ranked events",
      "Send introductory emails to 5 new target school coaches",
      "Review NCAA eligibility requirements for your grad year",
    ],
  },
  {
    subject: "February Recruiting Tip: Film & Stats Matter",
    title: "📊 Let Your Numbers Tell the Story",
    tip: "February is a great month to compile your competitive stats from fall and winter rounds. Coaches rely heavily on scoring averages and tournament finishes to evaluate recruits. Make sure your data is up to date and easy to share.",
    actionItems: [
      "Update your tournament log with recent results",
      "Calculate your competitive scoring average",
      "Create a highlight reel from recent rounds",
      "Send updated stats to coaches on your target list",
    ],
  },
  {
    subject: "March Recruiting Tip: Spring Season Prep",
    title: "🌱 Spring Season = Peak Recruiting",
    tip: "Spring is when college coaches are most active in evaluating recruits. Make sure you're playing in events where coaches will see you. Tag coaches in your tournament schedules and ask if they'll be attending any of the same events.",
    actionItems: [
      "Finalize your spring tournament schedule",
      "Email coaches your upcoming event calendar",
      "Schedule campus visits during spring break",
      "Practice your 30-second recruiting elevator pitch",
    ],
  },
  {
    subject: "April Recruiting Tip: Campus Visits Are Key",
    title: "🏫 Make Campus Visits Count",
    tip: "April is prime campus visit season. Whether official or unofficial, campus visits show coaches you're serious. Prepare thoughtful questions about the team culture, practice schedule, and academic support. First impressions matter!",
    actionItems: [
      "Schedule at least 2 campus visits this month",
      "Prepare a list of questions for each coaching staff",
      "Take notes and photos during each visit",
      "Send thank-you emails within 24 hours of visiting",
    ],
  },
  {
    subject: "May Recruiting Tip: End of Year Academic Push",
    title: "📚 Academics Close the Deal",
    tip: "As the school year winds down, your final grades matter more than you think. College coaches want student-athletes who perform in the classroom. A strong GPA can be the tiebreaker between you and another recruit.",
    actionItems: [
      "Push for the strongest possible final grades",
      "Request your unofficial transcript for coach communications",
      "Register for any needed SAT/ACT test dates",
      "Update your NCAA Eligibility Center with new coursework",
    ],
  },
  {
    subject: "June Recruiting Tip: Summer Showcase Season",
    title: "☀️ Make Summer Count",
    tip: "June kicks off the biggest recruiting window of the year. College camps, national tournaments, and WAGR events are where scholarships are earned. Plan your summer schedule strategically — quality over quantity.",
    actionItems: [
      "Register for college golf camps at target schools",
      "Plan your summer tournament schedule around WAGR events",
      "Set specific scoring goals for summer events",
      "Follow up with coaches you met during spring visits",
    ],
  },
  {
    subject: "July Recruiting Tip: The College Camp Advantage",
    title: "⛳ College Camps = Face Time with Coaches",
    tip: "Attending college golf camps gives you direct face time with coaching staffs — something emails and videos can never replace. Coaches evaluate your game, your attitude, and how you handle pressure in real time.",
    actionItems: [
      "Attend at least 1–2 college golf camps this month",
      "Bring your updated resume and stats to every camp",
      "Be coachable and positive — coaches are always watching",
      "Connect with other recruits — networking matters",
    ],
  },
  {
    subject: "August Recruiting Tip: Back to School, Back to Business",
    title: "🎒 Reset & Refocus for Fall",
    tip: "August is a transition month. Use it to reflect on your summer results, update your recruiting materials, and set fall goals. Coaches are back on campus and finalizing rosters — make sure you're on their radar.",
    actionItems: [
      "Update your tournament log with all summer results",
      "Send coaches a summer recap email with stats",
      "Set academic and athletic goals for the fall semester",
      "Review and update your target school list",
    ],
  },
  {
    subject: "September Recruiting Tip: Fall Tournament Strategy",
    title: "🍂 Fall Events = Recruiting Gold",
    tip: "September starts the fall golf season, and coaches are actively watching tournaments. Choose events strategically — WAGR-ranked tournaments and well-known junior events carry more weight with college programs.",
    actionItems: [
      "Prioritize WAGR-ranked events in your fall schedule",
      "Email coaches your fall tournament calendar",
      "Track every round in your tournament log",
      "Set a goal to break your scoring average this fall",
    ],
  },
  {
    subject: "October Recruiting Tip: The Follow-Up Factor",
    title: "📧 Follow Up Like a Pro",
    tip: "October is when consistent follow-up separates serious recruits from the rest. Coaches are juggling hundreds of prospects — your job is to stay top of mind without being pushy. Monthly updates with results and genuine interest go a long way.",
    actionItems: [
      "Send monthly update emails to your top 10 coaches",
      "Share recent tournament results and highlights",
      "Ask coaches specific questions about their program",
      "Update your Coach Tracker with every interaction",
    ],
  },
  {
    subject: "November Recruiting Tip: Early Signing Period Prep",
    title: "✍️ Signing Day Is Coming",
    tip: "November brings the early signing period for many divisions. Even if you're not signing this year, understanding the timeline helps you plan. For juniors and younger, now is the time to build relationships that lead to offers.",
    actionItems: [
      "Research signing period dates for your target division",
      "Have honest conversations with coaches about timelines",
      "Compare scholarship offers using the Scholarship Calculator",
      "Discuss options with your family and school counselor",
    ],
  },
  {
    subject: "December Recruiting Tip: Year-End Reflection",
    title: "🎄 Reflect, Reset, Recruit",
    tip: "December is the time to look back on your year and plan ahead. Review your recruiting progress, celebrate wins, and identify areas for improvement. The off-season is when champions are made.",
    actionItems: [
      "Review your full-year tournament stats and trends",
      "Update your target school list based on new information",
      "Set 3 specific recruiting goals for next year",
      "Send holiday greetings to coaches you've built relationships with",
    ],
  },
];

function getMonthlyEmailHtml(tip: typeof monthlyTips[0], subscriberName?: string) {
  const firstName = subscriberName?.split(' ')[0] || 'Golf Family';
  
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
              ${tip.actionItems.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}
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
            <a href="mailto:contact@cfa.golf?subject=Unsubscribe" style="color: #166534;">Unsubscribe</a> · <a href="https://cfagolf.lovable.app" style="color: #166534;">Visit CFA Golf</a>
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    const monthIndex = new Date().getMonth(); // 0-11
    const tip = monthlyTips[monthIndex];

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    // Send in batches of 10 to avoid rate limits
    for (let i = 0; i < subscribers.length; i += 10) {
      const batch = subscribers.slice(i, i + 10);
      
      const results = await Promise.allSettled(
        batch.map(sub =>
          resend.emails.send({
            from: "CFA Golf <contact@cfa.golf>",
            to: [sub.email],
            subject: tip.subject,
            html: getMonthlyEmailHtml(tip, sub.full_name || undefined),
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

      // Small delay between batches
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
