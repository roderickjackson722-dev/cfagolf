const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClippdTeam {
  rank: number;
  name: string;
  logoUrl: string | null;
  division: string;
  gender: string;
}

interface ImportResult {
  success: boolean;
  imported: number;
  updated: number;
  errors: string[];
  teams: ClippdTeam[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { division, gender, dryRun = true } = await req.json();

    if (!division || !gender) {
      return new Response(
        JSON.stringify({ success: false, error: 'Division and gender are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map division names to URL format
    const divisionMap: Record<string, string> = {
      'D1': 'NCAA+Division+I',
      'D2': 'NCAA+Division+II',
      'D3': 'NCAA+Division+III',
      'NAIA': 'NAIA',
      'JUCO': 'NJCAA+Division+I',
      'JUCO2': 'NJCAA+Division+II',
    };

    const divisionParam = divisionMap[division] || division;
    const url = `https://scoreboard.clippd.com/rankings/leaderboard?rankingType=Team&gender=${gender}&division=${encodeURIComponent(divisionParam)}&season=2026`;

    console.log('Scraping URL:', url);

    // Scrape the page for team data
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['html', 'markdown'],
        onlyMainContent: false,
        waitFor: 3000, // Wait for dynamic content
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok) {
      console.error('Firecrawl scrape error:', scrapeData);
      return new Response(
        JSON.stringify({ success: false, error: scrapeData.error || 'Failed to scrape page' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse teams from the scraped data
    const teams = parseTeamsFromHtml(scrapeData.data?.html || scrapeData.html || '', division, gender);

    console.log(`Found ${teams.length} teams for ${gender} ${division}`);

    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          dryRun: true,
          division,
          gender,
          teamsFound: teams.length,
          teams: teams.slice(0, 20), // Return first 20 for preview
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Import to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Database connection not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    let imported = 0;
    let updated = 0;
    const errors: string[] = [];

    // Map our division codes to database enum
    const dbDivision = division === 'JUCO2' ? 'JUCO' : division;
    const teamGender = gender === 'Men' ? 'Men' : 'Women';

    for (const team of teams) {
      try {
        // Check if college exists by name (fuzzy match)
        const { data: existing } = await supabase
          .from('colleges')
          .select('id, name, logo_url, golf_national_ranking')
          .ilike('name', `%${team.name}%`)
          .eq('division', dbDivision)
          .limit(1);

        if (existing && existing.length > 0) {
          // Update existing record
          const updates: Record<string, unknown> = {
            golf_national_ranking: team.rank,
            updated_at: new Date().toISOString(),
          };

          // Only update logo if we have one and they don't
          if (team.logoUrl && !existing[0].logo_url) {
            updates.logo_url = team.logoUrl;
          }

          // Update team_gender to the specific gender from the import
          updates.team_gender = teamGender;

          await supabase
            .from('colleges')
            .update(updates)
            .eq('id', existing[0].id);

          updated++;
        } else {
          // Insert new college
          const { error: insertError } = await supabase
            .from('colleges')
            .insert({
              name: team.name,
              division: dbDivision,
              team_gender: teamGender,
              golf_national_ranking: team.rank,
              logo_url: team.logoUrl,
              state: 'Unknown', // Will need manual update
              school_size: 'Medium', // Default
              is_hbcu: false,
            });

          if (insertError) {
            errors.push(`Failed to insert ${team.name}: ${insertError.message}`);
          } else {
            imported++;
          }
        }
      } catch (err) {
        errors.push(`Error processing ${team.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        division,
        gender,
        teamsFound: teams.length,
        imported,
        updated,
        errors: errors.slice(0, 10), // Return first 10 errors
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseTeamsFromHtml(html: string, division: string, gender: string): ClippdTeam[] {
  const teams: ClippdTeam[] = [];
  
  // Look for team entries in the HTML
  // Clippd typically has team rows with rank, logo, name
  const teamPattern = /<tr[^>]*>[\s\S]*?<td[^>]*>(\d+)<\/td>[\s\S]*?(?:<img[^>]*src="([^"]*)"[^>]*>)?[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<\/tr>/gi;
  
  let match;
  while ((match = teamPattern.exec(html)) !== null) {
    const rank = parseInt(match[1], 10);
    const logoUrl = match[2] || null;
    const name = match[3]?.trim();
    
    if (rank && name && !isNaN(rank)) {
      teams.push({
        rank,
        name: cleanTeamName(name),
        logoUrl: logoUrl ? normalizeLogoUrl(logoUrl) : null,
        division,
        gender,
      });
    }
  }

  // Alternative pattern for different HTML structures
  if (teams.length === 0) {
    // Try to find team names with rankings from simpler patterns
    const simplePattern = /(?:^|\n)\s*(\d{1,3})\s*\n?\s*([A-Z][a-zA-Z\s&'.-]+(?:University|College|State|Tech|A&M|Institute)?)/gm;
    let simpleMatch;
    
    while ((simpleMatch = simplePattern.exec(html)) !== null) {
      const rank = parseInt(simpleMatch[1], 10);
      const name = simpleMatch[2]?.trim();
      
      if (rank && name && rank <= 300) {
        teams.push({
          rank,
          name: cleanTeamName(name),
          logoUrl: null,
          division,
          gender,
        });
      }
    }
  }

  // Dedupe and sort by rank
  const seen = new Set<string>();
  return teams
    .filter(t => {
      const key = t.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.rank - b.rank);
}

function cleanTeamName(name: string): string {
  return name
    .replace(/\s+/g, ' ')
    .replace(/^\d+\s*/, '')
    .trim();
}

function normalizeLogoUrl(url: string): string {
  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  if (!url.startsWith('http')) {
    return 'https://scoreboard.clippd.com' + url;
  }
  return url;
}
