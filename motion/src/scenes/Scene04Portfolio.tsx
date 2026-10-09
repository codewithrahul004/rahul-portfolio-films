import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile,
  useCurrentFrame,
} from 'remotion';
import {C, F, T} from '../theme';
import {Cam, Layer, Rect} from '../motion/Camera';
import {BackdropGrid, Vignette, Ground} from '../motion/Backdrop';
import {camPath, CamKey, easeOutCubic, easeInOutCubic, win} from '../motion/Path';
import {clamp01, lerp} from '../motion/timing';

/* ====================================================================== v4
   SCENE 04 - MOTION QUALITY PASS

   What changed from v3, and nothing else:

   1. SOURCE. Every website on screen is now Rahul's own screen recording,
      trimmed to the real entrance and normalised to constant 30fps. Nothing
      is simulated, recreated or rebuilt in CSS. The trims, the measured
      capture cadence and the speed factor for each clip are written down in
      premium/SCENE04-SOURCE-TIMING.md.

   2. CAMERA. v3 chained one spring per move, so the camera decelerated to
      almost nothing at every waypoint and then started again. It is now a
      single monotone-cubic path through waypoints (motion/Path.tsx): it
      flows through a waypoint it is travelling past and comes to rest only
      where the path actually holds.

   3. EASING. One family, easeOutCubic / easeInOutCubic. No springs, so no
      overshoot, no bounce, no settle wobble on panels or type.

   The composition, the perspective panels, the depth, the portfolio wall,
   the side-by-side row and the typography band are unchanged.            */

/* ------------------------------------------------------------------ clips
   w/h are the real pixel dimensions of each normalised clip, so every rect
   below is built from its own clip's aspect. Nothing is ever stretched.  */
type Clip = {file: string; w: number; h: number; frames: number; tone: number; label: string};

const CLIP: Record<string, Clip> = {
  suite004:  {file: 'suite004.mp4',  w: 1264, h: 556, frames: 78,  tone: 1.02, label: 'suite004.com'},
  intellact: {file: 'intellact.mp4', w: 1264, h: 590, frames: 108, tone: 1.40, label: 'intellactai.com'},
  qclobby:   {file: 'qclobby.mp4',   w: 1264, h: 590, frames: 101, tone: 1.34, label: 'qclobby.com'},
  scoplios:  {file: 'scoplios.mp4',  w: 1264, h: 590, frames: 140, tone: 1.30, label: 'scoplios'},
  editlobby: {file: 'editlobby.mp4', w: 1264, h: 540, frames: 62,  tone: 1.18, label: 'editlobby.com'},
  ratio:     {file: 'ratio.mp4',     w: 1264, h: 638, frames: 91,  tone: 1.08, label: 'ratiovisuals.com'},
  vrgev:     {file: 'vrgev.mp4',     w: 1264, h: 638, frames: 91,  tone: 1.14, label: 'vrgev.com'},
  caked:     {file: 'caked.mp4',     w: 1264, h: 638, frames: 92,  tone: 0.74, label: 'cakedindia.com'},
  func:      {file: 'func.mp4',      w: 1264, h: 638, frames: 68,  tone: 0.86, label: 'func.'},
  aiunit:    {file: 'aiunit.mp4',    w: 1000, h: 562, frames: 69,  tone: 1.04, label: 'the ai unit'},
};

const ar = (k: string) => CLIP[k].w / CLIP[k].h;
/** A rect built from a clip's own aspect, so the website is never distorted. */
const fit = (k: string, x: number, y: number, w: number): Rect =>
  ({x, y, w, h: w / ar(k)});

/* ------------------------------------------------------------------ world */

// A. suite004, taken full width, because the door needs the room
const S4 = fit('suite004', 310, 70, 1300);

// B. three entrances side by side
const R1 = fit('intellact', 2020, 200, 700); // intellactai
const R2 = fit('qclobby',   2760, 320, 700); // qclobby
const R3 = fit('scoplios',  3500, 200, 700); // scoplios

// C. the language evidence, beside SCOPLIOS
const LP: Rect = {x: 4320, y: 170, w: 430, h: 498}; // 1016x1176 captures

// D. the wall
const WALL_X = 5000, WALL_STEP = 600, WALL_W = 540;
const WDY = [-110, 80, -60, 120, -130, 60, -90, 100];
const WKEYS = ['suite004', 'ratio', 'vrgev', 'caked', 'func', 'aiunit', 'qclobby', 'editlobby'];
const wallRect = (i: number) => fit(WKEYS[i], WALL_X + i * WALL_STEP, 380 + WDY[i], WALL_W);
const WALL: {k: string; r: Rect}[] = WKEYS.map((k, i) => ({k, r: wallRect(i)}));

// E + F. the two taken large, each out of its own wall card
const QC_BIG = fit('qclobby',    9900, 250, 1240);
const EL_BIG = fit('editlobby', 11500, 270, 1240);

/* ----------------------------------------------------------------- beats */
const B = {
  // A - suite004
  s4Clip: 6,                 // 78 frames, ends 84, then holds on the lockup
  s4In: [0, 26],
  line1: [30, 22],
  s4Out: [92, 14],

  // B - three entrances, offset by a quarter second each so the row reads as
  //     choreographed rather than as three things switched on at once
  inClip: 96,                //  96 -> 204
  qcClip: 104,               // 104 -> 205
  scClip: 112,               // 112 -> 252
  e1: [92, 22], e2: [100, 22], e3: [108, 22],
  rowOut: [256, 16],

  // C - the same build, in six languages
  line2: [270, 22], src2: [282, 22],
  lpIn: [286, 22], toHe: [308, 24], lpOut: [352, 20],

  // D - the wall
  wallIn: [346, 24],
  line3: [366, 22],
  wallOut: [484, 18],

  // E - qc lobby large. The card and the camera arrive together, so the site
  //     is already in position and at full size before anything happens on it.
  qcRise: [484, 52],
  qcBigClip: 494,            // the last 58 frames of the clip
  line4: [500, 20],
  qcBigOut: [576, 16],

  // F - edit lobby large, same rule: in position first, then it opens
  elRise: [548, 68],
  elClip: 614,               // 614 -> 676
  line5: [622, 20],

  // G
  ground: [680, 18],
  statement: [686, 22], statement2: [694, 22], through: [708, 26],
} as const;

export const SCENE04_FRAMES = 738;

/* ---------------------------------------------------------- camera path
   Repeated waypoints are holds. Everything else the camera flows through. */
const PATH: CamKey[] = [
  {f: 0,   cam: {x: 960,  y: 540, z: 1.055}},
  {f: 36,  cam: {x: 960,  y: 540, z: 1.000}},
  {f: 88,  cam: {x: 960,  y: 540, z: 1.000}},   // hold on the door
  {f: 150, cam: {x: 3110, y: 566, z: 0.870}},   // the row
  {f: 254, cam: {x: 3150, y: 566, z: 0.920}},   // a slow push through the row
  {f: 306, cam: {x: 4125, y: 560, z: 1.150}},   // onto SCOPLIOS + the languages
  {f: 340, cam: {x: 4125, y: 560, z: 1.150}},   // hold while the languages read
  {f: 398, cam: {x: 5900, y: 548, z: 1.000}},   // the wall
  {f: 482, cam: {x: 8540, y: 548, z: 1.000}},   // one continuous travel across it
  {f: 540, cam: {x: 10520, y: 666, z: 1.180}},  // qc lobby, large
  {f: 560, cam: {x: 10520, y: 666, z: 1.180}},  // hold
  {f: 620, cam: {x: 12120, y: 666, z: 1.180}},  // edit lobby, large
  {f: 640, cam: {x: 12120, y: 666, z: 1.180}},  // hold
  {f: 738, cam: {x: 12400, y: 600, z: 1.900}},  // push through, into scene 05
];

/* ----------------------------------------------------------------- panel
   A captured site placed in the world as a physical screen. The reveal is a
   masked wipe plus a small scale, eased, never sprung - so it arrives and
   stops, with no overshoot to read as a wobble.                          */
const Panel: React.FC<{
  rect: Rect;
  enter?: number;
  tilt?: number;
  tone?: number;
  opacity?: number;
  label?: string;
  children: React.ReactNode;
}> = ({rect, enter = 1, tilt = 0, tone = 1, opacity = 1, label, children}) => {
  const e = easeOutCubic(enter);
  return (
    <div
      style={{
        position: 'absolute', left: rect.x, top: rect.y, width: rect.w,
        opacity: opacity * clamp01(e * 1.6),
        transform: `perspective(2600px) rotateY(${tilt}deg) scale(${0.972 + 0.028 * e})`,
        transformOrigin: '50% 50%',
      }}
    >
      <div
        style={{
          width: rect.w, height: rect.h, borderRadius: 14, overflow: 'hidden',
          background: C.panel, border: `1px solid ${C.edge}`,
          boxShadow: '0 44px 120px rgba(0,0,0,0.85)',
          clipPath: `inset(${(1 - e) * 100}% 0% 0% 0%)`,
          position: 'relative',
          filter: `brightness(${tone}) contrast(1.04)`,
        }}
      >
        {children}
      </div>
      {label ? (
        <div style={{
          marginTop: 16, fontSize: 15, letterSpacing: '0.24em',
          color: C.muted, textTransform: 'lowercase', opacity: clamp01(e * 2 - 1),
        }}>
          {label}
        </div>
      ) : null}
    </div>
  );
};

const fillStyle: React.CSSProperties = {
  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
};

/** The real recording. Mounted only for the frames it is on screen. */
const Site: React.FC<{k: string; small?: boolean; trimBefore?: number}> =
  ({k, small, trimBefore = 0}) => (
    <OffthreadVideo
      src={staticFile(`v/${small ? 's/' : ''}${CLIP[k].file}`)}
      trimBefore={trimBefore}
      playbackRate={1}
      style={fillStyle}
    />
  );

/** The last frame of a recording, for a card the camera has not reached. */
const Still: React.FC<{k: string}> = ({k}) => (
  <Img src={staticFile(`v/s/${k}.jpg`)} style={fillStyle} />
);

/* ------------------------------------------------------------ typography
   Masked reveal plus a small rise. No float, no spring, no overshoot.    */
const Claim: React.FC<{show: number; hide: number; children: React.ReactNode}> =
  ({show, hide, children}) => {
    const e = easeOutCubic(show);
    return (
      <div style={{
        ...T.claim, fontSize: 56, lineHeight: 1.08,
        position: 'absolute', top: 0,
        opacity: e * (1 - hide),
        transform: `translateY(${(1 - e) * 12}px)`,
        clipPath: `inset(0% 0% ${(1 - e) * 100}% 0%)`,
      }}>
        {children}
      </div>
    );
  };

export const Scene04Portfolio: React.FC = () => {
  const frame = useCurrentFrame();
  const W = (b: readonly [number, number] | number[]) => win(frame, b[0], b[1]);
  const E = (b: readonly [number, number] | number[]) => easeOutCubic(W(b));

  const cam: Cam = camPath(PATH, frame);

  // the two cards that leave the wall, as one continuous shared element
  const qcT = easeInOutCubic(W(B.qcRise));
  const elT = easeInOutCubic(W(B.elRise));
  const slide = (a: Rect, b: Rect, t: number): Rect => ({
    x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t),
    w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t),
  });
  const qcRect = slide(WALL[6].r, QC_BIG, qcT);
  const elRect = slide(WALL[7].r, EL_BIG, elT);

  const wallOn = E(B.wallIn) * (1 - E(B.wallOut));
  const rowOff = E(B.rowOut);
  const through = easeInOutCubic(W(B.through));

  return (
    <AbsoluteFill style={{background: C.ground, fontFamily: F.sans, color: C.text}}>
      <Ground />

      <Layer cam={cam} depth={0.4}>
        <BackdropGrid drift={frame} />
      </Layer>

      <Layer cam={cam} depth={1}>
        {/* A. suite004 - the whole door, at recording speed */}
        <div style={{opacity: 1 - E(B.s4Out)}}>
          <Panel rect={S4} enter={W(B.s4In)} tone={CLIP.suite004.tone}>
            <Sequence from={B.s4Clip} durationInFrames={CLIP.suite004.frames + 40}>
              <Site k="suite004" />
            </Sequence>
          </Panel>
        </div>

        {/* B. three entrances side by side, each on its own clock */}
        <div style={{opacity: 1 - rowOff}}>
          <Panel rect={R1} enter={W(B.e1)} tilt={6} tone={CLIP.intellact.tone}
            label={CLIP.intellact.label}>
            <Sequence from={B.inClip} durationInFrames={CLIP.intellact.frames + 110}>
              <Site k="intellact" />
            </Sequence>
          </Panel>
          <Panel rect={R2} enter={W(B.e2)} tilt={0} tone={CLIP.qclobby.tone}
            label={CLIP.qclobby.label}>
            <Sequence from={B.qcClip} durationInFrames={CLIP.qclobby.frames + 90}>
              <Site k="qclobby" />
            </Sequence>
          </Panel>
        </div>
        {/* SCOPLIOS stays past the row: the language beat belongs to it */}
        <div style={{opacity: 1 - E(B.lpOut)}}>
          <Panel rect={R3} enter={W(B.e3)} tilt={-6} tone={CLIP.scoplios.tone}
            label={CLIP.scoplios.label}>
            <Sequence from={B.scClip} durationInFrames={CLIP.scoplios.frames + 120}>
              <Site k="scoplios" />
            </Sequence>
          </Panel>
          {/* the same build, in six languages. Real captures of the live site. */}
          <Panel rect={LP} enter={W(B.lpIn)} tilt={-3} tone={1.06}>
            <Img src={staticFile('p_sc_en.jpg')} style={fillStyle} />
            <Img src={staticFile('p_sc_he.jpg')}
              style={{...fillStyle, position: 'absolute', inset: 0, opacity: E(B.toHe)}} />
          </Panel>
        </div>

        {/* D. the wall - six more, playing */}
        <div style={{opacity: wallOn}}>
          {WALL.slice(0, 6).map((w, i) => (
            <Panel key={w.k} rect={w.r} enter={W([B.wallIn[0] + i * 5, 22])}
              tilt={i % 2 ? -4 : 4} tone={CLIP[w.k].tone} label={CLIP[w.k].label}>
              <Sequence from={B.wallIn[0] + i * 5} durationInFrames={160}>
                <Site k={w.k} small />
              </Sequence>
            </Panel>
          ))}
        </div>

        {/* E + F. two cards travel out of the wall and are taken large.
            Edit Lobby is drawn first so QC Lobby passes in front of it. */}
        <div style={{opacity: E([B.wallIn[0] + 32, 22])}}>
          <Panel rect={elRect} tilt={lerp(4, 0, elT)} tone={CLIP.editlobby.tone}
            label={elT > 0.15 ? undefined : CLIP.editlobby.label}>
            <Still k="editlobby" />
            {/* the page reloads as the card arrives, so the entrance plays
                full size. The hand-over happens while the card is still
                moving, which is why it reads as one continuous shot. */}
            <div style={{position: 'absolute', inset: 0, opacity: W([B.elClip, 10])}}>
              <Sequence from={B.elClip} durationInFrames={CLIP.editlobby.frames + 56}>
                <Site k="editlobby" />
              </Sequence>
            </div>
          </Panel>
        </div>
        <div style={{opacity: E([B.wallIn[0] + 28, 22]) * (1 - E(B.qcBigOut))}}>
          <Panel rect={qcRect} tilt={lerp(-4, 0, qcT)} tone={CLIP.qclobby.tone}
            label={qcT > 0.15 ? undefined : CLIP.qclobby.label}>
            <Still k="qclobby" />
            <div style={{position: 'absolute', inset: 0, opacity: W([B.qcBigClip, 10])}}>
              <Sequence from={B.qcBigClip} durationInFrames={76}>
                <Site k="qclobby" trimBefore={CLIP.qclobby.frames - 58} />
              </Sequence>
            </div>
          </Panel>
        </div>
      </Layer>

      <Vignette />

      {/* a low band so type never sits on the work */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 430,
        background: 'linear-gradient(0deg, rgba(11,11,12,0.97) 20%, rgba(11,11,12,0) 100%)',
      }} />

      <div style={{position: 'absolute', left: 140, bottom: 112, width: 1060}}>
        <div style={{width: 46 * E(B.line1), height: 2, background: C.accent, marginBottom: 18}} />
        <div style={{position: 'relative', height: 150}}>
          <Claim show={W(B.line1)} hide={E(B.rowOut)}>
            Built to make<br />an entrance.
          </Claim>
          <div style={{position: 'absolute', top: 0, opacity: 1 - E(B.lpOut)}}>
            <Claim show={W(B.line2)} hide={0}>
              Multilingual<br />by design.
            </Claim>
            <div style={{
              ...T.eyebrow, fontSize: 16, position: 'absolute', top: 126,
              whiteSpace: 'nowrap', opacity: E(B.src2) * 0.95,
            }}>
              six languages &#183; english &#183; hebrew &#183; greek &#183; russian &#183; japanese &#183; german
            </div>
          </div>
          <Claim show={W(B.line3)} hide={E(B.wallOut)}>
            Different projects.<br /><span style={{color: C.accent}}>Same standard.</span>
          </Claim>
          <Claim show={W(B.line4)} hide={E(B.qcBigOut)}>A SaaS product.</Claim>
          <Claim show={W(B.line5)} hide={E(B.ground)}>A studio brand.</Claim>
        </div>
      </div>

      {/* the closing statement gets its own ground */}
      <div style={{
        position: 'absolute', inset: 0, background: C.ground, opacity: E(B.ground) * 0.93,
      }} />

      <div style={{
        position: 'absolute', left: 140, top: 404, width: 1280,
        transformOrigin: '6% 42%',
        transform: `scale(${1 + 1.15 * through}) translate(${-through * 108}px, ${-through * 34}px)`,
        opacity: 1 - clamp01((through - 0.80) / 0.20),
      }}>
        <div style={{
          ...T.claim, fontSize: 82, lineHeight: 1.08,
          opacity: E(B.statement),
          transform: `translateY(${(1 - E(B.statement)) * 16}px)`,
          clipPath: `inset(0% 0% ${(1 - E(B.statement)) * 100}% 0%)`,
        }}>
          The technology changes.
        </div>
        <div style={{
          ...T.claim, fontSize: 82, lineHeight: 1.08, color: C.accent,
          opacity: E(B.statement2),
          transform: `translateY(${(1 - E(B.statement2)) * 16}px)`,
          clipPath: `inset(0% 0% ${(1 - E(B.statement2)) * 100}% 0%)`,
        }}>
          The standard doesn&rsquo;t.
        </div>
      </div>
    </AbsoluteFill>
  );
};
