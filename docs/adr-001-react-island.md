# ADR 001: The home-page room is the React island, hydrated with `client:load`

**Status:** Accepted. Written up 2026-09-29; the room shipped 2026-08-05.

## Context

The spec calls for one React island. It has to be a feature that *genuinely
needs client-side state*. The rest of the site is static Astro with no JS.

## Options considered

- **Search and tag filter.** There are no posts yet (#64), and a few posts
  only need tag pages built at build time. Revisit once there's more content.
- **Project explorer.** With two or three projects, static cards are enough.
- **Scroll-spy table of contents.** One `IntersectionObserver` in a plain
  `<script>` covers it, so React would teach the wrong lesson.
- **Contact form.** There's no backend, and HTML attributes handle validation.
  A `mailto:` link is enough.
- **The interactive room.** Chosen.

## Decision

The room (`Room.tsx`, `ProjectHotspot`, `LightSwitch`, `Character`) has real
shared state. Hovering a nav item glows the matching object, the start gate
reveals the nav, modals open, and the light switch toggles night mode. Since
#101, a character driven by the keyboard moves every frame, and its position
decides which object glows. A plain `<script>` could manage hover and modals,
but not one state kept in sync across the nav, six objects and a game loop.

**Hydrated with `client:load`:**

- **Not `client:idle`:** the room is the whole page and the first thing anyone
  touches. Until it hydrates, its modals, the light switch and the keyboard
  don't respond.
- **Not `client:visible`:** the room fills the viewport on load, so this would
  fire immediately anyway.
- **Not `client:only`:** it skips server rendering, so the room image, its alt
  text and the hotspot links would be missing from the HTML, and the page
  would be blank until the JS runs. With server rendering, the links work
  before hydration.

## Consequences

The home page ships about 64 KB of gzipped JS: about 60 KB of React runtime
and 4 KB for the room. `/about-me` and `/blog` ship none (details in #70).
Preact with `compat` would reduce this without changing the components. We
didn't use it because the spec names React.
