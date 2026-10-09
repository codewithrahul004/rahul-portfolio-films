import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {easeInOutCubic, easeOutCubic, win} from '../motion/Path';
import {clamp01, lerp} from '../motion/timing';
import {Grain, Phone} from '../case/pieces';

/* =====================================================================
   CULLEN & NOIR. A forty second luxury brand film about a website.
   Every frame of the site is real: Rahul's own screen recording of the
   homepage (public/cn/rec.mp4, the browser's new-tab seconds trimmed) and
   headless Chromium captures of the two product landing pages, desktop and
   mobile, taken 8 October 2026. No claim, no number, no invented UI.
   ===================================================================== */

const IVORY = '#F2EBDD', INK = '#070707', MUTE = 'rgba(242,235,221,0.55)';
const SERIF = '"Didot","Bodoni 72","Baskerville",Georgia,serif';
const SANS = '"Helvetica Neue",Helvetica,Arial,sans-serif';
const FPS = 30;
export const CN_FILM = 1200;
export const CN_CARD = 60;
export const CN_TESTI = 1043;
export const CN_FRAMES = CN_FILM + CN_CARD + CN_TESTI;
import testi from '../../public/cn/testimonial.json';

const seq = (dir: string, i: number, n: number) => staticFile(`cn/${dir}/f${String(Math.max(0, Math.min(n - 1, Math.round(i)))).padStart(4, '0')}.jpg`);
const W = (f: number, b: readonly [number, number]) => win(f, b[0], b[1]);
const E = (f: number, b: readonly [number, number]) => easeOutCubic(W(f, b));
const SE = (f: number, b: readonly [number, number]) => easeInOutCubic(W(f, b));

/** Editorial reveal: letter tracking closes as the line fades up. */
const Track: React.FC<{t: number; out?: number; size?: number; serif?: boolean; tracking?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode}> =
  ({t, out = 0, size = 64, serif = true, tracking = 0.18, color = IVORY, style, children}) => {
    const e = easeOutCubic(t);
    return (
      <div style={{
        fontFamily: serif ? SERIF : SANS, fontSize: size, color, fontWeight: serif ? 400 : 500,
        letterSpacing: `${lerp(tracking + 0.14, tracking, e)}em`, textTransform: 'uppercase', whiteSpace: 'nowrap',
        opacity: e * (1 - out), transform: `translateY(${(1 - e) * 10}px)`, ...style,
      }}>{children}</div>
    );
  };

const Rule: React.FC<{t: number; w?: number}> = ({t, w = 60}) => (
  <div style={{width: w * easeOutCubic(t), height: 1, background: IVORY, opacity: 0.7}} />
);

const Vig: React.FC<{s?: number}> = ({s = 0.7}) => (
  <div style={{position: 'absolute', inset: 0, background: `radial-gradient(120% 95% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${s}) 100%)`}} />
);

/** The recording, full bleed, zoomed 10% so the recorder's dot sits outside the frame. */
const Rec: React.FC<{from: number; scale?: number; y?: number; opacity?: number; dim?: number}> = ({from, scale = 1.1, y = 0, opacity = 1, dim = 1}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity}}>
    <div style={{position: 'absolute', inset: 0, transform: `translateY(${y}px) scale(${scale})`, transformOrigin: '50% 50%', filter: `brightness(${dim})`}}>
      <OffthreadVideo src={staticFile('cn/rec.mp4')} trimBefore={from} muted style={{width: 1920, height: 1080, objectFit: 'cover'}} />
    </div>
  </div>
);

const Full: React.FC<{src: string; scale?: number; y?: number; opacity?: number; dim?: number; x?: number}> = ({src, scale = 1, y = 0, x = 0, opacity = 1, dim = 1}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity}}>
    <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover', transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: '50% 50%', filter: `brightness(${dim})`}} />
  </div>
);

const Frame: React.FC<{src: string; x: number; y: number; w: number; h: number; tilt?: number; scale?: number; opacity?: number; panY?: number}> = ({src, x, y, w, h, tilt = 0, scale = 1, opacity = 1, panY = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity, transform: `perspective(2800px) rotateY(${tilt}deg) scale(${scale})`, transformOrigin: '50% 50%',
    overflow: 'hidden', borderRadius: 6, background: INK, boxShadow: '0 50px 140px rgba(0,0,0,0.85)', border: '1px solid rgba(242,235,221,0.12)'}}>
    <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: w, height: 'auto', transform: `translateY(${-panY}px)`}} />
  </div>
);

/* ------------------------------------------------------------- scenes */

/* 01 the hook, 0 to 180: the hero, cards fanning out, two lines of type */
const S01: React.FC = () => {
  const f = useCurrentFrame();
  const push = 1.1 + 0.05 * easeInOutCubic(f / 180);
  const out = SE(f, [168, 12]);
  return (<>
    <Rec from={110} scale={push} y={-10 * (f / 180)} />
    <Vig s={0.6} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 108, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 1 - out}}>
      <Track t={W(f, [48, 28])} size={66} tracking={0.26}>Cullen &amp; Noir</Track>
      <div style={{height: 18}} />
      <Track t={W(f, [96, 28])} size={17} serif={false} tracking={0.42} color={MUTE}>Digital experience for a luxury fragrance brand</Track>
    </div>
  </>);
};

/* 02 the brand, 180 to 360: the recording moves through the homepage */
const S02: React.FC = () => {
  const f = useCurrentFrame();
  const out = SE(f, [166, 14]);
  const lineIn = W(f, [56, 30]), lineOut = SE(f, [130, 16]);
  return (<>
    <Rec from={300} scale={1.1 + 0.03 * (f / 180)} opacity={1 - out} />
    <Vig s={0.55} />
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 - out}}>
      <div style={{textAlign: 'center'}}>
        <Track t={lineIn} out={lineOut} size={54} tracking={0.3}>The night begins young</Track>
      </div>
    </div>
  </>);
};

/* 03 Midnight Ashes, 360 to 600: the real landing page, scrolled slowly */
const S03: React.FC = () => {
  const f = useCurrentFrame();
  const inn = E(f, [0, 20]);
  const out = SE(f, [222, 18]);
  const title = W(f, [36, 30]), titleOut = SE(f, [190, 16]);
  return (<>
    <Full src={seq('ashes/desktop_scroll', f * 1.45, 360)} scale={1.04 + 0.04 * (f / 240)} opacity={inn} />
    <Vig s={0.6} />
    <div style={{position: 'absolute', left: 120, bottom: 110, opacity: 1 - out}}>
      <Rule t={title} />
      <div style={{height: 18}} />
      <Track t={title} out={titleOut} size={58} tracking={0.22}>Midnight Ashes</Track>
      <div style={{height: 12}} />
      <Track t={clamp01(title * 1.4 - 0.4)} out={titleOut} size={15} serif={false} tracking={0.4} color={MUTE}>Eau de parfum &middot; its own landing page</Track>
    </div>
  </>);
};

/* 04 one brand, two product experiences, 600 to 810 */
const S04: React.FC = () => {
  const f = useCurrentFrame();
  const wipe = SE(f, [0, 40]);
  const split = SE(f, [70, 36]);
  const out = SE(f, [194, 16]);
  const t1 = W(f, [96, 26]), t2 = W(f, [118, 26]);
  // two windows, the pages travelling in step
  const pan = 620 * SE(f, [80, 130]);
  return (<>
    <div style={{opacity: 1 - split}}>
      <Full src={seq('ashes/desktop_scroll', 250, 360)} scale={1.08} />
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(0% ${(1 - wipe) * 100}% 0% 0%)`}}>
        <Full src={seq('sales/desktop_scroll', 0, 360)} scale={1.08} />
      </div>
      {wipe > 0 && wipe < 1 ? <div style={{position: 'absolute', top: 0, bottom: 0, left: `${wipe * 100}%`, width: 2, background: IVORY, opacity: 0.8}} /> : null}
    </div>
    <div style={{opacity: split * (1 - out)}}>
      <div style={{position: 'absolute', inset: 0, background: INK}} />
      <Frame src={staticFile('cn/ashes/desktop_full.jpg')} x={120} y={190} w={800} h={560} tilt={4} panY={pan} />
      <Frame src={staticFile('cn/sales/desktop_full.jpg')} x={1000} y={190} w={800} h={560} tilt={-4} panY={pan} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Track t={t1} size={22} serif={false} tracking={0.44} color={MUTE}>One brand</Track>
        <div style={{height: 14}} />
        <Track t={t2} size={44} tracking={0.26}>Two product experiences</Track>
      </div>
    </div>
    <Vig s={0.5} />
  </>);
};

/* 05 development, 810 to 1020: desktop, two phones, the words */
const S05: React.FC = () => {
  const f = useCurrentFrame();
  const inn = E(f, [0, 22]);
  const out = SE(f, [194, 16]);
  const panD = 760 * SE(f, [10, 190]);
  const panM = 900 * SE(f, [20, 180]);
  const words: [string, number][] = [['Design', 40], ['Development', 72], ['Experience', 104]];
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{opacity: inn * (1 - out)}}>
      <Frame src={staticFile('cn/sales/desktop_full.jpg')} x={700} y={120} w={960} h={600} tilt={-6} panY={panD} />
      <Phone src={staticFile('cn/ashes/mobile_full.jpg')} cx={1560} cy={640} scale={0.62} tilt={-10} panY={panM} />
      <Phone src={staticFile('cn/home/mobile_full.jpg')} cx={1760} cy={760} scale={0.5} tilt={-14} panY={panM * 1.3} opacity={0.85} />
    </div>
    <div style={{position: 'absolute', left: 120, top: 300, opacity: 1 - out}}>
      <Rule t={E(f, [26, 20])} />
      <div style={{height: 26}} />
      {words.map(([w, at], i) => (
        <div key={w} style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          {i > 0 ? <span style={{fontFamily: SERIF, fontSize: 40, color: MUTE, opacity: E(f, [at - 8, 14])}}>+</span> : null}
          <Track t={W(f, [at, 24])} size={42} tracking={0.2} style={{lineHeight: 1.6}}>{w}</Track>
        </div>
      ))}
      <div style={{height: 20}} />
      <Track t={W(f, [136, 24])} size={15} serif={false} tracking={0.4} color={MUTE}>Built as one responsive website</Track>
    </div>
    <Vig s={0.5} />
  </>);
};

/* 06 final, 1020 to 1200: a rapid sequence, the lockup, the statement, black */
const S06: React.FC = () => {
  const f = useCurrentFrame();
  const shots: {at: number; node: React.ReactNode}[] = [
    {at: 0, node: <Rec from={170} scale={1.12} />},
    {at: 22, node: <Full src={staticFile('cn/ashes/desktop_hero.jpg')} scale={1.06} />},
    {at: 42, node: <Full src={staticFile('cn/sales/desktop_hero.jpg')} scale={1.06} />},
    {at: 60, node: <Rec from={430} scale={1.12} />},
  ];
  const shotsOut = SE(f, [78, 14]);
  const lock = W(f, [84, 26]);
  const stmt = W(f, [120, 28]);
  const black = SE(f, [172, 28]);
  return (<>
    <div style={{opacity: 1 - shotsOut}}>
      {shots.map((s, i) => {
        const next = shots[i + 1]?.at ?? 78;
        if (f < s.at || f >= next) return null;
        return <div key={s.at}>{s.node}</div>;
      })}
      <Vig s={0.6} />
    </div>
    <div style={{position: 'absolute', inset: 0, background: INK, opacity: shotsOut}} />
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: easeOutCubic(lock) * (1 - SE(f, [114, 10]))}}>
      <Track t={lock} size={64} tracking={0.28}>Cullen &amp; Noir</Track>
      <div style={{height: 22}} />
      <Track t={clamp01(lock * 1.3 - 0.3)} size={16} serif={false} tracking={0.44} color={MUTE}>Website &nbsp;&middot;&nbsp; Product experience &nbsp;&middot;&nbsp; Development</Track>
    </div>
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <Track t={stmt} size={46} tracking={0.2}>A premium product</Track>
      <div style={{height: 14}} />
      <Track t={clamp01(stmt * 1.2 - 0.25)} size={46} tracking={0.2}>deserves a premium experience.</Track>
    </div>
    <div style={{position: 'absolute', inset: 0, background: '#000', opacity: black}} />
  </>);
};

/* 07 the client, after the film: a card, then her video as recorded */
const S07Card: React.FC = () => {
  const f = useCurrentFrame();
  const out = SE(f, [46, 14]);
  return (<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 1 - out}}>
    <Track t={W(f, [4, 24])} size={34} tracking={0.3}>In the client&rsquo;s words</Track>
  </div>);
};
const S08Testi: React.FC = () => {
  const f = useCurrentFrame();
  const inn = E(f, [0, 16]);
  const out = SE(f, [CN_TESTI - 30, 30]);
  const cap = (testi.captions as {from: number; to: number; text: string}[]).find((c) => f >= c.from && f <= c.to);
  return (<>
    {/* the client, cut out of his room frame by frame (scripts/matte.mjs)
        and set against the film's own dark plate; his picture and words are
        untouched */}
    <div style={{position: 'absolute', inset: 0, opacity: inn * (1 - out)}}>
      <OffthreadVideo src={staticFile('cn/testimonial.mp4')} muted style={{width: 1920, height: 1080, objectFit: 'cover'}} />
    </div>
    <Vig s={0.35} />
    <div style={{position: 'absolute', left: 120, bottom: 150, opacity: E(f, [30, 20]) * (1 - out)}}>
      <Rule t={E(f, [30, 16])} />
      <div style={{height: 14}} />
      {testi.name ? <Track t={E(f, [36, 18])} size={34} tracking={0.2}>{testi.name}</Track> : null}
      <Track t={E(f, [40, 18])} size={15} serif={false} tracking={0.4} color={MUTE}>{testi.role}</Track>
    </div>
    {cap ? (
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 36, textAlign: 'center', opacity: 1 - out}}>
        <span style={{display: 'inline-block', padding: '8px 22px', borderRadius: 4, background: 'rgba(0,0,0,0.6)', fontFamily: SANS, fontSize: 34, fontWeight: 500, color: IVORY}}>{cap.text}</span>
      </div>
    ) : null}
  </>);
};

export const CnFilm: React.FC = () => (
  <AbsoluteFill style={{background: INK, color: IVORY}}>
    {[[0, 180, <S01 />], [180, 180, <S02 />], [360, 240, <S03 />], [600, 210, <S04 />], [810, 210, <S05 />], [1020, 180, <S06 />], [CN_FILM, CN_CARD, <S07Card />], [CN_FILM + CN_CARD, CN_TESTI, <S08Testi />]].map(([at, n, node], i) => (
      <Sequence key={i} from={at as number} durationInFrames={n as number} premountFor={12}>{node as React.ReactNode}</Sequence>
    ))}
    <Grain opacity={0.07} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------- score */
import {Audio, interpolate} from 'remotion';
import {MIX} from '../audio/Layers';

const CUES: [number, string, number][] = [
  [CN_FILM + 4, 'LOW_TONE', 0.14],
  [0, 'LOW_TONE', 0.18], [48, 'TONAL_HIT', 0.14], [236, 'TONAL_HIT', 0.12],
  [346, 'SWELL_IN', 0.22], [362, 'HIT_SECTION', 0.22], [396, 'TONAL_HIT', 0.14],
  [600, 'SWEEP_DARK', 0.22], [670, 'SWEEP_SOFT', 0.18], [718, 'TONAL_HIT', 0.14],
  [810, 'SWEEP_SOFT', 0.18], [850, 'UI_CLICK', 0.10], [882, 'UI_CLICK', 0.10], [914, 'UI_CLICK', 0.10],
  [1020, 'SWEEP_DARK', 0.2], [1042, 'DIGITAL_TICK', 0.08], [1062, 'DIGITAL_TICK', 0.08], [1080, 'DIGITAL_TICK', 0.08],
  [1104, 'TONAL_HIT', 0.16], [1140, 'IMPACT_MEDIUM', 0.26], [1140, 'TONAL_HIT_LOW', 0.26],
];
// Outline, from 24 s in: atmospheric under the hook, the lift at its 36 s
// lands as Midnight Ashes appears, and it holds confidently to the end.
const ARC: [number, number][] = [[0, 0], [20, 0.5], [340, 0.52], [360, 0.62], [800, 0.62], [1020, 0.7], [1120, 0.7], [1140, 0.5], [1176, 0.3], [1200, 0.08], [CN_FILM + CN_CARD, 0.03], [CN_FRAMES - 40, 0.03], [CN_FRAMES, 0]];
const ramp = (f: number) => { let i = 0; while (i < ARC.length - 2 && ARC[i + 1][0] <= f) i++; return interpolate(f, [ARC[i][0], ARC[i + 1][0]], [ARC[i][1], ARC[i + 1][1]], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); };

export const CnAudio: React.FC<{music: boolean}> = ({music}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {music ? <Audio src={staticFile('audio/cn-music.wav')} trimBefore={24 * FPS} volume={(f) => Math.max(0, Math.min(1, ramp(f) * MIX.music))} /> : null}
    <Sequence from={CN_FILM + CN_CARD} durationInFrames={CN_TESTI}><Audio src={staticFile('cn/testimonial.mp4')} /></Sequence>
    {CUES.map(([at, s, g], i) => (
      <Sequence key={i} from={at} durationInFrames={Math.min(90, CN_FRAMES - at)}>
        <Audio src={staticFile(`audio/sfx/${s}.wav`)} volume={g} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
