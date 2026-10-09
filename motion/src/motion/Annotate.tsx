import React from 'react';
import {C, accentA} from '../theme';
import {Cam, Rect, project} from './Camera';
import {clamp01} from './timing';

/**
 * A ring drawn over a real screenshot to say "this number, here".
 * Projected into screen space rather than drawn into the world so its stroke
 * weight stays constant however far the camera pushes in. The screenshot
 * underneath is untouched.
 */
export const HighlightRegion: React.FC<{
  rect: Rect;
  cam: Cam;
  progress: number;
  pad?: number;
}> = ({rect, cam, progress, pad = 6}) => {
  const p = clamp01(progress);
  if (p <= 0.001) return null;
  const tl = project({x: rect.x, y: rect.y}, cam);
  const br = project({x: rect.x + rect.w, y: rect.y + rect.h}, cam);
  const overshoot = 1.18 - 0.18 * p;
  const w = (br.x - tl.x) * overshoot + pad * 2;
  const h = (br.y - tl.y) * overshoot + pad * 2;
  const cx = (tl.x + br.x) / 2;
  const cy = (tl.y + br.y) / 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        border: `2px solid ${C.accent}`,
        borderRadius: 8,
        opacity: p,
        boxShadow: `0 0 0 4px ${C.accentSoft}, 0 0 30px ${accentA(0.32)}`,
      }}
    />
  );
};

/**
 * A leader line from our typography to the exact pixel in the real screenshot
 * the figure was read from. The claim and its receipt stay physically joined.
 */
export const Connector: React.FC<{
  from: {x: number; y: number};
  toRect: Rect;
  cam: Cam;
  progress: number;
}> = ({from, toRect, cam, progress}) => {
  const p = clamp01(progress);
  if (p <= 0.001) return null;
  const tl = project({x: toRect.x, y: toRect.y}, cam);
  const br = project({x: toRect.x + toRect.w, y: toRect.y + toRect.h}, cam);
  const target = {x: tl.x - 14, y: (tl.y + br.y) / 2};
  const midX = from.x + (target.x - from.x) * 0.45;
  const d = `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${target.y} L ${target.x} ${target.y}`;
  const len =
    Math.abs(midX - from.x) + Math.abs(target.y - from.y) + Math.abs(target.x - midX);
  return (
    <svg
      width={1920}
      height={1080}
      style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}
    >
      <path
        d={d}
        fill="none"
        stroke={C.accent}
        strokeWidth={1.5}
        strokeOpacity={0.85}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
      <circle cx={from.x} cy={from.y} r={3} fill={C.accent} opacity={p} />
    </svg>
  );
};
