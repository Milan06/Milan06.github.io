import type { Point } from '../lib/roomPhysics';

export type Facing = 'up' | 'down' | 'left' | 'right';

// Drawn size in room source pixels. Anchored at the feet, so it's the feet
// that line up with the collision box in roomPhysics.ts.
const WIDTH = 56;
const HEIGHT = 92;

interface CharacterProps {
	position: Point;
	facing: Facing;
	roomWidth: number;
	roomHeight: number;
}

/**
 * Placeholder figure until real sprite art exists: head, hair and shirt blocks
 * in CSS, with the eyes showing which way it faces. Swap the inner markup for
 * a sprite sheet later — the positioning wrapper can stay as it is.
 */
export default function Character({ position, facing, roomWidth, roomHeight }: CharacterProps) {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute"
			style={{
				left: `${((position.x - WIDTH / 2) / roomWidth) * 100}%`,
				top: `${((position.y - HEIGHT) / roomHeight) * 100}%`,
				width: `${(WIDTH / roomWidth) * 100}%`,
				height: `${(HEIGHT / roomHeight) * 100}%`,
			}}
		>
			<div className="absolute bottom-0 left-[10%] h-[12%] w-[80%] rounded-full bg-black/30" />
			<div className="absolute top-[44%] left-[16%] h-[48%] w-[68%] rounded-sm border-2 border-black bg-red-600" />
			<div className="absolute top-[4%] left-[12%] h-[44%] w-[76%] overflow-hidden rounded-sm border-2 border-black bg-amber-200">
				<div className={`absolute inset-x-0 top-0 bg-amber-900 ${facing === 'up' ? 'h-full' : 'h-[34%]'}`} />
				{(facing === 'down' || facing === 'left') && (
					<div className="absolute top-[52%] left-[22%] h-[18%] w-[14%] bg-black" />
				)}
				{(facing === 'down' || facing === 'right') && (
					<div className="absolute top-[52%] right-[22%] h-[18%] w-[14%] bg-black" />
				)}
			</div>
		</div>
	);
}
