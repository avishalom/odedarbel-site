// @ts-check
import { defineConfig } from 'astro/config';

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
});
