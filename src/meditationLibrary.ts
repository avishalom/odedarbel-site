export const meditationLibraryTracks = [
	{
		id: 'focus-on-the-breath',
		filename: 'focus-on-the-breath.mp3',
		duration: '10:12',
		he: {
			category: 'נשימה וריכוז',
			title: 'ריכוז בנשימה',
			description: 'תרגול בסיסי של עגינה בנשימה - נקודת מוצא טובה למתחילים.',
		},
		en: {
			category: 'Breath & Focus',
			title: 'Focus on the Breath',
			description: 'A basic breath-anchoring practice - a good starting point for beginners.',
		},
	},
	{
		id: 'body-scan',
		filename: 'body-scan.mp3',
		duration: '24:25',
		he: {
			category: 'סריקת גוף',
			title: 'סריקת גוף',
			description: 'מעבר קשוב לאורך הגוף, מגביר נוכחות גופנית ומרפה מתח.',
		},
		en: {
			category: 'Body Scan',
			title: 'Body Scan',
			description: 'An attentive pass through the body, building bodily presence and releasing tension.',
		},
	},
	{
		id: 'open-attention',
		filename: 'open-attention.mp3',
		duration: '22:22',
		he: {
			category: 'קשב פתוח',
			title: 'קשב פתוח',
			description: 'תרגול של קשב לא-ממוקד, פתוח לכל מה שעולה בשדה החוויה.',
		},
		en: {
			category: 'Open Attention',
			title: 'Open Attention',
			description: 'A practice of unfocused, open attention to whatever arises in the field of experience.',
		},
	},
	{
		id: 'zazen-instructions',
		filename: 'zazen-instructions.mp3',
		duration: '30:03',
		he: {
			category: 'ישיבת זן',
			title: 'הנחיות לזאזן',
			description: 'הנחיה מלאה לישיבת זאזן בסגנון זן, מאת עודד.',
		},
		en: {
			category: 'Zen Sitting',
			title: 'Zazen Instructions',
			description: 'Full guidance for zazen-style Zen sitting, led by Oded.',
		},
	},
] as const;

export const meditationLibraryHref = (filename: string) =>
	`/_gated/meditation-library/${encodeURIComponent(filename)}`;
