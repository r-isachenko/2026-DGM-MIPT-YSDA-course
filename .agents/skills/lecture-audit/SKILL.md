---
name: lecture-audit
description: Audit course lectures in Beamer or Slidev, including notation, both recap directions, Summary, schedule, and Slidev PDF/browser evidence. Use for a full lecture check or migration verification; respect source-only or diff-only scope.
---

# Lecture audit

Read [shared context and format selection](references/formats.md) first. This is
the report-only umbrella check for both lecture formats. For an actual conversion,
use [slidev-migrate](../slidev-migrate/SKILL.md); audit findings do not cancel the
parent task's authorization to fix migration defects.

## Source checks

Resolve lecture(s), format(s), diff/full scope, and approved source baseline before
starting workers. Use parallel subagents for independent source checks when available,
respecting the concurrency limit; run remaining checks sequentially. Pass each worker
the resolved targets, scope, author decisions, and report-only mode. Each worker reads
its own skill and the shared context. Workers must not run competing builds or exports.

1. [notation-lint](../notation-lint/SKILL.md) on the selected sources.
2. [recap-sync](../recap-sync/SKILL.md), N to N+1, when a successor exists.
3. Incoming recap N−1 to N for a full named-lecture audit, or when the recap changed
   in a diff audit; skip N = 1. Use the format selection rules for mixed neighbors.
4. [summary-sync](../summary-sync/SKILL.md) on lecture N.
5. [readme-sync](../readme-sync/SKILL.md) for the selected lecture rows and, for
   Slidev, the corresponding entries in its artifact catalog.

For Slidev migration verification also inspect sourceFrame coverage, automatic
Outline transitions, clicks, assets, and approved deviations against Beamer and the
migration record. Do not rely on the total page count as a per-state equivalence check.

## Rendered evidence

This stage applies to a full Slidev audit or an explicit PDF/visual request. A request
limited to source, one issue, or a diff stays within that scope; identify what was not
checked. A Beamer source audit does not become a new PDF rebuild by default.

- Review the relevant current exports, using the `pdf` skill for reading/rendering.
  A full Slidev migration audit reviews all pages of both PDFs, with dense content
  inspected at full size. Use the slide map to locate reveal states. If either PDF
  is absent or freshness cannot be established, report the gap; do not export in
  report-only mode or certify an older artifact from a matching page count alone.
- Compare recurring notation and recap blocks with the approved Lecture 1 and the
  relevant previous Slidev lecture in PDF and browser, as required by MIGRATION §3.
  Record the actual pairs and formats inspected. Check source-footnote clearance,
  clipping, overlap, hidden future material, and a self-contained handout.
- One coordinator owns browser inspection. Use a suitable running local server or
  start an isolated inspection session only when it will not conflict with other
  Slidev activity. Read current inspector limits; test missing interactions manually.
  Report unavailable browser/device checks instead of declaring them passed.
- Shared mechanism changes require checking their consumers under MIGRATION §7.
  Reuse current evidence only when it demonstrably covers the same source revision
  and scope. Browser success does not prove physical tablet/projector behavior.

## Report

Merge and deduplicate source and visual findings with absolute clickable locations.
State the selected source formats and scope. Separate migration defects, inherited
editorial issues, approved differences, and missing verification. Give a compact status
for notation, incoming/outgoing recap, Summary, schedule/catalog, PDF, and browser;
use not applicable or not checked where appropriate. An audit with missing required
evidence is incomplete, even when source checks pass. Do not edit the migration record
or end with a mandatory permission question. If correction was already requested,
return findings to the parent workflow so it can apply the authorized fixes.
