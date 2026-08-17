import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { uiStrings } from '../../i18n';
import { getCollection } from 'astro:content';

// Load fonts once at module level. We use WOFF (v1) from fontsource packages
// because satori's OpenType parser does not support WOFF2.
function loadFont(relativePath: string): ArrayBuffer {
	const buf = readFileSync(resolve(process.cwd(), relativePath));
	// Slice to get a clean ArrayBuffer (Buffer.buffer may have an offset)
	return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

const frauncesFont = loadFont(
	'node_modules/@fontsource/fraunces/files/fraunces-latin-700-normal.woff'
);
const hebrewFont = loadFont(
	'node_modules/@fontsource/frank-ruhl-libre/files/frank-ruhl-libre-hebrew-700-normal.woff'
);

function makeCard(ogTitle: string, siteName: string, isHe: boolean): object {
	const fontFamily = isHe ? 'Frank Ruhl Libre' : 'Fraunces';
	const textDir = isHe ? 'rtl' : 'ltr';
	const textAlign = isHe ? 'right' : 'left';

	const subtitleEl =
		ogTitle !== siteName
			? {
					type: 'div',
					props: {
						style: {
							color: '#c4a882',
							fontSize: 28,
							fontFamily,
							marginTop: 12,
							direction: textDir,
							textAlign,
						},
						children: siteName,
					},
				}
			: null;

	return {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				width: 1200,
				height: 630,
				backgroundColor: '#1a2b3c',
				padding: '64px 80px',
			},
			children: [
				// Top: site URL (always in Latin/Fraunces)
				{
					type: 'div',
					props: {
						style: { color: '#1c7d8e', fontSize: 22, fontFamily: 'Fraunces' },
						children: 'odedarbel.com',
					},
				},
				// Centre: title + optional subtitle
				{
					type: 'div',
					props: {
						style: { display: 'flex', flexDirection: 'column' },
						children: [
							{
								type: 'div',
								props: {
									style: {
										color: '#f2e8d5',
										fontSize: 64,
										fontWeight: 700,
										lineHeight: 1.15,
										fontFamily,
										direction: textDir,
										textAlign,
									},
									children: ogTitle,
								},
							},
							subtitleEl,
						].filter(Boolean),
					},
				},
				// Bottom: teal accent bar
				{
					type: 'div',
					props: {
						style: {
							width: 64,
							height: 4,
							backgroundColor: '#1c7d8e',
							borderRadius: 2,
						},
						children: '',
					},
				},
			],
		},
	};
}

export async function getStaticPaths() {
	const entries = await getCollection('pages');

	return entries.map((entry) => {
		const pathSlug =
			entry.data.path
				.replace(/^\/en\//, '')
				.replace(/^\/en$/, '')
				.replace(/^\//, '')
				.replace(/\/$/, '') || 'home';

		return {
			params: { slug: `${entry.data.locale}-${pathSlug}` },
			props: { page: entry.data },
		};
	});
}

export const GET: APIRoute = async ({ props }) => {
	const { page } = props as {
		page: { locale: 'he' | 'en'; title: string; ogTitle?: string };
	};

	if (!page) return new Response('Not found', { status: 404 });

	const ogTitle = page.ogTitle ?? page.title;
	const siteName = uiStrings[page.locale].siteName;
	const isHe = page.locale === 'he';

	const svg = await satori(makeCard(ogTitle, siteName, isHe) as Parameters<typeof satori>[0], {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Fraunces', data: frauncesFont, weight: 700, style: 'normal' },
			{ name: 'Frank Ruhl Libre', data: hebrewFont, weight: 700, style: 'normal' },
		],
	});

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	const pngBuffer = resvg.render().asPng();

	return new Response(pngBuffer, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
