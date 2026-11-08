---
name: recap-sync
description: Check both coverage of new lecture material in the next Recap and fidelity of existing recap content in Slidev. Use for topic moves, substantive edits, or recap review/synchronization; preserve approved differences and apply an explicitly requested fix direction.
---

# Recap sync

Read [shared context](../lecture-audit/references/formats.md)
first. Build each Recap by selecting the main blocks, statements and formulas
from the previous lecture’s slides. Copy each excerpt verbatim. Omit intermediate
derivations, explanations and secondary details. Keep the original assumptions,
definitions and citations needed to understand the selected result.

## Select the pair

A number N means body N to recap N+1. An explicit incoming check means N−1 to N.
For a diff, inspect the body changes and any changed recap; identify the corresponding
neighbor. Use the current approved Slidev pair and state both source paths. Do not skip the incoming recap on a full named-lecture audit
just because there is no diff. Skip nonexistent neighbors and respect draft status.

For a topic moved, split, or deferred between lectures, first use the
[topic-transfer procedure](references/topic-transfer.md). A single N to N+1 pair
is insufficient: resolve the source and destination dependencies, and account for
the old recap items before removing or replacing them.

## Check coverage from body to recap

Before matching existing recap blocks, inventory the previous lecture's substantive
changes: new or removed sections, methods, parameterizations, algorithms, and revised
takeaways. Use the requested diff plus the current Outline, Summary, body and relevant
author decisions. For a retrospective check, state the baseline or history
examined; an empty working diff does not mean there is no new material to review.

For each changed teaching unit, record its body location and one disposition:

- **Covered:** name the recap slide/block that recalls its key result accurately,
  including the definitions, assumptions and notation needed to use it. A matching
  equation with undefined symbols or missing conditions is only partial coverage.
- **Missing:** a new core result or prerequisite has no recap representation.
- **Intentionally omitted:** give the pedagogical reason and any explicit author
  decision; distinguish a documented decision from the reviewer's recommendation.

A new section or a new Summary takeaway always needs an explicit disposition.
An unchanged successor recap is not evidence that it remains complete. Do not treat
an earlier agent's "no recap change needed" as author approval. Conversely, a recap
need not repeat every example, demo, proof or implementation detail. Judge omissions
by the lecture's main takeaways and what the successor needs; do not add slides merely
to mirror its table of contents. Missing core coverage remains a finding even when
all existing formulas match.

## Check fidelity from recap to body

1. Find the actual `Recap of Previous Lecture` slides near the start. Use
   Slidev headings/frontmatter, not a generic slice that also treats
   every Outline or introductory remark as recap content.
2. Locate the exact passage for every retained heading, statement, algorithm
   step and formula in the previous lecture’s visible content, including its
   Summary and any displayed component used as a source.
3. Compare the wording and the complete formula with that passage. Flag
   paraphrases, newly written transitions and algebraically equivalent rewrites.
   Allow presentation-only changes such as whitespace, line breaks, heading
   levels and removal of reveal directives. Preserve notation, conditioning,
   indices, signs and the source citation.
4. Compare figures by content/provenance (hashes for unchanged copies), not only
   filename. Recap assets belong in its own local directory or in the shared theme.
5. A new recap item with no matching body content is an orphan; a real equation or
   notation difference is drift. Distinguish these from approved
   edits and inherited source issues. Keep mathematical
   inconsistency visible even if the source checker passes.
6. When visual review is in scope, compare repeated notation/blocks in browser and
   PDF using CLAUDE.md shared-style rules and the approved Lecture 1 reference.
   Source agreement alone does not prove consistent rendered typography.

## Report or fix

Every recap slide must be fully visible on entry, including Training/Sampling.
Check Slidev frontmatter for `clicks: 0`, with no `v-click`, `v-after`,
click-dependent visibility, or other gradual reveals. Preserve the complete final content and layout when
removing reveals; verify the initial state and return from the neighboring slide.
This overrides general body-slide animation rules. Author decision, 2026-10-11.

When fixing coverage, prefer adding the missing result to an existing recap slide
on the same topic. Add a new slide only when the existing slide has no readable
space or the addition would mix distinct topics. Preserve complete formulas and
the approved font sizes; do not cram content or broadly reorganize recaps just to
meet a slide count. There is no numeric cap. For any added slide, record
why extending an existing one was unsuitable. Author decision, 2026-10-11.

For every mismatch give both absolute source locations and the concrete difference.
Summarize matches, introduced mismatches, inherited issues, and missing evidence.
Defer general formatting findings to notation-lint to avoid duplicate reporting.
Report **coverage** and **fidelity** separately, with a compact body-to-recap mapping
for substantive changes (or all current teaching units in a full retrospective).
Do not report synchronization as passed when coverage has not been checked or a
required addition remains unresolved. Source/PDF freshness proves the inspected
revision, not completeness of the recap. Reused evidence must cover both dimensions.

A check stays report-only. If the user explicitly requested copying the agreed body
into the recap, or the reverse, apply that direction without asking again. For authorized fixes, preserve unrelated content. Ask only when the intended source or content
is unresolved. A substantial body change may require an editorial decision about
recap emphasis in addition to formula synchronization; identify that separately.
