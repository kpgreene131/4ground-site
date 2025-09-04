# Phase 1: Landing & Brand Implementation

## Objective

Ship a polished, mobile-first landing site with complete branding and core pages powered by local JSON data. Focus on design system implementation, accessibility, and performance optimization.

## Duration

3-5 days

## Scope

### In Scope

- Complete design system implementation with CSS custom properties
- Hero section with compelling CTAs and clear value proposition
- Feature sections showcasing releases, labs, and shows
- Individual release pages with platform links
- Contact form with mailto fallback
- Dark/light mode with system preference detection
- Mobile-first responsive design
- Performance optimization (fonts, images, CSS)
- Accessibility implementation (focus states, screen reader support)
- Content from local JSON files

### Out of Scope

- CMS integration (saved for Phase 2)
- Real audio playback functionality (Phase 3)
- Email capture backend (Phase 4)
- Complex animations or micro-interactions
- Advanced SEO features beyond basic meta tags

## Design System Specification

### Color Palette

```css
:root {
  /* Neutrals */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --gray-950: #030712;

  /* Brand Colors - Inspired by "Waiting" single cover */
  --purple-400: #a855f7; /* Deep violet */
  --purple-500: #8b5cf6; /* Primary purple */
  --purple-600: #7c3aed; /* Darker purple */
  --purple-700: #6d28d9; /* Deep purple */

  --blue-400: #60a5fa; /* Electric blue accent */
  --blue-500: #3b82f6; /* Secondary blue */
  --blue-600: #2563eb; /* Deeper blue */

  --pink-400: #f472b6; /* Hot pink accent */
  --pink-500: #ec4899; /* Fuchsia */
  --pink-600: #db2777; /* Deep pink */

  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: var(--blue-500);

  /* Brand Semantic Usage */
  --primary: var(--purple-500);
  --primary-hover: var(--purple-600);
  --secondary: var(--blue-500);
  --accent: var(--pink-500);
  --gradient-start: var(--purple-700);
  --gradient-end: var(--pink-600);
}
```

### Typography Scale

- **Display**: 4rem (64px) / 1.1 line height for hero titles
- **Heading 1**: 2.5rem (40px) / 1.2 line height
- **Heading 2**: 2rem (32px) / 1.25 line height
- **Heading 3**: 1.5rem (24px) / 1.3 line height
- **Body Large**: 1.25rem (20px) / 1.4 line height
- **Body**: 1rem (16px) / 1.5 line height
- **Small**: 0.875rem (14px) / 1.4 line height
- **Caption**: 0.75rem (12px) / 1.3 line height

### Spacing System

Use Tailwind's default spacing scale (0.25rem base unit):

- **xs**: 0.5rem (8px)
- **sm**: 0.75rem (12px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

### Component Specifications

#### Navigation

- **Desktop**: Horizontal layout with brand left, links right
- **Mobile**: Hamburger menu with slide-out drawer
- **States**: Default, hover, active, focus-visible
- **Touch targets**: Minimum 44px height/width
- **Sticky behavior**: Header stays pinned on scroll

#### Buttons

- **Primary**: White bg, dark text, hover state
- **Secondary**: Border outline, transparent bg, hover state
- **Sizes**: Small (32px), Medium (44px), Large (52px)
- **Focus**: Visible outline ring, high contrast

#### Cards

- **Background**: Gray-800 with subtle border
- **Padding**: 1.5rem (24px) on mobile, 2rem (32px) on desktop
- **Border radius**: 0.5rem (8px)
- **Hover**: Subtle elevation change via box-shadow

## Page Requirements

### Homepage (`/`)

- **Hero Section**:
  - 4ground wordmark (large, bold typography)
  - Tagline: "Electronic music producer crafting immersive soundscapes and interactive audio experiences"
  - Primary CTA: "Listen Now" → `/releases`
  - Secondary CTA: "Explore Labs" → `/labs`
- **Feature Grid**: 3-column on desktop, 1-column on mobile
  - Latest Releases card → `/releases`
  - Audio Labs card → `/labs`
  - Live Shows card → `/shows`
- **Performance**: Hero loads in <1s, full page in <2s

### Labs Page (`/labs`)

- **Header**: Title + description of interactive audio tools
- **Feature Grid**: Showcase stem visualizer capabilities
- **Demo Section**: StemVisualizerPlaceholder component
- **Coming Soon**: Preview of future lab experiments
- **Mobile**: Touch-optimized demo controls

### Release Page (`/releases/[slug]`)

- **Two-column layout**: Content left, cover art + player right
- **Metadata**: Release date, BPM, key, duration displayed clearly
- **Platform Links**: Bandcamp, Spotify, Apple Music, SoundCloud
- **Interactive Player**: StemVisualizerPlaceholder with track data
- **Mobile**: Stacked layout with cover art first

### Shows Page (`/shows`)

- **Event Listings**: Date, venue, location, status
- **CTA**: Contact for booking inquiries
- **Placeholder**: "Coming Soon" message for future dates
- **Mobile**: Card-based layout for easy scanning

### Contact Page (`/contact`)

- **Contact Methods**: Email links for general/booking inquiries
- **Form**: Name, email, subject dropdown, message textarea
- **Submission**: mailto: action with pre-filled subject
- **Accessibility**: Proper labels, error states, focus management

## Accessibility Requirements

### WCAG 2.1 AA Compliance

- **Color Contrast**: All text has ≥4.5:1 contrast ratio
- **Keyboard Navigation**: All interactive elements accessible via Tab
- **Focus Indicators**: Visible focus rings on all focusable elements
- **Touch Targets**: Minimum 44x44px for mobile interaction
- **Screen Reader**: Proper landmarks, headings hierarchy, alt text
- **Motion**: Respect `prefers-reduced-motion` setting

### Implementation Checklist

- [ ] Skip to main content link
- [ ] Proper heading structure (h1 → h2 → h3)
- [ ] Alt text for all decorative and informative images
- [ ] ARIA labels for interactive components
- [ ] Focus management for mobile menu
- [ ] Color not sole indicator of information
- [ ] Form validation with clear error messages

## Performance Budget

### Loading Metrics

- **First Contentful Paint**: <1.5s on 4G
- **Largest Contentful Paint**: <2.0s on 4G
- **First Input Delay**: <100ms
- **Cumulative Layout Shift**: <0.1

### Asset Budget

- **JavaScript**: ≤80KB compressed (first load)
- **CSS**: ≤50KB compressed
- **Images**: ≤300KB total on homepage
- **Fonts**: ≤100KB total, use font-display: swap

### Optimization Strategies

- **Images**: Modern formats (WebP/AVIF) with fallbacks
- **CSS**: Critical path inlined, non-critical deferred
- **Fonts**: Preload primary font, subset unused characters
- **JavaScript**: Code splitting, lazy load non-critical components

## Mobile-First Implementation

### Breakpoints

- **Mobile**: 0-639px (base styles)
- **Tablet**: 640px-1023px (`sm:` prefix)
- **Desktop**: 1024px+ (`lg:` prefix)
- **Large**: 1280px+ (`xl:` prefix)

### Mobile Considerations

- **Navigation**: Hamburger menu with accessible toggle
- **Typography**: Larger base font size (18px) for readability
- **Touch**: All targets ≥44px, adequate spacing between elements
- **Performance**: Lazy load below-fold content
- **Viewport**: Proper meta viewport tag, no horizontal scroll

## Testing Strategy

### Manual Testing

1. **Visual regression**: Compare against design mockups
2. **Responsive**: Test all breakpoints, rotate device orientation
3. **Keyboard navigation**: Tab through all interactive elements
4. **Screen reader**: Test with VoiceOver/NVDA
5. **Performance**: Lighthouse audits on 4G throttled connection

### Browser Testing Matrix

- **Desktop**: Chrome 90+, Firefox 90+, Safari 14+
- **Mobile**: iOS Safari 14+, Android Chrome 90+
- **Tools**: BrowserStack for cross-browser validation

### Automated Testing

- **Accessibility**: axe-core integration in CI/CD
- **Performance**: Lighthouse CI with budget enforcement
- **Visual**: Chromatic or similar for component testing

## Acceptance Criteria

### Functionality

- [ ] All navigation links work correctly
- [ ] Hero CTAs lead to appropriate pages
- [ ] Contact form submits via mailto with proper formatting
- [ ] Release page displays sample data correctly
- [ ] StemVisualizerPlaceholder renders and responds to interactions

### Design & UX

- [ ] Site matches brand aesthetic across all pages
- [ ] Typography scales appropriately at all breakpoints
- [ ] Color scheme provides sufficient contrast
- [ ] Interactive elements have clear hover/focus states
- [ ] Mobile navigation is intuitive and accessible

### Performance

- [ ] Lighthouse score ≥90 for Performance, Accessibility, SEO
- [ ] No console errors or warnings
- [ ] Page load times meet budget on simulated 4G
- [ ] Images are properly optimized and responsive

### Accessibility

- [ ] Passes axe-core automated testing
- [ ] Keyboard navigation works for all functionality
- [ ] Screen reader announces content appropriately
- [ ] Color contrast meets WCAG AA standards
- [ ] Touch targets are appropriately sized

### Responsive Design

- [ ] Layout works down to 320px width
- [ ] No horizontal scrolling at any breakpoint
- [ ] Navigation collapses appropriately on mobile
- [ ] Content remains readable at all sizes
- [ ] Images scale without distortion

### Code Quality

- [ ] HTML validates without errors
- [ ] CSS follows established conventions
- [ ] TypeScript compiles without errors
- [ ] Prettier/ESLint rules followed consistently
- [ ] Components are reusable and well-documented

## Tasks & Estimates

### Design System Implementation (1-2 days)

- [ ] CSS custom properties for colors, typography, spacing (4h)
- [ ] Component styles: buttons, cards, forms, navigation (6h)
- [ ] Dark mode implementation with system preference (3h)
- [ ] Focus states and accessibility styling (2h)

### Page Development (1-2 days)

- [ ] Homepage hero section and feature grid (4h)
- [ ] Labs page with demo integration (3h)
- [ ] Release detail page layout and content (3h)
- [ ] Shows and contact pages (2h)
- [ ] Navigation component with mobile menu (3h)

### Performance & Polish (1 day)

- [ ] Image optimization and responsive implementation (3h)
- [ ] Font loading optimization (2h)
- [ ] CSS optimization and critical path (2h)
- [ ] Accessibility audit and fixes (2h)

## How to Test

### Development Testing

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Format code
npm run format
```

### Manual Testing Checklist

1. **Homepage**: Verify hero loads quickly, CTAs work, feature cards display
2. **Navigation**: Test mobile menu toggle, all links navigate correctly
3. **Release page**: Verify sample release data displays, player component loads
4. **Contact form**: Test form submission opens email client correctly
5. **Responsive**: Test at 320px, 768px, 1024px, 1440px widths
6. **Keyboard**: Tab through all interactive elements, verify focus states
7. **Performance**: Run Lighthouse audit, verify scores meet budget

### Success Metrics

- **Lighthouse Performance**: ≥90
- **Lighthouse Accessibility**: ≥95
- **Lighthouse SEO**: ≥90
- **Core Web Vitals**: All green in PageSpeed Insights
- **Manual Accessibility**: No blocking issues found
