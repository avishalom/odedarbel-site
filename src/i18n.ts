export const locales = ['he', 'en'] as const;
export type Locale = (typeof locales)[number];

export const dir: Record<Locale, 'rtl' | 'ltr'> = {
	he: 'rtl',
	en: 'ltr',
};

export const nav: Record<Locale, { label: string; href: string }[]> = {
	he: [
		{ label: 'בית', href: '/' },
		{ label: 'תמר עמית', href: '/tamar-amit' },
		{ label: 'תוכנית המטפלים', href: '/therapists-program' },
		{ label: 'מדיטציה', href: '/meditationpractice' },
		{ label: 'טיפול ומחקר פסיכדלי', href: '/psychadelicresearchandtherapy' },
		{ label: 'מרכז לבריאות הנפש באר שבע', href: '/beershevacenter' },
		{ label: 'צרו קשר', href: '/contact' },
	],
	en: [
		{ label: 'Home', href: '/en/' },
		{ label: 'Tamar Amit', href: '/en/tamar-amit' },
		{ label: 'Therapists Program', href: '/en/therapists-program' },
		{ label: 'Meditation', href: '/en/meditationpractice' },
		{ label: 'Psychedelic Research & Therapy', href: '/en/psychadelicresearchandtherapy' },
		{ label: 'Beer Sheva Mental Health Center', href: '/en/beershevacenter' },
		{ label: 'Contact', href: '/en/contact' },
	],
};

export const altLangHref: Record<Locale, string> = {
	he: 'en',
	en: 'he',
};

/**
 * Prefixes a root-relative path (e.g. "/tamar-amit") with Astro's configured
 * base path, so internal links work both on the GitHub Pages subpath
 * (astro.config.mjs `base`) and on the eventual odedarbel.com custom domain
 * (once DNS is switched, drop `base` from the config and this still works —
 * BASE_URL becomes "/").
 */
export const withBase = (path: string): string => {
	const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
	return path === '/' ? base : `${base}${path.replace(/^\//, '')}`;
};

export const uiStrings = {
	he: {
		skipToContent: 'דלג לתוכן',
		siteName: 'ד"ר עודד ארבל',
		switchLang: 'English',
		contactCta: 'צרו קשר',
		readMore: 'קראו עוד',
		menu: 'תפריט',
	},
	en: {
		skipToContent: 'Skip to content',
		siteName: 'Dr. Oded Arbel',
		switchLang: 'עברית',
		contactCta: 'Contact',
		readMore: 'Read more',
		menu: 'Menu',
	},
};
