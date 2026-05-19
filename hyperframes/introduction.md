# Introduction

> Write HTML. Render video. Built for agents.

Hyperframes is an open-source framework that turns HTML into deterministic, frame-by-frame rendered video — so you can define a video the same way you build a web page.

## How It Works

1. **Write HTML** — Define your video as an HTML document. Each element gets data attributes for timing (`data-start`, `data-duration`) and layout (`data-track-index`). Add animations with GSAP, Lottie, CSS transitions, or any seekable runtime via the Frame Adapter pattern.

2. **Preview in the browser** — Run `npx hyperframes preview` to open a live preview in your browser. Edit your HTML and see changes instantly — no build step, no compilation.

3. **Render to MP4** — Run `npx hyperframes render --output output.mp4` to produce a final video. The engine seeks each frame in headless Chrome, captures it with `beginFrame`, and pipes the result through FFmpeg.

## Example Composition

```html
<div id="root" data-composition-id="demo"
     data-start="0" data-width="1920" data-height="1080">

  <video id="clip-1" data-start="0" data-duration="5"
         data-track-index="0" src="intro.mp4" muted playsinline></video>

  <h1 id="title" class="clip"
      data-start="1" data-duration="4" data-track-index="1"
      style="font-size: 72px; color: white;">
    Welcome to Hyperframes
  </h1>

  <audio id="bg-music" data-start="0" data-duration="5"
         data-track-index="2" data-volume="0.5" src="music.wav"></audio>
</div>
```

Run `npx hyperframes render --output demo.mp4` — same input always produces identical output.

## Why Hyperframes

- **For developers**: Plain HTML + CSS + JS. No custom DSL, no proprietary component system, no React requirement.
- **For AI agents**: Compositions are plain HTML documents — the format LLMs are best at generating. CLI is non-interactive by default (flag-driven, plain text output, fail-fast).
- **For automated pipelines**: Determinism by design. `frame = floor(time * fps)` — every frame independently captured via Chrome's `beginFrame` API.

## Packages

| Package | Purpose |
|---|---|
| `@hyperframes/core` | Types, HTML parsing, runtime, composition linter |
| `@hyperframes/engine` | Seekable page-to-video capture engine (headless Chrome) |
| `@hyperframes/producer` | Full rendering pipeline (capture + FFmpeg encoding) |
| `@hyperframes/studio` | Visual composition editor UI |
| `hyperframes` (CLI) | Command-line tool: create, preview, render |
