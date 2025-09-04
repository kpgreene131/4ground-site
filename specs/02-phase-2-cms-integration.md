# Phase 2 - CMS Integration with Sanity

**Duration**: 4-6 days  
**Status**: Ready to start  
**Priority**: High

## Overview

Phase 2 transitions the 4ground site from static JSON content to a dynamic CMS-powered system using Sanity. This enables content management capabilities while maintaining the excellent performance and SEO benefits established in Phase 1.

## Objectives

1. **Content Management**: Replace static JSON with Sanity CMS for scalable content updates
2. **Image Pipeline**: Implement optimized image delivery with responsive formats
3. **Dynamic OG Images**: Generate unique social sharing images per release
4. **Build Performance**: Maintain fast build times while adding CMS integration
5. **Content Migration**: Seamlessly migrate existing content without data loss

## Technical Architecture

### Content Management Stack

```
Sanity Studio (CMS)
    ↓ Build-time Fetch
Astro Content Collections
    ↓ Static Generation
Optimized Static Site
    ↓ CDN Delivery
End User Experience
```

### Content Models

#### Release Schema

```typescript
{
  title: string;
  slug: string;
  releaseDate: datetime;
  bpm: number;
  key: string;
  duration: string;
  description: text;
  coverImage: image;
  platformLinks: array<{
    platform: string;
    url: url;
  }>;
  stems: array<{
    name: string;
    audioFile: file;
  }>;
  tags: array<string>;
  isPublished: boolean;
}
```

#### Show Schema

```typescript
{
  title: string;
  slug: string;
  showDate: datetime;
  venue: string;
  city: string;
  country: string;
  ticketUrl?: url;
  status: 'upcoming' | 'past' | 'cancelled';
  description?: text;
  flyer?: image;
  isPublished: boolean;
}
```

#### Lab Piece Schema

```typescript
{
  title: string;
  slug: string;
  description: text;
  demoUrl?: url;
  techStack: array<string>;
  thumbnail: image;
  isActive: boolean;
  isPublished: boolean;
}
```

## Implementation Plan

### Phase 2.1 - Sanity Setup & Schemas (1-2 days)

- [ ] Create Sanity project and configure Studio
- [ ] Define content schemas with proper validation
- [ ] Set up image CDN and file handling
- [ ] Configure preview mode preparation
- [ ] Test content creation and management

### Phase 2.2 - Astro Integration (1-2 days)

- [ ] Install Sanity client for Astro
- [ ] Create data fetching functions for build-time
- [ ] Update Astro content collections to use Sanity
- [ ] Implement environment variable configuration
- [ ] Add error handling for missing content

### Phase 2.3 - Image Pipeline (1 day)

- [ ] Configure Sanity CDN for optimized delivery
- [ ] Implement responsive image components
- [ ] Add proper alt text and loading attributes
- [ ] Test image optimization across device sizes
- [ ] Implement fallback for missing images

### Phase 2.4 - OG Image Generation (1 day)

- [ ] Create dynamic OG image templates
- [ ] Generate images per release with cover art
- [ ] Implement caching strategy for generated images
- [ ] Test social sharing across platforms
- [ ] Add fallback OG images

### Phase 2.5 - Content Migration & Testing (1 day)

- [ ] Migrate existing JSON data to Sanity
- [ ] Verify all pages render correctly
- [ ] Test build performance with full content
- [ ] Validate SEO and meta tag generation
- [ ] Perform comprehensive QA

## Technical Requirements

### Performance Budget

- **Build Time**: < 60 seconds with full content
- **Image Optimization**: WebP/AVIF with fallbacks
- **Bundle Size**: No increase from Phase 1
- **LCP**: Maintain < 2s target
- **CDN**: Sanity CDN for global image delivery

### Content Validation

- Required fields enforced at schema level
- URL validation for external links
- Image dimension and file size limits
- Slug uniqueness validation
- Publication status controls

### Error Handling

- Graceful fallbacks for missing content
- Build-time validation with helpful error messages
- Content draft/preview mode preparation
- Offline content caching strategy

## Integration Points

### Existing Systems

- **Astro Content Collections**: Update to fetch from Sanity
- **Image Components**: Enhance with Sanity CDN URLs
- **Navigation**: Dynamic menu based on published content
- **Sitemap**: Auto-generation based on published content

### Future Phases

- **Phase 3**: Stem audio files managed via Sanity
- **Phase 4**: Newsletter signups stored in Sanity
- **Phase 5**: Analytics data visualization in Studio

## Content Strategy

### Content Types Priority

1. **Releases** (High): Core business content, drives traffic
2. **Shows** (Medium): Event-driven content with time sensitivity
3. **Lab Pieces** (Low): Portfolio content, less frequent updates

### Publishing Workflow

1. Content created in Sanity Studio
2. Preview mode for staging review
3. Published status triggers rebuild
4. Content appears on live site within 5 minutes

## Quality Assurance

### Content QA Checklist

- [ ] All release pages render with correct metadata
- [ ] Show pages display proper date/time formatting
- [ ] Lab pieces link to functional demos
- [ ] Images load optimized formats with proper alt text
- [ ] Social sharing generates correct OG images
- [ ] Build process handles missing/draft content gracefully

### Performance Testing

- [ ] Build time remains under 60 seconds
- [ ] Image loading maintains LCP targets
- [ ] Mobile performance unchanged
- [ ] CDN cache headers configured correctly

## Success Metrics

### Technical

- **Build Time**: < 60s consistently
- **Image Optimization**: 60%+ size reduction vs original
- **Content Freshness**: Updates live within 5 minutes
- **Error Rate**: < 1% failed builds

### Content Management

- **Editor Experience**: Content updates possible without technical knowledge
- **Preview Accuracy**: Preview matches production exactly
- **Workflow Efficiency**: Publish workflow takes < 5 minutes

## Risk Mitigation

### High Risk: Build Performance Degradation

- **Mitigation**: Implement incremental builds and content caching
- **Fallback**: Static JSON fallback if Sanity fails

### Medium Risk: Content Migration Issues

- **Mitigation**: Comprehensive migration scripts with validation
- **Fallback**: Manual content entry with verification steps

### Low Risk: Image CDN Performance

- **Mitigation**: Multi-CDN strategy with fallbacks
- **Testing**: Load testing with various image sizes and formats

## Definition of Done

### Technical Requirements

- [ ] All content pulled from Sanity during build
- [ ] Images optimized and served via CDN
- [ ] OG images generated for each release
- [ ] Build time under 60 seconds
- [ ] Preview mode functional
- [ ] Environment variables properly configured

### Content Requirements

- [ ] All existing content migrated successfully
- [ ] Content editing workflow documented
- [ ] Published/draft status working correctly
- [ ] Image alt text and metadata populated
- [ ] URL structure maintained (no broken links)

### Quality Assurance

- [ ] Manual testing of all content types
- [ ] Performance budget targets met
- [ ] SEO metadata validates correctly
- [ ] Social sharing works across platforms
- [ ] Build process resilient to content errors

## Next Steps

Upon completion of Phase 2, the site will be ready for Phase 3 (Interactive Audio Visualizer) with a robust content management foundation that can scale as the 4ground catalog grows.
