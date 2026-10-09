# SCENE 04 — SOURCE FOOTAGE TIMING INVENTORY

Built before any re-render, as instructed. Every range below was found by
inspecting the frames one by one, not estimated.

---

## FIRST, THE HONEST PART

You asked: *"If a source recording does NOT contain the complete entrance
animation, say so. Do not pretend it does."*

**There is exactly one real screen recording in this project: your own
`New_Tab.mp4` of suite004.com.** For the other four sites there was never a
recording at all. The cloud container cannot reach suite004.com,
intellactai.com, qclobby.com, editlobby.com or the SCOPLIOS host — every
request returns 000 — so no video could be recorded server side.

That is why the shipped 18.0s cut looked cut-in-the-middle. It was not a
trimming mistake. Each site only had 2 or 3 unrelated stills behind it:

| Site | What the shipped cut actually played |
|---|---|
| suite004.com | `p_suite_pre1` → `p_suite_pre2` → `p_suite`. All three are a **closed** door. The door never opened on screen. |
| qclobby.com | `p_qc_enter` → `p_qc_hero`. Two frames, 1 cut. |
| SCOPLIOS | `p_sc_pre` → `p_sc_plain`. Two frames, 1 cut. |

So the viewer was seeing stills being swapped, which is exactly what you
described.

**Two things have been fixed since.**

1. I went back into your `New_Tab.mp4` extraction and found the complete
   Suite 004 door animation is **78 frames long**. The clip that was wired
   into the film was only the last 30 of them — it started *after* the doors
   had already begun to swing. The full 78 are now extracted.
2. I captured real frame sequences off the four other live sites through the
   browser, at roughly 4 frames per second, covering the whole arc from the
   preloader through to the settled hero.

These are frame sequences, not video. 4fps is coarser than 30fps. It is real
footage of a real animation playing, but you will see it step rather than
glide. If you want true 30fps motion on those four, the only way is a screen
recording made on your machine, same as you did for Suite 004. Say the word
and I will tell you exactly what to record and for how long.

---

## SOURCE A — SUITE 004 (true 30fps, your own recording)

**Source file:** `New_Tab.mp4` → extracted to `s4vid/seq/s00000..s00749.jpg`
at 30fps, 1400x690.
**Range used: frames 48 → 125 (1.600s → 4.167s). 78 frames = 2.60s.**
**Staged as:** `en_s4_000..077.jpg`, cropped `1376x586+6+44` to drop the
recording's black band, scrollbar, mouse cursor and status box, then upscaled
to 1720x733. Nothing inside the frame was altered.

| Source frames | Time | What happens |
|---|---|---|
| 48 – 72 | 1.60s – 2.40s | **BEFORE.** The arched doorway sits closed and small. `ESTD.` and `2026` fade in at the sides. |
| 72 – 84 | 2.40s – 2.80s | **ENTRANCE STARTS.** The arch scales up and the two doors begin to swing open. |
| 84 – 102 | 2.80s – 3.40s | **ANIMATION DEVELOPS.** The arch top clears, the doors become two columns and sweep outward past the edge of frame. |
| 102 – 108 | 3.40s – 3.60s | **THROUGH THE DOOR.** Empty maroon. The nav bar fades in. |
| 108 – 120 | 3.60s – 4.00s | **WEBSITE REVEALS.** `ESTD. SUITE 004 2026 / THE FINER EDITS CONCIERGE` arrives and scales to full. |
| 120 – 125 | 4.00s – 4.17s | **HERO SETTLES.** Lockup at rest, full contrast. |

**Two frames removed.** Source frames 103 and 104 are a 67ms paint glitch:
the page flashes Edit Lobby's client work grid (FIFA x VISA, McDonald's,
Heelys) before the hero lands, then clears it again at 105. Those two slots
now hold frames 102 and 105 instead. It is a two-frame hold inside a 78-frame
animation and it is invisible at speed, and it keeps other people's brands
out of a film about your work. I swept all 78 frames afterwards to confirm
nothing photographic remains.

**Why this range.** 48 is the last point where the door is unambiguously
closed and still — anything later and the viewer joins mid-move. 125 is the
last frame before the client work grid rises into shot. Frame 126 onward
shows Edit Lobby's client reel (FIFA x VISA, McDonald's, Heelys), which must
not appear in a film about your work. That constraint sets the out point, not
taste.

**In the film:** plays 1 source frame per video frame. True speed, no ramp.

---

## SOURCE B — SCOPLIOS (burst capture, ~253ms/frame)

**Source:** live browser burst, 18 frames, 711x823 → `en_sc_000..017.jpg`.
**Range used: all 18 frames. Complete arc, nothing trimmed.**

| Seq | What happens |
|---|---|
| 000 | **BEFORE.** Near-black. Lockup and `-10%` only. |
| 001 – 011 | **ANIMATION.** Loader runs 16% → 91%. The dotted globe materialises and the flight arcs draw across it. |
| 012 | **REVEAL.** 100%. The hero crossfades in behind the still-visible loader. |
| 013 | Loader clears. |
| 014 – 017 | **SETTLES.** `People Move Possibilities`, the stat row, the language selector, all at rest. |

**Why this range.** It is the whole thing. Frame 000 is genuinely the first
paint and 017 is genuinely at rest — four identical settled frames prove it
has stopped moving.

**In the film:** 8 video frames per source frame = 266ms, marginally *slower*
than captured. Never faster. 144 frames = 4.80s.

---

## SOURCE C — QC LOBBY (burst capture, ~253ms/frame)

**Source:** 10 frames, 711x823 → `en_qc_000..009.jpg`, plus `en_qc_010.jpg`
which is the settled hero still of the same page at the same scroll position
(it registers pixel for pixel with 009).

| Seq | What happens |
|---|---|
| 000 | **BEFORE.** Blurred `S` only. |
| 001 – 004 | **ANIMATION.** Headline blur-writes in: `Ship C` → `Ship Clien` → `Ship Client-Ready Edi` → full `Ship Client-Ready Edits, Every Single Time.` |
| 005 – 009 | **DEVELOPS.** The QC error pills cascade in one at a time: SUBTITLE TYPO, CLIPPED LOGO, MISSING CTA, LOST CONTRACT, BRIEF MISSED, AD REJECTED, FILE MISSED. |
| 010 | **SETTLES.** Pills have cleared, body copy and the `Get Your 7 Days Free Trial` button are in. |

**Why this range and one caveat.** The burst ran out at 009 while pills were
still arriving. 010 is a separate capture of the same page after it settled,
so there is a short crossfade between 009 and 010 rather than captured
in-between frames. Both images are real states of the real page; no frame was
painted or invented. Flagging it because you asked me to.

**In the film:** 8 video frames per source frame. 88 frames = 2.93s.

---

## SOURCE D — INTELLACTAI (burst capture, ~253ms/frame)

**Source:** 16 frames, 457x529 → `en_in_000..015.jpg`.
**Range used: all 16. Complete arc.**

| Seq | What happens |
|---|---|
| 000 – 007 | **BEFORE / PRELOADER.** `INTELLACTAI` wordmark on black, progress line filling beneath it. |
| 008 | **ENTRANCE.** Preloader clears to black. |
| 009 | **DEVELOPS.** The work grid rises from the bottom edge. |
| 010 – 012 | **REVEAL.** The headline writes in line by line: `The quality of a` → `full production,` → `without the cost.` |
| 013 – 015 | **SETTLES.** Nav, body copy and `SEE OUR SERVICES` arrive. Three identical frames at rest. |

**Why this range.** Whole thing, start to stop. The eight preloader frames
are kept rather than trimmed, because trimming them is precisely the "viewer
sees a frame, not an animation" problem.

**In the film:** 8 video frames per source frame. 128 frames = 4.27s.

---

## SOURCE E — EDIT LOBBY (burst capture, ~253ms/frame)

**Source:** 10 frames, 457x529 → `en_el_000..009.jpg`.
**Cropped to `457x462+0+0`** to remove the client logo strip along the
bottom (Hilton, btg, A$AP Rocky, ONE/SIZE, adidas, N, alo). Those are Edit
Lobby's clients, not yours, and they must not read as yours in a film about
your work. That crop is the only change.

| Seq | What happens |
|---|---|
| 000 | **BEFORE.** Black, `10000+ Videos Delivered` only. |
| 001 – 003 | **ANIMATION.** `We edit really cool` writes in, then `videos in 48-72hrs.` |
| 004 – 006 | **DEVELOPS.** Body copy, then the `Book a call` / `See plans` buttons, then `Trusted by 100+ Brands`. |
| 007 – 009 | **SETTLES.** Three identical frames at rest. |

**Status in this cut:** Edit Lobby appears on the wall and as the closing
large panel, using its settled frame. Its entrance does not play, because
Part 1 is already carrying four complete entrances and a fifth would push
the scene past 24s. The sequence is staged and ready if you want it swapped
in — see the note at the end.

---

## HOW THE TIME IS SPENT

| # | Beat | Frames | Seconds |
|---|---|---|---|
| A | Suite 004, full door entrance, true 30fps, then holds on the settled lockup | 0 – 102 | 3.40 |
| B | Three side by side: IntellactAI, QC Lobby, SCOPLIOS — each plays its own complete entrance, staggered, each held on its settled hero | 102 – 262 | 5.33 |
| C | SCOPLIOS opens up: language selector, English → Hebrew, layout mirrors to RTL | 262 – 330 | 2.27 |
| D | The wall: 8 real projects | 330 – 432 | 3.40 |
| E | QC Lobby taken large, out of its wall card | 432 – 480 | 1.60 |
| F | Edit Lobby taken large, out of its wall card | 480 – 534 | 1.80 |
| G | THE TECHNOLOGY CHANGES. / THE STANDARD DOESN'T. | 534 – 586 | 1.73 |
| | **Total** | **586** | **19.53s** |

Entrance animations get **8.73 seconds** of the 19.53, against the 3.0–4.0
you suggested. That is deliberate: the real Suite 004 door takes 2.60s on its
own and the real SCOPLIOS loader takes 4.80s. Holding to 4.0s total would
mean cutting them again, which is the thing being fixed.

No sequence is speed-ramped. Every one plays at its captured rate or
marginally slower, and every one is held on its settled frame before the
camera leaves.

---

## OPEN QUESTION FOR YOU

Edit Lobby's entrance is captured and staged but unused. Two ways to use it,
both cost about 2.7 seconds:

1. **Swap it into Part 1** in place of QC Lobby, so the three side by side
   become IntellactAI, Edit Lobby, SCOPLIOS. QC Lobby still appears later as
   a large panel. Scene 04 stays around 19.5s.
2. **Play it at the closing large panel**, so Edit Lobby arrives from its
   wall card, reloads, and opens on screen. Scene 04 goes to about 22.2s.

Doing nothing is also fine. The film already proves the capability four times
over.
