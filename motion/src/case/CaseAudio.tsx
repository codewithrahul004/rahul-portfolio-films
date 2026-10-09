import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {Layer, Ramp, FPS, MUSIC_FILE, MUSIC_START_SEC} from '../audio/cues';
import {MIX} from '../audio/Layers';
import {caseOffsets} from './CaseFilm';
import {Testimonial} from './scenes';

/* =====================================================================
   THE CASE STUDY SCORE. Same palette, same rules as the profile film:
   music under everything on one gain ramp, dark short transitions, a
   metric hierarchy, real silence before the biggest figure. Under the
   testimonial the music sits far down so the client's voice owns it.

   Frames are built from caseOffsets() so they follow the testimonial's
   length whenever one is supplied.                                        */

type Cue = {f: number; s: string; g: number; l: Layer; why: string};
const c = (f: number, s: string, g: number, l: Layer, why: string): Cue => ({f, s, g, l, why});

export const caseCues = (t: Testimonial | null): Cue[] => {
  const o = caseOffsets(t);
  const cues: Cue[] = [
    c(o.website + 0, 'LOW_TONE', 0.22, 'texture', 'the site arrives on a tone, not a hit'),
    c(o.website + 70, 'TONAL_HIT', 0.16, 'metric', 'EDIT LOBBY'),
    c(o.experience + 96, 'SWEEP_SOFT', 0.24, 'transition', 'the phone slides in'),
    c(o.challenge - 30, 'SWELL_IN', 0.28, 'transition', 'into the challenge'),
    c(o.challenge + 2, 'HIT_SECTION', 0.30, 'impact', 'the challenge lands'),
    c(o.challenge + 80, 'DIGITAL_TICK', 0.12, 'ui', 'second idea'),
    c(o.challenge + 160, 'DIGITAL_TICK', 0.12, 'ui', 'third idea'),
    c(o.approach + 2, 'SWEEP_DARK', 0.24, 'transition', 'the rebuilt page arrives and travels'),
    c(o.approach + 68, 'UI_CLICK', 0.14, 'ui', 'development'),
    c(o.approach + 128, 'UI_CLICK', 0.14, 'ui', 'performance'),
    c(o.bandwidth - 36, 'SWELL_IN', 0.30, 'transition', 'rising into the centrepiece'),
    c(o.bandwidth + 2, 'HIT_SECTION', 0.30, 'impact', 'the result section lands'),
    c(o.bandwidth + 50, 'BLOOM', 0.22, 'transition', 'swelling into the morph'),
    c(o.bandwidth + 92, 'IMPACT_MEDIUM', 0.32, 'impact', 'tier 3: 287 becomes 20.1'),
    c(o.bandwidth + 92, 'TONAL_HIT_LOW', 0.28, 'metric', 'and it resolves'),
    c(o.bandwidth + 152, 'IMPACT_MEDIUM', 0.36, 'impact', 'tier 4: 93%, the headline of the film'),
    c(o.bandwidth + 152, 'TONAL_HIT_LOW', 0.32, 'metric', 'the strongest resolve'),
    c(o.video + 4, 'TONAL_HIT', 0.18, 'metric', 'tier 2: 273.3'),
    c(o.video + 82, 'TONAL_HIT', 0.20, 'metric', 'tier 2: resolves on 9.6'),
    c(o.mobile + 0, 'SWEEP_SOFT', 0.22, 'transition', 'the phone arrives'),
    c(o.mobile + 40, 'IMPACT_MEDIUM', 0.30, 'impact', 'tier 3: 1.7s'),
    c(o.mobile + 40, 'TONAL_HIT_LOW', 0.26, 'metric', 'resolving'),
    c(o.mobile + 100, 'TONAL_HIT', 0.18, 'metric', 'tier 2: core web vitals passed'),
    c(o.engagement + 16, 'TONAL_HIT', 0.18, 'metric', 'tier 2: the session figure'),
    c(o.engagement + 84, 'IMPACT_MEDIUM', 0.30, 'impact', 'tier 3: +27.3%'),
    c(o.engagement + 84, 'TONAL_HIT_LOW', 0.26, 'metric', 'resolving'),
    c(o.picture - 30, 'SWELL_IN', 0.26, 'transition', 'into the big picture'),
    c(o.picture + 2, 'HIT_SECTION', 0.26, 'impact', 'the four results, together'),
    c(o.close + 0, 'LOW_TONE', 0.26, 'texture', 'the close opens on a bed'),
    c(o.close + 16, 'TONAL_HIT', 0.18, 'metric', 'EDIT LOBBY, the lockup'),
    c(o.close + 132, 'IMPACT_MEDIUM', 0.30, 'impact', 'I HANDLE THE BUILD. Restrained'),
    c(o.close + 132, 'TONAL_HIT_LOW', 0.30, 'metric', 'and the film resolves tonally'),
  ];
  if (t) {
    cues.push(c(o.intro + 8, 'UI_CLICK', 0.14, 'ui', 'the results are one thing'));
    cues.push(c(o.intro + 34, 'TONAL_HIT', 0.18, 'metric', 'here is what the client had to say'));
  }
  return cues;
};

/** The music arc: present under the site, back for the figures, far down
    under the client's voice, up for the close, out on black. */
export const caseArc = (t: Testimonial | null): Ramp => {
  const o = caseOffsets(t);
  const r: Ramp = [
    [0, 0.0], [20, 0.55], [o.experience, 0.62], [o.challenge - 10, 0.62],
    [o.challenge, 0.50], [o.approach, 0.56], [o.approach + 250, 0.66],
    [o.bandwidth - 40, 0.66], [o.bandwidth - 10, 0.10], [o.bandwidth + 20, 0.10], [o.bandwidth + 44, 0.58],
    [o.video, 0.62], [o.mobile, 0.66], [o.engagement, 0.66], [o.picture - 10, 0.66], [o.picture, 0.74], [o.picture + LEN_PICTURE, 0.74],
  ];
  if (t) {
    // under the client's voice the music is almost gone: her words own the frame
    r.push([o.intro + 10, 0.16], [o.intro + LEN_INTRO, 0.16], [o.testimonial + 6, 0.03], [o.close - 20, 0.03]);
  }
  r.push([o.close, 0.46], [o.close + 110, 0.40], [o.close + 132, 0.52], [o.close + 200, 0.3], [o.total, 0.0]);
  return r;
};
const LEN_PICTURE = 120, LEN_INTRO = 90;

const ramp = (r: Ramp, f: number): number => {
  if (f <= r[0][0]) return r[0][1];
  const last = r[r.length - 1];
  if (f >= last[0]) return last[1];
  let i = 0;
  while (i < r.length - 1 && r[i + 1][0] <= f) i++;
  return interpolate(f, [r[i][0], r[i + 1][0]], [r[i][1], r[i + 1][1]]);
};

export type CaseAudioProps = {music: boolean; musicFile?: string; musicStartSec?: number; testimonial: Testimonial | null};

export const CaseAudio: React.FC<CaseAudioProps> = ({music, musicFile = MUSIC_FILE, musicStartSec = MUSIC_START_SEC, testimonial}) => {
  const o = caseOffsets(testimonial);
  const arc = caseArc(testimonial);
  const cues = caseCues(testimonial);
  const ducks = [o.bandwidth + 92, o.bandwidth + 152, o.mobile + 40, o.engagement + 84, o.close + 132];
  const duck = (f: number) => {
    let g = 1;
    for (const d of ducks) { const rel = f - d; if (rel >= -5 && rel <= 24) g = Math.min(g, rel < 0 ? interpolate(rel, [-5, 0], [1, 0.6]) : interpolate(rel, [0, 24], [0.6, 1])); }
    return g;
  };
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {music ? (
        <Audio src={staticFile(musicFile)} trimBefore={Math.round(musicStartSec * FPS)} loop
          volume={(f) => Math.max(0, Math.min(1, ramp(arc, f) * MIX.music * duck(f)))} />
      ) : null}
      {cues.map((q, i) => (
        <Sequence key={`${q.f}-${q.s}-${i}`} from={q.f} durationInFrames={Math.min(120, o.total - q.f)}>
          <Audio src={staticFile(`audio/sfx/${q.s}.wav`)} volume={Math.min(1, q.g * MIX[q.l])} />
        </Sequence>
      ))}
      {testimonial ? (
        <Sequence from={o.testimonial} durationInFrames={testimonial.frames}>
          <Audio src={staticFile(testimonial.file)} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
