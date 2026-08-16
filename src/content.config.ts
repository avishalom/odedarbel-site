import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const gated = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/gated' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		locale: z.enum(['he', 'en']),
	}),
});

export const collections = { gated };
