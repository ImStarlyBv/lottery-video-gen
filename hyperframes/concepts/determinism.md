# Deterministic Rendering

> "The same composition always produces the same video."

## How It Works

Hyperframes renders via a **seek-driven** pipeline — never real-time playback:

1. **Frame Clock** — `time = floor(frame) / fps` — integer math, zero wall-clock involvement
2. **Seek** — Frame adapter deterministically positions all animations/DOM to the exact frame
3. **Capture** — Chrome's `HeadlessExperimental.beginFrame` API atomically captures pixels
4. **Encode** — FFmpeg converts captured frames to MP4 with integrated audio mixing

## Rules for Determinism

Your composition code must follow these rules or output will vary between runs:

| ❌ Breaks determinism | ✅ Use instead |
|---|---|
| `Date.now()` | Use frame number: `const t = frame / fps` |
| `Math.random()` | Seed your PRNG: `seedrandom('fixed-seed')` |
| `requestAnimationFrame` | Let the framework seek GSAP timelines |
| Network fetches during rendering | Pre-load all assets before render starts |
| Unsized composition (no duration) | Always define total duration |

## Docker for Reproducibility

Local mode uses your system Chrome and fonts — output may vary slightly between machines.

Docker mode guarantees **identical output everywhere**:
```bash
npx hyperframes render --output out.mp4 --docker
```

Use Docker for:
- CI/CD pipelines
- Production batch rendering
- Cross-team consistency

## Preview–Render Parity

The same Hyperframes runtime powers both `npx hyperframes preview` (browser) and `npx hyperframes render` (CLI). What you see in preview is exactly what renders — no surprises.
