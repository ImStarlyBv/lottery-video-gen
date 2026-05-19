# Frame Adapters

Frame Adapters are the bridge between Hyperframes' seek-driven renderer and animation libraries. They answer one question: **"What should the screen look like at frame N?"**

## Adapter Interface

```typescript
interface FrameAdapter {
  init(meta: { id: string; fps: number; width: number; height: number }): void;
  getDurationFrames(): number;
  seekFrame(frame: number): void;
  destroy(): void;
}
```

The adapter **never controls its own clock** — it only responds to seek commands from the framework.

## Critical Requirements

- **Idempotent**: Seeking to frame 42 twice must produce identical output both times
- **Arbitrary seek order**: Must support forward, backward, and random seeks
- **No wall-clock deps**: No `Date.now()`, drift logic, unseeded `Math.random()`, or network fetches
- **Canonical timing**: Always use `t = frame / fps` — never system time

## First-Party Adapters

| Runtime | How it seeks |
|---|---|
| GSAP | `timeline.totalTime(t)` |
| Anime.js | `animation.seek(t * 1000)` |
| CSS keyframes | `element.style.animationDelay = \`-${t}s\`` |
| Lottie / dotLottie | `animation.goToAndStop(frame, true)` |
| Three.js / WebGL | Manual uniform update at `t` |
| Web Animations API | `effect.updateTiming({ delay: -t * 1000 })` |

## GSAP (Most Common)

```javascript
const tl = gsap.timeline({ paused: true });

// Add animations with absolute position parameter (3rd arg)
tl.to("#title", { opacity: 1, y: 0, duration: 0.5 }, 0);
tl.to("#subtitle", { opacity: 1, duration: 0.4 }, 0.6);

// Register on window.__timelines with composition ID as key
window.__timelines = window.__timelines || {};
window.__timelines["my-composition"] = tl;
// Framework calls: tl.totalTime(frame / fps) on each frame seek
```

> ⚠️ Status: Adapter API is **v0 (experimental)**. Breaking changes possible before v1.
