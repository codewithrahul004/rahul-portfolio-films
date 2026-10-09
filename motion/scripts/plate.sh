#!/usr/bin/env bash
# Composites the cut-out frames over a dark studio plate at 1920x1080 and
# keeps the original audio. Plate: near-black with a soft warm pool of light
# behind him, so he sits in the film's world rather than in a flat void.
set -euo pipefail
cd "$(dirname "$0")/.."
FF="$PWD/node_modules/ffmpeg-static/ffmpeg"
"$FF" -hide_banner -loglevel error -y \
  -f lavfi -i "color=c=0x080808:s=1920x1080:r=30" \
  -framerate 30 -i out/matte/out/f%04d.png \
  -i public/cn/testimonial.mp4 \
  -filter_complex "\
[0:v]geq=r='8+22*exp(-((X-960)^2/(2*520^2)+(Y-700)^2/(2*520^2)))':g='8+18*exp(-((X-960)^2/(2*520^2)+(Y-700)^2/(2*520^2)))':b='8+14*exp(-((X-960)^2/(2*520^2)+(Y-700)^2/(2*520^2)))'[bg];\
[1:v]scale=1664:936:flags=lanczos,format=rgba,split[fg][fga];[fga]alphaextract,boxblur=1:1[al];[fg][al]alphamerge[fgs];\
[bg][fgs]overlay=(W-w)/2:H-h:format=auto,format=yuv420p[v]" \
  -map "[v]" -map 2:a:0 -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a copy -shortest public/cn/testimonial_plate.mp4
echo "plated: public/cn/testimonial_plate.mp4"
