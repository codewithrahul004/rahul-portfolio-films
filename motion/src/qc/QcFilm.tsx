import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {easeInOutCubic, easeOutCubic, win} from '../motion/Path';
import {clamp01, lerp} from '../motion/timing';
import {Grain, Phone} from '../case/pieces';

/* =====================================================================
   QC LOBBY. Fifty seconds. Silent edit first, for approval; the score
   follows once the track is supplied. Real only: qclobby.com captured in
   headless Chromium on 9 October (public/qc), its own product screenshots
   inside the page as the product beat, and Basavaraj's WhatsApp message
   as the screenshot. No metric: none was supplied.
   ===================================================================== */

const INK = '#07090D', PAPER = '#F2F4F8', MUTE = 'rgba(242,244,248,0.55)', ACC = '#8DB4F2';
const SANS = '"Helvetica Neue",Helvetica,Arial,sans-serif';
export const QC_FRAMES = 1500;

const seqF = (dir: string, i: number, n: number) => staticFile(`qc/${dir}/f${String(Math.max(0, Math.min(n - 1, Math.round(i)))).padStart(4, '0')}.jpg`);
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
const Vig: React.FC<{s?: number}> = ({s = 0.55}) => <div style={{position: 'absolute', inset: 0, background: `radial-gradient(125% 95% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,${s}) 100%)`}} />;
const Full: React.FC<{src: string; scale?: number; opacity?: number; dim?: number}> = ({src, scale = 1, opacity = 1, dim = 1}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity}}>
    <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover', objectPosition: 'top', transform: `scale(${scale})`, transformOrigin: '50% 50%', filter: `brightness(${dim})`}} />
  </div>
);
/** A window onto the full page: y is the page offset at the frame's top, s the zoom about the frame centre. */
const Page: React.FC<{y: number; s?: number; opacity?: number; dim?: number}> = ({y, s = 1, opacity = 1, dim = 1}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity}}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${s})`, transformOrigin: '50% 50%'}}>
      <Img src={staticFile('qc/desktop_full.jpg')} style={{position: 'absolute', left: 0, top: -y, width: 1920, height: 'auto', filter: `brightness(${dim})`}} />
    </div>
  </div>
);
const Ring: React.FC<{x: number; y: number; w: number; h: number; t: number}> = ({x, y, w, h, t}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `2px solid ${ACC}`, borderRadius: 8, opacity: easeOutCubic(t), boxShadow: '0 0 0 6px rgba(141,180,242,0.14)'}} />
);

/* A tablet frame, like the phone: the capture inside, a plain dark shell around it. */
const Tablet: React.FC<{src: string; cx: number; cy: number; scale?: number; opacity?: number; tilt?: number; panY?: number}> = ({src, cx, cy, scale = 1, opacity = 1, tilt = 0, panY = 0}) => {
  const w = 1024, h = 1366;
  return (
    <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, opacity, transform: `perspective(3000px) rotateY(${tilt}deg) scale(${scale})`, transformOrigin: '50% 50%'}}>
      <div style={{position: 'absolute', inset: -22, borderRadius: 40, background: '#141416', border: '1px solid #2A2A2E', boxShadow: '0 50px 140px rgba(0,0,0,0.85)'}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: 22, overflow: 'hidden', background: INK}}>
        <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: w, height: 'auto', transform: `translateY(${-panY}px)`}} />
      </div>
    </div>
  );
};

/* 01 the review first, 0 to 270: Basavaraj's message, a slow camera move */
const S01: React.FC = () => {
  const f = useCurrentFrame();
  const inn = E(f, [0, 20]);
  const push = SE(f, [16, 200]);
  const out = SE(f, [256, 14]);
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{position: 'absolute', left: 940, top: 300, width: 820, opacity: inn * (1 - out), borderRadius: 10, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
      transform: `translate(${-100 * push}px, ${-30 * push}px) scale(${1 + 0.16 * push})`, transformOrigin: '50% 50%'}}>
      <Img src={staticFile('pf/w_basavaraj.jpg')} style={{width: 820, display: 'block'}} />
    </div>
    <div style={{position: 'absolute', left: 110, top: 330, opacity: 1 - out}}>
      <Small t={E(f, [6, 18])}>Client proof</Small>
      <div style={{height: 22}} />
      <Big t={E(f, [12, 22])} size={72}>Basavaraj</Big>
      <div style={{height: 14}} />
      <Small t={E(f, [20, 18])} color={PAPER}>QC Lobby &nbsp;&middot;&nbsp; Landing page</Small>
      <div style={{height: 10}} />
      <Small t={E(f, [26, 18])}>WhatsApp, 7 February 2026</Small>
    </div>
  </>);
};

/* 02 the design, 270 to 1230: desktop, tablet and phone, each scrolling the real page at its own pace */
const S02: React.FC = () => {
  const f = useCurrentFrame();
  const inn = E(f, [0, 24]);
  const out = SE(f, [946, 14]);
  const swap = SE(f, [460, 40]);                       // the composition turns: tablet comes forward
  const push = 1 + 0.04 * easeInOutCubic(f / 960);
    const dX = lerp(0, -60, swap), pX = lerp(1560, 1500, swap);
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '50% 50%', opacity: inn * (1 - out)}}>
      <div style={{position: 'absolute', left: 60 + dX, top: 120, width: 1120, height: 700, borderRadius: 10, overflow: 'hidden', background: INK, boxShadow: '0 50px 140px rgba(0,0,0,0.85)', border: '1px solid rgba(242,244,248,0.1)', transform: 'perspective(2800px) rotateY(5deg)', opacity: lerp(1, 0.8, swap)}}>
        <Img src={seqF('desktop_scroll', f * 0.9, 360)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block'}} />
      </div>
      <Phone src={seqF('mobile_scroll', f * 0.28, 240)} cx={pX} cy={660} scale={lerp(0.78, 0.9, swap)} tilt={-10} />
    </div>
    <div style={{position: 'absolute', left: 110, bottom: 96, opacity: 1 - out}}>
      <Big t={W(f, [30, 24])} size={66}>QC Lobby</Big>
      <div style={{height: 14}} />
      <Small t={W(f, [52, 24])}>SaaS landing page &nbsp;&middot;&nbsp; desktop and mobile</Small>
    </div>
  </>);
};

/* 03 final, 1230 to 1500: the lockup, the line, clean */
const S03: React.FC = () => {
  const f = useCurrentFrame();
  const lock = W(f, [10, 22]), line = W(f, [60, 22]), close = W(f, [130, 20]);
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <Big t={lock} size={96}>QC Lobby</Big>
      <div style={{height: 18}} />
      <Small t={clamp01(lock * 1.3 - 0.3)} color={PAPER}>Landing page &nbsp;+&nbsp; SaaS product</Small>
      <div style={{height: 54}} />
      <Big t={line} size={44} style={{letterSpacing: '0.01em'}}>Design that moves people to action.</Big>
      <div style={{height: 44}} />
      <Small t={close} color={ACC} style={{fontSize: 22}}>You bring the problem. &nbsp;I handle the build.</Small>
    </div>
  </>);
};

export const QcFilm: React.FC = () => (
  <AbsoluteFill style={{background: INK, color: PAPER, fontFamily: SANS}}>
    {[[0, 270, <S01 />], [270, 960, <S02 />], [1230, 270, <S03 />]].map(([at, n, node], i) => (
      <Sequence key={i} from={at as number} durationInFrames={n as number} premountFor={12}>{node as React.ReactNode}</Sequence>
    ))}
    <Grain opacity={0.04} />
  </AbsoluteFill>
);

/* ---- score. The track from 0:14: quiet under the hero, its first lift at
   0:18 lands on the lockup, the dip at 0:48 to 0:58 sits under Basavaraj's
   message, and the big lift at 1:00 arrives with the final statement. */
import {Audio, interpolate} from 'remotion';
import {MIX} from '../audio/Layers';
const MUSIC_START_SEC = 49;
const CUES: [number, string, number][] = [
  [12, 'TONAL_HIT', 0.12], [270, 'SWEEP_SOFT', 0.16], [300, 'TONAL_HIT', 0.12], [330, 'HIT_SECTION', 0.2], [730, 'SWEEP_SOFT', 0.14],
  [1230, 'SWEEP_DARK', 0.16], [1240, 'TONAL_HIT', 0.14], [1290, 'IMPACT_MEDIUM', 0.22], [1290, 'TONAL_HIT_LOW', 0.2], [1360, 'TONAL_HIT', 0.12],
];
const ARC: [number, number][] = [[0, 0.3], [260, 0.3], [300, 0.6], [1460, 0.62], [1500, 0]];
const ramp = (f: number) => { let i = 0; while (i < ARC.length - 2 && ARC[i + 1][0] <= f) i++; return interpolate(f, [ARC[i][0], ARC[i + 1][0]], [ARC[i][1], ARC[i + 1][1]], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); };
export const QcAudio: React.FC<{music: boolean}> = ({music}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {music ? <Audio src={staticFile('audio/qc-music.wav')} trimBefore={MUSIC_START_SEC * 30} volume={(f) => Math.max(0, Math.min(1, ramp(f) * MIX.music))} /> : null}
    {CUES.map(([at, s, g], i) => <Sequence key={i} from={at} durationInFrames={Math.min(90, QC_FRAMES - at)}><Audio src={staticFile(`audio/sfx/${s}.wav`)} volume={g} /></Sequence>)}
  </AbsoluteFill>
);
