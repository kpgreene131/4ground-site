// Sample data for testing Sanity integration
// This simulates what would be migrated to Sanity

import type { Release, Show, LabPiece } from '../sanity/api';

// Sample release data (migrated from JSON)
export const sampleReleases: Release[] = [
  {
    _id: 'release-1',
    title: 'Midnight Synthesis',
    slug: { current: 'midnight-synthesis' },
    releaseDate: '2024-12-15T00:00:00.000Z',
    bpm: 128,
    key: 'Am',
    duration: '4:03',
    description:
      'Deep electronic synthesis meets intricate rhythmic patterns in this immersive journey through late-night sonic landscapes.',
    coverImage: {
      asset: {
        _id: 'image-1',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop&crop=center',
        metadata: {
          dimensions: {
            width: 800,
            height: 800,
          },
        },
      },
      alt: 'Midnight Synthesis album cover',
    },
    platformLinks: [
      {
        platform: 'bandcamp',
        url: 'https://4ground.bandcamp.com/track/midnight-synthesis',
      },
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/track/example',
      },
      {
        platform: 'apple',
        url: 'https://music.apple.com/track/example',
      },
      {
        platform: 'soundcloud',
        url: 'https://soundcloud.com/4ground/midnight-synthesis',
      },
    ],
    stems: [
      {
        name: 'Kick & Bass',
        audioFile: {
          asset: {
            _id: 'audio-1',
            url: '/audio/midnight-synthesis/stem-1-kick-bass.wav',
            originalFilename: 'stem-1-kick-bass.wav',
            size: 15728640,
          },
        },
      },
      {
        name: 'Percussion',
        audioFile: {
          asset: {
            _id: 'audio-2',
            url: '/audio/midnight-synthesis/stem-2-percussion.wav',
            originalFilename: 'stem-2-percussion.wav',
            size: 15728640,
          },
        },
      },
      {
        name: 'Synths',
        audioFile: {
          asset: {
            _id: 'audio-3',
            url: '/audio/midnight-synthesis/stem-3-synths.wav',
            originalFilename: 'stem-3-synths.wav',
            size: 15728640,
          },
        },
      },
      {
        name: 'FX & Vocals',
        audioFile: {
          asset: {
            _id: 'audio-4',
            url: '/audio/midnight-synthesis/stem-4-fx-vocals.wav',
            originalFilename: 'stem-4-fx-vocals.wav',
            size: 15728640,
          },
        },
      },
    ],
    tags: ['electronic', 'synthwave', 'ambient', 'experimental'],
  },
  {
    _id: 'release-2',
    title: 'Urban Resonance',
    slug: { current: 'urban-resonance' },
    releaseDate: '2024-10-22T00:00:00.000Z',
    bpm: 132,
    key: 'Dm',
    duration: '3:47',
    description:
      'Capturing the pulse of city life through layered percussion and atmospheric textures.',
    coverImage: {
      asset: {
        _id: 'image-2',
        url: 'https://images.unsplash.com/photo-1571609803640-ed4a2d5e1e71?w=800&h=800&fit=crop&crop=center',
        metadata: {
          dimensions: {
            width: 800,
            height: 800,
          },
        },
      },
      alt: 'Urban Resonance album cover',
    },
    platformLinks: [
      {
        platform: 'bandcamp',
        url: 'https://4ground.bandcamp.com/track/urban-resonance',
      },
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/track/urban-example',
      },
    ],
    stems: [
      {
        name: 'Kick & Sub',
        audioFile: {
          asset: {
            _id: 'audio-5',
            url: '/audio/urban-resonance/stem-1-kick-sub.wav',
            originalFilename: 'stem-1-kick-sub.wav',
            size: 14680064,
          },
        },
      },
      {
        name: 'Drums',
        audioFile: {
          asset: {
            _id: 'audio-6',
            url: '/audio/urban-resonance/stem-2-drums.wav',
            originalFilename: 'stem-2-drums.wav',
            size: 14680064,
          },
        },
      },
      {
        name: 'Melody',
        audioFile: {
          asset: {
            _id: 'audio-7',
            url: '/audio/urban-resonance/stem-3-melody.wav',
            originalFilename: 'stem-3-melody.wav',
            size: 14680064,
          },
        },
      },
      {
        name: 'Atmosphere',
        audioFile: {
          asset: {
            _id: 'audio-8',
            url: '/audio/urban-resonance/stem-4-atmosphere.wav',
            originalFilename: 'stem-4-atmosphere.wav',
            size: 14680064,
          },
        },
      },
    ],
    tags: ['electronic', 'urban', 'percussion', 'atmospheric'],
  },
];

// Sample show data
export const sampleShows: Show[] = [
  {
    _id: 'show-1',
    title: 'Electronic Fusion Night',
    slug: { current: 'electronic-fusion-night-december' },
    showDate: '2024-12-28T21:00:00.000Z',
    venue: 'The Underground',
    city: 'Berlin',
    country: 'Germany',
    ticketUrl: 'https://tickets.example.com/electronic-fusion-night',
    status: 'upcoming',
    description:
      'An immersive night of experimental electronic music featuring live stem mixing and visual projections.',
    flyer: {
      asset: {
        _id: 'image-3',
        url: 'https://images.unsplash.com/photo-1571609803640-ed4a2d5e1e71?w=600&h=800&fit=crop&crop=center',
        metadata: {
          dimensions: {
            width: 600,
            height: 800,
          },
        },
      },
      alt: 'Electronic Fusion Night event flyer',
    },
  },
  {
    _id: 'show-2',
    title: 'Synthesis Sessions',
    slug: { current: 'synthesis-sessions-november' },
    showDate: '2024-11-15T20:00:00.000Z',
    venue: 'Warehouse 23',
    city: 'Detroit',
    country: 'USA',
    status: 'past',
    description:
      'Intimate showcase of new material with interactive audience participation.',
  },
];

// Sample lab pieces data
export const sampleLabPieces: LabPiece[] = [
  {
    _id: 'lab-1',
    title: 'WebAudio Stem Visualizer',
    slug: { current: 'webaudio-stem-visualizer' },
    description:
      'Real-time frequency analysis and visualization of individual stems using Web Audio API. Features dynamic EQ controls and visual feedback.',
    demoUrl: 'https://lab.4ground.site/stem-visualizer',
    githubUrl: 'https://github.com/4ground/stem-visualizer',
    techStack: ['Web Audio API', 'Canvas', 'TypeScript', 'React'],
    thumbnail: {
      asset: {
        _id: 'image-4',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
        metadata: {
          dimensions: {
            width: 400,
            height: 300,
          },
        },
      },
      alt: 'WebAudio Stem Visualizer interface',
    },
    createdDate: '2024-09-01',
    isActive: true,
    featured: true,
  },
  {
    _id: 'lab-2',
    title: 'Generative Beat Sequencer',
    slug: { current: 'generative-beat-sequencer' },
    description:
      'AI-driven drum pattern generator that creates variations based on musical theory and user preferences.',
    demoUrl: 'https://lab.4ground.site/beat-sequencer',
    githubUrl: 'https://github.com/4ground/beat-sequencer',
    techStack: ['TensorFlow.js', 'Tone.js', 'Vue 3', 'WebMIDI'],
    thumbnail: {
      asset: {
        _id: 'image-5',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center',
        metadata: {
          dimensions: {
            width: 400,
            height: 300,
          },
        },
      },
      alt: 'Generative Beat Sequencer grid interface',
    },
    createdDate: '2024-07-15',
    isActive: true,
    featured: false,
  },
  {
    _id: 'lab-3',
    title: 'Spatial Audio Mixer',
    slug: { current: 'spatial-audio-mixer' },
    description:
      'Experimental 3D audio positioning tool for creating immersive soundscapes with binaural rendering.',
    techStack: ['Web Audio API', 'Three.js', 'HRTF', 'WebXR'],
    thumbnail: {
      asset: {
        _id: 'image-6',
        url: 'https://images.unsplash.com/photo-1571609803640-ed4a2d5e1e71?w=400&h=300&fit=crop&crop=center',
        metadata: {
          dimensions: {
            width: 400,
            height: 300,
          },
        },
      },
      alt: 'Spatial Audio Mixer 3D interface',
    },
    createdDate: '2024-06-01',
    isActive: false,
    featured: false,
  },
];
