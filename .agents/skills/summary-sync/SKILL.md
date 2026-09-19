---
name: summary-sync
description: Check Summary coverage, stale takeaways, and length in Beamer or Slidev lectures. Use after substantive content edits or on request; during migration distinguish preserved source choices from newly lost content.
---

# Summary sync

Read [shared context and format selection](../lecture-audit/references/formats.md)
first. Summary is a concise synthesis of the actual lecture, not a verbatim copy of
section titles. Use the current source and approved author decisions.

## Check

1. Locate the final frame/slide titled `Summary`: `\begin{frame}{Summary}` in
   Beamer, the corresponding logical slide heading in Slidev. If missing, determine
   whether it was lost in migration, absent from the source, or still part of a draft.
2. Identify the actual section hierarchy and teaching content. In Slidev, use
   section transitions plus the original hierarchy and approved changes; do not
   count repeated Outline agendas or treat every slide title as a section.
3. Count top-level Summary bullets (`\item`, Markdown items, or HTML list items),
   not wrapped lines or nested lists. Target 5–7; fewer is acceptable when coverage
   is sufficient. Eight or more merits a consolidation suggestion, not an automatic
   deletion. An inherited long/short Summary is not itself a new migration defect.
4. Map conceptual sections to takeaways and check for claims no longer taught.
   A bullet can cover several topics; a takeaway need not literally repeat a
   section title. Check body content before calling a differently named topic stale.
   Preserve documented source choices, such as omitting logistics from takeaways.
5. For a substantive content change, suggest a holistic revision: merge, replace,
   or reword existing bullets before adding another. A pure format migration does
   not authorize inserting a new Training block or new takeaway to satisfy a count.
6. If visual checking is in scope, inspect fit and the common Summary style in the
   relevant PDF/browser. Count alone does not prove readability. Preserve the
   existing reveal behavior; do not add animation to an originally static Summary.

For minor wording/whitespace changes, state that no content update is needed when
coverage is unaffected. Still perform an explicitly requested full Summary check.

## Report or fix

Give the absolute Summary location, bullet count, covered/uncovered/stale topics,
and concrete consolidation proposals only where needed. Separate inherited editorial
choices, actual regressions, and unverified layout. Do not flag every Summary below
five bullets as defective or rewrite one solely to satisfy the target range.

Report-only audits leave sources unchanged. A requested Summary rewrite or an
authorized migration correction permits the corresponding edit without another
confirmation. Ask only about unresolved authorial takeaways or scope changes; do not
end every successful check with an offer or permission question.
