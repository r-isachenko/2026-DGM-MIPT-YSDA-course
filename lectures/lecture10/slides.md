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
\begin{aligned}
\bpsi_1(\bx_0) &= \bx_0 + \int_{0}^{1} \bv_{\btheta}(\bpsi_t(\bx_0), t) dt \\
		\bx(1) &= \bx(0) + \int_{0}^{1} \bv_{\btheta}(\bx(t), t) dt \\
		\bx(0) &= \bx(1) + \int_{1}^{0} \bv_{\btheta}(\bx(t), t) dt
\end{aligned}
$$

**Note:** Unlike discrete-time flows, $\bv$ need not be invertible (uniqueness ensures bijection).

How can we compute $p_t(\bx)$ at arbitrary $t$?

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 0
id: recap-of-previous-lecture-4
class: theorems
---

# Recap of Previous Lecture

$$
\frac{d \bx(t)}{dt} = \bv_{\btheta}(\bx(t), t); \quad \text{with initial condition }\bx(t_0) = \bx_0
$$

<div class="block">

## Theorem (Continuity Equation)

If $\bv$ is continuously differentiable in $\bx$ (with bounded derivative) and continuous in $t$, and $p_t(\bx) > 0$, then

$$
\frac{d \log p_t(\bx(t))}{d t} = - \tr \left( \frac{\partial \bv(\bx(t), t)}{\partial \bx(t)} \right)
$$

</div>

<div class="block">

## Solution

$$
\log p_1(\bx(1)) = \log p_0(\bx(0)) - {\color{teal}\int_{0}^{1} \tr  \left( \frac{\partial \bv(\bx(t), t)}{\partial \bx(t)} \right) dt}.
$$

</div>

**Hutchinson's trace estimator:**

$$
\tr(\bJ)=\bbE_{\bepsilon\sim\cN(0,\bI)}[\bepsilon^T\bJ\bepsilon],\qquad
\bJ=\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}.
$$

**Exact density identity; approximate computation.** Use a numerical ODE solver and one noise vector for an unbiased trace estimate via autodiff.

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a><br><a href="https://arxiv.org/abs/1810.01367">Grathwohl W. et al. FFJORD: Free-form Continuous Dynamics for Scalable Reversible Generative Models, 2018</a></div>

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

# Recap of Previous Lecture

<div class="block">

## SDE Basics

Let's define a stochastic process $\bx(t)$ with initial condition $\bx(0) \sim p_0(\bx)$:

$$
d\bx = \bff(\bx, t) dt + g(t) d \bw,
$$

where $\bw(t)$ is the standard Wiener process (Brownian motion):

$$
\bw(t) - \bw(s) \sim \cN(0, (t - s) \bI), \quad d \bw = \bepsilon \cdot \sqrt{dt}, \, \text{where } \bepsilon \sim \cN(0, \bI).
$$

</div>

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

## Theorem (Kolmogorov-Fokker-Planck)

If $p_t(\bx) \in C^{1,2}$ (i.e., $C^1$ in $t$ and $C^2$ in $\bx$), then

$$
\frac{\partial p_t(\bx)}{\partial t} = - \diver\left(\bff(\bx, t) p_t(\bx)\right) + \frac{1}{2}g^2(t) \Delta_{\bx}p_t(\bx)
$$

</div>

<div class="block">

## Langevin SDE (Special Case)

$$
d \bx = {\color{#8854c0}\frac{1}{2} \frac{\partial}{\partial \bx} \log p_t(\bx) d t} + {\color{olive}1} \cdot d \bw
$$

</div>

The density $p_t(\bx)$ is a **stationary** distribution for the SDE.
Setting the stationary density to the model distribution, $p_t(\bx) = \pt(\bx)$ for all $t$:

<div class="block">

## Langevin Dynamic

$$
\bx_{t + 1} = \bx_t + \frac{\eta}{2} \cdot \nabla_{\bx} \log \pt(\bx) + \sqrt{\eta} \cdot \bepsilon, \quad \eta \approx dt.
$$

</div>

<div class="source"><a href="https://www.stats.ox.ac.uk/~teh/research/compstats/WelTeh2011a.pdf">Welling M. Bayesian Learning via Stochastic Gradient Langevin Dynamics, 2011</a></div>

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

$$
d \bx = \sqrt{\frac{ d [\sigma^2(t)]}{dt}} \cdot d \bw, \qquad \bff(\bx, t) = 0, \quad g(t) = \sqrt{\frac{ d [\sigma^2(t)]}{dt}}
$$

$\sigma(t)$ is a monotonically increasing function.

</div>

<div class="block">

## Variance Preserving SDE (DDPM)

$$
d \bx = - \frac{1}{2} \beta(t) \bx(t) dt + \sqrt{\beta(t)} \cdot d \bw, \qquad \bff(\bx, t) = - \frac{1}{2} \beta(t) \bx(t) , \quad g(t) = \sqrt{\beta(t)}
$$

Variance is preserved as long as $\bx(0)$ has unit variance.

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: outline
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>02</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>03</span><div>Score-Based Generative Models Through SDEs</div></div>
<div class="outline-item"><span>04</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item"><span>05</span><div>Flow Matching (FM)</div></div>

</div>

---
clicks: 0
id: outline-3
section: "Probability Flow ODE"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>02</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>03</span><div>Score-Based Generative Models Through SDEs</div></div>
<div class="outline-item"><span>04</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item"><span>05</span><div>Flow Matching (FM)</div></div>

</div>

---
clicks: 1
id: probability-flow-ode
class: theorems
---

# Probability Flow ODE

<div class="block">

## ODE and Continuity Equation

$$
d\bx = \bv(\bx, t) dt
$$

$$
\frac{d \log p_t(\bx(t))}{d t} = - \tr \left( \frac{\partial \bv(\bx(t), t)}{\partial \bx(t)} \right)
			\,  \Leftrightarrow  \,
			\frac{\partial p_t(\bx)}{\partial t} = - \diver(\bv(\bx, t) p_t(\bx))
$$

The only source of randomness is the initial distribution $p_0(\bx)$.

</div>

<div class="block" v-click="1">

## SDE and KFP Equation

<div v-click="1">

$$
d\bx = \bff(\bx, t) dt + g(t) d \bw
$$

</div>

<div v-click="1">

$$
\frac{\partial p_t(\bx)}{\partial t} = - \diver(\bff(\bx, t) p_t(\bx)) + \frac{1}{2}g^2(t) \Delta_{\bx}p_t(\bx)
$$

</div>

<div v-click="1">

Now there are two sources of randomness: the initial distribution $p_0(\bx)$ and the Wiener process $\bw(t)$.

</div>

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

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

<img src="/figs/probability_flow.png" alt="probability flow" style="width:100%;height:260px;object-fit:contain" />

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

<div class="block">

## Proof (Continued)

$$ {1|all} {at:1}
\begin{aligned}
\frac{\partial p_t(\bx)}{\partial t} &=  \tr\left( - \frac{\partial}{\partial \bx} \left[ \left( {\color{teal}\bff(\bx, t) - \frac{1}{2} g^2(t) \frac{\partial}{\partial \bx}\log p_t(\bx)}\right) p_t(\bx) \right]  \right)\\
&=  \tr\left( - \frac{\partial}{\partial \bx} \left[ {\color{teal}\bv(\bx, t)} p_t(\bx) \right]  \right) = -  \diver\left(\bv(\bx, t) p_t(\bx)\right)
\end{aligned}
$$

<div v-click="2">

$$
\bv(\bx, t) = \bff(\bx, t) -\frac{1}{2} g^2(t) \frac{\partial}{\partial \bx} \log p_t(\bx); \quad \tilde{g}(t) = 0
$$

</div>

<div v-click="2">

$$
d \bx = \bv(\bx, t) dt + 0 \cdot d \bw = \left(\bff(\bx, t) -\frac{1}{2} g^2(t) \frac{\partial}{\partial \bx} \log p_t(\bx) \right) dt
$$

</div>

<div v-click="2">

$$
\frac{\partial p_t(\bx)}{\partial t} = - \diver(\bv(\bx, t) p_t(\bx)) + \frac{1}{2}\tilde{g}^2(t) \Delta_{\bx}p_t(\bx)
$$

</div>

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 2
id: probability-flow-ode-5
class: theorems
---

# Probability Flow ODE

$$
\begin{aligned}
d\bx &= \bff(\bx, t) dt + g(t) d \bw \;\; - \text{SDE} \\
		d\bx &= \bv(\bx, t) dt  \;\; - \text{Probability Flow ODE}
\end{aligned}
$$

$$
\bv(\bx, t) = \bff(\bx, t) -\frac{1}{2} g^2(t) \frac{\partial}{\partial \bx} \log p_t(\bx)
$$

<ul>

<li v-click="1">

$\bs(\bx, t) = \frac{\partial}{\partial \bx} \log p_t(\bx)$ is the continuous-time score function.

</li>

<li v-click="2">

The ODE produces more stable trajectories.

</li>

</ul>

<div v-click="2">

<img src="/figs/probability_flow.png" alt="probability flow" style="width:100%;height:260px;object-fit:contain" />

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: same-densities-different-trajectories
class: interactive-slide
---

# Same Densities, Different Trajectories

The probability flow ODE follows the same probability path as the SDE.

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

# Why convert SDEs to PF-ODEs? (1) Efficient Sampling

Use the familiar ODE solvers with the learned PF-ODE field:

$$
\bv_{\btheta}(\bx,t)=\bff(\bx,t)-\frac12 g^2(t)\bs_{\btheta}(\bx,t).
$$

<table>
<thead><tr><th style="width: 24%">Solver</th><th>How it uses the network</th></tr></thead>
<tbody>
<tr><td><strong>Euler / Heun</strong></td><td>Apply the familiar ODE updates: 1 / 2 evaluations per step. EDM uses Heun.</td></tr>
<tr v-click="1"><td><strong>DPM-Solver<br>DPM-Solver++</strong></td><td>For VE/VP, integrate the linear drift exactly; approximate the network term. The ++ variant targets guided sampling.</td></tr>
<tr v-click="1"><td><strong>UniPC</strong></td><td>Correct the predicted ODE step using stored network predictions.</td></tr>
</tbody>
</table>

<div v-click="2">

Compare **NFE** (network evaluations). DPM-Solver reports **10–20 NFE**; the required budget depends on the model.

Noise injection is a separate choice: it can improve quality, but does not help every model.

</div>

<div class="source"><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a><br><a href="https://arxiv.org/abs/2206.00927">Lu C., et al. DPM-Solver: A Fast ODE Solver for Diffusion Probabilistic Model Sampling in Around 10 Steps, 2022</a><br><a href="https://arxiv.org/abs/2211.01095">Lu C., et al. DPM-Solver++: Fast Solver for Guided Sampling of Diffusion Probabilistic Models, 2022</a><br><a href="https://arxiv.org/abs/2302.04867">Zhao W., et al. UniPC: A Unified Predictor-Corrector Framework for Fast Sampling of Diffusion Models, 2023</a></div>

<!--
The trained score network stays fixed; the sampler changes how its evaluations are used.
For VE/VP, the PF-ODE has a known linear term and a learned score term. DPM-Solver integrates the linear part analytically and approximates the remaining integral; DPM-Solver++ uses the equivalent data-prediction form for guided sampling. No solver derivation is intended here.
UniPC's corrector is a deterministic ODE accuracy correction, not the Langevin corrector in stochastic predictor-corrector sampling. Its order can be increased without extra network evaluations by reusing predictions.
The 10–20 NFE figure is an experimental result from DPM-Solver, not a guarantee for arbitrary models or guidance settings. UniPC reports examples at 10 NFE; avoid turning this into a ranking across different benchmarks.
EDM's deterministic sampler uses Heun; noise injection is a separate option. EDM reports both models that benefit from stochasticity and models whose best results are deterministic. The denoiser parameterization is introduced later, after the complete score-model Training/Sampling pair.
-->

---
clicks: 2
id: why-convert-sdes-to-pf-odes-2-deterministic-sampling
class: theorems
---

# Why convert SDEs to PF-ODEs? (2) Deterministic Sampling

<ul>

<li>

The PF-ODE defines a deterministic, invertible map $\bx(0) \leftrightarrow \bx(T)$.

</li>

<li>

Each terminal $\bx(T)$ produces a unique trajectory back to data space.

</li>

</ul>

<div class="block" v-click="1">

## Log-likelihood via the probability-flow ODE

<div v-click="1">

$$
\log p_0(\bx(0)) = \log p_T(\bx(T)) + \int_0^T \tr\left(\frac{\partial \bv(\bx(t), t)}{\partial \bx(t)}\right) dt
$$

Exact change-of-variables identity; numerical evaluation uses an ODE solver and, optionally, Hutchinson's trace estimator.

</div>

</div>

<ul>

<li v-click="2">

Connects PF-ODE to continuous normalizing flows.

</li>

<li v-click="2">

Invertibility enables image $\to$ latent $\to$ edited image workflows.

</li>

<li v-click="2">

Smooth interpolation in latent space between two samples.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q., et al. Neural Ordinary Differential Equations, 2018</a><br><a href="https://arxiv.org/abs/1810.01367">Grathwohl W. et al. FFJORD: Free-form Continuous Dynamics for Scalable Reversible Generative Models, 2018</a></div>

---
clicks: 2
id: sampling-reverse-sde-vs-pf-ode
class: theorems
---

# Sampling: Reverse SDE vs PF-ODE

The same trained score $\bs_{\btheta}(\bx, t)$ defines two sampling dynamics (reverse SDE derived next).

<div class="block" v-click="1">

## Sampling (Reverse SDE, Euler–Maruyama)

<ol>

<li v-click="1">

Sample $\bx_T \sim \cN(0, \bI)$.

</li>

<li v-click="1">

Initialize step $\Delta t = T / K$.

</li>

<li v-click="1">

Denoise:

$$
\bx_{t - \Delta t} = \bx_t - \Bigl[\bff(\bx_t, t) - {\color{#8854c0}g^2(t)}\, \bs_{\btheta}(\bx_t, t)\Bigr] \Delta t \, {\color{#8854c0}+ \, g(t)\sqrt{\Delta t} \cdot \bepsilon}, \;\; \bepsilon \sim \cN(0, \bI)
$$

</li>

</ol>

</div>

<div class="block" v-click="2">

## Sampling (PF-ODE, Euler)

<ol>

<li v-click="2">

Sample $\bx_T \sim \cN(0, \bI)$.

</li>

<li v-click="2">

Initialize step $\Delta t = T / K$.

</li>

<li v-click="2">

Denoise:

$$
\bx_{t - \Delta t} = \bx_t - \Bigl[\bff(\bx_t, t) - {\color{teal}\tfrac{1}{2}\, g^2(t)}\, \bs_{\btheta}(\bx_t, t)\Bigr] \Delta t \;\; {\color{teal}(\text{no noise injection})}
$$

</li>

</ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: outline-4
section: "Reverse SDE"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Probability Flow ODE</div></div>
<div class="outline-item current"><span>02</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>03</span><div>Score-Based Generative Models Through SDEs</div></div>
<div class="outline-item"><span>04</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item"><span>05</span><div>Flow Matching (FM)</div></div>

</div>

---
clicks: 3
id: reverse-sde
class: theorems
---

# Reverse SDE

$$
d\bx = \bv(\bx, t) dt,\qquad \bx(t + dt) = \bx(t) + \bv(\bx, t) dt
$$

Here $dt$ can be $>0$ or $<0$.

<div class="block" v-click="1">

## Reverse ODE

<div v-click="1">

Let $\tau = 1 - t$ ($d\tau = -dt$).

</div>

<div v-click="1">

$$
d\bx = - \bv(\bx, 1 - \tau) d\tau
$$

</div>

</div>

<ul>

<li v-click="2">

How do we reverse the SDE $d\bx = \bff(\bx, t) dt + g(t) d \bw$?

</li>

<li v-click="2">

The Wiener process introduces randomness that must be reversed.

</li>

</ul>

<div class="block" v-click="3">

## Theorem

<div v-click="3">

There exists a reverse SDE for $d\bx = \bff(\bx, t) dt + g(t) d \bw$ (assume $p_t(\bx) > 0$), given by:

</div>

<div v-click="3">

$$
d\bx = \left(\bff(\bx, t) - g^2(t) \frac{\partial}{\partial \bx}\log p_t(\bx)\right) dt + g(t) d \bar{\bw}
$$

</div>

<div v-click="3">

where $dt<0$ and $\bar{\bw}$ is a reverse-time Wiener process.

</div>

</div>

<div class="source"><a href="https://doi.org/10.1016/0304-4149(82)90051-5">Anderson B. D. O. Reverse-time diffusion equation models, 1982</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

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
clicks: 1
id: proof-of-reverse-sde
class: theorems
---

# Proof of Reverse SDE

<ul>

<li>

Convert the initial SDE to a probability flow ODE:

$$
\begin{aligned}
d\bx &= \bff(\bx, t) dt + g(t) d \bw \\
				d\bx &= \left(\bff(\bx, t) -\frac{1}{2} g^2(t) \frac{\partial}{\partial \bx} \log p_t(\bx) \right) dt
\end{aligned}
$$

</li>

<li v-click="1">

Reverse the probability flow ODE:

$$
\begin{aligned}
d\bx &= \left(\bff(\bx, t) -\frac{1}{2} g^2(t) \frac{\partial}{\partial \bx} \log p_t(\bx) \right) dt \\
				d\bx &= \left(-\bff(\bx, 1 - \tau) + \frac{1}{2} g^2(1 - \tau) \frac{\partial}{\partial \bx} \log p_{1 - \tau}(\bx) \right) d\tau
\end{aligned}
$$

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: proof-of-reverse-sde-2
class: theorems
---

# Proof of Reverse SDE

<ul>

<li>

Convert the reversed probability flow ODE back to an SDE:

$$
\begin{aligned}
d\bx &= \left(-\bff(\bx, 1 - \tau) + \frac{1}{2} g^2(1 - \tau) \frac{\partial}{\partial \bx} \log p_{1 - \tau}(\bx) \right) d \tau \\
				d\bx &= \left(-\bff(\bx, 1 - \tau) + g^2(1 - \tau) \frac{\partial}{\partial \bx} \log p_{1 - \tau}(\bx) \right) d \tau + g(1-\tau)d\bw
\end{aligned}
$$

Here $\bw(\tau)$ is a Wiener process in forward $\tau$-time.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 1
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

<div class="block">

## Proof (Continued)

$$
d\bx = \left(-\bff(\bx, 1 - \tau) + g^2(1 - \tau) \frac{\partial}{\partial \bx} \log p_{1 - \tau}(\bx) \right)d\tau + g(1 - \tau) d \bw
$$

<div v-click="1">

$$
d\bx = \left(\bff(\bx, t) - g^2(t) \frac{\partial}{\partial \bx}\log p_t(\bx)\right)dt + g(t) d\bar{\bw}
$$

</div>

<div v-click="1">

Here $d\tau > 0$, $dt < 0$, and $\bar{\bw}$ is reverse-time Wiener process.

</div>

</div>

<div class="source"><a href="https://doi.org/10.1016/0304-4149(82)90051-5">Anderson B. D. O. Reverse-time diffusion equation models, 1982</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

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

$$
\begin{aligned}
d\bx &= \bv(\bx, t) dt \;\; - \textbf{Probability Flow ODE} \\
		d\bx &= \bigl({\color{#8854c0}\bv(\bx, t) - \frac{1}{2} g^2(t) \bs(\bx, t)}\bigr) dt + g(t) d \bar{\bw} \;\; - \textbf{Reverse SDE}
\end{aligned}
$$

<div v-click="1">

<img src="/figs/sde.png" alt="sde" style="width:100%;height:260px;object-fit:contain" />

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

Write $\bs = \nabla_{\bx}\log p_t(\bx)$.

<div class="columns">
<div>

## VE / NCSN

$\sigma(t)$ is monotonically increasing.

$$
d\bx = \sqrt{\frac{d\sigma^2(t)}{dt}}\,d\bw
$$

</div>
<div>

## VP / DDPM

Unit initial variance is preserved.

$$
d\bx = -\frac12\beta(t)\bx\,dt + \sqrt{\beta(t)}\,d\bw
$$

</div>
</div>

<div v-click="1">

## Probability Flow ODE

<div class="columns">
<div>

$$
d\bx = -\frac12\frac{d\sigma^2(t)}{dt}\bs\,dt
$$

</div>
<div>

$$
d\bx = \left(-\frac12\beta(t)\bx-\frac12\beta(t)\bs\right)dt
$$

</div>
</div>
</div>

<div v-click="2">

## Reverse SDE

<div class="columns">
<div>

$$
\begin{aligned}
d\bx &= -\frac{d\sigma^2(t)}{dt}\bs\,dt \\
&\quad + \sqrt{\frac{d\sigma^2(t)}{dt}}\,d\bar{\bw}
\end{aligned}
$$

</div>
<div>

$$
\begin{aligned}
d\bx &= \left(-\frac12\beta(t)\bx-\beta(t)\bs\right)dt \\
&\quad + \sqrt{\beta(t)}\,d\bar{\bw}
\end{aligned}
$$

</div>
</div>

Here $dt<0$ and $\bar{\bw}$ is a reverse-time Wiener process.

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: outline-5
section: "Score-Based Generative Models Through SDEs"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>02</span><div>Reverse SDE</div></div>
<div class="outline-item current"><span>03</span><div>Score-Based Generative Models Through SDEs</div></div>
<div class="outline-item"><span>04</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item"><span>05</span><div>Flow Matching (FM)</div></div>

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
\bbE_{\pd(\bx_0)} \bbE_{t \sim U\{1, T\}} \bbE_{q(\bx_t | \bx_0)}\bigl\| \bs_{\btheta, t}(\bx_t) - \nabla_{\bx_t} \log q(\bx_t | \bx_0) \bigr\|^2_2
$$

</div>

Use unit score-loss weights here. Can we extend this objective to continuous time?

<div class="block" v-click="1">

## Continuous-Time Objective

<div v-click="1">

$$
\bbE_{\pd(\bx(0))} \bbE_{t \sim U[0, 1]} \bbE_{q(\bx(t) | \bx(0))}\bigl\| \bs_{\btheta}(\bx(t), t) - {\color{teal}\nabla_{\bx(t)} \log q(\bx(t) | \bx(0))} \bigr\|^2_2
$$

</div>

</div>

<div v-click="2">

<img src="/figs/sbgm.png" alt="sbgm" style="width:100%;height:260px;object-fit:contain" />

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 3
id: training-time-and-noise-level
class: theorems
---

# Training Time and Noise Level

**Recall:** for $\bx(t)=a(t)\bx(0)+b(t)\bepsilon$, $\lambda(t)=\log\SNR(t)=\log\frac{a(t)^2}{b(t)^2}$.<br>
For DDPM, $a(t)^2=\bar\alpha_t$ and $b(t)^2=1-\bar\alpha_t$.<br>
Assume $\lambda(t)$ is differentiable and strictly monotone, with nonzero derivative.

<div class="block" v-click="1">

## A density changes when its coordinate changes

$$
t\sim r(t)\quad\Longrightarrow\quad
p_{\lambda}(\lambda)=r(t(\lambda))\left|\frac{dt}{d\lambda}\right|.
$$

</div>
<div v-click="2">

<img src="/figs/training-time-log-snr.svg" alt="Uniform training times mapped to nonuniform log-SNR levels and their logistic density" style="width:100%;height:200px;object-fit:contain" />

**Uniform time does not mean uniform log-SNR.**

</div>
<div v-click="3">

For a fixed objective $\int W(\lambda)\ell_{\btheta}(\lambda)d\lambda$, sample with loss $W(\lambda)\ell_{\btheta}(\lambda)/p_{\lambda}(\lambda)$.

The training distribution does not prescribe the generation grid.

</div>

<div class="source"><a href="https://arxiv.org/abs/2303.00848">Kingma D., Gao R. Understanding Diffusion Objectives as the ELBO with Simple Data Augmentation, 2023</a></div>

<!-- Narrative: the preceding slide extends discrete DSM to continuous time. This slide carries the earlier importance-sampling identity to a noise-level coordinate. The following taxonomy and Gaussian-kernel derivation explain which conditional distributions supply the score targets. Example only: a(t)^2=1-t, b(t)^2=t, hence lambda=log((1-t)/t), t=1/(1+exp(lambda)), and uniform t induces p_lambda=t(1-t). Endpoints are excluded; their log-SNR limits are infinite. Changing a schedule is interpreted here for a fixed family of corruption kernels indexed by noise level, not as an assertion that arbitrary probability paths or samplers coincide. W is the weight of the chosen per-level loss relative to d lambda; this is not automatically the weight of a different prediction target. For a fixed W and sufficient support, importance correction preserves the integral. -->

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

# Score-Based Generative Models Through SDEs

<div class="block">

## Continuous-Time Objective

$$
\bbE_{\pd(\bx(0))} \bbE_{t \sim U[0, 1]} \bbE_{q(\bx(t) | \bx(0))}\bigl\| \bs_{\btheta}(\bx(t), t) - {\color{teal}\nabla_{\bx(t)} \log q(\bx(t) | \bx(0))} \bigr\|^2_2
$$

</div>

<div v-click="1">

$$
q(\bx(t) | \bx(0)) = \cN\Bigl(\bmu(\bx(0), t), \sigma^2(t) \cdot \bI \Bigr)
$$

</div>

<div v-click="1">

$$
\nabla_{\bx(t)} \log q(\bx(t) | \bx(0)) = - \frac{1}{\sigma^2(t)} (\bx(t) - \bmu)
$$

</div>

<div v-click="1">

**Note:** Normality holds for $\bff(\bx, t)$ affine in $\bx$ ($\bff(\bx, t) = f(t) \bx$).

</div>

<div v-click="2">

$$
d \bx = \sqrt{\frac{ d [\sigma^2(t)]}{dt}} \cdot d \bw \ \ \text{(Variance Exploding SDE)}
$$

</div>

<div v-click="2">

$$
d \bx = - \frac{1}{2} \beta(t) \bx(t) dt + \sqrt{\beta(t)} \cdot d \bw \ \ \text{(Variance Preserving SDE)}
$$

</div>

<div v-click="2">

Is it possible to explicitly derive $\bmu(\bx(0), t)$ and $\sigma^2(t)$ for VE-SDE and VP-SDE?

</div>

<div class="source"><a href="https://users.aalto.fi/~asolin/sde-book/sde-book.pdf">Särkkä S., Solin A. Applied stochastic differential equations, 2019</a></div>

---
clicks: 4
id: score-based-generative-models-through-sdes-3
class: theorems
---

# Score-Based Generative Models Through SDEs

$$
q(\bx(t) | \bx(0)) = \cN\Bigl(\bmu(\bx(0), t), \sigma^2(t) \cdot \bI\Bigr)
$$

<div class="block">

## Theorem

The moments of the SDE $d\bx = f(t) \bx dt + g(t) d \bw$ satisfy:

$$
\frac{d \bmu(\bx(0), t)}{dt} = f(t) \bmu(\bx(0), t),
\qquad
\frac{d \sigma^2(t)}{dt} = 2 f(t) \sigma^2(t) + g^2(t)
$$

</div>

<div class="block" v-click="1">

## Proof

<div v-click="1">

$$ {1|1-2|all} {at:2}
\begin{aligned}
\bbE\left[{\color{#8854c0}d\bx} | \bx(0) \right] &= \bbE\left[{\color{#8854c0}f(t) \bx dt} | \bx(0) \right] + \bbE\left[{\color{#8854c0}g(t) d \bw} | \bx(0) \right]
\\ &= f(t) \bbE\left[\bx | \bx(0) \right] dt + g(t) \bbE\left[d \bw | \bx(0) \right]
\\ &= f(t) \bmu(\bx(0), t) dt
\end{aligned}
$$

</div>

<div v-click="4">

$$
\frac{d \bbE\left[\bx(t) | \bx(0) \right]}{dt} = \frac{d \bmu(\bx(0), t)}{dt} = f(t) \bmu(\bx(0), t)
$$

</div>

</div>

<div v-click="1">

We prove the mean equation only; the variance equation is stated without proof.

</div>

<div class="source"><a href="https://users.aalto.fi/~asolin/sde-book/sde-book.pdf">Särkkä S., Solin A. Applied stochastic differential equations, 2019</a></div>

---
clicks: 2
id: score-based-generative-models-through-sdes-4
class: theorems
---

# Score-Based Generative Models Through SDEs

<div class="block">

## Theorem

$$
\frac{d \bmu(\bx(0), t)}{dt} = f(t) \bmu(\bx(0), t)
$$

</div>

<div class="block">

## Examples

<div>

$$
\textbf{NCSN:}\quad	f(t) = 0 \quad \Rightarrow \quad \bmu = \bx(0)
$$

</div>

<div v-click="1">

$$
\textbf{DDPM:}\quad f(t) = - \frac{1}{2} \beta(t)\;\;   \Rightarrow\quad \frac{d \bmu}{dt} = - \frac{1}{2} \beta(t) \bmu
$$

</div>

<div v-click="2">

$$
\bmu = \bx(0) \exp\left(- \frac{1}{2} \int_0^t \beta(s)ds\right)
$$

</div>

</div>

<div class="source"><a href="https://users.aalto.fi/~asolin/sde-book/sde-book.pdf">Särkkä S., Solin A. Applied stochastic differential equations, 2019</a></div>

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

**Use the trained score for sampling.** Assume terminal prior $\cN(0,\bI)$.

<div class="block">

## Sampling

<ol>

<li>

Sample $\bx(1) \sim \cN(0, \bI)$.

</li>

<li>

Solve the reverse SDE using numerical solvers ($\SDESolve$).

</li>

</ol>

<img src="/figs/sbgm.png" alt="sbgm" style="width:100%;height:260px;object-fit:contain" />

</div>

<ul>

<li v-click="1">

Discretizing the reverse SDE provides ancestral sampling.

</li>

<li v-click="1">

Discretizing the probability flow ODE yields deterministic sampling.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

<!--
Narrative: directly complete the preceding general Training slide. Use its trained score in reverse-SDE sampling; the final bullets recall that the PF-ODE provides the deterministic alternative. The standard Gaussian terminal prior belongs to the general SDE convention here. The next block specializes this completed training/sampling scheme to additive-noise coordinates and a denoiser representation. No denoiser knowledge is required on this slide. The Training/Sampling blocks and formulas repeated in the next recap are unchanged.
-->

---
clicks: 0
id: outline-6
section: "Denoiser Parameterization and Sampling"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>02</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>03</span><div>Score-Based Generative Models Through SDEs</div></div>
<div class="outline-item current"><span>04</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item"><span>05</span><div>Flow Matching (FM)</div></div>

</div>

---
clicks: 2
id: from-time-to-noise-level
class: theorems
---

# From Time to Noise Level

**Use the familiar additive-noise form:** $\bx=\bx_0+\sigma\bepsilon$, $\bepsilon\sim\cN(0,\bI)$.

$$
\bff(\bx,t)=0,\qquad g^2(t)=\frac{d\sigma^2(t)}{dt}
=2\sigma(t)\frac{d\sigma(t)}{dt}.
$$

<div class="block" v-click="1" style="margin-top:8px">

## Rewrite the probability flow ODE using $\sigma$

<div>

$$
\begin{aligned}
\frac{d\bx(t)}{dt}
&=\bff(\bx(t),t)-\frac12g^2(t)\bs_{\btheta}(\bx(t),\sigma(t))\\
&=-\sigma(t)\frac{d\sigma(t)}{dt}\bs_{\btheta}(\bx(t),\sigma(t)).
\end{aligned}
$$

$$
\frac{d\bx}{d\sigma}
=\left(\frac{d\sigma(t)}{dt}\right)^{-1}\frac{d\bx(t)}{dt}
=-\sigma\bs_{\btheta}(\bx,\sigma).
$$

</div>

</div>

<div class="block" v-click="2">

## Choose a denoiser using Tweedie's formula

$$
\bbE[\bx_0\mid\bx]=\bx+\sigma^2\nabla_{\bx}\log p_{\sigma}(\bx).
$$

$$
D_{\btheta}(\bx,\sigma)\approx\bbE[\bx_0\mid\bx],\qquad
\frac{d\bx}{d\sigma}=-\sigma\bs_{\btheta}(\bx,\sigma)
=\frac{\bx-D_{\btheta}(\bx,\sigma)}{\sigma}.
$$

Decreasing $\sigma$ moves towards the denoiser prediction. **How do we train this denoiser?**

</div>

<div class="source"><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a></div>

<!--
Narrative: the preceding adjacent Training/Sampling pair completes the general score-based construction. After the agenda-only section transition, use the additive-noise form already motivated by the DDPM/NCSN rescaling and reuse the known PF-ODE. The block starts after the complete general algorithm, rather than interrupting its two halves. First substitute f and g, then apply the chain rule to use sigma as the independent variable. Only after obtaining the sigma-ODE, recall Tweedie's full identity and choose the familiar clean-data parameterization. The identity appears before its use to express the field through a denoiser. The denoiser form gives an interpretation of a negative-sigma step and motivates the next slide's training question.
All arguments are retained: f(x,t), g(t), sigma(t), s_theta(x(t),sigma(t)). The score network is indexed by noise level here. After changing independent variable, x denotes the same trajectory expressed as a function of sigma; this is a time reparameterization, not an additional generative method.
Assume sigma(t)>0 and d sigma(t)/dt>0 on the interval of the change of variables. The additive path is x = x_0 + sigma epsilon, so its forward SDE has zero drift and diffusion variance rate d sigma^2/dt. Sigma is the total additive-noise standard deviation; the earlier VE formula permits a nonzero initial sigma, which must be accounted for when identifying the clean initial state. VP's unscaled state is not this additive coordinate.
The denoiser choice is convenient, not required by the change of time coordinate and not universally superior to noise/score/v prediction. D_theta estimates the conditional mean; its score conversion follows from Tweedie. A learned prediction approximates the true marginal score and probability flow. A negative Euler increment in sigma points towards the current denoiser prediction; that prediction is recomputed along the trajectory.
The freedom to change samplers appeared with DDIM; the contribution here connects the familiar denoiser parameterization with the previously introduced general ODE solvers. Integrate at positive sigma, with an Euler denoising step to zero; do not evaluate the network or divide by sigma at zero. The preceding general Sampling slide uses its own standard-Gaussian terminal prior; the additive-noise sampler below scales its initial noise by sigma_max.
-->

---
clicks: 2
id: train-the-denoiser
class: theorems
---

# Train the Denoiser

**Use the existing score-training objective.** For a noisy-clean pair $(\bx,\bx_0)$ with $q(\bx\mid\bx_0)=\cN(\bx_0,\sigma^2\bI)$:

$$
\cL=\left\|\bs_{\btheta}(\bx,\sigma)-\nabla_{\bx}\log q(\bx\mid\bx_0)\right\|_2^2.
$$

<div class="block" v-click="1">

## Compute the conditional Gaussian target

$$
\nabla_{\bx}\log q(\bx\mid\bx_0)=-\frac{\bx-\bx_0}{\sigma^2}.
$$

</div>

<div class="block" v-click="2">

## Substitute the denoiser representation

$$
\begin{aligned}
\cL
&=\left\|\frac{D_{\btheta}(\bx,\sigma)-\bx}{\sigma^2}
+\frac{\bx-\bx_0}{\sigma^2}\right\|_2^2\\
&=\frac{1}{\sigma^4}\left\|D_{\btheta}(\bx,\sigma)-\bx_0\right\|_2^2.
\end{aligned}
$$

**Preserving the score objective requires the factor $1/\sigma^4$.**

Plain denoiser MSE would reweight noise levels. The trained denoiser supplies the sampling field.

</div>

<div class="source"><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a></div>

<!--
Narrative: the preceding slide rewrites the PF-ODE in sigma and chooses the familiar clean-data denoiser to represent its field. This slide answers how to train that denoiser. Start directly from the earlier per-pair DSM training loss, compute its conditional Gaussian target, and substitute the already established denoiser representation. Do not reintroduce Tweedie, the conditional-mean definition, or a standalone score conversion: those are inputs from the preceding slide, not new conclusions here. The conclusion is equivalence of that objective under a different network prediction target. The next slide makes the MSE optimum explicit for an empirical data distribution, before the trained denoiser is used in the sampling loop.
The optimal MSE predictor is the conditional mean at each fixed sigma > 0, not the original individual clean sample. The arrow from Tweedie's formula motivates a parameterization; a learned D_theta and score are approximate. The conditional Gaussian target in training is distinct from the marginal score in Tweedie's identity.
The loss equivalence is algebraic for every theta under the displayed substitution. The original score loss becomes sigma^-4 times clean-target MSE; this is not an arbitrary extra weight or the full EDM recipe. Preserve the same distribution over noise levels when calling the objectives equivalent.
This additive path is a specialization of the previous Gaussian transition; it does not identify VP's unscaled state with x_0 + sigma epsilon. Sigma denotes the total additive-noise standard deviation.
-->

---
clicks: 2
id: what-does-the-optimal-denoiser-predict
class: theorems
---

# What Does the Optimal Denoiser Predict?

Use uniform empirical data $\{\bx_1,\ldots,\bx_N\}$. For fixed $\bx$ and $\sigma>0$, let
$a_i=\cN(\bx;\bx_i,\sigma^2\bI)$ be the likelihood of the noisy observation.

<div class="block" v-click="1">

## Minimize the conditional MSE at $\bx$

$$
D^*(\bx,\sigma)=\argmin_{\by}\sum_{i=1}^{N}a_i\|\by-\bx_i\|_2^2
\quad\Longrightarrow\quad
2\sum_{i=1}^{N}a_i(\by-\bx_i)=0.
$$

$$
D^*(\bx,\sigma)
=\frac{\sum_{i=1}^{N}\exp\!\left(-\frac{\|\bx-\bx_i\|_2^2}{2\sigma^2}\right)\bx_i}
{\sum_{j=1}^{N}\exp\!\left(-\frac{\|\bx-\bx_j\|_2^2}{2\sigma^2}\right)}
=\bbE[\bx_0\mid\bx].
$$

Set the gradient to zero: the optimum is a **posterior-weighted average**.

</div>

<div class="block" v-click="2">

## Why train a network?

- The exact formula scans **all $N$ training examples at every sampling step**.
- It describes the empirical distribution; exact sampling only reproduces training examples.

</div>

<div class="source"><a href="https://proceedings.neurips.cc/paper_files/paper/2022/file/a98846e9d9cc01cfb87eb694d946ce6b-Supplemental-Conference.pdf#page=11">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022 — Appendix B.3, Eqs. (53–57)</a></div>

<!--
Narrative: the preceding slide expresses DSM as clean-target MSE. Here fix a noisy observation and sigma, and minimize the corresponding weighted least-squares problem. Under a uniform empirical prior, posterior weights are a_i/sum_j a_j, so the positive normalization constant can be dropped from the argmin. The sigma-only loss weight also does not change this unrestricted pointwise optimum. Differentiate with respect to the candidate vector y, set the gradient to zero, and solve for the weighted mean. Substitute the Gaussian likelihoods: the common normalization cancels, leaving the explicit normalized exponential formula. All a_i are positive for sigma>0, hence the objective is strictly convex and its unique minimizer is the conditional mean.
The rationale then motivates the next slide's neural Euler sampler. Exact evaluation of this finite sum costs O(Nd) for d-dimensional data and requires the training set at every evaluation. The formula is for a discrete empirical distribution, not the unknown population distribution. Exact sampling means starting from its exact noisy marginal and reversing exactly to zero noise; the resulting law is supported on the training examples. Finite-step sampling, approximate initialization and stopping at positive sigma do not imply this exact endpoint statement. A neural denoiser avoids an explicit dataset scan and supplies an inductive bias; it can generalize but can also memorize, so generalization is not guaranteed by choosing a network. D_theta is learned from noisy-clean pairs, not necessarily distilled by explicitly evaluating this sum.
The following Euler demo uses a smooth two-Gaussian population rather than the discrete empirical example. The conditional-mean definition and sampling field are unchanged. Noise-level asymptotics were removed at the author's request.
-->

---
clicks: 1
id: generate-samples-with-a-denoiser
class: theorems
---

# Generate Samples with a Denoiser

**Use the trained denoiser in the ODE solver.** Start from strong noise and decrease $\sigma$.

<div class="block" v-click="1">

## Sampling (Euler)

<ol>

<li>

Choose $\sigma_0>\sigma_1>\cdots>\sigma_N=0$ and sample $\bx^{(0)}\sim\cN(0,\sigma_0^2\bI)$.

</li>

<li>

For $i=0,\ldots,N-1$, evaluate $D_{\btheta}(\bx^{(i)},\sigma_i)$ and update:

$$
\bx^{(i+1)}=\bx^{(i)}+(\sigma_{i+1}-\sigma_i)
\frac{\bx^{(i)}-D_{\btheta}(\bx^{(i)},\sigma_i)}{\sigma_i}.
$$

</li>

<li>

Return $\bx^{(N)}$.

</li>

</ol>

</div>

<div v-click="1">

**We now have an explicit Euler sampler in noise coordinates.**

How does this relate to the deterministic DDIM update?

</div>

<div class="source"><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a></div>

<!--
Narrative: the noise-coordinate PF-ODE defines the denoiser field, and the preceding slides train its denoiser and interpret its conditional-mean prediction. This slide answers how to generate with the trained model: initialize strong Gaussian noise, repeatedly evaluate the network and apply an explicit Euler step, and return the final state. The conclusion asks how this explicit Euler sampler relates to the familiar deterministic DDIM update. The next slide recalls the original DDIM state and predictions, then normalizes the state and noise level to expose exactly this Euler step. The DDIM slide closes with the equivalence of the two updates; the next section motivates learning the velocity field at its own opening. Do not restart the conditional-mean explanation or branch into solver comparisons here; the model definition and solver options have already been established.
Superscripts (i) index numerical sampling states, avoiding confusion with the clean training target x_0. Choose sigma_0 sufficiently large that N(0,sigma_0^2 I) approximates the noisy data marginal. Euler is an approximate numerical solver; this is not an exact sampler at arbitrary step sizes or sigma_0.
The step follows x_next = x + delta_sigma * (x - D_theta)/sigma, with delta_sigma < 0. For a step ending at zero, x_next = D_theta(x,sigma); the network and denominator are evaluated at the positive current sigma, never at zero. Heun can integrate the same field; its final zero-noise step uses Euler to avoid evaluating the singular endpoint.
The learned denoiser estimates E[x_0|x] at the current positive noise level. It does not identify which original clean point generated a noisy point; repeated predictions along the numerical trajectory are part of the generative process. This distinction also prevents confusing the denoiser with a consistency model that targets a trajectory endpoint.
This extends the sampler-change idea introduced with DDIM, rather than claiming that denoiser prediction or changing the sampler is new. It is the explicit ODE/Euler realization of the denoiser parameterization.
-->

---
clicks: 0
id: one-denoiser-prediction-one-euler-step
class: interactive-slide
---

# One Denoiser Prediction, One Euler Step

Decrease the noise level, then recompute the denoiser at the new state.

<DenoiserStepDemo />

<div class="source"><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a></div>

<!--
The previous slide gives the complete Euler algorithm. This slide rewrites that update as interpolation towards the current denoiser prediction, then recomputes it at each accepted step. The next slide derives the identical update from deterministic DDIM in normalized coordinates. The analytic denoiser is the exact conditional mean for a two-component 2D Gaussian mixture with covariance 0.12 I. It need not lie in a high-density region. At sigma_next=0 stop; never evaluate an ODE quotient at sigma=0. Twelve accepted steps bound the live demonstration. No new training objective is introduced.
-->

---
clicks: 2
id: ddim-is-euler-in-noise-coordinates
class: theorems
---

# DDIM Is Euler in Noise Coordinates

**Recall deterministic DDIM** ($s<t$):

$$
\begin{aligned}
\hat{\bepsilon}&=\bepsilon_{\btheta,t}(\bx_t),\qquad
\hat{\bx}_0=\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\,\hat{\bepsilon}}{\sqrt{\bar{\alpha}_t}},\\
\bx_s&=\sqrt{\bar{\alpha}_s}\,\hat{\bx}_0+\sqrt{1-\bar{\alpha}_s}\,\hat{\bepsilon}.
\end{aligned}
$$

<div class="block" v-click="1">

## Recall the DDPM / NCSN rescaling ($\sigma_s<\sigma_t$)

$$
\tilde{\bx}_u=\frac{\bx_u}{\sqrt{\bar{\alpha}_u}},\qquad
\sigma_u=\sqrt{\frac{1-\bar{\alpha}_u}{\bar{\alpha}_u}},\qquad u\in\{s,t\}.
$$

$$
D_{\btheta}(\tilde{\bx}_t,\sigma_t)=\hat{\bx}_0
=\tilde{\bx}_t-\sigma_t\hat{\bepsilon}.
$$

</div>

<div class="block" v-click="2">

## Rewrite DDIM as the denoiser Euler step

$$
\begin{aligned}
\tilde{\bx}_s
&=\hat{\bx}_0+\sigma_s\hat{\bepsilon}
=\tilde{\bx}_t+(\sigma_s-\sigma_t)\hat{\bepsilon}\\
&=\tilde{\bx}_t+(\sigma_s-\sigma_t)
\frac{\tilde{\bx}_t-D_{\btheta}(\tilde{\bx}_t,\sigma_t)}{\sigma_t}.
\end{aligned}
$$

**DDIM implements this Euler step using the existing noise predictor.**

</div>

<div class="source"><a href="https://arxiv.org/abs/2010.02502">Song J., Meng C., Ermon S. Denoising Diffusion Implicit Models, 2021</a></div>

<!--
Narrative: the preceding slide gives an explicit Euler loop in additive-noise coordinates and asks how it relates to deterministic DDIM. Begin with the exact familiar DDIM formulas: the same epsilon_theta,t(x_t), clean estimate, original cumulative alpha_bar schedule, and decreasing index pair s<t. Then rescale both the state and the clock; define the induced denoiser before using it. Divide the DDIM update by sqrt(alpha_bar_s), substitute the current clean estimate, and recover the previous Euler step term for term. The conclusion closes the score/denoiser construction with the exact Euler interpretation of the existing noise predictor. After the agenda-only Outline, the CNF slide explicitly opens the task of learning the velocity field itself; its likelihood-training cost then motivates the following Flow Matching regression objective. No numerical lecture references are needed.
This is an exact algebraic equality between discrete sampling updates with the same predictor and grid, not an assertion of exact ODE integration, exact sampled marginals, or finite-step inversion. Euler in original x_t/time coordinates would generally be a different finite step. Primary source: DDIM Section 4.3, equations (13)-(15); the paper's alpha_t is the course's cumulative alpha_bar_t.
Recall the DDPM marginal x_t=sqrt(alpha_bar_t)x_0+sqrt(1-alpha_bar_t)epsilon. Dividing by sqrt(alpha_bar_t) gives tilde x_t=x_0+sigma_t epsilon: these are precisely the additive-noise coordinates used in the preceding ODE/denoiser block. The tilde distinguishes the normalized state from the original DDPM state; it is the x argument of that block. sigma_u is the standard deviation of additive noise in the normalized state, not the fresh transition-noise standard deviation sigma_{t->s}, which is zero for deterministic DDIM. For positive beta on the original schedule, s<t gives alpha_bar_s>alpha_bar_t and sigma_s<sigma_t. Assume 0<alpha_bar_t<1 and alpha_bar_s>0, permitting alpha_bar_0=1 at the final step.
D_theta here is the denoiser induced by the already trained noise predictor, not a separately trained replacement: D_theta(tilde x_t,sigma_t)=tilde x_t-sigma_t epsilon_theta,t(sqrt(alpha_bar_t)tilde x_t). The displayed equality to xhat_0 defines this representation exactly; its approximation to the conditional mean depends on model quality. Keep epsilon_theta's original input x_t and timestep t. No retraining or equality between differently weighted training recipes is asserted. For a continuous ODE interpretation, interpolate the schedule and noise-conditioned predictor between training levels. With the exact score, the field is the corresponding PF-ODE; a learned predictor gives its learned approximation.
All hats are recomputed at the current t for every step; they are held fixed only during the step t to s. At s=0, sigma_s=0 and tilde x_s=xhat_0, agreeing with the previous final Euler denoising step. The sigma_t denominator is positive. With the same initial DDPM latent, grid and induced denoiser, the two finite-step algorithms agree under rescaling. The original N(0,I) prior rescales to N(0,I/alpha_bar_T), which is N(0,(1+sigma_T^2)I); the preceding additive sampler's N(0,sigma_max^2 I) is a separate large-noise approximation. Do not claim exactly identical full samplers if their initializations differ.
-->

---
clicks: 0
id: outline-7
section: "Flow Matching (FM)"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>02</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>03</span><div>Score-Based Generative Models Through SDEs</div></div>
<div class="outline-item"><span>04</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item current"><span>05</span><div>Flow Matching (FM)</div></div>

</div>

---
clicks: 2
id: continuous-time-normalizing-flows
class: theorems
---

# Continuous-Time Normalizing Flows

**Now learn the velocity field itself.** Recall $\bx_t=\bx(t)$ for $t\in[0,1]$:

<ul>

<li>

$\bx_0 \sim p_0(\bx)$, where $p_0(\bx)$ is a base distribution (mostly $\cN(0, \bI)$);

</li>

<li>

$\bx_1 \sim p_1(\bx)$, where $p_1(\bx)$ is the true data distribution $\pd(\bx)$.

</li>

</ul>

**Time convention:** unlike the diffusion sections, here $t=0$ denotes noise and $t=1$ denotes data. Sampling runs forward in time.

$$
\frac{d \bx_t}{dt} = \bv (\bx_t, t),  \quad \text{with initial condition } \bx(0) = \bx_0.
$$

The velocity $\bv$ determines a flow $\bpsi_t$: $\bx_t = \bpsi_t(\bx_0)$.

<div class="block" v-click="1">

## KFP Theorem (Continuity Equation)

<div v-click="1">

$$
\frac{\partial p_t(\bx)}{\partial t} = - \diver\left(\bv(\bx, t) p_t(\bx)\right) \Leftrightarrow \frac{d \log p_t(\bx(t))}{d t} = - \tr \left( \frac{\partial \bv(\bx(t), t)}{\partial \bx(t)} \right)
$$

</div>

</div>

<ul>

<li v-click="2">

Likelihood-based CNF training requires ODE solves and Jacobian trace evaluations.

</li>

<li v-click="2">

The adjoint method computes gradients through the ODE solution; repeated solves can be costly.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

<!--
Narrative: the denoiser/DDIM section has completed a construction of ODE fields from existing score/noise predictions. Open this section by explicitly making the velocity field itself the learning target. Recall the general CNF model and its continuity equation, then explain the cost of likelihood training. The next slide introduces Flow Matching as velocity regression. This motivation belongs here, where it is developed, rather than as an unanswered question at the end of DDIM. The established time convention switches to generation from base at t=0 to data at t=1.
-->

---
clicks: 2
id: continuous-time-normalizing-flows-2
class: theorems
---

# Continuous-Time Normalizing Flows

<div class="block">

## KFP Theorem (Continuity Equation)

$$
\frac{\partial p_t(\bx)}{\partial t} = - \diver\left(\bv(\bx, t) p_t(\bx)\right) \Leftrightarrow \frac{d \log p_t(\bx(t))}{d t} = - \tr \left( \frac{\partial \bv(\bx(t), t)}{\partial \bx(t)} \right)
$$

</div>

<ul>

<li>

Knowing the vector field $\bv (\bx, t)$, the KFP (or continuity) equation allows us to compute the density $p_t(\bx)$.

</li>

<li>

Flow matching fits velocities by regression, without model ODE solves or trace evaluations during training.

</li>

</ul>

<div class="block" v-click="1">

## Flow Matching

<div v-click="1">

$$
\bbE_{t \sim U[0, 1]} \bbE_{\bx \sim p_t(\bx)}\left\| \bv(\bx, t) - \bv_{\btheta}(\bx, t) \right\|^2 \rightarrow \min_{\btheta}
$$

</div>

</div>

<ul>

<li v-click="2">

Approximate the true vector field $\bv (\bx, t)$ using $\bv_{\btheta}(\bx, t)$.

</li>

<li v-click="2">

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
id: flow-matching
class: interactive-slide
---

# Flow Matching

$$
\bbE_{t \sim U[0, 1]} \bbE_{\bx \sim p_t(\bx)}\left\| \bv(\bx, t) - \bv_{\btheta}(\bx, t) \right\|^2 \rightarrow \min_{\btheta}
$$

<TransportPathsDemo />

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">Original illustration: A Visual Dive into Conditional Flow Matching</a></div>

<!--
The preceding FM algorithm exposes an unknown target field. Three explicit invertible flows now demonstrate that endpoint densities do not select one unique target. This motivates constructing tractable paths in the continuation of flow matching. The Summary retains the regression takeaway. Unlike the PF-ODE example, only endpoints are constrained to agree. All flows have positive affine scales and analytic Gaussian pushforwards: mean (-2+4t, 0), scales (1-.45t,1-.2t); Detour adds (0,1.6 sin(pi t)); Rotation inserts a 1.3 sin(pi t) rotation before scaling. Rotation preserves the current Gaussian density relative to Direct but changes particle trajectories; Detour changes intermediate density. No claim about optimal transport or learned-model quality. Noise-to-data time increases from 0 to 1.
-->

---
clicks: 0
id: summary
class: summary
---

# Summary

<ul>

<li>

Every SDE admits a corresponding probability flow ODE that follows the same probability path $p_t(\bx)$, yielding deterministic invertible sampling and log-likelihood evaluation via the instantaneous change of variables.

</li>

<li>

A denoiser parameterizes the PF-ODE; DDIM is Euler in rescaled state and noise coordinates. Compare solver cost in network evaluations (NFE).

</li>

<li>

SDEs can be reversed in time using the score function $\nabla_{\bx} \log p_t(\bx)$; discretizing the reverse SDE gives ancestral sampling, while discretizing the PF-ODE gives deterministic sampling.

</li>

<li>

Continuous-time DSM uses tractable Gaussian kernels for affine drift. Noise coordinates change the training density; importance correction preserves a chosen objective.

</li>

<li>

Flow matching trains the velocity field by regression, avoiding model ODE solves and trace evaluations during training.

</li>

</ul>
