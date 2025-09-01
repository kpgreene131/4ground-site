// sanity.cli.ts
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'tb9ybfxu',     // your project
    dataset: 'production',     // your dataset
  },
  // This pre-sets <hostname>.sanity.studio and avoids the interactive prompt
  studioHost: 'fourground',
})
