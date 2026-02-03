import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Parse team gender from Teams column
function parseTeamGender(teamsColumn: string): string {
  const hasM = teamsColumn.includes('M');
  const hasW = teamsColumn.includes('W');
  
  if (hasM && hasW) return 'Both';
  if (hasM) return 'Men';
  if (hasW) return 'Women';
  return 'None';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { csvData } = await req.json();

    if (!csvData || typeof csvData !== 'string') {
      return new Response(
        JSON.stringify({ error: "Invalid data format. Expected { csvData: '...' }" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse CSV data
    const lines = csvData.split('\n').filter(line => line.trim());
    const colleges: { name: string; state: string; teamGender: string }[] = [];

    for (let i = 1; i < lines.length; i++) { // Skip header
      const line = lines[i];
      // Handle CSV with commas in values (shouldn't be an issue here)
      const parts = line.split(',');
      
      if (parts.length >= 5) {
        const name = parts[0]?.trim();
        const state = parts[2]?.trim();
        const teamsColumn = parts[4]?.trim() + (parts[5]?.trim() || '');
        
        if (name && name !== 'College/University' && !name.includes('City / Campus')) {
          colleges.push({
            name,
            state,
            teamGender: parseTeamGender(teamsColumn)
          });
        }
      }
    }

    // Get all colleges from database
    const { data: dbColleges, error: fetchError } = await supabase
      .from('colleges')
      .select('id, name, state, team_gender');

    if (fetchError) {
      throw new Error(`Failed to fetch colleges: ${fetchError.message}`);
    }

    const results = {
      total: colleges.length,
      matched: 0,
      updated: 0,
      notFound: [] as string[],
      updates: [] as { name: string; oldGender: string; newGender: string }[],
    };

    // Create a map of CSV colleges by name (lowercase) for quick lookup
    const csvMap = new Map<string, { name: string; state: string; teamGender: string }[]>();
    for (const college of colleges) {
      const key = college.name.toLowerCase();
      if (!csvMap.has(key)) {
        csvMap.set(key, []);
      }
      csvMap.get(key)!.push(college);
    }

    // Update each database college based on CSV data
    for (const dbCollege of dbColleges || []) {
      const key = dbCollege.name.toLowerCase();
      const csvMatches = csvMap.get(key);

      if (csvMatches && csvMatches.length > 0) {
        // Find exact match by state, or use first match
        let match = csvMatches.find(c => c.state.toLowerCase() === dbCollege.state?.toLowerCase());
        if (!match) {
          match = csvMatches[0];
        }

        results.matched++;

        // Only update if gender is different
        if (dbCollege.team_gender !== match.teamGender) {
          const { error: updateError } = await supabase
            .from('colleges')
            .update({ team_gender: match.teamGender })
            .eq('id', dbCollege.id);

          if (!updateError) {
            results.updated++;
            results.updates.push({
              name: dbCollege.name,
              oldGender: dbCollege.team_gender,
              newGender: match.teamGender
            });
          }
        }
      } else {
        results.notFound.push(dbCollege.name);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: `Processed ${results.total} colleges from CSV. Matched: ${results.matched}, Updated: ${results.updated}`,
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
