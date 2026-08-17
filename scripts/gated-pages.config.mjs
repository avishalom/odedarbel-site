import { loadGatedPages } from './content-pages.mjs';

// Gated routes are discovered from src/content/pages/**/*.mdx frontmatter.
// Add `gate.passwordEnv`, `gate.lockedTitle`, and `gate.lockedDescription`
// on the MDX document instead of editing this file.
export const gatedPages = loadGatedPages();

// Asset files for gated pages live outside public/ so Astro does not publish
// or sitemap them as normal site assets. The Astro build integration copies
// them into dist after page encryption; links to these files should only appear
// inside encrypted gated content.
export const gatedAssetDirectories = [
	{
		source: 'gated-assets/therapist-library',
		output: '_gated/therapist-library',
	},
	{
		source: 'gated-assets/meditation-library',
		output: '_gated/meditation-library',
	},
];
