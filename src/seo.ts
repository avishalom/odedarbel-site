export type PageSeoEntry = {
	title: string;
	description: string;
	ogTitle?: string;
	noindex?: boolean;
};

// Edit SEO values for any page here. Keys are the page's currentPath.
export const pageSeo: Record<'he' | 'en', Record<string, PageSeoEntry>> = {
	he: {
		'/': {
			title: 'דף הבית',
			description:
				'ד"ר עודד ארבל — פסיכיאטר מומחה, פסיכותרפיה אינטגרטיבית, מיינדפולנס ופסיכותרפיה פסיכדלית.',
			ogTitle: 'ד"ר עודד ארבל',
		},
		'/tamar-amit': {
			title: 'תמר עמית',
			description: 'תמר עמית — פסיכולוגית קלינית, שותפה בכירה בצוות ההוראה של תוכנית המטפלים.',
		},
		'/therapists-program': {
			title: 'תוכנית המטפלים',
			description: 'תוכנית הכשרת מטפלים תלת-שנתית של מרכז המדבר למיינדפולנס.',
		},
		'/meditationpractice': {
			title: 'תירגול מדיטציה',
			description: 'תירגול מדיטציה — קבוצות, ספריית הקלטות מודרכות, וגישה בודהיסטית לנוכחות.',
		},
		'/meditationlibrary': {
			title: 'ספריית הקלטות מדיטציה',
			description: 'ספריית הקלטות מדיטציה מודרכת — גישה מוגנת בסיסמה.',
			noindex: true,
		},
		'/psychadelicresearchandtherapy': {
			title: 'טיפול ומחקר פסיכדלי',
			description: 'ראש היחידה לטיפול ומחקר פסיכדלי במרכז לבריאות הנפש באר שבע.',
		},
		'/beershevacenter': {
			title: 'מרכז לבריאות הנפש באר שבע — מרפאת מיינדפולנס',
			description:
				'מרפאת המיינדפולנס במרכז לבריאות הנפש באר שבע — קבוצות, טיפולים ותחומי התמחות.',
		},
		'/contact': {
			title: 'צרו קשר',
			description: 'יצירת קשר עם ד"ר עודד ארבל.',
		},
	},
	en: {
		'/en/': {
			title: 'Home',
			description:
				'Dr. Oded Arbel — psychiatrist, integrative psychiatry, mindfulness, and psychedelic psychotherapy.',
			ogTitle: 'Dr. Oded Arbel',
		},
		'/en/tamar-amit': {
			title: 'Tamar Amit',
			description:
				'Tamar Amit — clinical psychologist, senior teaching partner of the Therapists Program.',
		},
		'/en/therapists-program': {
			title: 'Therapists Program',
			description: 'A three-year therapist training program at the Desert Mindfulness Center.',
		},
		'/en/meditationpractice': {
			title: 'Meditation Practice',
			description:
				'Meditation practice — groups, a library of guided recordings, and a Buddhist approach to presence.',
		},
		'/en/meditationlibrary': {
			title: 'Meditation Recordings Library',
			description: 'Guided meditation recordings library — password protected.',
			noindex: true,
		},
		'/en/psychadelicresearchandtherapy': {
			title: 'Psychedelic Research and Therapy',
			description:
				'Head of the Psychedelic Treatment and Research Unit at Beer Sheva Mental Health Center.',
		},
		'/en/beershevacenter': {
			title: 'Beer Sheva Mental Health Center — Mindfulness Clinic',
			description:
				'The mindfulness clinic at Beer Sheva Mental Health Center — groups, treatments, and areas of focus.',
		},
		'/en/contact': {
			title: 'Contact',
			description: 'Get in touch with Dr. Oded Arbel.',
		},
	},
};
