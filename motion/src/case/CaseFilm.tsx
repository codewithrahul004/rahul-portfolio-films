import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {C, setTheme, ThemeName} from '../theme';
import {Grain} from './pieces';
import {
  LEN, S01Website, S02Experience, S03Challenge, S04Approach, S05Bandwidth, S06Video, S07Mobile,
  S08Engagement, S09Picture, S10Intro, S11Testimonial, S12Close, Testimonial,
} from './scenes';

export type CaseProps = {theme: ThemeName; testimonial: Testimonial | null};

/** Section starts, given whether the testimonial exists. */
export const caseOffsets = (t: Testimonial | null) => {
  const o: Record<string, number> = {};
  let at = 0;
  const add = (k: string, n: number) => { o[k] = at; at += n; };
  add('website', LEN.website); add('experience', LEN.experience); add('challenge', LEN.challenge);
  add('approach', LEN.approach); add('bandwidth', LEN.bandwidth); add('video', LEN.video);
  add('mobile', LEN.mobile); add('engagement', LEN.engagement); add('picture', LEN.picture);
  if (t) { add('intro', LEN.intro); add('testimonial', t.frames); }
  add('close', LEN.close);
  o.total = at;
  return o;
};

export const CaseFilm: React.FC<CaseProps> = ({theme, testimonial}) => {
  setTheme(theme);
  const o = caseOffsets(testimonial);
  const S = (k: string, n: number, node: React.ReactNode) => (
    <Sequence key={k} from={o[k]} durationInFrames={n} premountFor={15}>{node}</Sequence>
  );
  return (
    <AbsoluteFill style={{background: C.ground}}>
      {S('website', LEN.website, <S01Website />)}
      {S('experience', LEN.experience, <S02Experience />)}
      {S('challenge', LEN.challenge, <S03Challenge />)}
      {S('approach', LEN.approach, <S04Approach />)}
      {S('bandwidth', LEN.bandwidth, <S05Bandwidth />)}
      {S('video', LEN.video, <S06Video />)}
      {S('mobile', LEN.mobile, <S07Mobile />)}
      {S('engagement', LEN.engagement, <S08Engagement />)}
      {S('picture', LEN.picture, <S09Picture />)}
      {testimonial ? S('intro', LEN.intro, <S10Intro />) : null}
      {testimonial ? S('testimonial', testimonial.frames, <S11Testimonial t={testimonial} />) : null}
      {S('close', LEN.close, <S12Close />)}
      <Grain />
    </AbsoluteFill>
  );
};
