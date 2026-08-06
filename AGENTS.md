# CLAUDE.md — Milan06.github.io (Personal Portfolio & Blog)

Personal portfolio + blog, built with Astro, hosted on GitHub Pages under the
personal account. Full spec in `SPEC.md`, epics/stories in `BACKLOG.md`.

## Stack

- Astro, **static output only** — no server, no API routes, no SSR, no
  database. GitHub Pages serves static files only; anything dynamic runs at
  build time or in the browser.
- Tailwind CSS v4 via `@tailwindcss/vite` (installed with `npx astro add
  tailwind` — not the legacy `@astrojs/tailwind` integration).
- MDX for blog posts and project case studies.
- React island: the interactive home-page room (`Room.tsx` +
  `ProjectHotspot`/`LightSwitch`), hydrated via `client:load` — see Epic 5 in
  BACKLOG.md. ADR (story 5.1) still outstanding.
- Deploy: GitHub Actions (`withastro/action` + `actions/deploy-pages`) →
  GitHub Pages.

## Version gotchas — read before touching Astro config or content collections

Astro moved fast through 2025–26. Older tutorials and a lot of training data
describe the previous way of doing these things — getting them wrong costs an
hour of confusing errors.

- **Content config lives at `src/content.config.ts`**, at the `src/` root —
  *not* `src/content/config.ts`. That path was removed in Astro 6.
- **Every collection requires a `loader`**, e.g. `glob({ pattern:
  '**/*.{md,mdx}', base: './src/content/blog' })`. Bare content directories
  no longer auto-register.
- **Import Zod from `astro/zod`**, not from `astro:content`.
- **Tailwind** was installed via `npx astro add tailwind`, which wires up the
  `@tailwindcss/vite` plugin and `src/styles/global.css` (`@import
  "tailwindcss"`). That stylesheet is imported once, in `src/layouts/Layout.astro`.
- **`site` is set** in `astro.config.mjs` to `https://Milan06.github.io`.
  `base` is *not* needed — user-site repos (`<username>.github.io`) are
  exempt.

## Directory conventions

```
src/
├── content.config.ts       # Zod schemas + glob() loaders — not yet created, see Epic 4.3
├── content/
│   ├── blog/                # .md / .mdx posts
│   └── projects/            # .md case studies
├── styles/global.css        # @import "tailwindcss"
├── components/
│   ├── *.astro               # static, zero JS
│   └── *.tsx                  # React islands, hydrated on demand via client:*
├── layouts/
│   └── Layout.astro          # base layout — every page should use this
├── lib/                      # shared non-component values (e.g. nav.ts style
│                             # constants shared by the React + static navs)
└── pages/
public/                      # resume PDF, images, favicon
```

Adding a new page? See `docs/adding-a-page.md` first — covers the
file-based routing pattern, which pages get the start-gate/music and which
don't, the hotspot modal-vs-link convention, and the shared nav styling
approach.

## Content model

- Two content collections planned: `blog` and `projects`.
- Required frontmatter fields: `title`, `date`, `description`, `tags`.
- A deliberately malformed frontmatter file should **fail the build**, not
  ship silently — that guardrail is the point of Epic 4.3, don't work around it.

## Styling rules

- Tailwind utility classes only. No per-component CSS files unless there's a
  specific reason to break from that.
- `global.css` is imported once, in the base layout — don't re-import it
  per-page.

## Don't touch / ask first

- `astro.config.mjs`'s `site` value and the absence of `base` — deliberate,
  see version gotchas above.
- No server-rendering, API routes, or database — this is a static site.
- **Repo is currently private and the deploy workflow is not yet live.**
  Pushing to `main` is fine as of 2026-08-05 (explicit go-ahead given, and
  `origin/main` has been caught up). Still don't flip the repo to public
  without an explicit go-ahead — see issue #13 (pre-publish validation
  pass) on the board first.

## Working agreement

- Plan before coding on anything non-trivial; read the diff before accepting it.
- One issue → one branch → one PR.
- Keep `docs/reflection.md` updated (Epic 2.4) — a few short entries a day.
- **This file is living documentation.** Update it as conventions emerge
  during the week — if you're repeating the same context to the agent twice,
  it belongs here.

## Local dev

- `npm run dev` — dev server at `localhost:4321`
- `npm run build` — static build to `./dist/`
- `npm run preview` — preview the production build locally
- To run the dev server in the background: `astro dev --background`, managed
  with `astro dev stop` / `astro dev status` / `astro dev logs`

### Blank white page? It's the Vite cache, not your code

**Don't run `npm run build`, `astro check`, or `npx astro add ...` while the
dev server is live.** They rewrite `node_modules/.vite` underneath the running
server, so React ends up resolving to `react.production.js` while the dev JSX
runtime is expected. The page goes blank and the logs show:

```
TypeError: _jsxDEV is not a function
TypeError: Cannot read properties of null (reading 'useState')
```

Nothing is wrong with the component the stack trace points at. Recovery is
always the same three steps:

```bash
astro dev stop
rm -rf node_modules/.vite .astro
astro dev --background
```

**A 200 response does not mean the page renders.** The server keeps serving
HTML fine while hydration dies in the browser, so `curl -w '%{http_code}'`
reports success on a blank page. Verify by loading it in a browser, or by
checking `astro dev logs` for hydration errors. This gotcha has cost time
twice — once after adding the React integration, once after running builds
against a live server.

## Reference docs

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components (React, etc.)](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling / Tailwind](https://docs.astro.build/en/guides/styling/)
