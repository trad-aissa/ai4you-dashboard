// src/pages/api/og.svg.js — dynamic, high-contrast SVG Open Graph social card generator
export function GET({ url }) {
  const params = url.searchParams;
  const title = (params.get('title') || 'The model race, decoded for busy humans').slice(0, 90);
  const tag = (params.get('tag') || 'AI WIRE · FRONTIER MODELS').toUpperCase();
  const kicker = (params.get('kicker') || 'AI NEWS · BENCHMARKS · PRICING').toUpperCase();

  // XML escape
  const esc = (s = '') =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  // Simple title line wrapping
  const words = title.split(' ');
  const lines = [];
  let currentLine = '';
  for (const w of words) {
    if ((currentLine + ' ' + w).length > 34) {
      lines.push(currentLine);
      currentLine = w;
    } else {
      currentLine = currentLine ? currentLine + ' ' + w : w;
    }
  }
  if (currentLine) lines.push(currentLine);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#171614" />
      <stop offset="100%" stop-color="#201F1C" />
    </linearGradient>
    <linearGradient id="line-glow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#346538" />
      <stop offset="50%" stop-color="#93C48E" />
      <stop offset="100%" stop-color="#346538" />
    </linearGradient>
  </defs>

  <!-- Dark Canvas Base -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Subtle Grid Overlay -->
  <g stroke="#2C2B27" stroke-width="1" opacity="0.4">
    <line x1="80" y1="0" x2="80" y2="630" />
    <line x1="1120" y1="0" x2="1120" y2="630" />
    <line x1="0" y1="120" x2="1200" y2="120" />
    <line x1="0" y1="510" x2="1200" y2="510" />
  </g>

  <!-- Brand Mark -->
  <g transform="translate(80,48)">
    <rect width="52" height="52" rx="14" fill="#2C2B27" stroke="#3D3B35" stroke-width="1.5"/>
    <path d="M10 27h7l4-10 6.5 19 4-10h10" fill="none" stroke="#ECEAE5" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="43" cy="25.5" r="2.8" fill="#93C48E"/>
    <text x="70" y="37" font-family="'JetBrains Mono', monospace" font-weight="600" font-size="28" fill="#ECEAE5">ai4you<tspan fill="#A5A29A" font-weight="400"> · the AI wire</tspan></text>
  </g>

  <!-- Category Tag -->
  <g transform="translate(80,165)">
    <rect width="${Math.max(160, tag.length * 10.5 + 24)}" height="32" rx="6" fill="#2C2B27" stroke="#3D3B35"/>
    <circle cx="16" cy="16" r="4" fill="#93C48E" />
    <text x="30" y="21" font-family="'JetBrains Mono', monospace" font-size="12" letter-spacing="1.5" font-weight="600" fill="#93C48E">${esc(tag)}</text>
  </g>

  <!-- Title Text -->
  <g transform="translate(80, 260)">
    ${lines
      .map(
        (line, idx) =>
          `<text x="0" y="${idx * 68}" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="56" fill="#ECEAE5" letter-spacing="-0.02em">${esc(line)}</text>`
      )
      .join('\n    ')}
  </g>

  <!-- Telemetry Waveform -->
  <g transform="translate(80, 480)">
    <rect width="1040" height="56" rx="10" fill="#201F1C" stroke="#2C2B27"/>
    <path d="M20 28h120l16-16 28 32 16-16h220l16-16 28 32 16-16h220l16-16 28 32 16-16h180" fill="none" stroke="url(#line-glow)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="1006" cy="28" r="4" fill="#93C48E"/>
  </g>

  <!-- Footer Kicker -->
  <text x="80" y="585" font-family="'JetBrains Mono', monospace" font-size="14" letter-spacing="2" fill="#75746E">${esc(kicker)} · AI4YOU.SITE</text>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  });
}
