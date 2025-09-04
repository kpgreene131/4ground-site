// Utility functions for generating placeholder images and handling fallbacks

export function generatePlaceholderSvg(
  width: number = 800,
  height: number = 800,
  text: string = 'Image',
  backgroundColor: string = '#1a1a1a',
  textColor: string = '#666666'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text x="50%" y="50%" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="${Math.min(width, height) * 0.1}" 
            fill="${textColor}" 
            text-anchor="middle" 
            dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;

  // Use encodeURIComponent instead of btoa for better compatibility
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function generateCoverArtPlaceholder(size: number = 800): string {
  return generatePlaceholderSvg(size, size, '♪', '#0f0f0f', '#333333');
}

export function generateFlyerPlaceholder(
  width: number = 600,
  height: number = 800
): string {
  return generatePlaceholderSvg(width, height, 'EVENT', '#1a1a1a', '#444444');
}

export function generateThumbnailPlaceholder(
  width: number = 400,
  height: number = 300
): string {
  return generatePlaceholderSvg(width, height, 'LAB', '#0d1117', '#3d444d');
}

// Image loading error handler
export function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  if (img && !img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = 'true';

    // Determine appropriate fallback based on classes or data attributes
    if (img.classList.contains('cover-art') || img.dataset.type === 'cover') {
      img.src = generateCoverArtPlaceholder();
    } else if (
      img.classList.contains('flyer') ||
      img.dataset.type === 'flyer'
    ) {
      img.src = generateFlyerPlaceholder();
    } else if (
      img.classList.contains('thumbnail') ||
      img.dataset.type === 'thumbnail'
    ) {
      img.src = generateThumbnailPlaceholder();
    } else {
      img.src = generatePlaceholderSvg(400, 400, 'No Image');
    }

    img.alt = img.alt || 'Placeholder image';
  }
}

// Preload critical images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Generate srcset for static images (non-Sanity)
export function generateStaticSrcSet(
  baseSrc: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string {
  // For static images, we can't generate different sizes dynamically
  // Return the base source for all sizes as fallback
  return sizes.map((size) => `${baseSrc} ${size}w`).join(', ');
}

// Check if image URL is valid
export async function isValidImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return (
      response.ok &&
      response.headers.get('content-type')?.startsWith('image/') === true
    );
  } catch {
    return false;
  }
}
