import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';
import { ReleaseOGTemplate } from '../../../lib/og/templates';
import { getReleaseBySlug } from '../../../lib/sanity/api';
import { urlFor } from '../../../lib/sanity/client';

export const GET: APIRoute = async ({ url, request }) => {
  try {
    const { searchParams } = new URL(url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }

    // Try to get release from Sanity
    let release = null;
    try {
      release = await getReleaseBySlug(slug);
    } catch (error) {
      console.error('Error fetching release:', error);
    }

    // If no release found, return a default OG image
    if (!release) {
      return new ImageResponse(
        ReleaseOGTemplate({
          title: 'Release Not Found',
          bpm: 128,
          key: 'C',
          releaseDate: new Date().toISOString(),
        }),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // Get cover image URL if available
    const coverImageUrl = release.coverImage ? urlFor(release.coverImage) : undefined;

    return new ImageResponse(
      ReleaseOGTemplate({
        title: release.title,
        bpm: release.bpm,
        key: release.key,
        releaseDate: release.releaseDate,
        coverImageUrl,
      }),
      {
        width: 1200,
        height: 630,
        // Cache for 1 hour in browser, 1 day on CDN
        headers: {
          'cache-control': 'public, max-age=3600, s-maxage=86400',
        },
      }
    );
  } catch (error) {
    console.error('OG image generation error:', error);
    
    // Return a fallback image on error
    return new ImageResponse(
      ReleaseOGTemplate({
        title: 'Error Loading Release',
        bpm: 128,
        key: 'C',
        releaseDate: new Date().toISOString(),
      }),
      {
        width: 1200,
        height: 630,
      }
    );
  }
};