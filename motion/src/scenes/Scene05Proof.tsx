import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, F, T, accentA} from '../theme';
import {Cam, Layer, Rect} from '../motion/Camera';
import {BackdropGrid, Vignette, Ground} from '../motion/Backdrop';
import {camPath, CamKey, easeOutCubic, easeInOutCubic, win} from '../motion/Path';
import {clamp01, lerp} from '../motion/timing';
import {CLIENT_LOGOS} from '../clientLogos';

/* ====================================================================== 05
   THE PROOF WALL

   Scene 04 proved he can build. This proves people trusted him to, and it
   does it by volume rather than by three big quotes: one piece of real client
   feedback, then another, then another, while the camera falls backwards
   through the space until the whole body of it is visible at once.

   EVERY CARD IS AN ORIGINAL SCREENSHOT. Nothing here is a recreated Upwork,
   Instagram, Google or WhatsApp interface, and no quote was retyped. The
   screenshots came out of the growth-partner brief PDF and off the live
   Upwork profile; each one's origin is in premium/SCENE05-PROOF-MAP.md.

   No number is claimed anywhere. The wall is the claim.

   Motion is Scene 04's: one camera on the monotone-cubic path in
   motion/Path.tsx, easeOutCubic only, no springs, no bounce.              */

type Shot = {file: string; ar: number};
const S: Record<string, Shot> = {
  hero:      {file: 'pf/u_hero.jpg',          ar: 1000 / 816},
  badge:     {file: 'pf/u_badge.jpg',         ar: 580 / 96},
  ratio:     {file: 'pf/u_ratio.jpg',         ar: 592 / 553},
  kishan:    {file: 'pf/u_kishan.jpg',        ar: 586 / 554},
  igSkin:    {file: 'pf/s_ig_skin.jpg',       ar: 1278 / 396},
  igAvneet:  {file: 'pf/s_ig_avneet.jpg',     ar: 1348 / 343},
  google:    {file: 'pf/s_google_sameer.jpg', ar: 1071 / 302},
  basavaraj: {file: 'pf/w_basavaraj.jpg',     ar: 570 / 400},
  guneet:    {file: 'pf/w_guneet.jpg',        ar: 480 / 370},
  guneet2:   {file: 'pf/w_guneet2.jpg',       ar: 600 / 180},
  anisha:    {file: 'pf/w_anisha.jpg',        ar: 540 / 180},
  anisha2:   {file: 'pf/w_anisha2.jpg',       ar: 690 / 255},
  mustafa:   {file: 'pf/w_mustafa.jpg',       ar: 730 / 190},
};

/** A card placed by its centre, sized from its own capture's aspect. */
const at = (k: string, cx: number, cy: number, w: number): Rect =>
  ({x: cx - w / 2, y: cy - w / S[k].ar / 2, w, h: w / S[k].ar});

/* ------------------------------------------------------------------ world
   The entry: Scene 04's last surface becomes the profile, the camera pushes
   onto the one line that matters, and then it starts falling backwards.   */
const HERO = at('hero', 960, 444.5, 820);
// the badge where it already sits inside the hero capture, so the push is a
// real zoom onto those pixels at their own resolution
const BADGE: Rect = {x: 736.9, y: 642.6, w: 475.7, h: 475.7 / S.badge.ar};

type Card = {
  k: string; r: Rect; at: number; dur: number; from: [number, number];
  depth?: number; caption?: string; source?: string;
  /** x, y, w, h as fractions of the card: the line that actually matters.
   *  Everything outside it is stopped down, nothing is cropped away. */
  focus?: [number, number, number, number];
};

/* Foreground: the five that are public and readable.
   Midground and background: the private threads, which carry the volume.
   Entry times are uneven on purpose - the wall should gather momentum, not
   tick like a metronome. */
const WALL: Card[] = [
  // the first one in, and what the Upwork badge hands over to
  {k: 'ratio',     r: at('ratio',     930,  330, 660), at: 58,  dur: 20, from: [0, 64]},
  {k: 'kishan',    r: at('kishan',    115,  330, 600), at: 96,  dur: 18, from: [-86, 0]},
  {k: 'igSkin',    r: at('igSkin',   1960,  300, 880), at: 120, dur: 18, from: [92, 0],
    caption: 'Skinfluence', source: 'instagram'},
  {k: 'google',    r: at('google',   1980,  760, 800), at: 148, dur: 16, from: [78, 20],
    caption: 'Sameer Gautam', source: 'google review'},
  {k: 'igAvneet',  r: at('igAvneet',  180, 1120, 880), at: 172, dur: 18, from: [0, 80],
    caption: 'Avneet Makhni', source: 'instagram'},

  // dead centre of the finished wall, held long enough to read, because it is
  // the only piece of feedback here that reports a business outcome
  {k: 'basavaraj', r: at('basavaraj',1000,  880, 660), at: 198, dur: 20, from: [0, 70],
    caption: 'Basavaraj', source: 'whatsapp', focus: [0.02, 0.44, 0.96, 0.52]},

  {k: 'guneet',    r: at('guneet',   -280,  790, 400), at: 254, dur: 14, from: [-74, 24],
    caption: 'Guneet', source: 'whatsapp', focus: [0.02, 0.04, 0.96, 0.92]},
  {k: 'anisha',    r: at('anisha',   1800, 1270, 520), at: 272, dur: 14, from: [68, -28],
    caption: 'Anisha', source: 'whatsapp', focus: [0.03, 0.06, 0.94, 0.82]},
  {k: 'mustafa',   r: at('mustafa',   -40, 1510, 560), at: 290, dur: 15, from: [-44, 60],
    caption: 'Mustafa', source: 'whatsapp', focus: [0.03, 0.06, 0.78, 0.54]},
  {k: 'guneet2',   r: at('guneet2',  2340,  540, 480), at: 306, dur: 13, from: [88, 16],
    caption: 'Guneet', source: 'whatsapp', focus: [0.02, 0.04, 0.68, 0.74]},

  {k: 'anisha2',   r: at('anisha2',  2280, 1120, 420), at: 324, dur: 14, from: [0, -56],
    depth: 0.80, caption: 'Anisha', source: 'whatsapp', focus: [0.02, 0.04, 0.96, 0.92]},
  {k: 'hero',      r: at('hero',     -440,  170, 350), at: 340, dur: 15, from: [-40, -48],
    depth: 0.80},
];

const B = {
  morph: [0, 22],        // Scene 04's surface becomes the profile
  badgeIn: [22, 14],
  label1: [26, 20],      // REAL CLIENT FEEDBACK
  entryOut: [54, 20],    // the profile recedes, the wall takes over
  label1Out: [176, 20],
  ground: [408, 24],
  statement: [416, 22],
  // the client names, one every five frames, then the line the profile proves
  backedBy: [424, 14],
  // one brand at a time: each holds 12 frames, 4 of them the swap
  names: 436,
  nameStep: 12,
  nameDur: 4,
  profile: [572, 18],
  through: [600, 30],
} as const;

/* Every client in the film, by name. The list is the portfolio reel's ten
   sites plus KSUNCH, and nothing that is not shown in the film. */
const CLIENTS: {name: string; slug: string}[] = [
  {name: 'KSUNCH', slug: 'ksunch'}, {name: 'Edit Lobby', slug: 'editlobby'},
  {name: 'Caked India', slug: 'caked'}, {name: 'Suite 004', slug: 'suite004'},
  {name: 'Scoplios', slug: 'scoplios'}, {name: 'QC Lobby', slug: 'qclobby'},
  {name: 'Intellact AI', slug: 'intellact'}, {name: 'Ratio Visuals', slug: 'ratio'},
  {name: 'VRG EV', slug: 'vrgev'}, {name: 'Func', slug: 'func'}, {name: 'The AI Unit', slug: 'aiunit'},
];
/* A client's real logo is used when public/logos/<slug>.svg or .png exists
   (scripts/scan-logos.js builds the manifest). No logo is drawn or recreated
   here; until a file arrives the client's name is set in the film's type. */

/* What the live Upwork profile shows (capture, 4 October): Rising Talent,
   5.0 across 3 reviews. There is no Job Success Score on the profile yet;
   Upwork only displays one after enough history. When it appears, change
   this line to '100% job success score · upwork' and nothing else. */
const PROFILE_LINE = '5.0 rating · rising talent · upwork';

export const SCENE05_FRAMES = 630;

/* The camera starts close on one thing and falls backwards for ten seconds.
   Repeated waypoints are the two deliberate holds. */
const PATH: CamKey[] = [
  {f: 0,   cam: {x: 960,  y: 540, z: 1.600}},  // carrying Scene 04's push
  {f: 22,  cam: {x: 960,  y: 560, z: 1.220}},  // the profile resolves
  {f: 34,  cam: {x: 975,  y: 716, z: 1.780}},  // onto Rising Talent + 5.0
  {f: 50,  cam: {x: 975,  y: 716, z: 1.780}},  // hold
  {f: 78,  cam: {x: 930,  y: 440, z: 1.060}},  // the first review, large
  {f: 112, cam: {x: 950,  y: 500, z: 0.950}},
  {f: 156, cam: {x: 1000, y: 620, z: 0.860}},  // falling back
  {f: 200, cam: {x: 1010, y: 800, z: 0.800}},  // arriving on the centre card
  {f: 234, cam: {x: 1010, y: 820, z: 0.790}},  // near-hold: long enough to read
  {f: 268, cam: {x: 1015, y: 830, z: 0.760}},
  {f: 312, cam: {x: 1030, y: 820, z: 0.690}},
  {f: 360, cam: {x: 1050, y: 808, z: 0.630}},
  {f: 396, cam: {x: 1050, y: 802, z: 0.600}},  // the whole body of it, at once
  {f: 430, cam: {x: 1050, y: 802, z: 0.600}},  // hold
  {f: 630, cam: {x: 1050, y: 820, z: 0.558}},  // keeps easing back under the names
];

const cover: React.CSSProperties = {
  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
};

/** A piece of evidence arriving. Masked reveal, 0.96 to 1, a short directional
 *  move. No bounce, no overshoot, no rotation.
 *
 *  `focus` lights the sentence that matters and stops the rest of the same
 *  screenshot down. Both layers are the identical image at the identical size,
 *  so nothing is cropped, moved or re-typeset - the thread stays whole and
 *  readable, the eye is just told where to land. */
const Evidence: React.FC<{
  rect: Rect; t: number; from?: [number, number]; tone?: number;
  src?: string; focus?: [number, number, number, number]; fo?: number;
  caption?: string; source?: string; children?: React.ReactNode;
}> = ({rect, t, from = [0, 0], tone = 1, src, focus, fo = 0, caption, source, children}) => {
  const e = easeOutCubic(t);
  const f = focus ? easeOutCubic(clamp01(fo)) : 0;
  const dx = from[0] * (1 - e);
  const dy = from[1] * (1 - e);
  const lit = `brightness(${tone}) contrast(1.03)`;
  const dim = `brightness(${(tone * lerp(1, 0.34, f)).toFixed(3)}) contrast(1.03) saturate(${(1 - 0.35 * f).toFixed(2)})`;
  const inset = focus
    ? `inset(${focus[1] * 100}% ${(1 - focus[0] - focus[2]) * 100}% ${(1 - focus[1] - focus[3]) * 100}% ${focus[0] * 100}%)`
    : undefined;
  return (
    <div style={{
      position: 'absolute', left: rect.x, top: rect.y, width: rect.w,
      opacity: clamp01(e * 1.8),
      transform: `translate(${dx}px, ${dy}px) scale(${0.96 + 0.04 * e})`,
      transformOrigin: '50% 50%',
    }}>
      <div style={{
        width: rect.w, height: rect.h, borderRadius: 10, overflow: 'hidden',
        background: '#101012', border: `1px solid ${C.edge}`,
        boxShadow: '0 38px 90px rgba(0,0,0,0.85)',
        clipPath: `inset(${(1 - e) * 100}% 0% 0% 0%)`,
        position: 'relative',
      }}>
        {src
          ? <Img src={staticFile(src)} style={{...cover, filter: focus ? dim : lit}} />
          : <div style={{width: '100%', height: '100%', filter: lit}}>{children}</div>}
        {src && focus && f > 0 ? (
          <div style={{position: 'absolute', inset: 0, clipPath: inset, opacity: f}}>
            <Img src={staticFile(src)} style={{...cover, filter: lit}} />
          </div>
        ) : null}
        {focus && f > 0 ? (
          <div style={{
            position: 'absolute',
            left: `${focus[0] * 100}%`, top: `${focus[1] * 100}%`,
            height: `${focus[3] * 100}%`, width: Math.max(2, rect.w * 0.009),
            background: C.accent, opacity: f * 0.9,
            boxShadow: `0 0 ${rect.w * 0.05}px ${accentA(0.45)}`,
          }} />
        ) : null}
      </div>
      {caption ? (
        <div style={{
          marginTop: Math.max(rect.w * 0.030, 12), display: 'flex',
          alignItems: 'baseline', whiteSpace: 'nowrap',
          gap: Math.max(rect.w * 0.028, 10), opacity: clamp01(e * 2 - 1),
        }}>
          <span style={{
            fontSize: Math.max(rect.w * 0.042, 20), fontWeight: 700,
            color: C.text, letterSpacing: '0.01em',
          }}>{caption}</span>
          <span style={{
            fontSize: Math.max(rect.w * 0.033, 16), color: C.muted,
            letterSpacing: '0.18em', textTransform: 'lowercase',
          }}>{source}</span>
        </div>
      ) : null}
    </div>
  );
};

export const Scene05Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const W = (b: readonly [number, number] | number[]) => win(frame, b[0], b[1]);
  const E = (b: readonly [number, number] | number[]) => easeOutCubic(W(b));
  // fades that start from a standing hold use the S-curve, so the opacity
  // ramp has no step in its velocity at the moment it begins
  const SF = (b: readonly [number, number] | number[]) => easeInOutCubic(W(b));

  const cam: Cam = camPath(PATH, frame);

  // Scene 04's last surface becomes the first proof surface in place: one
  // panel, one continuous move, the picture inside it changing. Not a cut.
  const morph = easeInOutCubic(W(B.morph));
  const EL: Rect = {x: 340, y: 240, w: 1240, h: 1240 / 2.3407};
  const heroRect: Rect = {
    x: lerp(EL.x, HERO.x, morph), y: lerp(EL.y, HERO.y, morph),
    w: lerp(EL.w, HERO.w, morph), h: lerp(EL.h, HERO.h, morph),
  };

  const entryOut = SF(B.entryOut);
  const through = easeInOutCubic(W(B.through));
  // the wall drops back to make room for the person in Scene 06
  const recede = 1 - 0.80 * SF(B.ground);

  const cards = (depth: number) =>
    WALL.filter((c) => (c.depth ?? 1) === depth).map((c) => (
      <Evidence
        key={c.k}
        rect={c.r}
        t={W([c.at, c.dur])}
        from={c.from}
        tone={c.k === 'ratio' || c.k === 'kishan' ? 0.96 : 1.0}
        src={S[c.k].file}
        focus={c.focus}
        // the highlight lifts a beat after the card has landed, so the eye
        // reads the thread first and the line second
        fo={W([c.at + c.dur + 8, 18])}
        caption={c.caption}
        source={c.source}
      />
    ));

  return (
    <AbsoluteFill style={{background: C.ground, fontFamily: F.sans, color: C.text}}>
      <Ground />

      <Layer cam={cam} depth={0.35}>
        <BackdropGrid drift={frame} />
      </Layer>

      {/* the far cards: they shift less, so the wall has real depth */}
      <Layer cam={cam} depth={0.80}>
        <div style={{opacity: recede}}>{cards(0.80)}</div>
      </Layer>

      <Layer cam={cam} depth={1}>
        <div style={{opacity: recede}}>
          {/* the doorway: the profile, and the one line on it that matters */}
          <div style={{opacity: 1 - entryOut}}>
            <Evidence rect={heroRect} t={1} tone={0.92}>
              <Img src={staticFile('v/s/editlobby.jpg')}
                style={{...cover, opacity: 1 - morph}} />
              <Img src={staticFile(S.hero.file)}
                style={{...cover, position: 'absolute', inset: 0, opacity: morph}} />
            </Evidence>
            <div style={{opacity: E(B.badgeIn)}}>
              <Evidence rect={BADGE} t={1} tone={1.0}>
                <Img src={staticFile(S.badge.file)} style={cover} />
              </Evidence>
            </div>
          </div>

          {cards(1)}
        </div>
      </Layer>

      <Vignette />

      {/* one quiet label at the start, nothing else until the end */}
      <div style={{position: 'absolute', left: 140, bottom: 92}}>
        <div style={{
          width: 46 * E(B.label1), height: 2, background: C.accent, marginBottom: 16,
          opacity: 1 - SF(B.label1Out),
        }} />
        <div style={{
          fontSize: 30, fontWeight: 700, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: C.text,
          opacity: E(B.label1) * (1 - SF(B.label1Out)),
          transform: `translateY(${(1 - E(B.label1)) * 10}px)`,
          clipPath: `inset(0% 0% ${(1 - E(B.label1)) * 100}% 0%)`,
        }}>
          Real client feedback
        </div>
      </div>

      <div style={{
        position: 'absolute', inset: 0, background: C.ground, opacity: SF(B.ground) * 0.55,
      }} />

      <div style={{
        position: 'absolute', left: 140, top: 430, width: 1340,
        transformOrigin: '6% 42%',
        transform: `scale(${1 + 1.0 * through}) translate(${-through * 92}px, ${-through * 28}px)`,
        opacity: 1 - clamp01((through - 0.82) / 0.18),
      }}>
        <div style={{
          ...T.claim, fontSize: 80, lineHeight: 1.08,
          opacity: E(B.statement),
          transform: `translateY(${(1 - E(B.statement)) * 14}px)`,
          clipPath: `inset(0% 0% ${(1 - E(B.statement)) * 100}% 0%)`,
        }}>
          The work speaks.
        </div>
        <div style={{
          fontSize: 30, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: C.muted, marginTop: 30,
          opacity: E(B.backedBy),
          transform: `translateY(${(1 - E(B.backedBy)) * 10}px)`,
        }}>
          Backed by
        </div>
        {/* one brand at a time. Each slides up into the slot, holds, and
            slides out as the next arrives. A real logo file is used when one
            exists in public/logos; otherwise the name, large. */}
        <div style={{position: 'relative', height: 130, width: 1340, marginTop: 18, overflow: 'hidden'}}>
          {CLIENTS.map(({name: n, slug}, i) => {
            const start = B.names + i * B.nameStep;
            const tin = easeOutCubic(W([start, B.nameDur]));
            const last = i === CLIENTS.length - 1;
            const tout = last ? 0 : easeInOutCubic(W([start + B.nameStep, B.nameDur]));
            if (tin <= 0 || tout >= 1) return null;
            const logo = CLIENT_LOGOS[slug];
            return (
              <div key={n} style={{
                position: 'absolute', left: 0, top: 0, height: 130, display: 'flex', alignItems: 'center',
                opacity: tin * (1 - tout),
                transform: `translateY(${(1 - tin) * 40 - tout * 40}px)`,
              }}>
                {logo
                  ? <Img src={staticFile(logo)} style={{height: 96, width: 'auto', maxWidth: 900, display: 'block'}} />
                  : <span style={{...T.claim, fontSize: 96, lineHeight: 1, color: C.text, whiteSpace: 'nowrap'}}>{n}</span>}
              </div>
            );
          })}
        </div>
        <div style={{
          ...T.eyebrow, fontSize: 24, letterSpacing: '0.26em', marginTop: 8, color: C.text,
          opacity: 0.9 * E(B.profile),
          transform: `translateY(${(1 - E(B.profile)) * 10}px)`,
        }}>
          {PROFILE_LINE}
        </div>
      </div>
    </AbsoluteFill>
  );
};
