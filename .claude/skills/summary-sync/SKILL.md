---
name: summary-sync
description: Check that the final \begin{frame}{Summary} of each lecture still reflects what the lecture currently teaches — each \section{...} contributes at least one bullet, Summary doesn't reference removed topics, and total bullet count stays within 5–7 (fewer is better). Use after substantive edits (add/remove section, change a key formula, rework a derivation) per CLAUDE.md ("Cross-lecture coherence").
---

# summary-sync

Every lecture ends with `\begin{frame}{Summary}` — a one-slide takeaway for students. When the body changes substantively, the Summary should still match, AND it must stay short enough to actually fit on one slide. See [CLAUDE.md](../../../CLAUDE.md), section *Cross-lecture coherence: Summary and Recap frames*.

This is a lighter check than `recap-sync`: the Summary is not a verbatim mirror, it's a paraphrase. We verify topic coverage, bullet count, and that updates are holistic (not append-only).

## Inputs

- If the user passes a lecture number, check just that one.
- If no argument, infer from `git diff --name-only` — check Summary for any lecture whose body was modified.
- For freshly added lectures with no Summary yet, suggest one based on the section list (do NOT write it without confirmation).

## Procedure

### Step 1 — locate the Summary frame

Grep for `\begin{frame}{Summary}` in `LectureN.tex`. It's typically the last frame before `\end{document}`. Extract its body (between `\begin{frame}{Summary}` and `\end{frame}`).

If no Summary frame exists, flag it as a missing convention and stop.

### Step 2 — extract section list

```bash
grep -n '^\\section\{' lectures/lectureN/LectureN.tex
```

Capture title and line number for each `\section`.

### Step 3 — bullet count check

Count Summary bullets (`\item` entries inside the `itemize`).

- **5–7 bullets:** OK.
- **≤ 4 bullets:** flag as possibly under-covered, but a short Summary is acceptable if every section is represented.
- **≥ 8 bullets:** flag as **too long** — the Summary frame is meant to fit one slide and be absorbable in one read. Propose consolidation: identify two related bullets that can merge, or a secondary point that can be dropped.

Do **not** propose adding a bullet for an uncovered section without first checking whether an existing bullet can be rewritten to cover it. The default move when a lecture grows a new topic is to **revise**, not to **append**.

### Step 4 — coverage check

For each section title, scan the Summary bullets for a matching topic. Matching is *semantic*, not exact:

- "Probability Flow ODE" section → Summary should mention "probability flow ODE" or "PF-ODE" or the equivalent claim
- "Score-Based Generative Models Through SDEs" section → Summary should mention SDE-based score modeling, continuous-time score matching, or similar

Use judgment — Summary bullets are concise statements of takeaways, not section titles repeated. A single bullet may cover multiple sub-topics.

For each section, classify:

- **covered** — at least one Summary bullet plausibly addresses this section's content
- **uncovered** — no Summary bullet matches; suggests Summary was not updated after adding/expanding this section
- **possibly-stale** — a Summary bullet references a topic that has no matching `\section` (suggests the section was renamed or removed but Summary wasn't refreshed)

### Step 5 — report

Report the Summary frame location (clickable `path:line`) and bullet count (with a ⚠ if outside 5–7), then per-section coverage (covered / uncovered / possibly-stale, naming the matching bullets), and — if the count is too high or a section is uncovered — concrete consolidation suggestions (which bullets to merge or rewrite).

End with: "Want me to draft a revised Summary frame?" — wait for confirmation before editing.

## Important rules

- **Don't rewrite Summary unilaterally.** Coverage is a judgment call; the user is the best author of their own takeaways. Always propose, never silently edit.
- **Holistic revision, not append.** When a section is uncovered, the default response is to **rewrite an existing bullet** to cover it (or merge two adjacent ones to free a slot), not to add a new bullet. Adding bullets is how Summary frames creep past 7.
- **5–7 bullets, fewer is better.** Treat 8 as a hard signal to consolidate. A 4-section lecture can often be summarized in 5 bullets — one per section plus one synthesis bullet — without losing anything.
- **Minor edits don't require Summary updates** (CLAUDE.md §8). If `git diff` shows only whitespace or single-word fixes, say "no Summary update needed" and stop.
- **Style:** Summary bullets are full sentences, conceptual takeaways — not section titles. If you draft bullets, match the existing voice (look at neighboring lectures' Summary frames for tone).
- **Animations:** Summary frames typically don't use `\nextonslide` / `\eqpause` — they're static. Don't add animation machinery when proposing bullet edits.
