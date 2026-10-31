---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 9"
author: Roman Isachenko
aspectRatio: 16/9
canvasWidth: 1280
colorSchema: light
fonts:
  sans: Arial
  serif: Georgia
  mono: Menlo
  provider: none
transition: none
drawings:
  enabled: true
  persist: false
  presenterOnly: false
  syncAll: true
download: false
info: false
favicon: "data:,"
clicks: 0
id: deep-generative-models
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 9</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
id: recap-of-previous-lecture
class: theorems
---

# Recap of Previous Lecture

$\alpha_t=1-\beta_t$, $\bar\alpha_t=\prod_{s=1}^t\alpha_s$, $\bar\alpha_0=1$; $\tilde\beta_t=\beta_t(1-\bar\alpha_{t-1})/(1-\bar\alpha_t)$.

<div class="block">

## ELBO for Gaussian Diffusion Model

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)&={\color{olive}\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}-{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}\\
&\quad-\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}
\end{aligned}
$$

</div>

$$
\begin{aligned}
q(\bx_{t-1}|\bx_t,\bx_0)&=\cN(\tilde{\bmu}_t(\bx_t,\bx_0),\tilde{\beta}_t\bI),\\
\pt(\bx_{t-1}|\bx_t)&=\cN\bigl(\bmu_{\btheta,t}(\bx_t),{\color{#8854c0}\bsigma_{\btheta,t}^2(\bx_t)}\bigr)
\end{aligned}
$$

For $t\ge2$, fix ${\color{#8854c0}\bsigma_{\btheta,t}^2(\bx_t)=\tilde{\beta}_t\bI}$.

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\left[\frac{1}{2\tilde{\beta}_t}\bigl\|\tilde{\bmu}_t(\bx_t,\bx_0)-\bmu_{\btheta,t}(\bx_t)\bigr\|^2\right]
$$

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-2
class: theorems
---

# Recap of Previous Lecture

For intermediate steps $t\ge2$:

$$
\cL_t=\bbE_{{\color{#8854c0}q(\bx_t|\bx_0)}}\left[{\color{olive}\frac{1}{2\tilde{\beta}_t}}\bigl\|\tilde{\bmu}_t(\bx_t,\bx_0)-\bmu_{\btheta,t}(\bx_t)\bigr\|^2\right]
$$

<div class="block">

## Reparametrization

$$
\begin{aligned}
\tilde{\bmu}_t(\bx_t,\bx_0)&=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}\cdot\bepsilon\\
\bmu_{\btheta,t}(\bx_t)&=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-{\color{teal}\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}}\cdot\bepsilon_{\btheta,t}(\bx_t)
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
id: recap-diffusion-parameterizations
class: theorems
---

# Recap of Previous Lecture

## Same Predictions, Different Losses

At fixed $\bx_t,t$, with $0<\bar{\alpha}_t<1$, a noise prediction defines a clean-data estimate:

$$
\hat{\bx}_{\btheta,t}(\bx_t)=\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\,\bepsilon_{\btheta,t}(\bx_t)}{\sqrt{\bar{\alpha}_t}}.
$$

<div class="block">

## Noise MSE vs Clean-Data MSE

For these linked predictions:

$$
\bigl\|\bepsilon-\bepsilon_{\btheta,t}(\bx_t)\bigr\|^2
={\color{teal}\frac{\bar{\alpha}_t}{1-\bar{\alpha}_t}}\,
\bigl\|\bx_0-\hat{\bx}_{\btheta,t}(\bx_t)\bigr\|^2.
$$

</div>
<div class="takeaway">

**Same predictions, different loss weights.** The factor depends on $t$, so unweighted MSEs define different training objectives.

</div>

<div class="source"><a href="https://arxiv.org/abs/2202.00512">Salimans T., Ho J. Progressive Distillation for Fast Sampling of Diffusion Models, 2022</a></div>

<!-- Recalls the clean/noise conversion and loss-weighting identity from the
previous lecture. Reverse-mean conversion is on the preceding recap slide;
score matching is recalled separately. Keep this slide fully visible. -->

---
clicks: 0
id: recap-of-previous-lecture-3
class: theorems
---

# Recap of Previous Lecture

For intermediate steps $t\ge2$:

$$
\cL_t=\bbE_{{\color{#8854c0}\bepsilon\sim\cN(0,\bI)}}\left[\frac{(1-\alpha_t)^2}{2\tilde{\beta}_t\alpha_t(1-\bar{\alpha}_t)}\Bigl\|\bepsilon-\bepsilon_{\btheta,t}\bigl({\color{teal}\sqrt{\bar{\alpha}_t}\bx_0+\sqrt{1-\bar{\alpha}_t}\bepsilon}\bigr)\Bigr\|^2\right]
$$

Predict the added noise. Dropping the time-dependent ELBO coefficient changes the relative weights of the training levels. The simple loss also includes reconstruction at $t=1$.

<div class="block">

## Simplified Objective

$$
\cL_{\text{simple}}=\bbE_{t\sim\Uniform\{1,\ldots,T\}}\bbE_{\bepsilon\sim\cN(0,\bI)}\Bigl\|\bepsilon-\bepsilon_{\btheta,t}\bigl(\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon\bigr)\Bigr\|^2
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-4
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Training

1. Sample $\bx_0\sim\pd(\bx)$, $t\sim\Uniform\{1,\ldots,T\}$, $\bepsilon\sim\cN(0,\bI)$.
2. Compute noisy image $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$.
3. Minimize $\cL_{\text{simple}}=\|\bepsilon-\bepsilon_{\btheta,t}(\bx_t)\|^2$ by SGD.

</div>
<div class="block">

## Sampling (Ancestral)

1. Sample $\bx_T\sim\cN(0,\bI)$.
2. For $t=T,\ldots,2$, compute the mean and sample the reverse step:

$$
\begin{aligned}
\bmu_{\btheta,t}(\bx_t)&=\frac{\bx_t}{\sqrt{\alpha_t}}-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar\alpha_t)}}\bepsilon_{\btheta,t}(\bx_t),\\
\bx_{t-1}&=\bmu_{\btheta,t}(\bx_t)+\sqrt{\tilde\beta_t}\bepsilon_t,\qquad\bepsilon_t\sim\cN(0,\bI).
\end{aligned}
$$

<ol start="3"><li>

Return the decoder mean $\hat{\bx}_0=\bmu_{\btheta,1}(\bx_1)$.

</li></ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-5
class: theorems
---

# Recap of Previous Lecture

For a chosen perturbation $q(\bx_t|\bx_0)$, define the conditional score error:

$$
\ell_{\btheta}(t)=\bbE_{\pd(\bx_0)}\bbE_{q(\bx_t|\bx_0)}\left\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx_0)\right\|^2.
$$

<div class="block">

## Same DSM form: compare weights and perturbations

$$
\cL=\bbE_{t\sim\Uniform\{1,\ldots,T\}}\left[w_t\,\ell_{\btheta}(t)\right].
$$

| Objective | Gaussian perturbation | Conditional score target | Weight $w_t$ |
| --- | --- | --- | --- |
| DDPM simple loss | $\sqrt{\bar\alpha_t}\bx_0+\sqrt{1-\bar\alpha_t}\bepsilon$ | $-\bepsilon/\sqrt{1-\bar\alpha_t}$ | $1-\bar\alpha_t$ |
| NCSN | $\bx_0+\sigma_t\bepsilon$ | $-\bepsilon/\sigma_t$ | $\sigma_t^2$ |

**Changing the perturbation changes the inputs, targets and $\ell_{\btheta}(t)$ itself.**

</div>
<div>

For a fixed perturbation, replacing the DDPM ELBO weights also changes the objective.



</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J., et al. Denoising Diffusion Probabilistic Models, 2020</a><br><a href="https://arxiv.org/abs/1907.05600">Song Y., Ermon S. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a></div>

---
clicks: 0
id: recap-loss-weighting-and-time-sampling
class: theorems
---

# Recap of Previous Lecture

## Loss Weighting and Time Sampling

For a fixed perturbation and per-step loss $\ell_{\btheta}(t)$:

$$
\bbE_{t\sim r}[\ell_{\btheta}(t)]
=\bbE_{t\sim\Uniform\{1,\ldots,T\}}\!\left[T r_t\,\ell_{\btheta}(t)\right].
$$

**Sampling a noise level more often gives it more weight.**
Choose $r_t=w_t/\sum_s w_s$, $w_t>0$, to absorb weights up to an overall loss scale.

To change time sampling while preserving a chosen objective, compensate:

$$
\cL=\frac1T\sum_{t=1}^T w_t\ell_{\btheta}(t)
=\bbE_{t\sim r}\left[\frac{w_t}{T r_t}\ell_{\btheta}(t)\right],\qquad r_t>0.
$$

- The objective stays the same; gradient variance can change.
- Training-time sampling and the generation grid are separate choices.

<div class="source"><a href="https://arxiv.org/abs/2303.00848">Kingma D., Gao R. Understanding Diffusion Objectives as the ELBO with Simple Data Augmentation, 2023</a></div>

<!-- Coverage: recalls both directions of the weights/time-sampling equivalence and
importance correction. -->

---
clicks: 0
id: recap-of-previous-lecture-6
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Summary

<ul>
<li>

Gaussian perturbations:

- DDPM: $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$;
- NCSN: $\bx_t=\bx_0+\sigma_t\cdot\bepsilon$.
- Use $\tilde\bx_t=\bx_t/\sqrt{\bar\alpha_t}$ and $\sigma_t^2=(1-\bar\alpha_t)/\bar\alpha_t$ to recover NCSN.

</li>
<li>

Scale target and model scores by $\sqrt{\bar\alpha_t}$ to obtain the rescaled DSM error:

$$
\tilde\ell_{\btheta}(t)=\bar\alpha_t\ell_{\btheta}(t),\qquad
\sigma_t^2\tilde\ell_{\btheta}(t)=(1-\bar\alpha_t)\ell_{\btheta}(t).
$$

</li>
<li>

Equivalent training objectives do not fix the sampling rule:

- DDPM: one reverse transition per noise level;
- NCSN: $L$ Langevin updates at each fixed noise level;
- A trained score model can support different samplers.

</li>
</ul>
</div>

<div class="source"><a href="https://arxiv.org/abs/2107.00630">Kingma D. et al. Variational Diffusion Models, 2021</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y. et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-7
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Sampling (DDIM)

1. Sample $\bx_T\sim\cN(0,\bI)$; choose a grid $T=t_K>\cdots>t_0=0$.
2. For $k=K,\ldots,1$, set $t=t_k$, $s=t_{k-1}$ and compute:

$$
\begin{aligned}
\hat{\bepsilon}&=\bepsilon_{\btheta,t}(\bx_t)
&&\text{predict noise},\\[8pt]
\hat{\bx}_0&=\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\,\hat{\bepsilon}}{\sqrt{\bar{\alpha}_t}}
&&\text{estimate clean data},\\[8pt]
\bx_s&={\color{teal}\sqrt{\bar{\alpha}_s}}\,\hat{\bx}_0
+{\color{teal}\sqrt{1-\bar{\alpha}_s}}\,\hat{\bepsilon}
&&\text{update state}.
\end{aligned}
$$

3. Return $\bx_0$.

</div>

**Same training marginals, different joint:** shared-noise forward paths are non-Markovian. DDIM reuses the DDPM predictor; its sampler is Markovian and deterministic given $\bx_T$.

**Fewer steps:** choose $K\ll T$; $K$ steps require $K$ network evaluations and no retraining.

<div class="source"><a href="https://arxiv.org/abs/2010.02502">Song J., Meng C., Ermon S. Denoising Diffusion Implicit Models, 2021</a></div>

---
clicks: 0
id: recap-of-previous-lecture-8
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## DDPM Sampling

Use $\bs_{\btheta,t}(\bx_t)=-\bepsilon_{\btheta,t}(\bx_t)/\sqrt{1-\bar\alpha_t}$.

$$
\bx_{t-1}=\frac{\bx_t+\beta_t\,{\color{teal}\bs_{\btheta,t}(\bx_t)}}{\sqrt{\alpha_t}}+\sqrt{\tilde\beta_t}\,\bepsilon_t,\qquad t\ge2.
$$

</div>
<div class="block">

## Guided Generation

$$
\bx_{t-1}=\frac{\bx_t+\beta_t\,{\color{olive}\bs_{\btheta,t}(\bx_t,\by)}}{\sqrt{\alpha_t}}+\sqrt{\tilde\beta_t}\,\bepsilon_t,\qquad t\ge2.
$$

</div>
<div class="block">

## Conditional Score and Its Estimate

$$
\begin{aligned}
{\color{olive}\nabla_{\bx_t}\log q(\bx_t|\by)}&={\color{#8854c0}\nabla_{\bx_t}\log q(\bx_t)}+\nabla_{\bx_t}\log q(\by|\bx_t)\\
&\approx{\color{#8854c0}\bs_{\btheta,t}(\bx_t)}+{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}=\bs_{\btheta,t}(\bx_t,\by).
\end{aligned}
$$

</div>

Train $p(\by|\bx_t)\approx q(\by|\bx_t)$ separately; draw independent $\bepsilon_t\sim\cN(0,\bI)$.

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 0
id: recap-of-previous-lecture-9
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Guided Score Function

$$
\begin{aligned}
\bs_{\btheta,t}(\bx_t,\by)&=\bs_{\btheta,t}(\bx_t)+\nabla_{\bx_t}\log p(\by|\bx_t)\\
{\color{#8854c0}\bs^\gamma_{\btheta,t}(\bx_t,\by)}&=\bs_{\btheta,t}(\bx_t)+{\color{teal}\gamma}\cdot\nabla_{\bx_t}\log p(\by|\bx_t)
\end{aligned}
$$

</div>

With exact scores, the interpretation at each fixed noise level is

$$
q_\gamma(\bx_t|\by)\propto q(\bx_t)\,q(\by|\bx_t)^\gamma.
$$

$\gamma=1$ gives the conditional score; very large $\gamma$ can reduce diversity and introduce artifacts.

<div class="block">

## Guidance Interval

Apply extra guidance only at intermediate noise levels. Outside the interval, $\gamma_t=1$: **conditioning remains**.

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a><br><a href="https://arxiv.org/abs/2404.07724">Kynkäänniemi T. et al. Applying Guidance in a Limited Interval Improves Sample and Distribution Quality in Diffusion Models, 2024</a> · <a href="https://arxiv.org/abs/2410.02416">Sadat S. et al. Eliminating Oversaturation and Artifacts of High Guidance Scales in Diffusion Models, 2025</a></div>

---
clicks: 0
id: recap-of-previous-lecture-10
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Training

1. Train the DDPM as before.
2. Train an additional classifier $p(\by|\bx_t)$ on noisy data (time-dependent).

</div>
<div class="block">

## Sampling (Guided)

1. Sample $\bx_T\sim\cN(0,\bI)$.
2. For $t=T,\ldots,2$, compute the guided mean and sample the reverse step:

$$
\begin{aligned}
\bmu^\gamma_{\btheta,t}(\bx_t,\by)&=\frac{\bx_t+\beta_t\,{\color{olive}\bs^\gamma_{\btheta,t}(\bx_t,\by)}}{\sqrt{\alpha_t}},\\
\bx_{t-1}&=\bmu^\gamma_{\btheta,t}(\bx_t,\by)+\sqrt{\tilde\beta_t}\,\bepsilon_t,\qquad\bepsilon_t\sim\cN(0,\bI).
\end{aligned}
$$

<ol start="3"><li>

Return the guided decoder mean $\hat\bx_0=\bmu^\gamma_{\btheta,1}(\bx_1,\by)$.

</li></ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 0
id: recap-of-previous-lecture-11
class: theorems
---

# Recap of Previous Lecture

Use Bayes' rule for the true noisy-data distributions to motivate classifier-free guidance:

$$
{\color{teal}\nabla_{\bx_t}\log q(\by|\bx_t)}=\nabla_{\bx_t}\log q(\bx_t|\by)-\nabla_{\bx_t}\log q(\bx_t).
$$

$$
\begin{aligned}
\bs_t^\gamma(\bx_t,\by)&:=\nabla_{\bx_t}\log q_\gamma(\bx_t|\by)\\
&=\nabla_{\bx_t}\log q(\bx_t)+\gamma\cdot{\color{teal}\nabla_{\bx_t}\log q(\by|\bx_t)}\\
&=(1-\gamma)\cdot\nabla_{\bx_t}\log q(\bx_t)+\gamma\cdot\nabla_{\bx_t}\log q(\bx_t|\by).
\end{aligned}
$$

Replace the two true scores with learned unconditional and conditional estimates.

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a><br><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 0
id: recap-of-previous-lecture-12
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Scaled Guided Score Function

$$
\bs^\gamma_{\btheta,t}(\bx_t,\by)=(1-\gamma)\cdot\bs_{\btheta,t}(\bx_t)+\gamma\cdot\bs_{\btheta,t}(\bx_t,\by)
$$

</div>

<div class="block">

## CFG

1. Introduce the "absence of conditioning" label $\by=\varnothing$.
2. Identify the unconditional score model $\bs_{\btheta,t}(\bx_t)=\bs_{\btheta,t}(\bx_t,\varnothing)$.
3. Train a single model $\bs_{\btheta,t}(\bx_t,\by)$ on **supervised** data, dropping the label $\by$ with some fixed probability (simulating $\by=\varnothing$).
4. Evaluate the model twice per sampling step: with $\by$ and with $\varnothing$.

</div>

**Guidance distillation:** train a student to match the fixed teacher's guided prediction:

$$
\bs_{\bphi,t}(\bx_t,\by,\gamma)\approx
(1-\gamma)\bs_{\btheta,t}(\bx_t,\varnothing)+\gamma\bs_{\btheta,t}(\bx_t,\by).
$$

Evaluate the student **once per step**; keep the sampler and step count.

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a><br><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025</a><br><a href="https://arxiv.org/abs/2210.03142">Meng C. et al. On Distillation of Guided Diffusion Models, 2023</a></div>

---
clicks: 0
id: outline
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item "><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item "><span>03</span><div>SDE Basics</div></div>

</div>

---
clicks: 0
id: outline-2
section: "Continuous-Time Normalizing Flows (CNF)"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item "><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item "><span>03</span><div>SDE Basics</div></div>

</div>

---
clicks: 1
id: discrete-time-normalizing-flows
class: theorems
---

# Discrete-Time Normalizing Flows

<div class="block">

## Change of Variable Theorem (CoV)

Let $\bx$ be a random variable with density $p(\bx)$, and let $\bff:\bbR^m\rightarrow\bbR^m$ be a differentiable and **invertible** transformation. If $\bz=\bff(\bx)$, $\bx=\bff^{-1}(\bz)=\bg(\bz)$, then

$$
\begin{aligned}
p(\bx)&=p(\bz)|\det(\bJ_{\bff})|=p(\bz)\left|\det\left(\frac{\partial\bz}{\partial\bx}\right)\right|\\
&=p(\bff(\bx))\left|\det\left(\frac{\partial\bff(\bx)}{\partial\bx}\right)\right|
\end{aligned}
$$

</div>
<div v-click="1">

<img src="/figs/normalizing-flow.png" alt="Composition of invertible transformations in a normalizing flow" style="width:100%;height:140px;object-fit:contain" />

$$
\log\pt(\bx)=\log p(\bff_K\circ\dots\circ\bff_1(\bx))+\sum_{k=1}^K\log\left|\det\left(\frac{\partial\bff_k}{\partial\bff_{k-1}}\right)\right|.
$$

</div>

<div class="source"><a href="https://lilianweng.github.io/lil-log/2018/10/13/flow-based-deep-generative-models.html">https://lilianweng.github.io/lil-log/2018/10/13/flow-based-deep-generative-models.html</a></div>

---
clicks: 2
id: towards-continuous-time-normalizing-flows
class: theorems
---

# Towards Continuous-Time Normalizing Flows

Up to this point, we have considered discrete-time normalizing flows:

$$
\bx_{t+1}=\bff_{\btheta}(\bx_t,t);\quad\log p(\bx_{t+1})=\log p(\bx_t)-\log\left|\det\frac{\partial\bff_{\btheta}(\bx_t)}{\partial\bx_t}\right|.
$$

<div class="block" v-click="1">

## Residual Flows

Here $\bff_{\btheta}$ is the NF **bijection**, $\bv_{\btheta}$ is the **velocity** (vector field):

$$
\bx_{t+1}=\bff_{\btheta}(\bx_t,t)=\bx_t+\bv_{\btheta}(\bx_t,t)
$$

<div v-click="2">

Given $\by=\bff_{\btheta}(\bx,t)$, recover $\bx$ by **fixed-point iteration**:

$$
\bx=\by-\bv_{\btheta}(\bx,t),\qquad
\bx^{(k+1)}=\by-\bv_{\btheta}(\bx^{(k)},t).
$$

If $\bv_{\btheta}$ has Lipschitz constant $L<1$ in $\bx$, the iteration is contractive. **Banach's theorem** guarantees a unique solution for every $\by$, so $\bff_{\btheta}$ is invertible.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/1811.00995">Behrmann J. et al. Invertible Residual Networks, 2019</a><br><a href="https://arxiv.org/abs/1906.02735">Chen R. T. Q. et al. Residual Flows for Invertible Generative Modeling, 2019</a></div>

---
clicks: 2
id: towards-continuous-time-normalizing-flows-2
class: theorems
---

# Towards Continuous-Time Normalizing Flows

A residual step $\bx(t+h)=\bx(t)+h\,\bv_{\btheta}(\bx(t),t)$ is invertible if $hL<1$:

$$
\frac{\bx(t+h)-\bx(t)}{h}=\bv_{\btheta}(\bx(t),t)
$$

<div v-click="1">

Taking the limit $h\rightarrow0$, we obtain continuous-time dynamics.

<div class="block">

## Continuous-Time Dynamics

Consider an Ordinary Differential Equation (ODE):

$$ {1|all} {at:2}
\begin{aligned}
\frac{d\bx(t)}{dt}&=\bv_{\btheta}(\bx(t),t);\quad\text{with initial condition }\bx(t_0)=\bx_0.\\
\bx(t_1)&=\int_{t_0}^{t_1}\bv_{\btheta}(\bx(t),t)\,dt+\bx_0
\end{aligned}
$$

</div>
</div>
<div v-click="2">

The **velocity field** $\bv_{\btheta}:\bbR^m\times[t_0,t_1]\rightarrow\bbR^m$ need not be contractive or invertible. Under suitable regularity conditions, **uniqueness of ODE solutions guarantees an invertible flow**.

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 2
id: odes-flows-and-numerical-solutions
class: theorems
---

# ODEs, Flows and Numerical Solutions

<div class="block">

## Ordinary Differential Equation

$$
\frac{d\bx(t)}{dt}=\bv_{\btheta}(\bx(t),t),\qquad\bx(t_0)=\bx_0.
$$

</div>

<div class="block" v-click="1">

## Flow

The **flow** $\bpsi:\bbR^m\times[t_0,t_1]\rightarrow\bbR^m$ maps the initial point to its position at time $t$: $\bx(t)=\bpsi_t(\bx_0)$.

$$
\frac{d\bpsi_t(\bx_0)}{dt}=\bv_{\btheta}(\bpsi_t(\bx_0),t),\qquad\bpsi_{t_0}(\bx_0)=\bx_0.
$$

</div>

<div class="block" v-click="2">

## Numerical Solution

$$
\bpsi_t(\bx_0)=\bx_0+\int_{t_0}^{t}\bv_{\btheta}(\bx(s),s)\,ds
\approx\ODESolve_v(\bx_0,\btheta,t_0,t).
$$

A numerical solver approximates the flow by a sequence of **finite steps**.

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 1
id: numerical-solution-of-odes-euler
class: theorems
---

# Numerical Solution of ODEs: Euler

<div class="columns">
<div class="block">

## Euler Update Step

$$
\frac{\bx(t+h)-\bx(t)}{h}=\bv_{\btheta}(\bx(t),t)
$$

$$
\bx(t+h)=\bx(t)+h\cdot\bv_{\btheta}(\bx(t),t)
$$

Freeze the current velocity over the step: **one field evaluation**.

</div>
<EulerStepPlot />
</div>

<div class="block" v-click="1">

## One-Step Error

For a smooth field, Taylor expansion from the **exact starting point** gives

$$
\bx(t+h)=\bx(t)+h\,\bv_{\btheta}(\bx(t),t)+\cO(h^2).
$$

Euler drops the higher-order terms: the **local error is $\cO(h^2)$**.

</div>

<div class="source"><a href="https://en.wikipedia.org/wiki/Euler_method">Euler method; original one-step illustration</a><br><a href="https://fncbook.com/rk/">Driscoll T. A., Braun R. J. Fundamentals of Numerical Computation: Runge–Kutta methods</a></div>

---
clicks: 0
id: numerical-solution-of-odes-euler-and-heun
class: interactive-slide
---

# Numerical Solution of ODEs: Euler and Heun

<OdeSolverDemo />

<div class="source"><a href="https://en.wikipedia.org/wiki/Heun's_method">Heun's method; original rotation example</a></div>

---
clicks: 1
id: ode-solvers-accuracy-and-cost
class: theorems
---

# ODE Solvers: Accuracy and Cost

For a sufficiently smooth velocity field on a fixed interval $[0,T]$:

$$
\|\widehat{\bx}_N-\bx(T)\|=\cO(h^p),\qquad h=T/N.
$$

This is the **global error** after $N$ steps.

| Method | Global error | Velocity evaluations / step |
|---|---|---|
| Euler | $\cO(h)$ | 1 |
| Heun | $\cO(h^2)$ | 2 |
| RK4 | $\cO(h^4)$ | 4 |

<div v-click="1">

- **One-step error** from an exact starting point is $\cO(h^{p+1})$.
- For small $h$, halving the step roughly reduces global error by **2 / 4 / 16**, but doubles the number of steps.
- Compare computational cost by **NFE**: the number of velocity-network evaluations.

</div>

<div class="source"><a href="https://fncbook.com/rk/">Driscoll T. A., Braun R. J. Fundamentals of Numerical Computation: Runge–Kutta methods</a></div>

---
clicks: 0
id: generative-models-taxonomy
class: figure-slide
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" continuous-normalizing-flow />

---
clicks: 2
id: continuous-time-normalizing-flows-neural-ode
class: theorems
---

# Continuous-Time Normalizing Flows: Neural ODE

<div class="block">

## Neural ODE

$$
\frac{d\bx(t)}{dt}=\bv_{\btheta}(\bx(t),t);\quad\text{with initial condition }\bx(t_0)=\bx_0
$$

</div>

<div class="block" v-click="1">

## Euler $\ODESolve$

$$
\bx(t+h)=\bx(t)+h\cdot\bv_{\btheta}(\bx(t),t)
$$

</div>

<div v-click="2">

- Consider $[t_0,t_1]=[0,1]$ for simplicity.
- If $\bx(0)$ is a random variable with density $p_0(\bx)$,
- Then, for any $t$, $\bx(t)$ is a random variable with density $p_t(\bx)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 2
id: continuous-time-normalizing-flows-intuition
class: theorems
---

# Continuous-Time Normalizing Flows: Intuition

$$
\frac{d\bx(t)}{dt}=\bv_{\btheta}(\bx(t),t);\quad\text{with initial condition }\bx(t_0)=\bx_0
$$


<div v-click="1">

- $p_t(\bx)=p(\bx,t)$ describes the **probability path** interpolating between $p_0(\bx)$ and $p_1(\bx)$.
- <span style="color:gray">What is the difference between $p_t(\bx(t))$ and $p_t(\bx)$?</span>

</div>

<div v-click="2">

<img src="/figs/cnf_flow.png" alt="A continuous flow of samples and the corresponding probability path" style="width:100%;height:260px;object-fit:contain" />

</div>

<div class="source"><a href="https://arxiv.org/abs/1810.01367">Grathwohl W. et al. FFJORD: Free-form Continuous Dynamics for Scalable Reversible Generative Models, 2018</a></div>

---
clicks: 3
id: continuous-time-normalizing-flows-reversibility
class: theorems
---

# Continuous-Time Normalizing Flows: Reversibility

<div class="block">

## Theorem (Picard)

If $\bv$ is continuously differentiable with a bounded derivative in $\bx$ and continuous in $t$, then the ODE has a **unique solution** given by a flow $\bpsi_t$.

</div>

<div v-click="1">

This guarantees the ODE is **uniquely reversible**.

$$
\begin{aligned}
\bpsi_1(\bx_0)&=\bx_0+\int_0^1\bv_{\btheta}(\bpsi_t(\bx_0),t)\,dt\\
\bx(1)&=\bx(0)+\int_0^1\bv_{\btheta}(\bx(t),t)\,dt\\
\bx(0)&=\bx(1)+\int_1^0\bv_{\btheta}(\bx(t),t)\,dt
\end{aligned}
$$

</div>

<div v-click="2">

**Note:** Unlike discrete-time flows, $\bv$ need not be invertible (uniqueness ensures bijection).

</div>

<div v-click="3">

How can we compute $p_t(\bx)$ at arbitrary $t$?

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 0
id: outline-3
section: "Continuity Equation for CNF Log-Likelihood"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item current"><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item "><span>03</span><div>SDE Basics</div></div>

</div>

---
clicks: 2
id: continuous-time-nf
class: theorems
---

# Continuous-Time NF

<div class="block">

## Theorem (Continuity Equation)

If $\bv$ is continuously differentiable in $\bx$ (with bounded derivative) and continuous in $t$, and $p_t(\bx)>0$, then

$$
\frac{d\log p_t(\bx(t))}{dt}=-\tr\left(\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}\right)
$$

</div>

<div v-click="1">

Integrating gives the density **along the trajectory**:

<div class="block">

## Solution

$$
\log p_1(\bx(1))=\log p_0(\bx(0))-{\color{teal}\int_0^1\tr\left(\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}\right)\,dt}.
$$

</div>

</div>

<div v-click="2">

**Hutchinson's trace estimator:**

$$
\tr(\bJ)=\bbE_{\bepsilon\sim\cN(0,\bI)}[\bepsilon^T\bJ\bepsilon],\qquad
\bJ=\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}.
$$

- One noise vector gives an **unbiased trace estimate** via autodiff, without forming the full Jacobian.
- **Exact identity; approximate computation** using an ODE solver and a stochastic trace estimate.

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a><br><a href="https://arxiv.org/abs/1810.01367">Grathwohl W. et al. FFJORD: Free-form Continuous Dynamics for Scalable Reversible Generative Models, 2018</a></div>

---
clicks: 0
id: divergence-where-does-the-density-go
class: interactive-slide
---

# Divergence: Where Does the Density Go?

<DivergenceDemo />

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 2
id: cnf-training-and-sampling
class: theorems
---

# CNF: Training and Sampling

Fix $p_0=\cN(0,\bI)$ and learn $\bv_{\btheta}$; the endpoint density is $p_1=\pt$.

<div class="block" v-click="1">

## Training

<ol>
<li>

Sample $\bx\sim\pd$. Solve the ODE **backward**, from $\bx(1)=\bx$ to $\bx(0)$.

</li>
<li>

Compute the negative log-likelihood along this trajectory:

$$
\cL=-\log\pt(\bx)=-\log p_0(\bx(0))+\int_0^1\tr\left(\frac{\partial\bv_{\btheta}(\bx(t),t)}{\partial\bx(t)}\right)\,dt.
$$

</li>
<li>

Update $\btheta\leftarrow\btheta-\eta\nabla_{\btheta}\cL$; differentiate through the ODE, e.g., via the **adjoint method**.

</li>
</ol>

</div>

<div class="block" v-click="2">

## Sampling

<ol>
<li>

Sample $\bx(0)\sim p_0$.

</li>
<li>

Solve the ODE **forward** and return the endpoint:

$$
\bx(1)=\ODESolve_v(\bx(0),\btheta,t_0=0,t_1=1)\sim\pt.
$$

</li>
</ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a><br><a href="https://arxiv.org/abs/1810.01367">Grathwohl W. et al. FFJORD: Free-form Continuous Dynamics for Scalable Reversible Generative Models, 2018</a></div>

---
clicks: 0
id: outline-4
section: "SDE Basics"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item "><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item current"><span>03</span><div>SDE Basics</div></div>

</div>

---
clicks: 1
id: stochastic-differential-equation-sde
class: theorems
---

# Stochastic Differential Equation (SDE)

<div class="block">

## Wiener Process

$\bw(t)$ is the standard Wiener process (Brownian motion), defined by:

<div class="columns balanced">
<div>

1. $\bw(0)=0$ (almost surely);
2. $\bw(t)$ has independent increments;
3. $\bw(t)$ trajectories are continuous;
4. $\bw(t)-\bw(s)\sim\cN(0,(t-s)\bI)$ for $t>s$;

</div>
<div>

<img src="/figs/brownian_motion.png" alt="Sample trajectories of Brownian motion" style="width:100%;height:245px;object-fit:contain" />

</div>
</div>

</div>

<div v-click="1">

$$
d\bw=\bw(t+dt)-\bw(t)=\cN(0,\bI\cdot dt)=\bepsilon\cdot\sqrt{dt},\quad\text{where }\bepsilon\sim\cN(0,\bI).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 2
id: stochastic-differential-equation-sde-2
class: theorems
---

# Stochastic Differential Equation (SDE)

$$
\frac{d\bx}{dt}=\bv(\bx,t)\quad\Rightarrow\quad d\bx=\bv(\bx,t)\,dt
$$


<div v-click="1">

Let's define a stochastic process $\bx(t)$ with initial condition $\bx(0)\sim p_0(\bx)=\pd(\bx)$:

$$
d\bx=\bff(\bx,t)\,dt+{\color{#8854c0}g(t)\,d\bw}
$$

</div>

<div v-click="2">

- $\bff(\bx,t):\bbR^m\times[0,1]\rightarrow\bbR^m$ is the **drift** term (vector field).
- $g(t):\bbR\rightarrow\bbR$ is the **diffusion** term (if $g(t)=0$, we recover the standard ODE).
- $\bw(t)$ is the standard Wiener process ($d\bw=\bepsilon\cdot\sqrt{dt}$).
- We do not have the flow $\bpsi_t(\bx_0)$ notion anymore, since trajectories are stochastic.

</div>

---
clicks: 2
id: it-integration-basics
class: theorems
---

# Itô Integration Basics

The SDE should be understood in its **integral form** (Itô sense):

$$
\bx(t)=\bx(0)+{\color{#8854c0}\int_0^t\bff(\bx(s),s)\,ds}+{\color{teal}\int_0^t g(s)\,d\bw(s)}
$$

<div v-click="1">

- <span style="color:#8854c0">The first integral</span> is a classical (Riemann) integral.
- <span style="color:teal">The second integral</span> is an **Itô stochastic integral**.

</div>
<div v-click="2">

$$
\int_0^t g(s)\,d\bw(s)=\lim_{N\to\infty}\sum_{i=0}^{N-1}g(t_i)\bigl(\bw(t_{i+1})-\bw(t_i)\bigr)
$$

- Brownian paths are continuous but a.s. **nowhere differentiable** $\Rightarrow$ Fundamental Theorem of Calculus fails.
- **Itô's lemma** is the stochastic counterpart of the chain rule; we will not need its explicit form here.
- Expressions $d\bx$, $dt$, $d\bw$ are **formal shorthand** for infinitesimal increments.

</div>

<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. et al. The Principles of Diffusion Models, 2025</a></div>

---
clicks: 1
id: stochastic-differential-equation-sde-3
class: theorems
---

# Stochastic Differential Equation (SDE)

$$
d\bx=\bff(\bx,t)\,dt+g(t)\,d\bw
$$


<div class="block">

## Theorem

If $\bff$ is continuously differentiable with a bounded derivative in $\bx$ and continuous in $t$ and $g(t)$ is continuous then the SDE has the solution given by unique process $\bx(t)$.

</div>

<div v-click="1">

- Unlike ODEs, the initial condition $\bx(0)$ doesn't uniquely determine the trajectory.
- There are two sources of randomness:
  - the initial distribution $p_0(\bx)$;
  - the Wiener process $\bw(t)$.

</div>

---
clicks: 2
id: stochastic-differential-equation-sde-4
class: theorems
---

# Stochastic Differential Equation (SDE)

$$
d\bx=\bff(\bx,t)\,dt+g(t)\,d\bw
$$


<div class="block">

## Discretizing the SDE (Euler-Maruyama Update) – $\SDESolve$

$$
{\color{#8854c0}\bx(t+dt)=\bx(t)+\bff(\bx(t),t)\cdot dt}+{\color{teal}g(t)\cdot\bepsilon\cdot\sqrt{dt}}
$$

<div v-click="1">

If $dt=1$, then

$$
{\color{#8854c0}\bx_{t+1}=\bx_t+\bff(\bx_t,t)}+{\color{teal}g(t)\cdot\bepsilon}
$$

</div>

</div>

<div v-click="2">

- At any time $t$, the process has density $p_t(\bx)=p(\bx,t)$.
- $p:\bbR^m\times[0,1]\rightarrow\bbR_+$ specifies a **probability path** from $p_0(\bx)$ to $p_1(\bx)$.
- How can we obtain the probability path $p_t(\bx)$ for $\bx(t)$?

</div>

---
clicks: 2
id: stochastic-differential-equation-sde-5
class: theorems
---

# Stochastic Differential Equation (SDE)

$$
d\bx=\bff(\bx,t)\,dt+g(t)\,d\bw,\quad d\bw=\bepsilon\cdot\sqrt{dt},\quad\bepsilon\sim\cN(0,\bI).
$$


<div class="block">

## Theorem (Kolmogorov-Fokker-Planck)

If $p_t(\bx)\in C^{1,2}$ (i.e., $C^1$ in $t$ and $C^2$ in $\bx$), then

$$
\frac{\partial p_t(\bx)}{\partial t}=-\diver\left(\bff(\bx,t)p_t(\bx)\right)+\frac12 g^2(t)\Delta_{\bx}p_t(\bx)
$$

<div v-click="1">

Here,

$$
\diver(\bv)=\sum_{i=1}^m\frac{\partial v_i(\bx)}{\partial x_i}=\tr\left(\frac{\partial\bv(\bx)}{\partial\bx}\right)
$$

$$
\Delta_{\bx}p_t(\bx)=\sum_{i=1}^m\frac{\partial^2p_t(\bx)}{\partial x_i^2}=\tr\left(\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)
$$

</div>
<div v-click="2">

$$
\frac{\partial p_t(\bx)}{\partial t}=\tr\left(-\frac{\partial}{\partial\bx}\bigl[\bff(\bx,t)p_t(\bx)\bigr]+\frac12g^2(t)\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)
$$

</div>

</div>

---
clicks: 2
id: stochastic-differential-equation-sde-6
class: theorems
---

# Stochastic Differential Equation (SDE)

<div class="block">

## Theorem (Kolmogorov-Fokker-Planck)

$$
\frac{\partial p_t(\bx)}{\partial t}=\tr\left(-\frac{\partial}{\partial\bx}\bigl[\bff(\bx,t)p_t(\bx)\bigr]+\frac12g^2(t)\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)
$$

</div>


- The KFP theorem is a necessary and sufficient condition (it uniquely defines $p_t(\bx)$).
- This generalizes the continuity equation for continuous-time NF:

$$
\frac{d\log p_t(\bx(t))}{dt}=-\tr\left(\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}\right).
$$

<div class="block" v-click="1">

## Special Case: constant density $p_t(\bx)$

Let's find the SDE for which $p_t(\bx)=\text{const}$ (i.e., if $\bx(0)\sim p_0(\bx)$, then $\bx(t)\sim p_0(\bx)$.).

<div v-click="2">

$$
\frac{\partial p_t(\bx)}{\partial t}=0\quad\Leftrightarrow\quad\tr\left(-\frac{\partial}{\partial\bx}\bigl[\bff(\bx,t)p_t(\bx)\bigr]+\frac12g^2(t)\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)=0
$$

</div>

</div>

---
clicks: 4
id: langevin-sde-special-case
class: theorems
---

# Langevin SDE (Special Case)

$$
\frac{\partial p_t(\bx)}{\partial t}=0\quad\Leftrightarrow\quad\tr\left(-\frac{\partial}{\partial\bx}\bigl[\bff(\bx,t)p_t(\bx)\bigr]+\frac12g^2(t)\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)=0
$$


<div v-click="1">

$$
\frac{\partial}{\partial\bx}\bigl[\bff(\bx,t)p_t(\bx)\bigr]=\frac12g^2(t)\frac{\partial^2p_t(\bx)}{\partial\bx^2}
$$

</div>

<div v-click="2">

$$
\bff(\bx,t)p_t(\bx)=\frac12g^2(t)\frac{\partial p_t(\bx)}{\partial\bx}
$$

</div>

<div v-click="3">

$$
\bff(\bx,t)=\frac12g^2(t)\frac{1}{p_t(\bx)}\frac{\partial p_t(\bx)}{\partial\bx}=\frac12g^2(t)\frac{\partial}{\partial\bx}\log p_t(\bx)
$$

</div>

<div v-click="4">

Let ${\color{olive}g(t)=1}$, then ${\color{#8854c0}\bff(\bx,t)=\frac12\frac{\partial}{\partial\bx}\log p_t(\bx)}$.

$$
d\bx={\color{#8854c0}\frac12\frac{\partial}{\partial\bx}\log p_t(\bx)\,dt}+{\color{olive}1}\cdot d\bw
$$

</div>

---
clicks: 2
id: langevin-sde-special-case-2
class: theorems
---

# Langevin SDE (Special Case)

Let's find the SDE for which $p_t(\bx)=\text{const}$ (i.e., if $\bx(0)\sim p_0(\bx)$, then $\bx(t)\sim p_0(\bx)$.).


$$
d\bx={\color{#8854c0}\frac12\frac{\partial}{\partial\bx}\log p_t(\bx)\,dt}+{\color{olive}1}\cdot d\bw
$$


<div class="block" v-click="1">

## Discretized Langevin SDE

$$
\bx_{t+1}-\bx_t=\frac\eta2\cdot\frac{\partial}{\partial\bx}\log p_t(\bx)+\sqrt\eta\cdot\bepsilon,\quad\eta\approx dt.
$$

</div>

<div v-click="2">

Setting the stationary density to the model distribution, $p_t(\bx)=\pt(\bx)$ for all $t$:

<div class="block">

## Langevin Dynamic

$$
\bx_{t+1}=\bx_t+\frac\eta2\cdot\nabla_{\bx}\log\pt(\bx)+\sqrt\eta\cdot\bepsilon,\quad\eta\approx dt.
$$

</div>

We (partially) explained, why Langevin dynamics is working.

</div>

<div class="source"><a href="https://www.stats.ox.ac.uk/~teh/research/compstats/WelTeh2011a.pdf">Welling M. Bayesian Learning via Stochastic Gradient Langevin Dynamics, 2011</a></div>

---
clicks: 0
id: langevin-moving-particles-stationary-density
class: interactive-slide
---

# Langevin: Moving Particles, Stationary Density

<StationaryLangevinDemo />

<div class="source"><a href="https://www.stats.ox.ac.uk/~teh/research/compstats/WelTeh2011a.pdf">Welling M. Bayesian Learning via Stochastic Gradient Langevin Dynamics, 2011</a></div>

---
clicks: 0
id: summary
class: summary
---

# Summary

- CNFs define invertible transformations via neural ODEs; likelihood-based training requires ODE solves, trace evaluations and gradients through the solver.
- If $\bx_0$ is a random variable, this yields a **probability path** $p_t(\bx)$ as time evolves. The continuity equation describes the evolution of $\log p(\bx,t)$ over time.
- An SDE defines a stochastic process with drift and diffusion terms; ODEs are a special case of SDEs.
- The KFP equation describes the probability dynamics of an SDE.
- The Langevin SDE preserves a constant probability path.
