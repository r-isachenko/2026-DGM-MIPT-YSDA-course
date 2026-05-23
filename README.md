# Deep Generative Models course, MIPT&YSDA, 2026

## Description
This course provides a deep dive into the theoretical foundations and practical applications of Deep Generative Models (DGM). While the primary focus is on Computer Vision, the principles covered are universal across modern AI.

We bridge the gap between rigorous mathematical theory and state-of-the-art implementation. The curriculum is organized into six major pillars:

- Likelihood-based Models: Autoregressive models (ImageGPT) and Normalizing Flows (Linear NF, Gaussian Autoregressive NF, RealNVP).

- Latent Variable Models: Variational Autoencoders (VAE) via the ELBO, amortized inference, and discrete extensions (VQ-VAE).

- Adversarial Learning: Generative Adversarial Networks (GAN), Wasserstein geometry (WGAN), and likelihood-free evaluation protocols (FID, Precision-Recall, CLIP Score).

- Score-based and Diffusion Models: from Langevin dynamics, score matching, and NCSN to DDPM and classifier / classifier-free guidance.

- Continuous-Time Formulations: Continuous-Time Normalizing Flows, SDE/ODE perspectives on diffusion (VP-SDE / VE-SDE), probability flow ODE, reverse SDE, and Flow Matching (conditional, one-sided, and two-sided).

- Discrete Diffusion: forward and reverse discrete processes, absorbing diffusion, and continuous-time masked diffusion language models.

Special attention is given to the key properties of different generative model families, the connections between them, their theoretical foundations, and standard evaluation protocols.

The goal of the course is to provide a solid introduction to state-of-the-art deep generative modeling methods used in practice and research.

The course is supported by seminars and hands-on assignments that help build intuition through implementation and experiments.

## Contact the author to join the course or for any other questions :)

- **telegram:** [@roman_isachenko](https://t.me/roman_isachenko)
- **e-mail:** roman.isachenko@phystech.edu

## Materials

| # | Date | Description | Slides |
|---|---|---|---|
<!---
| 1 | January, 29 | <b>Lecture 1:</b><ul><li>Introduction and Logistics</li><li>Generative Models Overview</li><li>Generative Modeling Framework<ul><li>Course Tricks</li><li>Problem Statement</li><li>Divergence Minimization Framework</li></ul></li><li>Autoregressive Models (ImageGPT)</li></ul> | [slides](lectures/lecture1/Lecture1.pdf) |
|  |  | <b>Seminar 1:</b> Introduction. Maximum likelihood estimation. Histograms. Bayes theorem. PixelCNN. VAR. | [slides](seminars/seminar1/) <a href="https://colab.research.google.com/github/r-isachenko/2024-DGM-MIPT-YSDA-course/blob/main/seminars/seminar1/PixelCNN.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a> |
| 2 | February, 5 | <b>Lecture 2:</b><ul><li>Normalizing Flows (NF)</li><li>NF Examples<ul><li>Linear NF</li><li>Gaussian Autoregressive NF</li><li>Coupling Layer (RealNVP)</li></ul></li><li>Latent Variable Models (LVM)</li></ul> | [slides](lectures/lecture2/Lecture2.pdf) |
|  |  | <b>Seminar 2:</b> Planar and Radial Flows. Forward vs Reverse KL. | [slides](seminars/seminar2/) |
| 3 | February, 12 | <b>Lecture 3:</b><ul><li>Latent Variable Models (LVM) (continued)</li><li>Variational Evidence Lower Bound (ELBO)</li><li>Amortized Inference</li><li>ELBO Gradients, Reparametrization Trick</li><li>Variational Autoencoder (VAE)</li></ul> | [slides](lectures/lecture3/Lecture3.pdf) |
|  |  | <b>Seminar 3:</b> Gaussian Mixture Model (GMM). GMM and MLE. ELBO and EM-algorithm. GMM via EM-algorithm. Variational EM algorithm for GMM. | [slides](seminars/seminar3/) |
| 4 | February, 19 | <b>Lecture 4:</b><ul><li>ELBO Surgery and Optimal VAE Prior</li><li>Discrete VAE Latent Representations</li><li>Vector Quantized VAE (VQ-VAE)</li><li>Likelihood-Free Learning</li></ul> | [slides](lectures/lecture4/Lecture4.pdf) |
|  |  | <b>Seminar 4:</b>  VAE: Implementation hints. Vanilla 2D VAE coding. VAE on Binarized MNIST visualization. Posterior collapse. Beta VAE on MNIST. | [slides](seminars/seminar4/) |
| 5 | March, 5 | <b>Lecture 5:</b><ul><li>Generative Adversarial Networks (GAN)</li><li>Wasserstein Distance</li><li>Wasserstein GAN (WGAN)</li><li>Evaluation of Likelihood-Free Models<ul><li>Frechet Inception Distance (FID)</li><li>Precision-Recall</li><li>CLIP Score</li><li>Human Eval</li></ul></li></ul> | [slides](lectures/lecture5/Lecture5.pdf) |
|  |  | <b>Seminar 5:</b> Vanilla GAN in 1D coding. Mode collapse and vanishing gradients. Non-saturating GAN. Wasserstein GAN (WGAN) and WGAN-GP | [slides](lectures/lecture6/Lecture6.pdf) |
| 6 | March, 12 | <b>Lecture 6:</b><ul><li>Langevin Dynamics</li><li>Score Matching<ul><li>Denoising Score Matching</li><li>Noise-Conditioned Score Network (NCSN)</li></ul></li></ul> | [slides](lectures/lecture6/Lecture6.pdf) |
|  |  | <b>Seminar 6:</b> Progressive Growing GAN. StyleGAN | [slides](seminars/seminar6/) |
| 7 | March, 19 | <b>Lecture 7:</b><ul><li>Forward Gaussian Diffusion Process</li><li>Reverse Gaussian Diffusion Process</li><li>Gaussian Diffusion Model as VAE</li><li>Diffusion ELBO Derivation</li></ul> | [slides](lectures/lecture7/Lecture7.pdf) |
|  |  | <b>Seminar 7:</b> Noise Conditioned Score Network (NCSN). Heuristic diffusion model. | [slides](seminars/seminar7/) |
| 8 | March, 26 | <b>Lecture 8:</b><ul><li>Diffusion ELBO Derivation (continued)</li><li>Gaussian Diffusion Reparametrization</li><li>Denoising Diffusion Probabilistic Model (DDPM)</li><li>Model Guidance<ul><li>Classifier Guidance</li><li>Classifier-Free Guidance</li></ul></li></ul> | [slides](lectures/lecture8/Lecture8.pdf) |
|  |  | <b>Seminar 8:</b> Guidance. CLIP, GLIDE, DALL-E 2, Imagen. | [slides](seminars/seminar8/) |
| 9 | April, 2 | <b>Lecture 9:</b><ul><li>Continuous-Time Normalizing Flows (CNF)</li><li>Continuity Equation for CNF Log-Likelihood</li><li>SDE Basics</li><li>Diffusion and Score Matching SDEs (VP-SDE / VE-SDE)</li></ul> | [slides](lectures/lecture9/Lecture9.pdf) |
|  |  | <b>Seminar 9:</b> Latent Diffusion Model. Stable Diffusion. | [slides](seminars/seminar9/) <a href="https://colab.research.google.com/github/r-isachenko/2026-DGM-AIMasters-course/blob/main/seminars/seminar9/seminar9_SD.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a> |
| 10 | April, 9 | <i>Lecture rescheduled — no lecture this week.</i> |  |
|  |  | <b>Seminar 10:</b>  Latent Diffusion Models Control Methods: ControlNet, IP-Adapter, Dreambooth, LoRA| [slides](seminars/seminar10/seminar_10_adapters.ipynb)<a href="https://colab.research.google.com/github/r-isachenko/2026-DGM-AIMasters-course/blob/main/seminars/seminar10/seminar_10_adapters.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a> |
| 11 | April, 16 | <b>Lecture 10:</b><ul><li>Probability Flow ODE</li><li>Reverse SDE</li><li>Score-Based Generative Models Through SDEs</li><li>Flow Matching (FM)</li></ul> | [slides](lectures/lecture10/Lecture10.pdf) |
|  |  | <b>Seminar 11:</b> Evolution of Stable Diffusion: SD1.5 → SDXL → SD3.5 → FLUX → FluxKontext → NanoBanana | [slides](seminars/seminar11/seminar11.ipynb) <a href="https://colab.research.google.com/github/r-isachenko/2026-DGM-AIMasters-course/blob/main/seminars/seminar11/seminar11.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a> |
| 12 | April, 23 | <b>Lecture 11:</b><ul><li>Conditional Flow Matching (CFM)</li><li>One-Sided Conditioning</li></ul> | [slides](lectures/lecture11/Lecture11.pdf) |
|  |  | <b>Seminar 12:</b> Video Diffusion: from 3D U-Net and temporal attention to DiT-based models (Sora, CogVideoX, HunyuanVideo, Wan, LTX) and autoregressive video | [slides](seminars/seminar12/seminar12.ipynb) <a href="https://colab.research.google.com/github/r-isachenko/2026-DGM-AIMasters-course/blob/main/seminars/seminar12/seminar12.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a> |
| 12 | April, 30 | <b>Lecture 12:</b><ul><li>Two-Sided Conditioning</li><li>Link between Flow Matching and Score-Based Models</li><li>Discrete Diffusion Models</li><li>Forward Discrete Process</li></ul> | [slides](lectures/lecture12/Lecture12.pdf) |
|  |  | <b>Seminar 13:</b> – | |
| 13 | December, 16 | <b>Lecture 13:</b><ul><li>Discrete Diffusion<ul><li>Reverse Diffusion Process</li><li>From Token To Sequence</li><li>Absorbing Diffusion</li><li>Continuous Time Formulation</li></ul></li><li>Course Overview</li></ul> | [slides](lectures/lecture13/Lecture13.pdf) |
|  |  | <b>Seminar 14:</b> – |  |
| 14 | December, 23 | <b>Lecture 14:</b>  | [slides](lectures/lecture14/Lecture14.pdf) |
|  |  | <b>Seminar 14:</b> The Final Recap| [slides](seminars/seminar14/seminar14.ipynb) |
-->

## Homeworks


| Homework | Date | Deadline | Description | Link |
|---------|------|-------------|--------|-------|
<!---
| 1 | February, 6 | February, 20 | <ol><li>Theory (f-divergence, curse of dimensionality, NF expressivity).</li><li>ImageGPT on MNIST.</li><li>RealNVP on MNIST.</li></ol> | [![Open In Github](https://img.shields.io/static/v1.svg?logo=github&label=Repo&message=Open%20in%20Github&color=lightgrey)](homeworks/hw1.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/r-isachenko/2026-DGM-AIMasters-course/blob/main/homeworks/hw1.ipynb) |
| 2 | February, 21 | March, 7 | <ol><li>Theory (IWAE theory, Gaussian VAE, ELBO surgery).</li><li>ViT VAE on CIFAR10.</li><li>ViT VQ-VAE on CIFAR10.</li></ol> | [![Open In Github](https://img.shields.io/static/v1.svg?logo=github&label=Repo&message=Open%20in%20Github&color=lightgrey)](homeworks/hw2.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/r-isachenko/2026-DGM-AIMasters-course/blob/main/homeworks/hw2.ipynb) |
| 3 | March, 8 | March, 26 | <ol><li>Theory (Conjugate functions, FID for Normal distributions, Implicit score matching).</li><li>Wasserstein GANs for CIFAR 10.</li><li>NCSN on CIFAR 10.</li></ol> | [![Open In Github](https://img.shields.io/static/v1.svg?logo=github&label=Repo&message=Open%20in%20Github&color=lightgrey)](homeworks/hw3.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/r-isachenko/2026-DGM-AIMasters-course/blob/main/homeworks/hw3.ipynb) |
| 4 | March, 27 | April, 10 | <ol><li>Theory (Conditioned reverse distribution, Gaussian diffusion, Tweedie's formula).</li><li>DDPM on 2D data.</li><li>DDPM on CIFAR10 with guidance.</li></ol> | [![Open In Github](https://img.shields.io/static/v1.svg?logo=github&label=Repo&message=Open%20in%20Github&color=lightgrey)](homeworks/hw4.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/r-isachenko/2026-DGM-AIMasters-course/blob/main/homeworks/hw4.ipynb) |
| 5 | April, 11 | April, 25 | <ol><li>Theory (KFP theorem, DDPM as SDE discretization, Covariance of forward SDE).</li><li>FID and Predictor Sampler</li><li>Predictor-Corrector Sampler</li><li>DDIM Sampler</li></ol> | [![Open In Github](https://img.shields.io/static/v1.svg?logo=github&label=Repo&message=Open%20in%20Github&color=lightgrey)](homeworks/hw5.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/r-isachenko/2026-DGM-AIMasters-course/blob/main/homeworks/hw5.ipynb) |
| 6 |  April, 27 | May, 11 | <ol><li>Theory (Linear Vector Fields, Reverse-Time SDE from Bayes' Rule, Posterior in Discrete Diffusion).</li><li>Flow matching on CIFAR10 using DiT.</li><li>Rectified flow.</li><li>Flow matching with OT coupling.</li></ol> |  [![Open In Github](https://img.shields.io/static/v1.svg?logo=github&label=Repo&message=Open%20in%20Github&color=lightgrey)](homeworks/hw6.ipynb)<br>[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/r-isachenko/2026-DGM-AIMasters-course/blob/main/homeworks/hw6.ipynb) |
-->

## Game rules
- 6 homeworks each of 15 points = **90 points**
- oral cozy exam = **30 points**
- maximum points: 90 + 30 = **120 points**
### Final grade: `min(floor(#points/10), 10)`

## Prerequisities
- **Math**: probability theory, basic statistics, and multivariate calculus
- **ML**: fundamentals of machine learning and deep learning
- **Programming**: confident Python; ability to read and modify research-style code.
- **Tools**: PyTorch / basic GPU workflow is a plus.
- **Optional**: information theory basics (entropy, KL divergence),
- **Optional**: familiarity with numerical ODE/SDE concepts at a “black-box usage” level.

## Previous episodes
- [2026, spring, AIMasters](https://github.com/r-isachenko/2026-DGM-AIMasters-course)
- [2025, autumn, MIPT+YSDA](https://github.com/r-isachenko/2025-DGM-MIPT-YSDA-course)
- [2025, spring, AIMasters](https://github.com/r-isachenko/2025-DGM-AIMasters-course)
- [2024, autumn, MIPT+YSDA](https://github.com/r-isachenko/2024-DGM-MIPT-YSDA-course)
- [2024, spring, AIMasters](https://github.com/r-isachenko/2024-DGM-AIMasters-course)
- [2023, autumn, MIPT](https://github.com/r-isachenko/2023-DGM-MIPT-course)
- [2022-2023, autumn-spring, MIPT](https://github.com/r-isachenko/2022-2023-DGM-MIPT-course)
- [2022, autumn, AIMasters](https://github.com/r-isachenko/2022-2023-DGM-AIMasters-course)
- [2022, spring, OzonMasters](https://github.com/r-isachenko/2022-DGM-Ozon-course)
- [2021, autumn, MIPT](https://github.com/r-isachenko/2021-DGM-MIPT-course)
- [2021, spring, OzonMasters](https://github.com/r-isachenko/2021-DGM-Ozon-course)
- [2020, autumn, MIPT](https://github.com/r-isachenko/2020-DGM-MIPT-course)

