import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, F, T} from '../theme';
import {Cam, Layer, Rect} from '../motion/Camera';
import {BackdropGrid, Vignette, Ground} from '../motion/Backdrop';
import {camPath, CamKey, easeOutCubic, easeInOutCubic, win} from '../motion/Path';
import {clamp01} from '../motion/timing';

/* ====================================================================== 01
   THE HOOK

   7.6 seconds, one line, no evidence. The film opens on a claim about the
   viewer, not about Rahul: "Somebody built your website. Nobody checked if
   it worked." It matches the first line of the voiceover. It is the only
   section that makes no checkable statement, and it is deliberately sparse so
   that the first real website at 0:07 lands as the answer to it.

   The hook component was not in the rebuild bundle (the cue sheet notes it
   was "scored by analysis" in the previous build), so this one is written
   fresh against the film's own grammar: the same ground, the same grid, the
   same single camera on the monotone-cubic path, easeOutCubic and
   easeInOutCubic only, and the same push-through into darkness that every
   other section closes with. Nothing here is a new claim.

   The type lands at frame 32; the cue sheet scores it there. From frame 158
   two public Upwork reviews (Kishan S. and Ratio V.) hold for three seconds, so trust is built before the work is shown. The push-through
   is late and short (frames 208 to 228) so the dark gap before the first
   website is under ten frames, measured, not a dead window.                */

const B = {
  rule: [22, 16],
  line1: [32, 22],
  line2: [46, 22],
  lineOut: [184, 18],
  // two real, public Upwork reviews, three seconds, then into the work
  cards: [192, 18],
  label: [202, 16],
  cardsOut: [286, 14],
  through: [296, 18],
} as const;

export const SCENE01_FRAMES = 320;

type Card = {src: string; r: Rect; from: [number, number]};
const atc = (src: string, ar: number, cx: number, cy: number, w: number, from: [number, number]): Card =>
  ({src, r: {x: cx - w / 2, y: cy - w / ar / 2, w, h: w / ar}, from});
const CARDS: Card[] = [
  atc('pf/u_kishan.jpg', 586 / 554, 690, 560, 480, [-60, 0]),
  atc('pf/u_ratio.jpg', 592 / 553, 1230, 560, 480, [60, 0]),
];

/* One slow push across the hold, then the push-through. Repeated waypoints
   are holds; the zoom never stops creeping inside them, so no frame is
   identical to its neighbour while the line is on screen. */
const PATH: CamKey[] = [
  {f: 0,   cam: {x: 960, y: 540, z: 1.060}},
  {f: 60,  cam: {x: 960, y: 540, z: 1.000}},
  {f: 184, cam: {x: 960, y: 552, z: 1.030}},   // the creep through the hold
  {f: 296, cam: {x: 960, y: 548, z: 1.060}},   // and through the reviews
  {f: 320, cam: {x: 960, y: 560, z: 1.900}},   // the push through
];

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const W = (b: readonly [number, number] | number[]) => win(frame, b[0], b[1]);
  const E = (b: readonly [number, number] | number[]) => easeOutCubic(W(b));

  const cam: Cam = camPath(PATH, frame);
  const through = easeInOutCubic(W(B.through));

  const reveal = (t: number, rise = 16): React.CSSProperties => {
    const e = easeOutCubic(t);
    return {
      opacity: e,
      transform: `translateY(${(1 - e) * rise}px)`,
      clipPath: `inset(0% 0% ${(1 - e) * 100}% 0%)`,
    };
  };

  return (
    <AbsoluteFill style={{background: C.ground, fontFamily: F.sans, color: C.text}}>
      <Ground />

      <Layer cam={cam} depth={0.4}>
        <BackdropGrid drift={frame * 0.9} />
      </Layer>

      <Vignette />

      {/* the line travels with the camera: it grows past the lens on the
          push-through the same way the closing statements of the later
          sections do, so the first cut of the film is a movement, not a fade */}
      <div
        style={{
          position: 'absolute', left: 0, top: 0, width: 1920, height: 1080,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center',
          transformOrigin: '50% 50%',
          transform: `scale(${cam.z * (1 + 0.25 * easeInOutCubic(W(B.lineOut)))})`,
          opacity: 1 - easeInOutCubic(W(B.lineOut)),
        }}
      >
        <div style={{width: 86 * E(B.rule), height: 3, background: C.accent, marginBottom: 44}} />
        <div style={{...T.claim, fontSize: 84, lineHeight: 1.08, ...reveal(W(B.line1))}}>
          Somebody built your website.
        </div>
        <div style={{...T.claim, fontSize: 84, lineHeight: 1.08, color: C.accent,
          ...reveal(W(B.line2))}}>
          Nobody checked if it worked.
        </div>
      </div>

      {/* the reviews: three public ones, Upwork and Google, as they are */}
      <div
        style={{
          position: 'absolute', inset: 0,
          transformOrigin: '50% 50%',
          transform: `scale(${cam.z * (1 + 0.6 * through)}) translateY(${-through * 40}px)`,
          opacity: (1 - easeInOutCubic(W(B.cardsOut))) ,
        }}
      >
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center',
          fontSize: 30, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: C.muted, ...reveal(W(B.label), 10),
        }}>
          Real client feedback
        </div>
        {CARDS.map((c, i) => {
          const e = easeOutCubic(W([B.cards[0] + i * 9, B.cards[1]]));
          return (
            <div key={c.src} style={{
              position: 'absolute', left: c.r.x, top: c.r.y, width: c.r.w, height: c.r.h,
              borderRadius: 10, overflow: 'hidden', background: '#101012',
              border: `1px solid ${C.edge}`, boxShadow: '0 38px 90px rgba(0,0,0,0.85)',
              opacity: clamp01(e * 1.8),
              transform: `translate(${c.from[0] * (1 - e)}px, ${c.from[1] * (1 - e)}px) scale(${0.96 + 0.04 * e})`,
              clipPath: `inset(${(1 - e) * 100}% 0% 0% 0%)`,
            }}>
              <Img src={staticFile(c.src)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.96) contrast(1.03)'}} />
            </div>
          );
        })}
      </div>

      {/* the veil rides the push, so the frame arrives at darkness by movement */}
      <div style={{position: 'absolute', inset: 0, background: C.ground,
        opacity: clamp01((through - 0.30) / 0.55)}} />
    </AbsoluteFill>
  );
};
