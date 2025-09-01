import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

// Import schemas
import {releaseType} from './sanity/schemas/releaseType'
import {showType} from './sanity/schemas/showType'
import {labPieceType} from './sanity/schemas/labPieceType'

export default defineConfig({
  name: '4ground-studio',
  title: '4ground CMS',
  
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  
  plugins: [
    structureTool(),
    visionTool()
  ],
  
  schema: {
    types: [releaseType, showType, labPieceType]
  },
  
  // Configure the studio interface
  document: {
    // For singleton documents like site settings
    newDocumentOptions: (prev, {creationContext}) => {
      return prev
    },
  },
})