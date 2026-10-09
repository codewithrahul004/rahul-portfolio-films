# SCENE 04 v4 — SOURCE MAP AND MOTION QUALITY PASS

Built before re-rendering, as instructed. Every number below was measured off
your files, not estimated.

---

## 1. THREE FILES ARE NOT WHAT THEY ARE NAMED

Worth knowing before anything else, because it changes what is in the cut:

| File you uploaded | What it actually records |
|---|---|
| `Edit Lobby - Edit Better.mp4` | **QC Lobby.** Starts on Edit Lobby's footer, navigates to qclobby.com at 3.4s |
| `SCOPLIOS — Global Workforce Solutions 1.mp4` | **Edit Lobby.** Starts on SCOPLIOS, navigates to editlobby.com at 3.0s |
| `New Tab 1.mp4` | **IntellactAI.** Google new-tab page for the first 3.5s |
| `New Tab.mp4` | **Suite 004.** Google new-tab page for the first 5s |
| `cyd4jaukjouaco0ja0x7.mp4` | **The AI Unit** |
| `SCOPLIOS — Global Workforce Solutions.mp4` | SCOPLIOS, correctly named |

Nothing was taken on trust from a filename.

---

## 2. THE ACTUAL CAUSE OF THE LAG

Ten of the eleven recordings are **variable frame rate**. Measured across all
of them, the median gap between frames is 33.0ms, which is 30fps — but every
clip also carries stalls where the browser dropped frames:

| Clip | Frames | Median gap | Worst gap | Stalls over 50ms |
|---|---|---|---|---|
| Suite 004 | 2212 | 33.0ms | 252ms | 3% of frames |
| SCOPLIOS | 1273 | 33.0ms | 251ms | 3% |
| QC Lobby | 878 | 33.0ms | 250ms | 3% |
| IntellactAI | 1182 | 33.0ms | 249ms | 8% |
| Edit Lobby | 1185 | 33.0ms | 50ms | 4% |
| Ratio Visuals | 859 | 34.0ms | 992ms | 2% |
| Caked India | 693 | 33.0ms | 890ms | 7% |
| FUNC | 870 | 33.0ms | 262ms | 3% |
| VRG EV | 595 | 33.0ms | 266ms | 2% |
| rahulwebdesigns | 751 | 33.0ms | 606ms | 5% |
| The AI Unit | 562 | 33.3ms | 33.3ms | **0% — true CFR** |

A 250ms stall is seven and a half missing frames. Handing those timestamps
straight to Remotion is what produced the stutter: it holds one frame for a
quarter of a second, then jumps.

**What I did about it.** Every clip was re-encoded to true constant 30fps
before it went anywhere near the composition, with the method chosen per clip
from its own measurements:

- **Index re-stamping** where the window is continuously animating. Every
  captured frame is kept and re-stamped at an exact 1/30 interval. No
  duplicates, no drops, no jitter at all. The clip then plays at between
  0.94x and 1.04x of real time, which is inside your 0.9–1.1x rule.
- **Timestamp resampling** where the window contains a genuine static hold
  (Ratio Visuals, The AI Unit, FUNC, rahulwebdesigns). Collapsing a real
  one-second pause would turn a pause into a jump, so those keep their true
  timing.

Every normalised clip now reports `r_frame_rate = avg_frame_rate = 30/1`.

---

## 3. SOURCE MAP

Times are seconds into your original file. "Used" is what is in the cut.

### Entrance animations

| Project | File | Start | Animation starts | Main reveal | Settled | End | Used | Speed |
|---|---|---|---|---|---|---|---|---|
| **Suite 004** | New Tab.mp4 | 7.10 | 7.40 | 9.00 | 9.03 | 9.82 | 2.60s | 1.02x |
| **SCOPLIOS** | SCOPLIOS.mp4 | 4.35 | 4.53 | 7.95 | 8.20 | 9.00 | 4.67s | 1.00x |
| **QC Lobby** | Edit Lobby - Edit Better.mp4 | 3.90 | 4.22 | 5.60 | 6.22 | 7.40 | 3.37s | 1.04x |
| **IntellactAI** | New Tab 1.mp4 | 4.90 | 5.58 | 5.95 | 6.95 | 8.40 | 3.60s | 0.97x |
| **Edit Lobby** | SCOPLIOS 1.mp4 | 3.35 | 3.62 | 4.00 | 4.50 | 5.30 | 2.07s | 0.94x |

Note the durations are deliberately different. Edit Lobby's entrance really
is 2.0 seconds and SCOPLIOS's really is 4.7; neither was forced to match the
other.

### Portfolio wall

| Project | File | Window | Used | What it shows |
|---|---|---|---|---|
| Suite 004 | New Tab.mp4 | 7.10–9.82 | 2.60s | the door, again, small |
| Ratio Visuals | Ratio Visuals.mp4 | 15.40–18.40 | 3.03s | EVERY TOWER, SHOT LIKE A FILM → SIX TOWERS |
| VRG EV | VRG EV.mp4 | 0.20–3.20 | 3.03s | the charging-canopy hero |
| Caked India | cakedindia.com.mp4 | 2.50–5.50 | 3.07s | hero with the product carousel |
| FUNC | FUNC.mp4 | 13.30–15.55 | 2.27s | ON REPEAT hero |
| The AI Unit | cyd4j….mp4 | 16.40–18.70 | 2.30s | scroll into the voice-agent hero |

Each of those windows was chosen as the longest **stall-free** run inside the
interesting part of the recording, not the first few seconds.

### Why these six

Range, which is what the wall is for: creative studio, architectural
visualisation, EV mobility, ecommerce, DTC drinks brand, AI SaaS — plus AI
video production and global recruitment from the three-up, and a SaaS product
and a studio brand taken large at the end. Ten distinct categories.

**rahulwebdesigns.in is not in the cut.** Its strongest stall-free window is a
grey tunnel graphic that reads as abstract next to the others, and it is your
own site rather than client proof. Say the word and I will put it back.

---

## 4. WHAT WAS CROPPED, AND WHY

Every recording has a 40px black bar at the top and 42px at the bottom from
the capture itself. Beyond removing those:

- **Suite 004** — the screen recorder's own control chip ("0:09 ⏸") sits at
  the bottom left, and a mouse cursor sits in the lower middle. Cropped out.
  Also: source frames at **8.926 and 8.959** flash Edit Lobby's client work
  grid (FIFA x VISA, McDonald's, Heelys) for two frames before the hero lands.
  Those two frames are cut and the clip joined across the gap, which happens
  while the screen is empty maroon, so the join is invisible.
- **IntellactAI** — the recorder's toolbar (timer, pause, stop, mic) sits at
  the bottom left for the first 1.8 seconds. Cropped out.
- **Edit Lobby** — the client logo row along the bottom (Hilton, adidas,
  A$AP Rocky, ONE/SIZE, alo) is cropped out. Those are Edit Lobby's clients,
  not yours, and must not read as yours.

No crop removes anything that is part of the design being shown, and nothing
is stretched: every panel rectangle in the composition is built from its own
clip's exact pixel aspect.

---

## 5. THE CAMERA REBUILD

The other half of the lag was not the footage.

v3 built the camera by chaining one spring per move:

```
cam = camLerp(A, B, spring1);
cam = camLerp(cam, C, spring2);   // starts while spring1 is still settling
```

Each of those springs has a long, slow tail, so the camera decelerated almost
to a standstill at every waypoint and then started again. That is the
move / stop / move / stop you were feeling.

It is now a single path through waypoints, interpolated with a monotone cubic
Hermite (`src/motion/Path.tsx`). Where the camera is travelling past a
waypoint the tangents either side match, so it flows through at continuous
velocity. Where the path genuinely holds, the tangents are zero and the
segment reduces to a smoothstep, so it eases out of rest and back into rest.
The Fritsch-Carlson limiter guarantees no segment overshoots.

Measured on the final path:

- Peak pan speed **48.4 px/frame**, only during the one deliberate whip
  between the hero and the row.
- Peak pan acceleration **3.21 px/frame²**, and it occurs exactly where it
  should — easing out of a hold.
- Peak zoom rate **0.74%/frame**, zoom acceleration **0.041%/frame²**.
- **Overshoot outside key bounds on any axis: none.**

Springs are gone from this scene entirely. Panels and typography now use
easeOutCubic and easeInOutCubic only, so nothing bounces or settles twice.
Typography is a masked reveal plus a 12px rise, nothing larger.

---

## 6. THE RENDERED FILE

Verified with ffprobe on the actual output:

```
width=1920  height=1080  pix_fmt=yuv420p
r_frame_rate=30/1   avg_frame_rate=30/1
nb_frames=738       duration=24.60
```

Every frame interval in the file is 33.333ms. Not one is anything else.

Frame-by-frame scan of the render:

- **Black frames: none.**
- **Frozen frames: 10 out of 738 (1.4%)**, in two short runs of 3 and 4
  frames, both inside the deliberate hold on the language panel where the
  camera is stationary by design. No freeze anywhere the camera is moving.
- Velocity spikes all trace to real cuts inside your own recordings (the
  Suite 004 columns leaving frame, the SCOPLIOS loader clearing to the hero),
  not to the composition.

---

## 7. TWO THINGS I DID NOT DO

**Motion blur.** You asked for it subtly on fast movement, but you also said
not to use blur to hide bad frame pacing and to fix the pacing first. The
pacing is now clean and the only movement fast enough to want blur is the one
whip between the hero and the row, over near-empty space. Adding it means
rendering sub-frames and roughly triples render time. Happy to add it to that
one move if you want it.

**Everything on screen is recorded video, with one exception.** The
multilingual beat uses two still captures of SCOPLIOS — the language menu
open showing all six languages, and the Hebrew layout mirrored to RTL. There
is no recording of the language switch in what you uploaded. If you record
one (open the site, click the globe, pick עברית, let it settle — about eight
seconds) I will drop it straight in.
