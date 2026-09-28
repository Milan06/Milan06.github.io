import { Fragment, useEffect, useRef, useState } from 'react';
import ProjectHotspot from './ProjectHotspot';
import LightSwitch from './LightSwitch';
import Character from './Character';
import { useWalkingCharacter } from './useWalkingCharacter';
import {
	NAV_CONTAINER_CLASS,
	NAV_ENTRIES,
	NAV_ITEM_CLASS,
	NAV_ITEM_CURRENT_CLASS,
	NAV_SEPARATOR_CLASS,
	hrefForHotspot,
	opensInNewTab,
} from '../lib/nav';
import { shouldSkipStartScreen } from '../lib/startGate';
import { zoneAt } from '../lib/roomPhysics';
import { BLOCKERS, FLOOR, REACH_ZONES, SPAWN } from '../lib/roomMap';

const LIGHT_SWITCH_ID = 'light-switch';

// Enter on one of these belongs to it (the browser clicks it), not to the character.
function isFocusedControl(element: Element | null) {
	return element instanceof HTMLElement && element !== document.body && element.matches('a, button, input, select, textarea');
}

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
	const [openModalCount, setOpenModalCount] = useState(0);

	const { position, facing } = useWalkingCharacter({
		enabled: started,
		paused: openModalCount > 0,
		spawn: SPAWN,
		floor: FLOOR,
		blockers: BLOCKERS,
	});

	// The object the character is standing at. It glows just like a hovered
	// one, but a mouse hover wins while there is one.
	const nearId = started ? zoneAt(position, REACH_ZONES) : null;
	const glowingId = hoveredId ?? nearId;

	// Each object's own link/button, so Enter can click it and get exactly what
	// a mouse click does — page, new tab, modal or light switch.
	const triggers = useRef(new Map<string, HTMLElement>());
	// One ref callback per object, reused across renders — the room re-renders
	// every frame while the character walks, and a fresh callback each time
	// would make React detach and reattach every ref at 60fps.
	const triggerRefs = useRef(new Map<string, (element: HTMLElement | null) => void>());
	const registerTrigger = (id: string) => {
		let ref = triggerRefs.current.get(id);
		if (!ref) {
			ref = (element) => {
				if (element) triggers.current.set(id, element);
				else triggers.current.delete(id);
			};
			triggerRefs.current.set(id, ref);
		}
		return ref;
	};

	useEffect(() => {
		if (!nearId || openModalCount > 0) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Enter' || event.repeat || isFocusedControl(document.activeElement)) return;
			event.preventDefault();
			triggers.current.get(nearId)?.click();
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [nearId, openModalCount]);

	useEffect(() => {
		// Checked here rather than in the initial state so server and client render
		// the same thing and hydration stays quiet; the nav appears a frame later.
		if (shouldSkipStartScreen()) setStarted(true);

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
									<a
										href={entry.href}
										className={NAV_ITEM_CLASS}
										target={entry.newTab ? '_blank' : undefined}
										rel={entry.newTab ? 'noopener' : undefined}
										{...hover}
									>
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
							href={hrefForHotspot(hotspot.id)}
							newTab={opensInNewTab(hotspot.id)}
							isHovered={glowingId === hotspot.id}
							onHoverStart={() => setHoveredId(hotspot.id)}
							onHoverEnd={() => clearHover(hotspot.id)}
							showEnterHint={nearId === hotspot.id}
							triggerRef={registerTrigger(hotspot.id)}
							onOpenChange={(isOpen) => setOpenModalCount((count) => (isOpen ? count + 1 : Math.max(0, count - 1)))}
						/>
					))}

					<LightSwitch
						region={lightSwitch.region}
						dayGlowSrc={lightSwitch.dayGlowSrc}
						nightGlowSrc={lightSwitch.nightGlowSrc}
						isNight={isNight}
						onToggle={() => setIsNight((current) => !current)}
						isNear={nearId === LIGHT_SWITCH_ID}
						triggerRef={registerTrigger(LIGHT_SWITCH_ID)}
					/>

					{started && (
						<Character position={position} facing={facing} roomWidth={roomWidth} roomHeight={roomHeight} />
					)}
				</div>
			</main>
		</>
	);
}
