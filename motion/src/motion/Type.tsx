import React from 'react';
import {C, T} from '../theme';
import {clamp01} from './timing';

/**
 * Whole-line reveal. The line moves and resolves as one object; it is never
 * clipped through the letterforms, so no frame shows half a character.
 */
export const RevealText: React.FC<{
  progress: number;
  rise?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({progress, rise = 20, style, children}) => {
  const p = clamp01(progress);
  return (
    <div
      style={{
        ...style,
        opacity: p,
        transform: `translateY(${(1 - p) * rise}px)`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * One label becoming another: the outgoing line leaves upward as the incoming
 * line arrives from below, inside a box tall enough that nothing is sliced
 * through mid-letter.
 */
export const RollText: React.FC<{
  from: string;
  to: string;
  progress: number;
  style?: React.CSSProperties;
  height?: number;
}> = ({from, to, progress, style, height = 34}) => {
  const p = clamp01(progress);
  return (
    <div style={{height, overflow: 'hidden', position: 'relative'}}>
      <div
        style={{
          ...style,
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translateY(${-p * height}px)`,
          opacity: 1 - p * 0.9,
        }}
      >
        {from}
      </div>
      <div
        style={{
          ...style,
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translateY(${(1 - p) * height}px)`,
          opacity: p,
        }}
      >
        {to}
      </div>
    </div>
  );
};

/** Short rule used as the film's recurring mark above a label. */
export const Rule: React.FC<{progress: number; width?: number}> = ({
  progress,
  width = 46,
}) => (
  <div
    style={{
      width: width * clamp01(progress),
      height: 2,
      background: C.accent,
      marginBottom: 18,
    }}
  />
);

export const Eyebrow: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
  children,
  style,
}) => <div style={{...T.eyebrow, ...style}}>{children}</div>;
