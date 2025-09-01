import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';
import { DefaultOGTemplate } from '../../../lib/og/templates';

export const GET: APIRoute = async ({ url, request }) => {
  try {
    const { searchParams } = new URL(url);
    
    const title = searchParams.get('title') || '4ground';
    const subtitle = searchParams.get('subtitle') || 'Electronic Music & Audio Innovation';
    const type = searchParams.get('type') || 'website';

    return new ImageResponse(
      DefaultOGTemplate({
        title,
        subtitle,
        type,
      }),
      {
        width: 1200,
        height: 630,
        // Cache for 1 day in browser, 1 week on CDN
        headers: {
          'cache-control': 'public, max-age=86400, s-maxage=604800',
        },
      }
    );
  } catch (error) {
    console.error('Default OG image generation error:', error);
    
    // Return a basic fallback
    return new ImageResponse(
      DefaultOGTemplate({}),
      {
        width: 1200,
        height: 630,
      }
    );
  }
};