---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 2"
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
sectionTitleOverrides: {"Coupling Layer (RealNVP)": "Blockwise Flows (RealNVP / TarFlow)"}
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 2</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
class: theorems
---

# Recap of Previous Lecture

We're given a **finite** number of i.i.d. samples $\{\bx_i\}_{i=1}^n\subset\bbR^m$ drawn from an **unknown** distribution $\pd(\bx)$.

<div class="block">

## Objective

Our aim is to estimate a distribution $\pd(\bx)$ that allows us to:

- **Sampling (generation):** sample $\bx\sim\pd(\bx)$.
- **Density evaluation:** evaluate $\pd(\bx)$ on novel data ("How likely is an object $\bx$?").

</div>
<div class="columns">
<div class="block">

## What is a Divergence?

- $D(\pi\|p)\geq0$ for all $\pi,p\in\cP$
- $D(\pi\|p)=0$ if and only if $\pi\equiv p$

</div>
<div class="block">

## Divergence Minimization Problem

$$
\min_{\btheta}D(\pd\|\pt)
$$

</div>
</div>

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Forward KL

$$
\KL(\pd\|\pt)=\int\pd(\bx)\log\frac{\pd(\bx)}{\pt(\bx)}d\bx\rightarrow\min_{\btheta}
$$

</div>
<div class="block">

## Reverse KL

$$
\KL(\pt\|\pd)=\int\pt(\bx)\log\frac{\pt(\bx)}{\pd(\bx)}d\bx\rightarrow\min_{\btheta}
$$

</div>
<div class="block">

## Maximum Likelihood Estimation (MLE)

Let $\{\bx_i\}_{i=1}^n$ be i.i.d. observed samples.

$$
\btheta^*=\argmax_{\btheta}\prod_{i=1}^n\pt(\bx_i)=\argmax_{\btheta}\sum_{i=1}^n\log\pt(\bx_i).
$$

</div>

Maximum likelihood estimation is equivalent to minimizing a Monte Carlo estimate of the forward KL divergence.

---
clicks: 0
sourceFrame: "4"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Likelihood as a Product of Conditionals

For $\bx=(x_1,\dots,x_m)$, $\bx_{1:j}=(x_1,\dots,x_j)$,

$$
\pt(\bx)=\prod_{j=1}^m\pt(x_j|\bx_{1:j-1});\quad
\log\pt(\bx)={\color{#8854c0}\sum_{j=1}^m\log\pt(x_j|\bx_{1:j-1})}
$$

</div>

$$
\btheta^*=\argmax_{\btheta}\sum_{i=1}^n\Big[{\color{#8854c0}\sum_{j=1}^m\log\pt(x_{ij}|\bx_{i,1:j-1})}\Big]
$$

<div class="block">

## Sampling (Ancestral)

1. Sample $\hat{x}_1\sim\pt(x_1)$, $\hat{x}_2\sim\pt(x_2|\hat{x}_1)$, $\ldots$, $\hat{x}_m\sim\pt(x_m|\hat{\bx}_{1:m-1})$.
2. Return $\hat{\bx}=(\hat{x}_1,\hat{x}_2,\ldots,\hat{x}_m)$.

</div>

---
clicks: 0
sourceFrame: "5"
class: theorems
---

# Recap of Previous Lecture

<div class="columns recap-models">
<section>

## Autoregressive Models: MLP

<div class="recap-illustrations">
<img src="/figs/sequential_MLP.png" alt="Sequential MLP conditionals" />
</div>
</section>
<section>

## Autoregressive Models: ImageGPT

<div class="recap-illustrations recap-imagegpt">
<img src="/figs/pixelcnn1.png" alt="Autoregressive pixel ordering" />
<img src="/figs/imagegpt.png" alt="ImageGPT token and transformer architecture" />
</div>
</section>
</div>

<div class="source"><a href="https://jmtomczak.github.io/blog/2/2_ARM.html">Image credit: https://jmtomczak.github.io/blog/2/2_ARM.html</a><br><a href="https://arxiv.org/abs/1601.06759">Oord A., Kalchbrenner N., Kavukcuoglu K. Pixel Recurrent Neural Networks, 2016</a><br><a href="https://cdn.openai.com/papers/Generative_Pretraining_from_Pixels_V2.pdf">Chen M. et al. Generative Pretraining from Pixels, 2020</a></div>

---
clicks: 0
sourceFrame: "6"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Normalizing Flows (NF)</div></div>
<div class="outline-item "><span>02</span><div>NF Examples<div class="outline-sub">Linear NF<br>Gaussian Autoregressive NF<br>Blockwise Flows (RealNVP / TarFlow)</div></div></div>
<div class="outline-item "><span>03</span><div>Latent Variable Models (LVM)</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Normalizing Flows (NF)"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Normalizing Flows (NF)</div></div>
<div class="outline-item "><span>02</span><div>NF Examples<div class="outline-sub">Linear NF<br>Gaussian Autoregressive NF<br>Blockwise Flows (RealNVP / TarFlow)</div></div></div>
<div class="outline-item "><span>03</span><div>Latent Variable Models (LVM)</div></div>

</div>

---
clicks: 0
sourceFrame: "7"
class: figure-slide
---

# Generative Models Taxonomy

<TaxonomyDiagram normalizing-flow class="taxonomy" />

---
clicks: 3
sourceFrame: "8"
class: theorems derivation
---

# Normalizing Flows: Prerequisites

<div class="block">

## Jacobian Matrix

<div class="columns balanced">
<div>

Let $\bff:\bbR^m\rightarrow\bbR^m$ be a differentiable function.

$$
\bz=\bff(\bx)
$$

</div>
<div>

$$
\bJ=\frac{\partial\bz}{\partial\bx}=\begin{pmatrix}
\frac{\partial z_1}{\partial x_1}&\dots&\frac{\partial z_1}{\partial x_m}\\
\vdots&\ddots&\vdots\\
\frac{\partial z_m}{\partial x_1}&\dots&\frac{\partial z_m}{\partial x_m}
\end{pmatrix}\in\bbR^{m\times m}
$$

</div>
</div>
</div>
<div class="block" v-click="1">

## Change of Variables Theorem (CoV)

Let $\bx\in\bbR^m$ be a random vector with density $p(\bx)$, and let $\bff:\bbR^m\rightarrow\bbR^m$ be a $C^1$-diffeomorphism ($\bff$ and $\bff^{-1}$ are continuously differentiable mappings). If $\bz=\bff(\bx)$, then

<div class="math-chain">

$\displaystyle p(\bx)=p(\bz)|\det(\bJ_{\bff})|=p(\bz)\left|\det\left(\frac{\partial\bz}{\partial\bx}\right)\right|$
<span v-click="2">$\displaystyle =p(\bff(\bx))\left|\det\left(\frac{\partial\bff(\bx)}{\partial\bx}\right)\right|$</span>
</div>
<div v-click="3">

$$
p(\bz)=p(\bx)|\det(\bJ_{\bff^{-1}})|=p(\bx)\left|\det\left(\frac{\partial\bx}{\partial\bz}\right)\right|
=p(\bff^{-1}(\bz))\left|\det\left(\frac{\partial\bff^{-1}(\bz)}{\partial\bz}\right)\right|
$$

</div>

</div>

---
clicks: 3
sourceFrame: "9"
class: interactive-slide theorems
---

# Jacobian Determinant

<div class="jacobian-combined">
<div class="jacobian-theory">

## Inverse Function Theorem

If the function $\bff$ is invertible and its Jacobian is continuous and non-singular, then

$$
\bJ_{\bff^{-1}}=\bJ_\bff^{-1}.
$$

<div v-click="1">

$$
|\det(\bJ_{\bff^{-1}})|=\frac{1}{|\det(\bJ_\bff)|}.
$$

</div>
<div v-click="2">

- $\bx$ and $\bz$ reside in the same space ($\bbR^m$).
- $\bff_{\btheta}(\bx)$ is a parameterized transformation.

</div>
<div v-click="3">

The determinant of the Jacobian $\bJ=\frac{\partial\bff_{\btheta}(\bx)}{\partial\bx}$ quantifies how the volume is changed by the transformation.

</div>
</div>
<div v-click="3">

<JacobianDemo />

</div>
</div>

<div class="source"><a href="https://jmtomczak.github.io/blog/3/3_flows.html">Geometric interpretation: Tomczak J. M. Normalizing Flows.</a></div>

---
clicks: 2
sourceFrame: "10"
class: theorems
---

# Fitting Normalizing Flows

<div class="block">

## MLE Problem

$$
\pt(\bx)=p(\bz)\left|\det\left(\frac{\partial\bz}{\partial\bx}\right)\right|
=p(\bff_{\btheta}(\bx))\left|\det\left(\frac{\partial\bff_{\btheta}(\bx)}{\partial\bx}\right)\right|
$$

<div v-click="1">

$$
\log\pt(\bx)=\log p(\bff_{\btheta}(\bx))+\log|\det(\bJ_{\bff})|\rightarrow\max_{\btheta}
$$

</div>
</div>
<img v-click="2" class="figure-bottom figure-tall" src="/figs/flows_how2.png" alt="Mapping data to latent space and latent samples back to data" />

<div class="source"><a href="https://arxiv.org/abs/1605.08803">Dinh L., Sohl-Dickstein J., Bengio S. Density Estimation Using Real NVP, 2016</a></div>

---
clicks: 3
sourceFrame: "11"
class: theorems derivation
---

# Composition of Normalizing Flows

<img class="figure-top" src="/figs/normalizing-flow.png" alt="Composition of invertible transformations" />

<div class="block" v-click="1">

## Theorem

If every $\{\bff_k\}_{k=1}^K$ satisfies the conditions of the change-of-variables theorem, then the composition <span style="white-space: nowrap">$\bff(\bx)=\bff_K\circ\ldots\circ\bff_1(\bx)$</span> also satisfies them.

</div>
<div class="math-chain" v-click="1">

$\displaystyle\pt(\bx)=p(\bff(\bx))\left|\det\left(\frac{\partial\bff(\bx)}{\partial\bx}\right)\right|$
<span v-click="2">$\displaystyle=p(\bff(\bx))\left|\det\left(\frac{\partial\bff_K}{\partial\bff_{K-1}}\dots\frac{\partial\bff_1}{\partial\bx}\right)\right|$</span>
</div>
<div v-click="3">

$$
=p(\bff(\bx))\prod_{k=1}^K\left|\det\left(\frac{\partial\bff_k}{\partial\bff_{k-1}}\right)\right|
=p(\bff(\bx))\prod_{k=1}^K|\det(\bJ_{\bff_k})|
$$

</div>

<div class="source"><a href="https://lilianweng.github.io/lil-log/2018/10/13/flow-based-deep-generative-models.html">Image credit: https://lilianweng.github.io/lil-log/2018/10/13/flow-based-deep-generative-models.html</a></div>

---
clicks: 3
sourceFrame: "12"
class: theorems
---

# Normalizing Flows (NF)

$$
\log\pt(\bx)=\log p(\bff_{\btheta}(\bx))+\log|\det(\bJ_\bff)|
$$

<div class="block">

## Definition

A normalizing flow is a $C^1$-diffeomorphism that transforms data $\bx$ to noise $\bz$.

</div>
<div v-click="1">

- **Normalizing** refers to mapping samples from $\pd(\bx)$ to a base distribution $p(\bz)$.
- **Flow** describes the sequence of transformations from base noise to data.

$$
\bz=\bff_K\circ\ldots\circ\bff_1(\bx);\quad\bx=\bff_1^{-1}\circ\ldots\circ\bff_K^{-1}(\bz)
$$

</div>
<div class="block" v-click="2">

## Log-Likelihood

$$
\log\pt(\bx)=\log p(\bff_K\circ\ldots\circ\bff_1(\bx))+\sum_{k=1}^K\log|\det(\bJ_{\bff_k})|
$$

where $\bJ_{\bff_k}=\frac{\partial\bff_k}{\partial\bff_{k-1}}$.

</div>
<div v-click="3">

We focus on **continuous** variables; **discrete flows** have not become mainstream.

</div>

<div class="source"><a href="https://arxiv.org/abs/1912.02762">Papamakarios G. et al. Normalizing Flows for Probabilistic Modeling and Inference, 2019</a><br><a href="https://arxiv.org/abs/1905.10347">Tran D. et al. Discrete Flows: Invertible Generative Models of Discrete Data, 2019</a></div>

---
clicks: 2
sourceFrame: "13"
class: theorems
---

# Normalizing Flows

Use a fixed base distribution $p(\bz)$, e.g. $\cN(0,\bI)$.

<div class="columns" style="grid-template-columns: 1.7fr 1fr">
<div class="block" style="margin: 0">

## Training

<ol>
<li>

Sample a minibatch $\bx_i\sim\pd(\bx)$, $i=1,\ldots,n$.

</li>
<li>

Compute $\bz_i=\bff_{\btheta}(\bx_i)$ and $\log|\det\bJ_\bff(\bx_i)|$.

</li>
<li>

Compute loss

$$
\cL=-\frac{1}{n}\sum_{i=1}^n\left[\log p(\bz_i)+\log|\det\bJ_\bff(\bx_i)|\right].
$$

</li>
<li>

Update $\btheta$ by gradient descent on $\cL$.

</li>
</ol>
</div>
<div class="block" v-click="1" style="margin: 0">

## Sampling

1. Sample $\bz\sim p(\bz)$.
2. Compute $\bx=\bff_{\btheta}^{-1}(\bz)$.
3. Return $\bx$.

</div>
</div>

<div class="block" v-click="2">

## Requirements

- **Training:** efficient computation of $\log|\det\bJ_\bff|$, where $\bJ_\bff=\frac{\partial\bff_{\btheta}(\bx)}{\partial\bx}$.
- **Sampling:** efficient inversion of the transformation $\bff_{\btheta}$.

What's the computational complexity of evaluating this determinant?

</div>

<div class="source"><a href="https://arxiv.org/abs/1912.02762">Papamakarios G. et al. Normalizing Flows for Probabilistic Modeling and Inference, 2019</a></div>

---
clicks: 0
sourceFrame: "auto: NF Examples"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Normalizing Flows (NF)</div></div>
<div class="outline-item current"><span>02</span><div>NF Examples<div class="outline-sub">Linear NF<br>Gaussian Autoregressive NF<br>Blockwise Flows (RealNVP / TarFlow)</div></div></div>
<div class="outline-item "><span>03</span><div>Latent Variable Models (LVM)</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Linear NF"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Normalizing Flows (NF)</div></div>
<div class="outline-item current"><span>02</span><div>NF Examples<div class="outline-sub"><strong>Linear NF</strong><br>Gaussian Autoregressive NF<br>Blockwise Flows (RealNVP / TarFlow)</div></div></div>
<div class="outline-item "><span>03</span><div>Latent Variable Models (LVM)</div></div>

</div>

---
clicks: 4
sourceFrame: "14"
class: theorems
---

# Jacobian Structure

<div class="block">

## Normalizing Flows Log-Likelihood

$$
\log\pt(\bx)=\log p(\bff_{\btheta}(\bx))+\log\left|\det\left(\frac{\partial\bff_{\btheta}(\bx)}{\partial\bx}\right)\right|
$$

</div>

The principal computational challenge is evaluating the Jacobian determinant.

<div class="block" v-click="1">

## What is $\det(\bJ)$ in These Cases?

Consider a linear layer $\bz=\bW\bx$, $\bW\in\bbR^{m\times m}$.

<ol>
<li>

$\bz$ is a permutation of $\bx$.

</li>
<li v-click="2">

$z_j$ depends only on $x_j$.

<div v-click="3">

$$
\log\left|\det\left(\frac{\partial\bff_{\btheta}(\bx)}{\partial\bx}\right)\right|
=\log\left|\prod_{j=1}^m\frac{\partial f_{j,\btheta}(x_j)}{\partial x_j}\right|
=\sum_{j=1}^m\log\left|\frac{\partial f_{j,\btheta}(x_j)}{\partial x_j}\right|
$$

</div>
</li>
<li v-click="4">

$z_j$ depends only on $\bx_{1:j}$ (autoregressive dependency).

</li>
</ol>
</div>

---
clicks: 2
sourceFrame: "15"
mergedSourceFrames: [16]
class: theorems
---

# Linear Normalizing Flows

$$
\bz=\bff_{\btheta}(\bx)=\bW\bx,\quad\bW\in\bbR^{m\times m},\quad\bJ_\bff=\bW
$$

Computing $\bff_{\btheta}^{-1}(\bz)$ means solving $\bW\bx=\bz$: $O(m^3)$ for a general dense matrix.

Diagonal systems cost $O(m)$; triangular systems cost $O(m^2)$.

<div class="block" v-click="1">

## Continuous Parameterization

There is no continuous surjective map from $\bbR^{m^2}$ onto the set of all invertible $m\times m$ matrices.

<div style="color: var(--muted)">

Explanation: a continuous path from $\det\bW>0$ to $\det\bW<0$ must cross $\det\bW=0$, where invertibility is lost. A continuous parameterization that guarantees invertibility must therefore keep the determinant sign fixed.

</div>

</div>
<div class="block" v-click="2">

## Structured Factors

Structured factorizations (e.g. LU or QR) simplify determinant and inverse calculations. Keep triangular diagonals nonzero to preserve invertibility.

**Learn the factors directly** during training.

</div>

<div class="source"><a href="https://arxiv.org/abs/1912.02762">Papamakarios G. et al. Normalizing Flows for Probabilistic Modeling and Inference, 2019</a><br><a href="https://arxiv.org/abs/1807.03039">Kingma D. P., et al. Glow: Generative Flow with Invertible 1x1 Convolutions, 2018</a><br><a href="https://arxiv.org/abs/1901.11137">Hoogeboom E., et al. Emerging Convolutions for Generative Normalizing Flows, 2019</a></div>

<!--
Why the determinant sign matters:
A continuous path from det W > 0 to det W < 0 must cross det W = 0,
where invertibility is lost. The parameter space R^(m^2) is connected,
whereas the full set of invertible matrices has two components distinguished
by determinant sign. A continuous parameterization that guarantees
invertibility therefore keeps the determinant sign fixed.
-->

---
clicks: 0
sourceFrame: "auto: Gaussian Autoregressive NF"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Normalizing Flows (NF)</div></div>
<div class="outline-item current"><span>02</span><div>NF Examples<div class="outline-sub">Linear NF<br><strong>Gaussian Autoregressive NF</strong><br>Blockwise Flows (RealNVP / TarFlow)</div></div></div>
<div class="outline-item "><span>03</span><div>Latent Variable Models (LVM)</div></div>

</div>

---
clicks: 5
sourceFrame: "17"
class: theorems
---

# Gaussian Autoregressive Model

Consider the autoregressive model:

$$
\pt(\bx)=\prod_{j=1}^m\pt(x_j|\bx_{1:j-1}),\quad
\pt(x_j|\bx_{1:j-1})=\cN\left(\mu_{j,\btheta}(\bx_{1:j-1}),\sigma^2_{j,\btheta}(\bx_{1:j-1})\right)
$$

<div class="block" v-click="1">

## Generative Direction

$$
x_j=\sigma_{j,\btheta}(\bx_{1:j-1})\cdot z_j+\mu_{j,\btheta}(\bx_{1:j-1}),\quad z_j\sim\cN(0,1)
$$

</div>
<div class="block" v-click="2">

## Inverse Transformation

$$
z_j=\frac{x_j-\mu_{j,\btheta}(\bx_{1:j-1})}{\sigma_{j,\btheta}(\bx_{1:j-1})}
$$

</div>
<ul>
<li v-click="3">

This gives a **$C^1$-diffeomorphism** from $p(\bz)$ to $\pt(\bx)$ (assume that $\sigma_j\neq0$).

</li>
<li v-click="4">

This model is called an autoregressive (AR) NF with base distribution $p(\bz)=\cN(0,\bI)$.

</li>
<li v-click="5">

The Jacobian matrix of this transformation is triangular.

</li>
</ul>

<div class="source"><a href="https://arxiv.org/abs/1606.04934">Kingma D. P. et al. Improving Variational Inference with Inverse Autoregressive Flow, 2016</a></div>

---
clicks: 0
sourceFrame: "18"
class: interactive-slide
---

# Gaussian Autoregressive NF: Two Directions

<AutoregressiveFlowDemo />

<div class="source"><a href="https://arxiv.org/abs/1705.07057">Papamakarios G., Pavlakou T., Murray I. Masked Autoregressive Flow for Density Estimation, 2017</a></div>

---
clicks: 0
sourceFrame: "auto: Blockwise Flows (RealNVP / TarFlow)"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Normalizing Flows (NF)</div></div>
<div class="outline-item current"><span>02</span><div>NF Examples<div class="outline-sub">Linear NF<br>Gaussian Autoregressive NF<br><strong>Blockwise Flows (RealNVP / TarFlow)</strong></div></div></div>
<div class="outline-item "><span>03</span><div>Latent Variable Models (LVM)</div></div>

</div>

---
clicks: 3
sourceFrame: "19"
class: theorems
---

# RealNVP

Split $\bx$ and $\bz$ into two parts:

$$
\bx=[\bx_1,\bx_2]=[\bx_{1:d},\bx_{d+1:m}];\quad\bz=[\bz_1,\bz_2]=[\bz_{1:d},\bz_{d+1:m}]
$$

<div class="block" v-click="1">

## Coupling Layer

<div class="math-chain">

$\displaystyle\begin{cases}\bx_1=\bz_1\\\bx_2=\bz_2\odot\bsigma_{\btheta}(\bz_1)+\bmu_{\btheta}(\bz_1)\end{cases}\qquad$
<span v-click="2">$\displaystyle\begin{cases}\bz_1=\bx_1\\\bz_2=(\bx_2-\bmu_{\btheta}(\bx_1))\odot\frac{1}{\bsigma_{\btheta}(\bx_1)}\end{cases}$</span>
</div>
</div>
<div class="block" v-click="3">

## Image Partitioning

<div class="columns balanced">
<img class="figure-top" src="/figs/realnvp_masking.png" alt="Checkerboard and channelwise image partitions" />
<div>

- Checkerboard ordering corresponds to masking.
- Channelwise ordering relies on splitting.

</div>
</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/1605.08803">Dinh L., Sohl-Dickstein J., Bengio S. Density Estimation Using Real NVP, 2016</a></div>

---
clicks: 3
sourceFrame: "20"
class: theorems
---

# RealNVP

<div class="block">

## Coupling Layer

<div class="math-chain">

$\displaystyle\begin{cases}{\color{#8854c0}\bx_1}={\color{teal}\bz_1}\\{\color{#8854c0}\bx_2}={\color{teal}\bz_2}\odot\bsigma_{\btheta}({\color{teal}\bz_1})+\bmu_{\btheta}({\color{teal}\bz_1})\end{cases}\qquad$
$\displaystyle\begin{cases}{\color{teal}\bz_1}={\color{#8854c0}\bx_1}\\{\color{teal}\bz_2}=({\color{#8854c0}\bx_2}-\bmu_{\btheta}({\color{#8854c0}\bx_1}))\odot\frac{1}{\bsigma_{\btheta}({\color{#8854c0}\bx_1})}\end{cases}$

</div>

In both training and sampling, only a single forward pass is needed!

</div>
<div class="block" v-click="1">

## Jacobian

<div class="math-chain">

$\displaystyle\det\left(\frac{\partial\bz}{\partial\bx}\right)=\det\begin{pmatrix}\bI_d&0_{d\times m-d}\\\frac{\partial\bz_2}{\partial\bx_1}&\frac{\partial\bz_2}{\partial\bx_2}\end{pmatrix}$
<span v-click="2">$\displaystyle=\prod_{j=1}^{m-d}\frac{1}{\sigma_{j,\btheta}(\bx_1)}$</span>
</div>
</div>
<div class="block" v-click="3">

## Gaussian AR NF

$$
\begin{aligned}
\bx&=\bff^{-1}_{\btheta}(\bz)\quad\Rightarrow\quad{\color{#8854c0}x_j}=\sigma_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})\cdot{\color{teal}z_j}+\mu_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})\\
\bz&=\bff_{\btheta}(\bx)\quad\Rightarrow\quad{\color{teal}z_j}=\left({\color{#8854c0}x_j}-\mu_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})\right)\cdot\frac{1}{\sigma_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})}.
\end{aligned}
$$

How can the RealNVP layer be derived as a special instance of the Gaussian autoregressive NF?

</div>

<div class="source"><a href="https://arxiv.org/abs/1605.08803">Dinh L., Sohl-Dickstein J., Bengio S. Density Estimation Using Real NVP, 2016</a></div>

---
clicks: 0
sourceFrame: "extension: 20"
class: interactive-slide
---

# RealNVP: Explore a Coupling Layer

<CouplingDemo />

<div class="source"><a href="https://arxiv.org/abs/1605.08803">Dinh L., Sohl-Dickstein J., Bengio S. Density Estimation Using Real NVP, 2016</a></div>

---
clicks: 2
sourceFrame: "extension: 17"
class: theorems
---

# TarFlow: Autoregression over Patches

<div class="columns" style="align-items: start; margin-bottom: 24px">
<div class="block" style="margin: 0">

## Gaussian AR NF: Autoregression

Transform one **scalar coordinate** $x_j$,
conditioned on **all previous coordinates** $\bx_{1:j-1}$.

</div>
<div class="block" style="margin: 0" v-click="1">

## RealNVP: Transform a Block

Transform a **whole block** $\bx_2$ elementwise,
with shifts and scales predicted from $\bx_1$.

</div>
</div>

<div v-click="2">
<div class="block">

## TarFlow: Autoregression + Blockwise Transforms

Split an image into patches $\bx_j\in\bbR^d$. Each patch is one block of pixel values.

$$
\underbrace{\bx_j}_{\text{whole patch}}
=\bz_j\odot\bsigma_{j,\btheta}(\underbrace{{\color{#8854c0}\bx_{1:j-1}}}_{\text{previous patches}})
+\bmu_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}}).
$$

**Sampling:** sequential across patches, parallel within each patch.

**Density evaluation:** all patches are observed, so compute all $\bz_j$ in parallel.

</div>

The Jacobian stays **triangular**. Positive scales ensure invertibility; $\bz_1=\bx_1$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2412.06329">Zhai S. et al. Normalizing Flows are Capable Generative Models, 2024. Section 2.2.</a></div>

<!--
Teaching bridge: combine the autoregressive dependence of Gaussian AR NF with
RealNVP's elementwise affine transformation of a vector block. This is a conceptual
connection, not a claim that TarFlow stacks RealNVP coupling layers or inherits
RealNVP's fully parallel sampling. RealNVP conditions its transformed block on one
unchanged block; TarFlow conditions each patch on the entire strict patch prefix.
The scalar coordinate becomes a vector of d pixel values. N is the number of
patches, so Nd is the image dimension. Patches use the current flow layer's order.
The displayed sampling equation applies to j=2,...,N; the first patch is unchanged.
The inverse is z_j = (x_j - mu_j(x_{1:j-1})) / sigma_j(x_{1:j-1}), elementwise.
The functions predict componentwise shifts and positive scales from the strict
prefix. There is no dependence on the current patch inside these functions.
This gives a block lower-triangular Jacobian with diagonal within-patch blocks;
its determinant is the product of inverse componentwise scales.
Training uses the same exact flow likelihood and MLE objective introduced earlier.
For the full flow, sample the base Gaussian and invert all layers in reverse order.
Parallel density evaluation is across patches within one flow layer; both
directions traverse the flow layers sequentially.
-->

---
clicks: 1
sourceFrame: "extension: 11"
class: theorems
---

# TarFlow: Transformer Architecture

Use a **causal Transformer** to predict the shifts and scales of each AR flow block.

<img style="width: 100%; height: 330px; object-fit: contain; margin: 12px auto" src="/figs/tarflow-architecture.png" alt="TarFlow maps image patches to noise through a stack of causal Transformer affine flow blocks" />

<div v-click="1">

- Causal attention uses only earlier patches. The Transformer itself need not be invertible.
- Stack affine AR blocks and reverse patch order between blocks.

</div>

<div class="source"><a href="https://arxiv.org/abs/2412.06329">Zhai S. et al. Normalizing Flows are Capable Generative Models, 2024. Figure 2.</a></div>

<!--
TarFlow is a patchwise extension of Masked Autoregressive Flow, operating directly
on pixels. Patchification is a reshape, not a learned lossy tokenizer. The
Transformer predicts parameters of the affine map introduced on the previous
slide. Strict prefix conditioning uses a shifted causal Transformer output;
log-scales are exponentiated to make each scale positive.
The first block uses the original patch order; each subsequent block reverses it.
Inversion undoes the affine maps and permutations in reverse block order.
The original diagram uses zero-based patch indices and t for the block index;
the preceding method slide uses the course's one-based indices for one block.
-->

---
clicks: 2
sourceFrame: "extension: 13"
class: theorems
---

# Dequantization of Images

An 8-bit image has $\bx\in\{0,\ldots,255\}^m$. A flow models a **continuous density** $\pt(\bv)$.

<div class="block">

## Probability of a Pixel Bin

For a model supported on $[0,256)^m$, the discrete image probability is

$$
P_{\btheta}(\bx)=\int_{[0,1)^m}\pt(\bx+\bu)\,d\bu.
$$

</div>
<div class="block" v-click="1">

## Uniform Dequantization

$$
\bu\sim\Uniform([0,1)^m),\qquad \bv=\bx+\bu,\qquad \lfloor\bv\rfloor=\bx.
$$

Each discrete value is spread over its bin. Train the flow on $\bv$.

</div>
<div v-click="2">

By **Jensen's inequality**,

$$
\log P_{\btheta}(\bx)\geq\bbE_{\bu}\bigl[\log\pt(\bx+\bu)\bigr].
$$

Exact continuous density evaluation gives a **lower bound** on discrete log-likelihood.

</div>

<div class="source"><a href="https://arxiv.org/abs/1511.01844">Theis L., van den Oord A., Bethge M. A Note on the Evaluation of Generative Models, 2015. Section 3.1.</a></div>

<!--
Adapted from the author's Supplementary: Data dequantization, especially Uniform
dequantization. Work with integer pixel coordinates here; normalizing the inputs
adds a change-of-variables constant. P is a probability mass and p is a density.
Assume positive density and finite expected log-density. The uniform noise density
and bin volume are both one, so the integral is an expectation; concavity of log
then gives the displayed bound. Point-density spikes can improve the naive
continuous objective on a discrete training set without improving bin masses.
No approximate posterior, ELBO, or variational dequantization is needed here.
The cube support is the simple theoretical setting; implementation boundary
handling is outside this introduction.
-->

---
clicks: 1
sourceFrame: "extension: 12"
class: figure-slide
---

# TarFlow: Flows Can Generate Detailed Images

<img style="width: 100%; height: 310px; object-fit: contain; margin: 8px auto 16px" src="/figs/tarflow-samples.jpeg" alt="TarFlow guided samples: AFHQ animal faces and ImageNet objects and scenes" />

AFHQ $256\times256$ (left); ImageNet $128\times128$ and $64\times64$ (right).

<div class="block" v-click="1">

- The **autoregressive flow construction** scales to detailed images using networks over patches.
- The flow keeps a tractable likelihood and sequential sampling across patches.

</div>

<div class="source"><a href="https://arxiv.org/abs/2412.06329">Zhai S. et al. Normalizing Flows are Capable Generative Models, 2024. Figure 3: samples from the paper's full generation setup.</a></div>

<!--
These are examples reported by the authors, not samples generated for this course.
The paper appeared on arXiv in December 2024 and at ICML 2025; the assets are from
arXiv v3. This slide makes no current state-of-the-art or universal diffusion
comparison claim. The full published generation setup also uses noise augmentation,
guidance and denoising. These additional techniques are left to later lectures.
The examples should not be presented as samples from the bare affine-block
inversion shown above.
Optional context (Zhai et al., sections 2.4–2.5, 3.1 and Appendix C): likelihood
and generation use separately trained configurations. For likelihood, uniform
noise fills one pixel bin (width 1/128 after rescaling pixels to [-1,1]). For
image generation, training uses broader Gaussian noise, followed by denoising
of generated samples. For ImageNet 64x64, sigma=0.05 versus uniform-noise
standard deviation approximately 0.002. Gaussian noise crosses pixel bins;
its continuous-likelihood objective does not inherit the uniform-bin bound
by direct substitution. Denoising is not claimed to exactly recover the clean
distribution or preserve likelihood. No score, Tweedie or guidance derivation
is introduced here.
-->

---
clicks: 2
sourceFrame: "extension: 13"
class: theorems
---

# Normalizing Flows: What Comes Next?

We can now turn simple noise into complex data, with both **sampling** and **exact continuous density evaluation**.

<div class="block">

## What We Learned

- Change of variables gives an exact continuous density and an MLE training objective.
- Efficient training and sampling require tractable Jacobian determinants and efficient inverses.

</div>
<div class="columns">
<div class="block" v-click="1" style="margin: 0">

## Next: Latent Variable Models

Relax the one-to-one map with a probabilistic decoder. Marginalizing latent variables makes likelihood evaluation harder, motivating variational inference (L3–L4).

</div>
<div class="block" v-click="2" style="margin: 0">

## Later: Continuous Flows (L9–L11)

Continuous-time normalizing flows (CNF) replace layers by an ODE, relaxing the layer constraints. Flow Matching learns the velocity field by regression; sampling uses a numerical solver.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/1912.02762">Papamakarios G. et al. Normalizing Flows for Probabilistic Modeling and Inference, 2019</a><br><a href="https://arxiv.org/abs/2210.02747">Lipman Y. et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
sourceFrame: "auto: Latent Variable Models (LVM)"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Normalizing Flows (NF)</div></div>
<div class="outline-item "><span>02</span><div>NF Examples<div class="outline-sub">Linear NF<br>Gaussian Autoregressive NF<br>Blockwise Flows (RealNVP / TarFlow)</div></div></div>
<div class="outline-item current"><span>03</span><div>Latent Variable Models (LVM)</div></div>

</div>

---
clicks: 2
sourceFrame: "21"
mergedSourceFrames: [22]
class: theorems
---

# Bayesian Framework

<div class="block">

## Bayes' Theorem

$$
p(\btheta|\bx)=\frac{p(\bx|\btheta)p(\btheta)}{p(\bx)}
=\frac{p(\bx|\btheta)p(\btheta)}{\int p(\bx|\btheta)p(\btheta)d\btheta}
$$

<div class="columns">
<div>

- $\bx$: observed variables;
- $\btheta$: unknown latent variables/parameters;
- $\pt(\bx)=p(\bx|\btheta)$: likelihood;

</div>
<div>

- $p(\bx)=\int p(\bx|\btheta)p(\btheta)d\btheta$: evidence;
- $p(\btheta)$: prior distribution;
- $p(\btheta|\bx)$: posterior distribution.

</div>
</div>
</div>
<div class="block" v-click="1">

## Interpretation

The prior $p(\btheta)$ expresses our belief before observing data; the posterior $p(\btheta|\bx)$ updates it after observing $\bx$.

</div>
<div class="block" v-click="2">

## Computational Challenge

The evidence requires integration over the unobserved variables. If it is intractable, the posterior cannot be evaluated exactly.

</div>

---
clicks: 4
sourceFrame: "23"
class: theorems
---

# Latent Variable Models (LVM)

<div class="block">

## Maximum Likelihood Estimation (MLE) Problem

For the observed dataset $\bX=\{\bx_i\}_{i=1}^n$,

$$
\btheta^*=\argmax_{\btheta}\pt(\bX)=\argmax_{\btheta}\prod_{i=1}^n\pt(\bx_i)=\argmax_{\btheta}\sum_{i=1}^n\log\pt(\bx_i).
$$

</div>
<div v-click="1">

The distribution $\pt(\bx)$ should be highly complex (just like the true data distribution $\pd(\bx)$).

</div>
<div class="block" v-click="2">

## Latent Variable

Introduce a latent variable $\bz$ for each observed sample $\bx$:

$$
\pt(\bx,\bz)=\pt(\bx|\bz)p(\bz);\quad\log\pt(\bx,\bz)=\log\pt(\bx|\bz)+\log p(\bz).
$$

<div v-click="3">

$$
\pt(\bx)=\int\pt(\bx,\bz)d\bz=\int\pt(\bx|\bz)p(\bz)d\bz.
$$

</div>
</div>
<div v-click="4">

- $p(\bz)$ is the **prior** and $\pt(\bx|\bz)$ is the **decoder** distribution.
- Both $\pt(\bx|\bz)$ and $p(\bz)$ are usually much simpler than $\pt(\bx)$.

</div>

---
clicks: 2
sourceFrame: "24"
class: theorems
---

# Latent Variable Models (LVM)

$$
\log\pt(\bx)=\log\int\pt(\bx|\bz)p(\bz)d\bz\rightarrow\max_{\btheta}
$$

<div class="block" v-click="1">

## Examples

<div class="columns">
<div>

*Mixture of Gaussians*

<img class="figure-bottom" src="/figs/mixture_of_gaussians.png" alt="Gaussian mixture with three components" />

- $\pt(\bx|z)=\cN(\bmu_z,\bSigma_z)$
- $p(z)=\Cat(\bpi)$

</div>
<div v-click="2">

*PCA Model*

<img class="figure-bottom" src="/figs/pca.png" alt="PCA latent line and noisy observations" />

- $\pt(\bx|\bz)=\cN(\bW\bz+\bmu,\sigma^2\bI)$
- $p(\bz)=\cN(0,\bI)$

</div>
</div>
</div>

<div class="source">Bishop C. Pattern Recognition and Machine Learning, 2006</div>

---
clicks: 0
sourceFrame: "25"
class: summary
---

# Summary

- Change of variables computes exact continuous densities under invertible transformations.
- Normalizing flows use invertible maps with tractable Jacobians; CNF and Flow Matching extend this view of transporting distributions.
- Linear NFs use structured matrix factors to simplify determinant and inverse calculations.
- RealNVP coupling is a special case of AR NF with fast density evaluation and sampling.
- TarFlow uses Transformers to scale Gaussian AR flows with triangular Jacobians.
- Uniform dequantization gives a lower bound on discrete image log-likelihood.
- LVMs combine a decoder $\pt(\bx|\bz)$ and prior $p(\bz)$; marginalization makes $\pt(\bx)$ harder to evaluate.
