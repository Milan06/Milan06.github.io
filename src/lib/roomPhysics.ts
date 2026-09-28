/**
 * Movement and collision for the walking character, in room-image source
 * pixels (the same space the hotspot boxes in index.astro are traced in).
 * Kept free of React so the maths can be reasoned about — and tested — alone.
 *
 * The character's position is the point between its feet. Only a short box
 * around the feet collides, so its head and body can overlap the furniture
 * behind it — that's what makes a top-down room read as having depth.
 */

export interface Box {
	left: number;
	top: number;
	right: number;
	bottom: number;
}

export interface Point {
	x: number;
	y: number;
}

export interface Zone {
	id: string;
	box: Box;
}

export const FOOT_WIDTH = 40;
export const FOOT_HEIGHT = 16;

export function footBox({ x, y }: Point): Box {
	return { left: x - FOOT_WIDTH / 2, top: y - FOOT_HEIGHT, right: x + FOOT_WIDTH / 2, bottom: y };
}

function spansOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
	return aStart < bEnd && aEnd > bStart;
}

/**
 * Where the character ends up after trying to move by (dx, dy).
 *
 * Each axis is resolved separately, so walking diagonally into a desk slides
 * along its edge instead of stopping dead. Blockers are checked across the
 * whole step rather than only at its end, so a fast frame can't tunnel
 * through something thin.
 */
export function moveCharacter(from: Point, dx: number, dy: number, floor: Box, blockers: Box[]): Point {
	const halfWidth = FOOT_WIDTH / 2;
	let { x, y } = from;

	if (dx !== 0) {
		const feet = footBox({ x, y });
		let target = x + dx;
		for (const blocker of blockers) {
			if (!spansOverlap(feet.top, feet.bottom, blocker.top, blocker.bottom)) continue;
			if (dx > 0 && blocker.left >= feet.right) target = Math.min(target, blocker.left - halfWidth);
			if (dx < 0 && blocker.right <= feet.left) target = Math.max(target, blocker.right + halfWidth);
		}
		x = Math.min(Math.max(target, floor.left + halfWidth), floor.right - halfWidth);
	}

	if (dy !== 0) {
		const feet = footBox({ x, y });
		let target = y + dy;
		for (const blocker of blockers) {
			if (!spansOverlap(feet.left, feet.right, blocker.left, blocker.right)) continue;
			if (dy > 0 && blocker.top >= feet.bottom) target = Math.min(target, blocker.top);
			if (dy < 0 && blocker.bottom <= feet.top) target = Math.max(target, blocker.bottom + FOOT_HEIGHT);
		}
		y = Math.min(Math.max(target, floor.top + FOOT_HEIGHT), floor.bottom);
	}

	return { x, y };
}

/** The first zone the character is standing in (by the point between its feet), if any. */
export function zoneAt({ x, y }: Point, zones: Zone[]): string | null {
	const zone = zones.find(({ box }) => x >= box.left && x < box.right && y >= box.top && y < box.bottom);
	return zone?.id ?? null;
}
