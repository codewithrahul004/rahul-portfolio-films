// Finds the dark phone and the light phone on each VRG EV design board and
// crops them out at full resolution. Pixels only; nothing is redrawn.
const {spawnSync} = require('child_process');
const fs = require('fs'), path = require('path');
const FF = require('ffmpeg-static');
const DIR = 'public/vrg/all';
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.png')).sort();
const S = 4; // analysis scale
const report = [];
const dims = (f) => { const o = spawnSync(FF, ['-i', f], {encoding: 'utf8'}).stderr; const m = o.match(/, (\d+)x(\d+)[, ]/); return [+m[1], +m[2]]; };
for (const f of files) {
  const src = path.join(DIR, f);
  const [W0, H0] = dims(src);
  const W = Math.floor(W0 / S), H = Math.floor(H0 / S);
  const raw = spawnSync(FF, ['-hide_banner', '-loglevel', 'error', '-i', src, '-vf', `scale=${W}:${H}`, '-pix_fmt', 'gray', '-f', 'rawvideo', '-'], {maxBuffer: 1 << 28}).stdout;
  const comps = (pred) => {
    const seen = new Uint8Array(W * H); const out = [];
    for (let i = 0; i < W * H; i++) {
      if (seen[i] || !pred(raw[i])) continue;
      const st = [i]; seen[i] = 1; let minx = W, maxx = 0, miny = H, maxy = 0, n = 0;
      while (st.length) { const p = st.pop(); n++; const x = p % W, y = (p / W) | 0; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
        for (const q of [p - 1, p + 1, p - W, p + W]) { if (q < 0 || q >= W * H) continue; if ((q % W) - x > 1 || x - (q % W) > 1) continue; if (!seen[q] && pred(raw[q])) { seen[q] = 1; st.push(q); } } }
      const w = maxx - minx + 1, h = maxy - miny + 1;
      if (h > H * 0.35 && w / h > 0.36 && w / h < 0.62 && n > w * h * 0.6) out.push({x: minx, y: miny, w, h, n});
    }
    return out.sort((a, b) => b.h - a.h);
  };
  const darks = comps((v) => v < 34);
  const lights = comps((v) => v > 215);
  const pick = (arr) => arr[0];
  const d = pick(darks), l = pick(lights);
  const crop = (b, out, pad) => { const x = Math.max(0, (b.x - pad) * S), y = Math.max(0, (b.y - pad) * S), w = Math.min(W0 - x, (b.w + pad * 2) * S), h = Math.min(H0 - y, (b.h + pad * 2) * S);
    spawnSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-vf', `crop=${w}:${h}:${x}:${y}`, out]); return `${w}x${h}`; };
  const base = f.replace('.png', '');
  const dd = d ? crop(d, `public/vrg/dark/${base}.png`, 1) : null;
  const ll = l ? crop(l, `public/vrg/light/${base}.png`, 4) : null;
  report.push(`${base}\t${W0}x${H0}\tdark ${dd || '-'}\tlight ${ll || '-'}`);
}
fs.writeFileSync('public/vrg/crops.txt', report.join('\n') + '\n');
console.log(report.filter((r) => !r.includes('dark -')).length, 'dark;', report.filter((r) => !r.includes('light -')).length, 'light; of', files.length);
