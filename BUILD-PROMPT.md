# BUILD PROMPT — paste this into Claude Code

You are rebuilding a 1:53 sales film for an Upwork freelancer profile, in
Remotion + React + TypeScript. A working version exists in this folder. Your job
is to rebuild it better, not to start from nothing: the assets, the verified
facts and the constraints below were expensive to establish and must survive.

Read `docs/` before writing any code. Those documents are the decision record.

---

## 0. WHAT THIS IS

Rahul Mehndiratta, freelance web designer and developer. The film sits on his
Upwork profile, where the viewer is deciding whether to trust him with money.
1920x1080, 30fps constant, roughly 1:50 to 2:00, silent picture plus a music
and sound-design track. No voiceover anywhere.

**Running order** (the current cut, which tested well):

| | Section | Length | What it does |
|---|---|---|---|
| 1 | The hook | 7.6s | "Your website isn't the problem." |
| 2 | The range | 24.6s | Ten real sites, entrance animations, multilingual |
| 3 | Edit Lobby | 15.0s | The client's own performance report |
| 4 | KSUNCH | 17.6s | Automation and launch revenue |
| 5 | Client proof | 16.4s | Twelve real reviews across four platforms |
| 6 | The pitch and close | 31.9s | Results, the expert argument, the stakes, the range, LET'S BUILD |

Range before depth is deliberate: it gives the viewer a reason to sit through
the detail.

---

## 1. NON-NEGOTIABLE CONSTRAINTS

These are not style preferences. Breaking any one of them damages the film's
entire argument, which is that every claim in it is checkable.

1. **REAL ASSETS ONLY.** No fake dashboards, no recreated UI, no invented
   metrics, no fabricated testimonials. If an asset does not exist, do not
   fabricate it. Say so.
2. **No number goes on screen unless a source explicitly supports that exact
   claim.** Section 2 lists every number that has one. Nothing else.
3. **Do not recreate Upwork, Instagram, Google or WhatsApp interfaces.** The
   screenshots themselves are the proof. Crop them, never redraw them.
4. **Do not crop away a reviewer's identity.**
5. **No scarcity.** No limited slots, no "only 2 clients left", no countdowns.
6. **Do not present Rahul as WordPress-only.**
7. **Do not imply Edit Lobby's clients are his clients.** Their homepage line
   "Trusted by 100+ Brands" is about them, and was deliberately cropped out.
8. **Say/show alignment.** An on-screen claim must be supported by the evidence
   beside it.
9. **No em dashes** anywhere, including code comments.

---

## 2. THE VERIFIED FACTS — the only numbers permitted

Every one of these is read off a document in `motion/public/`. None is derived.

| Figure | What it is | Source |
|---|---|---|
| **93%** | less bandwidth, 287 GB to 20.1 GB monthly | Edit Lobby report hero: "Same showreel. 93% lighter." Stat block: "93.0% less bandwidth in August than July, comparing two full months." |
| **+27.3%** | average session duration, 3:18 to 4:12 | Edit Lobby report. The pill is printed on the chart. Periods are dated: before update Apr 20 to Jul 20, latest Sep 1 to 27. |
| **1.7s** | Largest Contentful Paint, Core Web Vitals passed | Edit Lobby report. TTFB 0.9s was flagged needs-improvement but TTFB is not a Core Web Vital, so "passed" is accurate. |
| **9.6 GB** | video bandwidth after rebuild, from 273.3 GB | Edit Lobby report |
| **₹4,10,932** | KSUNCH launch period revenue, shown as ₹4.1L+ | KSUNCH dashboard. The chart on screen sums to this. |
| **77K** | active users, first 30 days | KSUNCH Google Analytics |
| **90%** | of workload automated | KSUNCH brief |
| **₹13,590** | carts recovered | KSUNCH dashboard |
| **5.0** | Upwork rating, Rising Talent, 3 jobs all 5.0 | Live profile capture, 4 October |
| **53%** | of **mobile** visitors leave a page over 3 seconds | Google and SOASTA, 2017. 900,000 mobile landing pages, 126 countries. The word "mobile" is load-bearing; dropping it overstates the finding. |
| **46.1%** | assess credibility partly on visual design | Stanford Web Credibility Project, Fogg et al., 2002. It is **one factor among several**, not the only one. |

---

## 3. DECLINED — do not reintroduce any of these

| Claim | Why it is out |
|---|---|
| "100+ brands" / "100+ projects" | Nothing supports either. The profile one click away says 3 completed jobs. Rahul's own brief forbids the second almost verbatim. |
| Any project, client or brand **count** | Rahul's decision. Breadth is argued by section 2's footage, where the viewer counts for himself. |
| ~40% conversion lift | His own slide says it needs the analytics screenshot and date range before public use. |
| $5,000 launch week | No evidence attached, and ₹4.1L is about $4,900, so it is almost certainly the same money counted twice. |
| 100% Job Success Score | The live profile does not show it. Rising Talent, 5.0 (3), 4 total jobs, no JSS field. |
| 171K+ Instagram audience | His own slide calls it "a reach signal, not a result". Four clients' followers summed. |
| 26.4K Google impressions | Struck by Rahul, never reinstated. |
| "75% judge credibility by your website" | Folklore. Traced to the Stanford study it is always attributed to; no 75% figure exists there. The real number is the 46.1% above. |

---

## 4. THE MOTION SYSTEM — keep this, it was the fix for a real problem

An early build used chained springs and felt laggy. The replacement:

- **A single monotone cubic Hermite camera path** (`src/motion/Path.tsx`) with
  Fritsch-Carlson tangent limiting, so the camera cannot overshoot between
  waypoints. Repeated waypoints are holds; the camera flows through waypoints
  it is travelling past.
- **Easing: `easeOutCubic` and `easeInOutCubic` only. No springs.** A fade that
  begins from a standing hold uses the S-curve, because `easeOutCubic` starts
  at maximum velocity and that step is visible.
- **Aspect-safe rects.** `fit(key, x, y, w)` and `at(key, cx, cy, w)` build
  rects from each capture's own pixel aspect, so nothing is ever stretched.
  Images use `objectFit: 'cover'`.
- **Targets, measured on the render:** peak pan under ~80 px/frame, peak pan
  acceleration under ~9 px/frame², zero overshoot outside the key bounds on any
  axis.

### Screen recordings

Source captures are variable frame rate with stalls up to 250 ms. Normalise
every clip to CFR 30 before use, choosing per clip:

- **Index re-stamping** (`setpts=N/30/TB`) where the window is continuously
  animating. Keeps every captured frame, re-stamped at exact 1/30 intervals.
  Keep resulting speed within 0.94x to 1.04x.
- **Timestamp resampling** (`fps=30`) where the window contains a genuine
  static hold.

Never use fast-seek (`-ss` before `-i`) to find a window; it reports wrong
timestamps. Use the `trim` filter, which works on source timestamps.

---

## 5. TYPOGRAPHY AND THE LEGIBILITY RULE

**Any text that carries meaning must render at 2.5% of frame height or more in
cap height.** On a 1080-high frame that is about 27 px. Verify by measuring ink
rows on the actual render, not by looking at it on a large monitor.

This is the single most expensive lesson in the project. A version that held
five figures at once rendered its evidence lines at 12 px cap height, 1.1% of
frame height. On the player size an Upwork visitor actually uses, the numbers
read and the evidence under them did not, which is the worst possible failure
for a film whose argument is that the numbers are supported.

**The arithmetic:** at a legible label size, about two figures fit on a 1920
frame at once. More than that needs sequential beats or fewer figures.

Check every build by rendering a frame at 660 px wide and reading it.

---

## 6. AUDIO ARCHITECTURE

No voiceover. Music, sound design, silence and on-screen typography only.

### Structure

Build the score as a **separate Remotion composition** that renders audio only,
then mux onto the picture with a stream copy (`-c:v copy`). The picture is then
provably untouched; verify with an MD5 of the video stream before and after.

Layers, separately controllable: **music** (stems), **transition**, **metric**,
**ui**, **impact**, **texture**.

`src/audio/cues.ts` is the single source of truth. Every cue is tied to a frame
constant read out of the scene component that drives the picture, never a
guessed timestamp. Each cue carries a one-line note saying why it exists, so a
later pass can judge whether to cut it.

### Music

Drop the track at `motion/public/audio/music.wav` (or .mp3). See
`audio/MUSIC.md`. Control it with a gain ramp across the film rather than
cutting between tracks; that is what makes six separately rendered sections
feel like one film.

**Arc:** sparse for the hook, pulse enters with the work, strongest through
KSUNCH and the proof wall, density drops hard for the close. The rhythm layer
should be at zero before Rahul appears.

### Sound design rules, each learned the hard way

1. **No swept-noise whooshes.** White noise through a moving band-pass is the
   "feeewwww" sound. Measured, the old air release had **81.5% of its energy in
   the 2-8 kHz band**, which is where ear fatigue lives. It was rejected twice.
2. **Prefer no transition sound at all.** The version that tested best has
   transitions carried by the music and the cut, with sound only on metrics,
   type and the close. A whoosh on every transition is a YouTube-intro
   signature, not a premium one.
3. **Never let the sub dominate.** An early mix had the sub drone 16 to 18 dB
   above every other layer, which buried the music. Check: high-passing the
   finished mix at 200 Hz, roughly what a laptop or phone reproduces, should
   lose **under 10 dB**. If it loses more, the mix will sound empty on the
   devices the audience actually uses.
4. **Metric sounds need a hierarchy**, not one sound for every number. Four
   tiers: a small tick for supporting detail, a soft tonal hit for important
   figures, a deeper impact for major results, and the strongest, still
   restrained, for the single most important figure and the final card.
5. **Reviews are not notifications.** Twelve reviews arrive in section 5. Score
   about four, at falling gain, then stop. Nothing with "notification", "pop",
   "ding" or "bubble" in its name.
6. **Deliberate silence** before major metrics, before the close, and before the
   final card. Aim for 10 dB or more below the surrounding level; anything less
   does not register as silence.

### Targets

Integrated **-15 to -16 LUFS**, true peak **-1 to -1.5 dBTP**, limiting engaging
on well under 0.1% of samples. Verify with `loudnorm` and `astats`.

---

## 7. DEFECTS TO AVOID — every one of these was hit and measured

1. **Dead windows.** Frames where one element has left and the next has not
   arrived, against a flat background, so nothing changes. Found runs of 8, 12,
   13 and 22 frames. Fix by overlapping: the next element starts arriving before
   the previous has gone. Detect by counting frames with under 0.25% ink.
2. **Frozen frames.** A hold where the camera drift falls below one pixel per
   frame reads as a stall. Keep a creep of roughly 0.6 px/frame through holds.
   Title cards are the exception and may be genuinely still.
3. **Colour range mismatch.** One source clip was limited range (`yuv420p`, tv)
   while the rest were full (`yuvj420p`, pc). Concatenated as-is this produces a
   visible brightness step at the first cut. Normalise everything to one range,
   tag bt709, before concatenating.
4. **Layout reflow.** A centred flex column re-centres as children arrive, so
   text above a list visibly jumps upward as the list fills. Reserve the height.
5. **Overstatement in copy.** Three caught at the last minute: widening a
   mobile-only statistic to all traffic, turning "one factor among several" into
   "alone", and claiming "the last site I built" when ten sites are shown.
6. **Double-marked transitions.** Every section closing with one sound and the
   next opening with another, 16 to 30 frames apart, is what makes sound design
   read as formulaic. Pick one.

---

## 8. VERIFICATION — run these on every build, do not judge by eye

```
ffprobe   width, height, nb_frames, r_frame_rate == avg_frame_rate == 30/1
```

- **No black frames**, and no run of 3+ near-empty frames mid-scene.
- **Frozen-frame scan**: frame-difference below threshold, report runs.
- **Camera**: zero samples outside the key bounds on any axis; report peak pan
  and peak pan acceleration.
- **Legibility**: measure cap height of the smallest meaningful text; must be
  2.5% of frame height or more. Also render a frame at 660 px wide and read it.
- **Audio**: integrated LUFS, true peak, LRA, limiter engagement percentage,
  and the 200 Hz high-pass loss.
- **Picture integrity**: MD5 of the video stream before and after the audio mux
  must match.
- **Sync**: cross-correlate the audio envelope against picture motion; the peak
  must sit at lag 0.

---

## 9. STILL OPEN — ask Rahul, do not invent answers

1. **No footage of Rahul exists.** The close currently has none. Do not
   generate a person, use stock, or synthesise a voice. `docs/SCENE06-SHOT-SPEC.md`
   says what to shoot. There is a centred no-person version and a lower-left
   version that reserves frame right for footage; they are mutually exclusive.
2. **Client consent.** Six of the twelve proof cards are private WhatsApp
   threads with named clients. Written permission is still outstanding.
   `docs/SCENE05-PROOF-MAP.md` section 1 has the detail.
3. **The live profile shows $10.00/hr**, which contradicts a film arguing that
   cheap work costs clients real traffic.
4. **LET'S BUILD has no destination** if the film is used outside Upwork.

---

## 10. HOW TO WORK

Build scene by scene and show a render before moving on. Measure rather than
assert. When a measurement contradicts an instruction, say so and show the
number. If an asset for a claim does not exist, stop and ask rather than
approximating it.
