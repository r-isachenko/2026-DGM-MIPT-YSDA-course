---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 12"
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
favicon: "data:,"
download: false
info: false
clicks: 0
id: deep-generative-models
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 12</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
id: recap-of-previous-lecture
class: theorems
---

# Recap of Previous Lecture

## Flow Matching (FM)

The path starts at a Gaussian noise sample $\bx_0\sim\cN(0,\bI)$ and ends at a data point $\bx_1\sim\pd$.

$$
\frac{d \bx_t}{dt} = \bv (\bx_t, t),  \quad \text{with initial condition } \bx(0) = \bx_0.
$$

Many velocity fields connect the same endpoints. FM fits a chosen field by regression, without ODE solves or Jacobian traces during training.

$$
\bbE_{t \sim U[0, 1]} \bbE_{\bx \sim p_t(\bx)}\left\| \bv(\bx, t) - \bv_{\btheta}(\bx, t) \right\|^2 \rightarrow \min_{\btheta}
$$

**Problem:** The true vector field $\bv(\bx, t)$ is **unknown**.

For each $\bz\sim p(\bz)$, choose a **conditional probability path** $p_t(\bx|\bz)$ with a known velocity field.

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a><br><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 0
id: recap-of-previous-lectures
class: theorems
---

# Recap of Previous Lecture

## From Marginal to Conditional Paths

$$
p_t(\bx)=\int p_t(\bx|\bz)p(\bz)\,d\bz.
$$

<div class="block">

If $\bv(\bx,\bz,t)$ generates $p_t(\bx|\bz)$ for each $\bz$, its posterior mean generates the mixture $p_t(\bx)$.

$$
{\color{#007f82}\bv(\bx,t)}
=\bbE_{p_t(\bz|\bx)}\!\left[\bv(\bx,\bz,t)\right]
=\int \bv(\bx,\bz,t)\,p_t(\bz|\bx)\,d\bz,\qquad
p_t(\bz|\bx)=\frac{p_t(\bx|\bz)p(\bz)}{p_t(\bx)}\quad (p_t(\bx)>0).
$$

</div>

<CfmRecapDiagram kind="construction" />

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a><br><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a> · <a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">Diagram adapted from A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 0
id: recap-of-previous-lecture-3
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Flow Matching (FM)

$$
\bbE_{t\sim U[0,1]}\bbE_{\bx\sim p_t(\bx)}\left\|\bv(\bx,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

</div>
<div class="block">

## Conditional Flow Matching (CFM)

$$
\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

$$
\underbrace{(\bx_t,t)}_{\text{network input}}
\qquad\qquad
\underbrace{\bv(\bx_t,\bz,t)}_{\text{velocity target}}
$$

</div>
<div class="block">

## Theorem

If $p_t(\bx)>0$ for all $\bx\in\bbR^m$ and $0\le t<1$, the FM and CFM objectives differ by a constant independent of $\btheta$, so they have the same minimizers.

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a><br><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-7
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Gaussian Conditional Probability Path

Choose an affine flow. Along each trajectory, keep the same Gaussian noise $\bepsilon$ and vary the mean and scale.

$$
\begin{aligned}
p_t(\bx|\bz)&=\cN\left(\bmu_t(\bz),\bsigma_t^2(\bz)\right);\\
\bx_t&=\bpsi_t(\bx_0,\bz)=\bmu_t(\bz)+\bsigma_t(\bz)\odot\bepsilon
\end{aligned}
$$

</div>
<div class="block">

## Gaussian Conditional Vector Field

On the interval considered, assume $\bmu_t(\bz)$ and $\bsigma_t(\bz)$ are differentiable in $t$, with $\bsigma_t(\bz)>0$ componentwise.

$$
\boxed{\bv(\bx_t,\bz,t)=\bpsi_t'\left(\bpsi_t(\bx_t,\bz)^{-1},\bz\right)=\bmu_t'(\bz)+\frac{\bsigma_t'(\bz)}{\bsigma_t(\bz)}\odot(\bx_t-\bmu_t(\bz))}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 0
id: recap-of-previous-lecture-9
class: theorems
---

# Recap of Previous Lecture

## One-Sided Conditioning

Let us choose $\bz=\bx_1$. Then $p(\bz)=p_1(\bx_1)$.

**At $t=0$**, draw the noise $\bx_0$ independently of $\bx_1$.

$$
p_0(\bx|\bx_1)=\cN(0,\bI);\quad p_1(\bx|\bx_1)=\delta(\bx-\bx_1)
$$

$$
\begin{cases}\bmu_t(\bx_1)=t\bx_1\\\bsigma_t(\bx_1)=1-t\end{cases}
\quad\Rightarrow\quad
\begin{cases}p_t(\bx|\bx_1)=\cN\left(t\bx_1,(1-t)^2\cdot\bI\right)\\\bx_t=t\bx_1+(1-t){\color{olive}\bx_0}\end{cases}
$$

<CfmRecapDiagram kind="cones" />

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-12
class: theorems
---

# Recap of Previous Lecture

## Rectified Flow

Regressing on $\bx_1-\bx_0$ along $\bx_t=(1-t)\bx_0+t\bx_1$ gives the **rectified flow objective**.

$$
\bv_{\btheta^*}(\bx,t)=\bbE\left[\bx_1-\bx_0\mid\bx_t=\bx\right].
$$

**Straight training paths do not imply straight sampling trajectories.**

<CfmRecapDiagram kind="comparison" />

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://arxiv.org/abs/2209.03003">Liu X., Gong C., Liu Q. Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-13
class: theorems
---

# Recap of Previous Lecture

## Rectified Flow: Training and Sampling

$$
\bbE_{t\sim U[0,1]}\bbE_{\bx_1\sim\pd(\bx)}\bbE_{\bx_0\sim\cN(0,\bI)}\left\|(\bx_1-\bx_0)-\bv_{\btheta}(\bx_t,t)\right\|^2\rightarrow\min_{\btheta}
$$

<div class="block">

## Training

1. Sample $\bx_1\sim\pd(\bx)$, $\bx_0\sim\cN(0,\bI)$, $t\sim U[0,1]$.
2. Compute noisy image $\bx_t=t\bx_1+(1-t)\bx_0$.
3. Compute loss $\cL=\left\|(\bx_1-\bx_0)-\bv_{\btheta}(\bx_t,t)\right\|^2$.

</div>
<div class="block">

## Sampling

1. Sample $\bx_0\sim\cN(0,\bI)$.
2. Solve the ODE to obtain $\bx_1$:

$$
\bx_1=\bpsi_1(\bx_0)=\ODESolve_v(\bx_0,\btheta,t_0=0,t_1=1).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://arxiv.org/abs/2209.03003">Liu X., Gong C., Liu Q. Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow, 2022</a></div>

<!-- The recap ends with the one-sided algorithm used for comparison with pair conditioning. The author chose to omit training-time distributions and velocity CFG from this recap. -->

---
clicks: 0
id: outline
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Flow Matching<div class="outline-sub">Two-Sided Conditioning<br>Link between Flow Matching and Score-Based Models</div></div></div>
<div class="outline-item"><span>02</span><div>Discrete Diffusion<div class="outline-sub">Forward Discrete Process<br>Reverse Diffusion Process</div></div></div>

</div>

---
clicks: 0
id: outline-2
section: "Flow Matching"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Flow Matching<div class="outline-sub"><strong>Two-Sided Conditioning</strong><br>Link between Flow Matching and Score-Based Models</div></div></div>
<div class="outline-item"><span>02</span><div>Discrete Diffusion<div class="outline-sub">Forward Discrete Process<br>Reverse Diffusion Process</div></div></div>

</div>

---
clicks: 4
id: pair-conditioning
class: theorems
---

# Pair Conditioning

<div class="block">

## Conditional Flow Matching

$$
\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

</div>

In image-to-image transport, both the source $p_0$ and the target $p_1$ are image distributions.

<div class="block" v-click="1">

## Conditioning on Both Endpoints

Let us choose $\bz=(\bx_0,\bx_1)$. Start with independent endpoints: $p(\bz)=p_0(\bx_0)p_1(\bx_1)$.

$$
p_t(\bx)=\int p_t(\bx|\bx_0,\bx_1)p_0(\bx_0)p_1(\bx_1)d\bx_0d\bx_1
$$

</div>
<div v-click="2">

What are the endpoint distributions $p_0(\bx|\bx_0,\bx_1)$ and $p_1(\bx|\bx_0,\bx_1)$ for a fixed pair $(\bx_0,\bx_1)$?

</div>
<div v-click="3">

**At $t=0$**, the path starts at $\bx_0$. Mixing these point masses over source images recovers $p_0$.

$$
p_0(\bx|\bx_0,\bx_1)=\delta(\bx-\bx_0),\qquad
\bbE_{\bz\sim p(\bz)}\!\left[p_0(\bx|\bz)\right]
=\bbE_{\bx_0\sim p_0}\!\left[\delta(\bx-\bx_0)\right]=p_0(\bx).
$$

</div>
<div v-click="4">

**At $t=1$**, the path ends at $\bx_1$. Mixing these point masses over target images recovers $p_1$.

$$
p_1(\bx|\bx_0,\bx_1)=\delta(\bx-\bx_1),\qquad
\bbE_{\bz\sim p(\bz)}\!\left[p_1(\bx|\bz)\right]
=\bbE_{\bx_1\sim p_1}\!\left[\delta(\bx-\bx_1)\right]=p_1(\bx).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a> · <a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 2
id: two-sided-conditioning
class: theorems
---

# Two-Sided Conditioning

Desired conditional endpoints:

$$
p_0(\bx|\bx_0,\bx_1)=\delta(\bx-\bx_0);\quad p_1(\bx|\bx_0,\bx_1)=\delta(\bx-\bx_1)
$$

<div class="block">

## Gaussian Conditional Probability Path

$$
\begin{aligned}
p_t(\bx|\bx_0,\bx_1)&=\cN\left(\bmu_t(\bx_0,\bx_1),\bsigma_t^2(\bx_0,\bx_1)\right);\\
\bx_t&=\bmu_t(\bx_0,\bx_1)+\bsigma_t(\bx_0,\bx_1)\odot\bepsilon
\end{aligned}
$$

</div>

Here $\bepsilon\sim\cN(\bzero,\bI)$. Positive Gaussian scales give smooth densities;
the desired Dirac endpoints require the endpoint scales to vanish.

<div class="block" v-click="1">

## Straight Paths with Constant Gaussian Smoothing

$$
\bmu_t=t\bx_1+(1-t)\bx_0,\qquad p_t^\sigma(\bx|\bx_0,\bx_1)=\cN(\bmu_t,\sigma^2\bI),\qquad \sigma>0.
$$

</div>
<div v-click="2">

$$
p_i^\sigma(\bx|\bx_0,\bx_1)=\cN(\bx_i,\sigma^2\bI)
\xrightarrow[\sigma\to0]{\text{weakly}}\delta(\bx-\bx_i),\qquad i\in\{0,1\}.
$$

For $\sigma>0$, the marginal endpoints are Gaussian-smoothed versions of $p_0$ and $p_1$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A. et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023.</a> · <a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 1
id: two-sided-conditioning-2
class: theorems interactive-slide
---

# Two-Sided Conditioning

Straight conditional paths with constant Gaussian smoothing $\sigma>0$:

$$
\bmu_t=t\bx_1+(1-t)\bx_0,\qquad p_t^\sigma(\bx|\bx_0,\bx_1)=\cN(\bmu_t,\sigma^2\bI).
$$

$$
\bx_t=\bmu_t+\sigma\bepsilon,\qquad \bepsilon\sim\cN(\bzero,\bI).
$$

<ConditioningDemo v-click="1" />

<div v-click="1">

At $\sigma=0$, the particles for each pair coincide at $\bmu_t$. Their conditional law is the Dirac mass $\delta(\bx-\bmu_t)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A. et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023.</a></div>

---
clicks: 1
id: flow-matching-one-sided-vs-two-sided-conditioning
class: theorems interactive-slide
---

# Flow Matching: One-Sided vs. Two-Sided Conditioning

| Conditioning | Independent noise | Distribution of $\bx_t\mid\bz$ | Sample $\bx_t$ |
| :--- | :---: | :---: | :---: |
| **One-sided** · $\bz=\bx_1$ | $\bx_0\sim\cN(\bzero,\bI)$ | $\cN\!\left(t\bx_1,{\color{teal}(1-t)^2}\bI\right)$ | $t\bx_1+{\color{teal}(1-t)}\bx_0$ |
| **Two-sided** · $\bz=(\bx_0,\bx_1)$ | $\bepsilon\sim\cN(\bzero,\bI)$ | $\cN\!\left(t\bx_1+(1-t)\bx_0,{\color{teal}\sigma^2}\bI\right)$ | $t\bx_1+(1-t)\bx_0+{\color{teal}\sigma}\bepsilon$ |

The one-sided standard deviation shrinks to zero at $t=1$. The two-sided standard deviation stays at $\sigma>0$.

<ConditioningDemo v-click="1" compare />

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 1
id: two-sided-conditioning-vector-field-and-objective
class: theorems
---

# Two-Sided Conditioning: Vector Field and Objective

$$
\begin{aligned}
p_t^\sigma(\bx|\bx_0,\bx_1)&=\cN\left(t\bx_1+(1-t)\bx_0,\sigma^2\bI\right),\qquad\sigma>0;\\
{\color{teal}\bx_t}&={\color{teal}t\bx_1+(1-t)\bx_0+\sigma\bepsilon}
\end{aligned}
$$

<div class="block">

## Conditional Vector Field

Hold the sampled $\bepsilon\sim\cN(\bzero,\bI)$ fixed along the path.

$$
\begin{aligned}
\frac{d\bx_t}{dt}&=\bv(\bx_t,\bx_0,\bx_1,t)\\
&=\bmu_t'(\bx_0,\bx_1)+\frac{\bsigma_t'(\bx_0,\bx_1)}{\bsigma_t(\bx_0,\bx_1)}\odot(\bx_t-\bmu_t(\bx_0,\bx_1))
\end{aligned}
$$

<div v-click="1">

$$
\bv(\bx_t,\bx_0,\bx_1,t)=\bx_1-\bx_0
$$

For $\sigma>0$, the scale is constant in time: $\bsigma_t'=\bzero$.
The resulting target also applies in the deterministic limit.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y. et al. Flow Matching for Generative Modeling, 2022.</a><br><a href="https://arxiv.org/abs/2302.00482">Tong A. et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023.</a></div>

---
clicks: 2
id: two-sided-conditioning-vector-field-and-objective-2
class: theorems
---

# Two-Sided Conditioning: Vector Field and Objective

From now on, use the deterministic limit $\sigma=0$:

$$
\bx_t=t\bx_1+(1-t)\bx_0,\qquad p_t(\bx|\bx_0,\bx_1)=\delta\bigl(\bx-\bx_t\bigr).
$$

<div class="block">

## Conditional Flow Matching

$$ {1-2|all} {at:1}
\begin{aligned}
&\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\\
&=\bbE_{t\sim U[0,1]}\bbE_{(\bx_0,\bx_1)\sim p(\bx_0,\bx_1)}\bbE_{\bx\sim\delta(\cdot-\bx_t)}\left\|(\bx_1-\bx_0)-\bv_{\btheta}(\bx,t)\right\|^2\\
&=\bbE_{t\sim U[0,1]}\bbE_{(\bx_0,\bx_1)\sim p(\bx_0,\bx_1)}\left\|(\bx_1-\bx_0)-\bv_{\btheta}(\bx_t,t)\right\|^2
\end{aligned}
$$

</div>
<div v-click="2">

- With independent $\bx_0\sim\cN(\bzero,\bI)$, this recovers the one-sided training procedure.
- Now, we do not require that $p_0(\bx)$ is necessarily $\cN(0,\bI)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y. et al. Flow Matching for Generative Modeling, 2022.</a><br><a href="https://arxiv.org/abs/2302.00482">Tong A. et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023.</a></div>

---
clicks: 2
id: cfm-with-two-sided-conditioning-training-and-sampling
class: theorems
---

# CFM with Two-Sided Conditioning: Training and Sampling

- One-sided rectified flow draws $\bx_0\sim\cN(0,\bI)$ independently of the data point $\bx_1$.
- Two-sided conditioning can pair samples from any source $p_0$ and target $p_1$, as in style transfer.

<div class="block" v-click="1">

## Training

1. Sample ${\color{teal}(\bx_0,\bx_1)\sim p(\bx_0,\bx_1)}$, $t\sim U[0,1]$.
2. Compute noisy image $\bx_t=t\bx_1+(1-t)\bx_0$.
3. Compute loss $\cL=\left\|(\bx_1-\bx_0)-\bv_{\btheta}(\bx_t,t)\right\|^2$.

</div>

<div class="block" v-click="2">

## Sampling

1. Sample $\bx_0\sim {\color{teal}p_0(\bx)}$.
2. Solve the ODE to obtain $\bx_1$:

$$
\bx_1=\bpsi_1(\bx_0)=\ODESolve_v(\bx_0,\btheta,t_0=0,t_1=1).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a> · <a href="https://arxiv.org/abs/2302.00482">Tong A. et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023.</a></div>

---
clicks: 3
id: choosing-endpoint-pairs
class: theorems interactive-slide
---

# Choosing Endpoint Pairs

A **coupling** $p(\bx_0,\bx_1)$ pairs endpoints while keeping marginals $p_0$ and $p_1$.

<CouplingDemo :stage="$clicks" />

<div v-click="3">

$$
\tau^*=\argmin_{\tau\in S_B}\sum_{i=1}^B\left\|\bx_0^{(i)}-\bx_1^{(\tau(i))}\right\|_2^2.
$$

$S_B$: permutations of a batch of size $B$. Optimality is within each batch, not over the full distributions.

**Same training rule:** $\bx_t=(1-t)\bx_0+t\bx_1$, with velocity target $\bx_1-\bx_0$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A. et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023.</a></div>

---
clicks: 0
id: outline-3
section: "Link between Flow Matching and Score-Based Models"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Flow Matching<div class="outline-sub">Two-Sided Conditioning<br><strong>Link between Flow Matching and Score-Based Models</strong></div></div></div>
<div class="outline-item"><span>02</span><div>Discrete Diffusion<div class="outline-sub">Forward Discrete Process<br>Reverse Diffusion Process</div></div></div>

</div>

---
clicks: 1
id: score-based-generative-models-through-sdes
class: theorems
---

# Score-Based Generative Models through SDEs

<div class="block">

## Training Objective

$$
\bbE_{\pd(\bx(0))}\bbE_{t\sim U[0,1]}\bbE_{q(\bx(t)|\bx(0))}\bigl\|\bs_{\btheta}(\bx(t),t)-{\color{teal}\nabla_{\bx(t)}\log q(\bx(t)|\bx(0))}\bigr\|_2^2
$$

</div>
<div v-click="1">
<div class="block">

## Variance Exploding SDE (NCSN)

$$
q(\bx(t)|\bx(0))=\cN\left(\bx(0),\left[\sigma^2(t)-\sigma^2(0)\right]\cdot\bI\right),\quad\sigma(0)=0
$$

</div>
<div class="block">

## Variance Preserving SDE (DDPM)

$$
\begin{aligned}
q(\bx(t)|\bx(0))&=\cN\left(\bx(0)\alpha(t),\left(1-\alpha(t)^2\right)\cdot\bI\right);\\
\alpha(t)&=e^{-\frac{1}{2}\int_0^t\beta(s)ds}
\end{aligned}
$$

</div>

Forward diffusion adds noise to a data point $\bx_0$ as $t$ increases from $0$ to $1$.

Flow matching runs from noise to the same data point $\bx_1$, so its time $t$ corresponds to diffusion time $1-t$.

$$
p_t(\bx|\bx_1)=q_{1-t}(\bx|\bx_0=\bx_1)
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 2
id: score-based-generative-models-through-sdes-3
class: theorems
---

# From Gaussian Paths to Conditional Vector Fields

Flow matching time $t$ corresponds to diffusion time $1-t$, so $p_t(\bx|\bx_1)=q_{1-t}(\bx|\bx_0=\bx_1)$.

<div class="columns mt-4 mb-6 text-center">
<section>

## VE (NCSN)

$$
p_t(\bx|\bx_1)=\cN\left(\bx_1,\sigma_{1-t}^2\bI\right)
$$

</section>
<section>

## VP (DDPM)

$$
p_t(\bx|\bx_1)=\cN\left(\alpha_{1-t}\bx_1,\left(1-\alpha_{1-t}^2\right)\bI\right)
$$

</section>
</div>

<div v-click="1">
<div class="block">

## Straight Path in Flow Matching

$$
p_t(\bx|\bx_1)=\cN\left(t\bx_1,(1-t)^2\bI\right)
\quad\Rightarrow\quad
\bv(\bx_t,\bx_1,t)=\frac{\bx_1-\bx_t}{1-t}
$$

</div>
<div class="block">

## Vector Field from the Mean and Noise Scale

$$
\frac{d\bx_t}{dt}=\bv(\bx_t,\bx_1,t)=\bmu_t'(\bx_1)+\frac{\bsigma_t'(\bx_1)}{\bsigma_t(\bx_1)}\odot(\bx_t-\bmu_t(\bx_1))
$$

</div>
</div>
<div v-click="2">

- Both VE and VP have **Gaussian conditional paths**.
- Use each path’s mean $\bmu_t$ and noise scale $\bsigma_t$ in the formula to obtain a conditional vector field $\bv$.
- In both cases, $\bv$ is the velocity of the conditional probability flow ODE from noise to data.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 3
id: flow-matching-vs-score-based-sde-models
class: theorems
---

# Flow Matching vs Score-Based SDE Models

Fix a data point $\bx_1$ and a noise draw $\bepsilon\sim\cN(\bzero,\bI)$. For $0\le t<1$,

$$
\frac{d\bx_t}{dt}=\bv(\bx_t,\bx_1,t)=\bmu_t'(\bx_1)+\frac{\bsigma_t'(\bx_1)}{\bsigma_t(\bx_1)}\odot(\bx_t-\bmu_t(\bx_1))
$$

<table>
<thead>
<tr>
<th scope="col">Gaussian path</th>
<th scope="col">

Trajectory $\bx_t$

</th>
<th scope="col">

Conditional velocity $\bv(\bx_t,\bx_1,t)$

</th>
</tr>
</thead>
<tbody>
<tr>
<th scope="row">VE</th>
<td>

$\bx_1+\sigma_{1-t}\bepsilon$

</td>
<td>

$-\dfrac{\sigma'_{1-t}}{\sigma_{1-t}}(\bx_t-\bx_1)=-\sigma'_{1-t}\bepsilon$

</td>
</tr>
<tr v-click="1">
<th scope="row">VP</th>
<td>

$\alpha_{1-t}\bx_1+\sqrt{1-\alpha_{1-t}^2}\,\bepsilon$

</td>
<td>

$\dfrac{\alpha'_{1-t}}{1-\alpha_{1-t}^2}(\alpha_{1-t}\bx_t-\bx_1)$

</td>
</tr>
<tr v-click="2">
<th scope="row">Straight FM</th>
<td>

$(1-t)\bx_0+t\bx_1,\quad \bx_0=\bepsilon$

</td>
<td>

$\dfrac{\bx_1-\bx_t}{1-t}=\bx_1-\bx_0$

</td>
</tr>
</tbody>
</table>

<div class="takeaway" v-click="3">

With the usual VE and VP schedules, $\bx_t$ is **nonlinear in $t$** and its velocity varies along the path.<br>
Flow matching can use either Gaussian path or a **linear interpolation** with **constant velocity** $\bx_1-\bx_0$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 1
id: flow-matching-vs-score-based-sde-models-2
class: theorems
---

# Flow Matching vs Score-Based SDE Models

<div class="block">

## Trajectories

<img src="/figs/trajectories.png" alt="Flow matching, VE and VP trajectories" style="width:100%;height:215px;object-fit:contain" />

</div>
<img v-click="1" src="/figs/2d-generation.png" alt="Two-dimensional generation along different probability paths" style="width:100%;height:220px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: outline-4
section: "Discrete Diffusion"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Flow Matching<div class="outline-sub">Two-Sided Conditioning<br>Link between Flow Matching and Score-Based Models</div></div></div>
<div class="outline-item current"><span>02</span><div>Discrete Diffusion<div class="outline-sub">Forward Discrete Process<br>Reverse Diffusion Process</div></div></div>

</div>

---
clicks: 0
id: generative-models-taxonomy
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" discrete-diffusion />

---
clicks: 1
id: discrete-or-continuous-diffusion-models
class: theorems
---

# Discrete or Continuous Diffusion Models?

**Reminder:** Diffusion models define a forward corruption process and a reverse denoising process.
Previously, we studied diffusion models with continuous states $\bx(t)\in\bbR^m$.

<div class="block">

## Continuous state space

- **Discrete time** $t\in\{0,1,\ldots,T\}$ $\;\Rightarrow\;$ **DDPM / NCSN**.
- **Continuous time** $t\in[0,1]$ $\;\Rightarrow\;$ **Score-based SDE models**.

</div>
<div v-click="1">

Now we turn to diffusion over discrete-value states $\bx(t)\in\{1,\dots,K\}^m$.

<div class="block">

## Discrete state space

- **Discrete time** $t\in\{0,1,\ldots,T\}$.
- **Continuous time** $t\in[0,1]$.

</div>

Let's discuss why we need discrete diffusion models.

</div>

---
clicks: 5
id: why-discrete-diffusion-models
class: theorems
---

# Why Discrete Diffusion Models?

<div class="block" v-click="1">

## Potential advantages over left-to-right autoregressive generation

<ul>
<li><strong>Parallel generation:</strong> generate multiple tokens per step, potentially reducing sequential decoding steps.</li>
<li v-click="2"><strong>Bidirectional context:</strong> use available context on both sides when predicting a token.</li>
<li v-click="3"><strong>Flexible generation order:</strong> choose which positions to generate next, including confidence-based ordering.</li>
<li v-click="4"><strong>Infilling and controllability:</strong> fill arbitrary gaps, preserve specified tokens, and steer sampling with guidance.</li>
<li v-click="5"><strong>Iterative refinement:</strong> revisit generated tokens when the sampler supports remasking or corrective updates.</li>
</ul>

</div>

<div class="source"><a href="https://arxiv.org/abs/2502.09992">Nie S. et al. Large language diffusion models, 2025.</a> <a href="https://arxiv.org/abs/2505.22618">Wu C. et al. Fast-dLLM, 2025.</a><br><a href="https://arxiv.org/abs/2412.10193">Schiff Y. et al. Simple guidance mechanisms for discrete diffusion models, 2025.</a> <a href="https://arxiv.org/abs/2503.00307">Wang G. et al. Remasking discrete diffusion models with inference-time scaling, 2025.</a></div>

---
clicks: 3
id: 2025-big-bang-of-discrete-diffusion-models
class: figure-slide
---

# Diffusion Language Models: DiffusionGemma

<img src="/figs/diffusiongemma-speed-quality.webp" alt="DiffusionGemma and Gemma 4: benchmark quality versus output speed on one H100, FP8, batch size 1" class="figure-bottom figure-tall" />

<ul>
<li v-click="1"><strong>Parallel generation:</strong> generate multiple tokens at each denoising step.</li>
<li v-click="2"><strong>Practical speed:</strong> over 1,000 output tokens per second on a single H100.</li>
</ul>

<div class="takeaway" v-click="3">

How do we define corruption and denoising for discrete tokens?

</div>

<div class="source">1× H100 · FP8 · batch size 1.<br><a href="https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/">O'Donoghue B., Flennerhag S. DiffusionGemma: 4x faster text generation, 2026.</a></div>

---
clicks: 0
id: outline-5
section: "Forward Discrete Process"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Flow Matching<div class="outline-sub">Two-Sided Conditioning<br>Link between Flow Matching and Score-Based Models</div></div></div>
<div class="outline-item current"><span>02</span><div>Discrete Diffusion<div class="outline-sub"><strong>Forward Discrete Process</strong><br>Reverse Diffusion Process</div></div></div>

</div>

---
clicks: 2
id: forward-discrete-process
class: theorems
---

# Forward Discrete Process

<div class="block">

## Continuous Diffusion Markov Chain

In continuous diffusion, the forward Markov chain is defined by progressively corrupting data with Gaussian noise:

$$
q(\bx_t|\bx_{t-1})=\cN(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI).
$$

</div>
<div class="block" v-click="1">

## Discrete Diffusion Markov Chain

We start with a single token (sequence length $m=1$) from a vocabulary of size $K$.

$$
q(\bx_t|\bx_{t-1})=\Cat(\bQ_t\bx_{t-1}).
$$

</div>
<div v-click="2">

- Each $\bx_t\in\{0,1\}^K$ is a **one-hot vector** encoding the categorical state.
- The continuous chain approaches $\cN(\bzero,\bI)$. What distribution could the discrete chain approach?
- What is the transition matrix $\bQ_t$?

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 4
id: forward-process-over-time
class: theorems
---

# Forward Process over Time

<div class="block">

## Transition Matrix

$\bQ_t\in[0,1]^{K\times K}$ is a **transition matrix** where each column gives transition probabilities from one state to all others, and columns sum to 1:

$$
[\bQ_t]_{ij}=q(x_t=i|x_{t-1}=j),\qquad\sum_{i=1}^K[\bQ_t]_{ij}=1.
$$

</div>
<ul>
<li v-click="1">The forward diffusion gradually destroys information through repeated random transitions.</li>
<li v-click="2">

Applying the transition $t$ times yields the marginal distribution:

$$
q(\bx_t|\bx_0)=\Cat(\bQ_{1:t}\bx_0),\qquad\bQ_{1:t}=\bQ_t\bQ_{t-1}\cdots\bQ_1.
$$

</li>
<li v-click="3">

As $t\to T$, the process drives the data toward a stationary distribution.

</li>
<li v-click="4">

We design the transition matrices $\bQ_t$ to achieve this behavior.

</li>
</ul>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 5
id: transition-matrix
class: theorems
---

# Transition Matrix

<ul>
<li>

The choice of $\bQ_t$ determines how information is erased and what the stationary distribution becomes.

</li>
<li v-click="1">

$\bQ_t$ and $\bQ_{1:t}$ should be easy to compute for each $t$.

</li>
</ul>
<div class="block" v-click="2">

## Common choices

<ul>
<li>

**Uniform diffusion.** With probability $\beta_t$, draw a symbol uniformly ($\bU_{ij}=1/K$).

$$
\bQ_t=(1-\beta_t)\bI+\beta_t\bU.
$$

<div v-click="3">

$$
\bQ_{1:t}\bx_0=\bar\alpha_t\bx_0+(1-\bar\alpha_t)\frac{\bone}{K}
\xrightarrow{\bar\alpha_t\to0}\frac{\bone}{K}.
$$

Here $\bar\alpha_t=\prod_{s=1}^t(1-\beta_s)$ is the probability of no replacement in the first $t$ steps.

</div>
</li>
<li v-click="4">

**Absorbing diffusion.** With probability $\beta_t$, replace the token by the mask $m$.

$$
\bQ_t=(1-\beta_t)\bI+\beta_t\,\be_m\bone^\top.
$$

<div v-click="5">

$$
\bQ_{1:t}\bx_0=\bar\alpha_t\bx_0+(1-\bar\alpha_t)\be_m
\xrightarrow{\bar\alpha_t\to0}\be_m.
$$

</div>
</li>
</ul>
</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 2
id: transition-matrix-2
class: theorems interactive-slide
---

# Transition Matrix

$$
q(\bx_t|\bx_0)=\Cat(\bQ_{1:t}\bx_0).
$$

<div v-click="1">

## Uniform Diffusion

$$
\bQ_t=(1-\beta_t)\bI+\beta_t\bU,\quad\bU_{ij}=\tfrac1K;\qquad
\bQ_{1:t}=\bar\alpha_t\bI+(1-\bar\alpha_t)\bU,\quad\bar\alpha_t=\prod_{s=1}^t(1-\beta_s).
$$

</div>

<DiscreteTransitionDemo v-click="2" mode="uniform" />

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 1
id: transition-matrix-3
class: theorems interactive-slide
---

# Transition Matrix

## Absorbing Diffusion

$$
\bQ_t=(1-\beta_t)\bI+\beta_t\,\be_m\bone^\top,\qquad
\bQ_{1:t}=\bar\alpha_t\bI+(1-\bar\alpha_t)\be_m\bone^\top,\quad\bar\alpha_t=\prod_{s=1}^t(1-\beta_s).
$$

<DiscreteTransitionDemo v-click="1" mode="absorbing" />

<div v-click="1">

As $\bar\alpha_t\to0$, all probability moves to the mask: $q(\bx_T)\approx\Cat(\be_m)$.
This connects diffusion to **masked language modeling**.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 1
id: uniform-vs-absorbing-transition-matrix
class: theorems
---

# Uniform vs. Absorbing Transition Matrix

| Aspect | Uniform Diffusion | Absorbing Diffusion |
|---|---|---|
| $\bQ_t$ | $(1-\beta_t)\bI+\beta_t\bU$ | $(1-\beta_t)\bI+\beta_t\be_m\bone^\top$ |
| $\bQ_{1:t}$ | $\bar\alpha_t\bI+(1-\bar\alpha_t)\bU$ | $\bar\alpha_t\bI+(1-\bar\alpha_t)\be_m\bone^\top$ |
| $\bQ_{1:\infty}$, $\bar\alpha_t\to0$ | $\bU$ | $\be_m\bone^\top$ |
| Limiting token distribution | $\Cat(\bone/K)$, all $K$ tokens equally likely | $\Cat(\be_m)$, mask $m$ with probability $1$ |
| Interpretation | Random replacement | Gradual masking of tokens |
| Application | Image diffusion | Text diffusion $\approx$ Masked LM |

<div class="block" v-click="1">

## Observation

Both schemes gradually destroy information, but differ in their stationary limit.
Absorbing diffusion bridges diffusion and masked-language-model objectives.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
id: outline-6
section: "Reverse Diffusion Process"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Flow Matching<div class="outline-sub">Two-Sided Conditioning<br>Link between Flow Matching and Score-Based Models</div></div></div>
<div class="outline-item current"><span>02</span><div>Discrete Diffusion<div class="outline-sub">Forward Discrete Process<br><strong>Reverse Diffusion Process</strong></div></div></div>

</div>

---
clicks: 3
id: posterior-of-the-forward-process
class: theorems
---

# Posterior of the Forward Process

<div class="block">

## ELBO

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)
&={\color{olive}\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}-{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}\\
&\quad-{\color{teal}\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}}
\end{aligned}
$$

</div>
<ul>
<li v-click="1">This ELBO derivation applies to discrete-time Markov chains with continuous or discrete states.</li>
<li v-click="2">

As in continuous-state diffusion, the target in $\cL_t$ is the posterior $q(\bx_{t-1}|\bx_t,\bx_0)$ over the previous state given the noisy state $\bx_t$ and the clean input $\bx_0$.

</li>
<li v-click="3">For discrete states, the forward transition matrices give this posterior in closed form.</li>
</ul>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 4
id: posterior-of-the-forward-process-2
class: theorems
---

# Posterior of the Forward Process

<div class="block">

## Discrete conditioned reverse distribution

$$ {1|all} {at:1}
\begin{aligned}
q(\bx_{t-1}|\bx_t,\bx_0)
&=\frac{q(\bx_t|\bx_{t-1},\bx_0)\,q(\bx_{t-1}|\bx_0)}{q(\bx_t|\bx_0)}\\
&=\frac{(\bx_t^\top\bQ_t\bx_{t-1})(\bx_{t-1}^\top\bQ_{1:t-1}\bx_0)}
        {\bx_t^\top\bQ_{1:t}\bx_0}.
\end{aligned}
$$

<div v-click="2">

$$
q(\bx_{t-1}|\bx_t,\bx_0)=\Cat\left(\frac{\bQ_t^\top\bx_t\odot\bQ_{1:t-1}\bx_0}{\bx_t^\top\bQ_{1:t}\bx_0}\right).
$$

</div>
</div>
<div v-click="3">

Recall the ELBO term

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\,\|\,\pt(\bx_{t-1}|\bx_t)\bigr),
$$

</div>
<div v-click="4">

- Both $q(\bx_{t-1}|\bx_t,\bx_0)$ and $q(\bx_t|\bx_0)$ are known analytically from the forward process.
- The reverse process $\pt(\bx_{t-1}|\bx_t)$ is a learned categorical distribution:

$$
\pt(\bx_{t-1}|\bx_t)=\Cat\bigl(\bpi_{\btheta}(\bx_t,t)\bigr),
$$

where $\bpi_{\btheta}$ is a neural network.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 4
id: discrete-time-elbo-for-discrete-diffusion
class: theorems
---

# Discrete-time ELBO for Discrete Diffusion

<div class="block">

## ELBO term

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\,\|\,\pt(\bx_{t-1}|\bx_t)\bigr).
$$

</div>
<div class="block" v-click="1">

## Categorical KL

$$
\KL\bigl(\Cat(\bq)\,\|\,\Cat(\bp)\bigr)=\sum_{k=1}^Kq_k\log\frac{q_k}{p_k}=\Ent(\bq,\bp)-\Ent(\bq).
$$

<div v-click="2">

- $\Ent\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\bigr)$ is a constant w.r.t. $\btheta$.
- $\Ent(\bq,\bp)=-\sum_kq_k\log p_k$ is a **cross-entropy loss**.

</div>
</div>
<div v-click="3">

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\Ent\Bigl(q(\bx_{t-1}|\bx_t,\bx_0),\,\pt(\bx_{t-1}|\bx_t)\Bigr)+\text{const},
\qquad t=2,\ldots,T.
$$

</div>
<div class="takeaway" v-click="4">

In discrete diffusion, $\cL_t$ is the **expected cross-entropy** between the forward posterior and the reverse model's prediction for the token at step $t-1$, plus a constant independent of $\btheta$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
id: summary
class: summary
---

# Summary

<ul>

<li>

Two-sided conditioning supports independent pairs, paired data and minibatch OT couplings. The coupling changes pair sampling while preserving the interpolation and velocity target.

</li>

<li>

VE and VP diffusion correspond to particular Gaussian probability paths in flow matching.

</li>

<li>

Discrete diffusion offers parallel generation and flexible conditioning; token revision requires a suitable sampler.

</li>

<li>

Forward discrete diffusion process defines a Markov chain with discrete states; uniform and absorbing transitions make it tractable.

</li>

<li>

The discrete ELBO contains categorical KL terms; their parameter-dependent parts are cross-entropies against the forward posterior.

</li>

</ul>
