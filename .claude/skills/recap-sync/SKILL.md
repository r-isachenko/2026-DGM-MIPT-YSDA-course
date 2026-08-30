---
name: recap-sync
description: Verify that LectureN+1's "Recap of Previous Lecture" frames still mirror the corresponding blocks, equations, and figures in LectureN's body, per CLAUDE.md ("Cross-lecture coherence"). Use after editing a lecture, when the user asks to "check the recap", "sync recap", "verify lecture N+1 matches lecture N", or before committing substantive changes to a lecture body.
---

# recap-sync

The recap frames at the top of every lecture (except Lecture 1) are a **mirror** of specific blocks from the previous lecture, not an alternative formulation. When a definition, equation, or block title appears in both lecture N's body and lecture N+1's recap, they must agree exactly — same symbols, same indexing, same `\begin{block}{...}` titles. See [CLAUDE.md](../../../CLAUDE.md), section *Cross-lecture coherence: Summary and Recap frames*.

## Inputs

- If the user passes a lecture number `N` (e.g. "recap-sync 10"), check `LectureN.tex` → `LectureN+1.tex` recap.
- If no number is given, infer it from `git diff --name-only` — any modified `lectures/lectureN/LectureN.tex` triggers a check of `lectures/lectureN+1/LectureN+1.tex`.
- Lecture 1 has no preceding lecture; if asked about it, say so and stop.
- The highest-numbered lecture has no successor; if asked, say so and stop.

## Procedure

### Step 1 — extract the recap region

Recap frames are everything in `LectureN+1.tex` between the title frame and the first `\section{...}` — typically 2–5 frames titled `Recap of Previous Lecture`, each containing one or more `\begin{block}{...}` boxes, sometimes a figure, and a `\myfootnotewithlink` at the top.

### Step 2 — for each recap element, find its source in lecture N

For each `\begin{block}{TITLE}` in the recap:

1. Search `LectureN.tex` for `\begin{block}{TITLE}` (exact match first; if it misses, do a fuzzier search and report the title drift explicitly). If the title doesn't appear at all, flag it as an **orphan recap block** — the recap is referencing something not present in lecture N (possibly renamed or removed).
2. If found, extract the body of both blocks (recap version and source version) and diff them, normalizing whitespace.
3. Report any of:
   - Different equations / different LHS or RHS
   - Different variable names (e.g. `\bx_t` vs `\bx_\tau`)
   - Different block title wording
   - `\myfootnotewithlink` URL mismatch — the recap should cite the same paper as the source frame

For each standalone equation in the recap (outside a block), do the same: find the same LHS in lecture N's body, diff the RHS.

For each `\includegraphics{figs/<file>}` in the recap, confirm `lectures/lectureN/figs/<file>` exists (the recap may legitimately copy the figure into N+1's own `figs/`, in which case the filename should match).

### Step 3 — report

For each recap element, report its location in both lectures (clickable `path:line`), whether it matches, and — for mismatches — the concrete drift (missing source block, symbol drift, differing RHS, ...). Finish with a one-line summary: `K matches, M mismatches`.

End with one of:

- "All recap elements match the source." (no action needed)
- "N mismatches. Want me to (a) update the recap to match LectureN, (b) update LectureN to match the recap, or (c) walk through case-by-case?" — wait for the user; don't pick a direction unilaterally because either could be the wrong fix.

## Important rules

- **Never silently rewrite either lecture.** The recap might be stale, OR the body might have drifted from a deliberate recap formulation. Ask before editing.
- **Equation form matters more than whitespace.** Normalize spaces and braces before diffing, but flag any symbol or operator difference.
- **Block titles are exact strings.** "Reverse SDE" ≠ "Reverse Stochastic Differential Equation" — both are valid, but they must agree.
- **The recap inherits the slide-structure and animation style rules.** If you spot rule violations there (raw `\pause`, missing footnote), mention them but defer to `notation-lint` for full coverage rather than fixing inline.
- If the user reworks lecture N substantively, also flag (per CLAUDE.md) that the recap may need **re-prioritization** — different blocks emphasized, different number of recap frames — not just matching the current ones.
