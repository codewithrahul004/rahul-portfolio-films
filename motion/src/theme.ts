// Single source of truth for the film's look. Scenes never hard-code colour or type.
// Two palettes. The accent is the only thing that really changes: the film's own
// green, or AWTM Forge's brand orange #E08537 (Rahul, 5 October), on the
// site's black ground with its 60% grey muted text.
export type ThemeName = 'green' | 'awtm';

const PALETTES = {
  green: {
    ground: '#0B0B0C', panel: '#0E0E10', edge: '#3A3A42', text: '#FFFFFF',
    muted: '#9A9AA0', dim: '#6E6E75', accent: '#15A900', accentRGB: '21,169,0',
  },
  awtm: {
    ground: '#000000', panel: '#0D0D0D', edge: '#262626', text: '#FFFFFF',
    muted: '#999999', dim: '#666666', accent: '#E08537', accentRGB: '224,133,55',
  },
} as const;

type Palette = {
  ground: string; panel: string; edge: string; text: string; muted: string; dim: string;
  accent: string; accentRGB: string; accentSoft: string;
};

/* Mutable on purpose: the Film component sets the palette before any scene
   renders, so every scene reads the right colours without threading a prop
   through forty components. Remotion renders each frame fresh, so this is
   deterministic. */
export const C: Palette = {...PALETTES.green, accentSoft: 'rgba(21,169,0,0.16)'};

export const setTheme = (name: ThemeName) => {
  const p = PALETTES[name];
  Object.assign(C, p, {accentSoft: `rgba(${p.accentRGB},0.16)`});
};

/** The accent at an alpha, for glows and fills. */
export const accentA = (a: number) => `rgba(${C.accentRGB},${a})`;

export const F = {
  sans: '"TeX Gyre Heros","Liberation Sans",Arial,sans-serif',
};

export const T = {
  // eyebrow / source attribution
  eyebrow: {
    fontSize: 19,
    letterSpacing: '0.26em',
    textTransform: 'lowercase' as const,
    get color() { return C.muted; },
    fontWeight: 400,
  },
  section: {
    fontSize: 25,
    letterSpacing: '0.30em',
    textTransform: 'uppercase' as const,
    fontWeight: 700,
  },
  // the dominant figure in a beat
  figure: {
    fontSize: 148,
    letterSpacing: '-0.035em',
    fontWeight: 700,
    lineHeight: 0.92,
    fontVariantNumeric: 'tabular-nums' as const,
  },
  claim: {
    fontSize: 54,
    letterSpacing: '-0.020em',
    fontWeight: 700,
    lineHeight: 1.1,
    textTransform: 'uppercase' as const,
  },
};

// The world is larger than the frame; the camera moves through it.
export const FRAME = {w: 1920, h: 1080};
