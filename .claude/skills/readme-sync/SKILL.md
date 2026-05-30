---
name: readme-sync
description: Verify that the README.md "Materials" table bullets agree with each LectureN.tex's \section{...} titles, per CLAUDE.md §7. Use after renaming/adding/removing a \section in any lecture, or when the user asks to "sync README", "check README matches lectures", "regenerate the schedule bullets". Can also apply fixes to README from the current .tex section list.
---

# readme-sync

[README.md](../../../README.md) holds the canonical course schedule. The bullets under each lecture's `<b>Lecture N:</b><ul>...` in the `Materials` table mirror the `\section{...}` structure of `lectures/lectureN/LectureN.tex`. These two must never disagree — see [CLAUDE.md](../../../CLAUDE.md) §7.

Note: in the current README, the `Materials` table is wrapped in an HTML comment (`<!--- ... -->`) so it doesn't render publicly while the schedule is being finalized. **Treat the commented content as authoritative for now** — that's the working schedule. Don't unwrap the comment or strip it.

## Inputs

- If the user passes a lecture number, check just that one.
- If no argument, check all lectures in [lectures/](../../../lectures/).
- The `--fix` flag (or "fix it" in natural language) means apply edits to README.md. Without it, report only.

## Procedure

### Step 1 — extract sections from each lecture

```bash
grep -n '^\\section\{' lectures/lectureN/LectureN.tex
```

Capture the title inside `{...}`. Also handle nested `\subsection{...}` — README typically nests these under a `<ul>` inside the parent `<li>`, mirroring the outline frame layout (see existing `Lecture 1` bullet for the pattern: an `<li>` containing a nested `<ul>` with `<li>` children).

### Step 2 — extract bullets from README

Find the row for each lecture in the `Materials` table. The pattern is:

```
| N | <date> | <b>Lecture N:</b><ul><li>...</li><li>...</li></ul> | ...
```

Parse the `<ul>` immediately after `<b>Lecture N:</b>`. Each top-level `<li>` corresponds to a `\section`; nested `<ul><li>...</li></ul>` corresponds to `\subsection`s.

Watch for HTML entities (`&amp;`, `&lt;`) and the existing pluralizations/casings — don't normalize them away.

### Step 3 — diff

For each lecture, produce a side-by-side comparison:

```
Lecture 10
  README                            | .tex \section
  ----------------------------------+------------------------------------
  Probability Flow ODE              | Probability Flow ODE             ✓
  Reverse SDE                       | Reverse SDE                      ✓
  Score-Based Generative Models …   | Score-Based Generative Models …  ✓
  Flow Matching (FM)                | Flow Matching (FM)               ✓
```

Flag any of:

- README bullet present, no matching `\section`
- `\section` present, no matching README bullet
- Title text mismatch (rename in either direction)
- Order mismatch (sections reordered in `.tex` but not in README, or vice versa)

For subsection mismatches, report them nested under the parent section.

### Step 4 — report or fix

**Report mode (default):** print the diff above for each lecture with mismatches, then a one-line summary "M lectures out of sync".

**Fix mode (`--fix`):** the `.tex` is the source of truth for the Materials list (renames typically happen in the slides first). Regenerate the bullet structure for the affected lectures' README rows from their `\section{...}` (and `\subsection{...}`) lists, preserving the surrounding `<b>Lecture N:</b>`, date column, and the trailing `[slides](...)` link untouched. Show a unified diff of the proposed README edit and ask the user to confirm before writing.

If the `.tex` direction is *not* obviously the right one (e.g. README has a section title the lecture doesn't, suggesting a rename in the lecture that lost information), do NOT auto-fix — ask which direction to apply.

## Caveats

- Lecture numbering in the README does not always equal the row number — e.g. the table currently has "Lecture rescheduled" placeholder rows. Match on the `<b>Lecture N:</b>` tag, not the leftmost `|N|` column.
- Some `.tex` sections may legitimately be omitted from README for brevity (e.g. an `Outline` or `References` section), but in this course `\section` corresponds 1:1 to a Materials bullet — if you find unmapped sections, flag them rather than silently dropping them.
- Don't reflow the README's Markdown — keep line breaks and indentation as-is around your edits (CLAUDE.md §9).
- Don't touch the `Homeworks` table, the `Game rules` section, or the `Previous episodes` list.
