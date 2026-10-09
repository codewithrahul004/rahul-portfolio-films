import {transcribe, toCaptions} from '@remotion/install-whisper-cpp';
import fs from 'fs'; import path from 'path';
const to = path.resolve('.whisper');
const out = await transcribe({model: 'medium.en', whisperPath: to, whisperCppVersion: '1.5.5', inputPath: path.resolve('out/cn16k.wav'), tokenLevelTimestamps: true});
const {captions} = toCaptions({whisperCppOutput: out});
const lines = []; let cur = null;
for (const c of captions) { if (!cur || (cur.text + c.text).length > 44 || c.startMs - cur.endMs > 700) { if (cur) lines.push(cur); cur = {text: c.text.trim(), startMs: c.startMs, endMs: c.endMs}; } else { cur.text += c.text; cur.endMs = c.endMs; } }
if (cur) lines.push(cur);
const caps = lines.map((l) => ({from: Math.round(l.startMs / 1000 * 30), to: Math.round(l.endMs / 1000 * 30) + 6, text: l.text.trim()}));
fs.writeFileSync('public/cn/testimonial.json', JSON.stringify({name: '', role: 'Cullen & Noir', captions: caps}, null, 2) + '\n');
console.log(caps.map((c) => `${(c.from / 30).toFixed(1)}s  ${c.text}`).join('\n'));
