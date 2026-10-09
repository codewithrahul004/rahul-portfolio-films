# THE COMPLETE FILM — ASSEMBLY AND SOUND

**1:53. 1920x1080, constant 30fps, 3,392 frames, stereo 48kHz.**

---

## 1. THE ORDER, WHICH YOU CHANGED

Your filenames reordered the film and I built it as named. Confirmed by looking
at each clip rather than trusting the name, since uploads in this project have
been mislabelled before.

| From | Length | What it is |
|---|---|---|
| 0:00 | 7.6s | **The hook.** "Your website isn't the problem." |
| 0:07 | 24.6s | **The range.** Ten real sites, entrance animations, multilingual |
| 0:32 | 15.0s | **Edit Lobby.** 20.1 GB, 9.6 GB video, 4:12 average visit, +27.3% |
| 0:47 | 17.6s | **KSUNCH.** 90% of workload automated, ₹4,10,932, ₹13,590 recovered |
| 1:04 | 16.4s | **The proof wall.** Twelve pieces of client feedback, four platforms |
| 1:21 | 31.9s | **The pitch.** Results, the expert line, the stakes, the range, the close |

That order is better than the one it replaced. Hook, then range, then two deep
results, then social proof, then the argument. Range before depth gives the
viewer a reason to keep watching the detail.

---

## 2. A DEFECT IN THE SOURCE FILES, FIXED

The hook was encoded in **limited colour range** (`yuv420p`, tv) while the other
five were **full range** (`yuvj420p`, pc). Concatenating those as-is produces a
visible brightness and contrast step at 0:07, on the very first cut of the film.

Every clip was re-encoded through a single normalisation to limited range,
tagged bt709, so the joins are continuous. Measured after: background black
differs by 2 levels out of 255 across the first join, which is vignette shape
rather than encoding, and is below the visible threshold.

---

## 3. THE SOUND

No voiceover. No music with a melody, because a tune would fight six scenes
that each have their own rhythm. Everything was synthesised from scratch rather
than pulled from a library, so nothing carries a licence or a recognisable
stock-whoosh signature.

**The palette, six pieces:**

| Piece | What it is | Where it lands |
|---|---|---|
| **Bed** | A low drone, two partials a fifth apart, slightly detuned so they beat very slowly, with a thin layer of air above. Felt rather than heard. | Continuous. Its job is to glue six clips that were rendered separately. |
| **Air** | A wide noise swell with a moving centre frequency. Not a cartoon whoosh. | Under camera travel and before every section change. |
| **Tick** | A very short high transient, 45ms. | When type arrives. |
| **Impact** | A sub with a short pitch drop from 74Hz to 36Hz, plus a small click. | When a figure lands and when a section turns. |
| **Riser** | One only, 1.9s. | Into the call to action. |
| **Close** | The final hit, longer tail. | On LET'S BUILD. |

**Where the timings came from.** Two sources, which is what keeps it from
sounding randomly sprinkled. For the closing sequence the beat table is known
exactly, because it was built here, so every figure and line is scored on its
own frame. For the first five clips the cut was analysed for motion energy and
the peaks were classified into large moves and small reveals. Measured events
near a known beat are dropped so nothing double-triggers.

**Count:** 6 section changes, 18 camera moves, 60 type reveals, 18 closing
beats, 1 riser, 1 close. Roughly one sound every 1.1 seconds, most of them tiny.

### Verified, not assumed

- **Sync.** The audio envelope was cross-correlated against picture motion
  across the whole film. Correlation peaks at **lag 0 frames** and collapses to
  near zero by ten frames either side. The score is locked to picture and does
  not drift.
- **Level.** **-23.5 LUFS** integrated, **-3.0 dBTP** true peak. Quiet by
  design: this is sound design under a silent film, not a music track. Nothing
  clips, flat factor zero, no limiting artefacts.
- **Drift.** Video 113.067s, audio 113.066s. **1 ms** apart over 1:53.
- The loudest six moments in the whole mix are the five section changes and the
  final hit, which is exactly where the emphasis belongs.

---

## 4. ONE THING THE FULL ASSEMBLY EXPOSED

Two figures now appear twice:

| Figure | First shown | Repeated | Gap |
|---|---|---|---|
| **+27.3%** average session duration | 0:44 | 1:23 | 39s |
| **₹4.1L+** launch revenue | 0:56 | 1:25 | 29s |

In isolation the closing's results act was a recap and I defended it. In the
assembled film it is a repeat, and the viewer saw the full chart with its dated
periods only half a minute earlier.

Thirty to forty seconds is long enough that reinforcement is a defensible
reading, so I have not cut it without asking. But if you want the film tighter,
**this is now the cheapest cut in it**: removing the three result figures from
the closing takes the film from 1:53 to 1:46 and removes the only repetition in
it. What it costs: the closing opens cold on "Every brand is different" instead
of restating the proof first.

Say the word and it is a ten minute change including the re-score.

---

## 5. STILL OPEN

1. **Footage of you.** The centred closing has no room for it; the lower-left
   version that does is one instruction away and the shot spec is unchanged.
2. **Consent** from Basavaraj, Anisha, Guneet and Mustafa for the WhatsApp
   screenshots at 1:04.
3. **$10.00/hr** on the live profile. Seventh time raised, and it now sits one
   click from a 1:53 film arguing that cheap work costs clients real traffic.
4. **A destination for LET'S BUILD** if the film is used outside Upwork.
5. **Whether any of the seven platforms is aspirational.** Framer and WordPress
   have evidence inside this project; the other five rest on your word.
