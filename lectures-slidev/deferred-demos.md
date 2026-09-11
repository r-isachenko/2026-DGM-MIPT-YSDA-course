# Deferred Slidev demonstrations

## KL: reuse in the GAN lectures

Author decision, 2026-09-11: remove the additional KL illustration from Lecture 1
and keep it for the GAN discussion. The matching existing frame is
**Jensen-Shannon vs Kullback-Leibler Divergences** in
`lectures/lecture5/Lecture5.tex`, immediately after **Mode Collapse**.
It already compares a two-Gaussian target and a single-Gaussian model.

Retain `deferred/kl/components/KLDemo.vue`, `deferred/kl/lib/kl-demo.mjs`, and its numerical tests.
When migrating that frame, reuse the interactive plot in place of its KL
illustrations. The component currently compares forward and reverse KL only;
the existing JSD part still needs its own illustration. Do not equate reverse-KL
minimization with GAN training. No changes to Lecture 5 are requested yet.

The former Lecture 1 example is preserved below for reuse. Adapt sourceFrame
and the speaker note to Lecture 5, and verify layout, controls, and PDF there.

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
