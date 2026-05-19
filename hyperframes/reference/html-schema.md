# HTML Schema Reference

Complete schema for authoring Hyperframes HTML compositions.

## Root Element

```html
<div id="root"
     data-composition-id="my-video"   <!-- required, unique ID -->
     data-width="1080"                <!-- canvas width px -->
     data-height="1920">              <!-- canvas height px -->
  <!-- clips go here -->
</div>
```

For variables, declare on `<html>`:
```html
<html data-composition-variables='[...]'>
```

## Clip Types

### Video Clip

```html
<video
  id="clip-1"                     <!-- required unique ID -->
  data-start="0"                  <!-- seconds or clip ID reference -->
  data-duration="10"              <!-- optional: defaults to source duration -->
  data-track-index="0"            <!-- required: z-order layer -->
  data-media-start="2"            <!-- optional: trim source offset (default: 0) -->
  data-has-audio="true"           <!-- optional: marks audio presence -->
  src="video.mp4"
  muted                           <!-- always mute video; use <audio> for sound -->
  playsinline
></video>
```

> ⚠️ Do NOT add `class="clip"` to video elements — framework manages visibility automatically.

### Image Clip

```html
<img
  id="bg"
  class="clip"                    <!-- REQUIRED for images -->
  data-start="0"
  data-duration="30"              <!-- REQUIRED for images (no source duration) -->
  data-track-index="1"
  src="background.jpg"
  style="width:100%; height:100%; object-fit:cover;"
/>
```

Supported formats: PNG, JPG, WebP, SVG, GIF

### Audio Clip

```html
<audio
  id="vo"                         <!-- no class="clip" needed -->
  data-start="0"
  data-track-index="0"
  data-volume="1"                 <!-- 0.0–1.0 -->
  data-media-start="0"            <!-- trim offset -->
  src="audio.mp3"
></audio>
```

Multiple audio tracks can overlap for layered sound design.

### Nested Composition

```html
<!-- External file (recommended) -->
<div
  id="lower-third"
  data-composition-src="./lower-third.html"
  data-start="5"
  data-duration="8"
  data-track-index="3"
  data-variable-values='{"name":"Luis","title":"Presentador"}'
></div>

<!-- Inline -->
<div
  id="card"
  data-composition-id="card"
  data-start="2"
  data-duration="5"
  data-track-index="2">
  <h2 class="clip" data-start="0" data-duration="5" data-track-index="0">
    Title
  </h2>
</div>
```

## Data Attribute Reference

| Attribute | Required | Type | Description |
|---|---|---|---|
| `data-composition-id` | ✅ (root) | string | Unique composition identifier |
| `data-width` | ✅ (root) | number | Canvas width in pixels |
| `data-height` | ✅ (root) | number | Canvas height in pixels |
| `data-start` | ✅ (clips) | number \| string | Start time in seconds or clip ID reference |
| `data-duration` | ✅ (img) | number | Duration in seconds |
| `data-track-index` | ✅ (clips) | number | Z-order layer (0 = bottom) |
| `data-media-start` | — | number | Source trim offset (default: 0) |
| `data-volume` | — | 0–1 | Audio volume |
| `data-has-audio` | — | boolean | Marks video as having audio |
| `data-composition-src` | — | path | External composition HTML file |
| `data-variable-values` | — | JSON | Variable overrides for nested composition |
| `data-composition-variables` | — | JSON array | Variable declarations (on `<html>`) |

## GSAP Timeline Registration

```javascript
// Required pattern — framework seeks the timeline per frame
const tl = gsap.timeline({ paused: true });

// Add animations with absolute position (3rd arg)
tl.from("#title", { opacity: 0, y: 40, duration: 0.5 }, 0);
tl.from("#nums",  { opacity: 0, x: -20, duration: 0.4 }, 0.6);

// Key MUST match data-composition-id
window.__timelines = window.__timelines || {};
window.__timelines["my-video"] = tl;

// Extend timeline to match audio duration (prevent early cutoff)
tl.set({}, {}, 90);  // if audio is 90 seconds
```

## Full 9:16 Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1080px; height: 1920px; overflow: hidden; }
  </style>
</head>
<body>
  <div id="root" data-composition-id="my-video"
       data-width="1080" data-height="1920">

    <!-- Background -->
    <img id="bg" class="clip"
         data-start="0" data-duration="60" data-track-index="0"
         src="bg.jpg" style="width:100%;height:100%;object-fit:cover;" />

    <!-- Voice-over -->
    <audio id="vo"
           data-start="0" data-track-index="1" data-volume="1"
           src="audio.mp3"></audio>

    <!-- Content card -->
    <div id="card-1" class="clip"
         data-start="1" data-duration="5" data-track-index="2"
         style="position:absolute; top:50%; left:60px; right:60px;
                transform:translateY(-50%); background:rgba(0,0,0,0.7);
                padding:40px; border-radius:16px;">
      <h2 style="color:#f5c518; font-size:52px;">LOTERÍA NACIONAL</h2>
      <p style="color:#fff; font-size:80px; font-weight:900;">88 - 33 - 80</p>
    </div>

  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("#card-1", { opacity: 0, y: 60, duration: 0.5 }, 1);
    tl.set({}, {}, 60); // extend to match audio

    window.__timelines = { "my-video": tl };
  </script>
</body>
</html>
```
