# Hyperframes vs Remotion

Both are deterministic video renderers using headless Chrome. They diverge fundamentally on authoring approach.

## TL;DR

| | Hyperframes | Remotion |
|---|---|---|
| **Authoring** | Plain HTML + CSS + JS | React components (JSX) |
| **Animation libs** | GSAP, Anime.js, Lottie, CSS ✅ | Limited (wall-clock issue) |
| **Arbitrary web content** | Direct — paste any HTML | Must translate to JSX |
| **Visual editing** | Native DOM manipulation | Fragile (build step required) |
| **Distributed rendering** | Single-machine (Lambda roadmapped) | Remotion Lambda — production-ready |
| **License** | Apache 2.0 (free, commercial) | Custom — paid above small teams |
| **LLM-friendliness** | HTML is LLM-native ✅ | JSX adds complexity |

## Animation Library Support

**Hyperframes** seekably pauses animation libraries (GSAP, Anime.js, Motion One) to frame-accurate timestamps. The adapter calls `timeline.totalTime(frame / fps)` directly.

**Remotion** uses React reconciliation which causes these libraries to play at wall-clock speed — animations may complete before later frames are captured, breaking sync.

→ **For GSAP-heavy compositions: Hyperframes**

## Arbitrary Web Content

**Hyperframes** accepts any HTML/CSS/JS directly — landing pages, CodePen demos, design exports, dashboards.

**Remotion** requires translating everything into JSX with potential fidelity loss and a build step.

→ **For converting existing web content to video: Hyperframes**

## Visual Editing

The same DOM in Hyperframes can be edited natively (Studio uses real DOM selection/drag-drop).

Remotion's code + build step architecture makes round-tripping through visual editors fragile.

→ **For iterative visual editing: Hyperframes**

## Scale / Distributed Rendering

**Remotion Lambda**: Production-ready, renders across hundreds of AWS functions in parallel.

**Hyperframes Lambda**: Available but v1 — no webhooks, no multi-region, no HDR yet.

→ **For hyperscale distributed rendering: Remotion**

## Choose Hyperframes When

- Building agentic / LLM-driven video workflows
- You have existing HTML/CSS content to convert
- You want GSAP / Lottie with proper frame-seeking
- You need Apache 2.0 licensing (commercial, no per-render fees)

## Choose Remotion When

- You have an existing React codebase
- You need hyperscale distributed rendering (Lambda)
- Your team is already TypeScript/React-heavy
