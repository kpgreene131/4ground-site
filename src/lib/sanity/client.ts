import { createClient } from '@sanity/client';

const projectId =
  import.meta.env.SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '';
const dataset =
  import.meta.env.SANITY_DATASET || process.env.SANITY_DATASET || 'production';

// Only create client if we have a project ID
export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion:
        import.meta.env.SANITY_API_VERSION ||
        process.env.SANITY_API_VERSION ||
        '2024-01-01',
      useCdn: false, // Use false for development, true for production
      token:
        import.meta.env.SANITY_TOKEN || process.env.SANITY_TOKEN || undefined,
    })
  : null;

// Helper function to build image URLs from Sanity
export function urlFor(source: any) {
  if (!source?.asset) return '';

  // If asset has url directly (from expanded query), use it
  if (source.asset.url) {
    return source.asset.url;
  }

  // Otherwise try to build from _ref
  if (source.asset._ref) {
    const match = source.asset._ref.match(/^image-([a-f\d]+)-(\d+x\d+)-(\w+)$/);
    if (!match) return '';

    const [, id, dimensions, format] = match;

    // Use hardcoded values if sanityClient is null
    const projectId = sanityClient?.config().projectId || 'tb9ybfxu';
    const dataset = sanityClient?.config().dataset || 'production';

    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  }

  return '';
}

// Helper to get optimized image URL with parameters
export function getOptimizedImageUrl(
  source: any,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png' | 'auto';
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
    crop?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint';
    blur?: number;
    sharpen?: number;
  } = {}
) {
  const baseUrl = urlFor(source);
  if (!baseUrl) return '';

  // If no options specified, return base URL
  if (Object.keys(options).length === 0) {
    return baseUrl;
  }

  const params = new URLSearchParams();

  if (options.width) params.append('w', options.width.toString());
  if (options.height) params.append('h', options.height.toString());
  if (options.quality) params.append('q', options.quality.toString());
  if (options.format && options.format !== 'auto')
    params.append('fm', options.format);
  if (options.fit) params.append('fit', options.fit);
  if (options.crop) params.append('crop', options.crop);
  if (options.blur) params.append('blur', options.blur.toString());
  if (options.sharpen) params.append('sharpen', options.sharpen.toString());

  return `${baseUrl}?${params.toString()}`;
}

// Generate responsive image srcset for different screen sizes
export function getResponsiveImageUrls(
  source: any,
  sizes: number[] = [400, 800, 1200, 1600],
  options: {
    quality?: number;
    format?: 'webp' | 'jpg' | 'png' | 'auto';
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  } = {}
) {
  if (!source?.asset) return { src: '', srcset: '', sizes: '' };

  const srcset = sizes
    .map(
      (size) =>
        `${getOptimizedImageUrl(source, { ...options, width: size })} ${size}w`
    )
    .join(', ');

  const sizesAttr = [
    '(max-width: 640px) 400px',
    '(max-width: 1024px) 800px',
    '(max-width: 1440px) 1200px',
    '1600px',
  ].join(', ');

  return {
    src: getOptimizedImageUrl(source, { ...options, width: 800 }), // fallback
    srcset,
    sizes: sizesAttr,
  };
}

// Generate low quality image placeholder (LQIP)
export function getLqipUrl(source: any): string {
  return getOptimizedImageUrl(source, {
    width: 20,
    quality: 20,
    blur: 5,
    format: 'jpg',
  });
}

// Check if Sanity is properly configured
export const isSanityConfigured = !!projectId;
