import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {C, T, accentA} from '../theme';
import {TimeCounter, DataCounter} from '../motion/Data';
import {clamp01, lerp} from '../motion/timing';
import {easeInOutCubic, easeOutCubic} from '../motion/Path';
import {EL, REPORT, seqFrame} from './assets';
import {W, E, SE, reveal, Ground, Vignette, FullBleed, Window, Phone, Eyebrow, Rule, Big, Label, Note, Evidence, fontFamily} from './pieces';

/* =====================================================================
   EDIT LOBBY, THE CASE STUDY. Scene lengths in frames at 30 fps.
   WEBSITE > EXPERIENCE > CHALLENGE > APPROACH > RESULTS > TESTIMONIAL > CLOSE
   ===================================================================== */

export const LEN = {
  website: 180, experience: 210, challenge: 240, approach: 180,
  bandwidth: 270, video: 150, mobile: 180, engagement: 180, picture: 120,
  intro: 90, close: 240,
};

const wrap = (children: React.ReactNode) => (
  <AbsoluteFill style={{background: C.ground, fontFamily, color: C.text}}>{children}</AbsoluteFill>
);

/* -------------------------------------------------- 01 WEBSITE FIRST
   The finished site, full screen, arriving as it does in a browser, then a
   slow push. Two lines of type and nothing else.                          */
export const S01Website: React.FC = () => {
  const f = useCurrentFrame();
  const entering = f + 4 < EL.desktopEnter.n;
  // frame 0 of the capture is the blank page before the dark theme paints; skip it
  const src = entering ? seqFrame(EL.desktopEnter, f + 4) : staticFile(EL.desktopHero);
  const push = 1 + 0.08 * easeInOutCubic(f / LEN.website);
  const out = SE(f, [162, 18]);
  return wrap(<>
    <FullBleed src={src} scale={push} y={-14 * (f / LEN.website)} opacity={1 - out * 0.85} />
    <Vignette strength={0.6} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 360,
      background: 'linear-gradient(0deg, rgba(11,11,12,0.92) 0%, rgba(11,11,12,0) 100%)'}} />
    <div style={{position: 'absolute', left: 140, bottom: 110}}>
      <Rule t={E(f, [60, 16])} />
      <div style={{marginTop: 22}}><Eyebrow t={W(f, [70, 18])}>Edit Lobby</Eyebrow></div>
      <div style={{...T.claim, fontSize: 52, marginTop: 18, ...reveal(W(f, [100, 22]), 14), opacity: E(f, [100, 22]) * (1 - out)}}>
        Website redesign &amp;<br />performance optimization
      </div>
    </div>
  </>);
};

/* -------------------------------------------------- 02 THE EXPERIENCE
   A slow scroll through the real homepage, then the phone joins it.      */
export const S02Experience: React.FC = () => {
  const f = useCurrentFrame();
  const scrollI = Math.min(EL.desktopScroll.n - 1, f * 1.7);
  const phoneIn = SE(f, [96, 34]);
  const mobileI = Math.max(0, (f - 96) * 1.6);
  const out = SE(f, [194, 16]);
  // the desktop recedes to the left as the phone arrives
  const dScale = lerp(1, 0.78, phoneIn), dX = lerp(0, -300, phoneIn), dY = lerp(0, 40, phoneIn);
  return wrap(<>
    <div style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080,
        transform: `translate(${dX}px, ${dY}px) scale(${dScale})`, transformOrigin: '50% 50%',
        borderRadius: 14 * phoneIn, overflow: 'hidden', boxShadow: phoneIn > 0 ? '0 46px 120px rgba(0,0,0,0.8)' : undefined}}>
        <Img src={seqFrame(EL.desktopScroll, scrollI)} style={{width: 1920, height: 1080, display: 'block'}} />
      </div>
      <Phone src={seqFrame(EL.mobileScroll, mobileI)} cx={lerp(2300, 1500, phoneIn)} cy={600} scale={0.86} tilt={lerp(-14, -6, phoneIn)} opacity={phoneIn} />
    </div>
    <Vignette strength={0.55} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 330,
      background: 'linear-gradient(0deg, rgba(11,11,12,0.94) 0%, rgba(11,11,12,0) 100%)'}} />
    <div style={{position: 'absolute', left: 140, bottom: 96, opacity: 1 - out}}>
      <Rule t={E(f, [128, 16])} />
      <div style={{display: 'flex', gap: 42, marginTop: 26}}>
        {['Design', 'Development', 'Performance'].map((w, i) => (
          <div key={w} style={{...T.claim, fontSize: 46, ...reveal(W(f, [138 + i * 10, 18]), 12)}}>{w}</div>
        ))}
      </div>
    </div>
  </>);
};

/* -------------------------------------------------- 03 THE CHALLENGE
   Three ideas, each with the real evidence beside it. The site is gone;
   the treatment is dark and technical.                                     */
export const S03Challenge: React.FC = () => {
  const f = useCurrentFrame();
  const beats = [
    {at: 0, word: 'Heavy media', note: 'video, the bulk of every page load', src: REPORT.video, ar: 1120 / 857, ring: REPORT.R_VID_JUL, eyebrow: 'editlobby.com performance report · before'},
    {at: 80, word: 'High bandwidth usage', note: '287 gb of a 300 gb plan, in one month', src: REPORT.jul, ar: 1220 / 550, ring: REPORT.R_JUL_VALUE, eyebrow: 'framer hosting dashboard · july 2026'},
    {at: 160, word: 'Mobile performance', note: 'where every byte costs the most', src: EL.mobileHero, ar: 780 / 1688, ring: undefined, eyebrow: 'editlobby.com · mobile'},
  ];
  const out = SE(f, [224, 16]);
  return wrap(<>
    <Ground />
    <div style={{position: 'absolute', left: 140, top: 150}}>
      <Rule t={E(f, [4, 16])} />
      <div style={{marginTop: 22}}><Eyebrow t={W(f, [10, 18])}>The challenge</Eyebrow></div>
    </div>
    {beats.map((b, i) => {
      const tin = W(f, [b.at + (i === 0 ? 2 : 8), 18]);
      const tout = i < 2 ? SE(f, [b.at + 72, 10]) : out;
      const vis = easeOutCubic(tin) * (1 - tout);
      return (
        <div key={b.word} style={{opacity: vis}}>
          <div style={{position: 'absolute', left: 140, top: 400, width: 760}}>
            <div style={{...T.claim, fontSize: 72, lineHeight: 1.04, ...reveal(tin, 16)}}>{b.word}</div>
            <div style={{marginTop: 26}}><Note t={clamp01(tin * 1.5 - 0.4)}>{b.note}</Note></div>
          </div>
          <Evidence src={b.src} x={b.ar < 1 ? 1300 : 1000} y={b.ar > 1.5 ? 330 : (b.ar < 1 ? 110 : 150)} w={b.ar < 1 ? 400 : 780} ar={b.ar} t={tin} out={tout}
            ring={b.ring} ringT={W(f, [b.at + 28, 12])} tone={0.9} />
          <div style={{position: 'absolute', left: 1000, top: 96, ...T.eyebrow, fontSize: 20, opacity: easeOutCubic(tin) * 0.9}}>{b.eyebrow}</div>
        </div>
      );
    })}
    <div style={{position: 'absolute', left: 140, bottom: 110, display: 'flex', gap: 28, opacity: 1 - out}}>
      {['Heavy media', 'High bandwidth', 'Mobile'].map((w, i) => (
        <div key={w} style={{...T.eyebrow, fontSize: 20, color: C.text, opacity: 0.9 * E(f, [i * 80 + 20, 14])}}>
          {String(i + 1).padStart(2, '0')} &nbsp;{w}
        </div>
      ))}
    </div>
  </>);
};

/* -------------------------------------------------- 04 THE APPROACH
   The actual work: the previous site becoming the rebuilt one, the
   responsive pair, the raw dashboards, then back into the finished site.  */
export const S04Approach: React.FC = () => {
  const f = useCurrentFrame();
  const panY = 2200 * SE(f, [0, 64]);
  const a = SE(f, [62, 14]), b = SE(f, [122, 14]);
  const back = SE(f, [166, 14]);
  return wrap(<>
    <Ground />
    {/* 1. design: the rebuilt page, travelled top to bottom in a window */}
    <div style={{opacity: 1 - a}}>
      <div style={{position: 'absolute', left: 980, top: 90, width: 820, height: 900, borderRadius: 14, overflow: 'hidden',
        background: C.panel, border: `1px solid ${C.edge}`, boxShadow: '0 46px 120px rgba(0,0,0,0.8)',
        transform: `translateY(${(1 - E(f, [0, 16])) * 30}px)`, opacity: E(f, [0, 16])}}>
        <Img src={staticFile(EL.desktopFull)} style={{width: 820, display: 'block', transform: `translateY(${-panY}px)`}} />
      </div>
      <div style={{position: 'absolute', left: 980, top: 1010, ...T.eyebrow, fontSize: 20, opacity: 0.9 * E(f, [10, 16])}}>
        editlobby.com · the rebuilt homepage
      </div>
    </div>
    {/* 2. development: desktop and mobile, the same build */}
    <div style={{opacity: a * (1 - b)}}>
      <Window src={staticFile(EL.desktopFull)} x={700} y={120} w={880} h={620} panY={900 * SE(f, [62, 60])} scale={0.98 + 0.02 * a} />
      <Phone src={staticFile(EL.mobileFull)} cx={1660} cy={620} scale={0.6} tilt={-8} panY={900 * SE(f, [62, 60])} />
    </div>
    {/* 3. performance: the raw dashboards the report is built from */}
    <div style={{opacity: b * (1 - back)}}>
      <Evidence src={REPORT.sources} x={940} y={160} w={840} ar={1480 / 848} t={b} tone={0.9} />
      <div style={{position: 'absolute', left: 940, top: 108, ...T.eyebrow, fontSize: 20, opacity: 0.9 * b}}>the raw dashboards, published with the report</div>
    </div>
    {/* the words accumulate on the left */}
    <div style={{position: 'absolute', left: 140, top: 150, opacity: 1 - back}}>
      <Rule t={E(f, [4, 16])} />
      <div style={{marginTop: 22}}><Eyebrow t={W(f, [10, 18])}>The approach</Eyebrow></div>
    </div>
    <div style={{position: 'absolute', left: 140, top: 400, opacity: 1 - back}}>
      {[['Design', 10], ['Development', 68], ['Performance', 128]].map(([w, at], i) => (
        <div key={w as string} style={{display: 'flex', alignItems: 'baseline', gap: 22}}>
          {i > 0 ? <div style={{...T.figure, fontSize: 48, color: C.accent, opacity: E(f, [(at as number) - 6, 12])}}>+</div> : null}
          <div style={{...T.claim, fontSize: 72, lineHeight: 1.3, ...reveal(W(f, [at as number, 18]), 16)}}>{w}</div>
        </div>
      ))}
    </div>

  </>);
};

/* -------------------------------------------------- 05 BANDWIDTH
   The centrepiece. 287 GB becomes 20.1 GB as the real dashboard wipes from
   July to August under it; then 93% LESS BANDWIDTH.                       */
export const S05Bandwidth: React.FC = () => {
  const f = useCurrentFrame();
  const wipe = SE(f, [50, 60]);
  const v = 287.0 + (20.1 - 287.0) * clamp01((wipe - 0.512) / (0.628 - 0.512));
  const fig = E(f, [6, 22]);
  const toPct = SE(f, [150, 22]);
  const out = SE(f, [254, 16]);
  return wrap(<>
    <Ground />
    <div style={{position: 'absolute', left: 140, top: 150}}>
      <Rule t={E(f, [4, 16])} />
      <div style={{marginTop: 22}}><Eyebrow t={W(f, [10, 18])}>The result</Eyebrow></div>
    </div>
    {/* the number, dominant */}
    <div style={{position: 'absolute', left: 140, top: 330, opacity: fig * (1 - toPct) * (1 - out),
      transform: `translateY(${(1 - fig) * 24 - toPct * 60}px)`}}>
      <DataCounter from={v} to={v} progress={1} decimals={v >= 100 ? 0 : 1} suffix="GB" size={230} color={wipe > 0.56 ? C.accent : C.text} />
      <div style={{marginTop: 26}}>
        <Label t={fig}>{wipe > 0.56 ? 'bandwidth, august' : 'bandwidth, july'}</Label>
      </div>
      <div style={{marginTop: 22}}><Note t={clamp01(fig * 1.4 - 0.3)}>monthly, framer hosting · same showreel, two full months</Note></div>
    </div>
    {/* 93% less bandwidth */}
    <div style={{position: 'absolute', left: 140, top: 330, opacity: toPct * (1 - out), transform: `translateY(${(1 - toPct) * 60}px)`}}>
      <div style={{display: 'flex', alignItems: 'baseline'}}>
        <span style={{...T.figure, fontSize: 260, color: C.accent}}>93</span>
        <span style={{...T.figure, fontSize: 120, color: C.accent}}>%</span>
      </div>
      <div style={{marginTop: 20}}><Label t={toPct} size={44} style={{color: C.text}}>less bandwidth</Label></div>
      <div style={{marginTop: 22}}><Note t={toPct}>287 gb to 20.1 gb · july to august 2026 · two full months</Note></div>
    </div>
    <Evidence src={REPORT.jul} overlay={REPORT.aug} wipe={wipe} x={1060} y={400} w={720} ar={1220 / 550} t={E(f, [10, 24])} out={out}
      ring={wipe > 0.56 ? REPORT.R_AUG_VALUE : REPORT.R_JUL_VALUE} ringT={W(f, [36, 12])} tone={0.95} />
    <div style={{position: 'absolute', left: 1060, top: 350, ...T.eyebrow, fontSize: 20, opacity: 0.9 * E(f, [20, 16]) * (1 - out)}}>
      framer hosting dashboard · {wipe > 0.56 ? 'august' : 'july'} 2026
    </div>
  </>);
};

/* -------------------------------------------------- 06 VIDEO BANDWIDTH */
export const S06Video: React.FC = () => {
  const f = useCurrentFrame();
  const t = SE(f, [40, 50]);
  const v = 273.3 + (9.6 - 273.3) * t;
  const fig = E(f, [4, 22]);
  const out = SE(f, [134, 16]);
  return wrap(<>
    <Ground />
    <div style={{position: 'absolute', left: 140, top: 330, opacity: fig * (1 - out), transform: `translateY(${(1 - fig) * 24}px)`}}>
      <DataCounter from={v} to={v} progress={1} decimals={1} suffix="GB" size={230} color={t > 0.5 ? C.accent : C.text} />
      <div style={{marginTop: 26}}><Label t={fig} size={44} style={{color: C.text}}>video bandwidth</Label></div>
      <div style={{marginTop: 22}}><Note t={clamp01(fig * 1.4 - 0.3)}>273.3 gb to 9.6 gb · where the saving came from</Note></div>
    </div>
    <Evidence src={REPORT.video} x={1080} y={150} w={700} ar={1120 / 857} t={E(f, [8, 24])} out={out}
      ring={t < 0.5 ? REPORT.R_VID_JUL : REPORT.R_VID_AUG} ringT={W(f, [30, 12])} tone={0.95} />
    <div style={{position: 'absolute', left: 1080, top: 100, ...T.eyebrow, fontSize: 20, opacity: 0.9 * E(f, [16, 16]) * (1 - out)}}>
      the same report · what changed
    </div>
  </>);
};

/* -------------------------------------------------- 07 MOBILE */
export const S07Mobile: React.FC = () => {
  const f = useCurrentFrame();
  const phoneIn = E(f, [0, 14]);
  const fig = E(f, [40, 22]);
  const pass = E(f, [100, 22]);
  const out = SE(f, [164, 16]);
  return wrap(<>
    <Ground />
    <Phone src={seqFrame(EL.mobileScroll, Math.min(239, f * 1.3))} cx={520} cy={560} scale={0.92} tilt={6} opacity={phoneIn * (1 - out)} />
    <div style={{position: 'absolute', left: 960, top: 300, opacity: 1 - out}}>
      <Rule t={E(f, [30, 16])} />
      <div style={{marginTop: 30, display: 'flex', alignItems: 'baseline'}}>
        <span style={{...T.figure, fontSize: 230, color: C.accent, ...reveal(fig, 20)}}>1.7</span>
        <span style={{...T.figure, fontSize: 110, color: C.accent, opacity: fig}}>s</span>
      </div>
      <div style={{marginTop: 22}}><Label t={fig} size={40} style={{color: C.text}}>mobile load time</Label></div>
      <div style={{marginTop: 16}}><Note t={clamp01(fig * 1.4 - 0.3)}>largest contentful paint · editlobby.com, after the rebuild</Note></div>
      <div style={{marginTop: 54, opacity: pass, transform: `translateY(${(1 - pass) * 14}px)`}}>
        <div style={{...T.claim, fontSize: 48, lineHeight: 1.1}}>Core Web Vitals<br /><span style={{color: C.accent}}>passed.</span></div>
      </div>
    </div>
    <Evidence src={REPORT.cwv} x={1440} y={640} w={360} ar={900 / 813} t={pass} out={out} ring={REPORT.R_CWV_PASS} ringT={E(f, [116, 12])} tone={0.95} />
  </>);
};

/* -------------------------------------------------- 08 ENGAGEMENT */
export const S08Engagement: React.FC = () => {
  const f = useCurrentFrame();
  const siteOut = 1;
  const draw = SE(f, [2, 44]);
  const sec = draw >= 0.9 ? 252 : draw >= 0.5 ? 224 : 198;
  const fig = E(f, [4, 22]);
  const delta = E(f, [84, 20]);
  const out = SE(f, [164, 16]);
  return wrap(<>
    <Ground />
    <div style={{position: 'absolute', left: 140, top: 330, opacity: fig * (1 - out), transform: `translateY(${(1 - fig) * 24}px)`}}>
      <TimeCounter fromSec={sec} toSec={sec} progress={1} size={230} color={draw >= 0.9 ? C.accent : C.text} />
      <div style={{marginTop: 26}}><Label t={fig} size={40} style={{color: C.text}}>average session duration</Label></div>
      <div style={{marginTop: 22}}><Note t={clamp01(fig * 1.4 - 0.3)}>3:18 before the rebuild · 4:12 after · dated periods on the chart</Note></div>
      <div style={{marginTop: 40, display: 'inline-block', padding: '12px 24px', borderRadius: 10, border: `1px solid ${accentA(0.45)}`,
        background: accentA(0.10), color: C.accent, fontSize: 56, fontWeight: 700, opacity: delta, transform: `translateY(${(1 - delta) * 16}px)`}}>
        +27.3%
      </div>
    </div>
    <Evidence src={REPORT.session} x={1040} y={330} w={740} ar={1380 / 755} t={draw} out={out} ring={REPORT.R_SES_27} ringT={delta} tone={0.95} />
    <div style={{position: 'absolute', left: 1040, top: 280, ...T.eyebrow, fontSize: 20, opacity: 0.9 * draw * (1 - out)}}>
      editlobby.com performance report · average session duration
    </div>
  </>);
};

/* -------------------------------------------------- 09 THE BIG PICTURE */
export const S09Picture: React.FC = () => {
  const f = useCurrentFrame();
  const out = SE(f, [104, 16]);
  const items = [
    ['93%', 'less bandwidth'], ['1.7s', 'mobile load'], ['Passed', 'core web vitals'], ['+27.3%', 'session duration'],
  ];
  return wrap(<>
    <FullBleed src={staticFile(EL.desktopHero)} scale={1.06 + 0.04 * (f / LEN.picture)} dim={0.22} />
    <div style={{position: 'absolute', inset: 0, background: 'rgba(11,11,12,0.62)'}} />
    <Vignette strength={0.7} />
    <div style={{position: 'absolute', left: 240, right: 240, top: 150, opacity: 1 - out}}>
      <div style={{display: 'flex', justifyContent: 'center'}}><Rule t={E(f, [4, 16])} /></div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 90, columnGap: 80, marginTop: 70, textAlign: 'center'}}>
        {items.map(([v, l], i) => (
          <div key={v}>
            <div style={{...T.figure, fontSize: 150, color: i === 2 ? C.text : C.accent, ...reveal(W(f, [6 + i * 8, 18]), 18)}}>{v}</div>
            <div style={{marginTop: 18}}><Label t={W(f, [14 + i * 8, 16])} size={32}>{l}</Label></div>
          </div>
        ))}
      </div>
    </div>
  </>);
};

/* -------------------------------------------------- 10 TESTIMONIAL INTRO */
export const S10Intro: React.FC = () => {
  const f = useCurrentFrame();
  const out = SE(f, [74, 16]);
  return wrap(<>
    <Ground />
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 1 - out}}>
      <div style={{...T.claim, fontSize: 54, color: C.muted, ...reveal(W(f, [4, 20]), 14)}}>The results are one thing.</div>
      <div style={{...T.claim, fontSize: 54, marginTop: 18, ...reveal(W(f, [34, 20]), 14)}}>Here&rsquo;s what the client had to say.</div>
    </div>
  </>);
};

/* -------------------------------------------------- 11 TESTIMONIAL
   The client's own video, as supplied, with captions and a lower third.
   Nothing is generated. Supplied through props; absent until it arrives.  */
export type Testimonial = {file: string; frames: number; name: string; role: string; captions: {from: number; to: number; text: string}[]};
export const S11Testimonial: React.FC<{t: Testimonial}> = ({t}) => {
  const f = useCurrentFrame();
  const inn = E(f, [0, 18]);
  const out = SE(f, [t.frames - 18, 18]);
  const cap = t.captions.find((c) => f >= c.from && f <= c.to);
  return wrap(<>
    {/* a phone video, so it is composed rather than cropped: the clip itself
        fills the frame softly behind, and plays clean, full height, centred
        right, with the lower third in the clear space on the left. */}
    <div style={{position: 'absolute', inset: 0, opacity: inn * (1 - out)}}>
      <div style={{position: 'absolute', inset: -60, filter: 'blur(60px) brightness(0.28) saturate(0.8)'}}>
        <OffthreadVideo src={staticFile(t.file)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{position: 'absolute', left: 960, top: 0, width: 608, height: 1080, overflow: 'hidden',
        boxShadow: '0 0 120px rgba(0,0,0,0.8)', transform: `scale(${0.97 + 0.03 * inn})`, transformOrigin: '50% 50%'}}>
        <OffthreadVideo src={staticFile(t.file)} muted style={{width: 608, height: 1080, objectFit: 'cover', display: 'block'}} />
      </div>
    </div>
    <Vignette strength={0.45} />
    <div style={{position: 'absolute', left: 140, top: 150, opacity: E(f, [30, 20]) * (1 - out)}}>
      <Rule t={E(f, [30, 16])} />
      <div style={{marginTop: 22}}><Eyebrow t={E(f, [36, 18])}>The client</Eyebrow></div>
    </div>
    <div style={{position: 'absolute', left: 140, bottom: 140, opacity: E(f, [40, 20]) * (1 - out)}}>
      {t.name ? <div style={{...T.claim, fontSize: 48}}>{t.name}</div> : null}
      <div style={{...T.eyebrow, fontSize: 22, letterSpacing: '0.26em', color: C.text, marginTop: t.name ? 12 : 0}}>{t.role}</div>
      <div style={{...T.eyebrow, fontSize: 20, marginTop: 10}}>in their own words, as recorded</div>
    </div>
    {cap ? (
      <div style={{position: 'absolute', left: 960, width: 608, bottom: 40, textAlign: 'center'}}>
        <span style={{display: 'inline-block', padding: '8px 22px', borderRadius: 8, background: 'rgba(8,8,10,0.72)', fontSize: 34, fontWeight: 700, lineHeight: 1.25}}>{cap.text}</span>
      </div>
    ) : null}
  </>);
};

/* -------------------------------------------------- 12 CLOSE */
export const S12Close: React.FC = () => {
  const f = useCurrentFrame();
  const a = E(f, [0, 24]);
  const swap = SE(f, [110, 20]);
  const fade = SE(f, [208, 32]);
  return wrap(<>
    <Ground />
    <div style={{opacity: a * (1 - swap)}}>
      <Window src={staticFile(EL.desktopHero)} x={120} y={150} w={1100} h={620} tilt={6} panY={0} scale={0.98 + 0.02 * a} />
      <Phone src={staticFile(EL.mobileHero)} cx={1420} cy={520} scale={0.74} tilt={-10} />
      <div style={{position: 'absolute', left: 120, top: 830}}>
        <Rule t={a} />
        <div style={{display: 'flex', alignItems: 'baseline', gap: 40, marginTop: 20}}>
          <div style={{...T.claim, fontSize: 52, ...reveal(W(f, [16, 20]), 12)}}>Edit Lobby</div>
          <div style={{...T.eyebrow, fontSize: 22, letterSpacing: '0.24em', color: C.muted, ...reveal(W(f, [30, 20]), 8)}}>
            website design &nbsp;·&nbsp; development &nbsp;·&nbsp; performance optimization
          </div>
        </div>
      </div>
    </div>
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: swap}}>
      <div style={{...T.claim, fontSize: 66, ...reveal(W(f, [118, 22]), 14)}}>You bring the problem.</div>
      <div style={{...T.claim, fontSize: 66, marginTop: 10, color: C.accent, ...reveal(W(f, [132, 22]), 14)}}>I handle the build.</div>
    </div>
    <div style={{position: 'absolute', inset: 0, background: '#000', opacity: fade}} />
  </>);
};
