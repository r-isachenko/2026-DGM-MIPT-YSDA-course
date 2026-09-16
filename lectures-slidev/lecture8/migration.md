# Lecture 8: migration to Slidev

Completed on **2026-09-15**. Course workflow: [MIGRATION.md](../MIGRATION.md).
The final source and both reviewed PDFs preserve the Beamer material in the
approved Lecture 1 style. No lecture-specific font sizes, scaling, macro overrides,
or shared theme changes were introduced by this migration.

## Baseline and resulting artifacts

- Repository baseline: `19e673be350344c8ea4fafffb78fa389d8b65e19`.
- Beamer source: `lectures/lecture8/Lecture8.tex`, SHA-256
  `88d1d3237358483405ef26285594fdf2a5d9b997268491e4123c03ca0b5bbe51`.
- Beamer PDF: `lectures/lecture8/Lecture8.pdf`, **109 pages**, SHA-256
  `3abe56efecad221dfb0b83ac3e7a59eb92ea0bdac65ef8a82232a5265f6e989d`.
- Shared notation source SHA-256:
  `85df378eb646f74b973e84a3c38add1ac827ebccb943b3b1e4ae347b659f809a`.
- [slides.md](slides.md): SHA-256 `ee1f2946edb310a6ea18938d879aee24f8683670c7484cab29573401a323b960`.
- [slide-map.json](slide-map.json): SHA-256 `a7ed77ea06c9a2367d8d0bf6dfdb0cda36f7a0c1ef1992b07c571d47d1d75aba`.
- [Lecture8.pdf](Lecture8.pdf): **111 pages**, SHA-256 `750f5518aa4ca456207b32d3c38d6f271e64e8e22e3106084b42a829c8a3718a`.
- [Lecture8-handout.pdf](Lecture8-handout.pdf): **52 pages**, SHA-256 `3745948e87f1b175951453032150e0b3ba400fd6732efc37e6d852138d690aee`.

Beamer sources/PDF and `lectures/merged/` were left unchanged. The parent task owns
the shared infrastructure and the [Slidev artifact catalog](../README.md).

## Content, frame map and reveals

- All **35 explicit source frames**, including the cover, original Outline,
  six Recap frames and the static six-bullet Summary, are accounted for exactly once.
- All **6 automatic Outline transitions** are retained: four sections and the two
  subsections of Model Guidance. Outline slides contain only the original agenda.
- **52 logical slides**, **59 within-slide clicks**, **111 rendered states**.
  The Beamer source has 68 reveal directives. Nine original pauses become boundaries
  between continuation slides; two static-frame splits add the two PDF pages.
- Every slide has an explicit `sourceFrame` and `clicks`, matched by `slide-map.json`.
  All rows of derivations, within-line reveals, semantic colors, citations,
  algorithms, and the original order remain. There are no source `\note` commands.
- The original Training/Sampling blocks remain intact and ordered. The derivation
  inside the source DDPM Sampling block retains its original equation reveal.
  Original equation-only sampling illustrations were not rewritten as new algorithms.
- Reveal rows use cumulative KaTeX ranges; the isolated within-line DDPM inversion
  uses the Lecture 1 `math-chain` pattern. Future content is fully hidden and retains
  its geometry. Final handout states retain every cumulative derivation row.

### Splits at the common course font size

No frame is merged or discarded. Extensions retain the original frame's title and
citation. The following splits provide room for formulas and the source footer.

| Source frame | Slidev slides | Reason / original progression |
|---|---|---|
| 4 | 4–5 | NCSN and Gaussian perturbations, then DSM theorem and its note. |
| 5 | 6–7 | Reverse-process figure and Gaussian approximation, then the two process lists; original static frame. |
| 7 | 9–10 | Latent variables and factorization, then standard ELBO and its decomposition; original static frame. |
| 10 | 14–15 | Variance assumption and optimal endpoints, then Gaussian KL-to-MSE derivation. |
| 12 | 18–19 | Linear relationship and inversion of the forward sample, then mean substitution and simplification. |
| 13 | 20–21 | Two mean parametrizations, then both noise-objective expressions and the prediction interpretation. |
| 14 | 22–23 | Full ELBO and weighted noise loss, then the simplified objective. |
| 18 | 28–29 | Noise loss and conditional score, then score parametrization and DSM form. |
| 20 | 31–32 | Every ancestral-sampling equality, then the complete annealed Langevin algorithm. |
| 28 | 42–43 | Bayes derivation, then the guided-score definition and identity. |
| 32 | 48–49 | Bayes identity for the classifier score, then all three CFG equalities. |

Long expressions are broken only at complete algebraic terms. Fixed-size delimiters
may span the two simultaneously visible display rows; paired `\left`/`\right`,
fractions, roots, and underbraces are never split across separate reveal fragments.
The source's unbalanced-looking color/group syntax in frame 13 was normalized into
one complete model-mean row. Its five original PDF states (pages 28–32) were inspected:
the entire row appears together, exactly as retained in Slidev.

## Sources and assets

All original citation URLs and figure uses are retained. The source checker validates
26 direct linked-citation uses; the nested `\href` citations in frames 7 and 21 were
also checked explicitly. Continuations repeat their source credits. The original
8 bitmap files are copied byte-for-byte into `public/figs/` (no resampling).

| Asset | SHA-256 (matches the Beamer asset) |
|---|---|
| `DDPM.png` | `847ccca8bbde0aaf9749d8d2a24ffd89aae4ebd59ec7847174527a805ac663d6` |
| `cfg.png` | `9ccec7e07f477fc439530b94e3f4857adcefa724b76bd9c9713c1ec35a860bb9` |
| `conditional_diffusion.png` | `a98939cb1c957b4340c591b229164a040d17ae595492c7441f6846daad45d970` |
| `diffusion_objective.png` | `61609f63ec4cb2c0c4b57c1d84be32637845893b101a8513315a6487022ec6a0` |
| `diffusion_over_time.png` | `103b5ab5c1cba74015332ec605b46b93a7c7bd82e04720b9a243d217246aaa94` |
| `label_conditioning.png` | `1dc960f9e699391ec5911041783b450158032f338867600fcbef887a46fccaf4` |
| `shedevrum1.jpg` | `158588c11836767a15315cfa6123f3008ef7d2431bb0781313d7a1985c42a97c` |
| `shedevrum2.jpg` | `64b0555bb654bdad32ebbbe6dbd19d94f0ac448e93a19560a2f61e5d1e3aac5d` |

The taxonomy uses the shared component
`<TaxonomyDiagram class="taxonomy" denoising-diffusion />`, with the original `ddpm`
highlight, at the standard full-width course size. Violet emphasis is mapped to the
approved `#8854c0` palette; the named teal, olive, red and gray meanings are preserved.
Headmatter reuses Lecture 1 geometry, fonts, drawing settings and local theme;
`favicon: "data:,"` avoids a remote favicon. No new interactive demo was needed.

## Source audits and neighboring lectures

The Slidev source was checked with the project `lecture-audit`, `notation-lint`,
`recap-sync`, `summary-sync`, and `readme-sync` workflows. These checks distinguish
content agreement from the separate rendered evidence below.

- **Notation and material:** all 87 course macros match the shared adapter;
  editable KaTeX, complete derivations, local images, source links, sourceFrame map,
  Training/Sampling grouping, and all original semantic colors pass. No raw font
  macros or local symbol substitutions were introduced.
- **Incoming Recap:** final Lecture 7 Slidev → Lecture 8 Slidev passes. Forward
  diffusion, Gaussian/NCSN conditional scores, DSM, reverse and conditioned kernels,
  factorization and ELBO retain the same objects, indices and parameters.
  Compared Lecture 7 source SHA-256:
  `e13e9833bf1f316ae4d5342607806123be397efe5b226a4a1bb56fc2f7cecd7d`.
- **Outgoing Recap:** Lecture 8 Slidev → Lecture 9 Beamer passes against its recap
  frames 2–9: Gaussian ELBO, noise parametrization, DDPM Training/Sampling,
  DDPM/NCSN comparison, classifier guidance and CFG. This is a mixed-format
  content comparison, not a claim about Lecture 9 Slidev typography.
- An independent parent-coordinated source audit confirmed both boundaries at
  Lecture 8 source SHA-256 `ee1f2946edb310a6ea18938d879aee24f8683670c7484cab29573401a323b960`; no migration correction was required.
- **Summary:** six static bullets cover noise prediction, sampling cost, the NCSN
  connection, conditioning, classifier guidance and CFG. No takeaway was added or lost.
- **Schedule:** the root Materials row for Lecture 8 matches all four sections,
  the two nested guidance subsections, and their order. No schedule change is needed.
  The parent task added the completed source/PDF/journal links to the Slidev catalog.

### Preserved source editorial choices

These are inherited observations, not migration defects and not silently corrected:

- Frame 19's NCSN objective omits the `\sigma_t^2` weight used by the earlier
  NCSN Training/objective. Lecture 9 recap frame 5 repeats that omission. The
  coefficient-omission and ELBO/score-matching equivalence wording is also preserved.
- The fixed encoder still appears in the inherited `\cL_{\bphi,\btheta}` notation,
  and the DSM theorem retains `\text{const}(\btheta)`.
- Existing Training blocks without an explicit optimizer update retain that scope.
- Generalized `\alpha_t` in the DDPM/NCSN summary is preserved even though earlier
  discrete DDPM notation uses `\alpha_t=1-\beta_t`.
- CFG keeps the source convention `(1-\gamma)s + \gamma s_cond`, the shorthand
  `\nabla^\gamma`, and “convex combination” wording in frame 33. That wording is
  not literal when `\gamma>1` (the earlier example includes `\gamma=3`).

## Finalization and concrete verification

Builds were isolated in
`/tmp/dgm-slidev-l8-20260915/lectures-slidev/`, with a **physical macOS `cp -cR`
copy of `node_modules`**, not a symlink. The directory contains the current shared
theme/tools; a byte comparison after export found no theme difference from the main
project. Dev, build and export were run sequentially inside that installation.
No dev/build/export was run in the shared workspace by this worker.

The coordinator also checked the shared taxonomy additions against Lectures 1–4:
source checks, builds and both exports passed. All 469 PDF pages were compared with
the initial working copies. Lectures 1/2/4 are pixel-identical; the only differences
in Lecture 3 are randomized existing `v-mark` strokes on 15 pages, with identical
text and pixels outside those strokes. The existing working PDFs were preserved.
Shared browser regression and comparison details are in the
[Lecture 6 journal](../lecture6/migration.md).

Runtime: bundled **Node 24.19.0**, locked Slidev **52.19.1**; bundled Python with
`pypdf`, `pypdfium2` and Pillow. Export and browser inspection use the installed
Yandex Chromium browser.

| Check | Result |
|---|---|
| `node tools/run.mjs check 8` | 35 frames, 6 transitions, 52 slides, 111 states; all assets/citations/macros pass. |
| `node tools/run.mjs finalize 8` | Source check, 13 existing numerical/infrastructure tests, production build and both PDF exports pass. |
| `python tools/render-qa.py 8` | 52 handout and 111 reveal pages; no raw math delimiters. |
| Visual PDF review | All 163 pages reviewed through all 15 contact sheets; dense pages inspected at full size. |
| PDF final-state equivalence | All 52 handout pages are pixel-identical to the corresponding final reveal pages. |
| Postexport `node tools/inspect.mjs 8` | All 52 slides / 111 states; no overflow, missing image, raw math, KaTeX error, console error or failed response; geometry and reverse clicks stable. |
| Additional navigation | Every applicable previous/next-neighbor return tested for all 52 slides, preserving initial and final state geometry/visibility. |
| Resource isolation | External requests blocked; zero external requests, missing assets or page errors during the full return/annotation run. |
| Annotation integration | Slide 18: synthetic pointer ink, Undo/Redo, Save, Save & clear, Restore, and byte-identical saved SVG after all clicks and neighboring-slide return pass. |

Full-size PDF review included slides 2, 4, 5, 8, 10, 14, 16, 21, 27, 28, 30, 41,
42, 44, 45, 49, 50 and 51. The parent independently reviewed handout pages 27, 41
and 49 at full size. No clipping, overlap, source collision or missing reveal content
remains in the final exports. Annotation UI and synthetic marks are absent from both PDFs.

### Actual Lecture 1 and Lecture 7 style comparisons

Reference Lecture 1 source SHA-256:
`e264d0b2af0ecaebd7be0a1fedf7549d28223afcd1f20b618d6c9052183c728e`.
Reference handout SHA-256: Lecture 1
`623b1223a84cede6d012ed83020fce4611b1f7f0419a521cb7717b926980407f`,
Lecture 7
`e711415d77d7eccd5d4c0066ee206a11e9923f206d0a299ade8f6ab2f3e5f895`.

The following pairs were inspected at equal scale in **both PDF and browser**:

- Lecture 8 slide 10 / Lecture 1 slide 35: `\KL`, `\pd`, `\pt`, bold vectors and
  parameters, expectation/optimization operators, title and block hierarchy.
- Lecture 8 slides 2 and 4 / Lecture 7 slides 17 and 20: forward Gaussian kernels,
  `\bar{\alpha}_t`, noise indices, `\cN`, gradients and conditional scores.
- Lecture 8 slide 5 / Lecture 7 slide 21: the complete DSM theorem and its note.
  The matching body region is **pixel-identical in PDF and in browser screenshots**.
- Lecture 8 slide 10 / Lecture 7 slide 39: colored ELBO decomposition, KL indices,
  underbrace and the retained `\bphi,\btheta` notation.

The browser CSS measurements agree with the approved reference: Arial title 37 px /
42.18 px line height / weight 650; block heading 24 px / weight 650; KaTeX main math
24.96 px; source credits 12 px. Navy is `rgb(23,50,77)`, block teal is
`rgb(0,127,130)`. Actual rendered subscripts, bold glyphs and Greek letters were
inspected; agreement is not inferred only from macro names. Reference dev servers
were started sequentially after stopping Lecture 8 and were stopped after inspection.

### Evidence locations and limits

Temporary evidence (not course deliverables):

- `/tmp/dgm-slidev-l8-20260915/lectures-slidev/output/qa/lecture8/`:
  all PDF contact sheets, extracted text, full-size pages, browser slide screenshots,
  `browser-report.json`, `reentry-report.json`, `pdf-final-state-comparison.json`,
  `style-L1-*.png`, `style-L7-*.png`, `style-L8-*.png`, CSS metrics and synthetic
  annotation archives.
- `/tmp/dgm-slidev-l8-finalize.log`, `/tmp/dgm-slidev-l8-inspect.log`,
  `/tmp/dgm-slidev-l8-extra.log`.
- `/tmp/dgm-slidev-l8-source-qa/`: inspected original Beamer frame 13 states.

Physical stylus pressure/palm rejection, projector output and a tablet-to-display
network setup were not available and are not certified. The pointer/browser check
establishes only the tested local annotation behavior. No new demo or presenter/viewer
component-state synchronization was introduced. Temporary QA archives are separate
from the delivered course files. No commit was requested or created.
