// Synthesises a replacement transition palette, 48 kHz stereo WAV.
// Design rules from the brief: short beats long, low beats bright, no
// swept white noise through a band-pass. Everything here is pink noise
// low-passed under 1.2 kHz with slow filter motion, plus sub weight, so
// the energy sits where a laptop still reproduces it but nothing hisses.
const fs = require('fs');
const path = require('path');
const SR = 48000;
const OUT = path.join(__dirname, '..', 'public', 'audio', 'sfx');

const write = (name, L, R) => {
  const n = L.length;
  const b = Buffer.alloc(44 + n * 4);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 4, 4); b.write('WAVE', 8);
  b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(n * 4, 40);
  let pk = 0;
  for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
  const g = 0.89 / (pk || 1);
  for (let i = 0; i < n; i++) {
    b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
    b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(path.join(OUT, name + '.wav'), b);
  console.log('wrote', name, (n / SR).toFixed(2) + 's');
};

// pink noise, Paul Kellet's filter
const pink = (n, seed = 1) => {
  let s = seed; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 * 2 - 1; };
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const w = rnd();
    b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.96900 * b2 + w * 0.1538520; b3 = 0.86650 * b3 + w * 0.3104856;
    b4 = 0.55000 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.0168980;
    out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  return out;
};

// time-varying one-pole low-pass, cutoff as a function of t (0..1)
const lowpassSweep = (x, fc) => {
  const y = new Float64Array(x.length);
  let z = 0;
  for (let i = 0; i < x.length; i++) {
    const a = 1 - Math.exp(-2 * Math.PI * fc(i / x.length) / SR);
    z += a * (x[i] - z);
    y[i] = z;
  }
  return y;
};
const lowpass2 = (x, fc) => lowpassSweep(lowpassSweep(x, fc), fc);
const highpass = (x, f) => {
  const y = new Float64Array(x.length);
  const a = Math.exp(-2 * Math.PI * f / SR);
  let z = 0, prev = 0;
  for (let i = 0; i < x.length; i++) { z = a * (z + x[i] - prev); prev = x[i]; y[i] = z; }
  return y;
};
const env = (n, shape) => { const e = new Float64Array(n); for (let i = 0; i < n; i++) e[i] = shape(i / n); return e; };
const mul = (a, b) => a.map((v, i) => v * b[i]);
const add = (a, b, g = 1) => a.map((v, i) => v + (b[i] || 0) * g);
const sat = (x, k = 1.4) => x.map((v) => Math.tanh(v * k) / Math.tanh(k));
const sine = (n, f0, f1, decay) => { const o = new Float64Array(n); let ph = 0; for (let i = 0; i < n; i++) { const t = i / n; const f = f0 + (f1 - f0) * (1 - Math.exp(-4 * t)); ph += 2 * Math.PI * f / SR; o[i] = Math.sin(ph) * Math.exp(-decay * t); } return o; };
const widen = (x, ms = 9) => { const d = Math.round(SR * ms / 1000); const R = new Float64Array(x.length); for (let i = 0; i < x.length; i++) R[i] = 0.7 * x[i] + 0.3 * (x[i - d] || 0); return [x.map((v) => 0.7 * v + 0.3 * (x[i => i] || 0)), R]; };
const stereo = (x, ms = 9) => { const d = Math.round(SR * ms / 1000); const L = new Float64Array(x.length), R = new Float64Array(x.length); for (let i = 0; i < x.length; i++) { L[i] = 0.75 * x[i] + 0.25 * (x[i + d] || 0); R[i] = 0.75 * x[i] + 0.25 * (x[i - d] || 0); } return [L, R]; };

// 1. SWEEP_DARK: 0.55s. The section change. Noise under a low-pass that
//    rises 120 -> 900 Hz and falls back, so it reads as air moving in a
//    room rather than a hiss. A soft sub knock lands at 70% where the cut is.
{
  const n = Math.round(SR * 0.55);
  let x = pink(n, 7);
  x = lowpass2(x, (t) => 120 + 780 * Math.sin(Math.PI * Math.min(1, t / 0.75)) ** 1.5);
  x = highpass(x, 60);
  x = mul(x, env(n, (t) => Math.sin(Math.PI * Math.min(1, t / 0.72)) ** 1.2 * (t < 0.72 ? 1 : Math.exp(-14 * (t - 0.72)))));
  const knock = sine(n, 92, 44, 9).map((v, i) => (i / n > 0.68 ? v : 0));
  const kn = new Float64Array(n); for (let i = 0; i < n; i++) { const j = i - Math.round(0.68 * n); kn[i] = j >= 0 ? Math.sin(2 * Math.PI * (88 - 44 * (1 - Math.exp(-6 * j / (0.32 * n)))) * j / SR) * Math.exp(-11 * j / (0.32 * n)) : 0; }
  x = add(sat(x, 1.6), kn, 0.55);
  const [L, R] = stereo(x, 11);
  write('SWEEP_DARK', L, R);
}

// 2. SWEEP_SOFT: 0.38s. For things that move inside a section: the row of
//    entrances, the wall, a card leaving. Quieter, lower, no knock.
{
  const n = Math.round(SR * 0.38);
  let x = pink(n, 21);
  x = lowpass2(x, (t) => 160 + 520 * Math.sin(Math.PI * t) ** 1.3);
  x = highpass(x, 70);
  x = mul(x, env(n, (t) => Math.sin(Math.PI * t) ** 1.6));
  const [L, R] = stereo(sat(x, 1.3), 8);
  write('SWEEP_SOFT', L, R);
}

// 3. SWELL_IN: 1.2s. A slow rise that ends on the cut, for the push-throughs
//    out of a statement into the next section. Reverse envelope, low only.
{
  const n = Math.round(SR * 1.2);
  let x = pink(n, 33);
  x = lowpass2(x, (t) => 90 + 700 * t ** 2.2);
  x = highpass(x, 55);
  x = mul(x, env(n, (t) => (t < 0.9 ? (t / 0.9) ** 2.4 : Math.exp(-40 * (t - 0.9)))));
  const tone = new Float64Array(n); let ph = 0; for (let i = 0; i < n; i++) { const t = i / n; ph += 2 * Math.PI * (55 + 20 * t) / SR; tone[i] = Math.sin(ph) * (t < 0.9 ? (t / 0.9) ** 3 : Math.exp(-30 * (t - 0.9))); }
  x = add(sat(x, 1.5), tone, 0.35);
  const [L, R] = stereo(x, 12);
  write('SWELL_IN', L, R);
}

// 4. RISER: 1.9s. One only in the film, into LET'S BUILD. Same recipe as the
//    swell but longer, with a slow pitch climb in the tone, and it stops dead
//    so the hit that follows owns the moment.
{
  const n = Math.round(SR * 1.9);
  let x = pink(n, 45);
  x = lowpass2(x, (t) => 80 + 1100 * t ** 2.6);
  x = highpass(x, 50);
  x = mul(x, env(n, (t) => (t < 0.97 ? (t / 0.97) ** 2.8 : 0)));
  const tone = new Float64Array(n); let ph = 0; for (let i = 0; i < n; i++) { const t = i / n; ph += 2 * Math.PI * (48 * Math.pow(2, t * 1.0)) / SR; tone[i] = (Math.sin(ph) + 0.3 * Math.sin(2 * ph)) * (t < 0.97 ? (t / 0.97) ** 3 : 0); }
  x = add(sat(x, 1.5), tone, 0.4);
  const [L, R] = stereo(x, 14);
  write('RISER', L, R);
}

// 5. HIT_SECTION: 0.9s. The landing. A sub drop 80 -> 40 Hz with a short
//    mid-range knock at 190 and 310 Hz so it still exists on a phone.
{
  const n = Math.round(SR * 0.9);
  const sub = sine(n, 82, 40, 7);
  const k1 = sine(n, 190, 190, 38), k2 = sine(n, 310, 310, 52);
  let click = pink(n, 9); click = lowpass2(click, () => 1400); click = mul(click, env(n, (t) => Math.exp(-120 * t)));
  const x = add(add(add(sub, k1, 0.28), k2, 0.16), click, 0.5);
  const [L, R] = stereo(sat(x, 1.2), 4);
  write('HIT_SECTION', L, R);
}
