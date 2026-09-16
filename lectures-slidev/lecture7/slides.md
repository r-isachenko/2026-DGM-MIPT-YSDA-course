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
sourceFrame: "2"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem (Informal)

Let $\bx_0$ be a random vector. Under mild regularity conditions, samples from the following dynamics will eventually follow $\pt(\bx)$ (for sufficiently small $\eta$ and large $l$):

$$
\bx_{l+1}=\bx_l+\frac{\eta}{2}\cdot\nabla_{\bx_l}\log\pt(\bx_l)+\sqrt{\eta}\cdot\bepsilon_l,\quad\bepsilon_l\sim\cN(0,\bI).
$$

</div>

- The density $\pt(\bx)$ is the **stationary** distribution of the Markov chain.
- The gradient is taken with respect to $\bx$, not $\btheta$.
- $\nabla_{\bx}\log\pt(\bx)$ defines a vector field.

<div class="block">

## Fisher Divergence

$$
D_F(\pd,\pt)=\frac{1}{2}\bbE_{\pd}\left\|\nabla_{\bx}\log\pt(\bx)-\nabla_\bx\log\pd(\bx)\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a><br><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a></div>

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
sourceFrame: "8"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Forward Gaussian Diffusion Process</div></div>
<div class="outline-item "><span>02</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item "><span>03</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item "><span>04</span><div>Diffusion ELBO Derivation</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Forward Gaussian Diffusion Process"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Forward Gaussian Diffusion Process</div></div>
<div class="outline-item "><span>02</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item "><span>03</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item "><span>04</span><div>Diffusion ELBO Derivation</div></div>

</div>

---
clicks: 0
sourceFrame: "9"
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" denoising-diffusion alt="Generative models taxonomy with DDPM highlighted" />

---
clicks: 2
sourceFrame: "10"
class: theorems
---

# Forward Gaussian Diffusion Process

Let $\bx_0=\bx\sim\pd(\bx)$, $\beta_t\ll1$. Define a Markov chain:

$$
\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t,\quad\bepsilon_t\sim\cN(0,\bI)
$$

<div v-click="1">

$$
q(\bx_t|\bx_{t-1})=\cN(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI)
$$

</div>
<div class="block" v-click="2">

## Langevin Dynamics

$$
\bx_{l+1}=\bx_l+\frac{\color{#8854c0}\eta}{2}\cdot{\color{teal}\nabla_{\bx_l}\log\pt(\bx_l)}+\sqrt{\color{#8854c0}\eta}\bepsilon_l,\quad\bepsilon_l\sim\cN(0,\bI)
$$

</div>

<div class="source"><a href="http://proceedings.mlr.press/v37/sohl-dickstein15.pdf">Sohl-Dickstein J. Deep Unsupervised Learning using Nonequilibrium Thermodynamics, 2015</a></div>

<!-- The final comparison from source frame 10 continues on the next slide. The original pause before the expansion becomes the slide boundary. -->

---
clicks: 1
sourceFrame: "extension: 10"
class: theorems
---

# Forward Gaussian Diffusion Process

$$
\begin{aligned}
\bx_t&=\sqrt{1-\beta_t}\,\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t\\
&\approx\left(1-\frac{\beta_t}{2}\right)\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t\\
&=\bx_{t-1}+\frac{\color{#8854c0}\beta_t}{2}{\color{teal}(-\bx_{t-1})}+\sqrt{\color{#8854c0}\beta_t}\bepsilon_t
\end{aligned}
$$

<div v-click="1">

- ${\color{#8854c0}\beta_t=\eta}$
- ${\color{teal}\nabla_{\bx_{t-1}}\log\pt(\bx_{t-1})=-\bx_{t-1}=\nabla_{\bx_{t-1}}\log\cN(0,\bI)}$

</div>

<div class="source"><a href="http://proceedings.mlr.press/v37/sohl-dickstein15.pdf">Sohl-Dickstein J. Deep Unsupervised Learning using Nonequilibrium Thermodynamics, 2015</a></div>

---
clicks: 1
sourceFrame: "11"
class: theorems
---

# Forward Gaussian Diffusion Process

$$
\begin{aligned}
\bx_t&=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t,\quad\bepsilon_t\sim\cN(0,\bI)\\
q(\bx_t|\bx_{t-1})&=\cN(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI)
\end{aligned}
$$

<div class="block" v-click="1">

## Statement 1

Let $\alpha_t=1-\beta_t$ and $\bar{\alpha}_t=\prod_{s=1}^t\alpha_s=\prod_{s=1}^t(1-\beta_s)$. Then

$$
q(\bx_t|\bx_0)=\cN(\sqrt{\bar{\alpha}_t}\,\bx_0,(1-\bar{\alpha}_t)\bI)
$$

</div>

<div class="source"><a href="http://proceedings.mlr.press/v37/sohl-dickstein15.pdf">Sohl-Dickstein J. Deep Unsupervised Learning using Nonequilibrium Thermodynamics, 2015</a></div>

---
clicks: 4
sourceFrame: "extension: 11"
class: derivation
---

# Forward Gaussian Diffusion Process

<div class="block">

## Statement 1 (continued)

Thus, samples at any timestep $t$ can be generated directly from $\bx_0$

$$ {1|1-2|1-3|1-4|all} {at:1}
\begin{aligned}
\bx_t&=\sqrt{\alpha_t}{\color{teal}\bx_{t-1}}+\sqrt{1-\alpha_t}\bepsilon_t\\
&=\sqrt{\alpha_t}({\color{teal}\sqrt{\alpha_{t-1}}\bx_{t-2}+\sqrt{1-\alpha_{t-1}}\bepsilon_{t-1}})+\sqrt{1-\alpha_t}\bepsilon_t\\
&=\sqrt{\alpha_t\alpha_{t-1}}\bx_{t-2}+({\color{#8854c0}\sqrt{\alpha_t(1-\alpha_{t-1})}\bepsilon_{t-1}+\sqrt{1-\alpha_t}\bepsilon_t})\\
&=\sqrt{\alpha_t\alpha_{t-1}}\bx_{t-2}+{\color{#8854c0}\sqrt{1-\alpha_t\alpha_{t-1}}\bepsilon'_t}\\
&=\ldots=\sqrt{\bar{\alpha}_t}\,\bx_0+\sqrt{1-\bar{\alpha}_t}\bepsilon,\quad\bepsilon\sim\cN(0,\bI)
\end{aligned}
$$

</div>

<div class="source"><a href="http://proceedings.mlr.press/v37/sohl-dickstein15.pdf">Sohl-Dickstein J. Deep Unsupervised Learning using Nonequilibrium Thermodynamics, 2015</a></div>

<!-- Four cumulative rows preserve the four nextonslide stages of source frame 11. The pause before the derivation becomes the slide boundary. -->

---
clicks: 0
sourceFrame: "12"
class: theorems
---

# Forward Gaussian Diffusion Process

$$
\begin{aligned}
q(\bx_t|\bx_{t-1})&=\cN\left(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI\right);\\
q(\bx_t|\bx_0)&=\cN\left(\sqrt{\bar{\alpha}_t}\bx_0,(1-\bar{\alpha}_t)\bI\right)
\end{aligned}
$$

<img src="/figs/conditional_diffusion.png" alt="Conditional diffusion from an image to noise" class="wide-figure" />

<div class="source"><a href="https://arxiv.org/abs/2403.18103">Chan S. Tutorial on Diffusion Models for Imaging and Vision, 2024</a></div>

---
clicks: 2
sourceFrame: "extension: 12"
class: theorems
---

# Forward Gaussian Diffusion Process

<div class="block">

## Statement 2

Applying the Markov chain to any distribution $\pd(\bx)$ yields $\bx_\infty\sim p_\infty(\bx)=\cN(0,\bI)$, the **stationary** (limiting) distribution:

$$
p_\infty(\bx)=\int q(\bx|\bx')p_\infty(\bx')d\bx'
$$

<div v-click="1">

$$
\begin{aligned}
p_\infty(\bx)&=\int q(\bx_\infty|\bx_0)\pd(\bx_0)d\bx_0\\
&\approx\cN(0,\bI)\int\pd(\bx_0)d\bx_0=\cN(0,\bI)
\end{aligned}
$$

</div></div>
<div v-click="2">

**Note:** This holds iff $\bar{\alpha}_t\rightarrow0$, i.e., $\sum_{t=1}^{\infty}\beta_t=+\infty$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2403.18103">Chan S. Tutorial on Diffusion Models for Imaging and Vision, 2024</a></div>

---
clicks: 2
sourceFrame: "13"
class: theorems
---

# Forward Gaussian Diffusion Process

**Diffusion** describes the migration of particles from regions of high density to those of low density.

<img src="/figs/diffusion_over_time.png" alt="Diffusion over time" style="width:100%;height:155px;object-fit:contain" />

<div v-click="1">

1. $\bx_0=\bx\sim\pd(\bx)$
2. $\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t$, $\bepsilon_t\sim\cN(0,\bI)$, $t\geq1$
3. After $T\gg1$ steps: $\bx_T\sim p_\infty(\bx)=\cN(0,\bI)$

</div>
<div v-click="2">

If this process can be reversed, we can sample from $\pd(\bx)$ by starting from noise $p_\infty(\bx)=\cN(0,\bI)$.<br>
Our goal now becomes inverting this diffusion.

</div>

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a></div>

---
clicks: 1
sourceFrame: "14"
class: theorems
---

# Denoising Score Matching

<div class="block">

## NCSN

$$
\begin{aligned}
q(\bx_t|\bx_0)&=\cN(\bx_0,\sigma_t^2\bI),\quad q(\bx_1)\approx\pd(\bx),\quad q(\bx_T)\approx\cN(0,\sigma_T^2\bI)\\
\nabla_{\bx_t}\log q(\bx_t|\bx)&=-\frac{\bx_t-\bx}{\sigma_t^2}
\end{aligned}
$$

</div>
<div class="block" v-click="1">

## Gaussian Diffusion

$$
\begin{aligned}
q(\bx_t|\bx_0)&=\cN(\sqrt{\bar{\alpha}_t}\bx_0,(1-\bar{\alpha}_t)\bI),\quad q(\bx_1)\approx\pd(\bx),\quad q(\bx_T)\approx\cN(0,\bI)\\
\nabla_{\bx_t}\log q(\bx_t|\bx_0)&=-\frac{\bx_t-\sqrt{\bar{\alpha}_t}\bx_0}{1-\bar{\alpha}_t}
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a></div>

---
clicks: 1
sourceFrame: "extension: 14"
class: theorems
---

# Denoising Score Matching

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
sourceFrame: "auto: Reverse Gaussian Diffusion Process"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Forward Gaussian Diffusion Process</div></div>
<div class="outline-item current"><span>02</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item "><span>03</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item "><span>04</span><div>Diffusion ELBO Derivation</div></div>

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

<div class="outline-item "><span>01</span><div>Forward Gaussian Diffusion Process</div></div>
<div class="outline-item "><span>02</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item current"><span>03</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item "><span>04</span><div>Diffusion ELBO Derivation</div></div>

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

<div class="outline-item "><span>01</span><div>Forward Gaussian Diffusion Process</div></div>
<div class="outline-item "><span>02</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item "><span>03</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item current"><span>04</span><div>Diffusion ELBO Derivation</div></div>

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
sourceFrame: "26"
class: summary
---

# Summary

- The Gaussian diffusion process is a Markov chain that incrementally corrupts data with specific Gaussian noise.
- Denoising score matching, together with Langevin dynamics, can be applied to the Gaussian diffusion process.
- The reverse process reconstructs data from noise samples, although its precise form is intractable.
- We approximate the reverse process using normality assumptions.
- Gaussian diffusion model can be interpreted as a VAE with a hierarchy of latent variables.
- The ELBO for Gaussian diffusion model may be formulated as a sum over many KL divergence terms.
