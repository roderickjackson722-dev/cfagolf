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
    // Try the teams listing page which may be more statically rendered
    const url = `https://scoreboard.clippd.com/teams?gender=${gender}&division=${encodeURIComponent(divisionParam)}`;

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
        formats: ['markdown', 'html', 'rawHtml'],
        onlyMainContent: false,
        waitFor: 8000, // Wait longer for dynamic content
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
    const rawHtml = scrapeData.data?.rawHtml || scrapeData.rawHtml || '';
    
    // Use the longest content available
    const content = rawHtml.length > html.length ? rawHtml : html;
    
    console.log('Content lengths - markdown:', markdown.length, 'html:', html.length, 'rawHtml:', rawHtml.length);
    
    // Check if content contains team-related keywords
    const hasTeamData = content.includes('team') || content.includes('Team') || 
                        content.includes('University') || content.includes('College');
    console.log('Has team-related content:', hasTeamData);

    // Parse teams from markdown first (more reliable for table data), fall back to HTML
    const teams = parseTeamsFromMarkdown(markdown, division, gender).length > 0 
      ? parseTeamsFromMarkdown(markdown, division, gender)
      : parseTeamsFromHtml(content, division, gender);

    console.log(`Found ${teams.length} teams for ${gender} ${division}`);

    if (dryRun) {
      // Sample some HTML to see table body structure
      const tbodyIndex = content.indexOf('<tbody');
      const htmlSample = tbodyIndex >= 0 
        ? content.substring(tbodyIndex, tbodyIndex + 3000)
        : content.substring(0, 2000);
      
      return new Response(
        JSON.stringify({
          success: true,
          dryRun: true,
          division,
          gender,
          teamsFound: teams.length,
          teams: teams.slice(0, 20), // Return first 20 for preview
          debug: {
            markdownLength: markdown.length,
            htmlLength: html.length,
            rawHtmlLength: rawHtml.length,
            hasTeamData,
            htmlSample,
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

function parseTeamsFromMarkdown(markdown: string, division: string, gender: string): ClippdTeam[] {
  const teams: ClippdTeam[] = [];
  
  // Split by lines and look for rank + team name patterns
  const lines = markdown.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Pattern 1: Table row format "| 1 | Team Name | ..."
    const tableMatch = line.match(/^\|?\s*(\d{1,3})\s*\|?\s*([A-Z][a-zA-Z\s&'.-]+)/);
    if (tableMatch) {
      const rank = parseInt(tableMatch[1], 10);
      const name = tableMatch[2].trim();
      if (rank && name && rank <= 300) {
        teams.push({
          rank,
          name: cleanTeamName(name),
          logoUrl: null,
          division,
          gender,
        });
        continue;
      }
    }
    
    // Pattern 2: Simple numbered list "1. Team Name" or "1 Team Name"
    const listMatch = line.match(/^(\d{1,3})[\.\)\s]+([A-Z][a-zA-Z\s&'.-]+(?:University|College|State|Tech|A&M|Institute)?)/);
    if (listMatch) {
      const rank = parseInt(listMatch[1], 10);
      const name = listMatch[2].trim();
      if (rank && name && rank <= 300) {
        teams.push({
          rank,
          name: cleanTeamName(name),
          logoUrl: null,
          division,
          gender,
        });
        continue;
      }
    }
    
    // Pattern 3: Look for team name on a line following a rank number
    if (/^\d{1,3}$/.test(line)) {
      const rank = parseInt(line, 10);
      const nextLine = lines[i + 1]?.trim();
      if (rank <= 300 && nextLine && /^[A-Z]/.test(nextLine)) {
        // Check if next line looks like a team name (contains University, College, etc. or starts with capital)
        const nameLine = nextLine.replace(/^\[.*?\]\(.*?\)\s*/, ''); // Remove markdown links
        if (nameLine.length > 3 && nameLine.length < 100) {
          teams.push({
            rank,
            name: cleanTeamName(nameLine),
            logoUrl: null,
            division,
            gender,
          });
          i++; // Skip next line since we used it
          continue;
        }
      }
    }
  }
  
  // Extract logo URLs from markdown if present
  const logoPattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let logoMatch;
  const logoMap: Record<string, string> = {};
  
  while ((logoMatch = logoPattern.exec(markdown)) !== null) {
    const altText = logoMatch[1];
    const logoUrl = logoMatch[2];
    if (altText && logoUrl) {
      logoMap[altText.toLowerCase()] = normalizeLogoUrl(logoUrl);
    }
  }
  
  // Try to match logos to teams
  for (const team of teams) {
    const teamLower = team.name.toLowerCase();
    for (const [alt, url] of Object.entries(logoMap)) {
      if (teamLower.includes(alt) || alt.includes(teamLower.split(' ')[0])) {
        team.logoUrl = url;
        break;
      }
    }
  }

  // Dedupe and sort
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

function parseTeamsFromHtml(html: string, division: string, gender: string): ClippdTeam[] {
  const teams: ClippdTeam[] = [];
  
  // Pattern for table rows with ranking data
  // Looking for patterns like: <td>1</td> ... <img src="logo.png"> ... team name
  
  // First, try to find all table rows
  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  
  while ((rowMatch = rowPattern.exec(html)) !== null) {
    const row = rowMatch[1];
    
    // Extract cells from the row
    const cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells: string[] = [];
    let cellMatch;
    
    while ((cellMatch = cellPattern.exec(row)) !== null) {
      cells.push(cellMatch[1]);
    }
    
    if (cells.length >= 2) {
      // First cell should be rank
      const rankText = cells[0].replace(/<[^>]*>/g, '').trim();
      const rank = parseInt(rankText, 10);
      
      if (rank && !isNaN(rank) && rank <= 300) {
        // Find team name - usually in second cell, possibly with link
        let teamName = '';
        let logoUrl: string | null = null;
        
        for (const cell of cells) {
          // Look for logo image
          const imgMatch = cell.match(/<img[^>]*src=["']([^"']+)["']/i);
          if (imgMatch && !logoUrl) {
            logoUrl = normalizeLogoUrl(imgMatch[1]);
          }
          
          // Look for team name (in link or plain text)
          const linkMatch = cell.match(/<a[^>]*>([^<]+)<\/a>/i);
          if (linkMatch && !teamName) {
            teamName = linkMatch[1].trim();
          }
          
          // Plain text team name
          if (!teamName) {
            const plainText = cell.replace(/<[^>]*>/g, '').trim();
            if (plainText && plainText.length > 3 && /^[A-Z]/.test(plainText) && !/^\d+$/.test(plainText)) {
              // Check if this looks like a team name
              if (plainText.includes('University') || plainText.includes('College') || 
                  plainText.includes('State') || plainText.includes('Tech') || 
                  plainText.length > 5) {
                teamName = plainText;
              }
            }
          }
        }
        
        if (teamName) {
          teams.push({
            rank,
            name: cleanTeamName(teamName),
            logoUrl,
            division,
            gender,
          });
        }
      }
    }
  }
  
  // If table parsing didn't work, try a more aggressive pattern
  if (teams.length === 0) {
    // Match patterns like: >1</td>...<img src="logo">...</a>Team Name</a>
    const aggressivePattern = />(\d{1,3})<\/(?:td|span|div)>[\s\S]{0,500}?(?:<img[^>]*src=["']([^"']+)["'][^>]*>)?[\s\S]{0,200}?<a[^>]*>([^<]+)<\/a>/gi;
    let aggressiveMatch;
    
    while ((aggressiveMatch = aggressivePattern.exec(html)) !== null) {
      const rank = parseInt(aggressiveMatch[1], 10);
      const logoUrl = aggressiveMatch[2] ? normalizeLogoUrl(aggressiveMatch[2]) : null;
      const name = aggressiveMatch[3]?.trim();
      
      if (rank && name && rank <= 300) {
        teams.push({
          rank,
          name: cleanTeamName(name),
          logoUrl,
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
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove markdown links
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
