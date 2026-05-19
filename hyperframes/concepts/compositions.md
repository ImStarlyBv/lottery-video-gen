# Compositions

A **composition** is an HTML document that defines a video timeline containing clips (video, images, audio, nested compositions).

## Core Structure

Every composition requires a root element with `data-composition-id`. `index.html` is the top-level composition; any composition can be nested within another.

```html
<div id="root" data-composition-id="my-video"
     data-width="1080" data-height="1920">
  <!-- clips go here -->
</div>
```

## Supported Clip Types

| Element | Type |
|---|---|
| `<video>` | Video content |
| `<img>` | Static images / overlays |
| `<audio>` | Music, sound effects, voice-over |
| `<div data-composition-id>` | Nested sub-compositions |

## Two-Layer Architecture

**HTML Layer** — declarative primitives controlled by data attributes. Determines *what plays, when, and on which track*.

**Script Layer** — GSAP animations and visual effects. Never manages media playback (the framework owns that).

> ⚠️ Never manually call `video.play()`, `video.pause()`, or set `video.currentTime`. The framework handles all media playback automatically.

## Nesting

**External (recommended)** — reference an HTML file:
```html
<div data-composition-src="./lower-third.html"
     data-start="5" data-duration="3" data-track-index="2"></div>
```

**Inline** — define directly:
```html
<div data-composition-id="card" data-start="2" data-duration="4" data-track-index="1">
  <h2 class="clip" data-start="0" data-duration="4" data-track-index="0">Title</h2>
</div>
```

## Variables

Declare named typed slots for reusable compositions:
```html
<html data-composition-variables='[
  {"id":"title","type":"string","label":"Title","default":"My Video"},
  {"id":"color","type":"color","label":"Accent Color","default":"#f5c518"}
]'>
```

Pass values from parent:
```html
<div data-composition-src="./card.html"
     data-variable-values='{"title":"Hello","color":"#ff0000"}'></div>
```

Read in script:
```javascript
const { title, color } = window.__hyperframes.getVariables();
```
