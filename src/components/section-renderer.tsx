import type { ComponentType } from 'react';
import { sectionOrder, type SectionKey } from '@/data/sections';
import { Hero } from './sections/hero';
import { DateBanner } from './sections/date-banner';
import { Names } from './sections/names';
import { InvitationTitle } from './sections/invitation-title';
import { WelcomeMessage } from './sections/welcome-message';
import { GratitudeEn } from './sections/gratitude-en';
import { Poetry1 } from './sections/poetry-1';
import { QuoteThreeThings } from './sections/quote-three-things';
import { Sentiment1 } from './sections/sentiment-1';
import { Gallery } from './sections/gallery';
import { Poetry2 } from './sections/poetry-2';
import { DateDetails } from './sections/date-details';
import { Calendar } from './sections/calendar';
import { ClosingSentiment } from './sections/closing-sentiment';
import { Venue } from './sections/venue';
import { GuestInteraction } from './sections/guest-interaction';
import { Countdown } from './sections/countdown';
import { Rsvp } from './sections/rsvp';
import { ThankYou } from './sections/thank-you';

const Placeholder = (label: string): ComponentType => {
	// eslint-disable-next-line react/display-name
	const C: ComponentType = () => (
		<section className='mx-auto grid min-h-[40vh] max-w-5xl place-items-center px-5 py-20 text-burgundy-900/40'>
			<p className='text-xs uppercase tracking-[0.3em]'>[ {label} ]</p>
		</section>
	);
	C.displayName = `Placeholder(${label})`;
	return C;
};

export const SECTION_REGISTRY: Record<SectionKey, ComponentType> = {
	'invitation-title': InvitationTitle,
	hero: Hero,
	'date-banner': DateBanner,
	names: Names,
	'welcome-message': WelcomeMessage,
	'gratitude-en': GratitudeEn,
	'poetry-1': Poetry1,
	'quote-three-things': QuoteThreeThings,
	countdown: Countdown,
	'sentiment-1': Sentiment1,
	gallery: Gallery,
	'poetry-2': Poetry2,
	'date-details': DateDetails,
	calendar: Calendar,
	'closing-sentiment': ClosingSentiment,
	venue: Venue,
	rsvp: Rsvp,
	'guest-interaction': GuestInteraction,
	'thank-you': ThankYou,
};

export function SectionRenderer() {
	return (
		<main className='wedding-canvas relative min-h-screen overflow-x-hidden'>
			{sectionOrder.map((key) => {
				const Section = SECTION_REGISTRY[key];
				return <Section key={key} />;
			})}
		</main>
	);
}
