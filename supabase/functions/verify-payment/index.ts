import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check - verify the user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - No valid authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the JWT and get user claims
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("Auth claims error:", claimsError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const authenticatedUserId = claimsData.claims.sub;

    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Authorization check - verify the session belongs to the authenticated user
    const sessionUserId = session.metadata?.user_id;
    if (!sessionUserId || sessionUserId !== authenticatedUserId) {
      console.error("Authorization failed: session user_id mismatch", {
        sessionUserId,
        authenticatedUserId,
      });
      return new Response(
        JSON.stringify({ error: "Forbidden - You are not authorized to verify this payment" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    if (session.payment_status === "paid") {
      const userId = session.metadata?.user_id;
      const referralId = session.metadata?.referral_id;
      const discountApplied = session.metadata?.discount_applied;
      
      if (userId) {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // Idempotency check - verify profile hasn't already been updated
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('has_paid_access')
          .eq('user_id', userId)
          .single();

        if (existingProfile?.has_paid_access) {
          // Already processed - return success without re-processing
          return new Response(JSON.stringify({ 
            success: true, 
            paid: true,
            message: "Payment already verified and access granted!" 
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }

        // Grant access and get updated profile for email
        const { data: updatedProfile } = await supabaseAdmin
          .from('profiles')
          .update({ has_paid_access: true })
          .eq('user_id', userId)
          .select('email, full_name')
          .single();

        // Send welcome email
        try {
          const welcomeEmailResponse = await fetch(
            `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-welcome-email`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
              },
              body: JSON.stringify({
                email: updatedProfile?.email,
                fullName: updatedProfile?.full_name,
              }),
            }
          );
          console.log("Welcome email triggered:", await welcomeEmailResponse.json());
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Don't fail the payment verification if email fails
        }

        // Track referral usage if applicable
        if (referralId && referralId !== "none") {
          // Check if referral use already recorded (idempotency)
          const { data: existingUse } = await supabaseAdmin
            .from('referral_uses')
            .select('id')
            .eq('referral_id', referralId)
            .eq('referred_user_id', userId)
            .single();

          if (!existingUse) {
            // Record the referral use
            await supabaseAdmin
              .from('referral_uses')
              .insert({
                referral_id: referralId,
                referred_user_id: userId,
                payment_amount: session.amount_total || 0,
                discount_applied: parseInt(discountApplied || "0"),
              });

            // Increment the uses count
            await supabaseAdmin.rpc('increment_referral_uses', { referral_id: referralId });
          }
        }

        return new Response(JSON.stringify({ 
          success: true, 
          paid: true,
          message: "Payment verified and access granted!" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: false, 
      paid: false,
      message: "Payment not completed" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Verify payment error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
