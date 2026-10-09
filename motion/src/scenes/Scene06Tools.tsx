import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {Vignette, Ground} from '../motion/Backdrop';
import {easeOutCubic, easeInOutCubic, win} from '../motion/Path';
import {clamp01} from '../motion/timing';

/* ====================================================================== 06
   THE RANGE — WHAT HE BUILDS IN

   Replaces the numbers scene, Rahul's direction 4 October: cut everything
   before the 10 second mark of the closing sequence, centre the content, and
   put the toolkit in front of the outro with a line that converts.

   ON THE REVERSAL. His Scene 06 brief said "Do NOT list technologies." This
   is a deliberate change of mind, not a lapse. It is defensible because the
   list now has a beat of its own rather than crowding the closing personal
   moment, which is what that instruction was protecting.

   WHAT THIS COSTS AND WHY IT IS STILL SOUND. The scene it replaces was a
   recap, by its own design note: "nothing here is a new claim". The actual
   proof is not lost, because Scene 02 shows the Edit Lobby report and Scene
   03 shows the KSUNCH revenue chart in their real form. What goes is the
   summary of them. What arrives is something the film did not otherwise
   carry at all: the range of platforms, which is a real buying question on
   a freelance marketplace and is not answered anywhere in Scenes 01 to 05.

   ON THE CLAIM. These are Rahul's own stated tools. A person naming the
   platforms they work in is a first-person claim and needs no document, which
   is a different thing entirely from a metric. Nothing is added to the list
   that he did not name. He should be able to show work in each if asked.

   TYPE SIZES. Set against the lesson from the previous build: the smallest
   text here renders at 34px cap height, about 3.1% of frame height, against
   the roughly 2.5% floor for readable body text in video. Nothing in this
   scene depends on text a viewer cannot read at player size.             */

/** Exactly the platforms Rahul named. Nothing invented, nothing padded. */
const ROW_A = ['Webflow', 'Framer', 'Wix', 'WordPress'];
const ROW_B = ['Shopify', 'Lovable', 'Claude Code'];
const TOOLS = [...ROW_A, ...ROW_B];

/** Staggered entrance, left to right, top row first. */
const TOOL_AT = (i: number) => 70 + i * 9;

const B = {
  up: [0, 16],
  /* The first line starts almost at once. Scene 05 hands straight into this
     scene, and an earlier cut left 22 frames of empty ground here before
     anything arrived. */
  lineA: [6, 24],
  lineB: [24, 24],
  rule: [54, 18],
  /* fades right up to the last frame: the outro's first line starts on its
     own frame 0, so the two scenes hand over with no empty frame between. */
  out: [176, 24],
} as const;

export const SCENE06_FRAMES = 200;

const Tool: React.FC<{name: string; t: number}> = ({name, t}) => {
  const e = easeOutCubic(t);
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 48,
      fontWeight: 700,
      letterSpacing: '0.01em',
      color: C.text,
      whiteSpace: 'nowrap',
      opacity: e,
      transform: `translateY(${(1 - e) * 14}px)`,
      clipPath: `inset(0% 0% ${(1 - e) * 100}% 0%)`,
    }}>
      {name}
    </span>
  );
};

export const Scene06Tools: React.FC = () => {
  const frame = useCurrentFrame();
  const W = (b: readonly [number, number] | number[]) => win(frame, b[0], b[1]);
  const E = (b: readonly [number, number] | number[]) => easeOutCubic(W(b));
  const SE = (b: readonly [number, number] | number[]) => easeInOutCubic(W(b));

  /* The only motion. 100% to 102.6% across the scene, eased: felt, not seen,
     and enough that no two frames are identical during the holds. */
  const push = 1 + 0.026 * easeInOutCubic(clamp01(frame / SCENE06_FRAMES));

  const live = SE(B.up) * (1 - SE(B.out));

  const reveal = (t: number, rise = 12): React.CSSProperties => {
    const e = easeOutCubic(t);
    return {
      opacity: e,
      transform: `translateY(${(1 - e) * rise}px)`,
      clipPath: `inset(0% 0% ${(1 - e) * 100}% 0%)`,
    };
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    gap: 58,
    flexWrap: 'nowrap',
  };

  return (
    <AbsoluteFill style={{background: C.ground, fontFamily: F.sans, color: C.text}}>
      <Ground />

      <AbsoluteFill style={{
        opacity: live,
        transform: `scale(${push})`,
        transformOrigin: '50% 50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        {/* the line that does the converting */}
        <div style={{
          fontSize: 64, fontWeight: 700, lineHeight: 1.2,
          letterSpacing: '-0.012em', color: C.text,
          ...reveal(W(B.lineA)),
        }}>
          Your project decides the platform.
        </div>
        <div style={{
          fontSize: 64, fontWeight: 700, lineHeight: 1.2,
          letterSpacing: '-0.012em', color: C.muted,
          ...reveal(W(B.lineB)),
        }}>
          Not the other way round.
        </div>

        <div style={{
          width: 86 * E(B.rule), height: 3, background: C.accent,
          marginTop: 62, marginBottom: 58,
        }} />

        {/* the proof of that line: the platforms he actually works in */}
        <div style={{...rowStyle, marginBottom: 30}}>
          {ROW_A.map((n, i) => (
            <Tool key={n} name={n} t={W([TOOL_AT(i), 16])} />
          ))}
        </div>
        <div style={rowStyle}>
          {ROW_B.map((n, i) => (
            <Tool key={n} name={n} t={W([TOOL_AT(i + ROW_A.length), 16])} />
          ))}
        </div>
      </AbsoluteFill>

      <Vignette />
    </AbsoluteFill>
  );
};

export const SCENE06_TOOL_COUNT = TOOLS.length;
