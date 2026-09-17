# Lecture 13 — migration record

Status: conversion and local finalization completed on 2026-09-16; source-delimiter typography was corrected and revalidated on 2026-09-17. The final cross-Slidev Lecture 12 comparison and catalog integration are recorded below.

## Baseline

- Source: `lectures/lecture13/Lecture13.tex`, SHA-256 `eebc0009d47bf9ea5ccd3484ae30535eb1c996de190af8ad52e6beeb2ee902e4`.
- Source PDF: SHA-256 `f04aa0081ab12bac02710018ea665fad5bde1d0177dd98f26587eda68a85e68b`; its latexmk record matches the source MD5 `c3e00af76fbffe193383893c80024d00`.
- Thirty explicit frames and four automatic section/subsection Outline transitions.
- Keep the source English text, formulas, semantic colors, citations, figures, algorithm blocks and the four static Summary bullets. No new demos or editorial corrections.

## Layout plan, recorded before authoring

- Frame 2: Gaussian conditional probability path, then its straight-path figure on a static continuation.
- Frame 3: score/VE recap, then VP recap and trajectory figure on a static continuation.
- Frame 12: conditioned reverse distribution and unmasked case, then the masked-case explanation; the original second reveal becomes a slide transition.
- Frame 20: whole Sampling block, then its note and conditional masking probability on a static continuation.
- Frame 29: trilemma figure, then the complete rule-of-thumb comparison on a static continuation.
- Preserve Lecture 1 typography and shared classes; adjust formula line breaks and grid geometry instead of shrinking fonts.

## Inherited source observations

- The discrete posterior uses `\bQ_t` without a transpose under the column-stochastic convention (frames 7 and 28); preserved as in Lecture 12.
- The uniform/absorbing table labels the absorbing limiting transition as `\Cat(\be_m)` (frame 6); preserved.
- Course-overview autoregression mixes product index `i` and conditional index `j` (frame 23); preserved.
- Lecture 14 is a draft and explicitly recaps Lecture 12; its recap is not silently rewritten.

## Coverage and source audit

- 30 explicit Beamer frames, four automatic Outline transitions, five documented continuations: **39 logical slides, 12 clicks, 51 presentation states**. The source's 13 reveal boundaries are retained as 12 clicks plus the frame-12 continuation boundary. No empty clicks, new teaching material, or demos.
- Frame-by-frame comparison preserves formulas, derivation steps, semantic colors, English wording, citations, the two complete Training and two complete Sampling blocks, and all four static Summary bullets. Outline slides contain agenda only. The final Summary still covers absorbing diffusion, continuous mask rates, MDLM sampling, and the course-wide trilemma; its mention of distilled diffusion is an inherited frontier remark, not newly added teaching content.
- All 18 source citation occurrences remain attached to their original frame groups, including citations on continuation slides. All four source figures are exact copies. Two further image uses are the shared taxonomy diagrams, with absorbing diffusion highlighted on logical slide 14 and the neutral taxonomy on slide 30.
- Math uses the shared adapter (87 macros). Strict KaTeX rendering with `throwOnError: true, strict: 'error'` passes all **148 expressions: 54 display and 94 inline**. No local font-size or glyph substitutions, local macro definitions, or global style changes.
- Fixed the preserved draft's HTML/Markdown boundaries in the four algorithm blocks before export: inline formulas inside `<li>` were initially emitted as raw TeX. Separate blank lines now activate Markdown and preserve the complete ordered algorithms at the shared font size.
- Incoming recap source comparison: Lecture 13 frames 2–8 match the relevant Lecture 12 body frames 12–13, 18, 20–21, 23–24, 26–28, 31, 33–37, with the original recap's concise wording and static reveals. `linear_paths.png` and `trajectories.png` are byte-identical to the corresponding Lecture 12 figures. The additional final Slidev-to-Slidev rendered comparison is recorded below.
- Outgoing recap: Lecture 14's current draft explicitly recaps Lecture 12. Its intentional nonadjacent recap is preserved; no Lecture 13 body change has been propagated into that draft.
- README Materials hierarchy matches: Discrete Diffusion → Absorbing Diffusion / Continuous Time Formulation; then Course Overview. The existing commented schedule wrapper is preserved. Catalog publication is handed to the coordinator.

Further inherited mathematical qualifications were kept visible rather than silently edited: the finite-ε Gaussian path and Dirac endpoint statements in the recap require a limiting interpretation; the unweighted masked-LM recap objective and the statement that unmasked-token ELBO terms are constant rely on the source's intended absorbing-model parameterization. No source-level editorial correction is included in this format migration.

## Validation on the delivered revision

All checks used the project's pinned Node/Slidev dependencies in a physical copy at `/private/tmp/dgm-l13-resume-20260916/lectures-slidev`, with its own installed client package. Dev, build and export ran sequentially there; parallel migrations did not share generated Slidev client files.

- `node tools/run.mjs finalize 13`: source coverage/citations/assets/macros pass, all **13 existing tests pass**, production web build succeeds, both PDF exports have the map-derived page counts.
- `python tools/render-qa.py 13`: **39 handout pages and 51 reveal pages** render successfully, no raw math delimiters. Every page of both PDFs was visually reviewed on contact sheets. Handout pages **2, 4, 5, 7–10, 15, 16, 18–21, 24–26, 31, 34, 35, 38, 39** were additionally reviewed at 1280 × 720, together with reveal-PDF pages **16, 17, 19, 25, 31, 35**. No clipping, overlap, misplaced footnote, or exposed future content was found. All 39 handout pages are pixel-identical to their corresponding final states in the reveal PDF.
- `node tools/inspect.mjs 13` after final export passes **39 slides / 51 states**: meaningful forward reveals, identical geometry across clicks, matching backward states, no raw TeX or KaTeX errors, loaded images and safe content/source boundaries.
- A temporary extension of that inspector additionally checks actual keyboard departure and return on all 39 slides, then revisits all 51 states forward/backward. Every returned state matches. With nonlocal HTTP(S) requests blocked, **zero external requests, failed responses, or page errors** were observed.
- Synthetic annotation integration on logical slide 15 passes: draw, Undo/Redo, Save, Save & clear, Restore, reveal progression, departure and return, identical archived SVG after return, and final cleanup. No synthetic marks or toolbar appear in the final PDFs.
- Actual rendered-style comparison at 1280 × 720: Lecture 1 logical/handout pages **27** (LOTUS/CoV) and **35** (KL/MLE) versus Lecture 13 pages **9** (posterior/ELBO) and **31** (AR/NF/VAE), in both browser and PDF. Vector glyphs, θ subscripts, expectation/KL operators, derivatives, fractions, heading weights, body text, margins and block spacing agree with the shared Lecture 1 theme. Lecture 13 measured h1 Arial **37 px / 650**, h2 Arial **24 px / 650**, body Arial **24 px**, KaTeX **24.96 px**. The paragraph's inherited 24 px line-height comes from Slidev's shared base layout and is not a lecture-specific shrink.
- Reference captures were supplied by the coordinator in `output/qa/resume-integration/reference-captures/`. Lecture 1 source SHA-256: `e264d0b2af0ecaebd7be0a1fedf7549d28223afcd1f20b618d6c9052183c728e`; handout SHA-256: `623b1223a84cede6d012ed83020fce4611b1f7f0419a521cb7717b926980407f`.

QA reports and renders are scratch evidence under the isolated copy's `output/qa/lecture13/`; they are not course artifacts. Real stylus hardware, palm rejection, projector and tablet-to-screen networking were not tested by these browser scenarios.

## Delivered artifact hashes (SHA-256)

| File | SHA-256 |
|---|---|
| `slides.md` | `246e2f3f1ffefceeb77404b5bfa4fcaeb42f7501387c280421231da191c43b4a` |
| `slide-map.json` | `30d3e795937fecae349bdb65e4441ea8e7afef170feec4b1c16b36b3e4c8a00c` |
| `Lecture13.pdf` | `a1fc15ac46f55f40e44a1b8f6e8a91e7b1e0bdae89432216891bb8e7a10b4e7e` |
| `Lecture13-handout.pdf` | `53605bb63206e1264731b0a3600020770aa2d3497b652b914c3681bb64c0e784` |

| Copied figure | SHA-256 |
|---|---|
| `linear_paths.png` | `0d35e3804150c4a9884eeee6b393eae2f639939d82783b8bc091a1dbdcc7e3f0` |
| `trajectories.png` | `c39f978c7226b50a25ec086ced238ce4f3ca472bfed3672ec52a18d30789ce13` |
| `abs_diff.png` | `40a1404fc8ceb04c369e8f8e8aaa59caeb87770ad06342b49d876774ab8e25f4` |
| `trilemma.png` | `403c0b39d0c5e20b86dbb7b04142dfe3dfe62a19353ebe3515a0c13d337ebf5c` |


## Final source-delimiter correction — 2026-09-17

The coordinator's cross-lecture review found that the initial draft had translated 60 plain source `|` conditionals into `\mid`, introducing extra relation spacing. Those 60 conditionals were restored to their exact Beamer delimiter choice; the one actual source `\mid` in frame 20's masking probability is retained. No equations, reveals, frame mapping or shared styles changed.

Strict rendering again passes all 148 math expressions, and a fresh `finalize 13` passes the 13 tests, build and both exports. All 90 PDF pages were raster-compared with the fully reviewed 2026-09-16 exports: 42 remain pixel-identical; 19 handout pages and 29 reveal pages changed only with the affected typesetting. Every changed handout page was reviewed at 1280 × 720 (**2, 4, 5, 7, 9, 10, 15, 16, 18–21, 23–26, 31, 33, 36**), plus all ten changed intermediate reveal pages (**16, 17, 19, 22, 25, 30–32, 34, 35**). The remaining 19 changed reveal pages are pixel-identical to their reviewed handout counterparts; all 39 final-state comparisons pass. No clipping, collisions, raw math or hidden-content leaks were introduced.

The earlier 90-page review used source hash `0ca7837c9e0210d4356b7320fb9b2e0f6d33ece0c1fb5d1dbeedf643b0e42127`, reveal-PDF hash `7af2982a25681419697af87e813229818a1c31ca4c844495b7af7da4784fadb8`, and handout hash `47205402bc836021b7733f1685b84dacabe4e4f26a37e9c1e311612a5fe034cb`. The artifact table above identifies the corrected delivered revision.

The complete extended browser inspection was repeated on the corrected 2026-09-17 revision: all 39 slides / 51 states pass forward, backward and post-return geometry/visibility checks, with zero page errors, failed responses or external requests. Synthetic annotation draw, Undo/Redo, save, clear, restore and return checks also pass and the marks were cleaned up. The final browser/PDF views of Lecture 13 pages 9 and 31 were compared again with the unchanged Lecture 1 page 27/35 references after restoring the source delimiters.

## Final course integration — 2026-09-17

The incoming comparison uses the completed Slidev Lecture 12: source SHA-256 `3001163a798dbb23ab03722b50c4fb7e1b70cbd73df0369d2c613812a245ccbd`, handout SHA-256 `8b54801122c95cc1ed807704b368642f7c88036fe911da785a96cdebbbf14247`. The full recap source comparison found no new mathematical/content drift. `linear_paths.png` and `trajectories.png` remain byte-identical to Lecture 12.

The coordinator visually compared final handout pages **L12 22 / 35 / 48 / 52 / 58 ↔ L13 2 / 4–5 / 8 / 9 / 10**, and final browser captures **L12 35 / 52 ↔ L13 5 / 9**, at 1280×720. Gaussian paths, VE/VP velocities, the transition table, posterior, ELBO and sequence loss retain the common glyphs, sizes, weights, conditioning spacing, colors and source-footer clearance. The corrected plain `|` choice now matches the repeated Lecture 12 expressions. Additional independent PDF review of pages 20 and 34 found clean algorithms and course-overview notation; the source's explicit `\tfrac` on page 34 remains intentional.

The explicitly nonadjacent Lecture 12 recap in draft Lecture 14 was preserved. Catalog and root README integration are complete. Final source/map/assets checks, all 148 strict KaTeX expressions, PDF page counts and recorded hashes pass. Final browser reports/screenshots are preserved in ignored `output/qa/lecture13/`; comparison references are in `output/qa/resume-integration/`. The temporary server was stopped.
