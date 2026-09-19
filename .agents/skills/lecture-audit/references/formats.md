# Shared context for course lecture skills

Read this once per task before a project lecture check. It defines target selection
and format handling for the five checks; it does not replace the course rules.
Paths below are relative to the repository root unless a Markdown link says otherwise.

## Authority and scope

Read [CLAUDE.md](../../../../CLAUDE.md) and
[project-context.md](../../../../.codex/project-context.md). For any Slidev target,
also read [MIGRATION.md](../../../../lectures-slidev/MIGRATION.md).
Keep general migration policy there, not copies here.

A check/audit is report-only. An explicit fix, sync direction, or migration request
already authorizes the corresponding work. Apply an agreed correction without
asking again; ask only for an unresolved editorial choice. Report-only checks may
write temporary QA files, but must not edit lecture sources, journals, final PDFs,
README, or regenerate exports. Never touch `lectures/merged/` without an explicit
request. Do not treat a missing build environment as permission to change dependencies.

Choose the smallest scope that answers the request:

1. An explicit path or format (`beamer`, `slidev`, `both`) wins. A course PDF maps
   to its adjacent source format. A PDF-only visual question does not request a
   complete source audit or migration.
2. Otherwise use the ongoing task's format; a Beamer-to-Slidev migration targets
   Slidev and uses Beamer as a reference.
3. For a diff, or a lecture check with no target/context, combine staged, unstaged,
   and untracked sources (`git diff --name-only`,
   `git diff --cached --name-only`, `git ls-files --others --exclude-standard`).
   Inspect relevant changes, including deletions, not just the filenames. An
   untracked `lectureN/slides.md` is a new lecture, not an empty diff.
   If there are no relevant changes, report that no lecture target was found.
4. For a numbered audit without format context, inspect the existing versions.
   If both exist, check both and label findings by format. For a write whose
   direction remains ambiguous, resolve that choice before overwriting either.

A named lecture gets a full source check. A diff check focuses on changed lines
plus the containing frame/slide and affected interfaces; a new source gets a full
check. Changes to shared notation, theme, components, or export may affect several
lectures: determine consumers instead of silently ignoring the change. Documentation
or journal edits alone do not require rebuilding every lecture. Skip `utils`,
`supplementary`, generated files, and QA output as lecture targets; shared source
changes can still require checking their consumers. For a whole-schedule README
request, check all applicable lecture rows rather than relying on the diff.

## Source and structure

| Item | Beamer | Slidev |
|---|---|---|
| Editable source | `lectures/lectureN/LectureN.tex` | `lectures-slidev/lectureN/slides.md` and any included source |
| Structure | `\section`, `\subsection`, explicit frames and preamble-generated Outline | Slide frontmatter, headings, `sourceFrame`, `clicks`, `slide-map.json`; Outline transitions mapped to source sections |
| Recap | Frames titled `Recap of Previous Lecture` before the first section | Slides with that title before the first body section; distinguish them from the initial Outline |
| Summary | Final frame titled `Summary` | Logical slide titled `Summary`, normally final |
| Blocks / steps | `block`, `enumerate` / `\item` | Block containers / headings, Markdown or HTML ordered lists |
| References | `\myfootnotewithlink` / `\myfootnote` | Visible source block and links, normally `.source` with anchors |
| Local images | `figs/...` | `/figs/...` in `public/figs/`; shared assets imported by theme components |
| Export | Adjacent `LectureN.pdf` | `LectureN.pdf` with reveals and `LectureN-handout.pdf` |

Do not split Slidev Markdown on every `---` without respecting YAML, fenced code,
notes, and included sources. Use the installed parser when appropriate or inspect
boundaries with context. Count logical slides and top-level list items, not PDF
pages, nested bullets, repeated Outline agendas, or lines of a display equation.
Do not infer section titles from every slide heading: use actual section transitions,
source hierarchy, and documented author changes. If the hierarchy is unclear, report
that uncertainty instead of inventing one.

Read `lectureN/migration.md` when it exists. A Slidev migration preserves its Beamer
baseline plus explicitly approved changes; approved terminology or a documented
addition is not a defect merely because Beamer differs. Proposals and old successful
QA records are not current approval or proof of a fresh export. Preserve original
Beamer files unless a change to them is requested. An inherited source issue is an
editorial observation, not a newly introduced migration error.

For cross-lecture checks, a Beamer-only request compares Beamer to Beamer. A Slidev
check uses the current agreed Slidev counterpart when available, otherwise the
neighboring Beamer source, and states the formats compared. Inspect the counterpart's
status; an existing draft is not automatically authoritative. If body and recap
conflict beyond approved changes, report both locations and the unresolved direction.
Lecture 1 has no incoming recap; skip a nonexistent successor. Observe the course's
draft-lecture caveats from project-context rather than inferring completion by number.

## Evidence and tools

Use the existing commands from [Slidev README](../../../../lectures-slidev/README.md).
`npm run check -- N` checks source structure and known conventions; it does not prove
mathematical equivalence or rendered consistency. Read current tool limitations
before interpreting a pass. Use available read-only checks and inspect sources even
if a renderer or dependency is unavailable; mark the missing coverage explicitly.

Load the available `pdf` skill when inspecting actual PDF pages. Use it for rendering,
text extraction, and visual QA. Course PDFs are generated artifacts: fixes belong in
TeX, Markdown, components, or the shared theme and are exported by that format's
existing pipeline. Generic PDF authoring, output-directory, typography, or PowerPoint
defaults must not replace the author's course rules. Use existing `pypdfium2` rendering
when Poppler is unavailable; locate bundled runtimes before proposing installation.
For standalone PDFs or PPTX/Google Slides outside this course, use their own skills.

A full Slidev audit needs source checks, existing PDF review, and browser evidence.
A source-only request can stop after source checks and say so. Do not call `finalize`
from a report-only audit: missing/stale exports are findings, not permission to
replace them. For an authorized migration/fix, the parent workflow owns finalization.
Only one worker owns Slidev dev/build/export at a time across the shared project.
Do not stop another task's active server or overwrite its artifacts; coordinate or
report the unavailable check. Never claim device, PDF, or browser validation from
source text alone.

For each finding include the format, absolute source path and line, slide/frame or
PDF page when relevant, observed mismatch, and concrete correction. For comparisons,
link both sides. Distinguish introduced defects, inherited issues, approved differences,
and checks not performed. Deduplicate these categories in an umbrella report; do not
turn every report into a permission question.
