# Sanity CMS Setup Guide

This guide will help you set up Sanity CMS for the 4ground site.

## Prerequisites

1. A Sanity account at [sanity.io](https://sanity.io)
2. Node.js installed on your machine

## Step 1: Create Sanity Project

1. Go to [Sanity.io](https://sanity.io) and create a new project
2. Note your Project ID (you'll find this in your project settings)
3. Create a dataset called `production` (or use the default one)

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Sanity credentials in `.env`:
   ```bash
   SANITY_PROJECT_ID=your-project-id-here
   SANITY_DATASET=production
   SANITY_API_VERSION=2024-01-01
   SANITY_TOKEN=your-sanity-token-here
   ```

## Step 3: Get Your Sanity Token

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to "API" in the left sidebar
4. Click "Add API token"
5. Give it a name like "4ground-site" 
6. Set permissions to "Editor" or "Admin"
7. Copy the token and add it to your `.env` file

## Step 4: Deploy Sanity Schema

1. Install Sanity CLI globally (if you haven't already):
   ```bash
   npm install -g @sanity/cli
   ```

2. Deploy the schema to your Sanity project:
   ```bash
   npx sanity schema deploy
   ```

## Step 5: Launch Sanity Studio

You have two options to manage your content:

### Option A: Local Studio
1. Start the studio locally:
   ```bash
   npx sanity dev
   ```
2. Open http://localhost:3333 in your browser

### Option B: Sanity Studio (Cloud)
1. Deploy your studio to Sanity's hosted environment:
   ```bash
   npx sanity deploy
   ```
2. Access your studio at `https://your-project-name.sanity.studio`

## Step 6: Add Content

In the Sanity Studio, you can now add:

1. **Releases** - Music releases with cover art, metadata, and platform links
2. **Shows** - Concert and event information  
3. **Lab Pieces** - Portfolio projects and experiments

Each content type has validation rules and required fields as defined in the schemas.

## Step 7: Test the Integration

1. Add some content in Sanity Studio
2. Make sure to set items as "Published" 
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Visit your site and verify content appears correctly

## Content Schema Overview

### Release Schema
- Title, slug, release date
- BPM, key, duration
- Cover image with alt text
- Platform links (Bandcamp, Spotify, etc.)
- Stems for audio files
- Tags and publication status

### Show Schema  
- Title, slug, show date/time
- Venue, city, country
- Ticket URL, status (upcoming/past/cancelled)
- Event flyer image
- Description and publication status

### Lab Piece Schema
- Title, slug, description
- Demo URL, GitHub URL
- Tech stack tags
- Thumbnail image
- Created date, active status, featured flag

## Troubleshooting

### Build Errors
If you get build errors, ensure:
- All environment variables are set correctly
- Your Sanity token has proper permissions
- Content is marked as "Published" in Sanity Studio

### Images Not Loading
If images don't appear:
- Check that images have been uploaded to Sanity
- Verify image alt text is filled out
- Ensure your project ID is correct in environment variables

### Content Not Appearing
If content doesn't show up:
- Verify items are marked as "Published" in Sanity
- Check browser console for API errors
- Ensure your dataset name matches between Sanity and your env vars

## Next Steps

Once your CMS is working:
1. Migrate your existing content from JSON to Sanity
2. Set up preview mode for draft content
3. Configure webhooks for automatic rebuilds
4. Optimize image delivery with Sanity CDN parameters