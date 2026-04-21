import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function generatePassword(length = 14): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let out = "";
  const rand = new Uint32Array(length);
  crypto.getRandomValues(rand);
  for (let i = 0; i < length; i++) out += chars[rand[i] % chars.length];
  return out;
}

function slugify(name: string, college: string): string {
  return `${name}-${college}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      full_name,
      email,
      college_name,
      title,
      conference,
      photo_url,
      bio,
      recruiting_preferences,
      program_overview,
      is_active = true,
    } = body;

    if (!full_name || !email || !college_name) {
      return new Response(
        JSON.stringify({ error: "full_name, email, college_name required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const tempPassword = generatePassword();

    // Create auth user
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name, role: "coach" },
    });
    if (createErr || !created.user) {
      return new Response(
        JSON.stringify({ error: createErr?.message ?? "Failed to create user" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Assign coach role
    await admin.from("user_roles").insert({
      user_id: created.user.id,
      role: "coach",
    });

    // Create coach profile
    let slug = slugify(full_name, college_name);
    let attempt = 0;
    while (attempt < 5) {
      const { data: existing } = await admin
        .from("coaches")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      attempt++;
      slug = `${slugify(full_name, college_name)}-${attempt + 1}`;
    }

    const { data: coach, error: coachErr } = await admin
      .from("coaches")
      .insert({
        user_id: created.user.id,
        full_name,
        email,
        college_name,
        title,
        conference,
        photo_url,
        bio,
        recruiting_preferences,
        program_overview,
        is_active,
        slug,
      })
      .select()
      .single();

    if (coachErr) {
      // Roll back auth user
      await admin.auth.admin.deleteUser(created.user.id);
      return new Response(JSON.stringify({ error: coachErr.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send welcome email via Resend
    if (RESEND_API_KEY) {
      const loginUrl = `${new URL(req.url).origin.replace(
        /supabase\.co.*/,
        "",
      )}`;
      const siteUrl = "https://www.cfa.golf/coach/login";
      const profileUrl = `https://www.cfa.golf/coach/${slug}`;
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "College Fairway Advisors <contact@cfa.golf>",
            to: [email],
            subject: "Your CFA Coach Portal Access",
            html: `
              <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a;">
                <h2 style="color:#1B4332;">Welcome to College Fairway Advisors</h2>
                <p>Hi ${full_name},</p>
                <p>Your coach profile has been created. You can log in to view junior golfers interested in your program, manage your profile, and reply to messages.</p>
                <div style="background:#F5F1E8;padding:16px;border-radius:8px;margin:16px 0;">
                  <p style="margin:0 0 8px;"><strong>Login URL:</strong> <a href="${siteUrl}" style="color:#1B4332;">${siteUrl}</a></p>
                  <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
                  <p style="margin:0;"><strong>Temporary Password:</strong> <code>${tempPassword}</code></p>
                </div>
                <p>Your public profile: <a href="${profileUrl}" style="color:#1B4332;">${profileUrl}</a></p>
                <p style="font-size:12px;color:#666;">Please change your password after your first login.</p>
                <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />
                <p style="font-size:12px;color:#666;">College Fairway Advisors · contact@cfa.golf</p>
              </div>`,
          }),
        });
      } catch (e) {
        console.error("Resend error", e);
      }
    }

    return new Response(
      JSON.stringify({ coach, temp_password: tempPassword }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
