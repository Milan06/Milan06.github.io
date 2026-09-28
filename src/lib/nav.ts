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

// Centred with inset-x-0 + mx-auto + w-fit rather than left-1/2 +
// -translate-x-1/2. The transform approach looks identical but sets the
// containing-block edge at 50%, so only the right half of the viewport is
// available for layout and the pill wrapped long before it had to. The
// transform re-centres it visually, but flex-wrap has already decided by then.
// max-w keeps a gutter so it never runs edge to edge.
export const NAV_CONTAINER_CLASS =
	"fixed inset-x-0 top-4 z-40 mx-auto flex w-fit max-w-[calc(100vw-2rem)] flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-black/70 px-6 py-3 font-['Press_Start_2P'] text-xs text-white";

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
 * - `newTab` is for destinations that aren't pages of this site — currently the
 *   résumé PDF. It adds target/rel, and keeps the item from ever being marked
 *   as the current page, since you never "are" on it.
 */
export interface NavEntry {
	label: string;
	href?: string;
	hotspotId?: string;
	newTab?: boolean;
}

export const NAV_ENTRIES: NavEntry[] = [
	{ label: 'Home', href: '/' },
	{ label: 'CashOut Poker', hotspotId: 'poker-deck' },
	{ label: 'Bias Detection Project', hotspotId: 'bias-detection' },
	// Label is accented; the hotspotId stays plain ASCII — it keys the mapping to
	// the room object and the asset filename. The PDF filename stays ASCII too:
	// it becomes the visitor's downloaded filename, and accents in a URL encode
	// into noise.
	{ label: 'Résumé', href: '/Milan_Patel_Resume.pdf', hotspotId: 'resume', newTab: true },
	{ label: 'About Me', href: '/about-me', hotspotId: 'about-me' },
	{ label: 'Blog Post', href: '/blog', hotspotId: 'blog-post' },
];

/**
 * Nav items for static pages, where every item has to go somewhere. Entries
 * with no page of their own fall back to the room, which is where their object
 * lives.
 */
export const navLinks = () =>
	NAV_ENTRIES.map(({ label, href, newTab }) => ({ label, href: href ?? '/', newTab: newTab ?? false }));

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

/** Whether that room object's destination should open in a new tab. */
export function opensInNewTab(hotspotId: string): boolean {
	return NAV_ENTRIES.find((entry) => entry.hotspotId === hotspotId)?.newTab ?? false;
}
