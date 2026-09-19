---
name: recap-sync
description: Compare a lecture body with the next lecture's Recap in Beamer, Slidev, or a mixed migration pair. Use after relevant edits or for recap review/synchronization; preserve approved differences and apply an explicitly requested fix direction.
---

# Recap sync

Read [shared context and format selection](../lecture-audit/references/formats.md)
first. Recap elements mirror the relevant body definitions, equations, block titles,
algorithms, figures, and sources. Existing concise recap wording is not a reason to
expand it into the entire original slide.

## Select the pair

A number N means body N to recap N+1. An explicit incoming check means N−1 to N.
For a diff, inspect the body changes and any changed recap; identify the corresponding
neighbor. Use the shared rules to choose Beamer, Slidev, or a mixed pair and state
both source paths. Do not skip the incoming recap on a full named-lecture audit
just because there is no diff. Skip nonexistent neighbors and respect draft status.

## Compare

1. Find the actual `Recap of Previous Lecture` frames/slides near the start. Use
   TeX frames or Slidev headings/frontmatter, not a generic slice that also treats
   every Outline or introductory remark as recap content.
2. For each block or standalone equation, locate its source in the previous body.
   Start with an exact title/LHS match, then inspect context and approved renames.
   A title that is not found verbatim is not yet proof of an orphan block.
3. Compare formulas, assumptions, indices, parameters, operators, block/algorithm
   names, and the associated source citation. Normalize only harmless markup and
   whitespace; do not normalize away signs, subscripts, conditioning, or scope.
   Account for equivalent TeX/KaTeX layout and the approved terminology policy.
4. Compare figures by content/provenance (hashes for unchanged copies), not only
   filename. Recap assets belong in its own local directory or in the shared theme.
5. A new recap item with no matching body content is an orphan; a real equation or
   notation difference is drift. During migration, distinguish these from approved
   Slidev edits and inherited source issues. Keep either format's mathematical
   inconsistency visible even if the source checker passes.
6. When visual review is in scope, compare repeated notation/blocks in browser and
   PDF using MIGRATION §3. A mixed pair can establish content agreement but does not
   by itself prove cross-Slidev typography; use the approved Slidev reference as well.

## Report or fix

For every mismatch give both absolute source locations and the concrete difference.
Summarize matches, introduced mismatches, inherited issues, and missing evidence.
Defer general formatting findings to notation-lint to avoid duplicate reporting.

A check stays report-only. If the user explicitly requested copying the agreed body
into the recap, or the reverse, apply that direction without asking again. During an
authorized migration, repair migration drift in the new source; do not silently
rewrite the preserved Beamer baseline. Ask only when the intended source or content
is unresolved. A substantial body change may require an editorial decision about
recap emphasis in addition to formula synchronization; identify that separately.
