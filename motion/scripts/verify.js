// Verification on the finished render. Measures; does not judge by eye.
//   node scripts/verify.js out/film.mp4
// Picture: ffprobe facts, near-empty frames (dead windows), frozen runs.
// Audio: integrated LUFS, true peak, LRA, 200 Hz high-pass loss, limiter %.
const {execFileSync, spawnSync} = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const FF = require('ffmpeg-static');
const CD = path.join(ROOT, 'node_modules/@remotion/compositor-darwin-arm64');
const FP = path.join(CD, 'ffprobe');
const env = {...process.env, DYLD_LIBRARY_PATH: CD};
const file = process.argv[2] || path.join(ROOT, 'out/film.mp4');
const SECTIONS = [
  ['hook', 0, 320], ['portfolio', 320, 1058], ['editLobby', 1058, 1508], ['ksunch', 1508, 2036],
  ['proof', 2036, 2666], ['pitch', 2666, 3390], ['close', 3390, 3622],
];
const sectionOf = (f) => (SECTIONS.find(([, a, b]) => f >= a && f < b) || ['?'])[0];

console.log(`== ${path.relative(ROOT, file)}`);
const probe = execFileSync(FP, ['-v', 'error', '-show_entries',
  'stream=codec_type,width,height,nb_frames,r_frame_rate,avg_frame_rate,pix_fmt,color_range,color_space,sample_rate,channels',
  '-of', 'json', file], {env}).toString();
const streams = JSON.parse(probe).streams;
for (const s of streams) console.log('  ', JSON.stringify(s));
const v = streams.find((s) => s.codec_type === 'video');
if (v.r_frame_rate !== '30/1' || v.avg_frame_rate !== '30/1') console.log('   !! frame rate is not constant 30/1');

// ---- picture: 192x108 grey frames, raw
const W = 192, H = 108;
const raw = spawnSync(FF, ['-hide_banner', '-loglevel', 'error', '-i', file, '-vf', `scale=${W}:${H}`,
  '-pix_fmt', 'gray', '-f', 'rawvideo', '-'], {maxBuffer: 1 << 30}).stdout;
const n = Math.floor(raw.length / (W * H));
console.log(`== picture: ${n} frames analysed`);
const ink = new Float64Array(n), diff = new Float64Array(n), mean = new Float64Array(n);
for (let f = 0; f < n; f++) {
  const o = f * W * H;
  let lit = 0, sum = 0, d = 0;
  for (let i = 0; i < W * H; i++) {
    const p = raw[o + i];
    sum += p;
    if (p > 24) lit++;
    if (f > 0) d += Math.abs(p - raw[o - W * H + i]);
  }
  ink[f] = lit / (W * H);
  mean[f] = sum / (W * H);
  diff[f] = f > 0 ? d / (W * H) : 99;
}
const runs = (pred, min) => {
  const out = [];
  let s = -1;
  for (let f = 0; f <= n; f++) {
    const hit = f < n && pred(f);
    if (hit && s < 0) s = f;
    if (!hit && s >= 0) { if (f - s >= min) out.push([s, f - 1]); s = -1; }
  }
  return out;
};
const black = runs((f) => mean[f] < 6 && ink[f] < 0.0025, 1);
console.log(`   near-black frames (mean<6, ink<0.25%): ${black.length ? black.map(([a, b]) => `${a}-${b} (${b - a + 1}f, ${sectionOf(a)})`).join(', ') : 'none'}`);
const dead = runs((f) => ink[f] < 0.0025, 3);
console.log(`   dead windows, 3+ frames under 0.25% ink: ${dead.length ? dead.map(([a, b]) => `${a}-${b} (${b - a + 1}f, ${sectionOf(a)})`).join(', ') : 'none'}`);
const frozen = runs((f) => diff[f] < 0.08, 4);
console.log(`   frozen runs, 4+ frames with mean abs diff < 0.08/255: ${frozen.length ? frozen.map(([a, b]) => `${a}-${b} (${b - a + 1}f, ${sectionOf(a)})`).join(', ') : 'none'}`);
// the biggest cuts, as a sanity check that the joins are where they should be
const top = [...diff.keys()].filter((f) => f > 0).sort((a, b) => diff[b] - diff[a]).slice(0, 8).sort((a, b) => a - b);
console.log(`   largest frame-to-frame changes: ${top.map((f) => `${f}(${diff[f].toFixed(1)})`).join(' ')}`);

// ---- audio
const a = streams.find((s) => s.codec_type === 'audio');
if (!a) { console.log('== audio: none'); process.exit(0); }
const run = (args) => spawnSync(FF, ['-hide_banner', '-nostats', '-i', file, ...args, '-f', 'null', '-'], {maxBuffer: 1 << 28}).stderr.toString();
const ebu = run(['-filter_complex', 'ebur128=peak=true']);
const summary = ebu.slice(ebu.lastIndexOf('Summary:'));
const pick = (re) => (summary.match(re) || [])[1];
console.log('== audio');
console.log(`   integrated ${pick(/I:\s+([-\d.]+) LUFS/)} LUFS   LRA ${pick(/LRA:\s+([-\d.]+) LU/)} LU   true peak ${pick(/Peak:\s+([-\d.]+) dBFS/)} dBTP`);
const rms = (filter) => {
  const o = run(['-af', `${filter}astats=measure_overall=RMS_level:measure_perchannel=none`]);
  return parseFloat((o.match(/RMS level dB:\s*([-\d.]+)/) || [])[1]);
};
const full = rms(''), hp = rms('highpass=f=200,highpass=f=200,');
console.log(`   RMS ${full.toFixed(1)} dB, high-passed at 200 Hz ${hp.toFixed(1)} dB: loss ${(full - hp).toFixed(1)} dB (target under 10)`);
const flat = run(['-af', 'astats=measure_overall=Flat_factor+Peak_count:measure_perchannel=none']);
console.log(`   flat factor ${(flat.match(/Flat factor:\s*([-\d.]+)/) || [])[1]}, peak count ${(flat.match(/Peak count:\s*([-\d.]+)/) || [])[1]}`);
// per-section RMS, the arc
console.log('   arc, RMS per section:');
for (const [name, from, to] of SECTIONS) {
  const o = run(['-af', `atrim=start=${from / 30}:end=${to / 30},astats=measure_overall=RMS_level:measure_perchannel=none`]);
  const r = parseFloat((o.match(/RMS level dB:\s*([-\d.]+)/) || [])[1]);
  console.log(`     ${name.padEnd(10)} ${r.toFixed(1).padStart(6)}  ${'#'.repeat(Math.max(0, Math.round(r + 40)))}`);
}
