import { sanityClient, isSanityConfigured } from './client'
import { releaseQueries, showQueries, labPieceQueries } from './queries'
import { sampleReleases, sampleShows, sampleLabPieces } from '../migration/sampleData'

// Types based on our Sanity schemas
export interface SanityImage {
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions: {
        width: number
        height: number
      }
    }
  }
  alt: string
}

export interface SanityFile {
  asset: {
    _id: string
    url: string
    originalFilename: string
    size: number
  }
}

export interface Release {
  _id: string
  title: string
  slug: { current: string }
  releaseDate: string
  bpm: number
  key: string
  duration: string
  description?: string
  coverImage: SanityImage
  platformLinks: Array<{
    platform: string
    url: string
  }>
  stems?: Array<{
    name: string
    audioFile?: SanityFile
  }>
  tags?: string[]
}

export interface Show {
  _id: string
  title: string
  slug: { current: string }
  showDate: string
  venue: string
  city: string
  country: string
  ticketUrl?: string
  status: 'upcoming' | 'past' | 'cancelled'
  description?: string
  flyer?: SanityImage
}

export interface LabPiece {
  _id: string
  title: string
  slug: { current: string }
  description: string
  demoUrl?: string
  githubUrl?: string
  techStack: string[]
  thumbnail: SanityImage
  createdDate: string
  isActive: boolean
  featured: boolean
}

// Release API functions
export async function getAllReleases(): Promise<Release[]> {
  if (!isSanityConfigured || !sanityClient) {
    console.log('Sanity not configured, returning sample releases data')
    return sampleReleases
  }
  
  try {
    const releases = await sanityClient.fetch(releaseQueries.all)
    return releases || []
  } catch (error) {
    console.error('Error fetching releases:', error)
    return sampleReleases // Fallback to sample data
  }
}

export async function getReleaseBySlug(slug: string): Promise<Release | null> {
  if (!isSanityConfigured || !sanityClient) {
    return sampleReleases.find(r => r.slug.current === slug) || null
  }
  
  try {
    const release = await sanityClient.fetch(releaseQueries.bySlug, { slug })
    return release || null
  } catch (error) {
    console.error('Error fetching release by slug:', error)
    return sampleReleases.find(r => r.slug.current === slug) || null
  }
}

export async function getReleaseSlugs(): Promise<string[]> {
  if (!isSanityConfigured || !sanityClient) {
    return sampleReleases.map(r => r.slug.current)
  }
  
  try {
    const slugs = await sanityClient.fetch(releaseQueries.slugs)
    return slugs || []
  } catch (error) {
    console.error('Error fetching release slugs:', error)
    return sampleReleases.map(r => r.slug.current)
  }
}

export async function getRecentReleases(limit: number = 6): Promise<Release[]> {
  if (!isSanityConfigured || !sanityClient) return []
  
  try {
    const releases = await sanityClient.fetch(releaseQueries.recent, { limit })
    return releases || []
  } catch (error) {
    console.error('Error fetching recent releases:', error)
    return []
  }
}

// Show API functions
export async function getAllShows(): Promise<Show[]> {
  if (!isSanityConfigured || !sanityClient) return sampleShows
  
  try {
    const shows = await sanityClient.fetch(showQueries.all)
    return shows || []
  } catch (error) {
    console.error('Error fetching shows:', error)
    return []
  }
}

export async function getUpcomingShows(): Promise<Show[]> {
  if (!isSanityConfigured || !sanityClient) return []
  
  try {
    const shows = await sanityClient.fetch(showQueries.upcoming)
    return shows || []
  } catch (error) {
    console.error('Error fetching upcoming shows:', error)
    return []
  }
}

export async function getPastShows(): Promise<Show[]> {
  if (!isSanityConfigured || !sanityClient) return []
  
  try {
    const shows = await sanityClient.fetch(showQueries.past)
    return shows || []
  } catch (error) {
    console.error('Error fetching past shows:', error)
    return []
  }
}

// Lab Piece API functions
export async function getAllLabPieces(): Promise<LabPiece[]> {
  if (!isSanityConfigured || !sanityClient) return sampleLabPieces
  
  try {
    const labPieces = await sanityClient.fetch(labPieceQueries.all)
    return labPieces || []
  } catch (error) {
    console.error('Error fetching lab pieces:', error)
    return []
  }
}

export async function getFeaturedLabPieces(): Promise<LabPiece[]> {
  if (!isSanityConfigured || !sanityClient) return []
  
  try {
    const labPieces = await sanityClient.fetch(labPieceQueries.featured)
    return labPieces || []
  } catch (error) {
    console.error('Error fetching featured lab pieces:', error)
    return []
  }
}

export async function getActiveLabPieces(): Promise<LabPiece[]> {
  if (!isSanityConfigured || !sanityClient) return []
  
  try {
    const labPieces = await sanityClient.fetch(labPieceQueries.active)
    return labPieces || []
  } catch (error) {
    console.error('Error fetching active lab pieces:', error)
    return []
  }
}

// Utility function to handle API errors gracefully
export function createFallbackData<T>(fallbackValue: T) {
  return (error: any): T => {
    console.error('Sanity API Error:', error)
    return fallbackValue
  }
}