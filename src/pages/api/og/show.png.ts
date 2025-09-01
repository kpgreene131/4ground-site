import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';
import { ShowOGTemplate } from '../../../lib/og/templates';
import { getAllShows } from '../../../lib/sanity/api';

export const GET: APIRoute = async ({ url, request }) => {
  try {
    const { searchParams } = new URL(url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }

    // Get all shows and find by slug (since we don't have a getShowBySlug function yet)
    let show = null;
    try {
      const shows = await getAllShows();
      show = shows.find(s => s.slug.current === slug);
    } catch (error) {
      console.error('Error fetching shows:', error);
    }

    // If no show found, return a default OG image
    if (!show) {
      return new ImageResponse(
        ShowOGTemplate({
          title: 'Show Not Found',
          venue: 'TBD',
          city: 'Unknown',
          country: 'Unknown',
          showDate: new Date().toISOString(),
        }),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    return new ImageResponse(
      ShowOGTemplate({
        title: show.title,
        venue: show.venue,
        city: show.city,
        country: show.country,
        showDate: show.showDate,
        ticketUrl: show.ticketUrl,
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
      ShowOGTemplate({
        title: 'Error Loading Show',
        venue: 'TBD',
        city: 'Unknown',
        country: 'Unknown',
        showDate: new Date().toISOString(),
      }),
      {
        width: 1200,
        height: 630,
      }
    );
  }
};