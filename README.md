# CardFlow Activation Lifecycle

An issuer-neutral, noncommercial GitHub Pages knowledge project explaining the difference between purchase, activation, redemption, balance and transaction approval.

## Why this page is distinct

The CardFlow workspace already contains:

- a Cloudflare Pages quote comparison worksheet;
- WordPress rate comparison and proof-preparation tools;
- a Google Sites guide for troubleshooting gift-card codes that do not work;
- brand-specific articles about receipts, regional restrictions and already-redeemed cards.

This project does not reproduce those intents. Its single job is to teach the lifecycle model: what each state proves, what it cannot prove, which party controls it and which evidence is relevant. It does not calculate rates, accept card details, test codes, upload files or replace issuer support.

## Local checks

```powershell
npm.cmd test
npm.cmd run serve
```

Then open `http://127.0.0.1:4173/`.

## Publication gate

Target repository: `miuuyy2-bit/cardflow-activation-lifecycle`

Target Pages URL: `https://miuuyy2-bit.github.io/cardflow-activation-lifecycle/`

Do not publish until all of the following are known and verified:

1. the public repository is created under the verified CardFlow account;
2. GitHub Pages is configured to use GitHub Actions;
3. the workflow completes successfully;
4. the deployed page is checked independently at desktop and mobile widths.

The deployment workflow is prepared but cannot run until the repository exists and the files are pushed with user authorization.
