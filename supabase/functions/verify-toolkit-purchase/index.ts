import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID required");

    // Try to get authenticated user (optional for guest purchases)
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } }
      );
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseClient.auth.getUser(token);
      if (userData.user) {
        userId = userData.user.id;
      }
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // For logged-in users, verify ownership
    if (userId && session.metadata?.user_id !== "guest" && session.metadata?.user_id !== userId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403
      });
    }

    if (session.payment_status === "paid") {
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      const metaUserId = session.metadata?.user_id;
      const buyerEmail = session.metadata?.buyer_email || session.customer_details?.email;

      // Record purchase for logged-in users
      if (metaUserId && metaUserId !== "guest") {
        await supabaseAdmin
          .from("digital_product_purchases")
          .upsert({
            user_id: metaUserId,
            product_key: session.metadata?.product_key || "recruiting_toolkit",
            stripe_session_id: sessionId,
            purchase_type: "direct",
            amount_paid: session.amount_total || 9900,
          }, { onConflict: "user_id,product_key" });
      }

      // Send download links email to buyer
      if (buyerEmail) {
        // Get toolkit product file URLs
        const { data: products } = await supabaseAdmin
          .from("digital_products")
          .select("title, route, file_url, product_key")
          .eq("is_active", true)
          .order("sort_order");

        const productLinks = (products || []).map(p => ({
          title: p.title,
          url: `https://cfagolf.lovable.app${p.route}`,
        }));

        // Send email via Resend
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        if (RESEND_API_KEY) {
          const productListHtml = productLinks
            .map(p => `<li style="margin-bottom:8px;"><a href="${p.url}" style="color:#166534;font-weight:600;">${p.title}</a></li>`)
            .join("");

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "CFA Golf <contact@cfa.golf>",
              to: [buyerEmail],
              subject: "Your CFA Recruiting Toolkit — Access Links Inside",
              html: `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
                  <h1 style="color:#166534;font-size:24px;">Thank You for Your Purchase!</h1>
                  <p>You now have lifetime access to the CFA Recruiting Toolkit. Here are your access links:</p>
                  <ul style="padding-left:20px;line-height:2;">${productListHtml}</ul>
                  <p style="margin-top:24px;">To get the most out of the toolkit, we recommend creating a free account at <a href="https://cfagolf.lovable.app/login" style="color:#166534;">cfagolf.lovable.app</a> so your progress is saved.</p>
                  <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />
                  <p style="color:#6b7280;font-size:14px;">Questions? Reply to this email or contact us at contact@cfa.golf</p>
                </div>
              `,
            }),
          });
        }
      }

      return new Response(JSON.stringify({ success: true, paid: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200
      });
    }

    return new Response(JSON.stringify({ success: false, paid: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Verify toolkit error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500
    });
  }
});
