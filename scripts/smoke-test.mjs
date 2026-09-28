// Post-deploy smoke test: crawl the live site from `/` and fail if any
// page, or any internal link or asset a page references, doesn't return 200.
//
// A 200 on the home page alone proves little (see CLAUDE.md) — this catches
// the quieter breakage, like a renamed file leaving a dead link behind.
//
// Usage: node scripts/smoke-test.mjs [base-url]   (defaults to the live site)

const base = new URL(process.argv[2] ?? 'https://milan06.github.io');

// Pages can take a little while to serve a fresh deploy, so a failing URL
// is retried a few times before it counts.
const ATTEMPTS = 4;
const RETRY_DELAY_MS = 5000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url) {
	let res;
	for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
		res = await fetch(url, { redirect: 'follow' });
		if (res.ok) return res;
		if (attempt < ATTEMPTS) await sleep(RETRY_DELAY_MS);
	}
	return res;
}

// Every href/src on the page that points back at this site, minus fragments.
// component-url and renderer-url are how an <astro-island> loads its JS, so
// they cover the React room bundle too.
function internalLinks(html, pageUrl) {
	const links = new Set();
	for (const [, raw] of html.matchAll(/\b(?:href|src|component-url|renderer-url)="([^"]+)"/g)) {
		if (/^(mailto:|tel:|javascript:|data:|#)/.test(raw)) continue;
		const url = new URL(raw, pageUrl);
		if (url.origin !== base.origin) continue;
		url.hash = '';
		links.add(url.href);
	}
	return links;
}

const queue = [new URL('/', base).href];
const seen = new Set(queue);
const failures = [];

while (queue.length > 0) {
	const url = queue.shift();
	const res = await fetchWithRetry(url);
	const path = new URL(url).pathname;

	if (!res.ok) {
		failures.push(`${res.status} ${path}`);
		console.log(`✗ ${res.status} ${path}`);
		continue;
	}
	console.log(`✓ ${res.status} ${path}`);

	// Only HTML pages are crawled further; assets just need to resolve.
	if (!res.headers.get('content-type')?.includes('text/html')) continue;
	for (const link of internalLinks(await res.text(), url)) {
		if (!seen.has(link)) {
			seen.add(link);
			queue.push(link);
		}
	}
}

console.log(`\nChecked ${seen.size} URLs on ${base.origin}.`);
if (failures.length > 0) {
	console.error(`${failures.length} failed:\n  ${failures.join('\n  ')}`);
	process.exit(1);
}
