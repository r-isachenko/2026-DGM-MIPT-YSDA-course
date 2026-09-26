# Lecture 2 — migration to Slidev

Source: `../../lectures/lecture2/Lecture2.tex` and its 78-page Beamer PDF.
Migration date: 2026-09-13. The Beamer sources remain the content reference.

## Coverage

- All 25 explicit frames and 6 automatic section/subsection outlines are accounted for: **34 logical slides, 81 reveal states**. Authorized edits merge frames 15–16 into one linear example and frames 21–22 into one Bayesian introduction. Frame 18 now combines general AR formulas with its interactive example. Three TarFlow slides (AR transformations, Transformer architecture, image examples) follow the unchanged RealNVP demo; the takeaways/outlook slide then closes NF Examples before LVM.
- Original frames map to one logical slide each, except frames 16 and 22, whose retained content is merged into frames 15 and 21 respectively. Source frame 9 incorporates the interactive Jacobian visualization; frame 18 incorporates the AR demo instead of a separate extension. The title is frame 1.
- The 34-page handout is self-contained. Each new demo has a deterministic static comparison that includes all essential cases.
- All 12 original PNG assets are copied byte-for-byte. Two new, unmodified TarFlow figures are credited with source URLs, license and SHA-256 in `public/figs/sources.json`. The taxonomy uses a shared SVG rendered from the original TikZ with `nf` highlighted: `bash tools/export-taxonomy.sh taxonomy-nf`.
- Shared theme, KaTeX adapter (87 course macros), fonts, and dependency lockfile are reused. No new dependencies or remote runtime assets.

## Layout and terminology

- The Jacobian definition uses a text/matrix row. Below it, the CoV heading, assumptions, and both identities form one full-width block aligned on the left; the original inline substitution remains a separate reveal.
- Divergence recap and Bayesian notation use columns. Linear NF uses one concise slide with a structured-factor explanation and a continuous-parameterization remark; the determinant-sign argument is retained in presenter notes. Both general AR equations stay visible above the numerical demo, with the current direction highlighted; the PDF presents both directions side by side.
- The composition proof keeps every equality, with the product of determinants on its own row; the repeated line-break equals sign in Beamer is treated as continuation punctuation.
- RealNVP's inverse coupling equations and determinant product reveal on the same row without moving previously visible material.
- Sampling (generation) / Density evaluation follow the author's existing Slidev decision. This affects the first recap, the AR performance comparison, and the Summary. Existing terminology embedded in original figures and paper titles is retained.
- The ancestral Sampling block is preserved. The author's later refinement adds explicit NF Training / Sampling blocks (now slide 14), using the same MLE objective as the source.
- The six-bullet Summary reflects the course refresh: TarFlow scales Gaussian AR flows with Transformers; transport connects NF to CNF/Flow Matching, and marginalization motivates the LVM continuation. Sections and the order of the original topics remain intact. The incoming recap and NF/LVM mathematical interfaces are preserved; the new pointers are authorized Slidev additions.

## Source issues retained for editorial review

These are inherited issues, not silent mathematical changes made during migration:

- Frame 15's inversion-complexity and continuous-parameterization wording was clarified in the author's refinement below; it is no longer an open issue in Slidev.
- Frame 16: the old detailed LU/QR descriptions, including positive diagonals and optimization of the permutation matrix, were removed from Slidev by the authorized compression on 2026-09-14. The concise replacement explicitly requires nonzero triangular diagonals. The old wording remains only in the preserved Beamer L2/L3 sources; the accepted Slidev L3 recap already uses the condensed Structured Factors explanation.
- Frame 17: the stated nonzero-scale condition assumes that the parameter functions are continuously differentiable, as required by the diffeomorphism claim.

## Frame and reveal map

The page ranges below refer to the current Slidev PDF with reveals. Unchanged frames retain their original reveal sequence. Jacobian and AR demos are part of frames 9 and 18; RealNVP adds one static PDF page. The merged linear example, course-refresh outlook and merged Bayesian introduction each have two reveals.

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
| 15 + 16 (merged) | 18 | Linear Normalizing Flows | 2 | 38–40 |
| auto: Gaussian Autoregressive NF | 19 | Outline | 0 | 41 |
| 17 | 20 | Gaussian Autoregressive Model | 5 | 42–47 |
| 18 | 21 | Gaussian Autoregressive NF: Two Directions | 0 | 48 |
| auto: Coupling Layer (RealNVP) | 22 | Outline | 0 | 49 |
| 19 | 23 | RealNVP | 3 | 50–53 |
| 20 | 24 | RealNVP | 3 | 54–57 |
| extension: 20 | 25 | RealNVP: Explore a Coupling Layer | 0 | 58 |
| extension: 17 | 26 | TarFlow: Autoregression over Patches | 2 | 59–61 |
| extension: 11 | 27 | TarFlow: Transformer Architecture | 1 | 62–63 |
| extension: 12 | 28 | TarFlow: Flows Can Generate Detailed Images | 1 | 64–65 |
| extension: 13 | 29 | Normalizing Flows: What Comes Next? | 2 | 66–68 |
| auto: Latent Variable Models (LVM) | 30 | Outline | 0 | 69 |
| 21 + 22 (merged) | 31 | Bayesian Framework | 2 | 70–72 |
| 23 | 32 | Latent Variable Models (LVM) | 4 | 73–77 |
| 24 | 33 | Latent Variable Models (LVM) | 2 | 78–80 |
| 25 | 34 | Summary | 0 | 81 |

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


## Authorized course refresh: motivation and Bayesian introduction (2026-09-13)

Baseline: `slides.md` SHA-256
`d2f1b154780a97f6f28a78fd7b591cb58bb5544b453d7b38763a585e408afee3`.
The author accepted points 2, 3, 4 and 6 from the course-refresh discussion:

- Add “Why Study Normalizing Flows?” after the NF taxonomy, before the first
  derivation. Explain exact likelihood, the computational cost of inversion and
  Jacobian determinants, and the continuation to LVM/variational inference
  (introduced in L2, continued in L3–L4) and CNF/Flow Matching (L9–L11). Use one combined motivation/limitations
  slide, with independent reveals of the two future directions.
- Extend the continuous-variable note with discrete normalizing flows and a link
  to Tran et al. (2019). “Have not become mainstream” is the intended qualitative
  assessment of adoption in generation; it does not deny niche applications such
  as the lossless compression studied by Hoogeboom et al. (2019). These are
  discrete-state invertible flows, distinct from discrete-time continuous flows
  and from the later discrete diffusion / discrete Flow Matching topics.
- Merge the two Bayesian Framework slides. Preserve the general Bayes identity,
  prior/likelihood/evidence/posterior terminology and the intractable integration
  issue. Remove the separate dataset-level parameter posterior and MAP branch.
  Source frame 22 is explicitly recorded as merged into frame 21. Its dataset
  definition is moved to the MLE block on slide 31; the prior and decoder labels
  share one bullet to preserve room for that definition at the standard font size.
- Revise the existing six Summary bullets to reflect the transport connection and
  the likelihood challenge in LVMs. Keep the shared style and static Summary.

Linear NF depth (point 1), TarFlow/STARFlow examples (point 5), and timing (point 7)
remain deferred. The Beamer sources, supplementary material, homework and course
schedule are outside this change. Demo logic and the shared theme/macros are
unchanged; the Slidev README only updates demo slide numbers to 11 / 24 / 28.

The current map has 33 slides and 80 reveal states. Earlier dated verification
sections describe their historical revisions. Validation of this refresh:

- `finalize -- 2` passed on Node 24.19.0: source coverage, slide map, section
  hierarchy, citations, assets and all 87 macros checked; all 11 existing tests,
  the production web build and both PDF exports passed.
- Diff-scope notation, recap, Summary and schedule/catalog reviews passed. The
  incoming Slidev recap is unchanged, and the outgoing Lecture 3 Beamer recap
  has no dependency on the removed MAP branch. Common NF/LVM formulas agree.
  No Beamer synchronization is needed for the authorized Slidev additions.
- `render-qa.py 2` verified all 33 handout and 80 reveal pages. Every page of
  both PDFs was rendered and visually reviewed as contact sheets; handout pages
  9, 14, 30, 31 and 33 were inspected at full size. Future material is hidden in
  the intermediate reveal pages; the handout includes the complete explanations.
- After restarting dev, `inspect.mjs 2` passed all 33 slides / 80 states, with
  stable geometry, backward reveals, no empty clicks, no source-boundary
  overflows, no KaTeX errors and no failed image or network requests. A separate
  browser check confirmed that slides 9, 14, 30 and 31 restore their final reveal
  after visiting the next slide and returning.
- Compared the recurring `p_theta(x)` notation in Lecture 1 slide 34 and Lecture 2
  slide 31 at 1280 × 720 in browser screenshots and rendered PDFs. Body, heading
  and expression font properties and expression dimensions match in the browser;
  the PDF comparison confirms the same glyphs, sizing and semantic colors. The
  browser reference uses the existing approved Lecture 1 production build via a
  temporary local static server; no competing Slidev build/dev was started.
- The other 28 Markdown slide blocks are byte-for-byte unchanged from the saved
  baseline, including the incoming recap, Linear NF and all demo slide content.
  Demo components, numerical implementations, shared theme and macros are also
  unchanged. The existing numerical demo tests passed in finalization; the prior
  dedicated demo-control review remains applicable to the unchanged controls.
- Both final PDF modification times are later than the last slide-source edit.
  `git diff --check` passed. Temporary renders and reports remain under ignored
  `output/qa/lecture2/`; the Lecture 2 dev server was restored on port 3032.
  Physical stylus/projector behavior was not changed or rechecked.

Final `slides.md` SHA-256:
`847ffe4167052720cbcee5847582851e876604d38f39cd4d108e52094a13cdb5`.


## Move the NF outlook to the section ending (2026-09-13)

Baseline `slides.md` SHA-256:
`847ffe4167052720cbcee5847582851e876604d38f39cd4d108e52094a13cdb5`.
This author follow-up supersedes the early placement in the preceding refresh.

- Move the former slide 9 after the RealNVP interactive example, immediately
  before the LVM Outline. It is now slide 28, “Normalizing Flows: What Comes
  Next?”, mapped as `extension: 13` to the NF algorithms/requirements frame.
- Reframe the opening as what the NF block has established: exact likelihood,
  MLE and the computational requirements. Label LVM as the immediate next topic
  and continuous flows / Flow Matching as the later continuation. Keep both
  references, the two independent reveals and the shared typography/columns.
- Restore demo slide references in the Slidev README to 10 / 23 / 27. All other
  slide blocks, sections, Summary, recaps, demo components and mathematical
  derivations retain the preceding approved content. There are still 33 slides
  and 80 reveal states.

Validation:

- `finalize 2` passed the source/map/assets checks and all 11 tests, then rebuilt
  the web deck and both PDFs. `render-qa.py 2` rendered 33 handout pages and 80
  reveal pages.
- Inspected handout page 28 and reveal pages 65–67 at 1280 × 720. The opening,
  two aligned columns, citations and each reveal fit the approved shared style.
  The earlier Lecture 1 typography comparison remains applicable: the theme,
  macros, fonts and shared layout classes are unchanged.
- Compared the other 32 handout pages and 77 reveal pages by source-frame ID
  and click index against the preceding reviewed exports. They are pixel-identical
  after masking the bottom-right folio area (10% of width and height), so the
  preceding visual review remains applicable to them.
- The affected-slide browser check passed slides 9, 27, 28 and 29 before export;
  the final post-export check passed all three states of slide 28, including
  stable geometry, backward reveals, content boundaries and browser errors.
  A separate navigation check passed RealNVP 27 → outlook 28 → LVM Outline 29
  → outlook 28, restoring the final reveal on return.
- Source review confirmed that the other 32 Markdown slide blocks are unchanged,
  including Summary and recaps. Map coverage remains 33 slides / 80 states, and
  the README demo references match the restored slide numbers 10 / 23 / 27.
- Both PDF modification times are later than the slide-source edit.
  `git diff --check` passed. Evidence is under ignored
  `output/qa/lecture2/outlook-move-final/`; the dev server remains on port 3032.

Final `slides.md` SHA-256:
`b62575527ebd03283c05b5f2081d1b00578562aceb0dcf63a49dd8a8284c8d36`.

## Compress NF examples (2026-09-14)

Baseline `slides.md` SHA-256:
`b62575527ebd03283c05b5f2081d1b00578562aceb0dcf63a49dd8a8284c8d36`.
The author approved the conservative compression discussed on 2026-09-14;
this supersedes the deferred Linear NF decision in the preceding refresh.

- Merge the former linear slides 18–19 into slide 18 (source frames 15 + 16).
  Preserve the linear map, Jacobian, solve costs and explicit nonexistence of a
  continuous surjection onto all invertible matrices. Replace LU/QR definitions
  with their purpose, nonzero triangular diagonals and direct factor training.
  Remove `theta = W` because the factors are now the learned parameterization.
  Preserve the full determinant-sign explanation in this slide's presenter notes.
- Merge former AR slides 22–23 into slide 21 (source frame 18). Both general
  transformations stay visible with their original conditioning and parameter
  notation; the active mode is highlighted without changing geometry. Below,
  retain the fixed toy model, numerical controls and its unit-diagonal Jacobian
  qualification. Use display-style fractions and the existing font sizes.
  Recover space through local spacing and card heights. In PDF, retain both
  general formulas and the complete two-direction numerical comparison.
- Keep the preceding Gaussian AR model slide and every RealNVP slide unchanged.
  The removed static network diagrams are replaced by the existing dependency
  demonstration. Forward KL/MLE remains in the earlier common training material.
- Keep all sections and update the linear Summary bullet. Source coverage is
  31 slides / 74 states; README demos are now 10 / 21 / 25. Update the dedicated
  demo inspector to resolve an example incorporated into its source frame and
  verify that mode changes preserve and highlight the two general formulas.
- Record the completed compression in course-refresh. Do not remove Linear NF
  from the course; TarFlow/STARFlow and timing remain deferred.

Recap interface: Slidev L2 to preserved Beamer L3. The general AR formulas and
NF/LVM definitions still agree. Beamer L3 lines 78–85 retain the older detailed
LU/QR recap, matching its preserved Beamer L2 baseline. When migrating L3 to
Slidev, replace that block with the current Structured Factors explanation,
remove `theta = W` from the adjacent formula on line 75, and retain the general
AR identities; do not turn the toy `sigma = 1` into a general
assumption. This is an approved difference between the parallel course formats,
not an authorization to rewrite the existing Beamer sources. The incoming
Slidev L1 → L2 recap is unchanged.

Validation:

- Diff-scope notation, Summary, recap and README reviews passed. All 25 source
  frames are covered exactly once, with frames 16 and 22 merged as recorded.
  All other Markdown blocks are unchanged apart from the agreed Summary bullet;
  RealNVP is byte-for-byte identical to the approved baseline.
- `finalize 2` passed on Node 24.19.0: source coverage, map, sections, references,
  assets and 87 shared macros checked; all 11 existing tests passed, followed by
  the production build and both PDF exports. Final counts are 31 / 74 pages.
- `render-qa.py 2` rendered every final PDF page. All pages of both PDFs were
  visually reviewed as contact sheets; changed handout pages 18, 21 and 31 were
  inspected at full size. Linear reveals hide future blocks; the AR handout
  includes both general transformations and both numerical directions.
- The initial AR handout review caught a footer overlap caused by the old
  minimum paragraph height. Removing that print-only height fixed the overlap;
  both PDFs were rebuilt and the final AR page reviewed again at full size.
  No font size was reduced.
- Pixel comparison against the baseline found the other 28 handout pages and
  69 reveal pages unchanged after masking the bottom-right folio area (10% of
  width and height). The earlier Lecture 1 browser/PDF typography comparison
  remains applicable to the unchanged recurring notation, including the current
  L2 MLE slide 29; shared theme, macros, fonts and FlowMath are unchanged.
- `inspect.mjs 2` passed all 31 slides / 74 states, including forward/backward
  reveals, stable geometry, content boundaries, math and asset checks. After
  the final print-only correction and export, slides 18, 21 and 31 passed again.
- The updated flow-demo inspector passed 19 visual states: both general AR
  formulas stay present with stable geometry while the active direction changes;
  numerical controls, mode/reset behavior, returns and pen-mode controls work.
  A final navigation check restored linear slide 18 at click 2 and AR slide 21
  with completed density evaluation after returning from the following slide.
- Both PDF modification times are later than the final slide and component edits.
  `git diff --check` passed. Final evidence is in ignored
  `output/qa/lecture2/nf-compress-final/`; the L2 dev server remains on port 3032.
  Physical stylus/projector behavior was not changed or rechecked.

Final `slides.md` SHA-256:
`c7985b04ff1fa7e77aae42f540681460f65278915e43a5e99294a1eeb59c1758`.
Final `AutoregressiveFlowDemo.vue` SHA-256:
`bdba53203b5a3113033e6f89ced2d19fdf634a8b733650e6f294e708a1a43ad4`.

## Linear NF order and visible determinant explanation (2026-09-14)

The author revised slide 18: reveal Continuous Parameterization first, including
the original visible explanation that changing determinant sign crosses zero and
loses invertibility; reveal Structured Factors second. This supersedes the
preceding decision to keep that explanation only in presenter notes. The fuller
notes remain. Record the revised decision in course-refresh.

Baseline `slides.md` SHA-256:
`c7985b04ff1fa7e77aae42f540681460f65278915e43a5e99294a1eeb59c1758`.
Only the linear slide changed; all other slide source is byte-identical to that
baseline. The map stays at 31 slides / 74 states, with two clicks on slide 18.
The definition, Summary, recap interfaces, section hierarchy and README catalog
are unaffected. Shared theme, fonts, macros and demo components are unchanged;
the preceding checks and Lecture 1 style comparisons remain applicable there.

Validation:

- `finalize 2` passed the source checks, all 11 existing tests, production build
  and both PDF exports. Both PDFs are newer than the final source edit.
- `render-qa.py 2` rendered all 31 handout pages and 74 reveal pages. Handout page
  18 and reveal pages 38–40 were reviewed at full size: the determinant explanation
  is readable, the second block stays hidden until click 2, and content clears
  the source footer without reducing font sizes.
- Pixel comparison with the baseline found all other 30 handout pages and 72
  reveal pages identical, including the initial state of slide 18. Previous
  visual evidence is reused for those unchanged pages.
- `QA_SLIDES=18 ... tools/inspect.mjs 2` passed all three states, geometry,
  forward/backward navigation, math and content bounds. A separate browser check
  confirmed the exact block order, visible determinant explanation on click 1,
  and restored click 2 after returning from slide 19, with no page errors.
- `git diff --check` passed. Baseline files and final evidence are in ignored
  `output/qa/lecture2/linear-order-before/` and `linear-order-final/`;
  the L2 dev server remains available on port 3032.

Final `slides.md` SHA-256:
`46a8e8b9fed2e1748e26dd218a271bc13bc05a95cfeec31161ed7c93c0139fb0`.

## TarFlow and closure of the L2 refresh (2026-09-14)

Baseline `slides.md` SHA-256:
`46a8e8b9fed2e1748e26dd218a271bc13bc05a95cfeec31161ed7c93c0139fb0`.
This includes the author's restored determinant-sign explanation and its latest
reveal order. The new request explicitly adds TarFlow and asks to close every L2
item in course-refresh; it supersedes the earlier deferral of item 5.

- Add slides 26–28 after the RealNVP demo and before the NF outlook (now 29):
  Transformer AR flow architecture, Training/Sampling, and guided image samples.
  The extensions map to source frames 17, 10 and 12 respectively. Each has one
  reveal; total coverage is now 34 logical slides / 80 reveal states.
- Follow Zhai et al., arXiv:2412.06329v3: patchwise affine transformations with
  strict prefix conditioning, positive componentwise scales, unchanged first
  patch, alternating order, parallel evaluation within a block and sequential
  inversion. The Transformer predicts affine parameters and need not be invertible.
- Show Gaussian augmentation, exact MLE on the noisy density and the unguided
  sampler with a log-density-gradient denoising step. Notes explain Tweedie's
  posterior-mean interpretation and distinguish uniform dequantization for
  likelihood benchmarks. The results slide explicitly distinguishes the flow
  density from the output distribution after guidance and denoising.
- Copy Figures 2 and 3 unmodified from the paper; record their original URLs,
  CC BY 4.0 license and SHA-256 in `public/figs/sources.json`. All three slides
  carry a visible canonical arXiv citation; no runtime image downloads are used.
- Revise Summary holistically, retaining six static bullets. Shorter CoV,
  RealNVP and LVM wording leaves space for the TarFlow takeaway without changing
  fonts. All other 30 pre-existing Markdown slide blocks are byte-identical to
  the baseline, including the approved Linear NF, AR and RealNVP content.
- Close item 5 of course-refresh using TarFlow, the example selected by the new
  request. The original “TarFlow / STARFlow” suggestion does not leave a separate
  mandatory STARFlow task. Independently verify items 1–4 and 6 against the current
  slides. Item 7 is closed by retaining the author's decision not to change timing.
  Update the L2 section and every repeated status in the report; preserve the
  historical Beamer diagnosis and citation statistics.

Source/interface checks:

- Independent notation/content, Summary and refresh-status reviews passed for the
  addition. Both general AR formulas remain in the unchanged demo; its unit-scale
  example is still explicitly qualified. RealNVP remains unchanged.
- L2 Slidev → accepted L3 Slidev: CoV, NF, Structured Factors, AR, coupling and
  LVM/MLE interfaces agree. TarFlow is an added example and need not be reproduced
  in the short L3 recap. No successor source changes were required.
- The unchanged incoming recap was also checked. One inherited issue outside
  course-refresh remains: L2's Objective on slide 2 describes sampling/evaluation
  using the unknown data distribution, whereas the accepted L1 slide 30 introduces
  a learned distribution first (`lecture1/migration.md`, terminology review).
  This addition does not alter that previously existing recap wording or claim a
  completely clean full-lecture audit.
- Sections and root README hierarchy are unchanged. The Slidev catalog links to
  the current source, journal and both PDFs; demo references remain 10 / 21 / 25.

Validation:

- Use a separate temporary checkout with its own cloned `node_modules`, retaining
  Node 24.19.0 and the installed lockfile. Build/export/dev run sequentially there,
  without interrupting the existing course server or changing shared generated
  files in the author's working installation.
- `finalize 2` passed source/frame/map/citation/asset checks, 87 shared macros,
  all 11 existing tests, production build and both PDF exports.
- `render-qa.py 2` rendered all 34 handout pages and 80 reveal pages. All pages
  were reviewed as contact sheets; handout pages 18, 26–28 and 34 were inspected
  at 1280 × 720. The TarFlow steps hide future material, sources have clearance,
  and the handout includes the whole algorithm and both original figures.
- After export, `inspect.mjs 2` passed all 34 slides / 80 states: stable geometry,
  forward/backward reveals, content/source boundaries, math and image checks,
  with no JavaScript errors or failed responses. Separate navigation checks
  confirmed returns from both neighbors of slides 26–28 at the expected click.
- Compare L1 slide 36 with L2 slide 27 in both PDF and browser at 1280 × 720:
  recurring density/vector/parameter notation and heading/body styles agree.
  Browser computed styles match (Arial 24 px body, 37 px headings, KaTeX 24.96 px).
  The first cold browser capture showed transient unstyled navigation tooltips;
  a fresh capture after initial style generation is clean.
- The shared theme, macros, fonts, demo components and numerical code are unchanged;
  the prior dedicated demo-control and annotation evidence remains applicable.
  Physical stylus, projector and tablet synchronization were not rechecked.
- Before copying the reviewed PDFs back, verify byte equality of the exported
  source/map and all theme, component, numerical and asset inputs. Both final PDFs
  are newer than the final source edit. Final QA is under ignored
  `output/qa/lecture2/tarflow-final/`; no Beamer or merged artifacts were changed.

Final SHA-256:

- `slides.md`: `5da9d43b3c81f59831a45aa3a58add5e42e6348f0be75e770ae58a8c6dd56d96`.
- `Lecture2.pdf`: `edf80e9a4921a0ab9f2b892dde3ae0733944f1012e5586c8f97a1aba275667d5`.
- `Lecture2-handout.pdf`: `737dcc6a04c9e18f9f2b85ef64a0676852edfa27200ff373ce39cf1dbf2424b6`.

## TarFlow: emphasize autoregression (2026-09-14)

Baseline `slides.md` SHA-256:
`5da9d43b3c81f59831a45aa3a58add5e42e6348f0be75e770ae58a8c6dd56d96`.
The author's follow-up supersedes the initial TarFlow order and teaching scope.

- Slide 26 now introduces the method through the familiar Gaussian AR identities:
  scalar coordinates become image patches, affine parameters depend on the strict
  prefix, density evaluation is parallel within a block, and sampling is sequential.
  The two reveals add sampling and the triangular-Jacobian/invertibility explanation.
- Slide 27 follows with the causal Transformer that predicts these shifts and
  scales; slide 28 retains the paper's examples. Remove noise augmentation and
  Tweedie from the method and visible teaching text. The results citation identifies
  the full published generation setup; notes preserve its provenance without
  introducing the later-lecture techniques. Generic flow training is already taught.
- Reveal counts are 2 / 1 / 1; update the map and current coverage to 34 slides /
  81 states. The other 31 slide blocks, Summary, recap interfaces and section
  hierarchy are byte-identical to the baseline. No README or successor edit is needed;
  the inherited incoming-recap issue recorded above remains outside this follow-up.
- Record the author's general narrative preference in course-wide `MIGRATION.md`
  §1. Update the closed TarFlow item and repeated counts in course-refresh; all L2
  items remain closed, including the author's existing decision to retain timing.

Validation:

- Independent source review passed: both AR directions, positive componentwise
  scales, unchanged first patch, strict-prefix conditioning and the architecture
  agree with the paper. The revised sequence fits the lecture's AR topic.
- In the same isolated installation, `finalize 2` passed source/map/citation/asset
  checks, all 11 existing tests, production build and both PDF exports.
- Render all 34 handout pages and 81 reveal pages. Visually inspect all three
  changed handout pages and seven reveal pages at 1280 × 720: layout, sources and
  reveal boundaries are clean. Full-page pixel comparison finds the other 31
  handout pages and 74 reveal pages identical to the reviewed baseline, without
  masking; reuse their prior visual evidence.
- Post-export `inspect.mjs 2` passed slides 25–29, including all seven TarFlow
  states: stable geometry, forward/backward navigation, math and content bounds.
  Separate checks passed returns from both neighbors of slides 26–28 with no errors.
- No shared style, fonts, macros, demo or dependency changes; the previous Lecture 1
  comparison and device/demo evidence remain applicable. Verify all 39 source/map,
  asset, component, theme and package inputs before copying the reviewed PDFs back.
  Both PDFs are newer than the source edit. Evidence is in ignored
  `output/qa/lecture2/tarflow-ar-final/`; the baseline is in `tarflow-ar-before/`.

Final SHA-256:

- `slides.md`: `88a0cd93a5d515429b0c638d9dbc90ce2cf0e52f85a05ea9ede7fa1dab3e9321`.
- `Lecture2.pdf`: `1cf463f6e5552a537596f95d6ae04294374e2cbccdce690fd50d8ecea5c92dcf`.
- `Lecture2-handout.pdf`: `3987c57d44cad7c7c0d9a71cf26b757371627cc3452c3686b8ac3dbfcc676880`.


## Dequantization before Bayesian inference (2026-09-22)

The author's new request adds one or two slides based on Supplementary and recent
TarFlow explanations, while retaining a substantive HW1 theory problem. This
explicitly supersedes the 2026-09-14 exclusion of all noise discussion from L2;
the autoregressive explanation of TarFlow remains unchanged.

Baseline `slides.md` SHA-256:
`88a0cd93a5d515429b0c638d9dbc90ce2cf0e52f85a05ea9ede7fa1dab3e9321`.

- Add exactly two slides: 26, “Dequantization of Images”, after the RealNVP demo;
  29, “Dequantization and Noise Augmentation”, between TarFlow architecture and
  examples. Each has two reveals. Update the map to 36 slides / 87 states.
- Adapt the author's Supplementary bin integral and uniform Jensen bound without
  posterior, ELBO or variational dequantization. Distinguish discrete mass P from
  continuous density p; work in integer coordinates on the first slide.
- Distinguish TarFlow's separately trained likelihood and generation settings:
  uniform noise within one pixel bin versus wider Gaussian augmentation followed
  by denoising. Explain the noisy-density interpretation without a Tweedie, score,
  guidance or optimal-denoiser derivation. Check scale and noise values against
  Zhai et al., arXiv:2412.06329v3, §§2.4–2.5, 3.1 and Appendix C.
- Theis et al. §3.1 is the visible foundational citation. The research check also
  covered Apple's June 2025 author material, indexed portions of Su Jianlin's
  January 17, 2025 TarFlow post, and the UvA image-flow tutorial. Detailed sources
  and teaching decisions are kept with HW-04 in DGM-homeworks:
  `reading-notes/theory-review/HW-04/lecture2-dequantization-notes.md`.
- Qualify exact density as continuous in “What Comes Next?” and Summary; add the
  uniform-dequantization takeaway to Summary. Update the samples' speaker notes.
  Existing L3 recap still states the continuous CoV/likelihood interface correctly;
  no recap or section-hierarchy change is needed. Root/Slidev README artifact links
  remain valid. RealNVP, demo indices 10 / 21 / 25, and shared styles are unchanged.
- Revise the HW-04 proposal to require an explicit family with fixed correct bin
  masses and an arbitrarily large dequantization gap, followed by scale correction
  and a bits/dim check. The bound itself is now a supplied lemma. The 0.6 + 0.4
  rubric totals the same provisional 1 point. Preserve its frozen baseline and
  separate instructor solution; do not transfer to the notebook or close HW-04.

Validation of this addition (not a full new audit of the lecture):

- `finalize 2` passed source/frame/map/citation/asset checks, 87 shared macros,
  all 14 current tests, production build and both exports, with Node 24.19.0.
  Dev, build and export were run sequentially in the shared installation.
- `render-qa.py 2` checked and rendered 36 handout pages and 87 reveal pages.
  All pages were reviewed on contact sheets. Slides 26, 29, 31 and 36 were inspected
  at 1280 × 720; the three new noise-slide states were also inspected at full size.
  Sources have clearance, future material is hidden, and the handout is complete.
- An alignment adjustment on slide 29 was followed by another complete export
  and render. Nine contact sheets were byte-identical to the already reviewed
  version; only the sheets containing slide 29 changed, and both were reviewed
  again. Both final PDFs are newer than the final slide-source edit.
- Browser checks through CUA used the DOM geometry, math, image and boundary checks
  from `inspect.mjs` for changed slides 26, 29, 31 and 36 (10 states). Forward and
  backward reveals preserved geometry and restored visibility. After the margin
  adjustment, all three states of slide 29 and returns from both neighbors were
  rechecked. No content overflow or math-rendering errors were found. The full
  external inspector was not rerun; unchanged demo/annotation mechanisms retain
  their earlier evidence. The viewer receives navigation from other open presenter
  sessions, so the two-page PDF excerpt is the stable review artifact.
- Compare the current L1 handout slide 27 (“Course Tricks III”) with L2 slide 26
  at 1280 × 720: heading/body style, vectors, density and expectation typography
  agree. Shared theme, fonts, macros, demo code, dependencies and export code were
  not changed; prior browser-style/device evidence applies to those mechanisms.
  Physical tablet/projector behavior was not retested.
- HW-04 HTML renders its student/instructor mathematics without errors or page
  overflow. The notebook hash and immutable baseline were checked unchanged by
  this addition. Historical Beamer/Supplementary and merged artifacts were untouched.

Final SHA-256:

- `slides.md`: `edd36c14fd2e1cfb28ef6b16bd1bdbaafd66c1f7b4fb25957453d55fc12dcb91`.
- `Lecture2.pdf`: `83f188725b44be39223465828830220c7aec9a95f06e88bb3cd47740e1a26925`.
- `Lecture2-handout.pdf`: `1b4593a6ae03d58f28b9495b688d5fe4710eb1618807286b20f581591589fdc2`.

## 2026-09-22 — Simplify demo labels (slides 10 and 21)

- At the author's request, remove the unexplained area symbols from the Jacobian
  demo, retaining the coordinate labels.
- Replace the AR demo's dependency-structure takeaway and Jacobian note with two
  explicit statements: sampling is slow because coordinates are computed
  sequentially; density evaluation is fast because they are computed in parallel.
- `npm run check -- 2` and `git diff --check` passed. Slide/reveal counts and
  mathematical transformations are unchanged. No shared styles were changed.
- Browser visual verification could not be completed: the existing live viewer
  repeatedly follows another session's navigation. The active dev server was
  preserved; build/export were not run alongside it. Both PDFs still predate this
  follow-up and need regeneration when the live session is available for export.

## 2026-09-22 — Clarify the TarFlow teaching bridge (slide 27)

- At the author's request, reframe the slide as a combination of two familiar
  ideas: Gaussian AR NF's dependence on the strict prefix, and RealNVP's
  elementwise affine transformation of a whole vector block.
- Keep the title, sourceFrame and two clicks. Show Gaussian AR NF initially,
  RealNVP on click 1, and their patchwise combination on click 2. Keep one
  annotated sampling equation; retain the inverse equation in speaker notes.
- Explicitly distinguish sequential sampling across patches from parallel
  computation within each patch, and retain parallel density evaluation,
  triangular Jacobian, positive scales and unchanged first patch.
- Check the construction against Zhai et al., arXiv:2412.06329v3, section 2.2.
  Speaker notes distinguish the teaching analogy from an actual stack of RealNVP
  coupling layers. This rewording changes no Summary/Recap interface or sections.
- Source/map/citation/macro checks and `git diff --check` pass. Browser checks on
  the existing localhost:3032 server cover all three states forward and backward,
  identical content geometry, correct visibility, no KaTeX errors and return from
  slide 28. Review the initial and final states visually at 1280 x 720; content
  ends around y=503, above the source at y=676. Shared theme/macros are unchanged.
- The pre-existing active dev server is preserved. Build/export are not run in
  parallel with it; both PDFs still need regeneration for this and the preceding
  demo-label follow-up. PDF/device checks are not claimed for this change.

## 2026-09-22 — Consolidate dequantization after TarFlow architecture

- At the author's request, move “Dequantization of Images” from old slide 26
  to the position of old slide 29, replacing “Dequantization and Noise
  Augmentation”. The sequence is now RealNVP demo (25), TarFlow construction
  (26), architecture (27), dequantization (28), generation examples (29).
- Preserve the full pixel-bin integral, uniform-noise construction, Jensen bound,
  citation and two reveals. Move the optional distinction between likelihood
  dequantization and Gaussian augmentation/denoising to the samples' speaker
  notes, removing the stale reference to a preceding noise-augmentation slide.
- Update the map: 35 slides / 84 states. Section hierarchy, artifact catalog links,
  Summary's uniform-dequantization takeaway and L3 recap remain consistent;
  no changes to those interfaces are needed.
- Source/frame/map/citation/macro checks and `git diff --check` pass. On the
  existing browser server, traverse slide 28 at clicks 0, 1 and 2: expected
  visibility, identical geometry, no KaTeX errors and clearance above the source.
  Inspect the final slide visually in the current browser viewport. The moved
  slide's layout and shared theme are unchanged.
- Preserve the pre-existing active dev server; both PDFs still await regeneration
  for the accumulated follow-ups. No fresh PDF or physical-device QA is claimed.

## 2026-09-22 — Rename the blockwise-flow subsection

- Author-approved exact title: “Blockwise Flows (RealNVP / TarFlow)”, with one
  slash. Replace “Coupling Layer (RealNVP)” in all seven Outline instances,
  the automatic transition ID/map, and Lecture 2's Materials entry in README.
- Preserve Beamer's historical hierarchy. Declare its Slidev rename explicitly
  in the JSON-valued `sectionTitleOverrides` headmatter field. The source checker
  validates override keys against Beamer sections and checks the approved titles
  against Slidev and README; lectures without overrides retain the original rule.
- All 14 lecture source checks and the three existing course-tool tests pass;
  `git diff --check` passes. Visually verify the exact title on browser slide 22.
  No slide count, reveals, shared style, formulas or recap/summary changes.
- PDFs still await regeneration with the other follow-ups while the existing dev
  server remains active.

## 2026-09-22 — Final exports before committing

- Resolve the stale-PDF limitation recorded above: build and export in a temporary
  copy of the complete Slidev project with an independent copy of node_modules,
  preserving the running original dev server and its generated client files.
  Verify the lecture source, map and edited components match before publishing
  both exported PDFs back to the repository.
- Node 24.19.0: source checks, all 14 existing tests and production build pass.
  Export requires a local port/browser outside the filesystem sandbox and passes
  there. Both exports use the unchanged course pipeline.
- `render-qa.py 2` validates and renders all 35 handout / 84 reveal pages. Review
  all pages on contact sheets; inspect handout slides 10, 21, 22, 26, 28 and 35
  at 1280 x 720. No clipping, overlapping sources, missing reveals or raw math
  is visible. The slide 21 takeaway clears the source rule.
- The earlier browser checks cover the final TarFlow, dequantization and Outline
  edits. No additional interactive-demo behavior or physical-device validation
  is claimed by this export-only finalization. Shared rendering styles and
  mathematical transformations remain unchanged.

Final SHA-256:

- `slides.md`: `3a076c6b5ca110f12c24f9259407b86fd31e3ae1a5cb0b5e2024b34d68f41738`.
- `Lecture2.pdf`: `6e86256d2e13b90691c19e981abd12f91c88235adcd3435dfec35fc6ce579de1`.
- `Lecture2-handout.pdf`: `51cc295205928a93ea530989d88231dc2178a375517c3d3e04b430938f515aba`.

## 2026-09-26 — Composition wrapping, TarFlow spacing and Summary order

- Keep the entire inline composition on one line in slide 12's theorem using a
  local nowrap span. The request named slide 2; the observed split composition
  is on slide 12, while slide 2 is the unchanged opening recap.
- Add 24 px below slide 26's upper pair of blocks, separating the TarFlow block
  without changing fonts, shared styles, formulas or its two reveals.
- Put RealNVP before TarFlow in Summary, matching the teaching sequence. Preserve
  all seven takeaway texts and the static presentation.
- Source/map/citation/macro checks, all 14 existing tests and the production build
  pass with Node 24.19.0. Build, export and dev run sequentially in an isolated
  temporary installation. Both PDFs are regenerated: 35 handout / 84 reveal pages.
- Render all PDF pages and inspect all changed page appearances at 1280 x 720.
  The other 32 handout pages and 76 reveal pages are pixel-identical to the reviewed
  baseline; their prior evidence remains applicable. The corrected composition
  fits, TarFlow has clearance, and Summary ordering is consistent.
- Browser inspection passes all eight states of slides 12, 26 and 35: stable
  geometry, forward/backward reveals, no overflow or math errors. Verify returns
  from neighboring slides, one-line composition geometry and the 24 px margin.
  A fresh slide 12 capture after initial style generation is clean.
- Independently review the three source changes and verify 68 build inputs match
  the isolated copy before copying the PDFs back. Shared style, notation and demo
  behavior are unchanged; their previous Lecture 1 comparison remains applicable.
  Evidence is in ignored `output/qa/lecture2/layout-20260926-final/`. This is a
  scoped layout check, not a new full content or physical-device audit.

Final SHA-256:

- `slides.md`: `3e4f906705019b19059d236935b0119064e448745c1fd631a3221f83dbe81f84`.
- `Lecture2.pdf`: `eb8a2d1dbfc13fee97645fe010aa1149cd145cf1931f68b9766750d82d8a99d5`.
- `Lecture2-handout.pdf`: `1903c9c0fae313dcdd99c3a1c5c04551062bdca93c371e420f6cbd2ee3657c15`.
