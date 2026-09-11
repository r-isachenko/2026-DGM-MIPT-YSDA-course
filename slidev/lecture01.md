---
theme: default
layout: default
title: "Deep Generative Models — Lecture 1"
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
clicks: 0
sourceFrame: "1"
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 1</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Introduction and Logistics</div></div>
<div class="outline-item "><span>02</span><div>Generative Models Overview</div></div>
<div class="outline-item "><span>03</span><div>Generative Modeling Framework<div class="outline-sub">Course Tricks<br>Problem Statement<br>Divergence Minimization Framework</div></div></div>
<div class="outline-item "><span>04</span><div>Autoregressive Models (ImageGPT)</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Introduction and Logistics"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Introduction and Logistics</div></div>
<div class="outline-item "><span>02</span><div>Generative Models Overview</div></div>
<div class="outline-item "><span>03</span><div>Generative Modeling Framework<div class="outline-sub">Course Tricks<br>Problem Statement<br>Divergence Minimization Framework</div></div></div>
<div class="outline-item "><span>04</span><div>Autoregressive Models (ImageGPT)</div></div>

</div>

---
clicks: 1
sourceFrame: "3"
---

# Generative vs Discriminative Models

<img class="wide-figure" src="/lecture01/gen_vs_discrim.png" alt="gen vs discrim" />

<div v-click="1">

- **Discriminative model:** learns a decision boundary $p(\by | \bx)$.
- **Generative model:** learns the data distribution $\pd(\bx)$ (optionally $\pd(\bx, \by)$) and can *sample* from it.

</div>

---
clicks: 0
sourceFrame: "4"
---

# Course Team

<div class="team">
<div><img src="/lecture01/roman.jpg" alt="Roman Isachenko" />

## Roman Isachenko

*lecturer*

PhD in Phys. & Math.

CV Engineer<br>at Yandex

`@roman_isachenko`

</div><div><img src="/lecture01/matvey.jpg" alt="Matvey Morozov" />

## Matvey Morozov

*seminarist*

MIPT alumnus (2020)

Senior CV Engineer<br>at Gradient & Persona

`@morozov_ma`

</div><div><img src="/lecture01/grigory.jpg" alt="Grigory Ksenofontov" />

## Grigory Ksenofontov

*teaching assistant*

MIPT alumnus (2023)

PhD student<br>at Skoltech

`@gregkseno`

</div></div>

---
clicks: 1
sourceFrame: "5"
---

# About the Course

Theoretical foundations & practical applications of **Deep Generative Models**. Primary focus: Computer Vision, but the principles are universal across modern AI.

<div class="block" v-click="1">

## Six major pillars

- **Likelihood-based:** Autoregressive, Normalizing Flows.
- **Latent Variable:** VAE, VQ-VAE.
- **Adversarial:** GAN, WGAN, likelihood-free evaluation.
- **Score-based & Diffusion:** score matching, NCSN, DDPM, guidance.
- **Continuous-Time:** CNF, SDE/ODE, Flow Matching.
- **Discrete Diffusion:** absorbing, masked diffusion LMs.

</div>

---
clicks: 2
sourceFrame: "6"
---

# Course Structure and Grading

<div class="columns">

<div class="block">

## Structure

- **14** lectures + **14** seminars (one per week)
- **6** homework assignments
- cozy oral exam

</div>

<div class="block" v-click="1">

## Game rules

| | Points |
| :-- | --: |
| Homeworks ($6 \times 15$ pts) | **90** |
| Oral exam | **30** |
| **Maximum** | **120** |

</div>

</div>

<div class="block" v-click="2">

## Final grade


$$
\boxed{\;\text{grade} = \min\!\left(\left\lfloor \tfrac{\#\text{points}}{10} \right\rfloor,\,10\right)\;}
$$


</div>

---
clicks: 0
sourceFrame: "7"
---

# Lecture Schedule

<div class="columns schedule">
<div>

1. Intro & Logistics; AR models (ImageGPT)
2. Normalizing Flows (NF); LVM intro
3. ELBO, Reparametrization Trick, VAE
4. ELBO Surgery; Discrete VAE; VQ-VAE; Likelihood-free Learning
5. GAN; Wasserstein Distance; WGAN; Model Evaluation
6. Langevin Dynamics; Score Matching; NCSN
7. Gaussian Diffusion; Diffusion ELBO

</div><div>

8. DDPM; Classifier(-Free) Guidance
9. Continuous-Time NF; Continuity Equation; SDE basics
10. Probability Flow ODE; Reverse SDE; Flow Matching
11. Conditional Flow Matching (CFM)
12. Two-Sided Conditioning; FM $\leftrightarrow$ Score link; Discrete Diffusion
13. Discrete Diffusion: Reverse Process; Absorbing Diffusion
14. Course Overview and Recap

</div></div>

---
clicks: 2
sourceFrame: "8"
---

# Prerequisites

<div class="block">

## What you should know

- **Math:** probability theory, statistics, multivariate calculus.
- **ML:** fundamentals of machine learning and deep learning.
- **Tools:** PyTorch / basic GPU workflow is a plus.
- **Optional:** information theory basics (entropy, KL divergence).
- **Optional:** familiarity with numerical ODE concepts at a “black-box usage” level.

</div>

<div class="block" v-click="1">

## Key points

- The course is **mathematically heavy**.
- The course is **constantly evolving**.
- Any feedback — especially *negative* — is very welcome!

</div>

<div v-click="2">

**Repository:** [github.com/r-isachenko/2026-DGM-MIPT-YSDA-course](https://github.com/r-isachenko/2026-DGM-MIPT-YSDA-course)

</div>

---
clicks: 0
sourceFrame: "auto: Generative Models Overview"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Introduction and Logistics</div></div>
<div class="outline-item current"><span>02</span><div>Generative Models Overview</div></div>
<div class="outline-item "><span>03</span><div>Generative Modeling Framework<div class="outline-sub">Course Tricks<br>Problem Statement<br>Divergence Minimization Framework</div></div></div>
<div class="outline-item "><span>04</span><div>Autoregressive Models (ImageGPT)</div></div>

</div>

---
clicks: 0
sourceFrame: "9"
---

# Generative Models Taxonomy

<img class="taxonomy" src="/shared/taxonomy.svg" alt="Generative models taxonomy: explicit and implicit density, score-based, continuous dynamics, discrete diffusion, and their model families" />

---
clicks: 0
sourceFrame: "10"
class: figure-slide
---

# VAE — The First Scalable Approach for Image Generation

<img class="hero" src="/lecture01/vae.png" alt="vae" />
<div class="source"><a href="https://arxiv.org/abs/1312.6114">Kingma D.P., Welling M. Auto-Encoding Variational Bayes, 2013</a></div>


---
clicks: 0
sourceFrame: "11"
class: figure-slide
---

# DCGAN — The First Convolutional GAN for Image Generation

<img class="hero" src="/lecture01/dcgan.png" alt="dcgan" />
<div class="source"><a href="https://arxiv.org/abs/1511.06434">Radford A., Metz L., Chintala S. Unsupervised Representation Learning with Deep Convolutional Generative Adversarial Networks, 2015</a></div>


---
clicks: 0
sourceFrame: "12"
class: figure-slide
---

# StyleGAN — High-Quality Face Generation

<img class="figure-top" src="/lecture01/gan_evolution.png" alt="gan evolution" />
<img class="figure-bottom" src="/lecture01/stylegan.png" alt="stylegan" />
<div class="source"><a href="https://arxiv.org/abs/1812.04948">Karras T., Laine S., Aila T. A Style-Based Generator Architecture for Generative Adversarial Networks, 2018</a></div>

---
clicks: 0
sourceFrame: "13"
class: figure-slide
---

# Language Modeling at Scale

<img class="hero" src="/lecture01/LLM-Evolutionary-Tree.png" alt="LLM-Evolutionary-Tree" />
<div class="source"><a href="https://blog.biocomm.ai/2023/05/14/open-source-proliferation-llm-evolutionary-tree/">Image credit: https://blog.biocomm.ai/2023/05/14/open-source-proliferation-llm-evolutionary-tree/</a></div>


---
clicks: 0
sourceFrame: "14"
class: figure-slide
---

# Denoising Diffusion Probabilistic Model

<img class="hero" src="/lecture01/diffusion_models.png" alt="diffusion models" />
<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>


---
clicks: 0
sourceFrame: "15"
class: figure-slide
---

# Midjourney — Impressive Text-to-Image Results

<img class="hero" src="/lecture01/midjourney.png" alt="midjourney" />
<div class="source"><a href="https://www.midjourney.com/explore">Image credit: https://www.midjourney.com/explore</a></div>


---
clicks: 0
sourceFrame: "16"
class: figure-slide
---

# Sora — Video Generation

<img class="hero" src="/lecture01/sora.png" alt="sora" />
<div class="source"><a href="https://openai.com/index/sora">Image credit: https://openai.com/index/sora</a></div>


---
clicks: 0
sourceFrame: "17"
class: figure-slide
---

# Nano Banana Pro

**Prompt:** Create a storyboard for this scene

<img class="hero" src="/lecture01/nano_banana.png" alt="nano banana" />
<div class="source"><a href="https://blog.google/technology/ai/nano-banana-pro/">Image credit: https://blog.google/technology/ai/nano-banana-pro/</a></div>


---
clicks: 0
sourceFrame: "18"
---

# Generative Models Timeline

<img class="timeline" src="/lecture01/timeline.png" alt="timeline" />
<div class="columns glossary"><div>

**EBM** — Energy-based Model.<br>
**VAE** — Variational Autoencoder.<br>
**NF** — Normalizing Flow.<br>
**DPM** — Diffusion Probabilistic Model.<br>
**NODE** — Neural ODE.

</div><div>

**NCSN** — Noise Conditional Score Network.<br>
**DDPM** — Denoising Diffusion Probabilistic Model.<br>
**Score SDE** — Score-based Stochastic Differential Equation.<br>
**FM** — Flow Matching.

</div></div>
<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025</a></div>


---
clicks: 0
sourceFrame: "19"
---

# Open Problems in Generative Models

<div class="columns balanced">
<div>

- Video generation
- 3D scene generation
- Understanding of physical processes
- Multimodal end-to-end models

</div>
<img class="column-figure" src="/lecture01/physics_understand.png" alt="physics understand" />
</div>
<div class="source"><a href="https://arxiv.org/abs/2501.09038">Motamed S. et al. Do generative video models understand physical principles?, 2025</a></div>


---
clicks: 0
sourceFrame: "auto: Generative Modeling Framework"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Introduction and Logistics</div></div>
<div class="outline-item "><span>02</span><div>Generative Models Overview</div></div>
<div class="outline-item current"><span>03</span><div>Generative Modeling Framework<div class="outline-sub">Course Tricks<br>Problem Statement<br>Divergence Minimization Framework</div></div></div>
<div class="outline-item "><span>04</span><div>Autoregressive Models (ImageGPT)</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Course Tricks"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Introduction and Logistics</div></div>
<div class="outline-item "><span>02</span><div>Generative Models Overview</div></div>
<div class="outline-item current"><span>03</span><div>Generative Modeling Framework<div class="outline-sub"><strong>Course Tricks</strong><br>Problem Statement<br>Divergence Minimization Framework</div></div></div>
<div class="outline-item "><span>04</span><div>Autoregressive Models (ImageGPT)</div></div>

</div>

---
clicks: 2
sourceFrame: "20"
class: theorems
---

# Course Tricks I

<div class="block">

## Log-Derivative Trick

Given a differentiable function $p: \bbR^m \to \bbR$ (usually density function),

$$
\nabla \log p(\bx) = \frac{1}{p(\bx)} \cdot \nabla p(\bx).
$$

</div>
<div class="block" v-click="1">

## Jensen's Inequality

If $\bx \in \bbR^m$ is a continuous random variable with density $p(\bx)$ and $f: \bbR^m \to \bbR$ is convex, then

$$
\bbE[f(\bx)] \geq f(\bbE[\bx]).
$$

</div>
<div class="block" v-click="2">

## Monte Carlo Estimation

Let $\bx \in \bbR^m$ be a continuous random variable with density $p(\bx)$, and $\bff: \bbR^m \to \bbR^d$ be any vector-valued function. Then,

$$
\bbE_{p(\bx)} \bff(\bx) = \int p(\bx) \bff(\bx) d\bx \approx \frac{1}{n} \sum_{i=1}^n \bff(\bx_i), \quad \text{where } \bx_i \sim p(\bx).
$$

</div>

---
clicks: 4
sourceFrame: "21"
class: theorems
---

# Course Tricks II

<div class="block">

## Change of Variables Theorem (CoV)

Let $\bx\in\bbR^m$ be a random vector with density $p(\bx)$, and let $\bff:\bbR^m\rightarrow\bbR^m$ be a $C^1$-diffeomorphism ($\bff$ and $\bff^{-1}$ are continuously differentiable mappings). If $\bz=\bff(\bx)$, then

<div class="math-chain">

$\displaystyle p(\bx)=p(\bz)|\det(\bJ_{\bff})|=p(\bz)\left|\det\left(\frac{\partial\bz}{\partial\bx}\right)\right|$
<span v-click="1">$\displaystyle =p(\bff(\bx))\left|\det\left(\frac{\partial\bff(\bx)}{\partial\bx}\right)\right|$</span>

</div>
<div v-click="2" class="math-chain">

$\displaystyle p(\bz)=p(\bx)|\det(\bJ_{\bff^{-1}})|=p(\bx)\left|\det\left(\frac{\partial\bx}{\partial\bz}\right)\right|=p(\bff^{-1}(\bz))\left|\det\left(\frac{\partial\bff^{-1}(\bz)}{\partial\bz}\right)\right|$

</div>

</div>
<div class="block" v-click="3">

## Law of the Unconscious Statistician (LOTUS)

Let $\bx\in\bbR^m$ be a continuous random variable with density $p(\bx)$, let $\bff:\bbR^m\to\bbR^m$ be measurable, and let $\bg:\bbR^m\to\bbR^m$ be an arbitrary function. If $\by=\bff(\bx)$, then

<div class="math-chain">

$\displaystyle \bbE_{p(\by)}\bg(\by)=\int p(\by)\bg(\by)d\by$
<span v-click="4">$\displaystyle =\int p(\bx)\bg(\bff(\bx))d\bx=\bbE_{p(\bx)}\bg(\bff(\bx))$</span>.

</div>

</div>

<!-- Click 1: substitute z=f(x). Click 2: inverse CoV identity. Click 3: LOTUS. Click 4: change the expectation variable. Each equality keeps its position. -->

---
clicks: 3
sourceFrame: "22"
---

# Course Tricks III

<div class="block">

## Optimal MSE Prediction

Let $(\bx,\by)$ be jointly distributed with density $p(\bx,\by)$. The optimal predictor under mean squared error is the conditional expectation:

<div class="math-chain">

$\displaystyle \bff^*(\bx)=\argmin_{\bff}\bbE_{p(\bx,\by)}\|\by-\bff(\bx)\|^2$
<span v-click="1">$\displaystyle =\bbE_{p(\by|\bx)}[\by]$</span>.

</div>

</div>
<div class="block" v-click="2">

## Dirac Delta Function

Any deterministic variable $\bx_0$ can be interpreted as a random variable with density $p(\bx)=\delta(\bx-\bx_0)$.

$$
\delta(\bx)=\begin{cases}+\infty,&\bx=0\\0,&\bx\neq0\end{cases}\qquad \int\delta(\bx)d\bx=1
$$

<div v-click="3">

$$
\bbE_{p(\bx)}\bff(\bx)=\int\delta(\bx-\bx_0)\bff(\bx)d\bx=\bff(\bx_0)
$$

</div>

</div>

---
clicks: 0
sourceFrame: "auto: Problem Statement"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Introduction and Logistics</div></div>
<div class="outline-item "><span>02</span><div>Generative Models Overview</div></div>
<div class="outline-item current"><span>03</span><div>Generative Modeling Framework<div class="outline-sub">Course Tricks<br><strong>Problem Statement</strong><br>Divergence Minimization Framework</div></div></div>
<div class="outline-item "><span>04</span><div>Autoregressive Models (ImageGPT)</div></div>

</div>

---
clicks: 4
sourceFrame: "23"
---

# Problem Statement

We're given a **finite** number of i.i.d. samples $\{\bx_i\}_{i=1}^n\subset\bbR^m$ drawn from an **unknown** distribution $\pd(\bx)$.

<div class="block" v-click="1">

## Objective

Our aim is to estimate a distribution $\pd(\bx)$ that allows us to:

<ul>
<li>

Generate new samples from $\pd(\bx)$ (sample $\bx\sim\pd(\bx)$) — **generation**;

</li>
<li v-click="2">

Evaluate $\pd(\bx)$ on novel data (answering “How likely is an object $\bx$?”) — **density estimation**.

</li>
</ul>

</div>
<div class="block" v-click="3">

## Challenge

The data is high-dimensional and complex. For example, image datasets live in $\bbR^{\text{width}\times\text{height}\times\text{channels}}$. The curse of dimensionality makes accurately estimating $\pd(\bx)$ infeasible.

</div>
<div v-click="4">

**Note:** here we use a strong assumption that our data is continuous (thus avoiding the domain of texts).

</div>

---
clicks: 3
sourceFrame: "24"
class: theorems histogram-interactive
---

# Histogram as a Generative Model

<div class="columns histogram"><div>

Assume $x\sim\Cat(\bpi)$. The histogram model is fully characterized by

$$
\hat\pi_k=\hat\pi(x=k)=\frac{\sum_{i=1}^n[x_i=k]}{n}.
$$

**Curse of dimensionality:** The number of bins rises exponentially.

</div><HistogramDemo />
</div>

<div v-click="1">

**MNIST example**: $28\times28$ grayscale images, with each image $\bx=(x_1,\dots,x_{784})$, $x_i\in\{0,1\}$:

$$
\pd(\bx)=p(x_1)\cdot p(x_2|x_1)\cdot\dots\cdot p(x_m|x_{m-1},\dots,x_1).
$$

</div>
<div v-click="2">

A complete histogram would require $2^{28\times28}-1$ parameters for $\pd(\bx)$.

</div>
<div v-click="3">

**Question:** How many parameters are required in these cases?

$$
\begin{aligned}
\pd(\bx)&=p(x_1)\cdot p(x_2)\cdot\dots\cdot p(x_m);\\
\pd(\bx)&=p(x_1)\cdot p(x_2|x_1)\cdot\dots\cdot p(x_m|x_{m-1}).
\end{aligned}
$$

</div>

---
clicks: 1
sourceFrame: "25"
class: table-slide
---

# Conditional Models

In practice, we're typically interested in learning conditional models (sampling from conditional distribution $\pd(\bx|\by)$).

<div v-click="1">

| Condition $\by$ | Output $\bx$ | Model |
| :-- | :-- | :-- |
| $\emptyset$ | image | unconditional image model |
| class label | image | class-conditional image model |
| text prompt | image | text-to-image model |
| image | image | image-to-image model |
| image | text | image-to-text (image captioning) model |
| English text | Russian text | sequence-to-sequence model (machine translation) |
| sound | text | speech-to-text (automatic speech recognition) model |
| text | sound | text-to-speech model |

</div>

<!-- Click 1 reveals all eight examples together, as in Beamer. The list is arranged as a table; wording and condition/output pairs are retained. -->

---
clicks: 0
sourceFrame: "auto: Divergence Minimization Framework"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Introduction and Logistics</div></div>
<div class="outline-item "><span>02</span><div>Generative Models Overview</div></div>
<div class="outline-item current"><span>03</span><div>Generative Modeling Framework<div class="outline-sub">Course Tricks<br>Problem Statement<br><strong>Divergence Minimization Framework</strong></div></div></div>
<div class="outline-item "><span>04</span><div>Autoregressive Models (ImageGPT)</div></div>

</div>

---
clicks: 3
sourceFrame: "26"
---

# Divergences

- Let us fix a probabilistic model $\pt(\bx)$ from a parametric family of distributions $\{p(\bx|\btheta)\,|\,\btheta\in\bTheta\}$.

<div v-click="1">

- Instead of searching among all possible distributions for the true $\pd(\bx)$, we seek a functional approximation $\pt(\bx)\approx\pd(\bx)$.

</div>
<div class="block" v-click="2">

## What is a Divergence?

Let $\cP$ be the set of all probability distributions. A mapping $D:\cP\times\cP\to\bbR$ is called a **divergence** if

- $D(\pi\|p)\geq0$ for all $\pi,p\in\cP$
- $D(\pi\|p)=0$ if and only if $\pi\equiv p$

</div>
<div class="block" v-click="3">

## Divergence Minimization Problem


$$
\min_{\btheta}D(\pd\|\pt)
$$
where $\pd(\bx)$ is the true data distribution and $\pt(\bx)$ is the model distribution.

</div>

---
clicks: 3
sourceFrame: "27"
class: theorems
---

# Forward KL vs Reverse KL (Kullback-Leibler Divergence)

<div class="block">

## Forward KL


$$
\KL(\pd\|\pt)=\int\pd(\bx)\log\frac{\pd(\bx)}{\pt(\bx)}d\bx\rightarrow\min_{\btheta}
$$


</div>
<div class="block" v-click="1">

## Reverse KL


$$
\KL(\pt\|\pd)=\int\pt(\bx)\log\frac{\pt(\bx)}{\pd(\bx)}d\bx\rightarrow\min_{\btheta}
$$


</div>
<div v-click="2">

What's the practical distinction between these two objectives?

</div>
<div class="block" v-click="3">

## Maximum Likelihood Estimation (MLE)

Let $\{\bx_i\}_{i=1}^n$ be i.i.d. observed samples.
$$
\btheta^*=\argmax_{\btheta}\prod_{i=1}^n\pt(\bx_i)=\argmax_{\btheta}\sum_{i=1}^n\log\pt(\bx_i).
$$


</div>

---
clicks: 6
sourceFrame: "28"
class: derivation
---

# Forward KL vs Reverse KL: MLE as Forward KL

<div class="block">

## Forward KL

$$ {1|1-2|1-3|all} {at:1}
\begin{aligned}
\KL(\pd\|\pt)&=\int\pd(\bx)\log\frac{\pd(\bx)}{\pt(\bx)}d\bx\\
&={\color{#8854c0}\int\pd(\bx)\log\pd(\bx)d\bx}-{\color{teal}\int\pd(\bx)\log\pt(\bx)d\bx}\\
&=-{\color{teal}\bbE_{\pd(\bx)}[\log\pt(\bx)]}+{\color{#8854c0}\text{const}}\\
&\approx-\frac{1}{n}\sum_{i=1}^n\log\pt(\bx_i)+\text{const}\rightarrow\min_{\btheta}.
\end{aligned}
$$

</div>
<div v-click="4">

Maximum likelihood estimation is thus equivalent to minimizing a Monte Carlo estimate of the forward KL divergence.

</div>
<div class="block" v-click="5">

## Reverse KL

$$ {1|all} {at:6}
\begin{aligned}
\KL(\pt\|\pd)&=\int\pt(\bx)\log\frac{\pt(\bx)}{\pd(\bx)}d\bx\\
&=\bbE_{\pt(\bx)}\left[\log\pt(\bx)-\log\pd(\bx)\right]\rightarrow\min_{\btheta}
\end{aligned}
$$

</div>

<!-- Clicks 1–3 expand forward KL and apply Monte Carlo. Click 4: MLE conclusion. Click 5: reverse KL definition. Click 6: reverse KL as an expectation. Violet is the data-only constant; teal is the model log-likelihood term. -->

---
clicks: 0
sourceFrame: "auto: Autoregressive Models (ImageGPT)"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Introduction and Logistics</div></div>
<div class="outline-item "><span>02</span><div>Generative Models Overview</div></div>
<div class="outline-item "><span>03</span><div>Generative Modeling Framework<div class="outline-sub">Course Tricks<br>Problem Statement<br>Divergence Minimization Framework</div></div></div>
<div class="outline-item current"><span>04</span><div>Autoregressive Models (ImageGPT)</div></div>

</div>

---
clicks: 0
sourceFrame: "29"
---

# Generative Models Taxonomy

<img class="taxonomy" src="/shared/taxonomy-ar.svg" alt="Generative models taxonomy with Autoregressive models highlighted" />

---
clicks: 3
sourceFrame: "30"
class: theorems
---

# Autoregressive Modeling

<div class="block">

## MLE Problem


$$
\btheta^*=\argmax_{\btheta}\prod_{i=1}^n\pt(\bx_i)=\argmax_{\btheta}\sum_{i=1}^n\log\pt(\bx_i)
$$


</div>
<div v-click="1">

- This maximization is typically solved via gradient-based optimization.
- Thus, efficient computation of both $\log\pt(\bx)$ and its gradient $\frac{\partial\log\pt(\bx)}{\partial\btheta}$ is crucial.

</div>
<div class="block" v-click="2">

## Likelihood as a Product of Conditionals

For $\bx=(x_1,\dots,x_m)$, $\bx_{1:j}=(x_1,\dots,x_j)$,
$$
\pt(\bx)=\prod_{j=1}^m\pt(x_j|\bx_{1:j-1});\quad\log\pt(\bx)={\color{#8854c0}\sum_{j=1}^m\log\pt(x_j|\bx_{1:j-1})}
$$


</div>
<div v-click="3">


$$
\btheta^*=\argmax_{\btheta}\sum_{i=1}^n\Big[{\color{#8854c0}\sum_{j=1}^m\log\pt(x_{ij}|\bx_{i,1:j-1})}\Big]
$$


</div>

---
clicks: 3
sourceFrame: "31"
---

# Autoregressive Models

$$
\log\pt(\bx)=\sum_{j=1}^m\log\pt(x_j|\bx_{1:j-1})
$$

<div class="block" v-click="1">

## Sampling (Ancestral)

1. Sample $\hat{x}_1\sim\pt(x_1)$, $\hat{x}_2\sim\pt(x_2|\hat{x}_1)$, $\ldots$, $\hat{x}_m\sim\pt(x_m|\hat{\bx}_{1:m-1})$.
2. Return $\hat{\bx}=(\hat{x}_1,\hat{x}_2,\ldots,\hat{x}_m)$.

</div>
<div v-click="2">

- Each conditional $\pt(x_j|\bx_{1:j-1})$ can be modeled using a neural network.

</div>
<div v-click="3">

- Modeling all conditionals separately isn't feasible. To address this, we share parameters across all conditionals.

</div>

---
clicks: 0
sourceFrame: "extension: 31"
class: interactive-slide
---

# Generate an Image, or Evaluate One

$$
\textstyle\pt(\bx)=\prod_{j=1}^m\pt(x_j\mid\bx_{1:j-1}),\qquad
\log\pt(\bx)=\sum_{j=1}^m\log\pt(x_j\mid\bx_{1:j-1}).
$$

<AutoregressiveDemo />

<!-- Start in Generate: inspect the next conditional, click Next pixel, and see the sampled bit join the context. Start over clears the generated prefix for a new draw. Then switch to Evaluate: the complete observed image is known, and we record the probability of each observed bit. Another image selects a new observed example. The product matches this image's empirical frequency. This is an exact empirical toy model, not a neural-network demo; parameter sharing is explained on the preceding slide. About two minutes. -->

---
clicks: 3
sourceFrame: "32"
---

# Autoregressive Models: MLP

For large $j$, the conditional $\pt(x_j|\bx_{1:j-1})$ becomes intractable as the history $\bx_{1:j-1}$ grows variable-length.

<div class="block" v-click="1">

## Markov Assumption


$$
\pt(x_j|\bx_{1:j-1})=\pt(x_j|\bx_{j-d:j-1}),\quad d\;\text{is a fixed parameter}.
$$


</div>
<div class="block" v-click="2">

## Example

<div class="columns"><div>

- $d=2$
- $x_j\in\{0,\ldots,255\}$
- $\bh_j=\MLP_{\btheta}(x_{j-1},x_{j-2})$
- $\pt(x_j|x_{j-1},x_{j-2})=\Cat(\bpi_j)$

</div><div><img class="mlp-figure" src="/lecture01/sequential_MLP.png" alt="sequential MLP" />

<div v-click="3">

Can we also model continuous-valued data, not just the discrete case?

</div>
</div></div>

</div>
<div class="source"><a href="https://jmtomczak.github.io/blog/2/2_ARM.html">Image credit: https://jmtomczak.github.io/blog/2/2_ARM.html</a></div>


---
clicks: 0
sourceFrame: "33"
---

# Autoregressive Models: LLM

$$
\pt(x_j|\bx_{1:j-1})=\pt(x_j|\bx_{j-d:j-1}),\quad d\ \text{is the context window}.
$$

<img class="wide-figure" src="/lecture01/llm_modeling.png" alt="llm modeling" />
<div class="source"><a href="https://jmtomczak.github.io/blog/20/20_llms.html">Image credit: https://jmtomczak.github.io/blog/20/20_llms.html</a></div>


---
clicks: 1
sourceFrame: "34"
---

# Autoregressive Models for Images

How do we model the distribution $\pd(\bx)$ of natural images?
$$
\pt(\bx)=\prod_{j=1}^{\text{width}\times\text{height}}\pt(x_j|\bx_{1:j-1})
$$

<div v-click="1">

<div class="columns balanced"><div>

- A pixel ordering must be selected; the raster scan is a standard choice.
- RGB channel dependencies can be modeled explicitly as well.

</div>
<img class="pixel-figure" src="/lecture01/pixelcnn1.png" alt="pixelcnn1" />
</div>

</div>
<div class="source"><a href="https://arxiv.org/abs/1601.06759">Oord A., Kalchbrenner N., Kavukcuoglu K. Pixel Recurrent Neural Networks, 2016</a></div>


---
clicks: 0
sourceFrame: "35"
class: figure-slide
---

# Autoregressive Models: ImageGPT

<img class="hero" src="/lecture01/imagegpt.png" alt="imagegpt" />
<div class="source"><a href="https://cdn.openai.com/papers/Generative_Pretraining_from_Pixels_V2.pdf">Chen M. et al. Generative Pretraining from Pixels, 2020</a></div>


---
clicks: 0
sourceFrame: "36"
class: summary
---

# Summary

- Our target is to approximate the data distribution both for density estimation and for generation.
- Modern generative models span several families — autoregressive models, normalizing flows, VAEs, GANs, diffusion models — organized in the course taxonomy.
- The divergence minimization framework offers a principled way to learn distributions that match the data.
- Minimizing the forward KL divergence is equivalent to maximum likelihood estimation.
- Autoregressive models decompose the joint distribution as a product of conditionals $\pt(x_j|\bx_{1:j-1})$; evaluating the density multiplies them all.
- Autoregressive sampling is simple, but inherently sequential.
- ImageGPT applies a transformer architecture to sequences of raster-ordered image pixels.
