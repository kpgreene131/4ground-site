# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

```bash
# Development
npm run dev        # Start dev server (localhost:4321)
npm run build      # Build for production  
npm run preview    # Preview production build
npm run lint       # Check code formatting
npm run format     # Format with Prettier

# Adding new releases
# 1. Create JSON in src/content/releases/
# 2. Add route in src/pages/releases/[slug].astro getStaticPaths()
```

## Architecture Overview

### Astro Islands Pattern
This is an Astro site using the islands architecture:
- **Static by default**: Pages are `.astro` files that render to static HTML
- **Interactive islands**: React components with `client:load` directive become interactive
- **Key island**: `StemVisualizerPlaceholder.tsx` - Complex React component for audio controls

### Content Architecture
- **Static content**: JSON files in `src/content/releases/` drive dynamic pages
- **Release routing**: `src/pages/releases/[slug].astro` uses `getStaticPaths()` to generate pages from JSON
- **Sample data**: `src/content/releases/sample.json` contains complete release structure

### Component Hierarchy
```
BaseLayout.astro (SEO, navigation, footer)
├── Page components (index.astro, labs.astro, etc.)  
└── React islands (StemVisualizerPlaceholder.tsx)
    └── Complex interactive audio controls
```

### Styling System
- **Tailwind CSS** via Vite plugin (`@tailwindcss/vite`)
- **Dark theme**: Gray-950 backgrounds with semantic color tokens
- **Responsive**: Mobile-first breakpoints (sm:640px, lg:1024px)

## Audio Player Component Architecture

`StemVisualizerPlaceholder.tsx` simulates a 4-stem audio mixer:
- **State management**: Individual stem objects with volume/EQ/FX properties
- **Transport controls**: Play/pause with simulated timeline
- **Lite mode**: Toggle that disables FX processing for mobile optimization
- **Interactive controls**: Range inputs for all audio parameters

This component is designed to be replaced with real Web Audio API implementation in Phase 3.

## Performance Requirements

Strict performance budget enforced:
- First Load JS ≤ 80KB compressed
- CSS ≤ 50KB compressed  
- LCP < 2.0s on 4G simulated
- Lighthouse ≥ 90 Performance/SEO

## Content Structure

Release JSON schema:
```json
{
  "title": "Track Name",
  "slug": "track-name",
  "releaseDate": "2024-01-15", 
  "bpm": 128,
  "key": "Am",
  "duration": "4:03",
  "coverUrl": "https://...",
  "platformLinks": [{"platform": "Bandcamp", "url": "..."}],
  "stems": [{"name": "Kick & Bass", "file": "/audio/..."}]
}
```

## Browser Compatibility Strategy

**Tier 1 (Full features)**: Chrome 66+, Firefox 60+, Safari 14.1+, Edge 79+
**Tier 2 (Lite mode)**: Safari 13+, older mobile browsers

Future Web Audio API implementation must gracefully degrade to static playback when unsupported.

## Phase-Based Development

Currently in **Phase 0** (complete) - scaffold with placeholder components.
Next: **Phase 1** - design system implementation and visual polish.
**Phase 3** will replace `StemVisualizerPlaceholder` with real Web Audio API engine.

Comprehensive specifications in `specs/` folder drive implementation decisions.