/* =====================================================================
   THE CUE SHEET — single source of truth for the film's audio.

   Every frame number here was read out of the scene component that drives
   the picture, not estimated from a timestamp. The offsets below place each
   scene's own local frames onto the assembled 3,392 frame film.

   SCENE          SOURCE FILE              LOCAL   OFFSET   ABSOLUTE
   hook           Scene01Hook.tsx            320        0   0    - 320
   portfolio      Scene04Portfolio.tsx       738      320   320  - 1058
   edit lobby     Scene02EditLobby.tsx       450     1058   1058 - 1508
   ksunch         Scene03Ksunch.tsx          528     1508   1508 - 2036
   proof wall     Scene05Proof.tsx           630     2036   2036 - 2666
   pitch          Scene06Pitch.tsx           724     2666   2666 - 3390
   close          Scene07Close.tsx           232     3390   3390 - 3622

   The "+n" sections are held at rest points for the voiceover (stretch.tsx).
   Local beats below are mapped through sf() so they land on the held frame.

   Rahul numbered his audio brief by content type rather than by position in
   the cut, so his "scene 02 proof/metrics" is the edit lobby clip which sits
   third, his "03 results" is ksunch which sits fourth, and his "04 website"
   is the portfolio reel which sits second. The energy arc below follows his
   INTENT per content, which is what he meant.
   ===================================================================== */

import {HOLDS, stretchFrame} from '../stretch';

/** A scene's local beat frame, on the stretched scene. */
export const sf = (scene: keyof typeof HOLDS, local: number) => stretchFrame(HOLDS[scene], local);

export const FILM_FRAMES = 3622;
export const FPS = 30;

export const OFF = {
  hook: 0,
  portfolio: 320,
  editLobby: 1058,
  ksunch: 1508,
  proof: 2036,
  pitch: 2666,
  close: 3390,
} as const;

/** Section boundaries, for the music arc. */
export const SECTIONS = [
  {name: 'hook', from: OFF.hook, to: OFF.portfolio},
  {name: 'portfolio', from: OFF.portfolio, to: OFF.editLobby},
  {name: 'editLobby', from: OFF.editLobby, to: OFF.ksunch},
  {name: 'ksunch', from: OFF.ksunch, to: OFF.proof},
  {name: 'proof', from: OFF.proof, to: OFF.pitch},
  {name: 'pitch', from: OFF.pitch, to: OFF.close},
  {name: 'close', from: OFF.close, to: FILM_FRAMES},
] as const;

export type Layer = 'transition' | 'metric' | 'ui' | 'impact' | 'texture';

export type Cue = {
  /** absolute frame in the finished film */
  f: number;
  /** which asset */
  s: string;
  /** linear gain */
  g: number;
  /** which controllable layer it belongs to */
  l: Layer;
  /** why it exists, so a later pass can judge whether to cut it */
  why: string;
};

const c = (f: number, s: string, g: number, l: Layer, why: string): Cue => ({f, s, g, l, why});

/* ---------------------------------------------------------------- HOOK
   Sparse and intriguing. Two sounds in 7.6 seconds, and that is the point. */
const HOOK: Cue[] = [
  c(0, 'LOW_TONE', 0.20, 'texture', 'the film opens on a tone, not a hit'),
  c(32, 'TONAL_HIT', 0.19, 'metric', 'the one line of type lands'),
  c(190, 'SWEEP_SOFT', 0.26, 'transition', 'the three reviews arrive'),
  c(280, 'SWELL_IN', 0.30, 'transition', 'rises and ends at 316, the frame the hook goes dark'),
];

/* ----------------------------------------------------------- PORTFOLIO
   Rahul's "website / build": fluid and rhythmic. The music carries this
   section; sound effects only mark the four real structural moves.
   Local beats from Scene04Portfolio.tsx: s4In 0, e1 92, lpIn 286,
   wallIn 346, qcRise 484, elRise 548, statement 686, through 708.       */
const P = OFF.portfolio;
const PORTFOLIO: Cue[] = [
  c(P + sf('portfolio', 6), 'HIT_SECTION', 0.34, 'impact', 'frame 234: the first website becomes visible (measured)'),
  c(P + sf('portfolio', 86), 'BLOOM', 0.26, 'transition',
    'ONE swell across the three entrance animations at 92/100/108, not three sounds'),
  c(P + sf('portfolio', 284), 'SWEEP_SOFT', 0.30, 'transition', 'the multilingual panel slides in'),
  c(P + sf('portfolio', 344), 'SWEEP_DARK', 0.30, 'transition', 'the wall of eight builds, one directional move'),
  c(P + sf('portfolio', 486), 'SWEEP_SOFT', 0.28, 'transition',
    'QC Lobby travels out of the wall as a shared element'),
  c(P + sf('portfolio', 686), 'TONAL_HIT', 0.24, 'metric', 'the closing statement of the section'),
  c(P + sf('portfolio', 702), 'SWELL_IN', 0.30, 'transition', 'rises through the push, ends at 966 where the statement is gone'),
];

/* ---------------------------------------------------------- EDIT LOBBY
   Rahul's "proof / metrics": precise, a clearer pulse, a metric hierarchy.
   Local beats from Scene02EditLobby.tsx: figure 12, morph 50, fig93 126,
   figVid 170, figLcp 244, figSes 314, deltaSes 346, through 428.
   The dozens of ring and bar cues in that file are deliberately NOT scored.
   They are decoration; sounding them would turn this into an interface.   */
const E = OFF.editLobby;
const EDIT_LOBBY: Cue[] = [
  c(E + sf('editLobby', 2), 'HIT_SECTION', 0.30, 'impact', 'frame 968: the Edit Lobby panel becomes visible (measured)'),
  c(E + sf('editLobby', 36), 'BLOOM', 0.22, 'transition', 'swelling into the 287 to 20.1 morph'),
  c(E + sf('editLobby', 50), 'IMPACT_MEDIUM', 0.30, 'impact', 'the morph itself, the scene signature'),
  c(E + sf('editLobby', 126), 'IMPACT_MEDIUM', 0.34, 'impact', 'tier 3 — 93%, the headline of the report'),
  c(E + sf('editLobby', 126), 'TONAL_HIT_LOW', 0.30, 'metric', 'tier 3 — and it resolves, not bangs'),
  c(E + sf('editLobby', 170), 'TONAL_HIT', 0.18, 'metric', 'tier 2 — 9.6 GB'),
  c(E + sf('editLobby', 314), 'TONAL_HIT', 0.20, 'metric', 'tier 2 — the 4:12 session figure'),
  c(E + sf('editLobby', 346), 'IMPACT_MEDIUM', 0.30, 'impact', 'tier 3 — +27.3%'),
  c(E + sf('editLobby', 346), 'TONAL_HIT_LOW', 0.26, 'metric', 'tier 3 — resolving'),
  c(E + sf('editLobby', 410), 'SWELL_IN', 0.32, 'transition', 'rises through the push, ends at 1412 where the picture goes dark (measured)'),
];

/* --------------------------------------------------------------- KSUNCH
   Rahul's "results": energy up, business metrics feel important.
   Local beats from Scene03Ksunch.tsx: arrive 0, fig90 82, chain 152,
   revStep 214 (68 frames of chart drawing), figGa 317, ringRate 450,
   statement 484, through 512.                                            */
const K = OFF.ksunch;
const KSUNCH: Cue[] = [
  c(K + sf('ksunch', 10), 'HIT_SECTION', 0.38, 'impact', 'frame 1426: the KSUNCH brief wipes in (measured). The biggest section opens harder'),
  c(K + sf('ksunch', 82), 'IMPACT_MEDIUM', 0.30, 'impact', 'tier 3 — 90% of the workload'),
  c(K + sf('ksunch', 82), 'TONAL_HIT', 0.24, 'metric', 'tier 3 — resolving'),
  c(K + sf('ksunch', 150), 'SWEEP_SOFT', 0.26, 'transition', 'the chain of automations'),
  c(K + sf('ksunch', 214), 'LOW_TONE', 0.26, 'texture',
    'a sustained tone under the 68 frames of revenue chart drawing'),
  c(K + sf('ksunch', 282), 'IMPACT_MEDIUM', 0.34, 'impact', 'tier 3 — the chart resolves on Rs 4,10,932'),
  c(K + sf('ksunch', 282), 'TONAL_HIT_LOW', 0.28, 'metric', 'tier 3 — resolving'),
  c(K + sf('ksunch', 317), 'IMPACT_LIGHT', 0.24, 'impact', 'tier 3 — 77K active users'),
  c(K + sf('ksunch', 317), 'TONAL_HIT', 0.22, 'metric', 'tier 3 — resolving'),
  c(K + sf('ksunch', 450), 'TONAL_HIT', 0.18, 'metric', 'tier 2 — Rs 13,590 recovered'),
  c(K + sf('ksunch', 490), 'SWELL_IN', 0.30, 'transition', 'rises through the push, ends at 1942 where the picture goes dark (measured)'),
];

/* ----------------------------------------------------------- PROOF WALL
   Rahul's "client proof": trust, volume, momentum, and explicitly NOT a
   notification per review. Twelve cards land locally at 58, 96, 120, 148,
   172, 198, 254, 272, 290, 306, 324, 340. Only FOUR of them are scored,
   with falling gain, plus the centre card. The accumulation is carried by
   the music rhythm, which is what stops it sounding like an inbox.        */
const R = OFF.proof;
const PROOF: Cue[] = [
  c(R + sf('proof', 0), 'HIT_SECTION', 0.24, 'impact', 'frame 1944: the profile surface is visible at once (measured). Low: the wall itself is not scored'),
  c(R + sf('proof', 22), 'UI_CLICK', 0.20, 'ui', 'the Rising Talent badge, the first accent'),
  c(R + sf('proof', 58), 'DIGITAL_TICK', 0.17, 'ui', 'first review'),
  c(R + sf('proof', 96), 'DIGITAL_TICK', 0.14, 'ui', 'second, quieter'),
  c(R + sf('proof', 120), 'DIGITAL_TICK', 0.115, 'ui', 'third, quieter again'),
  c(R + sf('proof', 148), 'DIGITAL_TICK', 0.09, 'ui', 'fourth, almost gone — then they stop'),
  c(R + sf('proof', 198), 'TONAL_HIT', 0.22, 'metric',
    'the centre card: the camera nearly stops here for 2.3 seconds'),
  c(R + sf('proof', 406), 'SWEEP_SOFT', 0.20, 'transition', 'the wall recedes and the music breathes'),
  c(R + sf('proof', 416), 'TONAL_HIT', 0.22, 'metric', 'THE WORK SPEAKS / THE CLIENTS CONFIRM IT'),
  c(R + sf('proof', 434), 'SWEEP_DARK', 0.26, 'transition', 'ONE sweep as the brands start swapping; a tick per swap would machine-gun'),
  c(R + sf('proof', 572), 'TONAL_HIT', 0.20, 'metric', 'the profile line: 5.0, rising talent'),
  c(R + sf('proof', 596), 'SWEEP_SOFT', 0.22, 'transition', 'the names push away; then nothing until the figure, so the silence holds'),
];

/* ---------------------------------------------------------------- PITCH
   Local beats from Scene06Pitch.tsx: f1 2, f2 70, f3 132, s1 196, s2 266,
   f4 338, f5 406, f6 474, r1 548, tools 610 + i*8, out 708.
   The seven platform names land 8 frames apart. Scoring seven sounds in
   1.9 seconds would be a machine gun, so there is ONE swell under them.   */
const T = OFF.pitch;
const PITCH: Cue[] = [
  c(T + sf('pitch', 5), 'IMPACT_MEDIUM', 0.32, 'impact', 'tier 3 — 93%, frame 2441, the first frame it is visible (measured), after real silence'),
  c(T + sf('pitch', 5), 'TONAL_HIT_LOW', 0.28, 'metric', 'tier 3 — resolving'),
  c(T + sf('pitch', 70), 'IMPACT_MEDIUM', 0.30, 'impact', 'tier 3 — +27.3%'),
  c(T + sf('pitch', 70), 'TONAL_HIT', 0.24, 'metric', 'tier 3 — resolving'),
  c(T + sf('pitch', 132), 'IMPACT_MEDIUM', 0.34, 'impact', 'tier 3 deeper — Rs 4.1L+, it is money'),
  c(T + sf('pitch', 132), 'TONAL_HIT_LOW', 0.28, 'metric', 'tier 3 — resolving'),
  c(T + sf('pitch', 196), 'UI_CLICK', 0.17, 'ui', 'every brand is different'),
  c(T + sf('pitch', 266), 'UI_CLICK', 0.17, 'ui', 'the salesperson that never clocks off'),
  c(T + sf('pitch', 338), 'IMPACT_LIGHT', 0.26, 'impact',
    '53% — a cost, not a win, so it lands lower and without a bright resolve'),
  c(T + sf('pitch', 406), 'TONAL_HIT', 0.17, 'metric', 'tier 2 — 46.1%, lightest of the research beats'),
  c(T + sf('pitch', 466), 'BLOOM', 0.24, 'transition', 'swelling into the answer'),
  c(T + sf('pitch', 474), 'IMPACT_MEDIUM', 0.36, 'impact', 'tier 4 — 1.7s, the answer to the fear'),
  c(T + sf('pitch', 474), 'TONAL_HIT_LOW', 0.32, 'metric', 'tier 4 — the strongest resolve before the close'),
  c(T + sf('pitch', 548), 'UI_CLICK', 0.17, 'ui', 'your project decides the platform'),
  c(T + sf('pitch', 606), 'SWEEP_SOFT', 0.22, 'transition', 'ONE sweep under all seven platform names'),
];

/* ---------------------------------------------------------------- CLOSE
   Local beats from Scene07Close.tsx: name 0, claim 78, cta 154.
   Density drops. Space opens. Nothing here competes with the typography.  */
const Z = OFF.close;
const CLOSE: Cue[] = [
  c(Z + 6, 'LOW_TONE', 0.30, 'texture', 'frame 3166: Rahul appears (measured), into a low bed, after real silence'),
  c(Z + 78, 'TONAL_HIT', 0.20, 'metric', 'you bring the problem / I handle the build'),
  c(Z + 97, 'RISER', 0.30, 'transition', 'the one riser in the film, 1.9 s, stops dead on LET’S BUILD'),
  c(Z + 154, 'IMPACT_MEDIUM', 0.30, 'impact', 'LET’S BUILD. Restrained, not a trailer boom'),
  c(Z + 154, 'TONAL_HIT_LOW', 0.34, 'metric', 'and the film resolves tonally, then tails out'),
];

export const CUES: Cue[] = [
  ...HOOK, ...PORTFOLIO, ...EDIT_LOBBY, ...KSUNCH, ...PROOF, ...PITCH, ...CLOSE,
];

/* ================================================================ MUSIC
   ONE TRACK, ONE GAIN RAMP. The previous build ran four synthesised stems;
   this cut runs Rahul's chosen song, "Freedom" by William, dropped at
   public/audio/music.wav (see audio/MUSIC.md). The arc is a single ramp of
   gain across the film rather than a cut between tracks, which is what
   keeps six separately built sections feeling like one piece.

   Each entry is [frame, gain] and is interpolated between.

   Arc, as briefed: sparse for the hook, up as the work begins, strongest
   through KSUNCH and the proof wall, a hard drop into the near-silence
   before the pitch, back for the pitch, gone to almost nothing before Rahul
   appears, a reduced return for the close, and out under LET'S BUILD's tail.

   trimBefore is how far into the song frame 0 sits. Most songs have an
   intro you do not want; change MUSIC_START_SEC to taste.                 */
export type Ramp = [number, number][];

export const MUSIC_FILE = 'audio/music.wav';
export const MUSIC_START_SEC = 20.3;

export const MUSIC_ARC: Ramp = [
  [0, 0.0], [30, 0.30], [OFF.portfolio - 130, 0.32],
  [OFF.portfolio, 0.56], [OFF.editLobby - 28, 0.60],
  [OFF.editLobby, 0.70], [OFF.ksunch - 23, 0.72],
  [OFF.ksunch, 1.0], [OFF.proof - 21, 1.0],
  [OFF.proof, 0.78], [OFF.pitch - 118, 0.78], [OFF.pitch - 58, 0.42],
  [OFF.pitch - 38, 0.06], [OFF.pitch + 4, 0.06], [OFF.pitch + 30, 0.64], [OFF.close - 52, 0.60],
  [OFF.close - 30, 0.05], [OFF.close + 2, 0.05], [OFF.close + 26, 0.42],
  [OFF.close + 126, 0.14], [OFF.close + 150, 0.14], [OFF.close + 158, 0.50],
  [OFF.close + 192, 0.34], [FILM_FRAMES, 0.0],
];

/* ============================================================== DUCKING
   The music steps back briefly so an impact can land, then returns. These
   are the tier 3 and tier 4 metric moments only; ducking everything would
   make the mix pump.                                                     */
export const DUCKS: number[] = [
  OFF.editLobby + sf('editLobby', 50), OFF.editLobby + sf('editLobby', 126), OFF.editLobby + sf('editLobby', 346),
  OFF.ksunch + sf('ksunch', 82), OFF.ksunch + sf('ksunch', 282), OFF.ksunch + sf('ksunch', 317),
  OFF.pitch + sf('pitch', 5), OFF.pitch + sf('pitch', 70), OFF.pitch + sf('pitch', 132), OFF.pitch + sf('pitch', 474),
  OFF.close + 154,
];

/** Frames of deliberate near silence. The brief asks for these by name. */
export const SILENCES = [
  {from: OFF.pitch - 38, to: OFF.pitch + 4, why: 'before the pitch, so the first figure lands in space'},
  {from: OFF.close - 30, to: OFF.close + 2, why: 'before Rahul appears'},
  {from: OFF.close + 126, to: OFF.close + 150, why: 'a reduction before LET’S BUILD'},
];

/* ============================================================ VOICEOVER
   Rahul's own recordings, nine clips, cleaned by scripts (highpass, light
   noise reduction, de-ess, 2.5:1 compression, -19 LUFS each). Each one is
   placed on the frame its section needs; the picture was held where the
   voice runs longer than the silent cut. trimBefore skips the recorded
   lead-in. Under speech the music ducks 6 dB and the transition and ui
   layers are muted (see Layers.tsx).                                      */
export type Voice = {file: string; at: number; trimBefore: number; speechFrames: number; what: string};
const v = (n: number, at: number, leadSec: number, speechSec: number, what: string): Voice =>
  ({file: `audio/vo/vo_${n}.wav`, at, trimBefore: Math.round(leadSec * FPS), speechFrames: Math.round(speechSec * FPS), what});

export const VOICE: Voice[] = [];  // the voiceover was removed on 5 October; place clips here to put one back
