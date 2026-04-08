import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PROGRAMS: Record<string, { priceId: string; amount: number; name: string; mode: "payment" | "subscription" }> = {
  consulting: {
    priceId: "price_1TAf5QLXW44Q7xfEt31BZ91E",
    amount: 249900, // $2,499
    name: "CFA Golf 1-on-1 Consulting Program",
    mode: "payment",
  },
  digital: {
    priceId: "price_1TK1IyLXW44Q7xfEFeqlEVdj",
    amount: 29900, // $299/year
    name: "CFA Golf Annual Portal Membership",
    mode: "payment",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { promoCode, referralCode, programType } = await req.json();
    
    // Select program (default to consulting)
    const selectedProgram = PROGRAMS[programType as keyof typeof PROGRAMS] || PROGRAMS.consulting;
    const MEMBERSHIP_PRICE_ID = selectedProgram.priceId;
    const MEMBERSHIP_AMOUNT = selectedProgram.amount;
    const PROGRAM_NAME = selectedProgram.name;
    const CHECKOUT_MODE = selectedProgram.mode;
    
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check for promo code from database
    const normalizedPromoCode = promoCode?.toUpperCase()?.trim();
    let promoConfig: { discount: number; name: string } | null = null;
    let promoId: string | null = null;
    if (normalizedPromoCode) {
      const { data: promoData } = await supabaseAdmin
        .from('promo_codes')
        .select('id, discount_percent, name, max_uses, uses_count')
        .eq('code', normalizedPromoCode)
        .eq('is_active', true)
        .maybeSingle();
      
      if (promoData) {
        if (!promoData.max_uses || promoData.uses_count < promoData.max_uses) {
          promoConfig = { discount: promoData.discount_percent, name: promoData.name };
          promoId = promoData.id;
        }
      }
    }

    // Check for referral code
    let referralData: { id: string; discount_percent: number; referrer_user_id: string } | null = null;
    if (referralCode && !promoConfig) {
      const normalizedReferralCode = referralCode.toUpperCase().trim();
      const { data } = await supabaseAdmin
        .from('referrals')
        .select('id, discount_percent, referrer_user_id')
        .eq('referral_code', normalizedReferralCode)
        .eq('is_active', true)
        .maybeSingle();
      
      if (data && data.referrer_user_id !== user.id) {
        referralData = data;
      }
    }

    // Determine discount
    let discountPercent = 0;
    let discountName = "";
    
    if (promoConfig) {
      discountPercent = promoConfig.discount;
      discountName = promoConfig.name;
    } else if (referralData) {
      discountPercent = referralData.discount_percent;
      discountName = `Referral Discount - ${discountPercent}% Off`;
    }

    // If 100% discount, grant access immediately without payment
    if (discountPercent === 100) {
      await supabaseAdmin
        .from('profiles')
        .update({ has_paid_access: true })
        .eq('user_id', user.id);

      return new Response(JSON.stringify({ 
        success: true, 
        freeAccess: true,
        message: "Access granted with promo code!" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Calculate discounted amount
    const discountedAmount = discountPercent > 0 
      ? Math.round(MEMBERSHIP_AMOUNT * (1 - discountPercent / 100))
      : MEMBERSHIP_AMOUNT;

    // Build checkout config
    const checkoutConfig: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      mode: CHECKOUT_MODE,
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout?plan=${programType}`,
      metadata: {
        user_id: user.id,
        program_type: programType || "consulting",
        promo_code: normalizedPromoCode || "none",
        referral_id: referralData?.id || "none",
        discount_applied: discountedAmount < MEMBERSHIP_AMOUNT ? (MEMBERSHIP_AMOUNT - discountedAmount).toString() : "0",
      },
    };

    // Only add Klarna for one-time payments (not subscriptions)
    if (CHECKOUT_MODE === "payment") {
      checkoutConfig.payment_method_types = ["card", "klarna"];
    }

    if (discountPercent > 0) {
      if (CHECKOUT_MODE === "subscription") {
        // For subscriptions with discount, create a Stripe coupon
        const coupon = await stripe.coupons.create({
          percent_off: discountPercent,
          duration: "once",
          name: discountName,
        });
        checkoutConfig.discounts = [{ coupon: coupon.id }];
        checkoutConfig.line_items = [
          {
            price: MEMBERSHIP_PRICE_ID,
            quantity: 1,
          },
        ];
      } else {
        // For one-time payments with discount, use custom price_data
        checkoutConfig.line_items = [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${PROGRAM_NAME} (${discountPercent}% Off)`,
                description: discountName,
              },
              unit_amount: discountedAmount,
            },
            quantity: 1,
          },
        ];
      }
    } else {
      // Full price
      checkoutConfig.line_items = [
        {
          price: MEMBERSHIP_PRICE_ID,
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(checkoutConfig);

    // Increment promo code usage count
    if (promoId) {
      await supabaseAdmin.rpc('increment_promo_uses' as any, { promo_id: promoId });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
