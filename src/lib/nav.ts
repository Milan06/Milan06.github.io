/**
 * Shared styling for the pill nav.
 *
 * The nav is implemented twice on purpose (see docs/adding-a-page.md):
 * `Room.tsx` renders a React version on the home page because hovering a nav
 * item has to glow the matching room object, and `NavPill.astro` renders a
 * static version everywhere else. These constants are what keep the two from
 * drifting apart visually — change the look here, not in either component.
 *
 * Keep the values as plain string literals. Tailwind scans source files for
 * class names, so classes assembled dynamically at runtime would not be
 * generated.
 */

export const NAV_CONTAINER_CLASS =
	"fixed left-1/2 top-4 z-40 flex -translate-x-1/2 flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-black/70 px-6 py-3 font-['Press_Start_2P'] text-xs text-white";

export const NAV_ITEM_CLASS = 'whitespace-nowrap transition-colors hover:text-cyan-300';

/** Applied on top of NAV_ITEM_CLASS for the item matching the current page. */
export const NAV_ITEM_CURRENT_CLASS = 'text-cyan-300';

export const NAV_SEPARATOR_CLASS = 'text-neutral-500';
