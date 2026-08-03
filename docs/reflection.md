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
