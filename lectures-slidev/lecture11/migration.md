# Lecture 11 migration

Verification date: 2026-09-16. The lecture is migrated and both PDFs are finalized and visually reviewed. The final L10 → L11 recap comparison has been completed in source, browser, and PDF, with the final PDF pair review performed by the parent coordinator. No physical-device validation is claimed.

## Baseline and scope

- Beamer source: `lectures/lecture11/Lecture11.tex`, current repository HEAD `19e673be350344c8ea4fafffb78fa389d8b65e19`; last source commit `e73f11b8a39240c0bafc1fc959d045b9300c5a85`.
- Source SHA-256: `b1bdb762a48793e72b89d292251fa99022c64af45a49d16152b11343eefd85d0`.
- Baseline PDF SHA-256: `4d341ee9feb61a36fea3de8e94e907ffea36ba75d93e3e5d0f9b61b4c08dd76a`; 78 pages.
- The baseline PDF is the same revision: source MD5 `3cfcd0636825bbd1c6d7e5d65bd17888` and 26,631 bytes match the successful `Lecture11.fdb_latexmk` record.
- Pure format migration: all definitions, derivation stages, claims, conditions, citations, illustrations, Training/Sampling algorithms, seven incoming recap frames, and the static five-bullet Summary are preserved. No new demonstrations or editorial content.
- Existing Beamer files, shared notation, and `lectures/merged/` were not edited or rebuilt. Shared taxonomy support was coordinated by the parent; this lecture uses `flow-matching`.

## Mapping and adaptation

`slide-map.json` covers all **28 source frames exactly once**, **four automatic Outline transitions**, and four continuation slides: **36 logical slides / 80 reveal pages**. The source has 32 logical frames including automatic transitions and 78 overlay pages. Two additional states are the two static recap splits; the two proof-split boundaries replace existing pauses.

| Source frame | Slidev slides | Reason and preserved sequence |
|---|---|---|
| 4 | 4–5 | Reverse ODE/SDE and separate Proof Sketch at the approved type size; both static. |
| 8 | 9–10 | Dynamics and continuity equation followed by the original Flow Matching block; both static. |
| 12 | 16–17 | Theorem/question then all five cumulative proof rows; the original pause before Proof becomes the slide boundary. |
| 14 | 19–20 | Theorem and quadratic-loss expansion then all inner-product marginalization identities; the original pause becomes the boundary. |

- Every other source frame stays on one logical slide. All four section/subsection transitions and the initial Outline contain only the original agenda.
- Unsupported `multline*` presentation becomes equivalent `aligned` rows. Explicit cumulative row ranges preserve the four conditional-vector-field proof additions, the two CFM inner-product additions, and the one-sided CFM substitutions. Whole Training/Sampling blocks remain indivisible reveal groups.
- Source violet is mapped to the approved Lecture 1 violet `#8854c0`; teal/olive meanings are preserved. There is no local font scaling, font-size override, new style sheet, or notation redefinition.
- Long displayed equations are rewrapped at equality boundaries without deleting expressions. End-point implications use complete math fragments so braces, fractions, and delimiters do not cross reveal boundaries.
- All eight PNG assets are byte-identical local copies from Lecture 11, with nine uses plus the shared taxonomy. `favicon: "data:,"` removes Slidev's default external favicon request for offline use.

## Source and interface checks

- `check 11`: 28 source frames, four transitions, 36 slides, 80 states; all 24 source citation occurrences and ten image uses checked; 87 shared macros synchronized.
- Manual content/notation check: equations, indices, signs, conditionals, scalar/vector macros, semantic color groups, initial states, and derivation sequence compared with Beamer. No migrated source-level omission found.
- Strict direct KaTeX rendering with the actual shared macro adapter: **144 expressions** (54 display / 90 inline), `strict: 'error'`, `throwOnError: true`, all pass. This supplements the browser inspector, whose `.katex-error` test alone can miss some parse failures.
- Incoming recap: Lecture 10 Beamer body and current stable Slidev body checked against Lecture 11 frames 2–8. Matching topics are VE/VP SDEs, probability flow ODE, reverse ODE/SDE, continuous/discrete DSM, NCSN/DDPM kernels, Sampling, continuity equation, and FM objective. `probability_flow.png`, `sde.png`, and `sbgm.png` match Lecture 10 by SHA-256. The approved deterministic PF-ODE sampling wording is preserved.
- Outgoing recap: Lecture 12 Beamer recap frames 2–10 checked against Lecture 11 body; CFM objective/theorem, conditional velocity, Q1/Q2, Gaussian paths, endpoint conditioning, one-sided velocity/objective, both algorithms, and conditional/marginal figures agree. Lecture 12's older multiple-dynamics material and plural recap title are retained source choices. The final Slidev-to-Slidev comparison is recorded below.
- Summary: all five source takeaways retained, covering CFM latent conditioning, posterior-mean marginal velocity, equal minimizers, Gaussian conditional velocity, and endpoint straight paths.
- Course README Lecture 11 hierarchy matches both Beamer and Slidev exactly. The parent coordinator owns the shared Slidev catalog update.

### Preserved editorial observation

Source frame 13 says FM and CFM have the same **optimal value**. The following theorem (frame 14), derivation up to a parameter-independent term, and Summary instead assert the same **optimal solution**. The original wording is also repeated in Lecture 12's recap. This mathematical distinction predates the migration and is preserved, not silently rewritten.

## Build, PDF, and browser evidence

- Runtime: a physical copy of the shared installation under `/private/tmp/dgm-slidev-l11-20260916/lectures-slidev`; Node 24.19.0 and the existing lockfile. Dev, build, and export were sequential within this installation; no shared-workspace server/build/export was run.
- `finalize 11` passes: source check, **13 existing tests**, static build, and both page-count-checked PDF exports. An initial isolated-copy test failure was resolved by copying the existing deferred KL test dependency; no test or dependency changes were made.
- `render-qa.py 11`: **36 handout pages and 80 reveal pages**, no raw math delimiters. All **116 pages** visually reviewed through all ten contact sheets.
- Additional 1280×720 full-page PDF review: handout pages **2, 6, 7, 9, 17, 19, 20, 21, 22, 24, 27, 28, 30, 31, 32, 33, 34, 36**; intermediate reveal pages **21, 22, 23, 31, 36, 37, 41, 55, 56, 61, 65, 69**. No clipping, overlap, missing glyphs, footnote collisions, visible future rows, or lost handout derivation states found.
- Every handout page is pixel-identical, rendered at 1280-pixel width, to its corresponding final reveal page in the steps PDF (**36/36**).
- Canonical `inspect.mjs 11`: all 36 slides / 80 states pass nonempty-click, forward/backward geometry, math, image, and content/footer-boundary checks. The final source was also checked by an isolated superset of that inspector after export.
- Extended final browser check: slides 1–35 tested on return from the next slide, plus Summary slide 36 on return from slide 35, retaining the same final state; all external requests blocked, with **zero external requests**, page errors, or HTTP failures. This checks locally served operation without internet dependencies, not an unserved `file://` build.
- Annotation integration on logical slide 16: synthetic mouse stroke, Undo/Redo, Save JSON download, Save & clear, Restore, click-through, neighboring-slide return, and byte-identical returned drawing archive pass. Synthetic drawing cleared; neither final PDF contains UI or session ink. The archive remains only in temporary QA.
- Evidence files (temporary): `output/qa/lecture11/browser-report.json`, `extended-browser-report.json`, `strict-math-report.json`, all page contact/full renders, and `session-test.json`, and `last-slide-return.json`; command logs are in `/private/tmp/dgm-slidev-l11-20260916/`.

## Rendered style comparisons

All comparisons used 1280×720 at equal scale, not only matching macro names.

- **Lecture 1 slides 27 and 35 ↔ Lecture 11 slides 17, 19, and 22**, in PDF and browser: expectation/integral/operator geometry, bold vector/parameter glyphs, loss/objective displays, header/body/block typography, line spacing, and course colors agree. Current clean Lecture 1 captures were supplied by the parent at `/private/tmp/dgm-slidev-parent-20260916/reference-captures/`; matching Lecture 11 captures and PDF renders are in its QA directory.
- **Lecture 10 slides 14 / 17 / 34 / 40 ↔ Lecture 11 slides 2 / 3 / 7 / 8**, browser: VE/VP, PF-ODE theorem, discrete/continuous DSM, and Sampling match in typography and notation. These were inspected from the final stable content captures supplied by the Lecture 10 worker; its remaining re-export affected separate efficient-sampling prose pages.
- **Lecture 10 final handout pages 14 / 17 / 34 / 40 ↔ Lecture 11 final handout pages 2 / 3 / 7 / 8**, PDF: the parent coordinator reviewed these exact pairs at 1280×720 after the final L10 export. Bold/Greek/score/solver notation, math sizes, and headers/footers agree. Source-preserved recap context, labels, colors, and figure sizes remain distinct. Evidence: `/private/tmp/dgm-slidev-parent-20260916/independent-review/L{10,11}-pageN.png`.
- Parent additionally reviewed Lecture 11 handout pages 3, 20, 28, and 34 at 1280×720: clean math, layout, and citations.
- Parent shared-taxonomy regression checked all 1001 existing L1–8 PDF pages: pixel-identical except 15 L3 pages with random native v-mark strokes; the parent verified that all other pixels/text match. Existing main PDFs were not overwritten. Evidence: `/private/tmp/dgm-slidev-parent-20260916/regression-report.json`.

## Artifacts and remaining limits

| Artifact | Pages | SHA-256 |
|---|---:|---|
| `Lecture11.pdf` | 80 | `e3c06b478c50729a17c60c1435ddd1b4ad5dcf7d8e8758c8177fb5f74eea2170` |
| `Lecture11-handout.pdf` | 36 | `9db19f1b2fc4e042c45e6b0c6b169fb3b7428a72fea36861145b8d0a0abbc0ca` |
| `slides.md` | 36 slides | `18b2fd6640df367a7af827ff31c160fab8c5e73e9edd9f6a5a0e8b58685fe52e` |
| `slide-map.json` | 36 entries | `91fef77d722831c6e27b2f61a7bd893ee92b8239201bcd8e7ccf0f4234b12ba6` |

The actual tablet pen, palm rejection, projector, and tablet-to-screen connection have not been tested. Browser mouse/keyboard and archive integration do not establish those physical-device properties. Shared catalog integration is coordinated by the parent; all required local source, PDF, and browser migration checks are complete.

## Final recap typography correction

The parent restored the display-size `\frac12` in the reverse-SDE equation on
logical slide 6 (source frame 5), matching the Beamer baseline and Lecture 10
slide 30. This replaces the smaller `\tfrac12` introduced during conversion; the
equation itself is unchanged. Source checking, strict parsing of all 144 formulas,
the web build and both PDF exports were repeated. Only page 6 changed in each PDF;
the other **114 pages are pixel-identical** to the reviewed versions. Both changed
pages and the browser state were reviewed at 1280×720, and `inspect.mjs` passed
slide 6 without overflow or math/resource errors. The artifact hashes above refer
to these final corrected files. Evidence is in the parent temporary directory:
`l11-correction-report.json`, `l11-correction-inspect.log`, and
`independent-review/L11-corrected-*-6.png`.

## Final course integration — 2026-09-17

The outgoing comparison now uses the final Slidev Lecture 12 (`slides.md` SHA-256 `3001163a798dbb23ab03722b50c4fb7e1b70cbd73df0369d2c613812a245ccbd`). All nine source recap frames (Lecture 12 frames 2–10, logical slides 2–17) were compared with this lecture's body: CFM objectives/algorithms, conditional marginalization, Gaussian paths and velocity, endpoint conditions, one-sided loss/algorithms and the conditional/marginal figures. No new content or notation drift was found; the previously recorded optimal-value distinction remains an inherited source choice.

The coordinator compared final handout pages **L11 21 / 28 / 31 / 34 ↔ L12 5 / 10 / 12 / 16** at 1280×720 and final browser captures **L11 34 ↔ L12 16**. Shared heading/body styles, vector and parameter glyphs, Gaussian/expectation/solver notation, semantic colors and footer clearance agree; the documented recap continuations retain the complete formulas. Five common recap images were checked byte-for-byte. Evidence is in ignored `output/qa/resume-integration/reference-captures/`, `recap-assets.json`, and `output/qa/lecture12/`.

The Slidev catalog and root README integration are complete. The final main-workspace source check, all 144 strict KaTeX expressions, both PDF page counts and the recorded hashes pass; the lecture's reviewed source and PDF bytes are unchanged.
