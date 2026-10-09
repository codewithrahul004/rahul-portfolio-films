#!/usr/bin/env bash
# Build the film: silent picture, the score, loudness-normalised, muxed with
# a stream copy so the picture is provably untouched (MD5 checked).
#
#   scripts/build.sh [green|awtm]        full build of one design (default green)
#   scripts/build.sh audio [green|awtm]  re-score and re-mux only (picture reused)
#
# Drop the song at public/audio/music.wav (or .mp3) first. Without it the
# build still completes, with sound design only, and says so.
set -euo pipefail
cd "$(dirname "$0")/.."

FF="$PWD/node_modules/ffmpeg-static/ffmpeg"
CD="$PWD/node_modules/@remotion/compositor-darwin-arm64"
export DYLD_LIBRARY_PATH="$CD"
FP="$CD/ffprobe"
MODE=""; THEME="green"
for a in "$@"; do case "$a" in audio) MODE=audio;; green|awtm) THEME="$a";; esac; done
COMP="Film"; [ "$THEME" = "awtm" ] && COMP="FilmAwtm"
OUT=out/$THEME
mkdir -p "$OUT"
echo "design: $THEME ($COMP)"

MUSIC_FILE=""
for c in audio/music.wav audio/music.mp3 audio/music.m4a; do
  if [ -f "public/$c" ]; then MUSIC_FILE="$c"; break; fi
done
if [ -n "$MUSIC_FILE" ]; then
  PROPS="{\"music\":true,\"musicFile\":\"$MUSIC_FILE\"}"
  echo "music: public/$MUSIC_FILE"
else
  PROPS='{"music":false}'
  echo "music: NOT FOUND at public/audio/music.wav, scoring sound design only"
fi

if [ "$MODE" != "audio" ] || [ ! -f "$OUT/picture.mp4" ]; then
  echo "== rendering picture"
  npx remotion render src/index.ts "$COMP" "$OUT/picture.mp4" \
    --codec h264 --crf 17 --muted --log=error \
    --color-space bt709 --x264-preset slow
fi

echo "== rendering score"
node scripts/scan-logos.js >/dev/null; npx remotion render src/index.ts FilmAudio "$OUT/score.wav" \
  --codec wav --props="$PROPS" --log=error

echo "== loudness normalising the score (two pass loudnorm, linear, -18 LUFS; then a limiter at -1.2 dBTP)"
STATS=$("$FF" -hide_banner -nostats -i "$OUT/score.wav" \
  -af loudnorm=I=-18:TP=-0.3:LRA=14:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
I=$(echo "$STATS" | node -e 'const s=JSON.parse(require("fs").readFileSync(0,"utf8"));process.stdout.write(`${s.input_i}:${s.input_tp}:${s.input_lra}:${s.input_thresh}:${s.target_offset}`)')
IFS=: read -r in_i in_tp in_lra in_th off <<< "$I"
echo "   measured: ${in_i} LUFS, ${in_tp} dBTP, LRA ${in_lra}"
if [ -n "$MUSIC_FILE" ]; then
  "$FF" -hide_banner -loglevel error -y -i "$OUT/score.wav" \
    -af "loudnorm=I=-18:TP=-0.3:LRA=14:measured_I=${in_i}:measured_TP=${in_tp}:measured_LRA=${in_lra}:measured_thresh=${in_th}:offset=${off}:linear=true:print_format=summary,alimiter=limit=0.87:attack=2:release=80:level=false" \
    -ar 48000 "$OUT/score_norm.wav"
else
  # sound design alone is sparse by design; do not pump it up to music level
  "$FF" -hide_banner -loglevel error -y -i "$OUT/score.wav" -af "alimiter=limit=0.87" -ar 48000 "$OUT/score_norm.wav"
fi

echo "== muxing with a stream copy"
"$FF" -hide_banner -loglevel error -y -i "$OUT/picture.mp4" -i "$OUT/score_norm.wav" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT/film.mp4"

echo "== picture integrity"
A=$("$FF" -hide_banner -loglevel error -i "$OUT/picture.mp4" -map 0:v:0 -c copy -f md5 - | tail -1)
B=$("$FF" -hide_banner -loglevel error -i "$OUT/film.mp4" -map 0:v:0 -c copy -f md5 - | tail -1)
echo "   picture.mp4 $A"
echo "   film.mp4    $B"
[ "$A" = "$B" ] && echo "   MD5 identical, picture untouched" || { echo "   MD5 DIFFERS"; exit 1; }

echo "== done: $OUT/film.mp4"
"$FP" -v error -select_streams v:0 -show_entries stream=width,height,nb_frames,r_frame_rate,avg_frame_rate -of default=nw=1 "$OUT/film.mp4"
