import { useEffect, useState } from 'react';

interface Region {
	left: number;
	top: number;
	width: number;
	height: number;
}

interface ProjectHotspotProps {
	region: Region;
	glowSrc: string;
	title: string;
	subtitle?: string;
	description?: string;
	link?: string;
	/**
	 * The object's own page, once it has one. Set → clicking navigates there and
	 * the in-room modal is skipped entirely. Unset → clicking opens the modal.
	 * Hover and glow behave identically either way. See docs/adding-a-page.md.
	 */
	href?: string;
	/** For destinations that aren't pages of this site, e.g. the résumé PDF. */
	newTab?: boolean;
	isHovered: boolean;
	onHoverStart: () => void;
	onHoverEnd: () => void;
	/** The walking character is standing at this object, so Enter will select it. */
	showEnterHint?: boolean;
	/** The link/button a click lands on — the room clicks it when Enter is pressed. */
	triggerRef?: (element: HTMLElement | null) => void;
	/** So the room can freeze the character while the modal is up. */
	onOpenChange?: (isOpen: boolean) => void;
}

export default function ProjectHotspot({
	region,
	glowSrc,
	title,
	subtitle,
	description,
	link,
	href,
	newTab,
	isHovered,
	onHoverStart,
	onHoverEnd,
	showEnterHint,
	triggerRef,
	onOpenChange,
}: ProjectHotspotProps) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		onOpenChange?.(isOpen);
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setIsOpen(false);
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [isOpen]);

	const regionStyle = {
		left: `${region.left}%`,
		top: `${region.top}%`,
		width: `${region.width}%`,
		height: `${region.height}%`,
	};

	return (
		<>
			{href ? (
				<a
					ref={triggerRef}
					href={href}
					aria-label={subtitle ? `${title} — ${subtitle}` : title}
					className="absolute cursor-pointer"
					style={regionStyle}
					target={newTab ? '_blank' : undefined}
					rel={newTab ? 'noopener' : undefined}
					onMouseEnter={onHoverStart}
					onMouseLeave={onHoverEnd}
				/>
			) : (
				<button
					ref={triggerRef}
					type="button"
					aria-label={subtitle ? `${title} — ${subtitle}` : title}
					aria-haspopup="dialog"
					className="absolute cursor-pointer"
					style={regionStyle}
					onMouseEnter={onHoverStart}
					onMouseLeave={onHoverEnd}
					onClick={() => setIsOpen(true)}
				/>
			)}

			<img
				src={glowSrc}
				alt=""
				className="pointer-events-none absolute inset-0 h-full w-full [image-rendering:pixelated] transition-opacity duration-150"
				style={{ opacity: isHovered ? 1 : 0 }}
			/>

			{isHovered && !isOpen && (
				<div
					className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-black/80 px-2 py-1 text-center font-mono text-xs text-white"
					style={{ left: `${region.left + region.width / 2}%`, top: `${region.top}%` }}
				>
					<div className="font-bold">"{title}"</div>
					{subtitle && <div>{subtitle}</div>}
					{showEnterHint && <div className="text-neutral-400">Press ↵ Enter</div>}
				</div>
			)}

			{isOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
					role="dialog"
					aria-modal="true"
					aria-labelledby="project-hotspot-title"
					onClick={() => setIsOpen(false)}
				>
					<div
						className="max-w-md rounded-lg bg-neutral-900 p-6 text-white shadow-xl"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2 id="project-hotspot-title" className="text-xl font-bold">
									{title}
								</h2>
								{subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
							</div>
							<button
								type="button"
								aria-label="Close"
								className="text-neutral-400 hover:text-white"
								onClick={() => setIsOpen(false)}
							>
								✕
							</button>
						</div>
						{description && <p className="mt-4 text-sm text-neutral-200">{description}</p>}
						{link && (
							<a href={link} className="mt-4 inline-block text-sm font-semibold text-blue-400 hover:underline">
								Read more →
							</a>
						)}
					</div>
				</div>
			)}
		</>
	);
}
