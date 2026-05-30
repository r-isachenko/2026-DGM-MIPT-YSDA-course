---
name: summary-sync
description: Check that the final \begin{frame}{Summary} of each lecture still reflects what the lecture currently teaches — i.e. each \section{...} contributes at least one bullet to Summary, and Summary doesn't reference topics that were removed. Use after substantive edits (add/remove section, change a key formula, rework a derivation) per CLAUDE.md §8.
---

# summary-sync

Every lecture ends with `\begin{frame}{Summary}` — a one-slide takeaway for students. When the body changes substantively, the Summary should still match. See [CLAUDE.md](../../../CLAUDE.md) §8.

This is a lighter check than `recap-sync`: the Summary is not a verbatim mirror, it's a paraphrase. We only verify topic coverage, not exact wording.

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

### Step 3 — coverage check

For each section title, scan the Summary bullets for a matching topic. Matching is *semantic*, not exact:

- "Probability Flow ODE" section → Summary should mention "probability flow ODE" or "PF-ODE" or the equivalent claim
- "Score-Based Generative Models Through SDEs" section → Summary should mention SDE-based score modeling, continuous-time score matching, or similar

Use judgment — Summary bullets are concise statements of takeaways, not section titles repeated. A single bullet may cover multiple sub-topics.

For each section, classify:

- **covered** — at least one Summary bullet plausibly addresses this section's content
- **uncovered** — no Summary bullet matches; suggests Summary was not updated after adding/expanding this section
- **possibly-stale** — a Summary bullet references a topic that has no matching `\section` (suggests the section was renamed or removed but Summary wasn't refreshed)

### Step 4 — report

```
summary-sync: lectures/lecture10/Lecture10.tex

Summary frame: line 752 (8 bullets)
Sections: 4

  ✓ Probability Flow ODE              — covered by bullet 1, 2
  ✓ Reverse SDE                       — covered by bullet 3
  ✓ Score-Based Generative Models …   — covered by bullet 4, 5, 6
  ✗ Flow Matching (FM)                — uncovered
    → Section spans lines 674–751 but Summary doesn't mention vector-field
      fitting or the v(x,t) parametrization. Consider adding a bullet.

  ⚠ bullet 7 "PDE-based sampling"     — possibly-stale; no matching \section
```

End with: "Want me to draft replacement bullets for the uncovered sections?" — wait for confirmation before editing the Summary frame.

## Important rules

- **Don't rewrite Summary unilaterally.** Coverage is a judgment call; the user is the best author of their own takeaways. Always propose, never silently edit.
- **Minor edits don't require Summary updates** (CLAUDE.md §8: "Minor edits (typos, rewording, tightening one slide) do not require touching Summary."). If `git diff` shows only whitespace or single-word fixes, say "no Summary update needed" and stop.
- **Style:** Summary bullets are full sentences, conceptual takeaways — not section titles. If you draft bullets, match the existing voice (look at neighboring lectures' Summary frames for tone).
- **Animations:** Summary frames typically don't use `\nextonslide` / `\eqpause` — they're static. Don't add animation machinery when proposing bullet edits.
