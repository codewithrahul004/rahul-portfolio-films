import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, T} from '../theme';
import {Cam, Layer, Rect, camLerp, frameOn, sub} from '../motion/Camera';
import {EvidencePanel} from '../motion/Evidence';
import {HighlightRegion, Connector} from '../motion/Annotate';
import {DataCounter, PlanBar, DeltaBadge} from '../motion/Data';
import {RevealText, RollText, Rule} from '../motion/Type';
import {BackdropGrid, ColumnScrim, Vignette, Ground} from '../motion/Backdrop';
import {GLIDE, SETTLE, SNAP, seg, remap} from '../motion/timing';

// ---------------------------------------------------------------- world
// The two captures are the same Framer screen on two different months, framed
// identically, so they register pixel to pixel. That is what makes the morph
// honest: nothing moves except the number that actually changed.
const PANEL: Rect = {x: 900, y: 300, w: 1220, h: 550};

const R_JUL_VALUE = sub(PANEL, [0.012, 0.512, 0.142, 0.628]); // "287.0GB"
const R_JUL_PLAN = sub(PANEL, [0.383, 0.512, 0.499, 0.628]); // "300GB"
const R_AUG_VALUE = sub(PANEL, [0.012, 0.512, 0.12, 0.628]); // "20.1GB"

// ---------------------------------------------------------------- cameras
const CAM_IN: Cam = {x: 1080, y: 560, z: 0.88};
const CAM_WIDE: Cam = {x: 1080, y: 560, z: 0.95};
// Push that stays locked to the figure it is pushing into.
const CAM_TIGHT: Cam = frameOn(R_JUL_VALUE, 878, 591, 1.5);
const CAM_REST: Cam = frameOn(R_JUL_VALUE, 892, 596, 1.42);

// ---------------------------------------------------------------- beats
const B = {
  panelEnter: [0, 15] as const,
  rule: [6, 12] as const,
  eyebrow: [9, 14] as const,
  count: [12, 24] as const,
  ringJulValue: [22, 12] as const,
  ringJulPlan: [27, 12] as const,
  connector: [29, 16] as const,
  bar: [24, 16] as const,
  camIn: [0, 16] as const,
  camPush: [16, 34] as const,
  camRest: [50, 58] as const,
  morph: [50, 26] as const,
  ringAug: [72, 12] as const,
  delta: [80, 16] as const,
};

export const BandwidthMorph: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ---- camera: one continuous move, never a cut
  const pIn = seg(frame, fps, B.camIn[0], B.camIn[1], GLIDE);
  const pPush = seg(frame, fps, B.camPush[0], B.camPush[1], GLIDE);
  const pRest = seg(frame, fps, B.camRest[0], B.camRest[1], GLIDE);
  let cam = camLerp(CAM_IN, CAM_WIDE, pIn);
  cam = camLerp(cam, CAM_TIGHT, pPush);
  cam = camLerp(cam, CAM_REST, pRest);

  // ---- the morph. One gesture drives the screenshot, the figure and the bar.
  // The wipe travels top to bottom. The value row sits at 0.512..0.628 of the
  // panel, so everything below is keyed to the wipe's own progress rather than
  // to the clock: the figure, the bar and the label change exactly as the lit
  // edge crosses the pixels they are quoting. Nothing ever disagrees with the
  // screenshot it is sitting next to.
  const wipe = seg(frame, fps, B.morph[0], B.morph[1], GLIDE);
  const transform = remap(wipe, 0.512, 0.628); // exactly the value row
  const julFade = 1 - remap(wipe, 0.50, 0.60); // old rings leave as the edge lands
  const labelRoll = remap(wipe, 0.55, 0.74); // july -> august
  const edgeOpacity = Math.min(1, wipe / 0.06) * Math.min(1, (1 - wipe) / 0.14);

  // ---- figure: it arrives already correct and is only ever changed by the
  // morph. A count-up from zero would put a number on screen that contradicts
  // the evidence behind it, so there isn't one.
  const pFigure = seg(frame, fps, B.count[0], B.count[1], SETTLE);
  const value = 287.0 + (20.1 - 287.0) * transform;

  const pBar = seg(frame, fps, B.bar[0], B.bar[1], GLIDE);
  const pRingJulV = seg(frame, fps, B.ringJulValue[0], B.ringJulValue[1], SNAP) * julFade;
  const pRingJulP = seg(frame, fps, B.ringJulPlan[0], B.ringJulPlan[1], SNAP) * julFade;
  const pConn = seg(frame, fps, B.connector[0], B.connector[1], GLIDE) * julFade;
  const pRingAug = seg(frame, fps, B.ringAug[0], B.ringAug[1], SNAP);
  const pDelta = seg(frame, fps, B.delta[0], B.delta[1], SETTLE);
  const pPanel = seg(frame, fps, B.panelEnter[0], B.panelEnter[1], GLIDE);

  const drift = frame * 0.9;

  return (
    <AbsoluteFill style={{background: C.ground, fontFamily: F.sans, color: C.text}}>
      <Ground />

      {/* backdrop sits further away, so it parallaxes against the evidence */}
      <Layer cam={cam} depth={0.4}>
        <BackdropGrid drift={drift} />
      </Layer>

      {/* the real evidence, in world space, under the camera */}
      <Layer cam={cam} depth={1}>
        <EvidencePanel
          rect={PANEL}
          src="e1_jul.jpg"
          overlaySrc="e2_aug.jpg"
          wipe={wipe}
          wipeDir="down"
          edgeOpacity={edgeOpacity}
          enter={pPanel}
          enterDir="right"
        />
      </Layer>

      <Vignette />
      <ColumnScrim width={1020} strength={0.92} />

      {/* annotations are projected into screen space so their weight is constant */}
      <HighlightRegion rect={R_JUL_VALUE} cam={cam} progress={pRingJulV} />
      <HighlightRegion rect={R_JUL_PLAN} cam={cam} progress={pRingJulP} />
      <HighlightRegion rect={R_AUG_VALUE} cam={cam} progress={pRingAug} />
      <Connector from={{x: 580, y: 530}} toRect={R_JUL_VALUE} cam={cam} progress={pConn} />

      {/* typography column */}
      <div style={{position: 'absolute', left: 140, top: 282, width: 540}}>
        <Rule progress={seg(frame, fps, B.rule[0], B.rule[1], GLIDE)} />
        <RevealText
          progress={seg(frame, fps, B.eyebrow[0], B.eyebrow[1], GLIDE)}
          rise={12}
        >
          <div style={{...T.section, fontSize: 22}}>Edit Lobby</div>
          <div style={{height: 10}} />
          <RollText
            from="framer hosting dashboard · july 2026"
            to="framer hosting dashboard · august 2026"
            progress={labelRoll}
            style={{...T.eyebrow, fontSize: 17, whiteSpace: 'nowrap'}}
            height={26}
          />
        </RevealText>
      </div>

      <div style={{position: 'absolute', left: 140, top: 452, width: 560}}>
        <div
          style={{
            opacity: pFigure,
            transform: `translateY(${(1 - pFigure) * 26}px) scale(${1.05 - 0.05 * pFigure})`,
            transformOrigin: '0% 50%',
          }}
        >
          <DataCounter
            from={value}
            to={value}
            progress={1}
            decimals={1}
            suffix="GB"
            size={120}
            color={transform > 0.5 ? C.accent : C.text}
          />
        </div>
      </div>

      <div style={{position: 'absolute', left: 140, top: 636, width: 460}}>
        <PlanBar value={value} limit={300} width={460} reveal={pBar} label="bandwidth used" />
      </div>

      <div style={{position: 'absolute', left: 140, top: 724}}>
        <DeltaBadge text="−93.0% vs July" progress={pDelta} />
      </div>
    </AbsoluteFill>
  );
};

export const BANDWIDTH_MORPH_FRAMES = 108;
