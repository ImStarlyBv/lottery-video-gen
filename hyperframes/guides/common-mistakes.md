# Common Mistakes

Run `npx hyperframes lint` first — it catches most of these automatically.

## 1. Animating Video Element Dimensions Directly ❌

GSAP animations on `<video>` width/height/position **halt frame rendering**.

```javascript
// ❌ Breaks rendering
tl.to("video", { width: 500, x: 100 }, 0);
```

```html
<!-- ✅ Wrap in a div, animate the container -->
<div id="video-wrapper" style="position:absolute; width:500px">
  <video src="clip.mp4"></video>
</div>
```
```javascript
tl.to("#video-wrapper", { x: 100, scale: 1.2 }, 0);
```

## 2. Controlling Media Playback in Scripts ❌

The framework owns all media playback. Never call play/pause/seek manually.

```javascript
// ❌ Causes sync issues
video.play();
video.currentTime = 5;
gsap.to(video, { currentTime: 10 });
```

Let `data-start`, `data-duration`, and `data-media-start` handle it.

## 3. Timeline Duration Mismatch ❌

Compositions end when GSAP animations finish — not when video/audio ends.

```javascript
// If your audio is 90s but animations end at 8s — video cuts at 8s
// ✅ Fix: extend timeline to match media
tl.set({}, {}, 90);
```

## 4. Missing `class="clip"` ❌

Every timed element needs `class="clip"` for the runtime to manage visibility.

```html
<!-- ❌ Won't appear/disappear correctly -->
<div id="card" data-start="2" data-duration="4" data-track-index="1">

<!-- ✅ -->
<div id="card" class="clip" data-start="2" data-duration="4" data-track-index="1">
```

## 5. Oversized Images ❌

Source images larger than 2× canvas dimensions cause memory bloat.

```
Canvas: 1080×1920 → max source image: 2160×3840
```

Resize before using. A 7000×5000 image = 140MB decoded RAM regardless of file size.

## 6. Heavy Backdrop Filters ❌

Stack no more than 2–3 `backdrop-filter: blur()` layers. Each stacks multiplicatively.

```css
/* ❌ Kills performance */
.card { backdrop-filter: blur(40px); }
.overlay { backdrop-filter: blur(30px); }
.modal { backdrop-filter: blur(20px); }

/* ✅ Use a semi-transparent background instead */
.card { background: rgba(0,0,0,0.6); }
```

## 7. Timeline Key Mismatch ❌

The `window.__timelines` key **must exactly match** the element's `data-composition-id`.

```html
<div id="root" data-composition-id="lottery-daily">
```

```javascript
// ❌
window.__timelines["root"] = tl;
window.__timelines["lottery"] = tl;

// ✅
window.__timelines["lottery-daily"] = tl;
```

## 8. Non-Deterministic Code ❌

```javascript
// ❌ Breaks determinism
const color = ["red","blue","green"][Math.floor(Math.random() * 3)];
const now = Date.now();

// ✅ Seed your PRNG
import seedrandom from 'seedrandom';
const rng = seedrandom('fixed-seed');
const color = ["red","blue","green"][Math.floor(rng() * 3)];
```
