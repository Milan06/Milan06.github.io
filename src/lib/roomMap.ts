import type { Box, Point, Zone } from './roomPhysics';

/**
 * Where the walking character can go, traced from room-base2.png in source
 * pixels (1672 × 941) — the same space as the hotspot boxes in index.astro.
 * The night image shares the layout, so one map serves both.
 *
 * If the room art changes, re-trace these: a blocker that's off by a few
 * pixels shows up as the character standing on the furniture's edge.
 */

/** The floor. The character's feet never leave it. */
export const FLOOR: Box = { left: 217, top: 250, right: 1468, bottom: 852 };

/** Furniture the feet can't enter. Tops run to 0 — nothing behind them is walkable. */
export const BLOCKERS: Box[] = [
	{ left: 205, top: 0, right: 364, bottom: 600 }, // wardrobe
	{ left: 366, top: 0, right: 692, bottom: 350 }, // desk, including its legs
	{ left: 473, top: 0, right: 582, bottom: 397 }, // desk chair
	{ left: 1048, top: 0, right: 1187, bottom: 338 }, // nightstand
	{ left: 1199, top: 0, right: 1432, bottom: 597 }, // bed
	{ left: 1182, top: 595, right: 1446, bottom: 837 }, // dresser
	{ left: 655, top: 764, right: 804, bottom: 941 }, // door
	{ left: 806, top: 806, right: 842, bottom: 941 }, // light switch
];

/** In front of the doorway, centred on it. */
export const SPAWN: Point = { x: 729.5, y: 750 };

/**
 * Where to stand to reach each interactable, keyed by hotspot id (plus
 * `light-switch`). Standing in one glows that object; Enter selects it.
 *
 * These are floor areas, not the objects themselves: everything on the desk
 * sits behind the desk's edge, so "close to the monitor" really means "at the
 * desk, in front of the monitor". They must not overlap.
 */
export const REACH_ZONES: Zone[] = [
	{ id: 'resume', box: { left: 366, top: 350, right: 455, bottom: 450 } },
	{ id: 'about-me', box: { left: 455, top: 350, right: 590, bottom: 480 } },
	{ id: 'bias-detection', box: { left: 590, top: 350, right: 640, bottom: 450 } },
	{ id: 'blog-post', box: { left: 640, top: 250, right: 760, bottom: 450 } },
	{ id: 'poker-deck', box: { left: 990, top: 250, right: 1195, bottom: 440 } },
	{ id: 'light-switch', box: { left: 780, top: 730, right: 900, bottom: 853 } },
];
