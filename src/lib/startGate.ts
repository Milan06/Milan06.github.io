/**
 * The Start screen gate.
 *
 * The site is static with no client-side router, so moving between pages is a
 * full page load — indistinguishable from a refresh at the HTTP level. Both
 * would replay the Start screen, which gets tedious when bouncing between the
 * room and a subpage.
 *
 * So: sessionStorage remembers that Start was clicked, and the Navigation
 * Timing API tells a reload apart from a normal navigation. Navigating keeps
 * the room unlocked; refreshing deliberately brings the Start screen back.
 *
 * Both `index.astro` (which owns the overlay) and `Room.tsx` (which needs to
 * know whether to show its nav) ask this module, rather than each implementing
 * the rule.
 */

const SESSION_KEY = 'portfolio:started';

/**
 * Cached so repeat calls agree with each other within a page load. The reload
 * branch clears the flag, and without caching a later caller would read the
 * cleared flag and reach the same answer anyway — but caching makes that
 * convergence explicit instead of accidental, and independent of which caller
 * runs first.
 */
let cached: boolean | null = null;

/** True when the Start screen should be skipped for this page load. */
export function shouldSkipStartScreen(): boolean {
	if (typeof window === 'undefined') return false; // SSR: always render the gate
	if (cached !== null) return cached;

	const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

	if (entry?.type === 'reload') {
		// A refresh is an explicit request to start over.
		sessionStorage.removeItem(SESSION_KEY);
		cached = false;
	} else {
		cached = sessionStorage.getItem(SESSION_KEY) === '1';
	}

	return cached;
}

/** Called when Start is clicked, so the rest of the session skips the gate. */
export function markStarted(): void {
	if (typeof window === 'undefined') return;
	sessionStorage.setItem(SESSION_KEY, '1');
	cached = true;
}
