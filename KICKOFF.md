# Kickoff Guide — for the mentor

How to run the week. Read `SPEC.md` first, then this.

---

## The one thing to hold onto

The site is the vehicle, not the point. When you're deciding whether to intervene, ask: **does stepping in here cost more learning than it saves time?**

Config and pipeline problems teach almost nothing and burn hours — take those. Design decisions, decomposition, and debugging their own code teach a lot — leave those, even when it's slow and you could do it in ten minutes.

The failure mode to actively avoid is a beautiful site the intern didn't really build.

---

## Day by day

### Before Monday — 30 min, you

- Confirm they have a personal GitHub account and `gh` CLI installed and authed
- Confirm Claude Code is installed and working
- Send them `SPEC.md` and ask them to read it and come with questions

### Monday — Foundation & content triage

**You (morning, ~90 min):** Epic 1 in full — repo, Astro + Tailwind + MDX scaffold, GitHub Actions deploy, initial `CLAUDE.md`. **Do this with them watching.** Narrate the deploy pipeline as you wire it.

**Them (rest of day):**
- Epic 2 — board setup via `gh` from Claude Code
- Epic 3.1 — content audit
- Start writing case study #1

**Planning conversation (~20 min).** Not a ceremony, a conversation:
- What's the sprint goal, in one sentence?
- Which stories are you committing to?
- What are you deliberately *not* doing this week?

Write the answers down somewhere. Referring back to them Friday is most of the value.

> **Monday's real risk is content, not code.** If by end of day they have a live scaffold but nothing written, you're behind. Push content hard on Monday.

### Tuesday — Structure

Layout, nav, home page, content collection schemas. First real content lands in the repo.

Make sure they actually do the "break the schema on purpose" step in story 4.3. It's five minutes and it's the moment the guardrail concept clicks.

### Wednesday — Blog & projects

Blog index, post pages, projects index, case study pages. Blog post #1 drafted.

**Midweek check (~15 min):** Is the MVP still realistic? If not, cut something *now* — Wednesday cuts are planning, Friday cuts are failure. Cutting scope deliberately is one of the more valuable things they'll learn this week, so make the reasoning explicit rather than quietly dropping things.

### Thursday — React island

ADR, integration, build the feature, measure the bundle cost. Resume page and Now page fill in around it.

This is the day they're most likely to rabbit-hole. Watch the clock.

### Friday — Ship & reflect

**Morning:** cross-device check, README, fix what's broken, publish blog post #1.

**Afternoon:**
- Backlog grooming — everything unfinished becomes a prioritized issue
- Demo (~15 min)
- Retro (~30 min)

---

## Ceremonies, kept light

### Standup — 3 lines a day, async

```
Yesterday: shipped the blog index
Today: post detail pages + typography
Blocked: nothing (45 min into the MDX code highlighting thing)
```

Slack or a `docs/standup.md` in the repo. The habit is the point, not the artifact.

### Demo — 15 min, Friday

They drive, on the **live site**, not localhost. Localhost demos hide deploy problems and let people demo things that aren't really shipped.

Questions to ask:
- Show me how you'd add a blog post right now
- Why this stack, given the hosting constraint?
- What's the one thing you'd fix first with another day?

### Retro — 30 min, Friday

Four questions:

1. What went well?
2. What didn't?
3. Where did Claude Code help most? Where did it mislead you?
4. What would you do differently next sprint?

Answer them yourself too, out loud. Retros where only the junior person is vulnerable don't work.

---

## The escalation rule

**45 minutes stuck with no forward progress → they ask for help.**

Give them the number explicitly on Monday, and tell them asking at 45 minutes is *following the process*, not failing at it. Interns systematically wait too long because asking feels like admitting incompetence.

When they do escalate, resist fixing it. Try in this order:

1. "What have you tried?"
2. "What do you think is happening?"
3. "What would you check next?"
4. *Then* help — and if you have to take the keyboard, narrate what you're doing.

---

## Coaching prompts

Use these instead of answers. They shift the work back without leaving them stranded.

**On decomposition**
- "Can you finish that in one sitting? If not, it's still an epic."
- "How would you know that story is done? Say it as a checklist."
- "What has to be true before you can start this one?"

**On agent use**
- "Did you ask for a plan first, or did it just start writing?"
- "Explain that diff to me without looking at what it said."
- "It's been wrong twice on this — what's missing from its context?"
- "Is that in `CLAUDE.md`? If you're repeating yourself to it, it should be."

**On scope**
- "Is that MVP or is that nice-to-have?"
- "You've got four hours. What's the highest-value thing?"
- "What are you cutting to make room for that?"

**On quality**
- "Would you send this URL to a recruiter today?"
- "What happens on a phone?"

---

## Red flags

| Signal | What it means | What to do |
|---|---|---|
| No content written by Tuesday | Building is more comfortable than writing | Make them write for 2 hours before touching code |
| Merging diffs they can't explain | Accepting output blindly | Pick a random recent commit, ask them to walk you through it |
| Board untouched since Monday | Board is theater, not a tool | Do one grooming pass together, out loud |
| Same bug for 2+ hours, no ask | Escalation rule not internalized | Reset the norm, explicitly and without judgment |
| Rewriting working code to be "cleaner" | Avoiding harder unfinished work | Redirect to the board |
| Site looks great, they're vague on how | You helped too much | Back off; give them a whole story solo |

---

## Setting expectations Monday morning

Worth saying out loud, roughly:

> This week is about learning to direct an agent and break down work — the website is how we practice that. It won't be finished Friday and that's fine. What I want Friday is a live site you're not embarrassed by, real content on it, and a backlog that tells us what's next. If you're stuck for 45 minutes, ping me — that's the process working, not you failing at it. And keep the reflection log. It'll be the best material for your first blog post.

---

## After the sprint

The project only earns its keep if it stays alive. Two things:

1. **A recurring commitment** — one blog post a month, or one backlog item a week. Small and consistent beats a burst that dies in September.
2. **A next milestone** — the AWS migration (S3 + CloudFront + IaC) is the natural one. Directly relevant to Rearc work, a real architecture exercise, and it makes a genuinely good second blog post.

Worth a 30-minute check-in a month from now to see if it's still moving.
