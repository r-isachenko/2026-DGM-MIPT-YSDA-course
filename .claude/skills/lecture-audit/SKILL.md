---
name: lecture-audit
description: Run the full consistency audit for a lecture (or the current git diff) in one shot — notation-lint, recap-sync in both directions, summary-sync, and readme-sync — via parallel subagents, then merge everything into one report. Use after finishing edits to a lecture, before committing, or when the user asks to "audit lecture N", "check lecture N fully", "прогони все проверки".
---

# lecture-audit

Umbrella check that runs all four project checks for a lecture and merges their findings into a single report. It is **report-only**: apply fixes only after the user confirms, following each individual skill's own rules about direction-of-fix and confirmation.

## Inputs

- Lecture number `N` (e.g. "lecture-audit 10") → audit `lectures/lectureN/LectureN.tex`.
- No argument → infer the affected lecture(s) from `git diff --name-only`; audit each modified lecture.

## Procedure

Launch the checks as **parallel subagents** (they are independent). Each subagent must Read the corresponding SKILL.md in [.claude/skills/](../) and follow it in report-only mode:

1. **notation-lint** on lecture N (diff-restricted if the audit was inferred from a diff, full-file if the user named the lecture).
2. **recap-sync N → N+1** — does lecture N+1's recap still mirror lecture N's body? Skip if N is the last lecture.
3. **recap-sync N−1 → N** — if lecture N's own recap region (before the first `\section`) was touched, does it still mirror lecture N−1? Skip if N = 1 or the recap region is untouched.
4. **summary-sync** on lecture N.
5. **readme-sync** for lecture N only.

## Merged report

Combine the subagent reports into one, grouped by check, keeping each check's `path:line` references. Deduplicate overlaps (e.g. a style violation inside a recap frame may be reported by both notation-lint and recap-sync — report it once, under notation-lint).

End with a single summary line ("notation: N findings, recap: M mismatches, summary: OK, README: OK") and — if anything was found — one consolidated question: which findings to fix. Respect each skill's rules when applying: recap-sync and summary-sync never pick a fix direction unilaterally; notation-lint never adds macros to `newcommands.tex` without showing them first.
