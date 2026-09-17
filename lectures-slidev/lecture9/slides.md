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
sourceFrame: "1"
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 9</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## ELBO for Gaussian Diffusion Model

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)&={\color{olive}\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}-{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}\\
&\quad-\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}
\end{aligned}
$$

</div>

$$
\begin{aligned}
q(\bx_{t-1}|\bx_t,\bx_0)&=\cN(\bx_{t-1}|\tilde{\bmu}_t(\bx_t,\bx_0),\tilde{\beta}_t\bI),\\
\pt(\bx_{t-1}|\bx_t)&=\cN\bigl(\bx_{t-1}|\bmu_{\btheta,t}(\bx_t),{\color{#8854c0}\bsigma_{\btheta,t}^2(\bx_t)}\bigr)
\end{aligned}
$$

It is assumed that ${\color{#8854c0}\bsigma_{\btheta,t}^2(\bx_t)=\tilde{\beta}_t\bI}$.

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\left[\frac{1}{2\tilde{\beta}_t}\bigl\|\tilde{\bmu}_t(\bx_t,\bx_0)-\bmu_{\btheta,t}(\bx_t)\bigr\|^2\right]
$$

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap of Previous Lecture

$$
\cL_t=\bbE_{{\color{#8854c0}q(\bx_t|\bx_0)}}\left[{\color{olive}\frac{1}{2\tilde{\beta}_t}}\bigl\|\tilde{\bmu}_t(\bx_t,\bx_0)-\bmu_{\btheta,t}(\bx_t)\bigr\|^2\right]
$$

<div class="block">

## Reparametrization

$$
\begin{aligned}
\tilde{\bmu}_t(\bx_t,\bx_0)&=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}\cdot\bepsilon\\
\bmu_{\btheta,t}(\bx_t)&=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-{\color{teal}\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}}\cdot\bepsilon_{\btheta,t}(\bx_t)
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "extension: 3"
class: theorems
---

# Recap of Previous Lecture

$$
\cL_t=\bbE_{{\color{#8854c0}\bepsilon\sim\cN(0,\bI)}}\left[\frac{(1-\alpha_t)^2}{2\tilde{\beta}_t\alpha_t(1-\bar{\alpha}_t)}\Bigl\|\bepsilon-\bepsilon_{\btheta,t}\bigl({\color{teal}\sqrt{\bar{\alpha}_t}\bx_0+\sqrt{1-\bar{\alpha}_t}\bepsilon}\bigr)\Bigr\|^2\right]
$$

At every step of the reverse process, we attempt to predict the noise $\bepsilon$ that was used in the forward diffusion process!

<div class="block">

## Simplified Objective

$$
\cL_{\text{simple}}=\bbE_{t\sim U\{1,T\}}\bbE_{\bepsilon\sim\cN(0,\bI)}\Bigl\|\bepsilon-\bepsilon_{\btheta,t}\bigl(\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon\bigr)\Bigr\|^2
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "4"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Training

1. Sample $\bx_0\sim\pd(\bx)$, $t\sim U\{1,T\}$, $\bepsilon\sim\cN(0,\bI)$.
2. Compute noisy image $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$.
3. Compute loss $\cL_{\text{simple}}=\|\bepsilon-\bepsilon_{\btheta,t}(\bx_t)\|^2$.

</div>
<div class="block">

## Sampling (Ancestral)

1. Sample $\bx_T\sim\cN(0,\bI)$.
2. Compute the mean of $\pt(\bx_{t-1}|\bx_t)=\cN(\bmu_{\btheta,t}(\bx_t),\tilde{\beta}_t\cdot\bI)$:

$$
\bmu_{\btheta,t}(\bx_t)=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}\cdot\bepsilon_{\btheta,t}(\bx_t).
$$

3. Denoise $\bx_{t-1}=\bmu_{\btheta,t}(\bx_t)+\sqrt{\tilde{\beta}_t}\cdot\bepsilon$, $\bepsilon\sim\cN(0,\bI)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "5"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## DDPM Objective

$$
\bbE_{\pd(\bx_0)}\bbE_{t\sim U\{1,T\}}\bbE_{q(\bx_t|\bx_0)}\left[{\color{olive}C_{2,t}}\Bigl\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx_0)\Bigr\|_2^2\right]
$$

$$
\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon
$$

In practice, <span style="color:olive">this coefficient</span> is often omitted.

</div>
<div class="block">

## NCSN Objective

$$
\bbE_{\pd(\bx_0)}\bbE_{t\sim U\{1,T\}}\bbE_{q(\bx_t|\bx_0)}\bigl\|\bs_{\btheta,\sigma_t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx_0)\bigr\|_2^2
$$

</div>

**Note:** The objectives of DDPM and NCSN are almost identical; however, their sampling procedures differ:

- NCSN utilizes annealed Langevin dynamics,
- DDPM employs ancestral sampling.

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 2
sourceFrame: "6"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Summary

<ul>
<li>

Different Markov chains:

- DDPM: $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$;
- NCSN: $\bx_t=\bx_0+\sigma_t\cdot\bepsilon$.
- One can generalize to $q(\bx_t|\bx_0)=\cN(\alpha_t\cdot\bx_0,\sigma_t^2\,\bI)$.

</li>
<li v-click="1">

The objectives coincide: ELBO $\equiv$ score-matching.

</li>
<li v-click="2">

The sampling procedures differ:

- Ancestral sampling in DDPM;
- Annealed Langevin dynamics for NCSN;
- Hybrid approaches that combine both updates are possible.

</li>
</ul>
</div>

<div class="source"><a href="https://arxiv.org/abs/2107.00630">Kingma D. et al. Variational Diffusion Models, 2021</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y. et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
sourceFrame: "7"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## DDPM Sampling

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{teal}\nabla_{\bx_t}\log\pt(\bx_t)}+\sigma_t\cdot\bepsilon
$$

</div>
<div class="block">

## Guided Generation

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot\nabla_{\bx_t}\log\pt(\bx_t|{\color{olive}\by})+\sigma_t\cdot\bepsilon
$$

</div>
<div class="block">

## Guided Generation

$$
\begin{aligned}
{\color{olive}\nabla_{\bx_t}\log\pt(\bx_t|\by)}&={\color{#8854c0}\nabla_{\bx_t}\log\pt(\bx_t)}+\nabla_{\bx_t}\log p(\by|\bx_t)\\
&={\color{#8854c0}\bs_{\btheta,t}(\bx_t)}+{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}
\end{aligned}
$$

</div>

Here, $p(\by|\bx_t)$ denotes a classifier operating on noisy samples (which must be trained separately).

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 0
sourceFrame: "8"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Guided Score Function

$$
\begin{aligned}
\bs_{\btheta,t}(\bx_t,\by)&=\bs_{\btheta,t}(\bx_t)+\nabla_{\bx_t}\log p(\by|\bx_t)\\
{\color{#8854c0}\bs^\gamma_{\btheta,t}(\bx_t,\by)}&=\bs_{\btheta,t}(\bx_t)+{\color{teal}\gamma}\cdot\nabla_{\bx_t}\log p(\by|\bx_t)
\end{aligned}
$$

</div>

**Note:** Increasing $\gamma$ sharpens $p(\by|\bx_t)$, increasing the contrast

$$
\hat p(\by|\bx_t)\propto p(\by|\bx_t)^\gamma.
$$

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 0
sourceFrame: "extension: 8"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Training

1. Train the DDPM as before.
2. Train an additional classifier $p(\by|\bx_t)$ on noisy data (time-dependent).

</div>
<div class="block">

## Sampling (Guided)

1. Sample $\bx_T\sim\cN(0,\bI)$.
2. Denoise with the scaled guided score function:

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{olive}\bs^\gamma_{\btheta,t}(\bx_t,\by)}+\sigma_t\cdot\bepsilon.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 0
sourceFrame: "9"
class: theorems
---

# Recap of Previous Lecture

The previous method requires an additional classifier $p(\by|\bx_t)$ trained on noisy data. Let's try to avoid this requirement.

$$
{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}=\nabla_{\bx_t}\log\pt(\bx_t|\by)-\nabla_{\bx_t}\log\pt(\bx_t)
$$

$$
\begin{aligned}
\nabla_{\bx_t}^\gamma\log\pt(\bx_t|\by)&=\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}\\
&=\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot\bigl({\color{teal}\nabla_{\bx_t}\log\pt(\bx_t|\by)-\nabla_{\bx_t}\log\pt(\bx_t)}\bigr)\\
&=(1-\gamma)\cdot\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot\nabla_{\bx_t}\log\pt(\bx_t|\by)
\end{aligned}
$$

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a><br><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 0
sourceFrame: "extension: 9"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Scaled Guided Score Function

$$
\bs^\gamma_{\btheta,t}(\bx_t,\by)=(1-\gamma)\cdot\bs_{\btheta,t}(\bx_t)+\gamma\cdot\bs_{\btheta,t}(\bx_t,\by)
$$

</div>

<div class="block">

## CFG

1. Introduce the "absence of conditioning" label $\by=\varnothing$.
2. Identify the unguided score function $\bs_{\btheta,t}(\bx_t)=\bs_{\btheta,t}(\bx_t,\varnothing)$.
3. Train a single model $\bs_{\btheta,t}(\bx_t,\by)$ on **supervised** data, dropping the label $\by$ with some fixed probability (simulating $\by=\varnothing$).
4. At inference, evaluate the model twice to obtain $\bs_{\btheta,t}(\bx_t,\varnothing)$ and $\bs_{\btheta,t}(\bx_t,\by)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a><br><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 0
sourceFrame: "10"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item "><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item "><span>03</span><div>SDE Basics</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Continuous-Time Normalizing Flows (CNF)"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item "><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item "><span>03</span><div>SDE Basics</div></div>

</div>

---
clicks: 1
sourceFrame: "11"
class: theorems
---

# Discrete-Time Normalizing Flows

<div class="block">

## Change of Variable Theorem (CoV)

Let $\bx$ be a random variable with density $p(\bx)$, and let $\bff:\bbR^m\rightarrow\bbR^m$ be a differentiable and **invertible** transformation. If $\bz=\bff(\bx)$, $\bx=\bff^{-1}(\bz)=\bg(\bz)$, then

$$
\begin{aligned}
p(\bx)&=p(\bz)|\det(\bJ_{\bff})|=p(\bz)\left|\det\left(\frac{\partial\bz}{\partial\bx}\right)\right|\\
&=p(\bff(\bx))\left|\det\left(\frac{\partial\bff(\bx)}{\partial\bx}\right)\right|
\end{aligned}
$$

</div>
<div v-click="1">

<img src="/figs/normalizing-flow.png" alt="Composition of invertible transformations in a normalizing flow" style="width:100%;height:140px;object-fit:contain" />

$$
\log\pt(\bx)=\log p(\bff_K\circ\dots\circ\bff_1(\bx))+\sum_{k=1}^K\log\left|\det\left(\frac{\partial\bff_k}{\partial\bff_{k-1}}\right)\right|.
$$

</div>

<div class="source"><a href="https://lilianweng.github.io/lil-log/2018/10/13/flow-based-deep-generative-models.html">https://lilianweng.github.io/lil-log/2018/10/13/flow-based-deep-generative-models.html</a></div>

---
clicks: 2
sourceFrame: "12"
class: theorems
---

# Towards Continuous-Time Normalizing Flows

Up to this point, we have considered discrete-time normalizing flows:

$$
\bx_{t+1}=\bff_{\btheta}(\bx_t,t);\quad\log p(\bx_{t+1})=\log p(\bx_t)-\log\left|\det\frac{\partial\bff_{\btheta}(\bx_t)}{\partial\bx_t}\right|.
$$

<div class="block" v-click="1">

## Residual Flows

Let's consider the flow $\bff_{\btheta}(\bx,t)=\bx+\bv_{\btheta}(\bx,t)$:

$$
\bx_{t+1}=\bff_{\btheta}(\bx_t,t)=\bx_t+\bv_{\btheta}(\bx_t,t)
$$

<div v-click="2">

- This transformation is invertible by the Banach fixed point theorem if $\bv_{\btheta}$ is contractive, i.e. with Lipschitz constant $<1$.
- Here $\bff_{\btheta}$ is the NF **bijection**, $\bv_{\btheta}$ is the **velocity** (vector field).
- The update $\bx_{t+1}-\bx_t=\bv_{\btheta}(\bx_t,t)$ is a **finite-difference** approximation of a derivative.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/1906.02735">Chen R. T. Q. et al. Residual Flows for Invertible Generative Modeling, 2019</a></div>

---
clicks: 2
sourceFrame: "13"
class: theorems
---

# Towards Continuous-Time Normalizing Flows

Residual dynamics $\bx_{t+1}=\bx_t+\bv_{\btheta}(\bx_t,t)$ is an Euler step with $h=1$:

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

Here, $\bv_{\btheta}:\bbR^m\times[t_0,t_1]\rightarrow\bbR^m$ is a **velocity vector field**.

</div>

---
clicks: 1
sourceFrame: "14"
class: theorems
---

# Ordinary Differential Equations (ODEs)

$$
\begin{aligned}
\frac{d\bx(t)}{dt}&=\bv_{\btheta}(\bx(t),t);\quad\text{with initial condition }\bx(t_0)=\bx_0.\\
\bx(t_1)&=\int_{t_0}^{t_1}\bv_{\btheta}(\bx(t),t)\,dt+\bx_0
\end{aligned}
$$

<div class="block" v-click="1">

## Flow

Let call **the flow** $\bpsi:\bbR^m\times[t_0,t_1]\rightarrow\bbR^m$ the solution of ODE:

$$
\frac{d\bpsi_t(\bx_0)}{dt}=\bv_{\btheta}(\bpsi_t(\bx_0),t);\quad\text{with initial condition }\bpsi_0(\bx_0)=\bx_0.
$$

</div>

---
clicks: 2
sourceFrame: "extension: 14"
class: theorems
---

# Ordinary Differential Equations (ODEs)

<div class="block">

## Numerical Solution of ODEs

<div class="math-chain">
<span>

$\displaystyle\bpsi_t(\bx_0)=\int_{t_0}^{t}\bv_{\btheta}(\bx(s),s)\,ds+\bx_0$

</span>
<span v-click="1">

$\displaystyle\;\approx{\color{teal}\ODESolve_v(\bx_0,\btheta,t_0,t)}.$

</span>
</div>


<div v-click="2">

Here, we require the numerical routine $\ODESolve_v(\bx_0,\btheta,t_0,t)$.

</div>

</div>

---
clicks: 2
sourceFrame: "15"
class: theorems
---

# Numerical Solution of ODEs

<div class="math-chain">
<span>

$\displaystyle\bpsi_t(\bx_0)=\int_{t_0}^{t}\bv_{\btheta}(\bx(s),s)\,ds+\bx_0$

</span>
<span v-click="1">

$\displaystyle\;\approx{\color{teal}\ODESolve_v(\bx_0,\btheta,t_0,t)}.$

</span>
</div>

<div v-click="1">

$\ODESolve_v(\bx_0,\btheta,t_0,t)$ consists of sequence of iterative update steps.

</div>

<div class="block" v-click="2">

## Euler Update Step

$$
\frac{\bx(t+h)-\bx(t)}{h}=\bv_{\btheta}(\bx(t),t)
$$

$$
\bx(t+h)=\bx(t)+h\cdot\bv_{\btheta}(\bx(t),t)
$$


</div>

<div class="source"><a href="https://en.wikipedia.org/wiki/Heun's_method">Image credit: https://en.wikipedia.org/wiki/Heun's_method</a></div>

---
clicks: 0
sourceFrame: "extension: 15"
class: theorems
---

# Numerical Solution of ODEs

<img src="/figs/heun_method.jpg" alt="Euler and Heun update steps" style="width:100%;height:260px;object-fit:contain" />

<div class="block">

## Heun's Update Step

$$
\bx'(t+h)=\bx(t)+h\cdot\bv_{\btheta}(\bx(t),t)
$$

$$
\bx(t+h)=\bx(t)+\frac{h}{2}\cdot\left(\bv_{\btheta}(\bx(t),t)+\bv_{\btheta}(\bx'(t+h),t+h)\right)
$$

</div>

<div class="source"><a href="https://en.wikipedia.org/wiki/Heun's_method">Image credit: https://en.wikipedia.org/wiki/Heun's_method</a></div>

---
clicks: 0
sourceFrame: "16"
class: figure-slide
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" continuous-normalizing-flow />

---
clicks: 2
sourceFrame: "17"
class: theorems
---

# Continuous-Time Normalizing Flows: Neural ODE

<div class="block">

## Neural ODE

$$
\frac{d\bx(t)}{dt}=\bv_{\btheta}(\bx(t),t);\quad\text{with initial condition }\bx(t_0)=\bx_0
$$

</div>

<div class="block" v-click="1">

## Euler $\ODESolve$

$$
\bx(t+h)=\bx(t)+h\cdot\bv_{\btheta}(\bx(t),t)
$$

</div>

<div v-click="2">

- Consider $[t_0,t_1]=[0,1]$ for simplicity.
- If $\bx(0)$ is a random variable with density $p_0(\bx)$,
- Then, for any $t$, $\bx(t)$ is a random variable with density $p_t(\bx)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 2
sourceFrame: "18"
class: theorems
---

# Continuous-Time Normalizing Flows: Intuition

$$
\frac{d\bx(t)}{dt}=\bv_{\btheta}(\bx(t),t);\quad\text{with initial condition }\bx(t_0)=\bx_0
$$


<div v-click="1">

- $p_t(\bx)=p(\bx,t)$ describes the **probability path** interpolating between $p_0(\bx)$ and $p_1(\bx)$.
- <span style="color:gray">What is the difference between $p_t(\bx(t))$ and $p_t(\bx)$?</span>

</div>

<div v-click="2">

<img src="/figs/cnf_flow.png" alt="A continuous flow of samples and the corresponding probability path" style="width:100%;height:260px;object-fit:contain" />

</div>

<div class="source"><a href="https://arxiv.org/abs/1810.01367">Grathwohl W. et al. FFJORD: Free-form Continuous Dynamics for Scalable Reversible Generative Models, 2018</a></div>

---
clicks: 3
sourceFrame: "19"
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

</div>

<div v-click="3">

How can we compute $p_t(\bx)$ at arbitrary $t$?

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 0
sourceFrame: "auto: Continuity Equation for CNF Log-Likelihood"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item current"><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item "><span>03</span><div>SDE Basics</div></div>

</div>

---
clicks: 2
sourceFrame: "20"
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

This result states: given $\bx_0=\bx(0)$, the solution to the continuity equation gives the density $p_1(\bx(1))$.

<div class="block">

## Solution

$$
\log p_1(\bx(1))=\log p_0(\bx(0))-{\color{teal}\int_0^1\tr\left(\frac{\partial\bv(\bx(t),t)}{\partial\bx(t)}\right)\,dt}.
$$

</div>

</div>

<div v-click="2">

- This provides the density **along the trajectory**.
- However, <span style="color:teal">the latter term</span> is difficult to estimate efficiently.

</div>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 0
sourceFrame: "auto: SDE Basics"
---

# Outline

<div class="course-outline">

<div class="outline-item "><span>01</span><div>Continuous-Time Normalizing Flows (CNF)</div></div>
<div class="outline-item "><span>02</span><div>Continuity Equation for CNF Log-Likelihood</div></div>
<div class="outline-item current"><span>03</span><div>SDE Basics</div></div>

</div>

---
clicks: 1
sourceFrame: "21"
class: theorems
---

# Stochastic Differential Equation (SDE)

<div class="block">

## Wiener Process

$\bw(t)$ is the standard Wiener process (Brownian motion), defined by:

<div class="columns balanced">
<div>

1. $\bw(0)=0$ (almost surely);
2. $\bw(t)$ has independent increments;
3. $\bw(t)$ trajectories are continuous;
4. $\bw(t)-\bw(s)\sim\cN(0,(t-s)\bI)$ for $t>s$;

</div>
<div>

<img src="/figs/brownian_motion.png" alt="Sample trajectories of Brownian motion" style="width:100%;height:245px;object-fit:contain" />

</div>
</div>

</div>

<div v-click="1">

$$
d\bw=\bw(t+dt)-\bw(t)=\cN(0,\bI\cdot dt)=\bepsilon\cdot\sqrt{dt},\quad\text{where }\bepsilon\sim\cN(0,\bI).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 2
sourceFrame: "22"
class: theorems
---

# Stochastic Differential Equation (SDE)

$$
\frac{d\bx}{dt}=\bv(\bx,t)\quad\Rightarrow\quad d\bx=\bv(\bx,t)\,dt
$$


<div v-click="1">

Let's define a stochastic process $\bx(t)$ with initial condition $\bx(0)\sim p_0(\bx)=\pd(\bx)$:

$$
d\bx=\bff(\bx,t)\,dt+{\color{#8854c0}g(t)\,d\bw}
$$

</div>

<div v-click="2">

- $\bff(\bx,t):\bbR^m\times[0,1]\rightarrow\bbR^m$ is the **drift** term (vector field).
- $g(t):\bbR\rightarrow\bbR$ is the **diffusion** term (if $g(t)=0$, we recover the standard ODE).
- $\bw(t)$ is the standard Wiener process ($d\bw=\bepsilon\cdot\sqrt{dt}$).
- We do not have the flow $\bpsi_t(\bx_0)$ notion anymore, since trajectories are stochastic.

</div>

---
clicks: 2
sourceFrame: "23"
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
- Instead, SDEs require **Itô calculus** (e.g., Itô's lemma).
- Expressions $d\bx$, $dt$, $d\bw$ are **formal shorthand** for infinitesimal increments.

</div>

<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. et al. The Principles of Diffusion Models, 2025</a></div>

---
clicks: 1
sourceFrame: "24"
class: theorems
---

# Stochastic Differential Equation (SDE)

$$
d\bx=\bff(\bx,t)\,dt+g(t)\,d\bw
$$


<div class="block">

## Theorem

If $\bff$ is continuously differentiable with a bounded derivative in $\bx$ and continuous in $t$ and $g(t)$ is continuous then the SDE has the solution given by unique process $\bx(t)$.

</div>

<div v-click="1">

- Unlike ODEs, the initial condition $\bx(0)$ doesn't uniquely determine the trajectory.
- There are two sources of randomness:
  - the initial distribution $p_0(\bx)$;
  - the Wiener process $\bw(t)$.

</div>

---
clicks: 2
sourceFrame: "25"
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
- How can we obtain the probability path $p_t(\bx)$ for $\bx(t)$?

</div>

---
clicks: 2
sourceFrame: "26"
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

<div v-click="1">

Here,

$$
\diver(\bv)=\sum_{i=1}^m\frac{\partial v_i(\bx)}{\partial x_i}=\tr\left(\frac{\partial\bv(\bx)}{\partial\bx}\right)
$$

$$
\Delta_{\bx}p_t(\bx)=\sum_{i=1}^m\frac{\partial^2p_t(\bx)}{\partial x_i^2}=\tr\left(\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)
$$

</div>
<div v-click="2">

$$
\frac{\partial p_t(\bx)}{\partial t}=\tr\left(-\frac{\partial}{\partial\bx}\bigl[\bff(\bx,t)p_t(\bx)\bigr]+\frac12g^2(t)\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)
$$

</div>

</div>

---
clicks: 2
sourceFrame: "27"
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
clicks: 4
sourceFrame: "28"
class: theorems
---

# Langevin SDE (Special Case)

$$
\frac{\partial p_t(\bx)}{\partial t}=0\quad\Leftrightarrow\quad\tr\left(-\frac{\partial}{\partial\bx}\bigl[\bff(\bx,t)p_t(\bx)\bigr]+\frac12g^2(t)\frac{\partial^2p_t(\bx)}{\partial\bx^2}\right)=0
$$


<div v-click="1">

$$
\frac{\partial}{\partial\bx}\bigl[\bff(\bx,t)p_t(\bx)\bigr]=\frac12g^2(t)\frac{\partial^2p_t(\bx)}{\partial\bx^2}
$$

</div>

<div v-click="2">

$$
\bff(\bx,t)p_t(\bx)=\frac12g^2(t)\frac{\partial p_t(\bx)}{\partial\bx}
$$

</div>

<div v-click="3">

$$
\bff(\bx,t)=\frac12g^2(t)\frac{1}{p_t(\bx)}\frac{\partial p_t(\bx)}{\partial\bx}=\frac12g^2(t)\frac{\partial}{\partial\bx}\log p_t(\bx)
$$

</div>

<div v-click="4">

Let ${\color{olive}g(t)=1}$, then ${\color{#8854c0}\bff(\bx,t)=\frac12\frac{\partial}{\partial\bx}\log p_t(\bx)}$.

$$
d\bx={\color{#8854c0}\frac12\frac{\partial}{\partial\bx}\log p_t(\bx)\,dt}+{\color{olive}1}\cdot d\bw
$$

</div>

---
clicks: 2
sourceFrame: "29"
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
sourceFrame: "30"
class: summary
---

# Summary

- Continuous-time normalizing flows leverage neural ODEs to define continuous-time trajectories $\bx(t)$, relaxing many constraints of discrete-time flows.
- If $\bx_0$ is a random variable, this yields a **probability path** $p_t(\bx)$ as time evolves. The continuity equation describes the evolution of $\log p(\bx,t)$ over time.
- An SDE defines a stochastic process with drift and diffusion terms; ODEs are a special case of SDEs.
- The KFP equation describes the probability dynamics of an SDE.
- The Langevin SDE preserves a constant probability path.
