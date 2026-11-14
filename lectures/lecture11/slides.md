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

This process matches the NCSN noise levels.

$$
d \bx = \sqrt{\frac{ d [\sigma^2(t)]}{dt}} \cdot d \bw
$$

$$
\bff(\bx, t) = 0, \quad g(t) = \sqrt{\frac{ d [\sigma^2(t)]}{dt}}
$$

$\sigma(t)$ is a monotonically increasing function.

</div>

<div class="block">

## Variance Preserving SDE (DDPM)

This is the small-step limit of the DDPM forward chain.

$$
d \bx = - \frac{1}{2} \beta(t) \bx(t) dt + \sqrt{\beta(t)} \cdot d \bw
$$

$$
\bff(\bx, t) = - \frac{1}{2} \beta(t) \bx(t) , \quad g(t) = \sqrt{\beta(t)}
$$

Variance is preserved as long as $\bx(0)$ has unit variance.

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-2
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem

Suppose the SDE $d\bx = \bff(\bx, t) dt + g(t) d \bw$ induces the probability path $p_t(\bx)$ with $p_t(\bx) > 0$.
Then, there exists an ODE with the same probability path $p_t(\bx)$, given by

$$
d\bx = \bv(\bx, t) dt = \left(\bff(\bx, t) -\frac{1}{2} g^2(t) \frac{\partial}{\partial \bx} \log p_t(\bx) \right) dt
$$

</div>

<img src="/figs/probability_flow.png" alt="SDE and probability flow ODE trajectories over the same probability path" style="width:100%;height:176px;object-fit:contain" />

<div class="block">

## Log-likelihood

The flow is invertible. Follow the same ODE from data to noise to evaluate the model density.

$$
\log \pt(\bx(0))=\log p_T(\bx(T))
+\int_0^T \tr\left(\frac{\partial\bv_{\btheta}(\bx(t),t)}{\partial\bx(t)}\right)\,dt.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a> · <a href="https://arxiv.org/abs/1806.07366">Chen et al., Neural Ordinary Differential Equations, 2018</a></div>

---
clicks: 0
id: recap-of-previous-lecture-3
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## ODE · One predecessor

$$
d\bx=\bv(\bx,t)\,dt
$$

Over a short forward step $h$,
$$
\bx(t+h)\approx\bx(t)+h\,\bv(\bx(t),t).
$$

In reverse time $\tau=1-t$,
$$
d\bx=-\bv(\bx,1-\tau)\,d\tau.
$$

</div>

<div class="block">

## Theorem

There exists a reverse SDE for $d\bx = \bff(\bx, t) dt + g(t) d \bw$ (assume $p_t(\bx) > 0$), given by:

$$
d\bx = \left(\bff(\bx, t) {\color{#8854c0}- g^2(t) \frac{\partial}{\partial \bx}\log p_t(\bx)}\right) dt + g(t) d \bar{\bw}
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
d\bx = \bff(\bx, t) dt + g(t) d \bw
$$

$$
\bv(\bx, t) = \bff(\bx, t) - \frac{1}{2} g^2(t) \bs(\bx, t), \quad \text{where} \quad \bs(\bx, t) = \nabla_{\bx} \log p_t(\bx)
$$

<div class="takeaway columns">
<section>

## Probability Flow ODE

$$
d\bx = {\color{teal}\bv(\bx, t)}\,dt.
$$

</section>
<section>

## Reverse SDE

$$
d\bx = \bigl({\color{#8854c0}\bv(\bx, t) - \tfrac12 g^2(t)\bs(\bx, t)}\bigr)\,dt + g(t)\,d\bar{\bw}.
$$

</section>
</div>

<img src="/figs/sde.png" alt="Forward and reverse SDE trajectories alongside probability flow ODE trajectories between the data and prior distributions" style="width:100%;height:300px;object-fit:contain" />

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
\bbE_{\pd(\bx_0)} {\color{teal}\bbE_{t \sim U\{1, T\}}} \bbE_{q(\bx_t | \bx_0)}\bigl\| \bs_{\btheta, t}(\bx_t) - \nabla_{\bx_t} \log q(\bx_t | \bx_0) \bigr\|^2_2
$$

</div>

Use unit score-loss weights here.

<div class="block">

## Continuous-Time Objective

$$
\bbE_{\pd(\bx(0))} \bbE_{t \sim U[0, 1]} \bbE_{q(\bx(t) \mid \bx(0))}
\bigl\| \bs_{\btheta}(\bx(t), t) - {\color{teal}\nabla_{\bx(t)} \log q(\bx(t) \mid \bx(0))} \bigr\|^2_2
$$

</div>

In continuous time, the conditional law is still Gaussian. Write $\bmu=\bmu(\bx(0),t)$ for its mean.

<div class="takeaway columns">
<section>

## Conditional density

$$
q(\bx(t)\mid\bx(0))=\cN\!\left(\bmu,\,\sigma^2(t)\bI\right)
$$

</section>
<section>

## Score target

$$
{\color{teal}\nabla_{\bx(t)}\log q(\bx(t)\mid\bx(0))}
=\frac{\bmu-\bx(t)}{\sigma^2(t)}
$$

</section>
</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song et al., Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a> · <a href="https://users.aalto.fi/~asolin/sde-book/sde-book.pdf">Särkkä &amp; Solin, Applied Stochastic Differential Equations, §6.1, 2019</a></div>

---
clicks: 0
id: recap-gaussian-conditional-moments
class: theorems
---

# Recap of Previous Lecture

With affine drift and additive Gaussian noise, the transition law is Gaussian.

$$
d\bx=f(t)\bx\,dt+g(t)\,d\bw
\quad\Longrightarrow\quad
q(\bx(t)\mid\bx(0))=\cN\!\left(\bmu(\bx(0),t),\,\sigma^2(t)\bI\right).
$$

<div class="takeaway">

## Theorem

$$
\frac{d\bmu(\bx(0),t)}{dt}=f(t)\bmu(\bx(0),t),
\qquad
\frac{d\sigma^2(t)}{dt}=2f(t)\sigma^2(t)+g^2(t).
$$

</div>

Fix $\bx(0)$ and write $v(t)$ for the conditional variance per coordinate. Then $\bmu(0)=\bx(0)$ and $v(0)=0$.

<div class="source"><a href="https://users.aalto.fi/~asolin/sde-book/sde-book.pdf">Särkkä S., Solin A. Applied stochastic differential equations, 2019</a></div>

---
clicks: 0
id: recap-score-based-training
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Training

<ol>

<li>

Sample $\bx(0) \sim \pd(\bx)$, $t \sim U[0, 1]$.

</li>

<li>

Sample $\bx(t) \sim q(\bx(t) | \bx(0))$.

</li>

<li>

Compute loss $\cL = \bigl\| \bs_{\btheta}(\bx(t), t) - {\color{teal}\nabla_{\bx(t)} \log q(\bx(t) | \bx(0))} \bigr\|^2_2$.

</li>

</ol>

</div>

<div class="block">

## NCSN

$$
q(\bx(t) | \bx(0)) = \cN\left(\bx(0), \left[\sigma^2(t) - \sigma^2(0)\right] \cdot \bI\right)
$$

</div>

<div class="block">

## DDPM

$$
q(\bx(t) | \bx(0)) = \cN\left(\bx(0) e^{-\frac{1}{2} \int_0^t\beta(s)ds}, \left(1 - e^{- \int_0^t\beta(s)ds}\right) \cdot \bI\right)
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: recap-of-previous-lecture-7
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Sampling

1. For the VP-SDE, sample $\bx(1) \sim \cN(0, \bI)$ from the approximate terminal distribution.
2. Solve the reverse SDE from $T=1$ to $t=0$ using $\SDESolve$.

<img src="/figs/sbgm.png" alt="Score-based generative model sampling" style="width:100%;height:240px;object-fit:contain" />

</div>

- An Euler–Maruyama step of the reverse SDE adds fresh Gaussian noise.
- An Euler step of the probability flow ODE is deterministic given the current state.

<div class="source"><a href="https://arxiv.org/abs/2011.13456">Song Y., et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 0
id: outline
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item"><span>02</span><div>Flow Matching (FM)</div></div>
<div class="outline-item"><span>03</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item"><span>04</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 0
id: outline-denoiser-parameterization
section: "Denoiser Parameterization and Sampling"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item"><span>02</span><div>Flow Matching (FM)</div></div>
<div class="outline-item"><span>03</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item"><span>04</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 2
id: from-time-to-noise-level
class: theorems
---

# From Time to Noise Level

**Use the familiar additive-noise form:** $\bx=\bx_0+\sigma\bepsilon$, $\bepsilon\sim\cN(0,\bI)$.

$$
\bff(\bx,t)=0,\qquad g^2(t)=\frac{d\sigma^2(t)}{dt}
=2\sigma(t)\frac{d\sigma(t)}{dt}.
$$

<div class="block" v-click="1" style="margin-top:8px">

## Rewrite the probability flow ODE using $\sigma$

<div>

$$
\begin{aligned}
\frac{d\bx(t)}{dt}
&=\bff(\bx(t),t)-\frac12g^2(t)\bs_{\btheta}(\bx(t),\sigma(t))\\
&=-\sigma(t)\frac{d\sigma(t)}{dt}\bs_{\btheta}(\bx(t),\sigma(t)).
\end{aligned}
$$

$$
\frac{d\bx}{d\sigma}
=\left(\frac{d\sigma(t)}{dt}\right)^{-1}\frac{d\bx(t)}{dt}
=-\sigma\bs_{\btheta}(\bx,\sigma).
$$

</div>

</div>

<div class="block" v-click="2">

## Choose a denoiser using Tweedie's formula

$$
\bbE[\bx_0\mid\bx]=\bx+\sigma^2\nabla_{\bx}\log p_{\sigma}(\bx).
$$

$$
D_{\btheta}(\bx,\sigma)\approx\bbE[\bx_0\mid\bx],\qquad
\frac{d\bx}{d\sigma}=-\sigma\bs_{\btheta}(\bx,\sigma)
=\frac{\bx-D_{\btheta}(\bx,\sigma)}{\sigma}.
$$

Decreasing $\sigma$ moves towards the denoiser prediction. **How do we train this denoiser?**

</div>

<div class="source"><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a></div>

<!--
Narrative: the opening recap recalls Gaussian perturbation kernels, score training and reverse sampling. After the agenda-only section transition, use the additive-noise form already motivated by the DDPM/NCSN rescaling and reuse the known PF-ODE. The block starts after the complete general algorithm, rather than interrupting its two halves. First substitute f and g, then apply the chain rule to use sigma as the independent variable. Only after obtaining the sigma-ODE, recall Tweedie's full identity and choose the familiar clean-data parameterization. The identity appears before its use to express the field through a denoiser. The denoiser form gives an interpretation of a negative-sigma step and motivates the next slide's training question.
All arguments are retained: f(x,t), g(t), sigma(t), s_theta(x(t),sigma(t)). The score network is indexed by noise level here. After changing independent variable, x denotes the same trajectory expressed as a function of sigma; this is a time reparameterization, not an additional generative method.
Assume sigma(t)>0 and d sigma(t)/dt>0 on the interval of the change of variables. The additive path is x = x_0 + sigma epsilon, so its forward SDE has zero drift and diffusion variance rate d sigma^2/dt. Sigma is the total additive-noise standard deviation; the earlier VE formula permits a nonzero initial sigma, which must be accounted for when identifying the clean initial state. VP's unscaled state is not this additive coordinate.
The denoiser choice is convenient, not required by the change of time coordinate and not universally superior to noise/score/v prediction. D_theta estimates the conditional mean; its score conversion follows from Tweedie. A learned prediction approximates the true marginal score and probability flow. A negative Euler increment in sigma points towards the current denoiser prediction; that prediction is recomputed along the trajectory.
The freedom to change samplers appeared with DDIM; the contribution here connects the familiar denoiser parameterization with the previously introduced general ODE solvers. Integrate at positive sigma, with an Euler denoising step to zero; do not evaluate the network or divide by sigma at zero. The preceding VP sampling example starts from a standard Gaussian. The additive-noise sampler below scales its initial noise by sigma_max.
-->

---
clicks: 2
id: train-the-denoiser
class: theorems
---

# Train the Denoiser

**Use the existing score-training objective.** For a noisy-clean pair $(\bx,\bx_0)$ with $q(\bx\mid\bx_0)=\cN(\bx_0,\sigma^2\bI)$:

$$
\cL=\left\|\bs_{\btheta}(\bx,\sigma)-\nabla_{\bx}\log q(\bx\mid\bx_0)\right\|_2^2.
$$

<div class="block" v-click="1">

## Compute the conditional Gaussian target

$$
\nabla_{\bx}\log q(\bx\mid\bx_0)=-\frac{\bx-\bx_0}{\sigma^2}.
$$

</div>

<div class="block" v-click="2">

## Substitute the denoiser representation

$$
\begin{aligned}
\cL
&=\left\|\frac{D_{\btheta}(\bx,\sigma)-\bx}{\sigma^2}
+\frac{\bx-\bx_0}{\sigma^2}\right\|_2^2\\
&=\frac{1}{\sigma^4}\left\|D_{\btheta}(\bx,\sigma)-\bx_0\right\|_2^2.
\end{aligned}
$$

**Preserving the score objective requires the factor $1/\sigma^4$.**

Plain denoiser MSE would reweight noise levels. The trained denoiser supplies the sampling field.

</div>

<div class="source"><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a></div>

<!--
Narrative: the preceding slide rewrites the PF-ODE in sigma and chooses the familiar clean-data denoiser to represent its field. This slide answers how to train that denoiser. Start directly from the earlier per-pair DSM training loss, compute its conditional Gaussian target, and substitute the already established denoiser representation. Do not reintroduce Tweedie, the conditional-mean definition, or a standalone score conversion: those are inputs from the preceding slide, not new conclusions here. The conclusion is equivalence of that objective under a different network prediction target. The next slide makes the MSE optimum explicit for an empirical data distribution, before the trained denoiser is used in the sampling loop.
The optimal MSE predictor is the conditional mean at each fixed sigma > 0, not the original individual clean sample. The arrow from Tweedie's formula motivates a parameterization; a learned D_theta and score are approximate. The conditional Gaussian target in training is distinct from the marginal score in Tweedie's identity.
The loss equivalence is algebraic for every theta under the displayed substitution. The original score loss becomes sigma^-4 times clean-target MSE; this is not an arbitrary extra weight or the full EDM recipe. Preserve the same distribution over noise levels when calling the objectives equivalent.
This additive path is a specialization of the previous Gaussian transition; it does not identify VP's unscaled state with x_0 + sigma epsilon. Sigma denotes the total additive-noise standard deviation.
-->

---
clicks: 2
id: what-does-the-optimal-denoiser-predict
class: theorems
---

# What Does the Optimal Denoiser Predict?

Use uniform empirical data $\{\bx_1,\ldots,\bx_N\}$. For fixed $\bx$ and $\sigma>0$, let
$a_i=\cN(\bx;\bx_i,\sigma^2\bI)$ be the likelihood of the noisy observation.

<div class="block" v-click="1">

## Minimize the conditional MSE at $\bx$

$$
D^*(\bx,\sigma)=\argmin_{\by}\sum_{i=1}^{N}a_i\|\by-\bx_i\|_2^2
\quad\Longrightarrow\quad
2\sum_{i=1}^{N}a_i(\by-\bx_i)=0.
$$

$$
D^*(\bx,\sigma)
=\frac{\sum_{i=1}^{N}\exp\!\left(-\frac{\|\bx-\bx_i\|_2^2}{2\sigma^2}\right)\bx_i}
{\sum_{j=1}^{N}\exp\!\left(-\frac{\|\bx-\bx_j\|_2^2}{2\sigma^2}\right)}
=\bbE[\bx_0\mid\bx].
$$

Set the gradient to zero: the optimum is a **posterior-weighted average**.

</div>

<div class="block" v-click="2">

## Why train a network?

- The exact formula scans **all $N$ training examples at every sampling step**.
- It describes the empirical distribution; exact sampling only reproduces training examples.

</div>

<div class="source"><a href="https://proceedings.neurips.cc/paper_files/paper/2022/file/a98846e9d9cc01cfb87eb694d946ce6b-Supplemental-Conference.pdf#page=11">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022 — Appendix B.3, Eqs. (53–57)</a></div>

<!--
Narrative: the preceding slide expresses DSM as clean-target MSE. Here fix a noisy observation and sigma, and minimize the corresponding weighted least-squares problem. Under a uniform empirical prior, posterior weights are a_i/sum_j a_j, so the positive normalization constant can be dropped from the argmin. The sigma-only loss weight also does not change this unrestricted pointwise optimum. Differentiate with respect to the candidate vector y, set the gradient to zero, and solve for the weighted mean. Substitute the Gaussian likelihoods: the common normalization cancels, leaving the explicit normalized exponential formula. All a_i are positive for sigma>0, hence the objective is strictly convex and its unique minimizer is the conditional mean.
The rationale then motivates the next slide's neural Euler sampler. Exact evaluation of this finite sum costs O(Nd) for d-dimensional data and requires the training set at every evaluation. The formula is for a discrete empirical distribution, not the unknown population distribution. Exact sampling means starting from its exact noisy marginal and reversing exactly to zero noise; the resulting law is supported on the training examples. Finite-step sampling, approximate initialization and stopping at positive sigma do not imply this exact endpoint statement. A neural denoiser avoids an explicit dataset scan and supplies an inductive bias; it can generalize but can also memorize, so generalization is not guaranteed by choosing a network. D_theta is learned from noisy-clean pairs, not necessarily distilled by explicitly evaluating this sum.
The following Euler demo uses a smooth two-Gaussian population rather than the discrete empirical example. The conditional-mean definition and sampling field are unchanged. Noise-level asymptotics were removed at the author's request.
-->

---
clicks: 1
id: generate-samples-with-a-denoiser
class: theorems
---

# Generate Samples with a Denoiser

**Use the trained denoiser in the ODE solver.** Start from strong noise and decrease $\sigma$.

<div class="block" v-click="1">

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

<div v-click="1">

**We now have an explicit Euler sampler in noise coordinates.**

How does this relate to the deterministic DDIM update?

</div>

<div class="source"><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a></div>

<!--
Narrative: the noise-coordinate PF-ODE defines the denoiser field, and the preceding slides train its denoiser and interpret its conditional-mean prediction. This slide answers how to generate with the trained model: initialize strong Gaussian noise, repeatedly evaluate the network and apply an explicit Euler step, and return the final state. The conclusion asks how this explicit Euler sampler relates to the familiar deterministic DDIM update. The next slide recalls the original DDIM state and predictions, then normalizes the state and noise level to expose exactly this Euler step. The DDIM slide closes with the equivalence of the two updates; the next section motivates learning the velocity field at its own opening. Do not restart the conditional-mean explanation or branch into solver comparisons here; the model definition and solver options have already been established.
Superscripts (i) index numerical sampling states, avoiding confusion with the clean training target x_0. Choose sigma_0 sufficiently large that N(0,sigma_0^2 I) approximates the noisy data marginal. Euler is an approximate numerical solver; this is not an exact sampler at arbitrary step sizes or sigma_0.
The step follows x_next = x + delta_sigma * (x - D_theta)/sigma, with delta_sigma < 0. For a step ending at zero, x_next = D_theta(x,sigma); the network and denominator are evaluated at the positive current sigma, never at zero. Heun can integrate the same field; its final zero-noise step uses Euler to avoid evaluating the singular endpoint.
The learned denoiser estimates E[x_0|x] at the current positive noise level. It does not identify which original clean point generated a noisy point; repeated predictions along the numerical trajectory are part of the generative process. This distinction also prevents confusing the denoiser with a consistency model that targets a trajectory endpoint.
This extends the sampler-change idea introduced with DDIM, rather than claiming that denoiser prediction or changing the sampler is new. It is the explicit ODE/Euler realization of the denoiser parameterization.
-->

---
clicks: 0
id: one-denoiser-prediction-one-euler-step
class: interactive-slide
---

# One Denoiser Prediction, One Euler Step

Decrease the noise level, then recompute the denoiser at the new state.

<DenoiserStepDemo />

<div class="source"><a href="https://arxiv.org/abs/2206.00364">Karras T., et al. Elucidating the Design Space of Diffusion-Based Generative Models, 2022</a></div>

<!--
The previous slide gives the complete Euler algorithm. This slide rewrites that update as interpolation towards the current denoiser prediction, then recomputes it at each accepted step. The next slide derives the identical update from deterministic DDIM in normalized coordinates. The analytic denoiser is the exact conditional mean for a two-component 2D Gaussian mixture with covariance 0.12 I. It need not lie in a high-density region. At sigma_next=0 stop; never evaluate an ODE quotient at sigma=0. Twelve accepted steps bound the live demonstration. No new training objective is introduced.
-->

---
clicks: 2
id: ddim-is-euler-in-noise-coordinates
class: theorems
---

# DDIM Is Euler in Noise Coordinates

**Recall deterministic DDIM** ($s<t$):

$$
\begin{aligned}
\hat{\bepsilon}&=\bepsilon_{\btheta,t}(\bx_t),\qquad
\hat{\bx}_0=\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\,\hat{\bepsilon}}{\sqrt{\bar{\alpha}_t}},\\
\bx_s&=\sqrt{\bar{\alpha}_s}\,\hat{\bx}_0+\sqrt{1-\bar{\alpha}_s}\,\hat{\bepsilon}.
\end{aligned}
$$

<div class="block" v-click="1">

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

<div class="block" v-click="2">

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

<!--
Narrative: the preceding slide gives an explicit Euler loop in additive-noise coordinates and asks how it relates to deterministic DDIM. Begin with the exact familiar DDIM formulas: the same epsilon_theta,t(x_t), clean estimate, original cumulative alpha_bar schedule, and decreasing index pair s<t. Then rescale both the state and the clock; define the induced denoiser before using it. Divide the DDIM update by sqrt(alpha_bar_s), substitute the current clean estimate, and recover the previous Euler step term for term. The conclusion closes the score/denoiser construction with the exact Euler interpretation of the existing noise predictor.
This is an exact algebraic equality between discrete sampling updates with the same predictor and grid, not an assertion of exact ODE integration, exact sampled marginals, or finite-step inversion. Euler in original x_t/time coordinates would generally be a different finite step. Primary source: DDIM Section 4.3, equations (13)-(15); the paper's alpha_t is the course's cumulative alpha_bar_t.
Recall the DDPM marginal x_t=sqrt(alpha_bar_t)x_0+sqrt(1-alpha_bar_t)epsilon. Dividing by sqrt(alpha_bar_t) gives tilde x_t=x_0+sigma_t epsilon: these are precisely the additive-noise coordinates used in the preceding ODE/denoiser block. The tilde distinguishes the normalized state from the original DDPM state; it is the x argument of that block. sigma_u is the standard deviation of additive noise in the normalized state, not the fresh transition-noise standard deviation sigma_{t->s}, which is zero for deterministic DDIM. For positive beta on the original schedule, s<t gives alpha_bar_s>alpha_bar_t and sigma_s<sigma_t. Assume 0<alpha_bar_t<1 and alpha_bar_s>0, permitting alpha_bar_0=1 at the final step.
D_theta here is the denoiser induced by the already trained noise predictor, not a separately trained replacement: D_theta(tilde x_t,sigma_t)=tilde x_t-sigma_t epsilon_theta,t(sqrt(alpha_bar_t)tilde x_t). The displayed equality to xhat_0 defines this representation exactly; its approximation to the conditional mean depends on model quality. Keep epsilon_theta's original input x_t and timestep t. No retraining or equality between differently weighted training recipes is asserted. For a continuous ODE interpretation, interpolate the schedule and noise-conditioned predictor between training levels. With the exact score, the field is the corresponding PF-ODE; a learned predictor gives its learned approximation.
All hats are recomputed at the current t for every step; they are held fixed only during the step t to s. At s=0, sigma_s=0 and tilde x_s=xhat_0, agreeing with the previous final Euler denoising step. The sigma_t denominator is positive. With the same initial DDPM latent, grid and induced denoiser, the two finite-step algorithms agree under rescaling. The original N(0,I) prior rescales to N(0,I/alpha_bar_T), which is N(0,(1+sigma_T^2)I); the preceding additive sampler's N(0,sigma_max^2 I) is a separate large-noise approximation. Do not claim exactly identical full samplers if their initializations differ.
-->

---
clicks: 0
id: outline-flow-matching
section: "Flow Matching (FM)"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item current"><span>02</span><div>Flow Matching (FM)</div></div>
<div class="outline-item"><span>03</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item"><span>04</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 2
id: continuous-time-normalizing-flows
class: theorems
---

# Continuous-Time Normalizing Flows

**Now learn the velocity field itself.** Recall $\bx_t=\bx(t)$ for $t\in[0,1]$:

<ul>

<li>

$\bx_0 \sim p_0(\bx)$, where $p_0(\bx)$ is a base distribution (mostly $\cN(0, \bI)$);

</li>

<li>

$\bx_1 \sim p_1(\bx)$, where $p_1(\bx)$ is the true data distribution $\pd(\bx)$.

</li>

</ul>

**Time convention:** unlike the diffusion sections, here $t=0$ denotes noise and $t=1$ denotes data. Sampling runs forward in time.

$$
\frac{d \bx_t}{dt} = \bv (\bx_t, t),  \quad \text{with initial condition } \bx(0) = \bx_0.
$$

The velocity $\bv$ determines a flow $\bpsi_t$: $\bx_t = \bpsi_t(\bx_0)$.

<div class="block" v-click="1">

## KFP Theorem (Continuity Equation)

<div v-click="1">

$$
\frac{\partial p_t(\bx)}{\partial t} = - \diver\left(\bv(\bx, t) p_t(\bx)\right) \Leftrightarrow \frac{d \log p_t(\bx(t))}{d t} = - \tr \left( \frac{\partial \bv(\bx(t), t)}{\partial \bx(t)} \right)
$$

</div>

</div>

<ul>

<li v-click="2">

Likelihood-based CNF training requires ODE solves and Jacobian trace evaluations.

</li>

<li v-click="2">

The adjoint method computes gradients through the ODE solution; repeated solves can be costly.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/1806.07366">Chen R. T. Q. et al. Neural Ordinary Differential Equations, 2018</a></div>

<!--
Narrative: the denoiser/DDIM section showed how to construct an ODE field from existing score/noise predictions. Open this section by explicitly making the velocity field itself the learning target. Recall the general CNF model and its continuity equation, then explain the cost of likelihood training. The next slide introduces Flow Matching as velocity regression. This motivation belongs here, where it is developed, rather than as an unanswered question at the end of DDIM. The established time convention switches to generation from base at t=0 to data at t=1.
-->

---
clicks: 2
id: continuous-time-normalizing-flows-2
class: theorems
---

# Flow Matching

<div class="block">

## KFP Theorem (Continuity Equation)

$$
\frac{\partial p_t(\bx)}{\partial t} = - \diver\left(\bv(\bx, t) p_t(\bx)\right) \Leftrightarrow \frac{d \log p_t(\bx(t))}{d t} = - \tr \left( \frac{\partial \bv(\bx(t), t)}{\partial \bx(t)} \right)
$$

</div>

<ul>

<li>

Knowing the vector field $\bv (\bx, t)$, the KFP (or continuity) equation allows us to compute the density $p_t(\bx)$.

</li>

<li>

Flow matching fits velocities by regression, without model ODE solves or trace evaluations during training.

</li>

</ul>

<div class="block" v-click="1">

## Flow Matching

<div v-click="1">

$$
\bbE_{t \sim U[0, 1]} \bbE_{\bx \sim p_t(\bx)}\left\| \bv(\bx, t) - \bv_{\btheta}(\bx, t) \right\|^2 \rightarrow \min_{\btheta}
$$

</div>

</div>

<ul>

<li v-click="2">

Approximate the true vector field $\bv (\bx, t)$ using $\bv_{\btheta}(\bx, t)$.

</li>

<li v-click="2">

Use the learned flow $\bpsi_t$ for deterministic sampling: $\bx_1 = \bpsi_1(\bx_0)$.

</li>

</ul>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 3
id: flow-matching-training-and-sampling
class: theorems
---

# Flow Matching: Training and Sampling

$$
\bbE_{t \sim U[0, 1]} \bbE_{\bx \sim p_t(\bx)}\left\| \bv(\bx, t) - \bv_{\btheta}(\bx, t) \right\|^2 \rightarrow \min_{\btheta}
$$

$$
\bx_0 \sim p_0(\bx) = p(\bx), \quad \bx_1 \sim p_1(\bx) =  \pd(\bx)
$$

<div class="block" v-click="1">

## Training

<ol>

<li v-click="1">

Sample $t \sim U[0, 1]$, $\bx_t \sim p_t(\bx)$.

</li>

<li v-click="1">

Compute loss $\cL = \left\| \bv(\bx_t, t) - \bv_{\btheta}(\bx_t, t) \right\|^2$.

</li>

</ol>

</div>

<div class="block" v-click="2">

## Sampling

<ol>

<li v-click="2">

Sample $\bx_0 \sim \cN(0, \bI)$.

</li>

<li v-click="2">

Solve the ODE to obtain $\bx_1$:

$$
\bx_1 = \bpsi_1(\bx_0) = \ODESolve_v(\bx_0, \btheta, t_0=0, t_1=1).
$$

</li>

</ol>

</div>

<div v-click="3">

**Problem:** The true vector field $\bv(\bx, t)$ is **unknown**.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a></div>

---
clicks: 0
id: nonunique-transport-paths
class: interactive-slide
---

# Many Velocity Fields Connect the Same Endpoints

$$
\bbE_{t \sim U[0, 1]} \bbE_{\bx \sim p_t(\bx)}\left\| \bv(\bx, t) - \bv_{\btheta}(\bx, t) \right\|^2 \rightarrow \min_{\btheta}
$$

<TransportPathsDemo />

<div class="source"><a href="https://arxiv.org/abs/2210.02747">Lipman Y., et al. Flow Matching for Generative Modeling, 2022</a><br><a href="https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching">Original illustration: A Visual Dive into Conditional Flow Matching</a></div>

<!--
The preceding FM algorithm exposes an unknown target field. Three explicit invertible flows now demonstrate that endpoint densities do not select one unique target. This motivates constructing tractable paths in the continuation of flow matching. The Summary retains the regression takeaway. Unlike the PF-ODE example, only endpoints are constrained to agree. All flows have positive affine scales and analytic Gaussian pushforwards: mean (-2+4t, 0), scales (1-.45t,1-.2t); Detour adds (0,1.6 sin(pi t)); Rotation inserts a 1.3 sin(pi t) rotation before scaling. Rotation preserves the current Gaussian density relative to Direct but changes particle trajectories; Detour changes intermediate density. No claim about optimal transport or learned-model quality. Noise-to-data time increases from 0 to 1.
-->

---
clicks: 0
id: outline-2
section: "Conditional Flow Matching (CFM)"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item"><span>02</span><div>Flow Matching (FM)</div></div>
<div class="outline-item current"><span>03</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item"><span>04</span><div>One-Sided Conditioning</div></div>

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

<div class="outline-item"><span>01</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item"><span>02</span><div>Flow Matching (FM)</div></div>
<div class="outline-item current"><span>03</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item"><span>04</span><div>One-Sided Conditioning</div></div>

</div>

---
clicks: 2
id: flow-matching
class: theorems
---

# From Marginal to Conditional Probability Paths

To build a tractable training target, introduce a latent variable $\bz$ and choose conditional paths whose mixture is the desired path:

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

<div class="outline-item"><span>01</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item"><span>02</span><div>Flow Matching (FM)</div></div>
<div class="outline-item current"><span>03</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item"><span>04</span><div>One-Sided Conditioning</div></div>

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

<div class="outline-item"><span>01</span><div>Denoiser Parameterization and Sampling</div></div>
<div class="outline-item"><span>02</span><div>Flow Matching (FM)</div></div>
<div class="outline-item"><span>03</span><div>Conditional Flow Matching (CFM)<div class="outline-sub">CFM Objective<br>Conditional Probability Paths</div></div></div>
<div class="outline-item current"><span>04</span><div>One-Sided Conditioning</div></div>

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

- A denoiser estimates the clean conditional mean under Gaussian noise. In noise coordinates, deterministic DDIM is an Euler step of the denoiser PF-ODE.
- Many velocity fields connect the same endpoints. FM fits a chosen field by regression, without ODE solves or Jacobian traces during training.
- CFM preserves the FM minimizers. The marginal velocity is the posterior mean $\bv(\bx,t)=\bbE_{p_t(\bz|\bx)}\bv(\bx,\bz,t)$.
- Gaussian conditional paths admit a closed-form conditional velocity field.
- Changing the training-time distribution without importance correction reweights the loss; logit-normal time gives Gaussian log-SNR on the straight noise-to-data path.
- For straight paths conditioned on $\bx_1$, **rectified flow** regresses on the displacement $\bx_1-\bx_0$.
- Condition dropout trains both velocity predictions used in classifier-free guidance.
