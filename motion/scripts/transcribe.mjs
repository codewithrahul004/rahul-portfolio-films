// Transcribes the testimonial on this machine with whisper.cpp (installed
// into .whisper by @remotion/install-whisper-cpp) and writes the caption
// lines, timed, into public/el/testimonial.json. Nothing leaves the machine.
import {installWhisperCpp, downloadWhisperModel, transcribe, toCaptions} from '@remotion/install-whisper-cpp';
import fs from 'fs';
import path from 'path';
const to = path.resolve('.whisper');
await installWhisperCpp({to, version: '1.5.5'});
await downloadWhisperModel({model: 'base.en', folder: to});
const out = await transcribe({model: 'base.en', whisperPath: to, whisperCppVersion: '1.5.5', inputPath: path.resolve('out/testimonial16k.wav'), tokenLevelTimestamps: true});
const {captions} = toCaptions({whisperCppOutput: out});
// group tokens into lines of at most ~42 characters, broken at pauses
const lines = []; let cur = null;
for (const c of captions) {
  const text = c.text;
  if (!cur || (cur.text + text).length > 42 || c.startMs - cur.endMs > 700) { if (cur) lines.push(cur); cur = {text: text.trim(), startMs: c.startMs, endMs: c.endMs}; }
  else { cur.text += text; cur.endMs = c.endMs; }
}
if (cur) lines.push(cur);
const json = JSON.parse(fs.readFileSync('public/el/testimonial.json', 'utf8'));
json.captions = lines.map((l) => ({from: Math.round(l.startMs / 1000 * 30), to: Math.round(l.endMs / 1000 * 30) + 6, text: l.text.trim()}));
fs.writeFileSync('public/el/testimonial.json', JSON.stringify(json, null, 2) + '\n');
console.log(json.captions.map((c) => `${(c.from / 30).toFixed(1)}s  ${c.text}`).join('\n'));
