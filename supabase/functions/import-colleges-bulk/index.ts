import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Division mapping - more comprehensive
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
  if (!text) return { name: '', url: null };
  const match = text.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (match) {
    return { name: match[1].trim(), url: match[2].trim() };
  }
  return { name: text.trim(), url: null };
}

// Parse team gender from M/W columns
function parseTeamGender(teamsM: string, teamsW: string): string {
  const hasM = teamsM?.trim() === 'M';
  const hasW = teamsW?.trim() === 'W';
  
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

    const { colleges, dryRun = false } = await req.json();

    if (!colleges || !Array.isArray(colleges)) {
      return new Response(
        JSON.stringify({ error: "Invalid data format. Expected { colleges: [...] }" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get existing colleges to compare
    const { data: existingColleges } = await supabase
      .from('colleges')
      .select('name, state, team_gender');
    
    const existingSet = new Set(
      existingColleges?.map(c => `${c.name.toLowerCase()}|${c.state?.toLowerCase() || ''}|${c.team_gender?.toLowerCase() || ''}`) || []
    );
    const existingNameSet = new Set(
      existingColleges?.map(c => c.name.toLowerCase()) || []
    );

    const results = {
      total: colleges.length,
      existing: 0,
      toInsert: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
      newColleges: [] as { name: string; state: string; division: string; team_gender: string }[],
    };

    const toInsert: {
      name: string;
      state: string;
      division: string;
      team_gender: string;
      website_url: string | null;
      school_size: string;
      is_hbcu: boolean;
    }[] = [];

    for (const college of colleges) {
      try {
        const { name, url } = parseMarkdownLink(college.name || '');
        
        if (!name || name === 'College/University' || name.includes('City / Campus')) {
          results.skipped++;
          continue;
        }

        const rawDivision = college.division || '';
        const division = divisionMap[rawDivision] || 'JUCO';
        const state = college.state?.trim() || 'Unknown';
        const teamGender = parseTeamGender(college.teamsM, college.teamsW);

        // Check if this exact entry exists (name + state + team_gender)
        const key = `${name.toLowerCase()}|${state.toLowerCase()}|${teamGender.toLowerCase()}`;
        
        if (existingSet.has(key)) {
          results.existing++;
          continue;
        }

        // If name exists but with different gender, we still want to add the new entry
        const collegeData = {
          name: name,
          state: state,
          division: division,
          team_gender: teamGender,
          website_url: url,
          school_size: 'Medium' as const,
          is_hbcu: false,
        };

        toInsert.push(collegeData);
        results.newColleges.push({
          name: collegeData.name,
          state: collegeData.state,
          division: collegeData.division,
          team_gender: collegeData.team_gender,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        results.errors.push(`Error processing: ${errorMessage}`);
      }
    }

    results.toInsert = toInsert.length;

    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          dryRun: true,
          results,
          message: `Dry run complete. Found ${results.toInsert} new colleges to insert, ${results.existing} already exist, ${results.skipped} skipped.`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert in batches
    const batchSize = 50;
    for (let i = 0; i < toInsert.length; i += batchSize) {
      const batch = toInsert.slice(i, i + batchSize);
      const { error } = await supabase.from('colleges').insert(batch);
      
      if (error) {
        results.errors.push(`Batch insert error at ${i}: ${error.message}`);
      } else {
        results.inserted += batch.length;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: `Processed ${colleges.length} colleges. Inserted: ${results.inserted}, Existing: ${results.existing}, Skipped: ${results.skipped}`,
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
