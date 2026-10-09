import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CAPTIONS} from './captionData';
import {C, F} from './theme';

/* Captions for the voiceover. One line, bottom centre, 40 px bold (about
   29 px cap height, 2.7% of frame height, above the legibility floor). They
   sit under the portfolio's lower type band and clear of every column. */
export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const c = CAPTIONS.find((q) => f >= q.from - 2 && f <= q.to + 2);
  if (!c) return null;
  const fade = Math.min(1, (f - (c.from - 2)) / 4, ((c.to + 2) - f) / 4 + 0.25);
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center',
      fontFamily: F.sans, pointerEvents: 'none', opacity: Math.max(0, Math.min(1, fade)),
    }}>
      <span style={{
        display: 'inline-block', padding: '8px 22px', borderRadius: 8,
        background: 'rgba(8,8,10,0.72)', color: C.text,
        fontSize: 40, fontWeight: 700, letterSpacing: '0.005em', lineHeight: 1.2,
        textShadow: '0 2px 10px rgba(0,0,0,0.8)', whiteSpace: 'nowrap',
      }}>
        {c.text}
      </span>
    </div>
  );
};
