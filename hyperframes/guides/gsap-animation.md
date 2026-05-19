# GSAP Animation

GSAP is the primary animation library for Hyperframes. The framework controls timeline playback via deterministic seeking — your job is to define the animations, not play them.

## Required Setup

```javascript
// 1. Create timeline with paused: true
const tl = gsap.timeline({ paused: true });

// 2. Add animations using ABSOLUTE position parameter (3rd arg)
tl.to("#title",    { opacity: 1, y: 0,    duration: 0.5 }, 0);
tl.to("#subtitle", { opacity: 1,          duration: 0.4 }, 0.6);
tl.to("#card",     { scale: 1, opacity: 1, duration: 0.3 }, 1.2);

// 3. Register on window.__timelines with composition ID as key
window.__timelines = window.__timelines || {};
window.__timelines["my-composition"] = tl;
// Framework calls: tl.totalTime(frame / fps) on each seek
```

## Critical Rules

1. **Always `{ paused: true }`** — the framework drives playback, never the timeline itself
2. **Always use the position parameter** (3rd arg) for absolute timing — relative `+=` causes drift
3. **Register with the composition ID** as key on `window.__timelines`
4. **Never animate media playback** — don't call `video.play()` or set `video.currentTime`

## Common Animations

```javascript
// Fade in from below
tl.from("#el", { opacity: 0, y: 40, duration: 0.5 }, 0);

// Scale pop
tl.from("#badge", { scale: 0, opacity: 0, duration: 0.3, ease: "back.out(1.7)" }, 1);

// Stagger children
tl.from(".card", { opacity: 0, y: 20, duration: 0.4, stagger: 0.1 }, 2);

// Text reveal
tl.from("#title", { clipPath: "inset(0 100% 0 0)", duration: 0.8, ease: "power2.inOut" }, 0.5);
```

## Timeline Duration Mismatch (Common Bug)

The composition ends when the GSAP timeline ends — **not** when your video/audio clip ends.

If your audio is 90 seconds but animations finish at 8 seconds, the video cuts off at 8 seconds:

```javascript
// Fix: extend the timeline to match your media duration
tl.set({}, {}, 90);  // empty set at t=90 keeps timeline alive
```

## Multiple Compositions

Each nested composition needs its own registered timeline:

```javascript
window.__timelines = {
  "main-video":   mainTimeline,
  "lower-third":  lowerThirdTimeline,
  "card":         cardTimeline,
};
```

## What NOT to Do

```javascript
// ❌ Relative timing — causes drift
tl.to("#el", { opacity: 1 }, "+=0.5");

// ❌ Nested sub-timelines manually
tl.add(otherTimeline);  // breaks framework sync

// ❌ Animating video dimensions directly
tl.to("video", { width: 500 });  // use a wrapper div instead

// ❌ Controlling media
gsap.to(video, { currentTime: 10 });  // framework owns this
```
