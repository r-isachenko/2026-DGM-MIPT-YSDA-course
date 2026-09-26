---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 7"
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
omittedSourceFrames: [2, 9, 10, 12, 14]
omittedSourceSections: ["Forward Gaussian Diffusion Process"]
importedSourceFrames: {"8": [9, 10, 11, 12, 13, 14, 15, 16, 17]}
sourceFrame: "1"
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 7</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap of Previous Lecture

Define **score function** $\bs_{\btheta}(\bx)=\nabla_{\bx}\log\pt(\bx)$.

<div class="block">

## Fisher Divergence

$$
D_F(\pd,\pt)=\frac{1}{2}\bbE_{\pd}\left\|\bs_{\btheta}(\bx)-\nabla_\bx\log\pd(\bx)\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div class="block">

## Langevin Dynamics

$$
\bx_{l+1}=\bx_l+\frac{\eta}{2}\cdot\bs_{\btheta}(\bx_l)+\sqrt{\eta}\cdot\bepsilon_l,\quad\bepsilon_l\sim\cN(0,\bI)
$$

</div>
<img src="/figs/smld.jpg" alt="Score matching and Langevin dynamics" style="width:100%;height:205px;object-fit:contain" />

<div class="source"><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a></div>

---
clicks: 0
sourceFrame: "4"
class: theorems
---

# Recap of Previous Lecture

Let us perturb the original data with Gaussian noise $q(\bx_{\sigma}|\bx)=\cN(\bx,\sigma^2\cdot\bI)$.

$$
q(\bx_{\sigma})=\int q(\bx_{\sigma}|\bx)\pd(\bx)d\bx.
$$

<div class="block">

## Assumption

The solution to

$$
\frac{1}{2}\bbE_{q(\bx_{\sigma})}\big\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\big\|_2^2\rightarrow\min_{\btheta}
$$

satisfies $\bs_{\btheta,\sigma}(\bx_{\sigma})\approx\bs_{\btheta,0}(\bx_0)=\bs_{\btheta}(\bx)$ if $\sigma$ is sufficiently small.

</div>

<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

<!-- Source frame 4 is split after the Assumption to preserve the approved course type size. Both recap pages are static, as in Beamer. -->

---
clicks: 0
sourceFrame: "extension: 4"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem

$$
\begin{aligned}
&\bbE_{q(\bx_{\sigma})}\bigl\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\bigr\|_2^2\\
&\quad=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\bigl\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\bigr\|_2^2+\text{const}(\btheta)
\end{aligned}
$$

</div>

Here,

$$
\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)=-\frac{\bx_{\sigma}-\bx}{\sigma^2}=-\frac{\bepsilon}{\sigma}.
$$

$\bs_{\btheta,\sigma}(\bx_{\sigma})$ attempts to **denoise** a corrupted sample.

<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

---
clicks: 0
sourceFrame: "5"
class: theorems
---

# Recap of Previous Lecture

$$
\bbE_{\pd(\bx)}\bbE_{\cN(0,\bI)}\left\|\bs_{\btheta,\sigma}(\bx+\sigma\bepsilon)+\frac{\bepsilon}{\sigma}\right\|_2^2\rightarrow\min_{\btheta}
$$

$$
\bx_{l+1}=\bx_l+\frac{\eta}{2}\cdot\bs_{\btheta,\sigma}(\bx_l)+\sqrt{\eta}\cdot\bepsilon_l
$$

<div class="columns balanced"><div>

- For **small** $\sigma$, $\bs_{\btheta,\sigma}(\bx)$ becomes inaccurate and Langevin dynamics fails to traverse modes
- For **large** $\sigma$, robustness in low-density regions is achieved, but the model learns a distribution that is overly corrupted

</div><div>
<img src="/figs/pitfalls.jpg" alt="Score errors in low-density regions" style="width:100%;height:145px;object-fit:contain" />
<img src="/figs/single_noise.jpg" alt="Single-noise-level sampling" style="width:100%;height:145px;object-fit:contain" />
</div></div>

<div class="source"><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a></div>

---
clicks: 0
sourceFrame: "6"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Noise-Conditioned Score Network (NCSN)

- Define a sequence of noise levels: $\sigma_1<\sigma_2<\dots<\sigma_T$.
- Train the denoising score function $\bs_{\btheta,\sigma_t}(\bx_t)$ for each noise level:

$$
\sum_{t=1}^T{\color{#8854c0}\sigma_t^2}\cdot\bbE_{\pd(\bx)}\bbE_{q(\bx_t|\bx)}\bigl\|\bs_{\btheta,\sigma_t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx)\bigr\|_2^2\rightarrow\min_{\btheta}
$$

- Sample using **annealed** Langevin dynamics (for $t=T,\dots,1$).

</div>
<img src="/figs/multi_scale.jpg" alt="Multiple scales of noise" style="width:100%;height:125px;object-fit:contain" />
<img src="/figs/duoduo.jpg" alt="Image corruption across noise scales" style="width:100%;height:115px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a></div>

---
clicks: 0
sourceFrame: "7"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Training

1. Sample $\bx_0\sim\pd(\bx)$, $t\sim U\{1,T\}$, $\bepsilon\sim\cN(0,\bI)$.
2. Compute noisy image $\bx_t=\bx_0+\sigma_t\bepsilon$.
3. Compute loss $\cL=\sigma_t^2\left\|\bs_{\btheta,\sigma_t}(\bx_t)+\frac{\bepsilon}{\sigma_t}\right\|^2$.
4. Update $\btheta$ via stochastic gradient descent.

</div>

<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a><br><a href="https://arxiv.org/abs/2006.09011">Song Y. et al. Improved Techniques for Training Score-Based Generative Models, 2020</a></div>

<!-- Source frame 7 has static Training and Sampling blocks. Each stays intact; the slide boundary provides room at the common course size. -->

---
clicks: 0
sourceFrame: "extension: 7"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Sampling (Annealed Langevin Dynamics)

1. Sample $\bx_T^0\sim\cN(0,\sigma_T^2\bI)\approx q(\bx_T)$.
2. Update $\bx_t^l$ via $L$ steps of Langevin dynamics at each noise level $\sigma_t$:

$$
\bx_t^l=\bx_t^{l-1}+\frac{\eta_t}{2}\bs_{\btheta,\sigma_t}(\bx_t^{l-1})+\sqrt{\eta_t}\bepsilon_t^l.
$$

3. Update $\bx_{t-1}^0:=\bx_t^L$ and proceed to the next noise level $\sigma_{t-1}$.

</div>

<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a><br><a href="https://arxiv.org/abs/2006.09011">Song Y. et al. Improved Techniques for Training Score-Based Generative Models, 2020</a></div>

---
clicks: 0
sourceFrame: "11"
class: theorems
---

# Recap of Previous Lecture

$$
\begin{aligned}
\bx_t&=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t,\quad\bepsilon_t\sim\cN(0,\bI)\\
q(\bx_t|\bx_{t-1})&=\cN(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI)
\end{aligned}
$$

<div class="block">

## Statement 1

Let $\alpha_t=1-\beta_t$ and $\bar{\alpha}_t=\prod_{s=1}^t\alpha_s=\prod_{s=1}^t(1-\beta_s)$. Then

$$
q(\bx_t|\bx_0)=\cN(\sqrt{\bar{\alpha}_t}\,\bx_0,(1-\bar{\alpha}_t)\bI)
$$

</div>

<div class="source"><a href="http://proceedings.mlr.press/v37/sohl-dickstein15.pdf">Sohl-Dickstein J. Deep Unsupervised Learning using Nonequilibrium Thermodynamics, 2015</a></div>

---
clicks: 0
sourceFrame: "13"
class: theorems
---

# Recap of Previous Lecture

**Diffusion** describes the migration of particles from regions of high density to those of low density.

<img src="/figs/diffusion_over_time.png" alt="Diffusion over time" style="width:100%;height:155px;object-fit:contain" />

<div>

1. $\bx_0=\bx\sim\pd(\bx)$
2. $\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t$, $\bepsilon_t\sim\cN(0,\bI)$, $t\geq1$
3. After $T\gg1$ steps: $\bx_T\sim p_\infty(\bx)=\cN(0,\bI)$

</div>
<div>

If this process can be reversed, we can sample from $\pd(\bx)$ by starting from noise $p_\infty(\bx)=\cN(0,\bI)$.<br>
Our goal now becomes inverting this diffusion.

</div>

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a></div>

---
clicks: 0
sourceFrame: "8"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>02</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item"><span>03</span><div>Diffusion ELBO Derivation</div></div>
<div class="outline-item"><span>04</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item"><span>05</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Reverse Gaussian Diffusion Process"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>02</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item"><span>03</span><div>Diffusion ELBO Derivation</div></div>
<div class="outline-item"><span>04</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item"><span>05</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>

</div>

---
clicks: 3
sourceFrame: "15"
class: theorems
---

# Reverse Gaussian Diffusion Process

<img src="/figs/DDPM.png" alt="Forward and reverse diffusion processes" style="width:100%;height:155px;object-fit:contain" />

<div class="block" v-click="1">

## Forward Process

$$
q(\bx_t|\bx_{t-1})=\cN\left(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI\right)
$$

</div>
<div class="block" v-click="2">

## Reverse Process

$$
q(\bx_{t-1}|\bx_t)=\frac{q(\bx_t|\bx_{t-1}){\color{#8854c0}q(\bx_{t-1})}}{{\color{#8854c0}q(\bx_t)}}\approx\pt(\bx_{t-1}|\bx_t)
$$

<div v-click="3">

${\color{#8854c0}q(\bx_{t-1})}$ and ${\color{#8854c0}q(\bx_t)}$ are intractable:

$$
q(\bx_t)=\int q(\bx_t|\bx_0)\pd(\bx_0)d\bx_0
$$

</div></div>

<div class="source"><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">Weng L. What are Diffusion Models?, blog post, 2021</a></div>

---
clicks: 1
sourceFrame: "16"
class: theorems
---

# Reverse Gaussian Diffusion Process

$$
q(\bx_{t-1}|\bx_t)=\frac{q(\bx_t|\bx_{t-1}){\color{#8854c0}q(\bx_{t-1})}}{{\color{#8854c0}q(\bx_t)}}
$$

<div class="block">

## Theorem (Feller, 1949)

If $\beta_t$ is sufficiently small, $q(\bx_{t-1}|\bx_t)$ is Gaussian <span style="color:gray">(thus, diffusion requires $T\approx1000$ steps for convergence)</span>

</div>
<img v-click="1" src="/figs/inverse_distr_1d.png" alt="Reverse distributions for different diffusion step sizes" style="width:100%;height:270px;object-fit:contain" />

<div class="source">Feller W. On the theory of stochastic processes, with particular reference to applications, 1949<br><a href="https://arxiv.org/abs/2112.07804">Xiao Z., Kreis K., Vahdat A. Tackling the generative learning trilemma with denoising diffusion GANs, 2021</a></div>

---
clicks: 0
sourceFrame: "17"
class: theorems
---

# Reverse Gaussian Diffusion Process (Ancestral Sampling)

<img src="/figs/DDPM.png" alt="Forward and reverse diffusion processes" style="width:100%;height:205px;object-fit:contain" />

Define the reverse process as:

$$
q(\bx_{t-1}|\bx_t)\approx\pt(\bx_{t-1}|\bx_t)=\cN\bigl(\bmu_{\btheta,t}(\bx_t),\bsigma^2_{\btheta,t}(\bx_t)\bigr)
$$

<span style="color:gray">Feller's theorem justifies this Gaussian assumption.</span>

<div class="source"><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">Weng L. What are Diffusion Models?, blog post, 2021</a></div>

---
clicks: 2
sourceFrame: "extension: 17"
class: theorems
---

# Reverse Gaussian Diffusion Process (Ancestral Sampling)

<div class="block">

## Forward Process

1. $\bx_0=\bx\sim\pd(\bx)$
2. $\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t$
3. $\bx_T\sim p_\infty(\bx)=\cN(0,\bI)$

</div>
<div class="block" v-click="1">

## Reverse Process

1. $\bx_T\sim p_\infty(\bx)=\cN(0,\bI)$
2. $\bx_{t-1}=\bsigma_{\btheta,t}(\bx_t)\bepsilon+\bmu_{\btheta,t}(\bx_t)$
3. $\bx_0=\bx\sim\pd(\bx)$

</div>
<div v-click="2">

**Note:** The forward process is non-learnable, i.e., it does not involve trainable parameters

</div>

<div class="source"><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">Weng L. What are Diffusion Models?, blog post, 2021</a></div>

---
clicks: 1
sourceFrame: "18"
class: theorems
---

# Conditioned Reverse Distribution

<div class="block">

## Reverse Kernel (**Intractable**)

$$
q(\bx_{t-1}|\bx_t)=\frac{q(\bx_t|\bx_{t-1}){\color{#8854c0}q(\bx_{t-1})}}{{\color{#8854c0}q(\bx_t)}}
$$

</div>
<div class="block" v-click="1">

## Conditioned Reverse Kernel (**Tractable**)

$$
q(\bx_{t-1}|\bx_t,{\color{olive}\bx_0})=\frac{q(\bx_t|\bx_{t-1},{\color{olive}\bx_0})q(\bx_{t-1}|{\color{olive}\bx_0})}{q(\bx_t|{\color{olive}\bx_0})}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 1
sourceFrame: "extension: 18"
class: theorems
---

# Conditioned Reverse Distribution

<div class="block">

## Conditioned Reverse Kernel (**Tractable**)

$$
q(\bx_{t-1}|\bx_t,\bx_0)=\frac{\begin{gathered}\cN(\sqrt{1-\beta_t}\cdot\bx_{t-1},\beta_t\bI)\\{}\cdot\cN(\sqrt{\bar{\alpha}_{t-1}}\cdot\bx_0,(1-\bar{\alpha}_{t-1})\cdot\bI)\end{gathered}}{\cN(\sqrt{\bar{\alpha}_t}\cdot\bx_0,(1-\bar{\alpha}_t)\cdot\bI)}
$$

<div v-click="1">

$$
=\cN(\tilde{\bmu}_t(\bx_t,\bx_0),\tilde{\beta}_t\cdot\bI)
$$

Here,

$$
\begin{aligned}
\tilde{\bmu}_t(\bx_t,\bx_0)&=\frac{\sqrt{\alpha_t}(1-\bar{\alpha}_{t-1})}{1-\bar{\alpha}_t}\cdot\bx_t+\frac{\sqrt{\bar{\alpha}_{t-1}}(1-\alpha_t)}{1-\bar{\alpha}_t}\cdot\bx_0;\\
\tilde{\beta}_t&=\frac{(1-\alpha_t)(1-\bar{\alpha}_{t-1})}{1-\bar{\alpha}_t}=\text{const}.
\end{aligned}
$$

</div></div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

<!-- Source frame 18: preserve the full product inside the Gaussian numerator, wrapping it within a gathered numerator rather than shrinking it. The final Gaussian and its parameters reveal together. -->

---
clicks: 2
sourceFrame: "19"
class: theorems
---

# Distribution Summary

**Forward process** maps any distribution $\pd(\bx)$ to $\cN(0,\bI)$ by injection of noise:

$$
\begin{aligned}
q(\bx_t|\bx_{t-1})&=\cN(\sqrt{1-\beta_t}\cdot\bx_{t-1},\beta_t\cdot\bI);\\
q(\bx_t|\bx_0)&=\cN(\sqrt{\bar{\alpha}_t}\cdot\bx_0,(1-\bar{\alpha}_t)\cdot\bI).
\end{aligned}
$$

<div v-click="1">

**Reverse process** refers to an intractable distribution that can be approximated by a normal distribution (with unknown parameters) for small $\beta_t$:

$$
q(\bx_{t-1}|\bx_t)=\frac{q(\bx_t|\bx_{t-1})q(\bx_{t-1})}{q(\bx_t)}\approx\cN\left(\bmu_{\btheta,t}(\bx_t),\bsigma_{\btheta,t}^2(\bx_t)\right)
$$

</div>
<div v-click="2">

**Conditioned reverse process** is a normal distribution with known parameters, describing how to denoise a noisy image $\bx_t$ when we know the clean image $\bx_0$.

$$
q(\bx_{t-1}|\bx_t,{\color{olive}\bx_0})=\cN(\tilde{\bmu}_t(\bx_t,\bx_0),\tilde{\beta}_t\cdot\bI)
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "auto: Gaussian Diffusion Model as VAE"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item current"><span>02</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item"><span>03</span><div>Diffusion ELBO Derivation</div></div>
<div class="outline-item"><span>04</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item"><span>05</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>

</div>

---
clicks: 2
sourceFrame: "20"
class: theorems
---

# Gaussian Diffusion Model as VAE

Let's treat $\bz=(\bx_1,\dots,\bx_T)$ as a latent variable (**note:** each $\bx_t$ has the same dimension), and $\bx=\bx_0$ as the observed variable.

<div class="block">

## Latent Variable Model

$$
\pt(\bx,\bz)=\pt(\bx|\bz)\pt(\bz)
$$

</div>
<img v-click="1" src="/figs/diffusion_pgm_forward.png" alt="Forward diffusion graphical model" style="width:100%;height:125px;object-fit:contain" />

<div class="block" v-click="2">

## Forward Diffusion

- Variational posterior distribution (encoder)

$$
q(\bz|\bx)=q(\bx_1,\dots,\bx_T|\bx_0)=\prod_{t=1}^Tq(\bx_t|\bx_{t-1}).
$$

- **Note:** there are no learnable parameters.

</div>

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a></div>

---
clicks: 4
sourceFrame: "21"
class: theorems
---

# Gaussian Diffusion Model as VAE

$$
\pt(\bx,\bz)=\pt(\bx|\bz)\pt(\bz)
$$

<img v-click="1" src="/figs/diffusion_pgm_reverse.png" alt="Reverse diffusion graphical model" style="width:100%;height:125px;object-fit:contain" />

<div class="block" v-click="2">

## Reverse Diffusion

- Generative distribution (decoder)

$$
\pt(\bx|\bz)=\pt(\bx_0|\bx_1).
$$

<div v-click="3">

- Prior distribution

$$
\pt(\bz)=\pt(\bx_1,\dots,\bx_T)=\prod_{t=2}^T\pt(\bx_{t-1}|\bx_t)\cdot p(\bx_T).
$$

</div>
<div v-click="4">

**Note:** This differs from the vanilla VAE due to the simple decoder $\pt(\bx|\bz)$ and the complex prior $\pt(\bz)$ (Markov chain).

</div></div>

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a></div>

---
clicks: 0
sourceFrame: "auto: Diffusion ELBO Derivation"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>02</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item current"><span>03</span><div>Diffusion ELBO Derivation</div></div>
<div class="outline-item"><span>04</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item"><span>05</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>

</div>

---
clicks: 3
sourceFrame: "22"
class: derivation
---

# ELBO for Gaussian Diffusion Model

<div class="block">

## Standard ELBO

$$
\log\pt(\bx)\geq\bbE_{q({\color{teal}\bz}|\bx)}\log\frac{\pt(\bx,{\color{teal}\bz})}{q({\color{teal}\bz}|\bx)}=\cL_{\bphi,\btheta}(\bx)\rightarrow\max_{\bphi,\btheta}
$$

</div>
<div class="block" v-click="1">

## Derivation

$$ {1|all} {at:2}
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)&=\bbE_{q({\color{teal}\bx_{1:T}}|\bx_0)}\log\frac{\pt(\bx_0,{\color{teal}\bx_{1:T}})}{q({\color{teal}\bx_{1:T}}|\bx_0)}\\
&=\bbE_{q(\bx_{1:T}|\bx_0)}\log\frac{p(\bx_T)\prod_{t=1}^T\pt(\bx_{t-1}|\bx_t)}{\prod_{t=1}^T{\color{#8854c0}q(\bx_t|\bx_{t-1})}}
\end{aligned}
$$

<div v-click="3">

- Let's try to decompose the ELBO into individual KL divergence terms.
- We need to replace $q(\bx_t|\bx_{t-1})$ with $q(\bx_{t-1}|\bx_t)$ in the denominator.
- Let's condition on $\bx_0$ to make the reverse $q(\bx_{t-1}|\bx_t)$ tractable.

</div></div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 2
sourceFrame: "23"
class: derivation
---

# ELBO for Gaussian Diffusion Model

$$
{\color{teal}q(\bx_t|\bx_{t-1},\bx_0)}=\frac{q(\bx_{t-1}|\bx_t,\bx_0)q(\bx_t|\bx_0)}{q(\bx_{t-1}|\bx_0)}
$$

<div class="block" v-click="1">

## Derivation (continued)

$$ {1|all} {at:2}
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)&=\bbE_{q(\bx_{1:T}|\bx_0)}\log\frac{p(\bx_T)\prod_{t=1}^T\pt(\bx_{t-1}|\bx_t)}{\prod_{t=1}^T{\color{#8854c0}q(\bx_t|\bx_{t-1})}}\\
&=\bbE_{q(\bx_{1:T}|\bx_0)}\log\frac{p(\bx_T)\prod_{t=1}^T\pt(\bx_{t-1}|\bx_t)}{\prod_{t=1}^Tq(\bx_t|\bx_{t-1},{\color{olive}\bx_0})}
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 2
sourceFrame: "extension: 23"
class: derivation
---

# ELBO for Gaussian Diffusion Model

<div class="block">

## Derivation (continued)

$$ {1|1-2|all} {at:1}
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)&=\bbE_{q(\bx_{1:T}|\bx_0)}\log\frac{p(\bx_T)\pt(\bx_0|\bx_1)\prod_{t=2}^T\pt(\bx_{t-1}|\bx_t)}{q(\bx_1|\bx_0)\prod_{t=2}^T{\color{teal}q(\bx_t|\bx_{t-1},\bx_0)}}\\
&=\bbE_{q(\bx_{1:T}|\bx_0)}\log\frac{p(\bx_T)\pt(\bx_0|\bx_1)\prod_{t=2}^T\pt(\bx_{t-1}|\bx_t)}{{\color{#8854c0}q(\bx_1|\bx_0)}\prod_{t=2}^T\frac{q(\bx_{t-1}|\bx_t,\bx_0){\color{#8854c0}q(\bx_t|\bx_0)}}{{\color{#8854c0}q(\bx_{t-1}|\bx_0)}}}\\
&=\bbE_{q(\bx_{1:T}|\bx_0)}\log\frac{{\color{#8854c0}p(\bx_T)}{\color{olive}\pt(\bx_0|\bx_1)}\prod_{t=2}^T\pt(\bx_{t-1}|\bx_t)}{{\color{#8854c0}q(\bx_T|\bx_0)}\prod_{t=2}^Tq(\bx_{t-1}|\bx_t,\bx_0)}
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

<!-- Source frame 23 is split after conditioning the forward factors. No algebraic stage is removed: isolate t=1, substitute Bayes, then telescope. -->

---
clicks: 1
sourceFrame: "24"
class: derivation
---

# ELBO for Gaussian Diffusion Model

<div class="block">

## Derivation (continued)

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_{q(\bx_{1:T}|\bx_0)}\log\frac{{\color{#8854c0}p(\bx_T)}{\color{olive}\pt(\bx_0|\bx_1)}\prod_{t=2}^T\pt(\bx_{t-1}|\bx_t)}{{\color{#8854c0}q(\bx_T|\bx_0)}\prod_{t=2}^Tq(\bx_{t-1}|\bx_t,\bx_0)}
$$

<div v-click="1">

$$
\begin{aligned}
=\bbE_{{\color{teal}q(\bx_{1:T}|\bx_0)}}\biggl[&\log{\color{olive}\pt(\bx_0|\bx_1)}+\log{\color{#8854c0}\frac{p(\bx_T)}{q(\bx_T|\bx_0)}}\\
&+\sum_{t=2}^T\log\left(\frac{\pt(\bx_{t-1}|\bx_t)}{q(\bx_{t-1}|\bx_t,\bx_0)}\right)\biggr]
\end{aligned}
$$

</div></div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 1
sourceFrame: "extension: 24"
class: derivation
---

# ELBO for Gaussian Diffusion Model

<div class="block">

## Derivation (continued)

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)
&=\bbE_{{\color{teal}q(\bx_1|\bx_0)}}\log\pt(\bx_0|\bx_1)+\bbE_{{\color{teal}q(\bx_T|\bx_0)}}\log\frac{p(\bx_T)}{q(\bx_T|\bx_0)}\\
&\quad+\sum_{t=2}^T\bbE_{{\color{teal}q(\bx_{t-1},\bx_t|\bx_0)}}\log\left(\frac{\pt(\bx_{t-1}|\bx_t)}{q(\bx_{t-1}|\bx_t,\bx_0)}\right)
\end{aligned}
$$

<div v-click="1">

$$
\begin{aligned}
&=\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)-\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)\\
&\quad-\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}
\end{aligned}
$$

</div></div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

<!-- Source frame 24 continues with marginalization and the three KL terms. Each bracket, fraction and underbrace remains whole. -->

---
clicks: 3
sourceFrame: "25"
class: theorems
---

# ELBO for Gaussian Diffusion Model

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)&={\color{olive}\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}-{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}\\
&\quad-{\color{teal}\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}}
\end{aligned}
$$

<div v-click="1">

- <span style="color:olive">First term</span> is the decoder distribution

$$
\log\pt(\bx_0|\bx_1)=\log\cN\bigl(\bx_0|\bmu_{\btheta,1}(\bx_1),\bsigma_{\btheta,1}^2(\bx_1)\bigr),
$$

with $\bx_1\sim q(\bx_1|\bx_0)$.

</div>
<div v-click="2">

- <span style="color:#8854c0">Second term</span> is constant:
  - $p(\bx_T)=\cN(0,\bI)$;
  - $q(\bx_T|\bx_0)=\cN(\sqrt{\bar{\alpha}_T}\cdot\bx_0,(1-\bar{\alpha}_T)\cdot\bI)$.

</div>
<div v-click="3">

- <span style="color:teal">Third term</span> is the main contributor to the ELBO.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "imported: 8:9"
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
sourceFrame: "imported: 8:10"
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
sourceFrame: "extension: imported: 8:10"
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
sourceFrame: "imported: 8:11"
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

<div class="outline-item"><span>01</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>02</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item"><span>03</span><div>Diffusion ELBO Derivation</div></div>
<div class="outline-item current"><span>04</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item"><span>05</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>

</div>

---
clicks: 3
sourceFrame: "imported: 8:12"
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
sourceFrame: "extension: imported: 8:12"
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
sourceFrame: "imported: 8:13"
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
sourceFrame: "extension: imported: 8:13"
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
sourceFrame: "imported: 8:14"
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
sourceFrame: "extension: imported: 8:14"
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

<div class="outline-item"><span>01</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>02</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item"><span>03</span><div>Diffusion ELBO Derivation</div></div>
<div class="outline-item"><span>04</span><div>Gaussian Diffusion Reparametrization</div></div>
<div class="outline-item current"><span>05</span><div>Denoising Diffusion Probabilistic Model (DDPM)</div></div>

</div>

---
clicks: 0
sourceFrame: "imported: 8:15"
class: figure-slide
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" denoising-diffusion />

---
clicks: 2
sourceFrame: "imported: 8:16"
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
sourceFrame: "imported: 8:17"
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
clicks: 0
sourceFrame: "26"
class: summary
---

# Summary

- The reverse diffusion process reconstructs data from noise; we approximate its intractable transitions with Gaussian distributions.
- Conditioning on the clean image gives a tractable Gaussian reverse distribution.
- Gaussian diffusion is a VAE with a hierarchy of latent variables and a fixed encoder.
- Its ELBO decomposes into reconstruction, prior matching, and denoising terms; Gaussian denoising terms reduce to squared error.
- Reparametrizing the reverse mean turns denoising into prediction of the noise injected by the forward process.
- DDPM combines a simplified noise-prediction objective with ancestral sampling.
