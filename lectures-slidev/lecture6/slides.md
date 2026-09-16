---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 6"
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

<div class="cover-lecture">Lecture 6</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem

The minimax game

$$
\min_G\max_D\Bigl[\underbrace{\bbE_{\pd(\bx)}\log D(\bx)+\bbE_{p(\bz)}\log(1-D(\bG(\bz)))}_{V(G,D)}\Bigr]
$$

achieves its global optimum precisely when $\pd(\bx)=\pt(\bx)$, and $D^*(\bx)=0.5$.

</div>

$$
V(G,D^*)=2\,\JSD(\pd(\bx)\,\|\,\pt(\bx))-2\log2,\qquad V(G^*,D^*)=-2\log2.
$$

<div class="block">

## Expectations

If the generator can express **any** function and the discriminator is **optimal** at every step, the generator **will converge** to the target distribution.

</div>


<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a></div>

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Reality

- Generator updates are performed in parameter space, and the discriminator is often imperfectly optimized.
- Generator and discriminator losses typically oscillate during GAN training.

</div>
<div class="block">

## Objective

$$
\min_{\btheta}\max_{\bphi}\left[\bbE_{\pd(\bx)}\log D_{\bphi}(\bx)+\bbE_{p(\bz)}\log(1-D_{\bphi}(\bG_{\btheta}(\bz)))\right]
$$

</div>

<img src="/figs/gan_1.png" alt="GAN mode collapse during training" style="height: 160px; width: 100%; object-fit: contain;" />

Mode collapse refers to the phenomenon where the generator in a GAN produces only one or a few different modes of the distribution.


<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a><br><a href="https://arxiv.org/abs/1611.02163">Metz L. et al. Unrolled Generative Adversarial Networks, 2016</a></div>

---
clicks: 0
sourceFrame: "4"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Standard GAN Objective

$$
\min_{\btheta}\max_{\bphi}\left[\bbE_{\pd(\bx)}\log D_{\bphi}(\bx)+\bbE_{p(\bz)}\log(1-D_{\bphi}(\bG_{\btheta}(\bz)))\right]
$$

</div>
<div class="block">

## Theoretical Results

- Both the data distribution $\pd(\bx)$ and the generative distribution $\pt(\bx)$ are supported on low-dimensional manifolds.
- If $\pd(\bx)$ and $\pt(\bx)$ are disjoint, a smooth optimal discriminator can exist!

For such low-dimensional, disjoint manifolds:

$$
\KL(\pd\,\|\,\pt)=\KL(\pt\,\|\,\pd)=\infty,\qquad\JSD(\pd\,\|\,\pt)=\log2
$$

</div>


<div class="source"><a href="https://arxiv.org/abs/1904.08994">Weng L. From GAN to WGAN, 2019</a><br><a href="https://arxiv.org/abs/1701.04862">Arjovsky M., Bottou L. Towards Principled Methods for Training Generative Adversarial Networks, 2017</a></div>

---
clicks: 0
sourceFrame: "5"
class: theorems
---

# Recap of Previous Lecture

<img src="/figs/discrete_wasserstein.png" alt="Transport plan between two discrete distributions" style="height: 130px; width: 100%; object-fit: contain;" />

<div class="block">

## Wasserstein Distance

$$
\begin{aligned}
W(\pi\|p)&=\inf_{\gamma\in\Gamma(\pi,p)}\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|\\
&=\inf_{\gamma\in\Gamma(\pi,p)}\int\|\bx_1-\bx_2\|\gamma(\bx_1,\bx_2)d\bx_1d\bx_2
\end{aligned}
$$

- $\gamma(\bx_1,\bx_2)$ is the transport plan: the amount of “dirt” assigned from $\bx_1$ to $\bx_2$.
- $\Gamma(\pi,p)$ denotes the set of all joint distributions $\gamma(\bx_1,\bx_2)$ with marginals $\pi$ and $p$ ($\int\gamma(\bx_1,\bx_2)d\bx_1=p(\bx_2)$, $\int\gamma(\bx_1,\bx_2)d\bx_2=\pi(\bx_1)$).
- $\gamma(\bx_1,\bx_2)$ is the mass, $\|\bx_1-\bx_2\|$ is the distance.

</div>


<div class="source"><a href="https://udlbook.github.io/udlbook/">Simon J.D. Prince. Understanding Deep Learning, 2023</a><br><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 1
sourceFrame: "6"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem 1

Let $\bG_{\btheta}(\bz)$ be (almost) any feedforward neural network, and $p(\bz)$ a prior over $\bz$ such that $\bbE_{p(\bz)}\|\bz\|<\infty$. Then $W(\pd\|\pt)$ is continuous everywhere and differentiable almost everywhere.

</div>
<div class="block" v-click="1">

## Theorem 2

Let $\pi$ be a distribution on a compact space $\cX$ and let $\{p_t\}_{t=1}^{\infty}$ be a sequence of distributions on $\cX$.

$$
\begin{aligned}
\KL(\pi\|p_t)&\rightarrow0\quad(\text{or }\KL(p_t\,\|\,\pi)\rightarrow0) && (1)\\
\JSD(\pi\|p_t)&\rightarrow0 && (2)\\
W(\pi\|p_t)&\rightarrow0 && (3)
\end{aligned}
$$

As $t\rightarrow\infty$, (1) $\Rightarrow$ (2), and (2) $\Rightarrow$ (3). That is, convergence in Wasserstein distance is a weaker condition than convergence in JSD, which in turn is weaker than convergence in KL.

</div>


<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 0
sourceFrame: "7"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem (Kantorovich-Rubinstein Duality)

$$
W(\pd\|\pt)=\frac1K\max_{\|f\|_L\leq K}\left[\bbE_{\pd(\bx)}f(\bx)-\bbE_{\pt(\bx)}f(\bx)\right],
$$

where $f:\bbR^m\rightarrow\bbR$ is $K$-Lipschitz continuous ($\|f\|_L\leq K$).

</div>
<div class="block">

## WGAN Objective

$$
\min_{\btheta}{\color{#8854c0}W(\pd\|\pt)}\approx\min_{\btheta}{\color{#8854c0}\max_{\bphi\in\bPhi}\left[\bbE_{\pd(\bx)}f_{\bphi}(\bx)-\bbE_{p(\bz)}f_{\bphi}(\bG_{\btheta}(\bz))\right]}.
$$

</div>

- The discriminator $D$ is replaced by function $f$: in WGAN, it is known as the **critic**, which is *not* a classifier.
- If the weights $\bphi$ are restricted to a compact set $\bPhi=[-c,c]^d$, then $f_{\bphi}(\bx)$ is $K$-Lipschitz continuous.

$$
\begin{aligned}
K\cdot W(\pd\|\pt)&=\max_{\|f\|_L\leq K}\left[\bbE_{\pd(\bx)}f(\bx)-\bbE_{\pt(\bx)}f(\bx)\right]\\
&\geq\max_{\bphi\in\bPhi}\left[\bbE_{\pd(\bx)}f_{\bphi}(\bx)-\bbE_{\pt(\bx)}f_{\bphi}(\bx)\right]
\end{aligned}
$$


<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 0
sourceFrame: "8"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Frechet Inception Distance (FID)

For normal distributions $\pd(\bx_1)=\cN(\bmu_{\text{data}},\bSigma_{\text{data}})$, $p(\bx_2)=\cN(\bmu_{\btheta},\bSigma_{\btheta})$:

$$
\begin{aligned}
\FID(\pd,\pt)&=W_2^2(\pd\|\pt)=\inf_{\gamma\in\Gamma(\pd,\pt)}\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|^2\\
&=\|\bmu_{\text{data}}-\bmu_{\btheta}\|^2\\
&\quad+\tr\left[\bSigma_{\text{data}}+\bSigma_{\btheta}-2\left(\bSigma_{\text{data}}^{1/2}\bSigma_{\btheta}\bSigma_{\text{data}}^{1/2}\right)^{1/2}\right]
\end{aligned}
$$

</div>
<div class="block">

## Drawbacks

- Depends on the pretrained classification network.
- Uses the normality assumption.
- May not correlate with human evaluation.

</div>


<div class="source"><a href="https://arxiv.org/abs/1706.08500">Heusel M. et al. GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium, 2017</a><br><a href="https://arxiv.org/abs/2401.09603">Jayasumana S. et al. Rethinking FID: Towards a Better Evaluation Metric for Image Generation, 2024</a></div>

---
clicks: 0
sourceFrame: "9"
class: theorems
---

# Recap of Previous Lecture

- $\cS_{\text{data}}=\{\bx_i\}_{i=1}^n\sim\pd(\bx)$ - real samples;
- $\cS_{\btheta}=\{\bx_i\}_{i=1}^n\sim\pt(\bx)$ - generated samples.

Define a binary function:

$$
\bbI(\bx,\cS)=\begin{cases}1,&\text{if }\exists\,\bx'\in\cS:\|\bx-\bx'\|_2\leq\|\bx'-\NN_k(\bx',\cS)\|_2;\\0,&\text{otherwise.}\end{cases}
$$

$$
\text{Pr}(\cS_{\text{data}},\cS_{\btheta})=\frac1n\sum_{\bx\in\cS_{\btheta}}\bbI(\bx,\cS_{\text{data}});\quad\text{Rec}(\cS_{\text{data}},\cS_{\btheta})=\frac1n\sum_{\bx\in\cS_{\text{data}}}\bbI(\bx,\cS_{\btheta}).
$$

<img src="/figs/pr_k_nearest.png" alt="Precision and recall from nearest-neighbor manifolds" style="height: 165px; width: 100%; object-fit: contain;" />

Embed the samples using a pretrained network (as in FID).


<div class="source"><a href="https://arxiv.org/abs/1904.06991">Kynkäänniemi T. et al. Improved precision and recall metric for assessing generative models, 2019</a></div>

---
clicks: 0
sourceFrame: "10"
class: theorems
---

# Recap of Previous Lecture

<div class="columns">
<div class="block">

## Unconditional Model

<img src="/figs/uncond_model.png" alt="Unconditional image model" style="height: 150px; width: 100%; object-fit: contain;" />

</div>
<div class="block">

## Conditional Model

<img src="/figs/cond_model.png" alt="Image model conditioned on a prompt" style="height: 150px; width: 100%; object-fit: contain;" />

</div>
</div>

We need a way to measure not only the quality of the generated image, but also how well it's aligned with the prompt.

<img src="/figs/clip.png" alt="CLIP measures image and text alignment" style="height: 230px; width: 100%; object-fit: contain;" />


<div class="source"><a href="https://arxiv.org/abs/2103.00020">Radford A. et al. Learning transferable visual models from natural language supervision, 2021</a></div>

---
clicks: 0
sourceFrame: "11"
class: theorems
---

# Recap of Previous Lecture

- No automated metric is perfect.
- The best way to evaluate generative models is by human assessment.
- It's important to assess various properties.

<img src="/figs/yaart_2.5.png" alt="YandexART 2.5 human assessment across multiple properties" style="height: 330px; width: 100%; object-fit: contain;" />


<div class="source"><a href="https://ya.ru/ai/art">YandexART 2.5, 2025</a></div>

---
clicks: 0
sourceFrame: "12"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Langevin Dynamics</div></div>
<div class="outline-item"><span>02</span><div>Score Matching<div class="outline-sub">Denoising Score Matching<br>Noise-Conditioned Score Network (NCSN)</div></div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Langevin Dynamics"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Langevin Dynamics</div></div>
<div class="outline-item"><span>02</span><div>Score Matching<div class="outline-sub">Denoising Score Matching<br>Noise-Conditioned Score Network (NCSN)</div></div></div>

</div>

---
clicks: 2
sourceFrame: "13"
class: theorems
---

# Energy-Based Models

<div class="block">

## Unnormalized Density

$$
\pt(\bx)=\frac{\hat p_{\btheta}(\bx)}{Z_{\btheta}},\qquad\text{where }Z_{\btheta}=\int\hat p_{\btheta}(\bx)d\bx
$$

- $\hat p_{\btheta}(\bx)$ can be any non-negative function.
- If we reparameterize as $\hat p_{\btheta}(\bx)=\exp(-f_{\btheta}(\bx))$, we eliminate the non-negativity constraint.

</div>
<div class="block" v-click="1">

## Log-Density Gradient

The gradient of the normalized log-density equals that of the unnormalized log-density:

$$
\nabla_{\bx}\log\pt(\bx)=\nabla_{\bx}\log\hat p_{\btheta}(\bx)-\nabla_{\bx}\log Z_{\btheta}=\nabla_{\bx}\log\hat p_{\btheta}(\bx)
$$

</div>
<div v-click="2">

- Suppose we already have this density (normalized or not) $\pt(\bx)$.
- How can we sample from the model?

</div>

---
clicks: 1
sourceFrame: "14"
class: theorems
---

# Langevin Dynamics

<div class="block">

## Theorem (Informal)

Let $\bx_0$ be a random vector. Under mild regularity conditions, samples from the following dynamics will eventually follow $\pt(\bx)$ (for sufficiently small $\eta$ and large $l$):

$$
\bx_{l+1}=\bx_l+\frac\eta2\cdot\nabla_{\bx_l}\log\pt(\bx_l)+\sqrt\eta\cdot\bepsilon_l,\qquad\bepsilon_l\sim\cN(0,\bI).
$$

</div>
<div class="columns balanced" v-click="1" style="grid-template-columns: 1.2fr 1fr;">
<div>

- What if $\bepsilon_l=\bzero$?
- The density $\pt(\bx)$ is the **stationary** distribution of the Markov chain.
- The gradient is taken with respect to $\bx$, not $\btheta$.
- $\nabla_{\bx}\log\pt(\bx)$ defines a vector field.

</div>
<img src="/figs/langevin_dynamic.png" alt="Langevin trajectories move along the score vector field" style="height: 240px; width: 100%; object-fit: contain;" />
</div>


<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

---
clicks: 0
sourceFrame: "auto: Score Matching"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Langevin Dynamics</div></div>
<div class="outline-item current"><span>02</span><div>Score Matching<div class="outline-sub">Denoising Score Matching<br>Noise-Conditioned Score Network (NCSN)</div></div></div>

</div>

---
clicks: 0
sourceFrame: "15"
class: theorems
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" score-matching />

---
clicks: 1
sourceFrame: "16"
class: theorems
---

# Score Function

$$
\bs_{\btheta}(\bx)=\nabla_{\bx}\log\pt(\bx)
$$

<img src="/figs/score_function.png" alt="Density and corresponding score vector field" style="height: 245px; width: 100%; object-fit: contain;" />

<div class="block" v-click="1">

## Langevin Dynamics

$$
\begin{aligned}
\bx_{l+1}&=\bx_l+\frac\eta2\cdot\nabla_{\bx_l}\log\pd(\bx_l)+\sqrt\eta\cdot\bepsilon_l\\
&=\bx_l+\frac\eta2\cdot{\color{#8854c0}\nabla_{\bx_l}\log\pt(\bx_l)}+\sqrt\eta\cdot\bepsilon_l\\
&=\bx_l+\frac\eta2\cdot{\color{#8854c0}\bs_{\btheta}(\bx_l)}+\sqrt\eta\cdot\bepsilon_l.
\end{aligned}
$$

</div>


<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

---
clicks: 2
sourceFrame: "17"
class: theorems
---

# Score Matching

<img src="/figs/smld.jpg" alt="Score estimation and Langevin sampling" style="height: 270px; width: 100%; object-fit: contain;" />

<div class="block" v-click="1">

## Fisher Divergence

$$
\begin{aligned}
D_F(\pd,\pt)&=\frac12\bbE_{\pd}\big\|\nabla_{\bx}\log\pt(\bx)-\nabla_\bx\log\pd(\bx)\big\|_2^2\\
&=\frac12\bbE_{\pd}\big\|\bs_{\btheta}(\bx)-\nabla_\bx\log\pd(\bx)\big\|_2^2\rightarrow\min_{\btheta}
\end{aligned}
$$

</div>
<div v-click="2">

**Problem:** We don't know $\nabla_\bx\log\pd(\bx)$.

</div>


<div class="source"><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a></div>

---
clicks: 1
sourceFrame: "18"
class: theorems
---

# Why Is the Score Function Better than the Density?

<div class="block">

## Freedom from Normalization Constants

Many distributions are defined only up to an unnormalized density $\hat p(\bx)$:

$$
\nabla_{\bx}\log p(\bx)=\nabla_{\bx}\log\hat p(\bx)-\underbrace{\nabla_{\bx}\log Z}_{=0}=\nabla_{\bx}\log\hat p(\bx)
$$

The score function bypasses the intractable constant $Z$ entirely!

</div>
<div class="block" v-click="1">

## A Complete Representation

The score function fully characterizes the underlying distribution (up to a constant):

$$
\log p(\bx)=\log p(\bx_0)+\int_0^1\bs(\bx_0+t(\bx-\bx_0))^\top(\bx-\bx_0)dt
$$

Modeling the score is as expressive as modeling $p(\bx)$ itself, while often more tractable for generative modeling.

</div>


<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

---
clicks: 0
sourceFrame: "auto: Denoising Score Matching"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Langevin Dynamics</div></div>
<div class="outline-item current"><span>02</span><div>Score Matching<div class="outline-sub">Denoising Score Matching<br>Noise-Conditioned Score Network (NCSN)</div></div></div>

</div>

---
clicks: 3
sourceFrame: "19"
class: theorems
---

# Denoising Score Matching

Let us perturb the original data $\bx\sim\pd(\bx)$ with Gaussian noise:

$$
\bx_{\sigma}=\bx+\sigma\cdot\bepsilon,\quad\bepsilon\sim\cN(0,\bI),\quad q(\bx_{\sigma}|\bx)=\cN(\bx,\sigma^2\cdot\bI)
$$

<div v-click="1">

$$
q(\bx_{\sigma})=\int q(\bx_{\sigma}|\bx)\pd(\bx)d\bx.
$$

</div>
<div class="block" v-click="2">

## Assumption

The solution to

$$
\frac12\bbE_{q(\bx_{\sigma})}\big\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\big\|_2^2\rightarrow\min_{\btheta}
$$

satisfies $\bs_{\btheta,\sigma}(\bx_{\sigma})\approx\bs_{\btheta,0}(\bx_0)=\bs_{\btheta}(\bx)$ if $\sigma$ is sufficiently small.

</div>
<div v-click="3">

- The score function of the noised data nearly matches the score function of the original data.
- The score function $\bs_{\btheta,\sigma}(\bx_{\sigma})$ is parameterized by $\sigma$.
- **Note:** We don't know $q(\bx_{\sigma})$, just as we don't know $\pd(\bx)$.

</div>


<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

---
clicks: 3
sourceFrame: "20"
class: theorems
---

# Denoising Score Matching

<div class="block">

## Theorem

Under mild regularity conditions, the following holds:

$$
\begin{aligned}
&\bbE_{q(\bx_{\sigma})}\big\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\big\|_2^2\\
&=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\big\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\big\|_2^2+\text{const}(\btheta)
\end{aligned}
$$

</div>
<div class="block" v-click="1">

## Gradient of the Noise Kernel

$$
\bx_{\sigma}=\bx+\sigma\cdot\bepsilon,\qquad q(\bx_{\sigma}|\bx)=\cN(\bx,\sigma^2\cdot\bI)
$$

<div v-click="2">

$$
\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)=-\frac{\bx_{\sigma}-\bx}{\sigma^2}=-\frac\bepsilon\sigma
$$

</div>
</div>
<div v-click="3">

- The right-hand side doesn't require computing $\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})$ or even $\nabla_{\bx_{\sigma}}\log\pd(\bx_{\sigma})$.
- $\bs_{\btheta,\sigma}(\bx_{\sigma})$ is trained to **denoise** the noised samples $\bx_{\sigma}$.

</div>


<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

---
clicks: 3
sourceFrame: "21"
class: theorems
---

# Denoising Score Matching

Initial objective:

$$
\bbE_{\pd(\bx)}\left\|\bs_{\btheta}(\bx)-\nabla_\bx\log\pd(\bx)\right\|_2^2\rightarrow\min_{\btheta}
$$

<div v-click="1">

Noised objective:

$$
\bbE_{q(\bx_{\sigma})}\left\|\bs_{\btheta,\sigma}(\bx_\sigma)-\nabla_\bx\log q(\bx_{\sigma})\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div v-click="2">

This is equivalent to a denoising task:

$$
\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div v-click="3">

$$
\bbE_{\pd(\bx)}\bbE_{\cN(0,\bI)}\left\|\bs_{\btheta,\sigma}(\bx+\sigma\cdot\bepsilon)+\frac\bepsilon\sigma\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div class="block" v-click="3">

## Langevin Dynamics

$$
\bx_{l+1}=\bx_l+\frac\eta2\cdot\bs_{\btheta,\sigma}(\bx_l)+\sqrt\eta\cdot\bepsilon_l,\qquad\bepsilon_l\sim\cN(0,\bI).
$$

</div>


<div class="source"><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a></div>

---
clicks: 4
sourceFrame: "22"
class: theorems derivation
---

# Denoising Score Matching

<div class="block">

## Theorem

$$
\begin{aligned}
&\bbE_{q(\bx_{\sigma})}\underbrace{\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\right\|_2^2}_{h(\bx_{\sigma})}\\
&=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\right\|_2^2+\text{const}(\btheta)
\end{aligned}
$$

</div>
<div class="block" v-click="1">

## Proof

$$ {1|all} {at:2}
\begin{aligned}
\bbE_{q(\bx_{\sigma})}h(\bx_{\sigma})&=\int{\color{#8854c0}q(\bx_{\sigma})}h(\bx_{\sigma})d\bx_{\sigma}\\
&=\int\left({\color{#8854c0}\int q(\bx_{\sigma}|\bx)\pd(\bx)d\bx}\right)h(\bx_{\sigma})d\bx_{\sigma}=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}h(\bx_{\sigma})
\end{aligned}
$$

<div v-click="3">

$$ {1|all} {at:4}
\begin{aligned}
&\bbE_{q(\bx_{\sigma})}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\right\|_2^2\\
&=\bbE_{q(\bx_{\sigma})}\Bigl[\|\bs_{\btheta,\sigma}(\bx_{\sigma})\|^2+\underbrace{\|\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\|_2^2}_{\text{const}(\btheta)}\\
&\hspace{5em}-2{\color{teal}\bs_{\btheta,\sigma}^\top(\bx_{\sigma})\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})}\Bigr]
\end{aligned}
$$

</div>
</div>


<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

---
clicks: 5
sourceFrame: "23"
class: theorems derivation
---

# Denoising Score Matching

<div class="block">

## Theorem

$$
\begin{aligned}
&\bbE_{q(\bx_{\sigma})}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\right\|_2^2\\
&=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\right\|_2^2+\text{const}(\btheta)
\end{aligned}
$$

</div>
<div class="block">

## Proof (Continued)

$$ {1|1-2|1-3|1-4|1-5|all} {at:1}
\begin{aligned}
&\bbE_{q(\bx_{\sigma})}\left[{\color{teal}\bs_{\btheta,\sigma}^\top(\bx_{\sigma})\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})}\right]\\
&=\int q(\bx_{\sigma})\left[\bs_{\btheta,\sigma}^\top(\bx_{\sigma})\frac{\nabla_{\bx_{\sigma}}{\color{#8854c0}q(\bx_{\sigma})}}{q(\bx_{\sigma})}\right]d\bx_{\sigma}\\
&=\int\left[\bs_{\btheta,\sigma}^\top(\bx_{\sigma})\nabla_{\bx_{\sigma}}\left({\color{#8854c0}\int q(\bx_{\sigma}|\bx)\pd(\bx)d\bx}\right)\right]d\bx_{\sigma}\\
&=\int\int\pd(\bx)\left[\bs_{\btheta,\sigma}^\top(\bx_{\sigma}){\color{olive}\nabla_{\bx_{\sigma}}q(\bx_{\sigma}|\bx)}\right]d\bx_{\sigma}d\bx\\
&=\int\int\pd(\bx){\color{olive}q(\bx_{\sigma}|\bx)}\left[\bs_{\btheta,\sigma}^\top(\bx_{\sigma}){\color{olive}\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)}\right]d\bx_{\sigma}d\bx\\
&=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left[{\color{teal}\bs_{\btheta,\sigma}^\top(\bx_{\sigma})\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)}\right]
\end{aligned}
$$

</div>


<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

---
clicks: 3
sourceFrame: "24"
class: theorems derivation
---

# Denoising Score Matching

<div class="block">

## Theorem

$$
\begin{aligned}
&\bbE_{q(\bx_{\sigma})}\underbrace{\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\right\|_2^2}_{h(\bx_{\sigma})}\\
&=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\right\|_2^2+\text{const}(\btheta)
\end{aligned}
$$

</div>
<div class="block">

## Proof (Continued)

$$
\bbE_{q(\bx_{\sigma})}h(\bx_{\sigma})=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}h(\bx_{\sigma})
$$

<div v-click="1">

$$
\begin{aligned}
&\bbE_{q(\bx_{\sigma})}\left[\bs_{\btheta,\sigma}^\top(\bx_{\sigma})\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\right]\\
&=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left[\bs_{\btheta,\sigma}^\top(\bx_{\sigma})\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\right]
\end{aligned}
$$

</div>
<div v-click="2">

$$ {1-3|all} {at:3}
\begin{aligned}
&\bbE_{q(\bx_{\sigma})}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\right\|_2^2\\
&={\color{olive}\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}}\Bigl[\|\bs_{\btheta,\sigma}(\bx_{\sigma})\|^2\\
&\hspace{4em}-2\bs_{\btheta,\sigma}^\top(\bx_{\sigma}){\color{teal}\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)}\Bigr]+\text{const}(\btheta)\\
&={\color{olive}\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-{\color{teal}\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)}\right\|_2^2+\text{const}(\btheta)
\end{aligned}
$$

</div>
</div>


<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

---
clicks: 5
sourceFrame: "25"
class: theorems
---

# Denoising Score Matching

<div class="block">

## Denoising Score Matching Objective

$$
\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div v-click="1">

The optimal MSE predictor is the posterior mean of the regression target:

$$
\bs_{\btheta^*,\sigma}(\bx_\sigma)=\bbE_{q(\bx|\bx_\sigma)}\left[\nabla_{\bx_\sigma}\log q(\bx_\sigma|\bx)\right]
$$

</div>
<div class="block" v-click="2">

## Marginal Score via Conditional Scores

$$ {1|1-2|all} {at:3}
\begin{aligned}
\nabla_{\bx_\sigma}\log q(\bx_\sigma)&=\frac{\nabla_{\bx_\sigma}{\color{#8854c0}\int q(\bx_\sigma|\bx)\pd(\bx)d\bx}}{q(\bx_\sigma)}\\
&=\int\nabla_{\bx_\sigma}\log q(\bx_\sigma|\bx)\cdot{\color{olive}\frac{q(\bx_\sigma|\bx)\pd(\bx)}{q(\bx_\sigma)}}d\bx\\
&=\bbE_{{\color{olive}q(\bx|\bx_\sigma)}}\left[\nabla_{\bx_\sigma}\log q(\bx_\sigma|\bx)\right]
\end{aligned}
$$

</div>
<div v-click="5">

**Therefore:** $\bs_{\btheta^*,\sigma}(\bx_\sigma)=\nabla_{\bx_\sigma}\log q(\bx_\sigma)$ - the optimal model learns the true **marginal** score!

</div>


<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

---
clicks: 4
sourceFrame: "26"
class: theorems
---

# Denoising Score Matching

Original objective:

$$
\bbE_{\pd(\bx)}\left\|\bs_{\btheta}(\bx)-\nabla_\bx\log\pd(\bx)\right\|_2^2\rightarrow\min_{\btheta}
$$

<div v-click="1">

Noisy objective:

$$
\bbE_{q(\bx_{\sigma})}\left\|\bs_{\btheta,\sigma}(\bx_\sigma)-\nabla_\bx\log q(\bx_{\sigma})\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div v-click="2">

This is equivalent to a denoising task:

$$
\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div v-click="3">

$$
\bbE_{\pd(\bx)}\bbE_{\cN(0,\bI)}\left\|\bs_{\btheta,\sigma}(\bx+\sigma\bepsilon)+\frac\bepsilon\sigma\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div class="block" v-click="4">

## Langevin Dynamics

$$
\bx_{l+1}=\bx_l+\frac\eta2\cdot\bs_{\btheta,\sigma}(\bx_l)+\sqrt\eta\cdot\bepsilon_l,\qquad\bepsilon_l\sim\cN(0,\bI)
$$

</div>


<div class="source"><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a></div>

---
clicks: 0
sourceFrame: "auto: Noise-Conditioned Score Network (NCSN)"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Langevin Dynamics</div></div>
<div class="outline-item current"><span>02</span><div>Score Matching<div class="outline-sub">Denoising Score Matching<br>Noise-Conditioned Score Network (NCSN)</div></div></div>

</div>

---
clicks: 0
sourceFrame: "27"
class: theorems
---

# Denoising Score Matching

$$
\bbE_{\pd(\bx)}\bbE_{\cN(0,\bI)}\left\|\bs_{\btheta,\sigma}(\bx+\sigma\bepsilon)+\frac\bepsilon\sigma\right\|_2^2\rightarrow\min_{\btheta}
$$

<div class="columns balanced">
<div>

$$
\begin{aligned}
\bx_{l+1}&=\bx_l+\frac\eta2\cdot\bs_{\btheta,\sigma}(\bx_l)\\
&\quad+\sqrt\eta\cdot\bepsilon_l
\end{aligned}
$$

- For **small** $\sigma$, $\bs_{\btheta,\sigma}(\bx)$ becomes inaccurate and Langevin dynamics fails to traverse modes.
- For **large** $\sigma$, robustness in low-density regions is achieved, but the model learns a distribution that is overly corrupted.

</div>
<div>
<img src="/figs/pitfalls.jpg" alt="Inaccurate scores in low-density regions" style="height: 215px; width: 100%; object-fit: contain;" />
<img src="/figs/single_noise.jpg" alt="Score estimation at a single noise level" style="height: 180px; width: 100%; object-fit: contain;" />
</div>
</div>


<div class="source"><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a></div>

---
clicks: 1
sourceFrame: "28"
class: theorems
---

# Noise-Conditioned Score Network (NCSN)

- Specify a sequence of noise levels: $\sigma_1<\sigma_2<\dots<\sigma_T$.
- Perturb each data point with different noise levels: $\bx_t=\bx+\sigma_t\bepsilon$, so $\bx_t\sim q(\bx_t)$.
- Choose $\sigma_1,\sigma_T$ such that:

$$
q(\bx_1)\approx\pd(\bx),\qquad q(\bx_T)\approx\cN(0,\sigma_T^2\bI)
$$

<div v-click="1">
<img src="/figs/multi_scale.jpg" alt="Density at multiple noise scales" style="height: 145px; width: 100%; object-fit: contain;" />
<img src="/figs/duoduo.jpg" alt="Images corrupted with increasing Gaussian noise" style="height: 175px; width: 100%; object-fit: contain;" />
</div>


<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a></div>

---
clicks: 3
sourceFrame: "29"
class: theorems
---

# Noise-Conditioned Score Network (NCSN)

Train the denoising score function $\bs_{\btheta,\sigma_t}(\bx_t)$ for each noise level $\sigma_t$ using a unified weighted objective:

$$
\sum_{t=1}^T{\color{#8854c0}\sigma_t^2}\bbE_{\pd(\bx)}\bbE_{q(\bx_t|\bx)}\left\|\bs_{\btheta,\sigma_t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx)\right\|_2^2\rightarrow\min_{\btheta}
$$

<div v-click="1">

Here, $\nabla_{\bx_t}\log q(\bx_t|\bx)=-\frac{\bx_t-\bx}{\sigma_t^2}=-\frac\bepsilon{\sigma_t}$

</div>
<div class="block" v-click="2">

## Training

1. Sample $\bx_0\sim\pd(\bx)$, $t\sim U\{1,T\}$, $\bepsilon\sim\cN(0,\bI)$.
2. Compute noisy image $\bx_t=\bx_0+\sigma_t\bepsilon$.
3. Compute loss $\cL=\sigma_t^2\left\|\bs_{\btheta,\sigma_t}(\bx_t)+\frac\bepsilon{\sigma_t}\right\|^2$.
4. Update $\btheta$ via stochastic gradient descent.

</div>
<div v-click="3">

How do we sample from such a model?

</div>


<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a></div>

---
clicks: 1
sourceFrame: "30"
class: theorems
---

# Noise-Conditioned Score Network (NCSN)

<div class="block">

## Sampling (Annealed Langevin Dynamics)

1. Sample $\bx_T^0\sim\cN(0,\sigma_T^2\bI)\approx q(\bx_T)$.
2. Update $\bx_t^l$ via $L$ steps of Langevin dynamics at each noise level $\sigma_t$:

   $$
   \bx_t^l=\bx_t^{l-1}+\frac{\eta_t}2\bs_{\btheta,\sigma_t}(\bx_t^{l-1})+\sqrt{\eta_t}\bepsilon_t^l.
   $$

3. Update $\bx_{t-1}^0:=\bx_t^L$ and proceed to the next noise level $\sigma_{t-1}$.

</div>
<div v-click="1">
<img src="/figs/ald.png" alt="Annealed Langevin dynamics across decreasing noise levels" style="height: 225px; width: 100%; object-fit: contain;" />
</div>


<div class="source"><a href="https://arxiv.org/abs/2006.09011">Song Y. et al. Improved Techniques for Training Score-Based Generative Models, 2020</a></div>

---
clicks: 0
sourceFrame: "31"
class: summary
---

# Summary

- Langevin dynamics enables sampling from unnormalized densities (e.g. EBMs) using the gradient of the log-density $\nabla_{\bx}\log\pt(\bx)$.
- Score matching proposes minimizing Fisher divergence to estimate the score function.
- Denoising score matching minimizes the Fisher divergence on corrupted samples, making the divergence estimable via sampling.
- The Noise-Conditioned Score Network leverages a range of noise levels and annealed Langevin dynamics to learn the score function and enable sampling.
