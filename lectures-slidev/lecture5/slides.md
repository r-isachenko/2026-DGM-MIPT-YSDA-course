---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 5"
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

<div class="cover-lecture">Lecture 5</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "2"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Training

1. Sample $\bx \sim \pd(\bx)$, $\bepsilon \sim p(\bepsilon)$.
2. Reparametrize $\bz = \bg_{\bphi}(\bx, \bepsilon)$.
3. Compute the ELBO:

$$
\cL_{\bphi,\btheta}(\bx)\approx\log\pt(\bx|\bz)-\KL(q_{\bphi}(\bz|\bx)\|p(\bz)).
$$

4. Update $\bphi$, $\btheta$ via stochastic gradient ascent.

</div>

<div class="block">

## Sampling

1. Sample $\bz \sim p(\bz)=\cN(0,\bI)$.
2. Sample $\bx \sim \pt(\bx|\bz)$.

</div>

**Note:** The encoder $q_{\bphi}(\bz|\bx)$ isn't needed during sampling.

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem

$$
\frac1n\sum_{i=1}^n\KL(q_{\bphi}(\bz|\bx_i)\,\|\,p(\bz))=\KL({\color{teal}\qagg(\bz)}\,\|\,p(\bz))+\bbI_q[\bx,\bz].
$$

</div>

<div class="block">

## Revisiting the ELBO

$$
\begin{aligned}
\frac1n\sum_{i=1}^n\cL_{\bphi,\btheta}(\bx_i)
&=\underbrace{\frac1n\sum_{i=1}^n\bbE_{q_{\bphi}(\bz|\bx_i)}\log\pt(\bx_i|\bz)}_{\text{Reconstruction Loss}}\\
&\quad-\underbrace{\bbI_q[\bx,\bz]}_{\text{Mutual Information}}
-\underbrace{\KL({\color{teal}\qagg(\bz)}\,\|\,{\color{#8854c0}p(\bz)})}_{\text{Marginal KL}}.
\end{aligned}
$$

</div>

<div class="block">

## Optimal VAE Prior

$$
\KL(\qagg(\bz)\,\|\,p(\bz))=0\ \Leftrightarrow\ p(\bz)=\qagg(\bz)=\frac1n\sum_{i=1}^nq_{\bphi}(\bz|\bx_i).
$$

Thus, the optimal prior distribution $p(\bz)$ is the aggregated variational posterior $\qagg(\bz)$.

</div>



<div class="source"><a href="http://approximateinference.org/accepted/HoffmanJohnson2016.pdf">Hoffman M. D., Johnson M. J. ELBO Surgery: Yet Another Way to Carve Up the Variational Evidence Lower Bound, 2016</a></div>

---
clicks: 0
sourceFrame: "4"
class: theorems
---

# Recap of Previous Lecture

- **Prior mismatch:** The unimodal encoder $q_{\bphi}(\bz|\bx)$ yields $\qagg(\bz)$ that often does not match the Gaussian prior $p(\bz)$.
- **Blurriness from averaging:** With Gaussian decoder, ELBO minimization gives $\bmu^*(\bz)=\bbE_{q_{\bphi}(\bx|\bz)}[\bx]$. If distinct inputs $\bx\neq\bx'$ map to *overlapping* latent regions, the decoder averages over unrelated data.
<img src="/figs/agg_posterior.png" alt="agg posterior" style="width: 100%; height: 240px; object-fit: contain; margin: 0 auto;" />



<div class="source"><a href="https://arxiv.org/abs/1505.05770">Rezende D. J., Mohamed S. Variational Inference with Normalizing Flows, 2015</a></div>

---
clicks: 0
sourceFrame: "5"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Assumptions

- Let $c\sim\Cat(\bpi)$, where

$$
\bpi=(\pi_1,\dots,\pi_K),\quad\pi_k=P(c=k),\quad\sum_{k=1}^K\pi_k=1.
$$

- Suppose the VAE adopts a discrete latent variable $c$ with prior $p(c)=\Uniform\{1,\dots,K\}$.

</div>

<div class="block">

## ELBO

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_{q_{\bphi}(c|\bx)}\log\pt(\bx|c)-{\color{olive}\KL(q_{\bphi}(c|\bx)\,\|\,p(c))}\rightarrow\max_{\bphi,\btheta}.
$$



$$
\KL(q_{\bphi}(c|\bx)\,\|\,p(c))=-\Ent(q_{\bphi}(c|\bx))+\log K.
$$

</div>

<div class="block">

## Quantized Representation

Define the codebook (dictionary) space $\{\be_k\}_{k=1}^K$ with $\be_k\in\bbR^L$ and $K$ the number of codebook entries.

$$
\bz_q=\bq(\bz)=\be_{k^*},\quad\text{where }k^*=\argmin_k\|\bz-\be_k\|.
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1711.00937">Oord A., Vinyals O., Kavukcuoglu K. Neural Discrete Representation Learning, 2017</a></div>

---
clicks: 0
sourceFrame: "6"
class: theorems
---

# Recap of Previous Lecture

<img src="/figs/vqvae.png" alt="vqvae" style="width: 100%; height: 135px; object-fit: contain; margin: 0 auto;" />

<div class="block">

## Deterministic Variational Posterior

$$
q_{\bphi}(c=k^*|\bx)=\begin{cases}
1,&\text{for }k^*=\argmin_k\|\bz_e-\be_k\|;\\
0,&\text{otherwise.}
\end{cases}
$$

</div>

<div class="block">

## ELBO

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_{q_{\bphi}(c|\bx)}\log\pt(\bx|\be_c)-\log K=\log\pt(\bx|\bz_q)-\log K.
$$

</div>

<div class="block">

## Straight-Through Gradient Estimator

$$
\frac{\partial\log p(\bx|\bz_q,\btheta)}{\partial\bphi}=\frac{\partial\log\pt(\bx|\bz_q)}{\partial\bz_q}\cdot{\color{red}\frac{\partial\bz_q}{\partial\bphi}}\approx\frac{\partial\log\pt(\bx|\bz_q)}{\partial\bz_q}\cdot\frac{\partial\bz_e}{\partial\bphi}
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1711.00937">Oord A., Vinyals O., Kavukcuoglu K. Neural Discrete Representation Learning, 2017</a></div>

---
clicks: 0
sourceFrame: "7"
class: theorems
---

# Recap of Previous Lecture

<div class="block" style="margin: 12px 0;">

## Likelihood-Free Learning

- Likelihood isn't always a suitable metric for evaluating generative models.
- Sometimes, the likelihood function can't even be computed exactly.

</div>


Imagine we have two sets of samples:

- $\{\bx_i\}_{i=1}^{n_1}\sim\pd(\bx)$ — real samples;
- $\{\bx_i\}_{i=1}^{n_2}\sim\pt(\bx)$ — generated (fake) samples.


$$
p(y=1|\bx)=P(\bx\sim\pd(\bx));\quad p(y=0|\bx)=P(\bx\sim\pt(\bx))
$$

<div class="block" style="margin: 12px 0;">

## Assumption

The generative model $\pt(\bx)$ matches $\pd(\bx)$ if a discriminative model $p(y|\bx)$ can't distinguish between them — that is, if $p(y=1|\bx)=0.5$ for every $\bx$.

</div>


- **Generator:** a generative model $\bx=\bG_{\btheta}(\bz)$ that produces more realistic samples.
- **Discriminator:** a classifier $D_{\bphi}(\bx)\in[0,1]$ distinguishing real from generated samples.

---
clicks: 3
sourceFrame: "8"
class: theorems
---

# Recap of Previous Lecture

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
sourceFrame: "9"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · Human Eval</div></div></div>
</div>

---
clicks: 0
sourceFrame: "auto: Generative Adversarial Networks (GAN)"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item current"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · Human Eval</div></div></div>
</div>

---
clicks: 0
sourceFrame: "10"
class: figure-slide
---

# Generative Models Taxonomy

<TaxonomyDiagram generative-adversarial-network class="taxonomy" />

---
clicks: 3
sourceFrame: "11"
class: theorems
---

# GAN Optimality

<div class="block">

## Theorem

The minimax game

$$
\min_G\max_D\Bigl[\underbrace{\bbE_{\pd(\bx)}\log D(\bx)+\bbE_{p(\bz)}\log(1-D(\bG(\bz)))}_{V(G,D)}\Bigr]
$$

achieves its global optimum when $\pd(\bx)=\pt(\bx)$, and $D^*(\bx)=0.5$.

</div>

<div class="block" v-click="1">

## Proof (Fixed $G$)

$$ {1|1-2} {at:2}
\begin{aligned}
V(G,D)&=\bbE_{\pd(\bx)}\log D(\bx)+\bbE_{\pt(\bx)}\log(1-D(\bx))\\
&=\int\underbrace{\left[\pd(\bx)\log D(\bx)+\pt(\bx)\log(1-D(\bx))\right]}_{y(D)}d\bx
\end{aligned}
$$
<div v-click="3">

$$
\frac{dy(D)}{dD}=\frac{\pd(\bx)}{D(\bx)}-\frac{\pt(\bx)}{1-D(\bx)}=0\quad\Rightarrow\quad D^*(\bx)=\frac{\pd(\bx)}{\pd(\bx)+\pt(\bx)}
$$

</div>

</div>



<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a></div>

---
clicks: 4
sourceFrame: "12"
class: theorems
---

# GAN Optimality

<div class="block">

## Proof Continued (Fixed $D=D^*$)

$$ {1-2|1-3|1-4} {at:1}
\begin{aligned}
V(G,D^*)&=\bbE_{\pd(\bx)}\log\left(\frac{\pd(\bx)}{\pd(\bx)+\pt(\bx)}\right)\\
&\quad+\bbE_{\pt(\bx)}\log\left(\frac{\pt(\bx)}{\pd(\bx)+\pt(\bx)}\right)\\
&=\KL\left(\pd(\bx)\,\|\,\frac{\pd(\bx)+\pt(\bx)}2\right)+\KL\left(\pt(\bx)\,\|\,\frac{\pd(\bx)+\pt(\bx)}2\right)-2\log2\\
&=2\,\JSD(\pd(\bx)\,\|\,\pt(\bx))-2\log2.
\end{aligned}
$$

</div>

<div class="block" v-click="3">

## Jensen-Shannon Divergence (Symmetric KL Divergence)

$$
\JSD(\pd(\bx)\|\pt(\bx))=\frac12\left[\KL\left(\pd(\bx)\|{\color{teal}\star}\right)+\KL\left(\pt(\bx)\|{\color{teal}\star}\right)\right]
$$

</div>

<div v-click="4">

This can be regarded as a proper distance metric!

$$
V(G^*,D^*)=-2\log2,\quad\pd(\bx)=\pt(\bx),\quad D^*(\bx)=0.5.
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a></div>

---
clicks: 1
sourceFrame: "13"
class: theorems
---

# GAN Optimality

<div class="block">

## Theorem

The following minimax game

$$
\min_G\max_D\Bigl[\bbE_{\pd(\bx)}\log D(\bx)+\bbE_{p(\bz)}\log(1-D(\bG(\bz)))\Bigr]
$$

achieves its global optimum precisely when $\pd(\bx)=\pt(\bx)$, and $D^*(\bx)=0.5$.

</div>

<div class="block">

## Expectations

If the generator can express **any** function and the discriminator is **optimal** at every step, the generator **will converge** to the target distribution.

</div>

<div class="block" v-click="1">

## Reality

- Generator updates are performed in parameter space, and the discriminator is often imperfectly optimized.
- Generator and discriminator losses typically oscillate during GAN training.

</div>



<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a></div>

---
clicks: 2
sourceFrame: "14"
class: theorems
---

# GAN Training

Assume both generator and discriminator are parametric models: $D_{\bphi}(\bx)$ and $\bG_{\btheta}(\bz)$.
<div class="block">

## Objective

$$
\min_{\btheta}\max_{\bphi}\left[\bbE_{\pd(\bx)}\log D_{\bphi}(\bx)+\bbE_{p(\bz)}\log(1-D_{\bphi}(\bG_{\btheta}(\bz)))\right]
$$

</div>

<img src="/figs/gan_1.png" alt="gan 1" style="width: 100%; height: 180px; object-fit: contain; margin: 0 auto;" v-click="1" />

<div v-click="2">

- $\bz\sim p(\bz)$ is a latent variable.
- $\pt(\bx|\bz)=\delta(\bx-\bG_{\btheta}(\bz))$ serves as a deterministic decoder (<span style="color: gray">like normalizing flows</span>).
- There is no encoder present.

</div>



<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a></div>

---
clicks: 1
sourceFrame: "15"
class: theorems
---

# Mode Collapse

Mode collapse refers to the phenomenon where the generator in a GAN produces only one or a few different modes of the distribution.

<img src="/figs/mode_collapse_1.png" alt="mode collapse 1" style="width: 100%; height: 150px; object-fit: contain; margin: 0 auto;" />

<img src="/figs/mode_collapse_4.png" alt="mode collapse 4" style="width: 100%; height: 180px; object-fit: contain; margin: 0 auto;" />

<div v-click="1">

Numerous methods have been proposed to tackle mode collapse: changing architectures, adding regularization terms, injecting noise.

</div>



<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a><br><a href="https://arxiv.org/abs/1611.02163">Metz L. et al. Unrolled Generative Adversarial Networks, 2016</a></div>

---
clicks: 1
sourceFrame: "16"
class: theorems
---

# Jensen-Shannon vs Kullback-Leibler Divergences

- $\pd(\bx)$ is a fixed mixture of two Gaussians.
- $p(\bx|\mu,\sigma)=\cN(\mu,\sigma^2)$.
<div class="block">

## Mode Covering vs. Mode Seeking

$$
\KL(\pi\,\|\,p)=\int\pi(\bx)\log\frac{\pi(\bx)}{p(\bx)}d\bx,\quad\KL(p\|\pi)=\int p(\bx)\log\frac{p(\bx)}{\pi(\bx)}d\bx
$$



$$
\JSD(\pi\,\|\,p)=\frac12\Bigl[\KL\Bigl(\pi(\bx)\,\|\,\frac{\pi(\bx)+p(\bx)}2\Bigr)+\KL\Bigl(p(\bx)\,\|\,\frac{\pi(\bx)+p(\bx)}2\Bigr)\Bigr]
$$

<img src="/figs/JSD.png" alt="JSD" style="width: 100%; height: 225px; object-fit: contain; margin: 0 auto;" v-click="1" />

</div>



<!-- The original JSD illustration is retained. The forward/reverse KL illustrations are replaced by the approved interactive example on the continuation slide; reverse-KL fitting is not GAN training. -->

---
clicks: 0
sourceFrame: "extension: 16"
class: interactive-slide
---

# Mode Covering vs. Mode Seeking

$$
\pd(x)=\tfrac12\cN(x\mid-2,0.55^2)+\tfrac12\cN(x\mid2,0.55^2),\qquad\pt(x)=\cN(x\mid\mu,\sigma^2).
$$

<KLDemo />

<!-- Ask where one Gaussian should go. Move its mean and width, then fit forward KL and the two symmetric reverse-KL minima. Forward fitting matches mean and variance; reverse fitting uses numerical minimization. These are properties of this example and restricted family, not universal laws for all models. Reverse-KL minimization is not GAN training; the original JSD illustration remains on the preceding slide. About one to two minutes. The component is reused from the author-approved deferred Lecture 1 demonstration. -->

---
clicks: 0
sourceFrame: "auto: Wasserstein Distance"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item current"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · Human Eval</div></div></div>
</div>

---
clicks: 3
sourceFrame: "17"
class: theorems
---

# Theoretical Results

- The dimensionality of $\bz$ is less than that of $\bx$, so $\pt(\bx)$ with $\bx=\bG_{\btheta}(\bz)$ lives on a low-dimensional manifold.
<div v-click="1">

- The true data distribution $\pd(\bx)$ is also supported on a low-dimensional manifold.

<img src="/figs/low_dim_manifold.png" alt="low dim manifold" style="width: 100%; height: 205px; object-fit: contain; margin: 0 auto;" />

</div>

<div v-click="2">

- If $\pd(\bx)$ and $\pt(\bx)$ are disjoint, a smooth optimal discriminator can exist!

</div>

<div v-click="3">

For such low-dimensional, disjoint manifolds:

$$
\KL(\pd\,\|\,\pt)=\KL(\pt\,\|\,\pd)=\infty,\quad\JSD(\pd\,\|\,\pt)=\log2
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1904.08994">Weng L. From GAN to WGAN, 2019</a><br><a href="https://arxiv.org/abs/1701.04862">Arjovsky M., Bottou L. Towards Principled Methods for Training Generative Adversarial Networks, 2017</a></div>

---
clicks: 0
sourceFrame: "18"
class: theorems
---

# Wasserstein Distance (Discrete)

Also known as the **Earth Mover's Distance**.

<div class="block">

## Optimal Transport Formulation

The minimum cost of moving and transforming a pile of “dirt” shaped like one probability distribution to match another.

</div>

<img src="/figs/discrete_wasserstein.png" alt="discrete wasserstein" style="width: 100%; height: 285px; object-fit: contain; margin: 0 auto;" />



<div class="source"><a href="https://udlbook.github.io/udlbook/">Simon J.D. Prince. Understanding Deep Learning, 2023</a></div>

---
clicks: 1
sourceFrame: "19"
class: theorems
---

# Wasserstein Distance (Continuous)

$$
\begin{aligned}
W(\pi\|p)&=\inf_{\gamma\in\Gamma(\pi,p)}\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|\\
&=\inf_{{\color{olive}\gamma}\in{\color{teal}\Gamma(\pi,p)}}\int{\color{#8854c0}\|\bx_1-\bx_2\|}\,{\color{olive}\gamma(\bx_1,\bx_2)}d\bx_1d\bx_2
\end{aligned}
$$


- ${\color{olive}\gamma(\bx_1,\bx_2)}$ is the transport plan: the amount of “dirt” assigned from $\bx_1$ to $\bx_2$.

$$
\int\gamma(\bx_1,\bx_2)d\bx_1=p(\bx_2);\quad\int\gamma(\bx_1,\bx_2)d\bx_2=\pi(\bx_1).
$$

- ${\color{teal}\Gamma(\pi,p)}$ denotes the set of all joint distributions $\gamma(\bx_1,\bx_2)$ with marginals $\pi$ and $p$.
- ${\color{olive}\gamma(\bx_1,\bx_2)}$ is the mass, ${\color{#8854c0}\|\bx_1-\bx_2\|}$ is the distance.
<div v-click="1">

<div class="block">

## Wasserstein Metric

$$
W_s(\pi,p)=\inf_{\gamma\in\Gamma(\pi,p)}\Bigl(\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|^s\Bigr)^{1/s}
$$

</div>

In our setting, $W(\pi\|p)=W_1(\pi,p)$, which is the transport cost formulation.

</div>



<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 4
sourceFrame: "20"
class: theorems
---

# Wasserstein Distance vs KL vs JSD

<div class="columns" style="grid-template-columns: 1.2fr 1fr;">
<div>

Consider two-dimensional distributions:

$$
\pd(x,y)=(0,U[0,1]),\qquad\pt(x,y)=(\theta,U[0,1])
$$


</div>
<img src="/figs/w_kl_jsd.png" alt="w kl jsd" style="width: 100%; height: 155px; object-fit: contain; margin: 0 auto;" />


</div>
<div v-click="1">

$\theta=0$: Both distributions are identical.

$$
\KL(\pd\|\pt)=\KL(\pt\|\pd)=\JSD(\pt\|\pd)=W(\pd\|\pt)=0
$$

</div>

<div v-click="2">

$\theta\neq0$:

$$
\KL(\pd\|\pt)=\int_{U[0,1]}1\log\frac10\,dy=\infty=\KL(\pt\|\pd)
$$

</div>

<div v-click="3">

$$
\JSD(\pd\|\pt)=\frac12\left(\int_{U[0,1]}1\log\frac1{1/2}dy+\int_{U[0,1]}1\log\frac1{1/2}dy\right)=\log2
$$

</div>

<div v-click="4">

$$
W(\pd\|\pt)=|\theta|
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1904.08994">Weng L. From GAN to WGAN, 2019</a><br><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 1
sourceFrame: "21"
class: theorems
---

# Wasserstein Distance vs KL vs JSD

<div class="block">

## Theorem 1

Let $\bG_{\btheta}(\bz)$ be (almost) any feedforward neural network, and $p(\bz)$ a prior over $\bz$ such that $\bbE_{p(\bz)}\|\bz\|<\infty$. Then $W(\pd\|\pt)$ is continuous everywhere and differentiable almost everywhere.

</div>

<div class="block" v-click="1">

## Theorem 2

Let $\pi$ be a distribution on a compact space $\cX$ and let $\{p_t\}_{t=1}^\infty$ be a sequence of distributions on $\cX$.

$$
\begin{aligned}
\KL(\pi\|p_t)&\rightarrow0\quad(\text{or }\KL(p_t\,\|\,\pi)\rightarrow0)\qquad\text{(1)}\\
\JSD(\pi\|p_t)&\rightarrow0\qquad\text{(2)}\\
W(\pi\|p_t)&\rightarrow0\qquad\text{(3)}
\end{aligned}
$$

As $t\rightarrow\infty$, (1) $\Rightarrow$ (2), and (2) $\Rightarrow$ (3). That is, convergence in Wasserstein distance is a weaker condition than convergence in JSD, which in turn is weaker than convergence in KL.

</div>



<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 0
sourceFrame: "auto: Wasserstein GAN (WGAN)"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item current"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · Human Eval</div></div></div>
</div>

---
clicks: 3
sourceFrame: "22"
class: theorems
---

# Wasserstein GAN

<div class="block">

## Wasserstein Distance

$$
\begin{aligned}
W(\pi\|p)&=\inf_{\gamma\in\Gamma(\pi,p)}\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|\\
&=\inf_{\gamma\in\Gamma(\pi,p)}\int\|\bx_1-\bx_2\|\gamma(\bx_1,\bx_2)\,d\bx_1\,d\bx_2
\end{aligned}
$$

</div>

<div v-click="1">

The infimum over all possible $\gamma\in\Gamma(\pi,p)$ is computationally intractable.

</div>

<div class="block" v-click="2">

## Theorem (Kantorovich-Rubinstein Duality)

$$
W(\pi\|p)=\frac1K\max_{\|f\|_L\leq K}\Bigl[\bbE_{\pi(\bx)}f(\bx)-\bbE_{p(\bx)}f(\bx)\Bigr]
$$

where $f:\bbR^m\rightarrow\bbR$ is $K$-Lipschitz ($\|f\|_L\leq K$):

$$
|f(\bx_1)-f(\bx_2)|\leq K\|\bx_1-\bx_2\|,\quad\forall\ \bx_1,\bx_2\in\cX.
$$

</div>

<div v-click="3">

We can thus estimate $W(\pi\|p)$ using only samples and a function $f$.

</div>



<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 1
sourceFrame: "23"
class: theorems
---

# Wasserstein GAN

<div class="block">

## Theorem (Kantorovich-Rubinstein Duality)

$$
W(\pd\|\pt)=\frac1K\max_{\|f\|_L\leq K}\Bigl[\bbE_{\pd(\bx)}f(\bx)-\bbE_{\pt(\bx)}f(\bx)\Bigr]
$$

</div>


- We must ensure that $f$ is $K$-Lipschitz continuous.
- Let $f_{\bphi}(\bx)$ be a feedforward neural network parameterized by $\bphi$.
- If the weights $\bphi$ are restricted to a compact set $\bPhi$, then $f_{\bphi}$ is $K$-Lipschitz.
<div v-click="1">

- Clamp weights within the box $\bPhi=[-c,c]^d$ (e.g. $c=0.01$) after each update.

$$
\begin{aligned}
K\cdot W(\pd\|\pt)&=\max_{\|f\|_L\leq K}\Bigl[\bbE_{\pd(\bx)}f(\bx)-\bbE_{\pt(\bx)}f(\bx)\Bigr]\\
&\geq\max_{\bphi\in\bPhi}\Bigl[\bbE_{\pd(\bx)}f_{\bphi}(\bx)-\bbE_{\pt(\bx)}f_{\bphi}(\bx)\Bigr]
\end{aligned}
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 1
sourceFrame: "24"
class: theorems
---

# Wasserstein GAN

<div class="block">

## Standard GAN Objective

$$
\min_{\btheta}\max_{\bphi}\bbE_{\pd(\bx)}\log D_{\bphi}(\bx)+\bbE_{p(\bz)}\log(1-D_{\bphi}(\bG_{\btheta}(\bz)))
$$

</div>

<div class="block">

## WGAN Objective

$$
\min_{\btheta}{\color{#8854c0}W(\pd\|\pt)}\approx\min_{\btheta}{\color{#8854c0}\max_{\bphi\in\bPhi}\Bigl[\bbE_{\pd(\bx)}f_{\bphi}(\bx)-\bbE_{p(\bz)}f_{\bphi}(\bG_{\btheta}(\bz))\Bigr]}
$$

</div>

<div v-click="1">

- The discriminator $D$ is replaced by function $f$: in WGAN, it is known as the **critic**, which is *not* a classifier.
- *“Weight clipping is a clearly terrible way to enforce a Lipschitz constraint.”*
  - If $c$ is large, optimizing the critic is hard.
  - If $c$ is small, gradients may vanish.

</div>



<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 0
sourceFrame: "25"
class: theorems
---

# Wasserstein GAN

<div class="columns" style="grid-template-columns: 1.4fr 1fr;">
<div>


- WGAN provides nonzero gradients even if distributions' supports are disjoint.
- $\JSD(\pd\|\pt)$ is poorly correlated with sample quality and remains near its maximum value $\log2\approx0.69$.
- $W(\pd\|\pt)$ is tightly correlated with quality.

</div>
<img src="/figs/wgan_toy.png" alt="wgan toy" style="width: 100%; height: 240px; object-fit: contain; margin: 0 auto;" />


</div>
<div class="columns">
<img src="/figs/dcgan_quality.png" alt="dcgan quality" style="width: 100%; height: 220px; object-fit: contain; margin: 0 auto;" />

<img src="/figs/wgan_quality.png" alt="wgan quality" style="width: 100%; height: 220px; object-fit: contain; margin: 0 auto;" />


</div>

<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 0
sourceFrame: "auto: Evaluation of Likelihood-Free Models"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item current"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · Human Eval</div></div></div>
</div>

---
clicks: 3
sourceFrame: "26"
class: theorems
---

# Evaluation of Likelihood-Free Models

<div class="block">

## Likelihood-Based Models

- **Train:** fit the model.
- **Validation:** tune hyperparameters.
- **Test:** assess generalization by reporting likelihood.

</div>

<div v-click="1">

Not all models have tractable likelihoods (VAE: compare ELBO values; GAN: **???**).

</div>

<div class="block" v-click="2">

## Desirable Properties for Samples

<div class="columns">
<div>

Sharpness

<img src="/figs/sharpness.png" alt="sharpness" style="width: 100%; height: 155px; object-fit: contain; margin: 0 auto;" />


</div>
<div v-click="3">

Diversity

<img src="/figs/diversity.png" alt="diversity" style="width: 100%; height: 155px; object-fit: contain; margin: 0 auto;" />


</div>
</div>

</div>



<div class="source"><a href="https://deepgenerativemodels.github.io">image credit: https://deepgenerativemodels.github.io</a></div>

---
clicks: 0
sourceFrame: "auto: Frechet Inception Distance (FID)"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item current"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub"><b>Frechet Inception Distance (FID)</b> · Precision-Recall · CLIP Score · Human Eval</div></div></div>
</div>

---
clicks: 3
sourceFrame: "27"
class: theorems
---

# Wasserstein Metric

$$
W_s(\pi\|p)=\inf_{\gamma\in\Gamma(\pi,p)}\left(\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|^s\right)^{1/s}
$$

<div class="block" v-click="1">

## Wasserstein GAN (Optimal Transport)

$$
\begin{aligned}
W(\pi\|p)&=\inf_{\gamma\in\Gamma(\pi,p)}\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|\\
&=\inf_{\gamma\in\Gamma(\pi,p)}\int\|\bx_1-\bx_2\|\gamma(\bx_1,\bx_2)\,d\bx_1\,d\bx_2
\end{aligned}
$$

</div>

<div class="block" v-click="2">

## Theorem

If $\pi(\bx)=\cN(\bmu_\pi,\bSigma_\pi)$, $p(\bx)=\cN(\bmu_p,\bSigma_p)$, then

$$
W_2^2(\pi\|p)=\|\bmu_\pi-\bmu_p\|^2+\tr\left[\bSigma_\pi+\bSigma_p-2\left(\bSigma_\pi^{1/2}\bSigma_p\bSigma_\pi^{1/2}\right)^{1/2}\right]
$$

</div>

<div class="block" v-click="3">

## Frechet Inception Distance

$$
\FID(\pd,\pt)=W_2^2(\pd\|\pt)
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1706.08500">Heusel M. et al. GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium, 2017</a></div>

---
clicks: 1
sourceFrame: "28"
class: theorems
---

# Frechet Inception Distance (FID)

$$
\FID(\pd,\pt)=\|\bmu_{\text{data}}-\bmu_{\btheta}\|^2+\tr\left[\bSigma_{\text{data}}+\bSigma_{\btheta}-2\left(\bSigma_{\text{data}}^{1/2}\bSigma_{\btheta}\bSigma_{\text{data}}^{1/2}\right)^{1/2}\right]
$$


- FID is computed in the latent space $\bz$.
- We use a pretrained image embedder to get latent representations $\bz=\bff(\bx)$.
- $\bmu_{\text{data}}$, $\bSigma_{\text{data}}$ and $\bmu_{\btheta}$, $\bSigma_{\btheta}$ are statistics of latent representations for samples from $\pd(\bx)$ and $\pt(\bx)$.
<div class="block" v-click="1">

## $\FID(p(\bx),\cN(0,\bI))$

<img src="/figs/fid_normal.png" alt="fid normal" style="width: 100%; height: 205px; object-fit: contain; margin: 0 auto;" />

</div>



<div class="source"><a href="https://arxiv.org/abs/2401.09603">Jayasumana S. et al. Rethinking FID: Towards a Better Evaluation Metric for Image Generation, 2024</a></div>

---
clicks: 1
sourceFrame: "29"
class: theorems
---

# Frechet Inception Distance (FID)

$$
\FID(\pd,\pt)=\|\bmu_{\text{data}}-\bmu_{\btheta}\|^2+\tr\left[\bSigma_{\text{data}}+\bSigma_{\btheta}-2\left(\bSigma_{\text{data}}^{1/2}\bSigma_{\btheta}\bSigma_{\text{data}}^{1/2}\right)^{1/2}\right]
$$

<div v-click="1">

<div class="block">

## Drawbacks

- Depends on the pretrained classification network.
- Uses the normality assumption.
- May not correlate with human evaluation.

</div>

<img src="/figs/fid_vs_human_eval.png" alt="fid vs human eval" style="width: 100%; height: 210px; object-fit: contain; margin: 0 auto;" />

</div>



<div class="source"><a href="https://arxiv.org/abs/2401.09603">Jayasumana S. et al. Rethinking FID: Towards a Better Evaluation Metric for Image Generation, 2024</a></div>

---
clicks: 0
sourceFrame: "auto: Precision-Recall"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item current"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · <b>Precision-Recall</b> · CLIP Score · Human Eval</div></div></div>
</div>

---
clicks: 1
sourceFrame: "30"
class: theorems
---

# Precision-Recall

<div class="block">

## Desirable Properties for Samples

- **Sharpness:** generated samples should possess high visual quality.
- **Diversity:** their variation should match that in the training data.

</div>

<div v-click="1">

<img src="/figs/pr_curve.png" alt="pr curve" style="width: 100%; height: 215px; object-fit: contain; margin: 0 auto;" />


- **Precision** denotes the fraction of generated images that look realistic.
- **Recall** measures how well the generator covers the training data manifold.

</div>



<div class="source"><a href="https://arxiv.org/abs/1904.06991">Kynkäänniemi T. et al. Improved precision and recall metric for assessing generative models, 2019</a></div>

---
clicks: 4
sourceFrame: "31"
class: theorems
---

# Precision-Recall

- $\cS_{\text{data}}=\{\bx_i\}_{i=1}^{n}\sim\pd(\bx)$ — real samples;
- $\cS_{\btheta}=\{\bx_i\}_{i=1}^{n}\sim\pt(\bx)$ — generated samples.
<div v-click="1">

Define a binary function:

$$
\bbI(\bx,\cS)=\begin{cases}
1,&\text{if }\exists\ \bx'\in\cS:\|\bx-\bx'\|_2\leq\|\bx'-\NN_k(\bx',\cS)\|_2;\\
0,&\text{otherwise.}
\end{cases}
$$

</div>

<div v-click="2">

$$
\text{Pr}(\cS_{\text{data}},\cS_{\btheta})=\frac1n\sum_{\bx\in\cS_{\btheta}}\bbI(\bx,\cS_{\text{data}});\quad
\text{Rec}(\cS_{\text{data}},\cS_{\btheta})=\frac1n\sum_{\bx\in\cS_{\text{data}}}\bbI(\bx,\cS_{\btheta}).
$$

</div>

<img src="/figs/pr_k_nearest.png" alt="pr k nearest" style="width: 100%; height: 160px; object-fit: contain; margin: 0 auto;" v-click="3" />

<div v-click="4">

Embed the samples using a pretrained network (as in FID).

</div>



<div class="source"><a href="https://arxiv.org/abs/1904.06991">Kynkäänniemi T. et al. Improved precision and recall metric for assessing generative models, 2019</a></div>

---
clicks: 1
sourceFrame: "32"
class: theorems
---

# Precision-Recall

<img src="/figs/pr_vs_fid.png" alt="pr vs fid" style="width: 100%; height: 265px; object-fit: contain; margin: 0 auto;" />

<img src="/figs/pr_truncation.png" alt="pr truncation" style="width: 100%; height: 220px; object-fit: contain; margin: 0 auto;" v-click="1" />



<div class="source"><a href="https://arxiv.org/abs/1904.06991">Kynkäänniemi T. et al. Improved precision and recall metric for assessing generative models, 2019</a></div>

---
clicks: 0
sourceFrame: "auto: CLIP Score"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item current"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · <b>CLIP Score</b> · Human Eval</div></div></div>
</div>

---
clicks: 2
sourceFrame: "33"
class: theorems
---

# CLIP Score

<div class="columns">
<div class="block">

## Unconditional Model

<img src="/figs/uncond_model.png" alt="uncond model" style="width: 100%; height: 140px; object-fit: contain; margin: 0 auto;" />

</div>

<div class="block">

## Conditional Model

<img src="/figs/cond_model.png" alt="cond model" style="width: 100%; height: 140px; object-fit: contain; margin: 0 auto;" />

</div>


</div>
<div v-click="1">

We need a way to measure not only the quality of the generated image, but also how well it's aligned with the prompt.

</div>

<img src="/figs/clip.png" alt="clip" style="width: 100%; height: 220px; object-fit: contain; margin: 0 auto;" v-click="2" />



<div class="source"><a href="https://arxiv.org/abs/2103.00020">Radford A. et al. Learning transferable visual models from natural language supervision, 2021</a></div>

---
clicks: 0
sourceFrame: "auto: Human Eval"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item current"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · <b>Human Eval</b></div></div></div>
</div>

---
clicks: 1
sourceFrame: "34"
class: theorems
---

# Human Evaluation

- No automated metric is perfect.
- The best way to evaluate generative models is by human assessment.
- It's important to assess various properties.
<img src="/figs/yaart_2.5.png" alt="yaart 2.5" style="width: 100%; height: 315px; object-fit: contain; margin: 0 auto;" v-click="1" />



<div class="source"><a href="https://ya.ru/ai/art">YandexART 2.5, 2025</a></div>

---
clicks: 0
sourceFrame: "35"
class: summary
---

# Summary

- GANs, in theory, optimize the Jensen-Shannon divergence.
- Wasserstein distance works in the case of disjoint data and model distributions (unlike the KL and JS divergences).
- Wasserstein GAN uses Kantorovich-Rubinstein duality to enable Monte Carlo estimation of the Wasserstein distance. It enforces the Lipschitz condition on the critic through weight clipping.
- FID is the most popular metric for evaluating implicit generative models.
- Precision-recall allows for choosing a model that balances sample quality and diversity.
- The CLIP score is widely used to measure text-to-image alignment.
- The gold standard for evaluating generated image quality is human assessment.
