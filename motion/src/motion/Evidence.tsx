import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, accentA} from '../theme';
import {Rect} from './Camera';
import {clamp01} from './timing';

/**
 * A directional wipe. Not a transition effect for its own sake: it is how one
 * state of a real screenshot becomes the next state of the same screenshot,
 * with a lit edge marking the boundary as it travels.
 */
/** Exposure only. Nothing in the screenshot is moved, removed or redrawn. */
export const EVIDENCE_LIFT = 'brightness(1.12) contrast(1.05) saturate(1.02)';

/** Exposure for one panel. Light captures are stopped down so they sit in a
 *  dark film without blowing out; the capture itself is untouched. */
export const toneFilter = (tone: number) =>
  `brightness(${(1.12 * tone).toFixed(3)}) contrast(1.05) saturate(1.02)`;

export type WipeDir = 'down' | 'up' | 'right' | 'left';

const insetFor = (dir: WipeDir, p: number) => {
  const q = (1 - p) * 100;
  if (dir === 'down') return `0% 0% ${q}% 0%`;
  if (dir === 'up') return `${q}% 0% 0% 0%`;
  if (dir === 'right') return `0% ${q}% 0% 0%`;
  return `0% 0% 0% ${q}%`;
};

export const DirectionalWipe: React.FC<{
  dir: WipeDir;
  progress: number;
  children: React.ReactNode;
}> = ({dir, progress, children}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      clipPath: `inset(${insetFor(dir, clamp01(progress))})`,
      willChange: 'clip-path',
    }}
  >
    {children}
  </div>
);

/** The lit edge that leads a wipe. Sits exactly on the boundary. */
export const WipeEdge: React.FC<{
  dir: WipeDir;
  progress: number;
  thickness?: number;
  opacity?: number;
}> = ({dir, progress, thickness = 3, opacity = 1}) => {
  const p = clamp01(progress);
  if (p <= 0 || p >= 1) return null;
  const horizontal = dir === 'down' || dir === 'up';
  const pos = `${(dir === 'up' || dir === 'left' ? 1 - p : p) * 100}%`;
  return (
    <div
      style={{
        position: 'absolute',
        background: C.accent,
        opacity,
        boxShadow: `0 0 20px 1px ${accentA(0.45)}`,
        ...(horizontal
          ? {left: 0, right: 0, top: pos, height: thickness, marginTop: -thickness / 2}
          : {top: 0, bottom: 0, left: pos, width: thickness, marginLeft: -thickness / 2}),
      }}
    />
  );
};

/**
 * Real evidence, placed in world space. The screenshot is never redrawn — it
 * is the source of truth. `overlay` is a second real capture of the same
 * surface, revealed through the wipe so the two states register pixel to pixel.
 */
export const EvidencePanel: React.FC<{
  rect: Rect;
  src: string;
  overlaySrc?: string;
  wipe?: number;
  wipeDir?: WipeDir;
  radius?: number;
  showEdge?: boolean;
  /** 0..1 reveal of the panel itself, as a wipe rather than a fade. */
  enter?: number;
  enterDir?: WipeDir;
  edgeOpacity?: number;
  /** Exposure multiplier for this panel. 1 keeps the default lift. */
  tone?: number;
}> = ({
  rect,
  src,
  overlaySrc,
  wipe = 0,
  wipeDir = 'down',
  radius = 14,
  showEdge = true,
  enter = 1,
  enterDir = 'right',
  edgeOpacity = 1,
  tone = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: rect.x,
      top: rect.y,
      width: rect.w,
      height: rect.h,
      borderRadius: radius,
      overflow: 'hidden',
      background: C.panel,
      border: `1px solid ${C.edge}`,
      boxShadow: '0 46px 120px rgba(0,0,0,0.80)',
      clipPath: enter < 1 ? `inset(${insetFor(enterDir, clamp01(enter))})` : undefined,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{width: '100%', display: 'block', filter: toneFilter(tone)}}
    />
    {overlaySrc && wipe > 0 ? (
      <DirectionalWipe dir={wipeDir} progress={wipe}>
        <Img
          src={staticFile(overlaySrc)}
          style={{
            width: '100%', display: 'block', position: 'absolute', inset: 0,
            filter: toneFilter(tone),
          }}
        />
      </DirectionalWipe>
    ) : null}
    {overlaySrc && showEdge ? (
      <WipeEdge dir={wipeDir} progress={wipe} thickness={2} opacity={edgeOpacity} />
    ) : null}
    {enter < 1 ? <WipeEdge dir={enterDir} progress={enter} thickness={4} /> : null}
  </div>
);

/**
 * A live site shown in a browser-style frame, panned vertically through the
 * real page. The capture is never altered; the frame is a window onto it, so
 * what moves is the viewport, exactly as it would in a browser.
 */
export const ScrollPanel: React.FC<{
  rect: Rect;
  src: string;
  /** 0..1 through the available scroll of the capture. */
  panY: number;
  /** Image width relative to the frame; above 1 gives room to pan. */
  fill?: number;
  label?: string;
  enter?: number;
  enterDir?: WipeDir;
  tone?: number;
  radius?: number;
}> = ({rect, src, panY, fill = 1.18, label, enter = 1, enterDir = 'up', tone = 1, radius = 12}) => (
  <div style={{position: 'absolute', left: rect.x, top: rect.y, width: rect.w}}>
    <div
      style={{
        width: rect.w,
        height: rect.h,
        borderRadius: radius,
        overflow: 'hidden',
        background: C.panel,
        border: `1px solid ${C.edge}`,
        boxShadow: '0 40px 110px rgba(0,0,0,0.82)',
        position: 'relative',
        clipPath: enter < 1 ? `inset(${insetFor(enterDir, clamp01(enter))})` : undefined,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: rect.w * fill,
          transform: `translate(-50%, ${-clamp01(panY) * Math.max(0, rect.w * fill * (1176 / 1016) - rect.h)}px)`,
          filter: toneFilter(tone),
          display: 'block',
        }}
      />
      {enter < 1 ? <WipeEdge dir={enterDir} progress={enter} thickness={3} /> : null}
    </div>
    {label ? (
      <div
        style={{
          marginTop: 18,
          fontSize: 17,
          letterSpacing: '0.24em',
          color: C.muted,
          textTransform: 'lowercase',
          opacity: clamp01(enter * 1.4 - 0.4),
        }}
      >
        {label}
      </div>
    ) : null}
  </div>
);
