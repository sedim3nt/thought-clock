# Thought Clock

How long does it take an AI to think a human day's worth of thoughts? Watch the answer in real time.

**Live:** (Part of [dashboards.spirittree.dev](https://dashboards.spirittree.dev))
**Stack:** Vite + React, TailwindCSS, Framer Motion
**Status:** Active

## What This Is

Thought Clock is a real-time visualization comparing human cognitive processing speed to current AI models. A human generates roughly 6,200 thoughts per day at about 40 tokens each — 248,000 tokens processed over 24 hours. GPT-5.4 can process the same volume in under 15 minutes.

The visualization shows a clock face counting up in real time, with each model racing through the same cognitive workload. It makes the speed differential visceral rather than abstract. The methodology section explains all sourced numbers.

## Features

- ⏱️ **Real-time Clock** — watch AI models process a human day's worth of thoughts
- 🤖 **Model Comparison** — GPT-5.4, Claude Sonnet 4.6, Gemini 2.5 Pro, Claude Opus 4.6
- 📊 **Speed Visualization** — tokens/second comparison with progress bars
- 📐 **Sourced Methodology** — all numbers cited with sources
- ✨ **Framer Motion** — smooth animations and transitions

## AI Integration

None — this visualizes AI capability data but doesn't call any AI APIs.

## Tech Stack

- **Framework:** Vite + React
- **Styling:** TailwindCSS
- **Animation:** Framer Motion
- **Database:** None
- **AI:** None
- **Hosting:** Vercel

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

None required.

## Part of SpiritTree

This project is part of the [SpiritTree](https://spirittree.dev) ecosystem — an autonomous AI operation building tools for the agent economy and displaced workers.

## License

MIT
