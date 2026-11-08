---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 9"
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

<div class="cover-lecture">Lecture 9</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
id: recap-diffusion-parameterizations
class: theorems
---

# Recap of Previous Lecture

## Reparametrization of DDPM

Let $\alpha_t=1-\beta_t$ and $\bar{\alpha}_t=\prod_{s=1}^t\alpha_s=\prod_{s=1}^t(1-\beta_s)$.

<div class="columns">
<div>

## Forward Noising

$$
\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon
$$

</div>
<div>

## Recover Clean Data

$$
{\color{olive}\bx_0}=\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon}{\sqrt{\bar{\alpha}_t}}
$$

</div>
</div>

**Why reparametrize?** Predict the Gaussian noise we add ourselves during training; compute the reverse mean analytically from this prediction.

<div class="columns">
<div>

## Target Mean

$$
\tilde{\bmu}_t(\bx_t,\bx_0)=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-{\color{teal}\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}}\cdot\bepsilon
$$

</div>
<div>

## Model Mean

$$
\bmu_{\btheta,t}(\bx_t)=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-{\color{teal}\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}}\cdot\bepsilon_{\btheta,t}(\bx_t)
$$

</div>
</div>

Reverse-mean, clean-data and noise predictions are convertible; unweighted losses assign different weights to noise levels.

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. et al. Denoising Diffusion Probabilistic Models, 2020</a><br><a href="https://arxiv.org/abs/2202.00512">Salimans T., Ho J. Progressive Distillation for Fast Sampling of Diffusion Models, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-4
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Training

1. Sample $\bx_0\sim\pd(\bx)$, $t\sim\Uniform\{1,\ldots,T\}$, $\bepsilon\sim\cN(0,\bI)$.
2. Compute noisy image $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$.
3. Minimize $\cL_{\text{simple}}=\|\bepsilon-\bepsilon_{\btheta,t}(\bx_t)\|^2$ by SGD.

</div>
<div class="block">

## Sampling (Ancestral)

1. Sample $\bx_T\sim\cN(0,\bI)$.
2. For $t=T,\ldots,2$, compute the mean and sample the reverse step:

$$
\begin{aligned}
\bmu_{\btheta,t}(\bx_t)&=\frac{\bx_t}{\sqrt{\alpha_t}}-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar\alpha_t)}}\bepsilon_{\btheta,t}(\bx_t),\\
\bx_{t-1}&=\bmu_{\btheta,t}(\bx_t)+\sqrt{\tilde\beta_t}\bepsilon_t,\qquad\bepsilon_t\sim\cN(0,\bI).
\end{aligned}
$$

<ol start="3"><li>

Return the decoder mean $\hat{\bx}_0=\bmu_{\btheta,1}(\bx_1)$.

</li></ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-5
class: theorems
---

# Recap of Previous Lecture

## DDPM vs NCSN: Summary

**DSM:** learn $\bs_{\btheta,t}(\bx_t)\approx\nabla_{\bx_t}\log q(\bx_t)$ using conditional targets:

$$
\ell_{\btheta}(t)=\bbE_{\pd(\bx_0)}\bbE_{q(\bx_t|\bx_0)}\left\|{\color{#8854c0}\bs_{\btheta,t}(\bx_t)}-{\color{teal}\nabla_{\bx_t}\log q(\bx_t|\bx_0)}\right\|_2^2.
$$

Gaussian perturbations:

- DDPM: $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$;
- NCSN: $\bx_t=\bx_0+\sigma_t\cdot\bepsilon$.
- Use $\tilde\bx_t=\bx_t/\sqrt{\bar\alpha_t}$ and $\sigma_t^2=(1-\bar\alpha_t)/\bar\alpha_t$ to recover NCSN.

Scale target and model scores by $\sqrt{\bar\alpha_t}$ to obtain the rescaled DSM error:

$$
\tilde\ell_{\btheta}(t)=\bar\alpha_t\ell_{\btheta}(t),\qquad
\sigma_t^2\tilde\ell_{\btheta}(t)=(1-\bar\alpha_t)\ell_{\btheta}(t).
$$

<div class="block">

**DDPM:** ancestral transitions between noise levels.<br>
**NCSN:** Langevin MCMC at each fixed noise level.

</div>

<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a><br><a href="https://arxiv.org/abs/2006.11239">Ho J., et al. Denoising Diffusion Probabilistic Models, 2020</a><br><a href="https://arxiv.org/abs/2107.00630">Kingma D. et al. Variational Diffusion Models, 2021</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y. et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: recap-loss-weighting-and-time-sampling
class: theorems
---

# Recap of Previous Lecture

## Loss Weighting and Time Sampling

DDPM replaces ELBO weights with a simple noise-prediction loss and generates through Gaussian reverse steps.

Fix the perturbation and its per-step loss $\ell_{\btheta}(t)$; let $w_t>0$.

$$
\cL=\frac1T\sum_{t=1}^{T}w_t\ell_{\btheta}(t).
$$

<div class="block">

## Sampling a noise level more often gives it more weight

$$
\bbE_{t\sim r}[\ell_{\btheta}(t)]
=\sum_{t=1}^T r_t\ell_{\btheta}(t)
=\bbE_{t\sim\Uniform\{1,\ldots,T\}}\!\left[{\color{teal}T r_t}\,\ell_{\btheta}(t)\right].
$$

Conversely, choose $r_t=w_t/\sum_s w_s$ to absorb the weights, up to an overall loss scale.

</div>

**To change time sampling while preserving a chosen objective, compensate:**

$$
\cL=\bbE_{t\sim r}\left[\frac{w_t}{T r_t}\ell_{\btheta}(t)\right],\qquad r_t>0.
$$

The objective stays the same; gradient variance can change. These are **training** times.

<div class="source"><a href="https://arxiv.org/abs/2303.00848">Kingma D., Gao R. Understanding Diffusion Objectives as the ELBO with Simple Data Augmentation, 2023</a></div>

---
clicks: 0
id: recap-of-previous-lecture-7
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Sampling (DDIM)

1. Sample $\bx_T\sim\cN(0,\bI)$; choose a grid $T=t_K>\cdots>t_0=0$.
2. For $k=K,\ldots,1$, set $t=t_k$, $s=t_{k-1}$ and compute:

$$
\begin{aligned}
\hat{\bepsilon}&=\bepsilon_{\btheta,t}(\bx_t)
&&\text{predict noise},\\[8pt]
\hat{\bx}_0&=\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\,\hat{\bepsilon}}{\sqrt{\bar{\alpha}_t}}
&&\text{estimate clean data},\\[8pt]
\bx_s&={\color{teal}\sqrt{\bar{\alpha}_s}}\,\hat{\bx}_0
+{\color{teal}\sqrt{1-\bar{\alpha}_s}}\,\hat{\bepsilon}
&&\text{update state}.
\end{aligned}
$$

3. Return $\bx_0$.

</div>

Same Gaussian marginals $q(\bx_t\mid\bx_0)$; a different joint $q(\bx_{1:T}\mid\bx_0)$.

**Deterministic steps:** randomness comes from $\bx_T$; recompute both estimates at every step.

**Fewer steps:** choose $K\ll T$ on the original schedule: $K$ network evaluations, no retraining.

<div class="source"><a href="https://arxiv.org/abs/2010.02502">Song J., Meng C., Ermon S. Denoising Diffusion Implicit Models, 2021</a></div>

---
clicks: 0
id: recap-of-previous-lecture-9
class: theorems
---

# Recap of Previous Lecture

The condition $\by$ can be a class label, a text prompt, or reference images.

**Guidance** modifies sampling to strengthen the influence of $\by$.

<div class="block">

## Classifier-Guided Estimate

For now, restrict $\by$ to **class labels**.

Train a noisy-data classifier $p(\by|\bx_t)\approx q(\by|\bx_t)$ at every noise level, providing $t$ as an input.

$$
{\color{olive}\bs_{\btheta,t}(\bx_t,\by)}
:=\bs_{\btheta,t}(\bx_t)+{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}
\approx\nabla_{\bx_t}\log q(\bx_t|\by).
$$

</div>

<div class="block">

## Guidance Scale

$$
{\color{#8854c0}\bs^\gamma_{\btheta,t}(\bx_t,\by)}:=\bs_{\btheta,t}(\bx_t)+{\color{teal}\gamma}\cdot\nabla_{\bx_t}\log p(\by|\bx_t).
$$

$\gamma$ controls guidance strength: $\gamma=0$ gives the unconditional estimate; $\gamma=1$ gives the conditional estimate.

</div>

Larger $\gamma$ favors samples with higher class probability; very large values can reduce diversity and introduce artifacts.

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a><br><a href="https://arxiv.org/abs/2410.02416">Sadat S. et al. Eliminating Oversaturation and Artifacts of High Guidance Scales in Diffusion Models, 2025</a></div>

---
clicks: 0
id: recap-of-previous-lecture-12
class: theorems
---

# Recap of Previous Lecture

## Classifier-Free Guidance

$$
\bs^\gamma_{\btheta,t}(\bx_t,\by)=(1-\gamma)\cdot\bs_{\btheta,t}(\bx_t)+\gamma\cdot\bs_{\btheta,t}(\bx_t,\by)
$$

<div class="block">

## CFG

1. Introduce the "absence of conditioning" label $\by=\varnothing$.
2. Identify the unconditional score model $\bs_{\btheta,t}(\bx_t)=\bs_{\btheta,t}(\bx_t,\varnothing)$.
3. Train one model on paired data, replacing $\by$ with $\varnothing$ with fixed probability.
4. Evaluate the model twice per sampling step: with $\by$ and with $\varnothing$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a><br><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 0
id: outline
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item "><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item "><span>03</span><div>SDE Basics</div></div>
<div class="outline-item "><span>04</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>

</div>

---
clicks: 0
id: outline-2
section: "Continuous-Time Normalizing Flows (CNF)"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item "><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item "><span>03</span><div>SDE Basics</div></div>
<div class="outline-item "><span>04</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>

</div>

---
clicks: 1
id: discrete-time-normalizing-flows
class: theorems
---

# Discrete-Time Normalizing Flows

<div class="block">

## Change of Variable Theorem (CoV)

Let $\bx$ be a random variable with density $p(\bx)$, and let $\bff:\bbR^m\rightarrow\bbR^m$ be a differentiable and **invertible** transformation. If $\bz=\bff(\bx)$, $\bx=\bff^{-1}(\bz)=\bg(\bz)$, then

$$
p(\bx)=p(\bz)|\det(\bJ_{\bff})|=p(\bz)\left|\det\left(\frac{\partial\bz}{\partial\bx}\right)\right|=p(\bff(\bx))\left|\det\left(\frac{\partial\bff(\bx)}{\partial\bx}\right)\right|
$$

</div>
<div v-click="1">

<img src="/figs/normalizing-flow.png" alt="Composition of invertible transformations in a normalizing flow" style="width:100%;height:245px;object-fit:contain" />

$$
\log\pt(\bx)=\log p(\bff_K\circ\dots\circ\bff_1(\bx))+\sum_{k=1}^K\log\left|\det\left(\frac{\partial\bff_k}{\partial\bff_{k-1}}\right)\right|.
$$

</div>

<div class="source"><a href="https://lilianweng.github.io/lil-log/2018/10/13/flow-based-deep-generative-models.html">https://lilianweng.github.io/lil-log/2018/10/13/flow-based-deep-generative-models.html</a></div>

---
clicks: 2
id: towards-continuous-time-normalizing-flows
class: theorems
---

# Towards Continuous-Time Normalizing Flows

Up to this point, we have considered discrete-time normalizing flows:

$$
\bx_{t+1}=\bff_{\btheta}(\bx_t,t);\quad\log p(\bx_{t+1})=\log p(\bx_t)-\log\left|\det\frac{\partial\bff_{\btheta}(\bx_t)}{\partial\bx_t}\right|.
$$

<div class="block" v-click="1">

## Residual Flows

Here $\bff_{\btheta}$ is the NF **bijection**, $\bv_{\btheta}$ is the **velocity** (vector field):

$$
\bx_{t+1}=\bff_{\btheta}(\bx_t,t)=\bx_t+\bv_{\btheta}(\bx_t,t)
$$

<div v-click="2">

Given $\by=\bff_{\btheta}(\bx,t)$, recover $\bx$ by **fixed-point iteration**:

$$
\bx=\by-\bv_{\btheta}(\bx,t),\qquad
\bx^{(k+1)}=\by-\bv_{\btheta}(\bx^{(k)},t).
$$

If $\bv_{\btheta}$ has Lipschitz constant $L<1$ in $\bx$, the iteration is contractive. **Banach's theorem** guarantees a unique solution for every $\by$, so $\bff_{\btheta}$ is invertible.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/1811.00995">Behrmann J. et al. Invertible Residual Networks, 2019</a><br><a href="https://arxiv.org/abs/1906.02735">Chen R. T. Q. et al. Residual Flows for Invertible Generative Modeling, 2019</a></div>

---
clicks: 2
id: towards-continuous-time-normalizing-flows-2
class: theorems
---

# Towards Continuous-Time Normalizing Flows

A residual step $\bx(t+h)=\bx(t)+h\,\bv_{\btheta}(\bx(t),t)$ is invertible if $hL<1$:

$$
\frac{\bx(t+h)-\bx(t)}{h}=\bv_{\btheta}(\bx(t),t)
$$

<div v-click="1">

Taking the limit $h\rightarrow0$, we obtain continuous-time dynamics.

<div class="block">

## Continuous-Time Dynamics

Consider an Ordinary Differential Equation (ODE):

$$ {1|all} {at:2}
\begin{aligned}
\frac{d\bx(t)}{dt}&=\bv_{\btheta}(\bx(t),t);\quad\text{with initial condition }\bx(t_0)=\bx_0.\\
\bx(t_1)&=\int_{t_0}^{t_1}\bv_{\btheta}(\bx(t),t)\,dt+\bx_0
\end{aligned}
$$

</div>
</div>
<div v-click="2">

The **velocity field** $\bv_{\btheta}:\bbR^m\times[t_0,t_1]\rightarrow\bbR^m$ need not be contractive or invertible. Under suitable regularity conditions, **uniqueness of ODE solutions guarantees an invertible flow**.

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 2
id: odes-flows-and-numerical-solutions
class: theorems
---

# ODEs, Flows and Numerical Solutions

<div class="block">

## Ordinary Differential Equation

$$
\frac{d\bx(t)}{dt}=\bv_{\btheta}(\bx(t),t),\qquad\bx(t_0)=\bx_0.
$$

</div>

<div class="block" v-click="1">

## Flow

The **flow** $\bpsi:\bbR^m\times[t_0,t_1]\rightarrow\bbR^m$ maps the initial point to its position at time $t$: $\bx(t)=\bpsi_t(\bx_0)$.

$$
\frac{d\bpsi_t(\bx_0)}{dt}=\bv_{\btheta}(\bpsi_t(\bx_0),t),\qquad\bpsi_{t_0}(\bx_0)=\bx_0.
$$

</div>

<div class="block" v-click="2">

## Numerical Solution

$$
\bpsi_t(\bx_0)=\bx_0+\int_{t_0}^{t}\bv_{\btheta}(\bx(s),s)\,ds
\approx\ODESolve_v(\bx_0,\btheta,t_0,t).
$$

A numerical solver approximates the flow by a sequence of **finite steps**.

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 1
id: numerical-solution-of-odes-euler
class: theorems
---

# Numerical Solution of ODEs: Euler

<div class="columns">
<div class="block">

## Euler Update Step

$$
\frac{\bx(t+h)-\bx(t)}{h}=\bv_{\btheta}(\bx(t),t)
$$

$$
\bx(t+h)=\bx(t)+h\cdot\bv_{\btheta}(\bx(t),t)
$$

Freeze the current velocity over the step: **one field evaluation**.

</div>
<EulerStepPlot />
</div>

<div class="block" v-click="1">

## One-Step Error

For a smooth field, Taylor expansion from the **exact starting point** gives

$$
\bx(t+h)=\bx(t)+h\,\bv_{\btheta}(\bx(t),t)+\cO(h^2).
$$

Euler drops the higher-order terms: the **local error is $\cO(h^2)$**.

</div>

<div class="source"><a href="https://en.wikipedia.org/wiki/Euler_method">Euler method; original one-step illustration</a><br><a href="https://fncbook.com/rk/">Driscoll T. A., Braun R. J. Fundamentals of Numerical Computation: Runge–Kutta methods</a></div>

---
clicks: 1
id: numerical-solution-of-odes-euler-and-heun
class: theorems
---

# Numerical Solution of ODEs: Heun

<div class="columns">
<div class="block">

## Predict the endpoint

Evaluate the velocity at the start and take an Euler step of size $h$.

$$
\bv_0=\bv_{\btheta}(\bx_n,t_n),\qquad
\widetilde{\bx}_{n+1}=\bx_n+h\,\bv_0.
$$

</div>
<EulerStepPlot heun />
</div>

<div class="block" v-click="1">

## Correct the step

Evaluate the velocity at the predicted endpoint. Advance from $\bx_n$ using the **average of the two velocities**.

$$
\bv_1=\bv_{\btheta}(\widetilde{\bx}_{n+1},t_n+h),\qquad
\bx_{n+1}=\bx_n+\frac{h}{2}(\bv_0+\bv_1).
$$

</div>

<div class="source"><a href="https://fncbook.com/rk/">Driscoll T. A., Braun R. J. Fundamentals of Numerical Computation: Runge–Kutta methods</a></div>

---
clicks: 0
id: ode-solvers-accuracy-and-cost
class: interactive-slide
---

# ODE Solvers: Accuracy and Cost

<OdeSolverDemo>

For a smooth field on a fixed interval $[0,T]$, the **global error** after $N$ steps of size $h=T/N$ is

$$
\|\widehat{\bx}_N-\bx(T)\|=\cO(h^p).
$$

| Method | Global error | NFE per step |
|---|---|---|
| Euler | $\cO(h)$ | 1 |
| Heun | $\cO(h^2)$ | 2 |
| RK4 | $\cO(h^4)$ | 4 |

**NFE** counts calls to the velocity field. Halving $h$ doubles the NFE needed to reach $T$.

</OdeSolverDemo>

<div class="source"><a href="https://fncbook.com/rk/">Driscoll T. A., Braun R. J. Fundamentals of Numerical Computation: Runge–Kutta methods</a></div>

---
clicks: 0
id: generative-models-taxonomy
class: figure-slide
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" continuous-normalizing-flow />

---
clicks: 2
id: continuous-time-normalizing-flows-neural-ode
class: theorems
---

# From ODE Trajectories to a Probability Path

Sampling the initial point selects an entire trajectory of the neural ODE.

$$
\bx(0)\sim p_0,\qquad \bx(t)=\bpsi_t(\bx(0)),\qquad 0\le t\le 1.
$$

<div v-click="1">

- Suppose $\bx(0)$ is a random variable with density $p_0(\bx)$.
- Then, $\bx(t)$ is a random variable with density $p_t(\bx)$.
- $p_t(\bx) = p(\bx, t)$ describes the **probability path** between $p_0(\bx)$ and $p_1(\bx)$.

</div>

<div v-click="2">

<img src="/figs/cnf_flow.png" alt="Particle trajectories over a density heatmap, with the initial and final densities on either side" style="width:100%;height:260px;object-fit:contain" />

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a><br><a href="https://arxiv.org/abs/1810.01367">Grathwohl W. et al. FFJORD: Free-form Continuous Dynamics for Scalable Reversible Generative Models, 2018</a></div>

---
clicks: 3
id: continuous-time-normalizing-flows-reversibility
class: theorems
---

# Continuous-Time Normalizing Flows: Reversibility

<div class="block">

## Theorem (Picard)

If $\bv$ is continuously differentiable with a bounded derivative in $\bx$ and continuous in $t$, then the ODE has a **unique solution** given by a flow $\bpsi_t$.

</div>

<div v-click="1">

This guarantees the ODE is **uniquely reversible**.

$$
\begin{aligned}
\bpsi_1(\bx_0)&=\bx_0+\int_0^1\bv_{\btheta}(\bpsi_t(\bx_0),t)\,dt\\
\bx(1)&=\bx(0)+\int_0^1\bv_{\btheta}(\bx(t),t)\,dt\\
\bx(0)&=\bx(1)+\int_1^0\bv_{\btheta}(\bx(t),t)\,dt
\end{aligned}
$$

</div>

<div v-click="2">

**Note:** Unlike discrete-time flows, $\bv$ need not be invertible (uniqueness ensures bijection).

To approximate the inverse flow with **Euler or Heun**, start at $\bx(1)$ and take steps with $h<0$ toward $t=0$. The recovered point has discretization error.

</div>

<div class="takeaway" v-click="3">

How can we compute $p_t(\bx)$ at arbitrary $t$?

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 0
id: outline-3
section: "Continuity Equation for CNF Log-Likelihood"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item current"><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item "><span>03</span><div>SDE Basics</div></div>
<div class="outline-item "><span>04</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>

</div>

---
clicks: 2
id: continuous-time-nf
class: theorems
---

# Continuous-Time NF

<div class="block">

## Theorem (Continuity Equation)

If $\bv$ is continuously differentiable in $\bx$ (with bounded derivative) and continuous in $t$, and $p_t(\bx)>0$, then

$$
\frac{d\log p_t(\bx(t))}{dt}=-\tr\left(\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}\right)
$$

</div>

<div v-click="1">

Integrating gives the density **along the trajectory**.

<div class="block">

## Solution

$$
\log p_1(\bx(1))=\log p_0(\bx(0))-{\color{teal}\int_0^1\tr\left(\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}\right)\,dt}.
$$

</div>

</div>

<div v-click="2">

**Hutchinson's trace estimator:**

$$
\tr(\bJ)=\bbE_{\bepsilon\sim\cN(0,\bI)}[\bepsilon^T\bJ\bepsilon],\qquad
\bJ=\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}.
$$

- One noise vector gives an **unbiased trace estimate** via autodiff, without forming the full Jacobian.
- **Exact identity; approximate computation** using an ODE solver and a stochastic trace estimate.

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a><br><a href="https://arxiv.org/abs/1810.01367">Grathwohl W. et al. FFJORD: Free-form Continuous Dynamics for Scalable Reversible Generative Models, 2018</a></div>

---
clicks: 2
id: cnf-training-and-sampling
class: theorems
---

# CNF: Training and Sampling

Fix $p_0=\cN(0,\bI)$ and learn $\bv_{\btheta}$; the endpoint density is $p_1=\pt$.

<div class="block" v-click="1">

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

<div class="block" v-click="2">

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
id: outline-4
section: "SDE Basics"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item "><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item current"><span>03</span><div>SDE Basics</div></div>
<div class="outline-item "><span>04</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>

</div>

---
clicks: 1
id: stochastic-differential-equation-sde
class: theorems interactive-slide
---

# Stochastic Differential Equation (SDE)

In a CNF, fixing the initial point fixes the entire trajectory. What if noise also acts throughout the motion?

<div class="block">

## Wiener Process

$\bw(t)$ is the standard Wiener process (Brownian motion), defined by:

<div class="columns balanced">
<div>

1. $\bw(0)=0$ (almost surely);
2. $\bw(t)$ has independent increments. For $s<t<u$,<br>
   $\bigl(\bw(t)-\bw(s)\bigr)\perp\bigl(\bw(u)-\bw(t)\bigr)$.
3. $\bw(t)$ trajectories are continuous;
4. $\bw(t)-\bw(s)\sim\cN(0,(t-s)\bI)$ for $t>s$;

</div>
<div>

<BrownianMotionPlot />

</div>
</div>

</div>

<div v-click="1">

$$
\Delta\bw=\bw(t+\Delta t)-\bw(t)\sim\cN(0,\Delta t\,\bI),\qquad \Delta t>0.
$$

Here $d\bw$ is **informal shorthand** for a small Brownian increment, modeled as $\sqrt{dt}\,\bepsilon$ with $\bepsilon\sim\cN(0,\bI)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 2
id: stochastic-differential-equation-sde-2
class: theorems
---

# Stochastic Differential Equation (SDE)

An SDE generalizes the dynamics of a CNF by adding Brownian noise to the motion induced by the velocity field.

$$
d\bx=\bff(\bx,t)\,dt+{\color{#8854c0}g(t)\,d\bw},\qquad \bx(0)\sim p_0.
$$

<div v-click="1">

- $\bff:\bbR^m\times[0,1]\to\bbR^m$ is the **drift** vector field.
- $g:[0,1]\to\bbR$ is the **diffusion** coefficient. It scales the noise from the standard Wiener process $\bw(t)$.

</div>

<div class="takeaway" v-click="2">

Setting $g(t)=0$ and $\bff=\bv_{\btheta}$ recovers the CNF dynamics.

</div>

---
clicks: 2
id: it-integration-basics
class: theorems
---

# Itô Integration Basics

The SDE should be understood in its **integral form** (Itô sense):

$$
\bx(t)=\bx(0)+{\color{#8854c0}\int_0^t\bff(\bx(s),s)\,ds}+{\color{teal}\int_0^t g(s)\,d\bw(s)}
$$

<div v-click="1">

- <span style="color:#8854c0">The first integral</span> is a classical (Riemann) integral.
- <span style="color:teal">The second integral</span> is an **Itô stochastic integral**.

</div>
<div v-click="2">

$$
\int_0^t g(s)\,d\bw(s)=\lim_{N\to\infty}\sum_{i=0}^{N-1}g(t_i)\bigl(\bw(t_{i+1})-\bw(t_i)\bigr)
$$

- Brownian paths are continuous but a.s. **nowhere differentiable** $\Rightarrow$ Fundamental Theorem of Calculus fails.
- **Itô's lemma** is the stochastic counterpart of the chain rule; we will not need its explicit form here.
- Expressions $d\bx$, $dt$, $d\bw$ are **formal shorthand** for infinitesimal increments.

</div>

<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. et al. The Principles of Diffusion Models, 2025</a></div>

---
clicks: 3
id: stochastic-differential-equation-sde-3
class: theorems
---

<script setup>
import PathwiseUniquenessPlot from './components/PathwiseUniquenessPlot.vue'
</script>

# What Determines an SDE Trajectory?

$$
d\bx=\bff(\bx,t)\,dt+g(t)\,d\bw
$$


<div class="block">

## Existence and Uniqueness

If $\bff$ is continuous in $t$ and continuously differentiable in $\bx$ with bounded derivative, and $g$ is continuous, then the SDE has a unique strong solution for a given initial condition and Wiener process.

</div>

<div class="block">

## Two Sources of Randomness

For $dx=\tfrac12\,dt+dw$, we can vary the initial draw $x_0\sim p_0$ or the Brownian path $w(t)$.

<div class="columns">
<div v-click="1">

**Different Brownian paths**, same $x_0=0$

<PathwiseUniquenessPlot />

</div>
<div v-click="2">

**Same Brownian path**, $x_0=0$ and $x_0=-1$

<PathwiseUniquenessPlot shared />

</div>
</div>
</div>

<div class="takeaway" v-click="3">

Fixing both the **initial point** and the **Brownian path** determines the trajectory almost surely.

</div>

---
clicks: 2
id: stochastic-differential-equation-sde-4
class: theorems
---

# Stochastic Differential Equation (SDE)

$$
d\bx=\bff(\bx,t)\,dt+g(t)\,d\bw
$$


<div class="block">

## Discretizing the SDE (Euler-Maruyama Update) – $\SDESolve$

$$
{\color{#8854c0}\bx(t+dt)=\bx(t)+\bff(\bx(t),t)\cdot dt}+{\color{teal}g(t)\cdot\bepsilon\cdot\sqrt{dt}}
$$

<div v-click="1">

If $dt=1$, then

$$
{\color{#8854c0}\bx_{t+1}=\bx_t+\bff(\bx_t,t)}+{\color{teal}g(t)\cdot\bepsilon}
$$

</div>

</div>

<div v-click="2">

- At any time $t$, the process has density $p_t(\bx)=p(\bx,t)$.
- $p:\bbR^m\times[0,1]\rightarrow\bbR_+$ specifies a **probability path** from $p_0(\bx)$ to $p_1(\bx)$.

<div class="takeaway">

How can we obtain the probability path $p_t(\bx)$ for $\bx(t)$?

</div>

</div>

---
clicks: 2
id: stochastic-differential-equation-sde-5
class: theorems
---

# Stochastic Differential Equation (SDE)

$$
d\bx=\bff(\bx,t)\,dt+g(t)\,d\bw,\quad d\bw=\bepsilon\cdot\sqrt{dt},\quad\bepsilon\sim\cN(0,\bI).
$$


<div class="block">

## Theorem (Kolmogorov-Fokker-Planck)

If $p_t(\bx)\in C^{1,2}$ (i.e., $C^1$ in $t$ and $C^2$ in $\bx$), then

$$
\frac{\partial p_t(\bx)}{\partial t}=-\diver\left(\bff(\bx,t)p_t(\bx)\right)+\frac12 g^2(t)\Delta_{\bx}p_t(\bx)
$$

</div>

<div class="takeaway columns" v-click="1">
<section>

## Divergence

$$
\diver(\bv)=\sum_{i=1}^m\frac{\partial v_i(\bx)}{\partial x_i}=\tr\left(\frac{\partial\bv(\bx)}{\partial\bx}\right)
$$

</section>
<section>

## Laplacian

$$
\Delta_{\bx}p_t(\bx)=\sum_{i=1}^m\frac{\partial^2p_t(\bx)}{\partial x_i^2}=\tr\left(\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)
$$

</section>
</div>

<div class="block" v-click="2">

## Trace form of the Fokker–Planck equation

$$
\frac{\partial p_t(\bx)}{\partial t}=\tr\left(-\frac{\partial}{\partial\bx}\bigl[\bff(\bx,t)p_t(\bx)\bigr]+\frac12g^2(t)\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)
$$

</div>

---
clicks: 2
id: stochastic-differential-equation-sde-6
class: theorems
---

# Stochastic Differential Equation (SDE)

<div class="block">

## Theorem (Kolmogorov-Fokker-Planck)

$$
\frac{\partial p_t(\bx)}{\partial t}=\tr\left(-\frac{\partial}{\partial\bx}\bigl[\bff(\bx,t)p_t(\bx)\bigr]+\frac12g^2(t)\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)
$$

</div>


- The KFP theorem is a necessary and sufficient condition (it uniquely defines $p_t(\bx)$).
- This generalizes the continuity equation for continuous-time NF:

$$
\frac{d\log p_t(\bx(t))}{dt}=-\tr\left(\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}\right).
$$

<div class="block" v-click="1">

## Special Case: constant density $p_t(\bx)$

Let's find the SDE for which $p_t(\bx)=\text{const}$ (i.e., if $\bx(0)\sim p_0(\bx)$, then $\bx(t)\sim p_0(\bx)$.).

<div v-click="2">

$$
\frac{\partial p_t(\bx)}{\partial t}=0\quad\Leftrightarrow\quad\tr\left(-\frac{\partial}{\partial\bx}\bigl[\bff(\bx,t)p_t(\bx)\bigr]+\frac12g^2(t)\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)=0
$$

</div>

</div>

---
clicks: 3
id: langevin-sde-special-case
class: theorems
---

# A Langevin Drift That Preserves the Target Density

We want a positive target density to stay stationary. The Fokker–Planck condition is

$$
\frac{\partial p_t(\bx)}{\partial t}=0\quad\Leftrightarrow\quad\tr\left(-\frac{\partial}{\partial\bx}\bigl[\bff(\bx,t)p_t(\bx)\bigr]+\frac12g^2(t)\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)=0
$$

<div class="block" v-click="1">

## Rewrite the trace as a divergence

Use $\tr(\partial\bv/\partial\bx)=\diver(\bv)$ for both $\bv=\bff\,p_t$ and $\bv=\nabla_{\bx}p_t$.

$$
0=-\diver\!\left(\underbrace{\bff(\bx,t)\,p_t(\bx)}_{\text{drift flux}}
\;\underbrace{-\tfrac12 g^2(t)\nabla_{\bx}p_t(\bx)}_{\text{diffusion flux}}\right).
$$

</div>

<div class="block" v-click="2">

## Choose the drift so the two fluxes cancel

$$
\bff(\bx,t)\,p_t(\bx)=\tfrac12 g^2(t)\nabla_{\bx}p_t(\bx)
\quad\Longrightarrow\quad
\bff(\bx,t)=\tfrac12 g^2(t)\nabla_{\bx}\log p_t(\bx).
$$

</div>

<div class="block" v-click="3">

## With $g(t)=1$, the Langevin drift is half the score

$$
d\bx={\color{#8854c0}\tfrac12\nabla_{\bx}\log p_t(\bx)\,dt}+{\color{olive}d\bw}.
$$

</div>

---
clicks: 2
id: langevin-sde-special-case-2
class: theorems
---

# Langevin SDE (Special Case)

Let's find the SDE for which $p_t(\bx)=\text{const}$ (i.e., if $\bx(0)\sim p_0(\bx)$, then $\bx(t)\sim p_0(\bx)$.).


$$
d\bx={\color{#8854c0}\frac12\frac{\partial}{\partial\bx}\log p_t(\bx)\,dt}+{\color{olive}1}\cdot d\bw
$$


<div class="block" v-click="1">

## Discretized Langevin SDE

$$
\bx_{t+1}-\bx_t=\frac\eta2\cdot\frac{\partial}{\partial\bx}\log p_t(\bx)+\sqrt\eta\cdot\bepsilon,\quad\eta\approx dt.
$$

</div>

<div v-click="2">

Setting the stationary density to the model distribution, $p_t(\bx)=\pt(\bx)$ for all $t$:

<div class="block">

## Langevin Dynamic

$$
\bx_{t+1}=\bx_t+\frac\eta2\cdot\nabla_{\bx}\log\pt(\bx)+\sqrt\eta\cdot\bepsilon,\quad\eta\approx dt.
$$

</div>

We (partially) explained, why Langevin dynamics is working.

</div>

<div class="source"><a href="https://www.stats.ox.ac.uk/~teh/research/compstats/WelTeh2011a.pdf">Welling M. Bayesian Learning via Stochastic Gradient Langevin Dynamics, 2011</a></div>

---
clicks: 0
id: langevin-moving-particles-stationary-density
class: interactive-slide
---

# Langevin: Moving Particles, Stationary Density

<StationaryLangevinDemo />

<div class="source"><a href="https://www.stats.ox.ac.uk/~teh/research/compstats/WelTeh2011a.pdf">Welling M. Bayesian Learning via Stochastic Gradient Langevin Dynamics, 2011</a></div>

---
clicks: 0
id: outline-ve-vp
section: "Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item "><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item "><span>03</span><div>SDE Basics</div></div>
<div class="outline-item current"><span>04</span><div>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</div></div>

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

# Variance Exploding SDE

$$
d \bx = \sqrt{\frac{ d [\sigma^2(t)]}{dt}} \cdot d \bw
$$

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

# Diffusion SDE

## DDPM increment at $t=t_k$

$$
\bx(t)-\bx(t-\Delta t)
\approx -\tfrac12\beta(t)\bx(t-\Delta t)\,\Delta t
        + \sqrt{\beta(t)}\,{\color{#8854c0}\Delta\bw}.
$$

Here $\Delta t=1/T$ and $\Delta\bw=\bw(t)-\bw(t-\Delta t)=\sqrt{\Delta t}\,\bepsilon_k$.

<div class="block" v-click="1">

## Variance Preserving SDE

As $\Delta t \to 0$, the DDPM update gives the continuous-time dynamics

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
id: summary
class: summary
---

# Summary

- CNFs define invertible transformations via neural ODEs; likelihood-based training requires ODE solves, trace evaluations and gradients through the solver.
- If $\bx_0$ is a random variable, this yields a **probability path** $p_t(\bx)$ as time evolves. The continuity equation describes the evolution of $\log p(\bx,t)$ over time.
- An SDE defines a stochastic process with drift and diffusion terms; ODEs are a special case of SDEs.
- The KFP equation describes the probability dynamics of an SDE.
- The Langevin SDE preserves a constant probability path.
- The VE-SDE matches the Gaussian perturbations used by NCSN. The VP-SDE is the continuous-time limit of the DDPM forward chain.
