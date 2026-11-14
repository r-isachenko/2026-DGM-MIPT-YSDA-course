# Codex — DGM MIPT & YSDA 2026

Before editing, read `CLAUDE.md` for shared course conventions and
`.codex/project-context.md` for the author's later decisions.

## Learning from slide edits

Use [the author's slide style](CLAUDE.md#authors-slide-style) when drafting
slides, proposing revisions or acting on critique. During an iteration,
apply the author's latest correction to the slide at hand. When the author
states a general preference, or the same reason explains corrections across
slides, update the relevant principle in `CLAUDE.md` as part of that task.
Use the author's feedback and accepted revisions as evidence.
Read the surrounding principles together and merge or replace overlapping
wording. A single local choice of size, color or detail stays with its slide
unless the author gives it wider scope.

If two directions appear to conflict, check which slide role, audience
prerequisite or presentation state each serves. If both apply in the same
situation and imply different edits, tell the author what each would mean
for that slide and ask which should guide future work. Revise the shared
principle once that choice is clear. Briefly mention any change to
the style guide when reporting the slide edit.

## Working on the course

- Slidev sources in `lectures/lectureN/slides.md` are authoritative.
  Each lecture has one fully revealed `LectureN.pdf`; keep browser reveals.
- All lectures share the approved Slidev Lecture 1 style. Commands and artifact
  paths are in `lectures/README.md`.
- Use `.agents/skills/lecture-audit` for a full audit and the notation-lint,
  recap-sync, summary-sync and readme-sync skills for focused checks.
  Read the selected skill and shared context before checking.
- Build every Recap from the previous lecture’s main blocks and formulas.
  Copy them verbatim and omit intermediate derivations and secondary details.
- For a topic move, use recap-sync and its topic-transfer procedure before
  declaring the move complete; include dependent lectures even if not named
  in the request. Preserve source-only or report-only limits.
- Use the PDF skill for reading/rendering course PDFs, generated through the
  existing Slidev sources and commands.
- Do not touch, rebuild or sync `lectures/merged/` unless explicitly requested.
- An explicit commit request authorizes that commit. Review the diff first;
  do not add agent attribution to commits or PR descriptions.
- Before every commit and push follow `.codex/project-context.md`: check affected
  lectures and dependent Recaps, Summary, repeated formulas and Training/Sampling,
  Outline/README and source/PDF freshness, including outgoing committed changes.
  A successful build does not establish semantic consistency.
- Keep lecture content in English; Russian is welcome in chat and internal notes.
- Audits are report-only; an explicit request to apply a fix authorizes that fix.
  Ask only about unresolved editorial choices or missing facts.
