# The Pipeline

The Hyperframes pipeline is a 7-step process for producing videos from any source material. Each step produces a named artifact that feeds the next.

## Steps

### 1. Capture
Extract assets, screenshots, and design tokens from the source (URL, document, codebase).

**Artifacts**: screenshots, font files, color tokens, logos

```bash
npx hyperframes capture https://example.com --output ./assets/
```

### 2. Design
Create `DESIGN.md` with brand colors, typography specs, spacing, and component patterns.

**Artifacts**: `DESIGN.md`

### 3. Script
Write `SCRIPT.md` with the full narration. Structure: **hook → story → proof → CTA**.

**Artifacts**: `SCRIPT.md`

### 4. Storyboard
Write `STORYBOARD.md` with per-beat creative direction: what's on screen, transitions, timing notes.

**Artifacts**: `STORYBOARD.md`

### 5. VO + Timing
Generate audio and timestamps via TTS (ElevenLabs, local `npx hyperframes tts`, or upload).

**Artifacts**: `audio.mp3`, `timing.json` (word-level timestamps)

```bash
# Local TTS
npx hyperframes tts "Your script here" --output audio.mp3

# ElevenLabs (via API)
# POST to /v1/text-to-speech/{voice_id}/with-timestamps
# → returns audio + per-word start/end times
```

### 6. Build
Create animated HTML compositions for each beat, wiring timing from Step 5.

**Artifacts**: `index.html`, supporting compositions

### 7. Validate
Run lint + visual verification (snapshot each beat, compare to storyboard).

```bash
npx hyperframes lint
npx hyperframes snapshot --frame 0   # intro frame
npx hyperframes snapshot --frame 90  # mid-video
```

## Not Every Project Uses Every Step

- Brand reel → skip narration (Steps 3–5)
- Hand-authored composition → skip Steps 1–2
- Quick one-shot animation → skip Steps 3–5, just build

## Why This Structure

Each artifact is inspectable on disk. You can:
- Edit `STORYBOARD.md` without re-running capture
- Swap the voice without reworking the script
- Rebuild individual beats without re-rendering the full video

The pipeline is especially useful for multi-beat narrative videos (product launches, explainers, social ads). For simple animations, skip straight to Step 6.
