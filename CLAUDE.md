# Working with course lectures

Shared conventions for Codex and Claude. Slidev is the course's editable format.
Read `.codex/project-context.md` for later author decisions and
`lectures/README.md` for commands. Current user instructions take precedence.

## Sources and artifacts

- Each lecture has `lectures/lectureN/slides.md`, local `public/figs/`,
  optional demo components/lib, and one fully revealed `LectureN.pdf`.
- Each slide declares a unique semantic `id` and integer `clicks >= 0`.
  Outline transition slides also declare `section`. Keep IDs stable for browser QA.
- Share dependencies, `theme: ../theme`, and the approved Lecture 1 headmatter.
- `theme/setup/macros.json` is the editable source of truth for math notation.
  Shared taxonomy SVGs live in `theme/assets/`.
- PDFs are generated: fix Markdown, components or theme, then export.
  Do not patch PDFs manually. Do not touch `lectures/merged/` without a direct request.

## Notation and sources

Use shared macros rather than raw `\mathbf`, `\boldsymbol`, `\mathcal`, `\mathbb`
or handwritten `D_{KL}`. Search current lectures before adding new notation.
Examples: `\bx`, `\bz`, `\btheta`, `\bepsilon`, `\cN`, `\bbE`, `\KL`, `\pt`, `\qagg`.
Add missing macros to `theme/setup/macros.json`, never local lecture definitions.
Keep parameters, indices, conditioning and operators consistent across lectures.

Every paper-derived result, figure or claim needs a visible `.source` block with
its original link and short author/title/year citation. Prefer canonical arXiv
`https://arxiv.org/abs/<id>` links. Local illustrations use `/figs/...`; shared
assets are imported by theme components. Record new image provenance and hashes
in `public/figs/sources.json`. Resources and fonts must work without network access.

## Narrative and structure

- Lecture content is English. Refer to earlier concepts by topic, not lecture number.
- Every new slide must follow the previous idea, prepare the next idea, and develop
  its own argument step by step. Check actual neighbors, including across Outline
  transitions. Move or split a slide when its narrative links are weak; record the
  three links when proposing/reviewing new slides.
- Outline slides contain only the agenda, never definitions or teaching content.
- Root `README.md` is the schedule: Materials bullets mirror ordered sections and
  subsections. Update it with section changes, preserving dates and publication
  comment wrappers. The Slidev README is the source/PDF catalog.
- Terms: Sampling (initially Sampling (generation)), Density evaluation for a ready
  model, Density estimation for learning, Model quality evaluation for assessment.

## Moving topics between lectures

A requested topic move includes the necessary dependent Recap, Summary, Outline,
README and artifact updates, unless the user limits the scope. Apply the
[topic-transfer procedure](.agents/skills/recap-sync/references/topic-transfer.md)
before declaring completion, not only before a commit or push. Track the disposition
of removed recap material; repeated formulas alone do not establish coverage.

## Shared visual style and reveals

- All lectures strictly share approved Slidev Lecture 1: 16:9, 1280 x 720, fonts,
  sizes, spacing, blocks, notation and semantic colors. New content does not
  authorize a new style. Preserve unrelated formatting.
- Fix overflow with layout, line breaks or splitting slides; do not shrink fonts
  or scale content ad hoc. Leave space above actual multiline source footnotes.
- Compare recurring notation at equal scale in browser and PDF with Lecture 1
  and relevant earlier lectures. Fix theme/KaTeX/font causes rather than local hacks.
- Body explanations reveal progressively; future material stays hidden with its
  space reserved. Explicit click groups must have no empty steps. Verify forward,
  backward and return navigation. Do not split fractions, roots, paired delimiters
  or underbraces across independent math fragments.
- The sole PDF shows each slide fully revealed. Preserve meaningful static states
  in interactive demos and any content replaced during browser reveals.

## Training / Sampling

Use canonical block titles `Training` and `Sampling`, with optional algorithm
names in parentheses, not Procedure/Inference or model names. Use ordered steps,
even for two items. Each step uses an imperative verb and final period: Sample,
Compute, Solve, Update, Denoise, Reparametrize, Predict, Initialize, Return.
Separate independent samples with a comma. Use `\cL` for batch loss and `\btheta`
(or `\bphi, \btheta`) for parameters; preserve full ELBO and DDPM simple-loss names.
Reveal each algorithm as a whole block, with a pause between Training and Sampling.
Recap is the exception: all blocks and formulas are visible immediately.

## Summary and Recap

The final Summary synthesizes the lecture, normally in 5–7 bullets or fewer when
sufficient. After substantive changes, review all bullets together: consolidate,
replace or remove stale takeaways rather than continually appending new ones.
Typos alone do not require a Summary rewrite.

Each lecture after the first opens with a Recap assembled from the previous
lecture’s main blocks, statements and formulas. Copy the selected material
verbatim, including the assumptions needed to use each result, its notation
and its source citations. Shorten by omitting intermediate derivations,
explanations and secondary details. Any accompanying text must also come
from the previous lecture. After substantive changes, check both incoming
and outgoing Recaps for coverage of the main results and fidelity of each excerpt.

Every Recap uses `clicks: 0`, with no reveal directives or click-dependent visibility.
Prefer adding a missing result to an existing slide on the same topic. Add a slide
only when space or topic coherence requires it. Do not shrink fonts, compress
formulas or broadly reorganize Recaps to meet a numeric cap; there is no such cap.
Refer unresolved choices of emphasis to the author.

## Validation and presentation

Use `check`, `test:demos`, `build`, `export`, `finalize`, PDF rendering and browser
inspectors as documented in the Slidev README. Successful builds do not establish
mathematical correctness, semantic consistency, PDF freshness or visual quality.
Review all pages of changed PDFs, dense pages at full size, and affected browser
states. Shared theme/component/macro changes require checking affected consumers.
Metadata-only or documentation changes do not require regenerating unchanged PDFs.
Run build/export sequentially and avoid conflicting with another active server.

Keep the shared pen panel and room for annotations. Drawings belong to logical
slides and preserve coordinates through reveals/navigation; exclude them from PDFs.
Save and verify annotation downloads before clearing/closing; there is no automatic
disk save. Verify actual pen, palm rejection, projector and tablet connection before
class and after relevant changes. Browser QA does not prove physical-device behavior.
Use localhost by default. Demo randomness must be reproducible, with clear initial
state/reset; test mouse, keyboard, pen and return behavior. Do not assume presenter
and viewer synchronization without checking.
