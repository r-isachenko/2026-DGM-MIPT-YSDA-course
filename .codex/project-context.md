# Course context carried over from Claude

Migrated 2026-09-05 from the project’s saved memory. Current sources and the author’s newer instructions take precedence over dated status notes.

## Durable author preferences

- `lectures/merged/` is managed by the author. Never run `merge_lectures.py`, rebuild, edit or sync that directory without an explicit request. This overrides the suggestion in `CLAUDE.md` §7.
- Before each commit, show the diff/result and wait for confirmation; keep commit and PR text free of agent attribution.
- Use existing shared LaTeX conventions and the five project skills. Do not apply old broad shell allowlists as Codex permission policy.

## Known course state

- As recorded 2026-08-30, Lecture 14 was unfinished. Check its current status before treating it as authoritative or propagating its draft content into other lectures; expected draft recap/summary/README gaps are not urgent defects by themselves.
- The full consistency audit (groups 01–20 and 12 author decisions) finished 2026-09-02. The author deleted `audit-groups/`; do not recreate it or re-propose settled changes merely from old audit notes. Current lecture sources are the post-audit baseline. Examples: `\qagg` carries `\bphi`, transition noise is `\bepsilon_t`, annealed Langevin uses two-index `\bx_t^l`, the DSM duplicate frame in Lecture 6 is intentional.
- For course-refresh work, read the relevant lecture section of `reading-notes/course-refresh-report-2026.md` first. Timing source: `План курса 2026 MIPT&YSDA.xlsx`, sheet «Стало». Recorded target: 75 min per lecture, L13 50 min; L14 not planned there. Scenario A keeps lecture boundaries; scenario B requires the author’s choice. Do not automatically execute recommendations merely because this context file mentions them.
