# Deploy

Two official cloud templates for running Hyperframes preview UIs and render APIs.

## Vercel Template

Uses Vercel Sandbox (Firecracker microVM) + Vercel Blob storage.

- Zero-config Blob storage
- Pre-baked snapshots restore in ~100ms (Chromium/FFmpeg pre-installed)
- Eliminates cold-start installation overhead

```bash
# Deploy
npx hyperframes deploy --template vercel
```

## Cloudflare Template

Uses Cloudflare Containers (Workers + Durable Objects) + R2 storage.

- Full control over renderer image
- Free egress within Cloudflare's network
- Requires Workers Paid plan

```bash
npx hyperframes deploy --template cloudflare
```

## Architecture (Both Templates)

```
Browser
  └─▶ preview locally via <hyperframes-player>
  └─▶ POST /api/render
        └─▶ Sandboxed runtime (Chrome + FFmpeg pre-installed)
              └─▶ Returns rendered MP4 URL
```

The critical optimization: **pre-baked renderer** — Chrome + FFmpeg installed at build/image time, not at request time. Reduces cold start from 30–60s to ~100ms.

## Custom Deployment

For projects needing render queues, multi-tenant support, or self-hosting:

1. Build your composition locally: `npx hyperframes render --output out.mp4`
2. Copy the bundle to `public/compositions/`
3. Update configuration variables in template code
4. Deploy to your infrastructure

## AWS Lambda (Distributed)

For high-volume batch rendering:

```bash
# Prerequisites: AWS credentials, AWS SAM CLI, bun
npx hyperframes lambda deploy
npx hyperframes lambda render --output output.mp4
```

**Architecture**: Step Functions orchestrate `Plan → Map(N) RenderChunk → Assemble` across parallel Lambda workers, with S3 as intermediate storage.

**Cost**: `8 chunks × (15 min × 10 GB × $0.0000167/GB-s) ≈ $1.20` worst case per render.
