// GROQ queries for fetching content from Sanity

export const releaseQueries = {
  // Get all published releases
  all: `*[_type == "release" && isPublished == true] | order(releaseDate desc) {
    _id,
    title,
    slug,
    releaseDate,
    bpm,
    key,
    duration,
    description,
    coverImage{
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    platformLinks[]{
      platform,
      url
    },
    stems[]{
      name,
      audioFile{
        asset->{
          _id,
          url,
          originalFilename,
          size
        }
      }
    },
    tags
  }`,

  // Get single release by slug
  bySlug: `*[_type == "release" && slug.current == $slug && isPublished == true][0] {
    _id,
    title,
    slug,
    releaseDate,
    bpm,
    key,
    duration,
    description,
    coverImage{
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    platformLinks[]{
      platform,
      url
    },
    stems[]{
      name,
      audioFile{
        asset->{
          _id,
          url,
          originalFilename,
          size
        }
      }
    },
    tags
  }`,

  // Get release slugs for static path generation
  slugs: `*[_type == "release" && isPublished == true].slug.current`,

  // Get recent releases (limited)
  recent: `*[_type == "release" && isPublished == true] | order(releaseDate desc)[0...$limit] {
    _id,
    title,
    slug,
    releaseDate,
    coverImage{
      asset->{
        _id,
        url
      },
      alt
    }
  }`
}

export const showQueries = {
  // Get all published shows
  all: `*[_type == "show" && isPublished == true] | order(showDate desc) {
    _id,
    title,
    slug,
    showDate,
    venue,
    city,
    country,
    ticketUrl,
    status,
    description,
    flyer{
      asset->{
        _id,
        url
      },
      alt
    }
  }`,

  // Get upcoming shows
  upcoming: `*[_type == "show" && isPublished == true && status == "upcoming" && showDate >= now()] | order(showDate asc) {
    _id,
    title,
    slug,
    showDate,
    venue,
    city,
    country,
    ticketUrl,
    description,
    flyer{
      asset->{
        _id,
        url
      },
      alt
    }
  }`,

  // Get past shows
  past: `*[_type == "show" && isPublished == true && (status == "past" || showDate < now())] | order(showDate desc) {
    _id,
    title,
    slug,
    showDate,
    venue,
    city,
    country,
    description,
    flyer{
      asset->{
        _id,
        url
      },
      alt
    }
  }`
}

export const labPieceQueries = {
  // Get all published lab pieces
  all: `*[_type == "labPiece" && isPublished == true] | order(featured desc, createdDate desc) {
    _id,
    title,
    slug,
    description,
    demoUrl,
    githubUrl,
    techStack,
    thumbnail{
      asset->{
        _id,
        url
      },
      alt
    },
    createdDate,
    isActive,
    featured
  }`,

  // Get featured lab pieces
  featured: `*[_type == "labPiece" && isPublished == true && featured == true] | order(createdDate desc) {
    _id,
    title,
    slug,
    description,
    demoUrl,
    githubUrl,
    techStack,
    thumbnail{
      asset->{
        _id,
        url
      },
      alt
    },
    createdDate,
    isActive
  }`,

  // Get active projects
  active: `*[_type == "labPiece" && isPublished == true && isActive == true] | order(createdDate desc) {
    _id,
    title,
    slug,
    description,
    demoUrl,
    githubUrl,
    techStack,
    thumbnail{
      asset->{
        _id,
        url
      },
      alt
    },
    createdDate,
    featured
  }`
}