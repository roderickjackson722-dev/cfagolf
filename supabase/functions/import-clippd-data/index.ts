const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClippdTeam {
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

    // Map division names to URL format - use the teams listing page
    const divisionMap: Record<string, string> = {
      'D1': 'NCAA+Division+I',
      'D2': 'NCAA+Division+II',
      'D3': 'NCAA+Division+III',
      'NAIA': 'NAIA',
      'JUCO': 'NJCAA+Division+I',
      'JUCO2': 'NJCAA+Division+II',
    };

    const divisionParam = divisionMap[division] || division;
    // Use the teams listing page which shows all teams with logos
    const url = `https://scoreboard.clippd.com/teams?gender=${gender}&division=${encodeURIComponent(divisionParam)}`;

    console.log('Scraping URL:', url);

    // Scrape the page for team data - focus on getting team names and logos
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html', 'links'],
        onlyMainContent: false,
        waitFor: 5000,
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

    const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    const html = scrapeData.data?.html || scrapeData.html || '';
    
    console.log('Content lengths - markdown:', markdown.length, 'html:', html.length);
    
    // Parse teams - just looking for team names and logos, no rankings needed
    const teams = parseTeamsFromContent(markdown, html, division, gender);

    console.log(`Found ${teams.length} teams for ${gender} ${division}`);

    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          dryRun: true,
          division,
          gender,
          teamsFound: teams.length,
          teams: teams.slice(0, 30), // Return first 30 for preview
          debug: {
            markdownLength: markdown.length,
            htmlLength: html.length,
            sampleContent: markdown.substring(0, 1500),
          }
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
          .select('id, name, logo_url')
          .ilike('name', `%${team.name}%`)
          .eq('division', dbDivision)
          .limit(1);

        if (existing && existing.length > 0) {
          // Update existing record - only update logo if we have one and they don't
          const updates: Record<string, unknown> = {
            team_gender: teamGender,
            updated_at: new Date().toISOString(),
          };

          if (team.logoUrl && !existing[0].logo_url) {
            updates.logo_url = team.logoUrl;
          }

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
        errors: errors.slice(0, 10),
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

function parseTeamsFromContent(markdown: string, html: string, division: string, gender: string): ClippdTeam[] {
  const teams: ClippdTeam[] = [];
  const logoMap: Record<string, string> = {};
  
  // Extract all logo URLs from markdown images
  const imgPattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let imgMatch;
  while ((imgMatch = imgPattern.exec(markdown)) !== null) {
    const altText = imgMatch[1]?.trim();
    const logoUrl = imgMatch[2];
    if (altText && logoUrl && logoUrl.includes('logo')) {
      logoMap[altText.toLowerCase()] = normalizeLogoUrl(logoUrl);
    }
  }
  
  // Extract logos from HTML img tags
  const htmlImgPattern = /<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/gi;
  let htmlImgMatch;
  while ((htmlImgMatch = htmlImgPattern.exec(html)) !== null) {
    const logoUrl = htmlImgMatch[1];
    const altText = htmlImgMatch[2]?.trim();
    if (altText && logoUrl) {
      logoMap[altText.toLowerCase()] = normalizeLogoUrl(logoUrl);
    }
  }
  
  // Also try reversed order (alt before src)
  const htmlImgPattern2 = /<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']+)["']/gi;
  while ((htmlImgMatch = htmlImgPattern2.exec(html)) !== null) {
    const altText = htmlImgMatch[1]?.trim();
    const logoUrl = htmlImgMatch[2];
    if (altText && logoUrl) {
      logoMap[altText.toLowerCase()] = normalizeLogoUrl(logoUrl);
    }
  }

  console.log('Found logo URLs:', Object.keys(logoMap).length);
  
  // Extract team names from links - teams page should have links to each team
  const linkPattern = /\[([^\]]+)\]\(\/teams\/([^)]+)\)/g;
  let linkMatch;
  while ((linkMatch = linkPattern.exec(markdown)) !== null) {
    const name = linkMatch[1]?.trim();
    if (name && isValidTeamName(name)) {
      const cleanName = cleanTeamName(name);
      const logoUrl = findLogoForTeam(cleanName, logoMap);
      teams.push({
        name: cleanName,
        logoUrl,
        division,
        gender,
      });
    }
  }
  
  // Also look for team names in HTML anchors
  const htmlLinkPattern = /<a[^>]*href=["'][^"']*\/teams\/[^"']*["'][^>]*>([^<]+)<\/a>/gi;
  let htmlLinkMatch;
  while ((htmlLinkMatch = htmlLinkPattern.exec(html)) !== null) {
    const name = htmlLinkMatch[1]?.trim();
    if (name && isValidTeamName(name)) {
      const cleanName = cleanTeamName(name);
      // Check if we already have this team
      if (!teams.some(t => t.name.toLowerCase() === cleanName.toLowerCase())) {
        const logoUrl = findLogoForTeam(cleanName, logoMap);
        teams.push({
          name: cleanName,
          logoUrl,
          division,
          gender,
        });
      }
    }
  }
  
  // Look for university/college names in content
  const lines = markdown.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // Match lines that look like school names
    if (isValidTeamName(trimmed) && trimmed.length < 80) {
      const cleanName = cleanTeamName(trimmed);
      if (!teams.some(t => t.name.toLowerCase() === cleanName.toLowerCase())) {
        const logoUrl = findLogoForTeam(cleanName, logoMap);
        teams.push({
          name: cleanName,
          logoUrl,
          division,
          gender,
        });
      }
    }
  }

  // Dedupe by name
  const seen = new Set<string>();
  return teams.filter(t => {
    const key = t.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isValidTeamName(name: string): boolean {
  if (!name || name.length < 3 || name.length > 100) return false;
  
  // Must contain University, College, State, Tech, or other school indicators
  const schoolIndicators = [
    'university', 'college', 'state', 'tech', 'institute',
    'a&m', 'polytechnic', 'academy'
  ];
  
  const lower = name.toLowerCase();
  return schoolIndicators.some(ind => lower.includes(ind));
}

function findLogoForTeam(teamName: string, logoMap: Record<string, string>): string | null {
  const teamLower = teamName.toLowerCase();
  
  // Try exact match first
  if (logoMap[teamLower]) {
    return logoMap[teamLower];
  }
  
  // Try partial matches
  for (const [alt, url] of Object.entries(logoMap)) {
    // Check if the alt text contains part of the team name or vice versa
    const teamWords = teamLower.split(' ').filter(w => w.length > 3);
    const altWords = alt.split(' ').filter(w => w.length > 3);
    
    const hasMatch = teamWords.some(tw => alt.includes(tw)) || 
                     altWords.some(aw => teamLower.includes(aw));
    
    if (hasMatch) {
      return url;
    }
  }
  
  return null;
}

function cleanTeamName(name: string): string {
  return name
    .replace(/\s+/g, ' ')
    .replace(/^\d+[\.\)\s]*/g, '') // Remove leading numbers
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove markdown links
    .replace(/[*_]/g, '') // Remove markdown formatting
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
