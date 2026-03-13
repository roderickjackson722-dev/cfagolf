import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check the user's profile to see their program type
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('program_type, has_paid_access')
      .eq('user_id', user.id)
      .single();

    logStep("Profile fetched", { programType: profile?.program_type, hasPaidAccess: profile?.has_paid_access });

    // Only check Stripe subscription for digital members
    // Consulting members have one-time payment — their access doesn't expire
    if (profile?.program_type !== 'digital') {
      logStep("Non-digital member, skipping subscription check");
      return new Response(JSON.stringify({
        subscribed: profile?.has_paid_access ?? false,
        program_type: profile?.program_type || 'consulting',
        subscription_type: 'one_time',
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      // If they had access but no active subscription, revoke it
      if (profile?.has_paid_access) {
        await supabaseClient
          .from('profiles')
          .update({ has_paid_access: false })
          .eq('user_id', user.id);
        logStep("Revoked access - no Stripe customer");
      }
      return new Response(JSON.stringify({
        subscribed: false,
        program_type: 'digital',
        subscription_type: 'subscription',
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });

      // Ensure access is granted
      if (!profile?.has_paid_access) {
        await supabaseClient
          .from('profiles')
          .update({ has_paid_access: true })
          .eq('user_id', user.id);
        logStep("Granted access for active subscription");
      }
    } else {
      logStep("No active subscription found");
      // Revoke access if subscription lapsed
      if (profile?.has_paid_access) {
        await supabaseClient
          .from('profiles')
          .update({ has_paid_access: false })
          .eq('user_id', user.id);
        logStep("Revoked access - subscription lapsed");
      }
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      program_type: 'digital',
      subscription_type: 'subscription',
      subscription_end: subscriptionEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
