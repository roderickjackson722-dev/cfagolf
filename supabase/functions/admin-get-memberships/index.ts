import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
  customer: string | null;
  created: number;
  description: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin access
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      throw new Error("Admin access required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Fetch recent payments
    const payments = await stripe.paymentIntents.list({
      limit: 100,
    });

    // Fetch all customers with their payment info
    const customers = await stripe.customers.list({
      limit: 100,
    });

    // Build membership data
    const membershipData = [];

    for (const customer of customers.data) {
      // Get successful payments for this customer
      const customerPayments = (payments.data as unknown as PaymentIntent[]).filter(
        (p: PaymentIntent) => p.customer === customer.id && p.status === 'succeeded'
      );

      // Get profile from Supabase if exists
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('full_name, has_paid_access, created_at')
        .eq('email', customer.email)
        .maybeSingle();

      membershipData.push({
        id: customer.id,
        email: customer.email,
        name: customer.name || profile?.full_name || 'Unknown',
        created: customer.created,
        hasPaidAccess: profile?.has_paid_access || false,
        totalPayments: customerPayments.length,
        totalAmount: customerPayments.reduce((sum: number, p: PaymentIntent) => sum + (p.amount || 0), 0) / 100,
        lastPayment: customerPayments.length > 0 
          ? {
              amount: customerPayments[0].amount / 100,
              date: customerPayments[0].created,
              status: customerPayments[0].status,
            }
          : null,
        payments: customerPayments.slice(0, 5).map((p: PaymentIntent) => ({
          id: p.id,
          amount: p.amount / 100,
          date: p.created,
          status: p.status,
          description: p.description || 'Membership Payment',
        })),
      });
    }

    // Sort by most recent
    membershipData.sort((a, b) => b.created - a.created);

    // Get summary stats
    const allPayments = payments.data as unknown as PaymentIntent[];
    const summary = {
      totalCustomers: customers.data.length,
      totalRevenue: allPayments
        .filter((p: PaymentIntent) => p.status === 'succeeded')
        .reduce((sum: number, p: PaymentIntent) => sum + (p.amount || 0), 0) / 100,
      activeMembers: membershipData.filter((m) => m.hasPaidAccess).length,
      recentPayments: allPayments.filter((p: PaymentIntent) => p.status === 'succeeded').length,
    };

    return new Response(
      JSON.stringify({ memberships: membershipData, summary }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Admin memberships error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
