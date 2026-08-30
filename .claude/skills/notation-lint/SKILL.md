---
name: notation-lint
description: Scan a lecture .tex (or the current git diff) for violations of the project's notation, animation, and pseudocode-block conventions defined in CLAUDE.md — raw \mathbf/\boldsymbol/\mathcal/\mathbb, D_{KL} written without \KL, raw \pause inside math environments, content frames missing \myfootnotewithlink, non-local figure paths, missing %======= frame separators, and malformed Training/Sampling blocks. Use when the user asks to "lint the lecture", "check notation", "review LectureN for style", or after substantive edits to a .tex file under lectures/.
---

# notation-lint

You lint LaTeX lecture sources against the conventions in [CLAUDE.md](../../../CLAUDE.md) — sections *Math notation*, *Slide structure*, *Slide animations*, and *Training / Sampling pseudocode blocks*. The single source of truth for macros is [lectures/utils/newcommands.tex](../../../lectures/utils/newcommands.tex) — grep it at runtime; do not hardcode the macro list, it changes.

## Inputs

- If the user passes a path (e.g. `lectures/lecture10/Lecture10.tex` or a directory), lint that target.
- If no argument is given, lint the current git diff (staged + unstaged changes to `lectures/**/*.tex`). Restrict checks to **added or modified lines** — plus their surrounding frame where a check needs frame context — so existing legacy violations don't drown the report.
- Always skip [lectures/utils/](../../../lectures/utils/), [lectures/supplementary/](../../../lectures/supplementary/), and `lectures/merged/`.

## Checks

Run each check, collect findings as `file:line — rule — snippet — suggested fix`. Group by file in the final report.

### 1. Raw math fonts (*Math notation*)

Forbidden patterns inside `.tex` content (NOT inside `utils/newcommands.tex`):

- `\mathbf{...}`, `\boldsymbol{...}`, `\mathcal{...}`, `\mathbb{...}`
- `D_{KL}`, `D_\text{KL}`, `KL(` outside the `\KL{...}` macro
- `\text{JSD}`, `\text{FID}`, `\text{MMD}` instead of `\JSD`, `\FID`, `\MMD`

For each hit, grep [newcommands.tex](../../../lectures/utils/newcommands.tex) for the bold/cal letter inside and suggest the matching shortcut. Example: `\mathbf{x}` → suggest `\bx` if `\newcommand{\bx}{\mathbf{x}}` exists; if no macro exists yet, suggest adding one to `newcommands.tex` rather than inlining.

### 2. Raw `\pause` inside math (*Slide animations*)

A `\pause` (or `\onslide`, `\uncover`) between `\begin{align}…\end{align}`, `\begin{equation}…\end{equation}`, or `\begin{multline}…\end{multline}` desynchronises the `pcounter` / `noscounter` counters that `\nextonslide` depends on. Flag every occurrence and suggest `\eqpause`.

`\pause` outside math is fine — do not flag those.

### 3. Content frames missing `\myfootnotewithlink` (*Slide structure*)

"Every content slide that presents a result, figure, or claim from a paper must cite the source". Heuristic for content frames:

- Frame contains `\includegraphics`, OR
- Frame contains a `\begin{block}{...}` whose title looks like a named result (Theorem, Lemma, Proposition, or any block referencing a model/method by name), OR
- Frame body cites a specific equation or algorithm visually attributable to a paper.

If such a frame has neither `\myfootnotewithlink{...}` nor `\myfootnote{...}` at the top, flag it. Exceptions: title frame (`\titlepage`), `Outline`, `Summary`, and `Recap of Previous Lecture` frames whose figures come from prior course slides may still need citations — only suppress for the title frame.

### 4. Non-local figure paths (*Slide structure*)

`\includegraphics[...]{<path>}` paths must be `figs/...` (relative to the lecture). Flag:

- Absolute paths
- `../lectureK/figs/...` (borrowing from another lecture)
- `../utils/figs/...` — allowed only if you can confirm the file exists there; otherwise flag.

### 5. Missing `%=======` frame separators (*Slide structure*)

Between two consecutive `\end{frame}` / `\begin{frame}` pairs, there should be a line whose only non-whitespace content is `%=======` (any number of `=`). Flag pairs where the separator is missing.

### 6. Training / Sampling pseudocode blocks (*Training / Sampling pseudocode blocks*)

For every `\begin{block}{Training...}` / `\begin{block}{Sampling...}` pair, flag:

- **Non-canonical titles.** Exactly `Training` / `Sampling`, optionally with an algorithm-name parenthetical: `Sampling (Ancestral)`, `Training (Score matching)`. Flag `Inference`, `Training Procedure`, `Training DDPM`, and any "procedure"/"algorithm" filler.
- **`itemize` used for the steps.** Steps are always `enumerate`, even for two items. (`itemize` is fine for unordered remarks *near* the block.)
- **Non-canonical step verbs.** Each step: imperative verb + period. Canonical: Sample, Compute, Solve, Update, Denoise, Reparametrize, Predict, Initialize, Return. Flag Obtain / Draw / Pick / Generate. Independent samples share one step, separated by a comma, not "and" or extra `\item`s.
- **Animation inside the block.** No `\eqpause` / `\pause` between `\item`s — a block reveals all at once. `\eqpause` belongs *between* the Training and Sampling blocks.
- **Bare `\theta` parameterization.** Use `\btheta` (or `\bphi, \btheta`) and `\pt(\cdot)`, never bare `\theta` / hand-written `p_\theta(\cdot)`. Per-batch loss is `\cL`.
- **Displayed-equation spacing inside a step.** `\vspace{-0.3cm}` before, `\vspace{-0.5cm}` after; terminate with a period if it ends the sentence.

If a flagged block was *changed* in the diff, remind that the next lecture's recap mirrors it verbatim — defer the cross-check to `recap-sync`.

## Output format

Group findings by file, sorted by line number, using the clickable `path:line` format. For each finding give the rule (1–6), the snippet, and the concrete fix. End with a one-line summary: `N findings across M files` and, if findings >0, ask whether the user wants you to apply the fixes. Apply fixes only on confirmation, and **never** introduce new macros to `newcommands.tex` without showing the user the proposed addition first.

## What NOT to do

- Don't flag violations in [lectures/utils/](../../../lectures/utils/) — that's where the macros are defined.
- Don't reflow whitespace or "tidy" lines you're not fixing for a rule (CLAUDE.md, *Style preferences for edits*).
- Don't rewrite `\pause` to `\eqpause` outside math environments — they aren't equivalent.
- Don't suggest a macro that doesn't exist; if the right shortcut is missing, recommend adding it to `newcommands.tex` instead.
