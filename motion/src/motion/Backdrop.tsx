import React from 'react';
import {C} from '../theme';

/**
 * A measured grid sitting behind the evidence. It exists to give the camera
 * something to move against, so a push reads as travel rather than a zoom.
 * Deliberately close to invisible.
 */
export const BackdropGrid: React.FC<{drift: number}> = ({drift}) => {
  const step = 118;
  return (
    <div
      style={{
        position: 'absolute',
        left: -2000,
        top: -2000,
        width: 6400,
        height: 4600,
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.040) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,0.040) 1px, transparent 1px)`,
        backgroundSize: `${step}px ${step}px`,
        transform: `translate(${-drift * 0.6}px, ${-drift * 0.25}px)`,
        maskImage:
          'radial-gradient(70% 60% at 55% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 78%)',
        WebkitMaskImage:
          'radial-gradient(70% 60% at 55% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 78%)',
      }}
    />
  );
};

/** Keeps the typography column readable when the evidence grows past it. */
export const ColumnScrim: React.FC<{width?: number; strength?: number}> = ({
  width = 1020,
  strength = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width,
      height: 1080,
      background: `linear-gradient(90deg,
        rgba(11,11,12,${0.985 * strength}) 0%,
        rgba(11,11,12,${0.97 * strength}) 46%,
        rgba(11,11,12,${0.74 * strength}) 76%,
        rgba(11,11,12,0) 100%)`,
    }}
  />
);

export const Vignette: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        'radial-gradient(132% 102% at 60% 48%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.74) 100%)',
    }}
  />
);

export const Ground: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: C.ground}} />
);
