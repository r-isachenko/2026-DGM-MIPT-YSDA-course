---
name: notation-lint
description: Scan a lecture .tex (or the current git diff) for violations of the project's notation and animation conventions defined in CLAUDE.md §2 and §4 — raw \mathbf/\boldsymbol/\mathcal/\mathbb, D_{KL} written without \KL, raw \pause inside math environments, content frames missing \myfootnotewithlink, non-local figure paths, and missing %======= frame separators. Use when the user asks to "lint the lecture", "check notation", "review LectureN for style", or after substantive edits to a .tex file under lectures/.
---

# notation-lint

You lint LaTeX lecture sources against the conventions in [CLAUDE.md](../../../CLAUDE.md) §2 (notation) and §4 (animations). The single source of truth for macros is [lectures/utils/newcommands.tex](../../../lectures/utils/newcommands.tex) — grep it at runtime; do not hardcode the macro list, it changes.

## Inputs

- If the user passes a path (e.g. `lectures/lecture10/Lecture10.tex` or a directory), lint that target.
- If no argument is given, lint the current git diff: `git diff HEAD -- 'lectures/**/*.tex'` plus staged changes. Restrict checks to **added or modified lines** so existing legacy violations don't drown the report.
- Always skip [lectures/utils/](../../../lectures/utils/), [lectures/supplementary/](../../../lectures/supplementary/), and `lectures/merged/`.

## Checks

Run each check, collect findings as `file:line — short message — suggested fix`. Group by file in the final report.

### 1. Raw math fonts (CLAUDE.md §2)

Forbidden patterns inside `.tex` content (NOT inside `utils/newcommands.tex`):

- `\mathbf{...}`, `\boldsymbol{...}`, `\mathcal{...}`, `\mathbb{...}`
- `D_{KL}`, `D_\text{KL}`, `KL(` outside the `\KL{...}` macro
- `\text{JSD}`, `\text{FID}`, `\text{MMD}` instead of `\JSD`, `\FID`, `\MMD`

For each hit, grep [newcommands.tex](../../../lectures/utils/newcommands.tex) for the bold/cal letter inside and suggest the matching shortcut. Example: `\mathbf{x}` → suggest `\bx` if `\newcommand{\bx}{\mathbf{x}}` exists; if no macro exists yet, suggest adding one to `newcommands.tex` rather than inlining.

### 2. Raw `\pause` inside math (CLAUDE.md §4)

A `\pause` (or `\onslide`, `\uncover`) between `\begin{align}…\end{align}`, `\begin{equation}…\end{equation}`, or `\begin{multline}…\end{multline}` desynchronises the `pcounter` / `noscounter` counters that `\nextonslide` depends on. Flag every occurrence and suggest `\eqpause`.

`\pause` outside math is fine — do not flag those.

### 3. Content frames missing `\myfootnotewithlink`

Per CLAUDE.md §3, "every content slide that presents a result, figure, or claim from a paper must cite the source". Heuristic for content frames:

- Frame contains `\includegraphics`, OR
- Frame contains a `\begin{block}{...}` whose title looks like a named result (Theorem, Lemma, Proposition, or any block referencing a model/method by name), OR
- Frame body cites a specific equation or algorithm visually attributable to a paper.

If such a frame has neither `\myfootnotewithlink{...}` nor `\myfootnote{...}` at the top, flag it. Exceptions: title frame (`\titlepage`), `Outline`, `Summary`, and `Recap of Previous Lecture` frames whose figures come from prior course slides may still need citations — only suppress for the title frame.

### 4. Non-local figure paths (CLAUDE.md §3)

`\includegraphics[...]{<path>}` paths must be `figs/...` (relative to the lecture). Flag:

- Absolute paths
- `../lectureK/figs/...` (borrowing from another lecture)
- `../utils/figs/...` — allowed only if you can confirm the file exists there; otherwise flag.

### 5. Missing `%=======` frame separators (CLAUDE.md §3)

Between two consecutive `\end{frame}` / `\begin{frame}` pairs, there should be a line whose only non-whitespace content is `%=======` (any number of `=`). Flag pairs where the separator is missing.

## How to run

For the diff-only mode, prefer one or two well-targeted greps over reading whole files:

```bash
# Get added lines in lecture .tex files
git diff HEAD --unified=0 -- 'lectures/**/*.tex' \
  | awk '/^\+\+\+ /{f=substr($0,7)} /^@@/{split($3,a,","); ln=substr(a[1],2)+0; next} /^\+[^+]/{print f":"ln":"substr($0,2); ln++}'
```

Then run pattern checks (`grep -nE`) against the offending lines and the surrounding frame.

For a full-file mode, read the file in 200-line chunks and apply the same checks.

## Output format

Group findings by file, sorted by line number. Use the `path:line` link format so the user can click. For each finding give the rule (1–5), the snippet, and the concrete fix.

Example:

```
lectures/lecture10/Lecture10.tex
  L412 — rule 1: \mathbf{x}_t — use \bx_t (defined in newcommands.tex:23)
  L488 — rule 2: \pause inside align — use \eqpause
  L501 — rule 3: figure frame missing \myfootnotewithlink at top
```

End with a one-line summary: `N findings across M files` and, if findings >0, ask whether the user wants you to apply the fixes. Apply fixes only on confirmation, and **never** introduce new macros to `newcommands.tex` without showing the user the proposed addition first.

## What NOT to do

- Don't flag violations in [lectures/utils/](../../../lectures/utils/) — that's where the macros are defined.
- Don't reflow whitespace or "tidy" lines you're not fixing for a rule (CLAUDE.md §9).
- Don't rewrite `\pause` to `\eqpause` outside math environments — they aren't equivalent.
- Don't suggest a macro that doesn't exist; if the right shortcut is missing, recommend adding it to `newcommands.tex` instead.
