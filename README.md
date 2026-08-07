# milan06.github.io

Personal portfolio and blog — an interactive pixel-art room that opens onto a
résumé, an About Me page, project case studies and a blog.

Live at **[milan06.github.io](https://milan06.github.io)**.

Built with [Astro](https://astro.build) (static output only), Tailwind CSS v4,
MDX for content, and a React island for the interactive home-page room.

## Local development

All commands run from the root of the project:

| Command | Action |
| :------ | :----- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |

Node **22.12.0 or newer** is required — Astro refuses to run on anything older,
and the deploy pipeline pins Node 22 to match.

> **Don't run `npm run build` while the dev server is live.** It rewrites the
> Vite cache underneath the running server and the page goes blank in the
> browser while still returning `200`. Recovery and the full explanation are in
> [`AGENTS.md`](AGENTS.md).

## Deploys

**Pushing to `main` deploys automatically.** Merge a pull request and the change
is live at [milan06.github.io](https://milan06.github.io) in well under a
minute — the first measured run took 33 seconds end to end.

GitHub Actions does the work: [`deploy.yml`](.github/workflows/deploy.yml)
builds the site and publishes it to GitHub Pages. A separate
[`build-check.yml`](.github/workflows/build-check.yml) builds every pull request
so a broken commit doesn't reach `main` in the first place.

For anything beyond that — watching a run, deploying without a code change,
rolling back, or working out why a deploy went red — see
**[`docs/deploying.md`](docs/deploying.md)**.

## Documentation

| Document | What it covers |
| :------- | :------------- |
| [`AGENTS.md`](AGENTS.md) | Stack, conventions, version gotchas, local-dev traps |
| [`docs/adding-a-page.md`](docs/adding-a-page.md) | Adding a new route, and the conventions it should follow |
| [`docs/deploying.md`](docs/deploying.md) | The deploy pipeline, and what to do when it fails |
| [`SPEC.md`](SPEC.md) | What this site is meant to be |
| [`BACKLOG.md`](BACKLOG.md) | Epics and stories |
