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
sourceFrame: "1"
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 10</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
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

More advanced numerical methods (such as Runge-Kutta) are often used instead of unstable Euler update step.

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 0
sourceFrame: "3"
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
sourceFrame: "4"
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
sourceFrame: "5"
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

<ul>

<li>

This solution gives us the density **along the trajectory**.

</li>

<li>

However, it's difficult to efficiently estimate <span style="color:teal">the last term</span>.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 0
sourceFrame: "6"
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
sourceFrame: "7"
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
sourceFrame: "8"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>
<div class="outline-item"><span>02</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>03</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>04</span><div>Score-Based Generative Models Through SDEs</div></div>
<div class="outline-item"><span>05</span><div>Flow Matching (FM)</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>
<div class="outline-item"><span>02</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>03</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>04</span><div>Score-Based Generative Models Through SDEs</div></div>
<div class="outline-item"><span>05</span><div>Flow Matching (FM)</div></div>

</div>

---
clicks: 4
sourceFrame: "9"
class: theorems
---

# Score Matching SDE

<div class="block">

## Denoising Score Matching

$$
\begin{aligned}
\bx_t &= \bx + \sigma_t \cdot \bepsilon_t, & q(\bx_t | \bx) &= \cN(\bx, \sigma_t^2 \cdot \bI) \\
			\bx_{t-1} &= \bx + \sigma_{t-1} \cdot \bepsilon_{t-1}, & q(\bx_{t-1} | \bx) &= \cN(\bx, \sigma_{t-1}^2 \cdot \bI)
\end{aligned}
$$

</div>

<div v-click="1">

$$
\bx_t = \bx_{t - 1} + \sqrt{\sigma^2_t - \sigma^2_{t-1}} \cdot \bepsilon, \quad q(\bx_{t} | \bx_{t-1}) = \cN(\bx_{t-1}, (\sigma_t^2 - \sigma_{t-1}^2) \cdot \bI)
$$

</div>

<div v-click="2">

Let's transform this Markov chain into the continuous stochastic process $\bx(t)$ by letting $T \rightarrow \infty$:

</div>

<div v-click="2">

$$ {1|1-2|all} {at:3}
\begin{aligned}
\bx(t) &= \bx(t - dt) + \sqrt{\sigma^2(t) - \sigma^2(t - dt)} \cdot {\color{#8854c0}\bepsilon}
\\ &= \bx(t - dt) + \sqrt{\frac{\sigma^2(t) - \sigma^2(t - dt)}{dt} {\color{#8854c0}dt}} \cdot {\color{#8854c0}\bepsilon}
\\ &= \bx(t - dt) + \sqrt{\frac{ d [\sigma^2(t)]}{dt}} \cdot {\color{#8854c0}d \bw}
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 2
sourceFrame: "10"
class: theorems
---

# Score Matching SDE

$$
\bx(t) = \bx(t - dt) + \sqrt{\frac{ d [\sigma^2(t)]}{dt}} \cdot d \bw
$$

$$
d\bx = \bx(t) - \bx(t - dt)
$$

<div class="block" v-click="1">

## Variance Exploding SDE

<div v-click="1">

$$
d \bx = \sqrt{\frac{ d [\sigma^2(t)]}{dt}} \cdot d \bw
$$

</div>

<div v-click="1">

$\sigma(t)$ is a monotonically increasing function.

</div>

</div>

<div v-click="2">

$$
d\bx = \bff(\bx, t) dt + g(t) d \bw
$$

</div>

<div v-click="2">

$$
\bff(\bx, t) = 0, \quad g(t) = \sqrt{\frac{ d [\sigma^2(t)]}{dt}}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 3
sourceFrame: "11"
class: theorems
---

# Diffusion SDE

<div class="block">

## Denoising Diffusion

$$
\bx_t = \sqrt{1 - \beta_t} \cdot \bx_{t - 1} + \sqrt{\beta_t} \cdot \bepsilon_t, \quad q(\bx_t | \bx_{t-1}) = \cN(\sqrt{1 - \beta_t} \cdot \bx_{t-1}, \beta_t \cdot \bI)
$$

</div>

<div v-click="1">

Let's turn this Markov chain into a continuous stochastic process by letting $T \rightarrow \infty$ and setting $\beta_t = \beta(\frac{t}{T}) \cdot \frac{1}{T}$ (where $dt = \frac{1}{T}$):

</div>

<div v-click="1">

$$ {1|1-2|all} {at:2}
\begin{aligned}
{\color{teal}\bx(t)} &= \sqrt{1 - \beta(t) dt} \cdot \bx(t - dt) + \sqrt{\beta(t)dt} \cdot \bepsilon\\
&\approx \left(1 - \frac{1}{2} \beta(t) dt\right) \cdot \bx(t - dt) + \sqrt{\beta(t){\color{#8854c0}dt}} \cdot {\color{#8854c0}\bepsilon}\\
&= {\color{teal}\bx(t - dt)} - \frac{1}{2} \beta(t) \bx(t - dt) dt  + \sqrt{\beta(t)} \cdot {\color{#8854c0}d \bw}
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 1
sourceFrame: "12"
class: theorems
---

# Diffusion SDE

$$
\bx(t) = \bx(t - dt) - \frac{1}{2} \beta(t) \bx(t - dt) dt  + \sqrt{\beta(t)} \cdot {\color{#8854c0}d \bw}
$$

<div class="block" v-click="1">

## Variance Preserving SDE

<div v-click="1">

$$
d \bx = - \frac{1}{2} \beta(t) \bx(t) dt + \sqrt{\beta(t)} \cdot d \bw
$$

</div>

<div v-click="1">

$$
\bff(\bx, t) = - \frac{1}{2} \beta(t) \bx(t) , \quad g(t) = \sqrt{\beta(t)}
$$

</div>

</div>

<div v-click="1">

Variance is preserved as long as $\bx(0)$ has unit variance.

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 1
sourceFrame: "13"
class: theorems
---

# Diffusion SDE

$$
d\bx = {\color{teal}\bff(\bx, t)} dt + {\color{#8854c0}g(t)} d \bw
$$

<div class="block" v-click="1">

## Variance Exploding SDE (NCSN)

<div v-click="1">

$$
d \bx = {\color{#8854c0}\sqrt{\frac{ d [\sigma^2(t)]}{dt}}} \cdot d \bw
$$

</div>

</div>

<div class="block" v-click="1">

## Variance Preserving SDE (DDPM)

<div v-click="1">

$$
d \bx = {\color{teal}- \frac{1}{2} \beta(t) \bx(t)} dt + {\color{#8854c0}\sqrt{\beta(t)}} \cdot d \bw
$$

</div>

</div>

<div v-click="1">

We treat the discrete-time methods (NCSN, DDPM) as a special case of the continuous-time methods (VE-SDE, VP-SDE).

</div>

<div class="source"><a href="https://arxiv.org/abs/2206.00927">Lu C. et al. Dpm-solver: A fast ode solver for diffusion probabilistic model sampling in around 10 steps, 2022</a></div>

---
clicks: 0
sourceFrame: "auto: Probability Flow ODE"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>
<div class="outline-item current"><span>02</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>03</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>04</span><div>Score-Based Generative Models Through SDEs</div></div>
<div class="outline-item"><span>05</span><div>Flow Matching (FM)</div></div>

</div>

---
clicks: 1
sourceFrame: "14"
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
sourceFrame: "15"
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
sourceFrame: "16"
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
sourceFrame: "17"
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
sourceFrame: "18"
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
clicks: 2
sourceFrame: "19"
class: theorems
---

# Why convert SDEs to PF-ODEs? (1) Efficient Sampling

<ul>

<li>

Brownian increments scale as $d\bw \sim \sqrt{dt}$ — SDE trajectories are nowhere differentiable.

</li>

<li>

$\SDESolve$ (Euler–Maruyama): local error $\cO(\sqrt{\Delta t})$.

</li>

<li>

Higher-order SDE schemes need Lévy areas $\Rightarrow$ impractical in high dimensions.

</li>

</ul>

<div class="block" v-click="1">

## PF-ODE drift $\bv(\bx, t) = \bff(\bx, t) - \frac{1}{2} g^2(t) \bs(\bx, t)$ is smooth

<ul>

<li v-click="1">

Euler: $\cO(\Delta t)$,   Heun: $\cO(\Delta t^2)$,   RK4: $\cO(\Delta t^4)$.

</li>

<li v-click="1">

Adaptive step-size control is standard for $\ODESolve$.

</li>

</ul>

</div>

<ul>

<li v-click="2">

In practice: $100$–$1000$ $\SDESolve$ steps $\to$ $20$–$50$ $\ODESolve$ steps.

</li>

<li v-click="2">

Caveat: SDE sampling can still win at high NFE — injected noise corrects accumulated error.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a></div>

---
clicks: 2
sourceFrame: "20"
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

## Exact log-likelihood (instantaneous change of variables)

<div v-click="1">

$$
\log p_0(\bx(0)) = \log p_T(\bx(T)) + \int_0^T \tr\left(\frac{\partial \bv(\bx(t), t)}{\partial \bx(t)}\right) dt
$$

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

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q., et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 2
sourceFrame: "21"
class: theorems
---

# Sampling: Reverse SDE vs PF-ODE

Same trained score $\bs_{\btheta}(\bx, t)$; only the discretization changes (reverse SDE derived in the next section).

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

## Sampling (PF-ODE: Euler / Heun / RK4)

<ol>

<li v-click="2">

Sample $\bx_T \sim \cN(0, \bI)$.

</li>

<li v-click="2">

Initialize step $\Delta t = T / K$  (with $K \ll$ SDE case).

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
sourceFrame: "auto: Reverse SDE"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>
<div class="outline-item"><span>02</span><div>Probability Flow ODE</div></div>
<div class="outline-item current"><span>03</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>04</span><div>Score-Based Generative Models Through SDEs</div></div>
<div class="outline-item"><span>05</span><div>Flow Matching (FM)</div></div>

</div>

---
clicks: 3
sourceFrame: "22"
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

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 2
sourceFrame: "23"
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

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 1
sourceFrame: "24"
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
sourceFrame: "extension: 24"
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
sourceFrame: "25"
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

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 1
sourceFrame: "26"
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
clicks: 3
sourceFrame: "27"
class: theorems
---

# Score Matching SDE

$$
\bx(t) = \bx(t - dt) + \sqrt{\frac{ d [\sigma^2(t)]}{dt}} \cdot d \bw
$$

<div class="block" v-click="1">

## Variance Exploding SDE

<div v-click="1">

$$
d \bx = \sqrt{\frac{ d [\sigma^2(t)]}{dt}} \cdot d \bw
$$

</div>

<div v-click="1">

$\sigma(t)$ is a monotonically increasing function.

</div>

</div>

<div v-click="2">

$$
d\bx = \bff(\bx, t) dt + g(t) d \bw, \quad \bff(\bx, t) = 0, \quad g(t) = \sqrt{\frac{ d [\sigma^2(t)]}{dt}}
$$

</div>

<div v-click="3">

$$
\begin{aligned}
d\bx &= \left(-\frac{1}{2} \frac{ d [\sigma^2(t)]}{dt} \frac{\partial}{\partial \bx} \log p_t(\bx) \right) dt \qquad\quad\, \text{(probability flow ODE)} \\
		d\bx &= \left(- \frac{ d [\sigma^2(t)]}{dt} \frac{\partial}{\partial \bx}\log p_t(\bx)\right) dt + \sqrt{\frac{ d [\sigma^2(t)]}{dt}}  d \bar{\bw} \ \ \text{(reverse SDE)}
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 1
sourceFrame: "28"
class: theorems
---

# Diffusion SDE

<div class="block">

## Variance Preserving SDE

$$
d \bx = - \frac{1}{2} \beta(t) \bx(t) dt + \sqrt{\beta(t)} \cdot d \bw
$$

$$
\bff(\bx, t) = - \frac{1}{2} \beta(t) \bx(t) , \quad g(t) = \sqrt{\beta(t)}
$$

</div>

Variance is preserved as long as $\bx(0)$ has unit variance.

<div v-click="1">

$$
\begin{aligned}
d\bx &= \left(- \frac{1}{2} \beta(t) \bx(t) - \frac{1}{2} \beta(t) \frac{\partial}{\partial \bx} \log p_t(\bx) \right) dt \quad\quad \text{(probability flow ODE)} \\
		d\bx &= \left(- \frac{1}{2} \beta(t) \bx(t) - \beta(t) \frac{\partial}{\partial \bx} \log p_t(\bx)\right) dt + \sqrt{\beta(t)} d \bar{\bw}\ \ \text{(reverse SDE)}
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
sourceFrame: "auto: Score-Based Generative Models Through SDEs"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>
<div class="outline-item"><span>02</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>03</span><div>Reverse SDE</div></div>
<div class="outline-item current"><span>04</span><div>Score-Based Generative Models Through SDEs</div></div>
<div class="outline-item"><span>05</span><div>Flow Matching (FM)</div></div>

</div>

---
clicks: 2
sourceFrame: "29"
class: theorems
---

# Score-Based Generative Models Through SDEs

<div class="block">

## Discrete-Time Objective

$$
\bbE_{\pd(\bx_0)} \bbE_{t \sim U\{1, T\}} \bbE_{q(\bx_t | \bx_0)}\bigl\| \bs_{\btheta, t}(\bx_t) - \nabla_{\bx_t} \log q(\bx_t | \bx_0) \bigr\|^2_2
$$

</div>

Is it possible to train score-based diffusion models in continuous time?

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
clicks: 0
sourceFrame: "30"
class: theorems
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" sde-based-diffusion />

---
clicks: 2
sourceFrame: "31"
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
clicks: 3
sourceFrame: "32"
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
\frac{d \bmu(\bx(0), t)}{dt} = f(t) \bmu(\bx(0), t)
$$

$$
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

</div>

<div class="source"><a href="https://users.aalto.fi/~asolin/sde-book/sde-book.pdf">Särkkä S., Solin A. Applied stochastic differential equations, 2019</a></div>

---
clicks: 5
sourceFrame: "33"
class: theorems
---

# Score-Based Generative Models Through SDEs

<div class="block">

## Theorem

$$
\frac{d \bmu(\bx(0), t)}{dt} = f(t) \bmu(\bx(0), t)
$$

</div>

<div class="block" v-click="1">

## Proof (Continued)

<div v-click="1">

$$
\bbE\left[d\bx | \bx(0) \right] = f(t) \bmu(\bx(0), t) dt
$$

</div>

<div v-click="2">

$$
\frac{d \bbE\left[\bx(t) | \bx(0) \right]}{dt} = \frac{d \bmu(\bx(0), t)}{dt} = f(t) \bmu(\bx(0), t)
$$

</div>

</div>

<div class="block" v-click="3">

## Examples

<div v-click="3">

$$
\textbf{NCSN:}\quad	f(t) = 0 \quad \Rightarrow \quad \bmu = \bx(0)
$$

</div>

<div v-click="4">

$$
\textbf{DDPM:}\quad f(t) = - \frac{1}{2} \beta(t)\;\;   \Rightarrow\quad \frac{d \bmu}{dt} = - \frac{1}{2} \beta(t) \bmu
$$

</div>

<div v-click="5">

$$
\bmu = \bx(0) \exp\left(- \frac{1}{2} \int_0^t \beta(s)ds\right)
$$

</div>

</div>

<div class="source"><a href="https://users.aalto.fi/~asolin/sde-book/sde-book.pdf">Särkkä S., Solin A. Applied stochastic differential equations, 2019</a></div>

---
clicks: 2
sourceFrame: "34"
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

<div v-click="2">

Here we omit the derivations of the variance.

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 1
sourceFrame: "35"
class: theorems
---

# Score-Based Generative Models Through SDEs

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

---
clicks: 0
sourceFrame: "auto: Flow Matching (FM)"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>
<div class="outline-item"><span>02</span><div>Probability Flow ODE</div></div>
<div class="outline-item"><span>03</span><div>Reverse SDE</div></div>
<div class="outline-item"><span>04</span><div>Score-Based Generative Models Through SDEs</div></div>
<div class="outline-item current"><span>05</span><div>Flow Matching (FM)</div></div>

</div>

---
clicks: 2
sourceFrame: "36"
class: theorems
---

# Continuous-Time Normalizing Flows

Let's return to ODE dynamics $\bx_t = \bx(t)$ in the interval $t \in [0, 1]$:

<ul>

<li>

$\bx_0 \sim p_0(\bx)$, where $p_0(\bx)$ is a base distribution (mostly $\cN(0, \bI)$);

</li>

<li>

$\bx_1 \sim p_1(\bx)$, where $p_1(\bx)$ is the true data distribution $\pd(\bx)$.

</li>

</ul>

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

It's hard to solve the continuity equation directly due to the trace term.

</li>

<li v-click="2">

There's a method (the adjoint method) that solves this equation directly, but it's unstable and unscalable.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 2
sourceFrame: "37"
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

Flow matching provides scalable approach to Neural ODEs.

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
sourceFrame: "38"
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
sourceFrame: "39"
class: theorems
---

# Flow Matching

$$
\bbE_{t \sim U[0, 1]} \bbE_{\bx \sim p_t(\bx)}\left\| \bv(\bx, t) - \bv_{\btheta}(\bx, t) \right\|^2 \rightarrow \min_{\btheta}
$$

<ul>

<li>

There are infinitely many possible $\bv(\bx, t)$ between $p_0(\bx)$ and $p_1(\bx)$.

</li>

<li>

We need to select the "best" $\bv(\bx, t)$ and make the objective tractable.

</li>

</ul>

<img src="/figs/multiple_dynamics.png" alt="multiple dynamics" style="width:100%;height:260px;object-fit:contain" />

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">image credit: A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 0
sourceFrame: "40"
class: summary
---

# Summary

<ul>

<li>

Score matching (NCSN) and diffusion models (DDPM) are discretizations of SDEs (variance exploding and variance preserving).

</li>

<li>

Every SDE admits a corresponding probability flow ODE that follows the same probability path $p_t(\bx)$, yielding deterministic invertible sampling and exact log-likelihoods via the instantaneous change of variables.

</li>

<li>

Converting SDEs to PF-ODEs enables efficient high-order numerical solvers, reducing the number of sampling steps from $100$–$1000$ to $20$–$50$.

</li>

<li>

SDEs can be reversed in time using the score function $\nabla_{\bx} \log p_t(\bx)$; discretizing the reverse SDE gives ancestral sampling, while discretizing the PF-ODE gives deterministic sampling.

</li>

<li>

The continuous-time score matching objective generalizes DDPM and NCSN; for affine-drift SDEs the transition kernel $q(\bx(t) | \bx(0))$ is Gaussian, making the training objective tractable.

</li>

<li>

Flow matching fits the vector field $\bv(\bx, t)$ directly, an alternative parametrization of the same continuous-time generative dynamics.

</li>

</ul>
