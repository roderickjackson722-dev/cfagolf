import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Division mapping
const divisionMap: Record<string, string> = {
  "NCAA I": "D1",
  "NCAA II": "D2",
  "NCAA III": "D3",
  "NAIA": "NAIA",
  "NJCAA": "JUCO",
  "CCCAA": "JUCO",
  "NWAC": "JUCO",
  "USCAA": "JUCO",
  "NCCAA": "JUCO",
  "Indep": "JUCO",
};

// Parse markdown link format: [Name](URL)
function parseMarkdownLink(text: string): { name: string; url: string | null } {
  const match = text.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (match) {
    return { name: match[1], url: match[2] };
  }
  return { name: text, url: null };
}

// Parse team gender from M/W columns
function parseTeamGender(teams5: string, teams6: string): string {
  const hasM = teams5?.trim() === 'M';
  const hasW = teams6?.trim() === 'W';
  
  if (hasM && hasW) return 'Both';
  if (hasM) return 'Men';
  if (hasW) return 'Women';
  return 'Both';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body containing the college data
    const { colleges } = await req.json();

    if (!colleges || !Array.isArray(colleges)) {
      return new Response(
        JSON.stringify({ error: "Invalid data format. Expected { colleges: [...] }" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = {
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Process colleges in batches
    const batchSize = 50;
    for (let i = 0; i < colleges.length; i += batchSize) {
      const batch = colleges.slice(i, i + batchSize);
      
      for (const college of batch) {
        try {
          // Parse the college name and URL
          const { name, url } = parseMarkdownLink(college.name || '');
          
          if (!name || name === 'College/University') {
            results.skipped++;
            continue;
          }

          // Map division
          const rawDivision = college.division || '';
          const division = divisionMap[rawDivision] || 'JUCO';

          // Parse team gender
          const teamGender = parseTeamGender(college.teams5, college.teams6);

          // Prepare college data
          const collegeData = {
            name: name.trim(),
            state: college.state?.trim() || 'Unknown',
            division,
            team_gender: teamGender,
            website_url: url,
            school_size: 'Medium' as const,
            is_hbcu: false,
          };

          // Check if college already exists by name
          const { data: existing } = await supabase
            .from('colleges')
            .select('id')
            .eq('name', collegeData.name)
            .maybeSingle();

          if (existing) {
            // Update existing college
            const { error } = await supabase
              .from('colleges')
              .update({
                state: collegeData.state,
                division: collegeData.division,
                team_gender: collegeData.team_gender,
                website_url: collegeData.website_url,
              })
              .eq('id', existing.id);

            if (error) {
              results.errors.push(`Update error for ${name}: ${error.message}`);
            } else {
              results.updated++;
            }
          } else {
            // Insert new college
            const { error } = await supabase
              .from('colleges')
              .insert(collegeData);

            if (error) {
              results.errors.push(`Insert error for ${name}: ${error.message}`);
            } else {
              results.inserted++;
            }
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          results.errors.push(`Error processing college: ${errorMessage}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: `Processed ${colleges.length} colleges. Inserted: ${results.inserted}, Updated: ${results.updated}, Skipped: ${results.skipped}`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
