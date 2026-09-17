---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 13"
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

<div class="cover-lecture">Lecture 13</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
class: theorems
---

# Recap of Previous Lecture

Let us choose $\bz=(\bx_0,\bx_1)$. Then $p(\bz)=p(\bx_0,\bx_1)=p_0(\bx_0)p_1(\bx_1)$.

$$
\begin{aligned}
p_0(\bx|\bx_0,\bx_1)&=\delta(\bx-\bx_0),\\
p_1(\bx|\bx_0,\bx_1)&=\delta(\bx-\bx_1).
\end{aligned}
$$

<div class="block">

## Gaussian Conditional Probability Path

$$
\begin{aligned}
p_t(\bx|\bx_0,\bx_1)&=\cN\left(\bmu_t(\bx_0,\bx_1),\bsigma_t^2(\bx_0,\bx_1)\right),\\
\bx_t&=\bmu_t(\bx_0,\bx_1)+\bsigma_t(\bx_0,\bx_1)\odot\bepsilon.
\end{aligned}
$$

</div>

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">image credit: A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 0
sourceFrame: "extension: 2"
class: theorems
---

# Recap of Previous Lecture

Let's consider straight conditional paths:

$$
\bmu_t(\bx_0,\bx_1)=t\bx_1+(1-t)\bx_0,\qquad\bsigma_t(\bx_0,\bx_1)=\epsilon.
$$

<img src="/figs/linear_paths.png" alt="Straight conditional paths between paired endpoints" style="width:100%;height:360px;object-fit:contain" />

<div class="source"><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">image credit: A Visual Dive into Conditional Flow Matching</a></div>

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap of Previous Lecture

$$
\bbE_{\pd(\bx(0))}\bbE_{t\sim U[0,1]}\bbE_{q(\bx(t)|\bx(0))}
\bigl\|\bs_{\btheta}(\bx(t),t)-{\color{teal}\nabla_{\bx(t)}\log q(\bx(t)|\bx(0))}\bigr\|_2^2
$$

$$
p_t(\bx|\bx_1)=q_{1-t}(\bx|\bx_0=\bx_1)
$$

<div class="block">

## Variance Exploding SDE Probability Path

$$
\begin{aligned}
p_t(\bx|\bx_1)&=\cN\left(\bx_1,\sigma^2_{1-t}\bI\right)\\
\Rightarrow\quad\bv(\bx_t,\bx_1,t)&=-\frac{\sigma'_{1-t}}{\sigma_{1-t}}(\bx_t-\bx_1)
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
sourceFrame: "extension: 3"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Variance Preserving SDE Probability Path

$$
\begin{aligned}
p_t(\bx|\bx_1)&=\cN\left(\alpha_{1-t}\bx_1,(1-\alpha^2_{1-t})\bI\right)\\
\Rightarrow\quad\bv(\bx_t,\bx_1,t)&=\frac{\alpha'_{1-t}}{1-\alpha^2_{1-t}}\cdot\left(\alpha_{1-t}\bx_t-\bx_1\right)
\end{aligned}
$$

</div>

<img src="/figs/trajectories.png" alt="Variance exploding, variance preserving and optimal transport trajectories" style="width:100%;height:290px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
sourceFrame: "4"
class: theorems
---

# Recap of Previous Lecture

<div class="columns">
<div class="block">

## Continuous state space

- **Discrete time** $t\in\{0,1,\ldots,T\}$ $\Rightarrow$ **DDPM / NCSN**.
- **Continuous time** $t\in[0,1]$ $\Rightarrow$ **Score-based SDE models**.

</div>
<div class="block">

## Discrete state space

- **Discrete time** $t\in\{0,1,\ldots,T\}$.
- **Continuous time** $t\in[0,1]$.

</div>
</div>
<div class="block">

## Key advantages of discrete diffusion

- Parallel generation
- Flexible infilling
- Robustness
- Unified framework

</div>

<div class="source"><a href="https://aaronlou.com/blog/2024/discrete-diffusion/">https://aaronlou.com/blog/2024/discrete-diffusion/</a></div>

---
clicks: 0
sourceFrame: "5"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Discrete Diffusion Markov Chain

$$
q(\bx_t|\bx_{t-1})=\Cat(\bQ_t\bx_{t-1}),
$$

Each $\bx_t\in\{0,1\}^K$ is a **one-hot vector** encoding the categorical state (it is just one token).

</div>
<div class="block">

## Transition Matrix

$$
[\bQ_t]_{ij}=q(x_t=i| x_{t-1}=j),\qquad\sum_{i=1}^K[\bQ_t]_{ij}=1.
$$

$$
q(\bx_t|\bx_0)=\Cat(\bQ_{1:t}\bx_0),\qquad\bQ_{1:t}=\bQ_t\bQ_{t-1}\cdots\bQ_1.
$$

</div>

- The choice of $\bQ_t$ determines how information is erased and what the stationary distribution becomes.
- $\bQ_t$ and $\bQ_{1:t}$ should be easy to compute for each $t$.

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
sourceFrame: "6"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Uniform vs. Absorbing Transition Matrix

| Aspect | Uniform Diffusion | Absorbing Diffusion |
|---|---|---|
| $\bQ_t$ | $(1-\beta_t)\bI+\beta_t\bU$ | $(1-\beta_t)\bI+\beta_t\be_m\bone^\top$ |
| $\bQ_{1:t}$ | $\bar\alpha_t\bI+(1-\bar\alpha_t)\bU$ | $\bar\alpha_t\bI+(1-\bar\alpha_t)\be_m\bone^\top$ |
| $\bQ_{1:\infty}$ | $\bU$ | $\Cat(\be_m)$ |
| Interpretation | Random replacement | Gradual masking of tokens |
| Application | Image diffusion | Text diffusion $\approx$ Masked LM |

</div>
<div class="block">

## Observation

Both schemes gradually destroy information, but differ in their stationary limit. Absorbing diffusion bridges diffusion and masked-language-model objectives.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
sourceFrame: "7"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Discrete conditioned reverse distribution

$$
q(\bx_{t-1}|\bx_t,\bx_0)=\Cat\left(\frac{\bQ_t\bx_t\odot\bQ_{1:t-1}\bx_0}{\bx_t^\top\bQ_{1:t}\bx_0}\right).
$$

</div>
<div class="block">

## ELBO term

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\,\|\,\pt(\bx_{t-1}|\bx_t)\bigr).
$$

</div>

- The reverse process $\pt(\bx_{t-1}|\bx_t)=\Cat\bigl(\bpi_{\btheta}(\bx_t,t)\bigr)$ is a learned categorical distribution.
- Minimizing $\cL_t$ w.r.t. $\btheta$ is equivalent to minimizing the cross-entropy

$$
\bbE_{q(\bx_t|\bx_0)}\Ent\Bigl(q(\bx_{t-1}|\bx_t,\bx_0),\,\pt(\bx_{t-1}|\bx_t)\Bigr).
$$

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
sourceFrame: "8"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Independent Token-wise Forward Process

$$
q(\bX_t|\bX_{t-1})=\prod_{i=1}^m q(\bx_t^i|\bx_{t-1}^i)=\Cat(\bQ_t\bX_{t-1})
$$

</div>

$$
\pt(\bX_{t-1}|\bX_t)=\prod_{i=1}^m\pt(\bx_{t-1}^i|{\color{#8854c0}\bX_t}).
$$

- All distributions defined by the forward process are factorized.
- Each factor conditions on the entire noisy sequence ${\color{#8854c0}\bX_t}$ — this is exactly the **masked language modeling** pattern.

<div class="block">

## Final objective: masked LM

$$
\cL=\sum_{t=1}^T\sum_{i=1}^m\bbE_{q(\bX_t|\bX_0)}\Big[-\log\pt(\bx_0^i|\bX_t)\Big].
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
sourceFrame: "9"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Discrete Diffusion<div class="outline-sub">Absorbing Diffusion<br>Continuous Time Formulation</div></div></div>
<div class="outline-item"><span>02</span><div>Course Overview</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Discrete Diffusion"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Discrete Diffusion<div class="outline-sub">Absorbing Diffusion<br>Continuous Time Formulation</div></div></div>
<div class="outline-item"><span>02</span><div>Course Overview</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Absorbing Diffusion"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Discrete Diffusion<div class="outline-sub"><strong>Absorbing Diffusion</strong><br>Continuous Time Formulation</div></div></div>
<div class="outline-item"><span>02</span><div>Course Overview</div></div>

</div>

---
clicks: 0
sourceFrame: "10"
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" absorbing-diffusion />

---
clicks: 3
sourceFrame: "11"
class: theorems
---

# Absorbing Diffusion: Forward Process

Let's restrict to the case of absorbing transition matrix.

$$
\begin{aligned}
\bQ_t&=(1-\beta_t)\bI+\beta_t\be_m\bone^\top,\qquad\bar\alpha_t=\prod_{s=1}^t(1-\beta_s),\\
\bQ_{1:t}&=\bar\alpha_t\bI+(1-\bar\alpha_t)\be_m\bone^\top.
\end{aligned}
$$

<div v-click="1">

Each position is either still clean or already masked:

$$
q(\bx_t|\bx_0)=\bar\alpha_t[\bx_t=\bx_0]+(1-\bar\alpha_t)[\bx_t=\be_m]
$$

</div>
<div v-click="2">

$$
\bQ_t=\begin{pmatrix}
1-\beta_t&0&{\color{#8854c0}0}\\
0&1-\beta_t&{\color{#8854c0}0}\\
\beta_t&\beta_t&{\color{#8854c0}1}
\end{pmatrix}
\quad\Rightarrow\quad\text{the masked state is absorbing.}
$$

</div>
<div v-click="3">

What happens in the conditioned reverse process $q(\bx_{t-1}|\bx_t,\bx_0)$?

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 1
sourceFrame: "12"
class: theorems
---

# Absorbing Diffusion

<div class="block">

## Conditioned reverse distribution

$$
q(\bx_{t-1}|\bx_t,\bx_0)=
\begin{cases}
[\bx_{t-1}=\bx_t],&\text{if }\bx_t\ne\be_m,\\
\rho_t[\bx_{t-1}=\bx_0]+(1-\rho_t)[\bx_{t-1}=\be_m],&\text{if }\bx_t=\be_m,
\end{cases}
$$

where

$$
\rho_t=\frac{\beta_t\bar\alpha_{t-1}}{1-\bar\alpha_t}.
$$

</div>
<div v-click="1">

- If $\bx_t\ne\be_m$, then the token must be unchanged: $\bx_{t-1}=\bx_t$.
- Observing an unmasked token at time $t$ fixes the entire history: $\bx_{t-1}=\bx_t=\cdots=\bx_0$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 0
sourceFrame: "extension: 12"
class: theorems
---

# Absorbing Diffusion

- If $\bx_t=\be_m$, the previous token may be either clean or masked.
- With probability $\rho_t$, masking occurred exactly at step $t$ (so $\bx_{t-1}=\bx_0$).
- With probability $(1-\rho_t)$, the token was already masked earlier (so $\bx_{t-1}=\be_m$).

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 1
sourceFrame: "13"
class: theorems
---

# Absorbing Diffusion

<div class="block">

## Sequence Distribution

$$
q(\bX_{t-1}|\bX_t,\bX_0)=\prod_{i=1}^m q(\bx_{t-1}^i|\bx_t^i,\bx_0^i).
$$

</div>

Each position $i$ has two possible cases:

$$
\bx_t^i\ne\be_m\;\Rightarrow\;\bx_{t-1}^i=\bx_t^i,\qquad
\bx_t^i=\be_m\;\Rightarrow\;\bx_{t-1}^i\in\{\bx_0^i,\be_m\}.
$$

<div class="block" v-click="1">

## Interpretation

- The forward process produces **random partial observations** of the clean sequence.
- If a token is visible at time $t$, the reverse distribution is deterministic.
- Unmasked tokens yield a deterministic posterior and therefore contribute only a constant to the ELBO. Therefore, only masked tokens contribute to the training loss.

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 2
sourceFrame: "14"
class: theorems
---

# Absorbing Diffusion

<img src="/figs/abs_diff.png" alt="Absorbing diffusion masks tokens in the forward process and predicts tokens in the reverse process" style="width:100%;height:240px;object-fit:contain" />

<div v-click="1">

$$
\pt(\bX_{t-1}|\bX_t)=\prod_{i=1}^m\pt(\bx_{t-1}^i|\bX_t).
$$

</div>
<div class="block" v-click="2">

## Objective: sequence-level $\cL_t$

$$
\cL_t=\bbE_{q(\bX_t|\bX_0)}\sum_{i=1}^m\rho_t[\bx_t^i=\be_m]\left[-\log\pt(\bx_0^i|\bX_t)\right]+\text{const}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 0
sourceFrame: "15"
class: theorems
---

# Algorithm: Discrete-Time Absorbing Diffusion

<div class="block">

## Training

<ol>

<li>

Sample $\bX_0\sim\pd(\bX)$, $t\sim U\{1,\ldots,T\}$.

</li>

<li>

Sample the corrupted sequence by independent masking:

$$
\bx_t^i=\begin{cases}
\be_m,&\text{with prob. }1-\bar\alpha_t,\\
\bx_0^i,&\text{with prob. }\bar\alpha_t,
\end{cases}\qquad i=1,\dots,m.
$$

</li>

<li>

Predict token distributions in parallel:

$$
\pt(\bX_0|\bX_t)=\prod_{i=1}^m\pt(\bx_0^i|\bX_t).
$$

</li>

<li>

Compute masked-CE loss:

$$
\cL=\rho_t\sum_{i=1}^m[\bx_t^i=\be_m]\,\big[-\log\pt(\bx_0^i|\bX_t)\big].
$$

</li>

</ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 0
sourceFrame: "16"
class: theorems
---

# Algorithm: Discrete-Time Absorbing Diffusion

<div class="block">

## Sampling

<ol>

<li>

Initialize $\bX_T\leftarrow\be_m\bone^\top$ (fully masked).

</li>

<li>

Iterate for $t=T,T-1,\ldots,1$:

<ol>

<li>

Predict $\pt(\bx_0^i|\bX_t)$ for all positions.

</li>

<li>

For each masked position ($\bx_t^i=\be_m$):

$$
\bx_{t-1}^i=\begin{cases}
\hat{\bx}_0^i\sim\pt(\bx_0^i|\bX_t),&\text{with prob. }\rho_t,\\
\be_m,&\text{with prob. }1-\rho_t.
\end{cases}
$$

</li>

<li>

For each unmasked position: $\bx_{t-1}^i=\bx_t^i$.

</li>

</ol>

</li>

<li>

Return the final sequence $\bX_0$ (fully unmasked).

</li>

</ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 0
sourceFrame: "auto: Continuous Time Formulation"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Discrete Diffusion<div class="outline-sub">Absorbing Diffusion<br><strong>Continuous Time Formulation</strong></div></div></div>
<div class="outline-item"><span>02</span><div>Course Overview</div></div>

</div>

---
clicks: 3
sourceFrame: "17"
class: theorems
---

# From Discrete Time to Mask Rate

In absorbing diffusion, the forward process is

$$
q(\bx_t|\bx_0)=\bar\alpha_t[\bx_t=\bx_0]+(1-\bar\alpha_t)[\bx_t=\be_m].
$$

<div v-click="1">

- The distribution depends on $t$ only through the scalar

$$
\lambda_t=1-\bar\alpha_t\in[0,1].
$$

</div>
<div v-click="2">

- We can therefore reparameterize the corruption level by

$$
t\quad\Rightarrow\quad\lambda\in[0,1].
$$

</div>
<div v-click="3">

- We directly define a family of corrupted distributions indexed by a continuous mask rate $\lambda$:

$$
q(\bx_\lambda|\bx_0)=(1-\lambda)[\bx_\lambda=\bx_0]+\lambda[\bx_\lambda=\be_m].
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 2
sourceFrame: "18"
class: theorems
---

# Discrete ELBO Revisited

Recall the per-step ELBO term for absorbing diffusion:

$$
\cL_t=\bbE_{q(\bX_t|\bX_0)}\sum_{i=1}^m{\color{#8854c0}\rho_t}[\bx_t^i=\be_m]\left[-\log\pt(\bx_0^i|\bX_t)\right]+\text{const}.
$$

<div v-click="1">

Replacing the discrete index $t$ with the continuous mask rate $\lambda$, the training objective becomes

$$
\cL=\int_0^1{\color{#8854c0}w(\lambda)}\bbE_{q_\lambda(\bX_\lambda|\bX_0)}\sum_{i=1}^m[\bx_\lambda^i=\be_m]\left[-\log\pt(\bx_0^i|\bX_\lambda)\right]d\lambda.
$$

</div>
<div class="block" v-click="2">

## Interpretation

Training corresponds to optimizing a **continuous mixture of masked language modeling objectives** with different mask rates.

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 0
sourceFrame: "19"
class: theorems
---

# Algorithm: Masked Diffusion Language Model (MDLM)

<div class="block">

## Training

<ol>

<li>

Sample $\bX_0\sim\pd(\bX)$, ${\color{#8854c0}\lambda\sim U[0,1]}$.

</li>

<li>

Sample the corrupted sequence by independent masking:

$$
\bx_{{\color{#8854c0}\lambda}}^i=\begin{cases}
\be_m,&\text{with prob. }{\color{#8854c0}\lambda},\\
\bx_0^i,&\text{with prob. }{\color{#8854c0}1-\lambda},
\end{cases}\qquad i=1,\dots,m.
$$

</li>

<li>

Predict token distributions in parallel:

$$
\pt(\bX_0|\bX_{{\color{#8854c0}\lambda}})=\prod_{i=1}^m\pt(\bx_0^i|\bX_{{\color{#8854c0}\lambda}}).
$$

</li>

<li>

Compute masked-CE loss:

$$
\cL={\color{#8854c0}w(\lambda)}\sum_{i=1}^m[\bx_{{\color{#8854c0}\lambda}}^i=\be_m]\,\big[-\log\pt(\bx_0^i|\bX_{{\color{#8854c0}\lambda}})\big].
$$

</li>

</ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 0
sourceFrame: "20"
class: theorems
---

# Algorithm: Masked Diffusion Language Model (MDLM)

<div class="block">

## Sampling

<ol>

<li>

Initialize $\bX_{{\color{#8854c0}\lambda_1}}\leftarrow\be_m\bone^\top$ (fully masked).

</li>

<li>

Iterate for $\ell=1,\ldots,L-1$ over a decreasing schedule ${\color{#8854c0}1=\lambda_1>\lambda_2>\cdots>\lambda_L=0}$:

<ol>

<li>

Predict $\pt(\bx_0^i|\bX_{{\color{#8854c0}\lambda_\ell}})$ for all positions.

</li>

<li>

For each masked position ($\bx_{{\color{#8854c0}\lambda_\ell}}^i=\be_m$):

$$
\bx_{{\color{#8854c0}\lambda_{\ell+1}}}^i=\begin{cases}
\hat{\bx}_0^i\sim\pt(\bx_0^i|\bX_{{\color{#8854c0}\lambda_\ell}}),&\text{with prob. }{\color{#8854c0}1-\tfrac{\lambda_{\ell+1}}{\lambda_\ell}},\\
\be_m,&\text{with prob. }{\color{#8854c0}\tfrac{\lambda_{\ell+1}}{\lambda_\ell}}.
\end{cases}
$$

</li>

<li>

For each unmasked position: $\bx_{{\color{#8854c0}\lambda_{\ell+1}}}^i=\bx_{{\color{#8854c0}\lambda_\ell}}^i$.

</li>

</ol>

</li>

<li>

Return the final sequence $\bX_{{\color{#8854c0}\lambda_L}}$ (fully unmasked).

</li>

</ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 0
sourceFrame: "extension: 20"
class: theorems
---

# Algorithm: Masked Diffusion Language Model (MDLM)

**Note:** Once unmasked, a token stays unmasked. So for a currently masked token:

$$
\bbP(\bx_{\lambda_{\ell+1}}^i=\be_m\mid\bx_{\lambda_\ell}^i=\be_m)=\frac{\lambda_{\ell+1}}{\lambda_\ell}.
$$

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 0
sourceFrame: "auto: Course Overview"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Discrete Diffusion<div class="outline-sub">Absorbing Diffusion<br>Continuous Time Formulation</div></div></div>
<div class="outline-item current"><span>02</span><div>Course Overview</div></div>

</div>

---
clicks: 0
sourceFrame: "21"
class: theorems
---

# Course Overview: Problem Statement

<div class="block">

## Goal

Learn a generative model $\pt(\bx)$ that matches the data distribution $\pd(\bx)$.

</div>
<div class="block">

## Three lenses on the same problem

- **Divergence minimization** (L1, L5):

$$
\min_{\btheta}D\left(\pd\,\|\,\pt\right)\qquad(\text{KL, JS, Wasserstein, }\dots)
$$

- **Likelihood-based** (L1–L4, L7–L8): maximize $\log\pt(\bx)$<br>(AR, NF, VAE, diffusion as hierarchical VAE).
- **Score-based** (L6–L10): learn $\nabla_{\bx}\log p(\bx)$<br>(SM / NCSN, DDPM, score-based SDE).

</div>

---
clicks: 0
sourceFrame: "22"
---

# Course Roadmap

<TaxonomyDiagram class="taxonomy" />

---
clicks: 0
sourceFrame: "23"
class: theorems
---

# Likelihood-based: Exact & Approximate Density (L1–L4)

<div class="block">

## Autoregressive (L1)

$$
\pt(\bx)=\prod_{i=1}^m\pt(x_j|\bx_{1:j-1})\qquad\text{exact likelihood, sequential sampling}
$$

</div>
<div class="block">

## Normalizing Flows (L2)

$$
\bx=\bff_{\btheta}(\bz),\qquad\log\pt(\bx)=\log p(\bz)+\log\!\left|\det\frac{\partial\bz}{\partial\bx}\right|
$$

</div>
<div class="block">

## VAE / VQ-VAE (L3–L4)

$$
\log\pt(\bx)\ge\bbE_{q_{\bphi}(\bz|\bx)}\log\pt(\bx|\bz)-\KL\bigl(q_{\bphi}(\bz|\bx)\,\|\,p(\bz)\bigr)
$$

- Amortized inference + reparametrization trick.
- ELBO surgery $\Rightarrow$ optimal prior; VQ-VAE with discrete latents.

</div>

---
clicks: 0
sourceFrame: "24"
class: theorems
---

# Implicit & Score-based Foundations (L5–L6)

<div class="block">

## GAN / WGAN (L5)

- Implicit $\pt$, adversarial min-max

$$
\min_{\btheta}\max_{\bphi}\;\bbE_{\pd}\log D_{\bphi}(\bx)+\bbE_{p(\bz)}\log\bigl(1-D_{\bphi}(G_{\btheta}(\bz))\bigr)
$$

- Optimal discriminator $\Rightarrow$ JSD; WGAN uses Wasserstein distance via Kantorovich–Rubinstein duality.
- Evaluation tools: FID, Precision/Recall, CLIP score, human eval.

</div>
<div class="block">

## Score Matching / NCSN (L6)

- Learn $\bs_{\btheta}(\bx)\approx\nabla_{\bx}\log\pd(\bx)$ via denoising SM.
- Sample with (annealed) Langevin dynamics over multiple noise scales.

</div>

---
clicks: 0
sourceFrame: "25"
class: theorems
---

# Diffusion Models (L7–L8)

<div class="block">

## Gaussian diffusion (L7)

- Forward $q(\bx_t|\bx_{t-1})$, direct sampling $q(\bx_t|\bx_0)=\cN(\sqrt{\bar\alpha_t}\bx_0,(1-\bar\alpha_t)\bI)$.
- Diffusion as hierarchical VAE; ELBO splits into reconstruction $+$ prior KL $+$ $\sum_t\cL_t$.

</div>
<div class="block">

## DDPM (L8)

$$
\cL_{\text{simple}}=\bbE_{t,\bx_0,\bepsilon}\,\bigl\|\bepsilon-\bepsilon_{\btheta}(\bx_t,t)\bigr\|^2,\qquad\bepsilon_{\btheta}\propto-\sigma_t\bs_{\btheta}
$$

- Equivalent to score-based generative modeling (NCSN-style).

</div>
<div class="block">

## Guidance (L8)

$$
\hat{\bepsilon}_{\btheta}(\bx_t,t,\by)=(1-\gamma)\,\bepsilon_{\btheta}(\bx_t,t,\varnothing)+\gamma\,\bepsilon_{\btheta}(\bx_t,t,\by)
$$

</div>

---
clicks: 0
sourceFrame: "26"
class: theorems
---

# Continuous Dynamics & SDE (L9–L10)

<div class="block">

## Neural ODE / continuous-time NF (L9)

$$
\frac{d\bx(t)}{dt}=\bv_{\btheta}(\bx(t),t),\qquad\frac{d}{dt}\log p_t(\bx(t))=-\tr\!\left(\frac{\partial\bv_{\btheta}}{\partial\bx}\right)
$$

</div>
<div class="block">

## Forward SDE (L9–L10)

$$
d\bx=\bff(\bx,t)\,dt+g(t)\,d\bw
$$

- KFP equation; VE / VP SDEs unify NCSN and DDPM.

</div>
<div class="block">

## Reverse SDE & Probability flow ODE (L10)

$$
d\bx=\bigl[\bff(\bx,t)-g^2(t)\,\bs_{\btheta}(\bx,t)\bigr]dt+g(t)\,d\bar{\bw}
$$

$$
\frac{d\bx}{dt}=\bff(\bx,t)-\tfrac12g^2(t)\,\bs_{\btheta}(\bx,t)\quad(\text{deterministic equivalent})
$$

</div>

---
clicks: 0
sourceFrame: "27"
class: theorems
---

# Flow Matching (L10–L11)

<div class="block">

## Flow Matching objective (L10)

$$
\cL_{\text{FM}}=\bbE_{t,p_t(\bx)}\,\bigl\|\bv_{\btheta}(\bx,t)-\bv(\bx,t)\bigr\|^2
$$

Target $\bv(\bx,t)$ is the marginal vector field — intractable in general.

</div>
<div class="block">

## Conditional Flow Matching (L11)

$$
\cL_{\text{CFM}}=\bbE_{t,p(\bz),p_t(\bx|\bz)}\,\bigl\|\bv_{\btheta}(\bx,t)-\bv(\bx,\bz,t)\bigr\|^2
$$

- $\nabla_{\btheta}\cL_{\text{FM}}=\nabla_{\btheta}\cL_{\text{CFM}}$ — regress against *conditional* field.
- Conditioning on endpoint $\bz=\bx_1$ (one-sided) or pair $(\bx_0,\bx_1)$ (two-sided).
- Straight Gaussian paths $\Rightarrow$ closed-form $\bv(\bx,\bz,t)=\bx_1-\bx_0$.

</div>

---
clicks: 0
sourceFrame: "28"
class: theorems
---

# Discrete Diffusion (L12–L13)

<div class="block">

## Forward discrete process (L12)

Categorical $\bx_t$ with transition matrices $\bQ_t$:

- **Uniform**: $\bQ_t=(1-\beta_t)\bI+\beta_t\bU$
- **Absorbing**: $\bQ_t=(1-\beta_t)\bI+\beta_t\be_m\bone^\top$ (mask token)

</div>
<div class="block">

## Reverse process & Discrete ELBO (L12)

$$
q(\bx_{t-1}|\bx_t,\bx_0)=\Cat\!\left(\frac{\bQ_t\bx_t\odot\bQ_{1:t-1}\bx_0}{\bx_t^\top\bQ_{1:t}\bx_0}\right),
$$

each $\cL_t$ reduces to a **cross-entropy** loss against $\pt(\bx_{t-1}|\bx_t)$.

</div>

---
clicks: 0
sourceFrame: "29"
class: figure-slide
---

# Generative Learning Trilemma

<img class="hero" src="/figs/trilemma.png" alt="The generative learning trilemma between fast sampling, high-quality samples and mode coverage" />

<div class="source"><a href="https://arxiv.org/abs/2112.07804">Xiao Z., Kreis K., Vahdat A. Tackling the generative learning trilemma with denoising diffusion GANs, 2021</a></div>

---
clicks: 0
sourceFrame: "extension: 29"
class: theorems
---

# Generative Learning Trilemma

<div class="block">

## Rule of thumb

<div class="columns">
<div>

- **Likelihood + Coverage** $\Rightarrow$ **AR / NF**<br>exact density, *slow sampling*.
- **Likelihood + Fast Sampling** $\Rightarrow$ **VAE**<br>tractable bound, *blurry samples*.
- **Quality + Fast Sampling** $\Rightarrow$ **GAN**<br>sharp, *mode collapse, no likelihood*.

</div>
<div>

- **Quality + Coverage** $\Rightarrow$ **Diffusion**<br>stable training, *slow sampling*.
- **Quality + Faster Sampling** $\Rightarrow$ **FM / ODE**<br>fewer steps, *approx. likelihood*.
- **Discrete + Coverage** $\Rightarrow$ **Discrete diffusion**<br>parallel denoising, *iterative decoding*.

</div>
</div>

</div>

<div class="source"><a href="https://arxiv.org/abs/2112.07804">Xiao Z., Kreis K., Vahdat A. Tackling the generative learning trilemma with denoising diffusion GANs, 2021</a></div>

---
clicks: 0
sourceFrame: "30"
class: summary
---

# Summary

- In the absorbing case only masked tokens contribute to the ELBO, which reduces to a continuous mixture of MLM losses over the mask rate $\lambda\in[0,1]$.
- MDLM sampling performs iterative parallel refinement from fully masked to fully unmasked sequences.
- No generative model dominates all axes of the trilemma — each family trades off likelihood, sample quality, mode coverage and sampling speed.
- Modern frontier (flow matching, discrete diffusion, distilled diffusion) tries to push the Pareto frontier of this trilemma.
