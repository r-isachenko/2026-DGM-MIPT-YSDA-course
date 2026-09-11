# Course context carried over from Claude

Migrated 2026-09-05 from the project’s saved memory. Current sources and the author’s newer instructions take precedence over dated status notes.

## Durable author preferences

- Keep Outline slides strictly for the agenda. Never add notation, definitions, explanations, or other lecture content to them.
- `lectures/merged/` is managed by the author. Never run `merge_lectures.py`, rebuild, edit or sync that directory without an explicit request. This overrides the suggestion in `CLAUDE.md` §7.
- An explicit request to commit is sufficient authorization within the requested scope; review the diff and commit without another confirmation. Keep commit and PR text free of agent attribution.
- Use existing shared LaTeX conventions and the five project skills. Do not apply old broad shell allowlists as Codex permission policy.

## Known course state

- As recorded 2026-08-30, Lecture 14 was unfinished. Check its current status before treating it as authoritative or propagating its draft content into other lectures; expected draft recap/summary/README gaps are not urgent defects by themselves.
- The full consistency audit (groups 01–20 and 12 author decisions) finished 2026-09-02. The author deleted `audit-groups/`; do not recreate it or re-propose settled changes merely from old audit notes. Current lecture sources are the post-audit baseline. Examples: `\qagg` carries `\bphi`, transition noise is `\bepsilon_t`, annealed Langevin uses two-index `\bx_t^l`, the DSM duplicate frame in Lecture 6 is intentional.
- For course-refresh work, read the relevant lecture section of `reading-notes/course-refresh-report-2026.md` first. Timing source: `План курса 2026 MIPT&YSDA.xlsx`, sheet «Стало». Recorded target: 75 min per lecture, L13 50 min; L14 not planned there. Scenario A keeps lecture boundaries; scenario B requires the author’s choice. Do not automatically execute recommendations merely because this context file mentions them.

## Slidev editorial decisions

- Use `Sampling` (introduced as `Sampling (generation)`) and `Density evaluation` for the two operations on a fitted model. Reserve `Density estimation` for learning the density from data. Label performance assessment `Model quality evaluation`. Keep ordinary application names such as image/video generation and original paper titles intact.
- 2026-09-11: Keep Lecture 1’s histogram on its original single frame; replace only the image with an interactive histogram whose sample count is 10 / 100 / 1000 / 10000.
- 2026-09-11: Defer the interactive two-Gaussian forward/reverse KL plot to the GAN discussion. The matching existing frame is “Jensen-Shannon vs Kullback-Leibler Divergences” in Lecture 5, after “Mode Collapse”. Remove the additional example from Slidev Lecture 1, preserving its original KL definitions and MLE derivation. Keep the component, numerical tests, and reuse notes in `lectures-slidev/deferred-demos.md`; do not insert it into Lecture 5 until working on that migration.
- 2026-09-11: Keep the original Beamer lectures in `lectures/` and maintain Slidev in parallel under `lectures-slidev/lectureN/`. Use one course dependency installation and a shared local `theme/`; each lecture owns `slides.md`, `public/figs/`, its demos, and its migration record. Do not remove the Beamer version without a separate author decision.
- 2026-09-11: Finish every migration with `npm run finalize -- N` from `lectures-slidev/`, then render and visually review both PDFs. Commit `lectureN/LectureN.pdf` (all reveals) and `lectureN/LectureN-handout.pdf` with the completed migration. Keep temporary exports, web builds, and QA outputs out of Git.
