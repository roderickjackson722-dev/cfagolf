const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      return new Response(JSON.stringify({ success: false, error: 'Firecrawl not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const urls = [
      'https://www.wagr.com/mens-events',
      'https://www.wagr.com/womens-events',
    ];

    let totalImported = 0;
    let totalSkipped = 0;
    const errors: string[] = [];

    for (const url of urls) {
      const gender = url.includes('mens') ? 'Men' : 'Women';
      console.log(`Scraping ${url} (${gender})...`);

      try {
        const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url,
            formats: ['markdown'],
            onlyMainContent: true,
            waitFor: 3000,
          }),
        });

        const scrapeData = await scrapeRes.json();
        if (!scrapeRes.ok) {
          errors.push(`Failed to scrape ${url}: ${JSON.stringify(scrapeData)}`);
          continue;
        }

        const markdown = scrapeData?.data?.markdown || scrapeData?.markdown || '';
        console.log(`Got ${markdown.length} chars of markdown for ${gender}`);

        // Parse tournament data from markdown
        // WAGR typically shows tables with tournament name, dates, location, country
        const tournaments = parseTournaments(markdown, gender);
        console.log(`Parsed ${tournaments.length} tournaments for ${gender}`);

        // Filter to US-based tournaments
        const usTournaments = tournaments.filter(t => 
          t.country === 'USA' || t.country === 'United States' || t.country === 'US' ||
          (t.state && t.state.length === 2) // Has a US state code
        );
        console.log(`${usTournaments.length} US-based tournaments for ${gender}`);

        for (const t of usTournaments) {
          // Check if already exists
          const { data: existing } = await supabase
            .from('wagr_tournaments')
            .select('id')
            .eq('tournament_name', t.tournament_name)
            .eq('start_date', t.start_date)
            .eq('gender', gender)
            .maybeSingle();

          if (existing) {
            totalSkipped++;
            continue;
          }

          const { error: insertError } = await supabase
            .from('wagr_tournaments')
            .insert({
              tournament_name: t.tournament_name,
              start_date: t.start_date,
              end_date: t.end_date || null,
              country: 'USA',
              city: t.city || null,
              state: t.state || null,
              course_name: t.course_name || null,
              event_type: t.event_type || 'All Ages',
              gender,
              wagr_url: t.wagr_url || url,
              external_url: t.external_url || null,
              power_rating: t.power_rating || null,
              notes: 'Auto-imported from WAGR website',
            });

          if (insertError) {
            errors.push(`Insert error for ${t.tournament_name}: ${insertError.message}`);
          } else {
            totalImported++;
          }
        }
      } catch (err) {
        errors.push(`Error processing ${url}: ${err.message}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      imported: totalImported,
      skipped: totalSkipped,
      errors,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Scrape error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

interface ParsedTournament {
  tournament_name: string;
  start_date: string;
  end_date?: string;
  city?: string;
  state?: string;
  country: string;
  course_name?: string;
  event_type?: string;
  wagr_url?: string;
  external_url?: string;
  power_rating?: number;
}

function parseTournaments(markdown: string, gender: string): ParsedTournament[] {
  const tournaments: ParsedTournament[] = [];
  const lines = markdown.split('\n');

  // Try to find table rows - WAGR uses markdown tables
  // Look for lines with pipe separators (table rows)
  const tableRows = lines.filter(l => l.includes('|') && !l.match(/^[\s|:-]+$/));

  // Also try line-by-line parsing for non-table formats
  // Pattern: tournament name followed by date and location info
  const datePattern = /(\d{1,2}[\s\/\-]\w+[\s\/\-]\d{2,4}|\w+\s+\d{1,2}[\s,]+\d{4}|\d{4}-\d{2}-\d{2})/;
  
  // US state abbreviations
  const usStates = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];

  if (tableRows.length > 2) {
    // Parse as table
    for (const row of tableRows) {
      const cells = row.split('|').map(c => c.trim()).filter(c => c.length > 0);
      if (cells.length < 2) continue;

      // Skip header rows
      if (cells[0].toLowerCase().includes('event') || cells[0].toLowerCase().includes('tournament') || cells[0].toLowerCase().includes('name')) continue;

      const name = cells[0]?.replace(/\[([^\]]+)\]\([^\)]+\)/, '$1')?.trim();
      if (!name || name.length < 3) continue;

      // Extract URL from markdown link
      const urlMatch = cells[0]?.match(/\[.*?\]\(([^)]+)\)/);
      const tournamentUrl = urlMatch ? urlMatch[1] : undefined;

      // Try to find date in cells
      let startDate = '';
      let endDate = '';
      let location = '';
      let country = '';

      for (const cell of cells.slice(1)) {
        const dm = cell.match(/(\d{4}-\d{2}-\d{2})/);
        if (dm && !startDate) {
          startDate = dm[1];
          // Check for end date in same cell
          const dm2 = cell.match(/(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})/);
          if (dm2) {
            startDate = dm2[1];
            endDate = dm2[2];
          }
          continue;
        }
        // Try common date formats
        const dateMatch2 = cell.match(/(\w+)\s+(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?,?\s*(\d{4})/);
        if (dateMatch2 && !startDate) {
          const month = parseMonth(dateMatch2[1]);
          if (month) {
            startDate = `${dateMatch2[4]}-${month}-${dateMatch2[2].padStart(2, '0')}`;
            if (dateMatch2[3]) {
              endDate = `${dateMatch2[4]}-${month}-${dateMatch2[3].padStart(2, '0')}`;
            }
          }
          continue;
        }
        // Check if it's a country
        if (cell === 'USA' || cell === 'United States' || cell === 'US') {
          country = 'USA';
          continue;
        }
        // Otherwise treat as location
        if (!location && cell.length > 1 && !cell.match(/^\d+$/)) {
          location = cell;
        }
      }

      if (!startDate) {
        // Try to extract date from any cell
        for (const cell of cells) {
          const anyDate = cell.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
          if (anyDate) {
            const year = anyDate[3].length === 2 ? `20${anyDate[3]}` : anyDate[3];
            startDate = `${year}-${anyDate[1].padStart(2, '0')}-${anyDate[2].padStart(2, '0')}`;
            break;
          }
        }
      }

      if (!startDate) continue; // Skip if no date found

      // Parse location for city/state
      let city = '';
      let state = '';
      if (location) {
        const parts = location.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          city = parts[0];
          const stateCandidate = parts[parts.length - 1].toUpperCase();
          if (usStates.includes(stateCandidate)) {
            state = stateCandidate;
            country = 'USA';
          }
        } else {
          // Check if location itself is a state
          const upper = location.toUpperCase().trim();
          if (usStates.includes(upper)) {
            state = upper;
            country = 'USA';
          } else {
            city = location;
          }
        }
      }

      // Try to find power rating
      let powerRating: number | undefined;
      for (const cell of cells) {
        const prMatch = cell.match(/^(\d+\.?\d*)$/);
        if (prMatch) {
          const val = parseFloat(prMatch[1]);
          if (val > 0 && val < 10000) {
            powerRating = val;
          }
        }
      }

      tournaments.push({
        tournament_name: name,
        start_date: startDate,
        end_date: endDate || undefined,
        city,
        state,
        country: country || 'Unknown',
        wagr_url: tournamentUrl,
        power_rating: powerRating,
      });
    }
  }

  // Fallback: line-by-line parsing
  if (tournaments.length === 0) {
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      // Look for lines that might be tournament names (typically bold or heading)
      if (line.startsWith('#') || line.startsWith('**') || (line.length > 5 && !line.startsWith('-') && !line.startsWith('|'))) {
        const name = line.replace(/^#+\s*/, '').replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^\)]+\)/, '$1').trim();
        if (name.length < 3 || name.length > 200) { i++; continue; }

        // Look ahead for date and location
        let startDate = '';
        let city = '';
        let state = '';
        let country = '';
        
        for (let j = i; j < Math.min(i + 5, lines.length); j++) {
          const ctx = lines[j];
          const dateMatch = ctx.match(/(\w+)\s+(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?,?\s*(\d{4})/);
          if (dateMatch && !startDate) {
            const month = parseMonth(dateMatch[1]);
            if (month) {
              startDate = `${dateMatch[4]}-${month}-${dateMatch[2].padStart(2, '0')}`;
            }
          }
          // Look for US state
          for (const st of usStates) {
            if (ctx.includes(`, ${st}`) || ctx.includes(` ${st},`) || ctx.match(new RegExp(`\\b${st}\\b`))) {
              state = st;
              country = 'USA';
            }
          }
        }

        if (startDate && name) {
          tournaments.push({
            tournament_name: name,
            start_date: startDate,
            city,
            state,
            country: country || 'Unknown',
          });
        }
      }
      i++;
    }
  }

  return tournaments;
}

function parseMonth(month: string): string | null {
  const months: Record<string, string> = {
    jan: '01', january: '01',
    feb: '02', february: '02',
    mar: '03', march: '03',
    apr: '04', april: '04',
    may: '05',
    jun: '06', june: '06',
    jul: '07', july: '07',
    aug: '08', august: '08',
    sep: '09', september: '09',
    oct: '10', october: '10',
    nov: '11', november: '11',
    dec: '12', december: '12',
  };
  return months[month.toLowerCase()] || null;
}
