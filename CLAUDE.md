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

**Phase 0** (complete) - scaffold with placeholder components.
**Phase 1** (complete) - design system implementation and visual polish.
**Phase 2** (complete) - Sanity CMS integration with responsive image pipeline and dynamic content.
**Phase 3** will replace `StemVisualizerPlaceholder` with real Web Audio API engine.

Comprehensive specifications in `specs/` folder drive implementation decisions.

## Content Management System

### Sanity Integration (Phase 2)
- **CMS**: Sanity Studio for content management
- **Schema**: TypeScript schemas in `sanity/schemas/` for releases, shows, and lab pieces
- **API**: Client functions in `src/lib/sanity/` with graceful fallbacks
- **Images**: Optimized delivery via Sanity CDN with responsive formats
- **Build**: Static generation at build-time with environment variable configuration

### Setup Requirements
1. Create Sanity project at sanity.io
2. Configure environment variables (see `.env.example`)
3. Deploy schema: `npx sanity schema deploy`
4. Launch Studio: `npx sanity dev` or `npx sanity deploy`
5. Add content and mark as "Published"

See `SANITY_SETUP.md` for detailed setup instructions.

### Fallback Behavior
When Sanity is not configured (missing `SANITY_PROJECT_ID`):
- All API functions return empty arrays/null gracefully
- Pages render with "Coming Soon" placeholders
- Build process continues without errors
- No broken functionality or build failures

## Image Pipeline (Phase 2.3)

### Responsive Image Components
- **SanityImage**: Base component with responsive srcsets and LQIP (Low Quality Image Placeholders)
- **ResponsiveImage**: Wrapper with aspect ratio and object-fit controls
- **CoverArt**: Specialized component for album covers with hover effects

### Optimization Features
- **Responsive Sizing**: Multiple image sizes served based on screen width
- **Modern Formats**: WebP/AVIF with JPEG fallbacks via Sanity CDN
- **Lazy Loading**: Images load only when entering viewport
- **LQIP Support**: Blurred placeholders for better perceived performance
- **SVG Fallbacks**: Dynamic SVG placeholders when images unavailable

### Performance Benefits
- 60%+ size reduction through format optimization
- Bandwidth savings via responsive image delivery
- Improved Core Web Vitals (LCP, CLS)
- Global CDN delivery through Sanity infrastructure

## Open Graph Images (Phase 2.4)

### Dynamic OG Generation
- **Release OG Images**: Cover art integration with metadata overlay
- **Show OG Images**: Event-focused design with venue and date prominence  
- **Lab OG Images**: Tech-focused with project status and stack display
- **Default OG Images**: Branded fallback for generic pages

### API Endpoints
- `/api/og/release.png?slug=track-name` - Release-specific OG images
- `/api/og/show.png?slug=event-name` - Show/event OG images
- `/api/og/lab.png?slug=project-name` - Lab piece OG images
- `/api/og/default.png?title=...&subtitle=...` - Customizable default images

### Social Platform Optimization
- **Dimensions**: 1200x630px (Facebook, Twitter, LinkedIn standard)
- **Format**: PNG with proper compression
- **Caching**: 1-hour browser, 1-day CDN for optimal performance
- **Fallback**: Error-resistant with branded placeholder generation

### SEO Integration
- Structured JSON-LD data for better search engine understanding
- Platform-specific meta tags (OpenGraph, Twitter Cards)
- Preloading of critical OG images for faster sharing