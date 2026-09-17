# Lecture 12 — Slidev migration

Status: lecture migration and final artifact QA completed on 2026-09-17. Draft source reconstruction began on 2026-09-16. Final cross-lecture integration and catalog updates were completed on the same date; see the integration record below.

## Source and scope

- Baseline: `lectures/lecture12/Lecture12.tex`, SHA-256 `04a5eaefedf5b3fee3ac67f0802c0a83d24dfe65e2e6158d65e6cb5a8525ef5c`. Existing Beamer PDF is the same source edition (source MD5 `7242744baf843db05f75879ebd653abd` matches its build database).
- Pure format migration. Beamer and `lectures/merged/` remain untouched. Lecture text remains English; shared Lecture 1 theme, notation adapter, fonts, geometry and drawing toolbar are reused.
- Final map: 38 original frames, 6 automatic section transitions, 15 continuations: 59 logical slides / 102 reveal states. Explicit integer clicks and string sourceFrame are present on every slide.
- Local figures are lossless byte copies of all 12 source PNGs. Discrete-diffusion taxonomy uses the shared component and TikZ export.

## Layout and reveal decisions

Continuations preserve order and every original formula, claim, figure and citation. No new teaching content or demos are introduced. Static Recap frames remain static; page boundaries carry their continuation without adding click animations.

- Frame 2: FM objective and dynamics figure; then unknown-field problem and conditional continuity equations.
- Frame 3: CFM objective and theorem statement; then intact Training and Sampling blocks.
- Frame 4: conditional-field theorem and FM; then CFM and its theorem statement.
- Frame 5: figure and questions; then Gaussian conditional path.
- Frame 6: Gaussian conditional path and boxed vector field; then latent-variable choice and boundary constraints.
- Frame 7: Gaussian path and straight-path formulas; then the conical-paths figure.
- Frame 8: vector field and complete objective equality; then conditional/marginal-path remarks and both figures.
- Frame 12: objective and conditioning choice; then boundary constraints, with the implication revealed on one click. Original preceding pause becomes the page boundary.
- Frame 13: endpoint constraints and Gaussian conditional path; then straight paths, revealed endpoint implication and figure. Original preceding pause becomes the page boundary.
- Frame 15: path and vector field, retaining its simplification reveal; then the complete objective equality and final remarks. The intervening pause becomes the page boundary.
- Frame 16: paired-task remarks and whole Training block; then whole Sampling block. Training/Sampling pause becomes the page boundary.
- Frames 18–19: dense SDE/flow probability-path blocks and reverse-time link are spread across their respective continuations; original pause boundaries are retained as page boundaries, with no empty click states.
- Frame 32: complete ELBO and its explanation; then the complete categorical posterior derivation.
- Frame 37: sequence reverse-model factorization and complete KL equality; then the final masked-LM objective.

Unsupported multline environments are equivalent aligned rows, preserving all terms. Existing violet semantic color uses the course's `#8854c0`. Minor prose punctuation `Flexible infilling:.` is normalized to `Flexible infilling:`. Original formulas are never substituted with images.

## Preserved source observations

These are inherited editorial/mathematical choices, not introduced migration defects, and were not silently corrected:

- The Recap says the FM and CFM objectives have the same optimal value. Lecture 11's corresponding theorem statement makes the same claim, while its minimizer theorem is the precise optimization equivalence.
- Two-sided conditioning writes finite epsilon Gaussian paths while stating exact Dirac endpoint constraints and omitting noise from the interpolation sample. Those exact source assertions are retained.
- The column-stochastic transition convention is explicit, while the posterior numerator is written `Q_t x_t`, without transpose, in frames 33 and 36.
- The absorbing limiting transition entry in the comparison table is `Cat(e_m)` rather than a transition matrix.
- The final masked-LM loss is stated without the additional weighting/masking/parameterization qualifications needed for a general ELBO equivalence.

## Verification

### Source and content

- `node tools/run.mjs check 12` passed: all 38 frames, six section transitions, 59 slides, 102 states, all 87 shared macros, 33 source citation occurrences and 13 image/component uses (12 local figures plus taxonomy).
- An additional per-frame provenance check grouped each primary frame with its continuations and verified all 33 original citation occurrences and all 12 original figure occurrences in the matching frame group. All 12 copied PNGs match source bytes.
- Direct strict KaTeX rendering (`throwOnError: true`, `strict: 'error'`) passed for all 174 expressions: 73 display and 101 inline. This supplements the browser inspector's raw-delimiter/error-node checks.
- Original 51 reveal directives are represented by 43 explicit clicks and eight page boundaries at original pauses. Seven additional boundaries split static Recap frames. Reveal groups preserve whole Training/Sampling blocks, and both inline implications preserve complete cases and delimiters.
- Notation, formula terms, ordered derivations, sources, algorithms and six static Summary takeaways were reviewed against the Beamer source. All six sections match the root Materials schedule. Summary uses the same standard paragraph-inside-list markup as Lecture 10; its 24 px text and inherited paragraph leading are unchanged, with no local font or scale override.
- The parent checked incoming Lecture 11 Slidev body against all nine Lecture 12 Recap frames and checked outgoing Lecture 12 against Lecture 13 and the specifically named Lecture 12 Recap in draft Lecture 14. No new content/notation drift was found. The inherited source observations above remain visible. Final neighboring PDF/browser comparison is recorded by the parent integration check.

### Build and PDFs

- `node tools/run.mjs finalize 12` passed on 2026-09-17: source check, all 13 existing tests, production web build, and both final PDF exports. Node 24.19.0 and the installed lockfile dependencies were used; browser export used local Yandex Chromium.
- `python tools/render-qa.py 12` passed with 59 handout and 102 reveal pages. Extracted text contains no raw math dollar delimiters.
- Visually inspected every page of both PDFs on all 14 contact sheets (five handout and nine reveal sheets), then 25 dense/representative handout pages at 1280 × 720: 4, 5, 6, 8, 10, 14, 16, 23, 24, 25, 26, 31, 35, 39, 44, 45, 48, 50, 51, 52, 53, 55, 56, 57, 59. Separately inspected intermediate reveal pages 22, 25, 26, 88 and 97 at the same size, including both masked implications.
- No clipping, overlap, footnote collision, exposed future content, or missing handout content was found. All 59 handout pages are pixel-identical at 1280 × 720 to their corresponding final reveal-PDF states; no unique intermediate content is replaced or lost.

### Browser and style

- After the exports, restarted the isolated dev server and ran the complete `inspect.mjs` checks with additional navigation/return, offline and annotation scenarios. All 59 logical slides / 102 states passed forward and backward visibility/geometry checks, nonempty clicks, image completion, slide/source bounds and raw-math checks. Every state was rechecked after leaving for the next slide and returning; the final static slide was checked by leaving to its predecessor and returning.
- Offline scenario blocked all HTTP(S) requests except localhost/127.0.0.1; the lecture made zero external requests. JavaScript errors and failed resources were both empty. Fonts are bundled and rendered successfully.
- On logical slide 21, synthetic ink, Undo/Redo, Save, Save & clear, Restore, navigation through its reveal and a neighboring slide, and unchanged SVG after return all passed. The synthetic drawing was cleared. The clean PDFs were generated before this scenario.
- Compared actual 1280 × 720 browser captures and PDF renders of Lecture 12 slide 6 with approved Lecture 1 slide 27 (expectations, vectors, theorem prose, headings), and Lecture 12 slide 53 with Lecture 1 slide 35 (KL, parameter subscripts, expectations and fractions). Common typography, semantic colors and geometry agree. The Lecture 1 reference captures were prepared from the current accepted source by the parent and visually inspected here.
- Browser computed styles on slides 6/53/59: Arial headings 37 px / weight 650 / line-height 42.18 px; block titles 24 px / weight 650 / line-height 28.8 px; ordinary body 24 px; ordinary KaTeX 24.96 px; source 12 px / line-height 15.6 px. Slide 21's inline reveal uses the existing shared `.math-chain` style (23 px base, 23.92 px KaTeX), also used in Lecture 1, with no local type-size override.
- Dev/build/export ran sequentially within a physical isolated copy of the project and node_modules at `/private/tmp/dgm-slidev-l12-resume-20260916`. Only Lecture 12 artifacts were published to the main source tree; shared infrastructure was not edited by this worker. The parent owns the already completed shared taxonomy regression and final catalog integration.
- Detailed contact sheets, full-size renders, final screenshots, browser report, final-state pixel comparison and typography measurements are in the isolated `output/qa/lecture12/`; the parent preserves relevant evidence under the main ignored QA directory. An initial UnoCSS warm-up race was handled by loading a neighboring slide before capture; no presentation CSS was altered to hide it.

Physical stylus, palm rejection, projector and multi-device presentation are outside browser verification and remain untested.


## Final artifact hashes (SHA-256)

- `slides.md`: `3001163a798dbb23ab03722b50c4fb7e1b70cbd73df0369d2c613812a245ccbd`
- `slide-map.json`: `ec335bc887c42cbf4f19a323d0bbaf3eadbc17302a82a6fb82334a16e29fda03`
- `Lecture12.pdf`: `b72e6b2bde0da598b4a0dc782ad17d0e88ab46f1b53ce9de6fb3039f6a6f7fd9`
- `Lecture12-handout.pdf`: `8b54801122c95cc1ed807704b368642f7c88036fe911da785a96cdebbbf14247`
- Baseline Beamer PDF: `11fa5dcbaf669307992ed36880f50757f5c7f722c7c5499bf0c0270186a12593`.

## Final course integration — 2026-09-17

The coordinator checked the final Slidev sources in both recap directions. Incoming Lecture 11 (`slides.md` SHA-256 `18b2fd6640df367a7af827ff31c160fab8c5e73e9edd9f6a5a0e8b58685fe52e`) matches Lecture 12's nine recap frame groups. The five common images match by SHA-256. Outgoing Lecture 13 preserves pair conditioning, VE/VP probability paths, discrete-state/time distinctions and advantages, transition matrices, the categorical posterior/ELBO and token-wise sequence model; its two shared images are byte-identical. The explicitly named Lecture 12 recap in draft Lecture 14 matches source frames 32–34. The inherited optimal-value, finite-noise endpoint, posterior-transpose and masked-LM qualifications remain documented source observations.

Actual final-render comparisons at 1280×720:

- Incoming PDF: **L11 21 / 28 / 31 / 34 ↔ L12 5 / 10 / 12 / 16**; browser: **L11 34 ↔ L12 16**.
- Outgoing PDF: **L12 22 / 35 / 48 / 52 / 58 ↔ L13 2 / 4–5 / 8 / 9 / 10**; browser: **L12 35 / 52 ↔ L13 5 / 9**.
- Draft Lecture 14 PDF: **L12 50 / 52 / 53 ↔ L14 2 / 3 / 4**; browser: **L12 53 ↔ L14 4**.

The shared typography, vector/parameter glyphs, probability conditioning, expectation/KL/entropy operators, fractions, matrices, colors and source-footer spacing agree. Differences in line wrapping and recap grouping follow the recorded source-preserving continuations. The Lecture 13 delimiter-spacing correction was verified in its final PDF/browser revision. PDF references are in ignored `output/qa/resume-integration/reference-captures/`; final browser screenshots/reports are preserved in `output/qa/lecture12/`, `lecture13/`, and `lecture14/`.

Catalog integration is complete for all 14 lectures, with Lecture 14 explicitly identified as a preserved draft. Final main-workspace source/map/assets checks, all 174 strict KaTeX expressions, both PDF page counts and the recorded artifact hashes pass. No source or PDF change was needed after the final worker export.
