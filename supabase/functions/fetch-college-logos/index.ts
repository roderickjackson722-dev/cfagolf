import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(
      url.startsWith("http") ? url : `https://${url}`
    );
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json().catch(() => ({}));
    const batchSize = body.batchSize || 50;
    const offset = body.offset || 0;

    // Get colleges without logos that have website URLs
    const { data: colleges, error: fetchError } = await supabase
      .from("colleges")
      .select("id, name, website_url")
      .is("logo_url", null)
      .not("website_url", "is", null)
      .range(offset, offset + batchSize - 1);

    if (fetchError) {
      throw new Error(`Failed to fetch colleges: ${fetchError.message}`);
    }

    if (!colleges || colleges.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No more colleges to process",
          processed: 0,
          succeeded: 0,
          failed: 0,
          remaining: 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Count total remaining
    const { count: totalRemaining } = await supabase
      .from("colleges")
      .select("id", { count: "exact", head: true })
      .is("logo_url", null)
      .not("website_url", "is", null);

    let succeeded = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const college of colleges) {
      const domain = extractDomain(college.website_url);
      if (!domain) {
        failed++;
        errors.push(`${college.name}: Invalid URL`);
        continue;
      }

      // Try Clearbit Logo API first (high quality), then Google favicon
      const logoSources = [
        `https://logo.clearbit.com/${domain}`,
        `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      ];

      let logoUploaded = false;

      for (const logoUrl of logoSources) {
        try {
          const response = await fetch(logoUrl, {
            headers: { Accept: "image/*" },
          });

          if (!response.ok) continue;

          const contentType = response.headers.get("content-type") || "";
          if (!contentType.startsWith("image/")) continue;

          // Check minimum size (skip tiny favicons from Clearbit 404s)
          const blob = await response.blob();
          if (blob.size < 1000 && logoUrl.includes("clearbit")) continue;

          const ext = contentType.includes("svg")
            ? "svg"
            : contentType.includes("png")
            ? "png"
            : "jpg";
          const fileName = `${college.id}.${ext}`;

          const arrayBuffer = await blob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          const { error: uploadError } = await supabase.storage
            .from("college-logos")
            .upload(fileName, uint8Array, {
              contentType,
              upsert: true,
            });

          if (uploadError) {
            console.error(`Upload error for ${college.name}:`, uploadError);
            continue;
          }

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("college-logos")
            .getPublicUrl(fileName);

          const { error: updateError } = await supabase
            .from("colleges")
            .update({ logo_url: publicUrl })
            .eq("id", college.id);

          if (updateError) {
            console.error(`Update error for ${college.name}:`, updateError);
            continue;
          }

          logoUploaded = true;
          succeeded++;
          console.log(`✓ Logo fetched for ${college.name} from ${domain}`);
          break;
        } catch (err) {
          console.error(`Error fetching logo for ${college.name}:`, err);
        }
      }

      if (!logoUploaded) {
        failed++;
        errors.push(`${college.name}: No logo found at ${domain}`);
      }

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 200));
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: colleges.length,
        succeeded,
        failed,
        remaining: (totalRemaining || 0) - succeeded,
        errors: errors.slice(0, 20),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
