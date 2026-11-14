---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 10"
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

<div class="cover-lecture">Lecture 10</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
id: recap-of-previous-lecture
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Continuous-Time Dynamics

$$
\begin{aligned}
\frac{d \bx(t)}{dt} &= \bv_{\btheta}(\bx(t), t); \quad \text{with initial condition }\bx(t_0) = \bx_0. \\
			\bpsi_t(\bx_0) &= \int^{t}_{t_0} \bv_{\btheta}(\bx(s), s) d s  + \bx_0 \approx {\color{teal}\ODESolve_v(\bx_0, \btheta, t_0, t)}.
\end{aligned}
$$

</div>

<ul>

<li>

$\bv_{\btheta}: \bbR^m \times [t_0, t_1] \rightarrow \bbR^m$ is a vector field.

</li>

<li>

$\bpsi: \bbR^m \times [t_0, t_1] \rightarrow \bbR^m$ is a flow (the solution of ODE):

</li>

</ul>

<div class="block">

## Euler $\ODESolve$

$$
\bx(t + h) = \bx(t) + h \cdot \bv_{\btheta}(\bx(t), t)
$$

</div>

For a smooth field on a fixed interval, compare global error and **NFE** (velocity-network evaluations):

- **Euler:** $\cO(h)$ global error, **1** evaluation per step.
- **Heun:** $\cO(h^2)$ global error, **2** evaluations per step, averaging the current and predicted endpoint velocities.

<!--
Recap keeps the global-error/NFE comparison needed by the solver discussion.
Euler and Heun's displayed global orders assume a smooth field on a fixed interval.
-->

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a><br><a href="https://fncbook.com/rk/">Driscoll T. A., Braun R. J. Fundamentals of Numerical Computation: Runge–Kutta methods</a></div>

---
clicks: 0
id: recap-of-previous-lecture-2
class: theorems
---

# Recap of Previous Lecture

$$
\frac{d \bx(t)}{dt} = \bv_{\btheta}(\bx(t), t);\quad \bx(t_0) = \bx_0
$$

<ul>

<li>

Suppose $\bx(0)$ is a random variable with density $p_0(\bx)$. Then, $\bx(t)$ is a random variable with density $p_t(\bx)$.

</li>

<li>

$p_t(\bx) = p(\bx, t)$ describes the **probability path** between $p_0(\bx)$ and $p_1(\bx)$.

</li>

</ul>

<img src="/figs/cnf_flow.png" alt="cnf flow" style="width:100%;height:260px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/1810.01367">Grathwohl W. et al. FFJORD: Free-form Continuous Dynamics for Scalable Reversible Generative Models, 2018</a></div>

---
clicks: 0
id: recap-of-previous-lecture-3
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem (Picard)

If $\bv$ is continuously differentiable with a bounded derivative in $\bx$ and continuous in $t$, then the ODE has a **unique solution** given by a flow $\bpsi_t$.

</div>

This guarantees the ODE is **uniquely reversible**.

$$
\bx(0)=\bx(1)+\int_1^0\bv_{\btheta}(\bx(t),t)\,dt
$$

<div class="block">

## Theorem (Continuity Equation)

If $\bv$ is continuously differentiable in $\bx$ (with bounded derivative) and continuous in $t$, and $p_t(\bx)>0$, then

$$
\frac{d\log p_t(\bx(t))}{dt}=-\tr\left(\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}\right)
$$

</div>

<div class="block">

## Solution

$$
\log p_1(\bx(1))=\log p_0(\bx(0))-{\color{teal}\int_0^1\tr\left(\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}\right)\,dt}.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 0
id: recap-of-previous-lecture-5
class: theorems
---

# Recap of Previous Lecture

Fix $p_0=\cN(0,\bI)$ and learn $\bv_{\btheta}$; the endpoint density is $p_1=\pt$.

<div class="block">

## Training

<ol>
<li>

Sample $\bx\sim\pd$. Solve the ODE **backward**, from $\bx(1)=\bx$ to $\bx(0)$.

</li>
<li>

Compute the negative log-likelihood along this trajectory:

$$
\cL=-\log\pt(\bx)=-\log p_0(\bx(0))+\int_0^1\tr\left(\frac{\partial\bv_{\btheta}(\bx(t),t)}{\partial\bx(t)}\right)\,dt.
$$

</li>
<li>

Update $\btheta\leftarrow\btheta-\eta\nabla_{\btheta}\cL$; differentiate through the ODE, e.g., via the **adjoint method**.

</li>
</ol>

</div>

<div class="block">

## Sampling

<ol>
<li>

Sample $\bx(0)\sim p_0$.

</li>
<li>

Solve the ODE **forward** and return the endpoint:

$$
\bx(1)=\ODESolve_v(\bx(0),\btheta,t_0=0,t_1=1)\sim\pt.
$$

</li>
</ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a><br><a href="https://arxiv.org/abs/1810.01367">Grathwohl W. et al. FFJORD: Free-form Continuous Dynamics for Scalable Reversible Generative Models, 2018</a></div>

---
clicks: 0
id: recap-of-previous-lecture-6
class: theorems
---

<script setup>
import BrownianMotionPlot from '../lecture9/components/BrownianMotionPlot.vue'
</script>

# Recap of Previous Lecture

<div class="columns balanced">
<div>

## SDE Basics

An SDE generalizes the dynamics of a CNF by adding Brownian noise to the motion induced by the velocity field.

$$
d\bx=\bff(\bx,t)\,dt+{\color{#8854c0}g(t)\,d\bw},\qquad \bx(0)\sim p_0.
$$

## Wiener Process

$$
\Delta\bw=\bw(t+\Delta t)-\bw(t)\sim\cN(0,\Delta t\,\bI),\qquad \Delta t>0.
$$

</div>
<div>

<BrownianMotionPlot static-view />

</div>
</div>

Here $d\bw$ is **informal shorthand** for a small Brownian increment, modeled as $\sqrt{dt}\,\bepsilon$ with $\bepsilon\sim\cN(0,\bI)$.

<div class="block">

## Discretizing the SDE (Euler-Maruyama Update) – $\SDESolve$

$$
\bx(t + dt) = \bx(t) + \bff(\bx(t), t) \cdot dt + g(t) \cdot \bepsilon \cdot \sqrt{dt}
$$

</div>

<ul>

<li>

At each time $t$, we have the density $p_t(\bx) = p(\bx, t)$.

</li>

<li>

$p: \bbR^m \times [0, 1] \rightarrow \bbR_+$ is a **probability path** between $p_0(\bx)$ and $p_1(\bx)$.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 0
id: recap-of-previous-lecture-7
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Two Sources of Randomness

Randomness can enter an SDE through the **initial state** $\bx(0)\sim p_0$ and the **Brownian path** $\bw(t)$.

</div>

<div class="block">

## Theorem (Kolmogorov-Fokker-Planck)

If $p_t(\bx)\in C^{1,2}$ (i.e., $C^1$ in $t$ and $C^2$ in $\bx$), then

$$
\frac{\partial p_t(\bx)}{\partial t}=-\diver\left(\bff(\bx,t)p_t(\bx)\right)+\frac12 g^2(t)\Delta_{\bx}p_t(\bx)
$$

</div>

<div class="block">

## Langevin SDE (Special Case)

$$
d\bx={\color{#8854c0}\tfrac12\nabla_{\bx}\log p_0(\bx)\,dt}+{\color{olive}d\bw}.
$$

If $\bx(0)\sim p_0$, then $\bx(t)\sim p_0$ for every $t$.

</div>

Set the target density to the model density, $p_0(\bx)=\pt(\bx)$.

<div class="block">

## Langevin Dynamics

$$
\bx_{k+1}=\bx_k+\frac{\eta}{2}\nabla_{\bx_k}\log\pt(\bx_k)+\sqrt{\eta}\,\bepsilon_k,
\qquad \bepsilon_k\sim\cN(0,\bI).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025, §3.3</a><br><a href="https://www.stats.ox.ac.uk/~teh/research/compstats/WelTeh2011a.pdf">Welling M. Bayesian Learning via Stochastic Gradient Langevin Dynamics, 2011</a></div>

---
clicks: 0
id: outline
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>
<div class="outline-item"><span>02</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>03</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>04</span><div>Score-Based Generative Models Through SDEs</div></div>

</div>

---
clicks: 0
id: outline-ve-vp
section: "Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>
<div class="outline-item"><span>02</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>03</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>04</span><div>Score-Based Generative Models Through SDEs</div></div>

</div>

---
clicks: 4
id: score-matching-sde
class: theorems derivation
---

# Score Matching SDE

<div class="columns">
<div>

## Two consecutive noise levels

$$
\begin{aligned}
\bx_{k-1} &= \bx + \sigma_{k-1} \bepsilon_{k-1} \\
\bx_k &= \bx + \sigma_k \bepsilon_k
\end{aligned}
$$

$$
q(\bx_j \mid \bx) = \cN(\bx, \sigma_j^2 \bI),
\quad j \in \{k-1,k\}.
$$

</div>
<div v-click="1">

## Markov step from $k-1$ to $k$

$$
\begin{aligned}
\bx_k &= \bx_{k-1} + \sqrt{\sigma_k^2 - \sigma_{k-1}^2}\,\bepsilon \\
q(\bx_k \mid \bx_{k-1}) &= \cN\!\left(\bx_{k-1}, (\sigma_k^2 - \sigma_{k-1}^2)\bI\right)
\end{aligned}
$$

</div>
</div>

<div class="block" v-click="2">

## From a finite step to continuous time

$$ {1|all} {at:3}
\begin{aligned}
\bx(t)-\bx(t-\Delta t)
&= \sqrt{\sigma^2(t)-\sigma^2(t-\Delta t)}\,\bepsilon \\
&= {\color{teal}\sqrt{\frac{\sigma^2(t)-\sigma^2(t-\Delta t)}{\Delta t}}}\;
   \underbrace{{\color{#8854c0}\sqrt{\Delta t}\,\bepsilon}}_{{\color{#8854c0}\Delta\bw}}
\end{aligned}
$$

</div>

<div class="takeaway" v-click="4">

As $\Delta t \to 0$, the variance rate sets the diffusion coefficient:

$$
d\bx = {\color{teal}\sqrt{\frac{d[\sigma^2(t)]}{dt}}}\;{\color{#8854c0}d\bw}.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 2
id: score-matching-sde-2
class: theorems
---

# Variance Exploding SDE (**VE-SDE**)

<div class="takeaway">

$$
d \bx = \sqrt{\frac{ d [\sigma^2(t)]}{dt}} \cdot d \bw
$$

</div>

<div class="block" v-click="1">

## Drift and diffusion

$$
d\bx = \bff(\bx, t) dt + g(t) d \bw
$$

$$
\bff(\bx, t) = 0, \quad g(t) = \sqrt{\frac{ d [\sigma^2(t)]}{dt}}
$$

</div>

<div class="block" v-click="2">

## Why the variance grows

$\sigma(t)$ is a monotonically increasing function.
From time $s$ to $t$, independent noise increments add variance in each coordinate:

$$
\int_s^t g^2(u)\,du = \sigma^2(t)-\sigma^2(s).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 3
id: diffusion-sde
class: theorems derivation
---

# Diffusion SDE

## One DDPM step

$$
\bx_k = \sqrt{1-\beta_k}\,\bx_{k-1} + \sqrt{\beta_k}\,\bepsilon_k,
\qquad q(\bx_k \mid \bx_{k-1}) = \cN\!\left(\sqrt{1-\beta_k}\,\bx_{k-1},\,\beta_k\bI\right).
$$

<div class="block" v-click="1">

## From variance per step to variance per unit time

Split $[0,1]$ into $T$ steps of length $\Delta t=1/T$. Step $k$ ends at $t_k=k/T$.

$$
\underbrace{\beta_k}_{\text{noise variance per step}}
= \underbrace{\beta(t_k)}_{\text{noise variance rate}}\;\cdot\;
  \underbrace{\Delta t}_{\text{step length}}.
$$

At a constant rate, doubling $T$ halves the noise variance added at each step.

</div>

<div class="block" v-click="2">

## Substitute into the update at $t=t_k$

$$ {1|all} {at:3}
\begin{aligned}
\bx(t) &= \sqrt{1-\beta(t)\Delta t}\,\bx(t-\Delta t)
         + \sqrt{\beta(t)\Delta t}\,\bepsilon_k \\
\bx(t)-\bx(t-\Delta t)
&\approx -\tfrac12\beta(t)\bx(t-\Delta t)\,\Delta t
         + \sqrt{\beta(t)}\,\underbrace{{\color{#8854c0}\sqrt{\Delta t}\,\bepsilon_k}}_{{\color{#8854c0}\Delta\bw}} .
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 1
id: diffusion-sde-2
class: theorems derivation
---

# Variance Preserving SDE (**VP-SDE**)

## DDPM increment at $t=t_k$

$$
\bx(t)-\bx(t-\Delta t)
\approx -\tfrac12\beta(t)\bx(t-\Delta t)\,\Delta t
        + \sqrt{\beta(t)}\,{\color{#8854c0}\Delta\bw}.
$$

Here $\Delta t=1/T$ and $\Delta\bw=\bw(t)-\bw(t-\Delta t)=\sqrt{\Delta t}\,\bepsilon_k$.

<div class="block" v-click="1">

As $\Delta t \to 0$, the DDPM update gives the continuous-time dynamics

<div class="takeaway">

$$
d \bx = - \frac{1}{2} \beta(t) \bx(t) dt + \sqrt{\beta(t)} \cdot d \bw
$$

</div>

$$
\bff(\bx, t) = - \frac{1}{2} \beta(t) \bx(t) , \quad g(t) = \sqrt{\beta(t)}
$$

Variance is preserved as long as $\bx(0)$ has unit variance.

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 4
id: diffusion-sde-3
class: theorems
---

# From Score Matching and Gaussian Diffusion to SDEs

<div class="columns">
<div>

## Score matching → NCSN

Fit one denoising score network across noise levels.

$$
\bx_t=\bx_0+\sigma_t\bepsilon.
$$

</div>
<div v-click="1">

## Gaussian diffusion → DDPM

Predict the added noise to learn the reverse chain.

$$
\bx_t=\sqrt{\bar\alpha_t}\bx_0+\sqrt{1-\bar\alpha_t}\bepsilon.
$$

</div>
</div>

<div class="takeaway" v-click="2">

**Weighted score matching → noise-prediction MSE.** Let $r_t$ be the noise standard deviation.

$$
r_t^2\bigl\|\bs_{\btheta,t}(\bx_t)+\bepsilon/r_t\bigr\|^2
=\bigl\|\bepsilon_{\btheta,t}(\bx_t)-\bepsilon\bigr\|^2,\qquad \bepsilon_{\btheta,t}=-r_t\bs_{\btheta,t}.
$$

</div>

<div class="block" v-click="3">

## ODE → SDE

$$
d\bx={\color{teal}\bff(\bx,t)}\,dt
\quad\xrightarrow{\text{add Brownian noise}}\quad
d\bx={\color{teal}\bff(\bx,t)}\,dt+{\color{#8854c0}g(t)}\,d\bw.
$$

</div>

<div class="columns" v-click="4">
<div>

## Variance Exploding SDE (NCSN)

This process matches the NCSN noise levels.

$$
d\bx={\color{#8854c0}\sqrt{\tfrac{d[\sigma^2(t)]}{dt}}}\,d\bw.
$$

</div>
<div>

## Variance Preserving SDE (DDPM)

This is the small-step limit of the DDPM forward chain.

$$
d\bx={\color{teal}-\tfrac12\beta(t)\bx(t)}\,dt+{\color{#8854c0}\sqrt{\beta(t)}}\,d\bw.
$$

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song &amp; Ermon, Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a> · <a href="https://arxiv.org/abs/2006.11239">Ho et al., Denoising Diffusion Probabilistic Models, 2020</a><br><a href="https://arxiv.org/abs/2011.13456">Song et al., Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: outline-3
section: "Probability Flow ODE"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>
<div class="outline-item current"><span>02</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>03</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>04</span><div>Score-Based Generative Models Through SDEs</div></div>

</div>

---
clicks: 2
id: probability-flow-ode
class: theorems
---

# From an SDE to a Probability Flow ODE

<div class="block">

## Neural ODE and continuity equation

$$
d\bx=\bv(\bx,t)\,dt
\quad\Longrightarrow\quad
\frac{d\log p_t(\bx(t))}{dt}=-\tr\left(\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}\right)
\quad\Longleftrightarrow\quad
\frac{\partial p_t}{\partial t}=-\diver\!\left({\color{teal}p_t\bv}\right).
$$

</div>

<div class="block" v-click="1">

## SDE and Fokker–Planck equation

$$
d\bx=\bff(\bx,t)\,dt+g(t)\,d\bw
\qquad\Longrightarrow\qquad
\frac{\partial p_t}{\partial t}=-\diver(p_t\bff)+\tfrac12 g^2(t)\Delta_{\bx}p_t.
$$

## Sources of randomness

1. **Initial state** $\bx(0)\sim p_0$ (ODE and SDE). This draw determines the entire ODE trajectory.
2. **Wiener process** $\bw(t)$ (SDE only). Setting $g(t)=0$ removes this noise and recovers the ODE with $\bv=\bff$.

</div>

<div class="takeaway" v-click="2">

## With diffusion, match the probability flux

$$
\underbrace{{\color{teal}p_t\bv}}_{\text{ODE flux}}
=\underbrace{p_t\bff-\tfrac12 g^2(t)\nabla_{\bx}p_t}_{\text{SDE flux}}.
$$

From the same $p_0$, this ODE gives the **same density $p_t$ at every time $t$**. Individual trajectories can differ.

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen et al., Neural Ordinary Differential Equations, 2018</a> · <a href="https://arxiv.org/abs/2011.13456">Song et al., Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 1
id: probability-flow-ode-2
class: theorems
---

# Probability Flow ODE

<div class="block">

## Theorem

Suppose the SDE $d\bx = \bff(\bx, t) dt + g(t) d \bw$ induces the probability path $p_t(\bx)$ with $p_t(\bx) > 0$.
Then, there exists an ODE with the same probability path $p_t(\bx)$, given by

$$
d\bx = \bv(\bx, t) dt = \left(\bff(\bx, t) -\frac{1}{2} g^2(t) \frac{\partial}{\partial \bx} \log p_t(\bx) \right) dt
$$

</div>

<div v-click="1">

<img src="/figs/probability_flow.png" alt="probability flow" style="width:100%;height:310px;object-fit:contain" />

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 3
id: probability-flow-ode-3
class: theorems
---

# Probability Flow ODE

<div class="block">

## Theorem

Suppose the SDE $d\bx = \bff(\bx, t) dt + g(t) d \bw$ induces the probability path $p_t(\bx)$ with $p_t(\bx) > 0$.
Then, there exists an ODE with the same probability path $p_t(\bx)$, given by

$$
d\bx = \bv(\bx, t) dt = \left(\bff(\bx, t) -\frac{1}{2} g^2(t) \frac{\partial}{\partial \bx} \log p_t(\bx) \right) dt
$$

</div>

<div class="block">

## Proof

$$ {1|1-2|1-3|all} {at:1}
\begin{aligned}
\frac{\partial p_t(\bx)}{\partial t} &= \tr\left( - \frac{\partial}{\partial \bx} \bigl[ \bff(\bx, t) p_t(\bx)\bigr] + \frac{1}{2} g^2(t) \frac{\partial^2 p_t(\bx)}{\partial \bx^2} \right)\\
&= \tr\left( - \frac{\partial}{\partial \bx} \left[ \bff(\bx, t) p_t(\bx) - \frac{1}{2} g^2(t) {\color{#8854c0}\frac{\partial p_t(\bx)}{\partial \bx}} \right]  \right)\\
&=  \tr\left( - \frac{\partial}{\partial \bx} \left[ \bff(\bx, t) p_t(\bx) - \frac{1}{2} g^2(t) {\color{#8854c0}p_t(\bx) \frac{\partial}{\partial \bx} \log p_t(\bx)} \right]  \right)\\
&=  \tr\left( - \frac{\partial}{\partial \bx} \left[ \left( {\color{teal}\bff(\bx, t) - \frac{1}{2} g^2(t) \frac{\partial}{\partial \bx} \log p_t(\bx)}\right) p_t(\bx) \right]  \right)
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 2
id: probability-flow-ode-4
class: theorems
---

# Probability Flow ODE

$$ {1|all} {at:1}
\begin{aligned}
\frac{\partial p_t(\bx)}{\partial t} &= \tr\left( - \frac{\partial}{\partial \bx} \left[ \left( {\color{teal}\bff(\bx, t) - \frac{1}{2} g^2(t) \frac{\partial}{\partial \bx} \log p_t(\bx)}\right) p_t(\bx) \right]  \right) \\
&=  \tr\left( - \frac{\partial}{\partial \bx} \left[ {\color{teal}\bv(\bx, t)} p_t(\bx) \right]  \right) = -  \diver\left(\bv(\bx, t) p_t(\bx)\right)
\end{aligned}
$$

<div v-click="1">

This is the continuity equation for the velocity field $\bv$.

</div>

<div class="block" v-click="2">

$$
\bv(\bx,t)=\bff(\bx,t)-\tfrac12 g^2(t)\frac{\partial}{\partial\bx}\log p_t(\bx),
\qquad \tilde g(t)=0.
$$

$$
d\bx=\bv(\bx,t)\,dt+0\cdot d\bw
=\left(\bff(\bx,t)-\tfrac12 g^2(t)\frac{\partial}{\partial\bx}\log p_t(\bx)\right)dt.
$$

$$
\frac{\partial p_t(\bx)}{\partial t}
=-\diver\!\left(\bv(\bx,t)p_t(\bx)\right)
+\underbrace{\tfrac12\tilde g^2(t)\Delta_{\bx}p_t(\bx)}_{0}.
$$

<div class="takeaway">

Starting from the same $p_0$, the ODE and SDE have the same density $p_t$ at every time.

</div>

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 2
id: probability-flow-ode-5
class: theorems
---

# Probability Flow ODE

<div class="takeaway columns">
<section>

## SDE

$$
d\bx=\bff(\bx,t)\,dt+{\color{#8854c0}g(t)\,d\bw}.
$$

</section>
<section>

## Probability Flow ODE

$$
d\bx={\color{teal}\bv(\bx,t)}\,dt
=\left[\bff(\bx,t)-\tfrac12 g^2(t)\nabla_{\bx}\log p_t(\bx)\right]dt.
$$

</section>
</div>

<div v-click="1">

The **continuous-time score** $\bs(\bx,t)=\nabla_{\bx}\log p_t(\bx)$ determines the correction to the drift.

</div>

<div v-click="2">

<img src="/figs/probability_flow.png" alt="Jagged SDE paths and smooth probability flow ODE paths over the same evolving density" style="width:100%;height:310px;object-fit:contain" />

The white curves show the smooth ODE trajectories. The colored curves show SDE trajectories.

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: same-densities-different-trajectories
class: interactive-slide
---

# Same Densities, Different Trajectories

Both dynamics have density $p_t(x)=\tfrac12\cN(x\mid-a,v_t)+\tfrac12\cN(x\mid a,v_t)$, with $a=1.8$ and $v_t=0.25+2t$.

<ProbabilityPathDemo />

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

<!--
After the PF-ODE theorem and proof, compare paths and densities. Reveal the distinction through time and fresh-noise controls; this prepares the deterministic-sampling discussion. The 1D toy starts from an equal mixture N(-1.8,0.25), N(1.8,0.25), with forward variance rate 2. Quantile transport is the exact 1D PF-ODE flow. Curves join sampled time points, not smooth Brownian paths. Histogram errors are finite-sample effects. No network is trained. The print state uses t=4/3.
-->

---
clicks: 2
id: why-convert-sdes-to-pf-odes-1-efficient-sampling
class: theorems
---

# Why use a probability flow ODE?

<div class="block">

## Deterministic sampling

Each draw $\bx(T)\sim p_T$ determines a unique sample $\bx(0)$. Solve backward from $T$ to $0$ using

$$
d\bx=\bv_{\btheta}(\bx,t)\,dt,\qquad
\bv_{\btheta}(\bx,t)=\bff(\bx,t)-\tfrac12 g^2(t)\bs_{\btheta}(\bx,t).
$$

</div>

<div class="block" v-click="1">

## Choice of solver

- Euler and Heun use one and two network evaluations per step, respectively.
- Other solvers include **DPM-Solver**, **DPM-Solver++**, and **UniPC**.

Compare sampling cost by the total **number of network evaluations (NFE)**.

</div>

<div class="takeaway" v-click="2">

## Log-likelihood

The flow is invertible. Follow the same ODE from data to noise to evaluate the model density.

$$
\log \pt(\bx(0))=\log p_T(\bx(T))
+\int_0^T \tr\left(\frac{\partial\bv_{\btheta}(\bx(t),t)}{\partial\bx(t)}\right)\,dt.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song et al., Score-Based Generative Modeling through SDEs, 2020</a> · <a href="https://arxiv.org/abs/1806.07366">Chen et al., Neural Ordinary Differential Equations, 2018</a><br><a href="https://arxiv.org/abs/2206.00364">Karras et al., Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a> · <a href="https://arxiv.org/abs/2206.00927">Lu et al., DPM-Solver, 2022</a> · <a href="https://arxiv.org/abs/2211.01095">Lu et al., DPM-Solver++, 2022</a> · <a href="https://arxiv.org/abs/2302.04867">Zhao et al., UniPC, 2023</a></div>

---
clicks: 0
id: outline-4
section: "Reverse SDE"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>
<div class="outline-item"><span>02</span><div>Probability Flow ODE</div></div>
<div class="outline-item current"><span>03</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>04</span><div>Score-Based Generative Models Through SDEs</div></div>

</div>

---
clicks: 2
id: reverse-sde
class: theorems
---

# How do we take one step backward?

Given the state now, where was the particle a short time $h$ earlier?

<div class="columns" style="margin-top:18px">
<section>

## ODE · One predecessor

$$
d\bx=\bv(\bx,t)\,dt
$$

<ReverseStepSketch />

Over a short forward step $h$,
$$
\bx(t+h)\approx\bx(t)+h\,\bv(\bx(t),t).
$$

In reverse time $\tau=1-t$,
$$
d\bx=-\bv(\bx,1-\tau)\,d\tau.
$$

</section>
<section v-click="1">

## SDE · A Wiener process

Start at $w(0)=0$ and observe $w(1)=1$.

<ReverseStepSketch stochastic />

**Drift.** The mean backward step is $-h$, toward the starting point.

**Diffusion.** The step variance is $h(1-h)$, so its leading term is still $h$.

</section>
</div>

<div class="takeaway" v-click="2">

For $d\bx=\bff(\bx,t)\,dt+g(t)\,d\bw$, what are the **drift** and **diffusion** in reverse time?

</div>

<div class="source"><a href="https://chihaozhang.com/teaching/SP2022spring/notes/lec11.pdf">Zhang, Brownian Motion and Brownian Bridge, 2022</a> · <a href="https://doi.org/10.1016/0304-4149(82)90051-5">Anderson, Reverse-time diffusion equation models, 1982</a></div>

---
clicks: 2
id: reverse-sde-2
class: theorems
---

# Reverse SDE

<div class="block">

## Theorem

There exists a reverse SDE for $d\bx = \bff(\bx, t) dt + g(t) d \bw$ (assume $p_t(\bx) > 0$), given by:

$$
d\bx = \left(\bff(\bx, t) {\color{#8854c0}- g^2(t) \frac{\partial}{\partial \bx}\log p_t(\bx)}\right) dt + g(t) d \bar{\bw}
$$

where $dt<0$ and $\bar{\bw}(t)$ is a reverse-time Wiener process.

</div>

<ul>

<li v-click="1">

Here the score function appears: $\bs(\bx, t) = \frac{\partial}{\partial \bx} \log p_t(\bx)$.

</li>

<li v-click="1">

Since $\bv(\bx, t) = \bff(\bx, t) - \frac{1}{2} g^2(t) \bs(\bx, t)$ (PF-ODE), the reverse drift equals $\bff - g^2 \bs = \bv - \frac{1}{2} g^2 \bs$.

</li>

</ul>

<div class="block" v-click="2">

## Proof Sketch

<ul>

<li v-click="2">

Convert the initial SDE to a probability flow ODE.

</li>

<li v-click="2">

Reverse the probability flow ODE.

</li>

<li v-click="2">

Convert the reversed probability flow ODE back to an SDE.

</li>

</ul>

</div>

<div class="source"><a href="https://doi.org/10.1016/0304-4149(82)90051-5">Anderson B. D. O. Reverse-time diffusion equation models, 1982</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 3
id: proof-of-reverse-sde
class: theorems
---

# Proof of Reverse SDE

<ol>

<li>

Convert the initial SDE to a probability flow ODE.

$$
\begin{aligned}
d\bx &= \bff(\bx, t)\,dt + g(t)\,d\bw \\
d\bx &= \left(\bff(\bx, t) - \frac{1}{2} g^2(t) \frac{\partial}{\partial \bx} \log p_t(\bx)\right) dt
\end{aligned}
$$

</li>

<li v-click="1">

Reverse the probability flow ODE by setting $\tau = 1-t$, so $dt = -d\tau$.

$$
d\bx = \left(-\bff(\bx, 1-\tau) + \frac{1}{2} g^2(1-\tau) \frac{\partial}{\partial \bx} \log p_{1-\tau}(\bx)\right) d\tau
$$

</li>

<li v-click="2">

To restore diffusion $g(1-\tau)$, add the score term from step 2 once more to the drift.

$$
d\bx = \left(-\bff(\bx, 1-\tau) + g^2(1-\tau) \frac{\partial}{\partial \bx} \log p_{1-\tau}(\bx)\right) d\tau + g(1-\tau)\,d\bw
$$

Here $\bw(\tau)$ is a Wiener process in forward $\tau$-time.

</li>

<li v-click="3">

Return to $t=1-\tau$. Now $dt=-d\tau<0$ and $\bar{\bw}$ is a reverse-time Wiener process.

$$
d\bx = \left(\bff(\bx,t) - g^2(t) \frac{\partial}{\partial \bx}\log p_t(\bx)\right) dt + g(t)\,d\bar{\bw}.
$$

</li>

</ol>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 4
id: reverse-sde-3
class: theorems
---

# Reverse SDE

<div class="block">

## Theorem

There exists a reverse SDE for $d\bx = \bff(\bx, t) dt + g(t) d \bw$ (assume $p_t(\bx) > 0$), given by:

$$
d\bx = \left(\bff(\bx, t) {\color{#8854c0}- g^2(t) \frac{\partial}{\partial \bx}\log p_t(\bx)}\right) dt + g(t) d \bar{\bw}
$$

where $dt<0$ and $\bar{\bw}(t)$ is a reverse-time Wiener process.

</div>

<div class="block" v-click="1">

## Example · A one-dimensional Wiener process

<table class="wiener-example">
<tbody>
<tr>
<th scope="row">Forward SDE</th>
<td>

$dx_t=dw_t,\qquad x_0=0,\qquad f=0,\quad g=1.$

</td>
</tr>
<tr v-click="2">
<th scope="row">Reverse SDE</th>
<td>

$dx_t=-s(x_t,t)\,dt+d\bar w_t,\qquad dt<0.$

</td>
</tr>
<tr v-click="3">
<th scope="row">Gaussian score</th>
<td>

$p_t=\cN(0,t),\quad s(x,t)=\partial_x\log p_t(x)=-\dfrac{x}{t}\quad\Longrightarrow\quad dx_t=\dfrac{x_t}{t}\,dt+d\bar w_t.$

</td>
</tr>
<tr v-click="4">
<th scope="row">Euler–Maruyama step</th>
<td>

$x_{t-h}\approx x_t-\dfrac{h x_t}{t}+\sqrt h\,\epsilon,\qquad 0<h<t,\quad\epsilon\sim\cN(0,1).$

</td>
</tr>
</tbody>
</table>

<div v-click="4">

Starting at $x_1=1$, one backward step gives $x_{1-h}\approx 1-h+\sqrt h\,\epsilon$.

</div>

</div>

<div class="source"><a href="https://doi.org/10.1016/0304-4149(82)90051-5">Anderson, Reverse-time diffusion equation models, 1982</a> · <a href="https://arxiv.org/abs/2011.13456">Song et al., Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

<style>
.wiener-example td p { margin: 0; }
</style>

---
clicks: 1
id: reverse-sde-4
class: theorems
---

# Reverse SDE

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

<div v-click="1">

<img src="/figs/sde.png" alt="Forward and reverse SDE trajectories alongside probability flow ODE trajectories between the data and prior distributions" style="width:100%;height:300px;object-fit:contain" />

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: reverse-sde-and-probability-flow-ode
class: interactive-slide
---

# Reverse SDE and Probability Flow ODE

Start from the same noisy samples: two dynamics, the same evolving density.

<ProbabilityPathDemo reverse />

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

<!--
After the reverse-SDE proof, compare exact reverse-SDE dynamics and PF-ODE on a horizontal time axis; the next slide specializes the formulas to VE/VP. Here f=0 and g=sqrt(2): the reverse SDE drift in forward tau time is +2 score(x,2-tau), while the reverse PF-ODE drift is +score(x,2-tau). Exact reverse transition: sample the mixture component conditional on the current state, then the Gaussian conditional at the earlier time. It reverses the law, not the particular forward Brownian realization. All methods start from the exact terminal mixture, not an approximate Gaussian prior.
-->

---
clicks: 2
id: ve-and-vp-probability-flow-and-reverse-sde
class: theorems
---

# VE and VP: Probability Flow and Reverse SDE

Start from the forward SDE $d\bx=\bff\,dt+g\,d\bw$ with score $\bs=\nabla_{\bx}\log p_t(\bx)$.

<table class="ve-vp-comparison">
<thead>
<tr><th scope="col">General formula</th><th scope="col">VE / NCSN</th><th scope="col">VP / DDPM</th></tr>
</thead>
<tbody>
<tr>
<td>

**Forward coefficients**

Drift $\bff(\bx,t)$ and diffusion $g(t)$

</td>
<td>

$$
\bff=0,\qquad g^2=\frac{d\sigma^2(t)}{dt}
$$

$\sigma(t)$ increases with time.

</td>
<td>

$$
\bff=-\tfrac12\beta(t)\bx,\qquad g^2=\beta(t)
$$

Unit initial variance is preserved.

</td>
</tr>
<tr v-click="1">
<td>

**Probability Flow ODE**

$$
d\bx=(\bff-{\color{teal}\tfrac12 g^2\bs})\,dt
$$

</td>
<td>

$$
d\bx=-{\color{teal}\tfrac12 \frac{d\sigma^2(t)}{dt}\bs}\,dt
$$

</td>
<td>

$$
d\bx=\bigl(-\tfrac12\beta(t)\bx-{\color{teal}\tfrac12\beta(t)\bs}\bigr)\,dt
$$

</td>
</tr>
<tr v-click="2">
<td>

**Reverse SDE**

$$
\begin{aligned}
d\bx &= (\bff-{\color{#8854c0}g^2\bs})\,dt \\
     &\quad + g\,d\bar{\bw}
\end{aligned}
$$

</td>
<td>

$$
\begin{aligned}
d\bx &= -{\color{#8854c0}\frac{d\sigma^2(t)}{dt}\bs}\,dt \\
     &\quad + \sqrt{\frac{d\sigma^2(t)}{dt}}\,d\bar{\bw}
\end{aligned}
$$

</td>
<td>

$$
\begin{aligned}
d\bx &= \bigl(-\tfrac12\beta(t)\bx-{\color{#8854c0}\beta(t)\bs}\bigr)\,dt \\
     &\quad + \sqrt{\beta(t)}\,d\bar{\bw}
\end{aligned}
$$

</td>
</tr>
</tbody>
</table>

<div v-click="2">

For the reverse SDE, $dt<0$ and $\bar{\bw}$ is a reverse-time Wiener process.

</div>

<style>
.ve-vp-comparison { table-layout: fixed; }
.ve-vp-comparison td { vertical-align: middle; }
.ve-vp-comparison td:first-child { background: #eaf5f4; }
.ve-vp-comparison td > p { margin: 0; }
</style>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: outline-5
section: "Score-Based Generative Models Through SDEs"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>
<div class="outline-item"><span>02</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>03</span><div>Reverse SDE</div></div>
<div class="outline-item current"><span>04</span><div>Score-Based Generative Models Through SDEs</div></div>

</div>

---
clicks: 2
id: score-based-generative-models-through-sdes
class: theorems
---

# Score-Based Generative Models Through SDEs

<div class="block">

## Discrete-Time Objective

$$
\bbE_{\pd(\bx_0)} {\color{teal}\bbE_{t \sim U\{1, T\}}} \bbE_{q(\bx_t | \bx_0)}\bigl\| \bs_{\btheta, t}(\bx_t) - \nabla_{\bx_t} \log q(\bx_t | \bx_0) \bigr\|^2_2
$$

</div>

Use unit score-loss weights here. Can we extend this objective to continuous time?

<div class="block" v-click="1">

## Continuous-Time Objective

<div v-click="1">

$$
\bbE_{\pd(\bx(0))} {\color{teal}\bbE_{t \sim U[0, 1]}} \bbE_{q(\bx(t) | \bx(0))}\bigl\| \bs_{\btheta}(\bx(t), t) - \nabla_{\bx(t)} \log q(\bx(t) | \bx(0)) \bigr\|^2_2
$$

</div>

</div>

<div v-click="2">

<img src="/figs/sbgm.png" alt="sbgm" style="width:100%;height:300px;object-fit:contain" />

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: generative-models-taxonomy
class: theorems
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" sde-based-diffusion />

---
clicks: 2
id: score-based-generative-models-through-sdes-2
class: theorems
---

# What Is the Score Target for VE and VP?

## Continuous-Time Objective

$$
\bbE_{\pd(\bx(0))} \bbE_{t \sim U[0, 1]} \bbE_{q(\bx(t) \mid \bx(0))}
\bigl\| \bs_{\btheta}(\bx(t), t) - {\color{teal}\nabla_{\bx(t)} \log q(\bx(t) \mid \bx(0))} \bigr\|^2_2
$$

<div v-click="1">

Fix a clean example $\bx_0=\bx(0)$. Each forward step uses fresh noise $\bepsilon_k\sim\cN(0,\bI)$.

<div class="columns">
<section>

## VE / NCSN

$$
\bx_k=\bx_{k-1}+\sqrt{\sigma_k^2-\sigma_{k-1}^2}\,\bepsilon_k
$$

</section>
<section>

## VP / DDPM

$$
\bx_k=\sqrt{1-\beta_k}\,\bx_{k-1}+\sqrt{\beta_k}\,\bepsilon_k
$$

</section>
</div>

After two steps, the noise is a weighted sum of two independent Gaussian draws, so it is Gaussian again. Each further step only rescales it and adds fresh Gaussian noise.

</div>

<div v-click="2">

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

How do $\bmu(\bx(0),t)$ and $\sigma^2(t)$ evolve under the VE and VP forward SDEs?

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song et al., Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a> · <a href="https://users.aalto.fi/~asolin/sde-book/sde-book.pdf">Särkkä &amp; Solin, Applied Stochastic Differential Equations, §6.1, 2019</a></div>

---
clicks: 2
id: score-based-generative-models-through-sdes-3
class: theorems
---

# Conditional Mean and Variance of the Forward SDE

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

## Proof for the conditional mean

What happens to the Brownian increment when we average over paths starting at the same $\bx(0)$?

<div v-click="1">

$$
\bbE[d\bx\mid\bx(0)]
= f(t)\,\bbE[\bx(t)\mid\bx(0)]\,dt
+ g(t)\,{\color{#8854c0}\bbE[d\bw\mid\bx(0)]}.
$$

</div>

<div v-click="2">

The Brownian increment is independent of $\bx(0)$ and has mean zero. Hence

$$
d\bmu(\bx(0),t)
=\bbE[d\bx\mid\bx(0)]
=f(t)\bmu(\bx(0),t)\,dt
\qquad\Longrightarrow\qquad
\frac{d\bmu(\bx(0),t)}{dt}=f(t)\bmu(\bx(0),t).
$$

</div>

<div class="source"><a href="https://users.aalto.fi/~asolin/sde-book/sde-book.pdf">Särkkä S., Solin A. Applied stochastic differential equations, 2019</a></div>

---
clicks: 2
id: score-based-generative-models-through-sdes-4
class: theorems
---

# Conditional Mean and Variance for VE and VP

Fix $\bx(0)$ and write $v(t)$ for the conditional variance per coordinate. Then $\bmu(0)=\bx(0)$ and $v(0)=0$.

<table class="conditional-moments">
<thead>
<tr><th scope="col"></th><th scope="col">VE / NCSN</th><th scope="col">VP / DDPM</th></tr>
</thead>
<tbody>
<tr>
<th scope="row">SDE coefficients</th>
<td>

$f(t)=0,\quad g^2(t)=\dfrac{d\sigma^2(t)}{dt}$

</td>
<td>

$f(t)=-\tfrac12\beta(t),\quad g^2(t)=\beta(t)$

</td>
</tr>
<tr v-click="1">
<th scope="row">

Conditional mean

$\dfrac{d\bmu}{dt}=f(t)\bmu(t)$

</th>
<td>

$\dfrac{d\bmu}{dt}=0$

$$
\bmu(t)=\bx(0)
$$

</td>
<td>

$\dfrac{d\bmu}{dt}=-\tfrac12\beta(t)\bmu(t)$

$$
\bmu(t)=\exp\!\left(-\tfrac12\int_0^t\beta(s)\,ds\right)\bx(0)
$$

</td>
</tr>
<tr v-click="2">
<th scope="row">

Conditional variance

$\dfrac{dv}{dt}=2f(t)v(t)+g^2(t)$

</th>
<td>

$\dfrac{dv}{dt}=\dfrac{d\sigma^2(t)}{dt}$

$$
v(t)=\sigma^2(t)-\sigma^2(0)
$$

</td>
<td>

$\dfrac{dv}{dt}=\beta(t)(1-v(t))$

$$
v(t)=1-\exp\!\left(-\int_0^t\beta(s)\,ds\right)
$$

</td>
</tr>
</tbody>
</table>

<div class="takeaway" v-click="2">

**VE** keeps the mean at $\bx(0)$. **VP** shrinks the mean towards zero as variance grows towards one.

</div>

<style>
.conditional-moments { table-layout: fixed; }
.conditional-moments th:first-child { width: 26%; }
.conditional-moments thead th, .conditional-moments td { text-align: center; }
.conditional-moments td { vertical-align: middle; }
.conditional-moments td p { margin: 0; }
.conditional-moments th .katex { color: var(--navy); }
</style>

<div class="source"><a href="https://users.aalto.fi/~asolin/sde-book/sde-book.pdf">Särkkä &amp; Solin, Applied Stochastic Differential Equations, §6.1, 2019</a> · <a href="https://arxiv.org/abs/2011.13456">Song et al., Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 2
id: score-based-generative-models-through-sdes-5
class: theorems
---

# Score-Based Generative Models Through SDEs

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

$$
q(\bx(t) | \bx(0)) = \cN\Bigl(\bmu(\bx(0), t), \sigma^2(t) \cdot \bI\Bigr)
$$

<div class="block" v-click="1">

## NCSN

<div v-click="1">

$$
q(\bx(t) | \bx(0)) = \cN\left(\bx(0), \left[\sigma^2(t) - \sigma^2(0)\right] \cdot \bI\right)
$$

</div>

</div>

<div class="block" v-click="2">

## DDPM

<div v-click="2">

$$
q(\bx(t) | \bx(0)) = \cN\left(\bx(0) e^{-\frac{1}{2} \int_0^t\beta(s)ds}, \left(1 - e^{- \int_0^t\beta(s)ds}\right) \cdot \bI\right)
$$

</div>

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 1
id: sampling-with-the-reverse-sde
class: theorems
---

# Sampling with the Reverse SDE

**Use the trained score for sampling.**

<div class="block">

## Sampling

<ol>

<li>

For the VP-SDE, sample $\bx(1) \sim \cN(0, \bI)$ from the approximate terminal distribution.

</li>

<li>

Solve the reverse SDE from $T=1$ to $t=0$ using $\SDESolve$.

</li>

</ol>

<img src="/figs/sbgm.png" alt="sbgm" style="width:100%;height:260px;object-fit:contain" />

</div>

<ul>

<li v-click="1">

An Euler–Maruyama step of the reverse SDE adds fresh Gaussian noise.

</li>

<li v-click="1">

An Euler step of the probability flow ODE is deterministic given the current state.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

<!--
The VP example uses a standard Gaussian prior when the forward process has nearly erased the signal. The next slide compares one reverse SDE step and one PF-ODE step from the same state.
-->

---
clicks: 2
id: sampling-reverse-sde-vs-pf-ode
class: theorems
---

# Sampling: Reverse SDE vs PF-ODE

Use the same VP prior sample $\bx(1)$ and trained score $\bs_{\btheta}$ for both methods.

Take $K$ steps from $t=1$ to $t=0$ with $\Delta t=1/K$.

<div class="block" v-click="1">

## Sampling (Reverse SDE, Euler–Maruyama)

<ol>

<li v-click="1">

Draw independent noise $\bepsilon \sim \cN(0, \bI)$ at each step.

</li>

<li v-click="1">

Update the state.

$$
\bx(t-\Delta t) = \bx(t) - \Bigl[\bff(\bx(t), t) - {\color{#8854c0}g^2(t)}\, \bs_{\btheta}(\bx(t), t)\Bigr] \Delta t \, {\color{#8854c0}+ \, g(t)\sqrt{\Delta t}\,\bepsilon}.
$$

</li>

</ol>

</div>

<div class="block" v-click="2">

## Sampling (PF-ODE, Euler)

<ol>

<li v-click="2">

Update the state deterministically.

$$
\bx(t-\Delta t) = \bx(t) - \Bigl[\bff(\bx(t), t) - {\color{teal}\tfrac{1}{2}\, g^2(t)}\, \bs_{\btheta}(\bx(t), t)\Bigr] \Delta t.
$$

</li>

</ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: summary
class: summary
---

# Summary

<ul>

<li>

The VE-SDE matches the Gaussian perturbations used by NCSN. The VP-SDE is the continuous-time limit of the DDPM forward chain.

</li>

<li>

The probability flow ODE follows the same density $p_t$ as the diffusion. Its invertible flow gives the log-likelihood through the instantaneous change of variables.

</li>

<li>

The reverse SDE uses the score $\nabla_{\bx} \log p_t(\bx)$ and draws fresh noise at each Euler–Maruyama step. The PF-ODE gives a deterministic trajectory from the same starting point.

</li>

<li>

For VE and VP, the Gaussian transition gives an explicit conditional score target for continuous-time DSM.

</li>

</ul>
