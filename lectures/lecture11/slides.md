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

$$
d \bx = \sqrt{\frac{ d [\sigma^2(t)]}{dt}} \cdot d \bw, \qquad \bff(\bx, t) = 0, \quad g(t) = \sqrt{\frac{ d [\sigma^2(t)]}{dt}}
$$

This process matches the NCSN noise levels. $\sigma(t)$ is a monotonically increasing function.

</div>

<div class="block">

## Variance Preserving SDE (DDPM)

$$
d \bx = - \frac{1}{2} \beta(t) \bx(t) dt + \sqrt{\beta(t)} \cdot d \bw, \qquad \bff(\bx, t) = - \frac{1}{2} \beta(t) \bx(t) , \quad g(t) = \sqrt{\beta(t)}
$$

This is the small-step limit of the DDPM forward chain. Variance is preserved as long as $\bx(0)$ has unit variance.

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-2
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
id: recap-of-previous-lecture-3
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

<div class="source"><a href="https://doi.org/10.1016/0304-4149(82)90051-5">Anderson B. D. O. Reverse-time diffusion equation models, 1982</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-4
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
id: recap-of-previous-lecture-5
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
id: recap-of-previous-lecture-6
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
id: recap-training-time-and-noise-level
class: theorems
---

# Recap of Previous Lecture

## Training Time, Noise Level and Loss Weights

For $t\sim r(t)$ and differentiable monotone $\lambda(t)=\log\SNR(t)$ with nonzero derivative:

$$
p_{\lambda}(\lambda)=r(t(\lambda))\left|\frac{dt}{d\lambda}\right|,
\qquad
\int W(\lambda)\ell_{\btheta}(\lambda)d\lambda
=\bbE_{p_{\lambda}}\frac{W(\lambda)\ell_{\btheta}(\lambda)}{p_{\lambda}(\lambda)}.
$$

Uniform time is generally nonuniform in log-SNR; the generation grid is a separate choice.

## Changing the Prediction Target

For additive Gaussian noise, preserving the unit-weight score objective gives

$$
\left\|\bs_{\btheta}(\bx,\sigma)+\frac{\bx-\bx_0}{\sigma^2}\right\|^2
=\frac1{\sigma^4}\left\|D_{\btheta}(\bx,\sigma)-\bx_0\right\|^2.
$$

Here $\bs_{\btheta}=(D_{\btheta}-\bx)/\sigma^2$. Plain denoiser MSE changes the weights.

<div class="source"><a href="https://arxiv.org/abs/2303.00848">Kingma D., Gao R. Understanding Diffusion Objectives as the ELBO with Simple Data Augmentation, 2023</a><br><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a></div>

<!-- Coverage: combines the new continuous-coordinate result and the explicit weight in the denoiser derivation. The preceding recap is already full with discrete/continuous objectives and VE/VP kernels; the later denoiser/PF-ODE recap covers sampling geometry. A separate static slide preserves readable formulas. Importance sampling requires support wherever W times the loss contributes; sigma>0. -->

---
clicks: 0
id: recap-of-previous-lecture-7
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
id: recap-of-previous-lecture-8
class: theorems
---

# Recap of Previous Lecture

For additive Gaussian noise $\bx=\bx_0+\sigma\bepsilon$, $\bepsilon\sim\cN(0,\bI)$:

<div class="block">

## A Denoiser Parameterizes the Probability Flow ODE

$$
\bs_{\btheta}(\bx,\sigma)=\frac{D_{\btheta}(\bx,\sigma)-\bx}{\sigma^2},
\qquad
\frac{d\bx}{d\sigma}=-\sigma\bs_{\btheta}(\bx,\sigma)
=\frac{\bx-D_{\btheta}(\bx,\sigma)}{\sigma}.
$$

Decreasing $\sigma$ moves towards the denoiser prediction.

</div>

<div class="block">

## DDIM Is Euler in Noise Coordinates

Normalize the DDPM state and noise level:

$$
\tilde{\bx}_t=\frac{\bx_t}{\sqrt{\bar{\alpha}_t}},
\qquad \sigma_t=\sqrt{\frac{1-\bar{\alpha}_t}{\bar{\alpha}_t}}.
$$

Deterministic DDIM implements the Euler step using the existing noise predictor.

</div>

**The ODE field can be obtained from a trained denoiser.**

<div class="source"><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a><br><a href="https://arxiv.org/abs/2010.02502">Song J., Meng C., Ermon S. Denoising Diffusion Implicit Models, 2021</a></div>

<!--
Coverage repair: the preceding Recap Sampling slide recalls the general score-based construction. This slide recalls the new denoiser/DDIM section's main results: additive-noise coordinates, the score-to-denoiser conversion, the sigma-parameterized PF-ODE, and deterministic DDIM as Euler after DDPM rescaling. It summarizes the results rather than repeating the training-loss or DDIM derivations. The first block's x is the additive-noise state; in the second block tilde x_t is that normalized state and x_t is the original DDPM state. Assume sigma>0 and alpha_bar_t>0. The score equality defines the learned parameterization; exact marginal probability flow requires the true score. DDIM's equality is between discrete updates on the same grid with the induced denoiser and same initial state under rescaling, not exact integration or equivalence of different priors. The conclusion closes construction of a field from a trained predictor. The following CNF recap explicitly introduces learning the velocity field itself, then the cost of likelihood training motivates Flow Matching. Static recap, matching the surrounding slides.
-->

---
clicks: 0
id: recap-of-previous-lecture-9
class: theorems
---

# Recap of Previous Lecture

**Now learn the velocity field itself.** Recall $\bx_t=\bx(t)$ for $t\in[0,1]$, with $\bx_0\sim p_0(\bx)$ (mostly $\cN(0,\bI)$), $\bx_1\sim p_1(\bx)=\pd(\bx)$.

**Time convention:** unlike the diffusion sections, here $t=0$ denotes noise and $t=1$ denotes data. Sampling runs forward in time.

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

- Likelihood-based CNF training requires ODE solves and Jacobian trace evaluations.
- The adjoint method computes gradients through the ODE solution; repeated solves can be costly.

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a><br><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-10
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Flow Matching

$$
\bbE_{t\sim U[0,1]}\bbE_{\bx\sim p_t(\bx)}\left\|\bv(\bx,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

Flow matching fits velocities by regression, without model ODE solves or trace evaluations during training.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: outline
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item "><span>02</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 0
id: outline-2
section: "Conditional Flow Matching (CFM)"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item "><span>02</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 0
id: generative-models-taxonomy
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" flow-matching />

---
clicks: 0
id: outline-3
section: "CFM Objective"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item "><span>02</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 2
id: flow-matching
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
clicks: 2
id: conditional-vector-field
class: theorems interactive-slide
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
clicks: 1
id: conditional-flow-matching
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
&\quad={\color{olive}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}}\left[\|\bv_{\btheta}(\bx,t)\|^2-2{\color{teal}\bv_{\btheta}^\top(\bx,t)\bv(\bx,t)}\right]+\text{const}
\end{aligned}
$$

Here $\text{const}$ is independent of $\btheta$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 2
id: conditional-flow-matching-2
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
id: marginal-to-conditional-scores-vs-velocities
class: theorems
---

# Marginal-to-Conditional: Scores vs Velocities

<div class="block">

## Denoising Score Matching

$$
\bbE_{\pd(\bx)}\bbE_{q(\bx_\sigma|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_\sigma)-\nabla_{\bx_\sigma}\log q(\bx_\sigma|\bx)\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>

Optimal predictor over all functions:

$$
\bs^*_\sigma(\bx_\sigma)=\bbE_{q(\bx|\bx_\sigma)}\left[\nabla_{\bx_\sigma}\log q(\bx_\sigma|\bx)\right]=\nabla_{\bx_\sigma}\log q(\bx_\sigma)
$$

<div v-click="1">
<div class="block">

## Conditional Flow Matching

$$
\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

</div>

Optimal predictor over all functions: $\bv^*(\bx,t)=\bbE_{p_t(\bz|\bx)}\bv(\bx,\bz,t)=\bv(\bx,t)$.

</div>
<div v-click="2">

In both cases, the optimal MSE predictor is the posterior mean of the **conditional** target, which equals the intractable **marginal** quantity (score or velocity).

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 0
id: outline-4
section: "Conditional Probability Paths"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item "><span>02</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 3
id: conditional-flow-matching-continuity-equations
class: theorems
---

# Conditional Flow Matching: Continuity Equations

CFM gives us a training objective. We still need to choose conditional paths and their target velocities.

<div class="block">

## Continuity Equations

$$
\begin{aligned}
\frac{\partial p_t(\bx)}{\partial t}&=-\diver\left(\bv(\bx,t)\cdot p_t(\bx)\right)\\
\frac{\partial p_t(\bx|\bz)}{\partial t}&=-\diver\left(\bv(\bx,\bz,t)\cdot p_t(\bx|\bz)\right)
\end{aligned}
$$

</div>

<ul>
<li v-click="1">

$\bv(\bx,t)$ (under regularity conditions) and initial condition $p_0(\bx)$ uniquely determine $p_t(\bx)$.

</li>
<li v-click="2">

Given a field $\bv$ generating $p_t$, adding $\bw$ with $\diver(p_t\bw)=0$ preserves the same continuity equation.

</li>
<li v-click="3">

We need a velocity field that satisfies the continuity equation and defines a well-posed flow.

</li>
</ul>

<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

<!-- The perturbation w has zero weighted divergence, div(p_t w)=0; w itself need not be divergence-free. Thus v and v+w satisfy the same continuity equation for the given p_t. Identifying these equations with a common ODE-induced density path additionally requires well-posed flows and the usual boundary/integrability conditions. This is a choice of compatible velocity, not an existence theorem for arbitrary density paths. -->

---
clicks: 3
id: conditional-flow-matching-paths-and-vector-fields
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

- $p(\bz)$, $p_t(\bx|\bz)$ and $\bv(\bx,\bz,t)$ uniquely determine $\bv(\bx,t)$.
- Choosing conditional paths and compatible velocities constructs both marginal quantities.

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

## Open Questions

- **Q1** How should we choose the convenient conditioning latent variable $\bz$?
- **Q2** How should we choose $p_t(\bx|\bz)$ so that its marginal satisfies the endpoint constraints?

$$
\bbE_{p(\bz)}p_0(\bx|\bz)=\cN(0,\bI);\quad\bbE_{p(\bz)}p_1(\bx|\bz)=\pd(\bx).
$$

</div>

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">Diagram adapted from A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 2
id: gaussian-conditional-probability-paths-q2
class: theorems
---

# Gaussian Conditional Probability Paths [Q2]

On the interval considered, assume $\bmu_t(\bz)$ and $\bsigma_t(\bz)$ are differentiable in $t$, with $\bsigma_t(\bz)>0$ componentwise.

$$
p_t(\bx|\bz)=\cN\left(\bmu_t(\bz),\bsigma_t^2(\bz)\right)
$$

<div v-click="1">

The concrete $\bmu_t(\bz)$, $\bsigma_t(\bz)$ (which satisfy the boundary constraints) will be fixed once we choose $\bz$ [Q1].

<div class="block">

## Gaussian flow

- We need a tractable velocity target for this Gaussian path.
- Choose the affine flow: keep the same Gaussian noise along each trajectory and vary its mean and scale.

<div v-click="2">

- Use this fixed-noise construction:

$$
\bx_t=\bpsi_t(\bx_0,\bz)=\bmu_t(\bz)+\bsigma_t(\bz)\odot\bepsilon,
$$

where $\bepsilon$ is fixed by the condition: $\bx_0=\bmu_0(\bz)+\bsigma_0(\bz)\odot\bepsilon$.

</div></div></div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

<!-- The selected affine flow keeps epsilon fixed along each trajectory. Differentiability in time and componentwise positive sigma are assumed on the interval where the inverse map and velocity formula are used, including positive sigma_0 for the initial parametrization. A zero-variance endpoint requires separate limiting analysis; the later one-sided construction treats t=1 separately. We choose one compatible field rather than claim uniqueness from the density path alone. -->

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
clicks: 0
id: outline-5
section: "One-Sided Conditioning"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item current"><span>02</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 3
id: endpoint-conditioning
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

Let's consider straight conditional paths:

<EndpointPathDemo />

</div>
<div v-click="2">

<div class="math-chain">

$\displaystyle\begin{cases}\bmu_t(\bx_1)=t\bx_1\\\bsigma_t(\bx_1)=1-t\end{cases}$
<span v-click="3">$\displaystyle\quad\Rightarrow\quad\begin{cases}p_t(\bx|\bx_1)=\cN\left(t\bx_1,(1-t)^2\cdot\bI\right)\\\bx_t=t\bx_1+(1-t){\color{olive}\bx_0}\end{cases}$</span>

</div>

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 4
id: one-sided-conditioning-conditional-vector-field
class: theorems interactive-slide
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


<!-- The preceding slide derives the conditional target x1-x0. This slide substitutes it into CFM, names the resulting linear-interpolation regression Rectified Flow, and distinguishes conditional training paths from integral curves of the optimal marginal field. The following slide gives the unchanged Training/Sampling algorithms. The conditional-expectation identity assumes the population MSE optimum and sufficient model capacity; a fitted finite network approximates it. Rectified Flow does not require straight sampling trajectories or reflow. Reflow is deferred to the coupling discussion. -->

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
id: rectified-flow-training-time-distribution
class: theorems
---

# Rectified Flow: Sampling Training Times

For $\bx_t=(1-t)\bx_0+t\bx_1$, let $\ell_{\btheta}(t)=\bbE\|\bv_{\btheta}(\bx_t,t)-(\bx_1-\bx_0)\|^2$.

<div v-click="1">

$$
\bbE_{t\sim r}\ell_{\btheta}(t)
=\bbE_{t\sim U[0,1]}\left[r(t)\ell_{\btheta}(t)\right].
$$

**Without importance correction, more frequent times receive more weight.**

</div>
<div v-click="2">

$$
u\sim\cN(\mu,s^2),\qquad t=\frac1{1+e^{-u}}
\quad\Rightarrow\quad
\log\SNR(t)=2\log\frac{t}{1-t}=2u.
$$

<img src="/figs/logit-normal-training-times.svg" alt="Uniform and logit-normal training-time densities, with mu zero and s one" style="width:100%;height:185px;object-fit:contain" />

</div>
<div v-click="3">

Logit-normal time means Gaussian log-SNR. SD3 explores this reweighting.
The probability path and the target $\bx_1-\bx_0$ stay fixed.

</div>

<div class="source"><a href="https://arxiv.org/abs/2403.03206">Esser P., et al. Scaling Rectified Flow Transformers for High-Resolution Image Synthesis, 2024</a></div>

<!-- Narrative: the preceding Training/Sampling slide uses uniform time. Here vary only the training-time distribution, reuse the weighted-loss identity, and show logit-normal as a concrete example. The following CFG slide adds label/text conditioning at generation; the subsequent conditional/marginal-path slide returns to transport geometry. In this lecture t=0 is noise and t=1 is data, opposite to SD3 paper time. Thus positive mu favors data here; the symmetric mu=0,s=1 example needs no sign conversion. The Gaussian draws u and endpoint samples are independent. For the unshifted straight Gaussian path log-SNR=2u exactly. Resolution-dependent timestep shifting is a separate topic; the Gaussian log-SNR statement does not silently include it. Positive time-only weighting preserves the unrestricted pointwise conditional-mean optimum when expectations are finite; finite shared networks and finite optimization can behave differently. Restoring the uniform-time objective would require multiplying the sampled loss by 1/r(t). This concerns training times, not the ODE integration grid. -->

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

<!-- Narrative: first show the score-space CFG formula from the earlier diffusion lecture; the first click reveals the same combination for velocities. After varying rectified-flow training times, recall CFG to make generation conditional on a label or prompt. The following conditional/marginal-path slide moves from one-sided generation to two-sided transport. Here y is an observed condition, distinct from the auxiliary CFM latent z=x1; conditional and unconditional model velocities both average over training endpoints. Use the same noise law and interpolation for both branches; independently drop the condition, not the endpoint or regression target. x0 is independent Gaussian noise and t follows the previously chosen training distribution. The convention gamma=0 unconditional, gamma=1 conditional matches the score CFG slides. For shared Gaussian paths, the score-to-velocity map is affine with condition-independent coefficients, so an affine CFG combination transfers to velocities. This does not assert that gamma>1 exactly samples a tempered endpoint density. Standard CFG uses two predictions per field evaluation (which may be batched); gamma=0 or 1 can skip the unused branch. Guidance distillation is a separate construction. SD3 is the concrete example; no claim that every FLUX variant uses two-pass CFG. -->

---
clicks: 1
id: conditional-vs-marginal-paths
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
id: summary
class: summary
---

# Summary

- CFM makes FM training tractable through a latent variable $\bz$, preserving the minimizers.
- The marginal vector field can be expressed as the posterior mean of conditional vector fields: $\bv(\bx,t)=\bbE_{p_t(\bz|\bx)}\bv(\bx,\bz,t)$.
- Gaussian conditional paths admit a closed-form conditional velocity field.
- Changing the training-time distribution without importance correction reweights the loss; logit-normal time gives Gaussian log-SNR on the straight noise-to-data path.
- One-sided conditioning $\bz=\bx_1$ with straight conditional paths yields the **rectified flow objective**, using the target $\bv(\bx_t,\bx_1,t)=\bx_1-\bx_0$.
- Classifier-free guidance combines conditional and unconditional velocity predictions; condition dropout trains both branches in one model.
