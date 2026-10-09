import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {Vignette, Ground} from '../motion/Backdrop';
import {easeOutCubic, easeInOutCubic, win} from '../motion/Path';
import {clamp01} from '../motion/timing';

/* ====================================================================== 06
   THE PITCH — RESULTS, THE EXPERT ARGUMENT, THE STAKES, THE RANGE

   Integrates the two closing sequences Rahul compared: the figure beats from
   the numbers version and the centred statement cards from the tools version.
   Everything is centred. The Basavaraj review that used to open this scene is
   gone at his request, so Scene 05 now hands straight into the first figure.

   THE ARGUMENT, IN ORDER:
     1  what the work produced          three figures, all read off documents
     2  why a template cannot do it     the expert line
     3  what it costs to get it wrong   the stakes, with sourced research
     4  and the answer to that cost     his own measured 1.7s LCP
     5  the range                       seven platforms, no platform to sell
     then Scene 07: the person and the call to action.

   ON FEAR, AND WHERE THE LINE IS. Rahul asked for FOMO. His own Scene 06
   brief banned scarcity ("LIMITED SLOTS", "ONLY 2 CLIENTS"), and that ban
   stands: invented scarcity is the single thing that would make a film built
   on verified evidence read as marketing. What is here instead is cost of
   inaction, which is honest, and every figure in it is primary-sourced:

     53%     Google/SOASTA 2017, "53% of mobile site visitors leave a page
             that takes longer than three seconds to load". Measured across
             900,000 mobile landing pages in 126 countries. Verified against
             the Think with Google PDF, not a blog repeating it.
     46.1%   Stanford Web Credibility Project, Fogg et al. 2002. The widely
             quoted "75% judge credibility by design" does NOT appear in that
             research and was rejected for this reason.

   The stakes beats are immediately answered by beat 8, which is Rahul's own
   Edit Lobby measurement: LCP 1.7s, Core Web Vitals passed. Fear that the
   film cannot answer is just a scare; fear the film answers is a close.

   NOTE ON 1.7s. The Edit Lobby report records LCP 1.7s, INP 128ms, CLS 0 and
   a passing Core Web Vitals result. TTFB 0.9s was flagged needs improvement,
   but TTFB is not a Core Web Vital, so "passed" is accurate as stated.     */

type Rule = {green?: boolean};

const B = {
  /* 1. what the work produced */
  f1:  {in: [2, 18],   out: [64, 16]},
  f2:  {in: [70, 18],  out: [126, 16]},
  f3:  {in: [132, 18], out: [188, 16]},
  /* 2. why an expert */
  s1:  {in: [196, 20], out: [258, 16]},
  /* 3. what it costs */
  s2:  {in: [266, 20], out: [330, 16]},
  f4:  {in: [338, 18], out: [398, 16]},
  f5:  {in: [406, 18], out: [466, 16]},
  /* 4. the answer to that cost */
  f6:  {in: [474, 20], out: [540, 16]},
  /* 5. the range */
  r1:  {in: [548, 22]},
  r2:  {in: [566, 22]},
  rule: [594, 16],
  out: [708, 16],
} as const;

/* Each platform's own wordmark, the official SVG, fetched 5 October at
   Rahul's request (Wikimedia Commons for Webflow, Wix, WordPress, Shopify,
   Lovable and Claude; framer.com/brand for Framer), recoloured white and
   otherwise untouched. Claude Code has no separate wordmark: it is the Claude
   wordmark followed by "Code" in the film's type. `h` is the display height,
   set per mark so they read at one optical size. */
type Platform = {name: string; logo?: string; h: number; suffix?: string};
const TOOLS_A: Platform[] = [
  {name: 'Webflow', logo: 'webflow.svg', h: 34}, {name: 'Framer', logo: 'framer.svg', h: 46},
  {name: 'Wix', logo: 'wix.svg', h: 40}, {name: 'WordPress', logo: 'wordpress.svg', h: 44},
];
const TOOLS_B: Platform[] = [
  {name: 'Shopify', logo: 'shopify.svg', h: 56}, {name: 'Lovable', logo: 'lovable.svg', h: 36},
  {name: 'Claude Code', logo: 'claude.svg', h: 42, suffix: 'Code'},
];
const TOOL_AT = (i: number) => 610 + i * 8;

export const SCENE06_FRAMES = 724;

/* ---------------------------------------------------------------- pieces */

const slot: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

const reveal = (t: number, rise = 12): React.CSSProperties => {
  const e = easeOutCubic(t);
  return {
    opacity: e,
    transform: `translateY(${(1 - e) * rise}px)`,
    clipPath: `inset(0% 0% ${(1 - e) * 100}% 0%)`,
  };
};

const GreenRule: React.FC<{t: number; w?: number; mb?: number}> = ({t, w = 86, mb = 34}) => (
  <div style={{
    width: w * easeOutCubic(t), height: 3, background: C.accent, marginBottom: mb,
  }} />
);

/** A figure beat: big number, the source named under it, nothing small. */
const FigureCard: React.FC<{
  t: number; o: number; value: string; line: string; note?: string; rise?: number;
}> = ({t, o, value, line, note, rise = 14}) => (
  <div style={{...slot, opacity: clamp01(easeOutCubic(t) * 1.6) * (1 - o)}}>
    <GreenRule t={t} />
    <div style={{
      fontSize: 180, fontWeight: 700, lineHeight: 0.95,
      letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
      ...reveal(t, rise),
    }}>
      {value}
    </div>
    <div style={{
      fontSize: 36, fontWeight: 700, letterSpacing: '0.2em',
      textTransform: 'uppercase', color: C.muted, marginTop: 34,
      whiteSpace: 'nowrap',
      opacity: easeOutCubic(clamp01(t * 1.6 - 0.45)),
    }}>
      {line}
    </div>
    {note ? (
      <div style={{
        fontSize: 30, letterSpacing: '0.08em', color: C.dim, marginTop: 22,
        opacity: easeOutCubic(clamp01(t * 1.6 - 0.65)),
      }}>
        {note}
      </div>
    ) : null}
  </div>
);

/** A statement beat: two lines, the second carried in the muted tone. */
const StatementCard: React.FC<{
  t: number; o: number; a: string; b: string; gap?: number;
}> = ({t, o, a, b}) => (
  <div style={{...slot, opacity: 1 - o}}>
    <div style={{
      fontSize: 62, fontWeight: 700, lineHeight: 1.22, letterSpacing: '-0.012em',
      ...reveal(t, 14),
    }}>
      {a}
    </div>
    <div style={{
      fontSize: 62, fontWeight: 700, lineHeight: 1.22, letterSpacing: '-0.012em',
      color: C.muted,
      ...reveal(clamp01(t * 1.45 - 0.45), 14),
    }}>
      {b}
    </div>
  </div>
);

const Tool: React.FC<{p: Platform; t: number}> = ({p, t}) => {
  const e = easeOutCubic(t);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 16,
      fontSize: 48, fontWeight: 700,
      letterSpacing: '0.01em', whiteSpace: 'nowrap',
      opacity: e,
      transform: `translateY(${(1 - e) * 14}px)`,
      clipPath: `inset(0% 0% ${(1 - e) * 100}% 0%)`,
    }}>
      {p.logo
        ? <Img src={staticFile(`logos/platforms/${p.logo}`)} style={{height: p.h, width: 'auto', display: 'block'}} />
        : <span style={{color: C.text}}>{p.name}</span>}
      {p.suffix ? <span style={{color: C.text, fontSize: 44, lineHeight: 1}}>{p.suffix}</span> : null}
    </span>
  );
};

/* ----------------------------------------------------------------- scene */

export const Scene06Pitch: React.FC = () => {
  const frame = useCurrentFrame();
  const W = (b: readonly number[] | number[]) => win(frame, b[0], b[1]);
  const E = (b: readonly number[] | number[]) => easeOutCubic(W(b));
  const SE = (b: readonly number[] | number[]) => easeInOutCubic(W(b));

  /* The only camera. 100% to 103% across 24 seconds, eased. Felt, not seen. */
  const push = 1 + 0.03 * easeInOutCubic(clamp01(frame / SCENE06_FRAMES));

  const row: React.CSSProperties = {
    display: 'flex', justifyContent: 'center', alignItems: 'baseline',
    gap: 58, flexWrap: 'nowrap',
  };

  const toolsLive = 1 - SE(B.out);

  return (
    <AbsoluteFill style={{background: C.ground, fontFamily: F.sans, color: C.text}}>
      <Ground />

      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${push})`, transformOrigin: '50% 50%',
      }}>
        {/* 1. WHAT THE WORK PRODUCED */}
        <FigureCard t={W(B.f1.in)} o={SE(B.f1.out)}
          value="93%" line="edit lobby bandwidth"
          note="287 gb a month down to 20.1 gb" rise={16} />

        <FigureCard t={W(B.f2.in)} o={SE(B.f2.out)}
          value="+27.3%" line="average session duration"
          note="3:18 before the rebuild, 4:12 after" />

        <FigureCard t={W(B.f3.in)} o={SE(B.f3.out)}
          value="₹4.1L+" line="ksunch launch revenue"
          note="77,000 active users in the first 30 days" />

        {/* 2. WHY AN EXPERT, AND NOT A TEMPLATE */}
        <StatementCard t={W(B.s1.in)} o={SE(B.s1.out)}
          a="Every brand is different."
          b="A template does not know that." />

        {/* 3. WHAT IT COSTS TO GET IT WRONG */}
        <StatementCard t={W(B.s2.in)} o={SE(B.s2.out)}
          a="Your website is the one salesperson"
          b="that never clocks off." />

        <FigureCard t={W(B.f4.in)} o={SE(B.f4.out)}
          value="53%" line="of mobile visitors leave after 3 seconds"
          note="google and soasta, 2017 &#183; 900,000 pages, 126 countries" />

        <FigureCard t={W(B.f5.in)} o={SE(B.f5.out)}
          value="46.1%" line="assess credibility on visual design"
          note="stanford web credibility project, 2002" rise={16} />

        {/* 4. AND THE ANSWER TO THAT COST, MEASURED */}
        <FigureCard t={W(B.f6.in)} o={SE(B.f6.out)}
          value="1.7s" line="edit lobby, after the rebuild"
          note="largest contentful paint &#183; core web vitals: passed" />

        {/* 5. THE RANGE */}
        <div style={{...slot, opacity: toolsLive}}>
          <div style={{
            fontSize: 62, fontWeight: 700, lineHeight: 1.22,
            letterSpacing: '-0.012em', ...reveal(W(B.r1.in), 14),
          }}>
            Your project decides the platform.
          </div>
          <div style={{
            fontSize: 62, fontWeight: 700, lineHeight: 1.22,
            letterSpacing: '-0.012em', color: C.muted, ...reveal(W(B.r2.in), 14),
          }}>
            Not the other way round.
          </div>

          <div style={{marginTop: 58}}>
            <GreenRule t={W(B.rule)} mb={54} />
          </div>

          {/* Fixed height. Without it the column re-centres as each name
              arrives and the two lines above visibly jump upward. */}
          <div style={{height: 166}}>
            <div style={{...row, marginBottom: 30}}>
              {TOOLS_A.map((p, i) => (
                <Tool key={p.name} p={p} t={W([TOOL_AT(i), 14])} />
              ))}
            </div>
            <div style={row}>
              {TOOLS_B.map((p, i) => (
                <Tool key={p.name} p={p} t={W([TOOL_AT(i + TOOLS_A.length), 14])} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Vignette />
    </AbsoluteFill>
  );
};
