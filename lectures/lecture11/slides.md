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
id: deep-generative-models
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 11</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
id: recap-ve-vp-sdes
class: theorems
---

# Recap of Previous Lecture

$$
d\bx = \bff(\bx, t) dt + g(t) d \bw
$$

<div class="block">

## Variance Exploding SDE (NCSN)

This process matches the NCSN noise levels.

$$
d \bx = \sqrt{\frac{ d [\sigma^2(t)]}{dt}} \cdot d \bw
$$

$$
\bff(\bx, t) = 0, \quad g(t) = \sqrt{\frac{ d [\sigma^2(t)]}{dt}}
$$

$\sigma(t)$ is a monotonically increasing function.

</div>

<div class="block">

## Variance Preserving SDE (DDPM)

This is the small-step limit of the DDPM forward chain.

$$
d \bx = - \frac{1}{2} \beta(t) \bx(t) dt + \sqrt{\beta(t)} \cdot d \bw
$$

$$
\bff(\bx, t) = - \frac{1}{2} \beta(t) \bx(t) , \quad g(t) = \sqrt{\beta(t)}
$$

Variance is preserved as long as $\bx(0)$ has unit variance.

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-2
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem

Suppose the SDE $d\bx = \bff(\bx, t) dt + g(t) d \bw$ induces the probability path $p_t(\bx)$ with $p_t(\bx) > 0$.
Then, there exists an ODE with the same probability path $p_t(\bx)$, given by

$$
d\bx = \bv(\bx, t) dt = \left(\bff(\bx, t) -\frac{1}{2} g^2(t) \frac{\partial}{\partial \bx} \log p_t(\bx) \right) dt
$$

</div>

<img src="/figs/probability_flow.png" alt="SDE and probability flow ODE trajectories over the same probability path" style="width:100%;height:176px;object-fit:contain" />

<div class="block">

## Log-likelihood

The flow is invertible. Follow the same ODE from data to noise to evaluate the model density.

$$
\log \pt(\bx(0))=\log p_T(\bx(T))
+\int_0^T \tr\left(\frac{\partial\bv_{\btheta}(\bx(t),t)}{\partial\bx(t)}\right)\,dt.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a> · <a href="https://arxiv.org/abs/1806.07366">Chen et al., Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 0
id: recap-of-previous-lecture-3
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## ODE · One predecessor

$$
d\bx=\bv(\bx,t)\,dt
$$

Over a short forward step $h$,
$$
\bx(t+h)\approx\bx(t)+h\,\bv(\bx(t),t).
$$

In reverse time $\tau=1-t$,
$$
d\bx=-\bv(\bx,1-\tau)\,d\tau.
$$

</div>

<div class="block">

## Theorem

There exists a reverse SDE for $d\bx = \bff(\bx, t) dt + g(t) d \bw$ (assume $p_t(\bx) > 0$), given by:

$$
d\bx = \left(\bff(\bx, t) {\color{#8854c0}- g^2(t) \frac{\partial}{\partial \bx}\log p_t(\bx)}\right) dt + g(t) d \bar{\bw}
$$

where $dt<0$ and $\bar{\bw}(t)$ is a reverse-time Wiener process.

</div>

<div class="source"><a href="https://doi.org/10.1016/0304-4149(82)90051-5">Anderson B. D. O. Reverse-time diffusion equation models, 1982</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-5
class: theorems
---

# Recap of Previous Lecture

$$
d\bx = \bff(\bx, t) dt + g(t) d \bw
$$

$$
\bv(\bx, t) = \bff(\bx, t) - \frac{1}{2} g^2(t) \bs(\bx, t), \quad \text{where} \quad \bs(\bx, t) = \nabla_{\bx} \log p_t(\bx)
$$

<div class="takeaway columns">
<section>

## Probability Flow ODE

$$
d\bx = {\color{teal}\bv(\bx, t)}\,dt.
$$

</section>
<section>

## Reverse SDE

$$
d\bx = \bigl({\color{#8854c0}\bv(\bx, t) - \tfrac12 g^2(t)\bs(\bx, t)}\bigr)\,dt + g(t)\,d\bar{\bw}.
$$

</section>
</div>

<img src="/figs/sde.png" alt="Forward and reverse SDE trajectories alongside probability flow ODE trajectories between the data and prior distributions" style="width:100%;height:300px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-6
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Discrete-Time Objective

$$
\bbE_{\pd(\bx_0)} {\color{teal}\bbE_{t \sim U\{1, T\}}} \bbE_{q(\bx_t | \bx_0)}\bigl\| \bs_{\btheta, t}(\bx_t) - \nabla_{\bx_t} \log q(\bx_t | \bx_0) \bigr\|^2_2
$$

</div>

Use unit score-loss weights here.

<div class="block">

## Continuous-Time Objective

$$
\bbE_{\pd(\bx(0))} \bbE_{t \sim U[0, 1]} \bbE_{q(\bx(t) \mid \bx(0))}
\bigl\| \bs_{\btheta}(\bx(t), t) - {\color{teal}\nabla_{\bx(t)} \log q(\bx(t) \mid \bx(0))} \bigr\|^2_2
$$

</div>

In continuous time, the conditional law is still Gaussian. Write $\bmu=\bmu(\bx(0),t)$ for its mean.

<div class="takeaway columns">
<section>

## Conditional density

$$
q(\bx(t)\mid\bx(0))=\cN\!\left(\bmu,\,\sigma^2(t)\bI\right)
$$

</section>
<section>

## Score target

$$
{\color{teal}\nabla_{\bx(t)}\log q(\bx(t)\mid\bx(0))}
=\frac{\bmu-\bx(t)}{\sigma^2(t)}
$$

</section>
</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song et al., Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a> · <a href="https://users.aalto.fi/~asolin/sde-book/sde-book.pdf">Särkkä &amp; Solin, Applied Stochastic Differential Equations, §6.1, 2019</a></div>

---
clicks: 0
id: recap-gaussian-conditional-moments
class: theorems
---

# Recap of Previous Lecture

With affine drift and additive Gaussian noise, the transition law is Gaussian.

$$
d\bx=f(t)\bx\,dt+g(t)\,d\bw
\quad\Longrightarrow\quad
q(\bx(t)\mid\bx(0))=\cN\!\left(\bmu(\bx(0),t),\,\sigma^2(t)\bI\right).
$$

<div class="takeaway">

## Theorem

$$
\frac{d\bmu(\bx(0),t)}{dt}=f(t)\bmu(\bx(0),t),
\qquad
\frac{d\sigma^2(t)}{dt}=2f(t)\sigma^2(t)+g^2(t).
$$

</div>

Fix $\bx(0)$ and write $v(t)$ for the conditional variance per coordinate. Then $\bmu(0)=\bx(0)$ and $v(0)=0$.

<div class="block">

## NCSN

$$
q(\bx(t) | \bx(0)) = \cN\left(\bx(0), \left[\sigma^2(t) - \sigma^2(0)\right] \cdot \bI\right)
$$

</div>

<div class="block">

## DDPM

$$
q(\bx(t) | \bx(0)) = \cN\left(\bx(0) e^{-\frac{1}{2} \int_0^t\beta(s)ds}, \left(1 - e^{- \int_0^t\beta(s)ds}\right) \cdot \bI\right)
$$

</div>

<div class="source"><a href="https://users.aalto.fi/~asolin/sde-book/sde-book.pdf">Särkkä S., Solin A. Applied stochastic differential equations, 2019</a> · <a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: recap-score-based-training
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Training

<ol>

<li>

Sample $\bx(0) \sim \pd(\bx)$, $t \sim U[0, 1]$.

</li>

<li>

Sample $\bx(t) \sim q(\bx(t) | \bx(0))$.

</li>

<li>

Compute loss $\cL = \bigl\| \bs_{\btheta}(\bx(t), t) - {\color{teal}\nabla_{\bx(t)} \log q(\bx(t) | \bx(0))} \bigr\|^2_2$.

</li>

</ol>

</div>

<div class="columns items-center">
<section>

## Sampling

1. For the VP-SDE, sample $\bx(1) \sim \cN(0, \bI)$ from the approximate terminal distribution.
2. Solve the reverse SDE from $T=1$ to $t=0$ using $\SDESolve$.

</section>

<img src="/figs/sbgm.png" alt="Score-based generative model sampling" style="width:100%;height:240px;object-fit:contain" />
</div>

- An Euler–Maruyama step of the reverse SDE adds fresh Gaussian noise.
- An Euler step of the probability flow ODE is deterministic given the current state.

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: outline
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Flow Matching (FM)</div></div>
<div class="outline-item"><span>02</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item"><span>03</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 0
id: outline-flow-matching
section: "Flow Matching (FM)"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Flow Matching (FM)</div></div>
<div class="outline-item"><span>02</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item"><span>03</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 0
id: generative-models-taxonomy
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" flow-matching />

---
clicks: 3
id: continuous-time-normalizing-flows
class: theorems
---

# Continuous-Time Normalizing Flows

Recall $\bx_t=\bx(t)$ for $t\in[0,1]$:

<ul>

<li>

$\bx_0 \sim p_0(\bx)$, where $p_0(\bx)$ is a base distribution (mostly $\cN(0, \bI)$);

</li>

<li>

$\bx_1 \sim p_1(\bx)$, where $p_1(\bx)$ is the true data distribution $\pd(\bx)$.

</li>

</ul>

**Time convention:** unlike the diffusion sections, here $t=0$ denotes noise and $t=1$ denotes data.

$$
\frac{d \bx_t}{dt} = \bv (\bx_t, t),  \quad \text{with initial condition } \bx(0) = \bx_0.
$$

The velocity $\bv$ determines a flow $\bpsi_t$: $\bx_t = \bpsi_t(\bx_0)$.

<div v-click="1">

<strong class="takeaway">We used the score to compute the probability flow velocity. Can we learn a velocity field directly?</strong>

</div>

<div class="block" v-click="2">

## KFP Theorem (Continuity Equation)

$$
\frac{\partial p_t(\bx)}{\partial t} = - \diver\left(\bv(\bx, t) p_t(\bx)\right) \Leftrightarrow \frac{d \log p_t(\bx(t))}{d t} = - \tr \left( \frac{\partial \bv(\bx(t), t)}{\partial \bx(t)} \right)
$$

</div>

<ul>

<li v-click="3">

Likelihood-based CNF training requires ODE solves and Jacobian trace evaluations.

</li>

<li v-click="3">

The adjoint method computes gradients through the ODE solution; repeated solves can be costly.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a> · <a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

<!--
Introduce the noise-to-data trajectory and its velocity field. On the first click, recall how the probability flow ODE uses the score and ask whether we can learn the velocity field directly. Use the continuity equation to recall the cost of likelihood training before introducing velocity regression on the next slide.
-->

---
clicks: 3
id: continuous-time-normalizing-flows-2
class: theorems
---

# Flow Matching

<div class="block">

## KFP Theorem (Continuity Equation)

$$
\frac{\partial p_t(\bx)}{\partial t} = - \diver\left(\bv(\bx, t) p_t(\bx)\right) \Leftrightarrow \frac{d \log p_t(\bx(t))}{d t} = - \tr \left( \frac{\partial \bv(\bx(t), t)}{\partial \bx(t)} \right)
$$

</div>

Knowing the vector field $\bv (\bx, t)$, the KFP (or continuity) equation allows us to compute the density $p_t(\bx)$ and to sample.

<div class="block" v-click="1">

## Flow Matching

$$
\bbE_{t \sim U[0, 1]} \bbE_{\bx \sim p_t(\bx)}\left\| \bv(\bx, t) - \bv_{\btheta}(\bx, t) \right\|^2 \rightarrow \min_{\btheta}
$$

</div>

<div class="takeaway" v-click="2" style="text-wrap: balance">

Flow matching fits velocities by regression, without model ODE solves or trace evaluations during training.

</div>

<ul>

<li v-click="3">

Approximate the true vector field $\bv (\bx, t)$ using $\bv_{\btheta}(\bx, t)$.

</li>

<li v-click="3">

Use the learned flow $\bpsi_t$ for deterministic sampling: $\bx_1 = \bpsi_1(\bx_0)$.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 3
id: flow-matching-training-and-sampling
class: theorems
---

# Flow Matching: Training and Sampling

$$
\bbE_{t \sim U[0, 1]} \bbE_{\bx \sim p_t(\bx)}\left\| \bv(\bx, t) - \bv_{\btheta}(\bx, t) \right\|^2 \rightarrow \min_{\btheta}
$$

$$
\bx_0 \sim p_0(\bx) = p(\bx), \quad \bx_1 \sim p_1(\bx) =  \pd(\bx)
$$

<div class="block" v-click="1">

## Training

<ol>

<li v-click="1">

Sample $t \sim U[0, 1]$, $\bx_t \sim p_t(\bx)$.

</li>

<li v-click="1">

Compute loss $\cL = \left\| \bv(\bx_t, t) - \bv_{\btheta}(\bx_t, t) \right\|^2$.

</li>

</ol>

</div>

<div class="block" v-click="2">

## Sampling

<ol>

<li v-click="2">

Sample $\bx_0 \sim \cN(0, \bI)$.

</li>

<li v-click="2">

Solve the ODE to obtain $\bx_1$:

$$
\bx_1 = \bpsi_1(\bx_0) = \ODESolve_v(\bx_0, \btheta, t_0=0, t_1=1).
$$

</li>

</ol>

</div>

<div v-click="3">

**Problem:** The true vector field $\bv(\bx, t)$ is **unknown**.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: nonunique-transport-paths
class: interactive-slide
---

# Many Velocity Fields Connect the Same Endpoints

$$
\bbE_{t \sim U[0, 1]} \bbE_{\bx \sim p_t(\bx)}\left\| \bv(\bx, t) - \bv_{\btheta}(\bx, t) \right\|^2 \rightarrow \min_{\btheta}
$$

<TransportPathsDemo />

- Different velocity fields $\bv(\bx, t)$ can transport the same initial density $p_0(\bx)$ to the same final density $p_1(\bx)$.
- Choose a path with a tractable training objective.

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">Original illustration: A Visual Dive into Conditional Flow Matching</a></div>

<!--
The preceding FM algorithm exposes an unknown target field. Three explicit invertible flows now demonstrate that endpoint densities do not select one unique target. This motivates constructing tractable paths in the continuation of flow matching. The Summary retains the regression takeaway. Unlike the PF-ODE example, only endpoints are constrained to agree. All flows have positive affine scales and analytic Gaussian pushforwards: mean (-2+4t, 0), scales (1-.45t,1-.2t); Detour adds (0,1.6 sin(pi t)); Rotation inserts a 1.3 sin(pi t) rotation before scaling. Rotation preserves the current Gaussian density relative to Direct but changes particle trajectories; Detour changes intermediate density. No claim about optimal transport or learned-model quality. Noise-to-data time increases from 0 to 1.
-->

---
clicks: 0
id: outline-2
section: "Conditional Flow Matching (CFM)"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Flow Matching (FM)</div></div>
<div class="outline-item current"><span>02</span><div>Conditional Flow Matching (CFM)<div class="outline-sub"><strong>CFM Objective</strong><br>Conditional Probability Paths</div></div></div>
<div class="outline-item"><span>03</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 2
id: flow-matching
class: theorems
---

# From Marginal to Conditional Probability Paths

Many paths connect the same two distributions. Can we build one from simpler paths whose velocities we already know?

<div v-click="1">

For each $\bz\sim p(\bz)$, choose a **conditional probability path** $p_t(\bx|\bz)$ with a known velocity field. Mixing the conditional densities gives the marginal density at time $t$.

$$
p_t(\bx)=\int p_t(\bx|\bz)p(\bz)\,d\bz.
$$

</div>
<div v-click="2">

At fixed $\bz$, the particle ODE and the continuity equation use the same **conditional vector field** $\bv(\bx,\bz,t)$.

$$
\frac{\partial p_t(\bx|\bz)}{\partial t}=-\diver\left(\bv(\bx,\bz,t)p_t(\bx|\bz)\right).
$$

$$
\frac{d\bx_t}{dt}=\bv(\bx_t,t)\quad\Rightarrow\quad\frac{d\bx_t}{dt}=\bv(\bx_t,\bz,t).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 2
id: conditional-vector-field
class: theorems interactive-slide
---

# Conditional Vector Field

$$
{\color{#8854c0}\frac{\partial p_t(\bx|\bz)}{\partial t}=-\diver\left(\bv(\bx,\bz,t)p_t(\bx|\bz)\right)}.
$$

What's the relationship between $\bv(\bx,t)$ and $\bv(\bx,\bz,t)$?

<div class="block" v-click="1">

## Theorem

If $\bv(\bx,\bz,t)$ generates $p_t(\bx|\bz)$ for each $\bz$, its posterior mean generates the mixture $p_t(\bx)$.

$$
{\color{#007f82}\bv(\bx,t)}
=\bbE_{p_t(\bz|\bx)}\!\left[\bv(\bx,\bz,t)\right]
=\int \bv(\bx,\bz,t)\,p_t(\bz|\bx)\,d\bz,\qquad
p_t(\bz|\bx)=\frac{p_t(\bx|\bz)p(\bz)}{p_t(\bx)}\quad (p_t(\bx)>0).
$$

<PosteriorVelocityDemo v-click="2" />

<!-- Two equally likely isotropic Gaussian clouds translate with constant velocities v1=(.8,.75), v2=(-.8,.75), without changing shape. At t=.5 their means are (-1,0) and (1,0), with sigma=.9. Dragging x changes the exact Bayes posterior and hence the marginal velocity. Colored arrows show the clouds' uniform conditional velocities; the teal arrow is evaluated at x. No time evolution or endpoint construction is shown. -->

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 4
id: conditional-vector-field-2
class: derivation
---

# Conditional Vector Field

<div class="block">

## Theorem

If $\bv(\bx,\bz,t)$ generates $p_t(\bx|\bz)$ for each $\bz$, its posterior mean generates the mixture $p_t(\bx)$.

$$
{\color{#8854c0}\frac{\partial p_t(\bx|\bz)}{\partial t}=-\diver\left(\bv(\bx,\bz,t)p_t(\bx|\bz)\right)},\qquad
{\color{#007f82}\bv(\bx,t)}=\bbE_{p_t(\bz|\bx)}\!\left[\bv(\bx,\bz,t)\right],\quad p_t(\bx)>0.
$$

</div>
<div class="block">

## Proof

$$ {1|1-2|1-3|1-4|all} {at:1}
\begin{aligned}
\frac{\partial p_t(\bx)}{\partial t}&=\frac{\partial}{\partial t}\int p_t(\bx|\bz)p(\bz)d\bz\\
&=\int\left({\color{#8854c0}\frac{\partial p_t(\bx|\bz)}{\partial t}}\right)p(\bz)d\bz\\
&=\int\left({\color{#8854c0}-\diver\left(\bv(\bx,\bz,t)p_t(\bx|\bz)\right)}\right)p(\bz)d\bz\\
&=-\diver\left(\int\bv(\bx,\bz,t)p_t(\bx|\bz)p(\bz)d\bz\right)\\
&=-\diver\left({\color{#007f82}\bv(\bx,t)}p_t(\bx)\right)
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 2
id: flow-matching-2
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

If $p_t(\bx)>0$ for all $\bx\in\bbR^m$ and $0\le t<1$, the FM and CFM objectives differ by a constant independent of $\btheta$, so they have the same minimizers.

</div>
<div class="block" v-click="2">

## Proof

This can be proved in a similar way as in the denoising score matching theorem.

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 4
id: conditional-flow-matching
class: derivation
---

# Conditional Flow Matching

<div class="block">

## Theorem

$$
\argmin_{\btheta}\bbE_{t\sim U[0,1]}\bbE_{\bx\sim p_t(\bx)}\left\|\bv(\bx,t)-\bv_{\btheta}(\bx,t)\right\|^2=\argmin_{\btheta}\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2
$$

</div>
<div class="block" v-click="1">

## Proof

$$
\bbE_{\bx\sim p_t(\bx)}\left\|\bv(\bx,t)-\bv_{\btheta}(\bx,t)\right\|^2={\color{olive}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}}\left[\|\bv_{\btheta}(\bx,t)\|^2-2{\color{teal}\bv_{\btheta}^\top(\bx,t)\bv(\bx,t)}\right]+\text{const}
$$

Here $\text{const}$ is independent of $\btheta$.

<div v-click="2">

$$ {1|1-2|all} {at:3}
\begin{aligned}
\bbE_{p_t(\bx)}\left[{\color{teal}\bv_{\btheta}^\top(\bx,t)\bv(\bx,t)}\right]&=\int p_t(\bx)\left[\bv_{\btheta}^\top(\bx,t)\left(\int p_t(\bz|\bx)\bv(\bx,\bz,t)d\bz\right)\right]d\bx\\
&=\int\!\int{\color{#8854c0}p_t(\bx)p_t(\bz|\bx)}\left[\bv_{\btheta}^\top(\bx,t)\bv(\bx,\bz,t)\right]d\bz d\bx\\
&={\color{#8854c0}\bbE_{p(\bz)}\bbE_{p_t(\bx|\bz)}}\left[\bv_{\btheta}^\top(\bx,t)\bv(\bx,\bz,t)\right]
\end{aligned}
$$

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 2
id: conditional-flow-matching-training-and-sampling
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

1. Sample $t\sim U[0,1]$, ${\color{teal}\bz\sim p(\bz)}$, $\bx_t\sim {\color{teal}p_t(\bx|\bz)}$.
2. Compute loss $\cL=\left\|{\color{teal}\bv(\bx_t,\bz,t)}-\bv_{\btheta}(\bx_t,t)\right\|^2$.

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
clicks: 0
id: outline-4
section: "Conditional Probability Paths"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Flow Matching (FM)</div></div>
<div class="outline-item current"><span>02</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br><strong>Conditional Probability Paths</strong></div></div></div>
<div class="outline-item"><span>03</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 1
id: conditional-flow-matching-continuity-equations
class: theorems
---

# Conditional Flow Matching: Continuity Equations

CFM gives us a training objective. We still need to choose conditional paths and their target velocities.

<div class="block">

## How are the probability path $p_t(\bx)$ and the velocity field $\bv(\bx,t)$ related?

$$
\begin{aligned}
\frac{\partial p_t(\bx)}{\partial t}&=-\diver\left(\bv(\bx,t)\cdot p_t(\bx)\right)\\
\frac{\partial p_t(\bx|\bz)}{\partial t}&=-\diver\left(\bv(\bx,\bz,t)\cdot p_t(\bx|\bz)\right)
\end{aligned}
$$

</div>

<div v-click="1">

- $\bv(\bx,t)$ (under regularity conditions) and initial condition $p_0(\bx)$ uniquely determine $p_t(\bx)$.
- Given a field $\bv$ generating $p_t$, adding $\bw$ with $\diver(p_t\bw)=0$ preserves the same continuity equation.
- Moreover, not every given path $p_t(\bx)$ can actually arise from particles moving under some velocity field $\bv(\bx,t)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

<!-- The perturbation w has zero weighted divergence, div(p_t w)=0; w itself need not be divergence-free. Thus v and v+w satisfy the same continuity equation for the given p_t. Identifying these equations with a common ODE-induced density path additionally requires well-posed flows and the usual boundary/integrability conditions. This is a choice of compatible velocity, not an existence theorem for arbitrary density paths. -->

---
clicks: 3
id: conditional-flow-matching-paths-and-vector-fields
class: theorems
---

# Conditional Flow Matching: Paths and Vector Fields

<div class="block">

## How are the conditional paths $p_t(\bx|\bz)$ and the marginal path $p_t(\bx)$ related?

$$
p_t(\bx)=\int p_t(\bx|\bz)p(\bz)d\bz
$$

</div>
<div v-click="1">

- At each time $t$, mixing the conditional densities $p_t(\bx|\bz)$ with the prior $p(\bz)$ fixes the marginal density $p_t(\bx)$.
- With the same prior, distinct families can satisfy
  $\int p_t(\bx|\bz)p(\bz)\,d\bz = \int \tilde p_t(\bx|\bz)p(\bz)\,d\bz = p_t(\bx)$.

</div>
<div class="block" v-click="2">

## How are the conditional velocities $\bv(\bx,\bz,t)$ and the marginal velocity $\bv(\bx,t)$ related?

$$
\bv(\bx,t)=\bbE_{p_t(\bz|\bx)}\bv(\bx,\bz,t)=\int\bv(\bx,\bz,t)\frac{p_t(\bx|\bz)p(\bz)}{p_t(\bx)}d\bz
$$

</div>
<div v-click="3">

- Where $p_t(\bx)>0$, averaging $\bv(\bx,\bz,t)$ with posterior weights $p_t(\bz|\bx)$ gives $\bv(\bx,t)$.
- If each $\bv(\bx,\bz,t)$ generates $p_t(\bx|\bz)$, then $\bv(\bx,t)$ generates their mixture $p_t(\bx)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

---
clicks: 3
id: from-marginal-to-conditional-paths
class: theorems
---

# From Marginal to Conditional Paths

<ConditionalPathDiagram :stage="$clicks" />

<div class="block" v-click="3">

## Where we stand

<ul>
<li>

Set up the MSE for fitting $\bv_{\btheta}(\bx,t)$ to the marginal velocity $\bv(\bx,t)$.

$$
\bbE_{t\sim U[0,1]}\bbE_{\bx\sim p_t(\bx)}\left\|\bv(\bx,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

</li>
<li>

Used the FM–CFM theorem to switch to the conditional MSE with the same minimizers.

$$
\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

</li>
</ul>

</div>

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">Diagram adapted from A Visual Dive into Conditional Flow Matching</a><br><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 1
id: building-a-cfm-training-example
class: theorems
---

# How do we build one CFM training example?

$$
\underbrace{(\bx_t,t)}_{\text{network input}}
\qquad\qquad
\underbrace{\bv(\bx_t,\bz,t)}_{\text{velocity target}}
$$

<div class="block" v-click="1">

## Next steps

- **Step 1** Choose the conditional path $p_t(\bx|\bz)$ so that its mixture has the required endpoints.

$$
\bbE_{p(\bz)}p_0(\bx|\bz)=\cN(0,\bI),\qquad \bbE_{p(\bz)}p_1(\bx|\bz)=\pd(\bx).
$$

- **Step 2** Construct particle trajectories $\bx_t$ with conditional density $p_t(\bx|\bz)$ at each time $t$.
- **Step 3** Derive the conditional velocity $\bv(\bx_t,\bz,t)=d\bx_t/dt$ along these trajectories.
- **Step 4** Specify the conditioning variable $\bz$ and the law $p(\bz)$ used to sample it during training.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 1
id: gaussian-conditional-probability-paths-q2
class: theorems
---

# Gaussian Conditional Probability Paths

## Step 1. Choose the conditional path

On the interval considered, assume $\bmu_t(\bz)$ and $\bsigma_t(\bz)$ are differentiable in $t$, with $\bsigma_t(\bz)>0$ componentwise.

$$
p_t(\bx|\bz)=\cN\left(\bmu_t(\bz),\bsigma_t^2(\bz)\right)
$$

Once we specify $\bz$ in step 4, we can choose $\bmu_t(\bz)$ and $\bsigma_t(\bz)$ to satisfy the endpoint constraints.

<div class="block" v-click="1">

## Step 2. Construct the particle trajectories

Choose an affine flow. Along each trajectory, keep the same Gaussian noise $\bepsilon$ and vary the mean and scale.

$$
\bx_t=\bpsi_t(\bx_0,\bz)=\bmu_t(\bz)+\bsigma_t(\bz)\odot\bepsilon,
$$

where $\bepsilon$ is fixed by the condition: $\bx_0=\bmu_0(\bz)+\bsigma_0(\bz)\odot\bepsilon$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

<!--
The selected affine flow keeps epsilon fixed along each trajectory. Differentiability in time and componentwise positive sigma are assumed on the interval where the inverse map and velocity formula are used, including positive sigma_0 for the initial parametrization. A zero-variance endpoint requires separate limiting analysis; the later one-sided construction treats t=1 separately. We choose one compatible field rather than claim uniqueness from the density path alone.
-->

---
clicks: 4
id: gaussian-conditional-vector-field
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

## Step 3. Derive the conditional velocity

<div v-click="1">

Differentiate the chosen affine flow in $t$, keeping $\bepsilon$ fixed. Assume differentiable $\bmu_t,\bsigma_t$ and componentwise $\bsigma_t>0$.

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
clicks: 1
id: cfm-training-example-progress
class: theorems
---

# How do we build one CFM training example?

$$
\underbrace{(\bx_t,t)}_{\text{network input}}
\qquad\qquad
\underbrace{\bv(\bx_t,\bz,t)}_{\text{velocity target}}
$$

<div class="block" v-click="1">

## Progress

- **Step 1 ✓** Choose the conditional path $p_t(\bx|\bz)$ so that its mixture has the required endpoints.

$$
\bbE_{p(\bz)}p_0(\bx|\bz)=\cN(0,\bI),\qquad \bbE_{p(\bz)}p_1(\bx|\bz)=\pd(\bx).
$$

- **Step 2 ✓** Construct particle trajectories $\bx_t$ with conditional density $p_t(\bx|\bz)$ at each time $t$.
- **Step 3 ✓** Derive the conditional velocity $\bv(\bx_t,\bz,t)=d\bx_t/dt$ along these trajectories.
- **Step 4** Specify the conditioning variable $\bz$ and the law $p(\bz)$ used to sample it during training.

Steps 1–3 give us a trajectory and its velocity for each fixed $\bz$. What should $\bz$ represent?

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: outline-5
section: "One-Sided Conditioning"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Flow Matching (FM)</div></div>
<div class="outline-item"><span>02</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item current"><span>03</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 4
id: endpoint-conditioning
class: theorems
---

# Endpoint Conditioning

The path starts at a Gaussian noise sample $\bx_0\sim\cN(0,\bI)$ and ends at a data point $\bx_1\sim\pd$.

<div class="block">

## Conditional Flow Matching

$$
\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

</div>

<div class="block" v-click="1">

## Step 4. Specify the conditioning variable

Let us choose $\bz=\bx_1$. Then $p(\bz)=p_1(\bx_1)$.

$$
p_t(\bx)=\int p_t(\bx|\bx_1)p_1(\bx_1)d\bx_1
$$

</div>
<div v-click="2">

What are the endpoint distributions $p_0(\bx|\bx_1)$ and $p_1(\bx|\bx_1)$ for a fixed data point $\bx_1$?

</div>
<div v-click="3">

**At $t=0$**, draw the noise $\bx_0$ independently of $\bx_1$. Every conditional path starts from the same Gaussian.

$$
p_0(\bx|\bx_1)=\cN(0,\bI),\qquad
p_0(\bx)=\bbE_{\bx_1\sim\pd}\!\left[p_0(\bx|\bx_1)\right]=\cN(0,\bI).
$$

</div>
<div v-click="4">

**At $t=1$**, every trajectory ends at its chosen $\bx_1$. Mixing these point masses recovers the data distribution.

$$
p_1(\bx|\bx_1)=\delta(\bx-\bx_1),\qquad
p_1(\bx)=\int\delta(\bx-\bx_1)\pd(\bx_1)\,d\bx_1=\pd(\bx).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 3
id: one-sided-conditioning
class: theorems interactive-slide
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
<div v-click="1">

**Steps 1–2.** Let's consider straight conditional paths:

<div class="math-chain">

$\displaystyle\begin{cases}\bmu_t(\bx_1)=t\bx_1\\\bsigma_t(\bx_1)=1-t\end{cases}$
<span v-click="2">$\displaystyle\quad\Rightarrow\quad\begin{cases}p_t(\bx|\bx_1)=\cN\left(t\bx_1,(1-t)^2\cdot\bI\right)\\\bx_t=t\bx_1+(1-t){\color{olive}\bx_0}\end{cases}$</span>

</div>
</div>

<div v-click="3">

<EndpointPathDemo />

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 4
id: one-sided-conditioning-conditional-vector-field
class: theorems interactive-slide
---

# One-Sided Conditional Vector Field

$$
p_t(\bx|\bx_1)=\cN\left(t\bx_1,(1-t)^2\bI\right);\quad{\color{teal}\bx_t=t\bx_1+(1-t)\bx_0}
$$

<div class="block">

## Step 3. Derive the conditional velocity

$$
\frac{d\bx_t}{dt}=\bv(\bx_t,\bx_1,t)=\bmu_t'(\bx_1)+\frac{\bsigma_t'(\bx_1)}{\bsigma_t(\bx_1)}\odot(\bx_t-\bmu_t(\bx_1))
$$

<div v-click="1">

$$ {1|1-2|all} {at:2}
\begin{aligned}
\bv(\bx_t,\bx_1,t)&=\bx_1-\frac{1}{1-t}\cdot(\bx_t-t\bx_1)=\frac{\bx_1-{\color{teal}\bx_t}}{1-t},\qquad t<1\\
&=\frac{\bx_1-{\color{teal}t\bx_1-(1-t)\bx_0}}{1-t}\\
&=\bx_1-\bx_0
\end{aligned}
$$

</div></div>

<div v-click="3">

At $t=1$, the quotient is undefined. Use the simplified training target $\bx_1-\bx_0$, which contains no division.

</div>

<FlowPathsDemo v-click="4" />

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

<!--
For 0 <= t < 1, the conditional Gaussian variance (1-t)^2 is strictly positive, so the marginal density p_t(x) is positive everywhere. At t=1 the conditional law collapses to a point mass; the data distribution need not have full support. Thus the positivity assumption in the FM/CFM theorem is imposed for t<1. The single endpoint has zero probability under continuous time sampling and does not change the expected loss (assuming finite expectations). The quotient is undefined at the endpoint; training uses x1-x0 directly. Its finite pathwise limit does not imply that the conditional field is bounded away from the path or that the marginal field has a unique endpoint extension.
-->

---
clicks: 3
id: one-sided-conditioning-cfm-objective
class: derivation interactive-slide
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

## Rectified Flow

Regressing on $\bx_1-\bx_0$ along $\bx_t=(1-t)\bx_0+t\bx_1$ gives the **rectified flow objective**.

**Straight training paths do not imply straight sampling trajectories.**

$$
\bv_{\btheta^*}(\bx,t)=\bbE\left[\bx_1-\bx_0\mid\bx_t=\bx\right].
$$

</div>
<FlowPathsDemo compare v-click="3" />

<!-- Shared 1D illustration: X0 is standard normal, independently paired with X1 from an equal Gaussian mixture with means ±1.8 and std .4. Fixed shuffled stratified samples illustrate conditional paths; the right panel integrates the exact population marginal velocity with RK4. Colors identify the same initial particles. Endpoint pairs are not preserved by the marginal ODE. Horizontal axis is time, not a second spatial coordinate. -->

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://arxiv.org/abs/2209.03003">Liu X., Gong C., Liu Q. Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow, 2022</a></div>


<!-- The preceding slide derives the conditional target x1-x0. This slide substitutes it into CFM, names the resulting linear-interpolation regression Rectified Flow, and distinguishes conditional training paths from integral curves of the optimal marginal field. The next slide shows the conditional and marginal distributions at five times for a two-dimensional checkerboard example. The conditional-expectation identity assumes the population MSE optimum and sufficient model capacity; a fitted finite network approximates it. Rectified Flow does not require straight sampling trajectories or reflow. Reflow is deferred to the coupling discussion. -->

---
clicks: 1
id: conditional-vs-marginal-paths
class: theorems
---

# Conditional vs. Marginal Paths

$$
p_t(\bx)=\bbE_{\bx_1\sim\pd}\!\left[p_t(\bx|\bx_1)\right].
$$

<img src="/figs/cond_marg_paths.png" alt="A Gaussian cloud shrinks to one endpoint in the top row. The mixture over endpoints forms a checkerboard in the bottom row." style="width:100%;height:345px;object-fit:contain" />
<div v-click="1">

- **Top row.** Fix $\bz=\bx_1$. The Gaussian cloud shrinks to the data point marked by the red star.
- **Bottom row.** Mixing over $\bx_1\sim\pd$ recovers the checkerboard distribution at $t=1$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2506.02070">Holderrieth P. and Erives E., et al. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 1
id: rectified-flow-training-and-sampling
class: theorems
---

# Rectified Flow: Training and Sampling

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

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://arxiv.org/abs/2209.03003">Liu X., Gong C., Liu Q. Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow, 2022</a></div>

---
clicks: 3
id: classifier-free-guidance-velocity
class: theorems
---

# Classifier-Free Guidance for Velocity Fields

**Recall diffusion CFG** for a label/prompt $\by$ (distinct from the CFM latent $\bz$):

$$
\bs^{\gamma}_{\btheta,t}(\bx_t,\by)
=\bs_{\btheta,t}(\bx_t,\varnothing)
+\gamma\left[\bs_{\btheta,t}(\bx_t,\by)-\bs_{\btheta,t}(\bx_t,\varnothing)\right].
$$

<div class="block" v-click="1">

$$
\bv_{\btheta}^{\gamma}(\bx,t,\by)
=\bv_{\btheta}(\bx,t,\varnothing)
+\gamma\left[\bv_{\btheta}(\bx,t,\by)-\bv_{\btheta}(\bx,t,\varnothing)\right].
$$

$\gamma=0$: unconditional; $\gamma=1$: conditional; $\gamma>1$: extrapolation.

</div>
<div class="columns">
<div v-click="2">

## Training

1. Sample paired data $(\bx_1,\by)\sim\pd$ and form the rectified-flow sample $\bx_t$ as before.
2. Set $\tilde\by=\varnothing$ with fixed probability; otherwise set $\tilde\by=\by$.
3. Minimize the same velocity loss:

$$
\cL=\left\|\bv_{\btheta}(\bx_t,t,\tilde\by)-(\bx_1-\bx_0)\right\|^2.
$$

</div>
<div v-click="3">

## Sampling

1. Sample $\bx_0\sim\cN(0,\bI)$ and choose $\by,\gamma$.
2. Evaluate both predictions to form $\bv_{\btheta}^{\gamma}$ at each solver evaluation.
3. Solve the guided ODE from $t=0$ to $t=1$:

$$
\frac{d\bx_t}{dt}=\bv_{\btheta}^{\gamma}(\bx_t,t,\by).
$$

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a><br><a href="https://arxiv.org/abs/2403.03206">Esser P., et al. Scaling Rectified Flow Transformers for High-Resolution Image Synthesis, 2024</a></div>

<!-- Narrative: start from the unconditional rectified-flow sampler on the preceding slide. Recall score-space CFG for a label or prompt. The first click reveals the same combination for velocities. Here y is an observed condition, distinct from the auxiliary CFM latent z=x1; conditional and unconditional model velocities both average over training endpoints. Use the same noise law and interpolation for both branches; independently drop the condition, not the endpoint or regression target. Sample x0 from independent Gaussian noise and t uniformly as in rectified-flow training. The convention gamma=0 unconditional, gamma=1 conditional matches the score CFG slides. For shared Gaussian paths, the score-to-velocity map is affine with condition-independent coefficients, so an affine CFG combination transfers to velocities. This does not assert that gamma>1 exactly samples a tempered endpoint density. Standard CFG uses two predictions per field evaluation (which may be batched); gamma=0 or 1 can skip the unused branch. Guidance distillation is a separate construction. SD3 is the concrete example; no claim that every FLUX variant uses two-pass CFG. -->

---
clicks: 0
id: summary
class: summary
---

# Summary

- Many velocity fields connect the same endpoints. FM fits a chosen field by regression, without ODE solves or Jacobian traces during training.
- Choose conditional paths with known velocities so that their mixture under $p(\bz)$ starts at the noise distribution and ends at the data distribution.
- The posterior mean of the conditional velocities under $p_t(\bz|\bx)$ transports this mixture. CFM can therefore fit $\bv_{\btheta}(\bx,t)$ to conditional velocities with the same minimizers as FM.
- For **rectified flow**, condition on a data point $\bz=\bx_1$ and draw independent Gaussian noise $\bx_0$. On the straight path $\bx_t=(1-t)\bx_0+t\bx_1$, the training target is $\bx_1-\bx_0$.
- To sample, start from fresh noise and solve $d\bx_t/dt=\bv_{\btheta}(\bx_t,t)$ from $t=0$ to $t=1$. The sampling trajectories can curve even when the training paths are straight.
