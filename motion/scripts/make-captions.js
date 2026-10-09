// Builds src/captions.ts: one caption per spoken sentence, timed from the
// recordings themselves. Sentence boundaries are placed by word count and
// snapped to the pauses measured in each clip.
const fs = require('fs');
const path = require('path');
const FPS = 30;
const OFF = {hook: 0, portfolio: 430, editLobby: 1308, ksunch: 2013, proof: 2661, pitch: 3258, close: 4427};
// placements must match VOICE in cues.ts: [clip, at, leadSec]
const PLACE = [
  [1, 12, 0.0], [2, 306, 0.1], ['3a', OFF.portfolio + 12, 0.2], ['3b', OFF.portfolio + 688 + 90, 0.0], [4, OFF.editLobby + 6, 0.4],
  [5, OFF.ksunch + 8, 0.3], [6, OFF.proof - 11, 0.25], [7, OFF.proof + 420, 0.0],
  [8, OFF.pitch + 111, 0.0], [9, OFF.close + 40, 0.65],
];
const SENT = {
  1: ['Somebody built your website, took the money,', 'and never once checked whether it made you any.', 'I do.', "Every number you're about to see is the proof."],
  2: ["Don't take my word for it."],
  '3a': ["I'm Rahul. I build websites, SaaS products,", 'and digital experiences for brands that have outgrown their template.', 'Ten real sites, different industries,', 'every one built to make an entrance,', 'in six languages when the brand needs it.'],
  '3b': ['The technology changes.', "The standard doesn't."],
  4: ['Take Edit Lobby.', 'A post-production studio with a showreel', 'that was burning through bandwidth every month.', 'Same showreel, rebuilt properly: 93% lighter,', 'a 1.7 second load, Core Web Vitals passed,', 'and the average visit went up 27%.', 'Every one of those figures sits on their own dashboard,', 'not in my pitch deck.'],
  5: ['Or KSUNCH, a fashion label', "that needed a store it didn't have to babysit.", '90% of the workload, automated:', 'orders, inventory, fulfilment, analytics.', '₹4,10,000 in the launch week.', '77,000 active users in the first thirty days.', 'Abandoned carts recovered while the team slept.'],
  6: ["Let's see what my clients have to say."],
  7: ['Upwork, Google, Instagram, WhatsApp.', 'Real people, real projects.'],
  8: ["So here's what it actually comes down to.", 'Every brand is different,', "and a template doesn't know that.", 'Your website is the one salesperson that never clocks off,', 'and 53% of mobile visitors walk out', 'if it takes more than three seconds to load.', "That's the cost,", 'and speed is the standard I build every site to.', 'Edit Lobby, measured: 1.7 seconds.', 'Your project decides the platform,', 'not the other way round.', 'Webflow, Framer, Wix, WordPress, Shopify,', 'whatever the job genuinely needs.', "I don't sell a tool.", 'I build the right thing.'],
  9: ['You bring the problem.', 'I handle the build.', "Let's build."],
};

function readWav(file) {
  const b = fs.readFileSync(file); let p = 12, fmt, data;
  while (p < b.length) { const id = b.toString('ascii', p, p + 4), sz = b.readUInt32LE(p + 4); if (id === 'fmt ') fmt = {ch: b.readUInt16LE(p + 10), sr: b.readUInt32LE(p + 12)}; if (id === 'data') { data = b.subarray(p + 8, p + 8 + sz); break; } p += 8 + sz + (sz & 1); }
  const n = data.length / 2 / fmt.ch; const x = new Float64Array(n);
  for (let i = 0; i < n; i++) x[i] = data.readInt16LE(i * fmt.ch * 2) / 32768;
  return {sr: fmt.sr, x};
}
function analyse(file) {
  const {sr, x} = readWav(file); const w = Math.round(sr * 0.025); const r = [];
  for (let s = 0; s + w <= x.length; s += w) { let q = 0; for (let i = s; i < s + w; i++) q += x[i] * x[i]; r.push(20 * Math.log10(Math.sqrt(q / w) + 1e-9)); }
  const sorted = [...r].sort((a, b) => a - b); const floor = sorted[Math.floor(sorted.length * 0.1)], peak = sorted[sorted.length - 1];
  const thr = Math.max(floor + 12, peak - 30);
  let first = r.findIndex(v => v > thr), last = r.length - 1; while (last > 0 && r[last] <= thr) last--;
  const pauses = []; let cur = 0;
  for (let i = first; i <= last; i++) { if (r[i] <= thr) cur++; else { if (cur >= 10) pauses.push({mid: (i - cur / 2) * 0.025, len: cur * 0.025}); cur = 0; } }
  return {start: first * 0.025, end: (last + 1) * 0.025, pauses};
}

const out = [];
for (const [clip, at, lead] of PLACE) {
  const a = analyse(path.join(__dirname, '..', 'public/audio/vo', `vo_${clip}.wav`));
  const sents = SENT[clip]; const words = sents.map(t => t.split(/\s+/).length); const total = words.reduce((x, y) => x + y, 0);
  const span = a.end - a.start; const bounds = [a.start];
  let acc = 0; const used = new Set();
  for (let i = 0; i < sents.length - 1; i++) {
    acc += words[i]; let t = a.start + span * acc / total;
    // snap to the nearest unused pause within 0.9 s
    let best = null;
    a.pauses.forEach((p, j) => { if (!used.has(j) && Math.abs(p.mid - t) < 0.9 && (!best || Math.abs(p.mid - t) < Math.abs(best.p.mid - t))) best = {p, j}; });
    if (best) { t = best.p.mid; used.add(best.j); }
    bounds.push(Math.max(bounds[bounds.length - 1] + 0.3, t));
  }
  bounds.push(a.end);
  for (let i = 0; i < sents.length; i++) {
    const from = at + Math.round((bounds[i] - lead) * FPS), to = at + Math.round((bounds[i + 1] - lead) * FPS) - 1;
    out.push({from, to, text: sents[i]});
  }
  console.log(`clip ${clip}: speech ${a.start.toFixed(2)}-${a.end.toFixed(2)}s, pauses ${a.pauses.map(p => p.mid.toFixed(1)).join(' ')}`);
}
const ts = `/* GENERATED by scripts/make-captions.js from the voice recordings. Do not edit by hand. */
export type Caption = {from: number; to: number; text: string};
export const CAPTIONS: Caption[] = [
${out.map(c => `  {from: ${c.from}, to: ${c.to}, text: ${JSON.stringify(c.text)}},`).join('\n')}
];
`;
fs.writeFileSync(path.join(__dirname, '..', 'src/captionData.ts'), ts);
console.log(`${out.length} captions written`);
