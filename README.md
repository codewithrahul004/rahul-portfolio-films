# RAHUL FILM — rebuild bundle

Everything needed to rebuild the 1:53 Upwork profile film in Claude Code.

## Start here

1. Unzip somewhere sensible.
2. Open the folder in Claude Code.
3. Paste **`BUILD-PROMPT.md`** as your first message, or say:
   *"Read BUILD-PROMPT.md and docs/, then rebuild this film."*
4. Drop your music at `motion/public/audio/music.wav` first. See `audio/MUSIC.md`.

```
cd motion
npm install
npx remotion studio          # preview
npx remotion render src/index.ts <CompositionId> out/x.mp4
```

---

## What is in here

```
BUILD-PROMPT.md     the brief. Constraints, verified facts, motion system,
                    audio architecture, defects to avoid, verification steps.
                    This is the important file.

docs/               the decision record. Why each number is in or out, where
                    every screenshot came from, what the client consent gap is,
                    what to shoot for the closing scene. Read before coding.

motion/src/         the Remotion source.
  scenes/           one component per section
  motion/           the camera path, easing, backdrop
  audio/            cues.ts (the cue sheet) and Layers.tsx (the components)
  theme.ts          colours and type. Scenes never hard-code either.

motion/public/      every visual asset. 247 files.
  v/                normalised website screen recordings, CFR 30
  pf/               the twelve client proof screenshots
  up/               live Upwork profile captures, 4 October
  e*.jpg            the Edit Lobby performance report
  k*.jpg            KSUNCH dashboards and analytics
  p_*.jpg, s4_*.jpg portfolio stills and entrance-animation frames

audio/
  MUSIC.md          where to drop the track and how to shape it
  sfx/              the synthesised sound palette. Placeholder; see MUSIC.md.
```

**Not included:** `node_modules`, previous renders, and the generated music
stems from the old build, which your own track replaces. The approved reference
cut is the MP4 already in your chat.

---

## The three things most worth knowing

**1. Every number on screen has a source, and the list is closed.**
Section 2 of the build prompt is the whole permitted set. Section 3 is what was
declined and why. Both took real work to establish; a rebuild that reintroduces
"100+ projects" undoes the film's entire argument.

**2. Text must render at 2.5% of frame height or more.**
A previous version failed this and the evidence lines under the figures were
unreadable at the size an Upwork visitor actually watches. Measure it on the
render. Do not judge it on a large monitor.

**3. The best-received audio had no transition sounds at all.**
Two attempts at a better whoosh were both rejected. The version that worked
lets the music and the cut carry the changes, with sound only on the metrics,
the type and the close. Start there before adding anything.

---

## Still open

Four things the rebuild cannot resolve on its own, listed in section 9 of the
build prompt: no footage of Rahul exists, client consent for the WhatsApp
screenshots is outstanding, the live profile rate contradicts the film's own
argument, and the closing call to action has no destination outside Upwork.
