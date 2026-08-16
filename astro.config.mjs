// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://odedarbel.com',
  base: '/odedarbel-site',

  i18n: {
    locales: ['he', 'en'],
    defaultLocale: 'he',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    mdx(),
    sitemap({
      // Exclude password-protected pages and internal content paths
      filter: (page) =>
        !page.includes('meditationlibrary') && !page.includes('/raw-content/'),
    }),
  ],
});