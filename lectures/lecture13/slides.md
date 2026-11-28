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
id: deep-generative-models
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 13</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
id: recap-of-previous-lecture
class: theorems
---

# Recap of Previous Lecture

Let us choose $\bz=(\bx_0,\bx_1)$. Start with independent endpoints: $p(\bz)=p_0(\bx_0)p_1(\bx_1)$.

A **coupling** $p(\bx_0,\bx_1)$ pairs endpoints while keeping marginals $p_0$ and $p_1$.
Two-sided conditioning supports independent pairs, paired data and minibatch OT couplings.

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

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A. et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023.</a><br><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">A Visual Dive into Conditional Flow Matching.</a></div>

---
clicks: 0
id: recap-of-previous-lecture-2
class: theorems
---

# Recap of Previous Lecture

Straight conditional paths with constant Gaussian smoothing $\sigma>0$:

$$
\bmu_t=t\bx_1+(1-t)\bx_0,\qquad p_t^\sigma(\bx|\bx_0,\bx_1)=\cN(\bmu_t,\sigma^2\bI).
$$

Hold the sampled $\bepsilon\sim\cN(\bzero,\bI)$ fixed along the path.

$$
\bx_t=\bmu_t+\sigma\bepsilon,\qquad \bepsilon\sim\cN(\bzero,\bI).
\qquad \bv(\bx_t,\bx_0,\bx_1,t)=\bx_1-\bx_0
$$

$$
p_i^\sigma(\bx|\bx_0,\bx_1)=\cN(\bx_i,\sigma^2\bI)
\xrightarrow[\sigma\to0]{\text{weakly}}\delta(\bx-\bx_i),\qquad i\in\{0,1\}.
$$

The resulting target also applies in the deterministic limit.

<img src="/figs/linear_paths.png" alt="Straight conditional paths between paired endpoints" style="width:100%;height:230px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/2302.00482">Tong A. et al. Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport, 2023.</a><br><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">Image: A Visual Dive into Conditional Flow Matching.</a></div>

---
clicks: 0
id: recap-of-previous-lecture-3
class: theorems
---

# Recap of Previous Lecture

## Training Objective

$$
\bbE_{\pd(\bx(0))}\bbE_{t\sim U[0,1]}\bbE_{q(\bx(t)|\bx(0))}
\bigl\|\bs_{\btheta}(\bx(t),t)-{\color{teal}\nabla_{\bx(t)}\log q(\bx(t)|\bx(0))}\bigr\|_2^2
$$

Flow matching runs from noise to the same data point $\bx_1$, so its time $t$ corresponds to diffusion time $1-t$.

$$
p_t(\bx|\bx_1)=q_{1-t}(\bx|\bx_0=\bx_1)
$$

<div class="columns mt-4 mb-6 text-center">
<section>

## VE (NCSN)

$$
p_t(\bx|\bx_1)=\cN\left(\bx_1,\sigma_{1-t}^2\bI\right)
$$

</section>
<section>

## VP (DDPM)

$$
p_t(\bx|\bx_1)=\cN\left(\alpha_{1-t}\bx_1,\left(1-\alpha_{1-t}^2\right)\bI\right)
$$

</section>
</div>

<img src="/figs/trajectories.png" alt="Flow matching, VE and VP trajectories" style="width:100%;height:215px;object-fit:contain" />

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-4
class: theorems
---

# Recap of Previous Lecture

Fix a data point $\bx_1$ and a noise draw $\bepsilon\sim\cN(\bzero,\bI)$. For $0\le t<1$,

| Gaussian path | Trajectory $\bx_t$ | Conditional velocity $\bv(\bx_t,\bx_1,t)$ |
|---|---|---|
| VE | $\bx_1+\sigma_{1-t}\bepsilon$ | $-\dfrac{\sigma'_{1-t}}{\sigma_{1-t}}(\bx_t-\bx_1)=-\sigma'_{1-t}\bepsilon$ |
| VP | $\alpha_{1-t}\bx_1+\sqrt{1-\alpha_{1-t}^2}\,\bepsilon$ | $\dfrac{\alpha'_{1-t}}{1-\alpha_{1-t}^2}(\alpha_{1-t}\bx_t-\bx_1)$ |
| Straight FM | $(1-t)\bx_0+t\bx_1,\quad \bx_0=\bepsilon$ | $\dfrac{\bx_1-\bx_t}{1-t}=\bx_1-\bx_0$ |

<div class="takeaway">

With the usual VE and VP schedules, $\bx_t$ is **nonlinear in $t$** and its velocity varies along the path.<br>
Flow matching can use either Gaussian path or a **linear interpolation** with **constant velocity** $\bx_1-\bx_0$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: recap-of-previous-lecture-5
class: theorems
---

# Recap of Previous Lecture

<div class="columns">
<div class="block">

## Continuous state space

- **Discrete time** $t\in\{0,1,\ldots,T\}$ $\;\Rightarrow\;$ **DDPM / NCSN**.
- **Continuous time** $t\in[0,1]$ $\;\Rightarrow\;$ **Score-based SDE models**.

</div>
<div class="block">

## Discrete state space

- **Discrete time** $t\in\{0,1,\ldots,T\}$.
- **Continuous time** $t\in[0,1]$.

</div>
</div>
<div class="block">

## Potential advantages over left-to-right autoregressive generation

<div class="columns">
<div>

- Parallel generation
- Bidirectional context
- Flexible generation order

</div>
<div>

- Infilling and controllability
- **Iterative refinement:** revisit generated tokens when the sampler supports remasking or corrective updates.

</div>
</div>

</div>

<div class="source"><a href="https://arxiv.org/abs/2502.09992">Nie S. et al. Large language diffusion models, 2025.</a> <a href="https://arxiv.org/abs/2505.22618">Wu C. et al. Fast-dLLM, 2025.</a><br><a href="https://arxiv.org/abs/2412.10193">Schiff Y. et al. Simple guidance mechanisms for discrete diffusion models, 2025.</a> <a href="https://arxiv.org/abs/2503.00307">Wang G. et al. Remasking discrete diffusion models with inference-time scaling, 2025.</a></div>

---
clicks: 0
id: recap-of-previous-lecture-6
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Discrete Diffusion Markov Chain

We start with a single token (sequence length $m=1$) from a vocabulary of size $K$.

$$
q(\bx_t|\bx_{t-1})=\Cat(\bQ_t\bx_{t-1}).
$$

Each $\bx_t\in\{0,1\}^K$ is a **one-hot vector** encoding the categorical state.

</div>
<div class="block">

## Transition Matrix

$$
[\bQ_t]_{ij}=q(x_t=i|x_{t-1}=j),\qquad\sum_{i=1}^K[\bQ_t]_{ij}=1.
$$

$$
q(\bx_t|\bx_0)=\Cat(\bQ_{1:t}\bx_0),\qquad\bQ_{1:t}=\bQ_t\bQ_{t-1}\cdots\bQ_1.
$$

</div>

- The choice of $\bQ_t$ determines how information is erased and what the stationary distribution becomes.
- $\bQ_t$ and $\bQ_{1:t}$ should be easy to compute for each $t$.

**Uniform diffusion.** With probability $\beta_t$, draw a symbol uniformly ($\bU_{ij}=1/K$).

**Absorbing diffusion.** With probability $\beta_t$, replace the token by the mask $m$.

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
id: recap-of-previous-lecture-7
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Uniform vs. Absorbing Transition Matrix

Here $\bar\alpha_t=\prod_{s=1}^t(1-\beta_s)$ is the probability of no replacement in the first $t$ steps.

| Aspect | Uniform Diffusion | Absorbing Diffusion |
|---|---|---|
| $\bQ_t$ | $(1-\beta_t)\bI+\beta_t\bU$ | $(1-\beta_t)\bI+\beta_t\be_m\bone^\top$ |
| $\bQ_{1:t}$ | $\bar\alpha_t\bI+(1-\bar\alpha_t)\bU$ | $\bar\alpha_t\bI+(1-\bar\alpha_t)\be_m\bone^\top$ |
| $\bQ_{1:\infty}$, $\bar\alpha_t\to0$ | $\bU$ | $\be_m\bone^\top$ |
| Limiting token distribution | $\Cat(\bone/K)$, all $K$ tokens equally likely | $\Cat(\be_m)$, mask $m$ with probability $1$ |
| Interpretation | Random replacement | Gradual masking of tokens |
| Application | Image diffusion | Text diffusion $\approx$ Masked LM |

</div>
<div class="block">

Both schemes gradually destroy information, but differ in their stationary limit. Absorbing diffusion bridges diffusion and masked-language-model objectives.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
id: recap-of-previous-lecture-8
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Discrete conditioned reverse distribution

$$
q(\bx_{t-1}|\bx_t,\bx_0)=\Cat\left(\frac{\bQ_t^\top\bx_t\odot\bQ_{1:t-1}\bx_0}{\bx_t^\top\bQ_{1:t}\bx_0}\right).
$$

</div>
<div class="block">

## ELBO term

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\,\|\,\pt(\bx_{t-1}|\bx_t)\bigr).
$$

</div>

The reverse process $\pt(\bx_{t-1}|\bx_t)$ is a learned categorical distribution:

$$
\pt(\bx_{t-1}|\bx_t)=\Cat\bigl(\bpi_{\btheta}(\bx_t,t)\bigr),
$$

where $\bpi_{\btheta}$ is a neural network.

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\Ent\Bigl(q(\bx_{t-1}|\bx_t,\bx_0),\,\pt(\bx_{t-1}|\bx_t)\Bigr)+\text{const},
\qquad t=2,\ldots,T.
$$

<div class="takeaway">

In discrete diffusion, $\cL_t$ is the **expected cross-entropy** between the forward posterior and the reverse model's prediction for the token at step $t-1$, plus a constant independent of $\btheta$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured denoising diffusion models in discrete state-spaces, 2021.</a></div>

---
clicks: 0
id: outline
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Discrete Diffusion<div class="outline-sub">From Token to Sequence<br>Absorbing Diffusion<br>Continuous Time Formulation</div></div></div>
<div class="outline-item"><span>02</span><div>Course Overview</div></div>

</div>

---
clicks: 0
id: outline-2
section: "Discrete Diffusion"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Discrete Diffusion<div class="outline-sub">From Token to Sequence<br>Absorbing Diffusion<br>Continuous Time Formulation</div></div></div>
<div class="outline-item"><span>02</span><div>Course Overview</div></div>

</div>

---
clicks: 0
id: outline-7
section: "From Token to Sequence"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Discrete Diffusion<div class="outline-sub"><strong>From Token to Sequence</strong><br>Absorbing Diffusion<br>Continuous Time Formulation</div></div></div>
<div class="outline-item"><span>02</span><div>Course Overview</div></div>

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
\bX_t=[\bx_t^1,\ldots,\bx_t^m]\in\{0,1\}^{K\times m},\qquad \bone^\top\bx_t^i=1.
$$

Column $\bx_t^i$ is the one-hot vector for the token at position $i$ in a sequence of length $m$.

</div>
<div class="block" v-click="1">

## Independent Token-wise Forward Process

$$
q(\bX_t|\bX_{t-1})=\prod_{i=1}^m q(\bx_t^i|\bx_{t-1}^i)=\Cat(\bQ_t\bX_{t-1})
$$

- Each position $i$ evolves according to its own Markov chain.
- All positions share $\bQ_t$. With a matrix argument, $\Cat$ denotes a product of categorical distributions over columns.

</div>
<div class="block" v-click="2">

## Continuous Diffusion Analogy

Gaussian DDPMs with diagonal covariance add noise independently to each pixel. The reverse model learns dependencies across pixels.

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

- Both $q(\bX_t|\bX_0)$ and $q(\bX_{t-1}|\bX_t,\bX_0)$ factorize over positions.
- The reverse model can condition each prediction on the entire noisy sequence $\bX_t$.

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
id: outline-3
section: "Absorbing Diffusion"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Discrete Diffusion<div class="outline-sub">From Token to Sequence<br><strong>Absorbing Diffusion</strong><br>Continuous Time Formulation</div></div></div>
<div class="outline-item"><span>02</span><div>Course Overview</div></div>

</div>

---
clicks: 0
id: generative-models-taxonomy
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" absorbing-diffusion />

---
clicks: 3
id: absorbing-diffusion-forward-process
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
id: absorbing-diffusion
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
id: absorbing-diffusion-2
class: theorems
---

# Absorbing Diffusion

- If $\bx_t=\be_m$, the previous token may be either clean or masked.
- With probability $\rho_t$, masking occurred exactly at step $t$ (so $\bx_{t-1}=\bx_0$).
- With probability $(1-\rho_t)$, the token was already masked earlier (so $\bx_{t-1}=\be_m$).

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 1
id: absorbing-diffusion-3
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
- If a token is visible at time $t$, the forward posterior is deterministic.
- If the reverse model copies visible tokens, their KL terms are zero. Only masked positions contribute to the training loss.

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 2
id: absorbing-diffusion-4
class: theorems
---

# Absorbing Diffusion

<img src="/figs/abs_diff.png" alt="Absorbing diffusion masks tokens in the forward process and predicts tokens in the reverse process" style="width:100%;height:240px;object-fit:contain" />

<div v-click="1">

$$
\pt(\bX_{t-1}|\bX_t)=\prod_{i=1}^m\pt(\bx_{t-1}^i|\bX_t).
$$

Copy visible tokens. At masked positions, unmask with probability $\rho_t$ using
a clean-token predictor with zero mask probability; otherwise keep the mask.

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
id: algorithm-discrete-time-absorbing-diffusion
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
id: algorithm-discrete-time-absorbing-diffusion-2
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
clicks: 3
id: why-unmask-in-several-steps
class: theorems
---

# Why Unmask in Several Steps?

Suppose the data contain only two sequences: $\pd(AA)=\pd(BB)=\tfrac12$.

<div v-click="1">

From <code>[MASK, MASK]</code>, even a perfect predictor assigns probability $\tfrac12$ to $A$ and $B$ at each position.

</div>
<div v-click="2">

## Unmask both positions independently

| Sequence | $AA$ | $AB$ | $BA$ | $BB$ |
|---|---|---|---|---|
| Data | $1/2$ | $0$ | $0$ | $1/2$ |
| One-step sampling | $1/4$ | $1/4$ | $1/4$ | $1/4$ |

**Half the samples are invalid:** correct token marginals do not specify their joint distribution.

</div>
<div class="block" v-click="3">

## Reveal a token, then predict again

<code>[MASK, MASK]</code> → <code>[A, MASK]</code> → <code>[A, A]</code>.
Given the first $A$, the perfect predictor assigns probability $1$ to the second $A$.

Later steps condition on revealed tokens, allowing dependent choices.
The absorbing sampler keeps revealed tokens fixed.

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Factorized reverse process and sampling: Sahoo S. et al. Simple and Effective Masked Diffusion Language Models, 2024.</a></div>

---
clicks: 0
id: outline-4
section: "Continuous Time Formulation"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Discrete Diffusion<div class="outline-sub">From Token to Sequence<br>Absorbing Diffusion<br><strong>Continuous Time Formulation</strong></div></div></div>
<div class="outline-item"><span>02</span><div>Course Overview</div></div>

</div>

---
clicks: 3
id: from-discrete-time-to-mask-rate
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
id: discrete-elbo-revisited
class: theorems
---

# Discrete ELBO Revisited

With $\lambda_t=1-\bar\alpha_t$, let $\Delta\lambda_t=\lambda_t-\lambda_{t-1}$. The per-step weight is

$$
\rho_t=\frac{\beta_t\bar\alpha_{t-1}}{1-\bar\alpha_t}
=\frac{\bar\alpha_{t-1}-\bar\alpha_t}{1-\bar\alpha_t}
={\color{#8854c0}\frac{\Delta\lambda_t}{\lambda_t}}.
$$

<div v-click="1">

Sum the per-step losses and refine the mask-rate grid: $\Delta\lambda_t$ becomes $d\lambda$.

$$
\cL=\int_0^1{\color{#8854c0}\frac{1}{\lambda}}\bbE_{q_\lambda(\bX_\lambda|\bX_0)}\sum_{i=1}^m[\bx_\lambda^i=\be_m]\left[-\log\pt(\bx_0^i|\bX_\lambda)\right]d\lambda.
$$

</div>
<div class="block" v-click="2">

## The ELBO fixes the weight

For $\lambda\sim U(0,1)$, multiply the **sum of masked-token cross-entropies** by $1/\lambda$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

<!--
Keep this bridge brief (about one minute): the finite-step identity gives
rho_t = Delta lambda_t / lambda_t; summing the weighted masked-CE terms gives
a Riemann sum, hence the continuous weight 1/lambda. Do not introduce a new
auxiliary loss symbol or a separate derivation slide.

The displayed objective is the model-dependent negative-ELBO objective, averaged
over clean data during training. It uses the existing reverse parameterization:
copy visible tokens, match the posterior unmasking probability, and assign zero
clean-token probability to the mask. Take lambda_0=0 and lambda_T=1; the first
step contains reconstruction (rho_1=1), and the fully masked prior is fixed.
The continuum limit refines the mask-rate grid, with the usual integrability
conditions. At lambda=0 interpret the integral as a limit; sample lambda>0.
For finite conditional CE, the probability lambda that a position is masked
compensates the 1/lambda factor in the expectation, not in each sampled loss.
The sum of masked-token CEs must not silently become an average over the random
number of masked positions. Averaging over the fixed sequence length is only
a constant rescaling. In discrete-time Training, uniform t estimates the sum
up to the constant factor T, which is omitted there as a loss-scale convention.
These details are speaker notes, not additional material to explain in class.
-->

---
clicks: 0
id: algorithm-masked-diffusion-language-model-mdlm
class: theorems
---

# Algorithm: Masked Diffusion Language Model (MDLM)

<div class="block">

## Training

<ol>

<li>

Sample $\bX_0\sim\pd(\bX)$, ${\color{#8854c0}\lambda\sim U(0,1)}$.

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
\cL={\color{#8854c0}\frac{1}{\lambda}}\sum_{i=1}^m[\bx_{{\color{#8854c0}\lambda}}^i=\be_m]\,\big[-\log\pt(\bx_0^i|\bX_{{\color{#8854c0}\lambda}})\big].
$$

</li>

</ol>

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 0
id: algorithm-masked-diffusion-language-model-mdlm-2
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
id: algorithm-masked-diffusion-language-model-mdlm-3
class: theorems
---

# Algorithm: Masked Diffusion Language Model (MDLM)

**Note:** Once unmasked, a token stays unmasked. So for a currently masked token:

$$
\bbP(\bx_{\lambda_{\ell+1}}^i=\be_m\mid\bx_{\lambda_\ell}^i=\be_m)=\frac{\lambda_{\ell+1}}{\lambda_\ell}.
$$

<div class="source"><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and effective masked diffusion language models, 2024</a></div>

---
clicks: 3
id: masked-diffusion-and-any-order-autoregression
class: theorems
---

# Masked Diffusion and Any-Order Autoregression

Reveal one token at a time, conditioning on all visible tokens.

<div v-click="1">

<code>[M, M, M]</code> → <code>[M, A, M]</code> → <code>[M, A, B]</code> → <code>[C, A, B]</code>

Here <code>M</code> denotes a mask. The generation order is **2 → 3 → 1**.

This is **autoregressive generation in the chosen order**.

</div>
<div class="block" v-click="2">

## A connection between training objectives

With independent masking and a **time-independent predictor**, the continuous masked-diffusion objective equals the average autoregressive loss over **uniformly random token orders**.

The predictor uses visible tokens and their positions, without a separate time input.

</div>
<div v-click="3">

Unmasking several tokens independently in one step is a different sampling procedure.

</div>

<div class="source"><a href="https://arxiv.org/abs/2406.03736">Ou J. et al. Your Absorbing Discrete Diffusion Secretly Models the Conditional Distributions of Clean Data, 2024</a></div>

<!--
Narrative: the preceding MDLM Sampling fixes revealed tokens; this slide considers
one-token updates, reconnects them to autoregressive generation, and states the
objective equivalence. The following Course Overview now revisits these related
model families. The letters illustrate a possible sample, not an assumed data
distribution. Token positions stay fixed; only the order of revealing changes.

No proof in the presentation. The equality uses the already introduced objective:
independent, token-independent masking at rate lambda over the full interval
(0,1), weight 1/lambda, and a sum of masked-token cross-entropies. Use the same
clean-token predictor without explicit time conditioning in both objectives.
The AR objective averages the sum of negative log conditionals over uniformly
random permutations, each conditional evaluated on the previously revealed
tokens and their original positions. It is an average of order-specific NLLs,
not the negative log of the average order-specific probability. Learned
conditionals need not define the same joint distribution for every order.
Time independence describes the clean-token predictor, not the schedule-dependent
unmasking probability or a general discrete score. The result does not identify
arbitrary parallel, confidence-based, or remasking samplers with serial AR.
MaskGIT and practical samplers are reserved for the separately agreed discussion.
-->

---
clicks: 0
id: outline-5
section: "Course Overview"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Discrete Diffusion<div class="outline-sub">From Token to Sequence<br>Absorbing Diffusion<br>Continuous Time Formulation</div></div></div>
<div class="outline-item current"><span>02</span><div>Course Overview</div></div>

</div>

---
clicks: 0
id: course-overview-problem-statement
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
id: course-roadmap
---

# Course Roadmap

<TaxonomyDiagram class="taxonomy" />

---
clicks: 0
id: likelihood-based-exact-approximate-density-l1-l4
class: theorems
---

# Likelihood-based: Exact & Approximate Density (L1–L4)

<div class="block">

## Autoregressive (L1)

$$
\pt(\bx)=\prod_{j=1}^m\pt(x_j|\bx_{1:j-1})\qquad\text{exact likelihood, sequential sampling}
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
id: implicit-score-based-foundations-l5-l6
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
id: diffusion-models-l7-l8
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
id: continuous-dynamics-sde-l9-l10
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
id: flow-matching-l10-l11
class: theorems
---

# Flow Matching

<div class="block">

## Conditional Flow Matching

$$
\cL_{\text{CFM}}=\bbE_{t,p(\bz),p_t(\bx|\bz)}\,\bigl\|\bv_{\btheta}(\bx,t)-\bv(\bx,\bz,t)\bigr\|^2
$$

- $\nabla_{\btheta}\cL_{\text{FM}}=\nabla_{\btheta}\cL_{\text{CFM}}$: learn the marginal field using tractable conditional targets.
- Condition on an endpoint $\bz=\bx_1$ or an endpoint pair $\bz=(\bx_0,\bx_1)$.

</div>
<div class="block">

## Linear interpolation

$$
\bx_t=(1-t)\bx_0+t\bx_1
\qquad\Rightarrow\qquad
\text{training target: }\bx_1-\bx_0.
$$

Straight training paths do not imply straight sampling trajectories.

</div>
<div class="block">

## Connection to score-based diffusion

VE / VP diffusion paths are Gaussian-path choices; their probability-flow ODE velocities can be expressed through the score.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y. et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://arxiv.org/abs/2209.03003">Liu X. et al. Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow, 2022</a></div>

<!--
Overview bridge: the preceding slide recalls probability-flow ODEs; this slide
recalls how CFM learns a marginal velocity via conditional targets and relates
Gaussian paths back to VE/VP diffusion; the next slide changes to discrete states.
The linear-interpolation target is a sampled path derivative. Under endpoint
conditioning with an independent Gaussian source, it evaluates the conditional
field along the sampled path; under pair conditioning it is the pairwise target.
The learned marginal field averages these targets at the current state, so its
sampling trajectories need not be straight. Comparing FM and diffusion uses the
same probability path and consistent time orientation, not arbitrary objectives.
-->

---
clicks: 0
id: discrete-diffusion-l12-l13
class: theorems
---

# Discrete Diffusion

<div class="block">

## General discrete diffusion

- Transition matrices $\bQ_t$ define corruption: **uniform** replacement or **absorbing** masking.
- The forward posterior $q(\bx_{t-1}|\bx_t,\bx_0)$ is known analytically; the ELBO trains the reverse model via categorical KL terms.

</div>
<div class="block">

## Absorbing diffusion / MDLM

- Copy visible tokens and match the posterior unmasking probability: the ELBO becomes a weighted **masked-token cross-entropy**.
- **Training:** sample $\lambda\sim U(0,1)$, independently mask tokens with probability $\lambda$, and multiply their summed cross-entropies by $1/\lambda$.
- **Sampling:** start fully masked and reveal tokens in stages. Later predictions use revealed context; visible tokens stay fixed.

</div>

<div class="source"><a href="https://arxiv.org/abs/2107.03006">Austin J. et al. Structured Denoising Diffusion Models in Discrete State-Spaces, 2021</a><br><a href="https://arxiv.org/abs/2406.07524">Sahoo S. et al. Simple and Effective Masked Diffusion Language Models, 2024</a></div>

<!--
Overview bridge: after continuous dynamics, recall discrete transitions and their
categorical ELBO, then specialize to absorbing diffusion and MDLM. This completes
the family overview before the existing trilemma comparison.
The masked-CE reduction also assumes the clean-token predictor assigns zero
probability to the mask, as in the earlier absorbing reverse-model derivation.
The weight 1/lambda applies to the sum over masked positions, not an average over
their random count. Staged unmasking uses revealed context; it does not guarantee
the correct joint distribution for arbitrary parallel updates. This summary
describes the absorbing ancestral sampler, not remasking or corrective samplers.
-->

---
clicks: 0
id: generative-learning-trilemma
class: figure-slide
---

# Generative Learning Trilemma

<img class="hero" src="/figs/trilemma.png" alt="The generative learning trilemma between fast sampling, high-quality samples and mode coverage" />

A historical view of typical trade-offs, not a fundamental impossibility.

<div class="source"><a href="https://arxiv.org/abs/2112.07804">Xiao Z., Kreis K., Vahdat A. Tackling the generative learning trilemma with denoising diffusion GANs, 2021</a></div>

<!--
After the family overview, use this historical figure to introduce the three
evaluation axes: sample quality, mode coverage, and sampling cost. Its family
placements illustrate typical trade-offs at the time of the cited work; they
are not an impossibility theorem or an immutable classification. The next slide
explains how to interpret and improve those trade-offs without promising that
distillation resolves them universally. Preserve the original attributed figure.
-->

---
clicks: 0
id: generative-learning-trilemma-2
class: theorems
---

# Generative Learning Trilemma

<div class="block">

## Quality and coverage are different

Realistic samples do not guarantee that a model captures the full diversity of the data.

</div>
<div class="block">

## Sampling cost depends on the model and sampler

Both the number of sequential steps and the cost per step matter. A model family's name alone does not determine sampling speed.

</div>
<div class="block">

## The trade-off can improve

Better probability paths, sampling algorithms, and distillation can reduce sampling cost. Quality and coverage still need to be evaluated.

</div>

**Can we retain sample quality and diversity with only a few generation steps?**

<div class="source"><a href="https://arxiv.org/abs/2112.07804">Xiao Z. et al. Tackling the Generative Learning Trilemma with Denoising Diffusion GANs, 2021</a><br><a href="https://arxiv.org/abs/2210.02747">Lipman Y. et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://arxiv.org/abs/2303.01469">Song Y. et al. Consistency Models, 2023</a></div>

<!--
Read the preceding historical triangle through its three original axes rather
than assigning fixed strengths or weaknesses to every model family. Likelihood
tractability and discrete state spaces are separate properties, not additional
vertices of this triangle. The closing question motivates few-step generation
without introducing a new lecture block or claiming that the trade-off is solved.
The Summary retains this distinction and does not assert universal dominance.
-->

---
clicks: 0
id: summary
class: summary
---

# Summary

- For sequences, the forward process factorizes over tokens. Denoisers predict all positions from the whole corrupted sequence; clean-token cross-entropy is a simplified objective.
- With a reverse model that copies visible tokens and matches the unmasking probability, the absorbing ELBO yields time-weighted losses over masked positions.
- MDLM reveals tokens in stages so later predictions can use revealed context. Independent one-step sampling can miss token dependencies, even with correct marginals.
- With independent masking and a time-independent predictor, the continuous masked-diffusion objective equals the average AR loss over uniformly random token orders.
- Evaluate generative models along three axes: sample quality, mode coverage, and sampling cost.
- Better paths, samplers, and distillation can improve this trade-off; the trilemma is not a fundamental impossibility.
