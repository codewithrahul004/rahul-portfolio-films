import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Scene01Hook, SCENE01_FRAMES} from './scenes/Scene01Hook';
import {Scene04Portfolio, SCENE04_FRAMES} from './scenes/Scene04Portfolio';
import {Scene02EditLobby, SCENE02_FRAMES} from './scenes/Scene02EditLobby';
import {Scene03Ksunch, SCENE03_FRAMES} from './scenes/Scene03Ksunch';
import {Scene05Proof, SCENE05_FRAMES} from './scenes/Scene05Proof';
import {Scene06Pitch, SCENE06_FRAMES} from './scenes/Scene06Pitch';
import {Scene07Close, SCENE07_FRAMES} from './scenes/Scene07Close';
import {OFF, FILM_FRAMES} from './audio/cues';
import {C, setTheme, ThemeName} from './theme';
import {HOLDS, Stretched, addedBy} from './stretch';

/* =====================================================================
   THE ASSEMBLED PICTURE. Silent.

   Running order, which tested well: hook, range, Edit Lobby, KSUNCH, proof
   wall, pitch and close. Every section closes by pushing through its own
   last line into darkness and the next opens arriving out of it, so the
   joins are straight cuts on black: no crossfade is needed and none is used.

   The offsets are the cue sheet's, so a frame constant read out of a scene
   file lands on the same absolute frame here and in the score.            */

const S = (name: keyof typeof HOLDS, frames: number, node: React.ReactNode) =>
  ({name, frames: frames + addedBy(HOLDS[name]), node: <Stretched holds={HOLDS[name]}>{node}</Stretched>});

const ORDER: {at: number; frames: number; node: React.ReactNode; name: string}[] = [
  {at: OFF.hook, ...S('hook', SCENE01_FRAMES, <Scene01Hook />)},
  {at: OFF.portfolio, ...S('portfolio', SCENE04_FRAMES, <Scene04Portfolio />)},
  {at: OFF.editLobby, ...S('editLobby', SCENE02_FRAMES, <Scene02EditLobby />)},
  {at: OFF.ksunch, ...S('ksunch', SCENE03_FRAMES, <Scene03Ksunch />)},
  {at: OFF.proof, ...S('proof', SCENE05_FRAMES, <Scene05Proof />)},
  {at: OFF.pitch, ...S('pitch', SCENE06_FRAMES, <Scene06Pitch />)},
  {at: OFF.close, ...S('close', SCENE07_FRAMES, <Scene07Close />)},
];

// The offsets in cues.ts and the scene lengths must agree. Fail loudly at
// module load rather than silently drifting the score off the picture.
for (let i = 1; i < ORDER.length; i++) {
  const prev = ORDER[i - 1];
  if (prev.at + prev.frames !== ORDER[i].at) {
    throw new Error(
      `Film order mismatch: ${prev.name} ends at ${prev.at + prev.frames} but ${ORDER[i].name} starts at ${ORDER[i].at}`
    );
  }
}
const last = ORDER[ORDER.length - 1];
if (last.at + last.frames !== FILM_FRAMES) {
  throw new Error(`Film is ${last.at + last.frames} frames, cues.ts says ${FILM_FRAMES}`);
}

export type FilmProps = {theme: ThemeName};

export const Film: React.FC<FilmProps> = ({theme}) => {
  setTheme(theme);
  return (
  <AbsoluteFill style={{background: C.ground}}>
    {ORDER.map((s) => (
      <Sequence key={s.name} from={s.at} durationInFrames={s.frames} premountFor={20}>
        {s.node}
      </Sequence>
    ))}
  </AbsoluteFill>
  );
};
