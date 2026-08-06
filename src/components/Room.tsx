import { Fragment, useEffect, useState } from 'react';
import ProjectHotspot from './ProjectHotspot';
import LightSwitch from './LightSwitch';
import {
	NAV_CONTAINER_CLASS,
	NAV_ENTRIES,
	NAV_ITEM_CLASS,
	NAV_ITEM_CURRENT_CLASS,
	NAV_SEPARATOR_CLASS,
} from '../lib/nav';

interface Region {
	left: number;
	top: number;
	width: number;
	height: number;
}

interface HotspotConfig {
	id: string;
	title: string;
	subtitle?: string;
	description?: string;
	link?: string;
	region: Region;
	glowSrc: string;
}

interface LightSwitchConfig {
	region: Region;
	dayGlowSrc: string;
	nightGlowSrc: string;
}

interface RoomProps {
	roomSrc: string;
	roomNightSrc: string;
	roomWidth: number;
	roomHeight: number;
	hotspots: HotspotConfig[];
	lightSwitch: LightSwitchConfig;
}

export default function Room({ roomSrc, roomNightSrc, roomWidth, roomHeight, hotspots, lightSwitch }: RoomProps) {
	const [started, setStarted] = useState(false);
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const [isNight, setIsNight] = useState(false);

	useEffect(() => {
		const onGameStarted = () => setStarted(true);
		window.addEventListener('game-started', onGameStarted);
		return () => window.removeEventListener('game-started', onGameStarted);
	}, []);

	function clearHover(id: string) {
		setHoveredId((current) => (current === id ? null : current));
	}

	return (
		<>
			{started && (
				<nav className={NAV_CONTAINER_CLASS}>
					{NAV_ENTRIES.map((entry, index) => {
						// Hovering an entry glows its room object; "Home" has none.
						const hover = entry.hotspotId
							? {
									onMouseEnter: () => setHoveredId(entry.hotspotId!),
									onMouseLeave: () => clearHover(entry.hotspotId!),
								}
							: {};

						return (
							<Fragment key={entry.label}>
								{index > 0 && <span className={NAV_SEPARATOR_CLASS}>·</span>}
								{entry.href === '/' ? (
									// This *is* the home page — mark it, don't link back to it.
									<span className={`${NAV_ITEM_CLASS} ${NAV_ITEM_CURRENT_CLASS}`} aria-current="page">
										{entry.label}
									</span>
								) : entry.href ? (
									<a href={entry.href} className={NAV_ITEM_CLASS} {...hover}>
										{entry.label}
									</a>
								) : (
									// No page yet — hover-only, so it glows the object without
									// navigating anywhere.
									<button type="button" className={NAV_ITEM_CLASS} {...hover}>
										{entry.label}
									</button>
								)}
							</Fragment>
						);
					})}
				</nav>
			)}

			<main className="flex min-h-screen items-center justify-center bg-neutral-900 p-4">
				<div
					className="relative h-auto max-w-full"
					style={{ aspectRatio: `${roomWidth} / ${roomHeight}`, width: `min(100%, ${roomWidth}px)` }}
				>
					<img
						src={isNight ? roomNightSrc : roomSrc}
						width={roomWidth}
						height={roomHeight}
						alt="A pixel-art bedroom, viewed from above"
						className="absolute inset-0 h-full w-full [image-rendering:pixelated]"
					/>

					{hotspots.map((hotspot) => (
						<ProjectHotspot
							key={hotspot.id}
							region={hotspot.region}
							glowSrc={hotspot.glowSrc}
							title={hotspot.title}
							subtitle={hotspot.subtitle}
							description={hotspot.description}
							link={hotspot.link}
							isHovered={hoveredId === hotspot.id}
							onHoverStart={() => setHoveredId(hotspot.id)}
							onHoverEnd={() => clearHover(hotspot.id)}
						/>
					))}

					<LightSwitch
						region={lightSwitch.region}
						dayGlowSrc={lightSwitch.dayGlowSrc}
						nightGlowSrc={lightSwitch.nightGlowSrc}
						isNight={isNight}
						onToggle={() => setIsNight((current) => !current)}
					/>
				</div>
			</main>
		</>
	);
}
