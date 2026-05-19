# Quickstart

## Prerequisites
- Node.js 22+
- FFmpeg (`apt install ffmpeg` or bundled via `ffmpeg-static`)

## Option 1: AI Agent (Recommended)

Install the Hyperframes skill to teach your agent composition patterns:

```bash
npx skills add heygen-com/hyperframes
```

Then prompt your agent (Claude Code, Cursor, Gemini CLI):
> "Create a 10-second product intro with fade-in title over dark background, 9:16 vertical"

The skill encodes Hyperframes-specific patterns (required data attributes, GSAP registration) that aren't in generic web docs.

## Option 2: Manual Setup

```bash
# Initialize a new project
npx hyperframes init my-video

# Preview with hot reload
npx hyperframes preview

# Edit index.html ...

# Render to MP4
npx hyperframes render --output output.mp4
```

## Three Rules to Remember

1. Root element must have `data-composition-id`, `data-width`, and `data-height`
2. Timed elements need `data-start`, `data-duration`, `data-track-index`, and `class="clip"`
3. GSAP timelines must be created with `{ paused: true }` and registered on `window.__timelines`

## Minimal Example

```html
<!DOCTYPE html>
<html>
<body>
  <div id="root" data-composition-id="my-video"
       data-width="1920" data-height="1080">

    <h1 id="title" class="clip"
        data-start="0" data-duration="5" data-track-index="0"
        style="font-size:72px; color:white; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%)">
      Hello World
    </h1>

  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("#title", { opacity: 0, duration: 1 }, 0);
    window.__timelines = { "my-video": tl };
  </script>
</body>
</html>
```
