import React from 'react';
import {C, T} from '../theme';
import {Cam, Rect, project, rectCenter} from './Camera';
import {clamp01, lerp} from './timing';

/** Interpolate between two regions so a highlight can travel from one real
 *  value to another instead of cutting between them. */
export const rectLerp = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});

/**
 * The film has one figure slot. Metrics are handed into it and out of it;
 * they are never two separate things fading past each other.
 *
 * When `travel` runs, the figure leaves the column, converges on the place in
 * the real screenshot where that same number lives, and resolves into the
 * highlight that lands there. The typography becomes the annotation.
 */
export const SharedFigure: React.FC<{
  anchor: {x: number; y: number};
  travel: number;
  toRect?: Rect;
  cam: Cam;
  children: React.ReactNode;
}> = ({anchor, travel, toRect, cam, children}) => {
  const t = clamp01(travel);
  let x = anchor.x;
  let y = anchor.y;
  let scale = 1;
  let opacity = 1;
  if (toRect && t > 0) {
    const c = rectCenter(toRect);
    const p = project(c, cam);
    x = lerp(anchor.x, p.x - 170, t);
    y = lerp(anchor.y, p.y - 66, t);
    scale = lerp(1, 0.34, t);
    // gone while still large enough to read, so it leaves no debris behind
    opacity = 1 - clamp01((t - 0.30) / 0.25);
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '0% 50%',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

/** The recurring left column: mark, who it is, and what this beat claims. */
export const BeatColumn: React.FC<{
  rule: number;
  label?: React.ReactNode;
  claim?: React.ReactNode;
  claimProgress?: number;
  source?: React.ReactNode;
  sourceProgress?: number;
  top?: number;
}> = ({rule, label, claim, claimProgress = 0, source, sourceProgress = 0, top = 282}) => (
  <div style={{position: 'absolute', left: 140, top, width: 600}}>
    <div style={{width: 46 * clamp01(rule), height: 2, background: C.accent, marginBottom: 18}} />
    {label ? <div style={{...T.section, fontSize: 22}}>{label}</div> : null}
    {claim ? (
      <div
        style={{
          ...T.claim,
          fontSize: 46,
          marginTop: 26,
          opacity: clamp01(claimProgress),
          transform: `translateY(${(1 - clamp01(claimProgress)) * 18}px)`,
        }}
      >
        {claim}
      </div>
    ) : null}
    {source ? (
      <div
        style={{
          ...T.eyebrow,
          fontSize: 17,
          marginTop: 20,
          opacity: clamp01(sourceProgress) * 0.95,
          transform: `translateY(${(1 - clamp01(sourceProgress)) * 10}px)`,
        }}
      >
        {source}
      </div>
    ) : null}
  </div>
);
