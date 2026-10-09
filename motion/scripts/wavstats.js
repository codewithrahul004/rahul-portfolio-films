// Pure-Node WAV analysis: duration, RMS, peak, and band energy share.
// Bands via a 2048-point FFT over the whole file (Hann windows, hop 1024).
const fs = require('fs');
const path = require('path');

function readWav(file) {
  const b = fs.readFileSync(file);
  if (b.toString('ascii', 0, 4) !== 'RIFF') throw new Error('not RIFF: ' + file);
  let p = 12, fmt = null, data = null;
  while (p < b.length) {
    const id = b.toString('ascii', p, p + 4);
    const sz = b.readUInt32LE(p + 4);
    if (id === 'fmt ') fmt = {ch: b.readUInt16LE(p + 10), sr: b.readUInt32LE(p + 12), bits: b.readUInt16LE(p + 22), tag: b.readUInt16LE(p + 8)};
    if (id === 'data') { data = b.subarray(p + 8, p + 8 + sz); break; }
    p += 8 + sz + (sz & 1);
  }
  const n = data.length / (fmt.bits / 8) / fmt.ch;
  const mono = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let c = 0; c < fmt.ch; c++) {
      const idx = (i * fmt.ch + c);
      if (fmt.bits === 16) s += data.readInt16LE(idx * 2) / 32768;
      else if (fmt.bits === 24) { const v = data.readIntLE(idx * 3, 3); s += v / 8388608; }
      else if (fmt.bits === 32 && fmt.tag === 3) s += data.readFloatLE(idx * 4);
      else if (fmt.bits === 32) s += data.readInt32LE(idx * 4) / 2147483648;
    }
    mono[i] = s / fmt.ch;
  }
  return {sr: fmt.sr, ch: fmt.ch, x: mono};
}

function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let j = 0; j < len / 2; j++) {
        const ur = re[i + j], ui = im[i + j];
        const vr = re[i + j + len / 2] * cr - im[i + j + len / 2] * ci;
        const vi = re[i + j + len / 2] * ci + im[i + j + len / 2] * cr;
        re[i + j] = ur + vr; im[i + j] = ui + vi;
        re[i + j + len / 2] = ur - vr; im[i + j + len / 2] = ui - vi;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
}

function bands(x, sr) {
  const N = 2048, hop = 1024;
  const acc = {lo: 0, mid: 0, pres: 0, air: 0, tot: 0};
  const win = new Float64Array(N).map((_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N));
  for (let s = 0; s + N <= x.length; s += hop) {
    const re = new Float64Array(N), im = new Float64Array(N);
    for (let i = 0; i < N; i++) re[i] = x[s + i] * win[i];
    fft(re, im);
    for (let k = 1; k < N / 2; k++) {
      const f = k * sr / N, e = re[k] * re[k] + im[k] * im[k];
      acc.tot += e;
      if (f < 200) acc.lo += e; else if (f < 2000) acc.mid += e; else if (f < 8000) acc.pres += e; else acc.air += e;
    }
  }
  const pct = (v) => (100 * v / (acc.tot || 1)).toFixed(1).padStart(5);
  return `<200Hz ${pct(acc.lo)}%  200-2k ${pct(acc.mid)}%  2-8k ${pct(acc.pres)}%  >8k ${pct(acc.air)}%`;
}

function stats(file) {
  const {sr, x} = readWav(file);
  let sq = 0, pk = 0;
  for (const v of x) { sq += v * v; if (Math.abs(v) > pk) pk = Math.abs(v); }
  const rms = 20 * Math.log10(Math.sqrt(sq / x.length) || 1e-9);
  return {dur: x.length / sr, rms, peak: 20 * Math.log10(pk || 1e-9), bands: bands(x, sr), sr};
}

const files = process.argv.slice(2);
for (const f of files) {
  const s = stats(f);
  console.log(`${path.basename(f, '.wav').padEnd(14)} ${s.dur.toFixed(2).padStart(5)}s  rms ${s.rms.toFixed(1).padStart(6)} dB  peak ${s.peak.toFixed(1).padStart(6)} dB  ${s.bands}`);
}
