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
<div class="outline-item "><span>02</span><div>NF Examples<div class="outline-sub">Linear NF<br>Gaussian Autoregressive NF<br>Coupling Layer (RealNVP)</div></div></div>
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
<div class="outline-item "><span>02</span><div>NF Examples<div class="outline-sub">Linear NF<br>Gaussian Autoregressive NF<br>Coupling Layer (RealNVP)</div></div></div>
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

If every $\{\bff_k\}_{k=1}^K$ satisfies the conditions of the change-of-variables theorem, then the composition $\bff(\bx)=\bff_K\circ\ldots\circ\bff_1(\bx)$ also satisfies them.

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
- **Flow** describes the sequence of transformations that maps samples from $p(\bz)$ to the target, more complex distribution.

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

**Note:** Here we consider only **continuous** random variables.

</div>

<div class="source"><a href="https://arxiv.org/abs/1912.02762">Papamakarios G. et al. Normalizing Flows for Probabilistic Modeling and Inference, 2019</a></div>

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
<div class="outline-item current"><span>02</span><div>NF Examples<div class="outline-sub">Linear NF<br>Gaussian Autoregressive NF<br>Coupling Layer (RealNVP)</div></div></div>
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
<div class="outline-item current"><span>02</span><div>NF Examples<div class="outline-sub"><strong>Linear NF</strong><br>Gaussian Autoregressive NF<br>Coupling Layer (RealNVP)</div></div></div>
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
clicks: 1
sourceFrame: "15"
class: theorems
---

# Linear Normalizing Flows

$$
\bz=\bff_{\btheta}(\bx)=\bW\bx,\quad\bW\in\bbR^{m\times m},\quad\btheta=\bW,\quad\bJ_\bff=\bW
$$

Computing $\bff_{\btheta}^{-1}(\bz)$ means solving $\bW\bx=\bz$: $O(m^3)$ for a general dense matrix.

<div class="block" v-click="1">

## Invertibility

- Diagonal matrix: $O(m)$.
- Triangular matrix: $O(m^2)$.

</div>
<div class="block" v-click="1">

## Continuous Parameterization

There is no continuous surjective map from $\bbR^{m^2}$ onto the set of all invertible $m\times m$ matrices.

<div style="color: var(--muted)">

Explanation: a continuous path from $\det\bW>0$ to $\det\bW<0$ must cross $\det\bW=0$, where invertibility is lost. A continuous parameterization that guarantees invertibility must therefore keep the determinant sign fixed.

</div>

</div>

<div class="source"><a href="https://arxiv.org/abs/1912.02762">Papamakarios G. et al. Normalizing Flows for Probabilistic Modeling and Inference, 2019</a></div>

---
clicks: 3
sourceFrame: "16"
class: theorems
---

# Linear Normalizing Flows

$$
\bz=\bff_{\btheta}(\bx)=\bW\bx,\quad\bW\in\bbR^{m\times m},\quad\btheta=\bW,\quad\bJ_\bff=\bW
$$

<div class="block" v-click="1">

## Matrix Decompositions

<div class="columns">
<div>

**LU Decomposition:**

$$
\bW=\bP\bL\bU,
$$

- $\bP$: permutation matrix.
- $\bL$: lower triangular with positive diagonal.
- $\bU$: upper triangular with positive diagonal.

</div>
<div v-click="2">

**QR Decomposition:**

$$
\bW=\bQ\bR,
$$

- $\bQ$: orthogonal matrix.
- $\bR$: upper triangular with positive diagonal.

</div>
</div>
</div>
<div v-click="3" class="takeaway">

Decomposition is performed only at initialization; the decomposed matrices ($\bP,\bL,\bU$ or $\bQ,\bR$) are optimized during training.

</div>

<div class="source"><a href="https://arxiv.org/abs/1807.03039">Kingma D. P., et al. Glow: Generative Flow with Invertible 1x1 Convolutions, 2018</a><br><a href="https://arxiv.org/abs/1901.11137">Hoogeboom E., et al. Emerging Convolutions for Generative Normalizing Flows, 2019</a></div>

---
clicks: 0
sourceFrame: "auto: Gaussian Autoregressive NF"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Normalizing Flows (NF)</div></div>
<div class="outline-item current"><span>02</span><div>NF Examples<div class="outline-sub">Linear NF<br><strong>Gaussian Autoregressive NF</strong><br>Coupling Layer (RealNVP)</div></div></div>
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
clicks: 2
sourceFrame: "18"
class: theorems
---

# Gaussian Autoregressive NF

<div class="columns balanced flow-directions">
<div>

## Forward Transformation: $\bff_{\btheta}(\bx)$

$$
\begin{aligned}
\bz&=\bff_{\btheta}(\bx)\\
{\color{teal}z_j}&=\frac{{\color{#8854c0}x_j}-\mu_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})}{\sigma_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})}
\end{aligned}
$$

</div>
<img class="figure-top" src="/figs/af_iaf_explained_2.png" alt="Forward autoregressive transform computes all noise coordinates in parallel" />
<div v-click="1">

## Inverse Transformation: $\bff^{-1}_{\btheta}(\bz)$

$$
\begin{aligned}
\bx&=\bff^{-1}_{\btheta}(\bz)\\
{\color{#8854c0}x_j}&=\sigma_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})\cdot{\color{teal}z_j}+\mu_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})
\end{aligned}
$$

</div>
<img v-click="1" class="figure-top" src="/figs/af_iaf_explained_1.png" alt="Inverse transform samples coordinates sequentially" />
</div>
<div v-click="2">

- Sampling must be done sequentially, but density evaluation can be parallelized.
- The forward KL divergence is a natural objective for training.

</div>

<div class="source"><a href="https://arxiv.org/abs/1705.07057">Papamakarios G., Pavlakou T., Murray I. Masked Autoregressive Flow for Density Estimation, 2017</a></div>

---
clicks: 0
sourceFrame: "extension: 18"
class: interactive-slide
---

# Gaussian Autoregressive NF: Two Directions

<AutoregressiveFlowDemo />

<div class="source"><a href="https://arxiv.org/abs/1705.07057">Papamakarios G., Pavlakou T., Murray I. Masked Autoregressive Flow for Density Estimation, 2017</a></div>

---
clicks: 0
sourceFrame: "auto: Coupling Layer (RealNVP)"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Normalizing Flows (NF)</div></div>
<div class="outline-item current"><span>02</span><div>NF Examples<div class="outline-sub">Linear NF<br>Gaussian Autoregressive NF<br><strong>Coupling Layer (RealNVP)</strong></div></div></div>
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
clicks: 0
sourceFrame: "auto: Latent Variable Models (LVM)"
class:
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Normalizing Flows (NF)</div></div>
<div class="outline-item "><span>02</span><div>NF Examples<div class="outline-sub">Linear NF<br>Gaussian Autoregressive NF<br>Coupling Layer (RealNVP)</div></div></div>
<div class="outline-item current"><span>03</span><div>Latent Variable Models (LVM)</div></div>

</div>

---
clicks: 1
sourceFrame: "21"
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

- We begin with unknown variables $\btheta$ and a prior belief $p(\btheta)$.
- Once data $\bx$ is observed, the posterior $p(\btheta|\bx)$ incorporates both prior beliefs and evidence from the data.

</div>

---
clicks: 3
sourceFrame: "22"
class: theorems
---

# Bayesian Framework

Consider the case where the unobserved variables $\btheta$ are model parameters (i.e., $\btheta$ are random variables).

- $\bX=\{\bx_i\}_{i=1}^n$: observed samples;
- $p(\btheta)$: prior distribution.

<div class="block" v-click="1">

## Posterior Distribution

$$
p(\btheta|\bX)=\frac{p(\bX|\btheta)p(\btheta)}{p(\bX)}
=\frac{p(\bX|\btheta)p(\btheta)}{\int p(\bX|\btheta)p(\btheta)d\btheta}
$$

</div>
<div v-click="2">

If the evidence $p(\bX)$ is intractable (due to high-dimensional integration), the posterior cannot be computed exactly.

</div>
<div class="block" v-click="3">

## Maximum a Posteriori (MAP) Estimation

$$
\btheta^*=\argmax_{\btheta}p(\btheta|\bX)=\argmax_{\btheta}(\log p(\bX|\btheta)+\log p(\btheta))
$$

</div>

---
clicks: 4
sourceFrame: "23"
class: theorems
---

# Latent Variable Models (LVM)

<div class="block">

## Maximum Likelihood Estimation (MLE) Problem

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

- $p(\bz)$ is the prior distribution over the latent variable.
- $\pt(\bx|\bz)$ is the **decoder** distribution.
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

- The CoV theorem provides a method for computing a random variable's density under an invertible transformation.
- Normalizing flows transform a simple base distribution into a complex one via a sequence of invertible mappings, each with efficient Jacobian determinants.
- Linear NFs capture invertible matrices by using matrix decompositions.
- Gaussian autoregressive NFs are AR models with triangular Jacobians.
- The RealNVP coupling layer provides an efficient normalizing flow (a special case of AR NF), supporting fast density evaluation and sampling.
- LVMs introduce latent representations for observed data, building a complex $\pt(\bx)$ from much simpler $\pt(\bx|\bz)$ and $p(\bz)$.
