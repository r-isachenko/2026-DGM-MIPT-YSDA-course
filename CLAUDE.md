# CLAUDE.md — Working with Lectures

This file gives Claude the conventions for editing the lecture materials of this
Deep Generative Models course (MIPT & YSDA, 2026). It applies to everything under
[lectures/](lectures/). Read it before making changes to any `.tex` file.

## 1. Repository layout

- Each lecture lives in [lectures/lectureN/](lectures/) with a single source file
  `LectureN.tex`, a `figs/` subfolder for images, and auxiliary build artifacts.
- Shared infrastructure is in [lectures/utils/](lectures/utils/):
  - [preamble.tex](lectures/utils/preamble.tex) — packages, beamer theme,
    animation machinery, footnote macros.
  - [newcommands.tex](lectures/utils/newcommands.tex) — math shortcuts (vectors,
    operators, distributions, divergences). **The single source of truth for
    notation.**
  - [title.tex](lectures/utils/title.tex) — title-page template, invoked via
    `\createdgmtitle{N}`.
  - [taxonomy.tex](lectures/utils/taxonomy.tex) — the generative-models taxonomy
    diagram shown on slide 2 of every lecture.
- Supplementary slides live in [lectures/supplementary/](lectures/supplementary/);
  the merged-into-one-PDF build lives in [lectures/merged/](lectures/merged/).
- Every lecture starts with:
  ```latex
  \documentclass{beamer}
  \input{../utils/preamble}
  \createdgmtitle{N}
  ```
  Relative paths to utils are always `../utils/...`.

## 2. Math notation — always go through macros

Never write `\mathbf{...}`, `\boldsymbol{...}`, `\mathcal{...}`, `\mathbb{...}`,
or `D_{KL}` directly inside a lecture. Use the shortcuts from
[newcommands.tex](lectures/utils/newcommands.tex):

- Bold vectors: `\bx`, `\bz`, `\bepsilon`, `\bmu`, `\btheta`, `\bSigma`, etc.
- Sets / spaces: `\cN`, `\cX`, `\cZ`, `\cL`.
- Blackboard bold: `\bbE`, `\bbR`, `\bbP`, `\bbI`.
- Divergences and metrics: `\KL`, `\JSD`, `\FID`, `\MMD`, `\Ent`.
- Distributions: `\pd` (data), `\pt` (parameterized), `\qagg` (aggregated
  posterior), `\Bern`, `\Cat`, `\Uniform`, `\Gumbel`.
- Numerical solvers: `\ODESolve`, `\SDESolve` (monospace, with proper spacing).
- Networks: `\NN`, `\MLP`, `\RNN`.
- Operators: `\argmin`, `\argmax`, `\tr`, `\cov`, `\diver`, `\softmax`, `\supp`.

If you need a symbol that isn't there, **add it to `newcommands.tex`** rather than
inlining `\mathbf{...}` ad hoc in one lecture. Keep the file's section comments
(`BOLD LETTERS`, `CALLIGRAPHIC LETTERS`, ...) intact when adding entries.

Notation must stay consistent across lectures 1–13 — the same object should have
the same symbol everywhere. Before introducing a new symbol, grep prior lectures
to see if it already has a name.

## 3. Slide structure

- Frames are separated by a `%=======` comment line. Preserve this separator when
  inserting or moving frames; it's the visual delimiter used throughout the
  codebase.
- Top-level structure uses `\section{...}` (and occasionally `\subsection{...}`).
  Outline frames are generated automatically by `\AtBeginSection` /
  `\AtBeginSubsection` in the preamble — **do not** insert a manual
  `\tableofcontents` after each section.
- Every content slide that presents a result, figure, or claim from a paper must
  cite the source with:
  ```latex
  \myfootnotewithlink{https://arxiv.org/abs/XXXX.YYYYY}{Author A. et al. Title, Year}
  ```
  Use `\myfootnote{...}` (no link) only when there is genuinely no URL to point
  at. Place the footnote command at the top of the frame body, immediately after
  `\begin{frame}{...}`.
- Figures live in the lecture's local `figs/` folder and are included via
  `\includegraphics[width=...\linewidth]{figs/<name>}`. Don't reference figures
  from other lectures' folders.

## 4. Slide animations

The preamble defines a custom step-by-step reveal system. Use it; don't fall back
to raw beamer commands.

- `\nextonslide{<content>}` — reveals `<content>` on the next overlay step.
- `\eqpause` — pause after an equation, kept in sync with `\nextonslide`
  counters. Use this instead of `\pause` after `align`, `equation`, `multline`.
- `\resetonslide` is called automatically at the start of each frame (via
  `\addtobeamertemplate{frametitle}`); you do not need to call it manually unless
  a frame uses `[noframenumbering,plain]` and skips the standard frametitle (e.g.
  the title slide does call it explicitly).
- Do **not** sprinkle raw `\pause` inside math environments — it desynchronises
  the `pcounter` / `noscounter` counters that `\nextonslide` depends on.

## 5. Training / Sampling pseudocode blocks

Every model has a `Training` block followed by a `Sampling` block. Students
compare these side-by-side across lectures, so keep them uniform.

- **Title.** Always `\begin{block}{Training}` / `\begin{block}{Sampling}` —
  never `Inference`, `Training Procedure`, `Training DDPM`. Name the
  *algorithm* (not the model) with a parenthetical: `Sampling (Ancestral)`,
  `Sampling (Annealed Langevin Dynamics)`, `Sampling (Guided)`,
  `Training (Score matching)`. "Procedure" / "algorithm" are not names — drop.
- **List.** `\begin{enumerate}` (ordered steps), even for two-item blocks.
  Itemize is only for unordered remarks near the block, not for the steps.
- **Phrasing.** Each step: imperative verb + period. Canonical verbs:
  **Sample, Compute, Solve, Update, Denoise, Reparametrize, Predict,
  Initialize, Return**. Separate independent samples with a comma, not "and"
  or extra `\item`s (`Sample $t \sim U\{1, T\}$, $\bepsilon \sim \cN(0, \bI)$.`).
  Avoid "Obtain / Draw / Pick / Generate" variants.
- **Animation.** `\eqpause` *between* the Training and Sampling blocks (and
  adjacent equations), never between `\item`s — the block reveals all at once.
- **Displayed equations inside a step.** Standard tight spacing:
  `\vspace{-0.3cm}` before, `\vspace{-0.5cm}` after; terminate with a period
  if it ends the sentence.
- **Loss / distribution notation.** `\cL` for the per-batch loss
  (`Compute loss $\cL = \ldots$`); keep `\cL_{\bphi, \btheta}(\bx)` for the
  full ELBO and `\cL_{\text{simple}}` for DDPM simple loss. Parameterize with
  `\btheta` (or `\bphi, \btheta`), never bare `\theta`. Use `\pt(\cdot)`, not
  hand-written `p_\theta(\cdot)`.
- **Recap mirror.** Per §9, the next lecture's recap mirrors this block
  verbatim — grep the next lecture for the same `\begin{block}` title and
  propagate any change.

## 6. Files you must not edit

Build artifacts produced by latexmk / pdflatex — never edit by hand, and don't
commit fixes to them:

- `*.aux`, `*.log`, `*.nav`, `*.snm`, `*.out`, `*.toc`
- `*.fls`, `*.fdb_latexmk`, `*.synctex.gz`
- `*.pdf` (regenerate from source instead)

If a `.pdf` looks wrong, fix the `.tex` and rebuild — don't try to patch the PDF.

## 7. Building a lecture

From inside the lecture directory:

```bash
latexmk -pdf LectureN.tex
```

Or, if `latexmk` is not available, run `pdflatex LectureN.tex` twice (once to
populate `.aux`/`.toc`, once to resolve the table of contents and cross-refs).

The merged all-lectures PDF is assembled by
[lectures/merged/merge_lectures.py](lectures/merged/merge_lectures.py); rerun it
after changing any lecture if the merged build needs to stay in sync.

## 8. README as the schedule source of truth

[README.md](README.md) holds the canonical course schedule, lecture titles, and
homework table. The bullets in the `Materials` table mirror the `\section{...}`
structure of each lecture's `.tex` file.

Update `README.md` together with the `.tex` whenever you:

- **Rename a `\section{...}`** — the corresponding `<li>` in the `Materials`
  table must be updated to match. Section renames inside one lecture often
  cascade: check whether the same wording is referenced elsewhere (recap frames
  of the next lecture, taxonomy diagram, other lectures' cross-references).
- Add or remove a section in a lecture.
- Move a topic between lectures, or reschedule a lecture.

These two files must never disagree about what a lecture covers.

## 9. Cross-lecture coherence: Summary and Recap frames

Each lecture has two "interface" frames whose content depends on the rest of the
course, not just the local lecture body. They are easy to miss when editing.

### Summary frame (end of every lecture)

The final frame of every lecture is `\begin{frame}{Summary}` — the student's
single-slide takeaway of that lecture's content. When you make a **substantive**
change to a lecture (add/remove a topic, replace a derivation, change a key
formula or definition), update the Summary slide so it still reflects what the
lecture actually teaches. Minor edits (typos, rewording, tightening one slide)
do not require touching Summary.

**Target length: 5–7 bullets, fewer is better.** 
Summary update as a **holistic revision**, not a simple addition: re-read all existing bullets and consider consolidating two related ones, dropping a secondary point, or replacing an old bullet rather than tacking a new one onto the end.

### Recap frames (start of the next lecture)

Every lecture except Lecture 1 opens with several `\begin{frame}{Recap of
Previous Lecture}` frames. These are **not** independent — they reproduce
specific blocks, equations, and figures from the previous lecture, often
verbatim (e.g. the continuity-equation block in Lecture 10's recap mirrors the
same block in Lecture 9).

Rules for recap edits:

- **The recap is a mirror, not an alternative formulation.** If a definition,
  equation, or notation appears in both lecture N's body and lecture N+1's
  recap, they must agree exactly — same symbols, same indexing, same wording in
  `\begin{block}{...}` titles.
- **When you change lecture N, check lecture N+1's recap.** Grep the previous
  lecture's source for the equation or block title you just edited; if it
  appears in lecture N+1's recap, update both. The relevant frames are the ones
  before the first `\section{...}`.
- **For substantive changes, flag the recap explicitly.** If a lecture is
  reworked in a way that affects what students need to remember going forward
  (a renamed theorem, a different parametrization, a removed step in a
  derivation), remind the user to review the next lecture's recap — even if
  you've already updated the obvious matches, the recap may need
  re-prioritization (different blocks emphasized, different number of recap
  frames, different ordering).
- The recap inherits all the slide-style rules from §3–§4: `\myfootnotewithlink`
  to the original paper, `\nextonslide`/`\eqpause` for animation, `%=======`
  separators. Recap frames typically use `\begin{block}{...}` boxes more
  heavily than body frames — keep this style.

## 10. Language

Lecture sources are written in English. Russian is fine for chat with the user
and for repository-internal notes, but should not appear in `.tex` content
shipped to students.

## 11. Style preferences for edits

- Don't reflow whitespace or reformat blocks you weren't asked to touch — diffs
  should be minimal.
- Don't add explanatory comments inside `.tex` files unless the construction is
  genuinely non-obvious (e.g. a custom counter trick).
- New math macros go to `newcommands.tex`; new shared environments / packages go to
  `preamble.tex`. Don't redefine commands locally inside a single lecture.
- When citing arXiv papers, use the canonical `https://arxiv.org/abs/<id>` URL
  and the short `Author A. Title, Year` format already used across the course
  (623+ occurrences).
