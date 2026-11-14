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
id: recap-denoiser-score-and-training
class: theorems
---

# Recap of Previous Lecture

**Use the familiar additive-noise form:** $\bx=\bx_0+\sigma\bepsilon$, $\bepsilon\sim\cN(0,\bI)$.

<div class="block">

## Choose a denoiser using Tweedie's formula

$$
\bbE[\bx_0\mid\bx]=\bx+\sigma^2\nabla_{\bx}\log p_{\sigma}(\bx).
$$

$$
D_{\btheta}(\bx,\sigma)\approx\bbE[\bx_0\mid\bx],\qquad
\frac{d\bx}{d\sigma}=-\sigma\bs_{\btheta}(\bx,\sigma)
=\frac{\bx-D_{\btheta}(\bx,\sigma)}{\sigma}.
$$

Decreasing $\sigma$ moves towards the denoiser prediction.

</div>

<div class="block">

## Train the Denoiser

$$
\begin{aligned}
\cL
&=\left\|\frac{D_{\btheta}(\bx,\sigma)-\bx}{\sigma^2}
+\frac{\bx-\bx_0}{\sigma^2}\right\|_2^2\\
&=\frac{1}{\sigma^4}\left\|D_{\btheta}(\bx,\sigma)-\bx_0\right\|_2^2.
\end{aligned}
$$

**Preserving the score objective requires the factor $1/\sigma^4$.** Plain denoiser MSE would reweight noise levels.

</div>

<div class="source"><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a></div>

---
clicks: 0
id: recap-optimal-denoiser-and-euler
class: theorems
---

# Recap of Previous Lecture

## What Does the Optimal Denoiser Predict?

Use uniform empirical data $\{\bx_1,\ldots,\bx_N\}$. For fixed $\bx$ and $\sigma>0$, let
$a_i=\cN(\bx;\bx_i,\sigma^2\bI)$ be the likelihood of the noisy observation.

$$
D^*(\bx,\sigma)
=\frac{\sum_{i=1}^{N}\exp\!\left(-\frac{\|\bx-\bx_i\|_2^2}{2\sigma^2}\right)\bx_i}
{\sum_{j=1}^{N}\exp\!\left(-\frac{\|\bx-\bx_j\|_2^2}{2\sigma^2}\right)}
=\bbE[\bx_0\mid\bx].
$$

The exact formula scans **all $N$ training examples at every sampling step**.

<div class="block">

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

<div class="source"><a href="https://proceedings.neurips.cc/paper_files/paper/2022/file/a98846e9d9cc01cfb87eb694d946ce6b-Supplemental-Conference.pdf#page=11">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022 — Appendix B.3, Eqs. (53–57)</a><br><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a></div>

---
clicks: 0
id: recap-ddim-denoiser-euler
class: theorems
---

# Recap of Previous Lecture

## DDIM Is Euler in Noise Coordinates

**Recall deterministic DDIM** ($s<t$):

$$
\begin{aligned}
\hat{\bepsilon}&=\bepsilon_{\btheta,t}(\bx_t),\qquad
\hat{\bx}_0=\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\,\hat{\bepsilon}}{\sqrt{\bar{\alpha}_t}},\\
\bx_s&=\sqrt{\bar{\alpha}_s}\,\hat{\bx}_0+\sqrt{1-\bar{\alpha}_s}\,\hat{\bepsilon}.
\end{aligned}
$$

<div class="block">

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

<div class="block">

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

---
clicks: 0
id: recap-continuous-time-normalizing-flows
class: theorems
---

# Recap of Previous Lecture

## Continuous-Time Normalizing Flows

Recall $\bx_t=\bx(t)$ for $t\in[0,1]$:

$$
\bx_0 \sim p_0(\bx) = p(\bx), \quad \bx_1 \sim p_1(\bx) =  \pd(\bx)
$$

**Time convention:** unlike the diffusion sections, here $t=0$ denotes noise and $t=1$ denotes data. Sampling runs forward in time.

$$
\frac{d \bx_t}{dt} = \bv (\bx_t, t),  \quad \text{with initial condition } \bx(0) = \bx_0.
$$

The velocity $\bv$ determines a flow $\bpsi_t$: $\bx_t = \bpsi_t(\bx_0)$.

<div class="block">

## KFP Theorem (Continuity Equation)

$$
\frac{\partial p_t(\bx)}{\partial t} = - \diver\left(\bv(\bx, t) p_t(\bx)\right) \Leftrightarrow \frac{d \log p_t(\bx(t))}{d t} = - \tr \left( \frac{\partial \bv(\bx(t), t)}{\partial \bx(t)} \right)
$$

</div>

- Likelihood-based CNF training requires ODE solves and Jacobian trace evaluations.
- The adjoint method computes gradients through the ODE solution; repeated solves can be costly.

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 0
id: recap-of-previous-lecture
class: theorems
---

# Recap of Previous Lecture

## Flow Matching

$$
\bbE_{t \sim U[0, 1]} \bbE_{\bx \sim p_t(\bx)}\left\| \bv(\bx, t) - \bv_{\btheta}(\bx, t) \right\|^2 \rightarrow \min_{\btheta}
$$

Flow matching fits velocities by regression, without model ODE solves or trace evaluations during training.

<div class="block">

## Training

1. Sample $t \sim U[0, 1]$, $\bx_t \sim p_t(\bx)$.
2. Compute loss $\cL = \left\| \bv(\bx_t, t) - \bv_{\btheta}(\bx_t, t) \right\|^2$.

</div>

<div class="block">

## Sampling

1. Sample $\bx_0 \sim \cN(0, \bI)$.
2. Solve the ODE to obtain $\bx_1$:

$$
\bx_1 = \bpsi_1(\bx_0) = \ODESolve_v(\bx_0, \btheta, t_0=0, t_1=1).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-2
class: theorems
---

# Recap of Previous Lecture

**Problem:** The true vector field $\bv(\bx, t)$ is **unknown**.

Many velocity fields connect the same endpoints.

To build a tractable training target, introduce a latent variable $\bz$ and choose conditional paths whose mixture is the desired path:

$$
p_t(\bx)=\int p_t(\bx|\bz)p(\bz)d\bz
$$

Here, $p_t(\bx|\bz)$ is a **conditional probability path**.

The conditional probability path $p_t(\bx|\bz)$ satisfies the KFP theorem:

$$
\frac{\partial p_t(\bx|\bz)}{\partial t}=-\diver\left(\bv(\bx,\bz,t)p_t(\bx|\bz)\right),
$$

where $\bv(\bx,\bz,t)$ is a **conditional vector field**:

$$
\frac{d\bx_t}{dt}=\bv(\bx_t,t)\quad\Rightarrow\quad\frac{d\bx_t}{dt}=\bv(\bx_t,\bz,t)
$$

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 0
id: recap-of-previous-lectures
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem

The following vector field generates the probability path $p_t(\bx)$:

$$
\bv(\bx,t)=\bbE_{p_t(\bz|\bx)}\bv(\bx,\bz,t)={\color{teal}\int\bv(\bx,\bz,t)}\frac{{\color{teal}p_t(\bx|\bz)p(\bz)}}{p_t(\bx)}{\color{teal}d\bz}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 0
id: recap-of-previous-lecture-3
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Conditional Flow Matching (CFM)

$$
\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

If $p_t(\bx)>0$ for all $\bx\in\bbR^m$ and $0\le t<1$, the FM and CFM objectives differ by a constant independent of $\btheta$, so they have the same minimizers.

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 0
id: recap-of-previous-lecture-4
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Training

1. Sample $t\sim U[0,1]$, $\bz\sim p(\bz)$, $\bx_t\sim p_t(\bx|\bz)$.
2. Compute loss $\cL=\left\|\bv(\bx_t,\bz,t)-\bv_{\btheta}(\bx_t,t)\right\|^2$.

</div>
<div class="block">

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
id: recap-of-previous-lecture-5
class: theorems
---

# Recap of Previous Lecture

<CfmRecapDiagram kind="construction" />

<div class="block">

## Open Questions

- **Q1** How should we choose the convenient conditioning latent variable $\bz$?
- **Q2** How should we choose $p_t(\bx|\bz)$ so that its marginal satisfies the endpoint constraints?

$$
\bbE_{p(\bz)}p_0(\bx|\bz)=\cN(0,\bI);\quad\bbE_{p(\bz)}p_1(\bx|\bz)=\pd(\bx).
$$

</div>

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">Diagram adapted from A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 0
id: recap-of-previous-lecture-6
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Gaussian Conditional Probability Path

On the interval considered, assume $\bmu_t(\bz)$ and $\bsigma_t(\bz)$ are differentiable in $t$, with $\bsigma_t(\bz)>0$ componentwise.

$$
\begin{aligned}
p_t(\bx|\bz)&=\cN\left(\bmu_t(\bz),\bsigma_t^2(\bz)\right);\\
\bx_t&=\bpsi_t(\bx_0,\bz)=\bmu_t(\bz)+\bsigma_t(\bz)\odot\bepsilon
\end{aligned}
$$

</div>

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">image credit: A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 0
id: recap-of-previous-lecture-7
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Gaussian Conditional Probability Path

On the interval considered, assume $\bmu_t(\bz)$ and $\bsigma_t(\bz)$ are differentiable in $t$, with $\bsigma_t(\bz)>0$ componentwise.

$$
\begin{aligned}
p_t(\bx|\bz)&=\cN\left(\bmu_t(\bz),\bsigma_t^2(\bz)\right);\\
\bx_t&=\bpsi_t(\bx_0,\bz)=\bmu_t(\bz)+\bsigma_t(\bz)\odot\bepsilon
\end{aligned}
$$

</div>

$$
\boxed{\begin{aligned}
\bv(\bx_t,\bz,t)&=\bpsi_t'\left(\bpsi_t(\bx_t,\bz)^{-1},\bz\right)\\
&=\bmu_t'(\bz)+\frac{\bsigma_t'(\bz)}{\bsigma_t(\bz)}\odot(\bx_t-\bmu_t(\bz))
\end{aligned}}
$$

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-8
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Conditioning Latent Variable [Q1]

Let us choose $\bz=\bx_1$. Then $p(\bz)=p_1(\bx_1)$.

$$
p_t(\bx)=\int p_t(\bx|\bx_1)p_1(\bx_1)d\bx_1
$$

</div>

We need to ensure the boundary constraints:

$$
\begin{cases}
\bbE_{p(\bz)}p_0(\bx|\bz)=\cN(0,\bI)\\
\bbE_{p(\bz)}p_1(\bx|\bz)=\pd(\bx)
\end{cases}
\quad\Rightarrow\quad
\begin{cases}
p_0(\bx|\bx_1)=\cN(0,\bI);\\
p_1(\bx|\bx_1)=\delta(\bx-\bx_1)
\end{cases}
$$

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-9
class: theorems
---

# Recap of Previous Lecture

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

Let's consider straight conditional paths:

$$
\begin{cases}
\bmu_t(\bx_1)=t\bx_1\\
\bsigma_t(\bx_1)=1-t
\end{cases}
\quad\Rightarrow\quad
\begin{cases}
p_t(\bx|\bx_1)=\cN\left(t\bx_1,(1-t)^2\cdot\bI\right)\\
\bx_t=t\bx_1+(1-t){\color{olive}\bx_0}
\end{cases}
$$

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">image credit: A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 0
id: recap-of-previous-lecture-10
class: figure-slide
---

# Recap of Previous Lecture

<CfmRecapDiagram kind="cones" />

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-11
class: theorems
---

# Recap of Previous Lecture

## Rectified Flow Objective

$$
p_t(\bx|\bx_1)=\cN\left(t\bx_1,(1-t)^2\bI\right);\quad{\color{teal}\bx_t=t\bx_1+(1-t)\bx_0}
$$

$$
\bv(\bx_t,\bx_1,t)=\frac{\bx_1-\bx_t}{1-t}=\bx_1-\bx_0,\qquad t<1
$$

$$
\begin{aligned}
&\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\\
&=\bbE_{t\sim U[0,1]}\bbE_{\bx_1\sim\pd(\bx)}\bbE_{\bx_0\sim\cN(0,\bI)}\left\|(\bx_1-\bx_0)-\bv_{\btheta}\left(t\bx_1+(1-t)\bx_0,t\right)\right\|^2
\end{aligned}
$$

At $t=1$, the quotient is undefined. Use the simplified training target $\bx_1-\bx_0$, which contains no division.

<div class="source"><a href="https://mlg.eng.cam.ac.uk/blog/2024/01/20/flow-matching.html">image credit: https://mlg.eng.cam.ac.uk/blog/2024/01/20/flow-matching.html</a><br><a href="https://arxiv.org/abs/2209.03003">Liu X., Gong C., Liu Q. Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-12
class: theorems
---

# Recap of Previous Lecture

- $\bv(\bx_t,\bx_1,t)$ defines straight lines between $\pd(\bx)$ and $\cN(0,\bI)$.
- **Straight training paths do not imply straight sampling trajectories.**

<CfmRecapDiagram kind="comparison" />

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://arxiv.org/abs/2209.03003">Liu X., Gong C., Liu Q. Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-13
class: theorems
---

# Recap of Previous Lecture

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

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-14
class: theorems
---

# Recap of Previous Lecture

<img src="/figs/cond_marg_paths.png" alt="Conditional and marginal probability paths" style="width:100%;height:315px;object-fit:contain" />

<div>

- One-sided conditioning gives us the way to construct a generative model.
- Now we extend it to image-to-image formulation (mapping between two distinct data distributions $p_0(\bx)$ and $p_1(\bx)$).

</div>

<div class="source"><a href="https://arxiv.org/abs/2506.02070">Holderrieth P. and Erives E., et al. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 0
id: recap-rectified-flow-training-times
class: theorems
---

# Recap of Previous Lecture

## Rectified Flow: Training-Time Distribution

Keep $\bx_t=(1-t)\bx_0+t\bx_1$ and the target $\bx_1-\bx_0$ fixed.
Let $\ell_{\btheta}(t)$ be the expected velocity MSE at time $t$.

$$
\bbE_{t\sim r}\ell_{\btheta}(t)
=\bbE_{t\sim U[0,1]}\left[r(t)\ell_{\btheta}(t)\right].
$$

Changing the time distribution without correction changes the objective.
To preserve uniform-time training, use $\ell_{\btheta}(t)/r(t)$ with $t\sim r$.

## Logit-Normal Example

$$
u\sim\cN(\mu,s^2),\qquad t=\frac1{1+e^{-u}},\qquad
\log\SNR(t)=2\log\frac{t}{1-t}=2u.
$$

Time $t=0$ is noise and $t=1$ is data. This choice does not prescribe the ODE grid.

<div class="source"><a href="https://arxiv.org/abs/2403.03206">Esser P., et al. Scaling Rectified Flow Transformers for High-Resolution Image Synthesis, 2024</a></div>

<!-- Coverage: a separate static recap follows the complete RF Training/Sampling slide, which has no room for the new objective identity and log-SNR relation. The density plot and parameter illustration are intentionally omitted. This recalls the unshifted straight-path example, not all SD3 training details. -->

---
clicks: 0
id: recap-classifier-free-guidance-velocity
class: theorems
---

# Recap of Previous Lecture

## Classifier-Free Guidance for Velocity Fields

Here $\by$ is a label or text prompt, distinct from the CFM latent $\bz$.

<div class="block">

$$
\bv_{\btheta}^{\gamma}(\bx,t,\by)
=\bv_{\btheta}(\bx,t,\varnothing)
+\gamma\left[\bv_{\btheta}(\bx,t,\by)-\bv_{\btheta}(\bx,t,\varnothing)\right].
$$

$\gamma=0$: unconditional; $\gamma=1$: conditional; $\gamma>1$: extrapolation.

</div>
<div class="columns">
<div>

## Training

1. Sample paired data $(\bx_1,\by)\sim\pd$ and form the rectified-flow sample $\bx_t$ as before.
2. Set $\tilde\by=\varnothing$ with fixed probability; otherwise set $\tilde\by=\by$.
3. Minimize the same velocity loss:

$$
\cL=\left\|\bv_{\btheta}(\bx_t,t,\tilde\by)-(\bx_1-\bx_0)\right\|^2.
$$

</div>
<div>

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

<!-- Coverage: the new CFG result follows the RF recap. Existing RF Training/Sampling and time-distribution slides are full and teach different choices; this separate static recap preserves the guidance convention and complete Training/Sampling blocks. The class/text condition y remains distinct from the CFM auxiliary latent z. -->

---
clicks: 0
id: outline
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Two-Sided Conditioning</div></div>
<div class="outline-item "><span>02</span><div>Link between Flow Matching and Score-Based Models</div></div>
<div class="outline-item "><span>03</span><div>Discrete Diffusion Models</div></div>
<div class="outline-item "><span>04</span><div>Forward Discrete Process</div></div>
<div class="outline-item "><span>05</span><div>Reverse Diffusion Process</div></div>
<div class="outline-item "><span>06</span><div>From Token To Sequence</div></div>

</div>

---
clicks: 0
id: outline-2
section: "Two-Sided Conditioning"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Two-Sided Conditioning</div></div>
<div class="outline-item "><span>02</span><div>Link between Flow Matching and Score-Based Models</div></div>
<div class="outline-item "><span>03</span><div>Discrete Diffusion Models</div></div>
<div class="outline-item "><span>04</span><div>Forward Discrete Process</div></div>
<div class="outline-item "><span>05</span><div>Reverse Diffusion Process</div></div>
<div class="outline-item "><span>06</span><div>From Token To Sequence</div></div>

</div>

---
clicks: 0
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
<div class="block">

## Conditioning Latent Variable [Q1]

Let us choose $\bz=(\bx_0,\bx_1)$. Start with independent endpoints: $p(\bz)=p_0(\bx_0)p_1(\bx_1)$.

$$
p_t(\bx)=\int p_t(\bx|\bx_0,\bx_1)p_0(\bx_0)p_1(\bx_1)d\bx_0d\bx_1
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 1
id: pair-conditioning-2
class: theorems
---

# Pair Conditioning

We must enforce boundary constraints:

<div class="math-chain" style="display:flex;align-items:center;justify-content:center;gap:12px;margin-top:40px">
<span>

$\displaystyle\begin{cases}p_0(\bx)=\bbE_{p(\bz)}p_0(\bx|\bz);\\p_1(\bx)=\bbE_{p(\bz)}p_1(\bx|\bz)\end{cases}$

</span>
<span v-click="1">

$\displaystyle\Leftarrow\quad\begin{cases}p_0(\bx|\bx_0,\bx_1)=\delta(\bx-\bx_0)\\p_1(\bx|\bx_0,\bx_1)=\delta(\bx-\bx_1)\end{cases}$

</span>
</div>

<div v-click="1">

Choosing these Dirac endpoints is sufficient to satisfy the boundary constraints.
Gaussian smoothing recovers them in the zero-variance limit.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
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

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">image credit: A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 2
id: two-sided-conditioning-2
class: theorems interactive-slide
---

# Two-Sided Conditioning

Straight conditional paths with constant Gaussian smoothing $\sigma>0$:

$$
\bmu_t=t\bx_1+(1-t)\bx_0,\qquad p_t^\sigma(\bx|\bx_0,\bx_1)=\cN(\bmu_t,\sigma^2\bI).
$$

<div v-click="1">

$$
p_i^\sigma(\bx|\bx_0,\bx_1)=\cN(\bx_i,\sigma^2\bI)
\xrightarrow[\sigma\to0]{\text{weakly}}\delta(\bx-\bx_i),\qquad i\in\{0,1\}.
$$

For $\sigma>0$, the marginal endpoints are Gaussian-smoothed versions of $p_0$ and $p_1$.

</div>

<ConditioningDemo v-click="2" />

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A. et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023.</a></div>

---
clicks: 1
id: flow-matching-one-sided-vs-two-sided-conditioning
class: theorems interactive-slide
---

# Flow Matching: One-Sided vs. Two-Sided Conditioning

<div class="columns" style="gap:26px">
<div>

$$
\begin{aligned}
\bz&=\bx_1\\
p_t(\bx|\bx_1)&=\cN\left(t\bx_1,(1-t)^2\bI\right)\\
\bx_t&=t\bx_1+(1-t)\bx_0
\end{aligned}
$$

</div><div>

$$
\begin{aligned}
\bz&=(\bx_0,\bx_1)\\
p_t^\sigma(\bx|\bx_0,\bx_1)&=\cN\left(t\bx_1+(1-t)\bx_0,\sigma^2\bI\right)\\
\bx_t&=t\bx_1+(1-t)\bx_0+\sigma\bepsilon
\end{aligned}
$$

</div>
</div>

$\sigma>0$ is the smoothing scale; $\bepsilon\sim\cN(\bzero,\bI)$ is independent Gaussian noise.

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
clicks: 1
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

$$
\begin{aligned}
&\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\\
&=\bbE_{t\sim U[0,1]}\bbE_{(\bx_0,\bx_1)\sim p(\bx_0,\bx_1)}\left\|(\bx_1-\bx_0)-\bv_{\btheta}(\bx_t,t)\right\|^2
\end{aligned}
$$

</div>
<div v-click="1">

- With independent $\bx_0\sim\cN(\bzero,\bI)$, this recovers the one-sided training procedure.
- Now, we do not require that $p_0(\bx)$ is necessarily $\cN(0,\bI)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y. et al. Flow Matching for Generative Modeling, 2022.</a><br><a href="https://arxiv.org/abs/2302.00482">Tong A. et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023.</a></div>

---
clicks: 1
id: cfm-with-two-sided-conditioning-training-and-sampling
class: theorems
---

# CFM with Two-Sided Conditioning: Training and Sampling

- This conditioning allows us to transport any distribution $p_0(\bx)$ to any distribution $p_1(\bx)$.
- It's possible to apply this approach to paired tasks, e.g., style transfer.

<div class="block" v-click="1">

## Training

1. Sample $(\bx_0,\bx_1)\sim p(\bx_0,\bx_1)$, $t\sim U[0,1]$.
2. Compute noisy image $\bx_t=t\bx_1+(1-t)\bx_0$.
3. Compute loss $\cL=\left\|(\bx_1-\bx_0)-\bv_{\btheta}(\bx_t,t)\right\|^2$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: cfm-with-two-sided-conditioning-training-and-sampling-2
class: theorems
---

# CFM with Two-Sided Conditioning: Training and Sampling

<div class="block">

## Sampling

1. Sample $\bx_0\sim p_0(\bx)$.
2. Solve the ODE to obtain $\bx_1$:

$$
\bx_1=\bpsi_1(\bx_0)=\ODESolve_v(\bx_0,\btheta,t_0=0,t_1=1).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

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
clicks: 3
id: stable-diffusion-3-scalable-flow-matching
class: figure-slide
---

# Stable Diffusion 3: Scalable Flow Matching

<img src="/figs/sd3.png" alt="Stable Diffusion 3: scalable rectified flow transformers" class="figure-bottom" style="height:320px" />

<ul>
<li v-click="1"><strong>Objective:</strong> rectified flow with straight conditional paths and a velocity target.</li>
<li v-click="2"><strong>Training times:</strong> nonuniform sampling, including the logit-normal distribution.</li>
<li v-click="3"><strong>Architecture:</strong> MMDiT uses separate weights for text and image tokens, with joint attention between the two modalities.</li>
</ul>

<div class="source"><a href="https://arxiv.org/abs/2403.03206">Esser P., et al. Scaling Rectified Flow Transformers for High-Resolution Image Synthesis, 2024</a></div>

---
clicks: 0
id: outline-3
section: "Link between Flow Matching and Score-Based Models"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Two-Sided Conditioning</div></div>
<div class="outline-item current"><span>02</span><div>Link between Flow Matching and Score-Based Models</div></div>
<div class="outline-item "><span>03</span><div>Discrete Diffusion Models</div></div>
<div class="outline-item "><span>04</span><div>Forward Discrete Process</div></div>
<div class="outline-item "><span>05</span><div>Reverse Diffusion Process</div></div>
<div class="outline-item "><span>06</span><div>From Token To Sequence</div></div>

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
</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: score-based-generative-models-through-sdes-2
class: theorems
---

# Score-Based Generative Models through SDEs

Flow matching uses reverse time direction:

$$
p_t(\bx|\bx_1)=q_{1-t}(\bx|\bx_0=\bx_1)
$$

<div class="block">

## Tweedie's Formula

Recall Lecture 6, now with a scaled signal: for $\alpha_t>0$, $\sigma_t>0$,

$$
p_t(\bx_t|\bx_1)=\cN(\alpha_t\bx_1,\sigma_t^2\bI)
\quad\Rightarrow\quad
\bbE[\bx_1\mid\bx_t]=\frac{\bx_t+\sigma_t^2\nabla_{\bx_t}\log p_t(\bx_t)}{\alpha_t}.
$$

</div>

When the conditional velocity is affine in $\bx_1$, averaging over $\bx_1\mid\bx_t$ expresses the marginal velocity through the score.

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3325056/">Efron B. Tweedie's Formula and Selection Bias, 2011</a></div>

<!-- Here alpha_t is the Gaussian path's signal coefficient, e.g. t for the straight path below. The added identity uses the marginal p_t, whereas the path above is conditioned on x_1. The positivity conditions exclude singular endpoints; no Gaussian assumption on the data distribution is required. -->

---
clicks: 0
id: score-based-generative-models-through-sdes-3
class: theorems
---

# Score-Based Generative Models through SDEs

$$
p_t(\bx|\bx_1)=q_{1-t}(\bx|\bx_0=\bx_1)
$$

$$
\textbf{VE (NCSN): }p_t(\bx|\bx_1)=\cN\left(\bx_1,\sigma_{1-t}^2\cdot\bI\right)
$$

$$
\textbf{VP (DDPM): }p_t(\bx|\bx_1)=\cN\left(\alpha_{1-t}\bx_1,\left(1-\alpha_{1-t}^2\right)\cdot\bI\right)
$$

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 1
id: score-based-generative-models-through-sdes-4
class: theorems
---

# Score-Based Generative Models through SDEs

<div class="block">

## Flow Matching Probability Path

$$
p_t(\bx|\bx_1)=\cN\left(t\bx_1,(1-t)^2\bI\right);\quad\bv(\bx_t,\bx_1,t)=\frac{\bx_1-\bx_t}{1-t}
$$

$$
\frac{d\bx_t}{dt}=\bv(\bx_t,\bx_1,t)=\bmu_t'(\bx_1)+\frac{\bsigma_t'(\bx_1)}{\bsigma_t(\bx_1)}\odot(\bx_t-\bmu_t(\bx_1))
$$

</div>
<div v-click="1">

Let's derive the conditional vector fields for VE (NCSN) and VP (DDPM).

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 2
id: flow-matching-vs-score-based-sde-models
class: theorems
---

# Flow Matching vs Score-Based SDE Models

$$
\frac{d\bx_t}{dt}=\bv(\bx_t,\bx_1,t)=\bmu_t'(\bx_1)+\frac{\bsigma_t'(\bx_1)}{\bsigma_t(\bx_1)}\odot(\bx_t-\bmu_t(\bx_1))
$$

<div class="block" v-click="1">

## Variance Exploding SDE Probability Path

$$
p_t(\bx|\bx_1)=\cN\left(\bx_1,\sigma_{1-t}^2\bI\right)\quad\Rightarrow\quad\bv(\bx_t,\bx_1,t)=-\frac{\sigma'_{1-t}}{\sigma_{1-t}}(\bx_t-\bx_1)
$$

</div>
<div v-click="2">
<div class="block">

## Variance Preserving SDE Probability Path

$$
\begin{aligned}
p_t(\bx|\bx_1)&=\cN\left(\alpha_{1-t}\bx_1,(1-\alpha_{1-t}^2)\bI\right)\\
\Rightarrow\quad\bv(\bx_t,\bx_1,t)&=\frac{\alpha'_{1-t}}{1-\alpha_{1-t}^2}\cdot\left(\alpha_{1-t}\bx_t-\bx_1\right)
\end{aligned}
$$

</div>

Thus, VE/VP SDE models correspond to particular choices of the Gaussian probability path within the flow matching framework.

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
section: "Discrete Diffusion Models"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Two-Sided Conditioning</div></div>
<div class="outline-item "><span>02</span><div>Link between Flow Matching and Score-Based Models</div></div>
<div class="outline-item current"><span>03</span><div>Discrete Diffusion Models</div></div>
<div class="outline-item "><span>04</span><div>Forward Discrete Process</div></div>
<div class="outline-item "><span>05</span><div>Reverse Diffusion Process</div></div>
<div class="outline-item "><span>06</span><div>From Token To Sequence</div></div>

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

<div class="outline-item "><span>01</span><div>Two-Sided Conditioning</div></div>
<div class="outline-item "><span>02</span><div>Link between Flow Matching and Score-Based Models</div></div>
<div class="outline-item "><span>03</span><div>Discrete Diffusion Models</div></div>
<div class="outline-item current"><span>04</span><div>Forward Discrete Process</div></div>
<div class="outline-item "><span>05</span><div>Reverse Diffusion Process</div></div>
<div class="outline-item "><span>06</span><div>From Token To Sequence</div></div>

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

For discrete data, we instead define a Markov chain over categorical states:

$$
q(\bx_t|\bx_{t-1})=\Cat(\bQ_t\bx_{t-1}),
$$

</div>
<div v-click="2">

- Each $\bx_t\in\{0,1\}^K$ is a **one-hot vector** encoding the categorical state (it is just one token).
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
clicks: 3
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

**Uniform diffusion**

$$
\bQ_t=(1-\beta_t)\bI+\beta_t\bU,\qquad\bU_{ij}=\tfrac{1}{K}.
$$

Each token is replaced by a uniformly random symbol with probability $\beta_t$.
The stationary distribution is uniform noise.

</li>
<li v-click="3">

**Absorbing diffusion**

$$
\bQ_t=(1-\beta_t)\bI+\beta_t\,\be_m\bone^\top.
$$

Tokens are gradually replaced by a special mask $m$; the stationary distribution is fully masked.

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
| Interpretation | Random replacement | Gradual masking of tokens |
| Application | Image diffusion | Text diffusion $\approx$ Masked LM |

For absorbing diffusion, the limiting token distribution is $\Cat(\be_m)$.

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

<div class="outline-item "><span>01</span><div>Two-Sided Conditioning</div></div>
<div class="outline-item "><span>02</span><div>Link between Flow Matching and Score-Based Models</div></div>
<div class="outline-item "><span>03</span><div>Discrete Diffusion Models</div></div>
<div class="outline-item "><span>04</span><div>Forward Discrete Process</div></div>
<div class="outline-item current"><span>05</span><div>Reverse Diffusion Process</div></div>
<div class="outline-item "><span>06</span><div>From Token To Sequence</div></div>

</div>

---
clicks: 1
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
<div v-click="1">

- Conditioned reverse distribution $q(\bx_{t-1}|\bx_t,\bx_0)$ played crucial role in the continuous-state diffusion model.
- It shows the probability of a previous state given the noisy state $\bx_t$ and the original clean data $\bx_0$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
id: posterior-of-the-forward-process-2
class: theorems
---

# Posterior of the Forward Process

<div class="block">

## Discrete conditioned reverse distribution

$$
\begin{aligned}
q(\bx_{t-1}|\bx_t,\bx_0)
&=\frac{q(\bx_t|\bx_{t-1},\bx_0)\,q(\bx_{t-1}|\bx_0)}{q(\bx_t|\bx_0)}\\
&=\frac{\Cat(\bQ_t)\cdot\Cat(\bQ_{1:t-1})}{\Cat(\bQ_{1:t})}.
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 2
id: posterior-of-the-forward-process-3
class: theorems
---

# Posterior of the Forward Process

<div class="block">

## Discrete conditioned reverse distribution

$$
q(\bx_{t-1}|\bx_t,\bx_0)=\Cat\left(\frac{\bQ_t^\top\bx_t\odot\bQ_{1:t-1}\bx_0}{\bx_t^\top\bQ_{1:t}\bx_0}\right).
$$

</div>
<div v-click="1">

Recall the ELBO term

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\,\|\,\pt(\bx_{t-1}|\bx_t)\bigr),
$$

</div>
<div v-click="2">

- Both $q(\bx_{t-1}|\bx_t,\bx_0)$ and $q(\bx_t|\bx_0)$ are known analytically from the forward process.
- The reverse process $\pt(\bx_{t-1}|\bx_t)$ is a learned categorical distribution:

$$
\pt(\bx_{t-1}|\bx_t)=\Cat\bigl(\bpi_{\btheta}(\bx_t,t)\bigr),
$$

where $\bpi_{\btheta}$ is a neural network.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 3
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
\KL\bigl(\Cat(\bq)\,\|\,\Cat(\bp)\bigr)=\sum_{k=1}^Kq_k\log\frac{q_k}{p_k}=\Ent(\bq,\bp)-\Ent(\bq),
$$

<div v-click="2">

- $\Ent\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\bigr)$ is a constant w.r.t. $\btheta$.
- $\Ent(\bq,\bp)=-\sum_kq_k\log p_k$ is a **cross-entropy loss**.

</div>
</div>
<div v-click="3">

Therefore, minimizing $\cL_t$ w.r.t. $\btheta$ is equivalent to minimizing

$$
\bbE_{q(\bx_t|\bx_0)}\Ent\Bigl(q(\bx_{t-1}|\bx_t,\bx_0),\,\pt(\bx_{t-1}|\bx_t)\Bigr).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
id: outline-7
section: "From Token To Sequence"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Two-Sided Conditioning</div></div>
<div class="outline-item "><span>02</span><div>Link between Flow Matching and Score-Based Models</div></div>
<div class="outline-item "><span>03</span><div>Discrete Diffusion Models</div></div>
<div class="outline-item "><span>04</span><div>Forward Discrete Process</div></div>
<div class="outline-item "><span>05</span><div>Reverse Diffusion Process</div></div>
<div class="outline-item current"><span>06</span><div>From Token To Sequence</div></div>

</div>

---
clicks: 2
id: from-token-to-sequence
class: theorems
---

# From Token to Sequence

<div class="block">

## One-hot sequence representation

$$
\bx_t\in\{0,1\}^K\quad\Leftrightarrow\quad\bX_t\in\{0,1\}^{K\times m}
$$

Here $\bX_t$ is a one-hot representation of a sequence of tokens.

</div>
<div class="block" v-click="1">

## Independent Token-wise Forward Process

$$
q(\bX_t|\bX_{t-1})=\prod_{i=1}^m q(\bx_t^i|\bx_{t-1}^i)=\Cat(\bQ_t\bX_{t-1})
$$

- Each position $i$ evolves according to its own Markov chain.
- Often the same transition matrix $\bQ_t$ is shared across $i$.

</div>
<div class="block" v-click="2">

## Continuous Diffusion Analogy

- In Gaussian DDPMs with diagonal covariance, noise is independent per pixel.
- Structure is not in the noise; it is learned by the reverse model.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 3
id: from-token-to-sequence-2
class: theorems
---

# From Token to Sequence

$$
q(\bX_t|\bX_{t-1})=\prod_{i=1}^m q(\bx_t^i|\bx_{t-1}^i)=\Cat(\bQ_t\bX_{t-1})
$$

<div v-click="1">

$$
q(\bX_t|\bX_0)=\Cat(\bQ_{1:t}\bX_0)
$$

</div>
<div class="block" v-click="2">

## Conditioned Reverse Distribution

$$
q(\bx_{t-1}|\bx_t,\bx_0)=\Cat\left(\frac{\bQ_t^\top\bx_t\odot\bQ_{1:t-1}\bx_0}{\bx_t^\top\bQ_{1:t}\bx_0}\right).
$$

$$
q(\bX_{t-1}|\bX_t,\bX_0)=\prod_{i=1}^m q(\bx_{t-1}^i|\bx_t^i,\bx_0^i).
$$

</div>
<div v-click="3">

- All distributions defined by the forward process are factorized.
- Dependence appears in the learned reverse model.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 1
id: reverse-model-for-sequence
class: theorems
---

# Reverse Model for Sequence

$$
\pt(\bX_{t-1}|\bX_t)=\prod_{i=1}^m\pt(\bx_{t-1}^i|{\color{#8854c0}\bX_t}).
$$

- The output factorizes (parallel prediction across positions).
- Each factor conditions on the entire noisy sequence ${\color{#8854c0}\bX_t}$.
- This predicts tokens from a corrupted sequence; masking corruption connects it to **masked language modeling**.

<div class="block" v-click="1">

## Objective: $\cL_t$ term

$$
\begin{aligned}
&\KL\left(q(\bX_{t-1}|\bX_t,\bX_0)\,\|\,\pt(\bX_{t-1}|\bX_t)\right)\\
&=\sum_{i=1}^m\KL\left(q(\bx_{t-1}^i|\bx_t^i,\bx_0^i)\|\pt(\bx_{t-1}^i|\bX_t)\right).
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 2
id: reverse-model-for-sequence-2
class: theorems
---

# Reverse Model for Sequence

<div class="block">

## Simplified denoising objective

Predict clean tokens from the corrupted sequence (time conditioning is implicit):

$$
\cL=\sum_{t=1}^T\sum_{i=1}^m\bbE_{q(\bX_t|\bX_0)}\Big[-\log\pt(\bx_0^i|\bX_t)\Big].
$$

</div>

<div v-click="1">

This unweighted clean-token cross-entropy is a simplified training objective;
it is not the general discrete ELBO.

</div>
<div class="block" v-click="2">

## Connection to absorbing diffusion

With a reverse model that preserves visible tokens and uses the forward-posterior unmasking probability,
the ELBO yields a time-weighted loss over masked positions. We derive this next.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin et al. Structured denoising diffusion models, 2021.</a> <a href="https://arxiv.org/abs/2406.07524">Sahoo et al. Simple and effective masked diffusion language models, 2024.</a></div>

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

Diffusion and score-based models are special cases of the flow matching approach, but use curved trajectories.

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

<li>

For sequences, the forward process factorizes over tokens. Denoisers predict all positions from the whole corrupted sequence; clean-token cross-entropy is a simplified objective.

</li>

</ul>
