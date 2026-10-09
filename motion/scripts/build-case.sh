#!/usr/bin/env bash
# Build a film by composition. Default: the Edit Lobby case study.
#   FILM=cn scripts/build-case.sh   builds Cullen & Noir (CullenNoir + CullenNoirAudio): silent picture, score, loudnorm, stream-copy mux.
#   scripts/build-case.sh [green|awtm] [audio]
# Testimonial: put the client's video at public/el/testimonial.mp4 and a
# public/el/testimonial.json ({name, role, captions:[{from,to,text}]}) and
# the build picks it up, lengthening the film to fit.
set -euo pipefail
cd "$(dirname "$0")/.."
FF="$PWD/node_modules/ffmpeg-static/ffmpeg"; CD="$PWD/node_modules/@remotion/compositor-darwin-arm64"; export DYLD_LIBRARY_PATH="$CD"; FP="$CD/ffprobe"
MODE=""; THEME="green"; for a in "$@"; do case "$a" in audio) MODE=audio;; green|awtm) THEME="$a";; esac; done
COMP="CaseStudy"; [ "$THEME" = "awtm" ] && COMP="CaseStudyAwtm"; ACOMP="CaseStudyAudio"
OUT=out/case-$THEME
if [ "${FILM:-}" = "cn" ]; then COMP="CullenNoir"; ACOMP="CullenNoirAudio"; OUT=out/cn; fi
if [ "${FILM:-}" = "func" ]; then COMP="Func"; ACOMP="FuncAudio"; OUT=out/func; fi
if [ "${FILM:-}" = "ksunch" ]; then COMP="Ksunch"; ACOMP="KsunchAudio"; OUT=out/ksunch; fi
if [ "${FILM:-}" = "qc" ]; then COMP="QcLobby"; ACOMP="QcLobbyAudio"; OUT=out/qc; fi
if [ "${FILM:-}" = "vrg" ]; then COMP="VrgEv"; ACOMP="VrgEvAudio"; OUT=out/vrg; fi
mkdir -p "$OUT"
# the case study has its own track when public/audio/case-music.wav exists
# (Rahul, 8 October: the showreel audio he supplied), played from its start;
# otherwise it falls back to the profile film's song and offset.
MUSIC=""; START=""; for c in audio/case-music.wav audio/music.wav audio/music.mp3; do [ -f "public/$c" ] && { MUSIC="$c"; break; }; done
[ "$MUSIC" = "audio/case-music.wav" ] && START=",\"musicStartSec\":0"
T="null"
if [ -f public/el/testimonial.mp4 ]; then
  N=$("$FP" -v error -select_streams v:0 -show_entries stream=nb_frames -of csv=p=0 public/el/testimonial.mp4)
  META=$(cat public/el/testimonial.json 2>/dev/null || echo '{"name":"","role":"Edit Lobby","captions":[]}')
  T=$(node -e "const m=$META; m.file='el/testimonial.mp4'; m.frames=$N; console.log(JSON.stringify(m))")
  echo "testimonial: public/el/testimonial.mp4, $N frames"
else
  echo "testimonial: none supplied, the film closes after the big picture"
fi
PROPS_V="{\"theme\":\"$THEME\",\"testimonial\":$T}"
if [ -n "$MUSIC" ]; then PROPS_A="{\"music\":true,\"musicFile\":\"$MUSIC\"$START,\"testimonial\":$T}"; else PROPS_A="{\"music\":false,\"testimonial\":$T}"; fi
echo "design: $THEME  music: ${MUSIC:-none}"
if [ "$MODE" != "audio" ] || [ ! -f "$OUT/picture.mp4" ]; then
  echo "== rendering picture"
  npx remotion render src/index.ts "$COMP" "$OUT/picture.mp4" --codec h264 --crf 17 --muted --log=error --color-space bt709 --x264-preset slow --props="$PROPS_V"
fi
echo "== rendering score"
if [ "${FILM:-}" = "cn" ] || [ "${FILM:-}" = "func" ] || [ "${FILM:-}" = "ksunch" ] || [ "${FILM:-}" = "qc" ] || [ "${FILM:-}" = "vrg" ]; then PROPS_A='{"music":true}'; fi
npx remotion render src/index.ts "$ACOMP" "$OUT/score.wav" --codec wav --log=error --props="$PROPS_A"
echo "== loudness"
STATS=$("$FF" -hide_banner -nostats -i "$OUT/score.wav" -af loudnorm=I=-18:TP=-0.3:LRA=14:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
I=$(echo "$STATS" | node -e 'const s=JSON.parse(require("fs").readFileSync(0,"utf8"));process.stdout.write(`${s.input_i}:${s.input_tp}:${s.input_lra}:${s.input_thresh}:${s.target_offset}`)')
IFS=: read -r in_i in_tp in_lra in_th off <<< "$I"
"$FF" -hide_banner -loglevel error -y -i "$OUT/score.wav" -af "loudnorm=I=-18:TP=-0.3:LRA=14:measured_I=${in_i}:measured_TP=${in_tp}:measured_LRA=${in_lra}:measured_thresh=${in_th}:offset=${off}:linear=true,alimiter=limit=0.87:attack=2:release=80:level=false" -ar 48000 "$OUT/score_norm.wav"
echo "== mux"
"$FF" -hide_banner -loglevel error -y -i "$OUT/picture.mp4" -i "$OUT/score_norm.wav" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT/film.mp4"
A=$("$FF" -hide_banner -loglevel error -i "$OUT/picture.mp4" -map 0:v:0 -c copy -f md5 - | tail -1); B=$("$FF" -hide_banner -loglevel error -i "$OUT/film.mp4" -map 0:v:0 -c copy -f md5 - | tail -1)
[ "$A" = "$B" ] && echo "   MD5 identical, picture untouched" || { echo "   MD5 DIFFERS"; exit 1; }
"$FP" -v error -select_streams v:0 -show_entries stream=nb_frames,r_frame_rate -of default=nw=1 "$OUT/film.mp4"
echo "== done: $OUT/film.mp4"
