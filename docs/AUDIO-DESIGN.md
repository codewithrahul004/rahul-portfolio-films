# AUDIO REDESIGN — WHAT WAS BUILT, AND MY OWN REVIEW OF IT

**Audio only. The picture is byte-identical to the cut you approved**, verified
by MD5 on the video stream before and after. The score was rendered on its own
and muxed with a stream copy, so not one frame was re-encoded.

No voice. No narration. Nothing reserved for a voice.

---

## 1. THE SCENE MAP I BUILT AGAINST

You numbered the brief by content type, not by position in the cut. Translated:

| Your brief | Actual position | Source file | Frames |
|---|---|---|---|
| Scene 01 | 1st, the hook | not in repo | 0 – 228 |
| Scene 04 "website / build" | **2nd**, portfolio reel | Scene04Portfolio.tsx | 228 – 966 |
| Scene 02 "proof / metrics" | **3rd**, Edit Lobby | Scene02EditLobby.tsx | 966 – 1416 |
| Scene 03 "results" | **4th**, KSUNCH | Scene03Ksunch.tsx | 1416 – 1944 |
| Scene 05 "client proof" | 5th, proof wall | Scene05Proof.tsx | 1944 – 2436 |
| Scene 06 "Rahul / final" | 6th, pitch and close | Scene06Pitch / Scene07Close | 2436 – 3392 |

I applied your intent per content, not per number.

**Every cue is tied to a frame constant read out of those source files**, which
is what you asked for. For example 93% is scored at Scene02EditLobby's `fig93`
beat, +27.3% at its `deltaSes`, the revenue chart at Scene03Ksunch's `revStep`,
and LET'S BUILD at Scene07Close's `cta`. Nothing is a guessed timestamp. The
only clip scored by analysis rather than source is the hook, whose component is
not in this repo.

---

## 2. HOW IT IS BUILT

`src/audio/cues.ts` is the single source of truth: offsets, every cue with its
layer and a one-line reason it exists, the music arc, the duck list and the
silences. `src/audio/Layers.tsx` holds `<MusicTrack/>`, `<Whoosh/>`,
`<Impact/>`, `<TonalHit/>` (aliased `<MetricSound/>`) and `<UiSound/>`, plus a
`MIX` object so any layer can be pushed or pulled without touching a single cue.

Layers, separately controllable: **music** (four stems), **transition**,
**metric**, **ui**, **impact**, **texture**.

### Music: four stems, not one bounced track

| Stem | What it does |
|---|---|
| **sub** | the floor. A root drone with its harmonic series intact. |
| **pad** | the harmony. Dark, filtered, slow. Carries the emotional level. |
| **rhythm** | the controlled pulse plus a bass pluck on the bar. |
| **texture** | air and sparse shimmer. Scale, never melody. |

100 BPM, A minor, moving to F and once to G. Modal and static on purpose:
melody would fight typography that is already doing the talking. Everything is
synthesised, so there is no licence attached and no stock-library fingerprint.

**The arc is gain on those four stems, not a different track per scene.** That
is what makes 1:53 feel like one film. The rhythm layer is the clearest signal:
silent for the hook, in at the portfolio, strongest at KSUNCH, and **gone
entirely from frame 3120**, before Rahul appears.

Measured arc, RMS per section:

```
hook        -19.4   #######
portfolio   -19.1   ########
edit lobby  -17.2   ##############
ksunch      -15.4   ###################   <- the peak
proof wall  -16.3   ################
pitch       -18.3   ###########
close       -17.3   #############
```

### The metric hierarchy, as four tiers

| Tier | Sound | Used on |
|---|---|---|
| 1, digital tick | `DIGITAL_TICK` | the first four reviews only, with falling gain |
| 2, soft tonal hit | `TONAL_HIT` | 9.6 GB, 4:12, Rs 13,590, 46.1% |
| 3, cinematic impact | `IMPACT_MEDIUM` + tonal resolve | 93%, +27.3%, 90%, Rs 4,10,932, 77K, and the three pitch figures |
| 4, strongest, still restrained | `IMPACT_MEDIUM` + `TONAL_HIT_LOW`, louder | **1.7s**, the answer to the fear, and **LET'S BUILD** |

A number never just booms. The impact places it and a tuned tonal hit resolves
it, which is the "locks it into place" you described.

---

## 3. WHAT I REMOVED, AND WHY

You said: if removing an effect makes it cleaner, remove it. I cut **seven**
cues after the first full mix:

1. **Three section-opening whooshes** (Edit Lobby, KSUNCH, proof wall). Each
   section was closing with an air release and the next opening with a whoosh
   16 to 30 frames later. That doubling is exactly what makes sound design
   read as formulaic. The air release marks a real visual push-through, so it
   stayed; the whoosh did not.
2. **20.1 GB at Edit Lobby + 12.** Three sounds inside 0.4s at the top of the
   section. The arrival impact already marks it.
3. **1.7s at Edit Lobby + 244.** That figure is scored at tier 4 in the pitch,
   where it is the answer to the 53% fear. Sounding it earlier dulled the payoff.
4. **The impact under the wall build.** The wall assembles over 24 frames. It
   does not land, so it should not thud.
5. **The click on the twelfth review.** Seven cards pass in silence and then a
   click reintroduced the notification pattern you asked to avoid.

**Final count: 55 cues across 1:53**, most of them under -20 dB relative.

### The proof wall specifically

Twelve reviews arrive. **Four are scored**, at falling gain (0.17, 0.14, 0.115,
0.09), and then they stop. The centre card gets a tonal hit because the camera
nearly stops on it for 2.3 seconds. Everything else is carried by the rhythm
layer swelling underneath. That is what makes it read as accumulating trust
rather than as an inbox.

---

## 4. TWO REAL DEFECTS I FOUND AND FIXED

### The mix was unplayable on a laptop

Your device requirement caught this, not my ear. High-passing at 200 Hz, which
is roughly what a laptop or phone reproduces, dropped the mean level by
**14.8 dB**. Spectral analysis showed **95.8% of all energy below 120 Hz**.

The cause was a sub stem low-passed at 180 Hz, which strips every harmonic
above the second. A speaker that cannot play 55 Hz was therefore playing almost
nothing. Fixed at the source: the harmonic series is kept to 900 Hz so a small
speaker can imply the fundamental it cannot reproduce, the impacts were given a
mid-range knock at 190 and 310 Hz, and the stem balance was moved off the sub
and onto pad, rhythm and texture.

**After: 9.4 dB of loss at 200 Hz**, which is normal commercial range.

### The arc measured flat

The first mix had the hook and the portfolio at identical RMS, because the sub
swamped the layers that actually change. Rebalanced, then verified by
measurement rather than by eye.

---

## 5. MY HONEST ANSWERS TO YOUR TEN QUESTIONS

1. **Does the music feel premium?** I believe so, and for a specific reason: it
   has no melody to get tired of. The risk is that it reads as *too* plain on a
   first listen. If so, the fix is the pad stem, not more effects.
2. **Does it feel like one film?** Yes, and this is the part I am most
   confident about. Four continuous stems across all six clips is what does it.
3. **Are there too many SFX?** There were. I cut seven. I think it is right now,
   and the Edit Lobby section at one moment per 1.5s is the densest point and
   the one to check first if you disagree.
4. **Are the metric sounds subtle?** Tiers 1 and 2, yes. Tier 3 sits at roughly
   -10 dB under peak. Tier 4 is the loudest thing in the film and it should be.
5. **Do transitions have continuity?** Yes, one palette throughout, and I
   removed the doubled whooshes that made boundaries formulaic.
6. **Does scene 05 feel like accumulating trust?** This is the one I would most
   like your ear on. Four scored cards out of twelve is a deliberate bet that
   restraint reads as accumulation. If it reads as *nothing happening*, the fix
   is to extend the falling-gain ticks to cards five and six, not to score all
   twelve.
7. **Does the final scene feel different?** Yes, measurably: the rhythm layer is
   at zero from frame 3120, and the silence before Rahul sits **20 dB** below
   its surroundings.
8. **Is there enough silence?** Two of three are strong, at 20 dB and 12.9 dB.
   **The third is not, at 3.5 dB.** That is the gap before the pitch, and the
   reason is that the transition whoosh tail runs through it. I judged a hard
   hole mid-push-through to be worse than a shallow one, but you may disagree
   and it is a one-line change.
9. **Does LET'S BUILD feel satisfying?** It is the strongest hit in the film,
   preceded by a 12.9 dB drop, with a 2.6 second tail into silence. No trailer
   boom.
10. **Does anything sound like stock?** The whooshes are where that risk lives.
    They are used nine times in 1:53 and never twice at the same brightness.

---

## 6. MEASURED

| | Target | Delivered |
|---|---|---|
| Integrated loudness | -14 to -16 LUFS | **-15.7 LUFS** |
| True peak | about -1 dBTP | **-1.4 dBTP** |
| Loudness range | dynamics preserved | **6.1 LU** |
| Limiting | not excessive | engages on **0.019%** of samples, the impact transients only |
| Decoded AAC peak | no clipping | **-1.24 dB**, flat factor 0 |
| Picture | unchanged | **MD5 identical**, stream copy |
| Sync | locked | audio 113.067s, video 113.067s |

---

## 7. IF YOU WANT TO CHANGE SOMETHING

Everything lives in `src/audio/cues.ts`. The `MIX` object in `Layers.tsx`
trims a whole layer in one number. To silence every tick in the film, set
`MIX.ui = 0`. To make the pulse stronger across the whole piece, scale the
`rhythm` ramp. Each cue carries a one-line note saying why it exists, so a
later pass can judge it without reverse-engineering the intent.
