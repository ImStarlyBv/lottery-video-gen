# @hyperframes/engine

Seekable page-to-video capture engine using Chrome's `BeginFrame` API.

> ⚠️ **Most users should NOT use the engine directly.** Use the CLI (`npx hyperframes render`) or `@hyperframes/producer` instead. Use this package only when you need granular frame capture control.

## Install

```bash
npm install @hyperframes/engine
```

## When to Use Directly

- Custom rendering pipelines needing per-frame control
- Integration into existing video processing workflows
- Individual frame extraction (thumbnails, sprite sheets)
- Non-FFmpeg encoding backends

## How It Works

1. Launch headless Chrome via Puppeteer
2. Load HTML composition
3. For each frame: advance timeline to `t = frame / fps` via `renderSeek(time)`
4. Capture pixel buffer using `HeadlessExperimental.beginFrame`
5. Stream frame buffers to your encoder

## Key APIs

```typescript
import { createEngine } from '@hyperframes/engine';

const engine = await createEngine({
  fps: 30,
  quality: 'standard',  // draft | standard | high
  width: 1080,
  height: 1920,
});

const session = await engine.load('./index.html');

// Capture individual frames
for (let frame = 0; frame < session.totalFrames; frame++) {
  const buffer = await session.captureFrame(frame);
  // pipe buffer to your encoder
}

await engine.destroy();
```

## Encoding Support

- **MP4**: h264
- **WebM**: VP9 with alpha channel (transparent video)
- Streaming encoding — no disk buffering required

## HDR

- Color-space classification tools included
- WebGPU-based DOM capture for CSS HDR animations
- Outputs HDR10 when source metadata is detected

## Protocol

Any page implementing the `window.__hf` protocol (exposing `duration`, `seek`, and optional `media` declarations) can be captured by the engine — not limited to Hyperframes compositions.
