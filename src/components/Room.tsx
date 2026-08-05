import { Fragment, useEffect, useState } from 'react';
import ProjectHotspot from './ProjectHotspot';
import LightSwitch from './LightSwitch';

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
				<nav className="fixed left-1/2 top-4 z-40 flex -translate-x-1/2 flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-black/70 px-6 py-3 font-['Press_Start_2P'] text-xs text-white">
					{hotspots.map((hotspot, index) => (
						<Fragment key={hotspot.id}>
							{index > 0 && <span className="text-neutral-500">·</span>}
							<button
								type="button"
								className="whitespace-nowrap transition-colors hover:text-cyan-300"
								onMouseEnter={() => setHoveredId(hotspot.id)}
								onMouseLeave={() => clearHover(hotspot.id)}
							>
								{hotspot.title}
							</button>
						</Fragment>
					))}
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
