# Personal Portfolio & Blog — Project Spec

**Owner:** Intern (Rearc)
**Mentor:** Mark DeGroat
**Sprint:** 1 week (Mon–Fri)
**Status:** Ready for sprint planning

---

## 1. Why this project exists

The website is the vehicle. It is not the point.

The point is four things, in priority order:

1. **Claude Code fluency.** Learn to direct an agent on a real project — how to give it context, when to plan before coding, how to review what it produces, and where it misleads you.
2. **Task decomposition.** Take a vague goal ("build me a portfolio") and break it into epics, then stories, then subtasks that are small enough to actually finish. Practice doing this *with* an agent, not alone.
3. **Agile exposure.** Light familiarity with sprint goals, boards, standups, demos, and retros. Enough to not be lost on a client engagement.
4. **A living artifact.** Something owned personally, hosted personally, that keeps growing after the internship ends and is genuinely useful when job hunting.

**Explicit non-goal:** a "finished" website by Friday. The site will be incomplete and that is correct. A groomed backlog of what comes next is a feature of this project, not a failure of it.

---

## 2. Locked decisions

These were settled before the sprint. Do not relitigate mid-week — if one turns out wrong, note it in the retro.

| Decision | Choice | Why |
|---|---|---|
| **Hosting** | GitHub Pages, **personal GitHub account** | Free, permanent, zero Rearc entanglement. Carries with them forever. |
| **Repo** | `<username>.github.io` (user site) | Serves at the domain root, so no `base` path config to fight. One repo, one site. |
| **Framework** | Astro | Static-first, zero JS by default, typed content collections for the blog, first-party GitHub Pages Action. |
| **Styling** | Tailwind CSS | Polish-per-hour matters in a one-week box. |
| **Content format** | Markdown / MDX in the repo | Publishing = `git push`. No CMS, no extra infra, and it forces the git workflow. |
| **Interactivity** | At least one **React island** | Deliberate: learn what it takes to embed React in Astro and why you would or wouldn't. |
| **Board** | GitHub Projects, driven via **`gh` CLI** | The GitHub MCP connector is currently broken; `gh` is proven and works from Claude Code. |
| **Domain** | `<username>.github.io` for now | Custom domain is a backlog item, not sprint scope. |
| **CI/CD** | GitHub Actions → GitHub Pages | Push to `main` deploys. Set up by mentor on day 1. |

### Open decision (deferred by design)

- **What the React island actually does.** A dedicated story covers choosing this. The constraint: it must be a feature that *genuinely needs client-side state*, or it teaches the wrong lesson. Candidates to evaluate — search/tag filter over posts and projects, an interactive project explorer, a scroll-spy table of contents, or a validated contact form. Decide it with reasoning, write the reasoning down.

---

## 3. Architecture

```
<username>.github.io/
├── .github/workflows/deploy.yml    # withastro/action → GitHub Pages
├── src/
│   ├── content.config.ts           # Zod schemas + glob() loaders — the guardrail
│   ├── content/
│   │   ├── blog/                   # .md / .mdx posts
│   │   └── projects/               # .md case studies
│   ├── styles/global.css           # @import "tailwindcss"
│   ├── components/
│   │   ├── *.astro                 # static, zero JS
│   │   └── *.tsx                   # React islands, hydrated on demand
│   ├── layouts/
│   └── pages/
│       ├── index.astro             # home
│       ├── about.astro
│       ├── resume.astro
│       ├── now.astro               # learning log
│       ├── projects/
│       └── blog/
├── public/                         # resume PDF, images, favicon
├── astro.config.mjs
└── CLAUDE.md                       # project context for the agent
```

**Key constraint to internalize:** GitHub Pages serves static files only. No server, no API routes, no SSR, no database. Anything dynamic either runs at build time or in the browser. This is a real architectural constraint and working within it is part of the learning.

**Content collections.** Frontmatter is validated by a Zod schema at build time. If a post is missing a `title` or has a malformed date, the build stops instead of shipping something broken. This matters because the intern will be adding posts unsupervised for the next year.

### Version gotchas — read before scaffolding

Astro moved fast through 2025–26. Several widely-circulated tutorials (and a lot of model training data) describe the *old* way. Getting these wrong costs an hour of confusing errors:

- **Content config lives at `src/content.config.ts`**, at the `src/` root — *not* `src/content/config.ts`. That path was removed in Astro 6.
- **Every collection requires a `loader`** under the Content Layer API, e.g. `glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' })`. Bare content directories no longer auto-register.
- **Import Zod from `astro/zod`**, not from `astro:content`.
- **Tailwind:** use `npx astro add tailwind`, which wires up the `@tailwindcss/vite` plugin and a `src/styles/global.css` containing `@import "tailwindcss"` — which you must then import in your base layout. The older `@astrojs/tailwind` integration is legacy and Tailwind 3 only.
- **`site` must be set** in `astro.config.mjs` to `https://<username>.github.io`. `base` is *not* needed — user-site repos are explicitly exempt.

Put all of this in `CLAUDE.md` on day 1 so the agent doesn't reach for the stale patterns.

---

## 4. Scope

### MVP — must be true by Friday

- [ ] Site is **live and public** at `https://<username>.github.io`
- [ ] Push to `main` triggers an automatic deploy
- [ ] **Home page** — who they are, what they're into, links out
- [ ] **Projects section** — at least **one real case study** with actual substance (problem → approach → outcome), not lorem ipsum
- [ ] **Blog** — index page plus at least **one real published post**
- [ ] **Resume page** with a downloadable PDF
- [ ] **Now page** — current learning log, seeded with at least one entry
- [ ] **One React island** shipped and working
- [ ] **README** that explains how to add the next post, in enough detail that they could follow it in three months having forgotten everything
- [ ] Site is responsive and doesn't look broken on a phone
- [ ] Board reflects reality — what shipped is closed, what didn't is still open and prioritized

### Stretch — pull only if MVP is done

- Second and third case studies
- SEO basics: meta tags, Open Graph images, `sitemap.xml`, `robots.txt`
- Dark mode
- RSS feed for the blog
- Lighthouse pass and fix whatever it flags
- Basic analytics

### Post-internship backlog — write it down, don't build it

- Custom domain (`firstlast.dev`) with DNS + cert setup
- Migrate hosting to AWS S3 + CloudFront with IaC — directly relevant to Rearc consulting work
- Headless CMS to replace file-based posts
- Comments (Giscus)
- Newsletter signup
- Post view counts

---

## 5. Content requirements

**Content drought is the most likely cause of failure this week.** Building the site is the easy half.

Before writing any code, do a **content audit** (this is the first task on the board):

| Asset | Have it? | Gap | Owner |
|---|---|---|---|
| Resume (current) | Yes | Export to PDF, place in `public/` | Intern |
| Project 1 writeup | Raw material only | Write the case study (issue #15) | Intern |
| Project 2 writeup | Raw material only | Write the case study (issue #18, stretch/P1) | Intern |
| Blog post 1 draft | No | Choose topic, draft it (issue #16) | Intern |
| Headshot / photo | Yes | Crop + web-optimize (issue #17) | Intern |
| Bio paragraph | Yes | Adapt for site tone/length (issue #17) | Intern |

**Case study format** — use this for every project:

1. **What it was** — one sentence.
2. **The problem** — what was actually hard about it.
3. **What I built** — approach and key decisions.
4. **Tech used** — and *why*, not just a logo wall.
5. **What I'd do differently** — this is the section hiring managers actually read.
6. **Links** — repo, live demo, screenshots.

**First blog post suggestion:** write about building this site. It's the highest-signal post available — it's fresh, it demonstrates the exact skills being learned, and the material is free because they're living it. Working title: *"What I learned building my portfolio with an AI agent."*

**Coursework counts.** Class projects, hackathons, and half-finished side projects are all legitimate case studies if the writeup is honest about scope. "I built this in 36 hours at a hackathon and here's what broke" is a better story than a vague description of a polished-sounding project.

---

## 6. Working agreement — how to use Claude Code

Guidelines, not rules. Nobody is grading compliance. But the reflection log **is** expected, because that's where the learning gets consolidated.

### Practices

- **Write a `CLAUDE.md` early.** Stack, conventions, file layout, what not to touch. This is the single highest-leverage thing you can do — everything downstream gets better.
- **Plan before code on anything non-trivial.** Ask for an approach first, read it, push back, *then* build. Agents are excellent at executing a plan and mediocre at choosing one.
- **One issue → one branch → one PR.** Keeps changes reviewable and gives clean rollback when something goes sideways.
- **Read every diff.** The bar: could you explain this change to someone else without the agent in the room? If not, you don't own it yet — ask for an explanation before merging.
- **Use it for decomposition, not just code.** "Break this epic into stories with acceptance criteria" is one of the best uses of the tool and the one people most often skip.
- **When it goes in circles, stop and reset.** Two failed attempts at the same thing means the context is wrong, not that the third try will work. Start fresh with a better problem statement.

### Reflection log

Keep `docs/reflection.md` in the repo. Two or three entries a day, one or two lines each. Format:

```markdown
## Tue

**Worked well:** Asked for a plan before the blog layout. Caught that it wanted
to hand-roll date formatting when Astro already had it.

**Went wrong:** Accepted a Tailwind config change without reading it. Broke the
build. Took 20 min to find because I didn't know what had changed.

**Would do differently:** Read config diffs even when they look boring.
```

This feeds Friday's retro and is genuinely good raw material for the first blog post.

---

## 7. Ownership split

| Area | Owner |
|---|---|
| Repo creation, GitHub Actions, first successful deploy | **Mentor** — day 1, so the intern doesn't lose a day to config |
| Everything else: content, pages, components, styling, board | **Intern** |
| Unblocking | **Mentor**, on the timebox rule below |
| Design taste calls | Mentor advises, intern decides |

**Escalation rule.** If stuck for **45 minutes** with no forward progress: post the blocker in the standup log and ping the mentor. Not sooner — the struggle is where the learning happens. Not later — grinding past an hour on a config problem produces frustration, not skill.

---

## 8. Definition of done

**For a story:** acceptance criteria met, merged to `main`, deployed and verified on the live site, issue closed.

**For the sprint:** the MVP checklist above, plus a groomed backlog and a written retro.

---

## 9. Success looks like

Friday afternoon, the intern can:

- Send someone a public URL they're not embarrassed by
- Explain why Astro over Next.js for this constraint, in their own words
- Add a blog post from scratch without help
- Point at the board and explain what shipped, what didn't, and why they cut it
- Name one thing Claude Code did well and one thing it got wrong
