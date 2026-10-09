import React from 'react';
import {Freeze, Sequence, useCurrentFrame} from 'remotion';

/* =====================================================================
   HOLDS. The voiceover runs longer than the silent cut in four sections,
   so the picture is held at chosen rest points, where the camera is already
   still, for as long as the voice needs. A held frame gets a slow push
   (about 0.01% a frame) so no two frames are identical.

   Local frame numbers are the scene's own. The same table drives the cue
   sheet, so a sound tied to a local beat lands on the stretched frame.   */
export type Hold = {at: number; by: number};

export const HOLDS: Record<string, Hold[]> = {
  // All empty: the voiceover was removed on 5 October and the holds with it.
  // The mechanism stays so a voice can be put back without touching a scene.
  hook: [], portfolio: [], editLobby: [], ksunch: [], proof: [], pitch: [], close: [],
};

export const addedBy = (holds: Hold[]) => holds.reduce((a, h) => a + h.by, 0);

/** Local beat frame -> frame in the stretched scene. */
export const stretchFrame = (holds: Hold[], local: number) => {
  let off = 0;
  for (const h of holds) if (local > h.at) off += h.by;
  return local + off;
};

/** Stretched frame -> {local frame, frozen?, held so far}. */
const resolve = (holds: Hold[], f: number) => {
  let off = 0;
  for (const h of holds) {
    const start = h.at + off;
    if (f < start) break;
    if (f < start + h.by) return {local: h.at, frozen: true, held: off + (f - start)};
    off += h.by;
  }
  return {local: f - off, frozen: false, held: off};
};

export const Stretched: React.FC<{holds: Hold[]; children: React.ReactNode}> = ({holds, children}) => {
  const f = useCurrentFrame();
  const r = resolve(holds, f);
  const creep = 1 + 0.0001 * r.held;
  const inner = r.frozen
    ? <Freeze frame={r.local}>{children}</Freeze>
    : <Sequence from={f - r.local} layout="none">{children}</Sequence>;
  return (
    <div style={{position: 'absolute', inset: 0, transform: `scale(${creep})`, transformOrigin: '50% 50%'}}>
      {inner}
    </div>
  );
};
