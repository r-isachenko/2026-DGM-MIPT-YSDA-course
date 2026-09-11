# Codex — DGM MIPT & YSDA 2026

Before editing, read `CLAUDE.md`: it is the shared course convention reference. Its name is retained for compatibility. Also read `.codex/project-context.md` for the author’s later decisions; these resolve conflicts with the older reference.

Project skills are in `.agents/skills/`: `lecture-audit`, `notation-lint`, `recap-sync`, `summary-sync`, `readme-sync`. Read the matching skill before performing its workflow. Use the available Codex tools; `.claude/skills/` is the preserved previous version.

For Beamer-to-Slidev migration, read `lectures-slidev/MIGRATION.md` before editing. It defines the working migration rules, including reveal semantics, tablet annotations, shared sources, and verification; unfinished prototype features are explicitly marked.

- Do not touch, rebuild or sync `lectures/merged/` unless explicitly requested.
- An explicit request to commit authorizes the commit within the requested scope; do not ask for another confirmation. Review the resulting diff before committing. Do not add agent attribution to commit messages or PR descriptions.
- Keep lecture content in English; Russian is welcome in chat and internal notes.
- User instructions for the current task take precedence over skill recommendations. A request to audit is report-only; an explicit request to apply a specified fix already authorizes that fix. Ask only about unresolved editorial choices or missing facts.
