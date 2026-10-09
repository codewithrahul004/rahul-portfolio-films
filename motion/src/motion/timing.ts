import {spring, interpolate} from 'remotion';

/**
 * Spring vocabulary for the whole film. Three voices only, so every move in
 * the film feels like it came from the same hand.
 *   GLIDE  - camera and large masses. No overshoot, long deceleration.
 *   SETTLE - typography and badges landing. A touch of overshoot.
 *   SNAP   - small annotations arriving. Quick, tight, barely any overshoot.
 */
export const GLIDE = {damping: 200, mass: 1.1, stiffness: 92} as const;
export const SETTLE = {damping: 24, mass: 0.8, stiffness: 150} as const;
export const SNAP = {damping: 30, mass: 0.6, stiffness: 240} as const;

export type Cfg = {damping: number; mass: number; stiffness: number};

/** Spring-driven 0..1 for a segment of the timeline. */
export const seg = (
  frame: number,
  fps: number,
  start: number,
  duration: number,
  config: Cfg = GLIDE
) =>
  spring({
    frame: frame - start,
    fps,
    config,
    durationInFrames: duration,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Re-map a 0..1 progress onto a sub-range of itself, clamped. */
export const remap = (p: number, from: number, to: number) =>
  interpolate(p, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
