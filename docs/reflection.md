# Reflection Log

Two or three entries a day, a couple lines each. Format from SPEC.md section 6.

## Day 1

**Worked well:** Drove the whole board setup (`gh auth refresh`, project create,
labels, issues) from Claude Code without touching the browser except to approve
the OAuth device code. Verified the Astro/Tailwind/MDX scaffold by actually
building it and hitting the dev server, rather than trusting the CLI output —
caught nothing broken, but it would have caught it if something was.

**Went wrong:** A bulk issue-creation script (`gh issue create --body
"$(cat <<'EOF' ... EOF)"`) kept dying with `unexpected EOF while looking for
matching ''`. Burned real time on wrong guesses (em dash? section symbol?)
before isolating it to a genuine bash 3.2 bug (macOS's default bash, not
bash 5+): an apostrophe inside a `<<'EOF'` heredoc breaks when that heredoc is
nested inside a `$(...)` command substitution. It also silently reproduced
across two different scripts, since I used the same pattern both times before
learning the lesson.

**Would do differently:** Skip the `$(cat <<'EOF' ...)"` pattern in shell
scripts entirely on macOS. Write heredoc bodies straight to a temp file and
pass `--body-file` instead — sidesteps the bug rather than debugging around it.
Also worth catching earlier: BACKLOG.md's own bootstrap script uses this same
pattern, so it would have hit the identical bug.

**Also worth noting:** Caught that the repo name (`personal_portfolio`) didn't
match SPEC.md's locked decision (`<username>.github.io`) before scaffolding
around the wrong assumption — renamed it before wiring up the deploy config.
Also deliberately kept the repo private and held off pushing the deploy
workflow, pending a validation pass (issue #13) before going public — the
`gh api repos/.../pages` call actually confirmed this is a hard requirement,
not just a preference: GitHub Pages on the free plan won't enable on a
private repo at all.

---

## Decomposition practice — Epic 4.3, "Content collection schemas"

Per BACKLOG.md 2.3: pick the largest available story, ask Claude Code to
break it into subtasks, then critique the output.

**Why this story:** it's technically dense (Zod schemas, the Content Layer
API's `loader` requirement, the "break it on purpose" verification step) and
blocks two downstream stories (4.4 blog pages, 4.5 project pages), so getting
the decomposition right actually matters.

### Claude Code's first pass (uncritiqued)

1. Create `src/content.config.ts`
2. Import `defineCollection` and `z` from `astro/zod`, `glob` from `astro/loaders`
3. Define the `blog` collection schema — `title`, `date`, `description`, `tags`
4. Define the `projects` collection schema — same required fields
5. Add a `glob()` loader for each collection, pointed at `src/content/blog` and `src/content/projects`
6. Export both from a `collections` object
7. Add one valid test post to each collection, confirm `npm run build` succeeds
8. Add one deliberately malformed post (e.g. missing `title`), confirm the build fails
9. Remove the malformed test post, confirm the build passes again
10. Commit

### Your corrected version

*(pending — this is your critique to do, not mine)*

### What it missed

*(pending — one sentence, after you've critiqued the above)*

---

## Process gap — the room feature was built outside the issue/branch/PR flow

**Went wrong:** The entire interactive home-page room (hotspots, glow
overlays, background music, night mode, top nav) got built directly on
`main` with zero corresponding GitHub issues, no feature branch, no PR —
just direct edits, turn after turn. It wasn't caught until starting the
About Me feature and explicitly checking `git status`, at which point the
working tree had 7 modified files and 4 new untracked
directories/files sitting uncommitted, none of it ticketed anywhere on the
board.

**Why it happened:** each step felt small in the moment (one hotspot, one
glow asset, one nav tweak), so "this needs its own issue and branch" never
triggered — the discipline only makes sense at the scope of a feature, and
nothing forced a pause to notice the feature-sized pile accumulating.

**Would do differently:** treat "let's build X" as the trigger to check for
an issue *before* the first file edit, not after. Resolved for this backlog
by committing it retroactively straight to `main` in one labeled commit
(cheaper than fabricating a paper trail after the fact) and resuming
issue → branch → PR discipline strictly from the About Me feature onward.

---

## Day 2 — HTTP 200 is not "it works"

**Went wrong:** The site went blank white in the browser while every check I
was running said it was fine. Cause was the Vite dependency cache: running
`npm run build` against a live `astro dev` server rewrites
`node_modules/.vite` underneath it, so React resolved to
`react.production.js` while the dev JSX runtime was expected —
`_jsxDEV is not a function`, then `Cannot read properties of null (reading
'useState')`. Second time this bug has appeared; the first was after
`npx astro add react`.

**The real miss:** I was verifying with `curl -o /dev/null -w '%{http_code}'`
and treating `200` as proof. The server serves HTML perfectly well while
hydration dies in the browser, so the status code was green through a
completely blank page. I only noticed because it was pointed out to me.

**Also worth noting:** the same day, a screenshot convinced me the About Me
page overflowed horizontally on mobile. It didn't — macOS headless Chrome
clamps its window to a 485px minimum, so `--window-size=375` renders 485px of
page and crops it, which looks exactly like overflow. Measuring
`scrollWidth` from inside the page settled it in one shot
(`VW=485 scrollW=485, offenders: none`). Two grep attempts also wrongly
reported Tailwind classes as missing, because Tailwind escapes its selectors
(`.max-w-\[calc\(100vw-2rem\)\]`) and my regexes didn't account for it —
`grep -F` on a distinctive substring is the reliable check.

**Would do differently:** pick verification that can actually observe the
failure mode in question. A status code cannot see a blank render, a
screenshot cannot see an element's tag name, and a regex over escaped CSS
selectors is a coin flip. Render it, parse it, or measure from inside the
page — and when a tool reports something surprising, suspect the tool before
rewriting working code. Both of the "bugs" I started fixing today were
measurement artifacts.
