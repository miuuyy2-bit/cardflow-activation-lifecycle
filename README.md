# CardFlow Activation Lifecycle

CardFlow Activation Lifecycle is a small, source-transparent knowledge website that explains five separate gift-card states: purchased, activated, redeemed, balance shown and transaction approved. The interactive state map helps readers understand what each checkpoint can prove, what it cannot prove, which party controls it and what evidence is useful.

The project is issuer-neutral and noncommercial. It does not request card numbers, test codes, accept uploads, calculate rates or promise recovery. Its purpose is to make activation terminology easier to understand without exposing private card information.

## Website links

- [Open the live activation lifecycle guide](https://miuuyy2-bit.github.io/cardflow-activation-lifecycle/)
- [Visit the CardFlow website](https://giftcardapp.ng/)

## Project structure

```text
assets/
  app.js                  Browser entry module
  lifecycle-data.js       Lifecycle copy and evidence definitions
  lifecycle-explorer.js   Tabs, keyboard navigation and panel updates
  styles.css              Responsive visual system
scripts/
  build.mjs               Cross-platform Pages artifact builder
  serve.mjs               Local static server
  validate.mjs            Content and structure checks
index.html                Main knowledge page
404.html                  Branded not-found page
```

## Local development

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run serve
```

Open `http://127.0.0.1:4173/` after starting the local server. The GitHub Actions workflow validates the source, builds `_site/` and deploys the artifact to GitHub Pages.

## Content boundary

This repository focuses only on the activation lifecycle. It intentionally avoids quote comparison, rate calculation, code troubleshooting and brand-specific redemption instructions so it does not duplicate other CardFlow resources.
