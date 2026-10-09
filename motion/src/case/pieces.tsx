import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, F, T, accentA} from '../theme';
import {easeOutCubic, easeInOutCubic, win} from '../motion/Path';
import {clamp01} from '../motion/timing';

export const W = (frame: number, b: readonly [number, number] | number[]) => win(frame, b[0], b[1]);
export const E = (frame: number, b: readonly [number, number] | number[]) => easeOutCubic(W(frame, b));
export const SE = (frame: number, b: readonly [number, number] | number[]) => easeInOutCubic(W(frame, b));

/** Masked rise, the film's one typographic entrance. */
export const reveal = (t: number, rise = 14): React.CSSProperties => {
  const e = easeOutCubic(t);
  return {opacity: e, transform: `translateY(${(1 - e) * rise}px)`, clipPath: `inset(0% 0% ${(1 - e) * 100}% 0%)`};
};

export const Ground: React.FC = () => <div style={{position: 'absolute', inset: 0, background: C.ground}} />;

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.74}) => (
  <div style={{position: 'absolute', inset: 0, background:
    `radial-gradient(132% 102% at 50% 48%, rgba(0,0,0,0) 40%, rgba(0,0,0,${strength}) 100%)`}} />
);

/** Subtle film grain: turbulence noise re-seeded every frame, 5% over. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.055}) => {
  const f = useCurrentFrame();
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <filter id={`grain${f}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 977} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain${f})`} />
    </svg>
  );
};

/** The site, full bleed, with a slow push. src is a still or a sequence frame. */
export const FullBleed: React.FC<{src: string; scale?: number; x?: number; y?: number; dim?: number; opacity?: number}> =
  ({src, scale = 1, x = 0, y = 0, dim = 1, opacity = 1}) => (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity}}>
      <Img src={src} style={{
        position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover',
        transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: '50% 50%',
        filter: `brightness(${dim})`,
      }} />
    </div>
  );

/** A browser-shaped frame around a site capture: real pixels inside, a
    plain dark chrome around them so it reads as a window, not a redraw. */
export const Window: React.FC<{src: string; x: number; y: number; w: number; h: number; scale?: number; opacity?: number; tilt?: number; panY?: number; dim?: number}> =
  ({src, x, y, w, h, scale = 1, opacity = 1, tilt = 0, panY = 0, dim = 1}) => (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h, opacity,
      transform: `perspective(2600px) rotateY(${tilt}deg) scale(${scale})`, transformOrigin: '50% 50%',
      borderRadius: 14, overflow: 'hidden', background: C.panel, border: `1px solid ${C.edge}`,
      boxShadow: '0 46px 120px rgba(0,0,0,0.8)',
    }}>
      <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: w, height: 'auto', transform: `translateY(${-panY}px)`, filter: `brightness(${dim})`}} />
    </div>
  );

/** A phone-shaped frame around the mobile capture. 390x844 at the given scale. */
export const Phone: React.FC<{src: string; cx: number; cy: number; scale?: number; opacity?: number; tilt?: number; panY?: number}> =
  ({src, cx, cy, scale = 1, opacity = 1, tilt = 0, panY = 0}) => {
    const w = 390, h = 844;
    return (
      <div style={{
        position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, opacity,
        transform: `perspective(2200px) rotateY(${tilt}deg) scale(${scale})`, transformOrigin: '50% 50%',
      }}>
        <div style={{
          position: 'absolute', inset: -14, borderRadius: 54, background: '#141416',
          border: '1px solid #2A2A2E', boxShadow: '0 40px 110px rgba(0,0,0,0.85)',
        }} />
        <div style={{position: 'absolute', inset: 0, borderRadius: 42, overflow: 'hidden', background: C.panel}}>
          <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: w, height: 'auto', transform: `translateY(${-panY}px)`}} />
        </div>
      </div>
    );
  };

export const Eyebrow: React.FC<{t: number; children: React.ReactNode; style?: React.CSSProperties}> = ({t, children, style}) => (
  <div style={{...T.section, fontSize: 24, letterSpacing: '0.32em', color: C.text, ...reveal(t, 10), ...style}}>{children}</div>
);

export const Rule: React.FC<{t: number; w?: number}> = ({t, w = 86}) => (
  <div style={{width: w * easeOutCubic(t), height: 3, background: C.accent}} />
);

export const Big: React.FC<{t: number; out?: number; size?: number; children: React.ReactNode; color?: string; style?: React.CSSProperties}> =
  ({t, out = 0, size = 200, children, color = C.text, style}) => (
    <div style={{
      ...T.figure, fontSize: size, lineHeight: 0.95, color, whiteSpace: 'nowrap',
      ...reveal(t, 18), opacity: easeOutCubic(t) * (1 - out), ...style,
    }}>{children}</div>
  );

export const Label: React.FC<{t: number; out?: number; children: React.ReactNode; size?: number; style?: React.CSSProperties}> =
  ({t, out = 0, children, size = 34, style}) => (
    <div style={{
      fontSize: size, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted,
      whiteSpace: 'nowrap', ...reveal(t, 10), opacity: easeOutCubic(t) * (1 - out), ...style,
    }}>{children}</div>
  );

export const Note: React.FC<{t: number; out?: number; children: React.ReactNode}> = ({t, out = 0, children}) => (
  <div style={{...T.eyebrow, fontSize: 22, letterSpacing: '0.2em', opacity: 0.95 * easeOutCubic(t) * (1 - out)}}>{children}</div>
);

/** A real report capture with a ring on the pixels being quoted. */
export const Evidence: React.FC<{
  src: string; x: number; y: number; w: number; ar: number; t: number; out?: number;
  ring?: readonly [number, number, number, number]; ringT?: number; overlay?: string; wipe?: number; tone?: number;
}> = ({src, x, y, w, ar, t, out = 0, ring, ringT = 0, overlay, wipe = 0, tone = 1}) => {
  const h = w / ar;
  const e = easeOutCubic(t);
  const r = ring ? {l: ring[0] * w, t: ring[1] * h, w: (ring[2] - ring[0]) * w, h: (ring[3] - ring[1]) * h} : null;
  const rt = clamp01(ringT);
  const over = 1.18 - 0.18 * rt;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h, opacity: clamp01(e * 1.5) * (1 - out),
      transform: `translateY(${(1 - e) * 24}px)`,
    }}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 12, overflow: 'hidden', background: C.panel,
        border: `1px solid ${C.edge}`, boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
        clipPath: `inset(0% ${(1 - e) * 100}% 0% 0%)`}}>
        <Img src={staticFile(src)} style={{width: '100%', display: 'block', filter: `brightness(${1.1 * tone}) contrast(1.04)`}} />
        {overlay && wipe > 0 ? (
          <div style={{position: 'absolute', inset: 0, clipPath: `inset(0% 0% ${(1 - clamp01(wipe)) * 100}% 0%)`}}>
            <Img src={staticFile(overlay)} style={{width: '100%', display: 'block', filter: `brightness(${1.1 * tone}) contrast(1.04)`}} />
          </div>
        ) : null}
        {overlay && wipe > 0 && wipe < 1 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: `${clamp01(wipe) * 100}%`, height: 2, background: C.accent, boxShadow: `0 0 20px 1px ${accentA(0.5)}`}} />
        ) : null}
      </div>
      {r && rt > 0.001 ? (
        <div style={{
          position: 'absolute', left: r.l + r.w / 2 - (r.w * over) / 2 - 6, top: r.t + r.h / 2 - (r.h * over) / 2 - 6,
          width: r.w * over + 12, height: r.h * over + 12, border: `2px solid ${C.accent}`, borderRadius: 8,
          opacity: rt, boxShadow: `0 0 0 4px ${accentA(0.16)}, 0 0 30px ${accentA(0.32)}`,
        }} />
      ) : null}
    </div>
  );
};

export const fontFamily = F.sans;
