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
sourceFrame: "1"
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 12</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
class: theorems
---

# Recap of Previous Lecture

$$
\bbE_{t\sim U[0,1]}\bbE_{\bx\sim p_t(\bx)}\left\|\bv(\bx,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

<img src="/figs/multiple_dynamics.png" alt="Different dynamics connect the same endpoint distributions" style="width:100%;height:285px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 0
sourceFrame: "extension: 2"
class: theorems
---

# Recap of Previous Lecture

**Problem:** The true vector field $\bv(\bx,t)$ is **unknown**.

$$
p_t(\bx)=\int p_t(\bx|\bz)p(\bz)d\bz
$$

$$
\frac{\partial p_t(\bx|\bz)}{\partial t}=-\diver\left(\bv(\bx,\bz,t)p_t(\bx|\bz)\right).
$$

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Conditional Flow Matching (CFM)

$$
\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

If $\supp(p_t(\bx))=\bbR^m$, then the optimal value of the FM objective equals the optimal value of the CFM objective.

</div>

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 0
sourceFrame: "extension: 3"
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

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 0
sourceFrame: "4"
class: theorems
---

# Recap of Previous Lectures

<div class="block">

## Theorem

The following vector field generates the probability path $p_t(\bx)$:

$$
\bv(\bx,t)=\bbE_{p_t(\bz|\bx)}\bv(\bx,\bz,t)={\color{teal}\int\bv(\bx,\bz,t)}\frac{{\color{teal}p_t(\bx|\bz)p(\bz)}}{p_t(\bx)}{\color{teal}d\bz}
$$

</div>
<div class="block">

## Flow Matching (FM)

$$
\bbE_{t\sim U[0,1]}\bbE_{\bx\sim p_t(\bx)}\left\|\bv(\bx,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
sourceFrame: "extension: 4"
class: theorems
---

# Recap of Previous Lectures

<div class="block">

## Conditional Flow Matching (CFM)

$$
\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\rightarrow\min_{\btheta}
$$

</div>
<div class="block">

## Theorem

If $\supp(p_t(\bx))=\bbR^m$, then the optimal value of the FM objective equals the optimal value of the CFM objective.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
sourceFrame: "5"
class: theorems
---

# Recap of Previous Lecture

<img src="/figs/cfm_uncond_to_cond.png" alt="From an unconditional flow to conditional flows" style="width:100%;height:205px;object-fit:contain" />

<div class="block">

## Open Questions

- **Q1** How should we choose the convenient conditioning latent variable $\bz$?
- **Q2** How can we parametrize $p_t(\bx)$ (or $p_t(\bx|\bz)$) to enforce the following constraints?

$$
\bbE_{p(\bz)}p_0(\bx|\bz)=\cN(0,\bI);\quad\bbE_{p(\bz)}p_1(\bx|\bz)=\pd(\bx).
$$

</div>

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">image credit: A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 0
sourceFrame: "extension: 5"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Gaussian Conditional Probability Path

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
sourceFrame: "6"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Gaussian Conditional Probability Path

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
sourceFrame: "extension: 6"
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
sourceFrame: "7"
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
sourceFrame: "extension: 7"
class: figure-slide
---

# Recap of Previous Lecture

<img src="/figs/conical_paths.png" alt="Gaussian conditional paths contract toward the data endpoint" class="hero" />

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">image credit: A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 0
sourceFrame: "8"
class: theorems
---

# Recap of Previous Lecture

$$
p_t(\bx|\bx_1)=\cN\left(t\bx_1,(1-t)^2\bI\right);\quad{\color{teal}\bx_t=t\bx_1+(1-t)\bx_0}
$$

$$
\bv(\bx_t,\bx_1,t)=\frac{\bx_1-\bx_t}{1-t}=\bx_1-\bx_0
$$

$$
\begin{aligned}
&\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\\
&=\bbE_{t\sim U[0,1]}\bbE_{\bx_1\sim\pd(\bx)}\bbE_{\bx_0\sim\cN(0,\bI)}\left\|(\bx_1-\bx_0)-\bv_{\btheta}\left(t\bx_1+(1-t)\bx_0,t\right)\right\|^2
\end{aligned}
$$

<div class="source"><a href="https://mlg.eng.cam.ac.uk/blog/2024/01/20/flow-matching.html">image credit: https://mlg.eng.cam.ac.uk/blog/2024/01/20/flow-matching.html</a></div>

---
clicks: 0
sourceFrame: "extension: 8"
class: theorems
---

# Recap of Previous Lecture

- $\bv(\bx_t,\bx_1,t)$ defines straight lines between $\pd(\bx)$ and $\cN(0,\bI)$.
- The **marginal** path $p_t(\bx)$ does not give straight lines.

<div class="columns">
<img src="/figs/g2g-vector-field-samples-cond.png" alt="Straight conditional paths between Gaussian endpoints" style="width:100%;height:340px;object-fit:contain" />
<img src="/figs/g2g-forward_samples.png" alt="Curved marginal paths between Gaussian distributions" style="width:100%;height:340px;object-fit:contain" />
</div>

<div class="source"><a href="https://mlg.eng.cam.ac.uk/blog/2024/01/20/flow-matching.html">image credit: https://mlg.eng.cam.ac.uk/blog/2024/01/20/flow-matching.html</a></div>

---
clicks: 0
sourceFrame: "9"
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
clicks: 1
sourceFrame: "10"
class: theorems
---

# Recap of Previous Lecture

<img src="/figs/cond_marg_paths.png" alt="Conditional and marginal probability paths" style="width:100%;height:315px;object-fit:contain" />

<div v-click="1">

- One-sided conditioning gives us the way to construct a generative model.
- Now we extend it to image-to-image formulation (mapping between two distinct data distributions $p_0(\bx)$ and $p_1(\bx)$).

</div>

<div class="source"><a href="https://arxiv.org/abs/2506.02070">Holderrieth P. and Erives E., et al. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 0
sourceFrame: "11"
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
sourceFrame: "auto: Two-Sided Conditioning"
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
sourceFrame: "12"
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

Let us choose $\bz=(\bx_0,\bx_1)$. Then $p(\bz)=p(\bx_0,\bx_1)=p_0(\bx_0)p_1(\bx_1)$.

$$
p_t(\bx)=\int p_t(\bx|\bx_0,\bx_1)p_0(\bx_0)p_1(\bx_1)d\bx_0d\bx_1
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 1
sourceFrame: "extension: 12"
class: theorems
---

# Pair Conditioning

We must enforce boundary constraints:

<div class="math-chain" style="display:flex;align-items:center;justify-content:center;gap:12px;margin-top:40px">
<span>

$\displaystyle\begin{cases}p_0(\bx)=\bbE_{p(\bz)}p_0(\bx|\bz);\\p_1(\bx)=\bbE_{p(\bz)}p_1(\bx|\bz)\end{cases}$

</span>
<span v-click="1">

$\displaystyle\Rightarrow\quad\begin{cases}p_0(\bx|\bx_0,\bx_1)=\delta(\bx-\bx_0)\\p_1(\bx|\bx_0,\bx_1)=\delta(\bx-\bx_1)\end{cases}$

</span>
</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
sourceFrame: "13"
class: theorems
---

# Two-Sided Conditioning

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

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">image credit: A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 2
sourceFrame: "extension: 13"
class: theorems
---

# Two-Sided Conditioning

Let's consider straight conditional paths:

<div class="math-chain" style="display:flex;align-items:center;justify-content:center;gap:12px">
<span>

$\displaystyle\begin{cases}\bmu_t(\bx_0,\bx_1)=t\bx_1+(1-t)\bx_0\\\bsigma_t(\bx_0,\bx_1)=\epsilon\end{cases}$

</span>
<span v-click="1">

$\displaystyle\Rightarrow\quad\begin{cases}p_0(\bx|\bx_0,\bx_1)=\delta(\bx-\bx_0)\\p_1(\bx|\bx_0,\bx_1)=\delta(\bx-\bx_1)\end{cases}$

</span>
</div>

<img v-click="2" src="/figs/linear_paths.png" alt="Straight conditional paths for pair conditioning" style="width:100%;height:285px;object-fit:contain" />

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">image credit: A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 1
sourceFrame: "14"
class: theorems
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
p_t(\bx|\bx_0,\bx_1)&=\cN\left(t\bx_1+(1-t)\bx_0,\epsilon^2\bI\right)\\
\bx_t&=t\bx_1+(1-t)\bx_0
\end{aligned}
$$

</div>
</div>

<img v-click="1" src="/figs/compare_conditionings.png" alt="Comparing one-sided and two-sided conditional probability paths" style="width:100%;height:290px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A., et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023</a></div>

---
clicks: 1
sourceFrame: "15"
class: theorems
---

# Two-Sided Conditioning: Vector Field and Objective

$$
\begin{aligned}
p_t(\bx|\bx_0,\bx_1)&=\cN\left(t\bx_1+(1-t)\bx_0,\epsilon^2\bI\right);\\
{\color{teal}\bx_t}&={\color{teal}t\bx_1+(1-t)\bx_0}
\end{aligned}
$$

<div class="block">

## Conditional Vector Field

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

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 1
sourceFrame: "extension: 15"
class: theorems
---

# Two-Sided Conditioning: Vector Field and Objective

<div class="block">

## Conditional Flow Matching

$$
\begin{aligned}
&\bbE_{t\sim U[0,1]}\bbE_{\bz\sim p(\bz)}\bbE_{\bx\sim p_t(\bx|\bz)}\left\|\bv(\bx,\bz,t)-\bv_{\btheta}(\bx,t)\right\|^2\\
&=\bbE_{t\sim U[0,1]}\bbE_{(\bx_0,\bx_1)\sim p(\bx_0,\bx_1)}\bbE_{\bx\sim p_t(\bx|\bx_0,\bx_1)}\left\|(\bx_1-\bx_0)-\bv_{\btheta}(\bx,t)\right\|^2
\end{aligned}
$$

</div>
<div v-click="1">

- This yields the same procedure as for one-sided conditioning!
- Now, we do not require that $p_0(\bx)$ is necessarily $\cN(0,\bI)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 1
sourceFrame: "16"
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
sourceFrame: "extension: 16"
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
clicks: 0
sourceFrame: "17"
class: figure-slide
---

# Stable Diffusion 3: Scalable Flow Matching

<img src="/figs/sd3.png" alt="Stable Diffusion 3: scalable rectified flow transformers" class="hero" />

<div class="source"><a href="https://arxiv.org/abs/2403.03206">Esser P., et al. Scaling Rectified Flow Transformers for High-Resolution Image Synthesis, 2024</a></div>

---
clicks: 0
sourceFrame: "auto: Link between Flow Matching and Score-Based Models"
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
sourceFrame: "18"
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
sourceFrame: "extension: 18"
class: theorems
---

# Score-Based Generative Models through SDEs

Flow matching uses reverse time direction:

$$
p_t(\bx|\bx_1)=q_{1-t}(\bx|\bx_0=\bx_1)
$$

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
sourceFrame: "19"
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
sourceFrame: "extension: 19"
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
sourceFrame: "20"
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
sourceFrame: "21"
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
sourceFrame: "auto: Discrete Diffusion Models"
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
sourceFrame: "22"
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" discrete-diffusion />

---
clicks: 1
sourceFrame: "23"
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
clicks: 4
sourceFrame: "24"
class: theorems
---

# Why Discrete Diffusion Models?

While autoregressive (AR) models dominate discrete-data domains (e.g., text or sequences), they have fundamental limitations.

<div class="block" v-click="1">

## Key advantages of discrete diffusion

<ul>
<li><strong>Parallel generation:</strong> diffusion enables sampling all tokens simultaneously, unlike AR's strictly left-to-right process.</li>
<li v-click="2"><strong>Flexible infilling:</strong> diffusion can mask arbitrary parts of a sequence and reconstruct them, rather than generating only from prefix to suffix.</li>
<li v-click="3"><strong>Robustness:</strong> diffusion avoids the "exposure bias" caused by teacher forcing in AR training.</li>
<li v-click="4"><strong>Unified framework:</strong> diffusion generalizes naturally to discrete domains that do not suit continuous Gaussian noise.</li>
</ul>

</div>

<div class="source"><a href="https://aaronlou.com/blog/2024/discrete-diffusion/">https://aaronlou.com/blog/2024/discrete-diffusion/</a></div>

---
clicks: 0
sourceFrame: "25"
class: figure-slide
---

# 2025 – Big Bang of Discrete Diffusion Models

<img src="/figs/mercury.png" alt="Mercury: fast diffusion language models" class="hero" />

<div class="source"><a href="https://arxiv.org/abs/2506.17298">Khanna S. et al. Mercury: Ultra-fast language models based on diffusion, 2025.</a></div>

---
clicks: 0
sourceFrame: "auto: Forward Discrete Process"
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
sourceFrame: "26"
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
sourceFrame: "27"
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
sourceFrame: "28"
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
sourceFrame: "29"
class: theorems
---

# Transition Matrix

$$
q(\bx_t|\bx_0)=\Cat(\bQ_{1:t}\bx_0),\qquad\bQ_{1:t}=\bQ_t\bQ_{t-1}\cdots\bQ_1.
$$

<div class="block" v-click="1">

## Uniform Diffusion

$$
\bQ_t=(1-\beta_t)\bI+\beta_t\bU,\qquad\bU_{ij}=\tfrac{1}{K}.
$$

$$
\bQ_{1:t}=\bar\alpha_t\bI+(1-\bar\alpha_t)\bU,\quad\bar\alpha_t=\prod_{s=1}^t(1-\beta_s).
$$

<div v-click="2">

- Each token retains its original value with prob. $\bar\alpha_t$.
- It becomes uniformly random with prob. $(1-\bar\alpha_t)$.
- As $t\to T$, the process converges to the stationary uniform distribution.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 1
sourceFrame: "30"
class: theorems
---

# Transition Matrix

<div class="block">

## Absorbing Diffusion

$$
\bQ_t=(1-\beta_t)\bI+\beta_t\,\be_m\bone^\top,
$$

$$
\bQ_{1:t}=\bar\alpha_t\,\bI+(1-\bar\alpha_t)\,\be_m\bone^\top,\qquad\bar\alpha_t=\prod_{s=1}^t(1-\beta_s).
$$

<div v-click="1">

- Each token retains its original value with prob. $\bar\alpha_t$.
- It becomes $\be_m$ with prob. $(1-\bar\alpha_t)$.
- As $t\to T$, all tokens converge to the mask state: $q(\bx_T)\approx\Cat(\be_m)$.
- This makes the process analogous to **masked language modeling**.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 1
sourceFrame: "31"
class: theorems
---

# Uniform vs. Absorbing Transition Matrix

| Aspect | Uniform Diffusion | Absorbing Diffusion |
|---|---|---|
| $\bQ_t$ | $(1-\beta_t)\bI+\beta_t\bU$ | $(1-\beta_t)\bI+\beta_t\be_m\bone^\top$ |
| $\bQ_{1:t}$ | $\bar\alpha_t\bI+(1-\bar\alpha_t)\bU$ | $\bar\alpha_t\bI+(1-\bar\alpha_t)\be_m\bone^\top$ |
| $\bQ_{1:\infty}$ | $\bU$ | $\Cat(\be_m)$ |
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
sourceFrame: "auto: Reverse Diffusion Process"
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
sourceFrame: "32"
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
sourceFrame: "extension: 32"
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
sourceFrame: "33"
class: theorems
---

# Posterior of the Forward Process

<div class="block">

## Discrete conditioned reverse distribution

$$
q(\bx_{t-1}|\bx_t,\bx_0)=\Cat\left(\frac{\bQ_t\bx_t\odot\bQ_{1:t-1}\bx_0}{\bx_t^\top\bQ_{1:t}\bx_0}\right).
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
sourceFrame: "34"
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
sourceFrame: "auto: From Token To Sequence"
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
sourceFrame: "35"
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
sourceFrame: "36"
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
q(\bx_{t-1}|\bx_t,\bx_0)=\Cat\left(\frac{\bQ_t\bx_t\odot\bQ_{1:t-1}\bx_0}{\bx_t^\top\bQ_{1:t}\bx_0}\right).
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
sourceFrame: "37"
class: theorems
---

# Reverse Model for Sequence

$$
\pt(\bX_{t-1}|\bX_t)=\prod_{i=1}^m\pt(\bx_{t-1}^i|{\color{#8854c0}\bX_t}).
$$

- The output factorizes (parallel prediction across positions).
- Each factor conditions on the entire noisy sequence ${\color{#8854c0}\bX_t}$.
- This is exactly the **masked language modeling** pattern.

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
clicks: 0
sourceFrame: "extension: 37"
class: theorems
---

# Reverse Model for Sequence

<div class="block">

## Final objective: masked LM

$$
\cL=\sum_{t=1}^T\sum_{i=1}^m\bbE_{q(\bX_t|\bX_0)}\Big[-\log\pt(\bx_0^i|\bX_t)\Big].
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
sourceFrame: "38"
class: summary
---

# Summary

<ul>

<li>

Two-sided conditioning uses pair conditioning $\bz=(\bx_0,\bx_1)$ and yields the same procedure, but is more general (suitable for paired tasks).

</li>

<li>

Diffusion and score-based models are special cases of the flow matching approach, but use curved trajectories.

</li>

<li>

Diffusion approach has several key advantages over autoregressive approach.

</li>

<li>

Forward discrete diffusion process defines a Markov chain with discrete states; uniform and absorbing transitions make it tractable.

</li>

<li>

Reverse discrete diffusion process uses the variational approach to invert forward process; the discrete-state ELBO is a cross-entropy loss.

</li>

<li>

For sequences, the forward process factorizes over tokens, while the learned reverse model predicts all positions in parallel conditioning on the whole noisy sequence (masked LM pattern).

</li>

</ul>
