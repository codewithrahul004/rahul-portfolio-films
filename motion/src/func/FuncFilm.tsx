import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {easeInOutCubic, easeOutCubic, win} from '../motion/Path';
import {clamp01, lerp} from '../motion/timing';
import {Grain, Phone} from '../case/pieces';
import {MIX} from '../audio/Layers';

/* =====================================================================
   FUNC. A forty-five second case study cut to "Separate" by Everything.
   Real only: the live site captured after its loader (public/func), Rahul's
   own homepage recording (public/func/rec.mp4), the real add-to-cart and
   cart, and Anisha's two WhatsApp messages as screenshots. No numbers.

   THE CUT FOLLOWS THE TRACK. The song starts at 1:50 (MUSIC_START), where
   it sits quiet, and its big hit at 1:57 lands on the product reveal.
   Accents at 2:01, 2:05, 2:08, 2:10 drive the ecommerce cuts; the dip at
   2:15 opens the SEO beat; the pause at 2:26 is the testimonial; the hit at
   2:29 brings the final statement; the break at 2:36 ends the film.
   ===================================================================== */

const INK = '#0B0B0B', PAPER = '#F5F3EF', MUTE = 'rgba(245,243,239,0.55)';
const SANS = '"Helvetica Neue",Helvetica,Arial,sans-serif';
export const FUNC_FRAMES = 1350;
const MUSIC_START_SEC = 110;

const seqF = (dir: string, i: number, n: number) => staticFile(`func/${dir}/f${String(Math.max(0, Math.min(n - 1, Math.round(i)))).padStart(4, '0')}.jpg`);
const W = (f: number, b: readonly [number, number]) => win(f, b[0], b[1]);
const E = (f: number, b: readonly [number, number]) => easeOutCubic(W(f, b));
const SE = (f: number, b: readonly [number, number]) => easeInOutCubic(W(f, b));

const Big: React.FC<{t: number; out?: number; size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({t, out = 0, size = 96, color = PAPER, style, children}) => {
  const e = easeOutCubic(t);
  return <div style={{fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: '-0.03em', lineHeight: 0.98, color, whiteSpace: 'nowrap',
    opacity: e * (1 - out), transform: `translateY(${(1 - e) * 18}px)`, clipPath: `inset(0% 0% ${(1 - e) * 100}% 0%)`, ...style}}>{children}</div>;
};
const Small: React.FC<{t: number; out?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({t, out = 0, color = MUTE, style, children}) => {
  const e = easeOutCubic(t);
  return <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 18, letterSpacing: '0.32em', textTransform: 'uppercase', color, whiteSpace: 'nowrap', opacity: e * (1 - out), transform: `translateY(${(1 - e) * 8}px)`, ...style}}>{children}</div>;
};
const Vig: React.FC<{s?: number}> = ({s = 0.55}) => <div style={{position: 'absolute', inset: 0, background: `radial-gradient(125% 95% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,${s}) 100%)`}} />;
const Full: React.FC<{src: string; scale?: number; y?: number; x?: number; opacity?: number; dim?: number}> = ({src, scale = 1, y = 0, x = 0, opacity = 1, dim = 1}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity}}>
    <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover', objectPosition: 'top', transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: '50% 50%', filter: `brightness(${dim})`}} />
  </div>
);
const Rec: React.FC<{from: number; scale?: number; opacity?: number}> = ({from, scale = 1.04, opacity = 1}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity}}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: '50% 50%'}}>
      <OffthreadVideo src={staticFile('func/rec.mp4')} trimBefore={from} muted style={{width: 1920, height: 1080, objectFit: 'cover'}} />
    </div>
  </div>
);
const Frame: React.FC<{src: string; x: number; y: number; w: number; h: number; tilt?: number; opacity?: number; panY?: number; scale?: number}> = ({src, x, y, w, h, tilt = 0, opacity = 1, panY = 0, scale = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity, transform: `perspective(2800px) rotateY(${tilt}deg) scale(${scale})`, transformOrigin: '50% 50%', overflow: 'hidden', borderRadius: 8, background: '#fff', boxShadow: '0 50px 140px rgba(0,0,0,0.8)'}}>
    <Img src={src} style={{position: 'absolute', left: 0, top: 0, width: w, height: 'auto', transform: `translateY(${-panY}px)`}} />
  </div>
);

/* 01 website reveal, 0 to 210 (the hit at 210) */
const S01: React.FC = () => {
  const f = useCurrentFrame();
  const out = SE(f, [198, 12]);
  return (<>
    <Full src={seqF('desktop_home_scroll', f * 0.9, 300)} scale={1.04 + 0.05 * easeInOutCubic(f / 210)} opacity={1 - out * 0.8} />
    <Vig s={0.45} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)'}} />
    <div style={{position: 'absolute', left: 110, bottom: 96, opacity: 1 - out}}>
      <Big t={W(f, [40, 24])} size={74}>FUNC.</Big>
      <div style={{height: 14}} />
      <Small t={W(f, [66, 24])}>Website &nbsp;&bull;&nbsp; Ecommerce &nbsp;&bull;&nbsp; SEO</Small>
    </div>
  </>);
};

/* 02 product experience, 210 to 420: the shop, the cans, close in */
const S02: React.FC = () => {
  const f = useCurrentFrame();
  const out = SE(f, [198, 12]);
  // a hard reveal on the hit, then a slow push into the product grid
  return (<>
    <Full src={seqF('desktop_shop_scroll', 20 + f * 0.7, 300)} scale={1.06 + 0.08 * easeInOutCubic(f / 210)} y={-20} opacity={1 - out * 0.7} />
    <Vig s={0.4} />
    <div style={{position: 'absolute', left: 110, top: 100, opacity: 1 - out}}>
      <Small t={W(f, [10, 20])}>The product</Small>
    </div>
  </>);
};

/* 03 ecommerce, 420 to 735: product page, add to cart, cart. Cuts on the accents. */
const S03: React.FC = () => {
  const f = useCurrentFrame();
  // local cut points: 0, 60 (2:03), 150 (2:06), 225 (2:08.5), 285 (2:10.5)
  const shots: {at: number; src: string; label: string; pan?: number}[] = [
    {at: 0, src: staticFile('func/desktop_product_hero.jpg'), label: 'Product page'},
    {at: 60, src: staticFile('func/desktop_addtocart_before.jpg'), label: 'Add to cart'},
    {at: 150, src: staticFile('func/desktop_addtocart_after.jpg'), label: 'Added'},
    {at: 225, src: staticFile('func/desktop_cart.jpg'), label: 'Cart'},
  ];
  let i = 0; shots.forEach((s, k) => { if (f >= s.at) i = k; });
  const s = shots[i], since = f - s.at;
  const out = SE(f, [300, 15]);
  return (<>
    <Full src={s.src} scale={1.02 + 0.03 * easeOutCubic(since / 90)} opacity={1 - out * 0.8} />
    <Vig s={0.4} />
    <div style={{position: 'absolute', left: 110, top: 110, opacity: 1 - out}}>
      <Small t={clamp01(since / 10)}>{String(i + 1).padStart(2, '0')} &nbsp;{s.label}</Small>
      <div style={{height: 14}} />
      <Big t={W(f, [230, 24])} size={60}>A working store.</Big>
    </div>
  </>);
};

/* 04 seo, 735 to 870: the dip in the track. Anisha's own words about the sitelinks. */
const S04: React.FC = () => {
  const f = useCurrentFrame();
  const inn = E(f, [0, 18]);
  const out = SE(f, [122, 13]);
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{position: 'absolute', left: 110, top: 300, opacity: 1 - out}}>
      <Small t={W(f, [4, 20])}>Website + SEO</Small>
      <div style={{height: 22}} />
      <Big t={W(f, [14, 26])} size={88}>Designed to be</Big>
      <Big t={W(f, [26, 26])} size={88}>discovered.</Big>
    </div>
    <div style={{position: 'absolute', left: 1040, top: 330, width: 740, opacity: inn * (1 - out), transform: `translateY(${(1 - inn) * 24}px)`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.8)'}}>
      <Img src={staticFile('pf/w_anisha2.jpg')} style={{width: 740, display: 'block'}} />
    </div>
    <div style={{position: 'absolute', left: 1040, top: 290, opacity: 0.8 * inn * (1 - out)}}><Small t={1}>Anisha &nbsp;&middot;&nbsp; whatsapp</Small></div>
  </>);
};

/* 05 responsive, 870 to 1050: desktop becomes phones */
const S05: React.FC = () => {
  const f = useCurrentFrame();
  const inn = E(f, [0, 20]);
  const out = SE(f, [166, 14]);
  const pan = 900 * SE(f, [10, 160]);
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{opacity: inn * (1 - out)}}>
      <Frame src={staticFile('func/desktop_home_full.jpg')} x={90} y={150} w={1060} h={660} tilt={5} panY={pan * 0.6} />
      <Phone src={seqF('mobile_home_scroll', f * 1.1, 200)} cx={1340} cy={560} scale={0.86} tilt={-8} opacity={E(f, [16, 20])} />
      <Phone src={seqF('mobile_product_scroll', f * 0.9, 200)} cx={1660} cy={620} scale={0.74} tilt={-12} opacity={E(f, [30, 20])} />
    </div>
    <div style={{position: 'absolute', left: 110, bottom: 96, opacity: 1 - out}}>
      <Small t={W(f, [24, 20])}>Responsive</Small>
      <div style={{height: 14}} />
      <Big t={W(f, [36, 24])} size={60}>Every screen.</Big>
    </div>
  </>);
};

/* 06 client feedback, 1050 to 1200: the music steps back. Her words, as screenshots. */
const S06: React.FC = () => {
  const f = useCurrentFrame();
  const a = E(f, [6, 20]), aOut = SE(f, [70, 12]);
  const b = E(f, [78, 20]), out = SE(f, [138, 12]);
  return (<>
    <div style={{position: 'absolute', inset: 0, background: INK}} />
    <div style={{position: 'absolute', left: 110, top: 330, opacity: 1 - out}}>
      <Small t={E(f, [2, 18])}>Client feedback</Small>
      <div style={{height: 22}} />
      <Big t={E(f, [8, 22])} size={80}>Anisha</Big>
      <div style={{height: 16}} />
      <div style={{position: 'relative', height: 40}}>
        <div style={{position: 'absolute', opacity: a * (1 - aOut)}}><Small t={1} color={PAPER}>Website</Small></div>
        <div style={{position: 'absolute', opacity: b}}><Small t={1} color={PAPER}>Website / SEO</Small></div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 960, top: 340, width: 760, opacity: a * (1 - aOut), transform: `translateY(${(1 - a) * 24}px)`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.8)'}}>
      <Img src={staticFile('pf/w_anisha.jpg')} style={{width: 760, display: 'block'}} />
    </div>
    <div style={{position: 'absolute', left: 960, top: 330, width: 760, opacity: b * (1 - out), transform: `translateY(${(1 - b) * 24}px)`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.8)'}}>
      <Img src={staticFile('pf/w_anisha2.jpg')} style={{width: 760, display: 'block'}} />
    </div>
  </>);
};

/* 07 final, 1200 to 1350: the hit, the site, the lockup, the line, hold */
const S07: React.FC = () => {
  const f = useCurrentFrame();
  const siteOut = SE(f, [54, 14]);
  const lock = W(f, [60, 22]);
  const line = W(f, [96, 24]);
  const black = SE(f, [330, 20]);
  return (<>
    <Rec from={60} scale={1.06 + 0.04 * (f / 60)} opacity={1 - siteOut} />
    <div style={{position: 'absolute', inset: 0, background: INK, opacity: siteOut}} />
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <Big t={lock} size={120}>FUNC.</Big>
      <div style={{height: 22}} />
      <Small t={clamp01(lock * 1.3 - 0.3)} color={PAPER}>Website &nbsp;&bull;&nbsp; Ecommerce &nbsp;&bull;&nbsp; SEO</Small>
      <div style={{height: 60}} />
      <Big t={line} size={44} style={{letterSpacing: '0.02em'}}>Build it.</Big>
      <div style={{height: 8}} />
      <Big t={clamp01(line * 1.2 - 0.25)} size={44} style={{letterSpacing: '0.02em'}} color={MUTE}>Make it discoverable.</Big>
    </div>
    <div style={{position: 'absolute', inset: 0, background: '#000', opacity: black}} />
  </>);
};

export const FuncFilm: React.FC = () => (
  <AbsoluteFill style={{background: INK, color: PAPER, fontFamily: SANS}}>
    {[[0, 210, <S01 />], [210, 210, <S02 />], [420, 315, <S03 />], [735, 135, <S04 />], [870, 180, <S05 />], [1050, 150, <S06 />], [1200, 150, <S07 />]].map(([at, n, node], i) => (
      <Sequence key={i} from={at as number} durationInFrames={n as number} premountFor={12}>{node as React.ReactNode}</Sequence>
    ))}
    <Grain opacity={0.04} />
  </AbsoluteFill>
);

/* ---- score: Separate under everything, effects only where the picture moves */
const CUES: [number, string, number][] = [
  [40, 'TONAL_HIT', 0.12], [210, 'HIT_SECTION', 0.26], [420, 'SWEEP_SOFT', 0.16],
  [480, 'UI_CLICK', 0.12], [570, 'UI_CLICK', 0.14], [645, 'SWEEP_SOFT', 0.14], [650, 'TONAL_HIT', 0.12],
  [735, 'SWEEP_DARK', 0.18], [749, 'TONAL_HIT', 0.12], [870, 'SWEEP_SOFT', 0.16], [906, 'TONAL_HIT', 0.12],
  [1056, 'UI_CLICK', 0.10], [1128, 'UI_CLICK', 0.10], [1200, 'HIT_SECTION', 0.24], [1260, 'TONAL_HIT', 0.14], [1296, 'IMPACT_MEDIUM', 0.22], [1296, 'TONAL_HIT_LOW', 0.22],
];
const ARC: [number, number][] = [[0, 0.62], [1040, 0.62], [1056, 0.14], [1190, 0.14], [1200, 0.66], [1320, 0.66], [1350, 0]];
const ramp = (f: number) => { let i = 0; while (i < ARC.length - 2 && ARC[i + 1][0] <= f) i++; return interpolate(f, [ARC[i][0], ARC[i + 1][0]], [ARC[i][1], ARC[i + 1][1]], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); };
export const FuncAudio: React.FC<{music: boolean}> = ({music}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {music ? <Audio src={staticFile('audio/func-music.wav')} trimBefore={MUSIC_START_SEC * 30} volume={(f) => Math.max(0, Math.min(1, ramp(f) * MIX.music))} /> : null}
    {CUES.map(([at, s, g], i) => <Sequence key={i} from={at} durationInFrames={Math.min(90, FUNC_FRAMES - at)}><Audio src={staticFile(`audio/sfx/${s}.wav`)} volume={g} /></Sequence>)}
  </AbsoluteFill>
);
