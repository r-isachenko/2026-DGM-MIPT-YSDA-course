---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 3"
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
importedSourceFrames: {"4": [7, 8, 9, 10, 11]}
sourceFrame: "1"
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 3</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Jacobian Matrix

<div class="columns balanced">
<div>

Let $\bff:\bbR^m\rightarrow\bbR^m$ be a differentiable function.

$$
\bz=\bff(\bx)
$$

</div>
<div>

$$
\bJ=\frac{\partial\bz}{\partial\bx}=\begin{pmatrix}
\frac{\partial z_1}{\partial x_1}&\dots&\frac{\partial z_1}{\partial x_m}\\
\vdots&\ddots&\vdots\\
\frac{\partial z_m}{\partial x_1}&\dots&\frac{\partial z_m}{\partial x_m}
\end{pmatrix}\in\bbR^{m\times m}
$$

</div>
</div>
</div>
<div class="block">

## Change of Variables Theorem (CoV)

Let $\bx\in\bbR^m$ be a random vector with density $p(\bx)$, and let $\bff:\bbR^m\rightarrow\bbR^m$ be a $C^1$-diffeomorphism ($\bff$ and $\bff^{-1}$ are continuously differentiable mappings). If $\bz=\bff(\bx)$, then

$$
\begin{aligned}
p(\bx)&=p(\bz)|\det(\bJ_{\bff})|=p(\bz)\left|\det\left(\frac{\partial\bz}{\partial\bx}\right)\right|=p(\bff(\bx))\left|\det\left(\frac{\partial\bff(\bx)}{\partial\bx}\right)\right|\\
p(\bz)&=p(\bx)|\det(\bJ_{\bff^{-1}})|=p(\bx)\left|\det\left(\frac{\partial\bx}{\partial\bz}\right)\right|=p(\bff^{-1}(\bz))\left|\det\left(\frac{\partial\bff^{-1}(\bz)}{\partial\bz}\right)\right|
\end{aligned}
$$

</div>

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Definition

A normalizing flow is a $C^1$-diffeomorphism that transforms data $\bx$ to noise $\bz$.

</div>

<img src="/figs/flows_how2.png" alt="A normalizing flow maps data to latent noise and inverts the mapping for sampling" class="wide-figure" style="height: 245px; margin-bottom: 10px" />

<div class="block">

## Log-Likelihood

$$
\log\pt(\bx)=\log p(\bff_K\circ\ldots\circ\bff_1(\bx))+\sum_{k=1}^K\log|\det(\bJ_{\bff_k})|
$$

where $\bJ_{\bff_k}=\frac{\partial\bff_k}{\partial\bff_{k-1}}$.

</div>

<div class="source"><a href="https://arxiv.org/abs/1605.08803">Dinh L., Sohl-Dickstein J., Bengio S. Density Estimation Using Real NVP, 2016</a></div>

---
clicks: 0
sourceFrame: "4"
---

# Recap of Previous Lecture

<div class="block" style="margin-bottom: 32px">

## NF Log-Likelihood

$$
\log\pt(\bx)=\log p(\bff_{\btheta}(\bx))+\log|\det(\bJ_\bff)|
$$

</div>

The principal computational challenge is evaluating the Jacobian determinant.

$$
\bz=\bff_{\btheta}(\bx)=\bW\bx,\quad\bW\in\bbR^{m\times m},\quad\bJ_\bff=\bW
$$

<div class="block" style="margin-top: 32px">

## Structured Factors

Structured factorizations (e.g. LU or QR) simplify determinant and inverse calculations.

Keep triangular diagonals nonzero to preserve invertibility.

**Learn the factors directly** during training.

</div>

<div class="source"><a href="https://arxiv.org/abs/1807.03039">Kingma D. P., et al. Glow: Generative Flow with Invertible 1x1 Convolutions, 2018</a><br><a href="https://arxiv.org/abs/1901.11137">Hoogeboom E., et al. Emerging Convolutions for Generative Normalizing Flows, 2019</a></div>

---
clicks: 0
sourceFrame: "5"
class: theorems
---

# Recap of Previous Lecture

Consider the autoregressive model:

$$
\pt(\bx)=\prod_{j=1}^m\pt(x_j|\bx_{1:j-1}),\quad
\pt(x_j|\bx_{1:j-1})=\cN\left(\mu_{j,\btheta}(\bx_{1:j-1}),\sigma^2_{j,\btheta}(\bx_{1:j-1})\right)
$$

<div class="block">

## Gaussian AR NF

$$
\begin{aligned}
\bx&=\bff^{-1}_{\btheta}(\bz)\quad\Rightarrow\quad {\color{#8854c0}x_j}=\sigma_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})\cdot{\color{teal}z_j}+\mu_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}}).\\
\bz&=\bff_{\btheta}(\bx)\quad\Rightarrow\quad {\color{teal}z_j}=\left({\color{#8854c0}x_j}-\mu_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})\right)\cdot\frac{1}{\sigma_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})}.
\end{aligned}
$$

</div>

- This gives a **$C^1$-diffeomorphism** from $p(\bz)$ to $\pt(\bx)$ (assume that $\sigma_j\neq0$).
- The Jacobian matrix of this transformation is triangular.

Sampling must be done sequentially, but density evaluation can be parallelized.

<div class="source"><a href="https://arxiv.org/abs/1705.07057">Papamakarios G., Pavlakou T., Murray I. Masked Autoregressive Flow for Density Estimation, 2017</a></div>

---
clicks: 0
sourceFrame: "6"
class: theorems
---

# Recap of Previous Lecture

Split $\bx$ and $\bz$ into two parts:

$$
\bx=[\bx_1,\bx_2]=[\bx_{1:d},\bx_{d+1:m}];\quad\bz=[\bz_1,\bz_2]=[\bz_{1:d},\bz_{d+1:m}]
$$

<div class="block">

## Coupling Layer

$$
\begin{cases}
{\color{#8854c0}\bx_1}={\color{teal}\bz_1}\\
{\color{#8854c0}\bx_2}={\color{teal}\bz_2}\odot\bsigma_{\btheta}({\color{teal}\bz_1})+\bmu_{\btheta}({\color{teal}\bz_1})
\end{cases}
\qquad
\begin{cases}
{\color{teal}\bz_1}={\color{#8854c0}\bx_1}\\
{\color{teal}\bz_2}=({\color{#8854c0}\bx_2}-\bmu_{\btheta}({\color{#8854c0}\bx_1}))\odot\frac{1}{\bsigma_{\btheta}({\color{#8854c0}\bx_1})}
\end{cases}
$$

In both training and sampling, only a single forward pass is needed!

</div>
<div class="block">

## Jacobian

$$
\det\left(\frac{\partial\bz}{\partial\bx}\right)=\det\begin{pmatrix}
\bI_d&0_{d\times m-d}\\
\frac{\partial\bz_2}{\partial\bx_1}&\frac{\partial\bz_2}{\partial\bx_2}
\end{pmatrix}=\prod_{j=1}^{m-d}\frac{1}{\sigma_{j,\btheta}(\bx_1)}.
$$

</div>

A coupling layer is a special instance of the Gaussian autoregressive NF.

<div class="source"><a href="https://arxiv.org/abs/1605.08803">Dinh L., Sohl-Dickstein J., Bengio S. Density Estimation Using Real NVP, 2016</a></div>

---
clicks: 1
sourceFrame: "7"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Maximum Likelihood Estimation (MLE) Problem

$$
\btheta^*=\argmax_{\btheta}\pt(\bX)=\argmax_{\btheta}\prod_{i=1}^n\pt(\bx_i)=\argmax_{\btheta}\sum_{i=1}^n\log\pt(\bx_i).
$$

</div>

The distribution $\pt(\bx)$ should be highly complex (just like the true data distribution $\pd(\bx)$).

<div class="block">

## Latent Variable

Introduce a latent variable $\bz$ for each observed sample $\bx$:

$$
\pt(\bx,\bz)=\pt(\bx|\bz)p(\bz);\quad
\log\pt(\bx,\bz)=\log\pt(\bx|\bz)+\log p(\bz).
$$

<div v-click="1">

$$
\pt(\bx)=\int\pt(\bx,\bz)d\bz=\int\pt(\bx|\bz)p(\bz)d\bz.
$$

</div>
</div>
<div v-click="1">

- $p(\bz)$ is prior distribution over the latent variable.
- $\pt(\bx|\bz)$ is **decoder** distribution.
- Both $\pt(\bx|\bz)$ and $p(\bz)$ are usually much simpler than $\pt(\bx)$.

</div>

---
clicks: 0
sourceFrame: "8"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Latent Variable Models (LVM) (continued)</div></div>
<div class="outline-item"><span>02</span><div>Variational Evidence Lower Bound (ELBO)</div></div>
<div class="outline-item"><span>03</span><div>Amortized Inference</div></div>
<div class="outline-item"><span>04</span><div>ELBO Gradients, Reparametrization Trick</div></div>
<div class="outline-item"><span>05</span><div>Variational Autoencoder (VAE)</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Latent Variable Models (LVM) (continued)"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Latent Variable Models (LVM) (continued)</div></div>
<div class="outline-item"><span>02</span><div>Variational Evidence Lower Bound (ELBO)</div></div>
<div class="outline-item"><span>03</span><div>Amortized Inference</div></div>
<div class="outline-item"><span>04</span><div>ELBO Gradients, Reparametrization Trick</div></div>
<div class="outline-item"><span>05</span><div>Variational Autoencoder (VAE)</div></div>

</div>

---
clicks: 3
sourceFrame: "9"
class: theorems
---

# MLE for LVM

$$
\sum_{i=1}^n\log\pt(\bx_i)=\sum_{i=1}^n\log\int\pt(\bx_i|\bz_i)p(\bz_i)d\bz_i\rightarrow\max_{\btheta}.
$$

<img v-click="1" src="/figs/lvm_diagram.png" alt="A latent prior and decoder generate observations from latent samples" class="figure-top" style="height: 170px" />

<div class="block" v-click="2">

## A Naive Lower Bound

$$
\log\pt(\bx)=\log\bbE_{p(\bz)}\pt(\bx|\bz)\geq\bbE_{p(\bz)}\log\pt(\bx|\bz)\approx\frac{1}{K}\sum_{k=1}^K\log\pt(\bx|\bz_k),
$$

where $\bz_k\sim p(\bz)$.

<div v-click="3">

- **Observation-independent samples:** the prior does not adapt to $\bx$.
- **Potentially loose bound:** more samples reduce noise, but do not tighten the bound.

</div>
</div>

<div class="source"><a href="https://jmtomczak.github.io/blog/4/4_VAE.html">Image credit: https://jmtomczak.github.io/blog/4/4_VAE.html</a></div>

---
clicks: 0
sourceFrame: "auto: Variational Evidence Lower Bound (ELBO)"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Latent Variable Models (LVM) (continued)</div></div>
<div class="outline-item current"><span>02</span><div>Variational Evidence Lower Bound (ELBO)</div></div>
<div class="outline-item"><span>03</span><div>Amortized Inference</div></div>
<div class="outline-item"><span>04</span><div>ELBO Gradients, Reparametrization Trick</div></div>
<div class="outline-item"><span>05</span><div>Variational Autoencoder (VAE)</div></div>

</div>

---
clicks: 5
sourceFrame: "10"
class: theorems
---

# ELBO Derivation I

<div class="block">

## Bayes theorem

$$
\pt(\bz|\bx)=\frac{\pt(\bx,\bz)}{\pt(\bx)}\quad\Rightarrow\quad\pt(\bx)=\frac{\pt(\bx,\bz)}{\pt(\bz|\bx)}
$$

</div>
<div v-click="1" style="margin-top: 24px">

Introduce an auxiliary distribution $q(\bz)$ to build a more flexible family of lower bounds.

<div style="color: var(--muted)">

$$
\int q(\bz)d\bz=1,\qquad\supp(q(\bz))=\supp(\pt(\bz|\bx))=\bbR^d.
$$

</div>
</div>
<div class="block" v-click="2" style="margin-top: 24px">

## Split the logarithm

<div style="margin: 16px 0; text-align: center; white-space: nowrap">

<span>$\displaystyle\log\pt(\bx)=\log\left[\frac{\pt(\bx,\bz)}{{\color{teal}q(\bz)}}\cdot\frac{{\color{teal}q(\bz)}}{\pt(\bz|\bx)}\right]$</span>
<span v-click="3">$\displaystyle=\log\frac{\pt(\bx,\bz)}{{\color{teal}q(\bz)}}+\log\frac{{\color{teal}q(\bz)}}{\pt(\bz|\bx)}.$</span>

</div>
</div>
<div class="block" v-click="4" style="margin-top: 24px">

## Average over $\bz\sim q$

Since $\log\pt(\bx)$ does not depend on $\bz$:

<div v-click="5">

$$
\boxed{\log\pt(\bx)=\bbE_q\log\frac{\pt(\bx,\bz)}{q(\bz)}+\bbE_q\log\frac{q(\bz)}{\pt(\bz|\bx)}}.
$$

</div>
</div>

---
clicks: 6
sourceFrame: "11"
class: theorems
---

# ELBO Derivation II

<div class="block">

$$
\log\pt(\bx)=\bbE_q\log\frac{\pt(\bx,\bz)}{q(\bz)}+\bbE_q\log\frac{q(\bz)}{\pt(\bz|\bx)}
$$

<div v-click="1">

$$
\log\pt(\bx)={\color{teal}\cL_{q,\btheta}(\bx)}+{\color{#8854c0}\underbrace{\KL(q(\bz)\|\pt(\bz|\bx))}_{\geq 0}}
$$

</div>
<div v-click="2">

The KL term is the **exact gap** between log-likelihood and ELBO.

</div>
</div>
<div class="takeaway" v-click="3">

## Variational Evidence Lower Bound (ELBO)

$$
\cL_{q,\btheta}(\bx)=\bbE_q\log\frac{\pt(\bx,\bz)}{q(\bz)}\leq\log\pt(\bx)
$$

<div v-click="4">

The bound holds for any admissible $q(\bz)$.

</div>
</div>
<div v-click="5" style="margin-top: 24px">

Maximize the ELBO as a surrogate for log-likelihood:

$$
\max_{\btheta}\log\pt(\bx)\quad\longrightarrow\quad\max_{q,\btheta}\cL_{q,\btheta}(\bx)
$$

</div>
<div v-click="6">

For fixed $\btheta$, the **variational parameter** $q$ controls the tightness of the bound.

</div>

---
clicks: 5
sourceFrame: "12"
class: theorems interactive-slide
---

# Variational Evidence Lower Bound (ELBO)

<div style="margin: 20px 0 24px">

$$
\log\pt(\bx)=\cL_{q,\btheta}(\bx)+\KL(q(\bz)\|\pt(\bz|\bx))
$$

</div>

What is the optimal distribution $q^*(\bz)$ given fixed $\btheta^*$?

<div v-click="1" style="margin: 24px 0; text-align: center; white-space: nowrap">

<span>$\displaystyle q^*(\bz)=\argmax_q\cL_{q,\btheta^*}(\bx)$</span>
<span v-click="2">$\displaystyle{}=\argmin_q\KL(q(\bz)\|p_{\btheta^*}(\bz|\bx))$</span>
<span v-click="3">$\displaystyle{}=p_{\btheta^*}(\bz|\bx).$</span>
</div>
<div v-click="4">

Here we got the intuition about variational distribution $q(\bz)$: it estimates the posterior $p_{\btheta^*}(\bz|\bx)$.

</div>
<ElboDemo v-click="5" />

<div class="source">Bishop C. Pattern Recognition and Machine Learning, 2006</div>

---
clicks: 7
sourceFrame: "13"
class: theorems
---

# Variational Evidence Lower Bound (ELBO)

Factor the joint distribution to separate reconstruction from the prior penalty.

$$ {1|1-2|all} {at:1}
\begin{aligned}
\cL_{q,\btheta}(\bx)&=\int q(\bz)\log\frac{{\color{#8854c0}\pt(\bx,\bz)}}{{\color{teal}q(\bz)}}d\bz\\
&=\int q(\bz)\log{\color{#8854c0}\pt(\bx|\bz)}d\bz+\int q(\bz)\log\frac{{\color{#8854c0}p(\bz)}}{{\color{teal}q(\bz)}}d\bz\\
&=\bbE_q\log\pt(\bx|\bz)-\KL(q(\bz)\|p(\bz))
\end{aligned}
$$

<div class="block" v-click="3">

## Log-Likelihood Decomposition

Substitute this form into the earlier identity. The KL to the posterior remains the ELBO gap.

$$ {1|all} {at:4}
\begin{aligned}
\log\pt(\bx)&={\color{olive}\cL_{q,\btheta}(\bx)}+\KL(q(\bz)\|\pt(\bz|\bx))\\
&={\color{olive}\bbE_q\log\pt(\bx|\bz)-\KL(q(\bz)\|p(\bz))}+\KL(q(\bz)\|\pt(\bz|\bx)).
\end{aligned}
$$

</div>
<ul>
<li v-click="5">

What do we get if we drop $\KL(q(\bz)\|p(\bz))$ term from ELBO?

</li>
<li v-click="6">

What do we have in the term $\bbE_q\log\pt(\bx|\bz)$ in the case of Normal distribution?

</li>
</ul>

<div class="takeaway" v-click="7">

**ELBO = reconstruction − regularization:** explain $\bx$ well; penalize deviations of $q$ from the prior.

</div>

---
clicks: 0
sourceFrame: "extension: 13"
class: theorems
---

# ELBO: Key Takeaways

<div class="block">

## A lower bound for any admissible $q$

$$
\cL_{q,\btheta}(\bx)=\bbE_q\log\frac{\pt(\bx,\bz)}{q(\bz)}\leq\log\pt(\bx)
$$

</div>
<div class="block">

## An exact gap

$$
\log\pt(\bx)-\cL_{q,\btheta}(\bx)=\KL(q(\bz)\|\pt(\bz|\bx))\geq 0
$$

For fixed $\btheta$, the bound is tight when $q(\bz)=\pt(\bz|\bx)$.

</div>
<div class="block">

## Reconstruction − regularization

$$
\cL_{q,\btheta}(\bx)=\underbrace{{\color{#8854c0}\bbE_q\log\pt(\bx|\bz)}}_{\text{Reconstruction}}-\underbrace{{\color{teal}\KL(q(\bz)\|p(\bz))}}_{\text{Regularization}}
$$

</div>
<div class="block">

## Joint optimization

$$
\max_{\btheta,q}\cL_{q,\btheta}(\bx)
$$

</div>

---
clicks: 0
sourceFrame: "auto: Amortized Inference"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Latent Variable Models (LVM) (continued)</div></div>
<div class="outline-item"><span>02</span><div>Variational Evidence Lower Bound (ELBO)</div></div>
<div class="outline-item current"><span>03</span><div>Amortized Inference</div></div>
<div class="outline-item"><span>04</span><div>ELBO Gradients, Reparametrization Trick</div></div>
<div class="outline-item"><span>05</span><div>Variational Autoencoder (VAE)</div></div>

</div>

---
clicks: 3
sourceFrame: "14"
class: theorems
---

# Parametric Variable Posterior

<div class="block">

## Variational Posterior

$$
q^*(\bz)=\argmax_q\cL_{q,\btheta^*}(\bx)=\argmin_q\KL(q\|p)=p_{\btheta^*}(\bz|\bx).
$$

<div v-click="1">

- <span style="color: #8854c0">$p_{\btheta^*}(\bz|\bx)$ may be <b>intractable</b>;</span>
- <span style="color: teal">$q(\bz)$ is individual for each data point $\bx$.</span>

</div>
</div>
<div class="block" v-click="2">

## Amortized Variational Inference

We restrict the family of possible distributions $q(\bz)$ to a parametric class $q_{\bphi}(\bz|\bx)$, <span style="color: teal">conditioned on data $\bx$</span> and <span style="color: #8854c0">parameterized by $\bphi$</span>.

</div>
<div class="block" v-click="3">

## Gradient Update

$$
\begin{bmatrix}\bphi_k\\\btheta_k\end{bmatrix}
=\left.\begin{bmatrix}
\bphi_{k-1}+\eta\cdot\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)\\
\btheta_{k-1}+\eta\cdot\nabla_{\btheta}\cL_{\bphi,\btheta}(\bx)
\end{bmatrix}\right|_{(\bphi_{k-1},\btheta_{k-1})}
$$

</div>

---
clicks: 3
sourceFrame: "extension: 14"
class: theorems
---

# Amortized Inference: One Shared Encoder

<div class="amort-columns">
<section>
<h2>Optimize separately for each observation</h2>
<div class="amort-rows">
<div class="amort-row"><span><L3Math formula="\bx_1" /></span><b>→</b><div>Fit parameters of <L3Math formula="q_1" /></div><b>→</b><span><L3Math formula="q_1(\bz)" /></span></div>
<div class="amort-row"><span><L3Math formula="\bx_2" /></span><b>→</b><div>Fit parameters of <L3Math formula="q_2" /></div><b>→</b><span><L3Math formula="q_2(\bz)" /></span></div>
<div class="amort-row"><span><L3Math formula="\bx_3" /></span><b>→</b><div>Fit parameters of <L3Math formula="q_3" /></div><b>→</b><span><L3Math formula="q_3(\bz)" /></span></div>
</div>
<p class="amort-caption">A separate optimization problem for each new input.</p>
</section>
<section>
<h2 v-click="1">Learn one shared mapping</h2>
<div v-click="1" class="amort-inputs"><span><L3Math formula="\bx_1" /></span><span><L3Math formula="\bx_2" /></span><span><L3Math formula="\bx_3" /></span></div>
<div v-click="1" class="amort-network">
<div class="amort-arrows"><span>↓</span><span>↓</span><span>↓</span></div>
<div class="amort-encoder">Encoder with shared parameters <L3Math formula="\bphi" /></div>
</div>
<div v-click="2" class="amort-output">
<div class="amort-arrows"><span>↓</span><span>↓</span><span>↓</span></div>
<div class="amort-distributions"><span><L3Math formula="q_{\bphi}(\bz|\bx_1)" /></span><span><L3Math formula="q_{\bphi}(\bz|\bx_2)" /></span><span><L3Math formula="q_{\bphi}(\bz|\bx_3)" /></span></div>
</div>
<p v-click="2" class="amort-caption">After training, a forward pass predicts the variational distribution for a new input.</p>
</section>
</div>
<div v-click="3" class="takeaway">The variational distribution is conditioned on each input. The same parameters <L3Math formula="\bphi" /> are reused to produce all of them.</div>

<style scoped>
.amort-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 24px; }
.amort-columns h2 { min-height: 30px; }
.amort-rows { display: flex; flex-direction: column; gap: 24px; margin-top: 18px; }
.amort-row { display: flex; align-items: center; justify-content: space-between; gap: 9px; min-height: 61px; }
.amort-row > div { border: 1px solid #bbced8; padding: 10px 12px; border-radius: 6px; }
.amort-row b { color: #587083; }
.amort-caption { min-height: 68px; margin-top: 22px !important; }
.amort-inputs, .amort-arrows, .amort-distributions { display: grid; grid-template-columns: repeat(3,1fr); text-align: center; gap: 10px; }
.amort-inputs { min-height: 50px; align-items: center; }
.amort-arrows { color: #8854c0; font-size: 31px; line-height: 40px; }
.amort-encoder { border: 2px solid #8854c0; padding: 16px 8px; background: #f5f0fa; text-align: center; border-radius: 6px; }
.amort-distributions { min-height: 66px; align-items: center; color: #007f82; }
.takeaway { margin-top: 22px !important; }
</style>

<div class="source"><a href="https://arxiv.org/abs/1312.6114">Kingma D.P., Welling M. Auto-Encoding Variational Bayes, 2013</a></div>

---
clicks: 0
sourceFrame: "15"
class: theorems
---

# ELBO Optimization

<div class="block">

## Gradient Update

$$
\begin{bmatrix}\bphi_k\\\btheta_k\end{bmatrix}
=\left.\begin{bmatrix}
\bphi_{k-1}+\eta\cdot\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)\\
\btheta_{k-1}+\eta\cdot\nabla_{\btheta}\cL_{\bphi,\btheta}(\bx)
\end{bmatrix}\right|_{(\bphi_{k-1},\btheta_{k-1})}
$$

</div>

<img src="/figs/em_bishop4.png" alt="Joint updates of the variational and generative parameters improve the ELBO" class="wide-figure" style="height: 340px; margin-top: 24px; margin-bottom: 12px" />

<div style="text-align: center">

For fixed $\btheta$, optimizing $\bphi$ within a restricted family need not close the KL gap.

</div>

<div class="source">Bishop C., Deep Learning: Foundations and Concepts, 2024</div>

---
clicks: 2
sourceFrame: "16"
class: theorems
---

# ELBO Optimization

<div class="block">

## ELBO

$$
\log\pt(\bx)=\cL_{\bphi,\btheta}(\bx)+\KL(q_{\bphi}(\bz|\bx)\|\pt(\bz|\bx))\geq\cL_{\bphi,\btheta}(\bx).
$$

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_q\log\pt(\bx|\bz)-\KL(q_{\bphi}(\bz|\bx)\|p(\bz))
$$

</div>
<div class="block" v-click="1">

## Gradient Update

$$
\begin{bmatrix}\bphi_k\\\btheta_k\end{bmatrix}
=\left.\begin{bmatrix}
\bphi_{k-1}+\eta\cdot\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)\\
\btheta_{k-1}+\eta\cdot\nabla_{\btheta}\cL_{\bphi,\btheta}(\bx)
\end{bmatrix}\right|_{(\bphi_{k-1},\btheta_{k-1})}
$$

- $\bphi$ denotes the parameters of the variational posterior $q_{\bphi}(\bz|\bx)$ (encoder).
- $\btheta$ represents the parameters of the generative model $\pt(\bx|\bz)$ (decoder).

</div>
<div v-click="2">

The remaining step is to obtain **unbiased** Monte Carlo estimates of the gradients: $\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)$ and $\nabla_{\btheta}\cL_{\bphi,\btheta}(\bx)$.

</div>

---
clicks: 0
sourceFrame: "auto: ELBO Gradients, Reparametrization Trick"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Latent Variable Models (LVM) (continued)</div></div>
<div class="outline-item"><span>02</span><div>Variational Evidence Lower Bound (ELBO)</div></div>
<div class="outline-item"><span>03</span><div>Amortized Inference</div></div>
<div class="outline-item current"><span>04</span><div>ELBO Gradients, Reparametrization Trick</div></div>
<div class="outline-item"><span>05</span><div>Variational Autoencoder (VAE)</div></div>

</div>

---
clicks: 5
sourceFrame: "17"
class: theorems
---

# ELBO Gradients: $\nabla_{\btheta}\cL_{\bphi,\btheta}(\bx)$

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_q\log\pt(\bx|\bz)-\KL(q_{\bphi}(\bz|\bx)\|p(\bz))
$$

<div class="block" v-click="1">

## Gradient $\nabla_{\btheta}\cL_{\bphi,\btheta}(\bx)$

<div class="gradient-cue"><strong><L3Math formula="q_{\bphi}(\bz|\bx)" /> is independent of <L3Math formula="\btheta" />.</strong> Differentiate the decoder.</div>

$$ {1|1-2|all} {at:2}
\begin{aligned}
\nabla_{\btheta}\cL_{\bphi,\btheta}(\bx)&={\color{olive}\nabla_{\btheta}}\int q_{\bphi}(\bz|\bx){\color{teal}\log\pt(\bx|\bz)}d\bz\\
&=\int q_{\bphi}(\bz|\bx){\color{olive}\nabla_{\btheta}}{\color{teal}\log\pt(\bx|\bz)}d\bz\\
&\approx\nabla_{\btheta}{\color{teal}\log\pt(\bx|\bz^*)},\quad\bz^*\sim q_{\bphi}(\bz|\bx).
\end{aligned}
$$

</div>
<div class="block" v-click="4">

## Naive Monte Carlo Estimation

$$
\log\pt(\bx)\geq\int\log\pt(\bx|\bz)p(\bz)d\bz\approx\frac{1}{K}\sum_{k=1}^K\log\pt(\bx|\bz_k),\quad\bz_k\sim p(\bz).
$$

</div>
<div v-click="5">

Prior samples do not depend on $\bx$ and may reconstruct it poorly. We train $q_{\bphi}(\bz|\bx)$ to favor latent values that reconstruct this particular observation.

</div>

<div class="source"><a href="https://jmtomczak.github.io/blog/4/4_VAE.html">Image credit: https://jmtomczak.github.io/blog/4/4_VAE.html</a></div>


<style scoped>
.gradient-cue { font-size: 20px; margin: 7px 0 11px; }
</style>
---
clicks: 3
sourceFrame: "18"
class: theorems
---

# ELBO Gradients: $\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)$

<div class="block">

## Gradient $\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)$

Unlike the $\btheta$-gradient, we must account for **the dependence of $q_{\bphi}(\bz|\bx)$ on $\bphi$**:

$$ {1|all} {at:1}
\begin{aligned}
\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)&={\color{olive}\nabla_{\bphi}}\int {\color{#8854c0}q_{\bphi}(\bz|\bx)}\log\pt(\bx|\bz)d\bz-\nabla_{\bphi}\KL(q_{\bphi}(\bz|\bx)\|p(\bz))\\
&{\color{#8854c0}\neq}\int {\color{#8854c0}q_{\bphi}(\bz|\bx)}{\color{olive}\nabla_{\bphi}}\log\pt(\bx|\bz)d\bz-\nabla_{\bphi}\KL(q_{\bphi}(\bz|\bx)\|p(\bz))
\end{aligned}
$$

</div>
<div class="block" v-click="2">

## Reparametrization: A Gaussian Example

Let the **encoder** predict the mean and standard deviation of a Gaussian:

$$
q_{\bphi}(\bz|\bx)=\cN(\bmu_{\bphi}(\bx),\bsigma^2_{\bphi}(\bx)).
$$

$$
\bepsilon\sim\cN(0,\bI),\qquad\bz=\bmu_{\bphi}(\bx)+\bsigma_{\bphi}(\bx)\odot\bepsilon.
$$

Sample standard Gaussian noise, then **scale and shift it**.

<div v-click="3">

Average the reconstruction term over noise whose distribution **does not depend on $\bphi$**:

$$
\bbE_{\bz\sim q_{\bphi}(\bz|\bx)}\log\pt(\bx|\bz)
=\bbE_{\bepsilon\sim\cN(0,\bI)}\log\pt\left(\bx|\bmu_{\bphi}(\bx)+\bsigma_{\bphi}(\bx)\odot\bepsilon\right).
$$

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/1312.6114">Kingma D.P., Welling M. Auto-Encoding Variational Bayes, 2013</a></div>

---
clicks: 3
sourceFrame: "19"
class: theorems
---

# Reparametrization Trick

<div class="block">

## From the Gaussian Example to a General Transformation

Write the previous scale and shift as $\bz=\bg_{\bphi}(\bx,\bepsilon)$. More generally, let a **differentiable** $\bg_{\bphi}$ transform noise $\bepsilon\sim p(\bepsilon)$ into samples $\bz\sim q_{\bphi}(\bz|\bx)$, with $p(\bepsilon)$ independent of $\bphi$.

The expectation is unchanged (LOTUS):

$$
\bbE_{\bz\sim q_{\bphi}(\bz|\bx)}\bff(\bz)=\bbE_{\bepsilon\sim p(\bepsilon)}\bff(\bg_{\bphi}(\bx,\bepsilon)).
$$

</div>
<div class="block" v-click="1">

## Differentiate through the Transformation

$$ {1|all} {at:2}
\begin{aligned}
\nabla_{\bphi}\int q_{\bphi}(\bz|\bx)\bff(\bz)d\bz&={\color{olive}\nabla_{\bphi}}\int p(\bepsilon)\bff({\color{#8854c0}\bg_{\bphi}(\bx,\bepsilon)})d\bepsilon\\
&=\int p(\bepsilon){\color{olive}\nabla_{\bphi}}\bff({\color{#8854c0}\bg_{\bphi}(\bx,\bepsilon)})d\bepsilon\approx\nabla_{\bphi}\bff(\bg_{\bphi}(\bx,\bepsilon^*)),
\end{aligned}
$$

<div v-click="2">

where $\bepsilon^*\sim p(\bepsilon)$.

</div>
</div>
<div class="takeaway" v-click="3">

During backpropagation, **keep $\bepsilon^*$ fixed** and differentiate through $\bg_{\bphi}(\bx,\bepsilon^*)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/1312.6114">Kingma D.P., Welling M. Auto-Encoding Variational Bayes, 2013</a></div>

---
clicks: 4
sourceFrame: "20"
class: theorems
---

# ELBO Gradients: $\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)$

$$
\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)
={\color{#8854c0}\nabla_{\bphi}\int q_{\bphi}(\bz|\bx)\log\pt(\bx|\bz)d\bz}
-{\color{teal}\nabla_{\bphi}\KL(q_{\bphi}(\bz|\bx)\|p(\bz))}
$$

<div class="block" v-click="1">

## Reconstruction Term (Reparametrization Trick)

$$
\begin{aligned}
{\color{#8854c0}\nabla_{\bphi}\int q_{\bphi}(\bz|\bx)\log\pt(\bx|\bz)d\bz}
&=\int p(\bepsilon)\nabla_{\bphi}\log\pt(\bx|\bg_{\bphi}(\bx,\bepsilon))d\bepsilon\\
&\approx\nabla_{\bphi}\log\pt\left(\bx|\bsigma_{\bphi}(\bx)\odot\bepsilon^*+\bmu_{\bphi}(\bx)\right),
\end{aligned}
$$

where $\bepsilon^*\sim\cN(0,\bI)$; **differentiate through $\bg_{\bphi}(\bx,\bepsilon^*)$**.

<div v-click="2">

The **encoder** predicts $\bmu_{\bphi}(\bx)$ and $\bsigma_{\bphi}(\bx)$; the **decoder** defines $\pt(\bx|\bz)$.<br>
To update $\bphi$, backpropagate $\log\pt(\bx|\bz)$ through $\bz$, keeping $\btheta$ fixed.

</div>
</div>
<div class="block" v-click="3">

## KL Term

$p(\bz)$ is the prior over latents $\bz$, typically $p(\bz)=\cN(0,\bI)$.

$$
{\color{teal}\nabla_{\bphi}\KL(q_{\bphi}(\bz|\bx)\|p(\bz))}
=\nabla_{\bphi}\KL\left(\cN(\bmu_{\bphi}(\bx),\bsigma^2_{\bphi}(\bx))\|\cN(0,\bI)\right)
$$

<div v-click="4">

This expression admits a closed-form analytic solution.

</div>
</div>

---
clicks: 0
sourceFrame: "auto: Variational Autoencoder (VAE)"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Latent Variable Models (LVM) (continued)</div></div>
<div class="outline-item"><span>02</span><div>Variational Evidence Lower Bound (ELBO)</div></div>
<div class="outline-item"><span>03</span><div>Amortized Inference</div></div>
<div class="outline-item"><span>04</span><div>ELBO Gradients, Reparametrization Trick</div></div>
<div class="outline-item current"><span>05</span><div>Variational Autoencoder (VAE)</div></div>

</div>

---
clicks: 0
sourceFrame: "imported: 4:7"
class: theorems
---

# Generative Models Taxonomy

<TaxonomyDiagram variational-autoencoder class="taxonomy" />

---
clicks: 2
sourceFrame: "imported: 4:8"
class: theorems
---

# Variational Autoencoder (VAE)

<div class="block">

## Training

<ol>
<li>

Sample $\bx\sim\pd(\bx)$, $\bepsilon\sim p(\bepsilon)$.

</li>
<li>

Reparametrize $\bz=\bg_{\bphi}(\bx,\bepsilon)$.

</li>
<li>

Compute the ELBO:

$$
\cL_{\bphi,\btheta}(\bx)\approx\log\pt(\bx|\bz)-\KL(q_{\bphi}(\bz|\bx)\|p(\bz)).
$$

</li>
<li>

Update $\bphi$, $\btheta$ via stochastic gradient ascent.

</li>
</ol>
</div>
<div class="block" v-click="1">

## Sampling

1. Sample $\bz\sim p(\bz)=\cN(0,\bI)$.
2. Sample $\bx\sim\pt(\bx|\bz)$.

</div>
<div v-click="2">

**Note:** The encoder $q_{\bphi}(\bz|\bx)$ isn't needed during generation.

</div>

<div class="source"><a href="https://arxiv.org/abs/1312.6114">Kingma D.P., Welling M. Auto-Encoding Variational Bayes, 2013</a></div>

---
clicks: 1
sourceFrame: "imported: 4:9"
class: theorems
---

# Variational Autoencoder

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_q\log\pt(\bx|\bz)-\KL(q_{\bphi}(\bz|\bx)\|p(\bz))
$$

<div class="columns balanced" style="grid-template-columns: 3fr 2fr; gap: 28px; margin: 22px 0">
<img src="/figs/VAE.png" alt="Variational autoencoder with stochastic encoder and decoder" class="wide-figure" style="height: 280px; margin: 0" />
<img src="/figs/vae_scheme.png" alt="Probabilistic graphical model for the variational autoencoder" class="wide-figure" style="height: 280px; margin: 0" />
</div>
<div v-click="1">

VAEs are widely used as a preliminary stage of projecting data onto low-dimensional space.

</div>

<div class="source"><a href="http://ijdykeman.github.io/ml/2016/12/21/cvae.html">image credit: http://ijdykeman.github.io/ml/2016/12/21/cvae.html</a><br><a href="https://arxiv.org/abs/1906.02691">Kingma D. P., Welling M., An Introduction to Variational Autoencoders, 2019</a></div>

---
clicks: 0
sourceFrame: "imported: 4:10"
class: theorems
---

# Variational Autoencoder

- The **encoder** predicts $\bmu_{\bphi}(\bx)$ and $\bsigma_{\bphi}(\bx)$, which parameterize $q_{\bphi}(\bz|\bx)$.
- The **decoder** predicts the parameters of the observed data distribution $\pt(\bx|\bz)$.

<img src="/figs/vae-encoder.png" alt="Encoder predicts a Gaussian distribution in latent space" class="wide-figure" style="height: 170px; margin: 14px auto" />
<img src="/figs/vae-decoder.png" alt="Decoder predicts the parameters of the observed data distribution" class="wide-figure" style="height: 190px; margin: 14px auto" />

<div class="source"><a href="https://arxiv.org/abs/2403.18103">Chan S., Tutorial on Diffusion Models for Imaging and Vision, 2024</a></div>

---
clicks: 1
sourceFrame: "imported: 4:11"
class: theorems
---

# VAE vs Normalizing Flows

|  | VAE | NF |
|---|---|---|
| Objective | ELBO $\cL$ | Forward KL/MLE |
| Encoder | stochastic<br>$\bz\sim q_{\bphi}(\bz\vert \bx)$ | deterministic<br>$\bz=\bff_{\btheta}(\bx)$<br>$q_{\btheta}(\bz\vert \bx)=\delta(\bz-\bff_{\btheta}(\bx))$ |
| Decoder | stochastic<br>$\bx\sim\pt(\bx\vert \bz)$ | deterministic<br>$\bx=\bff^{-1}_{\btheta}(\bz)$<br>$\pt(\bx\vert \bz)=\delta(\bx-\bff^{-1}_{\btheta}(\bz))$ |
| Parameters | $\bphi,\btheta$ | $\btheta\equiv\bphi$ |

<div class="block" v-click="1">

## Theorem

MLE for a normalizing flow is equivalent to maximizing the ELBO for a VAE where:

$$
\pt(\bx|\bz)=\delta(\bx-\bff^{-1}_{\btheta}(\bz));\quad q_{\btheta}(\bz|\bx)=\delta(\bz-\bff_{\btheta}(\bx)).
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2007.02731">Nielsen D., et al., SurVAE Flows: Surjections to Bridge the Gap Between VAEs and Flows, 2020</a></div>

---
clicks: 0
sourceFrame: "21"
class: summary
---

# Summary

- LVMs maximize the variational evidence lower bound (ELBO) to obtain maximum likelihood estimates for the parameters.
- Parametric posterior distribution $q_{\bphi}(\bz|\bx)$ makes the method scalable.
- The reparametrization trick provides unbiased gradients with respect to the variational posterior $q_{\bphi}(\bz|\bx)$.
- A VAE combines a stochastic encoder $q_{\bphi}(\bz|\bx)$ with a stochastic decoder $\pt(\bx|\bz)$.
- Sampling uses the prior and decoder; the encoder is not needed.
