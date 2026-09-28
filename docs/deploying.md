# Deploying

How this site gets from a merge to production, and what to do when it doesn't.

> **Status (2026-08-07):** every section below describes verified behaviour, not
> intention. The pipeline went live on 2026-08-07 and the timings quoted were
> measured on real runs.

## The short version

Merge to `main`. That's it — the site is live about half a minute later.

```
merge to main → deploy.yml → withastro/action builds → actions/deploy-pages
              → https://milan06.github.io
```

Measured on the first real change (PR #57): **merge to live in 33 seconds** —
about 22s building, 9s deploying. The acceptance bar was ten minutes, so there
is a lot of headroom. If a deploy is taking minutes rather than seconds,
something is wrong.

## The two workflows

| File | Trigger | What it does |
|---|---|---|
| `.github/workflows/deploy.yml` | push to `main`, manual | Builds, publishes to GitHub Pages, then smoke-tests the live site |
| `.github/workflows/build-check.yml` | pull requests to `main` | Builds only. Never touches Pages |

They're deliberately separate. `deploy.yml` holds `pages: write` and
`id-token: write` and publishes to the `github-pages` environment, so it must
only ever run on `main`. The PR check needs none of that — it has
`contents: read` and nothing else, so a pull request cannot deploy.

**Both read the Node version from `.nvmrc`** (currently 22). See the gotcha below.

## Pages must be served from Actions, not a branch

Settings → Pages → Build and deployment → Source must be **GitHub Actions**.
Not "Deploy from a branch" — there is no `gh-pages` branch and nothing would
publish it.

Check it without leaving the terminal:

```bash
gh api repos/:owner/:repo/pages --jq '.build_type, .html_url, .https_enforced'
# workflow
# https://milan06.github.io/
# true
```

A `404` from that command means Pages is not enabled at all. It was enabled
with:

```bash
gh api -X POST repos/:owner/:repo/pages -f build_type=workflow
```

**Pages on the free plan requires a public repo.** This one was private until
2026-08-07, which is why nothing deployed before then, and why the `deploy` job
was skipped on every run for two days.

## The Node gotcha — read this before touching either workflow

`package.json` sets `engines.node` to `>=22.12.0`. **`withastro/action@v3`
defaults `node-version` to `"20"`.** Leave it unset and every build dies:

```
Node.js v20.20.2 is not supported by Astro!
Please upgrade Node.js to a supported version: ">=22.12.0"
```

This failed *every* push to `main` for two days before anyone noticed, because
the workflow had simply never run while the repo was private. The fix is
to set `node-version` explicitly.

The version lives in **`.nvmrc`**, and nowhere else. `build-check.yml` reads it
with `actions/setup-node`'s `node-version-file`. `withastro/action` has no such
input, so `deploy.yml` reads the file in a small step and passes the value to
`node-version`. To change Node, edit `.nvmrc` — both workflows follow, so a PR
can't pass on one version while the deploy runs another.

## Watching a deploy

```bash
gh run list --workflow=deploy.yml --limit 5   # recent runs
gh run view <run-id>                          # job-by-job breakdown
gh run view <run-id> --log-failed             # just the failing steps
gh run view <run-id> --job <job-id> --log     # full log for one job
```

To deploy without a code change — after enabling Pages, or to retry a flake:

```bash
gh workflow run deploy.yml --ref main
```

`--ref` also accepts a branch, which is how the Node fix was verified before it
was merged. The `build` job runs against that branch; the `deploy` job will
still publish to the live site, so **only dispatch a branch you would be happy
to ship**.

## Rolling back

There is no deploy history to roll back through — the site is whatever `main`
last built. So you roll back the commit, and the pipeline redeploys:

```bash
git revert <bad-commit>
git push origin main       # or via a PR, which is the normal flow
```

Half a minute later production matches the revert. If the site is actively
broken and you want it fixed now, reverting straight on `main` is legitimate;
the PR check exists to stop you needing to.

## When a deploy fails

Work out *which job* failed first — they fail for completely different reasons.

**`build` red.** The site didn't compile. Almost always a real error in the
code; `gh run view <id> --log-failed` will name the file. If it mentions Node
versions, see the gotcha above.

**`deploy` red, `build` green.** The artifact built but couldn't be published.

```
Error: Failed to create deployment (status: 404)
Ensure GitHub Pages has been enabled
```

That exact message means Pages is off, or the repo went private again. Check
`gh api repos/:owner/:repo/pages`.

**`The job was not acquired by Runner of type hosted`.** Not your code. This is
GitHub-side — runner availability or Actions minutes. It appeared once, on
2026-08-06, and did not recur. Re-run it; if it persists, check billing rather
than the workflow.

**`smoke-test` red, `deploy` green.** The site is live but something on it
is broken. The job crawls every page from `/` and requests each internal
link and asset, including the résumé PDF and the room's JS bundle. The log lists
each URL that didn't return 200, usually a file that was renamed or deleted
while something still points to it. Fix the link or restore the file, and
the next deploy will turn it green. Run the same check locally with
`node scripts/smoke-test.mjs` (live site) or pass a URL, for example
`http://localhost:4321`.

**Green run, but the page looks wrong.** The smoke test only proves every URL
responds with a `200`, not that the page rendered — see the Vite cache section in
`AGENTS.md`. Open it in a browser.

## Things that are easy to get wrong

- **`site` in `astro.config.mjs` must be lowercase** (`https://milan06.github.io`).
  GitHub serves a lowercase host, and `site` feeds canonical URLs, Open Graph
  tags and `sitemap.xml`.
- **Don't add a `base`.** User-site repos (`<username>.github.io`) are exempt,
  and setting it breaks every asset path.
- **`withastro/action` does not check out your repo.** The explicit
  `actions/checkout@v4` step in `deploy.yml` is load-bearing — deleting it as
  "redundant" breaks the build.
- **The action runs `npm install`, not `npm ci`.** `build-check.yml` uses
  `npm ci`, so the PR check is the stricter of the two about the lockfile.
