import React from 'react';

/**
 * Converts well-known organization mentions in plain text into clickable
 * external links. Used to surface useful resources (NCAA Eligibility Center,
 * AJGA, WAGR, Khan Academy, etc.) inside lesson and worksheet copy without
 * having to rewrite every data file by hand.
 *
 * Each pattern matches once per paragraph (the first occurrence) to avoid
 * a sea of underlined text.
 */
export interface OrgLink {
  // Regex must use the global flag so we can advance lastIndex while scanning.
  pattern: RegExp;
  url: string;
  label?: string; // optional override; otherwise the matched text is used.
}

export const ORG_LINKS: OrgLink[] = [
  { pattern: /NCAA Eligibility Center/gi, url: 'https://www.eligibilitycenter.org' },
  { pattern: /eligibilitycenter\.org/gi, url: 'https://www.eligibilitycenter.org' },
  { pattern: /Khan Academy/gi, url: 'https://www.khanacademy.org/sat' },
  { pattern: /College Board/gi, url: 'https://www.collegeboard.org' },
  { pattern: /\bAJGA\b/g, url: 'https://www.ajga.org' },
  { pattern: /World Amateur Golf Ranking/gi, url: 'https://www.wagr.com' },
  { pattern: /\bWAGR\b/g, url: 'https://www.wagr.com' },
  { pattern: /Junior Golf Scoreboard/gi, url: 'https://www.juniorgolfscoreboard.com' },
  { pattern: /US Kids|U\.S\. Kids/gi, url: 'https://www.uskidsgolf.com' },
  { pattern: /Hurricane Junior/gi, url: 'https://www.hjgt.org' },
  { pattern: /\bPKBGT\b/g, url: 'https://www.pkbgt.org' },
  { pattern: /\bFCWT\b/g, url: 'https://www.fcwt.org' },
  { pattern: /\bNAIA\b/g, url: 'https://www.naia.org' },
  { pattern: /\bNJCAA\b/g, url: 'https://www.njcaa.org' },
  { pattern: /\bNCAA\b/g, url: 'https://www.ncaa.org' },
];

interface Match {
  start: number;
  end: number;
  url: string;
  text: string;
}

/**
 * Render a plain-text string as React children, replacing the first
 * occurrence of each known organization with an external link.
 */
export function linkifyOrgs(text: string): React.ReactNode {
  if (!text) return text;

  const matches: Match[] = [];
  const used = new Set<string>(); // ensure each pattern matches at most once per paragraph

  for (const { pattern, url } of ORG_LINKS) {
    pattern.lastIndex = 0;
    const m = pattern.exec(text);
    if (!m) continue;
    if (used.has(url)) continue;
    used.add(url);
    matches.push({ start: m.index, end: m.index + m[0].length, url, text: m[0] });
  }

  if (matches.length === 0) return text;

  // Sort by position; drop overlaps (keep earliest).
  matches.sort((a, b) => a.start - b.start);
  const filtered: Match[] = [];
  let cursor = -1;
  for (const m of matches) {
    if (m.start < cursor) continue;
    filtered.push(m);
    cursor = m.end;
  }

  const out: React.ReactNode[] = [];
  let i = 0;
  filtered.forEach((m, idx) => {
    if (m.start > i) out.push(text.slice(i, m.start));
    out.push(
      React.createElement(
        'a',
        {
          key: `lk-${idx}`,
          href: m.url,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-primary underline hover:no-underline',
        },
        m.text,
      ),
    );
    i = m.end;
  });
  if (i < text.length) out.push(text.slice(i));

  return out;
}
