import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {CUES, DUCKS, FILM_FRAMES, MUSIC_ARC, MUSIC_FILE, MUSIC_START_SEC, FPS, Ramp, Layer, VOICE} from './cues';

/* =====================================================================
   The audio layers, as separately controllable components.

   Nothing here renders a pixel. The score is rendered on its own by the
   FilmAudio composition and muxed onto the picture with a stream copy, so
   the visuals are never re-encoded by an audio change.

   MIX trims a whole layer in one number. The transition layer sits low on
   purpose: the brief's best-received cut had no transition sounds at all,
   and Rahul's direction for this cut is "very cool but subtle". So they are
   there, they are the dark short ones (LIFT, SETTLE, BLOOM, LIFT_FAST; never
   AIR_RELEASE or a WHOOSH, which measured 80% and 22% of their energy in
   the 2 to 8 kHz band), and they are slightly under the metric hits. The palette is synthesised
   by scripts/synth-sfx.js: SWEEP_DARK, SWEEP_SOFT, SWELL_IN, RISER and
   HIT_SECTION, all low-passed under 1.2 kHz, measured under 0.3% of their
   energy above 2 kHz.
   ===================================================================== */

export const MIX: Record<Layer | 'music', number> = {
  music: 0.70,
  // Rahul's note on the first mix with the song in: "very loud, keep it
  // subtle". Every effect layer is pulled 6 to 8 dB below where it was. The
  // music and the cut carry the changes; the effects only confirm them.
  transition: 0.52,
  metric: 0.62,
  ui: 0.45,
  impact: 0.60,
  texture: 0.60,
};

const ramp = (r: Ramp, f: number): number => {
  if (f <= r[0][0]) return r[0][1];
  const last = r[r.length - 1];
  if (f >= last[0]) return last[1];
  let i = 0;
  while (i < r.length - 1 && r[i + 1][0] <= f) i++;
  return interpolate(f, [r[i][0], r[i + 1][0]], [r[i][1], r[i + 1][1]]);
};

/** 4.5 dB back for an impact, 5 frames down and 24 up. Short enough not to pump. */
const duckGain = (f: number): number => {
  let g = 1;
  for (const d of DUCKS) {
    const rel = f - d;
    if (rel >= -5 && rel <= 24) {
      g = Math.min(g, rel < 0
        ? interpolate(rel, [-5, 0], [1, 0.6])
        : interpolate(rel, [0, 24], [0.6, 1]));
    }
  }
  return g;
};

/** 1 outside speech, 0 inside it, with 8 frame ramps either side. */
export const speech = (f: number): number => {
  let inside = 0;
  for (const q of VOICE) {
    const a = q.at, b = q.at + q.speechFrames;
    if (f >= a - 8 && f <= b + 8) {
      const edge = f < a ? (f - (a - 8)) / 8 : f > b ? ((b + 8) - f) / 8 : 1;
      inside = Math.max(inside, Math.max(0, Math.min(1, edge)));
    }
  }
  return inside;
};

/** The music steps 6 dB back under the voice. */
const voiceDuck = (f: number) => 1 - 0.5 * speech(f);

/** Effects under a spoken word: transitions and ticks go, hits stay at 60%. */
const sfxUnderVoice = (layer: Layer, f: number) => {
  const sp = speech(f);
  if (layer === 'transition' || layer === 'ui') return 1 - sp;
  return 1 - 0.4 * sp;
};

export const musicGain = (f: number): number =>
  Math.max(0, Math.min(1, ramp(MUSIC_ARC, f) * MIX.music * duckGain(f) * voiceDuck(f)));

export const MusicTrack: React.FC<{file?: string}> = ({file = MUSIC_FILE}) => (
  <Audio
    src={staticFile(file)}
    trimBefore={Math.round(MUSIC_START_SEC * FPS)}
    loop
    volume={musicGain}
  />
);

const OneShot: React.FC<{name: string; gain: number; layer: Layer; at: number}> = ({name, gain, layer, at}) => (
  <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={(f) => Math.min(1, gain * MIX[layer] * sfxUnderVoice(layer, at + f))} />
);

export const SoundDesign: React.FC = () => (
  <>
    {CUES.map((q, i) => (
      <Sequence key={`${q.f}-${q.s}-${i}`} from={q.f} durationInFrames={Math.min(120, FILM_FRAMES - q.f)}>
        <OneShot name={q.s} gain={q.g} layer={q.l} at={q.f} />
      </Sequence>
    ))}
  </>
);

export const VoiceOver: React.FC = () => (
  <>
    {VOICE.map((q) => (
      <Sequence key={q.file} from={q.at} durationInFrames={q.speechFrames + 24} layout="none">
        <Audio src={staticFile(q.file)} trimBefore={q.trimBefore} volume={(f) => (f > q.speechFrames + 4 ? Math.max(0, 1 - (f - q.speechFrames - 4) / 20) : 1)} />
      </Sequence>
    ))}
  </>
);

export type FilmAudioProps = {
  /** false renders the sound design alone, for a cut before the track arrives */
  music: boolean;
  musicFile?: string;
};

/** Audio only. Rendered to a wav and muxed onto the silent picture. */
export const FilmAudio: React.FC<FilmAudioProps> = ({music, musicFile}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {music ? <MusicTrack file={musicFile} /> : null}
    <SoundDesign />
  </AbsoluteFill>
);
