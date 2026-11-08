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
id: deep-generative-models
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 7</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
id: recap-of-previous-lecture
class: theorems
---

# Recap of Previous Lecture

For an EBM $\pt(\bx)\propto e^{-E_{\btheta}(\bx)}$, its **score** is $\nabla_{\bx}\log\pt(\bx)=-\nabla_{\bx}E_{\btheta}(\bx)$.<br>
We learn a vector network $\bs_{\btheta}(\bx)\approx\nabla_{\bx}\log\pd(\bx)$ directly, then sample with noise.

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
<img src="/figs/smld.jpg" alt="Score matching and Langevin dynamics" style="width:100%;height:250px;object-fit:contain" />

<div class="source"><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a></div>

---
clicks: 0
id: recap-of-previous-lecture-2
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

<img src="/figs/single_noise.jpg" alt="Gaussian perturbation smooths the data distribution" style="width:100%;height:195px;object-fit:contain;margin-top:24px" />


<div class="source"><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a><br><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

<!-- Source frame 4 is split after the Assumption to preserve the approved course type size. Both recap pages are static, as in Beamer. -->

---
clicks: 0
id: recap-of-previous-lecture-3
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem

Under mild regularity conditions, the last term is independent of $\btheta$:

$$
\begin{aligned}
&\bbE_{q(\bx_{\sigma})}\bigl\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\bigr\|_2^2\\
&\quad=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\bigl\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\bigr\|_2^2+\text{const}
\end{aligned}
$$

</div>

Here,

$$
\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)=-\frac{\bx_{\sigma}-\bx}{\sigma^2}=-\frac{\bepsilon}{\sigma}.
$$

<div class="block">

## Tweedie's Formula

From Lecture 6, the MSE-optimal clean-data prediction is

$$
\bbE_{q(\bx|\bx_\sigma)}[\bx]=\bx_\sigma+\sigma^2\nabla_{\bx_\sigma}\log q(\bx_\sigma).
$$

</div>

<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a><br><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3325056/">Efron B. Tweedie's Formula and Selection Bias, 2011</a></div>

---
clicks: 0
id: recap-of-previous-lecture-4
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
id: recap-of-previous-lecture-5
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Noise-Conditioned Score Network (NCSN)

- Define a sequence of noise levels: $\sigma_1<\sigma_2<\dots<\sigma_T$.
- Balance the score targets $-\bepsilon/\sigma_t$ using weights $\sigma_t^2$:

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
id: recap-of-previous-lecture-6
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


<div>

<div class="block">

## Sampling (Annealed Langevin Dynamics)

1. Sample $\bx_T^0\sim\cN(0,\sigma_T^2\bI)\approx q(\bx_T)$.
2. Update $\bx_t^l$ via $L$ steps of Langevin dynamics at each noise level $\sigma_t$:

$$
\bx_t^l=\bx_t^{l-1}+\frac{\eta_t}{2}\bs_{\btheta,\sigma_t}(\bx_t^{l-1})+\sqrt{\eta_t}\bepsilon_t^l.
$$

3. Update $\bx_{t-1}^0:=\bx_t^L$ and proceed to $\sigma_{t-1}$ if $t>1$.

</div>

</div>

<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a><br><a href="https://arxiv.org/abs/2006.09011">Song Y. et al. Improved Techniques for Training Score-Based Generative Models, 2020</a></div>


---
clicks: 0
id: outline
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Forward Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>02</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>03</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item"><span>04</span><div>Diffusion ELBO Derivation</div></div>

</div>

---
clicks: 0
id: outline-forward-diffusion
section: "Forward Gaussian Diffusion Process"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Forward Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>02</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>03</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item"><span>04</span><div>Diffusion ELBO Derivation</div></div>

</div>

---
clicks: 6
id: forward-gaussian-diffusion-process
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

<div v-click="3">

$$ {1|1-2|all} {at: 4}
\begin{aligned}
\bx_t&=\sqrt{1-\beta_t}\,\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t\\
&\approx\left(1-\frac{\beta_t}{2}\right)\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t\\
&=\bx_{t-1}+\frac{\color{#8854c0}\beta_t}{2}{\color{teal}(-\bx_{t-1})}+\sqrt{\color{#8854c0}\beta_t}\bepsilon_t
\end{aligned}
$$

</div>
<div class="takeaway" v-click="6">

**From a Markov chain to Langevin dynamics:** for small $\beta_t$, this Gaussian chain approximates LD targeting $\cN(0,\bI)$, with step size ${\color{#8854c0}\eta=\beta_t}$ and Gaussian score ${\color{teal}-\bx_{t-1}}$.

</div>

<div class="source"><a href="http://proceedings.mlr.press/v37/sohl-dickstein15.pdf">Sohl-Dickstein J. Deep Unsupervised Learning using Nonequilibrium Thermodynamics, 2015</a></div>

---
clicks: 6
id: forward-gaussian-diffusion-process-2
class: theorems
---

# Forward Diffusion: Sample at Any Timestep

Fix a schedule $0<\beta_t<1$. The noises $\bepsilon_t\sim\cN(0,\bI)$ are independent across $t$ and of $\bx_0$.

$$
\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t,
\qquad q(\bx_t|\bx_{t-1})=\cN(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI).
$$

<div class="block" v-click="1">

## Exact Conditional Distribution

Let $\alpha_t=1-\beta_t$ and $\bar{\alpha}_t=\prod_{s=1}^t\alpha_s$. Then

$$
q(\bx_t|\bx_0)=\cN(\sqrt{\bar{\alpha}_t}\,\bx_0,(1-\bar{\alpha}_t)\bI).
$$

<div v-click="2">

Sample $\bx_t$ directly from $\bx_0$, without simulating the intermediate steps:

<div class="columns" style="grid-template-columns: 7fr 4fr; gap: 24px; align-items: center"><div>

$$ {1|1-2|1-3|1-4|all} {at:3}
\begin{aligned}
\bx_t&=\sqrt{\alpha_t}\bx_{t-1}+\sqrt{1-\alpha_t}\bepsilon_t\\
&=\sqrt{\alpha_t}\left(\sqrt{\alpha_{t-1}}\bx_{t-2}+\sqrt{1-\alpha_{t-1}}\bepsilon_{t-1}\right)+\sqrt{1-\alpha_t}\bepsilon_t\\
&=\sqrt{\alpha_t\alpha_{t-1}}\bx_{t-2}+({\color{#8854c0}\sqrt{\alpha_t(1-\alpha_{t-1})}\bepsilon_{t-1}+\sqrt{1-\alpha_t}\bepsilon_t})\\
&=\sqrt{\alpha_t\alpha_{t-1}}\bx_{t-2}+{\color{#8854c0}\sqrt{1-\alpha_t\alpha_{t-1}}\bepsilon'_t}\\
&=\ldots={\color{teal}\sqrt{\bar{\alpha}_t}\,\bx_0}+{\color{#8854c0}\sqrt{1-\bar{\alpha}_t}\bepsilon},\quad\bepsilon\sim\cN(0,\bI).
\end{aligned}
$$

</div><div v-click="5">

## Noise Variance

Independent noises: variances add per coordinate.

$$
{\color{#8854c0}\begin{aligned}
&\alpha_t(1-\alpha_{t-1})+(1-\alpha_t)\\
&\qquad=1-\alpha_t\alpha_{t-1}.
\end{aligned}}
$$

$$
\bepsilon'_t\sim\cN(0,\bI).
$$

</div></div>

</div>
</div>

<div class="source"><a href="http://proceedings.mlr.press/v37/sohl-dickstein15.pdf">Sohl-Dickstein J. Deep Unsupervised Learning using Nonequilibrium Thermodynamics, 2015</a></div>

<!-- This finite-time identity is exact for any fixed schedule 0 < beta_t < 1; neither monotonicity nor beta_t << 1 is needed. Small beta was used only for the previous Langevin approximation. The first expansion is for t >= 2; t = 1 is the defining step. Independent Gaussian increments combine with variance alpha_t(1-alpha_{t-1}) + (1-alpha_t) = 1-alpha_t alpha_{t-1}. The aggregate epsilon is independent of x_0 for each fixed t; the direct representation does not prescribe a joint coupling across timesteps. -->

---
clicks: 3
id: forward-gaussian-diffusion-process-4
class: theorems
---

# When Does Only Gaussian Noise Remain?

The closed-form conditional already tells us how the signal disappears:

$$
\bx_t={\color{teal}\sqrt{\bar{\alpha}_t}\,\bx_0}+{\color{#8854c0}\sqrt{1-\bar{\alpha}_t}\bepsilon},\qquad\bepsilon\sim\cN(0,\bI),\quad\bepsilon\perp\bx_0.
$$

<div class="block" v-click="1">

## The Schedule Must Remove the Signal

For $0<\beta_t<1$, the required condition is

$$
\bar{\alpha}_t=\prod_{s=1}^t(1-\beta_s)\longrightarrow0
\quad\Longleftrightarrow\quad
\sum_{t=1}^{\infty}\beta_t=\infty.
$$

Many steps alone are not enough: $\beta_t=2^{-t}$ leaves $\bar{\alpha}_\infty>0$.

</div>
<div v-click="2">

$$
{\color{teal}\sqrt{\bar{\alpha}_t}\to0},\qquad
{\color{#8854c0}\sqrt{1-\bar{\alpha}_t}\to1}
\quad\Longrightarrow\quad
\bx_t\xrightarrow{d}\cN(0,\bI).
$$

The limit no longer depends on the initial data distribution $\pd$.

</div>
<div class="takeaway" v-click="3">

**For finite $T$:** choose $\bar{\alpha}_T\ll1$ with negligible residual signal $\sqrt{\bar{\alpha}_T}\bx_0$.<br>
Then $q(\bx_T)\approx\cN(0,\bI)$: the terminal distribution is approximately standard Gaussian.

</div>

<div class="source"><a href="https://arxiv.org/abs/2403.18103">Chan S. Tutorial on Diffusion Models for Imaging and Vision, 2024</a></div>

<!-- This is a direct consequence of the previous exact conditional, not a separate stationarity theorem. For a fixed schedule 0 < beta_t < 1, alpha_bar_t -> 0 iff sum beta_t diverges. If sum beta_t converges, beta_t -> 0 and the tail sum of -log(1-beta_t) converges; finitely many initial factors are positive. If the sum diverges, log(1-beta_t) <= -beta_t forces the product to zero. Under alpha_bar_t -> 0, the marginal converges in distribution for any probability law on finite-dimensional x_0, without a moment assumption. Couple the one-time representations using an independent Gaussian epsilon to see the limit. For finite T, closeness depends on the data scale as well as alpha_bar_T. -->

---
clicks: 0
id: forward-gaussian-diffusion-process-3
class: theorems interactive-slide
---

<script setup>
import ForwardDiffusionDemo from '../lecture6/components/ForwardDiffusionDemo.vue'
</script>

# Forward Diffusion: From Data to Noise

$$
\begin{aligned}
q(\bx_t|\bx_{t-1})&=\cN\left(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI\right);\\
q(\bx_t|\bx_0)&=\cN\left({\color{teal}\sqrt{\bar{\alpha}_t}\bx_0},{\color{#8854c0}(1-\bar{\alpha}_t)\bI}\right)
\end{aligned}
$$

<ForwardDiffusionDemo />

<div class="source"><a href="https://arxiv.org/abs/2403.18103">Chan S. Tutorial on Diffusion Models for Imaging and Vision, 2024</a></div>

<!-- Original analytic 1D illustration replacing the source image. The plots show marginals, not conditional kernels or a sample trajectory. Each initial Gaussian component has mean scaled by sqrt(alpha_bar_t) and variance alpha_bar_t * 0.35^2 + 1 - alpha_bar_t. beta_t = 0.01; the PDF compares t = 0, 75, 250, 1000. -->

---
clicks: 3
id: denoising-score-matching-9
class: theorems
---

# Denoising Score Matching

Let $\bx_0\sim\pd$, $\bepsilon\sim\cN(0,\bI)$, with $\bepsilon$ independent of $\bx_0$.

<div class="columns"><div>

## NCSN

$$
\bx_t=\bx_0+\sigma_t\bepsilon
$$

$$
q(\bx_t|\bx_0)=\cN(\bx_0,\sigma_t^2\bI)
$$

$$
\nabla_{\bx_t}\log q(\bx_t|\bx_0)=-\frac{\bx_t-\bx_0}{\sigma_t^2}
$$

$$
q(\bx_1)\approx\pd,\quad q(\bx_T)\approx\cN(0,\sigma_T^2\bI)
$$

</div><div v-click="1">

## Gaussian Diffusion

$$
\bx_t=\sqrt{\bar{\alpha}_t}\bx_0+\sqrt{1-\bar{\alpha}_t}\bepsilon
$$

$$
q(\bx_t|\bx_0)=\cN(\sqrt{\bar{\alpha}_t}\bx_0,(1-\bar{\alpha}_t)\bI)
$$

$$
\nabla_{\bx_t}\log q(\bx_t|\bx_0)=-\frac{\bx_t-\sqrt{\bar{\alpha}_t}\bx_0}{1-\bar{\alpha}_t}
$$

$$
q(\bx_1)\approx\pd,\quad q(\bx_T)\approx\cN(0,\bI)
$$

</div></div>

<div class="block" v-click="2">

## Theorem (Denoising Score Matching)

$$
\begin{aligned}
&\bbE_{q(\bx_t)}\left\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t)\right\|_2^2\\
&\quad=\bbE_{\pd(\bx_0)}\bbE_{q(\bx_t|\bx_0)}\left\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx_0)\right\|_2^2+\text{const}
\end{aligned}
$$

</div>
<div v-click="3">

**Note:** Annealed Langevin dynamics applies to diffusion, too.

NCSN with annealed Langevin dynamics is an early score-based generative framework (2019–2020).

</div>

<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a><br><a href="http://proceedings.mlr.press/v37/sohl-dickstein15.pdf">Sohl-Dickstein J. Deep Unsupervised Learning using Nonequilibrium Thermodynamics, 2015</a></div>

---
clicks: 2
id: forward-gaussian-diffusion-process-5
class: theorems
---

# Forward Gaussian Diffusion Process

**Diffusion** describes the migration of particles from regions of high density to those of low density.

<div class="columns balanced">
<img src="/figs/diffusion_over_time.png" alt="Diffusion over time" style="width:100%;height:340px;object-fit:contain" />
<div v-click="1">

1. $\bx_0=\bx\sim\pd(\bx)$
2. $\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t$,<br>$\bepsilon_t\sim\cN(0,\bI)$, $t\geq1$
3. Choose $\bar{\alpha}_T\ll1$ to suppress $\sqrt{\bar{\alpha}_T}\bx_0$.<br>Then $q(\bx_T)\approx\cN(0,\bI)$.

</div>
</div>
<div v-click="2">

If this process can be reversed, we can sample from $\pd(\bx)$ by starting from noise $\cN(0,\bI)\approx q(\bx_T)$.<br>
Our goal now becomes inverting this diffusion.

</div>

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a></div>

---
clicks: 0
id: outline-2
section: "Reverse Gaussian Diffusion Process"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Forward Gaussian Diffusion Process</div></div>
<div class="outline-item current"><span>02</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>03</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item"><span>04</span><div>Diffusion ELBO Derivation</div></div>

</div>

---
clicks: 3
id: reverse-gaussian-diffusion-process
class: theorems
---

# Reverse Gaussian Diffusion Process

<img src="/figs/DDPM.png" alt="Forward and reverse diffusion processes" style="width:100%;height:245px;object-fit:contain" />

<div class="columns balanced derivation" style="grid-template-columns: 230px 1fr" v-click="1">

## Forward Process

$$
q(\bx_t|\bx_{t-1})=\cN\left(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI\right)
$$

</div>
<div class="columns balanced derivation" style="grid-template-columns: 230px 1fr" v-click="2">

## Reverse Process

$$
q(\bx_{t-1}|\bx_t)=\frac{q(\bx_t|\bx_{t-1}){\color{#8854c0}q(\bx_{t-1})}}{{\color{#8854c0}q(\bx_t)}}\approx\pt(\bx_{t-1}|\bx_t)
$$

</div>
<div v-click="3">

${\color{#8854c0}q(\bx_{t-1})}$ and ${\color{#8854c0}q(\bx_t)}$ are intractable:

$$
q(\bx_t)=\int q(\bx_t|\bx_0)\pd(\bx_0)d\bx_0
$$

</div>

<div class="source"><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">Weng L. What are Diffusion Models?, blog post, 2021</a></div>

---
clicks: 1
id: reverse-gaussian-diffusion-process-2
class: theorems
---

# Reverse Gaussian Diffusion Process

<div class="block">

## Theorem (Feller, 1949)

If $\beta_t$ is sufficiently small, the reverse conditional is approximately Gaussian:

$$
q(\bx_{t-1}|\bx_t)=\frac{q(\bx_t|\bx_{t-1}){\color{#8854c0}q(\bx_{t-1})}}{{\color{#8854c0}q(\bx_t)}}.
$$

The original DDPM used $T=1000$ steps. Faster sampling methods will be discussed later.

</div>

<div class="columns balanced" style="grid-template-columns: 1.2fr 1fr" v-click="1">

<img src="/figs/inverse_distr_1d.png" alt="Reverse distributions for different diffusion step sizes" style="width:100%;height:300px;object-fit:contain" />

<div>

## Same Noisy Endpoint

**Top:** marginals $q(x_s)$.<br>
**Bottom:** posteriors for fixed $x_5=X$.

$$
q(x_s|x_5=X)\propto q(x_5=X|x_s)q(x_s).
$$

- **Short reverse step:** nearly Gaussian.
- **Long reverse jump:** can be multimodal.

</div>
</div>

<div class="source">Feller W. On the theory of stochastic processes, with particular reference to applications, 1949<br><a href="https://arxiv.org/abs/2006.11239">Ho J. et al. Denoising Diffusion Probabilistic Models, 2020</a><br><a href="https://arxiv.org/abs/2112.07804">Xiao Z., Kreis K., Vahdat A. Tackling the generative learning trilemma with denoising diffusion GANs, 2021</a></div>

---
clicks: 0
id: reverse-gaussian-diffusion-process-ancestral-sampling
class: theorems
---

# Reverse Gaussian Diffusion Process (Ancestral Sampling)

<img src="/figs/DDPM.png" alt="Forward and reverse diffusion processes" style="width:100%;height:245px;object-fit:contain" />

<div class="columns balanced derivation" style="grid-template-columns: 230px 1fr">

## Forward Process

$$
q(\bx_t|\bx_{t-1})=\cN\left(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI\right)
$$

</div>
<div class="columns balanced derivation" style="grid-template-columns: 230px 1fr">

## Reverse Process

$$
q(\bx_{t-1}|\bx_t)\approx\pt(\bx_{t-1}|\bx_t)=\cN\bigl(\bmu_{\btheta,t}(\bx_t),\bsigma^2_{\btheta,t}(\bx_t)\bigr)
$$

</div>

If $\beta_t$ is sufficiently small, $q(\bx_{t-1}|\bx_t)$ is approximately Gaussian.

<div class="source"><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">Weng L. What are Diffusion Models?, blog post, 2021</a></div>

---
clicks: 2
id: reverse-gaussian-diffusion-process-ancestral-sampling-2
class: theorems
---

# Reverse Gaussian Diffusion Process (Ancestral Sampling)

<img src="/figs/DDPM.png" alt="Forward and reverse diffusion processes" style="width:100%;height:190px;object-fit:contain" />

<div class="columns">
<div>

## Forward Process

$$
q(\bx_t|\bx_{t-1})=\cN\bigl(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI\bigr)
$$

1. $\bx_0\sim\pd(\bx_0)$
2. $\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t,\quad\bepsilon_t\sim\cN(0,\bI)$
3. $q(\bx_T)\approx\cN(0,\bI)$

</div>
<div v-click="1">

## Reverse Process

$$
\pt(\bx_{t-1}|\bx_t)=\cN\bigl(\bmu_{\btheta,t}(\bx_t),\bsigma^2_{\btheta,t}(\bx_t)\bigr)
$$

1. $\bx_T\sim\cN(0,\bI)$
2. $\bx_{t-1}=\bmu_{\btheta,t}(\bx_t)+\bsigma_{\btheta,t}(\bx_t)\bepsilon_t,\quad\bepsilon_t\sim\cN(0,\bI)$
3. $\bx_0\sim\pt(\bx_0)\approx\pd(\bx_0)$

</div>
</div>
<div class="takeaway" v-click="2">

**Note:** The forward process has no trainable parameters.

</div>

<div class="source"><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">Weng L. What are Diffusion Models?, blog post, 2021</a></div>

---
clicks: 3
id: conditioned-reverse-distribution
class: theorems
---

# Conditioned Reverse Distribution

<div class="block">

## Reverse Kernel (**Intractable**)

$$
q(\bx_{t-1}|\bx_t)=\frac{q(\bx_t|\bx_{t-1}){\color{#8854c0}q(\bx_{t-1})}}{{\color{#8854c0}q(\bx_t)}}\approx\cN\bigl(\bmu_{\btheta,t}(\bx_t),\bsigma^2_{\btheta,t}(\bx_t)\bigr),\quad\beta_t\ll1.
$$

</div>
<div class="block" v-click="1">

## Conditioned Reverse Kernel (**Tractable**)

During training, ${\color{olive}\bx_0}$ is known: substitute Gaussians and complete the square in $\bx_{t-1}$.

$$ {1|1-2|all} {at:2}
\begin{aligned}
q(\bx_{t-1}|\bx_t,{\color{olive}\bx_0})
&=\frac{q(\bx_t|\bx_{t-1})q(\bx_{t-1}|{\color{olive}\bx_0})}{q(\bx_t|{\color{olive}\bx_0})}\\
&=\frac{\cN(\sqrt{\alpha_t}\bx_{t-1},(1-\alpha_t)\bI)\,\cN(\sqrt{\bar{\alpha}_{t-1}}\bx_0,(1-\bar{\alpha}_{t-1})\bI)}{\cN(\sqrt{\bar{\alpha}_t}\bx_0,(1-\bar{\alpha}_t)\bI)}\\
&=\cN\bigl({\color{teal}\tilde{\bmu}_t}(\bx_t,\bx_0),{\color{#8854c0}\tilde{\beta}_t}\bI\bigr).
\end{aligned}
$$

<div v-click="3">

$$
\boxed{\color{teal}\tilde{\bmu}_t(\bx_t,\bx_0)=\frac{\sqrt{\alpha_t}(1-\bar{\alpha}_{t-1})}{1-\bar{\alpha}_t}\cdot\bx_t+\frac{\sqrt{\bar{\alpha}_{t-1}}(1-\alpha_t)}{1-\bar{\alpha}_t}\cdot\bx_0}
$$

$$
\boxed{\color{#8854c0}\tilde{\beta}_t=\frac{(1-\alpha_t)(1-\bar{\alpha}_{t-1})}{1-\bar{\alpha}_t}=\text{const}}
$$

</div></div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
id: what-does-knowing-the-clean-data-change
class: interactive-slide
---

# What Does Knowing the Clean Data Change?

<ConditionedReverseDemo />

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. et al. Denoising Diffusion Probabilistic Models, 2020</a></div>

<!-- Original exact two-point example: alpha_t=0.6, alpha_bar_(t-1)=0.65. The finite data distribution makes the unknown-x0 mixture tractable for illustration. This does not assert tractability for general data or demonstrate a small-step Gaussian approximation. -->

---
clicks: 2
id: distribution-summary
class: theorems
---

# Distribution Summary

<div style="display:flex;flex-direction:column;justify-content:space-between;height:500px">
<div>

**Forward process:** with a suitable noise schedule, $q(\bx_T)\approx\cN(0,\bI)$ as the residual signal becomes negligible:

$$
\begin{aligned}
q(\bx_t|\bx_{t-1})&=\cN(\sqrt{1-\beta_t}\cdot\bx_{t-1},\beta_t\cdot\bI);\\
q(\bx_t|\bx_0)&=\cN(\sqrt{\bar{\alpha}_t}\cdot\bx_0,(1-\bar{\alpha}_t)\cdot\bI).
\end{aligned}
$$

</div>
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

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 2
id: noise-schedule-through-signal-to-noise-ratio
class: theorems interactive-slide
---

# Noise Schedule through Signal-to-Noise Ratio

<div class="columns" style="grid-template-columns:1fr 1fr;gap:36px">
<div>

## Signal and Noise

$$
\bx_t={\color{#007f82}\sqrt{\bar{\alpha}_t}}\bx_0+{\color{#8854c0}\sqrt{1-\bar{\alpha}_t}}\bepsilon.
$$

For $\bepsilon\sim\cN(0,\bI)$, compare squared scales:

$$
\SNR(t)=\frac{{\color{#007f82}\bar{\alpha}_t}}{{\color{#8854c0}1-\bar{\alpha}_t}}.
$$

<div v-click="1">

## A Single Noise-Level Coordinate

$$
\lambda_t=\log\SNR(t),
\qquad\bar{\alpha}_t=\frac{1}{1+e^{-\lambda_t}}.
$$

$\lambda_t>0$: signal dominates.<br>
$\lambda_t=0$: equal signal and noise scales.<br>
$\lambda_t<0$: noise dominates.

</div>
</div>
<div v-click="1">

<NoiseScheduleDemo />

Linear $\beta_t$ or cosine-squared $\bar{\alpha}_t$.

</div>
</div>

<div class="takeaway" v-click="2">

**Higher resolution:** averaging suppresses independent noise while preserving coarse structure. Lower log-SNR helps corrupt this structure too.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.00630">Kingma D. et al. Variational Diffusion Models, 2021</a><br><a href="https://arxiv.org/abs/2102.09672">Nichol A., Dhariwal P. Improved Denoising Diffusion Probabilistic Models, 2021</a><br><a href="https://arxiv.org/abs/2301.11093">Hoogeboom E. et al. Simple diffusion: End-to-end diffusion for high resolution images, 2023</a></div>

<!-- Original plot: T=1000; linear beta from 0.0001 to 0.02; cosine alpha-bar with s=0.008 and beta capped at 0.999 (Nichol & Dhariwal, Sec. 3.2). The vertical range is cropped to [-12, 10]; the clean t=0 endpoint has infinite log-SNR. Here alpha_t retains the course definition 1-beta_t, unlike the signal amplitude called alpha_t in VDM. For pixel-space high-resolution diffusion, Simple diffusion shifts log-SNR by 2 log(d_ref/d). -->

---
clicks: 0
id: outline-3
section: "Gaussian Diffusion Model as VAE"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Forward Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>02</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item current"><span>03</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item"><span>04</span><div>Diffusion ELBO Derivation</div></div>

</div>

---
clicks: 2
id: gaussian-diffusion-model-as-vae
class: theorems
---

# Diffusion as a VAE: Latent Variables and Encoder

$$
\underbrace{\bx=\bx_0}_{\text{observed data}},
\qquad
\underbrace{\bz=(\bx_1,\ldots,\bx_T)}_{\text{entire latent trajectory}}.
$$

<div v-click="1">

<DiffusionChain mode="forward" :stage="$clicks" />

Each $\bx_t$ has the same dimension as $\bx_0$; $\bz$ contains **all $T$ noisy states**.

</div>
<div class="block" v-click="2">

## Forward Diffusion = Fixed Encoder

Given a clean image, sample its noisy trajectory:

$$
q(\bz|\bx)=q(\bx_1,\ldots,\bx_T|\bx_0)=\prod_{t=1}^Tq(\bx_t|\bx_{t-1}).
$$

<div class="takeaway">

**No trainable parameters:** the noise schedule fixes the variational posterior $q(\bz|\bx)$.

</div>
</div>

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a></div>

---
clicks: 4
id: gaussian-diffusion-model-as-vae-2
class: theorems
---

# Diffusion as a VAE: Prior and Decoder

$$
\pt(\bx,\bz)=\pt(\bx_0,\ldots,\bx_T)=
\underbrace{{\color{teal}\pt(\bx_0|\bx_1)}}_{\text{decoder }\pt(\bx|\bz)}
\underbrace{{\color{#8854c0}p(\bx_T)\prod_{t=2}^T\pt(\bx_{t-1}|\bx_t)}}_{\text{prior }\pt(\bz)}.
$$

<DiffusionChain v-click="1" mode="reverse" :stage="$clicks" />

<div v-click="1">

**1. Start from noise:** $p(\bx_T)=\cN(0,\bI)$.

</div>
<div v-click="2">

**2. Sample the latent trajectory:** $\bx_T\to\cdots\to\bx_1$, completing the **prior** $\pt(\bz)$.

</div>
<div v-click="3">

**3. Generate the observation:** $\bx_1\to\bx_0$ is the **decoder**.<br>
By the Markov property, $\pt(\bx|\bz)=\pt(\bx_0|\bx_1)$.

</div>
<div class="takeaway" v-click="4">

**Fixed encoder, learned Markov-chain prior, one-step decoder.**

</div>

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a></div>

---
clicks: 0
id: outline-4
section: "Diffusion ELBO Derivation"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Forward Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>02</span><div>Reverse Gaussian Diffusion Process</div></div>
<div class="outline-item"><span>03</span><div>Gaussian Diffusion Model as VAE</div></div>
<div class="outline-item current"><span>04</span><div>Diffusion ELBO Derivation</div></div>

</div>

---
clicks: 3
id: elbo-for-gaussian-diffusion-model
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
clicks: 4
id: elbo-for-gaussian-diffusion-model-2
class: derivation
---

# ELBO for Gaussian Diffusion Model

<div class="columns" style="grid-template-columns:3fr 2fr">
<div>

## Bayes' Rule ($t\geq 2$)

$$
{\color{teal}q(\bx_t|\bx_{t-1},\bx_0)}=\frac{q(\bx_{t-1}|\bx_t,\bx_0)q(\bx_t|\bx_0)}{q(\bx_{t-1}|\bx_0)}
$$

</div>
<div>

## Markov Property

$$
q(\bx_t|\bx_{t-1},\bx_0)=q(\bx_t|\bx_{t-1})
$$

</div>
</div>

<div class="columns" style="grid-template-columns:3fr 2fr;gap:4px 36px;align-items:center">
<div v-click="1">

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_{q(\bx_{1:T}|\bx_0)}\log\frac{p(\bx_T)\prod_{t=1}^T\pt(\bx_{t-1}|\bx_t)}{\prod_{t=1}^Tq(\bx_t|\bx_{t-1},{\color{olive}\bx_0})}
$$

</div>
<div v-click="1">

Conditioning on $\bx_0$ leaves the forward transitions unchanged.

</div>
<div v-click="2">

$$
\phantom{\cL_{\bphi,\btheta}(\bx)}=\bbE_{q(\bx_{1:T}|\bx_0)}\log\frac{p(\bx_T)\pt(\bx_0|\bx_1)\prod_{t=2}^T\pt(\bx_{t-1}|\bx_t)}{q(\bx_1|\bx_0)\prod_{t=2}^T{\color{teal}q(\bx_t|\bx_{t-1},\bx_0)}}
$$

</div>
<div v-click="2">

Separate the decoder step $t=1$.

</div>
<div v-click="3">

$$
\phantom{\cL_{\bphi,\btheta}(\bx)}=\bbE_{q(\bx_{1:T}|\bx_0)}\log\frac{p(\bx_T)\pt(\bx_0|\bx_1)\prod_{t=2}^T\pt(\bx_{t-1}|\bx_t)}{{\color{#8854c0}q(\bx_1|\bx_0)}\prod_{t=2}^T\frac{q(\bx_{t-1}|\bx_t,\bx_0){\color{#8854c0}q(\bx_t|\bx_0)}}{{\color{#8854c0}q(\bx_{t-1}|\bx_0)}}}
$$

</div>
<div v-click="3">

Apply Bayes' rule for each $t\geq 2$.

</div>
<div v-click="4">

$$
\phantom{\cL_{\bphi,\btheta}(\bx)}=\bbE_{q(\bx_{1:T}|\bx_0)}\log\frac{{\color{#8854c0}p(\bx_T)}{\color{olive}\pt(\bx_0|\bx_1)}\prod_{t=2}^T\pt(\bx_{t-1}|\bx_t)}{{\color{#8854c0}q(\bx_T|\bx_0)}\prod_{t=2}^Tq(\bx_{t-1}|\bx_t,\bx_0)}
$$

</div>
<div v-click="4">

Intermediate marginals telescope; the $q(\bx_1|\bx_0)$ factor cancels too.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 2
id: elbo-for-gaussian-diffusion-model-3
class: derivation
---

# ELBO for Gaussian Diffusion Model

<div class="block">

## Derivation (continued)

<div class="columns" style="grid-template-columns:3fr 2fr;gap:4px 36px;align-items:center">
<div>

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)=\bbE_{{\color{teal}q(\bx_{1:T}|\bx_0)}}\biggl[&\log{\color{olive}\pt(\bx_0|\bx_1)}+\log{\color{#8854c0}\frac{p(\bx_T)}{q(\bx_T|\bx_0)}}\\
&+\sum_{t=2}^T\log\left(\frac{\pt(\bx_{t-1}|\bx_t)}{q(\bx_{t-1}|\bx_t,\bx_0)}\right)\biggr]
\end{aligned}
$$

</div>
<div>

Expand the logarithm: products become sums.

</div>
<div v-click="1">

$$
\begin{aligned}
\phantom{\cL_{\bphi,\btheta}(\bx)}&=\bbE_{{\color{teal}q(\bx_1|\bx_0)}}\log\pt(\bx_0|\bx_1)+\bbE_{{\color{teal}q(\bx_T|\bx_0)}}\log\frac{p(\bx_T)}{q(\bx_T|\bx_0)}\\
&\quad+\sum_{t=2}^T\bbE_{{\color{teal}q(\bx_{t-1},\bx_t|\bx_0)}}\log\left(\frac{\pt(\bx_{t-1}|\bx_t)}{q(\bx_{t-1}|\bx_t,\bx_0)}\right)
\end{aligned}
$$

</div>
<div v-click="1">

Integrate out unused variables. Each term depends on one state or one adjacent pair.

</div>
<div v-click="2">

$$
\begin{aligned}
\phantom{\cL_{\bphi,\btheta}(\bx)}&=\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)-\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)\\
&\quad-\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}
\end{aligned}
$$

</div>
<div v-click="2">

Use the definition of KL. For each $\bx_t$, average over $q(\bx_{t-1}|\bx_t,\bx_0)$; then average over $q(\bx_t|\bx_0)$.

</div>
</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 3
id: elbo-for-gaussian-diffusion-model-4
class: theorems
---

# ELBO for Gaussian Diffusion Model

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)&={\color{olive}\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}-{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}\\
&\quad-{\color{teal}\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}}
\end{aligned}
$$

<DiffusionChain mode="elbo" :stage="3" style="height:140px" />

<div v-click="1">

**<span style="color:olive">First term — reconstruction:</span>** recover the clean image $\bx_0$ from the slightly noisy $\bx_1$.

</div>
<div v-click="2">

For a continuous decoder $\pt(\bx_0|\bx_1)=\cN\bigl(\bmu_{\btheta,1}(\bx_1),\sigma_1^2\bI\bigr)$ with fixed $\sigma_1^2>0$:

$$
-\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)=\frac{1}{2\sigma_1^2}\bbE_{q(\bx_1|\bx_0)}\bigl\|\bx_0-\bmu_{\btheta,1}(\bx_1)\bigr\|^2+\text{const}.
$$

</div>
<div v-click="3">

**<span style="color:#8854c0">Second term — prior matching:</span>** constant in $\btheta$, since $q$ and $p(\bx_T)=\cN(0,\bI)$ are fixed.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

<!--
This slide explains the reconstruction and prior-matching terms. The next slide
keeps the same ELBO and chain in place and develops intermediate denoising.

The reconstruction identity assumes continuous observations and a Gaussian decoder
with fixed positive covariance sigma_1^2 I. The constant is independent of theta.
It trains the final denoising step x_1 -> x_0, whose target is the observed clean
image; the intermediate KL terms instead match conditional latent distributions.
Do not set sigma_1^2 = tilde_beta_1: the latter is zero.
Original DDPM uses a discretized Gaussian decoder for integer-valued image pixels
(Ho et al., Section 3.3, Eq. 13); its exact negative log likelihood is not this MSE.
The slide uses the continuous Gaussian model to explain the reconstruction term.
-->

---
clicks: 2
id: elbo-intermediate-denoising-term
class: theorems
---

# ELBO for Gaussian Diffusion Model

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)&={\color{olive}\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}-{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}\\
&\quad-{\color{teal}\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}}
\end{aligned}
$$

<DiffusionChain mode="elbo" :stage="3" style="height:140px" />

<div v-click="1">

**<span style="color:teal">Third term — intermediate denoising:</span>** match each learned reverse step to its conditioned target.

During training, knowing $\bx_0$ makes this target distribution tractable.

</div>
<div v-click="2">

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\KL\Bigl(
\underbrace{q(\bx_{t-1}|\bx_t,\bx_0)}_{\text{known target}}
\Big\|
\underbrace{\pt(\bx_{t-1}|\bx_t)}_{\text{learned reverse step}}
\Bigr),\qquad t\geq2.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

<!--
The preceding slide explains the first two ELBO terms. This slide isolates the
third term without moving the shared formula or chain; the following slide
illustrates its training pairs and then the Gaussian KL reduces to a mean loss.
-->

---
clicks: 3
id: elbo-for-gaussian-diffusion-model-5
class: theorems
---

# Intermediate Denoising: KL Between Gaussians

<img src="/figs/diffusion_objective.png" alt="Forward diffusion and paired conditioned-target and learned reverse transitions" style="width:100%;height:300px;object-fit:contain" />

<div class="columns">
<div v-click="1">

## Known Gaussian Target

$$
q(\bx_{t-1}|\bx_t,\bx_0)=\cN\bigl(\tilde{\bmu}_t(\bx_t,\bx_0),\tilde{\beta}_t\bI\bigr)
$$

</div>
<div v-click="2">

## Learned Gaussian Reverse Step

$$
\pt(\bx_{t-1}|\bx_t)=\cN\bigl(\bmu_{\btheta,t}(\bx_t),\bsigma_{\btheta,t}^2(\bx_t)\bigr)
$$

</div>
</div>
<div v-click="3">

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\KL\Bigl(
\cN\bigl(\tilde{\bmu}_t(\bx_t,\bx_0),\tilde{\beta}_t\bI\bigr)
\Big\|
\cN\bigl(\bmu_{\btheta,t}(\bx_t),\bsigma_{\btheta,t}^2(\bx_t)\bigr)
\Bigr),\quad t\geq2.
$$

<div class="takeaway">

For each $\bx_t$, the **KL between these Gaussians has a closed form**.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2208.11970">Luo C. Understanding Diffusion Models: A Unified Perspective, 2022</a></div>

<!--
The previous slide identifies the two distributions in each intermediate KL.
Here the retained chain illustration connects those paired reverse transitions
to their Gaussian forms. Substitute them into the loss to expose a Gaussian KL;
the next slide fixes the reverse covariance and reduces it to a mean error.
The KL for a given x_t is analytic; the outer expectation over x_t remains.
-->

---
clicks: 4
id: elbo-for-gaussian-diffusion-model-6
class: theorems
---

# From Gaussian KL to Mean Regression

<div class="columns">
<div>

## Known Gaussian Target

$$
q(\bx_{t-1}|\bx_t,\bx_0)=\cN\bigl(\tilde{\bmu}_t(\bx_t,\bx_0),{\color{#8854c0}\tilde{\beta}_t\bI}\bigr)
$$

</div>
<div>

## Learned Gaussian Reverse Step

$$
\pt(\bx_{t-1}|\bx_t)=\cN\bigl(\bmu_{\btheta,t}(\bx_t),{\color{#8854c0}\bsigma_{\btheta,t}^2(\bx_t)}\bigr)
$$

</div>
</div>

<div class="block" v-click="1">

## Fix the Covariance, Learn the Mean

Using the known target covariance simplifies learning: the network only needs to predict the mean.

<div v-click="2">

$$
\bsigma_{\btheta,t}^2(\bx_t)={\color{#8854c0}\tilde{\beta}_t\bI},\qquad t\geq2.
$$

The noise schedule fixes $\tilde{\beta}_t$; the network predicts the mean.

</div>
</div>

<div class="block" v-click="3">

$$ {1|all} {at:4}
\begin{aligned}
\cL_t&=\bbE_{q(\bx_t|\bx_0)}\KL\bigl(\cN\bigl(\tilde{\bmu}_t(\bx_t,\bx_0),{\color{#8854c0}\tilde{\beta}_t\bI}\bigr)\|\cN\bigl(\bmu_{\btheta,t}(\bx_t),{\color{#8854c0}\tilde{\beta}_t\bI}\bigr)\bigr)\\
&=\bbE_{q(\bx_t|\bx_0)}\left[\frac{1}{2\tilde{\beta}_t}\Bigl\|\underbrace{\tilde{\bmu}_t(\bx_t,\bx_0)}_{\text{known target}}-\underbrace{\bmu_{\btheta,t}(\bx_t)}_{\text{network prediction}}\Bigr\|^2\right].
\end{aligned}
$$

</div>
<div class="takeaway" v-click="4">

**Same covariance → weighted regression onto the target mean.**

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

<!--
Previous slide: both terms in the intermediate KL are Gaussian. Start with the
general reverse model, which could learn both mean and covariance. Motivate a
simpler parameterization that learns only the mean: choose the target covariance
for t >= 2 and reduce the Gaussian KL to a weighted squared mean error. The labels
identify the known regression target and the network prediction. The next slide
uses this loss in Training. The target covariance is fixed by the noise schedule;
only the model mean remains trainable here. This is a modeling choice, not a claim
that the target covariance is optimal for arbitrary data distributions.

Optional background for questions (Ho et al., Section 3.2): the exact marginal
reverse covariance is tilde_beta_t I for point-mass data x_0 = x*, and beta_t I
for standard Gaussian data x_0 ~ N(0, I). These reference cases are omitted from
the visible slide to keep the Gaussian-KL-to-regression argument focused. They
do not imply pointwise bounds on every input-dependent optimal covariance.
-->

---
clicks: 1
id: elbo-for-gaussian-diffusion-model-7
class: theorems
---

# Training and Sampling

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
<div class="block" style="margin-top: 8px" v-click="1">

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

<!--
The preceding slide reduces each intermediate KL to weighted mean regression.
Here the original negative ELBO retains its reconstruction, prior, and denoising
terms. The prior KL depends on the example and fixed schedule, but not on
theta: omit it only for optimization. The sampled loss has conditional
expectation -ELBO(x_0) minus the prior KL; uniform sampling of t in {2,...,T}
explains the factor T-1.
Sharing epsilon between x_1 and x_t preserves both required marginals; no joint
forward trajectory is needed for this additive objective. Average over examples
in the minibatch before updating theta. No Gaussian decoder constant is silently
removed: reconstruction stays as the complete negative log likelihood.
Sampling uses fixed tilde-beta covariance for t >= 2 and returns the final
decoder mean. This last step is a generation convention, not a sample from a
positive-variance decoder. The next lecture reparameterizes the learned mean.
-->

---
clicks: 0
id: summary
class: summary
---

# Summary

- Forward diffusion has exact Gaussian conditionals; a suitable schedule removes the signal and controls SNR.
- For small steps, Gaussian reverse transitions approximate the path from noise to data.
- Conditioning on the clean image gives a tractable Gaussian reverse distribution.
- Gaussian diffusion is a VAE with a hierarchy of latent variables and a fixed encoder.
- Its ELBO decomposes into reconstruction, prior matching, and denoising terms; Gaussian denoising terms reduce to squared error.
