# CardFlow Activation Lifecycle

CardFlow Activation Lifecycle is a source-transparent knowledge website and open reference dataset that separates five gift-card states: purchased, activated, redeemed, balance shown and transaction approved. The interactive state map and versioned data help readers, researchers and developers understand what each checkpoint can support, what it cannot prove, which system controls it and what evidence is useful.

The project is issuer-neutral and noncommercial. It does not request card numbers, test codes, accept uploads, calculate rates or promise recovery. Its purpose is to make activation terminology easier to understand without exposing private card information.

## Open reference

Version 1.0.0 includes:

- a machine-readable five-state dataset;
- a JSON Schema 2020-12 validation contract;
- an accessible 1200 × 660 SVG lifecycle map;
- source IDs and claim-specific verification notes;
- citation metadata and explicit reuse licenses.

Every state keeps its positive evidence and its limits together. The model is an editorial reasoning framework, not a universal issuer protocol and not a way to determine the status of an individual card.

## Website links

- [Open the live activation lifecycle guide](https://miuuyy2-bit.github.io/cardflow-activation-lifecycle/)
- [Visit the CardFlow website](https://giftcardapp.ng/)

## Project structure

```text
assets/
  app.js                  Browser entry module
  lifecycle-data.js       Lifecycle copy and evidence definitions
  lifecycle-explorer.js   Tabs, keyboard navigation and panel updates
  lifecycle-map.svg       Reusable accessible lifecycle diagram
  reference.js            Citation-copy interaction
  styles.css              Responsive visual system
data/
  lifecycle-states.json   Versioned open dataset
schema/
  lifecycle-dataset.schema.json
scripts/
  build.mjs               Cross-platform Pages artifact builder
  serve.mjs               Local static server
  validate.mjs            Content and structure checks
index.html                Main knowledge page
reference.html            Dataset, downloads and citation page
404.html                  Branded not-found page
CITATION.cff               Citation metadata
DATA-LICENSE.md            CC BY 4.0 data and content terms
LICENSE                    MIT code license
CHANGELOG.md               Version history
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

## Reuse and citation

Software code is available under the MIT License. The dataset, schema, lifecycle map and explanatory content are available under CC BY 4.0; see [DATA-LICENSE.md](DATA-LICENSE.md). Citation metadata is provided in [CITATION.cff](CITATION.cff).
