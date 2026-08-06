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

// max-w keeps the pill inside the viewport on narrow screens — without it the
// items refuse to wrap, the pill grows past the screen edge, and the whole
// document scrolls horizontally.
export const NAV_CONTAINER_CLASS =
	"fixed left-1/2 top-4 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-black/70 px-6 py-3 font-['Press_Start_2P'] text-xs text-white";

export const NAV_ITEM_CLASS = 'whitespace-nowrap transition-colors hover:text-cyan-300';

/** Applied on top of NAV_ITEM_CLASS for the item matching the current page. */
export const NAV_ITEM_CURRENT_CLASS = 'text-cyan-300';

export const NAV_SEPARATOR_CLASS = 'text-neutral-500';

/**
 * The nav destinations, in display order — the single source of truth for both
 * navs.
 *
 * - `href` is set only when that page actually exists. Entries without one are
 *   still hotspots in the room waiting for their page; each gets an `href` here
 *   as its page ships (see the modal-vs-href convention in
 *   docs/adding-a-page.md).
 * - `hotspotId` matches an id in the home page's hotspot config, and is what
 *   lets hovering a nav item glow the matching room object. "Home" has none —
 *   there is nothing in the room to light up.
 */
export interface NavEntry {
	label: string;
	href?: string;
	hotspotId?: string;
}

export const NAV_ENTRIES: NavEntry[] = [
	{ label: 'Home', href: '/' },
	{ label: 'CashOut Poker', hotspotId: 'poker-deck' },
	// Label is accented; the hotspotId stays plain ASCII — it keys the mapping to
	// the room object and the asset filename.
	{ label: 'Résumé', hotspotId: 'resume' },
	{ label: 'About Me', href: '/about-me', hotspotId: 'about-me' },
	{ label: 'Blog Post', href: '/blog', hotspotId: 'blog-post' },
];

/**
 * Nav items for static pages, where every item has to go somewhere. Entries
 * with no page of their own fall back to the room, which is where their object
 * lives.
 */
export const navLinks = () => NAV_ENTRIES.map(({ label, href }) => ({ label, href: href ?? '/' }));

/**
 * The page a room object links to, or undefined while it has none — in which
 * case the hotspot falls back to opening its in-room modal.
 *
 * Room hotspots read their href from here rather than defining it themselves,
 * so setting `href` on an entry above is genuinely the only change needed when
 * a page ships: the nav item and the object in the room both follow.
 */
export function hrefForHotspot(hotspotId: string): string | undefined {
	return NAV_ENTRIES.find((entry) => entry.hotspotId === hotspotId)?.href;
}
