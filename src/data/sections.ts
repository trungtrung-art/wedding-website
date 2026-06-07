// CMS CONTRACT — the CMS will provide this array; admins can reorder/remove keys.
// Adding a new key here requires registering a component in section-renderer.tsx.

export type SectionKey =
	| 'invitation-title'
	| 'hero'
	| 'date-banner'
	| 'names'
	| 'welcome-message'
	| 'gratitude-en'
	| 'poetry-1'
	| 'quote-three-things'
	| 'countdown'
	| 'sentiment-1'
	| 'gallery'
	| 'poetry-2'
	| 'date-details'
	| 'calendar'
	| 'closing-sentiment'
	| 'venue'
	| 'rsvp'
	| 'guest-interaction'
	| 'thank-you';

export const sectionOrder: SectionKey[] = [
	'invitation-title',
	'hero',
	'date-banner',
	'names',

	'welcome-message',
	'gratitude-en',
	'poetry-1',
	'quote-three-things',
	'countdown',
	'sentiment-1',
	'gallery',
	'poetry-2',
	'date-details',
	'calendar',
	'closing-sentiment',
	'venue',
	'rsvp',
	'guest-interaction',
	'thank-you',
];
