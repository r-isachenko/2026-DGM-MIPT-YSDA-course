---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 11"
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
sourceFrame: "1"
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 11</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
class: theorems
---

# Recap of Previous Lecture

$$
d\bx=\bff(\bx,t)dt+g(t)d\bw
$$

<div class="block">

## Variance Exploding SDE (NCSN)

$$
d\bx=\sqrt{\frac{d[\sigma^2(t)]}{dt}}\cdot d\bw,\quad\bff(\bx,t)=0,\quad g(t)=\sqrt{\frac{d[\sigma^2(t)]}{dt}}
$$

The variance grows since $\sigma(t)$ is a monotonically increasing function.

</div>
<div class="block">

## Variance Preserving SDE (DDPM)

$$
\begin{aligned}
d\bx&=-\frac12\beta(t)\bx(t)dt+\sqrt{\beta(t)}\cdot d\bw\\
\bff(\bx,t)&=-\frac12\beta(t)\bx(t),\quad g(t)=\sqrt{\beta(t)}
\end{aligned}
$$

The variance is preserved if $\bx(0)$ has unit variance.

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Probability Flow ODE

Suppose the SDE $d\bx=\bff(\bx,t)dt+g(t)d\bw$ induces the probability path $p_t(\bx)$ with $p_t(\bx)>0$. Then, there exists an ODE with the same probability path $p_t(\bx)$, given by

$$
d\bx=\bv(\bx,t)dt=\left(\bff(\bx,t)-\frac12g^2(t)\frac{\partial}{\partial\bx}\log p_t(\bx)\right)dt
$$

</div>
<img src="/figs/probability_flow.png" alt="Probability flow ODE and SDE share a probability path" style="width:100%;height:235px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
sourceFrame: "4"
class: theorems
---

# Recap of Previous Lecture

$$
d\bx=\bv(\bx,t)dt,\quad\bx(t+dt)=\bx(t)+\bv(\bx,t)dt
$$

<div class="block">

## Reverse ODE

Let $\tau=1-t$ ($d\tau=-dt$):

$$
d\bx=-\bv(\bx,1-\tau)d\tau
$$

</div>
<div class="block">

## Reverse SDE

There exists a reverse SDE for $d\bx=\bff(\bx,t)dt+g(t)d\bw$ (assume $p_t(\bx)>0$), given by:

$$
d\bx=\left(\bff(\bx,t){\color{#8854c0}-g^2(t)\frac{\partial}{\partial\bx}\log p_t(\bx)}\right)dt+g(t)d\bar{\bw}
$$

where $dt<0$ and $\bar{\bw}(t)$ is a reverse-time Wiener process.

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
sourceFrame: "extension: 4"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Proof Sketch

- Convert the initial SDE to a probability flow ODE.
- Reverse the probability flow ODE.
- Convert the reversed probability flow ODE back to an SDE.

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
sourceFrame: "5"
class: theorems
---

# Recap of Previous Lecture

$$
d\bx=\bff(\bx,t)dt+g(t)d\bw
$$

$$
\bv(\bx,t)=\bff(\bx,t)-\frac12g^2(t)\bs(\bx,t),\quad\text{where}\quad\bs(\bx,t)=\nabla_{\bx}\log p_t(\bx)
$$

$$
\begin{aligned}
d\bx&=\bv(\bx,t)dt&&-\textbf{Probability Flow ODE}\\
d\bx&=\bigl({\color{#8854c0}\bv(\bx,t)-\frac12g^2(t)\bs(\bx,t)}\bigr)dt+g(t)d\bar{\bw}&&-\textbf{Reverse SDE}
\end{aligned}
$$

<img src="/figs/sde.png" alt="Forward SDE, reverse SDE, and probability flow ODE" style="width:100%;height:250px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
sourceFrame: "6"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Discrete-Time Objective

$$
\bbE_{\pd(\bx_0)}\bbE_{t\sim U\{1,T\}}\bbE_{q(\bx_t|\bx_0)}\bigl\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx_0)\bigr\|_2^2
$$

</div>
<div class="block">

## Continuous-Time Objective

$$
\bbE_{\pd(\bx(0))}\bbE_{t\sim U[0,1]}\bbE_{q(\bx(t)|\bx(0))}\bigl\|\bs_{\btheta}(\bx(t),t)-{\color{teal}\nabla_{\bx(t)}\log q(\bx(t)|\bx(0))}\bigr\|_2^2
$$

</div>
<div class="block">

## NCSN

$$
q(\bx(t)|\bx(0))=\cN\left(\bx(0),[\sigma^2(t)-\sigma^2(0)]\cdot\bI\right)
$$

</div>
<div class="block">

## DDPM

$$
q(\bx(t)|\bx(0))=\cN\left(\bx(0)e^{-\frac12\int_0^t\beta(s)ds},\left(1-e^{-\int_0^t\beta(s)ds}\right)\cdot\bI\right)
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
sourceFrame: "7"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Sampling

1. Sample $\bx(1)\sim\cN(0,\bI)$.
2. Solve the reverse SDE using numerical solvers ($\SDESolve$).

<img src="/figs/sbgm.png" alt="Score-based generative model sampling" style="width:100%;height:240px;object-fit:contain" />

</div>

- Discretizing the reverse SDE provides ancestral sampling.
- Discretizing the probability flow ODE yields deterministic sampling.

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
sourceFrame: "8"
class: theorems
---

# Recap of Previous Lecture

Consider ODE dynamics $\bx_t=\bx(t)$ in the interval $t\in[0,1]$ with $\bx_0\sim p_0(\bx)$ (mostly $\cN(0,\bI)$), $\bx_1\sim p_1(\bx)=\pd(\bx)$.

$$
\frac{d\bx_t}{dt}=\bv(\bx_t,t),\quad\text{with initial condition }\bx(0)=\bx_0.
$$

<div class="block">

## KFP Theorem (Continuity Equation)

$$
\begin{aligned}
\frac{\partial p_t(\bx)}{\partial t}&=-\diver\left(\bv(\bx,t)p_t(\bx)\right)\\
&\Leftrightarrow\quad\frac{d\log p_t(\bx(t))}{dt}=-\tr\left(\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}\right)
\end{aligned}
$$

</div>

- It's hard to solve the continuity equation directly due to the trace term.
- There's a method (the adjoint method) that solves this equation directly, but it's unstable and unscalable.

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
sourceFrame: "extension: 8"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Flow Matching

$$
\bbE_{t\sim U[0,1]}\bbE_{\bx\sim p_t(\bx)}\left\|\bv(\bx,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

Flow matching is a scalable approach to Neural ODEs.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
sourceFrame: "9"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item "><span>02</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Conditional Flow Matching (CFM)"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item "><span>02</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 0
sourceFrame: "10"
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" flow-matching />

---
clicks: 0
sourceFrame: "auto: CFM Objective"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item "><span>02</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 2
sourceFrame: "11"
class: theorems
---

# Flow Matching

Let's introduce the latent variable $\bz$:

$$
p_t(\bx)=\int p_t(\bx|\bz)p(\bz)d\bz
$$

Here, $p_t(\bx|\bz)$ is a **conditional probability path**.

<div v-click="1">

The conditional probability path $p_t(\bx|\bz)$ satisfies the KFP theorem:

$$
\frac{\partial p_t(\bx|\bz)}{\partial t}=-\diver\left(\bv(\bx,\bz,t)p_t(\bx|\bz)\right),
$$

where $\bv(\bx,\bz,t)$ is a **conditional vector field**:

</div>
<div v-click="2">

$$
\frac{d\bx_t}{dt}=\bv(\bx_t,t)\quad\Rightarrow\quad\frac{d\bx_t}{dt}=\bv(\bx_t,\bz,t)
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 1
sourceFrame: "12"
class: theorems
---

# Conditional Vector Field

$$
{\color{#8854c0}\frac{\partial p_t(\bx|\bz)}{\partial t}=-\diver\left(\bv(\bx,\bz,t)p_t(\bx|\bz)\right)},
$$

What's the relationship between $\bv(\bx,t)$ and $\bv(\bx,\bz,t)$?

<div class="block" v-click="1">

## Theorem

The following vector field generates the probability path $p_t(\bx)$:

$$
\bv(\bx,t)=\bbE_{p_t(\bz|\bx)}\bv(\bx,\bz,t)={\color{teal}\int\bv(\bx,\bz,t)}\frac{{\color{teal}p_t(\bx|\bz)p(\bz)}}{p_t(\bx)}{\color{teal}d\bz}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 4
sourceFrame: "extension: 12"
class: derivation
---

# Conditional Vector Field

<div class="block">

## Proof

$$ {1|1-2|1-3|1-4|all} {at:1}
\begin{aligned}
\frac{\partial p_t(\bx)}{\partial t}&=\frac{\partial}{\partial t}\int p_t(\bx|\bz)p(\bz)d\bz\\
&=\int\left({\color{#8854c0}\frac{\partial p_t(\bx|\bz)}{\partial t}}\right)p(\bz)d\bz\\
&=\int\left({\color{#8854c0}-\diver\left(\bv(\bx,\bz,t)p_t(\bx|\bz)\right)}\right)p(\bz)d\bz\\
&=-\diver\left({\color{teal}\int\bv(\bx,\bz,t)p_t(\bx|\bz)p(\bz)d\bz}\right)\\
&=-\diver\left(\bv(\bx,t)p_t(\bx)\right)
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 2
sourceFrame: "13"
class: theorems
---

# Flow Matching

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

</div>
<div class="block" v-click="1">

## Theorem

If $\supp(p_t(\bx))=\bbR^m$, then the optimal value of the FM objective equals the optimal value of the CFM objective.

</div>
<div class="block" v-click="2">

## Proof

This can be proved in a similar way as in the denoising score matching theorem.

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 1
sourceFrame: "14"
class: derivation
---

# Conditional Flow Matching

<div class="block">

## Theorem

$$
\begin{aligned}
&\argmin_{\btheta}\bbE_{t\sim U[0,1]}\bbE_{\bx\sim p_t(\bx)}\left\|\bv(\bx,t)-\bv_{\btheta}(\bx,t)\right\|^2\\
&\quad=\argmin_{\btheta}\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2
\end{aligned}
$$

</div>
<div class="block" v-click="1">

## Proof

$$
\begin{aligned}
&\bbE_{\bx\sim p_t(\bx)}\left\|\bv(\bx,t)-\bv_{\btheta}(\bx,t)\right\|^2\\
&\quad={\color{olive}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}}\left[\|\bv_{\btheta}(\bx,t)\|^2-2{\color{teal}\bv_{\btheta}^\top(\bx,t)\bv(\bx,t)}\right]+\text{const}(\btheta)
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 2
sourceFrame: "extension: 14"
class: derivation
---

# Conditional Flow Matching

<div class="block">

## Proof (continued)

$$ {1-2|1-3|all} {at:1}
\begin{aligned}
&\bbE_{p_t(\bx)}\left[{\color{teal}\bv_{\btheta}^\top(\bx,t)\bv(\bx,t)}\right]\\
&\quad=\int p_t(\bx)\left[\bv_{\btheta}^\top(\bx,t)\left(\int p_t(\bz|\bx)\bv(\bx,\bz,t)d\bz\right)\right]d\bx\\
&\quad=\int\!\int{\color{#8854c0}p_t(\bx)p_t(\bz|\bx)}\left[\bv_{\btheta}^\top(\bx,t)\bv(\bx,\bz,t)\right]d\bz d\bx\\
&\quad={\color{#8854c0}\bbE_{p(\bz)}\bbE_{p_t(\bx|\bz)}}\left[\bv_{\btheta}^\top(\bx,t)\bv(\bx,\bz,t)\right]
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 2
sourceFrame: "15"
class: theorems
---

# Conditional Flow Matching: Training and Sampling

$$
\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

$$
\bbE_{p(\bz)}p_0(\bx|\bz)=\cN(0,\bI);\quad\bbE_{p(\bz)}p_1(\bx|\bz)=\pd(\bx).
$$

<div class="block" v-click="1">

## Training

1. Sample $t\sim U[0,1]$, $\bz\sim p(\bz)$, $\bx_t\sim p_t(\bx|\bz)$.
2. Compute loss $\cL=\left\|\bv(\bx_t,\bz,t)-\bv_{\btheta}(\bx_t,t)\right\|^2$.

</div>
<div class="block" v-click="2">

## Sampling

1. Sample $\bx_0\sim\cN(0,\bI)$.
2. Solve the ODE to obtain $\bx_1$:

$$
\bx_1=\bpsi_1(\bx_0)=\ODESolve_v(\bx_0,\btheta,t_0=0,t_1=1).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 2
sourceFrame: "16"
class: theorems
---

# Marginal-to-Conditional: Scores vs Velocities

<div class="block">

## Denoising Score Matching

$$
\bbE_{\pd(\bx)}\bbE_{q(\bx_\sigma|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_\sigma)-\nabla_{\bx_\sigma}\log q(\bx_\sigma|\bx)\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>

Optimal predictor:

$$
\bs_{\btheta^*,\sigma}(\bx_\sigma)=\bbE_{q(\bx|\bx_\sigma)}\left[\nabla_{\bx_\sigma}\log q(\bx_\sigma|\bx)\right]=\nabla_{\bx_\sigma}\log q(\bx_\sigma)
$$

<div v-click="1">
<div class="block">

## Conditional Flow Matching

$$
\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

</div>

Optimal predictor: $\bv_{\btheta^*}(\bx,t)=\bbE_{p_t(\bz|\bx)}\bv(\bx,\bz,t)=\bv(\bx,t)$.

</div>
<div v-click="2">

In both cases, the optimal MSE predictor is the posterior mean of the **conditional** target, which equals the intractable **marginal** quantity (score or velocity).

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 0
sourceFrame: "auto: Conditional Probability Paths"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item "><span>02</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 3
sourceFrame: "17"
class: theorems
---

# Conditional Flow Matching: Continuity Equations

<div class="block">

## Continuity Equations

$$
\begin{aligned}
\frac{\partial p_t(\bx)}{\partial t}&=-\diver\left(\bv(\bx,t)\cdot p_t(\bx)\right)\\
\frac{\partial p_t(\bx|\bz)}{\partial t}&=-\diver\left(\bv(\bx,\bz,t)\cdot p_t(\bx|\bz)\right)
\end{aligned}
$$

</div>

What is the relationship between $p_t(\bx)$ and $\bv(\bx,t)$?

<ul>
<li v-click="1">

$\bv(\bx,t)$ (under regularity conditions) and initial condition $p_0(\bx)$ uniquely determine $p_t(\bx)$.

</li>
<li v-click="2">

But the reverse is not true: any divergence-free vector field $\diver(\tilde{\bv}(\bx,t)p_t(\bx))=0$ can generate a valid probability path.

</li>
<li v-click="3">

Moreover, not every given path $p_t(\bx)$ can actually arise from particles moving under some velocity field $\bv(\bx,t)$.

</li>
</ul>

<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

---
clicks: 3
sourceFrame: "18"
class: theorems
---

# Conditional Flow Matching: Paths and Vector Fields

<div class="block">

## Probability Paths

$$
p_t(\bx)=\int p_t(\bx|\bz)p(\bz)d\bz
$$

</div>
<div v-click="1">

- $p_t(\bx|\bz)$ and $p(\bz)$ uniquely determine $p_t(\bx)$.
- The reverse is not true: many different conditional families integrate to the same marginal.

</div>
<div class="block" v-click="2">

## Vector fields

$$
\bv(\bx,t)=\bbE_{p_t(\bz|\bx)}\bv(\bx,\bz,t)=\int\bv(\bx,\bz,t)\frac{p_t(\bx|\bz)p(\bz)}{p_t(\bx)}d\bz
$$

</div>
<div v-click="3">

- $\bv(\bx,\bz,t)$ and $p_t(\bx|\bz)$ uniquely determine $\bv(\bx,t)$.
- But marginal velocity does not determine conditional velocities (many decompositions exist).

</div>

<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

---
clicks: 1
sourceFrame: "19"
class: theorems
---

# From Marginal to Conditional Paths

<img src="/figs/cfm_uncond_to_cond.png" alt="From marginal paths to conditional paths" style="width:100%;height:275px;object-fit:contain" />

<div class="block" v-click="1">

## Open Questions

- **Q1** How should we choose the convenient conditioning latent variable $\bz$?
- **Q2** How can we parametrize $p_t(\bx)$ (or $p_t(\bx|\bz)$) to enforce the following constraints?

$$
\bbE_{p(\bz)}p_0(\bx|\bz)=\cN(0,\bI);\quad\bbE_{p(\bz)}p_1(\bx|\bz)=\pd(\bx).
$$

</div>

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">image credit: A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 2
sourceFrame: "20"
class: theorems
---

# Gaussian Conditional Probability Paths [Q2]

Let's consider the following parametrization:

$$
p_t(\bx|\bz)=\cN\left(\bmu_t(\bz),\bsigma_t^2(\bz)\right)
$$

<div v-click="1">

The concrete $\bmu_t(\bz)$, $\bsigma_t(\bz)$ (which satisfy the boundary constraints) will be fixed once we choose $\bz$ [Q1].

<div class="block">

## Gaussian flow

- Let's derive the vector field for **any** Gaussian path $p_t(\bx|\bz)$.
- There are infinitely many flows $\bpsi_t(\bx_0,\bz)$ (or, equivalently, vector fields $\bv(\bx_t,\bz,t)$) that generate a particular probability path $p_t(\bx|\bz)$.

<div v-click="2">

- Let's consider the following flow:

$$
\bx_t=\bpsi_t(\bx_0,\bz)=\bmu_t(\bz)+\bsigma_t(\bz)\odot\bepsilon,
$$

where $\bepsilon$ is fixed by the condition: $\bx_0=\bmu_0(\bz)+\bsigma_0(\bz)\odot\bepsilon$.

</div></div></div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 4
sourceFrame: "21"
class: theorems
---

# Gaussian Conditional Vector Field

<div class="block">

## Gaussian Conditional Probability Path

$$
\begin{aligned}
p_t(\bx|\bz)&=\cN\left(\bmu_t(\bz),\bsigma_t^2(\bz)\right);\\
\bx_t&=\bpsi_t(\bx_0,\bz)=\bmu_t(\bz)+\bsigma_t(\bz)\odot\bepsilon
\end{aligned}
$$

</div>
<div v-click="1">

How to derive the expression for $\bv(\bx_t,\bz,t)$ for this particular flow $\bpsi_t(\bx_0,\bz)$?

</div>
<div v-click="2">

$$
\frac{d\bx_t}{dt}=\bv(\bx_t,\bz,t);\quad{\color{#8854c0}\bepsilon=\frac{1}{\bsigma_t(\bz)}\odot(\bx_t-\bmu_t(\bz))}
$$

</div>
<div v-click="3">

$$
\frac{d\bx_t}{dt}=\bmu_t'(\bz)+\bsigma_t'(\bz)\odot{\color{#8854c0}\bepsilon}
$$

</div>
<div v-click="4">

$$
\boxed{\bv(\bx_t,\bz,t)=\bpsi_t'\left(\bpsi_t(\bx_t,\bz)^{-1},\bz\right)=\bmu_t'(\bz)+\frac{\bsigma_t'(\bz)}{\bsigma_t(\bz)}\odot(\bx_t-\bmu_t(\bz))}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 0
sourceFrame: "auto: One-Sided Conditioning"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item current"><span>02</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 3
sourceFrame: "22"
class: theorems
---

# Endpoint Conditioning

<div class="block">

## Conditional Flow Matching

$$
\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

</div>

Let's define our latent variable $\bz$.

<div class="block" v-click="1">

## Conditioning Latent Variable [Q1]

Let us choose $\bz=\bx_1$. Then $p(\bz)=p_1(\bx_1)$.

$$
p_t(\bx)=\int p_t(\bx|\bx_1)p_1(\bx_1)d\bx_1
$$

</div>
<div v-click="2">

We need to ensure the boundary constraints:

<div class="math-chain">

$\displaystyle\begin{cases}\bbE_{p(\bz)}p_0(\bx|\bz)=\cN(0,\bI)\\\bbE_{p(\bz)}p_1(\bx|\bz)=\pd(\bx)\end{cases}$
<span v-click="3">$\displaystyle\quad\Rightarrow\quad\begin{cases}p_0(\bx|\bx_1)=\cN(0,\bI);\\p_1(\bx|\bx_1)=\delta(\bx-\bx_1)\end{cases}$</span>

</div>

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 3
sourceFrame: "23"
class: theorems
---

# One-Sided Conditioning

$$
p_0(\bx|\bx_1)=\cN(0,\bI);\quad p_1(\bx|\bx_1)=\delta(\bx-\bx_1)
$$

<div class="block">

## Gaussian Conditional Probability Path

$$
\begin{aligned}
p_t(\bx|\bx_1)&=\cN\left(\bmu_t(\bx_1),\bsigma_t^2(\bx_1)\right);\\
\bx_t&=\bmu_t(\bx_1)+\bsigma_t(\bx_1)\odot{\color{olive}\bepsilon}
\end{aligned}
$$

</div>
<img v-click="1" src="/figs/conical_paths.png" alt="Gaussian endpoint-conditioned paths" style="width:100%;height:135px;object-fit:contain" />
<div v-click="2">

Let's consider straight conditional paths:

<div class="math-chain">

$\displaystyle\begin{cases}\bmu_t(\bx_1)=t\bx_1\\\bsigma_t(\bx_1)=1-t\end{cases}$
<span v-click="3">$\displaystyle\quad\Rightarrow\quad\begin{cases}p_t(\bx|\bx_1)=\cN\left(t\bx_1,(1-t)^2\cdot\bI\right)\\\bx_t=t\bx_1+(1-t){\color{olive}\bx_0}\end{cases}$</span>

</div>

</div>

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">image credit: A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 4
sourceFrame: "24"
class: theorems
---

# One-Sided Conditioning: Conditional Vector Field

$$
p_t(\bx|\bx_1)=\cN\left(t\bx_1,(1-t)^2\bI\right);\quad{\color{teal}\bx_t=t\bx_1+(1-t)\bx_0}
$$

<div class="block">

## Conditional Vector Field

$$
\frac{d\bx_t}{dt}=\bv(\bx_t,\bx_1,t)=\bmu_t'(\bx_1)+\frac{\bsigma_t'(\bx_1)}{\bsigma_t(\bx_1)}\odot(\bx_t-\bmu_t(\bx_1))
$$

<div v-click="1">

$$ {1|1-2|all} {at:2}
\begin{aligned}
\bv(\bx_t,\bx_1,t)&=\bx_1-\frac{1}{1-t}\cdot(\bx_t-t\bx_1)=\frac{\bx_1-{\color{teal}\bx_t}}{1-t}\\
&=\frac{\bx_1-{\color{teal}t\bx_1-(1-t)\bx_0}}{1-t}\\
&=\bx_1-\bx_0
\end{aligned}
$$

</div></div>
<div class="columns balanced" v-click="4">
<img src="/figs/g2g-vector-field-samples-cond.png" alt="Straight conditional vector field trajectories" style="width:100%;height:160px;object-fit:contain" />
<div>

The conditional vector field $\bv(\bx_t,\bx_1,t)$ defines straight lines between $\pd(\bx)$ and $\cN(0,\bI)$.

</div></div>

<div class="source"><a href="https://mlg.eng.cam.ac.uk/blog/2024/01/20/flow-matching.html">image credit: https://mlg.eng.cam.ac.uk/blog/2024/01/20/flow-matching.html</a></div>

---
clicks: 3
sourceFrame: "25"
class: derivation
---

# One-Sided Conditioning: CFM Objective

$$ {1-2|all} {at:1}
\begin{aligned}
&\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|{\color{olive}\bv(\bx,\bz,t)}-\bv_{\btheta}(\bx,t)\right\|^2\\
&\quad=\bbE_{t\sim U[0,1]}\bbE_{\bx_1\sim\pd(\bx)}{\color{#8854c0}\bbE_{\bx\sim p_t(\bx|\bx_1)}}\left\|{\color{olive}\frac{\bx_1-\bx}{1-t}}-\bv_{\btheta}({\color{teal}\bx},t)\right\|^2\\
&\quad=\bbE_{t\sim U[0,1]}\bbE_{\bx_1\sim\pd(\bx)}{\color{#8854c0}\bbE_{\bx_0\sim\cN(0,\bI)}}\left\|(\bx_1-\bx_0)-\bv_{\btheta}\left({\color{teal}t\bx_1+(1-t)\bx_0},t\right)\right\|^2
\end{aligned}
$$

<div v-click="2">

- We fit straight lines between the noise distribution $p_0(\bx)$ and the data distribution $\pd(\bx)$.
- The **marginal** path $p_t(\bx)$ does not give straight lines.

</div>
<div class="columns" v-click="3">
<img src="/figs/g2g-vector-field-samples-cond.png" alt="Conditional straight paths" style="width:100%;height:185px;object-fit:contain" />
<img src="/figs/g2g-forward_samples.png" alt="Marginal nonlinear paths" style="width:100%;height:185px;object-fit:contain" />
</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 1
sourceFrame: "26"
class: theorems
---

# CFM with One-Sided Conditioning: Training and Sampling

$$
\bbE_{t\sim U[0,1]}\bbE_{\bx_1\sim\pd(\bx)}\bbE_{\bx_0\sim\cN(0,\bI)}\left\|(\bx_1-\bx_0)-\bv_{\btheta}(\bx_t,t)\right\|^2\rightarrow\min_{\btheta}
$$

<div class="block">

## Training

1. Sample $\bx_1\sim\pd(\bx)$, $\bx_0\sim\cN(0,\bI)$, $t\sim U[0,1]$.
2. Compute noisy image $\bx_t=t\bx_1+(1-t)\bx_0$.
3. Compute loss $\cL=\left\|(\bx_1-\bx_0)-\bv_{\btheta}(\bx_t,t)\right\|^2$.

</div>
<div class="block" v-click="1">

## Sampling

1. Sample $\bx_0\sim\cN(0,\bI)$.
2. Solve the ODE to obtain $\bx_1$:

$$
\bx_1=\bpsi_1(\bx_0)=\ODESolve_v(\bx_0,\btheta,t_0=0,t_1=1).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 1
sourceFrame: "27"
class: theorems
---

# Conditional vs. Marginal Paths

<img src="/figs/cond_marg_paths.png" alt="Conditional and marginal probability paths" style="width:100%;height:345px;object-fit:contain" />
<div v-click="1">

- One-sided conditioning gives us the way to construct a generative model.
- Now we extend it to image-to-image formulation (mapping between two distinct data distributions $p_0(\bx)$ and $p_1(\bx)$).

</div>

<div class="source"><a href="https://arxiv.org/abs/2506.02070">Holderrieth P. and Erives E., et al. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 0
sourceFrame: "28"
class: summary
---

# Summary

- Conditional flow matching introduces the latent variable $\bz$, reformulating the initial task in terms of conditional dynamics.
- The marginal vector field can be expressed as the posterior mean of conditional vector fields: $\bv(\bx,t)=\bbE_{p_t(\bz|\bx)}\bv(\bx,\bz,t)$.
- The FM and CFM objectives have the same optimal solution, making CFM a tractable alternative to FM.
- For Gaussian conditional paths $p_t(\bx|\bz)=\cN(\bmu_t(\bz),\bsigma_t^2(\bz))$, the conditional vector field has a closed form for $\bv(\bx_t,\bz,t)$.
- One-sided conditioning uses endpoint conditioning $\bz=\bx_1$ with straight conditional paths, yielding the simple vector field $\bv(\bx_t,\bx_1,t)=\bx_1-\bx_0$.
