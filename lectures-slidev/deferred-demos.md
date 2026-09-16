# Deferred Slidev demonstrations

## KL: reused in Lecture 5

Author decision, 2026-09-11: remove the additional KL illustration from Lecture 1
and keep it for the GAN discussion. The matching existing frame is
**Jensen-Shannon vs Kullback-Leibler Divergences** in
`lectures/lecture5/Lecture5.tex`, immediately after **Mode Collapse**.
It already compares a two-Gaussian target and a single-Gaussian model.

The 2026-09-15 migration integrated the plot in
[`lecture5/slides.md`](lecture5/slides.md): slide 17 retains the divergence
definitions and original JSD illustration; slide 18 continues the same source
frame with the interactive forward/reverse KL comparison. Reverse-KL fitting is
not identified with GAN training.

`lecture5/components/KLDemo.vue` and `lecture5/lib/kl-demo.mjs` are copies of the
preserved originals in `deferred/kl/`. The numerical tests remain in the shared
test suite. Both PDFs include the forward optimum and a reverse-KL minimum;
controls, reset, keyboard input and state on return were checked in Lecture 5.
Current evidence is in [`lecture5/migration.md`](lecture5/migration.md).

The former Lecture 1 insertion is preserved below as historical reuse context;
its sourceFrame and speaker note are superseded by the Lecture 5 integration.

```md
---
clicks: 0
sourceFrame: "extension: 27"
class: interactive-slide
---

# Two KL Objectives, One Restricted Model

$$
\pd(x)=\tfrac12\cN(x\mid-2,0.55^2)+\tfrac12\cN(x\mid2,0.55^2),\qquad
\pt(x)=\cN(x\mid\mu,\sigma^2).
$$

<KLDemo />

<!-- Ask where one Gaussian should go. Move its mean and width, then fit forward KL and the two symmetric reverse-KL minima. Forward fitting matches mean and variance; reverse fitting uses numerical minimization. These are properties of this example and restricted family, not universal laws for all models. Continue to the unchanged MLE derivation. About one to two minutes. -->

```
