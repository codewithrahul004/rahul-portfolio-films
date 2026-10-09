import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, F, T} from '../theme';
import {Cam, Layer, Rect} from '../motion/Camera';
import {Vignette, Ground} from '../motion/Backdrop';
import {camPath, CamKey, easeOutCubic, easeInOutCubic, win} from '../motion/Path';
import {clamp01} from '../motion/timing';

/* ====================================================================== 06
   THE NUMBERS — THREE BEATS, ONE FIGURE AT A TIME

   Rebuilt 4 October after a legibility failure. The previous version held
   five figures at once at z 0.63, which rendered the evidence lines under
   them at 12px cap height, about 1.1% of frame height. Readable body text in
   video needs roughly 2.5 to 3%. At the size a profile visitor actually
   watches, the numbers read and the evidence did not — which is the worst
   possible outcome for a scene whose whole job is that the numbers are
   supported.

   The arithmetic behind the rebuild: at a label size that reads, about two
   figures fit on a 1920 frame at once. So five legible figures needs either
   sequential beats or fewer figures. Rahul chose fewer: three, one per beat,
   camera close, no wide recap.

   THE PROGRESSION, his: performance -> engagement -> commercial result,
   then the person.

   Each figure grows slightly closer than the last (z 1.000 -> 1.058 ->
   1.136) so the scene tightens toward the end. The final state is the
   strongest and largest, not the smallest. Inside each hold the zoom keeps
   creeping, about 0.6px per frame of expansion: too slow to read as a move,
   fast enough that no two frames are identical. A dead-still frame in a
   premium film reads as a stall.

   SOURCES. All three are read off a real document, none is derived:
     93%      Edit Lobby report. 287 GB -> 20.1 GB monthly bandwidth.
              Shown in Scene 02 off the real report.
     +27.3%   Edit Lobby report, "Average session duration": 3:18 before
              update (Apr 20 to Jul 20) -> 4:12 latest (Sep 1 to 27). The
              +27.3% is printed on the chart itself, not calculated here.
              The label says what the measure IS and claims no causation,
              because the report notes it as a measured outcome rather than
              proven causation.
     Rs 4.1L+ Scene 03. The chart on screen sums to Rs 4,10,932.

   WHAT IS NOT HERE. No count of projects, clients or brands, Rahul's
   decision: breadth is argued by Scene 04's footage, where the viewer counts
   the sites himself. "100+ brands" and "100+ projects" were both requested
   and both declined; nothing in this project supports either, and the Upwork
   profile one click away says 3 completed jobs. "4 platforms" and "77K" and
   "5.0" were dropped with the five-up layout: the three kept have the
   strongest concrete evidence and do not need small explanatory text to
   stay defensible.                                                        */

const HERO_CARD = {file: 'pf/w_basavaraj.jpg', ar: 570 / 400};

/* the card Scene 05 ended on: the camera travels through it into this scene */
const HERO: Rect = {x: 670, y: 648.4, w: 660, h: 660 / HERO_CARD.ar};

type Fig = {
  cx: number;
  cy: number;
  value: string;
  /** The source, named. Uppercase, under the figure. Never a sentence. */
  line: string;
  /** in / out windows: [start, duration] */
  in: readonly [number, number];
  out: readonly [number, number];
  from: [number, number];
};

/* 1300 apart: at this zoom one figure dominates the frame at a time, and the
   pan between them peaks at 79 px/frame rather than the 103 that 1600 spacing
   produced. The camera travels between statements, it does not whip.

   The in/out windows OVERLAP on purpose. Each figure begins arriving while
   the previous is still leaving, because mid-pan both are partly in frame and
   a clean handover would otherwise leave the frame empty for a few frames.
   Measured: non-overlapping windows produced dead holds of 8 and 6 frames
   against the flat ground. */
const FIGS: Fig[] = [
  {cx: 2600, cy: 540, value: '93%',    line: 'edit lobby bandwidth',
   in: [42, 16],  out: [96, 18],  from: [0, 44]},
  {cx: 3900, cy: 540, value: '+27.3%', line: 'average session duration',
   in: [106, 18], out: [166, 18], from: [46, 0]},
  {cx: 5200, cy: 540, value: '₹4.1L+', line: 'ksunch launch revenue',
   in: [176, 18], out: [240, 12], from: [46, 0]},
];

const B = {
  heroOut: [26, 18],     // the card leaves frame as the first figure arrives
  stamp: [60, 20],
  stampOut: [234, 16],
} as const;

export const SCENE06_FRAMES = 252;

/* Picks up Scene 05's camera mid-move, pushes through the centre review, and
   comes out on the first figure. Then two pans, each landing on a hold. The
   zoom creeps IN across the three beats so the scene tightens. */
const PATH: CamKey[] = [
  {f: 0,   cam: {x: 1050, y: 820, z: 0.558}},  // where Scene 05 ended
  {f: 18,  cam: {x: 1016, y: 862, z: 1.050}},
  {f: 34,  cam: {x: 1000, y: 880, z: 2.150}},  // through the card
  {f: 46,  cam: {x: 1900, y: 660, z: 1.330}},  // spreads the deceleration
  {f: 58,  cam: {x: 2600, y: 540, z: 1.000}},  // beat 1
  {f: 96,  cam: {x: 2600, y: 540, z: 1.026}},  // hold, still creeping in
  {f: 128, cam: {x: 3900, y: 540, z: 1.058}},  // beat 2, a little closer
  {f: 166, cam: {x: 3900, y: 540, z: 1.084}},  // hold
  {f: 198, cam: {x: 5200, y: 540, z: 1.136}},  // beat 3, closest
  {f: 238, cam: {x: 5200, y: 540, z: 1.166}},  // the longest hold
  {f: 252, cam: {x: 5200, y: 540, z: 1.180}},  // eases into the plate
];
const Figure: React.FC<{f: Fig; t: number; o: number}> = ({f, t, o}) => {
  const e = easeOutCubic(t);
  const vis = clamp01(e * 1.8) * (1 - o);
  return (
    <div style={{
      position: 'absolute',
      left: f.cx - 660,
      top: f.cy - 160,
      width: 1340,
      opacity: vis,
      transform: `translate(${f.from[0] * (1 - e)}px, ${f.from[1] * (1 - e)}px)`,
    }}>
      <div style={{width: 96 * e, height: 4, background: C.accent, marginBottom: 34}} />
      <div style={{
        ...T.figure,
        fontSize: 200,
        lineHeight: 0.95,
        whiteSpace: 'nowrap',
        transform: `translateY(${(1 - e) * 16}px)`,
        clipPath: `inset(0% 0% ${(1 - e) * 100}% 0%)`,
      }}>
        {f.value}
      </div>
      <div style={{
        fontSize: 38,
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: C.muted,
        marginTop: 36,
        whiteSpace: 'nowrap',
        opacity: easeOutCubic(clamp01(t * 1.6 - 0.45)),
      }}>
        {f.line}
      </div>
    </div>
  );
};

export const Scene06Numbers: React.FC = () => {
  const frame = useCurrentFrame();
  const W = (b: readonly [number, number] | number[]) => win(frame, b[0], b[1]);
  const E = (b: readonly [number, number] | number[]) => easeOutCubic(W(b));
  const SE = (b: readonly [number, number] | number[]) => easeInOutCubic(W(b));

  const cam: Cam = camPath(PATH, frame);

  return (
    <AbsoluteFill style={{background: C.ground, fontFamily: F.sans, color: C.text}}>
      <Ground />

      <Layer cam={cam} depth={1}>
        {/* the last review the viewer read, on its way to becoming the dark */}
        <div style={{opacity: 1 - SE(B.heroOut)}}>
          <div style={{
            position: 'absolute', left: HERO.x, top: HERO.y,
            width: HERO.w, height: HERO.h, borderRadius: 10, overflow: 'hidden',
            border: `1px solid ${C.edge}`, background: '#101012',
            boxShadow: '0 38px 90px rgba(0,0,0,0.85)',
          }}>
            <Img src={staticFile(HERO_CARD.file)}
              style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
          </div>
        </div>

        {FIGS.map((f) => (
          <Figure key={f.value} f={f} t={W(f.in)} o={SE(f.out)} />
        ))}
      </Layer>

      <Vignette />

      <div style={{position: 'absolute', left: 140, bottom: 96}}>
        <div style={{
          fontSize: 26, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: C.muted,
          opacity: 0.85 * E(B.stamp) * (1 - E(B.stampOut)),
          transform: `translateY(${(1 - E(B.stamp)) * 10}px)`,
        }}>
          Everything above, on record
        </div>
      </div>
    </AbsoluteFill>
  );
};
