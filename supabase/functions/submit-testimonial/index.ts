import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const escapeHtml = (s: string): string =>
  (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    // Legacy simple form (name/role/testimonial) OR new detailed form
    const legacy = typeof body.testimonial === "string";

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let insertRow: Record<string, unknown>;
    let displayName = "Anonymous";
    let summaryHtml = "";

    if (legacy) {
      const { name, role, testimonial } = body;
      if (!name || !testimonial || testimonial.length < 10) {
        return new Response(JSON.stringify({ error: "Name and testimonial are required." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      displayName = name;
      insertRow = {
        name,
        role: role || null,
        content: testimonial,
        status: "pending",
        source: "form",
      };
      summaryHtml = `<p><strong>Role:</strong> ${escapeHtml(role || "—")}</p>
        <div style="margin-top:12px;padding:12px;background:#f5f5f0;border-left:4px solid #2d5a3d;">${escapeHtml(testimonial).replace(/\n/g, "<br/>")}</div>`;
    } else {
      const {
        biggest_challenge,
        how_helped,
        what_valued_most,
        how_journey_changed,
        advice_to_others,
        additional_comments,
        share_first_name,
        share_grade_level,
        share_location,
        is_anonymous,
        video_url,
        video_file_path,
      } = body;

      const allAnswers = [
        biggest_challenge,
        how_helped,
        what_valued_most,
        how_journey_changed,
        advice_to_others,
        additional_comments,
      ].filter(Boolean);

      if (allAnswers.length === 0 && !video_url && !video_file_path) {
        return new Response(JSON.stringify({ error: "Please answer at least one question or share a video." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      displayName = share_first_name || "Anonymous";
      const combinedContent = [
        biggest_challenge && `Biggest challenge: ${biggest_challenge}`,
        how_helped && `How CFA helped: ${how_helped}`,
        what_valued_most && `Valued most: ${what_valued_most}`,
        how_journey_changed && `How journey changed: ${how_journey_changed}`,
        advice_to_others && `Advice: ${advice_to_others}`,
        additional_comments && `Additional: ${additional_comments}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      insertRow = {
        name: share_first_name || "Anonymous",
        content: combinedContent || "(Video testimonial only)",
        status: "pending",
        source: "form",
        biggest_challenge: biggest_challenge || null,
        how_helped: how_helped || null,
        what_valued_most: what_valued_most || null,
        how_journey_changed: how_journey_changed || null,
        advice_to_others: advice_to_others || null,
        additional_comments: additional_comments || null,
        share_first_name: share_first_name || null,
        share_grade_level: share_grade_level || null,
        share_location: share_location || null,
        is_anonymous: is_anonymous !== false && !share_first_name && !share_grade_level && !share_location,
        video_url: video_url || null,
        video_file_path: video_file_path || null,
      };

      const q = (label: string, val?: string) =>
        val ? `<div style="margin-top:12px;"><strong>${label}</strong><div>${escapeHtml(val).replace(/\n/g, "<br/>")}</div></div>` : "";
      summaryHtml =
        q("Biggest challenge:", biggest_challenge) +
        q("How CFA helped:", how_helped) +
        q("What they valued most:", what_valued_most) +
        q("How the journey changed:", how_journey_changed) +
        q("Advice to others:", advice_to_others) +
        q("Additional comments:", additional_comments) +
        `<hr style="margin:16px 0;"/>
         <p><strong>Name:</strong> ${escapeHtml(share_first_name || "Anonymous")}</p>
         <p><strong>Grade:</strong> ${escapeHtml(share_grade_level || "—")}</p>
         <p><strong>Location:</strong> ${escapeHtml(share_location || "—")}</p>
         ${video_url ? `<p><strong>Video URL:</strong> <a href="${escapeHtml(video_url)}">${escapeHtml(video_url)}</a></p>` : ""}
         ${video_file_path ? `<p><strong>Video file:</strong> ${escapeHtml(video_file_path)}</p>` : ""}`;
    }

    const { error: dbError } = await supabaseAdmin.from("testimonials").insert(insertRow);
    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(JSON.stringify({ error: dbError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      const emailHtml = `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:20px;">
          <h2 style="color:#2d5a3d;border-bottom:2px solid #2d5a3d;padding-bottom:10px;">
            ⭐ New Testimonial Submission
          </h2>
          ${summaryHtml}
          <p style="margin-top:20px;font-size:12px;color:#999;">
            Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}
          </p>
          <p style="margin-top:8px;font-size:12px;color:#2d5a3d;">
            Log in to the Admin Panel → Testimonials to approve or publish.
          </p>
        </div>`;
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: "College Fairway Advisors <contact@cfa.golf>",
            to: ["contact@cfa.golf"],
            subject: `⭐ New Testimonial Submission from ${displayName}`,
            html: emailHtml,
          }),
        });
      } catch (e) {
        console.error("Resend error:", e);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
