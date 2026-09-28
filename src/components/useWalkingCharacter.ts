import { useEffect, useRef, useState } from 'react';
import type { Facing } from './Character';
import { moveCharacter, type Box, type Point } from '../lib/roomPhysics';

/** Source pixels per second — about 3.5 seconds to cross the room. */
const SPEED = 360;

/** A frame longer than this (a background tab, a hitch) is treated as this long, so the character never jumps. */
const MAX_FRAME_SECONDS = 0.05;

// event.code, not event.key, so WASD stays in the same place on non-QWERTY
// layouts and still works with Caps Lock on.
const KEY_DIRECTIONS: Record<string, Facing> = {
	ArrowUp: 'up',
	ArrowDown: 'down',
	ArrowLeft: 'left',
	ArrowRight: 'right',
	KeyW: 'up',
	KeyS: 'down',
	KeyA: 'left',
	KeyD: 'right',
};

const STEP: Record<Facing, Point> = {
	up: { x: 0, y: -1 },
	down: { x: 0, y: 1 },
	left: { x: -1, y: 0 },
	right: { x: 1, y: 0 },
};

function isTextInput(target: EventTarget | null) {
	return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

interface Options {
	/** Off until the start screen is dismissed. */
	enabled: boolean;
	/** Frozen in place, e.g. while a modal is open. */
	paused: boolean;
	spawn: Point;
	floor: Box;
	blockers: Box[];
}

/** Arrow-key / WASD movement for the room character, with collision. */
export function useWalkingCharacter({ enabled, paused, spawn, floor, blockers }: Options) {
	const [position, setPosition] = useState(spawn);
	const [facing, setFacing] = useState<Facing>('up');
	const positionRef = useRef(spawn);

	// Held directions, most recently pressed last — that one sets the facing.
	const heldRef = useRef<Facing[]>([]);

	useEffect(() => {
		if (!enabled || paused) return;
		const held = heldRef.current;

		const onKeyDown = (event: KeyboardEvent) => {
			const direction = KEY_DIRECTIONS[event.code];
			if (!direction || event.metaKey || event.ctrlKey || event.altKey || isTextInput(event.target)) return;
			// Arrow keys would otherwise scroll the page.
			event.preventDefault();
			// Walking means the keyboard is driving the character now, so let go of
			// any focused link or button — otherwise Enter would activate that
			// instead of the object the character is standing at.
			if (document.activeElement instanceof HTMLElement && document.activeElement !== document.body) {
				document.activeElement.blur();
			}
			if (!held.includes(direction)) held.push(direction);
		};

		const onKeyUp = (event: KeyboardEvent) => {
			const direction = KEY_DIRECTIONS[event.code];
			const index = direction ? held.indexOf(direction) : -1;
			if (index !== -1) held.splice(index, 1);
		};

		// A key released while the window is in the background never fires keyup.
		const release = () => {
			held.length = 0;
		};

		let frame = 0;
		let last = performance.now();
		const tick = (now: number) => {
			const seconds = Math.min((now - last) / 1000, MAX_FRAME_SECONDS);
			last = now;

			let dx = 0;
			let dy = 0;
			for (const direction of held) {
				dx += STEP[direction].x;
				dy += STEP[direction].y;
			}

			if (dx !== 0 || dy !== 0) {
				// Normalise so a diagonal isn't ~40% faster than a straight line.
				const scale = (SPEED * seconds) / Math.hypot(dx, dy);
				const next = moveCharacter(positionRef.current, dx * scale, dy * scale, floor, blockers);
				if (next.x !== positionRef.current.x || next.y !== positionRef.current.y) {
					positionRef.current = next;
					setPosition(next);
				}
			}
			if (held.length > 0) setFacing(held[held.length - 1]);

			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
		window.addEventListener('blur', release);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
			window.removeEventListener('blur', release);
			// Pausing mid-stride shouldn't leave the character walking on resume.
			release();
		};
	}, [enabled, paused, floor, blockers]);

	return { position, facing };
}
