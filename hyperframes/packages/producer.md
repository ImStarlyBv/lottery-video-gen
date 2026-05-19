# @hyperframes/producer

Full HTML-to-video rendering pipeline with encoding, audio mixing, and Docker support. Use this when you need to render compositions programmatically from Node.js (CI pipelines, backend services, batch rendering).

## Install

```bash
npm install @hyperframes/producer
```

## When to Use

| Use case | Tool |
|---|---|
| Command-line rendering | CLI (`npx hyperframes render`) |
| Visual editing | Studio |
| Frame capture only | Engine (`@hyperframes/engine`) |
| HTML linting/parsing | Core (`@hyperframes/core`) |
| **Programmatic rendering from Node.js** | **Producer** ← you are here |

## Basic Usage

```typescript
import { createRenderJob, executeRenderJob } from '@hyperframes/producer';

const job = createRenderJob({
  compositionPath: './index.html',
  output: './output.mp4',
  fps: 30,
  quality: 'standard',
  format: 'mp4',
});

const result = await executeRenderJob(job);
console.log('Done:', result.outputPath);
```

## Options

```typescript
interface RenderJobOptions {
  compositionPath: string;    // path to index.html
  output: string;             // output file path
  fps?: 24 | 30 | 60;        // default: 30
  quality?: 'draft' | 'standard' | 'high';  // default: 'standard'
  format?: 'mp4' | 'webm' | 'mov' | 'png-sequence';
  workers?: number;           // parallel render workers
  gpu?: boolean;              // hardware encoding
  docker?: boolean;           // deterministic Docker mode
  variables?: Record<string, unknown>;  // variable overrides
  onProgress?: (stage: string, pct: number) => void;
}
```

## Features

- **Format support**: MP4 (h264), WebM (VP9 with transparency), MOV (ProRes 4444)
- **GPU encoding**: NVIDIA, macOS, Linux, Intel
- **HDR**: Detects HDR sources, outputs H.265 10-bit
- **Docker mode**: Guaranteed identical output across machines
- **Progress callbacks**: Hook into each render stage
- **Server mode**: Built-in HTTP endpoints for rendering-as-a-service

## Pipeline Steps (Internal)

1. Load composition HTML
2. Inject Hyperframes runtime
3. Wait for readiness signal
4. Capture frames via `@hyperframes/engine`
5. Encode with FFmpeg
6. Mix audio tracks
