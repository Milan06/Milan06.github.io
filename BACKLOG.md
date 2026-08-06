# Backlog — Portfolio & Blog

Six epics. Stories are written at a "one sitting" size. **Subtask decomposition is deliberately left undone** — that's the intern's exercise, done with Claude Code at the start of each story.

**Ownership:** `[M]` mentor, `[I]` intern.
**Priority:** `P0` sprint-critical · `P1` sprint if time · `P2` post-sprint.

---

## EPIC 1 — Foundation & Deploy `[M]`

Mentor-owned so day 1 isn't lost to config. Intern should **watch this happen** and be able to describe it afterward — it's a free lesson in CI/CD.

### 1.1 Create the repo `P0` `[M]`
Create `<username>.github.io` on the intern's **personal** account, public, with a README and Node `.gitignore`.
**AC:** repo exists on the personal account, intern has admin, cloned locally.

### 1.2 Scaffold Astro + Tailwind + MDX `P0` `[M]`
Use `npx astro add tailwind` and `npx astro add mdx` — *not* the legacy `@astrojs/tailwind` integration.
**AC:** `npm run dev` serves a page locally; `src/styles/global.css` with `@import "tailwindcss"` is imported in the base layout and classes apply; an `.mdx` file renders; `astro.config.mjs` sets `site: 'https://<username>.github.io'` (no `base` — user sites are exempt); lockfile committed.

### 1.3 Wire up GitHub Actions deploy `P0` `[M]`
Use the official `withastro/action` paired with `actions/deploy-pages`.
**AC:** Pages source set to "GitHub Actions"; push to `main` triggers a build; site is live at `https://<username>.github.io`; a trivial edit reaches production in under 10 minutes.

### 1.4 Write the initial `CLAUDE.md` `P0` `[M]` → `[I]` maintains
Stack, directory conventions, styling rules, content model, "don't touch" list. **Must include the version gotchas from `SPEC.md` §3** — content config path, `loader` requirement, `astro/zod` import, Tailwind install method — otherwise the agent will reach for stale patterns from older tutorials.
**AC:** file committed at repo root; version gotchas section present; intern has read it and understands each section; intern updates it as conventions emerge during the week.

---

## EPIC 2 — Board & Working Setup `[I]`

**This is a core learning epic, not overhead.** The goal is fluency driving a board through an agent.

### 2.1 Set up GitHub Projects via `gh` CLI `P0` `[I]`
Create the project board and connect it to the repo — **from Claude Code, using `gh`**, not the web UI.
**AC:** board exists with `Todo / In Progress / Done`; intern can create and move an issue by asking Claude Code, without touching the browser.

### 2.2 Load this backlog onto the board `P0` `[I]`
Have Claude Code read `BACKLOG.md` and create issues from it.
**AC:** every P0 story is an issue with labels and acceptance criteria in the body; all added to the board.
**Learning note:** it will get some of these wrong. Finding and fixing those is the exercise.

### 2.3 Practice decomposition on one epic `P0` `[I]`
Pick the largest story you have. Ask Claude Code to break it into subtasks. Then **critique the output**: what's missing, what's too big, what's in the wrong order?
**AC:** a written before/after in `docs/reflection.md` showing the agent's first pass and your corrected version, with one sentence on what it missed.

### 2.4 Start the reflection log `P0` `[I]`
**AC:** `docs/reflection.md` exists with a day-1 entry.

---

## EPIC 3 — Content `[I]`

**Highest risk of the week.** Start Monday, not Wednesday. Empty pages ship as nothing.

### 3.1 Content audit `P0` `[I]`
Fill in the audit table in `SPEC.md` §5. Be honest about what doesn't exist yet.
**AC:** table complete; every gap has a named task on the board.

### 3.2 Write case study #1 `P0` `[I]`
Follow the six-part format in `SPEC.md` §5. Coursework and hackathon projects count.
**AC:** 300+ words of real content; the "what I'd do differently" section is filled in and not hand-wavy; links to repo or demo.

### 3.3 Write blog post #1 `P0` `[I]`
Recommended: building this site with an AI agent. Mine `docs/reflection.md` for material.
**AC:** 500+ words, published, publicly readable, includes at least one specific concrete thing that went wrong.

### 3.4 Bio, headshot, resume PDF `P0` `[I]`
**AC:** bio paragraph written; photo cropped and web-optimized; current resume exported to PDF and placed in `public/`.

### 3.5 Seed the Now page `P1` `[I]`
**AC:** one entry describing what they're currently learning and working on.

### 3.6 Case studies #2 and #3 `P1` `[I]`

---

## EPIC 4 — Site Build `[I]`

### 4.1 Base layout, nav, footer `P0` `[I]`
**AC:** shared layout component; nav links to every section; works at 375px and 1440px; consistent across all pages.

### 4.2 Home page `P0` `[I]`
**AC:** name, one-line positioning, short bio, links to projects / blog / resume / GitHub / LinkedIn; renders on the live site.

### 4.3 Content collection schemas `P0` `[I]`
Define Zod schemas for `blog` and `projects` in `src/content.config.ts` (root of `src/`, **not** `src/content/config.ts`). Each collection needs a `loader` — use `glob()`. Import Zod from `astro/zod`.
**AC:** required fields enforced (`title`, `date`, `description`, `tags`); a deliberately malformed frontmatter file **stops the build** — verify this by trying it, then fix it.
**Learning note:** breaking it on purpose is the point. That failing build is the guardrail you're installing for future-you.

### 4.4 Blog index + post pages `P0` `[I]`
**AC:** index lists posts newest-first with title, date, description; each post has its own URL; markdown renders with readable typography; code blocks are highlighted.

### 4.5 Projects index + case study pages `P0` `[I]`
**AC:** grid or list of projects; each links to a full case study page; tech tags visible.

### 4.6 Resume page `P0` `[I]` — **DROPPED 2026-08-06**
**AC:** resume rendered as a readable web page; prominent PDF download link.

**Why dropped:** the Résumé nav item and the papers hotspot link straight to
`public/milan-patel-resume.pdf`, opening in a new tab (see issue #43). No HTML
résumé page. Tradeoff accepted knowingly: a PDF is weaker than a web page for
SEO, on phones, and for screen readers unless it was exported with tags. Revisit
if the résumé needs to be indexable or readable on mobile.

### 4.7 About page `P1` `[I]`
### 4.8 Now page `P1` `[I]`
### 4.9 404 page `P1` `[I]`

---

## EPIC 5 — React Island `[I]`

**Point of the epic:** understand what it costs to add React to Astro, and be able to argue when it's worth it.

### 5.1 Choose the feature and justify it `P0` `[I]` ← *deferred decision, decide here*
Evaluate candidates against one bar: **does this genuinely require client-side state?** Candidates — search + tag filter over posts/projects, interactive project explorer, scroll-spy TOC, validated contact form.
**AC:** a short ADR in `docs/adr-001-react-island.md` — options considered, choice, why, what was rejected and why. Half a page maximum.

### 5.2 Add the React integration `P0` `[I]`
**AC:** `@astrojs/react` installed and configured; a trivial `.tsx` component renders inside an `.astro` page.

### 5.3 Build the island `P0` `[I]`
**AC:** feature works in production; uses an appropriate `client:*` directive; **you can explain why you chose that directive over the others**.

### 5.4 Measure the cost `P1` `[I]`
Compare the JS bundle before and after.
**AC:** numbers written down in the reflection log with one sentence on whether the feature was worth its weight.
**Learning note:** this is the whole lesson of islands architecture, made concrete.

---

## EPIC 6 — Ship & Hand Off `[I]`

### 6.1 Cross-device check `P0` `[I]`
**AC:** verified on a real phone and desktop; no horizontal scroll; nav usable on mobile; no broken images or dead links.

### 6.2 Write the README `P0` `[I]`
**AC:** covers local dev setup, how to add a blog post (step by step), how to add a project, how deploys work, project structure. Bar: **could you follow this in three months having forgotten everything?**

### 6.3 Groom the post-sprint backlog `P0` `[I]`
**AC:** every unfinished item is an open, prioritized issue; the post-internship items from `SPEC.md` §4 are on the board; anything abandoned is closed with a reason.

### 6.4 Demo + retro `P0` `[I]`
**AC:** live walkthrough given; retro written covering what went well, what didn't, what changes next time, and what Claude Code did well vs. badly.

### 6.5 SEO basics `P1` `[I]`
**AC:** per-page meta descriptions, Open Graph tags, `sitemap.xml`, `robots.txt`.

### 6.6 Lighthouse pass `P1` `[I]`
**AC:** run it, record the scores, fix anything under 90, note what you couldn't fix and why.

---

# Board bootstrap — `gh` CLI

Run from the repo root. Have the intern run these **through Claude Code** so they see the agent driving real project state.

### Auth (project scopes are not granted by default)

```bash
gh auth status
gh auth refresh -s project,read:project,repo
```

### Create the board

```bash
GH_USER=$(gh api user --jq .login)

gh project create --owner "$GH_USER" --title "Portfolio Site"
gh project list --owner "$GH_USER"      # note the project number

# link the board to the repo
gh project link <PROJECT_NUMBER> --owner "$GH_USER" \
  --repo "$GH_USER/$GH_USER.github.io"
```

### Labels

```bash
gh label create "epic:foundation" --color 0E8A16
gh label create "epic:board"      --color 1D76DB
gh label create "epic:content"    --color 5319E7
gh label create "epic:site"       --color B60205
gh label create "epic:react"      --color FBCA04
gh label create "epic:ship"       --color 006B75

gh label create "P0" --color D93F0B --description "Sprint critical"
gh label create "P1" --color FBCA04 --description "Sprint if time"
gh label create "P2" --color C2E0C6 --description "Post-sprint"

gh label create "owner:mentor" --color 000000
gh label create "owner:intern" --color FFFFFF
```

### Create an issue and add it to the board

```bash
gh issue create \
  --title "Define content collection schemas" \
  --label "epic:site,P0,owner:intern" \
  --body "$(cat <<'EOF'
## Acceptance criteria
- [ ] Zod schemas defined for `blog` and `projects`
- [ ] Required fields enforced: title, date, description, tags
- [ ] A deliberately malformed frontmatter file fails the build (verify, then fix)

## Notes
Breaking it on purpose is the point — that failing build is the guardrail for future-you.
EOF
)"

gh project item-add <PROJECT_NUMBER> --owner "$GH_USER" \
  --url https://github.com/$GH_USER/$GH_USER.github.io/issues/<N>
```

### Useful during the sprint

```bash
gh issue list --label P0 --state open           # what's left
gh issue develop <N> --checkout                 # branch from an issue
gh pr create --fill                             # PR from current branch
gh issue close <N> --comment "Shipped and verified live"
gh project item-list <PROJECT_NUMBER> --owner "$GH_USER"
```

### Prompt to hand Claude Code for bulk creation

> Read `BACKLOG.md`. For every story marked P0, create a GitHub issue using `gh issue create` with the right epic, priority, and owner labels, and the acceptance criteria as a task list in the body. Then add each issue to project number `<N>`. Show me the commands before you run them.

Then **check its work.** It will miss things. Finding what it missed is the exercise.
