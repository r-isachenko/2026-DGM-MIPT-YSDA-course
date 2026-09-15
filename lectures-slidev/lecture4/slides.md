---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 4"
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

<div class="cover-lecture">Lecture 4</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## MLE for LVM

$$
\sum_{i=1}^n\log\pt(\bx_i)=\sum_{i=1}^n\log\int\pt(\bx_i|\bz_i)p(\bz_i)d\bz_i\rightarrow\max_{\btheta}.
$$

</div>
<div class="block">

## Naive Monte Carlo Estimation

$$
\begin{aligned}
\log\pt(\bx)&=\log\bbE_{p(\bz)}\pt(\bx|\bz)\geq\bbE_{p(\bz)}\log\pt(\bx|\bz)\\
&\approx\frac{1}{K}\sum_{k=1}^K\log\pt(\bx|\bz_k),\qquad\text{where }\bz_k\sim p(\bz).
\end{aligned}
$$

</div>
<div class="block">

## Variational Evidence Lower Bound (ELBO)

$$
\cL_{q,\btheta}(\bx)=\bbE_q\log\frac{\pt(\bx,\bz)}{q(\bz)}
$$

$$
\log\pt(\bx)=\cL_{q,\btheta}(\bx)+\KL(q(\bz)\|\pt(\bz|\bx))\geq\cL_{q,\btheta}(\bx).
$$

</div>

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Variational Evidence Lower Bound (ELBO)

$$
\cL_{q,\btheta}(\bx)=\bbE_q\log\frac{\pt(\bx,\bz)}{q(\bz)}\leq\log\pt(\bx)
$$

$$
{\color{olive}\cL_{q,\btheta}(\bx)}=\int q(\bz)\log\frac{\pt(\bx,\bz)}{q(\bz)}d\bz=\bbE_q\log\pt(\bx|\bz)-\KL(q(\bz)\|p(\bz))
$$

</div>
<div class="block">

## Log-Likelihood Decomposition

$$
\log\pt(\bx)={\color{olive}\bbE_q\log\pt(\bx|\bz)-\KL(q(\bz)\|p(\bz))}+\KL(q(\bz)\|\pt(\bz|\bx)).
$$

</div>
<ul>
<li>

Rather than maximizing likelihood, maximize the ELBO:

$$
\max_{\btheta}\pt(\bx)\quad\rightarrow\quad\max_{q,\btheta}\cL_{q,\btheta}(\bx)
$$

</li>
<li>

Maximizing the ELBO with respect to the variational distribution $q$ is equivalent to minimizing the KL divergence:

$$
\argmax_q\cL_{q,\btheta}(\bx)\equiv\argmin_q\KL(q(\bz)\|\pt(\bz|\bx)).
$$

</li>
</ul>

---
clicks: 0
sourceFrame: "4"
class: theorems
---

# Recap of Previous Lecture

$$
\begin{aligned}
\cL_{q,\btheta}(\bx)&=\bbE_q\log\pt(\bx|\bz)-\KL(q(\bz)\|p(\bz))\\
&=\bbE_q\left[\log\pt(\bx|\bz)-\log\frac{q(\bz)}{p(\bz)}\right]\rightarrow\max_{q,\btheta}.
\end{aligned}
$$

<div class="block">

## Variational Posterior

$$
q^*(\bz)=\argmax_q\cL_{q,\btheta^*}(\bx)=\argmin_q\KL(q\|p)=p_{\btheta^*}(\bz|\bx).
$$

</div>
<div class="block">

## Amortized Variational Inference

We restrict the family of possible distributions $q(\bz)$ to a parametric class $q_{\bphi}(\bz|\bx)$, <span style="color: teal">conditioned on data $\bx$</span> and <span style="color: #8854c0">parameterized by $\bphi$</span>.

</div>
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

---
clicks: 0
sourceFrame: "5"
class: theorems
---

# Recap of Previous Lecture

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_q\log\pt(\bx|\bz)-\KL(q_{\bphi}(\bz|\bx)\|p(\bz))\rightarrow\max_{\bphi,\btheta}.
$$

<div class="block">

## Gradient $\nabla_{\btheta}\cL_{\bphi,\btheta}(\bx)$

$$
\begin{aligned}
\nabla_{\btheta}\cL_{\bphi,\btheta}(\bx)&=\int q_{\bphi}(\bz|\bx)\nabla_{\btheta}\log\pt(\bx|\bz)d\bz\\
&\approx\nabla_{\btheta}\log\pt(\bx|\bz^*),\quad\bz^*\sim q_{\bphi}(\bz|\bx).
\end{aligned}
$$

</div>
<div class="block">

## Gradient $\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)$

$$
\begin{aligned}
\nabla_{\bphi}\cL_{\bphi,\btheta}(\bx)&=\int p(\bepsilon)\nabla_{\bphi}\log\pt(\bx|\bg_{\bphi}(\bx,\bepsilon))d\bepsilon-\nabla_{\bphi}\KL(q_{\bphi}(\bz|\bx)\|p(\bz))\\
&\approx\nabla_{\bphi}\log\pt(\bx|\bg_{\bphi}(\bx,\bepsilon^*))-\nabla_{\bphi}\KL(q_{\bphi}(\bz|\bx)\|p(\bz))
\end{aligned}
$$

</div>
<div class="block">

## Variational Assumption

$$
\begin{aligned}
p(\bepsilon)&=\cN(0,\bI);\quad q_{\bphi}(\bz|\bx)=\cN(\bmu_{\bphi}(\bx),\bsigma^2_{\bphi}(\bx)).\\
\bz&=\bg_{\bphi}(\bx,\bepsilon)=\bsigma_{\bphi}(\bx)\odot\bepsilon+\bmu_{\bphi}(\bx).
\end{aligned}
$$

</div>

---
clicks: 0
sourceFrame: "6"
class: theorems
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Variational Autoencoder (VAE)</div></div>
<div class="outline-item"><span>02</span><div>ELBO Surgery and Optimal VAE Prior</div></div>
<div class="outline-item"><span>03</span><div>Discrete VAE Latent Representations</div></div>
<div class="outline-item"><span>04</span><div>Vector Quantized VAE (VQ-VAE)</div></div>
<div class="outline-item"><span>05</span><div>Likelihood-Free Learning</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Variational Autoencoder (VAE)"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Variational Autoencoder (VAE)</div></div>
<div class="outline-item"><span>02</span><div>ELBO Surgery and Optimal VAE Prior</div></div>
<div class="outline-item"><span>03</span><div>Discrete VAE Latent Representations</div></div>
<div class="outline-item"><span>04</span><div>Vector Quantized VAE (VQ-VAE)</div></div>
<div class="outline-item"><span>05</span><div>Likelihood-Free Learning</div></div>

</div>

---
clicks: 0
sourceFrame: "7"
class: theorems
---

# Generative Models Taxonomy

<TaxonomyDiagram variational-autoencoder class="taxonomy" />

---
clicks: 2
sourceFrame: "8"
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
sourceFrame: "9"
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
sourceFrame: "10"
class: theorems
---

# Variational Autoencoder

- The encoder $q_{\bphi}(\bz|\bx)=\NN_{e,\bphi}(\bx)$ outputs $\bmu_{\bphi}(\bx)$ and $\bsigma_{\bphi}(\bx)$.
- The decoder $\pt(\bx|\bz)=\NN_{d,\btheta}(\bz)$ outputs parameters of the observed data distribution.

<img src="/figs/vae-encoder.png" alt="Encoder predicts a Gaussian distribution in latent space" class="wide-figure" style="height: 170px; margin: 14px auto" />
<img src="/figs/vae-decoder.png" alt="Decoder predicts the parameters of the observed data distribution" class="wide-figure" style="height: 190px; margin: 14px auto" />

<div class="source"><a href="https://arxiv.org/abs/2403.18103">Chan S., Tutorial on Diffusion Models for Imaging and Vision, 2024</a></div>

---
clicks: 1
sourceFrame: "11"
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
sourceFrame: "auto: ELBO Surgery and Optimal VAE Prior"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Variational Autoencoder (VAE)</div></div>
<div class="outline-item current"><span>02</span><div>ELBO Surgery and Optimal VAE Prior</div></div>
<div class="outline-item"><span>03</span><div>Discrete VAE Latent Representations</div></div>
<div class="outline-item"><span>04</span><div>Vector Quantized VAE (VQ-VAE)</div></div>
<div class="outline-item"><span>05</span><div>Likelihood-Free Learning</div></div>

</div>

---
clicks: 2
sourceFrame: "12"
class: theorems
---

# ELBO Surgery

$$
\frac{1}{n}\sum_{i=1}^n\cL_{\bphi,\btheta}(\bx_i)=\frac{1}{n}\sum_{i=1}^n\Bigl[\bbE_{q_{\bphi}(\bz|\bx_i)}\log\pt(\bx_i|\bz)-\KL(q_{\bphi}(\bz|\bx_i)\|p(\bz))\Bigr].
$$

<div class="block" v-click="1">

## Theorem

$$
\frac{1}{n}\sum_{i=1}^n\KL(q_{\bphi}(\bz|\bx_i)\|p(\bz))={\color{#8854c0}\KL(\qagg(\bz)\|p(\bz))}+{\color{teal}\bbI_q[\bx,\bz]};
$$

<div v-click="2">

- $\qagg(\bz)=\frac{1}{n}\sum_{i=1}^n q_{\bphi}(\bz|\bx_i)$ denotes the **aggregated** variational posterior.
- $\bbI_q[\bx,\bz]$ is the mutual information between $\bx$ and $\bz$ under the data distribution $\pd(\bx)$ and $q_{\bphi}(\bz|\bx)$.
- <span style="color: #8854c0">The first term</span> encourages $\qagg(\bz)$ to match the prior $p(\bz)$.
- <span style="color: teal">The second term</span> reduces the information about $\bx$ encoded in $\bz$.

</div>
</div>

<div class="source"><a href="http://approximateinference.org/accepted/HoffmanJohnson2016.pdf">Hoffman M. D., Johnson M. J. ELBO Surgery: Yet Another Way to Carve Up the Variational Evidence Lower Bound, 2016</a></div>

---
clicks: 4
sourceFrame: "13"
class: derivation theorems
---

# ELBO Surgery

$$
\frac{1}{n}\sum_{i=1}^n\KL(q_{\bphi}(\bz|\bx_i)\|p(\bz))=\KL(\qagg(\bz)\|p(\bz))+\bbI_q[\bx,\bz].
$$

<div class="block">

## Proof

$$ {1|1-2|1-3|all} {at:1}
\begin{aligned}
&\frac{1}{n}\sum_{i=1}^n\KL(q_{\bphi}(\bz|\bx_i)\|p(\bz))=\frac{1}{n}\sum_{i=1}^n\int q_{\bphi}(\bz|\bx_i)\log\frac{q_{\bphi}(\bz|\bx_i)}{p(\bz)}d\bz\\
&=\frac{1}{n}\sum_{i=1}^n\int q_{\bphi}(\bz|\bx_i)\log\frac{{\color{#8854c0}\qagg(\bz)}{\color{teal}q_{\bphi}(\bz|\bx_i)}}{{\color{#8854c0}p(\bz)}{\color{teal}\qagg(\bz)}}d\bz\\
&=\int\frac{1}{n}\sum_{i=1}^n q_{\bphi}(\bz|\bx_i)\log{\color{#8854c0}\frac{\qagg(\bz)}{p(\bz)}}d\bz+\frac{1}{n}\sum_{i=1}^n\int q_{\bphi}(\bz|\bx_i)\log{\color{teal}\frac{q_{\bphi}(\bz|\bx_i)}{\qagg(\bz)}}d\bz\\
&=\KL(\qagg(\bz)\|p(\bz))+\frac{1}{n}\sum_{i=1}^n\KL(q_{\bphi}(\bz|\bx_i)\|\qagg(\bz))
\end{aligned}
$$

<div v-click="4">

$$
\bbI_q[\bx,\bz]=\frac{1}{n}\sum_{i=1}^n\KL(q_{\bphi}(\bz|\bx_i)\|\qagg(\bz)).
$$

</div>
</div>

<div class="source"><a href="http://approximateinference.org/accepted/HoffmanJohnson2016.pdf">Hoffman M. D., Johnson M. J. ELBO Surgery: Yet Another Way to Carve Up the Variational Evidence Lower Bound, 2016</a></div>

---
clicks: 4
sourceFrame: "14"
class: derivation theorems
---

# ELBO Surgery

<div class="block">

## Revisiting the ELBO

$$ {1|all} {at:1}
\begin{aligned}
\frac{1}{n}\sum_{i=1}^n\cL_{\bphi,\btheta}(\bx_i)&=\frac{1}{n}\sum_{i=1}^n\left[\bbE_{q_{\bphi}(\bz|\bx_i)}\log\pt(\bx_i|\bz)-\KL(q_{\bphi}(\bz|\bx_i)\|p(\bz))\right]\\
&=\underbrace{\frac{1}{n}\sum_{i=1}^n\bbE_{q_{\bphi}(\bz|\bx_i)}\log\pt(\bx_i|\bz)}_{\text{Reconstruction Loss}}-\underbrace{\vphantom{\sum_{i=1}^n}\bbI_q[\bx,\bz]}_{\text{Mutual Information}}-\underbrace{\vphantom{\sum_{i=1}^n}\KL(\qagg(\bz)\|{\color{teal}p(\bz)})}_{\text{Marginal KL}}
\end{aligned}
$$

</div>
<div v-click="2">

The prior distribution $p(\bz)$ only appears in the last term.

</div>
<div class="block" v-click="3">

## Optimal VAE Prior

$$
\KL(\qagg(\bz)\|p(\bz))=0\quad\Leftrightarrow\quad p(\bz)=\qagg(\bz)=\frac{1}{n}\sum_{i=1}^n q_{\bphi}(\bz|\bx_i).
$$

<div v-click="4">

Hence, the optimal prior $p(\bz)$ is the aggregated variational posterior $\qagg(\bz)$.

</div>
</div>

<div class="source"><a href="http://approximateinference.org/accepted/HoffmanJohnson2016.pdf">Hoffman M. D., Johnson M. J. ELBO Surgery: Yet Another Way to Carve Up the Variational Evidence Lower Bound, 2016</a></div>

---
clicks: 1
sourceFrame: "15"
class: theorems
---

# Marginal KL

$$
\KL(\qagg(\bz)\|p(\bz))
$$

- $q_{\bphi}(\bz|\bx)=\cN(\bmu_{\bphi}(\bx),\bsigma^2_{\bphi}(\bx))$ is unimodal.
- It is generally believed that the **mismatch between** $p(\bz)$ **and** $\qagg(\bz)$ is the primary explanation for blurry VAE-generated images.

<img v-click="1" src="/figs/agg_posterior.png" alt="Mismatch between a multimodal aggregated posterior and the VAE prior" class="wide-figure" style="height: 280px; margin-top: 24px" />

<div class="source"><a href="https://arxiv.org/abs/1505.05770">Rezende D. J., Mohamed S. Variational Inference with Normalizing Flows, 2015</a></div>

---
clicks: 2
sourceFrame: "16"
class: theorems
---

# Why are VAE Generations Blurry?

Consider a Gaussian decoder $\pt(\bx|\bz)=\cN(\bmu_{\btheta}(\bz),\sigma^2\bI)$.

<div class="block" v-click="1">

## ELBO Optimization

With **fixed** encoder $q_{\bphi}(\bz|\bx)$, optimizing ELBO reduces to

$$
\argmin_{\btheta}\bbE_{\pd(\bx)q_{\bphi}(\bz|\bx)}\|\bx-\bmu_{\btheta}(\bz)\|^2
$$

The optimal decoder mean is the **conditional expectation**:

$$
\bmu^*(\bz)=\bbE_{q_{\bphi}(\bx|\bz)}[\bx]=\frac{\bbE_{\pd(\bx)}[q_{\bphi}(\bz|\bx)\cdot\bx]}{\bbE_{\pd(\bx)}[q_{\bphi}(\bz|\bx)]}
$$

</div>
<div class="block" v-click="2">

## Blurriness from Averaging

- $\pd(\bx)$ and $q_{\bphi}(\bz|\bx)$ give us the aggregated posterior $\qagg(\bz)$.
- If $\bx\neq\bx'$ map to overlapping latent regions, $\bmu^*(\bz)$ averages over unrelated inputs.
- This leads to **blurry, non-distinct outputs**.

</div>

<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

---
clicks: 0
sourceFrame: "auto: Discrete VAE Latent Representations"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Variational Autoencoder (VAE)</div></div>
<div class="outline-item"><span>02</span><div>ELBO Surgery and Optimal VAE Prior</div></div>
<div class="outline-item current"><span>03</span><div>Discrete VAE Latent Representations</div></div>
<div class="outline-item"><span>04</span><div>Vector Quantized VAE (VQ-VAE)</div></div>
<div class="outline-item"><span>05</span><div>Likelihood-Free Learning</div></div>

</div>

---
clicks: 2
sourceFrame: "17"
class: theorems
---

# Discrete VAE Latents

<div class="block">

## Motivation

- VAE has used **continuous** latent variables $\bz$.
- For some modalities, **discrete** representations $\bz$ may be a more natural choice.
- Advanced autoregressive models are highly effective for distributions over discrete variables (for example, transformers process discrete tokens).

</div>
<div class="block" v-click="1">

## ELBO

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_{q_{\bphi}(\bz|\bx)}\log\pt(\bx|\bz)-\KL(q_{\bphi}(\bz|\bx)\|p(\bz))\rightarrow\max_{\bphi,\btheta}.
$$

</div>
<div v-click="2">

- Apply the reparametrization trick to obtain unbiased gradients.
- Use Gaussian distributions for $q_{\bphi}(\bz|\bx)$ and $p(\bz)$ to compute the KL analytically.

</div>

---
clicks: 3
sourceFrame: "18"
class: derivation theorems
---

# Discrete VAE Latents

<div class="block">

## Assumptions

<ul>
<li>

Let $c\sim\Cat(\bpi)$, where

$$
\bpi=(\pi_1,\dots,\pi_K),\quad\pi_k=P(c=k),\quad\sum_{k=1}^K\pi_k=1.
$$

</li>
<li>

Suppose the VAE adopts a discrete latent variable $c$ with prior $p(c)=\Uniform\{1,\dots,K\}$.

</li>
</ul>
</div>
<div class="block" v-click="1">

## ELBO

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_{q_{\bphi}(c|\bx)}\log\pt(\bx|c)-{\color{olive}\KL(q_{\bphi}(c|\bx)\|p(c))}\rightarrow\max_{\bphi,\btheta}.
$$

$$ {1|1-2|all} {at:2}
\begin{aligned}
{\color{olive}\KL(q_{\bphi}(c|\bx)\|p(c))}&=\sum_{k=1}^K q_{\bphi}(k|\bx)\log\frac{q_{\bphi}(k|\bx)}{p(k)}\\
&={\color{#8854c0}\sum_{k=1}^K q_{\bphi}(k|\bx)\log q_{\bphi}(k|\bx)}{\color{teal}-\sum_{k=1}^K q_{\bphi}(k|\bx)\log p(k)}\\
&={\color{#8854c0}-\Ent(q_{\bphi}(c|\bx))}+{\color{teal}\log K}.
\end{aligned}
$$

</div>

---
clicks: 1
sourceFrame: "19"
class: theorems
---

# Discrete VAE Latents

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_{q_{\bphi}(c|\bx)}\log\pt(\bx|c)+\Ent(q_{\bphi}(c|\bx))-\log K\rightarrow\max_{\bphi,\btheta}.
$$

<div v-click="1">

- The encoder should output a discrete distribution $q_{\bphi}(c|\bx)$.
- We need an analogue of the reparametrization trick for discrete $q_{\bphi}(c|\bx)$.
- The decoder $\pt(\bx|c)$ must take a discrete random variable $c$ as input.

<img src="/figs/vae-encoder.png" alt="Continuous Gaussian encoder to be adapted to discrete latent variables" class="wide-figure" style="height: 145px; margin: 12px auto" />
<img src="/figs/vae-decoder.png" alt="Decoder to be conditioned on a discrete random variable" class="wide-figure" style="height: 150px; margin: 12px auto" />
</div>

<div class="source"><a href="https://arxiv.org/abs/2403.18103">Chan S., Tutorial on Diffusion Models for Imaging and Vision, 2024</a></div>

---
clicks: 0
sourceFrame: "auto: Vector Quantized VAE (VQ-VAE)"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Variational Autoencoder (VAE)</div></div>
<div class="outline-item"><span>02</span><div>ELBO Surgery and Optimal VAE Prior</div></div>
<div class="outline-item"><span>03</span><div>Discrete VAE Latent Representations</div></div>
<div class="outline-item current"><span>04</span><div>Vector Quantized VAE (VQ-VAE)</div></div>
<div class="outline-item"><span>05</span><div>Likelihood-Free Learning</div></div>

</div>

---
clicks: 2
sourceFrame: "20"
class: theorems
---

# Vector Quantization

Define the codebook (dictionary) space $\{\be_k\}_{k=1}^K$ with $\be_k\in\bbR^L$ and $K$ the number of codebook entries.

<div class="block" v-click="1">

## Quantized Representation

A quantized vector $\bz_q\in\bbR^L$, for any $\bz\in\bbR^L$, is defined via nearest-neighbor lookup in the codebook:

$$
\bz_q=\bq(\bz)=\be_{k^*},\quad\text{where }k^*=\argmin_k\|\bz-\be_k\|.
$$

</div>
<div class="block" v-click="2">

## Quantization Procedure

If the encoded tensor has spatial dimensions, quantization is independently applied to each of the $W\times H$ locations.

<div class="columns balanced" style="grid-template-columns: 13fr 7fr; gap: 20px">
<img src="/figs/fqgan_cnn.png" alt="Feature tensor produced by a convolutional encoder" class="wide-figure" style="height: 195px; margin: 0" />
<img src="/figs/fqgan_lookup.png" alt="Nearest-neighbor lookup in the codebook" class="wide-figure" style="height: 195px; margin: 0" />
</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2004.02088">Zhao Y. et al. Feature Quantization Improves GAN Training, 2020</a></div>

---
clicks: 3
sourceFrame: "21"
class: theorems
---

# Vector Quantized VAE (VQ-VAE)

- The encoder outputs a continuous vector $\bz_e=\NN_{e,\bphi}(\bx)\in\bbR^L$.
- Quantization deterministically maps $\bz_e$ to its quantized codebook vector $\bz_q$.
- The decoder is conditioned on codebook entries $\be_c$, i.e., via $\pt(\bx|\be_c)$ (instead of $\pt(\bx|c)$).

<div class="block" v-click="1">

## Deterministic Variational Posterior


$$
q_{\bphi}(c=k^*|\bx)=\begin{cases}
1,\quad\text{for }k^*=\argmin_k\|\bz_e-\be_k\|;\\
0,\quad\text{otherwise}.
\end{cases}
$$

<div v-click="2">

$$
\KL(q_{\bphi}(c|\bx)\|p(c))=-\underbrace{\Ent(q_{\bphi}(c|\bx))}_{=0}+\log K=\log K.
$$

</div>
</div>
<div v-click="3">

**Note:** The KL regularizer becomes constant and has no direct effect on the ELBO objective in this case.

</div>

<div class="source"><a href="https://arxiv.org/abs/1711.00937">Oord A., Vinyals O., Kavukcuoglu K. Neural Discrete Representation Learning, 2017</a></div>

---
clicks: 4
sourceFrame: "22"
class: theorems
---

# Vector Quantized VAE (VQ-VAE): Forward

<div class="block">

## Deterministic Variational Posterior


$$
q_{\bphi}(c=k^*|\bx)=\begin{cases}
1,\quad\text{for }k^*=\argmin_k\|\bz_e-\be_k\|;\\
0,\quad\text{otherwise}.
\end{cases}
$$

</div>
<div class="block" v-click="1">

## ELBO

<div class="math-chain" style="margin: 8px 0">
<span>

$\displaystyle\cL_{\bphi,\btheta}(\bx)=\bbE_{q_{\bphi}(c|\bx)}\log\pt(\bx|\be_c)-\log K$

</span>
<span v-click="2">

$\displaystyle{}=\log\pt(\bx|\bz_q)-\log K,$

</span>
</div>
<div v-click="2">

where $\bz_q=\be_{k^*}$, $k^*=\argmin_k\|\bz_e-\be_k\|$.

</div>
</div>
<img v-click="3" src="/figs/vqvae.png" alt="VQ-VAE forward pass through encoder, nearest codebook entry and decoder" class="wide-figure" style="height: 200px; margin: 10px auto" />
<div v-click="4">

**Challenge:** The $\argmin$ operation is non-differentiable.

</div>

<div class="source"><a href="https://arxiv.org/abs/1711.00937">Oord A., Vinyals O., Kavukcuoglu K. Neural Discrete Representation Learning, 2017</a></div>

---
clicks: 4
sourceFrame: "23"
class: derivation theorems
---

# Vector Quantized VAE (VQ-VAE): Backward

<div class="block">

## ELBO

$$
\cL_{\bphi,\btheta}(\bx)=\log\pt(\bx|\bz_q)-\log K,\quad\bz_q=\be_{k^*},\;k^*=\argmin_k\|\bz_e-\be_k\|.
$$

</div>
<img v-click="1" src="/figs/vqvae.png" alt="Quantization between the encoder output and decoder input" class="wide-figure" style="height: 170px; margin: 12px auto" />
<div class="block" v-click="2">

## Straight-Through Gradient Estimator

$$ {1|1-2|all} {at:3}
\begin{aligned}
\frac{\partial\log p(\bx|\bz_q,\btheta)}{\partial\bphi}&=\frac{\partial\log\pt(\bx|\bz_q)}{\partial\bz_q}\cdot{\color{red}\frac{\partial\bz_q}{\partial\bphi}}\\
&=\frac{\partial\log\pt(\bx|\bz_q)}{\partial\bz_q}\cdot{\color{red}\frac{\partial\bz_q}{\partial\bz_e}}\cdot\frac{\partial\bz_e}{\partial\bphi}\\
&\approx\frac{\partial\log\pt(\bx|\bz_q)}{\partial\bz_q}\cdot\frac{\partial\bz_e}{\partial\bphi}
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/1711.00937">Oord A., Vinyals O., Kavukcuoglu K. Neural Discrete Representation Learning, 2017</a></div>

---
clicks: 0
sourceFrame: "24"
class: theorems
---

# Vector Quantized VAE-2 (VQ-VAE-2)

Extension to the spatial domain: $\bc\in\{1,\dots,K\}^{W\times H}$

$$
q_{\bphi}(\bc|\bx)=\prod_{i=1}^W\prod_{j=1}^H q(c_{ij}|\bx,\bphi);\quad p(\bc)=\prod_{i=1}^W\prod_{j=1}^H\Uniform\{1,\dots,K\}.
$$

<div class="block">

## Sample Diversity

<img src="/figs/vqvae2_diversity.png" alt="Diverse image samples from VQ-VAE-2" class="wide-figure" style="height: 350px; margin: 12px auto" />
</div>

<div class="source"><a href="https://arxiv.org/abs/1906.00446">Razavi A., Oord A., Vinyals O. Generating Diverse High-Fidelity Images with VQ-VAE-2, 2019</a></div>

---
clicks: 1
sourceFrame: "25"
class: theorems
---

# Vector Quantized VAE (VQ-VAE): Final algorithm

<div class="columns" style="grid-template-columns: 2.7fr 1fr; gap: 26px">
<div class="block" style="margin: 0">

## Training

<ol style="margin: 0">
<li>

Sample $\bx\sim\pd(\bx)$.

</li>
<li>

Compute the encoding $\bz_e=\NN_{e,\bphi}(\bx)$.

</li>
<li>

Compute the quantized representation (per spatial location if applicable):

$$
k^*=\argmin_k\|\bz_e-\be_k\|_2,\quad\bz_q=\be_{k^*}.
$$

</li>
<li>

Compute the ELBO:

$$
\cL_{\bphi,\btheta}(\bx)=\log\pt(\bx|\bz_q)-\log K.
$$

</li>
<li>

Compute total loss with codebook and commitment terms:

$$
\begin{aligned}
\cL&=-\cL_{\bphi,\btheta}(\bx)+\big\|\sg[\bz_e]-\be_{k^*}\big\|_2^2\\
&\quad+\beta\big\|\bz_e-\sg[\be_{k^*}]\big\|_2^2.
\end{aligned}
$$

</li>
<li>

Update $\bphi$, $\btheta$ (straight-through estimator for the encoder).

</li>
</ol>
</div>
<div class="block" v-click="1" style="margin: 0">

## Sampling

<ol>
<li>

Sample $c\sim p(c)$<br>$=\Uniform\{1,\dots,K\}$.

</li>
<li>

Sample $\bx\sim\pt(\bx|\be_c)$.

</li>
</ol>
</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/1711.00937">Oord A., Vinyals O., Kavukcuoglu K. Neural Discrete Representation Learning, 2017</a></div>

---
clicks: 0
sourceFrame: "auto: Likelihood-Free Learning"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Variational Autoencoder (VAE)</div></div>
<div class="outline-item"><span>02</span><div>ELBO Surgery and Optimal VAE Prior</div></div>
<div class="outline-item"><span>03</span><div>Discrete VAE Latent Representations</div></div>
<div class="outline-item"><span>04</span><div>Vector Quantized VAE (VQ-VAE)</div></div>
<div class="outline-item current"><span>05</span><div>Likelihood-Free Learning</div></div>

</div>

---
clicks: 2
sourceFrame: "26"
class: theorems
---

# Likelihood-Based Models

<div class="columns" style="gap: 30px">
<div class="block" style="margin: 0">

## Poor Likelihood<br>High-Quality Samples

$$
p_1(\bx)=\frac{1}{n}\sum_{i=1}^n\cN(\bx|\bx_i,\epsilon\bI)
$$

If $\epsilon$ is very small, this model produces excellent, sharp samples but achieves poor likelihoods on test data.

</div>
<div class="block" v-click="1" style="margin: 0">

## High Likelihood<br>Poor Samples

$$
p_2(\bx)=0.01p(\bx)+0.99p_{\text{noise}}(\bx)
$$

$$
\begin{aligned}
&\log\left[0.01p(\bx)+0.99p_{\text{noise}}(\bx)\right]\\
&\quad\geq\log[0.01p(\bx)]\\
&\quad=\log p(\bx)-\log100
\end{aligned}
$$

This model contains mostly noisy, irrelevant samples; for high dimensions, $\log p(\bx)$ scales linearly with $m$.

</div>
</div>
<div v-click="2" style="margin-top: 20px">

- Likelihood isn't always a suitable metric for evaluating generative models.
- Sometimes, the likelihood function can't even be computed exactly.

</div>

<div class="source"><a href="https://arxiv.org/abs/1511.01844">Theis L., Oord A., Bethge M. A Note on the Evaluation of Generative Models, 2015</a></div>

---
clicks: 3
sourceFrame: "27"
class: theorems
---

# Likelihood-Free Learning

<div class="block">

## Motivation

We're interested in approximating the true data distribution $\pd(\bx)$.
Instead of searching over all distributions, let's learn a model $\pt(\bx)\approx\pd(\bx)$.

</div>
<div v-click="1">

Suppose we have two sets of samples:

- $\{\bx_i\}_{i=1}^{n_1}\sim\pd(\bx)$ — real data;
- $\{\bx_i\}_{i=1}^{n_2}\sim\pt(\bx)$ — generated (fake) data.

</div>
<div v-click="2">

Define a discriminative model (classifier):

$$
p(y=1|\bx)=P(\bx\sim\pd(\bx));\quad p(y=0|\bx)=P(\bx\sim\pt(\bx))
$$

</div>
<div class="block" v-click="3">

## Assumption

The generative model $\pt(\bx)$ matches $\pd(\bx)$ if a discriminative model $p(y|\bx)$ can't distinguish between them — that is, if $p(y=1|\bx)=0.5$ for every $\bx$.

</div>

---
clicks: 2
sourceFrame: "28"
class: theorems
---

# Generative Adversarial Networks (GAN)

- The more expressive the discriminator, the closer we get to the optimal $\pt(\bx)$.
- Standard classifiers are trained by minimizing cross-entropy loss $-\bbE_{\hat p(\bx,y)}\log p(y|\bx)$ with $\hat p(\bx,y)=\frac{1}{2}\bbI_{y=1}\pd(\bx)+\frac{1}{2}\bbI_{y=0}\pt(\bx)$.

<div class="block" v-click="1">

## Cross-Entropy for Discriminator

$$
\min_{p(y|\bx)}\left[-\bbE_{\pd(\bx)}\log p(y=1|\bx)-\bbE_{\pt(\bx)}\log p(y=0|\bx)\right]
$$

$$
\max_{p(y|\bx)}\left[\bbE_{\pd(\bx)}\log p(y=1|\bx)+\bbE_{\pt(\bx)}\log p(y=0|\bx)\right]
$$

</div>
<div class="block" v-click="2">

## Generative Model

Suppose $\pt(\bx,\bz)=\pt(\bx|\bz)p(\bz)$, where $p(\bz)$ is a base distribution, and $\pt(\bx|\bz)=\delta(\bx-\bG_{\btheta}(\bz))$ is deterministic.

</div>

<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a></div>

---
clicks: 3
sourceFrame: "29"
class: theorems
---

# Generative Adversarial Networks (GAN)

<div class="block">

## Cross-Entropy for Discriminative Model

$$
\max_{p(y|\bx)}\left[\bbE_{\pd(\bx)}\log p(y=1|\bx)+\bbE_{\pt(\bx)}\log p(y=0|\bx)\right]
$$

</div>
<div v-click="1">

- **Discriminator:** A classifier $p_{\bphi}(y=1|\bx)=D_{\bphi}(\bx)\in[0,1]$, distinguishing real and generated samples. The discriminator aims to **maximize** cross-entropy.
- **Generator:** The generative model $\bx=\bG_{\btheta}(\bz),\;\bz\sim p(\bz)$, seeks to fool the discriminator. The generator aims to **minimize** cross-entropy.

</div>
<div class="block" v-click="2">

## GAN Objective

$$
\min_G\max_D\left[\bbE_{\pd(\bx)}\log D(\bx)+\bbE_{\pt(\bx)}\log(1-D(\bx))\right]
$$

<div v-click="3">

$$
\min_G\max_D\left[\bbE_{\pd(\bx)}\log D(\bx)+\bbE_{p(\bz)}\log(1-D(\bG(\bz)))\right]
$$

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a></div>

---
clicks: 0
sourceFrame: "30"
class: summary
---

# Summary

<ul>
<li style="margin: 2px 0">

The VAE model is a latent variable model parameterized by two neural networks: a stochastic encoder $q_{\bphi}(\bz|\bx)$ and a stochastic decoder $\pt(\bx|\bz)$.

</li>
<li style="margin: 2px 0">

ELBO surgery gives insights into the prior's influence in VAEs; the optimal prior is the aggregated variational posterior.

</li>
<li style="margin: 2px 0">

The mismatch between $p(\bz)$ and $\qagg(\bz)$ is widely regarded as the principal reason for VAE-generated image blurriness.

</li>
<li style="margin: 2px 0">

Vector quantization provides a way to construct VAEs with discrete latents and deterministic variational posteriors.

</li>
<li style="margin: 2px 0">

The straight-through gradient estimator allows gradients to pass as if quantization were an identity operation during backpropagation.

</li>
<li style="margin: 2px 0">

Likelihood is not always a suitable metric for evaluating generative models; likelihood-free learning motivates the use of discriminative models to match distributions.

</li>
</ul>
