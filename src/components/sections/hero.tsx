'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Heart } from 'lucide-react';
import { invitation } from '@/data/invitation';
import { useT } from '@/lib/i18n-context';
import { MusicToggle } from '@/components/music-toggle';
import { EnvelopeBody } from '@/components/envelope/EnvelopeBody';
import { EnvelopeTopFlap } from '@/components/envelope/EnvelopeTopFlap';
import { EnvelopeSeal } from '@/components/envelope/EnvelopeSeal';

const FLOATING_HEARTS = Array.from({ length: 11 });
const HEART_OPACITIES = [0.9, 0.76, 0.64];

export function Hero() {
	const t = useT();
	const [opened, setOpened] = useState(false);

	// Refs
	const sectionRef = useRef<HTMLElement>(null);
	const shellRef = useRef<HTMLButtonElement>(null);
	const introRef = useRef<HTMLDivElement>(null);
	// Envelope: 4 stable pieces stay put as the "pocket", top flap hinges in 3D
	const envBodyRef = useRef<SVGRectElement>(null);
	const envLeftFlapRef = useRef<SVGPolygonElement>(null);
	const envRightFlapRef = useRef<SVGPolygonElement>(null);
	const envBottomFlapRef = useRef<SVGPolygonElement>(null);
	const topFlapRef = useRef<HTMLDivElement>(null);
	const sealRef = useRef<HTMLSpanElement>(null);
	const sheet1Ref = useRef<HTMLDivElement>(null);
	const sheet2Ref = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const leftSprigRef = useRef<HTMLSpanElement>(null);
	const rightSprigRef = useRef<HTMLSpanElement>(null);
	const hintRef = useRef<HTMLDivElement>(null);
	const heartRefs = useRef<Array<HTMLSpanElement | null>>([]);
	const openedRef = useRef(false);
	const openingRef = useRef(false);

	// Initial states + reduced-motion handling
	useEffect(() => {
		const reduce = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches;

		if (reduce) {
			gsap.set(
				[
					sheet1Ref.current,
					sheet2Ref.current,
					cardRef.current,
					leftSprigRef.current,
					rightSprigRef.current,
					hintRef.current,
				],
				{
					autoAlpha: 1,
					x: 0,
					y: 0,
					rotate: 0,
				},
			);
			gsap.set(heartRefs.current, { autoAlpha: 0 });
			gsap.set(introRef.current, { autoAlpha: 0.12, y: 0 });
			gsap.set([sealRef.current], { autoAlpha: 0 });
			gsap.set(topFlapRef.current, { scaleY: -0.44, zIndex: 12 });
			openedRef.current = true;
			openingRef.current = false;
			setOpened(true);
			return;
		}

		// All cards/sheets start DEEP inside the envelope (high y offset puts
		// them near the bottom of the pocket). The animation timeline below
		// raises them out one by one so they visibly emerge from the envelope.
		gsap.set(cardRef.current, { autoAlpha: 0, y: 220, rotate: 0 });
		gsap.set([sheet1Ref.current, sheet2Ref.current], {
			autoAlpha: 0,
			y: 240,
			scale: 0.96,
			rotate: 0,
		});
		gsap.set(leftSprigRef.current, { autoAlpha: 0, x: 34, y: 24, rotate: -18 });
		gsap.set(rightSprigRef.current, {
			autoAlpha: 0,
			x: -34,
			y: 24,
			rotate: 18,
		});
		gsap.set(hintRef.current, { autoAlpha: 0, y: 18 });
		gsap.set(topFlapRef.current, { scaleY: 1, zIndex: 40 });
		gsap.set(heartRefs.current, { autoAlpha: 0, x: 0, y: 0, scale: 0.2 });
	}, []);

	// Scroll-driven fade on the envelope as you leave the hero
	useEffect(() => {
		if (!sectionRef.current) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const ctx = gsap.context(() => {
			const isMobile = window.matchMedia('(max-width: 639px)').matches;
			gsap.to(shellRef.current, {
				...(isMobile ? {} : { y: -80 }),
				opacity: 0.45,
				ease: 'none',
				scrollTrigger: {
					trigger: sectionRef.current,
					start: 'top top',
					end: 'bottom top',
					scrub: true,
				},
			});
		}, sectionRef);
		return () => ctx.revert();
	}, []);

	const floatHearts = useCallback(() => {
		const hearts = heartRefs.current.filter(Boolean);
		const isMobile = window.matchMedia('(max-width: 639px)').matches;

		hearts.forEach((heart) => {
			gsap.killTweensOf(heart);
			gsap.set(heart, {
				autoAlpha: 0,
				x: 0,
				y: 0,
				scale: 0.2,
				rotate: gsap.utils.random(-12, 12),
			});

			gsap.to(heart, {
				autoAlpha:
					Number(heart.style.getPropertyValue('--heart-opacity')) || 0.85,
				duration: 0.18,
				delay: gsap.utils.random(0, 0.28),
				ease: 'power1.out',
			});
			gsap.to(heart, {
				x: gsap.utils.random(isMobile ? -90 : -150, isMobile ? 90 : 150),
				y: gsap.utils.random(isMobile ? -185 : -300, isMobile ? -52 : -82),
				scale: gsap.utils.random(0.35, 2.05),
				rotate: gsap.utils.random(-72, 72),
				duration: 1.5,
				delay: gsap.utils.random(0, 0.18),
				ease: 'expo.out',
			});
			gsap.to(heart, {
				autoAlpha: 0,
				duration: 0.45,
				delay: gsap.utils.random(1.02, 1.25),
				ease: 'power1.in',
			});
		});
	}, []);

	const openEnvelope = useCallback(() => {
		if (openedRef.current || openingRef.current) return;

		openingRef.current = true;

		const isMobile = window.matchMedia('(max-width: 639px)').matches;
		const shellAnticipationY = isMobile ? -6 : -14;
		const shellOpenY = isMobile ? 178 : -14;
		const cardLift = isMobile ? -175 : -285;
		const photoLift = isMobile ? -92 : -200;
		const topFlapOpenScale = isMobile ? -0.44 : -0.54;

		const tl = gsap.timeline({
			defaults: { ease: 'power3.out' },
			onComplete: () => {
				openedRef.current = true;
				openingRef.current = false;
				setOpened(true);
			},
		});

		tl
			// 1. Envelope rises slightly — anticipation
			.to(shellRef.current, { y: shellAnticipationY, duration: 0.2 })
			.to(
				introRef.current,
				{
					autoAlpha: 0.12,
					y: 0,
					duration: 0.35,
				},
				'<',
			)
			// 2. Wax seal "breaks"
			.to(
				sealRef.current,
				{
					scale: 0.55,
					rotate: 22,
					autoAlpha: 0,
					duration: 0.28,
					ease: 'back.in(1.6)',
				},
				'-=0.08',
			)
			// 3. Top triangle flap folds upward while its top edge stays attached.
			// A 2D hinge keeps the opened flap visible without letting it float away
			// from the envelope body in mobile perspective.
			.to(
				topFlapRef.current,
				{
					scaleY: topFlapOpenScale,
					duration: 0.45,
					ease: 'power3.inOut',
				},
				'-=0.2',
			)
			.set(topFlapRef.current, { zIndex: 12 })
			// On mobile the extracted papers need extra vertical room below the
			// names, so the whole envelope settles lower before the contents rise.
			.to(
				shellRef.current,
				{
					y: shellOpenY,
					duration: 0.35,
					ease: 'power2.out',
				},
				'-=0.28',
			)

			// 4. SAVE THE DATE card rises out of envelope
			.to(
				cardRef.current,
				{
					autoAlpha: 1,
					y: cardLift,
					rotate: 6,
					duration: 0.45,
					ease: 'power2.out',
				},
				'-=0.25',
			)

			// 5. Photo 1 (LEFT) — rises so a good portion sits above envelope rim
			.to(
				sheet1Ref.current,
				{
					autoAlpha: 1,
					y: photoLift,
					x: 0,
					rotate: -8,
					scale: 1,
					duration: 0.4,
					ease: 'power2.out',
				},
				'-=0.1',
			)

			// 6. Photo 2 (RIGHT) — rises to match, ~30% overlap with photo 1
			.to(
				sheet2Ref.current,
				{
					autoAlpha: 1,
					y: photoLift,
					x: 0,
					rotate: 8,
					scale: 1,
					duration: 0.4,
					ease: 'power2.out',
				},
				'-=0.28',
			)

			// 8. Floral sprigs glide in
			.to(
				[leftSprigRef.current, rightSprigRef.current],
				{
					autoAlpha: 1,
					x: 0,
					y: 0,
					rotate: 0,
					stagger: 0.05,
					duration: 0.3,
				},
				'-=0.1',
			)

			// 9. Scroll hint
			.add(floatHearts, '-=0.3')
			.to(hintRef.current, { autoAlpha: 1, y: 0, duration: 0.25 }, '-=0.15');
	}, [floatHearts]);

	useEffect(() => {
		const handleOpenEnvelope = () => openEnvelope();
		window.addEventListener('hero:open-envelope', handleOpenEnvelope);
		return () =>
			window.removeEventListener('hero:open-envelope', handleOpenEnvelope);
	}, [openEnvelope]);

	const open = useCallback(() => {
		if (openedRef.current) {
			document
				.getElementById('date-banner')
				?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		openEnvelope();
	}, [openEnvelope]);

	return (
		<section
			ref={sectionRef}
			data-envelope-opened={opened}
			className='relative mx-auto flex min-h-screen max-w-screen-2xl flex-col items-center justify-start gap-8 overflow-hidden px-4 py-8 text-center sm:justify-between sm:px-6 md:py-14'>
			{/* Intro: couple names */}
			<div
				ref={introRef}
				className='pointer-events-none relative z-0 w-full space-y-4 opacity-60'>
				{/* Stepped layout with a precise meeting point: 2-column grid
            where the GROOM sits in column 1 right-aligned (so its last
            letter touches the column boundary at 50%) and the BRIDE sits
            in column 2 left-aligned (so its first letter starts at the
            same boundary). The "&" spans both columns text-centered, so
            it lands exactly on that 50% line. End of "Trung", the "&",
            and start of "Quỳnh" all align vertically at the middle. */}
				{/* Grid with auto-sized columns: each name's column is exactly as
            wide as the name's text (no 50/50 split that clips). The two
            columns share a boundary in the middle — that's where the
            "g" of Trung ends and the "Q" of Quỳnh starts. The ampersand
            col-spans both and text-centers, landing on that boundary. */}
				{/* Sizes calibrated to fit BOTH names side-by-side in each breakpoint's
            viewport: ~11-char names (Thiện Trung / Quỳnh Trang) at the font
            size need 2 × (chars × ~0.6 × font-size) ≤ viewport - padding.
            Capped at text-[7rem] on 2xl+ screens where it actually fits. */}
				<div className='flex w-full flex-col items-center gap-1 sm:grid sm:grid-cols-[max-content_max-content] sm:items-baseline sm:justify-center sm:gap-y-2'>
					<h1 className='couple-name whitespace-nowrap text-center text-[clamp(3.8rem,18vw,5rem)] leading-[0.76] sm:col-start-1 sm:col-end-2 sm:pr-4 sm:text-right sm:text-[clamp(4.2rem,9vw,8.75rem)] sm:leading-[0.72]'>
						{invitation.couple.groom.name}
					</h1>
					<p className='couple-connector text-center text-3xl leading-none text-bronze-500 sm:col-span-2 sm:col-start-1 sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl'>
						&amp;
					</p>
					<h2 className='couple-name whitespace-nowrap text-center text-[clamp(3.8rem,18vw,5rem)] leading-[0.76] sm:col-start-2 sm:col-end-3 sm:pl-4 sm:text-left sm:text-[clamp(4.2rem,9vw,8.75rem)] sm:leading-[0.72]'>
						{invitation.couple.bride.name}
					</h2>
				</div>
			</div>

			{/* Envelope stage */}
			<button
				ref={shellRef}
				type='button'
				aria-label={opened ? t('hero.scrollHint') : t('hero.tagline')}
				aria-expanded={opened}
				onClick={open}
				className='group relative isolate z-10 mt-6 grid place-items-center transition-transform duration-300 ease-out hover:scale-[1.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-600/50 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50 sm:mt-0'
				style={{
					width: 'clamp(320px, 55vw, 720px)',
					aspectRatio: '4/3',
					perspective: '2200px',
					perspectiveOrigin: 'center top',
					transformStyle: 'preserve-3d',
				}}>
				<span
					className='envelope-stage-veil pointer-events-none absolute -inset-x-[22%] -inset-y-[16%] z-0'
					aria-hidden
				/>
				<span
					className='pointer-events-none absolute inset-0 z-[42]'
					aria-hidden>
					{FLOATING_HEARTS.map((_, index) => (
						<span
							key={index}
							ref={(node) => {
								heartRefs.current[index] = node;
							}}
							className='absolute h-4 w-4 text-[color:var(--color-envelope-bordeaux)] sm:h-5 sm:w-5'
							style={{
								left: `${46 + (index % 4) * 2}%`,
								top: `${48 + (index % 3) * 3}%`,
								opacity: 0,
								color: 'var(--color-envelope-bordeaux)',
								['--heart-opacity' as string]:
									HEART_OPACITIES[index % HEART_OPACITIES.length],
							}}>
							<Heart className='h-full w-full' fill='currentColor' strokeWidth={1.35} />
						</span>
					))}
				</span>

				{/* Two LARGER portrait photos with photo 2 (RIGHT) overlapping
            photo 1 (LEFT) by ~30% of photo width.
              sheet1 (left-[5%], w-[46%])  → spans  5 – 51%  from left
              sheet2 (right-[18%], w-[46%]) → spans 36 – 82%  from left
              overlap = 36–51% = 15% of envelope = 15/46 ≈ 33% of photo */}

				{/* Envelope backing sits behind every paper item. */}
				<div className='pointer-events-none absolute inset-0 z-10'>
					<EnvelopeBody
						idPrefix='env-back'
						variant='back'
						bodyRef={envBodyRef}
						leftFlapRef={envLeftFlapRef}
						rightFlapRef={envRightFlapRef}
						bottomFlapRef={envBottomFlapRef}
					/>
				</div>

				{/* Photo 1 — LEFT, gallery[0] */}
				<div
					ref={sheet1Ref}
					style={{ opacity: 0 }}
					className='paper-panel pointer-events-none absolute left-[11%] top-[18%] z-[22] aspect-[3/4] w-[46%] origin-bottom overflow-hidden p-1.5'>
					<Image
						src='/album/CD.JPG'
						alt='Wedding moment 1'
						width={600}
						height={800}
						className='h-full w-full object-cover'
					/>
				</div>

				{/* Photo 2 — RIGHT, gallery[1] — z-[24] so it sits ON TOP of
            sheet1 in the ~30% overlap zone */}
				<div
					ref={sheet2Ref}
					style={{ opacity: 0 }}
					className='paper-panel pointer-events-none absolute right-[12%] top-[18%] z-[24] aspect-[3/4] w-[46%] origin-bottom overflow-hidden p-1.5'>
					<Image
						src='/album/CR.JPG'
						alt='Wedding moment 2'
						width={600}
						height={800}
						className='h-full w-full object-cover'
					/>
				</div>

				{/* Main SAVE THE DATE card sits between the back and front envelope
            layers. The front flaps mask its lower portion while it rises. */}
				<div
					ref={cardRef}
					style={{ opacity: 0 }}
					className='paper-panel pointer-events-none absolute left-[56%] top-[5%] z-20 flex aspect-square w-[64%] -translate-x-1/2 flex-col items-center justify-start bg-[#fffdf8] px-3 pt-4 sm:px-4 sm:pt-6'>
					<span className='text-[0.6rem] uppercase tracking-[0.34em] text-burgundy-900/60 sm:text-[0.7rem] sm:tracking-[0.42em]'>
						{invitation.couple.initials}
					</span>
					<span className='mt-2 font-serif text-2xl font-light uppercase leading-none text-burgundy-900 sm:text-3xl md:text-4xl'>
						{t('hero.saveTheDateLine1')}
					</span>
					<span className='mt-1 font-serif text-2xl font-light uppercase leading-none text-burgundy-900 sm:text-3xl md:text-4xl'>
						{t('hero.saveTheDateLine2')}
					</span>
				</div>

				{/* Envelope pocket front sits above card/photos, masking their lower
            edges so they emerge from inside the envelope. */}
				<div className='pointer-events-none absolute inset-0 z-30'>
					<EnvelopeBody
						idPrefix='env-front'
						variant='front'
						bodyRef={envBodyRef}
						leftFlapRef={envLeftFlapRef}
						rightFlapRef={envRightFlapRef}
						bottomFlapRef={envBottomFlapRef}
					/>
				</div>

				{/* Botanical cutouts are fully on top of the envelope face. Keeping
            them whole avoids the hard vertical slicing that made them look
            detached from the paper edge. */}
				<span
					ref={leftSprigRef}
					style={{ opacity: 0 }}
					className='botanical-cutout botanical-cutout-left pointer-events-none absolute left-[-13%] bottom-[12%] z-[35] h-64 w-44 sm:left-[-23%] sm:bottom-[13%] sm:h-[32rem] sm:w-96 md:left-[-22%] md:bottom-[14%] md:h-[36rem] md:w-[26rem]'
					aria-hidden>
					<Image
						src='/wedding-assets/pampas-grass.png'
						alt=''
						width={512}
						height={768}
						className='absolute bottom-[10%] left-0 h-[82%] w-[90%] object-contain'
						style={{ transform: 'rotate(-13deg)' }}
					/>
					<Image
						src='/wedding-assets/white-roses.png'
						alt=''
						width={512}
						height={768}
						className='absolute bottom-0 left-[12%] h-[68%] w-[86%] object-contain'
						style={{ transform: 'rotate(-9deg)' }}
					/>
				</span>
				<span
					ref={rightSprigRef}
					style={{ opacity: 0 }}
					className='botanical-cutout botanical-cutout-right pointer-events-none absolute right-[-13%] bottom-[7%] z-[35] h-64 w-44 sm:right-[-24%] sm:bottom-[9%] sm:h-[32rem] sm:w-96 md:right-[-23%] md:bottom-[10%] md:h-[36rem] md:w-[26rem]'
					aria-hidden>
					<Image
						src='/wedding-assets/pampas-grass.png'
						alt=''
						width={512}
						height={768}
						className='absolute bottom-[10%] right-0 h-[82%] w-[90%] object-contain'
						style={{ transform: 'rotate(13deg) scaleX(-1)' }}
					/>
					<Image
						src='/wedding-assets/white-roses.png'
						alt=''
						width={512}
						height={768}
						className='absolute bottom-0 right-[12%] h-[68%] w-[86%] object-contain'
						style={{ transform: 'rotate(9deg) scaleX(-1)' }}
					/>
				</span>

				<EnvelopeTopFlap ref={topFlapRef} />

				<EnvelopeSeal ref={sealRef} />

				{/* Status text */}
				<span className='absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-burgundy-900/75 sm:text-xs sm:tracking-[0.34em]'>
					{opened ? (
						t('hero.scrollHint')
					) : (
						<>
							<span className='sm:hidden'>{t('hero.tapHint')}</span>
							<span className='hidden sm:inline'>{t('hero.tagline')}</span>
						</>
					)}
				</span>
			</button>

			{/* Music toggle + scroll hint */}
			<div
				ref={hintRef}
				style={{ opacity: 0 }}
				className='flex flex-col items-center gap-5'>
				<MusicToggle />
				<ChevronDown
					className='h-8 w-8 animate-bounce text-burgundy-900/60'
					strokeWidth={1.4}
				/>
			</div>
		</section>
	);
}
