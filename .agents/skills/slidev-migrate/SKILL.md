---
name: slidev-migrate
description: Migrate or finish migrating a course Beamer lecture to the shared Slidev project, preserving content, reveals, Lecture 1 style, and both PDF exports. Use for lecture conversion and substantive migration follow-ups, not standalone PDF or PowerPoint authoring.
---

# Slidev migration

Read [MIGRATION.md](../../../lectures-slidev/MIGRATION.md) for the course rules and
workflow, and [shared lecture context](../lecture-audit/references/formats.md) for
source/format selection and evidence handling. Commands are in the
[Slidev README](../../../lectures-slidev/README.md).

Apply the workflow to the requested scope. For a narrow follow-up, repeat the affected
checks; for a request to finish migration, complete all of MIGRATION §7.
Reuse passing checks only when their source revision and coverage are unchanged.
Preserve existing work; an existing Slidev directory does not prove completion.

Use [lecture-audit](../lecture-audit/SKILL.md) to coordinate notation, both Recap
directions, Summary, and README checks in Slidev mode. During migration, audit
workers report findings; the parent applies authorized migration fixes.
Ask only about unresolved editorial choices, not already authorized corrections.

When inspecting exported PDF pages, load the available `pdf` skill for rendering and
visual QA. Generate and correct course PDFs through Slidev's existing source pipeline.
Follow the shared context's rules for coordinating dev/build/export with other tasks
and reporting missing browser, PDF, or device evidence.

Report the resulting artifacts, meaningful validation, and unresolved limits.
