// Utility functions for generating Open Graph image URLs

const baseUrl =
  import.meta.env.SITE || process.env.SITE || 'http://localhost:4321';

export interface OGImageOptions {
  width?: number;
  height?: number;
  quality?: number;
}

export function getReleaseOGImageUrl(
  slug: string,
  options: OGImageOptions = {}
): string {
  const params = new URLSearchParams();
  params.set('slug', slug);

  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());
  if (options.quality) params.set('quality', options.quality.toString());

  return `${baseUrl}/api/og/release.png?${params.toString()}`;
}

export function getShowOGImageUrl(
  slug: string,
  options: OGImageOptions = {}
): string {
  const params = new URLSearchParams();
  params.set('slug', slug);

  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());
  if (options.quality) params.set('quality', options.quality.toString());

  return `${baseUrl}/api/og/show.png?${params.toString()}`;
}

export function getLabPieceOGImageUrl(
  slug: string,
  options: OGImageOptions = {}
): string {
  const params = new URLSearchParams();
  params.set('slug', slug);

  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());
  if (options.quality) params.set('quality', options.quality.toString());

  return `${baseUrl}/api/og/lab.png?${params.toString()}`;
}

export function getDefaultOGImageUrl(
  options: {
    title?: string;
    subtitle?: string;
    type?: string;
  } & OGImageOptions = {}
): string {
  const params = new URLSearchParams();

  if (options.title) params.set('title', options.title);
  if (options.subtitle) params.set('subtitle', options.subtitle);
  if (options.type) params.set('type', options.type);
  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());
  if (options.quality) params.set('quality', options.quality.toString());

  return `${baseUrl}/api/og/default.png?${params.toString()}`;
}

// Generate Twitter Card compatible images (different aspect ratio)
export function getTwitterCardImageUrl(
  type: 'release' | 'show' | 'lab' | 'default',
  slug?: string
): string {
  const options = { width: 1200, height: 600 }; // Twitter's preferred size

  switch (type) {
    case 'release':
      return slug
        ? getReleaseOGImageUrl(slug, options)
        : getDefaultOGImageUrl(options);
    case 'show':
      return slug
        ? getShowOGImageUrl(slug, options)
        : getDefaultOGImageUrl(options);
    case 'lab':
      return slug
        ? getLabPieceOGImageUrl(slug, options)
        : getDefaultOGImageUrl(options);
    default:
      return getDefaultOGImageUrl(options);
  }
}

// Preload critical OG images
export function preloadOGImage(url: string): void {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  }
}

// Validate OG image URL
export function validateOGImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.pathname.includes('/api/og/') &&
      parsedUrl.pathname.endsWith('.png')
    );
  } catch {
    return false;
  }
}

// Generate structured data for better social sharing
export function generateOpenGraphTags(options: {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  type?: string;
  siteName?: string;
  twitterHandle?: string;
}) {
  const {
    title,
    description,
    imageUrl,
    url,
    type = 'website',
    siteName = '4ground',
    twitterHandle = '@4ground',
  } = options;

  return {
    // Open Graph
    'og:title': title,
    'og:description': description,
    'og:image': imageUrl,
    'og:url': url,
    'og:type': type,
    'og:site_name': siteName,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',

    // Twitter Card
    'twitter:card': 'summary_large_image',
    'twitter:site': twitterHandle,
    'twitter:creator': twitterHandle,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': imageUrl,

    // Additional
    'theme-color': '#00ff88',
  };
}

// Cache management for OG images
export class OGImageCache {
  private static instance: OGImageCache;
  private cache = new Map<string, string>();
  private maxAge = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): OGImageCache {
    if (!OGImageCache.instance) {
      OGImageCache.instance = new OGImageCache();
    }
    return OGImageCache.instance;
  }

  set(key: string, url: string): void {
    this.cache.set(key, url);

    // Auto-cleanup after maxAge
    setTimeout(() => {
      this.cache.delete(key);
    }, this.maxAge);
  }

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}
