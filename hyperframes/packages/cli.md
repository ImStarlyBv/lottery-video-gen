# CLI — `hyperframes`

The Hyperframes CLI is the primary interface for creating, previewing, linting, and rendering HTML video compositions.

```bash
npm install -g hyperframes
# or
npx hyperframes <command>
```

## Commands

### Create & Manage

```bash
# Scaffold a new project from a template
npx hyperframes init <project-name>

# Add a catalog block or component to current project
npx hyperframes add <block-name>
# e.g.: npx hyperframes add yt-lower-third

# Browse available blocks/components
npx hyperframes catalog
```

### Preview & Inspect

```bash
# Live preview with hot reload in browser
npx hyperframes preview

# Validate composition structure
npx hyperframes lint

# Inspect timing and clip metadata
npx hyperframes inspect

# Capture a single frame as PNG
npx hyperframes snapshot --frame 30
```

### Render

```bash
# Basic render
npx hyperframes render --output output.mp4

# With options
npx hyperframes render \
  --output output.mp4 \
  --format mp4 \        # mp4 | mov | webm | png-sequence
  --fps 30 \            # 24 | 30 | 60
  --quality standard \  # draft | standard | high
  --workers 4 \         # parallel render processes
  --gpu                 # hardware encoding

# Docker mode (deterministic, identical on all machines)
npx hyperframes render --output output.mp4 --docker

# Pass variables at render time
npx hyperframes render --output output.mp4 \
  --variables '{"title":"Números de Hoy","date":"2026-05-19"}'

# From a JSON file
npx hyperframes render --output output.mp4 \
  --variables-file ./vars.json

# Strict variable validation
npx hyperframes render --output output.mp4 --strict-variables
```

### Quality Presets

| Preset | CRF | Use for |
|---|---|---|
| `draft` | ~28 | Fast iteration during development |
| `standard` | 18 | Visually lossless at 1080p (default) |
| `high` | 14 | Final delivery |

### Utilities

```bash
# Check environment (Node, FFmpeg, Chrome versions)
npx hyperframes doctor

# Transcribe audio/video with Whisper
npx hyperframes transcribe audio.mp3

# Generate speech from text (local TTS)
npx hyperframes tts "Hello world" --output vo.mp3

# Remove video background (on-device AI)
npx hyperframes remove-background input.mp4 --output output.webm

# Capture a website as static asset
npx hyperframes capture https://example.com --output screenshot.png

# Performance benchmark
npx hyperframes benchmark
```

### AWS Lambda (Distributed Rendering)

```bash
npx hyperframes lambda deploy
npx hyperframes lambda render --output output.mp4
npx hyperframes lambda sites create  # pre-stage project for faster renders
```

## Agent-Friendly Design

- All inputs via flags — no interactive prompts by default
- `--json` flag on any command wraps output in `_meta` envelope (machine-readable)
- Fail-fast on errors with non-zero exit codes
- Add `--human-friendly` for the interactive terminal UI
