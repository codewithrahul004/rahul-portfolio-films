import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, T} from '../theme';
import {Cam, Layer, Rect, camLerp, frameOn, sub} from '../motion/Camera';
import {EvidencePanel} from '../motion/Evidence';
import {HighlightRegion} from '../motion/Annotate';
import {MoneyCounter, DeltaBadge} from '../motion/Data';
import {BackdropGrid, ColumnScrim, Vignette, Ground} from '../motion/Backdrop';
import {BeatColumn, rectLerp} from '../motion/Beat';
import {GLIDE, SETTLE, SNAP, seg, clamp01, Cfg} from '../motion/timing';

/* ------------------------------------------------------------------ world
   Same workspace grammar as Edit Lobby: the evidence is laid out along a
   descending diagonal and the camera travels through it.                    */

const Q1: Rect = {x: 900, y: 320, w: 1390, h: 530}; // the brief, about client
const Q2: Rect = {x: 2760, y: 700, w: 1600, h: 606}; // total revenue, launch week
const Q3: Rect = {x: 4820, y: 1060, w: 1060, h: 871}; // google analytics
const Q6: Rect = {x: 6250, y: 1440, w: 900, h: 893}; // google search result
const Q4: Rect = {x: 7850, y: 1880, w: 1560, h: 475}; // cart recovery
const Q5: Rect = {x: 9600, y: 2220, w: 560, h: 996}; // the real mobile store

// Regions inside the real captures.
const R_90 = sub(Q1, [0.289, 0.311, 0.374, 0.425]); // "90%" in the brief line
const R_19M = sub(Q1, [0.277, 0.921, 0.428, 0.985]); // "1.9M followers"

// The eight daily values the Total Revenue chart actually plots.
const DAILY = [
  {v: 9093, n: [0.065, 0.767, 0.11, 0.808]},
  {v: 30677, n: [0.163, 0.764, 0.214, 0.805]},
  {v: 25481, n: [0.265, 0.772, 0.315, 0.813]},
  {v: 27879, n: [0.366, 0.77, 0.414, 0.811]},
  {v: 222533, n: [0.463, 0.267, 0.519, 0.311]},
  {v: 20285, n: [0.567, 0.789, 0.617, 0.83]},
  {v: 33715, n: [0.664, 0.759, 0.716, 0.8]},
  {v: 41269, n: [0.767, 0.738, 0.818, 0.78]},
] as const;
const R_DAILY = DAILY.map((d) => sub(Q2, d.n as unknown as [number, number, number, number]));
const CUM = DAILY.reduce<number[]>((a, d) => [...a, (a[a.length - 1] ?? 0) + d.v], []);

const R_GA_77 = sub(Q3, [0.785, 0.19, 0.895, 0.292]);
const R_SEO_RESULT = sub(Q6, [0.004, 0.21, 0.63, 0.33]); // ksunch.co.in, the result itself
const R_SEO_LINKS = sub(Q6, [0.031, 0.428, 0.954, 0.931]); // the indexed sitelinks
const R_REC_ABLE = sub(Q4, [0.021, 0.818, 0.125, 0.891]);
const R_REC_ED = sub(Q4, [0.36, 0.818, 0.454, 0.891]);
const R_REC_RATE = sub(Q4, [0.699, 0.818, 0.754, 0.891]);

/* ----------------------------------------------------------------- cameras */
// We arrive still moving, out of the push that closed Edit Lobby.
const CAM_ARRIVE: Cam = frameOn(Q1, 1290, 540, 2.3);
const CAM_Q1: Cam = frameOn(Q1, 1290, 540, 0.95);
const CAM_Q1B: Cam = frameOn(R_90, 1280, 470, 1.78);
const CAM_CHAIN: Cam = frameOn(R_90, 1500, 300, 1.2);
const CAM_REV_A: Cam = frameOn(R_DAILY[0], 980, 650, 1.05);
const CAM_REV_B: Cam = frameOn(R_DAILY[7], 1240, 560, 1.05);
const CAM_GA: Cam = frameOn(R_GA_77, 1310, 470, 1.32);
const CAM_SEO_A: Cam = frameOn(R_SEO_RESULT, 1290, 420, 1.42);
const CAM_SEO_B: Cam = frameOn(R_SEO_LINKS, 1310, 560, 1.18);
const CAM_REC_A: Cam = frameOn(R_REC_ABLE, 1120, 600, 1.5);
const CAM_REC_B: Cam = frameOn(R_REC_ED, 1180, 600, 1.5);
const CAM_REC_C: Cam = frameOn(R_REC_RATE, 1260, 560, 1.22);
const CAM_MOB: Cam = frameOn(Q5, 1390, 540, 0.9);
const CAM_OUT: Cam = frameOn(Q5, 1180, 420, 2.5);

/* ------------------------------------------------------------------- beats */
const K = {
  arrive: [0, 32], q1Enter: [8, 22], title: [12, 18], label: [20, 18],

  camQ1b: [55, 34], ring90: [76, 10], fig90: [82, 16], claim90: [86, 16],
  ring19m: [102, 10],

  camChain: [150, 30], chain: [152, 34], chainClaim: [170, 16],

  camRevA: [195, 30], q2Enter: [198, 24], revStep: [214, 68], claimRev: [272, 16],

  camGa: [295, 30], q3Enter: [298, 22], ringGa: [313, 10], figGa: [317, 16],
  claimGa: [321, 16],

  camSeoA: [352, 26], q6Enter: [354, 20], ringSeoA: [366, 10],
  camSeoB: [374, 22], ringSeoB: [380, 10], claimSeo: [368, 16], seoRoll: [384, 14],

  camRecA: [400, 26], q4Enter: [402, 20], ringRecA: [414, 10],
  recTravel: [424, 20], camRecB: [422, 24], camRecC: [446, 22],
  ringRate: [450, 10], claimRec: [428, 16],

  camMob: [470, 28], q5Enter: [473, 22],
  statement: [484, 18], statement2: [491, 18], sub: [498, 16],
  through: [512, 16],

  // exits
  out1: [148, 8], out2: [193, 8], out3: [293, 8],
  out4: [350, 8], outSeo: [398, 8], out5: [468, 8],
  offQ1: [156, 12], offQ2: [312, 12], offQ3: [372, 12],
  offQ6: [420, 12], offQ4: [486, 12],
} as const;

export const Scene03Ksunch: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const S = (b: readonly [number, number] | number[], cfg: Cfg = GLIDE) =>
    seg(frame, fps, b[0], b[1], cfg);
  const OFF = (b: readonly [number, number] | number[]) => 1 - S(b, SNAP);

  /* ---- one continuous camera, arriving already in motion ----------------- */
  let cam = camLerp(CAM_ARRIVE, CAM_Q1, S(K.arrive));
  cam = camLerp(cam, CAM_Q1B, S(K.camQ1b));
  cam = camLerp(cam, CAM_CHAIN, S(K.camChain));
  const revP = S(K.revStep);
  cam = camLerp(cam, camLerp(CAM_REV_A, CAM_REV_B, revP), S(K.camRevA));
  cam = camLerp(cam, CAM_GA, S(K.camGa));
  cam = camLerp(cam, CAM_SEO_A, S(K.camSeoA));
  cam = camLerp(cam, CAM_SEO_B, S(K.camSeoB));
  cam = camLerp(cam, CAM_REC_A, S(K.camRecA));
  cam = camLerp(cam, CAM_REC_B, S(K.camRecB));
  cam = camLerp(cam, CAM_REC_C, S(K.camRecC));
  cam = camLerp(cam, CAM_MOB, S(K.camMob));
  const through = S(K.through);
  cam = camLerp(cam, CAM_OUT, through);

  /* ---- revenue: the ring steps across each real daily value while the
         total accumulates, so the arithmetic happens on the chart ---------- */
  const step = Math.min(DAILY.length - 1, Math.floor(revP * DAILY.length));
  const revealed = revP > 0.001;
  const total = revealed ? CUM[step] : 0;

  /* ---- recovery: the ring walks from recoverable to recovered ------------ */
  const recT = S(K.recTravel);
  const recRect = rectLerp(R_REC_ABLE, R_REC_ED, recT);
  const recVal = recT >= 0.5 ? 13590 : 178146; // only the two values the slide states

  const drift = frame * 0.9;

  return (
    <AbsoluteFill style={{background: C.ground, fontFamily: F.sans, color: C.text}}>
      <Ground />

      <Layer cam={cam} depth={0.4}>
        <BackdropGrid drift={drift} />
      </Layer>

      <Layer cam={cam} depth={1}>
        <div style={{opacity: OFF(K.offQ1)}}>
          <EvidencePanel rect={Q1} src="k_brief.jpg" enter={S(K.q1Enter)} enterDir="right" tone={0.88} />
        </div>
        <div style={{opacity: OFF(K.offQ2)}}>
          <EvidencePanel rect={Q2} src="k_rev.jpg" enter={S(K.q2Enter)} enterDir="right" tone={0.64} />
        </div>
        <div style={{opacity: OFF(K.offQ3)}}>
          <EvidencePanel rect={Q3} src="k_ga.jpg" enter={S(K.q3Enter)} enterDir="down" tone={0.64} />
        </div>
        <div style={{opacity: OFF(K.offQ6)}}>
          <EvidencePanel rect={Q6} src="k_seo.jpg" enter={S(K.q6Enter)} enterDir="down" tone={0.66} />
        </div>
        <div style={{opacity: OFF(K.offQ4)}}>
          <EvidencePanel rect={Q4} src="k_rec.jpg" enter={S(K.q4Enter)} enterDir="right" tone={0.64} />
        </div>
        <EvidencePanel rect={Q5} src="k_mob.jpg" enter={S(K.q5Enter)} enterDir="up" radius={26} tone={0.74} />
      </Layer>

      <Vignette />
      <ColumnScrim width={980} strength={0.9 * (1 - through * 0.8)} />

      {/* annotations */}
      <HighlightRegion rect={R_90} cam={cam} progress={S(K.ring90, SNAP) * OFF(K.out1)} />
      <HighlightRegion rect={R_19M} cam={cam} progress={S(K.ring19m, SNAP) * OFF(K.out1)} />
      {revealed ? (
        <HighlightRegion
          rect={R_DAILY[step]} cam={cam}
          progress={S(K.revStep, SNAP) * OFF(K.out3)} pad={5}
        />
      ) : null}
      <HighlightRegion rect={R_GA_77} cam={cam} progress={S(K.ringGa, SNAP) * OFF(K.out4)} />
      <HighlightRegion rect={R_SEO_RESULT} cam={cam} progress={S(K.ringSeoA, SNAP) * OFF(K.outSeo)} />
      <HighlightRegion rect={R_SEO_LINKS} cam={cam} progress={S(K.ringSeoB, SNAP) * OFF(K.outSeo)} pad={10} />
      <HighlightRegion rect={recRect} cam={cam} progress={S(K.ringRecA, SNAP) * OFF(K.out5)} />
      <HighlightRegion rect={R_REC_RATE} cam={cam} progress={S(K.ringRate, SNAP) * OFF(K.out5)} />

      {/* ---------------------------------------------------------- column */}
      <BeatColumn
        rule={S(K.title) * (1 - through)}
        label={<span style={{opacity: 1 - through}}>KSUNCH</span>}
        top={282}
        source={<span>ecommerce &#183; automation</span>}
        sourceProgress={S(K.label) * OFF(K.out1)}
      />

      <div style={{position: 'absolute', left: 140, top: 358, width: 660}}>
        <div style={{...T.eyebrow, fontSize: 17, position: 'absolute', top: 0,
          opacity: S(K.claimRev) * OFF(K.out3)}}>
          total revenue, jun 30 &#8211; jul 7 &#183; ksunch case study
        </div>
        <div style={{...T.eyebrow, fontSize: 17, position: 'absolute', top: 0,
          opacity: S(K.claimGa) * OFF(K.out4)}}>
          google analytics &#183; active users
        </div>
        <div style={{...T.eyebrow, fontSize: 17, position: 'absolute', top: 0,
          opacity: S(K.claimSeo) * OFF(K.outSeo)}}>
          google indexing &#183; google search result, ksunch.co.in
        </div>
        <div style={{...T.eyebrow, fontSize: 17, position: 'absolute', top: 0,
          opacity: S(K.claimRec) * OFF(K.out5)}}>
          abandoned cart recovery &#183; ksunch case study
        </div>
      </div>

      {/* ------------------------------------------------- the figure slot */}
      <div style={{position: 'absolute', left: 140, top: 452,
        opacity: S(K.fig90, SETTLE) * OFF(K.out1)}}>
        <span style={{...T.figure, fontSize: 150, color: C.accent}}>90</span>
        <span style={{...T.figure, fontSize: 74, color: C.accent}}>%</span>
      </div>

      <div style={{position: 'absolute', left: 140, top: 452,
        opacity: (revealed ? 1 : 0) * OFF(K.out3)}}>
        <MoneyCounter value={total} size={104} color={step >= 7 ? C.accent : C.text} />
      </div>

      <div style={{position: 'absolute', left: 140, top: 452,
        opacity: S(K.figGa, SETTLE) * OFF(K.out4)}}>
        <span style={{...T.figure, fontSize: 150, color: C.accent}}>77K</span>
      </div>

      <div style={{position: 'absolute', left: 140, top: 452,
        opacity: S(K.ringRecA, SETTLE) * OFF(K.out5)}}>
        <MoneyCounter value={recVal} size={104} color={recT > 0.5 ? C.accent : C.text} />
      </div>

      {/* --------------------------------------------------------- claims */}
      <div style={{position: 'absolute', left: 140, top: 646, width: 640}}>
        <div style={{...T.claim, fontSize: 44, position: 'absolute', top: 0,
          opacity: S(K.claim90) * OFF(K.out1),
          transform: `translateY(${(1 - S(K.claim90)) * 18}px)`}}>
          Of the workload,<br />to automate.
        </div>
        <div style={{...T.claim, fontSize: 44, position: 'absolute', top: 0,
          opacity: S(K.claimRev) * OFF(K.out3),
          transform: `translateY(${(1 - S(K.claimRev)) * 18}px)`}}>
          Launch revenue,<br />first week live.
        </div>
        <div style={{...T.claim, fontSize: 44, position: 'absolute', top: 0,
          opacity: S(K.claimGa) * OFF(K.out4),
          transform: `translateY(${(1 - S(K.claimGa)) * 18}px)`}}>
          Active users,<br />thirty days.
        </div>
        <div style={{...T.claim, fontSize: 44, position: 'absolute', top: 0,
          opacity: S(K.claimSeo) * OFF(K.outSeo),
          transform: `translateY(${(1 - S(K.claimSeo)) * 18}px)`}}>
          Search<br />visibility.
        </div>
        <div style={{...T.claim, fontSize: 44, position: 'absolute', top: 0,
          opacity: S(K.claimRec) * OFF(K.out5),
          transform: `translateY(${(1 - S(K.claimRec)) * 18}px)`}}>
          Carts recovered,<br />with no manual effort.
        </div>
      </div>

      <div style={{position: 'absolute', left: 140, top: 806,
        opacity: S(K.ringRate, SETTLE) * OFF(K.out5)}}>
        <DeltaBadge text="9.38% recovery rate" progress={1} />
      </div>

      {/* ------------------------------------- the system, as a workflow ---
          Typography only. No dashboard is drawn, because none was captured. */}
      <div style={{position: 'absolute', left: 140, top: 470, width: 1180,
        opacity: S(K.chain) * OFF(K.out2)}}>
        {['Orders', 'Inventory', 'Fulfilment', 'Analytics'].map((w, i) => {
          const p = clamp01((S(K.chain) - i * 0.17) / 0.4);
          return (
            <div key={w} style={{display: 'flex', alignItems: 'center', marginBottom: 14}}>
              <div style={{width: 10 * p, height: 10 * p, borderRadius: 5,
                background: C.accent, marginRight: 22}} />
              <span style={{...T.claim, fontSize: 52, opacity: p,
                transform: `translateX(${(1 - p) * 26}px)`, display: 'inline-block'}}>
                {w}
              </span>
            </div>
          );
        })}
        <div style={{...T.eyebrow, fontSize: 17, marginTop: 18,
          opacity: S(K.chainClaim) * 0.95}}>
          one workflow
        </div>
      </div>

      {/* the veil rides the closing push */}
      <div style={{position: 'absolute', inset: 0, background: C.ground,
        opacity: clamp01((through - 0.3) / 0.6)}} />

      {/* ------------------------------------------------------- statement */}
      <div
        style={{
          position: 'absolute', left: 140, top: 420, width: 940,
          transformOrigin: '8% 42%',
          transform: `scale(${1 + 1.3 * through}) translate(${-through * 130}px, ${-through * 46}px)`,
          opacity: 1 - clamp01((through - 0.76) / 0.24),
        }}
      >
        <div style={{...T.claim, fontSize: 88, lineHeight: 1.06,
          opacity: S(K.statement),
          transform: `translateY(${(1 - S(K.statement)) * 24}px)`}}>
          Built to run
        </div>
        <div style={{...T.claim, fontSize: 88, lineHeight: 1.06, color: C.accent,
          opacity: S(K.statement2),
          transform: `translateY(${(1 - S(K.statement2)) * 24}px)`}}>
          the business.
        </div>
        <div style={{...T.eyebrow, fontSize: 18, marginTop: 30, letterSpacing: '0.3em',
          opacity: S(K.sub) * 0.92 * (1 - clamp01(through / 0.4))}}>
          design &#183; development &#183; automation
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SCENE03_FRAMES = 528;
