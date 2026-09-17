# Lecture 10 migration

Completed 2026-09-16 as part of the course-wide Beamer-to-Slidev migration.
The source remains in English and uses the approved Lecture 1 theme, geometry,
fonts, notation adapter, annotation tools, and export pipeline.

## Baseline and scope

- Repository baseline: `19e673be350344c8ea4fafffb78fa389d8b65e19`, with the existing
  uncommitted course migrations and shared infrastructure preserved.
- Beamer: `lectures/lecture10/Lecture10.tex`, SHA-256
  `db47ec1ddf01effdb83b61742f3c0b8647c0a47fa60e5413c176f5cac18ddfa8`.
- Matching Beamer PDF: `lectures/lecture10/Lecture10.pdf`, 106 pages, SHA-256
  `58b4a52f20614a8f85b3a6b340badc26890d59e6b9aa233d99fb91561242b765`.
  The coordinator also verified source freshness against `.fdb_latexmk`.
- Beamer, `lectures/merged/`, unrelated existing work, and shared notation/style
  were not edited by this lecture worker. Existing Codex configuration already
  points to the preserved shared course conventions; no duplicate configuration
  migration was needed.

## Content, mapping, and presentation

- All 40 explicit Beamer frames and five automatic section Outlines are mapped.
  The initial explicit Outline is retained. `sourceFrame` and `clicks` agree with
  `slide-map.json` for every slide.
- Result: **46 logical slides / 106 reveal states**. All 93 displayed source
  equations remain editable, including every step in the VE/VP limits,
  probability-flow ODE proof, reverse-SDE proof, and conditional-moment derivation.
- Source frame 24, **Proof of Reverse SDE**, is split into slides 27 and 28 at its
  second pause. Slide 27 contains conversion to the PF-ODE and time reversal;
  `extension: 24` contains conversion back to the SDE. This preserves the three
  source states across two readable slides and keeps the standard font sizes.
  No frames are merged; no new teaching examples or numerical demos were added.
- Both Training blocks and all four Sampling blocks are retained as ordered,
  whole-block reveals. The six-bullet Summary remains static and covers all five
  taught sections. It was not expanded or editorially rewritten.
- Approved terminology: the frame-20 title uses **Deterministic Sampling** in
  place of **Deterministic Generation**, and Summary uses **sampling steps** in
  place of **inference steps**.
- TeX layout commands are replaced by Markdown/HTML spacing; `multline*`/`align*`
  are editable KaTeX `aligned` equations. Unsupported `\mbox` becomes equivalent
  `\text`. Violet uses the existing course `#8854c0`; teal and olive retain their
  semantic roles. Paired delimiters, fractions, integral bounds, and derivatives
  remain intact. Prose spacing commands are not printed as literal TeX.
- Five local PNGs are copied byte-for-byte. The seven image uses plus shared SDE
  taxonomy are retained. All 36 original citation occurrences are represented;
  the proof continuation repeats its source, giving 37 visible source footers.
- Taxonomy uses the coordinator-provided shared `sde-based-diffusion` variant,
  exported from the existing course TikZ. No lecture-specific theme or macros
  were introduced.

## Coherence checks

- Incoming recap: final Slidev Lecture 9 body versus Lecture 10 slides 2–7,
  covering ODE dynamics/Euler, probability path, Picard and reversibility,
  continuity theorem/solution, SDE/Wiener/Euler-Maruyama, and KFP/Langevin.
  The source recap's concise wording and omission of intermediate body steps
  remain; no new formula or assumption drift was found. The Lecture 9 worker
  independently checked the same pair.
- Outgoing recap: final Slidev Lecture 11 recap versus Lecture 10 body.
  VE/VP, PF-ODE, reverse-time signs and score, discrete/continuous DSM,
  NCSN/DDPM transition kernels, Sampling, continuity equation, and FM objective
  agree. Existing condensed wording and different recap block titles remain.
  The coordinator additionally inspected the L10/L11 repeated PDF blocks.
- The five section titles and order match the root README Lecture 10 row.
  The common Slidev artifact catalog is maintained by the migration coordinator;
  its Lecture 10 entry links `slides.md`, both PDFs, and this record.
- Source notation uses the shared 87-macro adapter. No local font-size, font-family,
  zoom, scale, or symbol overrides are present. Math, citations, algorithms,
  Summary, and both Recap directions were checked in Slidev mode.

## Validation and visual evidence

All dev/build/export commands ran in the isolated physical dependency copy at
`/private/tmp/dgm-slidev-l10-20260916/lectures-slidev`, sequentially within that
installation. QA files and synthetic annotation archives remain there, outside
tracked course files.

- `node tools/run.mjs check 10`: passed, 40 source frames, five transitions,
  46 slides, 106 states, 36 source citations, and eight image uses.
- `node tools/sync-notation.mjs --check`: passed via source check.
- An independent strict KaTeX pass (`math-parse.mjs`) parsed all **93 display
  formulas and 158 inline formulas** with the shared macros and `throwOnError`.
  This supplements `inspect.mjs`: Slidev can otherwise emit raw TeX after a
  server-side parse failure without a `.katex-error` element.
- `node tools/run.mjs finalize 10`: passed all **13 existing tests**, production
  build, and both PDF exports. Final page counts are 46 handout / 106 steps.
- `python tools/render-qa.py 10`: passed. Every page of both PDFs was visually
  inspected on 13 contact sheets. Dense pages were additionally read at native
  1280-pixel width: handout 2, 5–7, 10, 12, 16, 18–19, 21–23, 25, 27–32, 34,
  36–39, 42, 44–46. No clipping, overlap, raw TeX, hidden future content in the
  handout, or source-footer collision remains.
- Final prose-spacing cleanup changed only handout pages **21, 23** and steps
  pages **42, 43, 49**. These were re-rendered and reviewed. Pixel comparison of
  the final exports against the first completely reviewed exports confirmed
  all other **147 pages** unchanged. A final whitespace-only diff cleanup was
  followed by another source check, strict math parse, and PDF export; all
  **152 rendered pages** were pixel-identical to the reviewed PDFs afterward.
- Fresh `node tools/inspect.mjs 10` passed all 46 slides / 106 states after the
  supported-math fixes: forward/backward visibility and geometry, meaningful
  clicks, content/footer boundaries, image loading, and no browser errors.
  After the final two prose-spacing edits, their complete state sets were
  rechecked with `QA_SLIDES=21,23`; the other slide bodies were unchanged.
- Fresh-server `extra-checks.mjs` passed **45 neighbor-slide returns**, preserving
  geometry and visibility. On slide 10: mouse ink, Undo/Redo, Save, Save & clear,
  Restore, all reveals, next-slide return, and equality of the saved annotated
  slide before/after return passed. Synthetic ink was cleared after testing.
- The same fresh-server run blocked every non-local network request and completed
  with **zero external requests, HTTP failures, or page errors**. All course
  resources and fonts are local; the headmatter uses a data favicon. This is
  evidence of independence from external Internet resources, while the local
  Slidev server itself remains required for this dev-mode test.

### Equal-scale style comparison

- At 1280×720, actual Lecture 1 browser slide 35 and handout page 35 were compared
  with Lecture 10 slide/page 44: `\bx`, `\btheta`, `\pd`, parameter subscripts,
  operators, headers, block titles, and body text use the same rendered style.
- Actual Lecture 9 browser slides 23/27 were compared with Lecture 10 slides 2/5:
  Euler `\ODESolve`, vector field/dynamics, continuity theorem, trace, integral,
  and Solution block. Actual handout pages L9 27/34 versus L10 5/7 were compared
  at equal 1280-pixel width for continuity and KFP formulas/assumptions.
- Observed computed values: Arial 37px titles, Arial 24px block/body text,
  KaTeX 24.96px, shared navy/teal colors, and loaded local KaTeX fonts.
  The 24px paragraph leading is inherited from Slidev's shared
  `client/styles/layouts-base.css` (`p { @apply my-4 leading-6; }`), not a local
  layout adjustment. The course stylesheet changes paragraph margins only.
- Reference evidence: coordinator's
  `/private/tmp/dgm-slidev-parent-20260916/reference-captures/`, Lecture 9 worker's
  `output/qa/lecture9/`, and this installation's `output/qa/lecture10/` and
  `output/qa/style/`. The final L9 source hash is
  `b81b8b68952d019a102693537fdf4e153da6bbc08c430a3e239dba0fb23f3d36`;
  final L9 handout hash is
  `8658a0f298683db3aac15ff8cd21fe742e18c1eb1274d4bd3ac9b993f09b0324`.

## Preserved source choices and limits

- The source's numerical-solver discussion labels Euler-Maruyama's
  `O(sqrt(Delta t))` as “local error”; the broad performance ranges and the
  adjoint-method characterization are preserved, not editorially revalidated.
- The source's generic Sampling block starts at `N(0,I)` even while the lecture
  also discusses VE-SDEs, and it explicitly omits the variance derivation.
  Those choices remain, including the next lecture's matching recap.
- The PF-ODE sampling block is titled “Euler / Heun / RK4” but displays an Euler
  update, as in Beamer. No unrequested solver derivations were inserted.
- Real stylus hardware, palm rejection, projector behavior, tablet-to-screen
  networking, and multi-device presenter/viewer synchronization remain untested.
  Browser mouse tests do not establish those device capabilities.

## Final artifact checksums (SHA-256)

| Artifact | SHA-256 |
|---|---|
| `slides.md` | `c9a725dc8bf19f71cbb0b094d7ddbf2fe341b46ddbeeeff60dacbb2647af2d94` |
| `slide-map.json` | `34e48739c96fc140d135b3ebd296f284fab146f05e97afcc1380d4ed6009c06e` |
| `Lecture10.pdf` | `126d7b35008873ac686502d644bc0383a4aa33ededd8fa3a3342725fb4738775` |
| `Lecture10-handout.pdf` | `a83e6060759a4ecf1024b940c837757fbd65f27ed80757245ef3ace822dbb2a4` |
| `public/figs/cnf_flow.png` | `2485f9b7208f4834e0fd62f1bf6af7cf72fb606fd94887e5e20901bd022f0137` |
| `public/figs/multiple_dynamics.png` | `cf63396c1146971187b75ae025bc4215b036e0c0e85b934b16f86c6343faa4a4` |
| `public/figs/probability_flow.png` | `1870e962ba3ca79c400a47af581a4e9a0692878653e7f23eca4bf4e9f535c8ad` |
| `public/figs/sbgm.png` | `93f1b1311c5997697bce847a36beaa763617af91c98defc448339260be26e1b8` |
| `public/figs/sde.png` | `41136d85412315b79a7520c9289ba1963700c630e67745923a16067c1f1b91eb` |

## Final course integration — 2026-09-17

The final catalog integration is complete: the Slidev README links the editable source, both reviewed PDFs and this journal for all Lectures 1–14; the root README now points to the full catalog. The existing Materials hierarchy and schedule comment wrapper were preserved. Final main-workspace checks passed for the source/map/assets, all 251 strict KaTeX expressions, PDF page counts and the artifact hashes recorded above. The final Lecture 11 recap retains the corrected source `\frac12` documented in its journal. This documentation-only integration did not change the reviewed lecture source or PDF bytes.
