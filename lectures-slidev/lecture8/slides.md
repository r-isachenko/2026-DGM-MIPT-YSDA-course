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
sourceFrame: "1"
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 8</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Forward Gaussian Diffusion Process

Let $\bx_0=\bx\sim\pd(\bx)$, $\beta_t\ll1$, $\alpha_t=1-\beta_t$ and $\bar{\alpha}_t=\prod_{s=1}^t\alpha_s$.

$$
\begin{aligned}
\bx_t&=\sqrt{1-\beta_t}\cdot\bx_{t-1}+\sqrt{\beta_t}\cdot\bepsilon_t,\quad\text{where }\bepsilon_t\sim\cN(0,\bI);\\
\bx_t&=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon,\quad\text{where }\bepsilon\sim\cN(0,\bI).
\end{aligned}
$$

$$
\begin{aligned}
q(\bx_t|\bx_{t-1})&=\cN(\sqrt{1-\beta_t}\cdot\bx_{t-1},\beta_t\cdot\bI);\\
q(\bx_t|\bx_0)&=\cN(\sqrt{\bar{\alpha}_t}\cdot\bx_0,(1-\bar{\alpha}_t)\cdot\bI).
\end{aligned}
$$

</div>

<img src="/figs/conditional_diffusion.png" alt="Conditional forward Gaussian diffusion" style="width:100%;height:180px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/2403.18103">Chan S. Tutorial on Diffusion Models for Imaging and Vision, 2024</a></div>

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap of Previous Lecture

**Diffusion** describes the migration of particles from regions of high density to those of low density.

<img src="/figs/diffusion_over_time.png" alt="Diffusion over time" style="width:100%;height:150px;object-fit:contain" />

1. $\bx_0=\bx\sim\pd(\bx)$
2. $\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t$, $\bepsilon_t\sim\cN(0,\bI)$, $t\geq1$
3. After $T\gg1$ steps: $\bx_T\sim p_\infty(\bx)=\cN(0,\bI)$

If this process can be reversed, we can sample from $\pd(\bx)$ by starting from noise $p_\infty(\bx)=\cN(0,\bI)$.

Our goal now becomes inverting this diffusion.

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a></div>

---
clicks: 1
sourceFrame: "4"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## NCSN

$$
\begin{gathered}
q(\bx_t|\bx_0)=\cN(\bx_0,\sigma_t^2\bI),\quad q(\bx_1)\approx\pd(\bx),\quad q(\bx_T)\approx\cN(0,\sigma_T^2\bI)\\
\nabla_{\bx_t}\log q(\bx_t|\bx)=-\frac{\bx_t-\bx}{\sigma_t^2}
\end{gathered}
$$

</div>
<div class="block" v-click="1">

## Gaussian Diffusion

$$
\begin{gathered}
q(\bx_t|\bx_0)=\cN(\sqrt{\bar{\alpha}_t}\bx_0,(1-\bar{\alpha}_t)\bI),\quad q(\bx_1)\approx\pd(\bx),\quad q(\bx_T)\approx\cN(0,\bI)\\
\nabla_{\bx_t}\log q(\bx_t|\bx_0)=-\frac{\bx_t-\sqrt{\bar{\alpha}_t}\bx_0}{1-\bar{\alpha}_t}
\end{gathered}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a></div>

---
clicks: 1
sourceFrame: "extension: 4"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem (Denoising Score Matching)

$$
\begin{aligned}
&\bbE_{q(\bx_t)}\left\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t)\right\|_2^2\\
&\quad=\bbE_{\pd(\bx)}\bbE_{q(\bx_t|\bx)}\left\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx)\right\|_2^2+\text{const}(\btheta)
\end{aligned}
$$

</div>
<div v-click="1">

**Note:** Annealed Langevin dynamics applies to diffusion, too.

</div>

<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a></div>

---
clicks: 0
sourceFrame: "5"
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

<span style="color:gray">Feller's theorem justifies this Gaussian assumption.</span>

</div>

<div class="source"><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">Weng L. What are Diffusion Models?, blog post, 2021</a></div>

---
clicks: 0
sourceFrame: "extension: 5"
class: theorems
---

# Recap of Previous Lecture

<div class="columns">
<div class="block">

## Forward Process

1. $\bx_0=\bx\sim\pd(\bx)$
2. $\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t$
3. $\bx_T\sim p_\infty(\bx)=\cN(0,\bI)$

</div>
<div class="block">

## Reverse Process

1. $\bx_T\sim p_\infty(\bx)=\cN(0,\bI)$
2. $\bx_{t-1}=\bsigma_{\btheta,t}(\bx_t)\bepsilon+\bmu_{\btheta,t}(\bx_t)$
3. $\bx_0=\bx\sim\pd(\bx)$

</div>
</div>

<div class="source"><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">Weng L. What are Diffusion Models?, blog post, 2021</a></div>

---
clicks: 0
sourceFrame: "6"
class: theorems
---

# Recap of Previous Lecture

**Forward process** maps any distribution $\pd(\bx)$ to $\cN(0,\bI)$ by injection of noise:

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
sourceFrame: "7"
class: theorems
---

# Recap of Previous Lecture

- $\bz=(\bx_1,\dots,\bx_T)$ represents the latent variables.
- Variational posterior distribution:

$$
q(\bz|\bx)=q(\bx_1,\dots,\bx_T|\bx_0)=\prod_{t=1}^Tq(\bx_t|\bx_{t-1}).
$$

- Generative model and prior:

$$
\pt(\bx|\bz)=\pt(\bx_0|\bx_1);\quad\pt(\bz)=\prod_{t=2}^T\pt(\bx_{t-1}|\bx_t)\cdot p(\bx_T)
$$

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a><br><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "extension: 7"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Standard ELBO

$$
\log\pt(\bx)\geq\bbE_{q({\color{teal}\bz}|\bx)}\log\frac{\pt(\bx,{\color{teal}\bz})}{q({\color{teal}\bz}|\bx)}=\cL_{\bphi,\btheta}(\bx)\rightarrow\max_{\bphi,\btheta}
$$

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)
&={\color{olive}\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}-{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}\\
&\quad-{\color{teal}\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}}
\end{aligned}
$$

</div>

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a><br><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "8"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Diffusion ELBO Derivation (continued)</div></div>
<div class="outline-item "><span>02</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item "><span>03</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item "><span>04</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Diffusion ELBO Derivation (continued)"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Diffusion ELBO Derivation (continued)</div></div>
<div class="outline-item "><span>02</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item "><span>03</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item "><span>04</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 0
sourceFrame: "9"
class: theorems
---

# ELBO for Gaussian Diffusion Model

<img src="/figs/diffusion_objective.png" alt="Diffusion training objective" style="width:100%;height:205px;object-fit:contain" />

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)
$$

$$
\begin{aligned}
q(\bx_{t-1}|\bx_t,\bx_0)&=\cN(\bx_{t-1}|\tilde{\bmu}_t(\bx_t,\bx_0),\tilde{\beta}_t\bI),\\
\pt(\bx_{t-1}|\bx_t)&=\cN\bigl(\bx_{t-1}|\bmu_{\btheta,t}(\bx_t),\bsigma_{\btheta,t}^2(\bx_t)\bigr)
\end{aligned}
$$

<div class="source"><a href="https://arxiv.org/abs/2208.11970">Luo C. Understanding Diffusion Models: A Unified Perspective, 2022</a></div>

---
clicks: 2
sourceFrame: "10"
class: theorems
---

# ELBO for Gaussian Diffusion Model

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)
$$

$$
\begin{aligned}
q(\bx_{t-1}|\bx_t,\bx_0)&=\cN(\bx_{t-1}|\tilde{\bmu}_t(\bx_t,\bx_0),\tilde{\beta}_t\bI),\\
\pt(\bx_{t-1}|\bx_t)&=\cN\bigl(\bx_{t-1}|\bmu_{\btheta,t}(\bx_t),{\color{#8854c0}\bsigma_{\btheta,t}^2(\bx_t)}\bigr)
\end{aligned}
$$

<div v-click="1">

Let's assume that

$$
\begin{gathered}
{\color{#8854c0}\bsigma_{\btheta,t}^2(\bx_t)=\tilde{\beta}_t\bI}\\
\Rightarrow\quad\pt(\bx_{t-1}|\bx_t)=\cN\bigl(\bx_{t-1}|\bmu_{\btheta,t}(\bx_t),{\color{#8854c0}\tilde{\beta}_t\bI}\bigr).
\end{gathered}
$$

</div>
<div v-click="2">

Theoretically, the optimal $\bsigma_{\btheta,t}^2(\bx_t)$ lies in $[\tilde{\beta}_t,\beta_t]$:

- $\beta_t$ is optimal for $\bx_0\sim\cN(0,\bI)$;
- $\tilde{\beta}_t$ is optimal for $\bx_0\sim\delta(\bx_0-\bx^*)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 1
sourceFrame: "extension: 10"
class: derivation
---

# ELBO for Gaussian Diffusion Model

$$ {1-2|all} {at:1}
\begin{aligned}
\cL_t&=\bbE_{q(\bx_t|\bx_0)}\KL\bigl(\cN\bigl(\tilde{\bmu}_t(\bx_t,\bx_0),\tilde{\beta}_t\bI\bigr)\\
&\hspace{42mm}\|\cN\bigl(\bmu_{\btheta,t}(\bx_t),\tilde{\beta}_t\bI\bigr)\bigr)\\
&=\bbE_{q(\bx_t|\bx_0)}\left[\frac{1}{2\tilde{\beta}_t}\bigl\|\tilde{\bmu}_t(\bx_t,\bx_0)-\bmu_{\btheta,t}(\bx_t)\bigr\|^2\right]
\end{aligned}
$$

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 1
sourceFrame: "11"
class: theorems
---

# ELBO for Gaussian Diffusion Model

<div class="block">

## Training

1. Sample $\bx_0\sim\pd(\bx)$, $\bepsilon\sim\cN(0,\bI)$.
2. Compute noisy image $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$.
3. Compute the ELBO:

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)&={\color{olive}\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}-{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}\\
&\quad-{\color{teal}\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\left[\frac{1}{2\tilde{\beta}_t}\bigl\|\tilde{\bmu}_t(\bx_t,\bx_0)-\bmu_{\btheta,t}(\bx_t)\bigr\|^2\right]}_{\cL_t}}.
\end{aligned}
$$

</div>
<div class="block" v-click="1">

## Sampling

1. Sample $\bx_T\sim\cN(0,\bI)$.
2. Denoise $\bx_{t-1}=\bmu_{\btheta,t}(\bx_t)+\sqrt{\tilde{\beta}_t}\cdot\bepsilon$, $\bepsilon\sim\cN(0,\bI)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "auto: Gaussian Diffusion Reparametrization"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Diffusion ELBO Derivation (continued)</div></div>
<div class="outline-item current"><span>02</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item "><span>03</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item "><span>04</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 3
sourceFrame: "12"
class: theorems
---

# Reparametrization of DDPM

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\left[\frac{1}{2\tilde{\beta}_t}\bigl\|\tilde{\bmu}_t(\bx_t,\bx_0)-\bmu_{\btheta,t}(\bx_t)\bigr\|^2\right]
$$

$$
\tilde{\bmu}_t(\bx_t,\bx_0)=\frac{\sqrt{\alpha_t}(1-\bar{\alpha}_{t-1})}{1-\bar{\alpha}_t}\cdot\bx_t+\frac{\sqrt{\bar{\alpha}_{t-1}}(1-\alpha_t)}{1-\bar{\alpha}_t}\cdot{\color{olive}\bx_0}
$$

<div class="math-chain" v-click="1">

$\displaystyle\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$
<span v-click="2">$\displaystyle\quad\Rightarrow\quad{\color{olive}\bx_0}=\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon}{\sqrt{\bar{\alpha}_t}}$</span>

</div>
<div v-click="3">

- There is a linear relationship between $\bepsilon$, $\bx_t$, and $\bx_0$.
- Let's try to rewrite this mean using only $\bx_t$ and $\bepsilon$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 1
sourceFrame: "extension: 12"
class: derivation
---

# Reparametrization of DDPM

$$ {1-2|all} {at:1}
\begin{aligned}
\tilde{\bmu}_t(\bx_t,\bepsilon)&=\frac{\sqrt{\alpha_t}(1-\bar{\alpha}_{t-1})}{1-\bar{\alpha}_t}\cdot\bx_t\\
&\quad+\frac{\sqrt{\bar{\alpha}_{t-1}}(1-\alpha_t)}{1-\bar{\alpha}_t}\cdot{\color{olive}\left(\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon}{\sqrt{\bar{\alpha}_t}}\right)}\\
&=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}\cdot\bepsilon
\end{aligned}
$$

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 1
sourceFrame: "13"
class: theorems
---

# Reparametrization of DDPM

$$
\cL_t=\bbE_{{\color{#8854c0}q(\bx_t|\bx_0)}}\left[{\color{olive}\frac{1}{2\tilde{\beta}_t}}\bigl\|\tilde{\bmu}_t(\bx_t,\bx_0)-\bmu_{\btheta,t}(\bx_t)\bigr\|^2\right]
$$

<div class="block">

## Reparametrization

$$ {1|all} {at:1}
\begin{aligned}
\tilde{\bmu}_t(\bx_t,\bx_0)&=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}\cdot\bepsilon\\
\bmu_{\btheta,t}(\bx_t)&=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-{\color{teal}\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}}\cdot\bepsilon_{\btheta,t}(\bx_t)
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 2
sourceFrame: "extension: 13"
class: derivation
---

# Reparametrization of DDPM

$$ {1|all} {at:1}
\begin{aligned}
\cL_t&=\bbE_{{\color{#8854c0}\bepsilon\sim\cN(0,\bI)}}\left[\frac{{\color{teal}(1-\alpha_t)^2}}{{\color{olive}2\tilde{\beta}_t}{\color{teal}\alpha_t(1-\bar{\alpha}_t)}}\bigl\|\bepsilon-\bepsilon_{\btheta,t}({\color{#8854c0}\bx_t})\bigr\|^2\right]\\
&=\bbE_{{\color{#8854c0}\bepsilon\sim\cN(0,\bI)}}\left[\frac{(1-\alpha_t)^2}{2\tilde{\beta}_t\alpha_t(1-\bar{\alpha}_t)}\Bigl\|\bepsilon-\bepsilon_{\btheta,t}\bigl({\color{#8854c0}\sqrt{\bar{\alpha}_t}\bx_0+\sqrt{1-\bar{\alpha}_t}\bepsilon}\bigr)\Bigr\|^2\right]
\end{aligned}
$$

<div v-click="2">

At every step of the reverse process, we attempt to predict the noise $\bepsilon$ that was used in the forward diffusion process!

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 1
sourceFrame: "14"
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

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "extension: 14"
class: theorems
---

# Reparametrization of DDPM

Let's drop the scaling coefficient; the reconstruction term ($t=1$) has the same form.

<div class="block">

## Simplified Objective

$$
\cL_{\text{simple}}=\bbE_{t\sim U\{1,T\}}\bbE_{\bepsilon\sim\cN(0,\bI)}\Bigl\|\bepsilon-\bepsilon_{\btheta,t}\bigl(\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon\bigr)\Bigr\|^2
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "auto: Denoising Diffusion Probabilistic Model (DDPM)"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Diffusion ELBO Derivation (continued)</div></div>
<div class="outline-item "><span>02</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item current"><span>03</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item "><span>04</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 0
sourceFrame: "15"
class: figure-slide
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" denoising-diffusion />

---
clicks: 2
sourceFrame: "16"
class: theorems
---

# Denoising Diffusion Probabilistic Model (DDPM)

<div class="block">

## DDPM is a VAE Model

- The encoder is a fixed Gaussian Markov chain $q(\bx_1,\dots,\bx_T|\bx_0)$.
- The latent variable is hierarchical (at each step, its dimension equals the input's).
- The decoder is a simple Gaussian model $\pt(\bx_0|\bx_1)$.
- The prior distribution is given by a parametric Gaussian Markov chain $\pt(\bx_{t-1}|\bx_t)$.

</div>
<div class="columns">
<div class="block" v-click="1">

## Forward Process

1. $\bx_0=\bx\sim\pd(\bx)$;
2. $\bx_t=\sqrt{1-\beta_t}\cdot\bx_{t-1}+\sqrt{\beta_t}\cdot\bepsilon_t$;
3. $\bx_T\sim p_\infty(\bx)=\cN(0,\bI)$.

</div>
<div class="block" v-click="2">

## Reverse Process

1. $\bx_T\sim p_\infty(\bx)=\cN(0,\bI)$;
2. $\bx_{t-1}=\bsigma_{\btheta,t}(\bx_t)\cdot\bepsilon+\bmu_{\btheta,t}(\bx_t)$;
3. $\bx_0=\bx\sim\pd(\bx)$.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 1
sourceFrame: "17"
class: theorems
---

# Denoising Diffusion Probabilistic Model (DDPM)

<div class="block">

## Training

1. Sample $\bx_0\sim\pd(\bx)$, $t\sim U\{1,T\}$, $\bepsilon\sim\cN(0,\bI)$.
2. Compute noisy image $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$.
3. Compute loss $\cL_{\text{simple}}=\|\bepsilon-\bepsilon_{\btheta,t}(\bx_t)\|^2$.

</div>
<div class="block" v-click="1">

## Sampling (Ancestral)

1. Sample $\bx_T\sim\cN(0,\bI)$.
2. Compute the mean of $\pt(\bx_{t-1}|\bx_t)=\cN(\bmu_{\btheta,t}(\bx_t),\tilde{\beta}_t\cdot\bI)$:

$$
\bmu_{\btheta,t}(\bx_t)=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}\cdot\bepsilon_{\btheta,t}(\bx_t).
$$

3. Denoise $\bx_{t-1}=\bmu_{\btheta,t}(\bx_t)+\sqrt{\tilde{\beta}_t}\cdot\bepsilon$, $\bepsilon\sim\cN(0,\bI)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 3
sourceFrame: "18"
class: theorems
---

# Denoising Diffusion as a Score-Based Generative Model

<div class="block">

## DDPM Objective

$$ {1|all} {at:1}
\begin{aligned}
\cL_t&=\bbE_{\bepsilon\sim\cN(0,\bI)}\left[C_{1,t}\cdot\left\|\bepsilon_{\btheta,t}(\bx_t)-\bepsilon\right\|_2^2\right]\\
&=\bbE_{\bepsilon\sim\cN(0,\bI)}\left[C_{2,t}\cdot\Bigl\|{\color{#8854c0}\frac{\bepsilon_{\btheta,t}(\bx_t)}{\sqrt{1-\bar{\alpha}_t}}}-{\color{teal}\frac{\bepsilon}{\sqrt{1-\bar{\alpha}_t}}}\Bigr\|_2^2\right]
\end{aligned}
$$

</div>
<div v-click="2">

$$ {1|all} {at:3}
\begin{aligned}
q(\bx_t|\bx_0)&=\cN(\sqrt{\bar{\alpha}_t}\cdot\bx_0,(1-\bar{\alpha}_t)\cdot\bI)\\
\nabla_{\bx_t}\log q(\bx_t|\bx_0)&=-\frac{\bx_t-\sqrt{\bar{\alpha}_t}\cdot\bx_0}{1-\bar{\alpha}_t}={\color{teal}-\frac{\bepsilon}{\sqrt{1-\bar{\alpha}_t}}}.
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 1
sourceFrame: "extension: 18"
class: theorems
---

# Denoising Diffusion as a Score-Based Generative Model

We can reparameterize the model as:

$$
\bs_{\btheta,t}(\bx_t)={\color{#8854c0}-\frac{\bepsilon_{\btheta,t}(\bx_t)}{\sqrt{1-\bar{\alpha}_t}}}=\nabla_{\bx_t}\log\pt(\bx_t).
$$

<div v-click="1">

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\left[C_{2,t}\cdot\Bigl\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx_0)\Bigr\|_2^2\right]
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 3
sourceFrame: "19"
class: theorems
---

# DDPM vs NCSN: Objectives

<div class="block">

## DDPM Objective

$$
\bbE_{\pd(\bx_0)}\bbE_{t\sim U\{1,T\}}\bbE_{q(\bx_t|\bx_0)}\left[{\color{olive}C_{2,t}}\Bigl\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx_0)\Bigr\|_2^2\right]
$$

$$
\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon
$$

<div v-click="1">

In practice, <span style="color:olive">this coefficient</span> is often omitted.

</div>
</div>
<div class="block" v-click="2">

## NCSN Objective

$$
\bbE_{\pd(\bx_0)}\bbE_{t\sim U\{1,T\}}\bbE_{q(\bx_t|\bx_0)}\bigl\|\bs_{\btheta,\sigma_t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx_0)\bigr\|_2^2
$$

$$
\bx_t=\bx_0+\sigma_t\cdot\bepsilon
$$

</div>
<div v-click="3">

**Maximizing the ELBO leads to the same objective as denoising score matching!**

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 2
sourceFrame: "20"
class: derivation
---

# DDPM vs NCSN: Sampling

<div class="block">

## Sampling (Ancestral)

$$ {1-2|1-3|all} {at:1}
\begin{aligned}
\bx_T&\sim\cN(0,\bI)\\
\bx_{t-1}&={\color{teal}\bmu_{\btheta,t}(\bx_t)}+\sigma_t\cdot\bepsilon\\
&={\color{teal}\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}\cdot\bepsilon_{\btheta,t}(\bx_t)}+\sigma_t\cdot\bepsilon\\
&=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot\bs_{\btheta,t}(\bx_t)+\sigma_t\cdot\bepsilon
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "extension: 20"
class: theorems
---

# DDPM vs NCSN: Sampling

<div class="block">

## Sampling (Annealed Langevin Dynamics)

1. Sample $\bx_T^0\sim\cN(0,\sigma_T^2\,\bI)\approx q(\bx_T)$.
2. Update $\bx_t^l$ via $L$ steps of Langevin dynamics at each noise level $\sigma_t$:

$$
\bx_t^l=\bx_t^{l-1}+\frac{\eta_t}{2}\cdot\bs_{\btheta,\sigma_t}(\bx_t^{l-1})+\sqrt{\eta_t}\cdot\bepsilon_t^l.
$$

3. Update $\bx_{t-1}^0:=\bx_t^L$ and proceed to the next noise level $\sigma_{t-1}$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 2
sourceFrame: "21"
class: theorems
---

# DDPM vs NCSN: Summary

<div class="block">

## Summary

<ul>
<li>

Different Markov chains:

- DDPM: $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$;
- NCSN: $\bx_t=\bx_0+\sigma_t\cdot\bepsilon$.
- One can generalize to $q(\bx_t|\bx_0)=\cN(\alpha_t\cdot\bx_0,\sigma_t^2\,\bI)$.

</li>
<li v-click="1">

The objectives coincide: ELBO $\equiv$ score-matching.

</li>
<li v-click="2">

The sampling procedures differ:

- Ancestral sampling in DDPM;
- Annealed Langevin dynamics for NCSN;
- Hybrid approaches that combine both updates are possible.

</li>
</ul>
</div>

<div class="source"><a href="https://arxiv.org/abs/2107.00630">Kingma D. et al. Variational Diffusion Models, 2021</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y. et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
sourceFrame: "auto: Model Guidance"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Diffusion ELBO Derivation (continued)</div></div>
<div class="outline-item "><span>02</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item "><span>03</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item current"><span>04</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 0
sourceFrame: "22"
class: theorems
---

# Guidance

- Up to now, we have focused on **unconditional** generative models $\pt(\bx)$.
- In practice, most generative models are **conditional** (in the diffusion era it is called guided): $\pt(\bx|\by)$.
- Here, $\by$ might denote a class label or **text** (as in text-to-image tasks).

<div class="columns">
<img src="/figs/shedevrum1.jpg" alt="Shedevrum text-conditioned image example 1" style="width:100%;height:280px;object-fit:contain" />
<img src="/figs/shedevrum2.jpg" alt="Shedevrum text-conditioned image example 2" style="width:100%;height:280px;object-fit:contain" />
</div>

---
clicks: 0
sourceFrame: "23"
class: theorems
---

# Conditional Models

In practice, we're typically interested in learning conditional models (sampling from conditional distribution $\pd(\bx|\by)$).

- $\by=\emptyset$, $\bx$ = image $\quad\Rightarrow\quad$ unconditional image model
- $\by$ = class label, $\bx$ = image $\quad\Rightarrow\quad$ class-conditional image model
- $\by$ = text prompt, $\bx$ = image $\quad\Rightarrow\quad$ text-to-image model
- $\by$ = image, $\bx$ = image $\quad\Rightarrow\quad$ image-to-image model
- $\by$ = image, $\bx$ = text $\quad\Rightarrow\quad$ image-to-text (image captioning) model
- $\by$ = English text, $\bx$ = Russian text $\quad\Rightarrow\quad$ sequence-to-sequence model (machine translation)
- $\by$ = sound, $\bx$ = text $\quad\Rightarrow\quad$ speech-to-text (automatic speech recognition) model
- $\by$ = text, $\bx$ = sound $\quad\Rightarrow\quad$ text-to-speech model

---
clicks: 0
sourceFrame: "24"
class: figure-slide
---

# Label Guidance

**Label:** Ostrich (10th ImageNet class)

<img class="hero" src="/figs/label_conditioning.png" alt="Ostrich class-conditional image samples" />

<div class="source"><a href="https://arxiv.org/abs/1906.00446">Razavi A., Oord A., et al. Generating Diverse High-Fidelity Images with VQ-VAE-2, 2019</a></div>

---
clicks: 0
sourceFrame: "25"
class: figure-slide
---

# Text Guidance

**Prompt:** a stained glass window of a panda eating bamboo<br>
Left: $\gamma=1$, Right: $\gamma=3$.

<img src="/figs/cfg.png" alt="Classifier-free guidance scale one and three for a panda stained glass prompt" style="width:100%;height:370px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/2112.10741">Nichol A., et al. GLIDE: Towards Photorealistic Image Generation and Editing with Text-Guided Diffusion Models, 2022</a></div>

---
clicks: 6
sourceFrame: "26"
class: theorems
---

# Guidance in Generative Models

<div class="block">

## How to make a guided model?

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
sourceFrame: "auto: Classifier Guidance"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Diffusion ELBO Derivation (continued)</div></div>
<div class="outline-item "><span>02</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item "><span>03</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item current"><span>04</span><div>Model Guidance<div class="outline-sub"><strong>Classifier Guidance</strong><br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 3
sourceFrame: "27"
class: theorems
---

# Classifier Guidance

<div class="block">

## DDPM Sampling

1. Sample $\bx_T\sim\cN(0,\bI)$.
2. Denoise the image (unconditional generation):

$$ {1|all} {at:1}
\begin{aligned}
\bx_{t-1}&=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{teal}\bs_{\btheta,t}(\bx_t)}+\sigma_t\cdot\bepsilon\\
&=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{teal}\nabla_{\bx_t}\log\pt(\bx_t)}+\sigma_t\cdot\bepsilon
\end{aligned}
$$

</div>
<div class="block" v-click="2">

## Guided Generation

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot\nabla_{\bx_t}\log\pt(\bx_t|{\color{olive}\by})+\sigma_t\cdot\bepsilon
$$

</div>
<div v-click="3">

What is the link between $\nabla_{\bx_t}\log\pt(\bx_t)$ and $\nabla_{\bx_t}\log\pt(\bx_t|{\color{olive}\by})$?

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 3
sourceFrame: "28"
class: theorems
---

# Classifier Guidance: Guided Score Function

<div class="block">

## Guided Generation

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{olive}\nabla_{\bx_t}\log\pt(\bx_t|\by)}+\sigma_t\cdot\bepsilon
$$

</div>
<div class="block" v-click="1">

## Guided Generation

$$ {1|1-2|all} {at:2}
\begin{aligned}
{\color{olive}\nabla_{\bx_t}\log\pt(\bx_t|\by)}&=\nabla_{\bx_t}\log\left(\frac{\pt(\bx_t)p(\by|\bx_t)}{p(\by)}\right)\\
&={\color{#8854c0}\nabla_{\bx_t}\log\pt(\bx_t)}+\nabla_{\bx_t}\log p(\by|\bx_t)\\
&={\color{#8854c0}\bs_{\btheta,t}(\bx_t)}+{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 1
sourceFrame: "extension: 28"
class: theorems
---

# Classifier Guidance: Guided Score Function

<div class="block">

## Guided Score Function

$$
\bs_{\btheta,t}(\bx_t,\by)=\nabla_{\bx_t}\log\pt(\bx_t|\by).
$$

<div v-click="1">

$$
{\color{olive}\bs_{\btheta,t}(\bx_t,\by)}={\color{#8854c0}\bs_{\btheta,t}(\bx_t)}+{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}
$$

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 3
sourceFrame: "29"
class: theorems
---

# Classifier Guidance: Guidance Scale

<div class="block">

## Guided Score Function

$$
{\color{olive}\bs_{\btheta,t}(\bx_t,\by)}=\bs_{\btheta,t}(\bx_t)+\nabla_{\bx_t}\log p(\by|\bx_t)
$$

</div>
<div v-click="1">

- Let us assume $\by$ is a class label.
- $p(\by|\bx_t)$ is a classifier for noisy inputs.
- $p(\by|\bx_t)$ is responsible for model guidance.

</div>
<div class="block" v-click="2">

## Guidance Scale

It is a natural idea to scale up the contribution of the guidance

$$
{\color{#8854c0}\bs^\gamma_{\btheta,t}(\bx_t,\by)}=\bs_{\btheta,t}(\bx_t)+{\color{teal}\gamma}\cdot\nabla_{\bx_t}\log p(\by|\bx_t)
$$

<div v-click="3">

- The <span style="color:teal">guidance scale $\gamma$</span> adjusts the strength of classifier guidance.
- ${\color{#8854c0}\bs^\gamma_{\btheta,t}(\bx_t,\by)}$ is not the true guided score function ${\color{olive}\bs_{\btheta,t}(\bx_t,\by)}$.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 4
sourceFrame: "30"
class: theorems
---

# Classifier Guidance: Distribution Sharpening

<div class="block">

## Scaled Guided Score Function

$$
{\color{#8854c0}\bs^\gamma_{\btheta,t}(\bx_t,\by)}=\bs_{\btheta,t}(\bx_t)+{\color{teal}\gamma}\cdot\nabla_{\bx_t}\log p(\by|\bx_t)
$$

</div>
<div class="block" v-click="1">

## Scaled Conditional Distribution

$$ {1|1-2|all} {at:2}
\begin{aligned}
{\color{#8854c0}\nabla_{\bx_t}^\gamma\log\pt(\bx_t|\by)}&=\nabla_{\bx_t}\log\pt(\bx_t)+{\color{teal}\gamma}\cdot\nabla_{\bx_t}\log p(\by|\bx_t)\\
&=\nabla_{\bx_t}\log\pt(\bx_t)+\nabla_{\bx_t}\log p(\by|\bx_t)^{{\color{teal}\gamma}}\\
&=\nabla_{\bx_t}\log\left(\frac{\pt(\bx_t)p(\by|\bx_t)^\gamma}{Z}\right)
\end{aligned}
$$

</div>
<div v-click="4">

**Note:** Increasing $\gamma$ sharpens $p(\by|\bx_t)$, increasing the contrast

$$
\hat p(\by|\bx_t)\propto p(\by|\bx_t)^\gamma.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 1
sourceFrame: "31"
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
2. Denoise with the scaled guided score function:

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{olive}\bs^\gamma_{\btheta,t}(\bx_t,\by)}+\sigma_t\cdot\bepsilon.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 0
sourceFrame: "auto: Classifier-Free Guidance"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Diffusion ELBO Derivation (continued)</div></div>
<div class="outline-item "><span>02</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item "><span>03</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>
<div class="outline-item current"><span>04</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br><strong>Classifier-Free Guidance</strong></div></div></div>

</div>

---
clicks: 3
sourceFrame: "32"
class: theorems
---

# Classifier-Free Guidance

- The previous approach relies on training an additional classifier $p(\by|\bx_t)$ for noisy images.
- We now introduce a method to sidestep this requirement.

<div v-click="1">

$$
\nabla_{\bx_t}^\gamma\log\pt(\bx_t|\by)=\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}
$$

</div>
<div class="block" v-click="2">

## Bayes theorem

$$ {1|all} {at:3}
\begin{aligned}
{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}&=\nabla_{\bx_t}\log\left(\frac{\pt(\bx_t|\by)p(\by)}{\pt(\bx_t)}\right)\\
&=\nabla_{\bx_t}\log\pt(\bx_t|\by)-\nabla_{\bx_t}\log\pt(\bx_t)
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a></div>

---
clicks: 2
sourceFrame: "extension: 32"
class: derivation
---

# Classifier-Free Guidance

<div class="block">

## Scaled Guided Score Function

$$ {1|1-2|all} {at:1}
\begin{aligned}
\nabla_{\bx_t}^\gamma\log\pt(\bx_t|\by)&=\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}\\
&=\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot\bigl({\color{teal}\nabla_{\bx_t}\log\pt(\bx_t|\by)-\nabla_{\bx_t}\log\pt(\bx_t)}\bigr)\\
&=(1-\gamma)\cdot\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot\nabla_{\bx_t}\log\pt(\bx_t|\by)
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a></div>

---
clicks: 4
sourceFrame: "33"
class: theorems
---

# Classifier-Free Guidance: Formulation

<div class="block">

## Scaled Guided Score Function

$$
\nabla_{\bx_t}^\gamma\log\pt(\bx_t|\by)=(1-\gamma)\cdot\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot\nabla_{\bx_t}\log\pt(\bx_t|\by)
$$

<div v-click="1">

$$
\bs^\gamma_{\btheta,t}(\bx_t,\by)=(1-\gamma)\cdot\bs_{\btheta,t}(\bx_t)+\gamma\cdot\bs_{\btheta,t}(\bx_t,\by)
$$

</div>
</div>
<div class="block" v-click="2">

## Naive training approach

<ul>
<li>

Train an unguided score function model $\bs_{\btheta,t}(\bx_t)$.

</li>
<li>

Train a guided score function model $\bs_{\btheta,t}(\bx_t,\by)$.

</li>
<li v-click="3">Use their convex combination at inference.</li>
</ul>
</div>
<div class="block" v-click="3">

## Sampling (Guided)

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{olive}\bs^\gamma_{\btheta,t}(\bx_t,\by)}+\sigma_t\cdot\bepsilon
$$

</div>
<div v-click="4">

How to avoid training two separate score function models?

</div>

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a></div>

---
clicks: 1
sourceFrame: "34"
class: theorems
---

# Classifier-Free Guidance

$$
\bs^\gamma_{\btheta,t}(\bx_t,\by)=(1-\gamma)\cdot\bs_{\btheta,t}(\bx_t)+\gamma\cdot\bs_{\btheta,t}(\bx_t,\by)
$$

<div class="block">

## CFG

1. Introduce the "absence of conditioning" label $\by=\varnothing$.
2. Identify the unguided score function $\bs_{\btheta,t}(\bx_t)=\bs_{\btheta,t}(\bx_t,\varnothing)$.
3. Train a single model $\bs_{\btheta,t}(\bx_t,\by)$ on **supervised** data, dropping the label $\by$ with some fixed probability (simulating $\by=\varnothing$).
4. At inference, evaluate the model twice to obtain $\bs_{\btheta,t}(\bx_t,\varnothing)$ and $\bs_{\btheta,t}(\bx_t,\by)$.

</div>
<div class="block" v-click="1">

## Sampling (Guided)

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{olive}\bs^\gamma_{\btheta,t}(\bx_t,\by)}+\sigma_t\cdot\bepsilon.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 0
sourceFrame: "35"
class: summary
---

# Summary

- At each step, DDPM predicts the noise that was injected in the forward process.
- DDPMs are quite slow, since the model must be applied $T$ times for sampling.
- DDPM and NCSN are intimately connected at the objective level.
- Guidance technique allows to make controllable generation via conditioning on labels or text prompts.
- Classifier guidance turns an unconditional model into a conditional one by training an auxiliary classifier on noisy data.
- Classifier-free guidance removes the need for such a classifier, yielding a practical recipe now widely used.
