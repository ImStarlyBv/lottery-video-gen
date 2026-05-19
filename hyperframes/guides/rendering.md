# Rendering

Hyperframes renders compositions to MP4, MOV, or WebM via a frame-by-frame, seek-driven pipeline using headless Chrome + FFmpeg.

## Basic Render

```bash
npx hyperframes render --output output.mp4
```

## Modes

### Local (Default)
- Uses bundled Chromium + system FFmpeg
- Fast iteration
- May vary slightly across machines (fonts, Chrome version)
- Good for development

### Docker (Recommended for Production)
```bash
npx hyperframes render --output output.mp4 --docker
```
- Identical output on every platform — same Chrome, fonts, FFmpeg
- Slower cold start (~30s for image pull, then fast)
- Required for CI/CD and reproducible batch rendering

## Output Formats

| Format | Use case |
|---|---|
| `mp4` (default) | Social media, general delivery |
| `webm` | Transparent video (VP9 alpha) |
| `mov` | ProRes 4444 — transparent video for editors (CapCut, Premiere, Final Cut) |
| `png-sequence` | Lossless frames for custom pipelines |

## Quality Presets

| Preset | CRF | Notes |
|---|---|---|
| `draft` | ~28 | Fast — use during development |
| `standard` | 18 | Visually lossless at 1080p ← default |
| `high` | 14 | Final delivery |

## All Render Flags

```bash
npx hyperframes render \
  --output output.mp4 \
  --format mp4 \
  --fps 30 \
  --quality standard \
  --workers 4 \          # default: half CPU cores, capped at 4
  --gpu \                # hardware-accelerated encoding
  --docker \             # deterministic Docker render
  --variables '{"title":"Hello"}' \
  --variables-file vars.json \
  --strict-variables     # fail on missing variable declarations
```

## Transparent Video

For overlays compatible with video editors:
```bash
# WebM with alpha (VP9)
npx hyperframes render --output overlay.webm --format webm

# MOV with ProRes 4444 (industry standard)
npx hyperframes render --output overlay.mov --format mov
```
Compatible with: CapCut, Final Cut Pro, Premiere Pro, DaVinci Resolve, After Effects.

## Performance Tips

- Use `--quality draft` during development
- Increase `--workers` on multi-core machines
- Use `--gpu` if NVIDIA/Apple Silicon available
- If preview lags, render to draft MP4 instead of live preview
