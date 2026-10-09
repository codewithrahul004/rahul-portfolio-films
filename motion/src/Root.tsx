import React from 'react';
import {Composition} from 'remotion';
import {Film, FilmProps} from './Film';
import {FilmAudio, FilmAudioProps} from './audio/Layers';
import {FILM_FRAMES} from './audio/cues';
import {CaseFilm, CaseProps, caseOffsets} from './case/CaseFilm';
import {CaseAudio, CaseAudioProps} from './case/CaseAudio';
import {CnFilm, CnAudio, CN_FRAMES} from './cn/CnFilm';
import {FuncFilm, FuncAudio, FUNC_FRAMES} from './func/FuncFilm';
import {KsunchFilm, KsunchAudio, KS_FRAMES} from './ksunch/KsunchFilm';
import {QcFilm, QcAudio, QC_FRAMES} from './qc/QcFilm';
import {VrgFilm, VrgAudio, VRG_FRAMES} from './vrg/VrgFilm';
import {Scene01Hook, SCENE01_FRAMES} from './scenes/Scene01Hook';
import {Scene02EditLobby, SCENE02_FRAMES} from './scenes/Scene02EditLobby';
import {Scene03Ksunch, SCENE03_FRAMES} from './scenes/Scene03Ksunch';
import {Scene04Portfolio, SCENE04_FRAMES} from './scenes/Scene04Portfolio';
import {Scene05Proof, SCENE05_FRAMES} from './scenes/Scene05Proof';
import {Scene06Pitch, SCENE06_FRAMES} from './scenes/Scene06Pitch';
import {Scene07Close, SCENE07_FRAMES} from './scenes/Scene07Close';

const FRAME = {fps: 30, width: 1920, height: 1080} as const;

/** The picture and the score together, for scrubbing in the studio. */
const FilmPreview: React.FC<FilmAudioProps & FilmProps> = (p) => (
  <>
    <Film theme={p.theme} />
    <FilmAudio {...p} />
  </>
);

const CasePreview: React.FC<CaseProps & CaseAudioProps> = (p) => (
  <>
    <CaseFilm theme={p.theme} testimonial={p.testimonial} />
    <CaseAudio music={p.music} musicFile={p.musicFile} testimonial={p.testimonial} />
  </>
);
const caseMeta = ({props}: {props: {testimonial: CaseProps['testimonial']}}) => ({durationInFrames: caseOffsets(props.testimonial).total});

const CnPreview: React.FC<{music: boolean}> = (p) => (<><CnFilm /><CnAudio music={p.music} /></>);

const FuncPreview: React.FC<{music: boolean}> = (p) => (<><FuncFilm /><FuncAudio music={p.music} /></>);

const KsPreview: React.FC<{music: boolean}> = (p) => (<><KsunchFilm /><KsunchAudio music={p.music} /></>);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="VrgEv" component={VrgFilm} durationInFrames={VRG_FRAMES} {...FRAME} />
    <Composition id="VrgEvAudio" component={VrgAudio} durationInFrames={VRG_FRAMES} {...FRAME} defaultProps={{music: true}} />

    <Composition id="QcLobby" component={QcFilm} durationInFrames={QC_FRAMES} {...FRAME} />
    <Composition id="QcLobbyAudio" component={QcAudio} durationInFrames={QC_FRAMES} {...FRAME} defaultProps={{music: true}} />

    {/* KSUNCH, fifty-two seconds */}
    <Composition id="Ksunch" component={KsunchFilm} durationInFrames={KS_FRAMES} {...FRAME} />
    <Composition id="KsunchAudio" component={KsunchAudio} durationInFrames={KS_FRAMES} {...FRAME} defaultProps={{music: true}} />
    <Composition id="KsunchPreview" component={KsPreview} durationInFrames={KS_FRAMES} {...FRAME} defaultProps={{music: true}} />

    {/* FUNC., forty-five seconds */}
    <Composition id="Func" component={FuncFilm} durationInFrames={FUNC_FRAMES} {...FRAME} />
    <Composition id="FuncAudio" component={FuncAudio} durationInFrames={FUNC_FRAMES} {...FRAME} defaultProps={{music: true}} />
    <Composition id="FuncPreview" component={FuncPreview} durationInFrames={FUNC_FRAMES} {...FRAME} defaultProps={{music: true}} />

    {/* CULLEN & NOIR, forty seconds */}
    <Composition id="CullenNoir" component={CnFilm} durationInFrames={CN_FRAMES} {...FRAME} />
    <Composition id="CullenNoirAudio" component={CnAudio} durationInFrames={CN_FRAMES} {...FRAME} defaultProps={{music: true}} />
    <Composition id="CullenNoirPreview" component={CnPreview} durationInFrames={CN_FRAMES} {...FRAME} defaultProps={{music: true}} />

    {/* THE EDIT LOBBY CASE STUDY. Length follows the testimonial, if any. */}
    <Composition id="CaseStudy" component={CaseFilm} durationInFrames={1} {...FRAME}
      defaultProps={{theme: 'green', testimonial: null} as CaseProps} calculateMetadata={caseMeta} />
    <Composition id="CaseStudyAwtm" component={CaseFilm} durationInFrames={1} {...FRAME}
      defaultProps={{theme: 'awtm', testimonial: null} as CaseProps} calculateMetadata={caseMeta} />
    <Composition id="CaseStudyAudio" component={CaseAudio} durationInFrames={1} {...FRAME}
      defaultProps={{music: true, testimonial: null} as CaseAudioProps} calculateMetadata={caseMeta} />
    <Composition id="CaseStudyPreview" component={CasePreview} durationInFrames={1} {...FRAME}
      defaultProps={{theme: 'green', music: true, testimonial: null} as CaseProps & CaseAudioProps} calculateMetadata={caseMeta} />

    {/* THE DELIVERABLES. Film is silent picture; FilmAudio is the score.
        scripts/build.sh renders both and muxes with a stream copy. */}
    <Composition id="Film" component={Film} durationInFrames={FILM_FRAMES} {...FRAME}
      defaultProps={{theme: 'green'} as FilmProps} />
    <Composition id="FilmAwtm" component={Film} durationInFrames={FILM_FRAMES} {...FRAME}
      defaultProps={{theme: 'awtm'} as FilmProps} />
    <Composition
      id="FilmAudio"
      component={FilmAudio}
      durationInFrames={FILM_FRAMES}
      {...FRAME}
      defaultProps={{music: true} as FilmAudioProps}
    />
    <Composition
      id="FilmPreview"
      component={FilmPreview}
      durationInFrames={FILM_FRAMES}
      {...FRAME}
      defaultProps={{music: true, theme: 'green'} as FilmAudioProps & FilmProps}
    />

    {/* the sections on their own, for working on one at a time */}
    <Composition id="Scene01" component={Scene01Hook} durationInFrames={SCENE01_FRAMES} {...FRAME} />
    <Composition id="Scene04" component={Scene04Portfolio} durationInFrames={SCENE04_FRAMES} {...FRAME} />
    <Composition id="Scene02" component={Scene02EditLobby} durationInFrames={SCENE02_FRAMES} {...FRAME} />
    <Composition id="Scene03" component={Scene03Ksunch} durationInFrames={SCENE03_FRAMES} {...FRAME} />
    <Composition id="Scene05" component={Scene05Proof} durationInFrames={SCENE05_FRAMES} {...FRAME} />
    <Composition id="Scene06" component={Scene06Pitch} durationInFrames={SCENE06_FRAMES} {...FRAME} />
    <Composition id="Scene07" component={Scene07Close} durationInFrames={SCENE07_FRAMES} {...FRAME} />
  </>
);
