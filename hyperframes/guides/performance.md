# Performance

Target: **33ms frame budget** at 30fps. If preview lags, render to draft MP4 instead.

## Expensive CSS Patterns

### backdrop-filter (Worst Offender)

Scales with both area and radius. Stacked layers multiply costs.

```css
/* ❌ Each layer stacks */
.card    { backdrop-filter: blur(40px); }
.overlay { backdrop-filter: blur(30px); }
.modal   { backdrop-filter: blur(20px); }

/* ✅ Use semi-transparent background instead */
.card { background: rgba(0, 0, 0, 0.6); }
```

Max: 2–3 blur layers. Keep radius low (<20px).

### Other Expensive Patterns

```css
/* ❌ Expensive on large elements */
filter: blur(10px);
filter: drop-shadow(0 4px 20px rgba(0,0,0,0.5));

/* ❌ Forces rasterization on every frame */
box-shadow on many animated elements
```

## Image Sizing

Decoded bitmap size = `width × height × 4 bytes`.

| Source image | Canvas | Decoded RAM |
|---|---|---|
| 7000×5000 | 1080×1920 | **140 MB** |
| 2160×3840 (2×) | 1080×1920 | 33 MB ✅ |

**Rule**: Resize source images to max 2× canvas dimensions before using.

## Diagnosing Slowness

Use Chrome DevTools Performance tab during `npx hyperframes preview`:

| Panel shows | Root cause |
|---|---|
| Composite Layers / Paint | Compositor overhead → remove backdrop-filter |
| Decode Image | Oversized source image → resize |
| Layout / Recalculate Style | Layout thrashing → use transform instead of top/left |
| Script | JS execution → reduce animation complexity |

## When Preview Can't Keep Up

Some compositions are legitimately too heavy for real-time preview. That's fine — render instead:

```bash
# Draft quality: fastest render, lower quality
npx hyperframes render --output draft.mp4 --quality draft
```

Draft renders are typically 3–5× faster than standard quality.
