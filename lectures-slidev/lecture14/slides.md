---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 14"
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

<div class="cover-lecture">Lecture 14</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
class: theorems
---

# Recap: Discrete Diffusion (Lecture 12)

<div class="block">

## ELBO

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)
&={\color{olive}\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}
-{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}\\
&\quad-{\color{teal}\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}}
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al., Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
sourceFrame: "extension: 2"
class: theorems
---

# Recap: Discrete Diffusion (Lecture 12)

<div class="block">

## Discrete conditioned reverse distribution

$$
q(\bx_{t-1}|\bx_t,\bx_0)
=\Cat\left(\frac{\bQ_t\bx_t\odot\bQ_{1:t-1}\bx_0}{\bx_t^{\top}\bQ_{1:t}\bx_0}\right).
$$

</div>

- Both $q(\bx_{t-1}|\bx_t,\bx_0)$ and $q(\bx_t|\bx_0)$ are known analytically from the forward process.
- The reverse process $\pt(\bx_{t-1}|\bx_t)$ is a learned categorical distribution:

$$
\pt(\bx_{t-1}|\bx_t)=\Cat\bigl(\bpi_{\btheta}(\bx_t,t)\bigr).
$$

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al., Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap: Discrete Diffusion (Lecture 12)

<div class="block">

## ELBO term

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\,\|\,\pt(\bx_{t-1}|\bx_t)\bigr).
$$

</div>
<div class="block">

## Categorical KL

$$
\KL\bigl(\Cat(\bq)\,\|\,\Cat(\bp)\bigr)
=\sum_{k=1}^Kq_k\log\frac{q_k}{p_k}
=\Ent(\bq,\bp)-\Ent(\bq),
$$

- $\Ent\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\bigr)$ is a constant w.r.t. $\btheta$.
- $\Ent(\bq,\bp)=-\sum_kq_k\log p_k$ is a **cross-entropy loss**.

</div>

Therefore, minimizing $\cL_t$ w.r.t. $\btheta$ is equivalent to minimizing

$$
\bbE_{q(\bx_t|\bx_0)}\Ent\Bigl(q(\bx_{t-1}|\bx_t,\bx_0),\,\pt(\bx_{t-1}|\bx_t)\Bigr).
$$

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al., Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 3
sourceFrame: "4"
class: theorems
---

# Setup: where PF-ODE solvers floor

<div class="block">

## Recall: probability flow ODE

$$
d\bx=\left[\bff(\bx,t)-\tfrac12g^2(t)\,\bs(\bx,t)\right]dt,\quad\bs(\bx,t)=\nabla_{\bx}\log p_t(\bx).
$$

</div>
<ul>
<li v-click="1">

Plugging $\bs_{\btheta}$ into the PF-ODE and using a high-order $\ODESolve$ (Heun, RK) brings the number of steps from $100$–$1000$ down to $20$–$50$.

</li>
<li v-click="2">

Each step still costs one network call — truncation error compounds along the trajectory.

</li>
<li v-click="3">

Can we go further — to **1**–**4** steps?

</li>
</ul>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y. et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 2
sourceFrame: "5"
class: theorems
---

# Setup: shortcut networks

- Idea: **learn a shortcut network** that compresses many ODE-solver steps into one.
- It maps any $(\bx_t,t)$ directly to the data-side endpoint of the same PF-ODE trajectory — one network call instead of many.

<div class="block" v-click="1">

## Two approaches in this lecture

- **Consistency Models** — enforce *self-consistency* along PF-ODE trajectories (per-sample mapping).
- **Distribution Matching Distillation** — match the *distributions* of generator and data via score differences (population-level).

</div>
<div v-click="2">

Both reuse a pretrained score $\bs_{\bphi}$ as a teacher.

</div>

<div class="source"><a href="https://arxiv.org/abs/2303.01469">Song Y. et al. Consistency Models, 2023</a></div>

---
clicks: 0
sourceFrame: "6"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Consistency Models</div></div>
<div class="outline-item"><span>02</span><div>Distribution Matching Distillation</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Consistency Models"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Consistency Models</div></div>
<div class="outline-item"><span>02</span><div>Distribution Matching Distillation</div></div>

</div>

---
clicks: 0
sourceFrame: "7"
class: theorems
---

# Consistency function: an ODE perspective

<div class="block">

## Goal

Learn a one-step generator $f_{\btheta}:(\bx_t,t)\mapsto\bx_{\epsilon}$ that pulls any noisy $\bx_t$ on a PF-ODE trajectory back to its data endpoint $\bx_{\epsilon}$, $t\in[\epsilon,T]$.

</div>
<div style="color:gray">

$\epsilon>0$ is a small numerical cutoff — the score $\bs(\bx,t)$ blows up as $t\to0$, so we stop one $\epsilon$-step short and treat $\bx_{\epsilon}\approx\bx_0$ as the data sample.

</div>

<div class="source"><a href="https://arxiv.org/abs/2303.01469">Song Y. et al. Consistency Models, 2023</a></div>

---
clicks: 1
sourceFrame: "extension: 7"
class: theorems
---

# Consistency function: an ODE perspective

<div class="block">

## Specification: ODE problem along the trajectory

$$
\underbrace{\frac{d}{dt}\,f_{\btheta}(\bx_t,t)=0}_{\text{differential form: constant along PF-ODE}},
\qquad
\underbrace{f_{\btheta}(\bx_{\epsilon},\epsilon)=\bx_{\epsilon}}_{\text{boundary: value pinned at }t=\epsilon}.
$$

</div>
<div v-click="1">

Together the two conditions pin $f_{\btheta}$ uniquely: a function that is constant on each trajectory and equals $\bx_{\epsilon}$ at the data-side end must equal $\bx_{\epsilon}$ *everywhere* on that trajectory.

</div>

<div class="source"><a href="https://arxiv.org/abs/2303.01469">Song Y. et al. Consistency Models, 2023</a></div>

---
clicks: 1
sourceFrame: "8"
class: theorems
---

# Consistency function: an ODE perspective

$$
f_{\btheta}(\bx_t,t)=\bx_{\epsilon},\quad t\in[\epsilon,T]
$$

<img src="/figs/pfode-fig1.png" alt="Consistency function maps points of a probability-flow trajectory to the data-side endpoint" style="width:100%;height:280px;object-fit:contain" />

<div v-click="1">

- To optimize the differential condition $\tfrac{d}{dt}f_{\btheta}(\bx_t,t)=0$ we need a derivative through the network.
- Integrate it between two times $t,t'$ on the *same* PF-ODE trajectory.

</div>

<div class="source"><a href="https://arxiv.org/abs/2303.01469">Song Y. et al. Consistency Models, 2023</a></div>

---
clicks: 1
sourceFrame: "9"
class: theorems
---

# Self-consistency: the integrated form

Idea is to replace $df_{\btheta}/dt=0$ by a finite difference between two adjacent points.

<div class="block">

## Self-consistency property

$$
f_{\btheta}(\bx_t,t)=f_{\btheta}(\bx_{t'},t'),\quad\forall t,t'\in[\epsilon,T],
$$

whenever $\bx_t$ and $\bx_{t'}$ lie **on the same PF-ODE trajectory.**

</div>
<div v-click="1">

<img src="/figs/cm-fig2.png" alt="Consistency models map points from the same ODE trajectory to the same endpoint" style="width:100%;height:270px;object-fit:contain" />

</div>

<div class="source"><a href="https://arxiv.org/abs/2303.01469">Song Y. et al. Consistency Models, 2023</a></div>

---
clicks: 1
sourceFrame: "10"
class: theorems
---

# Skip-connection parameterization

<div class="block">

## Parameterization

We parametrize the consistency model to guarantee the boundary condition $f_{\btheta}(\bx_{\epsilon},\epsilon)=\bx_{\epsilon}$

$$
f_{\btheta}(\bx,t)=c_{\text{skip}}(t)\,\bx+c_{\text{out}}(t)\,F_{\btheta}(\bx,t).
$$

- $F_{\btheta}(\bx,t)$ — free-form neural network.
- $c_{\text{skip}}(t),\,c_{\text{out}}(t)$ — differentiable scalar weights with $c_{\text{skip}}(\epsilon)=1$ and $c_{\text{out}}(\epsilon)=0$.

</div>
<div v-click="1">

At $t=\epsilon$ the skip term passes $\bx$ through and the network term is killed: $f_{\btheta}(\bx_{\epsilon},\epsilon)=\bx_{\epsilon}$ holds *structurally*, for any $\btheta$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2303.01469">Song Y. et al. Consistency Models, 2023</a></div>

---
clicks: 1
sourceFrame: "11"
class: theorems
---

# Consistency Distillation (CD)

Enforce $df_{\btheta}/dt=0$ as a *finite difference* on adjacent points of the teacher's PF-ODE trajectory. Discretize $[\epsilon,T]$ as $\epsilon=t_1<\dots<t_N=T$; $\bs_{\bphi}(\bx,t)$ — pretrained teacher score.

<div class="block" v-click="1">

## One ODE-solver step on the empirical PF-ODE

$$
\hat\bx_{t_n}^{\bphi}=\bx_{t_{n+1}}+(t_n-t_{n+1})\,\Phi(\bx_{t_{n+1}},t_{n+1};\,\bphi),
$$

one step of $\ODESolve$ for $d\bx/dt=-t\cdot\bs_{\bphi}(\bx,t)$ (Euler: $\Phi=-t\,\bs_{\bphi}$; Heun: average of two stages). The RHS follows from the VE-SDE PF-ODE with $\sigma(t)=t$ ($\bx_t=\bx_0+t\,\bepsilon$): then $\bff\equiv0$, $g^2(t)=2t$, so $\tfrac12g^2(t)=t$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2303.01469">Song Y. et al. Consistency Models, 2023</a></div>

---
clicks: 0
sourceFrame: "extension: 11"
class: theorems
---

# Consistency Distillation (CD)

<div class="block">

## CD loss

$$
\cL_{\text{CD}}(\btheta)=\bbE\left[\lambda(t_n)\,d\bigl(f_{\btheta}(\bx_{t_{n+1}},t_{n+1}),\;f_{\btheta^-}(\hat\bx_{t_n}^{\bphi},t_n)\bigr)\right].
$$

$\lambda(t_n)>0$ — weighting; $d(\bu,\bv)\in\{\|\bu-\bv\|_2^2,\|\bu-\bv\|_1,\text{LPIPS}\}$; $\btheta^-$ — EMA of $\btheta$ (stop-gradient target, prevents collapse).

</div>

<div class="source"><a href="https://arxiv.org/abs/2303.01469">Song Y. et al. Consistency Models, 2023</a></div>

---
clicks: 0
sourceFrame: "12"
class: theorems
---

# Pseudocode (Consistency Distillation)

<div class="block">

## Training

1. Sample $\bx_0\sim\pd(\bx)$, $n\sim U\{1,N{-}1\}$, $\bepsilon\sim\cN(0,\bI)$.
2. Compute $\bx_{t_{n+1}}=\bx_0+t_{n+1}\,\bepsilon$.
3. Solve one teacher ODE step $\hat\bx_{t_n}^{\bphi}=\bx_{t_{n+1}}+(t_n-t_{n+1})\,\Phi(\bx_{t_{n+1}},t_{n+1};\bphi)$.
4. Compute loss $\cL=\lambda(t_n)\,d\bigl(f_{\btheta}(\bx_{t_{n+1}},t_{n+1}),\;f_{\btheta^-}(\hat\bx_{t_n}^{\bphi},t_n)\bigr)$.
5. Update EMA target $\btheta^-\leftarrow\mu\,\btheta^-+(1-\mu)\,\btheta$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2303.01469">Song Y. et al. Consistency Models, 2023</a></div>

---
clicks: 1
sourceFrame: "extension: 12"
class: theorems
---

# Pseudocode (Consistency Distillation)

<div class="block">

## Sampling (Multi-step)

1. Sample $\bx_T\sim\cN(0,T^2\bI)$; denoise $\bx_0\leftarrow f_{\btheta}(\bx_T,T)$.
2. For $i=1,\dots,M{-}1$: sample $\bepsilon\sim\cN(0,\bI)$, compute $\bx_{\tau_i}=\bx_0+\tau_i\,\bepsilon$, denoise $\bx_0\leftarrow f_{\btheta}(\bx_{\tau_i},\tau_i)$.
3. Return $\bx_0$.

</div>
<div v-click="1">

Multi-step trades a few extra NFEs ($M=2$–$4$) for higher quality; $M=1$ recovers single-step sampling.

</div>

<div class="source"><a href="https://arxiv.org/abs/2303.01469">Song Y. et al. Consistency Models, 2023</a></div>

---
clicks: 2
sourceFrame: "13"
class: theorems
---

# Latent Consistency Models (LCM)

Apply Consistency Distillation to a latent diffusion model (Stable Diffusion).

<div class="block" v-click="1">

## Guided consistency distillation

Absorb classifier-free guidance into $f_{\btheta}$: an augmented function $f_{\btheta}(\bx_t,t,\omega,\bc)$ takes the guidance scale $\omega$ as input. The teacher uses CFG:

$$
\tilde\bs_{\bphi}(\bx_t,t,\omega,\bc)
=(1+\omega)\,\bs_{\bphi}(\bx_t,t,\bc)-\omega\,\bs_{\bphi}(\bx_t,t,\varnothing).
$$

</div>
<div class="block" v-click="2">

## Skipping-step

Enforce consistency over $k$ steps instead of $1$:

$$
f_{\btheta}(\bx_{t_{n+k}},t_{n+k})\approx f_{\btheta^-}(\hat\bx_{t_n},t_n).
$$

Larger SNR gap $\Rightarrow$ stronger training signal.

</div>

<div class="source"><a href="https://arxiv.org/abs/2310.04378">Luo S. et al. Latent Consistency Models, 2023</a></div>

---
clicks: 0
sourceFrame: "auto: Distribution Matching Distillation"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Consistency Models</div></div>
<div class="outline-item current"><span>02</span><div>Distribution Matching Distillation</div></div>

</div>

---
clicks: 2
sourceFrame: "14"
class: theorems
---

# One-step generator

<div class="block">

## Setup

Train a generator $G_{\btheta}:\bz\mapsto\bx$, $\bz\sim\cN(0,\bI)$.

</div>
<div class="block" v-click="1">

## Objective

$$
G_{\btheta}\#p(\bz)\approx\pd(\bx).
$$

**Distribution** matching, not per-sample matching.

</div>
<div v-click="2">

- CM ties each $\bz$ to a specific PF-ODE endpoint.
- DMD lets $G_{\btheta}$ re-organize the noise-to-image map — $\bz$ and $G_{\btheta}(\bz)$ need not lie on a teacher trajectory.

</div>

<div class="source"><a href="https://arxiv.org/abs/2311.18828">Yin T. et al. One-step Diffusion with Distribution Matching Distillation, 2023</a></div>

---
clicks: 2
sourceFrame: "15"
class: theorems
---

# KL gradient via score difference

Diffuse the generator output: $\bx_t=G_{\btheta}(\bz)+\sigma_t\,\bepsilon$. Let $p_{\text{fake},t}$ and $p_{\text{real},t}$ be the corresponding marginals.

<div class="block" v-click="1">

## Variational score-distillation identity

$$
\begin{aligned}
&\nabla_{\btheta}\,\KL\bigl(p_{\text{fake},t}\,\|\,p_{\text{real},t}\bigr)\\
&\quad=-\,\bbE\left[\bigl(\bs_{\text{real},t}(\bx_t)-\bs_{\text{fake},t}(\bx_t)\bigr)\cdot\nabla_{\btheta}G_{\btheta}(\bz)\right].
\end{aligned}
$$

</div>
<div v-click="2">

- Likelihood-free: only score *differences* matter.
- Integrate over $t$ with weighting $w(t)$ $\Rightarrow$ tractable training signal.

</div>

<div class="source"><a href="https://arxiv.org/abs/2311.18828">Yin T. et al. One-step Diffusion with Distribution Matching Distillation, 2023</a></div>

---
clicks: 2
sourceFrame: "16"
class: theorems
---

# Two score networks

<div class="block">

## Real score (frozen)

$\bs_{\text{real},t}=\bs_{\bphi}(\bx_t,t)$: the pretrained teacher.

</div>
<div class="block" v-click="1">

## Fake score (online)

$\bs_{\text{fake},t}=\bs_{\bpsi}(\bx_t,t)$: a *second* score network trained online with denoising score matching on samples from the current $G_{\btheta}$.

Tracks $p_{\text{fake}}$ as the generator evolves.

</div>
<div class="block" v-click="2">

## Alternating optimization

1. Update $\bs_{\bpsi}$ on a batch from $G_{\btheta}$ (score matching).
2. Update $G_{\btheta}$ with the score-difference gradient.

</div>

<div class="source"><a href="https://arxiv.org/abs/2311.18828">Yin T. et al. One-step Diffusion with Distribution Matching Distillation, 2023</a></div>

---
clicks: 2
sourceFrame: "17"
class: theorems
---

# DMD1: total loss

<div class="block">

## Total objective

$$
\cL_{\text{DMD}}(\btheta)=\cL_{\text{KL-grad}}(\btheta)+\lambda_{\text{reg}}\,\cL_{\text{reg}}(\btheta).
$$

</div>
<div class="block" v-click="1">

## Regression term

$$
\cL_{\text{reg}}(\btheta)=\bbE_{(\bz,\bx^\star)}\|G_{\btheta}(\bz)-\bx^\star\|^2,
$$

on a few hundred precomputed $(\bz,\bx^\star)$ pairs ($\bx^\star$ = teacher's PF-ODE output for $\bz$).

</div>
<div v-click="2">

Interpretation: regression anchors $G_{\btheta}$ near the teacher's deterministic map; the KL-gradient term then re-shapes the *distribution* of outputs.

</div>

<div class="source"><a href="https://arxiv.org/abs/2311.18828">Yin T. et al. One-step Diffusion with Distribution Matching Distillation, 2023</a></div>

---
clicks: 4
sourceFrame: "18"
class: theorems
---

# DMD2: improvements

Three changes over DMD1:

<ul>
<li v-click="1">

**GAN loss**: a discriminator on real images corrects the bias from an imperfect $\bs_{\bpsi}$.

</li>
<li v-click="2">

**No regression**: removes the need for precomputed $(\bz,\bx^\star)$ pairs; simpler pipeline.

</li>
<li v-click="3">

**Multi-step generator**: $G_{\btheta}$ becomes a $4$-step network, recovering quality lost at the strict $1$-step setting.

</li>
</ul>
<div v-click="4">

Closes most of the quality gap between distilled and full-step diffusion.

</div>

<div class="source"><a href="https://arxiv.org/abs/2405.14867">Yin T. et al. Improved Distribution Matching Distillation for Fast Image Synthesis, 2024</a></div>

---
clicks: 0
sourceFrame: "19"
class: summary
---

# Summary

- PF-ODE solvers (Heun, RK) floor at ${\sim}20$ steps; further acceleration requires **learning a shortcut network**.
- **Consistency Models**: a neural network $f_{\btheta}$ specified by $df_{\btheta}/dt=0$ along PF-ODE $+$ boundary $f_{\btheta}(\bx_{\epsilon},\epsilon)=\bx_{\epsilon}$; CD enforces the differential condition as a finite-difference loss on a teacher's trajectory.
- LCM extends CD to latent SD with guided distillation and skipping-step.
- **DMD**: match generator and data *distributions* via the score-difference gradient; two score networks (frozen real, online fake) in alternating optimization. DMD2 adds GAN, drops regression, adds multi-step.
- Tradeoffs: CM is more principled, DMD currently delivers the best $1$-step quality.
