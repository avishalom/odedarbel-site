// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { gatedPages } from './scripts/gated-pages.config.mjs';
import { gatedPagesIntegration } from './scripts/gated-pages.integration.mjs';

const gatedRouteFragments = gatedPages.flatMap(({ raw, loader }) => [`/${raw}`, `/${loader}`]);

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
      // Exclude password-protected pages, raw plaintext routes, and gated asset URLs.
      filter: (page) =>
        !gatedRouteFragments.some((route) => page.includes(route)) &&
        !page.includes('/raw-content/') &&
        !page.includes('/_gated/'),
    }),
    gatedPagesIntegration(),
  ],
});
