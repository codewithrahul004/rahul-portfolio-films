// Cuts the client out of each frame of the testimonial (ISNet segmentation,
// runs locally) and writes PNGs with alpha. Only the frames; the words and
// the picture of him are untouched.
import {removeBackground} from '@imgly/background-removal-node';
import fs from 'fs'; import path from 'path';
const IN = 'out/matte/in', OUT = 'out/matte/out';
const files = fs.readdirSync(IN).filter((f) => f.endsWith('.png')).sort();
const only = process.argv[2] === 'reverse' ? files.slice().reverse() : process.argv[2] ? files.slice(0, +process.argv[2]) : files;
let i = 0;
for (const f of only) {
  const dst = path.join(OUT, f);
  if (fs.existsSync(dst)) { i++; continue; }
  const blob = await removeBackground(path.resolve(IN, f), {model: 'medium', output: {format: 'image/png', quality: 1}});
  fs.writeFileSync(dst, Buffer.from(await blob.arrayBuffer()));
  i++; if (i % 50 === 0) console.log(i, '/', only.length);
}
console.log('done', i);
