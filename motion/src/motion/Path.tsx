import {Cam} from './Camera';
import {clamp01} from './timing';

/**
 * ONE CAMERA, ONE PATH.
 *
 * The earlier cut built the camera by chaining one spring per move:
 *
 *   cam = camLerp(A, B, spring1); cam = camLerp(cam, C, spring2); ...
 *
 * Every spring in that chain has a long, slow tail, and the next move starts
 * while the previous one is still settling. The result is a velocity that
 * dips towards zero at every waypoint and then picks up again: the
 * move / stop / move / stop feel.
 *
 * Here the camera is instead a single path through waypoints, interpolated
 * with a monotone cubic Hermite. Two consequences, both deliberate:
 *
 *   - Where the camera is travelling past a waypoint, the tangents either
 *     side match, so it FLOWS through at continuous velocity.
 *   - Where the path holds (two waypoints with the same camera), the secants
 *     are zero, so the tangents are zero and the segment either side reduces
 *     to smoothstep. The camera eases out of rest and eases back into rest
 *     with no overshoot and no sudden start.
 *
 * The Fritsch-Carlson limiter keeps every segment monotone, so a push never
 * overshoots its target and comes back. No bounce, no elastic, no wobble.
 */
export type CamKey = {f: number; cam: Cam};

const h00 = (u: number) => 2 * u * u * u - 3 * u * u + 1;
const h10 = (u: number) => u * u * u - 2 * u * u + u;
const h01 = (u: number) => -2 * u * u * u + 3 * u * u;
const h11 = (u: number) => u * u * u - u * u;

/** Fritsch-Carlson: clamp a tangent so the cubic cannot overshoot. */
const limit = (m: number, d0: number, d1: number) => {
  if (d0 === 0 || d1 === 0 || Math.sign(d0) !== Math.sign(d1)) return 0;
  const cap = 3 * Math.min(Math.abs(d0), Math.abs(d1));
  return Math.sign(d0) * Math.min(Math.abs(m), cap);
};

type Axis = 'x' | 'y' | 'z';
const AXES: Axis[] = ['x', 'y', 'z'];

const tangentAt = (keys: CamKey[], i: number, a: Axis) => {
  const n = keys.length;
  if (i === 0 || i === n - 1) return 0;
  const p = keys[i - 1], c = keys[i], q = keys[i + 1];
  const d0 = (c.cam[a] - p.cam[a]) / (c.f - p.f);
  const d1 = (q.cam[a] - c.cam[a]) / (q.f - c.f);
  return limit((d0 + d1) / 2, d0, d1);
};

export const camPath = (keys: CamKey[], f: number): Cam => {
  const n = keys.length;
  if (n === 0) return {x: 960, y: 540, z: 1};
  if (n === 1 || f <= keys[0].f) return keys[0].cam;
  if (f >= keys[n - 1].f) return keys[n - 1].cam;

  let i = 0;
  while (i < n - 2 && f >= keys[i + 1].f) i++;
  const k0 = keys[i], k1 = keys[i + 1];
  const h = k1.f - k0.f;
  const u = clamp01((f - k0.f) / h);
  const A = h00(u), B = h10(u) * h, Cc = h01(u), D = h11(u) * h;

  const out = {x: 0, y: 0, z: 0} as Cam;
  for (const a of AXES) {
    const m0 = tangentAt(keys, i, a);
    const m1 = tangentAt(keys, i + 1, a);
    out[a] = A * k0.cam[a] + B * m0 + Cc * k1.cam[a] + D * m1;
  }
  return out;
};

/* ------------------------------------------------------------------ easing
   One family, no overshoot, no bounce. Typography and panels use these; the
   camera uses the path above.                                              */

export const easeOutCubic = (u: number) => {
  const t = clamp01(u);
  return 1 - (1 - t) * (1 - t) * (1 - t);
};

export const easeInOutCubic = (u: number) => {
  const t = clamp01(u);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/** Raw 0..1 across a window of the timeline. */
export const win = (frame: number, start: number, duration: number) =>
  clamp01((frame - start) / duration);
