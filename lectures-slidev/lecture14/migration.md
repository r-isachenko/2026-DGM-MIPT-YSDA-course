# Lecture 14 migration — preserved draft

Local migration and PDF review completed 2026-09-17, following work started on 2026-09-16. **The lecture remains the author's draft.** Migration preserves the current Beamer material and does not complete the curriculum or propagate its editorial choices to other lectures.

## Baseline and scope

- Source: `lectures/lecture14/Lecture14.tex`, SHA-256 `30c189af7dc95ab7f236d6aa8df5b1a216807254eabdea5d39f7edf3bed1b7fe`.
- Same-edition Beamer PDF: SHA-256 `5f34e6a8c6e18160d6c7ad89e78e0d4f19e26154aa69610ffa42a02a55aca918`, 49 overlay pages. The source MD5 `75f21d23c7beedc01a891e1a35bdbec9` matches its `fdb_latexmk` dependency record.
- The draft contains 19 frames, an explicit initial Outline and 2 automatic section Outlines. It has no taxonomy frame. All are represented, with no new educational material.
- Beamer sources/PDFs and `lectures/merged/` were not edited or rebuilt. Shared Slidev theme, macros, tools, and components were not changed by this lecture's migration. An isolated physical copy of the installed project was used for dev/build/export; these operations ran sequentially within that copy.

## Mapping, content, and reveals

The map has 25 logical slides and 50 states: 25 base states and 25 clicks. The source's 28 reveal directives are preserved through 25 in-slide clicks and 3 continuation boundaries. The additional static continuation of frame 2 accounts for the increase from 49 original overlay pages to 50 Slidev states.

| Source frame | Logical slides | Adaptation |
|---|---|---|
| 2 | 2–3 | Static ELBO, then static discrete posterior and both explanatory bullets; no new click added. |
| 7 | 9–10 | Goal and cutoff explanation, then ODE specification. The original first pause becomes a slide boundary; the concluding explanation retains a click. |
| 11 | 14–15 | Teacher ODE step and explanation, then CD loss and its full parameter explanation. The second pause becomes a boundary. |
| 12 | 16–17 | Whole Training block, then whole Sampling block. The first pause becomes a boundary; the multi-step note retains a click. |

All other frames preserve their original grouping and reveal order. Both section transitions retain agenda-only Outlines. The 5 original Summary bullets are static and cover the setup, CM/CD, LCM, DMD/DMD2, and the draft's comparison of methods.

The ELBO and DMD gradient use equivalent `aligned` layout in place of Beamer `multline`; no terms, signs, conditioning, or expectation indices were removed. The boundary underbrace uses KaTeX-compatible text plus inline math. TeX solver commands in prose are wrapped in math delimiters. Bold emphasis on the 1–4 step question uses normal shared-theme text emphasis rather than introducing raw math font commands. Existing explicit `\tfrac` choices are preserved. No lecture-specific font size or scale override was introduced.

All 16 original citation occurrences were checked within their respective frame groups, not only against a global URL list; continuations repeat the corresponding original citation. Both original PNG assets are unchanged byte-for-byte:

- `cm-fig2.png`: SHA-256 `b296f0fc0dae38aad45147ac9c1b6007db7410cca9aa55d1cbe0c8062201bb11`.
- `pfode-fig1.png`: SHA-256 `615ceba62a3fbc9f6b1dcdf9c0500df0026d8d023911bf5a84133ce2d2455847`.

## Course checks and preserved source issues

- Notation/source: shared theme and all 87 adapter macros checked; no raw `\mathbf`, `\boldsymbol`, `\mathcal`, or `\mathbb` introduced. Strict KaTeX parsing with `throwOnError: true` and `strict: 'error'` passed all 134 expressions (19 display, 115 inline).
- Training/Sampling: original headings, ordering, five training steps, three sampling steps, parameters and whole-block reveals are retained. The draft's Training block ends in an EMA update and omits an explicit gradient update of the student; migration does not invent the missing instruction. The multi-step sampling noise formula also remains the source's `\bx_0 + \tau_i\bepsilon` approximation.
- Incoming Recap: frames 2–3 explicitly recap **Lecture 12**, not Lecture 13. The ELBO, conditioned reverse distribution, categorical KL, and cross-entropy conclusion were checked against Lecture 12. The parent coordinator also checked the current Slidev Lecture 12 source frames 32–34 against this migration and found no newly introduced drift. The final cross-lecture PDF/browser comparison was completed by the parent after Lecture 12's final export and is recorded below.
- The reverse categorical posterior preserves the inherited numerator `\bQ_t\bx_t` without a transpose under the course's column-vector convention. This source issue is not silently repaired in Lecture 14 alone.
- Outgoing Recap: not applicable; there is no Lecture 15. The Lecture 13→14 adjacency does not authorize replacing the draft's explicit Lecture 12 recap.
- Summary: all 5 original bullets retained; no migration loss or new stale takeaway. Statements about a roughly 20-step solver floor, one network call per step, the cutoff behavior, and relative one-step model quality remain assertions of the draft source, not newly researched or endorsed claims.
- Schedule: the source hierarchy `Consistency Models` → `Distribution Matching Distillation` matches the root Materials row. The catalog addition and its draft label are owned by the parent coordinator; the existing schedule comment wrapper is preserved.

## Validation evidence

- `node tools/run.mjs check 14`: all 19 source frames, both transitions, map and clicks, original citations, local images, and shared macro adapter passed.
- `node tools/run.mjs finalize 14`: source check, all 13 existing tests, web build, and both page-count-checked PDF exports passed.
- `python tools/render-qa.py 14`: 50 steps pages and 25 handout pages, with no raw math delimiters in extracted text. All **75 pages** were rendered and visually reviewed across 8 contact sheets. Handout pages **2, 3, 4, 10, 11, 12, 14, 15, 16, 17, 18, 21, 25** were additionally inspected at 1280×720. No clipping, overlap, missing symbols, distorted assets, or source-footer collision was found. Clean PDFs contain no annotation toolbar or synthetic ink.
- Every handout page was compared pixel-by-pixel with its corresponding final reveal page at 1280×720: **25/25 identical**. There are no replacement-only intermediate states omitted from the handout; all reveals are cumulative.
- `inspect.mjs 14`: all **50 browser states** on all 25 slides passed forward/backward inspection, with stable geometry, non-empty clicks, loaded images, zero raw math/errors, and zero content/footer overflows. A fresh dev server and the same inspector were run again after final PDF export. The first post-export run passed slides 1–11, then hit a transient browser-ready timeout on slide 12 with no page or HTTP error. Slides 12–25 passed in a fresh-browser retry with unchanged source; the combined final report covers all 25 slides / 50 states.
- An additional Playwright check returned to all **25 logical slides** (including the final slide) with identical content/geometry/visibility. Synthetic annotation on slide 18 passed pen stroke, Undo/Redo, Save, Save & clear, Restore, clicks, adjacent-slide return, exact saved SVG comparison, and cleanup. Network interception allowed localhost only: **0 external requests**, **0 failed responses**, **0 page errors**.
- Actual rendered style comparison used fresh approved Lecture 1 browser screenshots of slides **27** (LOTUS/CoV, final click 4) and **35** (KL/MLE, final click 3), and the same handout PDF pages, against Lecture 14 browser/PDF slides **3–4, 10, 15–16, 18, 21** at 1280×720. Bold vectors/parameters, `\bbE`, `\KL`, fractions, operators, block headings, margins, footer clearance and line spacing agree with the shared style. Computed browser styles: Arial 37px/650 h1, Arial 24px/650 h2, Arial 24px body, KaTeX 24.96px, 12px sources. The shared base paragraph line-height remains 24px; no local font substitution was applied.

Runtime evidence is in `/private/tmp/dgm-slidev-l14-resume-20260916/`: finalization log and the isolated project's `output/qa/lecture14/` (browser/extra-browser reports, all contact sheets, dense-page renders, handout comparison, annotation archives). These are temporary QA artifacts, not lecture outputs.

## Final artifact hashes

| File | SHA-256 |
|---|---|
| `slides.md` | `c3c3cc7cbc7fbaf22ad0d3bdfeb5291bc803a3ece44351939c521c5f9456d403` |
| `slide-map.json` | `2668923956a5757bff5ac8fb5cd977d2d2d9bdc2939ac0ae6d5296e163be9df9` |
| `Lecture14.pdf` (50 pages) | `eaf74116a6ecdee04183d99c7b30d13485b7a029beba85d73fb8cfa1c35c0eca` |
| `Lecture14-handout.pdf` (25 pages) | `63360c32eb6924e383b968ad17e90c753a16b6885e2d431a7d3a1d3c8b63fd85` |

## Remaining limits

The source remains an unfinished author draft. Physical pen hardware, palm rejection, projector readability, and an actual tablet-to-screen connection were not tested. Browser annotation tests do not establish those device properties. No new interactive demo or presenter/viewer demo synchronization was introduced. Final Lecture 12→14 rendered comparisons and catalog integration are recorded below.

## Reference revision for style comparison

- Lecture 1 `slides.md`: SHA-256 `e264d0b2af0ecaebd7be0a1fedf7549d28223afcd1f20b618d6c9052183c728e`.
- Lecture 1 handout PDF: SHA-256 `623b1223a84cede6d012ed83020fce4611b1f7f0419a521cb7717b926980407f`.
- Shared macro adapter: SHA-256 `1494dc2421d284af0aae5614b8cd31f3a4918731e62e5301028f94b1f618a8f4`.
- Shared course stylesheet: SHA-256 `7e7335a0a0df9ec1477a1d68d7716f2c05d368e22aea9267230fa0b4e3469905`.

## Final course integration — 2026-09-17

The coordinator compared the final Slidev Lecture 12 source frames 32–34 with the two original recap frames and their continuation here. Reference Lecture 12 source SHA-256: `3001163a798dbb23ab03722b50c4fb7e1b70cbd73df0369d2c613812a245ccbd`; handout SHA-256: `8b54801122c95cc1ed807704b368642f7c88036fe911da785a96cdebbbf14247`.

Final handout pairs **L12 50 / 52 / 53 ↔ L14 2 / 3 / 4** and final browser captures **L12 53 ↔ L14 4** were visually compared at 1280×720. The ELBO's semantic colors, posterior matrix/vector symbols, conditioning bars, KL/entropy operators, expectations, fractions, body/heading styles and source-footer clearance agree. Additional independent full-size PDF review of pages 10 and 15 found no layout or glyph defect. These checks use final browser screenshots from the successful post-export QA, preserved in ignored `output/qa/lecture14/`; PDF references are in `output/qa/resume-integration/reference-captures/`.

The Slidev catalog now includes both PDFs, source and journal and explicitly marks the content as the preserved Lecture 14 draft. The root README points to Lectures 1–14 without changing the Materials hierarchy or its comment wrapper. Final main-workspace source/map/assets checks, all 134 strict KaTeX expressions, both PDF page counts and recorded artifact hashes pass. The temporary server was stopped; no source/PDF bytes changed during integration.
