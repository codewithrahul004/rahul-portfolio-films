import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {Vignette, Ground} from '../motion/Backdrop';
import {easeOutCubic, easeInOutCubic, win} from '../motion/Path';
import {clamp01} from '../motion/timing';

/* ====================================================================== 07
   THE CLOSE — CENTRED

   Rahul's direction, 4 October: keep only what ran after the 10 second mark
   of the previous closing sequence, and centre it. That cut the 1.6 seconds
   of empty plate at the head of this scene, so the first line now arrives
   almost immediately.

   NO PERSON IN THIS VERSION, AND THAT IS A CONSEQUENCE OF CENTRING, NOT A
   SEPARATE DECISION. The previous layout put every line in the lower left
   precisely so that frame right stayed clear for footage of Rahul, and the
   whole of SCENE06-SHOT-SPEC.md is built around that composition. Centred
   type lands exactly where his face would be. The two cannot coexist.

   So the asymmetric key light that stood in for him is gone too, replaced by
   a centred ambient field, because a light shaped for a person sitting at
   frame right reads as a mistake once nothing is sitting there.

   TO PUT HIM BACK: restore the lower-left block and the Plate component from
   git history, or ask and I will rebuild it in ten minutes. This is a
   reversible fork, not a discarded branch. The shot spec is unchanged and
   still correct for that version.                                        */

const B = {
  up: [0, 20],

  name: [0, 15], nameOut: [70, 20],
  claim: [78, 24], claim2: [90, 24], claimOut: [146, 20],
  ctaRule: [150, 18], cta: [154, 26],
} as const;

export const SCENE07_FRAMES = 232;

/** A centred field. Symmetric, because the type is now centred. */
const Field: React.FC = () => (
  <>
    <div style={{position: 'absolute', inset: 0, background: '#08080A'}} />
    <div style={{
      position: 'absolute', inset: 0,
      background:
        'radial-gradient(46% 58% at 50% 46%, rgba(96,112,138,0.22) 0%, rgba(48,58,74,0.09) 46%, rgba(0,0,0,0) 76%)',
    }} />
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, height: 300,
      background: 'linear-gradient(0deg, rgba(13,15,19,0.92) 0%, rgba(13,15,19,0) 100%)',
    }} />
  </>
);

export const Scene07Close: React.FC = () => {
  const frame = useCurrentFrame();
  const W = (b: readonly [number, number] | number[]) => win(frame, b[0], b[1]);
  const E = (b: readonly [number, number] | number[]) => easeOutCubic(W(b));
  const SE = (b: readonly [number, number] | number[]) => easeInOutCubic(W(b));

  /* 100% to 104% across the whole scene. Felt, not seen, and enough that no
     two frames are identical while a line is holding. */
  const push = 1 + 0.04 * easeInOutCubic(clamp01(frame / SCENE07_FRAMES));

  const reveal = (t: number, rise = 12): React.CSSProperties => {
    const e = easeOutCubic(t);
    return {
      opacity: e,
      transform: `translateY(${(1 - e) * rise}px)`,
      clipPath: `inset(0% 0% ${(1 - e) * 100}% 0%)`,
    };
  };

  /** Every beat occupies the same centred slot and hands over to the next. */
  const slot: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  };

  return (
    <AbsoluteFill style={{background: C.ground, fontFamily: F.sans, color: C.text}}>
      <Ground />

      <div style={{
        position: 'absolute', inset: 0, opacity: SE(B.up),
        transform: `scale(${push})`, transformOrigin: '50% 50%',
      }}>
        <Field />
      </div>

      <Vignette />

      <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`,
        transformOrigin: '50% 50%'}}>

        {/* 1. who he is */}
        {/* Not gated by the field fade as well: double-gating the name made
            it arrive so slowly that the join with Scene 06 showed an empty
            frame for 13 frames. */}
        <div style={{...slot, opacity: 1 - E(B.nameOut)}}>
          <div style={{
            fontSize: 92, fontWeight: 700, lineHeight: 1,
            letterSpacing: '-0.02em',
            ...reveal(W(B.name), 10),
          }}>
            Rahul
          </div>
          <div style={{
            fontSize: 34, letterSpacing: '0.24em', marginTop: 28,
            color: C.muted, fontWeight: 400,
            opacity: easeOutCubic(clamp01(W(B.name) * 1.5 - 0.5)),
          }}>
            Web &#183; SaaS &#183; AI &#183; Ecommerce &#183; Digital Experiences
          </div>
        </div>

        {/* 2. the offer */}
        <div style={{...slot, opacity: 1 - E(B.claimOut)}}>
          <div style={{
            fontSize: 66, fontWeight: 700, lineHeight: 1.26,
            letterSpacing: '-0.01em',
            ...reveal(W(B.claim), 12),
          }}>
            You bring the problem.
          </div>
          <div style={{
            fontSize: 66, fontWeight: 700, lineHeight: 1.26,
            letterSpacing: '-0.01em',
            ...reveal(W(B.claim2), 12),
          }}>
            I handle the build.
          </div>
        </div>

        {/* 3. the close */}
        <div style={slot}>
          <div style={{
            width: 76 * E(B.ctaRule), height: 3, background: C.accent,
            marginBottom: 32,
          }} />
          <div style={{
            fontSize: 76, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: C.accent,
            ...reveal(W(B.cta), 12),
          }}>
            Let&rsquo;s build.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
