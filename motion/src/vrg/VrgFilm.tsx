import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {easeInOutCubic, easeOutCubic, win} from '../motion/Path';
import {clamp01, lerp} from '../motion/timing';
import {Grain} from '../case/pieces';
import {MIX} from '../audio/Layers';

/* =====================================================================
   VRG EV. Sixty-four seconds, cut to "Now We Are Free".
   Every screen is a phone cut out of Rahul's own design boards
   (public/vrg/dark, public/vrg/light, by scripts/vrg-crop.js); nothing is
   redrawn. Dark and light are the same board's two phones, so the morph
   is the same screen in both modes. No metric anywhere.

   THE TRACK from 1:22: it builds to its peak at 2:10 to 2:24 under the
   ecosystem reveal and the final, and its drop at 2:26 ends the film.
   ===================================================================== */

const INK = '#0A0C0B', PAPER = '#F4F3EE', MUTE = 'rgba(244,243,238,0.55)', ACC = '#C9F53F';
const SANS = '"Helvetica Neue",Helvetica,Arial,sans-serif';
export const VRG_FRAMES = 1920;
const MUSIC_START_SEC = 82;

const d = (n: number | string) => staticFile(`vrg/dark/${String(n).padStart(3, '0')}.png`);
const l = (n: number | string) => staticFile(`vrg/light/${String(n).padStart(3, '0')}.png`);
const W = (f: number, b: readonly [number, number]) => win(f, b[0], b[1]);
const E = (f: number, b: readonly [number, number]) => easeOutCubic(W(f, b));
const SE = (f: number, b: readonly [number, number]) => easeInOutCubic(W(f, b));

const Big: React.FC<{t: number; out?: number; size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({t, out = 0, size = 96, color = PAPER, style, children}) => {
  const e = easeOutCubic(t);
  return <div style={{fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: '-0.03em', lineHeight: 1.0, color, whiteSpace: 'nowrap', opacity: e * (1 - out), transform: `translateY(${(1 - e) * 18}px)`, clipPath: `inset(0% 0% ${(1 - e) * 100}% 0%)`, ...style}}>{children}</div>;
};
const Small: React.FC<{t: number; out?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({t, out = 0, color = MUTE, style, children}) => {
  const e = easeOutCubic(t);
  return <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 18, letterSpacing: '0.32em', textTransform: 'uppercase', color, whiteSpace: 'nowrap', opacity: e * (1 - out), transform: `translateY(${(1 - e) * 8}px)`, ...style}}>{children}</div>;
};
const Vig: React.FC<{s?: number}> = ({s = 0.6}) => <div style={{position: 'absolute', inset: 0, background: `radial-gradient(125% 95% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${s}) 100%)`}} />;

/** A phone screen in space: the crop at its own aspect, masked to the phone's
    rounded corners so no board background shows at the edges, and moved
    without any perspective or scale so it stays pixel sharp. */
const Screen: React.FC<{src: string; cx: number; cy: number; h: number; t?: number; from?: [number, number]; tilt?: number; opacity?: number; dim?: number; light?: string; mix?: number}> =
  ({src, cx, cy, h, t = 1, from = [0, 40], opacity = 1, dim = 1, light, mix = 0}) => {
    const e = easeOutCubic(t);
    const w = Math.round(h * 0.47);
    return (
      <div style={{position: 'absolute', left: Math.round(cx - w / 2), top: Math.round(cy - h / 2), width: w, height: h, opacity: clamp01(e * 1.6) * opacity,
        transform: `translate(${Math.round(from[0] * (1 - e))}px, ${Math.round(from[1] * (1 - e))}px)`,
        filter: `brightness(${dim})`, borderRadius: Math.round(w * 0.13), overflow: 'hidden', background: '#000', boxShadow: '0 40px 110px rgba(0,0,0,0.8)'}}>
        <Img src={src} style={{position: 'absolute', left: '-1.5%', top: '-1%', width: '103%', height: '102%', objectFit: 'cover', display: 'block'}} />
        {light ? (
          <div style={{position: 'absolute', inset: 0, clipPath: `inset(0% 0% ${(1 - clamp01(mix)) * 100}% 0%)`}}>
            <Img src={light} style={{position: 'absolute', left: '-1.5%', top: '-1%', width: '103%', height: '102%', objectFit: 'cover', display: 'block'}} />
          </div>
        ) : null}
        {light && mix > 0 && mix < 1 ? <div style={{position: 'absolute', left: '4%', right: '4%', top: `${mix * 100}%`, height: 2, background: ACC, boxShadow: '0 0 18px 2px rgba(201,245,63,0.6)'}} /> : null}
      </div>
    );
  };

const site = (i: number) => staticFile(`vrg/site/desktop_seq/f${String(Math.max(0, Math.min(599, Math.round(i)))).padStart(4, '0')}.jpg`);
const msite = (n: number) => staticFile(`vrg/site/mobile_s${String(n).padStart(2, '0')}.jpg`);
const Full: React.FC<{src: string; scale?: number; opacity?: number; dim?: number}> = ({src, scale = 1, opacity = 1, dim = 1}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity}}>
    <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover', transform: `scale(${scale})`, transformOrigin: '50% 50%', filter: `brightness(${dim})`}} />
  </div>
);

/* 01 the landing page, 0 to 270: the real hero, held, with a slow push */
const S01: React.FC = () => {
  const f = useCurrentFrame();
  const out = SE(f, [256, 14]);
  return (<>
    <Full src={site(Math.min(23, f * 0.3))} scale={1.03 + 0.05 * easeInOutCubic(f / 270)} opacity={1 - out * 0.7} />
    <Vig s={0.4} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 280, background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)'}} />
    <div style={{position: 'absolute', left: 110, bottom: 90, opacity: 1 - out}}>
      <Big t={W(f, [60, 24])} size={74}>VRG EV</Big>
      <div style={{height: 14}} />
      <Small t={W(f, [86, 24])}>Landing page &nbsp;&middot;&nbsp; iOS &amp; Android app &nbsp;&middot;&nbsp; Driver app</Small>
    </div>
  </>);
};

/* 02 the site advancing, 270 to 660: the captured sections and their own transitions, played as recorded */
const S02: React.FC = () => {
  const f = useCurrentFrame();
  const out = SE(f, [376, 14]);
  return (<>
    <Full src={site(24 + f * 1.25)} scale={1.02} opacity={1 - out * 0.7} />
    <Vig s={0.35} />
    <div style={{position: 'absolute', left: 110, top: 100, opacity: 1 - out}}><Small t={E(f, [6, 18])}>vrgev.com &nbsp;&middot;&nbsp; scroll to advance</Small></div>
  </>);
};

/* 03 the site on a phone, 660 to 840 */
const S03: React.FC = () => {
  const f = useCurrentFrame();
  const out = SE(f, [166, 14]);
  const secs = [0, 2, 6, 5];
  const i = Math.min(secs.length - 1, Math.floor(f / 44));
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <Full src={site(0)} scale={1.1} dim={0.22} opacity={1 - out} />
    <div style={{opacity: 1 - out}}>
      {secs.map((n, k) => (k === i || k === i - 1) ? <Screen key={n} src={msite(n)} cx={1300} cy={540} h={900} t={k === i ? W(f, [k * 44, 14]) : 1} from={[0, 30]} opacity={k === i ? 1 : 1 - W(f, [i * 44, 14])} /> : null)}
    </div>
    <div style={{position: 'absolute', left: 110, top: 380, opacity: 1 - out}}>
      <Small t={E(f, [6, 18])}>The landing page</Small>
      <div style={{height: 22}} />
      <Big t={W(f, [14, 22])} size={64}>Built responsive.</Big>
      <Big t={W(f, [24, 22])} size={64} color={MUTE}>Desktop to phone.</Big>
    </div>
  </>);
};

/* 04 the statement, 840 to 1080: what was built, one line at a time, one screen beside each */
const S04: React.FC = () => {
  const f = useCurrentFrame();
  const out = SE(f, [226, 14]);
  const rows: [string, string, string, number][] = [
    ['iOS & Android app', 'Passenger', d(121), 70], ['Driver app', 'Conductor & driver', d(44), 120], ['Landing page', 'vrgev.com', site(0), 170],
  ];
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{position: 'absolute', left: 110, top: 150, opacity: 1 - out}}>
      <Small t={E(f, [4, 18])}>The whole system</Small>
      <div style={{height: 22}} />
      <Big t={W(f, [12, 24])} size={66}>I designed and built</Big>
      <Big t={W(f, [22, 24])} size={66} color={ACC}>the entire system.</Big>
    </div>
    <div style={{position: 'absolute', left: 110, top: 440, opacity: 1 - out}}>
      {rows.map(([t, sub, , at]) => (
        <div key={t} style={{marginBottom: 34}}>
          <Big t={W(f, [at, 20])} size={48}>{t}</Big>
          <div style={{height: 6}} />
          <Small t={W(f, [at + 6, 18])}>{sub}</Small>
        </div>
      ))}
    </div>
    <div style={{opacity: 1 - out}}>
      <Screen src={rows[0][2]} cx={1180} cy={540} h={760} t={W(f, [70, 20])} from={[40, 0]} />
      <Screen src={rows[1][2]} cx={1480} cy={560} h={700} t={W(f, [120, 20])} from={[40, 0]} />
      <div style={{position: 'absolute', left: 1240, top: 790, width: 560, height: 315, borderRadius: 8, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', opacity: E(f, [170, 20]), transform: `translateY(${(1 - E(f, [170, 20])) * 30}px)`}}>
        <Img src={site(0)} style={{width: 560, height: 315, objectFit: 'cover', display: 'block'}} />
      </div>
    </div>
    <Vig s={0.4} />
  </>);
};

/* 05 dark and light, 1080 to 1320: the same three screens become light */
const S05: React.FC = () => {
  const f = useCurrentFrame();
  const trio: [number, number][] = [[121, 20], [125, 60], [109, 100]];
  const out = SE(f, [226, 14]);
  const line = W(f, [150, 22]);
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{opacity: 1 - out}}>
      {trio.map(([n, at], i) => <Screen key={n} src={d(n)} light={l(n)} mix={SE(f, [at, 40])} cx={520 + i * 460} cy={500} h={800} t={W(f, [i * 6, 18])} from={[0, 50]} />)}
    </div>
    <Vig s={0.5} />
    <div style={{position: 'absolute', left: 110, bottom: 90, opacity: 1 - out}}>
      <div style={{display: 'flex', gap: 28, alignItems: 'baseline'}}>
        <Big t={line} size={62}>Dark.</Big><Big t={clamp01(line * 1.3 - 0.2)} size={62} color={MUTE}>Light.</Big>
      </div>
      <div style={{height: 10}} />
      <Big t={clamp01(line * 1.3 - 0.4)} size={62} color={ACC}>One design system.</Big>
    </div>
  </>);
};

/* 06 the services, 1320 to 1560: three screens per service, three services */
const S06: React.FC = () => {
  const f = useCurrentFrame();
  const groups: [string, number[]][] = [['Cab', [125, 148, 133]], ['Bus', [134, 137, 138]], ['Charging', [108, 110, 115]]];
  const gi = Math.min(2, Math.floor(f / 80));
  const g = groups[gi], since = f - gi * 80;
  const out = SE(f, [226, 14]);
  const gout = gi < 2 ? SE(since, [68, 12]) : 0;
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{opacity: (1 - out) * (1 - gout)}}>
      {g[1].map((n, i) => <Screen key={`${gi}-${n}`} src={d(n)} cx={900 + i * 420} cy={520} h={780} t={W(since, [i * 6, 16])} from={[40, 0]} />)}
    </div>
    <div style={{position: 'absolute', left: 110, top: 380, opacity: 1 - out}}>
      <Small t={E(since, [2, 14])} out={gout}>{g[0]}</Small>
      <div style={{height: 22}} />
      <Big t={W(f, [6, 22])} size={56}>Cab. Bus. Charging.</Big>
      <Big t={W(f, [16, 22])} size={56} color={ACC}>One platform.</Big>
    </div>
    <Vig s={0.45} />
  </>);
};

/* 07 the driver app, 1560 to 1740 */
const S07: React.FC = () => {
  const f = useCurrentFrame();
  const out = SE(f, [166, 14]);
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{opacity: 1 - out}}>
      {[46, 60, 66].map((n, i) => <Screen key={n} src={d(n)} cx={900 + i * 420} cy={520} h={780} t={W(f, [i * 8, 18])} from={[40, 0]} />)}
    </div>
    <div style={{position: 'absolute', left: 110, top: 360, width: 700, opacity: 1 - out}}>
      <Small t={E(f, [4, 18])}>The driver app</Small>
      <div style={{height: 22}} />
      <Big t={W(f, [12, 22])} size={52}>Not just the</Big>
      <Big t={W(f, [20, 22])} size={52}>passenger experience.</Big>
      <div style={{height: 14}} />
      <Big t={W(f, [50, 22])} size={52} color={ACC}>The system behind it.</Big>
    </div>
    <Vig s={0.45} />
  </>);
};

/* 08 final, 1740 to 1920: the site hero behind, the lockup, the close */
const S08: React.FC = () => {
  const f = useCurrentFrame();
  const lock = W(f, [20, 22]), line = W(f, [60, 20]), close = W(f, [110, 16]);
  return (<>
    <Full src={site(0)} scale={1.06 + 0.03 * (f / 180)} dim={0.3} />
    <div style={{position: 'absolute', inset: 0, background: 'rgba(10,12,11,0.45)'}} />
    <Vig s={0.6} />
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <Big t={lock} size={96}>VRG EV</Big>
      <div style={{height: 16}} />
      <Small t={clamp01(lock * 1.3 - 0.3)} color={PAPER}>Landing page &nbsp;&middot;&nbsp; iOS &amp; Android app &nbsp;&middot;&nbsp; Driver app</Small>
      <div style={{height: 50}} />
      <Big t={line} size={44} style={{letterSpacing: '0.01em'}}>Designed for the journey.</Big>
      <div style={{height: 40}} />
      <Small t={close} color={ACC} style={{fontSize: 22}}>You bring the problem. &nbsp;I handle the build.</Small>
    </div>
  </>);
};

export const VrgFilm: React.FC = () => (
  <AbsoluteFill style={{background: INK, color: PAPER, fontFamily: SANS}}>
    {[[0, 270, <S01 />], [270, 390, <S02 />], [660, 180, <S03 />], [840, 240, <S04 />], [1080, 240, <S05 />], [1320, 240, <S06 />], [1560, 180, <S07 />], [1740, 180, <S08 />]].map(([at, n, node], i) => (
      <Sequence key={i} from={at as number} durationInFrames={n as number} premountFor={12}>{node as React.ReactNode}</Sequence>
    ))}
    <Grain opacity={0.04} />
  </AbsoluteFill>
);

const CUES: [number, string, number][] = [
  [60, 'TONAL_HIT', 0.12], [270, 'SWEEP_SOFT', 0.14], [334, 'UI_CLICK', 0.08], [398, 'UI_CLICK', 0.08], [462, 'UI_CLICK', 0.08], [526, 'UI_CLICK', 0.08], [590, 'UI_CLICK', 0.08],
  [660, 'SWEEP_SOFT', 0.14], [840, 'SWEEP_DARK', 0.18], [862, 'TONAL_HIT', 0.14], [910, 'UI_CLICK', 0.1], [960, 'UI_CLICK', 0.1], [1010, 'UI_CLICK', 0.1],
  [1080, 'SWEEP_SOFT', 0.14], [1100, 'TONAL_HIT', 0.12], [1140, 'TONAL_HIT', 0.12], [1180, 'TONAL_HIT', 0.12], [1230, 'IMPACT_MEDIUM', 0.22], [1230, 'TONAL_HIT_LOW', 0.2],
  [1320, 'SWEEP_DARK', 0.16], [1400, 'SWEEP_SOFT', 0.12], [1480, 'SWEEP_SOFT', 0.12], [1560, 'SWEEP_SOFT', 0.14], [1610, 'TONAL_HIT', 0.14],
  [1710, 'SWELL_IN', 0.22], [1742, 'IMPACT_MEDIUM', 0.26], [1742, 'TONAL_HIT_LOW', 0.24], [1800, 'TONAL_HIT', 0.14], [1850, 'TONAL_HIT_LOW', 0.18],
];
const ARC: [number, number][] = [[0, 0.5], [300, 0.56], [1140, 0.6], [1680, 0.66], [1880, 0.66], [1920, 0]];
const ramp = (f: number) => { let i = 0; while (i < ARC.length - 2 && ARC[i + 1][0] <= f) i++; return interpolate(f, [ARC[i][0], ARC[i + 1][0]], [ARC[i][1], ARC[i + 1][1]], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); };
export const VrgAudio: React.FC<{music: boolean}> = ({music}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {music ? <Audio src={staticFile('audio/vrg-music.wav')} trimBefore={MUSIC_START_SEC * 30} volume={(f) => Math.max(0, Math.min(1, ramp(f) * MIX.music))} /> : null}
    {CUES.map(([at, s, g], i) => <Sequence key={i} from={at} durationInFrames={Math.min(90, VRG_FRAMES - at)}><Audio src={staticFile(`audio/sfx/${s}.wav`)} volume={g} /></Sequence>)}
  </AbsoluteFill>
);
