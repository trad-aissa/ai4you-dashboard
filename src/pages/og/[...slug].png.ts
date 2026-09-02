// ============================================================
// ai4you.site — one social card per page, rendered at BUILD time.
//
// Why not a serverless function: crawlers only ever ask for a fixed set of
// URLs whose titles are known at build, so rendering them ahead of time keeps
// the site fully static — no adapter, no cold start, no per-request cost, and
// the PNGs come off the CDN. satori and resvg are devDependencies; nothing
// extra ships at runtime.
//
// Copy lives in src/data/og-cards.js. A page missing from there is not
// rendered here either, and Seo.astro falls back to /og-default.png.
// ============================================================
import { readFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { OG_CARDS, ogSlug } from '../../data/og-cards.js';

const font = (p: string) => readFileSync(new URL(`../../../node_modules/${p}`, import.meta.url));
const SERIF = font('@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff');
const MONO = font('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff');

// Brand tokens, matching src/styles/site.css dark theme.
const INK = '#ECEAE5', MUTED = '#A5A29A', FAINT = '#75746E';
const SURFACE = '#201F1C', LINE = '#2C2B27', GREEN = '#93C48E';

/** Minimal createElement — satori takes React-shaped objects, not React.
 *  satori is flexbox-only and rejects any multi-child div without an explicit
 *  display, so default every node to flex rather than remembering each time. */
const svgEl = (type: string, attrs: Record<string, unknown>, ...kids: unknown[]): any => ({
  type,
  props: { ...attrs, children: kids.flat().filter(Boolean) },
  key: null,
});

const h = (type: string, style: Record<string, unknown>, ...kids: unknown[]): any => {
  const children = kids.flat().filter((k) => k !== null && k !== undefined);
  return {
    type,
    props: { style: { display: 'flex', ...style }, children: children.length === 1 ? children[0] : children },
    key: null,
  };
};

function card(title: string, tag: string) {
  return h('div', {
    width: 1200, height: 630, display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', padding: '64px 80px',
    backgroundColor: '#171614',
    backgroundImage: 'linear-gradient(135deg, #171614 0%, #201F1C 100%)',
    fontFamily: 'JetBrains Mono',
  },
    // masthead
    h('div', { display: 'flex', alignItems: 'center' },
      // the same mark as the masthead in Layout.astro
      svgEl('svg', { width: 52, height: 52, viewBox: '0 0 64 64' },
        svgEl('rect', { width: 64, height: 64, rx: 15, fill: LINE, stroke: '#3D3B35', strokeWidth: 1.5 }),
        svgEl('path', {
          d: 'M10 33h9l5-13 8 24 5-13h13', fill: 'none', stroke: INK,
          strokeWidth: 4.4, strokeLinecap: 'round', strokeLinejoin: 'round',
        }),
        svgEl('circle', { cx: 53, cy: 31, r: 2.8, fill: GREEN }),
      ),
      h('div', { display: 'flex', marginLeft: 20, fontSize: 26, color: INK }, 'ai4you'),
      h('div', { display: 'flex', marginLeft: 10, fontSize: 26, color: FAINT }, '· the AI wire'),
    ),
    // tag + title
    h('div', { display: 'flex', flexDirection: 'column' },
      h('div', {
        display: 'flex', alignItems: 'center', alignSelf: 'flex-start',
        backgroundColor: SURFACE, border: `1px solid ${LINE}`,
        borderRadius: 6, padding: '8px 16px 8px 12px', marginBottom: 28,
      },
        h('div', { width: 8, height: 8, borderRadius: 4, backgroundColor: GREEN, marginRight: 10 }),
        h('div', { display: 'flex', fontSize: 15, color: GREEN, letterSpacing: 1.4 }, tag.toUpperCase()),
      ),
      h('div', {
        display: 'flex', fontFamily: 'Instrument Serif',
        fontSize: title.length > 46 ? 62 : 76, lineHeight: 1.1,
        color: INK, letterSpacing: '-0.02em', maxWidth: 1000,
      }, title),
    ),
    // baseline
    h('div', { display: 'flex', flexDirection: 'column' },
      h('div', { display: 'flex', width: 1040, height: 2, backgroundColor: LINE, marginBottom: 22 }),
      h('div', { display: 'flex', justifyContent: 'space-between', width: 1040 },
        h('div', { display: 'flex', fontSize: 17, color: MUTED, letterSpacing: 1.6 }, 'AI4YOU.SITE'),
        h('div', { display: 'flex', fontSize: 17, color: FAINT, letterSpacing: 1.6 }, 'INDEPENDENT · SOURCED'),
      ),
    ),
  );
}

export function getStaticPaths() {
  return Object.entries(OG_CARDS).map(([path, copy]) => ({
    params: { slug: ogSlug(path) },
    props: copy,
  }));
}

export async function GET({ props }: { props: { title: string; tag: string } }) {
  const svg = await satori(card(props.title, props.tag), {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Instrument Serif', data: SERIF, weight: 400, style: 'normal' },
      { name: 'JetBrains Mono', data: MONO, weight: 400, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
