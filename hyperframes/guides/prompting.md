# Prompt Guide (AI Agents)

How to effectively prompt AI agents (Claude Code, Cursor, Gemini CLI) to generate Hyperframes compositions.

## Setup

```bash
npx skills add heygen-com/hyperframes
```

This installs the `/hyperframes` slash command and teaches the agent:
- Required `class="clip"` on timed elements
- GSAP `window.__timelines` registration pattern
- `data-*` attribute semantics
- Common mistakes to avoid

Without the skill, agents produce generic HTML that misses Hyperframes-specific requirements.

## Two Prompt Approaches

### Cold Start (Creative Direction)

Specify duration, aspect ratio, mood, and key elements:

```
Create a 15-second vertical (1080x1920) lottery results video.
Dark background, gold accent color (#f5c518).
Each lottery name appears with its numbers for 3 seconds.
Fade-in animation per card. Spanish text.
```

### Warm Start (From Existing Content) — Better Results

Provide a URL, document, or data for the agent to work from:

```
Turn this JSON into a Hyperframes video:
[{"name":"Lotería Nacional","numbers":["88","33","80"]}, ...]

9:16 vertical, broadcast news style, 30fps.
Each entry gets 3.5 seconds. Voice-over is /tmp/audio.mp3.
```

Warm starts produce richer results because the agent writes about something concrete.

## Iteration — Treat the Agent Like a Video Editor

Don't re-prompt from scratch. Make targeted edits:

```
Make the lottery numbers 20% bigger
```
```
Add a slide-in from the right instead of fade
```
```
Move the date label below the brand name, not above
```
```
The cards are overlapping — add 20px gap between them
```

## Natural Language → Technical Settings

The skill maps these automatically:

| You say | Agent produces |
|---|---|
| "bouncy" | `ease: "elastic.out(1, 0.3)"` |
| "smooth" | `ease: "power2.inOut"` |
| "snappy" | `duration: 0.2, ease: "power3.out"` |
| "cinematic" | slow zoom, letterbox, film grain |
| "hype captions" | kinetic slam text animation |
| "calm transition" | blur crossfade |
| "high-energy transition" | glitch effect |

## Critical Rules for Agents

1. Register all timelines on `window.__timelines` with the composition ID as key
2. `<video>` elements must be muted — audio uses separate `<audio>` elements
3. No `Math.random()` without seeding — breaks determinism
4. No async operations during timeline setup
5. Every animated element needs an entrance animation (nothing should just appear)
