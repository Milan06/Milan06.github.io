# Adding a new page

Established while building `/about-me`, the first real subpage on the site
(the site's home page had been the only route — everything else lived behind
modals in the room). This is the pattern to repeat for the next one (e.g. the
blog).

> **Status (2026-08-05):** sections 1, 2 and 4 describe how the code works
> today. Section 3 (the hotspot `href` fork) is the agreed target
> convention, landing with issue #20 — if that issue is still open, expect
> to build it as you go rather than find it already there.

## 1. Routing is just a file

Astro is file-based routing — there's no router to configure. A new page is a
new file:

```
src/pages/<route-name>.astro   →   https://milan06.github.io/<route-name>/
```

Wrap it in the shared layout, same as every other page:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="...">
  ...
</Layout>
```

## 2. The start-gate overlay and background music are home-page-only

`index.astro` owns the "Start" overlay and the `<audio>` + mute-toggle button.
Neither belongs on any other page:

- The start-gate is an "entering the game room" ritual specific to the home
  page. A page like `/about-me` needs to be readable the instant someone
  lands on it (e.g. a direct link on a resume), with no overlay to click
  through first.
- The music is part of that same game framing and shouldn't follow visitors
  onto pages meant to read as more professional.

Don't add either to the shared `Layout.astro` — they live in `index.astro`
only.

## 3. Room hotspots: modal vs. real page (the `href` fork)

Every object in the room (`ProjectHotspot`) either opens an in-room modal
with placeholder/teaser content, or — once it has a real page — links
straight to it:

- No `href` prop → clicking opens the modal (current behavior for CashOut
  Poker, Resume, Blog Post).
- `href` prop set → clicking navigates to that URL instead; the modal is
  skipped entirely. Hover/glow behavior is identical either way.

When a hotspot graduates from placeholder to a real page, the change is one
line: add `href: '/whatever'` to its config in `index.astro`. No other
plumbing changes. This is how "About Me" became the first hotspot to link to
a real page instead of opening a modal.

## 4. Nav pill: shared styling, two implementations

The pill nav at the top looks identical everywhere, but it's implemented
twice on purpose:

- **Home page** (`Room.tsx`): a React component, because hovering a nav item
  has to glow the matching object in the room — it's wired into `Room.tsx`'s
  shared hover state.
- **Every other page**: `NavPill.astro` — a plain static component (no JS, no
  hover-sync — there's no room to glow). Plain `<a>` links, CSS-only hover
  colour change. Takes `items` (`{ label, href }[]`) and an optional
  `currentPath` (pass `Astro.url.pathname`) which marks the matching item
  with `aria-current="page"` and the highlight colour.

Both pull their Tailwind classes from `src/lib/nav.ts` so the two
implementations can't silently drift apart in appearance. If you're changing
how the nav looks, update those constants, not each component separately.

Keep the values in `nav.ts` as plain string literals — Tailwind scans source
files for class names, so classes assembled dynamically at runtime would
never be generated.

"Home" is always present as a pill item, on every page, styled the same as
the rest — it's not a special case.

## 5. Checklist for the next page

- [ ] `src/pages/<name>.astro`, wrapped in `Layout`
- [ ] No start-gate, no music (unless you have a specific reason to repeat
      the home page's game framing)
- [ ] Uses the shared static nav component, not a copy-pasted one
- [ ] If this page replaces a hotspot's modal, add `href` to that hotspot's
      config and nothing else
- [ ] Once content collections exist (`src/content.config.ts`, see
      `CLAUDE.md`), pages like the blog index should read from the
      collection rather than hardcoding content
