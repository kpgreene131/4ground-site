// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.SANITY_PROJECT_ID': JSON.stringify(
        process.env.SANITY_PROJECT_ID
      ),
      'import.meta.env.SANITY_DATASET': JSON.stringify(
        process.env.SANITY_DATASET
      ),
      'import.meta.env.SANITY_API_VERSION': JSON.stringify(
        process.env.SANITY_API_VERSION
      ),
      'import.meta.env.SANITY_TOKEN': JSON.stringify(process.env.SANITY_TOKEN),
    },
  },
});
