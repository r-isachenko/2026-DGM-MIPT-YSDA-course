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
Use lowercase letters for random variables, including scalar processes such as
$x_t$ and Wiener noise $w_t$. Use the shared lowercase bold macros for random vectors.

Every paper-derived result, figure or claim needs a visible `.source` block with
its original link and short author/title/year citation. Prefer canonical arXiv
`https://arxiv.org/abs/<id>` links. Local illustrations use `/figs/...`; shared
assets are imported by theme components. Record new image provenance and hashes
in `public/figs/sources.json`. Resources and fonts must work without network access.

## Author's slide style

- **Build on what the audience already knows.** Introduce a method through
  the problem it solves. Return to that problem when the result answers it.
  When continuing a derivation, start from the equation in the form students
  actually saw and show the change of form. Describe each step using terms
  already defined for the audience. In a plan, name what will be chosen,
  constructed or derived. Use the same step names in the derivation and
  introduce each specific choice or result at its step. Choose examples
  students can follow with the tools introduced so far. When proposing or
  reviewing a new slide, identify what leads into it, the step it contributes
  and what follows. Check the neighbors across Outline transitions too.
- **Make the reasoning readable aloud.** Keep the precise statement and its
  assumptions visible. Group equations by mathematical operation and explain
  the step a student would otherwise have to guess. When a question,
  conclusion or figure depends on a formula, show the formula first and
  keep it in view while referring to it. When a list answers
  the question, reveal the whole list on the next click. Leave further
  commentary to the lecturer.
  For a comparison, put the two expressions or diagrams in view together
  when possible. Align corresponding terms, identify what stays the same,
  and say what the difference means in practice.
- **Give the audience a clear place to look.** Center standalone equations
  in their available space. Keep related expressions together and leave
  breathing room between stages of the argument. Give the main figure room
  at projection size. When a diagram recurs, preserve its scale so changes
  are easy to see. Use the established blocks and colors to signal each
  element's role. Match highlighted symbols to the quantities in the plot
  and place the labels or formula needed to read it nearby.
- **Make a demonstration answer a specific question.** Choose an initial
  state that already shows the comparison. Each control should change a
  quantity students can identify, with the relevant reference held fixed.
  Check that the visible behavior agrees with the mathematics. For example,
  animating a parallel computation one item at a time can teach the wrong
  dependency. Use a static figure when it already shows the whole point.
- **Give each idea the space it earns.** In a revision, preserve the parts
  of the existing explanation that already work. If adjacent slides lead to
  the same takeaway, combine them and keep the formula or figure that makes it clear.
  When combining consecutive steps of a proof on one slide, keep the original
  equations, wording and order. If compression hides a necessary step, use the next slide and carry the
  starting equation or diagram across. A variant that adds one observation
  can often fit beside the method it qualifies. In a Recap, select the exact
  results students need to recall. In a Summary, synthesize related results.

## Course structure and terminology

- Lecture content is English. Refer to earlier concepts by topic, not lecture number.
- Place a topic where its prerequisites are available and its result will be used.
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

Treat successive small edits to one lecture as one session across messages.
For a wording fix, reread the changed passage in context. When a change can
affect rendering (math, layout, figures or reveals), reuse the lecture’s Slidev
dev server and inspect the affected slide and click states after hot reload.
Resolve preview errors in the same iteration. Use `npm run check -- N` for
changes to slide metadata, sections, asset references or shared macros. Test
changed demo logic with its own tests. For shared changes, check the lectures
that use the affected theme, component or macro.

If the author asks for a PDF mid-session, run `npm run export -- N` and inspect
the edited pages. When the author finishes the series, requests a final build,
or asks to commit or push lecture changes, validate the accumulated edits once
per affected lecture. `npm run finalize -- N` covers the source check, demo
tests, web build and fully revealed PDF. If some stages already passed for the
same inputs, run just the outstanding stages. Review all pages of the final
PDF, dense pages at full size, and the affected browser states. Apply the
semantic and artifact checks in `.codex/project-context.md` before commit and
push. Regenerate PDFs when their inputs change the rendered lecture. Follow
the [Slidev README](lectures/README.md) for server handling and build/export order.

Keep the shared pen panel and room for annotations. Drawings belong to logical
slides and preserve coordinates through reveals/navigation; exclude them from PDFs.
Save and verify annotation downloads before clearing/closing; there is no automatic
disk save. Verify actual pen, palm rejection, projector and tablet connection before
class and after relevant changes. Browser QA does not prove physical-device behavior.
Use localhost by default. Demo randomness must be reproducible, with clear initial
state/reset; test mouse, keyboard, pen and return behavior. Do not assume presenter
and viewer synchronization without checking.
