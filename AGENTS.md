# Codex — DGM MIPT & YSDA 2026

Before editing, read `CLAUDE.md`: it is the shared course convention reference. Its name is retained for compatibility. Also read `.codex/project-context.md` for the author’s later decisions; these resolve conflicts with the older reference.

Project skills are in `.agents/skills/`. Use [slidev-migrate](.agents/skills/slidev-migrate/SKILL.md) for a Beamer-to-Slidev conversion or migration follow-up, and [lecture-audit](.agents/skills/lecture-audit/SKILL.md) for a full check. `notation-lint`, `recap-sync`, `summary-sync`, and `readme-sync` support both Beamer and Slidev; read the matching skill and its shared format context before checking. An explicit format/path or the active migration determines the target; do not silently audit only the `.tex` counterpart of a Slidev lecture. `.claude/skills/` is the preserved previous version.

For course PDFs, use the available `pdf` skill for reading, rendering, and visual inspection alongside the project checks. Generate and fix them through the existing Beamer/Slidev sources and build commands. Generic PDF/PowerPoint authoring defaults do not replace the course's style, export paths, or reveal requirements.

For every Beamer-to-Slidev migration, read [lectures-slidev/MIGRATION.md](lectures-slidev/MIGRATION.md) before editing. It is the single course-wide migration workflow and completion checklist. Commands are in [README.md](lectures-slidev/README.md); lecture-specific decisions and verification history belong in `lectureN/migration.md`.

- All lectures must strictly share the author's approved Slidev Lecture 1 style. Apply the rendered-style comparison and shared-change checks in `lectures-slidev/MIGRATION.md` §§3, 7; a new lecture does not authorize a new course style.

- Do not touch, rebuild or sync `lectures/merged/` unless explicitly requested.
- An explicit request to commit authorizes the commit within the requested scope; do not ask for another confirmation. Review the resulting diff before committing. Do not add agent attribution to commit messages or PR descriptions.
- Keep lecture content in English; Russian is welcome in chat and internal notes.
- User instructions for the current task take precedence over skill recommendations. A request to audit is report-only; an explicit request to apply a specified fix already authorizes that fix. Ask only about unresolved editorial choices or missing facts.
