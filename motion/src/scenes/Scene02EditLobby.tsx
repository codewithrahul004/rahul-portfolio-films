import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, T} from '../theme';
import {Cam, Layer, Rect, camLerp, frameOn, sub} from '../motion/Camera';
import {EvidencePanel} from '../motion/Evidence';
import {HighlightRegion, Connector} from '../motion/Annotate';
import {DataCounter, PlanBar, DeltaBadge, TimeCounter} from '../motion/Data';
import {RollText} from '../motion/Type';
import {BackdropGrid, ColumnScrim, Vignette, Ground} from '../motion/Backdrop';
import {BeatColumn, SharedFigure, rectLerp} from '../motion/Beat';
import {GLIDE, SETTLE, SNAP, seg, remap, clamp01, Cfg} from '../motion/timing';

/* ------------------------------------------------------------------ world
   Every piece of evidence has a fixed place in one workspace, laid out along a
   descending diagonal. The scene is a single camera move through that space,
   which is why nothing needs to fade: we are always in the same room, just at
   a different distance from it.                                              */

const P1: Rect = {x: 900, y: 300, w: 1220, h: 550}; // framer hosting, jul/aug
const P2: Rect = {x: 2560, y: 620, w: 1420, h: 717}; // bandwidth per period
const P3: Rect = {x: 4420, y: 980, w: 1120, h: 857}; // what changed: video
const P4: Rect = {x: 5960, y: 1420, w: 900, h: 813}; // core web vitals
const P5: Rect = {x: 7260, y: 1820, w: 1380, h: 755}; // session duration
const P6: Rect = {x: 9080, y: 2200, w: 1480, h: 848}; // source screenshots

// Regions inside the real captures. Nothing is redrawn; these only say where
// to point.
const R_JUL_VALUE = sub(P1, [0.012, 0.512, 0.142, 0.628]);
const R_JUL_PLAN = sub(P1, [0.383, 0.512, 0.499, 0.628]);
const R_AUG_VALUE = sub(P1, [0.012, 0.512, 0.12, 0.628]);

const R_CH_287 = sub(P2, [0.196, 0.298, 0.288, 0.362]);
const R_CH_AUG = sub(P2, [0.478, 0.7, 0.575, 0.815]);

const R_VID_JUL = sub(P3, [0.79, 0.4, 0.955, 0.475]);
const R_VID_AUG = sub(P3, [0.832, 0.496, 0.952, 0.57]);
const R_VID_PCT = sub(P3, [0.33, 0.828, 0.52, 0.92]);

const R_CWV_LCP = sub(P4, [0.065, 0.348, 0.308, 0.505]);
const R_CWV_PASS = sub(P4, [0.02, 0.01, 0.735, 0.125]);

const R_SES_27 = sub(P5, [0.868, 0.058, 0.978, 0.13]);

/* ----------------------------------------------------------------- cameras
   Each stop sits closer than before, so the evidence reads inside a second. */
const CAM_IN: Cam = {x: 1080, y: 560, z: 0.88};
const CAM_WIDE: Cam = {x: 1080, y: 560, z: 0.95};
const CAM_TIGHT: Cam = frameOn(R_JUL_VALUE, 878, 591, 1.5);
const CAM_REST: Cam = frameOn(R_JUL_VALUE, 892, 596, 1.42);
const CAM_P2: Cam = frameOn(R_CH_AUG, 1330, 620, 1.3);
const CAM_P3A: Cam = frameOn(R_VID_JUL, 1310, 420, 1.42);
const CAM_P3B: Cam = frameOn(R_VID_AUG, 1310, 545, 1.42);
const CAM_P4A: Cam = frameOn(R_CWV_LCP, 1300, 540, 1.82);
const CAM_P4B: Cam = frameOn(R_CWV_PASS, 1290, 395, 1.16);
const CAM_P5: Cam = frameOn(P5, 1330, 560, 1.03);
const CAM_P6: Cam = frameOn(P6, 1440, 560, 0.8);
// The last move is forward, not away: the camera travels through the closing
// statement and into the dark, which is where Scene 03 picks up.
const CAM_THROUGH: Cam = {x: P6.x + P6.w * 0.34, y: P6.y + P6.h * 0.46, z: 1.95};

/* ------------------------------------------------------------------- beats */
const K = {
  // beat 1, the approved morph, with the dead hold at its tail removed
  camIn: [0, 16], camPush: [16, 34], camRest: [50, 56],
  panelEnter: [0, 15], rule: [6, 12], label: [9, 14], figure: [12, 24],
  ringJulV: [22, 12], ringJulP: [27, 12], conn: [29, 16], bar: [24, 16],
  morph: [50, 26], ringAug: [70, 12],

  camP2: [90, 34], p2Enter: [96, 22], figTravel: [98, 24],
  ringCh287: [110, 10], ringChAug: [122, 10], fig93: [126, 16], claim93: [130, 16],

  camP3a: [152, 30], p3Enter: [156, 22], figVid: [170, 14],
  vidTravel: [182, 24], camP3b: [180, 26], ringVidPct: [206, 10], claimVid: [178, 16],

  camP4a: [227, 30], p4Enter: [231, 22], figLcp: [244, 14], ringLcp: [249, 10],
  camP4b: [266, 26], ringPass: [275, 10], claimPass: [273, 16],

  camP5: [302, 32], p5Draw: [306, 32], figSes: [314, 14],
  ringSes: [342, 10], deltaSes: [346, 14], claimSes: [314, 16],

  camP6: [377, 32], p6Enter: [381, 24], statement: [392, 20], statement2: [399, 20],

  // the camera pushes through the closing line into the next chapter
  through: [428, 22],

  // clean exits, so a beat is gone before the next one speaks
  out1: [92, 8], out2: [154, 8], out3: [229, 8],
  out4: [304, 8], out5: [379, 8],
  // each panel recedes shortly after its own beat, once the camera has left it
  offP1: [112, 12], offP2: [174, 12], offP3: [249, 12], offP4: [324, 12], offP5: [398, 10],
} as const;

export const Scene02EditLobby: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const S = (b: readonly [number, number] | number[], cfg: Cfg = GLIDE) =>
    seg(frame, fps, b[0], b[1], cfg);
  const OFF = (b: readonly [number, number] | number[]) => 1 - S(b, SNAP);

  /* ---- one continuous camera -------------------------------------------- */
  let cam = camLerp(CAM_IN, CAM_WIDE, S(K.camIn));
  cam = camLerp(cam, CAM_TIGHT, S(K.camPush));
  cam = camLerp(cam, CAM_REST, S(K.camRest));
  cam = camLerp(cam, CAM_P2, S(K.camP2));
  cam = camLerp(cam, CAM_P3A, S(K.camP3a));
  cam = camLerp(cam, CAM_P3B, S(K.camP3b));
  cam = camLerp(cam, CAM_P4A, S(K.camP4a));
  cam = camLerp(cam, CAM_P4B, S(K.camP4b));
  cam = camLerp(cam, CAM_P5, S(K.camP5));
  cam = camLerp(cam, CAM_P6, S(K.camP6));
  const through = S(K.through);
  cam = camLerp(cam, CAM_THROUGH, through);

  /* ---- beat 1: 287.0 -> 20.1, keyed to the wipe edge --------------------- */
  const wipe = S(K.morph);
  const transform = remap(wipe, 0.512, 0.628);
  const julFade = 1 - remap(wipe, 0.5, 0.6);
  const labelRoll = remap(wipe, 0.55, 0.74);
  const edgeOpacity = Math.min(1, wipe / 0.06) * Math.min(1, (1 - wipe) / 0.14);
  const v1 = 287.0 + (20.1 - 287.0) * transform;
  const pFigure = S(K.figure, SETTLE);

  /* ---- beat 2: the figure converges on the same value in the report ------ */
  const travel = S(K.figTravel);

  /* ---- beat 3: the ring walks from July's row to August's ---------------- */
  const vidT = S(K.vidTravel);
  const vidRect = rectLerp(R_VID_JUL, R_VID_AUG, vidT);
  const vVid = 273.3 + (9.6 - 273.3) * vidT;

  /* ---- beat 5: the real line draws itself; the clock steps through the
         three periods the chart actually plots, never between them --------- */
  const draw = S(K.p5Draw);
  const sesSec = draw >= 0.9 ? 252 : draw >= 0.5 ? 224 : 198; // 4:12 / 3:44 / 3:18

  /* ---- which metric owns the figure slot --------------------------------- */
  const show1 = pFigure * (1 - clamp01(travel)) * OFF(K.out1);
  const show93 = S(K.fig93, SETTLE) * OFF(K.out2);
  const showVid = S(K.figVid, SETTLE) * OFF(K.out3);
  const showLcp = S(K.figLcp, SETTLE) * OFF(K.out4);
  const showSes = S(K.figSes, SETTLE) * OFF(K.out5);

  const drift = frame * 0.9;

  return (
    <AbsoluteFill style={{background: C.ground, fontFamily: F.sans, color: C.text}}>
      <Ground />

      <Layer cam={cam} depth={0.4}>
        <BackdropGrid drift={drift} />
      </Layer>

      {/* Evidence we have finished reading recedes, so a panel from an earlier
          beat never sits behind the type of a later one. */}
      <Layer cam={cam} depth={1}>
        <div style={{opacity: OFF(K.offP1)}}>
          <EvidencePanel
            rect={P1} src="e1_jul.jpg" overlaySrc="e2_aug.jpg"
            wipe={wipe} wipeDir="down" edgeOpacity={edgeOpacity}
            enter={S(K.panelEnter)} enterDir="right"
          />
        </div>
        <div style={{opacity: OFF(K.offP2)}}>
          <EvidencePanel rect={P2} src="e3_chart.jpg" enter={S(K.p2Enter)} enterDir="right" />
        </div>
        <div style={{opacity: OFF(K.offP3)}}>
          <EvidencePanel rect={P3} src="e4_video.jpg" enter={S(K.p3Enter)} enterDir="down" />
        </div>
        <div style={{opacity: OFF(K.offP4)}}>
          <EvidencePanel rect={P4} src="e5_cwv.jpg" enter={S(K.p4Enter)} enterDir="right" />
        </div>
        <div style={{opacity: OFF(K.offP5)}}>
          <EvidencePanel rect={P5} src="e6_session.jpg" enter={draw} enterDir="right" />
        </div>
        <EvidencePanel rect={P6} src="e7_sources.jpg" enter={S(K.p6Enter)} enterDir="up" />
      </Layer>

      <Vignette />
      <ColumnScrim width={1260} strength={0.94} />

      {/* annotations, projected so their weight never changes with the zoom */}
      <HighlightRegion rect={R_JUL_VALUE} cam={cam} progress={S(K.ringJulV, SNAP) * julFade} />
      <HighlightRegion rect={R_JUL_PLAN} cam={cam} progress={S(K.ringJulP, SNAP) * julFade} />
      <HighlightRegion rect={R_AUG_VALUE} cam={cam} progress={S(K.ringAug, SNAP) * OFF(K.out1)} />
      <Connector from={{x: 580, y: 530}} toRect={R_JUL_VALUE} cam={cam}
        progress={S(K.conn) * julFade} />

      <HighlightRegion rect={R_CH_287} cam={cam} progress={S(K.ringCh287, SNAP) * OFF(K.out2)} />
      <HighlightRegion rect={R_CH_AUG} cam={cam} progress={S(K.ringChAug, SNAP) * OFF(K.out2)} />

      <HighlightRegion rect={vidRect} cam={cam} progress={S(K.figVid, SNAP) * OFF(K.out3)} />
      <HighlightRegion rect={R_VID_PCT} cam={cam} progress={S(K.ringVidPct, SNAP) * OFF(K.out3)} />

      <HighlightRegion rect={R_CWV_LCP} cam={cam} progress={S(K.ringLcp, SNAP) * OFF(K.out4)} />
      <HighlightRegion rect={R_CWV_PASS} cam={cam} progress={S(K.ringPass, SNAP) * OFF(K.out4)} />

      <HighlightRegion rect={R_SES_27} cam={cam} progress={S(K.ringSes, SNAP) * OFF(K.out5)} />

      {/* ---------------------------------------------------------- column */}
      <BeatColumn
        rule={S(K.rule) * (1 - through)}
        label={<span style={{opacity: 1 - through}}>Edit Lobby</span>}
        top={282}
        source={
          <RollText
            from="framer hosting dashboard &#183; july 2026"
            to="framer hosting dashboard &#183; august 2026"
            progress={labelRoll}
            style={{...T.eyebrow, fontSize: 17, whiteSpace: 'nowrap'}}
            height={26}
          />
        }
        sourceProgress={S(K.label) * OFF(K.out1)}
      />

      <div style={{position: 'absolute', left: 140, top: 358, width: 640}}>
        <div style={{...T.eyebrow, fontSize: 17, position: 'absolute', top: 0,
          opacity: S(K.ringChAug) * OFF(K.out2)}}>
          editlobby.com performance report
        </div>
        <div style={{...T.eyebrow, fontSize: 17, position: 'absolute', top: 0,
          opacity: S(K.claimVid) * OFF(K.out3)}}>
          the same report &#183; what changed
        </div>
        <div style={{...T.eyebrow, fontSize: 17, position: 'absolute', top: 0,
          opacity: S(K.ringLcp) * OFF(K.out4)}}>
          google core web vitals &#183; editlobby.com
        </div>
        <div style={{...T.eyebrow, fontSize: 17, position: 'absolute', top: 0,
          opacity: S(K.claimSes) * OFF(K.out5)}}>
          editlobby.com performance report
        </div>
      </div>

      {/* ------------------------------------------------- the figure slot */}
      <SharedFigure anchor={{x: 140, y: 452}} travel={travel} toRect={R_CH_AUG} cam={cam}>
        <div
          style={{
            opacity: show1,
            transform: `translateY(${(1 - pFigure) * 26}px) scale(${1.05 - 0.05 * pFigure})`,
            transformOrigin: '0% 50%',
          }}
        >
          <DataCounter from={v1} to={v1} progress={1} decimals={1} suffix="GB" size={120}
            color={transform > 0.5 ? C.accent : C.text} />
        </div>
      </SharedFigure>

      <div style={{position: 'absolute', left: 140, top: 452, opacity: show93}}>
        <span style={{...T.figure, fontSize: 140, color: C.accent}}>93</span>
        <span style={{...T.figure, fontSize: 70, color: C.accent}}>%</span>
      </div>

      <div style={{position: 'absolute', left: 140, top: 452, opacity: showVid}}>
        <DataCounter from={vVid} to={vVid} progress={1} decimals={1} suffix="GB" size={120}
          color={vidT > 0.5 ? C.accent : C.text} />
      </div>

      <div style={{position: 'absolute', left: 140, top: 452, opacity: showLcp}}>
        <span style={{...T.figure, fontSize: 140, color: C.accent}}>1.7</span>
        <span style={{...T.figure, fontSize: 64, color: C.accent}}>s</span>
      </div>

      <div style={{position: 'absolute', left: 140, top: 452, opacity: showSes}}>
        <TimeCounter fromSec={sesSec} toSec={sesSec} progress={1} size={130}
          color={draw >= 0.9 ? C.accent : C.text} />
      </div>

      {/* --------------------------------------------------------- claims */}
      <div style={{position: 'absolute', left: 140, top: 632, width: 620,
        opacity: S(K.bar) * OFF(K.out1)}}>
        <PlanBar value={v1} limit={300} width={460} reveal={1} label="bandwidth used" />
      </div>

      <div style={{position: 'absolute', left: 140, top: 636, width: 600}}>
        <div style={{...T.claim, fontSize: 44, position: 'absolute', top: 0,
          opacity: S(K.claim93) * OFF(K.out2),
          transform: `translateY(${(1 - S(K.claim93)) * 18}px)`}}>
          Less bandwidth,<br />two months running.
        </div>
        <div style={{...T.claim, fontSize: 44, position: 'absolute', top: 0,
          opacity: S(K.claimVid) * OFF(K.out3),
          transform: `translateY(${(1 - S(K.claimVid)) * 18}px)`}}>
          Video, where the<br />saving came from.
        </div>
        <div style={{...T.claim, fontSize: 44, position: 'absolute', top: 0,
          opacity: S(K.figLcp) * OFF(K.out4)}}>
          <RollText from="On mobile." to="Core Web Vitals: passed."
            progress={S(K.claimPass)}
            style={{...T.claim, fontSize: 44, whiteSpace: 'nowrap'}} height={56} />
        </div>
        <div style={{...T.claim, fontSize: 44, position: 'absolute', top: 0,
          opacity: S(K.claimSes) * OFF(K.out5),
          transform: `translateY(${(1 - S(K.claimSes)) * 18}px)`}}>
          Average visit,<br />before and after.
        </div>
      </div>

      <div style={{position: 'absolute', left: 140, top: 790,
        opacity: S(K.deltaSes) * OFF(K.out5)}}>
        <DeltaBadge text="+27.3%" progress={1} />
      </div>

      {/* the veil rides the same push, under the statement, so the closing
          line is the last thing the frame holds */}
      <div style={{position: 'absolute', inset: 0, background: C.ground,
        opacity: clamp01((through - 0.18) / 0.62)}} />

      {/* ------------------------------------------------------- statement
          The closing line is not dismissed; the camera travels through it.
          The statement grows past the lens while the world pushes in behind,
          so the frame arrives at darkness by movement, not by a fade.        */}
      <div
        style={{
          position: 'absolute', left: 140, top: 430, width: 920,
          transformOrigin: '8% 42%',
          transform: `scale(${1 + 1.45 * through}) translate(${-through * 150}px, ${-through * 54}px)`,
          opacity: 1 - clamp01((through - 0.74) / 0.26),
          willChange: 'transform',
        }}
      >
        <div style={{...T.claim, fontSize: 92, lineHeight: 1.06,
          opacity: S(K.statement),
          transform: `translateY(${(1 - S(K.statement)) * 24}px)`}}>
          Every number,
        </div>
        <div style={{...T.claim, fontSize: 92, lineHeight: 1.06, color: C.accent,
          opacity: S(K.statement2),
          transform: `translateY(${(1 - S(K.statement2)) * 24}px)`}}>
          on record.
        </div>
        <div style={{...T.eyebrow, fontSize: 17, marginTop: 28,
          opacity: S(K.statement2) * 0.9 * (1 - clamp01(through / 0.35))}}>
          the raw dashboards, published
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SCENE02_FRAMES = 450;
