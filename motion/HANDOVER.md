# HANDOVER — Rahul's portfolio films (Remotion)

One Remotion project, seven films, all built from real assets only. Read this
first, then `BUILD-PROMPT.md` and `docs/` in the parent folder for the
original rules (verified numbers only, nothing fabricated, no em dashes).

## The films and where each lives

| Film | Source | Build | Output | Status |
|---|---|---|---|---|
| Upwork profile film (2:01) | `src/Film.tsx`, scenes in `src/scenes/`, score `src/audio/` | `scripts/build.sh green` / `awtm` | `out/green/film.mp4`, `out/awtm/film.mp4` | Done. Two designs: green, AWTM orange #E08537 |
| Edit Lobby case study (1:43) | `src/case/` | `scripts/build-case.sh green` | `out/case-green/film.mp4` | Done, with Sunetra's captioned testimonial |
| Cullen & Noir (1:17) | `src/cn/CnFilm.tsx` | `FILM=cn scripts/build-case.sh` | `out/cn/film.mp4` | Done; client name + one caption line (7–14 s) unconfirmed |
| FUNC. (0:45) | `src/func/FuncFilm.tsx` | `FILM=func scripts/build-case.sh` | `out/func/film.mp4` | Done; Google search screenshot never supplied |
| KSUNCH (0:52) | `src/ksunch/KsunchFilm.tsx` | `FILM=ksunch scripts/build-case.sh` | `out/ksunch/film.mp4` | Done |
| QC Lobby (0:50) | `src/qc/QcFilm.tsx` | `FILM=qc scripts/build-case.sh` | `out/qc/film.mp4` | Done (review first, desktop + phone only) |
| VRG EV (1:04) | `src/vrg/VrgFilm.tsx` | `FILM=vrg scripts/build-case.sh` | `out/vrg/film.mp4` | Done; latest cut is website-led |

Every build renders a silent picture, renders the score separately, loudness
normalises (linear loudnorm to -18 LUFS, then a -1.2 dBTP limiter), muxes with
`-c:v copy`, and checks the video stream MD5 is unchanged. `scripts/verify.js
out/<film>/film.mp4` reports black frames, dead windows, LUFS and the 200 Hz
high-pass loss.

## Shared machinery

- `src/theme.ts`: two palettes (`green`, `awtm`), switched by `setTheme`.
- `src/case/pieces.tsx`: Grain, Phone, Window, Evidence, typography used by the case films.
- `src/audio/Layers.tsx`: `MIX` (layer trims), speech ducking, the voice slot (`VOICE` in `cues.ts`, empty now).
- `src/stretch.tsx`: `HOLDS` to hold a scene at rest points (all empty now; used once for a voiceover).
- `public/audio/sfx/`: the palette. Transitions use only SWEEP_DARK, SWEEP_SOFT, SWELL_IN, RISER, HIT_SECTION (synthesised by `scripts/synth-sfx.js`); never AIR_RELEASE or WHOOSH_* (bright, rejected).
- Site captures: `scripts/capture-site.js` (CAP_URL, CAP_OUT, arg desktop|mobile|tablet), `scripts/capture-func.js`, `scripts/capture-ksunch.js` + `capture-ksunch-cart.js`, `scripts/capture-vrg-site.js` (wheel-driven "scroll to advance" deck). All run headless Chromium from `node_modules/.remotion` via puppeteer-core.
- VRG EV: `scripts/vrg-crop.js` cuts the dark and light phones out of each design board in `public/vrg/all` into `public/vrg/dark|light`.
- Transcription: `scripts/transcribe.mjs`, `scripts/transcribe-cn.mjs` (whisper.cpp in `.whisper/`, models base/small/medium.en).
- Matting (unused in the final cut): `scripts/matte.mjs` + `scripts/plate.sh`.
- The bundled Remotion ffprobe needs `DYLD_LIBRARY_PATH` = its own folder on macOS; `ffmpeg-static` is the full ffmpeg for filters.

## Music per film (file in `public/audio/`, start offset in each film's source)

profile: `music.wav` (Freedom, start 20.3 s) · Edit Lobby: `case-music.wav` (start 0) · Cullen & Noir: `cn-music.wav` (Outline, 24 s) · FUNC: `func-music.wav` (Separate, 110 s) · KSUNCH: `ksunch-music.wav` (Papaoutai instr., 56 s) · QC Lobby: `qc-music.wav` (Everything, 49 s) · VRG EV: `vrg-music.wav` (Now We Are Free, 82 s).
The wavs are regenerated from the originals in `handover-inputs/music/` with `ffmpeg -i in.mp3 -ar 48000 -ac 2 out.wav`.

## Regenerating the large captures (not in git)

Frame sequences (`*_scroll`, `*_enter`, `*_seq`) are regenerable from the live sites:
```
CAP_OUT=el CAP_URL=https://editlobby.com/ node scripts/capture-site.js desktop && ... mobile
CAP_OUT=cn/home CAP_URL=https://cullennoir.com/ node scripts/capture-site.js desktop   (also ashes, sales; mobile)
node scripts/capture-func.js desktop && node scripts/capture-func.js mobile
node scripts/capture-ksunch.js desktop && mobile && node scripts/capture-ksunch-cart.js
CAP_OUT=qc CAP_URL=https://qclobby.com/ node scripts/capture-site.js desktop|mobile
node scripts/capture-vrg-site.js
```
Supplied inputs that cannot be regenerated are in the `handover-inputs` release asset (music originals, screen recordings, testimonial videos, VRG EV design boards, dashboard screenshot, WhatsApp proofs).

## Open items the client still owes

- Cullen & Noir testimonial: the client's name (transcript hears "Christian") and the words at 7–14 s.
- FUNC: the Google search screenshot ("FUNC. | soft drink with benefits").
- QC Lobby: real app footage behind the login, if wanted.
- Edit Lobby: optional voiceover (slot exists), consent for WhatsApp screenshots in the profile film.
- Profile film: client logo files for the "Backed by" beat (`public/logos/<slug>.svg|png`); real footage of Rahul for the close.
