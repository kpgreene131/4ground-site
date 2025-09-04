# 4ground Site

Electronic music producer site featuring interactive stem visualizers and immersive audio experiences.

## 🎵 Features

- **Interactive Stem Player**: Per-track volume, EQ, and effects control
- **Audio Labs**: Experimental visualizers and web audio tools
- **Mobile Optimized**: Touch-friendly controls with performance modes
- **Accessible**: WCAG 2.1 AA compliant with keyboard navigation
- **Fast**: <2s load times with optimized assets and caching

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   └── StemVisualizerPlaceholder.tsx
├── content/            # Static content (JSON, Markdown)
│   └── releases/       # Release metadata
├── layouts/            # Astro layout components
│   └── BaseLayout.astro
├── pages/              # File-based routing
│   ├── index.astro     # Homepage
│   ├── labs.astro      # Interactive audio tools
│   ├── shows.astro     # Live performance info
│   ├── contact.astro   # Contact form
│   └── releases/       # Dynamic release pages
└── styles/             # Global CSS
```

## 🛠 Tech Stack

- **Framework**: [Astro](https://astro.build) - Content-focused static site generator
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **Interactivity**: [React](https://react.dev) - Component-based UI (islands)
- **Audio**: [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Real-time audio processing
- **Deployment**: [Vercel](https://vercel.com) - Serverless hosting platform

## 📋 Available Scripts

```bash
npm run dev        # Start development server (localhost:4321)
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run lint       # Check code formatting
npm run format     # Format code with Prettier
npm run astro      # Run Astro CLI commands
```

## 🎯 Performance Targets

- **First Load JS**: ≤ 80KB compressed
- **CSS Bundle**: ≤ 50KB compressed
- **Images**: ≤ 300KB on homepage
- **LCP**: < 2.0s on 4G simulated
- **Lighthouse**: ≥ 90 Performance/SEO

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation for all interactive elements
- Screen reader support with proper ARIA labels
- High contrast color scheme (4.5:1 minimum)
- Touch targets ≥ 44px on mobile
- Respects `prefers-reduced-motion` setting

## 📱 Browser Support

### Tier 1 (Full Features)

- Chrome 66+ (Desktop & Android)
- Firefox 60+ (Desktop)
- Safari 14.1+ (macOS & iOS)
- Edge 79+ (Chromium-based)

### Tier 2 (Lite Mode)

- Safari 13+ (Limited Web Audio API)
- Older mobile browsers (Fallback experience)

## 🔧 Development

### Adding New Releases

1. Create JSON file in `src/content/releases/`:

```json
{
  "title": "Track Name",
  "slug": "track-name",
  "releaseDate": "2024-01-15",
  "bpm": 128,
  "key": "Am",
  "duration": "4:03",
  "description": "Track description...",
  "coverUrl": "https://...",
  "platformLinks": [...],
  "stems": [...]
}
```

2. Add route in `src/pages/releases/[slug].astro`:

```javascript
export function getStaticPaths() {
  return [{ params: { slug: 'track-name' }, props: { release: trackData } }];
}
```

## 📊 Project Phases

### ✅ Phase 0: Scaffold & Foundations

Basic Astro setup with pages and placeholder content

### 🚧 Phase 1: Landing & Brand

Complete design system and content from local JSON

### 📋 Phase 2: CMS Integration

Sanity headless CMS for content management

### 🎛️ Phase 3: Visualizer MVP

Interactive stem player with Web Audio API

### 🔗 Phase 4: Integrations

Platform embeds, email capture, structured data

### 🚀 Phase 5: Deployment & Observability

Production deployment with monitoring

## 📝 Documentation

Comprehensive specs available in [`specs/`](./specs/) folder:

- [`00-overview-roadmap.md`](./specs/00-overview-roadmap.md) - Full project roadmap
- [`phase-1-landing.md`](./specs/phase-1-landing.md) - Landing page implementation
- [`phase-3-visualizer.md`](./specs/phase-3-visualizer.md) - Interactive stem player

---

Built with ❤️ and Web Audio API
