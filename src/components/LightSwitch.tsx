import { useState } from 'react';

interface Region {
	left: number;
	top: number;
	width: number;
	height: number;
}

interface LightSwitchProps {
	region: Region;
	dayGlowSrc: string;
	nightGlowSrc: string;
	isNight: boolean;
	onToggle: () => void;
}

export default function LightSwitch({ region, dayGlowSrc, nightGlowSrc, isNight, onToggle }: LightSwitchProps) {
	const [isHovered, setIsHovered] = useState(false);

	const regionStyle = {
		left: `${region.left}%`,
		top: `${region.top}%`,
		width: `${region.width}%`,
		height: `${region.height}%`,
	};

	return (
		<>
			<button
				type="button"
				aria-label="Light switch"
				className="absolute cursor-pointer"
				style={regionStyle}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onClick={onToggle}
			/>

			<img
				src={isNight ? nightGlowSrc : dayGlowSrc}
				alt=""
				className="pointer-events-none absolute inset-0 h-full w-full [image-rendering:pixelated] transition-opacity duration-150"
				style={{ opacity: isHovered ? 1 : 0 }}
			/>

			{isHovered && (
				<div
					className="pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-black/80 px-2 py-1 text-center font-mono text-xs text-white"
					style={{ left: `${region.left + region.width / 2}%`, top: `${region.top}%` }}
				>
					Light Switch
				</div>
			)}
		</>
	);
}
