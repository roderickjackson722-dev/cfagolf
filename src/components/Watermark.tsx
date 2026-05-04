import { useAuth } from '@/hooks/useAuth';

/**
 * Diagonal repeating watermark overlay showing the logged-in user's name + email.
 * Renders fixed across the viewport, behind interactive UI but visible in screenshots.
 *
 * Usage: place once at the top of an authenticated layout/page.
 */
export function Watermark() {
  const { user, profile } = useAuth();

  if (!user) return null;

  const name = profile?.full_name?.trim() || '';
  const email = profile?.email || user.email || '';
  const label = [name, email].filter(Boolean).join(' • ');
  if (!label) return null;

  // Encode the label into an SVG data URL that tiles diagonally.
  const tileWidth = 420;
  const tileHeight = 220;
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${tileWidth}' height='${tileHeight}' viewBox='0 0 ${tileWidth} ${tileHeight}'>
      <g transform='rotate(-30 ${tileWidth / 2} ${tileHeight / 2})' fill='hsl(152, 45%, 22%)' fill-opacity='0.08' font-family='Inter, sans-serif' font-size='14' font-weight='500'>
        <text x='${tileWidth / 2}' y='${tileHeight / 2}' text-anchor='middle'>${escapeXml(label)}</text>
        <text x='${tileWidth / 2}' y='${tileHeight / 2 + 22}' text-anchor='middle' font-size='11'>CFA Confidential — Do Not Share</text>
      </g>
    </svg>
  `;
  const dataUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        backgroundImage: dataUrl,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'multiply',
      }}
    />
  );
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
