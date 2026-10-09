import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {easeInOutCubic, easeOutCubic, win} from '../motion/Path';
import {clamp01, lerp} from '../motion/timing';
import {Grain, Phone} from '../case/pieces';
import {MIX} from '../audio/Layers';

/* =====================================================================
   KSUNCH. Fifty-two seconds, cut to the Papaoutai instrumental.
   Store > experience > beyond the website > cart recovery > automation >
   scale > statement. Real only: the live store captured in headless
   Chromium (public/ksunch), the WooCommerce Cart Abandonment Recovery
   dashboard as supplied (public/ksunch/dashboard.png), the KSUNCH brief
   for the 90% line (k_brief.jpg) and Google Analytics for 77K (k_ga.jpg).

   THE TRACK. It starts at 0:56: a mid section under the store, the lift
   at 1:09 (local 13 s) under the buying journey, the strong section at
   1:26 (30 s) carrying the recovery figures, the fade from 1:41 (45 s)
   into the quiet outro for the final statement.
   ===================================================================== */

const INK = '#0A0A0A', PAPER = '#F3F1EC', MUTE = 'rgba(243,241,236,0.55)', ACC = '#C9A96E';
const SANS = '"Helvetica Neue",Helvetica,Arial,sans-serif';
export const KS_FRAMES = 1560;
const MUSIC_START_SEC = 56;

const seqF = (dir: string, i: number, n: number) => staticFile(`ksunch/${dir}/f${String(Math.max(0, Math.min(n - 1, Math.round(i)))).padStart(4, '0')}.jpg`);
const W = (f: number, b: readonly [number, number]) => win(f, b[0], b[1]);
const E = (f: number, b: readonly [number, number]) => easeOutCubic(W(f, b));
const SE = (f: number, b: readonly [number, number]) => easeInOutCubic(W(f, b));

const Big: React.FC<{t: number; out?: number; size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({t, out = 0, size = 96, color = PAPER, style, children}) => {
  const e = easeOutCubic(t);
  return <div style={{fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: '-0.03em', lineHeight: 0.98, color, whiteSpace: 'nowrap', opacity: e * (1 - out), transform: `translateY(${(1 - e) * 18}px)`, clipPath: `inset(0% 0% ${(1 - e) * 100}% 0%)`, ...style}}>{children}</div>;
};
const Small: React.FC<{t: number; out?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({t, out = 0, color = MUTE, style, children}) => {
  const e = easeOutCubic(t);
  return <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 18, letterSpacing: '0.32em', textTransform: 'uppercase', color, whiteSpace: 'nowrap', opacity: e * (1 - out), transform: `translateY(${(1 - e) * 8}px)`, ...style}}>{children}</div>;
};
const Vig: React.FC<{s?: number}> = ({s = 0.55}) => <div style={{position: 'absolute', inset: 0, background: `radial-gradient(125% 95% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,${s}) 100%)`}} />;
const Full: React.FC<{src: string; scale?: number; y?: number; opacity?: number; dim?: number}> = ({src, scale = 1, y = 0, opacity = 1, dim = 1}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity}}>
    <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover', objectPosition: 'top', transform: `translateY(${y}px) scale(${scale})`, transformOrigin: '50% 50%', filter: `brightness(${dim})`}} />
  </div>
);
const Frame: React.FC<{src: string; x: number; y: number; w: number; h: number; tilt?: number; opacity?: number; panY?: number}> = ({src, x, y, w, h, tilt = 0, opacity = 1, panY = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity, transform: `perspective(2800px) rotateY(${tilt}deg)`, transformOrigin: '50% 50%', overflow: 'hidden', borderRadius: 8, background: '#111', boxShadow: '0 50px 140px rgba(0,0,0,0.85)', border: '1px solid rgba(243,241,236,0.1)'}}>
    <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: w, height: 'auto', transform: `translateY(${-panY}px)`}} />
  </div>
);

/* 01 the store and the result together, 0 to 390 (13 s): the hook.
   Four seconds of the store full frame, then the site steps into a desktop
   and two phones on the left while the verified results stack on the
   right, with the real recovery dashboard beneath them. */
const S01: React.FC = () => {
  const f = useCurrentFrame();
  const split = SE(f, [96, 30]);
  const out = SE(f, [376, 14]);
  const results: [string, string, number][] = [
    ['\u20B983,141.10', 'Recovered revenue', 126], ['45', 'Recovered orders', 160],
    ['17.58%', 'Recovery rate', 190], ['77K', 'Active users, first 30 days', 220],
  ];
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    {/* full frame first, then it becomes the desktop on the left */}
    <div style={{position: 'absolute', left: lerp(0, 60, split), top: lerp(0, 120, split), width: lerp(1920, 1000, split), height: lerp(1080, 625, split),
      overflow: 'hidden', borderRadius: 10 * split, boxShadow: split > 0 ? '0 50px 140px rgba(0,0,0,0.85)' : undefined,
      transform: `perspective(2800px) rotateY(${4 * split}deg)`, transformOrigin: '50% 50%', opacity: 1 - out}}>
      <Img src={seqF('desktop_home_scroll', f * 1.3, 300)} style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top'}} />
    </div>
    <div style={{opacity: split * (1 - out)}}>
      <Phone src={seqF('mobile_home_scroll', f * 0.32, 200)} cx={lerp(1200, 940, split)} cy={640} scale={0.62} tilt={-8} />
      <Phone src={seqF('mobile_product_scroll', f * 0.26, 200)} cx={lerp(1380, 1120, split)} cy={720} scale={0.52} tilt={-12} opacity={0.9} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)', opacity: 1 - split}} />
    <div style={{position: 'absolute', left: 110, bottom: 96, opacity: (1 - split)}}>
      <Big t={W(f, [30, 24])} size={78}>KSUNCH</Big>
      <div style={{height: 14}} />
      <Small t={W(f, [54, 24])}>Ecommerce &nbsp;+&nbsp; Automation</Small>
    </div>
    {/* the results, beside the site */}
    <div style={{position: 'absolute', left: 1290, top: 150, opacity: 1 - out}}>
      <Small t={E(f, [110, 18])}>KSUNCH &nbsp;&middot;&nbsp; the result</Small>
      <div style={{height: 26}} />
      {results.map(([v, l, at], k) => (
        <div key={l} style={{marginBottom: 26}}>
          <Big t={W(f, [at, 20])} size={k === 0 ? 84 : 58} color={k === 0 ? ACC : PAPER}>{v}</Big>
          <div style={{height: 6}} />
          <Small t={W(f, [at + 6, 18])}>{l}</Small>
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', left: 1290, top: 740, width: 480, opacity: E(f, [250, 20]) * (1 - out), borderRadius: 8, overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,0.8)'}}>
      <Img src={staticFile('ksunch/dashboard.png')} style={{width: 480, display: 'block', filter: 'brightness(0.95)'}} />
    </div>
    <div style={{position: 'absolute', left: 1290, top: 1000, opacity: E(f, [258, 20]) * (1 - out)}}><Small t={1} style={{fontSize: 14}}>cart abandonment recovery dashboard, as captured</Small></div>
  </>);
};

/* 02 the experience, 390 to 900 (13 to 30 s): collections, product, cart, checkout on the lift */
const S02: React.FC = () => {
  const f = useCurrentFrame();
  const shots: {at: number; src: string; label: string; seq?: [string, number, number]; zoom?: boolean}[] = [
    {at: 0, src: '', label: 'Collections', seq: ['desktop_shop_scroll', 1.6, 300]},
    {at: 120, src: staticFile('ksunch/desktop_product_hero.jpg'), label: 'Product'},
    {at: 200, src: staticFile('ksunch/desktop_product_hero.jpg'), label: 'Fast checkout \u00b7 Buy now', zoom: true},
    {at: 300, src: staticFile('ksunch/desktop_addtocart_after.jpg'), label: 'Added to cart'},
    {at: 360, src: staticFile('ksunch/desktop_cart.jpg'), label: 'Cart'},
    {at: 420, src: staticFile('ksunch/desktop_checkout.jpg'), label: 'Checkout'},
  ];
  let i = 0; shots.forEach((s, k) => { if (f >= s.at) i = k; });
  const s = shots[i], since = f - s.at;
  const src = s.seq ? seqF(s.seq[0], since * s.seq[1], s.seq[2]) : s.src;
  const out = SE(f, [546, 14]);
  // the buy now beat: push into the real button, ring it
  const z = s.zoom ? easeInOutCubic(clamp01(since / 40)) : 0;
  const sc = s.zoom ? lerp(1.04, 2.3, z) : 1.02 + 0.03 * easeOutCubic(since / 100);
  const bx = 1071, by = 695; // the BUY NOW button, measured on the capture
  const tx = s.zoom ? (960 - bx) * z : 0, ty = s.zoom ? (540 - by) * z : 0;
  return (<>
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity: 1 - out * 0.8}}>
      <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover', objectPosition: 'top', transform: `translate(${tx}px, ${ty}px) scale(${sc})`, transformOrigin: `${s.zoom ? bx : 960}px ${s.zoom ? by : 540}px`}} />
      {s.zoom ? <div style={{position: 'absolute', left: 960 - 95 * sc, top: 540 - 24 * sc, width: 190 * sc, height: 48 * sc, border: `2px solid ${ACC}`, borderRadius: 6, opacity: easeOutCubic(clamp01((since - 30) / 14)), boxShadow: '0 0 0 6px rgba(201,169,110,0.15)'}} /> : null}
    </div>
    <Vig s={0.4} />
    <div style={{position: 'absolute', left: 110, top: 110, opacity: (1 - out) * (1 - SE(f, [470, 12]))}}>
      <Small t={clamp01(since / 10)}>{String(i + 1).padStart(2, '0')} &nbsp;{s.label}</Small>
    </div>
    {/* 07 mobile: the bottom navigation, ringed, with the figures beside it */}
    {f >= 470 ? (() => {
      const m = f - 470, mi = E(m, [0, 18]);
      return (<div style={{opacity: mi * (1 - out)}}>
        <div style={{position: 'absolute', inset: 0, background: INK}} />
        <Phone src={staticFile('ksunch/mobile_shop_hero.jpg')} cx={560} cy={560} scale={1.0} />
        <div style={{position: 'absolute', left: 560 - 195, top: 560 + 422 - 56, width: 390, height: 56, border: `2px solid ${ACC}`, borderRadius: 4, opacity: easeOutCubic(clamp01((m - 20) / 14)), boxShadow: '0 0 0 6px rgba(201,169,110,0.15)'}} />
        <div style={{position: 'absolute', left: 960, top: 300}}>
          <Small t={E(m, [8, 16])}>07 &nbsp;Mobile &nbsp;&middot;&nbsp; bottom navigation</Small>
          <div style={{height: 20}} />
          <Big t={W(m, [14, 20])} size={56}>Home, orders, shop, account.</Big>
          <div style={{height: 8}} />
          <Big t={W(m, [24, 20])} size={56} color={MUTE}>One thumb away.</Big>
          <div style={{height: 40}} />
          <div style={{display: 'flex', gap: 60}}>
            <div><Big t={W(m, [36, 18])} size={54} color={ACC}>&#8377;83,141.10</Big><div style={{height: 6}} /><Small t={W(m, [40, 16])}>Recovered revenue</Small></div>
            <div><Big t={W(m, [44, 18])} size={54}>17.58%</Big><div style={{height: 6}} /><Small t={W(m, [48, 16])}>Recovery rate</Small></div>
          </div>
        </div>
      </div>);
    })() : null}
  </>);
};

/* 03 beyond the website, 900 to 1050 (30 to 35 s): the chain, one word at a time, fast */
const S03: React.FC = () => {
  const f = useCurrentFrame();
  const words = ['Website', 'Orders', 'Operations', 'Automation'];
  const out = SE(f, [86, 14]);
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <Full src={staticFile('ksunch/desktop_home_hero.jpg')} scale={1.08} dim={0.18} opacity={1 - SE(f, [20, 24])} />
    <div style={{position: 'absolute', left: 110, top: 120, opacity: 1 - out}}><Small t={E(f, [2, 16])}>Beyond the website</Small></div>
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 1 - out}}>
      {words.map((w, k) => (
        <div key={w} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {k > 0 ? <div style={{width: 1, height: 26 * E(f, [6 + k * 16, 8]), background: ACC, margin: '8px 0'}} /> : null}
          <Big t={W(f, [8 + k * 16, 14])} size={k === 3 ? 84 : 56} color={k === 3 ? PAPER : MUTE}>{w}</Big>
        </div>
      ))}
    </div>
  </>);
};

/* 04 cart recovery, 1050 to 1350 (35 to 45 s): the real dashboard, the figure isolated, then the two beside it */
const S04: React.FC = () => {
  const f = useCurrentFrame();
  // the dashboard capture is 2000x1033; the recovered revenue card sits at about x 788..1365, y 700..878
  const inn = E(f, [0, 20]);
  const zoom = SE(f, [40, 50]);                       // push into the card
  const sc = lerp(0.96, 2.1, zoom);
  const cx = lerp(1000, 1076, zoom), cy = lerp(516, 790, zoom); // dashboard point kept at frame centre
  const dim = lerp(1, 0.35, SE(f, [96, 20]));
  const head = W(f, [100, 22]), sub = W(f, [116, 22]);
  const side = W(f, [170, 22]);
  const out = SE(f, [286, 14]);
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden', opacity: inn * (1 - out)}}>
      <Img src={staticFile('ksunch/dashboard.png')} style={{position: 'absolute', left: 960 - cx * sc, top: 540 - cy * sc, width: 2000 * sc, height: 'auto', filter: `brightness(${dim})`}} />
    </div>
    <div style={{position: 'absolute', left: 110, top: 110, opacity: inn * (1 - out)}}><Small t={E(f, [6, 16])}>WooCommerce &nbsp;&middot;&nbsp; cart abandonment recovery &nbsp;&middot;&nbsp; as captured</Small></div>
    {/* the figure, isolated: the typography repeats the real number, it does not count */}
    <div style={{position: 'absolute', left: 110, bottom: 120, opacity: 1 - out}}>
      <Big t={head} size={150} color={PAPER}>&#8377;83,141.10</Big>
      <div style={{height: 16}} />
      <Small t={sub} color={ACC} style={{fontSize: 24}}>Recovered revenue</Small>
      <div style={{height: 36}} />
      <div style={{display: 'flex', gap: 80}}>
        <div><Big t={side} size={64}>45</Big><div style={{height: 8}} /><Small t={side}>Recovered orders</Small></div>
        <div><Big t={clamp01(side * 1.3 - 0.3)} size={64}>17.58%</Big><div style={{height: 8}} /><Small t={clamp01(side * 1.3 - 0.3)}>Recovery rate</Small></div>
      </div>
    </div>
  </>);
};

/* 05 automation and scale, 1350 to 1470 (45 to 49 s): the brief's own line, GA's own number */
const S05: React.FC = () => {
  const f = useCurrentFrame();
  const out = SE(f, [106, 14]);
  const b = W(f, [4, 20]), g = W(f, [50, 20]);
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{position: 'absolute', left: 110, top: 200, opacity: (1 - SE(f, [48, 10])) * (1 - out)}}>
      <Big t={b} size={170}>90%</Big>
      <div style={{height: 14}} />
      <Small t={clamp01(b * 1.3 - 0.3)} color={PAPER} style={{fontSize: 24}}>Daily operations automated</Small>
      <div style={{height: 10}} />
      <Small t={clamp01(b * 1.3 - 0.4)}>From the KSUNCH brief</Small>
    </div>
    <div style={{position: 'absolute', left: 1000, top: 170, width: 820, opacity: easeOutCubic(b) * (1 - SE(f, [48, 10])) * (1 - out), borderRadius: 10, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.8)'}}>
      <Img src={staticFile('k_brief.jpg')} style={{width: 820, display: 'block', filter: 'brightness(0.9)'}} />
    </div>
    <div style={{position: 'absolute', left: 110, top: 200, opacity: 1 - out}}>
      <Big t={g} size={170}>77K</Big>
      <div style={{height: 14}} />
      <Small t={clamp01(g * 1.3 - 0.3)} color={PAPER} style={{fontSize: 24}}>Active users, first 30 days</Small>
      <div style={{height: 10}} />
      <Small t={clamp01(g * 1.3 - 0.4)}>Google Analytics</Small>
    </div>
    <div style={{position: 'absolute', left: 1000, top: 170, width: 620, opacity: easeOutCubic(g) * (1 - out), borderRadius: 10, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.8)'}}>
      <Img src={staticFile('k_ga.jpg')} style={{width: 620, display: 'block', filter: 'brightness(0.9)'}} />
    </div>
  </>);
};

/* 06 the statement, 1470 to 1560 (49 to 52 s): the store, then the lines, then clean */
const S06: React.FC = () => {
  const f = useCurrentFrame();
  const siteOut = SE(f, [30, 14]);
  const lock = W(f, [36, 20]), line = W(f, [60, 20]), close = W(f, [74, 16]);
  return (<>
    <Full src={staticFile('ksunch/desktop_product_hero.jpg')} scale={1.08} opacity={1 - siteOut} dim={0.9} />
    <div style={{position: 'absolute', inset: 0, background: INK, opacity: siteOut}} />
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <Big t={lock} size={96}>KSUNCH</Big>
      <div style={{height: 18}} />
      <Small t={clamp01(lock * 1.3 - 0.3)} color={PAPER}>Ecommerce &nbsp;&middot;&nbsp; Automation &nbsp;&middot;&nbsp; Recovery</Small>
      <div style={{height: 54}} />
      <Big t={line} size={40} style={{letterSpacing: '0.01em'}}>A store should sell.</Big>
      <div style={{height: 8}} />
      <Big t={clamp01(line * 1.2 - 0.25)} size={40} color={MUTE} style={{letterSpacing: '0.01em'}}>The system behind it should keep working.</Big>
      <div style={{height: 44}} />
      <Small t={close} color={ACC} style={{fontSize: 22}}>You bring the problem. &nbsp;I handle the build.</Small>
    </div>
  </>);
};

export const KsunchFilm: React.FC = () => (
  <AbsoluteFill style={{background: INK, color: PAPER, fontFamily: SANS}}>
    {[[0, 390, <S01 />], [390, 560, <S02 />], [950, 100, <S03 />], [1050, 300, <S04 />], [1350, 120, <S05 />], [1470, 90, <S06 />]].map(([at, n, node], i) => (
      <Sequence key={i} from={at as number} durationInFrames={n as number} premountFor={12}>{node as React.ReactNode}</Sequence>
    ))}
    <Grain opacity={0.04} />
  </AbsoluteFill>
);

const CUES: [number, string, number][] = [
  [50, 'TONAL_HIT', 0.12], [390, 'HIT_SECTION', 0.24], [510, 'UI_CLICK', 0.12], [590, 'SWEEP_SOFT', 0.14], [624, 'TONAL_HIT', 0.14], [690, 'UI_CLICK', 0.14], [750, 'UI_CLICK', 0.12], [810, 'UI_CLICK', 0.12], [860, 'SWEEP_SOFT', 0.14], [896, 'TONAL_HIT', 0.14],
  [950, 'SWEEP_DARK', 0.2], [958, 'DIGITAL_TICK', 0.1], [974, 'DIGITAL_TICK', 0.1], [990, 'DIGITAL_TICK', 0.1], [1006, 'TONAL_HIT', 0.14],
  [1050, 'SWELL_IN', 0.2], [1090, 'BLOOM', 0.18], [1150, 'IMPACT_MEDIUM', 0.3], [1150, 'TONAL_HIT_LOW', 0.28], [1220, 'TONAL_HIT', 0.16],
  [1354, 'IMPACT_MEDIUM', 0.24], [1400, 'TONAL_HIT', 0.16], [1470, 'SWEEP_SOFT', 0.14], [1506, 'TONAL_HIT', 0.16], [1544, 'TONAL_HIT_LOW', 0.2],
];
const ARC: [number, number][] = [[0, 0.6], [1040, 0.6], [1050, 0.42], [1140, 0.42], [1150, 0.62], [1480, 0.62], [1540, 0.4], [1560, 0]];
const ramp = (f: number) => { let i = 0; while (i < ARC.length - 2 && ARC[i + 1][0] <= f) i++; return interpolate(f, [ARC[i][0], ARC[i + 1][0]], [ARC[i][1], ARC[i + 1][1]], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); };
export const KsunchAudio: React.FC<{music: boolean}> = ({music}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {music ? <Audio src={staticFile('audio/ksunch-music.wav')} trimBefore={MUSIC_START_SEC * 30} volume={(f) => Math.max(0, Math.min(1, ramp(f) * MIX.music))} /> : null}
    {CUES.map(([at, s, g], i) => <Sequence key={i} from={at} durationInFrames={Math.min(90, KS_FRAMES - at)}><Audio src={staticFile(`audio/sfx/${s}.wav`)} volume={g} /></Sequence>)}
  </AbsoluteFill>
);
