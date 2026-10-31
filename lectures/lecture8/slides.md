---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 8"
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

<div class="cover-lecture">Lecture 8</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
id: recap-forward-gaussian-diffusion
class: theorems
---

# Recap of Previous Lecture

Fix a schedule $0<\beta_t<1$. The noises $\bepsilon_t\sim\cN(0,\bI)$ are independent across $t$ and of $\bx_0$.

$$
\begin{aligned}
\bx_t&=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t,\quad\bepsilon_t\sim\cN(0,\bI)\\
q(\bx_t|\bx_{t-1})&=\cN(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI)
\end{aligned}
$$

<div class="block">

## Exact Conditional Distribution

Let $\alpha_t=1-\beta_t$ and $\bar{\alpha}_t=\prod_{s=1}^t\alpha_s=\prod_{s=1}^t(1-\beta_s)$. Then

$$
q(\bx_t|\bx_0)=\cN(\sqrt{\bar{\alpha}_t}\,\bx_0,(1-\bar{\alpha}_t)\bI)
$$

**Connection to NCSN:** $\bx_t=\bx_0+\sigma_t\bepsilon$ adds Gaussian noise; DDPM also scales the signal by $\sqrt{\bar{\alpha}_t}$.

</div>

For finite $T$, choose $\bar{\alpha}_T\ll1$ so the residual signal $\sqrt{\bar{\alpha}_T}\bx_0$ is negligible; then $q(\bx_T)\approx\cN(0,\bI)$.

<div class="source"><a href="http://proceedings.mlr.press/v37/sohl-dickstein15.pdf">Sohl-Dickstein J. Deep Unsupervised Learning using Nonequilibrium Thermodynamics, 2015</a><br><a href="https://arxiv.org/abs/2403.18103">Chan S. Tutorial on Diffusion Models for Imaging and Vision, 2024</a><br><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a></div>

<!-- Recap coverage: moved from the former Lecture 7 recap after forward diffusion
became new Lecture 7 material. Recall alpha/alpha_bar and independent Gaussian
increments before the reverse kernel and SNR slides. The existing distribution
summary is already dense with forward, reverse and conditioned kernels, so keep
this self-contained prerequisite on its own static slide. The former pictorial
forward-process recap is covered by the following forward/reverse overview. -->

---
clicks: 0
id: recap-of-previous-lecture
class: theorems
---

# Recap of Previous Lecture

<img src="/figs/DDPM.png" alt="Forward and reverse diffusion processes" style="width:100%;height:220px;object-fit:contain" />

<div class="block">

## Reverse Process (Ancestral Sampling)

$$
\begin{aligned}
q(\bx_{t-1}|\bx_t)&=\frac{q(\bx_t|\bx_{t-1}){\color{#8854c0}q(\bx_{t-1})}}{{\color{#8854c0}q(\bx_t)}}\\
&\approx\pt(\bx_{t-1}|\bx_t)=\cN\left(\bmu_{\btheta,t}(\bx_t),\bsigma_{\btheta,t}^2(\bx_t)\right)
\end{aligned}
$$

<span style="color:gray">If $\beta_t$ is sufficiently small, $q(\bx_{t-1}|\bx_t)$ is approximately Gaussian.</span>

</div>

<div class="source"><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">Weng L. What are Diffusion Models?, blog post, 2021</a></div>

---
clicks: 0
id: recap-of-previous-lecture-2
class: theorems
---

# Recap of Previous Lecture

<div class="columns">
<div class="block">

## Forward Process

1. $\bx_0\sim\pd(\bx_0)$
2. $\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t$
3. $q(\bx_T)\approx\cN(0,\bI)$

</div>
<div class="block">

## Reverse Process

1. $\bx_T\sim\cN(0,\bI)$
2. $\bx_{t-1}=\bmu_{\btheta,t}(\bx_t)+\bsigma_{\btheta,t}(\bx_t)\bepsilon_t$
3. $\bx_0\sim\pt(\bx_0)\approx\pd(\bx_0)$

</div>
</div>

<div class="block">

## SNR and Log-SNR

$$
\bx_t=\sqrt{\bar{\alpha}_t}\,\bx_0+\sqrt{1-\bar{\alpha}_t}\,\bepsilon,
\qquad\bepsilon\sim\cN(0,\bI).
$$

$$
\SNR(t)=\frac{{\color{#007f82}\bar{\alpha}_t}}{{\color{#8854c0}1-\bar{\alpha}_t}}.
$$

$$
\lambda_t=\log\SNR(t),
\qquad\bar{\alpha}_t=\frac{1}{1+e^{-\lambda_t}}.
$$

$\lambda_t>0$: signal dominates; $\lambda_t=0$: equal scales; $\lambda_t<0$: noise dominates.

</div>

<div class="source"><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">Weng L. What are Diffusion Models?, blog post, 2021</a><br><a href="https://arxiv.org/abs/2107.00630">Kingma D. et al. Variational Diffusion Models, 2021</a></div>

<!--
Recap coverage: the forward/reverse processes already share this slide. The added
noise-level coordinate summarizes the preceding lecture's SNR result here instead
of creating a separate recap page. Alpha_bar retains its DDPM cumulative meaning;
SNR compares squared marginal signal/noise coefficients. The next slide recalls the
complete Gaussian transition and marginal formulas. The schedule demo and
high-resolution application are examples, not additional prerequisite results.
-->

---
clicks: 0
id: recap-of-previous-lecture-3
class: theorems
---

# Recap of Previous Lecture

**Forward process:** with a suitable noise schedule, $q(\bx_T)\approx\cN(0,\bI)$ as the residual signal becomes negligible:

$$
\begin{aligned}
q(\bx_t|\bx_{t-1})&=\cN(\sqrt{1-\beta_t}\,\bx_{t-1},\beta_t\,\bI);\\
q(\bx_t|\bx_0)&=\cN(\sqrt{\bar{\alpha}_t}\,\bx_0,(1-\bar{\alpha}_t)\,\bI).
\end{aligned}
$$

**Reverse process** refers to an intractable distribution that can be approximated by a normal distribution (with unknown parameters) for small $\beta_t$:

$$
q(\bx_{t-1}|\bx_t)=\frac{q(\bx_t|\bx_{t-1})q(\bx_{t-1})}{q(\bx_t)}\approx\cN\left(\bmu_{\btheta,t}(\bx_t),\bsigma_{\btheta,t}^2(\bx_t)\right)
$$

**Conditioned reverse process** is a normal distribution with known parameters, describing how to denoise a noisy image $\bx_t$ when we know the clean image $\bx_0$.

$$
q(\bx_{t-1}|\bx_t,{\color{olive}\bx_0})=\cN(\tilde{\bmu}_t(\bx_t,\bx_0),\tilde{\beta}_t\,\bI)
$$

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-4
class: theorems
---

# Recap of Previous Lecture

- $\bz=(\bx_1,\dots,\bx_T)$ represents the latent variables.
- **Fixed encoder:** the noise schedule determines the variational posterior:

$$
q(\bz|\bx)=q(\bx_1,\dots,\bx_T|\bx_0)=\prod_{t=1}^Tq(\bx_t|\bx_{t-1}).
$$

- **One-step decoder and learned Markov-chain prior:**

$$
\pt(\bx|\bz)=\pt(\bx_0|\bx_1);\quad\pt(\bz)=\prod_{t=2}^T\pt(\bx_{t-1}|\bx_t)\cdot p(\bx_T)
$$

<div class="takeaway">

**The encoder has no trainable parameters; only $\btheta$ is optimized.**

</div>

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a><br><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-5
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Diffusion ELBO (Fixed Encoder)

$$
\log\pt(\bx)\geq\bbE_{q({\color{teal}\bz}|\bx)}\log\frac{\pt(\bx,{\color{teal}\bz})}{q({\color{teal}\bz}|\bx)}=\cL_{\bphi,\btheta}(\bx)\rightarrow\max_{\btheta}
$$

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)
&={\color{olive}\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}-{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}\\
&\quad-{\color{teal}\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}}
\end{aligned}
$$

</div>

**<span style="color:olive">Reconstruction:</span>** the decoder recovers $\bx_0$ from $\bx_1$.<br>
For a continuous Gaussian decoder with fixed covariance $\sigma_1^2\bI$, $\sigma_1^2>0$:

$$
-\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)=\frac{1}{2\sigma_1^2}\bbE_{q(\bx_1|\bx_0)}\bigl\|\bx_0-\bmu_{\btheta,1}(\bx_1)\bigr\|^2+\text{const}.
$$

**<span style="color:#8854c0">Prior matching:</span>** constant in $\btheta$, since $q$ and $p(\bx_T)=\cN(0,\bI)$ are fixed.

**<span style="color:teal">Intermediate denoising:</span>** match each learned reverse step to its known conditioned target, $t\ge2$.

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a><br><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
id: recap-gaussian-mean-regression
class: theorems
---

# Recap of Previous Lecture

## Gaussian Reverse Steps

$$
q(\bx_{t-1}|\bx_t,\bx_0)=\cN\bigl(\tilde{\bmu}_t(\bx_t,\bx_0),\tilde\beta_t\bI\bigr),\qquad
\pt(\bx_{t-1}|\bx_t)=\cN\bigl(\bmu_{\btheta,t}(\bx_t),\tilde\beta_t\bI\bigr).
$$

For $t\ge2$, fixing the model covariance to the target covariance gives

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\left[\frac{1}{2\tilde\beta_t}\bigl\|\tilde{\bmu}_t(\bx_t,\bx_0)-\bmu_{\btheta,t}(\bx_t)\bigr\|^2\right].
$$

<div class="block">

## Known Regression Target

$$
\begin{aligned}
\tilde{\bmu}_t(\bx_t,\bx_0)&=\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\bx_t+\frac{\sqrt{\bar\alpha_{t-1}}(1-\alpha_t)}{1-\bar\alpha_t}\bx_0,\\
\tilde\beta_t&=\frac{(1-\alpha_t)(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}.
\end{aligned}
$$

</div>
<div class="takeaway">

**Learn the reverse mean by weighted regression onto the conditioned forward-process mean.**

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

<!-- Recalls the retained Gaussian-KL reduction and known target. The preceding
recap preserves the full ELBO; this separate static slide provides the bridge
needed by the new first body section without crowding the full decomposition.
Schedule notation is defined in the forward-process recap. Only t>=2 uses this
nondegenerate Gaussian KL. -->

---
clicks: 0
id: recap-diffusion-training-sampling
class: theorems
---

# Recap of Previous Lecture

$$
-\cL_{\bphi,\btheta}(\bx_0)={\color{olive}-\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}+{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}+{\color{teal}\sum\nolimits_{t=2}^T\cL_t}.
$$

<div class="block">

## Training

<div class="columns">
<div>

1. Sample $\bx_0\sim\pd$, $t\sim\Uniform\{2,\ldots,T\}$.
2. Sample $\bepsilon\sim\cN(0,\bI)$; construct $\bx_1$, $\bx_t$.
3. Minimize $\widehat{\cL}$ by SGD: the omitted <span style="color:#8854c0">prior KL</span> is independent of $\btheta$.

</div>
<div>

$$
\bx_s=\sqrt{\bar{\alpha}_s}\bx_0+\sqrt{1-\bar{\alpha}_s}\bepsilon,\quad s\in\{1,t\}.
$$

$$
\begin{aligned}
\widehat{\cL}&={\color{olive}-\log\pt(\bx_0|\bx_1)}\\
&\quad+{\color{teal}\frac{T-1}{2\tilde{\beta}_t}\bigl\|\tilde{\bmu}_t(\bx_t,\bx_0)-\bmu_{\btheta,t}(\bx_t)\bigr\|^2}.
\end{aligned}
$$

$T-1$: uniform timestep average → sum.

</div>
</div>

</div>
<div class="block" style="margin-top: 8px">

## Sampling

<div class="columns">
<div>

1. Sample $\bx_T\sim\cN(0,\bI)$.
2. Denoise $\bx_{t-1}=\bmu_{\btheta,t}(\bx_t)+\sqrt{\tilde{\beta}_t}\bepsilon_t$.
3. Return the mean $\hat{\bx}_0=\bmu_{\btheta,1}(\bx_1)$.

</div>
<div>

For $t=T,\ldots,2$, sample the **reverse kernel**:

$$
\pt(\bx_{t-1}|\bx_t)=\cN\bigl(\bmu_{\btheta,t}(\bx_t),\tilde{\beta}_t\bI\bigr).
$$

Use fresh $\bepsilon_t\sim\cN(0,\bI)$ at each step.

</div>
</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

<!-- Recalls the approved Training/Sampling algorithm before the new mean
reparameterization section. Keep this separate from the preceding Gaussian-KL
result: adding two complete algorithms there would overcrowd its target formulas.
The loss includes reconstruction; the prior KL alone is omitted for optimization.
Uniform t in {2,...,T} explains T-1. Sharing epsilon preserves both marginals.
Sampling returns the final decoder mean rather than sampling its positive variance.
All content is static on entry, as required for Recap. -->

---
clicks: 0
id: outline
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion Parameterizations</div></div>
<div class="outline-item"><span>02</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item"><span>03</span><div>From DDPM to DDIM</div></div>
<div class="outline-item"><span>04</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 0
id: outline-diffusion-reparametrization
section: "Diffusion Parameterizations"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Diffusion Parameterizations</div></div>
<div class="outline-item"><span>02</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item"><span>03</span><div>From DDPM to DDIM</div></div>
<div class="outline-item"><span>04</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 5
id: reparametrization-of-ddpm
class: theorems
---

# Reparametrization of DDPM

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\left[\frac{1}{2\tilde{\beta}_t}\bigl\|\tilde{\bmu}_t(\bx_t,\bx_0)-\bmu_{\btheta,t}(\bx_t)\bigr\|^2\right]
$$

$$
\tilde{\bmu}_t(\bx_t,\bx_0)=\frac{\sqrt{\alpha_t}(1-\bar{\alpha}_{t-1})}{1-\bar{\alpha}_t}\cdot\bx_t+\frac{\sqrt{\bar{\alpha}_{t-1}}(1-\alpha_t)}{1-\bar{\alpha}_t}\cdot{\color{olive}\bx_0}
$$

<div class="columns">
<div v-click="1">

## Forward Noising

$$
\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon
$$

</div>
<div v-click="2">

## Recover Clean Data

$$
{\color{olive}\bx_0}=\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon}{\sqrt{\bar{\alpha}_t}}
$$

</div>
</div>

<div v-click="3">

**Why reparametrize?** Predict the Gaussian noise we add ourselves during training; compute the reverse mean analytically from this prediction.

</div>

<div v-click="4">

$$
\tilde{\bmu}_t(\bx_t,\bepsilon)=\frac{\sqrt{\alpha_t}(1-\bar{\alpha}_{t-1})}{1-\bar{\alpha}_t}\cdot\bx_t+\frac{\sqrt{\bar{\alpha}_{t-1}}(1-\alpha_t)}{1-\bar{\alpha}_t}\cdot{\color{olive}\left(\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon}{\sqrt{\bar{\alpha}_t}}\right)}
$$

</div>
<div class="takeaway" v-click="5">

$$
\tilde{\bmu}_t(\bx_t,\bepsilon)=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}\cdot\bepsilon
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 4
id: reparametrization-of-ddpm-2
class: theorems
---

# Reparametrization of DDPM

$$
\cL_t=\bbE_{{\color{#8854c0}q(\bx_t|\bx_0)}}\left[{\color{olive}\frac{1}{2\tilde{\beta}_t}}\bigl\|\tilde{\bmu}_t(\bx_t,\bx_0)-\bmu_{\btheta,t}(\bx_t)\bigr\|^2\right]
$$

<div class="columns">
<div>

## Target Mean

$$
\tilde{\bmu}_t(\bx_t,\bx_0)=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-{\color{teal}\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}}\cdot\bepsilon
$$

</div>
<div v-click="1">

## Model Mean

$$
\bmu_{\btheta,t}(\bx_t)=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-{\color{teal}\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}}\cdot\bepsilon_{\btheta,t}(\bx_t)
$$

</div>
</div>


<div class="block" v-click="2">

## Noise-Prediction Loss

$$ {1|all} {at:3}
\begin{aligned}
\cL_t&=\bbE_{{\color{#8854c0}q(\bx_t|\bx_0)}}\left[\frac{{\color{teal}(1-\alpha_t)^2}}{{\color{olive}2\tilde{\beta}_t}{\color{teal}\alpha_t(1-\bar{\alpha}_t)}}\bigl\|\bepsilon-\bepsilon_{\btheta,t}({\color{#8854c0}\bx_t})\bigr\|^2\right]\\
&=\bbE_{{\color{#8854c0}\bepsilon\sim\cN(0,\bI)}}\left[\frac{(1-\alpha_t)^2}{2\tilde{\beta}_t\alpha_t(1-\bar{\alpha}_t)}\Bigl\|\bepsilon-\bepsilon_{\btheta,t}\bigl({\color{#8854c0}\sqrt{\bar{\alpha}_t}\bx_0+\sqrt{1-\bar{\alpha}_t}\bepsilon}\bigr)\Bigr\|^2\right]
\end{aligned}
$$

</div>
<div class="takeaway" v-click="4">

Train the network to predict the Gaussian noise $\bepsilon$ used to construct $\bx_t$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
id: one-prediction-three-parameterizations
class: interactive-slide
---

# Prediction Targets and Loss Functions

<NoisePredictionDemo />

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. et al. Denoising Diffusion Probabilistic Models, 2020</a><br><a href="https://arxiv.org/abs/2202.00512">Salimans T., Ho J. Progressive Distillation for Fast Sampling of Diffusion Models, 2022</a></div>

<!-- The compact cards show linked scalar estimates at fixed x_t=1,
alpha_t=0.6, alpha_bar_t=0.39; selecting an output preserves the prediction.
The table below uses vector notation and defines the clean-data, noise and
reverse-mean regression targets and squared errors. Network outputs are evaluated
at x_t and t; the posterior-mean target also depends on the clean training sample.
For linked predictions, ell_epsilon = SNR(t) ell_x0
= alpha_t (1-alpha_bar_t)/(1-alpha_t)^2 ell_mu, pointwise and in expectation.
L_t^(epsilon) denotes the noise MSE, not the weighted DDPM ELBO term L_t.
Multiplying all three forms by a common timestep weight preserves equivalence;
using unit weights for each raw error changes the weighting across timesteps.
The previous slides derive the mean/noise conversion; the following slide
chooses DDPM's simple loss. The next recap retains the clean/noise identity,
with the reverse-mean relation and ELBO weights on its neighboring recap slides.
PDF fixes noise_hat=0.5 and highlights the noise row. -->

---
clicks: 2
id: reparametrization-of-ddpm-3
class: theorems
---

# Reparametrization of DDPM

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)&={\color{olive}\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}-{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}\\
&\quad-\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}
\end{aligned}
$$

<div v-click="1">

$$
\cL_t=\bbE_{\bepsilon\sim\cN(0,\bI)}\left[\frac{(1-\alpha_t)^2}{2\tilde{\beta}_t\alpha_t(1-\bar{\alpha}_t)}\Bigl\|\bepsilon-\bepsilon_{\btheta,t}\bigl(\sqrt{\bar{\alpha}_t}\bx_0+\sqrt{1-\bar{\alpha}_t}\bepsilon\bigr)\Bigr\|^2\right]
$$

</div>


<div v-click="2">

- Dropping the time-dependent coefficient **changes the relative weights of noise levels**.
- The reconstruction term ($t=1$) also uses noise prediction.

<div class="block">

## Simplified Objective

$$
\cL_{\text{simple}}=\bbE_{t\sim\Uniform\{1,\ldots,T\}}\bbE_{\bepsilon\sim\cN(0,\bI)}\Bigl\|\bepsilon-\bepsilon_{\btheta,t}\bigl(\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon\bigr)\Bigr\|^2
$$

</div>

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
id: outline-ddpm
section: "Denoising Diffusion Probabilistic Model (DDPM)"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion Parameterizations</div></div>
<div class="outline-item current"><span>02</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item"><span>03</span><div>From DDPM to DDIM</div></div>
<div class="outline-item"><span>04</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 0
id: generative-models-taxonomy
class: figure-slide
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" denoising-diffusion />

---
clicks: 2
id: denoising-diffusion-probabilistic-model-ddpm
class: theorems
---

# Denoising Diffusion Probabilistic Model (DDPM)

## DDPM as a Hierarchical VAE

- **Encoder:** a fixed Gaussian Markov chain $q(\bx_1,\ldots,\bx_T|\bx_0)$.
- **Latents:** $\bz=(\bx_1,\ldots,\bx_T)$; each $\bx_t$ has the same dimension as $\bx_0$.
- **Decoder:** one Gaussian step $\pt(\bx_0|\bx_1)$.
- **Prior:** a learned Gaussian reverse chain from $p(\bx_T)=\cN(0,\bI)$ down to $\bx_1$.

<div class="columns">
<div>

## Fixed

Sample any $\bx_t$ directly from $\bx_0$:

$$
\bx_t=\sqrt{\bar{\alpha}_t}\,\bx_0+\sqrt{1-\bar{\alpha}_t}\,\bepsilon.
$$

</div>
<div v-click="1">

## Learned

Predict noise to obtain the reverse mean:

$$
\bepsilon_{\btheta,t}(\bx_t)\quad\longrightarrow\quad\bmu_{\btheta,t}(\bx_t).
$$

</div>
</div>

<div class="takeaway" v-click="2">

**Training:** one randomly chosen noise level per example.<br>
**Sampling:** sequential reverse steps from noise to data.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

<!-- Conceptual bridge from taxonomy to the next Training/Sampling algorithms.
The preceding reparameterization makes the learned reverse mean a known function
of the noise predictor. Fixed forward marginals permit random-timestep training
without a simulated trajectory; ancestral sampling still requires successive
reverse steps. The explicit VAE assumptions are retained: the latent prior is the reverse
chain over x_1,...,x_T, with a standard Gaussian terminal prior; the separate
x_1-to-x_0 step is the decoder. This matches the preceding lecture and this
lecture's recap. The next
lecture's static Training/Sampling recap retains these same distinctions. -->

---
clicks: 1
id: denoising-diffusion-probabilistic-model-ddpm-2
class: theorems
---

# Denoising Diffusion Probabilistic Model (DDPM)

<div class="block">

## Training

1. Sample $\bx_0\sim\pd(\bx)$, $t\sim\Uniform\{1,\ldots,T\}$, $\bepsilon\sim\cN(0,\bI)$.
2. Compute noisy image $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$.
3. Minimize $\cL_{\text{simple}}=\|\bepsilon-\bepsilon_{\btheta,t}(\bx_t)\|^2$ by SGD.

</div>
<div class="block" v-click="1">

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
clicks: 3
id: denoising-diffusion-as-a-score-based-generative-model
class: theorems
---

# From Denoising Score Matching to DDPM

**DSM:** learn $\bs_{\btheta,t}(\bx_t)\approx\nabla_{\bx_t}\log q(\bx_t)$ using conditional targets:

$$
\ell_{\btheta}(t)=\bbE_{\pd(\bx_0)}\bbE_{q(\bx_t|\bx_0)}\left\|{\color{#8854c0}\bs_{\btheta,t}(\bx_t)}-{\color{teal}\nabla_{\bx_t}\log q(\bx_t|\bx_0)}\right\|_2^2.
$$

<div v-click="1" style="margin-top:28px">

**Gaussian perturbation:** $\bx_t=\sqrt{\bar\alpha_t}\bx_0+\sqrt{1-\bar\alpha_t}\bepsilon$, $\bepsilon\sim\cN(0,\bI)$.

$$
\nabla_{\bx_t}\log q(\bx_t|\bx_0)
=-\frac{\bx_t-\sqrt{\bar\alpha_t}\bx_0}{1-\bar\alpha_t}
={\color{teal}-\frac{\bepsilon}{\sqrt{1-\bar\alpha_t}}}.
$$

</div>
<div v-click="2" style="margin-top:28px">

**Parameterize the score through noise prediction and substitute into DSM:**

$$
{\color{#8854c0}\bs_{\btheta,t}(\bx_t)=-\frac{\bepsilon_{\btheta,t}(\bx_t)}{\sqrt{1-\bar\alpha_t}}}
\quad\Longrightarrow\quad
\ell_{\btheta}(t)=\frac{\bbE_{\bx_0,\bepsilon}\|{\color{#8854c0}\bepsilon_{\btheta,t}(\bx_t)}-{\color{teal}\bepsilon}\|_2^2}{1-\bar\alpha_t}.
$$

</div>
<div class="block" v-click="3" style="margin-top:28px">

**We recover the DDPM simple loss**, with $t\sim\Uniform\{1,\ldots,T\}$:

$$
\bbE_t\!\left[(1-\bar\alpha_t)\,\ell_{\btheta}(t)\right]
=\bbE_{t,\bx_0,\bepsilon}\|{\color{#8854c0}\bepsilon_{\btheta,t}(\bx_t)}-{\color{teal}\bepsilon}\|_2^2
=\bbE[\cL_{\text{simple}}].
$$

</div>

<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a><br><a href="https://arxiv.org/abs/2006.11239">Ho J., et al. Denoising Diffusion Probabilistic Models, 2020</a></div>

<!-- Narrative: after DDPM Training/Sampling, derive the same training objective
from DSM. Differentiate the conditional Gaussian, substitute its score and the
noise parameterization, then select the variance weight to recover the expected
per-example DDPM simple loss. The DSM theorem supplies the marginal-score optimum;
no denoiser/posterior-mean identity is needed. The data, time and standard Gaussian
noise are sampled independently. The next slide compares DDPM and NCSN perturbations, targets and weights. -->

---
clicks: 2
id: ddpm-vs-ncsn-objectives
class: theorems
---

# DDPM vs NCSN: Objectives

For a chosen perturbation $q(\bx_t|\bx_0)$, define the conditional score error:

$$
\ell_{\btheta}(t)=\bbE_{\pd(\bx_0)}\bbE_{q(\bx_t|\bx_0)}\left\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx_0)\right\|^2.
$$

<div class="block" v-click="1">

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
<div v-click="2">

For a fixed perturbation, replacing the DDPM ELBO weights also changes the objective.

**First connect weights to time sampling; then connect the perturbations.**

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J., et al. Denoising Diffusion Probabilistic Models, 2020</a><br><a href="https://arxiv.org/abs/1907.05600">Song Y., Ermon S. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a></div>

---
clicks: 2
id: loss-weighting-and-time-sampling
class: theorems
---

# Loss Weighting and Time Sampling

Fix the perturbation and its per-step loss $\ell_{\btheta}(t)$; let $w_t>0$.

$$
\cL=\frac1T\sum_{t=1}^{T}w_t\ell_{\btheta}(t).
$$

<div class="block" v-click="1">

## Sampling a noise level more often gives it more weight

$$
\bbE_{t\sim r}[\ell_{\btheta}(t)]
=\sum_{t=1}^T r_t\ell_{\btheta}(t)
=\bbE_{t\sim\Uniform\{1,\ldots,T\}}\!\left[{\color{teal}T r_t}\,\ell_{\btheta}(t)\right].
$$

Conversely, choose $r_t=w_t/\sum_s w_s$ to absorb the weights, up to an overall loss scale.

</div>
<div v-click="2">

**To change time sampling while preserving a chosen objective, compensate:**

$$
\cL=\bbE_{t\sim r}\left[\frac{w_t}{T r_t}\ell_{\btheta}(t)\right],\qquad r_t>0.
$$

The objective stays the same; gradient variance can change. These are **training** times.

</div>

<div class="source"><a href="https://arxiv.org/abs/2303.00848">Kingma D., Gao R. Understanding Diffusion Objectives as the ELBO with Simple Data Augmentation, 2023</a></div>

<!-- Narrative: after identifying weights and perturbations as the two comparison axes,
fix the perturbation. First show that sampling probabilities are effective loss
weights under uniform time sampling. Conversely L=(sum_s w_s/T) E_r[ell] for r_t=w_t/sum_s w_s.
Importance correction is then a consequence, preserving any chosen weighted objective.
Weights/probabilities are independent of theta; equal objectives do not imply equal
stochastic-gradient variance. These are training levels, not generation steps.
Next connect the perturbations by changing coordinates. -->

---
clicks: 2
id: ddpm-and-ncsn-connecting-noise-coordinates
class: theorems
---

# DDPM and NCSN: Connecting Noise Coordinates

**DDPM scales the clean signal as it adds noise:**

$$
\bx_t=\sqrt{\bar{\alpha}_t}\,\bx_0+\sqrt{1-\bar{\alpha}_t}\,\bepsilon,
\qquad \bepsilon\sim\cN(0,\bI).
$$

<div class="block" v-click="1">

## Divide by the signal coefficient

$$
\underbrace{\frac{\bx_t}{\sqrt{\bar{\alpha}_t}}}_{\displaystyle\tilde{\bx}_t}
=\bx_0+
\underbrace{\sqrt{\frac{1-\bar{\alpha}_t}{\bar{\alpha}_t}}}_{\displaystyle\sigma_t}\,\bepsilon.
$$

</div>

<div class="block" v-click="2">

## Rescale the score and its loss

Both the conditional score target and the model scale by $\sqrt{\bar\alpha_t}$:

$$
\tilde{\bs}_{\btheta,t}(\tilde{\bx}_t)
=\sqrt{\bar\alpha_t}\,\bs_{\btheta,t}(\sqrt{\bar\alpha_t}\,\tilde{\bx}_t),
\qquad \tilde\ell_{\btheta}(t)=\bar\alpha_t\,\ell_{\btheta}(t).
$$

Here $\tilde\ell_{\btheta}(t)$ is the DSM error in the rescaled coordinates. Hence

$$
{\color{teal}(1-\bar\alpha_t)\,\ell_{\btheta}(t)
=\sigma_t^2\,\tilde\ell_{\btheta}(t)}.
$$

**The weighted losses agree at each matched noise level.**<br>
Next, compare the sampling rules: ancestral updates and Langevin dynamics.

</div>

<div class="source"><a href="https://arxiv.org/abs/2010.02502">Song J., Meng C., Ermon S. Denoising Diffusion Implicit Models, 2021</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y. et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

<!-- Narrative: the previous slide connects time sampling to weights for a fixed
perturbation. Now keep the DDPM forward sample and divide by its positive signal
coefficient. The conditional Gaussian becomes additive noise with sigma_t squared
=(1-alpha_bar_t)/alpha_bar_t. Conditional and marginal scores transform by the same
chain-rule factor sqrt(alpha_bar_t); transform the model input and output accordingly.
Thus tilde ell=alpha_bar_t ell, and the variance-weighted errors agree exactly.
With matched training-time probabilities this identifies the DDPM simple objective
with the displayed NCSN objective. It does not identify arbitrary schedules, ELBO
weights, independently parameterized networks, optimization dynamics, or samplers.
Sigma_t is additive forward noise here. The next slide compares samplers, using
tilde beta_t for the DDPM reverse-step variance to avoid overloading sigma_t.
No SDE/ODE terminology is needed. DDIM Section 4.3 uses alpha_t for our alpha_bar_t. -->

---
clicks: 3
id: ddpm-reverse-mean-in-score-form
class: [theorems, derivation]
---

# DDPM: Reverse Mean in Score Form

To compare DDPM and Langevin updates, express the DDPM mean in terms of the score.

$$
\bmu_{\btheta,t}(\bx_t)=\frac{\bx_t}{\sqrt{\alpha_t}}-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar\alpha_t)}}\bepsilon_{\btheta,t}(\bx_t).
$$

<div v-click="1">

$$
\bmu_{\btheta,t}(\bx_t)
=\frac{\bx_t}{\sqrt{\alpha_t}}
+\frac{1-\alpha_t}{\sqrt{\alpha_t}}\,
\underbrace{\left(-\frac{\bepsilon_{\btheta,t}(\bx_t)}{\sqrt{1-\bar\alpha_t}}\right)}_{{\color{teal}\bs_{\btheta,t}(\bx_t)}}.
$$

</div>
<div v-click="2">

$$
\bmu_{\btheta,t}(\bx_t)
=\frac{\bx_t+\beta_t\,{\color{teal}\bs_{\btheta,t}(\bx_t)}}{\sqrt{\alpha_t}},
\qquad \beta_t=1-\alpha_t.
$$

</div>
<div class="block" v-click="3">

## Sampling (Ancestral)

$$
\bx_{t-1}=\bmu_{\btheta,t}(\bx_t)+\sqrt{\tilde\beta_t}\,\bepsilon_t,
\qquad \bepsilon_t\sim\cN(0,\bI),\quad t\ge2.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J., et al. Denoising Diffusion Probabilistic Models, 2020</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2021</a></div>

<!-- Narrative: the previous slide reconciles DDPM and NCSN training losses by
rescaling coordinates. To compare sampling next, start with the exact model-mean
formula already displayed in the DDPM Sampling block. First factor the negative
noise prediction and identify it as the model score; only then use beta_t=1-alpha_t
and collect the common denominator. Reveal each algebraic step separately.
The reverse sampling rule and its fixed tilde-beta variance are unchanged;
t>=2 leaves the final decoder step to the complete algorithm. The next slide
substitutes this score-form mean into that same rule and compares it with Langevin.
The derivation has its own slide so the following comparison retains full-width
formulas and the approved font sizes. -->

---
clicks: 2
id: ddpm-vs-ncsn-sampling
class: theorems
---

# DDPM vs NCSN: Sampling

<div class="block">

## Sampling (Ancestral)

1. Compute **one DDPM transition** from $t$ to $t-1$ ($t\ge2$).

$$
\bx_{t-1}
=\bmu_{\btheta,t}(\bx_t)+\sqrt{\tilde\beta_t}\,\bepsilon_t
=\frac{\bx_t+\beta_t\,{\color{teal}\bs_{\btheta,t}(\bx_t)}}{\sqrt{\alpha_t}}
+\sqrt{\tilde\beta_t}\,\bepsilon_t.
$$

</div>
<div class="block" v-click="1">

## Sampling (Annealed Langevin)

1. Run **$L$ NCSN updates at fixed $\sigma_t$**, $l=1,\ldots,L$.

$$
\bx_t^l=\bx_t^{l-1}
+\frac{\eta_t}{2}\,{\color{teal}\bs_{\btheta,\sigma_t}(\bx_t^{l-1})}
+\sqrt{\eta_t}\,\bepsilon_t^l.
$$

<ol start="2"><li>

Set $\bx_{t-1}^0:=\bx_t^L$ and lower the noise level ($t>1$).

</li></ol>

</div>

<div v-click="1">

All step noises are independent $\cN(0,\bI)$ samples.

</div>

<div class="takeaway" v-click="2">

**DDPM:** ancestral transitions between noise levels.<br>
**NCSN:** Langevin MCMC at each fixed noise level.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J., et al. Denoising Diffusion Probabilistic Models, 2020</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2021</a></div>

<!-- Narrative: the previous slide derives the DDPM mean in score form from the
previously taught noise-prediction mean. Substitute that result into the unchanged
reverse step, displaying the intermediate mu term explicitly. Compare representative
updates from top to bottom:
one DDPM reverse transition changes the noise level; L Langevin steps target the
fixed-level noisy marginal before lowering its noise. Finite Langevin steps need not
reach equilibrium. Counts are per level/transition, not a global speed ranking.
No new reverse update is introduced. The reverse kernel
and its fixed tilde-beta variance are unchanged; t>=2 leaves the final decoder step to that
complete algorithm. Initializations are also retained there and in the preceding
NCSN material. Each algorithm reveals as a whole block. The final takeaway contrasts
ancestral draws from successive reverse conditionals with Langevin MCMC targeting
one noisy marginal at a time. Both algorithms are Markovian; fixed-step, finite-L
unadjusted Langevin only approximately samples the target and need not equilibrate.
This prepares the comparison summary and the subsequent DDIM section without
introducing SDEs. -->

---
clicks: 2
id: ddpm-vs-ncsn-summary
class: theorems
---

# DDPM vs NCSN: Summary

<div class="block">

## Summary

<ul>
<li>

Gaussian perturbations:

- DDPM: $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$;
- NCSN: $\bx_t=\bx_0+\sigma_t\cdot\bepsilon$.
- Use $\tilde\bx_t=\bx_t/\sqrt{\bar\alpha_t}$ and $\sigma_t^2=(1-\bar\alpha_t)/\bar\alpha_t$ to recover NCSN.

</li>
<li v-click="1">

Scale target and model scores by $\sqrt{\bar\alpha_t}$ to obtain the rescaled DSM error:

$$
\tilde\ell_{\btheta}(t)=\bar\alpha_t\ell_{\btheta}(t),\qquad
\sigma_t^2\tilde\ell_{\btheta}(t)=(1-\bar\alpha_t)\ell_{\btheta}(t).
$$

</li>
<li v-click="2">

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
id: outline-2
section: "From DDPM to DDIM"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion Parameterizations</div></div>
<div class="outline-item"><span>02</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item current"><span>03</span><div>From DDPM to DDIM</div></div>
<div class="outline-item"><span>04</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 3
id: ddim-from-noise-to-clean-data
class: theorems
---

# DDIM: One Noise, a Whole Trajectory

The simple loss uses **one noise level at a time**, not a complete path:

$$
\cL_{\text{simple}}=\bbE_{\bx_0,t,\bepsilon}\left[\left\|\bepsilon-\bepsilon_{\btheta,t}(\bx_t)\right\|^2\right].
$$

<div class="block" v-click="1">

## Choose one noise vector for the whole path

Draw $\bepsilon\sim\cN(0,\bI)$ once and use it at **every** noise level:

$$
\bx_t=\sqrt{\bar{\alpha}_t}\,\bx_0+\sqrt{1-\bar{\alpha}_t}\,\bepsilon,
\qquad t=1,\ldots,T.
$$

Same Gaussian marginals $q(\bx_t\mid\bx_0)$; a different joint $q(\bx_{1:T}\mid\bx_0)$.

</div>
<div v-click="2">

**DDPM:** the next state uses only $\bx_t$ and fresh noise; its origin no longer matters.

</div>
<div class="takeaway" v-click="3">

**Why non-Markovian?** Different clean-image/noise pairs can give the same $\bx_t$ but different next states. Knowing $\bx_0$ identifies the pair and fixes the continuation.

$$
q(\bx_{t+1}\mid\bx_t,\bx_0)\ne q(\bx_{t+1}\mid\bx_t),\qquad 1\le t<T.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2010.02502">Song J., Meng C., Ermon S. Denoising Diffusion Implicit Models, 2021</a></div>

<!--
Narrative: the preceding DDPM/NCSN comparison separates training from sampling.
Here we construct a different joint across noise levels without changing the
single-level Gaussian training pairs. The next slide derives a deterministic
step along this shared-noise path, first for known clean data and then using the
trained DDPM predictor. The following algorithm repeats the resulting step.

The loss expectation uses the already taught independent samples x_0~p_data,
t~Uniform{1,...,T}, epsilon~N(0,I); x_t is the Gaussian perturbation displayed
below. Each loss evaluation uses one noise level. It never compares adjacent
states of a sampled forward path, so changing their coupling leaves this simple
objective unchanged. The displayed expectation is the population objective;
the earlier Training block gives its per-example SGD estimator.

Draw x_0 from the data and one independent standard Gaussian epsilon. The same
epsilon is used at every t for this entire forward path. In the original DDPM
chain, the accumulated normalized noise is correlated across levels but changes
as new independent step noises are added. The marginal formula alone never said
that DDPM uses a single common epsilon along a realized trajectory.

For 1 <= t < T, solve epsilon=(x_t-sqrt(alpha_bar_t)x_0)/sqrt(1-alpha_bar_t)
and substitute into x_{t+1}. The resulting deterministic transition retains a
nonzero coefficient of x_0 under a strictly decreasing alpha_bar schedule.
Thus in the full process the current noisy state does not screen off the initial
clean state. Intuitively, two different clean-image/noise pairs can meet at the
same noisy state yet require different continuations. Knowing x_0 selects the
pair, while x_t alone does not. By contrast, a DDPM forward step only needs the
current state and fresh independent noise, not knowledge of how it arrived there.
The displayed inequality describes ordinary nondegenerate data;
conditional on a fixed x_0 the path is deterministic after the first noise draw.
Dependence of a reverse posterior on x_0 would not by itself prove non-Markovianity:
the original DDPM posterior also conditions on x_0. We explicitly use a forward step.

The common-noise construction is the zero-transition-noise DDIM limit. The paper's
variational theorem assumes positive transition noise. Same simple noise-MSE
training does not equate all weighted ELBOs or finite-capacity optima. The course
keeps alpha_t=1-beta_t; the paper's alpha_t is our cumulative alpha_bar_t.
-->

---
clicks: 3
id: ddim-vs-ddpm-reverse-step
class: [theorems, derivation]
---

# DDIM: Moving Along the Shared-Noise Path

Two noise levels $s<t$, the **same clean image and noise**:

$$
\begin{aligned}
\bx_t&=\sqrt{\bar\alpha_t}\,{\color{teal}\bx_0}
+\sqrt{1-\bar\alpha_t}\,{\color{#8854c0}\bepsilon},\\
\bx_s&=\sqrt{\bar\alpha_s}\,{\color{teal}\bx_0}
+\sqrt{1-\bar\alpha_s}\,{\color{#8854c0}\bepsilon}.
\end{aligned}
$$

<div v-click="1">

**If $\bx_0$ were known:** eliminate $\bepsilon$ using the current $\bx_t$.

$$
\bx_s=\sqrt{\bar\alpha_s}\,\bx_0
+\sqrt{\frac{1-\bar\alpha_s}{1-\bar\alpha_t}}
\left(\bx_t-\sqrt{\bar\alpha_t}\,\bx_0\right).
$$

Given $\bx_t$ and $\bx_0$, $\bx_s$ is fixed: **no new noise is needed**.

</div>
<div v-click="2">

**During generation:** estimate the unknown pair with the trained DDPM predictor.

$$
\hat{\bepsilon}=\bepsilon_{\btheta,t}(\bx_t),\qquad
\hat{\bx}_0=\frac{\bx_t-\sqrt{1-\bar\alpha_t}\,\hat{\bepsilon}}{\sqrt{\bar\alpha_t}}.
$$

</div>
<div v-click="3">

**Substitute the estimates** into the shared-noise path:

$$
\boxed{\bx_s=\sqrt{\bar\alpha_s}\,\hat{\bx}_0
+\sqrt{1-\bar\alpha_s}\,\hat{\bepsilon}.}
$$

The noise schedule is unchanged; the learned sampling step is approximate.

</div>

<div class="source"><a href="https://arxiv.org/abs/2010.02502">Song J., Meng C., Ermon S. Denoising Diffusion Implicit Models, 2021</a></div>

<!--
Narrative: the previous slide constructs a whole path from x_0 and one epsilon.
Here we derive how to move to a less noisy state on that path. The next slide
keeps the existing complete algorithm, recomputing both estimates at each step.

Start with two levels from the preceding construction, using the same true x_0
and epsilon in both rows; the matching colors emphasize that coupling. Let
0<=s<t<=T and retain the original positive noise schedule, with alpha_bar_0=1.
If x_0 were known, solve the first row for
epsilon=(x_t-sqrt(alpha_bar_t)x_0)/sqrt(1-alpha_bar_t), then substitute it into
the second row. This gives the displayed exact deterministic transition for
the chosen common-noise construction. Its determinism follows from that
construction, not from deleting a term in the old ancestral update.

During generation x_0 is unknown. The DDPM noise predictor and the familiar
clean-data conversion supply epsilon_hat and xhat_0. Substituting xhat_0 into the
known-clean transition makes the residual x_t-sqrt(alpha_bar_t)xhat_0 equal to
sqrt(1-alpha_bar_t)epsilon_hat. The denominator cancels, yielding the boxed
DDIM step. Call the predictor once and keep these estimates fixed within this
transition only. Recompute them at the next state, as in the unchanged algorithm.

The connection to DDPM is the same single-level training distributions, the same
noise-prediction objective and the same trained network. For intermediate levels,
the original DDPM conditional remains stochastic even if x_t and x_0 are known;
our shared-noise construction makes it deterministic. Neither beta_t nor the
schedule alpha_bar_t is set to zero. We changed the coupling between levels.

Replacing the true pair by predictions gives an approximate generative sampler;
even an optimal denoiser does not make arbitrary finite-step DDIM updates exact.
It does not take the mean of each original DDPM reverse conditional. The forward
construction is non-Markovian, while the learned sampler remains a Markov map.
The general stochastic family and its interpolation parameter remain out of scope.
-->

---
clicks: 0
id: ddim-shared-paths-demo
class: interactive-slide
---

# DDIM: Shared Paths and Deterministic Steps

<DdimPathsDemo />

<div class="source">Original two-point illustration. <a href="https://arxiv.org/abs/2010.02502">Song J., Meng C., Ermon S. Denoising Diffusion Implicit Models, 2021</a></div>

<!--
Narrative: the preceding slide derives a single deterministic transition from
a shared-noise path and estimated clean/noise pair. This diagram connects the
non-Markovian forward construction to that estimated local transition in one
coordinate system. The following unchanged algorithm repeats the illustrated step.

The scalar data distribution puts equal mass at x_0=-1 and x_0=+1. Define
u=1-alpha_bar, so the forward noising marginal is
x=sqrt(1-u)x_0+sqrt(u)epsilon with epsilon~N(0,1). The default observation is
x=.35 at u=.5 and is fixed: changing it was not useful for this illustration.
It is an intermediate noisy observation, not a full sampling run initialized
from the terminal prior. Mode changes restart the explanation at this same
observation; Reset restores unknown history and forward mode. The active stage
and history selection persist when leaving and returning. Buttons also work
with the pen enabled.

Forward mode: conditioning on the observed x leaves two possible clean/noise
pairs. Their Gaussian Bayes weights are (1-m)/2 and (1+m)/2, where
m=tanh(sqrt(1-u)x/u). Both shared-noise paths pass through the same current point.
Selecting a known clean origin only reveals information, keeping that observation
fixed. The conditional distribution at the future u=.8 changes from the weighted
pair of point masses to one point mass. Mere branching alone would not establish
non-Markovianity; it is dependence on the extra history at fixed current state
that matters. These are conditional paths, not samples claiming to illustrate
the whole marginal distribution. The Gaussian conditional marginals q(x_u|x_0)
match DDPM at each u; the unconditional marginal is a two-component mixture.

DDIM mode explains ONE transition, separating five stages that were previously
conflated by a single Step click:
1. Predict noise and clean data from the current observation. The analytic
   population MSE clean prediction is m, and predicted noise is the forward
   residual divided by sqrt(u). At x=.35,u=.5 this gives xhat_0=.458156 and
   epsilonhat=.036819. This is an estimate, not knowledge of the true origin.
   The two possible true histories are faint; the teal estimated origin lies
   between their clean endpoints. The notation epsilon_theta denotes the role
   of the denoiser; this toy computes the optimal predictor analytically.
2. Hold that estimated pair fixed and draw its shared-noise path through the
   observation. The true candidate paths are removed to focus on this one curve.
3. Choose the fixed lower level u_s=.1 and preview the unique point where that
   vertical line meets the estimated path. Its value is x_s=.446288. Changing
   the signal/noise weights constructs this point without a new random draw.
4. Move the current orange point to x_s. The cached pair and entire dashed
   guide remain unchanged during the move; this is the key visual invariant.
5. Only now recompute from x_s,u_s. The new pair is approximately
   (xhat_0,epsilonhat)=(.999580,-1.587453). The current point stays fixed, while
   the clean estimate and guide change. Draw this new guide only toward lower
   noise levels. The dark segment records the completed transition. The next
   algorithm repeats these operations; this illustration does not run a loop.

Back reverses explanation stages; Replay step returns to the initial estimate.
No history selection from Forward mode enters the DDIM prediction. The toy
predictor is exact, but a finite DDIM sampler is approximate; no exact finite-step
marginal-preservation claim is made. PDF keeps unknown forward history and the
completed single transition before recomputation, together with its fixed pair,
numerical update and the five-stage explanation in the takeaway.

-->

---
clicks: 2
id: ddim-deterministic-sampling
class: theorems
---

# DDIM: Deterministic Sampling

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
<div v-click="1">

**Deterministic steps:** randomness comes from $\bx_T$; recompute both estimates at every step.

**Markov sampler:** the next state depends only on the current $\bx_t$ and the chosen times.

</div>
<div v-click="2">

**Fewer steps:** choose $K\ll T$ on the original schedule: $K$ network evaluations, no retraining.

</div>

<div class="source"><a href="https://arxiv.org/abs/2010.02502">Song J., Meng C., Ermon S. Denoising Diffusion Implicit Models, 2021</a></div>

<!--
The preceding comparison shows how both coefficients and transition noise change.
Here the full
sampling loop makes the deterministic rule executable. At iteration k, t=t_k is the current level and s=t_{k-1} is the next
level. The three displayed assignments are ordered: call the noise predictor
once, use its cached output epsilon_hat to compute xhat_0, then compute x_s.
Both estimates are local to this iteration and are recomputed at the next k.
The newly computed x_s is exactly the next iteration's current x_t. At the last
iteration k=1, s=t_0=0. The teal coefficients mark the change from t to s, while
the network is evaluated at the current t and x_t, not at the destination s.
The update is a constructed sampling rule, not just the ancestral DDPM update
with its random term removed: the deterministic coefficients also change.

Sampling still draws a random output: x_T is random and the fixed sequence of
DDIM updates maps that random input to x_0. This is the same source of randomness
as in a normalizing flow or a GAN generator; invertibility is not asserted here.
Think of an ensemble of initial noise samples: deterministic motion can reshape
their distribution without adding new random kicks. DDIM chooses different paths
from stochastic DDPM; it does not reproduce each DDPM reverse conditional by its
mean. A learned denoiser and a finite grid give an approximate generative model.

Indices decrease along the chosen grid. Each selected t is an original training
noise level. alpha_bar_t = product_{i=1}^t (1-beta_i), with alpha_bar_0=1. Keep the
original schedule values at selected indices; do not restart or renumber the
schedule as a new K-step training process. For positive beta, s<t implies
alpha_bar_s>alpha_bar_t: the signal coefficient grows and the noise coefficient
shrinks as sampling moves toward clean data. At every step recompute epsilon_theta,t(x_t) and then xhat_0; neither
estimate is held fixed along the whole trajectory. K counts transitions from
T=t_K to t_0=0. For example, a predictor trained on T=1000 levels may be used on a
50-step subset. Fewer steps save computation but can reduce sampling accuracy;
different grids need not yield identical samples even with the same initial draw.
At s=0, alpha_bar_0=1, so the final update returns that step's clean estimate.
One network evaluation per step refers to the unguided denoiser; ordinary CFG
later uses two denoiser evaluations per step.

The stochastic family and its interpolation parameter are deliberately omitted
from the teaching slides. Later, deterministic DDIM can be connected to the
probability-flow ODE after rescaling x_t/sqrt(alpha_bar_t) and using
sqrt((1-alpha_bar_t)/alpha_bar_t) as the clock. Do not call it exactly the ordinary
Euler step in the original t coordinate or promise exact finite-step inversion.
Transition to guidance: we have changed the sampling rule while reusing the
predictor; next we modify its predictions to steer generation toward a condition.
-->

---
clicks: 0
id: outline-3
section: "Model Guidance"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion Parameterizations</div></div>
<div class="outline-item"><span>02</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item"><span>03</span><div>From DDPM to DDIM</div></div>
<div class="outline-item current"><span>04</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 2
id: guidance
class: theorems
---

# Guidance

<ul>
<li>

**Unconditional generation:** $\pt(\bx)$. **Conditional generation:** $\pt(\bx|\by)$.

</li>
<li v-click="1">

The condition $\by$ can be a class label, a text prompt, or reference images.

</li>
<li v-click="2">

**Guidance** modifies sampling to strengthen the influence of $\by$.

</li>
</ul>

<div class="columns" v-click="1" style="margin-top:18px;text-align:center">
<div>
<img src="/figs/flux2-cat-watermelon.png" alt="FLUX.2 generated studio image of a black cat behind a watermelon slice" style="width:100%;height:260px;object-fit:contain" />

**FLUX.2** · Text prompt (abridged)<br>
Black cat behind a watermelon.

</div>
<div>
<img src="/figs/flux2-open-sign.png" alt="FLUX.2 generated sushi restaurant entrance with a red OPEN neon sign above the door" style="width:100%;height:260px;object-fit:contain" />

**FLUX.2** · Text prompt (abridged)<br>
Sushi restaurant with a red "OPEN" sign.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022.</a><br><a href="https://docs.bfl.ai/guides/prompting_guide_flux2">Black Forest Labs. FLUX.2 Prompting Guide. Published model outputs; text conditions abridged.</a></div>

<!--
Narrative: after changing the sampling rule with DDIM, introduce control through
conditions and distinguish it from guidance. The next slide expands the range of
conditional generation tasks. Guidance is a sampling intervention, not a synonym
for a conditional model. Its strength can trade adherence/fidelity against
diversity, as developed later in the classifier and classifier-free sections.

The two unmodified FLUX.2 examples come from the official prompting guide. Their
prompts differ; they do not isolate guidance strength or measure a quality gain.
The guide does not specify each example's variant, seed or guidance scale.
The captions paraphrase the conditions rather than quote the complete prompts.
-->

---
clicks: 3
id: conditional-models
class: theorems
---

# Conditional Generation

Given a condition $\by$, generate $\bx\sim\pt(\bx|\by)$ with model parameters $\btheta$.

<table class="conditional-task-table">
<colgroup><col style="width:32%"><col style="width:18%"><col style="width:50%"></colgroup>
<thead>
<tr>
<th>

Condition $\by$

</th>
<th>

Generated $\bx$

</th>
<th>Tasks</th>
</tr>
</thead>
<tbody v-click="1" class="image-tasks">
<tr><td><p>Class label or text prompt</p></td><td><p>Image</p></td><td><p>Class-conditional / text-to-image</p></td></tr>
<tr><td><p>Image (+ mask / instruction)</p></td><td><p>Image</p></td><td><p>Editing, inpainting, super-resolution</p></td></tr>
<tr><td><p>Text (+ reference image)</p></td><td><p>Video</p></td><td><p>Text-to-video / image-to-video</p></td></tr>
</tbody>
<tbody v-click="2">
<tr><td><p>Prompt + context</p></td><td><p>Text / code</p></td><td><p>Chat, translation, summarization, coding</p></td></tr>
<tr><td><p>Image (+ question)</p></td><td><p>Text</p></td><td><p>Captioning / visual question answering</p></td></tr>
<tr><td><p>Speech</p></td><td><p>Text</p></td><td><p>Speech recognition</p></td></tr>
</tbody>
<tbody v-click="3">
<tr><td><p>Text</p></td><td><p>Audio</p></td><td><p>Speech synthesis, music, sound effects</p></td></tr>
</tbody>
</table>

<div class="source"><a href="https://arxiv.org/abs/2203.02155">Ouyang L. et al. InstructGPT, 2022.</a> · <a href="https://arxiv.org/abs/2107.03374">Chen M. et al. Codex, 2021.</a> · <a href="https://arxiv.org/abs/2301.12597">Li J. et al. BLIP-2, 2023.</a> · <a href="https://arxiv.org/abs/2301.12503">Liu H. et al. AudioLDM, 2023.</a><br><a href="https://arxiv.org/abs/2211.09800">Brooks T. et al. InstructPix2Pix, 2023.</a> · <a href="https://arxiv.org/abs/2112.10752">Rombach R. et al. Latent Diffusion, 2022.</a> · <a href="https://arxiv.org/abs/2503.20314">Wan Team. Wan, 2025.</a></div>

<style>
.conditional-task-table { margin-top: 24px; table-layout: fixed; }
.conditional-task-table th, .conditional-task-table td { padding-left: 20px; padding-right: 20px; }
.slidev-layout .conditional-task-table tr { border: 0; }
.slidev-layout .conditional-task-table td { border-bottom: 0; }
.conditional-task-table p { margin: 0; }
.conditional-task-table .image-tasks { background: #eaf5f4; }
.conditional-task-table .image-tasks td:nth-child(2) { color: var(--teal); font-weight: 650; }
.conditional-task-table tbody tr:first-child td { padding-top: 16px; }
.conditional-task-table tbody tr:last-child td { padding-bottom: 16px; }
.conditional-task-table tbody + tbody tr:first-child td { border-top: 1px solid #dce5eb; }
</style>

<!--
Synchronized with the corresponding slide in Lectures 1 and 8. One overview
slide groups applications with the same input/output types, retaining the
practical examples without listing every task separately. The unconditional
case has already been introduced. Parameters are named here because this is
their first use in the introductory lecture.

For image editing, the extra condition can be an instruction. Inpainting uses
observed image pixels and their mask. Super-resolution uses a low-resolution
input image; no extra text or mask is required. The optional reference image
adds a visual condition to video generation. Prompt context can contain a
conversation, document, source-language text, or code. A question is optional
for captioning and is supplied for visual question answering. Text specifies
words to speak in speech synthesis or describes music/sounds in text-to-audio.

These are representative applications, not an exhaustive taxonomy or a claim
about one universal model. Lecture 1 next returns to how distributions are
learned; Lecture 8 develops label and text conditioning through image examples
before deriving guidance. Reveal visual outputs, text outputs, then audio.
-->


---
clicks: 0
id: label-guidance
class: figure-slide
---

# Label Guidance

**Label:** Ostrich (10th ImageNet class)

<img class="hero" src="/figs/label_conditioning.png" alt="Ostrich class-conditional image samples" />

<div class="source"><a href="https://arxiv.org/abs/1906.00446">Razavi A., Oord A., et al. Generating Diverse High-Fidelity Images with VQ-VAE-2, 2019</a></div>

---
clicks: 0
id: text-guidance
class: figure-slide
---

# Text Guidance

**Prompt:** Anna<br>
SDXL fine-tuned on Disney princesses. Same initial noise; only $\gamma$ changes.

<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin-top:26px;text-align:center">
<div>

$\gamma=3.5$

<img src="/figs/sdxl-cfg-3.5.png" alt="Anna generated with SDXL and classifier-free guidance scale 3.5" style="width:100%;aspect-ratio:1;object-fit:contain" />
</div>
<div>

$\gamma=4.5$

<img src="/figs/sdxl-cfg-4.5.png" alt="Anna generated from the same initial noise with guidance scale 4.5" style="width:100%;aspect-ratio:1;object-fit:contain" />
</div>
<div>

$\gamma=5.5$

<img src="/figs/sdxl-cfg-5.5.png" alt="Anna generated from the same initial noise with guidance scale 5.5" style="width:100%;aspect-ratio:1;object-fit:contain" />
</div>
<div>

$\gamma=6.5$

<img src="/figs/sdxl-cfg-6.5.png" alt="Anna generated from the same initial noise with guidance scale 6.5" style="width:100%;aspect-ratio:1;object-fit:contain" />
</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2410.03941">Kasymov A., et al. AutoLoRA: AutoGuidance Meets Low-Rank Adaptation for Diffusion Models, 2024. Fig. 3, top row (selected columns).</a> <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0.</a></div>

<!--
Published baseline CFG samples, not the AutoLoRA row: SDXL with Disney Princess
LoRA, fixed LoRA weight 0.7. The source uses w for the CFG scale; here it is gamma
to match the lecture. The caption confirms identical initial noise. This single
seed illustrates changes in appearance, not a measurement of sample diversity.
Author-approved replacement of the former panda illustration from
<a href="https://arxiv.org/abs/2112.10741">Nichol A., et al. GLIDE, 2022</a>.
-->

---
clicks: 6
id: guidance-in-generative-models
class: theorems
---

# Guidance in Generative Models

<div class="block">

## How to make a conditional model?

Instead of sampling from $\pt(\bx)$, we sample from $\pt(\bx|\by)$.

</div>
<div v-click="1">

Given **supervised** data $\{(\bx_i,\by_i)\}_{i=1}^n$, we can treat $\by$ as an additional model input:

</div>
<ul>
<li v-click="2">

$\pt(x_j|\bx_{1:j-1},{\color{olive}\by})$ for AR models;

</li>
<li v-click="3">

Encoder $q_{\bphi}(\bz|\bx,{\color{olive}\by})$ and decoder $\pt(\bx|\bz,{\color{olive}\by})$ for VAEs;

</li>
<li v-click="4">

$G_{\btheta}(\bz,{\color{olive}\by})$ for NFs and GANs;

</li>
<li v-click="5">

$\pt(\bx_{t-1}|\bx_t,{\color{olive}\by})$ for DDPMs.

</li>
</ul>
<div class="block" v-click="6">

## Challenge

- Empirically, images sampled with this procedure do not fit well enough to the desired label $\by$.
- Being able to control the strength of guidance is especially valuable.

</div>

---
clicks: 0
id: outline-4
section: "Classifier Guidance"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion Parameterizations</div></div>
<div class="outline-item"><span>02</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item"><span>03</span><div>From DDPM to DDIM</div></div>
<div class="outline-item current"><span>04</span><div>Model Guidance<div class="outline-sub"><b>Classifier Guidance</b><br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 3
id: classifier-guidance
class: theorems
---

# Classifier Guidance

<div class="block">

## Sampling (Ancestral)

1. Sample fresh $\bepsilon_t\sim\cN(0,\bI)$ and update ($t\ge2$).

$$
\bx_{t-1}=\frac{\bx_t+\beta_t{\color{teal}\bs_{\btheta,t}(\bx_t)}}{\sqrt{\alpha_t}}+\sqrt{\tilde\beta_t}\,\bepsilon_t.
$$

</div>
<div v-click="1">

The noise predictor defines an **estimate** of the noisy-data score:

$$
{\color{teal}\bs_{\btheta,t}(\bx_t)}=-\frac{\bepsilon_{\btheta,t}(\bx_t)}{\sqrt{1-\bar\alpha_t}}
\approx\nabla_{\bx_t}\log q(\bx_t).
$$

</div>
<div class="block" v-click="2">

## Conditional Generation

Use $\bs_{\btheta,t}(\bx_t,\by)\approx\nabla_{\bx_t}\log q(\bx_t|\by)$ in the same step:

$$
\bx_{t-1}=\frac{\bx_t+\beta_t{\color{olive}\bs_{\btheta,t}(\bx_t,\by)}}{\sqrt{\alpha_t}}+\sqrt{\tilde\beta_t}\,\bepsilon_t.
$$

</div>
<div v-click="3">

How can we relate $q(\bx_t)$ and $q(\bx_t|\by)$?

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 4
id: classifier-guidance-guided-score-function
class: theorems
---

# Classifier Guidance: Guided Score Function

For now, restrict $\by$ to **class labels**. By Bayes' theorem,

$$
q(\bx_t|\by)=\frac{q(\bx_t)q(\by|\bx_t)}{q(\by)}.
$$

<div v-click="1">

$$
\nabla_{\bx_t}\log q(\bx_t|\by)
=\nabla_{\bx_t}\log q(\bx_t)+\nabla_{\bx_t}\log q(\by|\bx_t).
$$

</div>
<div class="block" v-click="2">

## Classifier-Guided Estimate

Train a noisy-data classifier $p(\by|\bx_t)\approx q(\by|\bx_t)$ at every noise level, providing $t$ as an input.

$$
{\color{olive}\bs_{\btheta,t}(\bx_t,\by)}
:=\bs_{\btheta,t}(\bx_t)+{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}
\approx\nabla_{\bx_t}\log q(\bx_t|\by).
$$

</div>
<div class="block" v-click="3">

## Guidance Scale

$$
{\color{#8854c0}\bs^\gamma_{\btheta,t}(\bx_t,\by)}:=\bs_{\btheta,t}(\bx_t)+{\color{teal}\gamma}\cdot\nabla_{\bx_t}\log p(\by|\bx_t).
$$

<div v-click="4">

$\gamma$ controls guidance strength: $\gamma=0$ gives the unconditional estimate; $\gamma=1$ gives the conditional estimate.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 4
id: classifier-guidance-distribution-sharpening
class: theorems
---

# Classifier Guidance: Distribution Sharpening

<div class="block">

## Scaled Guided Score Estimate

$$
{\color{#8854c0}\bs^\gamma_{\btheta,t}(\bx_t,\by)}
=\bs_{\btheta,t}(\bx_t)+{\color{teal}\gamma}\,\nabla_{\bx_t}\log p(\by|\bx_t).
$$

</div>
<div class="block" v-click="1">

## Exact Scores at a Fixed Noise Level

$$ {1|1-2|all} {at:2}
\begin{aligned}
{\color{#8854c0}\bs_t^\gamma(\bx_t,\by)}
&:=\nabla_{\bx_t}\log q(\bx_t)+{\color{teal}\gamma}\,\nabla_{\bx_t}\log q(\by|\bx_t)\\
&=\nabla_{\bx_t}\log q_\gamma(\bx_t|\by),\\
q_\gamma(\bx_t|\by)&:=\frac{q(\bx_t)q(\by|\bx_t)^\gamma}{Z_t(\by,\gamma)}.
\end{aligned}
$$

</div>
<div v-click="4">

Larger $\gamma$ favors samples with higher class probability; very large values can reduce diversity and introduce artifacts.

**This fixed-level identity does not specify the final distribution of the guided sampler.**

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a><br><a href="https://arxiv.org/abs/2410.02416">Sadat S. et al. Eliminating Oversaturation and Artifacts of High Guidance Scales in Diffusion Models, 2025</a></div>

---
clicks: 0
id: guidance-scale-changes-the-density
class: interactive-slide
---

<script setup>
import GuidanceDensityDemo from './components/GuidanceDensityDemo.vue'
</script>

# Guidance Scale Changes the Density

$$
q_\gamma(x_t|y)\propto q(x_t)\,q(y|x_t)^\gamma\qquad\text{at a fixed noise level.}
$$

<GuidanceDensityDemo />

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

<!-- Original analytic one-dimensional Gaussian-mixture example. Its classifier uses only the scalar observation. The normalizing constant is computed numerically on [-5, 5]. This fixed-level identity does not identify the final distribution of the complete guided sampler. PDF shows gamma = 0, 1, 3, 7 for class B. -->

---
clicks: 1
id: classifier-guidance-overview
class: theorems
---

# Classifier Guidance: Overview

<div class="block">

## Training

1. Train the DDPM as before.
2. Train an additional classifier $p(\by|\bx_t)$ on noisy data (time-dependent).

</div>
<div class="block" v-click="1">

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
id: outline-5
section: "Classifier-Free Guidance"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion Parameterizations</div></div>
<div class="outline-item"><span>02</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item"><span>03</span><div>From DDPM to DDIM</div></div>
<div class="outline-item current"><span>04</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br><b>Classifier-Free Guidance</b></div></div></div>

</div>

---
clicks: 6
id: classifier-free-guidance
class: theorems
---

# Classifier-Free Guidance

We want guidance without training an additional noisy-data classifier $p(\by|\bx_t)$.

<div class="block" v-click="1">

## Bayes Theorem

$$ {1|all} {at:2}
\begin{aligned}
{\color{teal}\nabla_{\bx_t}\log q(\by|\bx_t)}&=\nabla_{\bx_t}\log\left(\frac{q(\bx_t|\by)q(\by)}{q(\bx_t)}\right)\\
&=\nabla_{\bx_t}\log q(\bx_t|\by)-\nabla_{\bx_t}\log q(\bx_t)
\end{aligned}
$$

</div>
<div class="block" v-click="3">

## Scaled Guided Score Function

$$ {1|1-2|all} {at:4}
\begin{aligned}
\bs_t^\gamma(\bx_t,\by)&=\nabla_{\bx_t}\log q(\bx_t)+\gamma\cdot{\color{teal}\nabla_{\bx_t}\log q(\by|\bx_t)}\\
&=\nabla_{\bx_t}\log q(\bx_t)+\gamma\cdot\bigl({\color{teal}\nabla_{\bx_t}\log q(\bx_t|\by)-\nabla_{\bx_t}\log q(\bx_t)}\bigr)\\
&=(1-\gamma)\cdot\nabla_{\bx_t}\log q(\bx_t)+\gamma\cdot\nabla_{\bx_t}\log q(\bx_t|\by)
\end{aligned}
$$

</div>

<div class="takeaway" v-click="6">

The gradient of the class log-probability is the difference between conditional and unconditional scores.
**Learn both scores and combine their estimates; no separate classifier is needed.**

</div>

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a></div>

---
clicks: 4
id: classifier-free-guidance-formulation
class: theorems
---

# Classifier-Free Guidance: Formulation

<div class="block">

## Scaled Guided Score Function

$$
\bs_t^\gamma(\bx_t,\by)=(1-\gamma)\cdot\nabla_{\bx_t}\log q(\bx_t)+\gamma\cdot\nabla_{\bx_t}\log q(\bx_t|\by)
$$

<div v-click="1">

Replace the exact scores by their learned estimates:

$$
\bs^\gamma_{\btheta,t}(\bx_t,\by)=(1-\gamma)\cdot\bs_{\btheta,t}(\bx_t)+\gamma\cdot\bs_{\btheta,t}(\bx_t,\by)
$$

</div>
</div>
<div class="block" v-click="2">

## Naive training approach

<ul>
<li>

Train an unconditional score model $\bs_{\btheta,t}(\bx_t)$.

</li>
<li>

Train a conditional score model $\bs_{\btheta,t}(\bx_t,\by)$.

</li>
</ul>
</div>
<div class="block" v-click="3">

## Sampling (Guided)

Compute a guided DDPM step ($t\ge2$).

$$
\bx_{t-1}=\frac{\bx_t+\beta_t{\color{olive}\bs^\gamma_{\btheta,t}(\bx_t,\by)}}{\sqrt{\alpha_t}}+\sqrt{\tilde\beta_t}\,\bepsilon_t
$$

</div>
<div v-click="4">

How to avoid training two separate score function models?

</div>

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a></div>

---
clicks: 0
id: cfg-interpolation-and-extrapolation
class: interactive-slide
---

<script setup>
import CfgExtrapolationDemo from './components/CfgExtrapolationDemo.vue'
</script>

# CFG: Interpolation and Extrapolation

$$
\bs^\gamma_t=\bs_t(\bx_t,\varnothing)+\gamma\bigl(\bs_t(\bx_t,\by)-\bs_t(\bx_t,\varnothing)\bigr)
$$

<CfgExtrapolationDemo />

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a></div>

<!-- Original analytic toy example. Scores are evaluated at one fixed observation of an analytic two-dimensional Gaussian mixture; vectors use a common fixed display scale. Gamma = 0 selects unconditional, gamma = 1 selects conditional, 0 < gamma < 1 interpolates, gamma > 1 extrapolates. PDF simultaneously shows gamma = 0, 1, 3. This is score-space geometry, not a sampling trajectory. -->

---
clicks: 1
id: classifier-free-guidance-3
class: theorems
---

# Classifier-Free Guidance

$$
\bs^\gamma_{\btheta,t}(\bx_t,\by)=(1-\gamma)\cdot\bs_{\btheta,t}(\bx_t)+\gamma\cdot\bs_{\btheta,t}(\bx_t,\by)
$$

<div class="block">

## CFG

1. Introduce the "absence of conditioning" label $\by=\varnothing$.
2. Identify the unconditional score model $\bs_{\btheta,t}(\bx_t)=\bs_{\btheta,t}(\bx_t,\varnothing)$.
3. Train one model on paired data, replacing $\by$ with $\varnothing$ with fixed probability.
4. Evaluate the model twice per sampling step: with $\by$ and with $\varnothing$.

</div>
<div class="block" v-click="1">

## Sampling (Guided)

1. Update with fresh $\bepsilon_t\sim\cN(0,\bI)$ for $t=T,\ldots,2$.

$$
\bx_{t-1}=\frac{\bx_t+\beta_t{\color{olive}\bs^\gamma_{\btheta,t}(\bx_t,\by)}}{\sqrt{\alpha_t}}+\sqrt{\tilde\beta_t}\,\bepsilon_t.
$$

<ol start="2"><li>

Return $\hat\bx_0=\bmu^\gamma_{\btheta,1}(\bx_1,\by)$, as before.

</li></ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 1
id: classifier-free-guidance-guidance-interval
class: theorems
---

# Classifier-Free Guidance: Guidance Interval

Apply extra guidance only at intermediate noise levels.

<img src="/figs/guidance-interval-figure2.png" alt="Figure 2 from Kynkäänniemi et al.: the conditional density has two modes; guidance everywhere loses one, while limiting guidance to a noise interval preserves both." style="width:100%;height:310px;object-fit:contain;margin:14px 0" />

<div v-click="1">

**Toy example ($\gamma=6$):** guidance everywhere drops a mode; limiting the interval restores both.

Outside the interval, $\gamma_t=1$: **conditioning remains**. Sampling runs **right to left** ($\sigma\downarrow$).

</div>

<div class="source"><a href="https://arxiv.org/abs/2404.07724">Kynkäänniemi T. et al. Applying Guidance in a Limited Interval Improves Sample and Distribution Quality in Diffusion Models, 2024. Fig. 2.</a></div>

<!--
Figure 2 from PDF v1, page 3: all panels and their original labels are preserved.
The paper uses sigma for the noise level, decreasing during sampling. Panel (a)
shows the unconditional and conditional densities; (b) guides everywhere, losing
one mode; (c) disables guidance at high noise and recovers both modes; (d) also
turns it off at low noise with little effect in this toy example. These interval
endpoints are illustrative, not a universal prescription. Select the interval for
the model and sampler. gamma_t=1 preserves conditional sampling; gamma_t=0 would
instead select the unconditional model in the preceding CFG convention.
-->

---
clicks: 3
id: classifier-free-guidance-guidance-distillation
class: theorems
---

# Classifier-Free Guidance: Guidance Distillation

Learn the guided prediction in a single model evaluation.

<div style="display:grid;grid-template-columns:1fr 100px 1fr;gap:20px;align-items:center;margin:14px 0">
<div class="block" style="margin:0">

## Teacher: two evaluations

$$
\bs_{\btheta,t}(\bx_t,\varnothing),\quad\bs_{\btheta,t}(\bx_t,\by)
$$

Combine predictions using $\gamma$.

</div>
<div v-click="1" style="text-align:center">

distill

$$
\longrightarrow
$$

</div>
<div class="block" v-click="1" style="margin:0">

## Student: one evaluation

$$
\bs_{\bphi,t}(\bx_t,\by,\gamma)
$$

Pass $\gamma$ as an extra input.

</div>
</div>

<div v-click="1">

$$
\bs_{\bphi,t}(\bx_t,\by,\gamma)\approx
(1-\gamma)\bs_{\btheta,t}(\bx_t,\varnothing)+\gamma\bs_{\btheta,t}(\bx_t,\by)
$$

</div>

<div class="block" v-click="2">

## Training

1. Sample $(\bx_0,\by)\sim\pd$, $t\sim\Uniform\{1,\ldots,T\}$, $\gamma\sim\Uniform[\gamma_{\min},\gamma_{\max}]$.
2. Sample $\bx_t\sim q(\bx_t|\bx_0)$ and compute the **fixed teacher target** $\bs^\gamma_{\btheta,t}(\bx_t,\by)$.
3. Update only $\bphi$ to minimize $\cL=\|\bs_{\bphi,t}(\bx_t,\by,\gamma)-\bs^\gamma_{\btheta,t}(\bx_t,\by)\|_2^2$.

</div>

<div class="block" v-click="3">

## Sampling

1. Evaluate the student once per step; keep the sampler and step count. Used in **FLUX.2 [dev]**.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.03142">Meng C. et al. On Distillation of Guided Diffusion Models, 2023.</a><br><a href="https://huggingface.co/black-forest-labs/FLUX.2-dev">Black Forest Labs. FLUX.2 [dev] model card: guidance distillation.</a></div>

<!--
This slide covers guidance distillation only: the first stage of Meng et al.,
before their separate progressive distillation of sampling steps. The teacher
parameters theta are fixed; only the student parameters phi are trained. Sample
guidance strengths from a chosen training range; no arbitrary extrapolation claim.
Initialize the student from the teacher and add a guidance-scale embedding
(the paper uses Fourier features, incorporated similarly to the time embedding).
The forward distribution in step 2 is the existing DDPM Gaussian: x_t =
sqrt(alpha_bar_t) x_0 + sqrt(1-alpha_bar_t) epsilon, epsilon ~ N(0, I).
The teacher target is a constant for the update: theta is frozen and only phi is optimized.
The displayed score MSE is a simple version of the matching objective. The paper
uses time-weighted x_0 regression; translating that exact objective to score
space additionally rescales each squared error by a time-dependent weight.
We illustrate the teacher/student matching principle, not its exact weighting.
Its guidance
convention is conditional + w * (conditional - unconditional), so gamma = 1 + w.
The two teacher predictions can be batched, but still require two denoiser
evaluations. The model card confirms FLUX.2 [dev] uses guidance distillation;
this does not assert that its proprietary training recipe is identical to Meng's.
-->

---
clicks: 0
id: summary
class: summary
---

# Summary

- Reverse-mean, clean-data and noise predictions are convertible; unweighted losses assign different weights to noise levels.
- DDPM replaces ELBO weights with a simple noise-prediction loss and generates through Gaussian reverse steps.
- DDPM simple loss and NCSN agree at matched noise levels with rescaled scores; loss weights can be absorbed into training-time sampling.
- DDIM reuses the DDPM network: same training marginals, deterministic sampling, fewer steps.
- Guidance makes generation controllable through labels or text prompts.
- Classifier guidance uses an auxiliary noisy-data classifier; classifier-free guidance does not.
- Guidance intervals can improve the quality-diversity trade-off; guidance distillation reduces evaluations per step.
