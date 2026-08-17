import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/pages' }),
	schema: z.object({
		path: z.string().regex(/^\/.*$/),
		title: z.string(),
		description: z.string(),
		locale: z.enum(['he', 'en']),
		pageLayout: z.enum(['home', 'prose']).default('prose'),
		ogTitle: z.string().optional(),
		noindex: z.boolean().optional(),
		proseWidth: z.enum(['narrow', 'default']).optional(),
		library: z.enum(['meditation', 'therapist']).optional(),
		gate: z
			.object({
				passwordEnv: z.string(),
				lockedTitle: z.string(),
				lockedDescription: z.string(),
			})
			.optional(),
	}),
});

export const collections = { pages };
