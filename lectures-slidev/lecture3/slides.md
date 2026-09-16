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
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## NF Log-Likelihood

$$
\log\pt(\bx)=\log p(\bff_{\btheta}(\bx))+\log|\det(\bJ_\bff)|
$$

</div>

The principal computational challenge is evaluating the Jacobian determinant.

$$
\bz=\bff_{\btheta}(\bx)=\bW\bx,\quad\bW\in\bbR^{m\times m},\quad\bJ_\bff=\bW
$$

<div class="block">

## Structured Factors

Structured factorizations (e.g. LU or QR) simplify determinant and inverse calculations. Keep triangular diagonals nonzero to preserve invertibility.

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

<img v-click="1" src="/figs/lvm_diagram.png" alt="A latent prior and decoder generate observations from latent samples" class="figure-top" style="height: 210px" />

<div class="block" v-click="2">

## Naive Monte Carlo Estimation

$$
\log\pt(\bx)=\log\bbE_{p(\bz)}\pt(\bx|\bz)\geq\bbE_{p(\bz)}\log\pt(\bx|\bz)\approx\frac{1}{K}\sum_{k=1}^K\log\pt(\bx|\bz_k),
$$

where $\bz_k\sim p(\bz)$.

<div v-click="3">

**Challenge:** As the dimensionality of $\bz$ increases, the number of samples needed to adequately cover the latent space grows exponentially.

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

</div>

---
clicks: 5
sourceFrame: "10"
class: theorems derivation
---

# ELBO Derivation I

<div class="block">

## Bayes theorem

$$
\pt(\bz|\bx)=\frac{\pt(\bx,\bz)}{\pt(\bx)}\quad\Rightarrow\quad\pt(\bx)=\frac{\pt(\bx,\bz)}{\pt(\bz|\bx)}
$$

</div>
<div class="block" v-click="1">

## Log likelihood

<div class="math-chain">

$\displaystyle\log\pt(\bx)=\int q(\bz)\log\pt(\bx)d\bz$
<span v-click="2">$\displaystyle=\bbE_q\log\left[\frac{\pt(\bx,\bz)}{\pt(\bz|\bx)}\right]$</span>
</div>
<div v-click="3">

$$
\phantom{\log\pt(\bx)}=\bbE_q\log\left[\frac{\pt(\bx,\bz){\color{teal}q(\bz)}}{\pt(\bz|\bx){\color{teal}q(\bz)}}\right]
$$

</div>
<div v-click="4">

$$
\phantom{\log\pt(\bx)}=\bbE_q\log\frac{\pt(\bx,\bz)}{q(\bz)}+\bbE_q\log\frac{q(\bz)}{\pt(\bz|\bx)}
$$

</div>
</div>
<div v-click="5">

- Here, $q(\bz)$ is any distribution such that $\int q(\bz)d\bz=1$.
- <span style="color: var(--muted)">We assume that $\supp(q(\bz))=\supp(\pt(\bz|\bx))=\bbR^d$.</span>

</div>

---
clicks: 6
sourceFrame: "11"
class: theorems derivation
---

# ELBO Derivation II

<div class="block">

## Variational Decomposition

$$
\log\pt(\bx)=\bbE_q\log\frac{\pt(\bx,\bz)}{q(\bz)}+\bbE_q\log\frac{q(\bz)}{\pt(\bz|\bx)}
$$

<div class="math-chain" v-click="1">

$\displaystyle\phantom{\log\pt(\bx)}=\cL_{q,\btheta}(\bx)+{\color{#8854c0}\KL(q(\bz)\|\pt(\bz|\bx))}$
<span v-click="2">$\displaystyle\geq\cL_{q,\btheta}(\bx)$</span>
</div>
</div>
<div class="block" v-click="3">

## Variational Evidence Lower Bound (ELBO)

$$
\cL_{q,\btheta}(\bx)=\bbE_q\log\frac{\pt(\bx,\bz)}{q(\bz)}\leq\log\pt(\bx)
$$

</div>
<ul>
<li v-click="4">

This inequality holds for any choice of $q(\bz)$.

</li>
<li v-click="5">

Instead of maximizing the likelihood, maximize the ELBO:

$$
\max_{\btheta}\pt(\bx)\quad\rightarrow\quad\max_{q,\btheta}\cL_{q,\btheta}(\bx)
$$

</li>
<li v-click="6">

Distribution $q(\bz)$ is treated as **variational** parameter.

</li>
</ul>

---
clicks: 5
sourceFrame: "12"
class: theorems interactive-slide derivation
---

# Variational Evidence Lower Bound (ELBO)

$$
\log\pt(\bx)=\cL_{q,\btheta}(\bx)+\KL(q(\bz)\|\pt(\bz|\bx))
$$

What is the optimal distribution $q^*(\bz)$ given fixed $\btheta^*$?

<div v-click="1">

$$
q^*(\bz)=\argmax_q\cL_{q,\btheta^*}(\bx)
$$

<div class="math-chain" v-click="2">

$\displaystyle\phantom{q^*(\bz)}=\argmin_q\KL(q(\bz)\|p_{\btheta^*}(\bz|\bx))$
<span v-click="3">$\displaystyle=p_{\btheta^*}(\bz|\bx).$</span>
</div>
</div>
<div v-click="4">

Here we got the intuition about variational distribution $q(\bz)$: it estimates the posterior $p_{\btheta^*}(\bz|\bx)$.

</div>
<ElboDemo v-click="5" />

<div class="source">Bishop C. Pattern Recognition and Machine Learning, 2006</div>

---
clicks: 6
sourceFrame: "13"
class: theorems derivation
---

# Variational Evidence Lower Bound (ELBO)

$$ {1|1-2|all} {at:1}
\begin{aligned}
\cL_{q,\btheta}(\bx)&=\int q(\bz)\log\frac{{\color{#8854c0}\pt(\bx,\bz)}}{{\color{teal}q(\bz)}}d\bz\\
&=\int q(\bz)\log{\color{#8854c0}\pt(\bx|\bz)}d\bz+\int q(\bz)\log\frac{{\color{#8854c0}p(\bz)}}{{\color{teal}q(\bz)}}d\bz\\
&=\bbE_q\log\pt(\bx|\bz)-\KL(q(\bz)\|p(\bz))
\end{aligned}
$$

<div class="block" v-click="3">

## Log-Likelihood Decomposition

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
<div class="amort-inputs"><span><L3Math formula="\bx_1" /></span><span><L3Math formula="\bx_2" /></span><span><L3Math formula="\bx_3" /></span></div>
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

<img src="/figs/em_bishop4.png" alt="Joint updates of the variational and generative parameters improve the ELBO" class="wide-figure" style="height: 340px; margin-top: 24px" />

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

- $\bphi$ denotes the parameters of the variational posterior $q_{\bphi}(\bz|\bx)$.
- $\btheta$ represents the parameters of the generative model $\pt(\bx|\bz)$.

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

</div>

---
clicks: 5
sourceFrame: "17"
class: theorems derivation
---

# ELBO Gradients: $\nabla_{\btheta}\cL_{\bphi,\btheta}(\bx)$

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_q\log\pt(\bx|\bz)-\KL(q_{\bphi}(\bz|\bx)\|p(\bz))
$$

<div class="block" v-click="1">

## Gradient $\nabla_{\btheta}\cL_{\bphi,\btheta}(\bx)$

<div class="gradient-cue"><span v-mark="{ at: 2, type: 'underline', color: '#007f82' }"><L3Math formula="q_{\bphi}(\bz|\bx)" /> is independent of <L3Math formula="\btheta" />.</span> Differentiate the decoder.</div>

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

The variational posterior $q_{\bphi}(\bz|\bx)$ typically concentrates more probability mass in a much smaller region than the prior $p(\bz)$.

</div>

<div class="source"><a href="https://jmtomczak.github.io/blog/4/4_VAE.html">Image credit: https://jmtomczak.github.io/blog/4/4_VAE.html</a></div>


<style scoped>
.gradient-cue { font-size: 20px; margin: 7px 0 11px; }
</style>
---
clicks: 3
sourceFrame: "18"
class: theorems derivation
---

# ELBO Gradients: $\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)$

<div class="block">

## Gradient $\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)$

Unlike the $\btheta$-gradient, the density <span v-mark="{ at: 1, type: 'underline', color: '#8854c0' }">$q_{\bphi}(\bz|\bx)$ now depends on $\bphi$</span>, so standard Monte Carlo estimation can't be applied:

$$ {1|all} {at:1}
\begin{aligned}
\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)&={\color{olive}\nabla_{\bphi}}\int {\color{#8854c0}q_{\bphi}(\bz|\bx)}\log\pt(\bx|\bz)d\bz-\nabla_{\bphi}\KL(q_{\bphi}(\bz|\bx)\|p(\bz))\\
&{\color{#8854c0}\neq}\int {\color{#8854c0}q_{\bphi}(\bz|\bx)}{\color{olive}\nabla_{\bphi}}\log\pt(\bx|\bz)d\bz-\nabla_{\bphi}\KL(q_{\bphi}(\bz|\bx)\|p(\bz))
\end{aligned}
$$

</div>
<div class="block" v-click="2">

## Reparametrization Trick (LOTUS Trick)

Assume $\bz\sim q_{\bphi}(\bz|\bx)$ is generated by a random variable $\bepsilon\sim p(\bepsilon)$ via a deterministic mapping $\bz=\bg_{\bphi}(\bx,\bepsilon)$. Then,

$$
\bbE_{\bz\sim q_{\bphi}(\bz|\bx)}\bff(\bz)=\bbE_{\bepsilon\sim p(\bepsilon)}\bff(\bg_{\bphi}(\bx,\bepsilon))
$$

<div v-click="3">

**Note:** The LHS expectation is with respect to the parametric distribution $q_{\bphi}(\bz|\bx)$, while the RHS uses <span v-mark="{ at: 3, type: 'underline', color: '#007f82' }">$p(\bepsilon)$</span>, which does not depend on $\bphi$.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/1312.6114">Kingma D.P., Welling M. Auto-Encoding Variational Bayes, 2013</a></div>

---
clicks: 2
sourceFrame: "19"
class: theorems derivation
---

# ELBO Gradients: $\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)$

<div class="block">

## Reparametrization Trick (LOTUS Trick)

$$
\nabla_{\bphi}\int q_{\bphi}(\bz|\bx)\bff(\bz)d\bz={\color{olive}\nabla_{\bphi}}\int p(\bepsilon)\bff({\color{#8854c0}\bg_{\bphi}(\bx,\bepsilon)})d\bepsilon
$$

<div v-click="1">

$$
\phantom{\nabla_{\bphi}\int q_{\bphi}(\bz|\bx)\bff(\bz)d\bz}
=\int p(\bepsilon){\color{olive}\nabla_{\bphi}}\bff({\color{#8854c0}\bg_{\bphi}(\bx,\bepsilon)})d\bepsilon\approx\nabla_{\bphi}\bff(\bg_{\bphi}(\bx,\bepsilon^*)),
$$

where $\bepsilon^*\sim p(\bepsilon)$.

</div>
</div>
<div class="block" v-click="2">

## Variational Assumption

$$
p(\bepsilon)=\cN(0,\bI);\quad\bz=\bg_{\bphi}(\bx,\bepsilon)=\bsigma_{\bphi}(\bx)\odot\bepsilon+\bmu_{\bphi}(\bx);
$$

$$
q_{\bphi}(\bz|\bx)=\cN(\bmu_{\bphi}(\bx),\bsigma^2_{\bphi}(\bx)).
$$

Here, $\bmu_{\bphi}(\cdot)$ and $\bsigma_{\bphi}(\cdot)$ are <span v-mark="{ at: 2, type: 'underline', color: '#8854c0' }">parameterized functions</span> (outputs of a neural network).

Thus, we can write $q_{\bphi}(\bz|\bx)=\NN_{e,\bphi}(\bx)$, the **encoder**.

</div>

<div class="source"><a href="https://arxiv.org/abs/1312.6114">Kingma D.P., Welling M. Auto-Encoding Variational Bayes, 2013</a></div>

---
clicks: 4
sourceFrame: "20"
class: theorems derivation
---

# ELBO Gradient: $\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)$

$$
\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)
={\color{#8854c0}\nabla_{\bphi}\int q_{\bphi}(\bz|\bx)\log\pt(\bx|\bz)d\bz}
-{\color{teal}\nabla_{\bphi}\KL(q_{\bphi}(\bz|\bx)\|p(\bz))}
$$

<div class="block" v-click="1">

## Reconstruction Term

$$
\begin{aligned}
{\color{#8854c0}\nabla_{\bphi}\int q_{\bphi}(\bz|\bx)\log\pt(\bx|\bz)d\bz}
&=\int p(\bepsilon)\nabla_{\bphi}\log\pt(\bx|\bg_{\bphi}(\bx,\bepsilon))d\bepsilon\\
&\approx\nabla_{\bphi}\log\pt\left(\bx|\bsigma_{\bphi}(\bx)\odot\bepsilon^*+\bmu_{\bphi}(\bx)\right),
\end{aligned}
$$

where $\bepsilon^*\sim\cN(0,\bI)$; <span v-mark="{ at: 2, type: 'underline', color: '#8854c0' }">differentiate through $\bg_{\bphi}(\bx,\bepsilon^*)$</span>.

<div v-click="2">

The generative distribution $\pt(\bx|\bz)$ can be implemented as a neural network.<br>
We may write $\pt(\bx|\bz)=\NN_{d,\btheta}(\bz)$, called the **decoder**.

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
sourceFrame: "21"
class: summary
---

# Summary

- LVMs maximize the variational evidence lower bound (ELBO) to obtain maximum likelihood estimates for the parameters.
- Parametric posterior distribution $q_{\bphi}(\bz|\bx)$ makes the method scalable.
- The reparametrization trick provides unbiased gradients with respect to the variational posterior $q_{\bphi}(\bz|\bx)$.
