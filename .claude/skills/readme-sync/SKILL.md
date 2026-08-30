---
name: readme-sync
description: Verify that the README.md "Materials" table bullets agree with each LectureN.tex's \section{...} titles, per CLAUDE.md ("README as the schedule source of truth"). Use after renaming/adding/removing a \section in any lecture, or when the user asks to "sync README", "check README matches lectures", "regenerate the schedule bullets". Can also apply fixes to README from the current .tex section list.
---

# readme-sync

[README.md](../../../README.md) holds the canonical course schedule. In the `Materials` table, each lecture row's `<b>Lecture N:</b><ul>...</ul>` bullets mirror the `\section{...}` structure of `lectures/lectureN/LectureN.tex`: each top-level `<li>` corresponds to a `\section`, and a nested `<ul><li>...</li></ul>` inside it corresponds to that section's `\subsection`s. These two files must never disagree — see [CLAUDE.md](../../../CLAUDE.md), section *README as the schedule source of truth*.

Note: in the current README, the `Materials` table is wrapped in an HTML comment (`<!--- ... -->`) so it doesn't render publicly while the schedule is being finalized. **Treat the commented content as authoritative for now** — that's the working schedule. Don't unwrap the comment or strip it.

## Inputs

- If the user passes a lecture number, check just that one.
- If no argument, check all lectures in [lectures/](../../../lectures/).
- The `--fix` flag (or "fix it" in natural language) means apply edits to README.md. Without it, report only.

## Procedure

For each lecture in scope, extract the `\section{...}` / `\subsection{...}` titles from the `.tex` and the bullet structure from its README row, then diff them.

- Match README rows on the `<b>Lecture N:</b>` tag, **not** the leftmost `|N|` column — the table can contain placeholder rows ("Lecture rescheduled") that shift row numbers.
- Preserve HTML entities (`&amp;`, `&lt;`) and existing pluralizations/casings — don't normalize them away when comparing or fixing.

Flag any of:

- README bullet present, no matching `\section`
- `\section` present, no matching README bullet
- Title text mismatch (rename in either direction)
- Order mismatch (sections reordered in `.tex` but not in README, or vice versa)

For subsection mismatches, report them nested under the parent section.

**Report mode (default):** for each mismatched lecture, print a side-by-side comparison (README bullet vs `.tex` section, ✓/✗ per line), then a one-line summary "M lectures out of sync".

**Fix mode (`--fix`):** the `.tex` is the source of truth for the Materials list (renames typically happen in the slides first). Regenerate the bullet structure for the affected lectures' README rows from their `\section{...}` (and `\subsection{...}`) lists, preserving the surrounding `<b>Lecture N:</b>`, date column, and the trailing `[slides](...)` link untouched. Show a unified diff of the proposed README edit and ask the user to confirm before writing.

If the `.tex` direction is *not* obviously the right one (e.g. README has a section title the lecture doesn't, suggesting a rename in the lecture that lost information), do NOT auto-fix — ask which direction to apply.

## Caveats

- Some `.tex` sections may legitimately be omitted from README for brevity (e.g. an `Outline` or `References` section), but in this course `\section` corresponds 1:1 to a Materials bullet — if you find unmapped sections, flag them rather than silently dropping them.
- Don't reflow the README's Markdown — keep line breaks and indentation as-is around your edits (CLAUDE.md, *Style preferences for edits*).
- Don't touch the `Homeworks` table, the `Game rules` section, or the `Previous episodes` list.
