# 4ground Site - Project Overview & Roadmap

## Project Vision
Create an immersive digital platform for 4ground's electronic music, featuring interactive stem players, audio visualizations, and cutting-edge web audio experiences.

## Core Principles
- **Audio-first**: Every design decision prioritizes audio quality and interactivity
- **Performance**: Sub-2s loading times, smooth 60fps audio visualizations
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- **Mobile-first**: Responsive design with touch-optimized controls
- **Progressive enhancement**: Works without JavaScript, enhanced with Web Audio API

---

## Phase Breakdown

### Phase 0 - Scaffold & Foundations ✅
**Duration**: 1-2 days  
**Status**: Complete

#### Scope
- Astro + Tailwind + React integration
- Base layout with SEO, OG tags, responsive navigation
- Placeholder pages with proper routing structure
- Analytics stub preparation
- Performance budget establishment

#### Deliverables
- [x] Astro project with Tailwind CSS
- [x] BaseLayout with meta tags and responsive navigation
- [x] Pages: `/`, `/labs`, `/releases/[slug]`, `/shows`, `/contact`
- [x] StemVisualizerPlaceholder React component
- [x] Sample release data structure

#### Performance Budget
- First load JS ≤ 80KB
- CSS ≤ 50KB  
- Images ≤ 300KB on landing page
- LCP ≤ 2.0s on 4G simulated
- CLS < 0.1

#### Definition of Done
- [x] All pages render to static HTML
- [x] Responsive navigation (mobile hamburger menu)
- [x] Proper semantic HTML structure
- [x] Lighthouse score ≥ 90 for performance/SEO
- [x] No accessibility violations in axe-core

---

### Phase 1 - Landing & Brand (mobile-first)
**Duration**: 3-5 days  
**Status**: Ready to start

#### Scope
- Complete visual design system implementation
- Typography, color tokens, spacing system
- Hero section with compelling CTA journey
- Dark mode with system preference detection
- Content from local JSON files

#### Out-of-scope
- CMS integration (Phase 2)
- Real audio playback (Phase 3)
- Email capture backend (Phase 4)

#### Deliverables
- [ ] Design system: CSS custom properties for colors, typography, spacing
- [ ] Hero section with animated wordmark and clear value proposition
- [ ] Feature cards showcasing releases, labs, shows
- [ ] Release detail page with platform links
- [ ] Contact form with mailto fallback
- [ ] Dark/light mode toggle with system preference
- [ ] Focus visible states for all interactive elements

#### Risks & Mitigations
- **Risk**: Design decisions slow development
- **Mitigation**: Use proven design patterns, iterate in code

#### Performance Budget
- Same as Phase 0
- Add: Font loading optimization (font-display: swap)
- Add: Image optimization pipeline

#### Accessibility Requirements
- Color contrast ratio ≥ 4.5:1 (AA)
- Touch targets ≥ 44px
- Keyboard navigation for all interactive elements
- `prefers-reduced-motion` support
- Screen reader announcements for state changes

#### Definition of Done
- [ ] All pages scale cleanly to 320px width
- [ ] Header navigation collapses properly on mobile
- [ ] Open Graph tags render correctly for all pages
- [ ] Form submissions work via mailto
- [ ] No console errors or warnings
- [ ] Passes manual accessibility audit
- [ ] Achieves performance budget targets
- [ ] Works without JavaScript (progressive enhancement)

---

### Phase 2 - CMS Integration (Sanity)
**Duration**: 4-6 days  
**Status**: Planned

#### Scope
- Sanity Studio setup with schemas
- Build-time content fetching
- Image optimization pipeline
- OG image generation per release
- Preview mode preparation

#### Content Models
- `release`: title, slug, date, BPM, key, description, cover, platforms, stems
- `show`: title, date, venue, location, status, tickets
- `labPiece`: title, description, demo_url, tech_stack

#### Deliverables
- [ ] Sanity project setup and schemas
- [ ] Astro content collections integration
- [ ] Image pipeline with Sanity CDN
- [ ] Dynamic OG image generation
- [ ] Environment variable configuration
- [ ] Content migration from JSON

#### Definition of Done
- [ ] All content pulled from Sanity on build
- [ ] Images optimized and responsive
- [ ] OG images generated per release
- [ ] Build time < 60s with full content
- [ ] Preview mode functional (optional)

---

### Phase 3 - Visualizer MVP (Client-only)
**Duration**: 7-10 days  
**Status**: Planned

#### Scope
- Web Audio API implementation
- Per-stem playback control (mute/solo/gain)
- 3-band EQ with kill switches
- Macro LPF sweep knob with reverb send automation
- Reverb and delay FX buses
- Beat-synced control quantization
- Lite mode for mobile performance
- Canvas-based frequency visualization

#### Technical Architecture
```
Audio Context
├── Master Gain Node
├── Per-Stem Chains
│   ├── Source Buffer → Gain → EQ → FX Sends → Master
│   └── EQ: Low/Mid/High BiquadFilter nodes
├── FX Buses
│   ├── Reverb: ConvolverNode + feedback
│   └── Delay: DelayNode + feedback + filtering
└── Analyzer Node → Canvas Visualization
```

#### Stem Processing
- Load WAV/MP3 stems via fetch + AudioContext.decodeAudioData
- Sync playback using AudioContext.currentTime
- Quantize control changes to 1/8 note grid (128 BPM baseline)
- Fallback to mixed track if stem loading fails

#### Mobile Optimizations (Lite Mode)
- Disable reverb/delay processing
- Reduce FFT size (512 → 256)
- Simplified visualization
- Touch-optimized sliders replace knobs

#### Performance Requirements
- CPU usage <60% on mid-tier mobile
- Memory usage <100MB total
- Smooth 60fps visualization on desktop
- 30fps minimum on mobile
- Network: <20MB total for 4 stems

#### Acceptance Criteria
- [ ] All stems stay perfectly synchronized
- [ ] EQ knobs respond smoothly to mouse/touch
- [ ] Macro knob automation is beat-synced and audible
- [ ] Lite mode maintains >30fps on mid-tier Android
- [ ] Works in iOS Safari, Android Chrome, desktop browsers
- [ ] Clear error states if audio fails to load
- [ ] Fallback to mixed track if stems unavailable
- [ ] Keyboard controls for play/pause/mute

#### Definition of Done
- [ ] QA pass on iOS Safari, Android Chrome, desktop
- [ ] Performance budget met on target devices
- [ ] Audio processing chain documented
- [ ] Error handling covers all failure modes
- [ ] Accessibility: keyboard navigation, screen reader support

---

### Phase 4 - Integrations & Polish
**Duration**: 3-4 days  
**Status**: Future

#### Scope
- Bandcamp/Spotify/Apple Music embeds
- EPK (Electronic Press Kit) page if needed
- Email newsletter capture
- Map integration for show locations
- Structured data (schema.org)

#### Deliverables
- [ ] Platform embeds with fallback links
- [ ] Email capture with backend integration
- [ ] Show locations with map display
- [ ] Rich snippets for releases and shows
- [ ] EPK page with downloadable assets

#### Definition of Done
- [ ] All platform embeds functional
- [ ] Rich snippets validate in testing tools
- [ ] Email capture integrated with service
- [ ] Show maps display correctly

---

### Phase 5 - Deployment & Observability
**Duration**: 2-3 days  
**Status**: Future

#### Scope
- Vercel deployment with custom domain
- CDN configuration for audio files
- Analytics integration (Plausible)
- Error monitoring and performance tracking
- Cache strategy optimization

#### Infrastructure
- **Domain**: 4ground.xyz
- **Hosting**: Vercel (Astro support)
- **CDN**: Cloudflare R2 for audio files
- **Analytics**: Plausible (privacy-focused)
- **Monitoring**: Sentry for error tracking

#### Deliverables
- [ ] Production deployment pipeline
- [ ] Custom domain with SSL
- [ ] Audio CDN integration
- [ ] Analytics dashboard
- [ ] Error monitoring setup
- [ ] Performance monitoring

#### Definition of Done
- [ ] Site accessible at 4ground.xyz
- [ ] Audio files load from CDN
- [ ] Analytics tracking pageviews
- [ ] Error reporting functional
- [ ] Cache headers optimized

---

## Success Metrics

### Technical
- **Performance**: LCP < 2s, FID < 100ms, CLS < 0.1
- **Accessibility**: WCAG 2.1 AA compliance, no axe-core violations
- **Audio Quality**: 48kHz+ sample rate, minimal latency (<50ms)
- **Browser Support**: Chrome/Firefox/Safari on desktop, Chrome/Safari on mobile

### Business
- **Engagement**: >3min average session duration
- **Discovery**: Release page views correlate with platform streams
- **Technical**: Stem visualizer usage indicates feature adoption
- **Growth**: Email signups for new release notifications

## Risk Assessment

### High Risk
- **Web Audio API browser compatibility**: Mitigation via comprehensive testing and fallbacks
- **Mobile audio performance**: Mitigation via Lite mode and aggressive optimization
- **Stem file size/bandwidth**: Mitigation via compression and progressive loading

### Medium Risk  
- **Design complexity vs. development time**: Mitigation via iterative approach
- **Content migration from JSON to CMS**: Mitigation via automated scripts

### Low Risk
- **Third-party service integrations**: Well-documented APIs
- **Deployment complexity**: Vercel has excellent Astro support