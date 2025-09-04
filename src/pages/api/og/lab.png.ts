import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';
import { LabPieceOGTemplate } from '../../../lib/og/templates';
import { getAllLabPieces } from '../../../lib/sanity/api';

export const GET: APIRoute = async ({ url, request }) => {
  try {
    const { searchParams } = new URL(url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }

    // Get all lab pieces and find by slug
    let labPiece = null;
    try {
      const labPieces = await getAllLabPieces();
      labPiece = labPieces.find((l) => l.slug.current === slug);
    } catch (error) {
      console.error('Error fetching lab pieces:', error);
    }

    // If no lab piece found, return a default OG image
    if (!labPiece) {
      return new ImageResponse(
        LabPieceOGTemplate({
          title: 'Lab Piece Not Found',
          description: 'This experimental audio project could not be found.',
          techStack: [],
          isActive: false,
          featured: false,
        }),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    return new ImageResponse(
      LabPieceOGTemplate({
        title: labPiece.title,
        description: labPiece.description,
        techStack: labPiece.techStack || [],
        isActive: labPiece.isActive,
        featured: labPiece.featured,
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
      LabPieceOGTemplate({
        title: 'Error Loading Lab Piece',
        description: 'There was an error loading this audio experiment.',
        techStack: [],
        isActive: false,
        featured: false,
      }),
      {
        width: 1200,
        height: 630,
      }
    );
  }
};
