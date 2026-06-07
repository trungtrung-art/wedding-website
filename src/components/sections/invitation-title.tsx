'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useT } from '@/lib/i18n-context';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

export function InvitationTitle() {
	const t = useT();
	const ref = useRef<HTMLDivElement>(null);
	useScrollReveal(ref, { childSelector: '[data-reveal]', stagger: 0.12 });

	return (
		<section
			ref={ref}
			className='relative mx-auto grid min-h-screen max-w-screen-2xl items-start justify-items-center overflow-hidden px-5 pb-20 pt-24 text-center sm:pt-28 md:pt-32'>
			<Image
				src='/album/image2.jpg'
				alt=''
				fill
				sizes='100vw'
				priority={false}
				className='object-cover object-[50%_56%]'
			/>
			<div className='absolute inset-0 ' />
			<div className='absolute inset-0 ' />

			<div className='relative mx-auto flex max-w-5xl flex-col items-center text-center text-cream-50 drop-shadow-[0_12px_28px_rgba(0,0,0,0.5)]'>
				<h2
					data-reveal
					className='text-[clamp(4.8rem,16vw,13rem)] leading-[0.78]'
					style={{ fontFamily: '"MJ VIP Daytonica", Georgia, serif' }}>
					{t('invitationTitle.headline')}
				</h2>
				<p
					data-reveal
					className='mt-5 max-w-3xl font-serif text-xl italic leading-relaxed text-cream-50/90 md:text-3xl'>
					{t('invitationTitle.tagline')}
				</p>
				<p
					data-reveal
					className='mt-6 font-serif text-xl uppercase tracking-[0.42em] text-cream-50/88 md:text-3xl'>
					{t('invitationTitle.date')}
				</p>
			</div>
		</section>
	);
}
