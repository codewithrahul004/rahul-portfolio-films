import React from 'react';
import {C, T, accentA} from '../theme';
import {lerp, clamp01} from './timing';

/** A figure that is counted, not faded in. Tabular digits so nothing jitters. */
export const DataCounter: React.FC<{
  from: number;
  to: number;
  progress: number;
  decimals?: number;
  suffix?: string;
  color?: string;
  size?: number;
}> = ({from, to, progress, decimals = 1, suffix = '', color = C.text, size}) => {
  const v = lerp(from, to, clamp01(progress));
  return (
    <span style={{...T.figure, color, fontSize: size ?? T.figure.fontSize}}>
      {v.toFixed(decimals)}
      {suffix ? (
        <span style={{fontSize: '0.46em', letterSpacing: '-0.01em', marginLeft: '0.10em'}}>
          {suffix}
        </span>
      ) : null}
    </span>
  );
};

/**
 * The reduction, drawn as a quantity rather than described as one.
 * Width is value / planLimit, so the bar contracting IS the result.
 * This is our annotation layer, in our own colour, outside the screenshot.
 */
export const PlanBar: React.FC<{
  value: number;
  limit: number;
  width: number;
  reveal: number;
  label?: string;
}> = ({value, limit, width, reveal, label}) => {
  const frac = clamp01(value / limit);
  const r = clamp01(reveal);
  return (
    <div style={{width, opacity: r}}>
      <div
        style={{
          position: 'relative',
          height: 10,
          borderRadius: 5,
          background: 'rgba(255,255,255,0.07)',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${frac * 100 * r}%`,
            borderRadius: 5,
            background: C.accent,
            boxShadow: `0 0 22px ${accentA(0.45)}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -1,
            top: -7,
            bottom: -7,
            width: 2,
            background: 'rgba(255,255,255,0.38)',
          }}
        />
      </div>
      {label ? (
        <div
          style={{
            ...T.eyebrow,
            fontSize: 17,
            marginTop: 16,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>{label}</span>
          <span style={{color: C.dim}}>{limit} gb plan</span>
        </div>
      ) : null}
    </div>
  );
};

/** A delta that arrives and attaches itself, with a little weight behind it. */
export const DeltaBadge: React.FC<{
  text: string;
  progress: number;
}> = ({text, progress}) => {
  const p = clamp01(progress);
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '10px 18px',
        borderRadius: 8,
        border: `1px solid ${accentA(0.45)}`,
        background: `${accentA(0.10)}`,
        color: C.accent,
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      {text}
    </div>
  );
};

/** A duration that moves, formatted the way the source dashboard formats it. */
export const TimeCounter: React.FC<{
  fromSec: number;
  toSec: number;
  progress: number;
  color?: string;
  size?: number;
}> = ({fromSec, toSec, progress, color = C.text, size}) => {
  const v = Math.round(lerp(fromSec, toSec, clamp01(progress)));
  const m = Math.floor(v / 60);
  const s = v % 60;
  return (
    <span style={{...T.figure, color, fontSize: size ?? T.figure.fontSize}}>
      {m}:{s.toString().padStart(2, '0')}
    </span>
  );
};

/** Indian digit grouping, the way the source dashboards write it. */
export const inr = (n: number) => {
  const v = Math.round(n).toString();
  if (v.length <= 3) return v;
  const last3 = v.slice(-3);
  const rest = v.slice(0, -3);
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
};

/** A rupee total that accumulates. Used where the figure is the sum of values
 *  the real chart plots, so the arithmetic happens on screen. */
export const MoneyCounter: React.FC<{
  value: number;
  color?: string;
  size?: number;
}> = ({value, color = C.text, size}) => (
  <span style={{...T.figure, color, fontSize: size ?? T.figure.fontSize}}>
    <span style={{fontSize: '0.62em', marginRight: '0.04em'}}>&#8377;</span>
    {inr(value)}
  </span>
);
