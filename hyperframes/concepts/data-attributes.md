# Data Attributes

All timing, layering, and media control in Hyperframes is driven by HTML data attributes.

> All timed elements **must** have `class="clip"` for the runtime to manage visibility correctly.

## Timing

| Attribute | Description |
|---|---|
| `data-start` | When the clip begins — absolute seconds OR a clip ID reference |
| `data-duration` | How long the clip plays (required for `<img>`, optional for `<video>`/`<audio>`) |
| `data-track-index` | Z-order layer; also prevents overlapping clips on the same track |

### Relative Timing

Instead of calculating absolute seconds, reference another clip's ID:

```html
<!-- starts when "intro" clip ends -->
<div id="body" class="clip" data-start="intro" data-duration="5" data-track-index="1">

<!-- starts 2 seconds after "intro" ends -->
<div id="gap" class="clip" data-start="intro + 2" data-duration="3" data-track-index="1">

<!-- overlaps with "intro" by 0.5 seconds -->
<div id="overlap" class="clip" data-start="intro - 0.5" data-duration="4" data-track-index="1">
```

## Media Control

| Attribute | Description |
|---|---|
| `data-media-start` | Trim offset into source media (default: 0) |
| `data-volume` | Audio level 0–1 |
| `data-has-audio` | Boolean — marks whether a video element has an audio track |

## Composition Structure

| Attribute | Description |
|---|---|
| `data-composition-id` | Required unique ID for the composition root element |
| `data-width` | Canvas width in pixels |
| `data-height` | Canvas height in pixels |
| `data-composition-src` | Path to external `.html` composition file |
| `data-variable-values` | JSON object of variable overrides passed to nested composition |
| `data-composition-variables` | JSON array declaring available variables (on `<html>` root) |

## Common Dimensions

| Format | Width | Height |
|---|---|---|
| Landscape (16:9) | 1920 | 1080 |
| Portrait (9:16) — Reels/TikTok | 1080 | 1920 |
| Square (1:1) | 1080 | 1080 |
| 4K Landscape | 3840 | 2160 |

## Full Example

```html
<div id="root" data-composition-id="lottery-daily"
     data-width="1080" data-height="1920">

  <!-- Voice-over audio -->
  <audio id="vo" class="clip"
         data-start="0" data-track-index="0"
         data-volume="1" src="audio.mp3"></audio>

  <!-- Background image, full duration -->
  <img id="bg" class="clip"
       data-start="0" data-duration="60"
       data-track-index="1" src="bg.jpg"
       style="width:100%; height:100%; object-fit:cover;" />

  <!-- Card starts 2s after background -->
  <div id="card-1" class="clip"
       data-start="bg + 2" data-duration="3.2"
       data-track-index="2">
    Lotería Nacional: 88 - 33 - 80
  </div>

</div>
```
