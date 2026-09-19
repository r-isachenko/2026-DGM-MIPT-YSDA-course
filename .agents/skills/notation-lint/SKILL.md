---
name: notation-lint
description: Check course notation, citations, figures, reveal conventions, and Training/Sampling blocks in Beamer .tex or Slidev slides.md. Use for notation/style review or after substantive source edits; distinguish source checks from rendered typography checks.
---

# Notation lint

Read [shared context and format selection](../lecture-audit/references/formats.md)
first. Use CLAUDE.md for course notation and Beamer conventions, and MIGRATION.md
for Slidev. Read `lectures/utils/newcommands.tex` at runtime; do not hardcode the
macro inventory. Shared definitions themselves are not raw-notation violations.

## Common checks

- In lecture math, flag raw `\mathbf`, `\boldsymbol`, `\mathcal`, `\mathbb`,
  handwritten KL/JSD/FID/MMD, and inconsistent parameter/vector notation when a
  course macro is required. Verify that the suggested macro exists; if absent,
  propose an addition to the shared source. Do not mistake ordinary prose such as
  a paper title containing KL for an unexpanded math operator.
- Check source attribution for results, claims, and figures from papers. A title,
  agenda, or original explanatory slide is not missing a citation solely because
  it has text or a heading. Recap figures still need their original sources.
- Check local figure paths and existence; use the format-specific asset conventions.
- Existing Training/Sampling blocks keep canonical titles (optional algorithm name),
  ordered steps, imperative verbs, sentence punctuation, course loss/parameter
  notation, and whole-block reveals. Check changed steps against CLAUDE.md §5.
  During migration do not invent a Training block absent from the approved source.
- Classify a preserved source defect separately from a regression introduced by
  migration. Approved terminology and equivalent KaTeX adaptations are not errors.

## Beamer

Check `lectures/lectureN/LectureN.tex`:

- Paper references use `\myfootnotewithlink` near the start of the frame, or a
  justified `\myfootnote` when no URL exists.
- Images use local `figs/...`. Shared taxonomy/utils references require a real
  shared source, not borrowing another lecture's figure directory.
- Consecutive frames have `%=======` separators (allow the existing number of `=`).
- Flag raw `\pause` inside math and overlay commands that bypass the course reveal
  machinery. Preserve `\nextonslide`/`\eqpause` semantics; `\pause` outside math is
  not automatically an error, and blindly replacing it with `\eqpause` is unsafe.
- Training/Sampling use `enumerate`, with no pauses between individual steps.
  Check displayed-equation spacing against the shared TeX convention.

## Slidev

Check `lectures-slidev/lectureN/slides.md` and relevant included sources/components:

- Reuse the shared theme and KaTeX adapter. Check sourceFrame/clicks against the
  map, meaningful Markdown/HTML boundaries, references in visible source blocks,
  local `/figs/...` and imported theme assets. Use `npm run check -- N` if the
  existing environment is available, and interpret its coverage accurately.
- Do not require `%=======`, `\eqpause`, TeX footnote commands, `enumerate`, or
  TeX `\vspace` inside Markdown. Check their purpose through Slidev equivalents.
- Inspect math inside HTML for raw delimiters/commands; verify unsupported
  environments were adapted without changing the formula. Check macro adapter
  consistency with `node tools/sync-notation.mjs --check`; do not edit it by hand.
- Inspect click groups and the initial state. Whole algorithms reveal together;
  future content stays hidden with reserved space. Do not split paired delimiters,
  fractions, or braces across separate math fragments. Look for empty clicks and
  unintended reflow; use browser evidence for actual visibility and geometry.
- Flag local font, scale, or symbol substitutions that conflict with the common
  course style. Verify recurring notation at equal scale in browser and PDF against
  the approved Lecture 1 when rendered checking is in scope. Matching macro names
  and an error-free KaTeX parse are insufficient evidence of matching typography.

## Report and authorized fixes

Give format, absolute path:line, rule, observed snippet, and concrete fix; include
slide/click or PDF page for rendered findings. Distinguish source-only coverage from
visual evidence. During a requested audit, report only. If a fix or migration is
already authorized, apply the corresponding correction, including a necessary shared
macro, without a second approval request. Ask only when the intended mathematical
meaning or editorial direction is unresolved. Preserve unrelated formatting and
check affected recap/shared consumers when a correction changes their interface.
