# Mix Ultra Lab — user flow plan

For people (and agents) changing IA, nav, Home, DJing tabs, Practice, or tutorials.

**Problem:** The writing is mostly good. Using the app is confusing. Home, DJing hub, Techniques, Same-speed, Blend, and Tutorials all look like “the mixing course.” Users need one **explicit plan** to follow — not a competing syllabus on every page.

**Rejected:** **Tonight’s path** / inferred “you are here” / Practice **Continue** from `localStorage` tutorial progress. Users do not trust the app to track what they have done, and the product may be used across devices. Step checkboxes on a *single* tutorial in one browser are a convenience only. They must not drive Home or Practice.

**Do not:** delete pages, rewrite Mix Ultra-specific teaching, add troubleshooting as a workstream, or add more peer tabs.

**Do:** sequence, group, label layers, show a static curriculum with cross-links (Full steps + drill + lab when a lab exists).

---

## Non-negotiable teaching (keep)

- Mix Ultra is MIDI-only; djay makes the sound.
- Two “cues”: CUE button vs hot-cue pads. CUE while playing usually **stops and returns**. Do not tap CUE in time on the incoming playing deck.
- Play blink while paused ≠ a cue is set.
- LOOP pads start from the **playhead now**.
- Tutorials **do not press SYNC**. Mention the button exists; coach **manual beatmatching** (tempo fader until BPM matches, jog so kicks hit together).
- **Key Lock** only holds *this song’s* notes still while you change speed. There is no pitch SYNC and no button that matches two songs’ keys.
- Voice: second person, Mix Ultra + djay, plain English.
- Genre lens (`GenreBar` / `GUIDES`) rewrites **examples**, not hardware.

---

## Three layers (label them; don’t merge the files yet)

| Layer | Job | User should think |
| --- | --- | --- |
| **DJing long page** | Why + Mix Ultra order, genre-aware | “I want to understand this.” |
| **Techniques catalog** | One-screen what / when / Mix Ultra → Full steps → drill → lab | “What’s this move called?” |
| **Tutorial** | Hands on the box, song sheet, I-did-it | “I’m practicing this now.” |
| **Lab** | Click until lights make sense | “I don’t need headphones yet.” |

Same move (e.g. long blend) may exist in all four. That is OK **if** links say Full steps vs Drill vs Lab, and hubs don’t re-list everything as a second syllabus.

Labs under **The controller** = “what is this control.” Same labs under **Practice** = “do the lab.” Don’t add a third Overview.

---

## Nav: four pillars stay

```
Home
Gear          box, headphones, djay settings
The controller   cheat sheet + control labs
DJing         craft (grouped tabs — see below)
Practice      how to follow along + labs + tutorials
```

### DJing tabs — group, don’t list 16 peers

Today `DJING_TABS` in `src/components/SectionChrome.tsx` is a flat strip. Replace with **groups**. Pages stay; the strip should not look like 16 equal courses.

1. **Hear** — Phrases, Songs, Waveform, Cues  
2. **Match** — Mix in/out, Match speed, EQ & Filter  
3. **Mix** — Techniques (index), Same speed, BPM jumps, Pick a song, The blend  
4. **Remix** — Quantize, Looping, Remix  
5. **This music** — Style page (genre bar already does the lens)

**Techniques** is the **index of moves**, not a 9th mixing how-to competing with Same speed.

On small screens: group accordion or a select, not a wrapping 16-tab row. Genre bar: keep; one line that it **changes examples, not buttons**.

### Home

- Keep the four doors.
- Show the **static spine as a plan to follow** (Sound → Hear → One deck → Match/blend → Same-speed → BPM jumps → short set → optional recipes) with links to encyclopedia pages and drills.
- Do **not** infer the next incomplete step from progress.
- Align copy with tutorials: **one-song remix is allowed before two-deck mixing** as finger practice. Don’t imply remix is only “advanced.”

### DJing hub (`DjingHubPage`)

- Short glossary can stay.
- Cards should be the **five groups**, not 16 numbered clones of Home.
- Point to Techniques for named moves, Practice for drills.

### Practice hub

- Short **how to follow along**: labs = click; tutorials = hardware; DJing = why.
- Then Labs vs Tutorials. No Continue from localStorage.
- Filters on the tutorial index: one-deck / two-deck / needs headphones.

### Controller Overview

- Too thin. Deck-shaped “first three controls” + link to cheat sheet. Don’t dump the cheat sheet twice.

---

## The spine (what the user is expected to do)

One **written** path. Encyclopedia remains in grouped tabs. Do not persist “you completed stage N.” Tutorial index order should **match this spine** (or clearly label Remix as “one deck / before blending”). Next/prev on a tutorial follows this static ordered list.

| Stage | User can do | Existing pieces |
| --- | --- | --- |
| **0 Sound** | Paired, one song in the room, headphones on incoming deck, Play blink vs CUE | Gear, `first-session`, pre-cue tutorials, CUE + hot cue labs, `mix-gain` |
| **1 Hear structure** | Beat 1, waveform landmarks, four pads | Phrases, Songs, Waveform, Cueing, `count-phrases`, `read-waveform` |
| **2 One deck** | Filter, Key Lock (not pitch SYNC), loop a hook, echo a word — **no second BPM** | Remix page + Remix tutorials + pad / filter / CUE labs |
| **3 Match + first blend** | Tempo fader + jog, one bass, channel faders, SYNC off | Beatmatch, `mix-beat-grid`, `mix-key-lock`, `mix-manual-beatmatch`, `two-deck-blend`, Blend page |
| **4 Same-speed vocabulary** | Long blend, bass swap, then echo-out or cut; mix-in/out energy | Transitions + matching Mixing tutorials |
| **5 When BPM won’t share** | Brake, walk both faders, loop-bridge; pick the next file | Jumps, Choose, `mix-brake-cut`, `mix-bpm-stretch` |
| **6 A short set** | Three files, two transitions, reset EQ, one vocal | `mix-three-song-set` + Mixing strategy as the why |
| **7 Recipes** | Optional themed nights (KPDH, Disney, kids) | Current Advanced tutorials — *after* the spine, not a fake new mechanic level |

**Start here** tutorials cover stage 0–1 sound; counting phrases stays in Basics.

---

## Content to add (not troubleshooting)

Priority for *new* writing/features, after IA:

1. **First-session wizard** — ~10 steps ending when they’ve heard PFL vs room (stage 0).
2. **Gain / loudness** — SHIFT+HIGH = Gain; don’t clip the bedroom.
3. **Beat grid** — numbers matched, kicks still walk → grid is wrong; what to do in djay (tap/adjust), not “press SYNC.”
4. **Three-song set** tutorial (stage 6).
5. Tutorial **filters**: one-deck vs two-deck vs needs headphones.

**Out of scope unless asked:** Bluetooth/no-sound troubleshooting, recording, playing out / PA.

Advanced stays **recipes** (same skills, specific songs). Don’t invent a new skill tier there until the spine exists.

---

## Implementation order (when building this format)

1. Group DJing tabs + mobile treatment; DJing hub = groups.  
2. Home: static plan (not Tonight’s path); demote 16-step list.  
3. Practice hub: how to follow along + Labs vs Tutorials.  
4. Relabel Remix vs Mixing everywhere so the expected order is obvious.  
5. Techniques as index: Full steps + matching tutorials + labs when they exist.  
6. Controller Overview denser.  
7. Cross-links, not progress persistence.  
8. New: first-session, gain, grid, three-song set.

Keep routes and redirects. Prefer regrouping over deleting `src/pages/*`.

---

## Files you’ll touch first

- `src/components/SectionChrome.tsx` — tab groups  
- `src/components/Layout.tsx` — unchanged pillars unless Home CTA needs it  
- `src/pages/HomePage.tsx`  
- `src/pages/DjingHubPage.tsx`  
- `src/pages/PracticeHubPage.tsx`  
- `src/pages/ControlsHubPage.tsx`  
- `src/pages/TutorialsPages.tsx` — static order, filters, no Done-as-truth on the index  
- `src/tutorials/data.ts` — Start here expansion, set tutorial, level labels  
- `src/djing/techniques.ts` — tutorial ids + labs  
- `src/App.css` — grouped tabs / follow-along plan  

Do not expand `DJING_TABS` with more peers.

---

## Shipped (phased rollout)

- [x] Phase 0 — Spine module (`src/spine.ts`) as a static curriculum
- [x] Phase 1 — Grouped DJing tabs + CSS
- [x] Phase 2 — Home / DJing hub / Practice consume the spine as a **plan**, not progress
- [x] Phase 3 — Tutorial index matches the spine (One deck)
- [x] Phase 4 — Controller Overview + Techniques as index
- [x] Phase 5 — Tutorial filters
- [x] Phase 6 — first-session, gain, beat grid, three-song set
- [x] Phase 7 — Start here coverage aligned with the spine
- [x] Phase 8 — Tonight’s path rejected; follow-along = explicit curriculum + cross-links
