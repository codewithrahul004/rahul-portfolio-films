import React from 'react';
import {lerp} from './timing';

/**
 * A camera over a world that is bigger than the frame.
 * Everything in the film lives in world coordinates; the camera decides what
 * the frame sees. This is what lets one shot push into a detail of the
 * previous shot instead of cutting to a new slide.
 */
export type Cam = {x: number; y: number; z: number};

export const cam = (x: number, y: number, z: number): Cam => ({x, y, z});

export const camLerp = (a: Cam, b: Cam, t: number): Cam => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: lerp(a.z, b.z, t),
});

/** Where a world point lands on the 1920x1080 frame for a given camera. */
export const project = (p: {x: number; y: number}, c: Cam, depth = 1) => {
  const z = 1 + (c.z - 1) * depth;
  const fx = 960 + (c.x - 960) * depth;
  const fy = 540 + (c.y - 540) * depth;
  return {x: (p.x - fx) * z + 960, y: (p.y - fy) * z + 540, z};
};

/**
 * A layer that the camera moves over. `depth` is the parallax factor:
 * 1 sits in the plane of the evidence, below 1 sits further back and
 * therefore moves less. Controlled 2.5D, no real 3D.
 */
export const Layer: React.FC<{
  cam: Cam;
  depth?: number;
  children: React.ReactNode;
}> = ({cam: c, depth = 1, children}) => {
  const z = 1 + (c.z - 1) * depth;
  const fx = 960 + (c.x - 960) * depth;
  const fy = 540 + (c.y - 540) * depth;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate(960px, 540px) scale(${z}) translate(${-fx}px, ${-fy}px)`,
        transformOrigin: '0 0',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

/** A rectangle in world space. Used to place evidence and to aim the camera. */
export type Rect = {x: number; y: number; w: number; h: number};

export const rectCenter = (r: Rect) => ({x: r.x + r.w / 2, y: r.y + r.h / 2});

/** Sub-rectangle of a Rect given normalised 0..1 coordinates inside it. */
export const sub = (r: Rect, n: [number, number, number, number]): Rect => ({
  x: r.x + n[0] * r.w,
  y: r.y + n[1] * r.h,
  w: (n[2] - n[0]) * r.w,
  h: (n[3] - n[1]) * r.h,
});

/**
 * Aim the camera so a world rect lands at a chosen point on the frame at a
 * chosen zoom. This is how a push stays locked to the thing it is pushing
 * into instead of drifting off it.
 */
export const frameOn = (
  r: Rect,
  screenX: number,
  screenY: number,
  z: number
): Cam => {
  const c = rectCenter(r);
  return {x: c.x - (screenX - 960) / z, y: c.y - (screenY - 540) / z, z};
};
