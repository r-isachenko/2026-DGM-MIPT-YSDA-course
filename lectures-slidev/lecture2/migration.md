# Lecture 2 — migration to Slidev

Source: `../../lectures/lecture2/Lecture2.tex` and its 78-page Beamer PDF.
Migration date: 2026-09-13. The Beamer sources remain the content reference.

## Coverage

- All 25 explicit frames and 6 automatic section/subsection outlines are retained: **33 logical slides, 80 reveal states**. The Jacobian example is merged into its source slide; AR and RealNVP remain additive examples, per the author’s follow-up on 2026-09-13.
- Every original frame maps to one logical slide. Source frame 9 now incorporates the interactive Jacobian visualization in place of its old image; its theorem, assumptions, formulas and explanatory statements remain. The title is frame 1.
- The 33-page handout is self-contained. Each new demo has a deterministic static comparison that includes all essential cases.
- All 12 original PNG assets are copied byte-for-byte. The taxonomy uses a shared SVG rendered from the original TikZ with `nf` highlighted: `bash tools/export-taxonomy.sh taxonomy-nf`.
- Shared theme, KaTeX adapter (87 course macros), fonts, and dependency lockfile are reused. No new dependencies or remote runtime assets.

## Layout and terminology

- The Jacobian definition uses a text/matrix row. Below it, the CoV heading, assumptions, and both identities form one full-width block aligned on the left; the original inline substitution remains a separate reveal.
- Divergence recap, matrix decompositions, and Bayesian notation use columns. AR transformations keep equations next to their corresponding diagrams.
- The composition proof keeps every equality, with the product of determinants on its own row; the repeated line-break equals sign in Beamer is treated as continuation punctuation.
- RealNVP's inverse coupling equations and determinant product reveal on the same row without moving previously visible material.
- Sampling (generation) / Density evaluation follow the author's existing Slidev decision. This affects the first recap, the AR performance comparison, and the Summary. Existing terminology embedded in original figures and paper titles is retained.
- The ancestral Sampling block is preserved. The author's later refinement adds explicit NF Training / Sampling blocks on slide 14, using the same MLE objective as the source.
- The six Summary bullets, sections, and topic order remain intact. README schedule and the mathematical interfaces with Lecture 1 and Lecture 3 were checked manually; no Beamer changes are needed for this migration.

## Source issues retained for editorial review

These are inherited issues, not silent mathematical changes made during migration:

- Frame 15's inversion-complexity and continuous-parameterization wording was clarified in the author's refinement below; it is no longer an open issue in Slidev.
- Frame 16: both triangular factors in LU are described as having positive diagonals. This restricts the represented matrices for a fixed permutation. The statement that the permutation matrix is optimized during training also needs qualification. The same wording is repeated in Lecture 3's recap; any editorial correction should cover both lectures together.
- Frame 17: the stated nonzero-scale condition assumes that the parameter functions are continuously differentiable, as required by the diffeomorphism claim.

## Frame and reveal map

The page ranges below refer to the current Slidev PDF with reveals. The original reveal sequence is retained; the Jacobian demo is part of source frame 9, and the AR and RealNVP extension slides each add one static PDF page.

| Source frame / transition | Slidev slide | Title | Clicks | Slidev PDF pages |
|---|---:|---|---:|---|
| 1 | 1 | Deep Generative Models | 0 | 1 |
| 2 | 2 | Recap of Previous Lecture | 0 | 2 |
| 3 | 3 | Recap of Previous Lecture | 0 | 3 |
| 4 | 4 | Recap of Previous Lecture | 0 | 4 |
| 5 | 5 | Recap of Previous Lecture | 0 | 5 |
| 6 | 6 | Outline | 0 | 6 |
| auto: Normalizing Flows (NF) | 7 | Outline | 0 | 7 |
| 7 | 8 | Generative Models Taxonomy | 0 | 8 |
| 8 | 9 | Normalizing Flows: Prerequisites | 3 | 9–12 |
| 9 | 10 | Jacobian Determinant | 3 | 13–16 |
| 10 | 11 | Fitting Normalizing Flows | 2 | 17–19 |
| 11 | 12 | Composition of Normalizing Flows | 3 | 20–23 |
| 12 | 13 | Normalizing Flows (NF) | 3 | 24–27 |
| 13 | 14 | Normalizing Flows | 2 | 28–30 |
| auto: NF Examples | 15 | Outline | 0 | 31 |
| auto: Linear NF | 16 | Outline | 0 | 32 |
| 14 | 17 | Jacobian Structure | 4 | 33–37 |
| 15 | 18 | Linear Normalizing Flows | 1 | 38–39 |
| 16 | 19 | Linear Normalizing Flows | 3 | 40–43 |
| auto: Gaussian Autoregressive NF | 20 | Outline | 0 | 44 |
| 17 | 21 | Gaussian Autoregressive Model | 5 | 45–50 |
| 18 | 22 | Gaussian Autoregressive NF | 2 | 51–53 |
| extension: 18 | 23 | Gaussian Autoregressive NF: Two Directions | 0 | 54 |
| auto: Coupling Layer (RealNVP) | 24 | Outline | 0 | 55 |
| 19 | 25 | RealNVP | 3 | 56–59 |
| 20 | 26 | RealNVP | 3 | 60–63 |
| extension: 20 | 27 | RealNVP: Explore a Coupling Layer | 0 | 64 |
| auto: Latent Variable Models (LVM) | 28 | Outline | 0 | 65 |
| 21 | 29 | Bayesian Framework | 1 | 66–67 |
| 22 | 30 | Bayesian Framework | 3 | 68–71 |
| 23 | 31 | Latent Variable Models (LVM) | 4 | 72–76 |
| 24 | 32 | Latent Variable Models (LVM) | 2 | 77–79 |
| 25 | 33 | Summary | 0 | 80 |

## Layout review corrections (2026-09-13)

- Slide 5: arranged the MLP on the left and the pixel-order/transformer pair in a single ImageGPT block on the right. The headings share a baseline, the illustrations are vertically centered, and a light divider separates the model families; all three source lines remain below a clear gap.
- Slide 9: grouped the CoV heading, assumptions, and identities in one left-aligned block; the Jacobian matrix stays in the preceding block.
- Slides 10–11: increased each main image height from 260 to 340 CSS px while preserving aspect ratios and source files.
- Fonts, notation, content, slide counts, and reveal counts are unchanged.
- The preceding correction set passed inspection of all 31 slides / 78 states. The final slide-5 recomposition was checked separately with `QA_SLIDES=5 node tools/inspect.mjs 2`; it passes the footnote-boundary check. `npm run finalize -- 2` was rerun and both regenerated PDFs were rendered and visually reviewed.
- The browser inspector now checks the actual source-footnote boundary with a 12 px gap and fails on overflow. The previous fixed slide-edge check did not catch the overlap reported on slide 5; the earlier blanket statement of no overlaps was too broad.

## Verification

- Typography follow-up (2026-09-13): the author requires strict visual consistency with Slidev Lecture 1. Compared `\bbR^m` on L1 slide 30 with L2 slide 2, and `D(\pi\|p)` on L1 slide 34 with L2 slide 2 in the exported PDFs; these use the same shared macros and KaTeX font families. L1 slide 34 was also viewed in the running browser. The particular display difference reported by the author has not yet been reproduced; no speculative font substitution was applied. Future migrations must include the explicit cross-lecture visual check in `../MIGRATION.md` §3.
- `npm run finalize -- 2` passed with Node 24.19.0 and the existing lockfile: source map, README sections, original asset hashes, citations, and all 87 shared macros checked; all 7 existing tests passed; the production web build and both PDF exports succeeded.
- `node tools/inspect.mjs 2` passed on all **31 slides / 78 states**: zero JavaScript errors, failed requests, missing images, KaTeX errors, raw math delimiters, or content overflows. Every click changes visible content; forward/backward states match and content geometry remains fixed.
- `python tools/render-qa.py 2` verified the page counts and extracted text without raw math delimiters. All 31 handout pages and all 78 reveal pages were rendered and visually reviewed against the original Beamer states; dense CoV/composition/RealNVP pages were also reviewed at full size.
- Shared NF taxonomy SVG was visually checked after export, including the highlighted node, boxes, and connecting arrows. The TeX exporter reports three ignored PostScript specials as in the earlier taxonomy workflow; no missing diagram elements were found.
- Final artifacts: `Lecture2.pdf` (78 pages), `Lecture2-handout.pdf` (31 pages). Temporary builds, screenshots, browser reports, and PDF text remain under ignored `output/` and `dist/`.
- `git diff --check` passed. Existing Beamer lecture sources/PDFs, the dependency lockfile, and `lectures/merged/` were not changed.

Real stylus/palm rejection, projector readability, and tablet-to-projector synchronization remain device checks for the shared course template. No drawing or synchronization behavior was changed for this migration.

## Additive interactive examples (2026-09-13)

Requested by the author after the migration: retain all original slides and add
three demonstrations immediately after their corresponding material.

- Slide 11, after source frame 9: unit-square area under a linear map. Identity,
  shear and stretch presets; positive stretch and shear sliders; determinant and
  density relation. The handout compares identity, area-preserving shear and
  doubled area side by side.
- Slide 24, after source frame 18: a fixed four-dimensional Gaussian AR flow.
  Sampling reveals one coordinate at a time; density evaluation computes all
  outputs using observed prefixes. Active mode clicks preserve progress; Reset
  restarts the chosen operation. The PDF compares both directions with the same
  fixed numerical example.
- Slide 28, after source frame 20: two 2D affine coupling layers with alternating
  masks. Apply / Invert last layer, a strength slider, fixed Gaussian points and
  an orange tracked point. The active layer's triangular Jacobian and the
  cumulative generative log-determinant are shown. The PDF shows both layers,
  their equations and Jacobians; the inverse density log-determinant has opposite
  sign. These are fixed illustrative maps, not an online training demo.

Implementation is local to `lecture2/components/` and `lecture2/lib/`, using the
shared DemoPanel and the same KaTeX macros/configuration as Lecture 1. No new
packages or remote assets. Demo state is controlled in the projected browser;
as in Lecture 1 it is not synchronized between separate presenter/viewer windows.
Original slides, sections, Summary and the Lecture 3 recap interface retain their
content. The six Summary bullets already cover all three demonstrated concepts.

Validation of the additions:

- `npm run finalize -- 2`: source coverage, slide map, citations, original asset
  hashes and 87 macros checked; all 11 numerical/course tests passed; web build
  and both PDF exports passed (34 handout pages / 81 reveal pages).
- `node tools/inspect.mjs 2`: all 34 slides and 81 states passed, including
  forward/backward reveal geometry, visible math, image loading and source-footer
  boundaries; no page errors or failed requests.
- `node tools/inspect-flow-demos.mjs`: 19 saved visual states; preset and slider
  controls, keyboard isolation, mode switching, reset, slide-return persistence,
  coupling-mask invariants, reverse stages and controls in pen mode passed.
- All PDF pages were rendered and reviewed as contact sheets. Each new static
  demo was inspected at full size; recurring vector/density notation and the
  shared visual style were compared with the approved Lecture 1 PDF and the
  surrounding original Lecture 2 slides. The Jacobian demo uses the same
  `p(\bx)` / `p(\bz)` notation as its preceding source slide.
- The 31 original Markdown slides are byte-for-byte unchanged relative to the
  snapshot taken before this addition. Sections, Summary and recap interfaces
  retain their meaning; no updates to the Beamer lecture or Lecture 3 are needed.
- `git diff --check` passed. Real stylus/palm rejection and projector checks
  remain device checks; the demo browser tests do not establish those.

## Author refinements after interactive review (2026-09-13)

This section supersedes the additive-only layout recorded above.

- Slide 10 combines source frame 9 and its former extension. The inverse-function
  theorem, reciprocal determinant identity, assumptions and volume interpretation
  remain on the left; the demo replaces the old raster illustration on the right.
  The three original reveal steps remain; the demo appears with the volume
  interpretation on step 3. The PDF includes identity, shear and stretch cases.
- Slide 23 removes the arbitrary 0.6 coefficient from every AR formula and the
  numerical implementation: each conditional mean is the sum of the prefix.
  Dependency arrows now end upward at the bottom edge of the next output card.
- Slide 27 overlays the previous positions of representative points and connects
  them to the transformed positions. First-layer trails are vertical (horizontal
  coordinate fixed), second-layer trails horizontal (vertical coordinate fixed).
  A dashed guide highlights the fixed coordinate of the orange tracked point.

Scope checks: the incoming recap is unchanged; the general CoV, AR and RealNVP
formulas used by Lecture 3's Beamer recap are unchanged. The AR numerical example
is local to this demo. All six Summary bullets still cover the same sections;
the Materials hierarchy is unchanged. No shared theme or notation was modified.
Updated numerical tests check the simplified AR example; browser assertions check
arrow tips meet the next card and coupling trails preserve the fixed coordinate.
Validation of this refinement:

- `npm run finalize -- 2` passed: 33 slides / 80 states, all 11 tests, web build
  and both exports. `render-qa.py 2` rendered both complete PDFs and checked page
  counts and math text. The three changed handout pages and all four Jacobian
  reveal states were reviewed at full size; no overlaps or clipped content.
- Affected browser slides 10, 23 and 27 passed geometry/reveal checks. The demo
  inspector passed 19 visual states, including the new arrow-target and vertical/
  horizontal trail assertions, sliders, reset, reverse layers and pen controls.
- The reused KaTeX typography and semantic colors match the immediately preceding
  approved version; the shared adapter/theme are unchanged. The preserved Jacobian
  expressions were compared with the pre-merge browser/PDF rendering.
- All other Markdown slide blocks are byte-for-byte unchanged from the pre-edit
  snapshot. Source/notation, incoming/outgoing recap impact, six-bullet Summary
  coverage and schedule/catalog checks found no introduced content drift.
- `git diff --check` passed. Physical stylus and projector acceptance remain
  unverified; browser checks do not replace those device checks.

## Author edits: layout and NF algorithms (2026-09-13)

Baseline: the preceding 33-slide / 80-state refinement, with `slides.md` SHA-256
`0194d5331d7fb328d5b669c6760f0646f52c1c7dd0973c2b5264f35033eca8dd`.
The author explicitly requested the following Slidev edits:

- Slide 10: widen the theory column from 390 to 480 px. Reduce the column gap
  and the gaps between plots; constrain the live and print plot rows so the
  figures sit closer together. Preserve the theorem, volume explanation,
  controls, numeric behavior and three reveal steps.
- Slide 14: remove the repetitive four-step illustration and replace it with
  Training / Sampling pseudocode. Training samples a minibatch, maps data to
  noise, computes the exact negative log-likelihood with the forward
  log-determinant, and updates the parameters. Sampling draws base noise and
  applies the inverse flow. Keep the determinant-complexity question and tie
  both efficiency requirements to their respective algorithms. The whole
  Training block is initially visible, Sampling appears on click 1, and
  Requirements on click 2. Formatting was checked against Lecture 8's diffusion
  pseudocode (Beamer PDF pages 19–20).
- Slide 18 (the parameterization statement referred to as slide 17 in the
  request): replace the abstract surjectivity parenthetical with the reason:
  changing the determinant sign along a continuous path requires a singular
  matrix. State the connected parameter domain explicitly. Also clarify that
  the inversion costs concern solving `W x = z`, not constructing an inverse.
  The explanation follows Papamakarios et al., section 3.2, PDF page 24.
- Slide 19: list the definitions of P, L, U, Q and R separately in the existing
  two columns. The inherited LU/QR assumptions and optimization wording remain
  as documented in the source-issues section above.

No slides or clicks were added: the existing map still gives **33 handout pages
and 80 reveal pages**. The removed figure remains among the original copied
assets. The shared Lecture 1 theme, font sizes, macro adapter and demo logic are
unchanged. Compared the affected browser/PDF typography and semantic colors
with the pre-edit rendering; the earlier shared Lecture 1 comparison remains
applicable to the unchanged theme and notation.

Validation:

- `finalize -- 2` passed on Node 24.19.0: source coverage, map, sections, assets,
  citations and 87 macros checked; all 11 existing tests passed; web build and
  both PDF exports succeeded.
- `render-qa.py 2` verified 33 / 80 pages and math text. All pages of both PDFs
  were reviewed as contact sheets, all four changed handout pages at full size,
  and the affected reveal sequences for hidden content and stable placement.
- After restarting dev, `QA_SLIDES=10,14,18,19 node tools/inspect.mjs 2` passed
  all 13 states, including forward/backward geometry, source-footer boundaries,
  image loading and math rendering. The demo inspector also passed all 19
  states, including sliders, presets, reset, keyboard isolation and pen controls.
  A separate browser check confirmed that returning from the next slide restores
  the final reveal on slides 10, 14, 18 and 19.
- Scope checks with notation-lint, recap-sync and summary-sync: the algorithms
  make the existing MLE objective explicit; the unchanged six-bullet Summary
  covers the same concepts. The incoming Slidev recap is unchanged, and no
  existing formula or definition drifts from Lecture 3's Beamer recap. The new
  pseudocode is an authorized Slidev addition; the Beamer sources are preserved.
  Section hierarchy and the README artifact catalog remain accurate.
- `git diff --check` passed. Both final PDF files were verified to have been
  exported after the last slide-source edit; the slide map is unchanged.

Final `slides.md` SHA-256:
`4a754093cdcf35fefbc1190ec36cad64ca1618eb92de027b7b3ad2e569d25590`.

## Slide 18: restore the explicit statement (2026-09-13)

At the author's request, the Continuous Parameterization block now starts with
the explicit nonexistence of a continuous surjection from `R^(m^2)` onto all
invertible `m x m` matrices. The determinant-sign explanation follows in the
shared muted gray color, with the same font size. The mathematical meaning,
single reveal step, slide map, Summary and recap interfaces are unchanged.

`finalize -- 2` passed, including all 11 tests and both exports (33 / 80 pages).
The affected handout page 18 and reveal page 39 were rendered and reviewed at
full size. Pixel comparison of every PDF page against the preceding reviewed
exports found changes only on those two pages. The final browser check on slide
18 passed both reveal states, geometry, backward navigation and footer spacing.
`git diff --check` passed.

Final `slides.md` SHA-256:
`d2f1b154780a97f6f28a78fd7b591cb58bb5544b453d7b38763a585e408afee3`.
