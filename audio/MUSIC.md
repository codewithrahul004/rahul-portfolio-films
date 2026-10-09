# MUSIC

## Where the file goes

Put your track here and nothing else needs to change:

```
motion/public/audio/music.wav     (or music.mp3)
```

The project reads it from that one path. The score controls it with a **gain
ramp across the film** rather than cutting between tracks, which is what makes
six separately rendered sections feel like one piece.

Use **WAV** if you have it. MP3 is fine but the quiet sections of this film are
genuinely quiet, so compression artefacts are more exposed here than in a
typical edit.

---

## Shaping it to the picture

The track almost certainly will not be 1:53 and will not change where the film
changes. Three things to set in `src/audio/cues.ts`:

1. **Trim offset.** Which part of the track starts at frame 0. Most songs have
   an intro you do not want; starting 15 to 30 seconds in is normal.
2. **The gain ramp.** Sparse for the hook, up as the work begins, strongest
   through KSUNCH and the client proof, then dropping hard for the close so
   the last 8 seconds have space. The rhythm should be gone before Rahul
   appears.
3. **Ducking.** The music steps back about 4 dB for roughly 0.8 seconds at each
   major metric so the figure lands, then returns. Ducking everything makes the
   mix pump; only the big ones.

If the track has an obvious drop or lift, the two places worth landing it on
are **0:07**, the first cut into the work, and **1:50**, LET'S BUILD.

---

## One practical note on the track you mentioned

A commercially released song is fine for a cut you keep on your own machine.

The thing to know is what happens when this film does the job it was built for.
It is going on a public Upwork profile, which is a commercial use, and platforms
run automated audio matching. The realistic outcomes are the video being muted,
blocked, or taken down, which is a bad surprise on the asset you are using to
win work.

The low-effort fix is to keep two renders from the same project:

- `film-local.mp4` with whatever track you like, for yourself.
- `film-public.mp4` with a licensed track, for the profile.

Because the music is a single swappable file, that is two renders, not two
builds. If you already subscribe to Artlist or Epidemic Sound, their licence
covers exactly this and you have the files already.

Not a lecture, just the practical consequence. Your call either way.

---

## Sound effects

`audio/sfx/` has the synthesised palette from the previous build. Treat it as a
placeholder. The versions that tested best used **very few** sounds, and the
best-received cut had **no transition sounds at all** with the music and the cut
carrying the changes.

If you are replacing them, the shopping list in `docs/` has search terms by
category and the timestamp each one lands on. Two rules that matter more than
which file you pick: short beats long, and low beats bright.
