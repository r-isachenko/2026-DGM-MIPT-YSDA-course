---
name: readme-sync
description: Compare the course Materials schedule with Beamer or Slidev section hierarchies, and check the Slidev artifact catalog. Use for schedule/README sync or section changes; an explicit fix direction authorizes the matching README update.
---

# README sync

Read [shared context and format selection](../lecture-audit/references/formats.md)
first. The root [README.md](../../../README.md) is the course schedule;
[lectures-slidev/README.md](../../../lectures-slidev/README.md) is the migrated-artifact
catalog and command guide. They have different roles.

## Scope and source selection

- A lecture number/path limits the check to that lecture. For a general schedule
  request with no target, check all applicable rows. In a lecture audit, use only
  the resolved audit targets, not the whole course.
- Use the explicitly requested source/format, then active task context and approved
  section changes. For Slidev compare the actual migrated hierarchy, its Beamer
  baseline, and the migration record. Do not silently overwrite an approved Slidev
  rename from an older TeX source or propagate Slidev edits into Beamer.
- `--fix`, "sync README from these slides", or an equivalent request authorizes
  the corresponding README edit. A bare check/audit is report-only. If neither
  source direction nor the intended section hierarchy can be resolved, ask about
  that editorial choice while completing independent checks.

## Materials schedule

1. Locate each row by `<b>Lecture N:</b>`, not the leftmost table number; placeholder
   rows can shift positions. Inspect whether the schedule is commented out. Preserve
   any existing comment wrapper and other surrounding markup.
2. Extract ordered section/subsection trees: TeX `\section`/`\subsection`, or Slidev
   section transitions with source hierarchy and documented changes. Repeated
   agenda listings and all individual slide titles are not independent sections.
3. Compare top-level and nested Materials bullets with the chosen hierarchy. Flag
   missing/extra titles, renames, order differences, or incorrectly nested subsections.
   Decode harmless presentation markup for comparison while preserving the original
   HTML entities/case in the output; do not lose mathematical notation in titles.
4. Explain any three-way disagreement among README, Beamer, and Slidev. Classify a
   documented author-approved change separately from an accidental migration drift.

## Slidev catalog

For the migrated lectures in scope, verify links to `slides.md`, both final PDFs,
and `migration.md`; check referenced commands against the current project scripts.
Do not create placeholder rows/directories for unmigrated lectures. A catalog link
can exist before artifacts are ready, but missing/stale PDFs must be reported and
must not be described as verified. Page totals belong in the lecture map/journal,
not a second independently maintained list in README.

## Report or fix

For mismatches show the relevant README location and source location, the current
and expected hierarchy, and the proposed direction. Keep matches concise.

In an authorized fix, update only affected Materials bullets or catalog entries,
preserving date columns, unrelated links, comment wrappers, Homeworks, Game rules,
and surrounding formatting. Review the resulting diff. Do not ask again before
writing a change whose scope and direction are already specified. Source ambiguity
is not permission to pick an arbitrary direction or to modify the other lecture format.
