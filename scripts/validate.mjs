import { readFile, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "index.html",
  "reference.html",
  "404.html",
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
  "assets/styles.css",
  "assets/app.js",
  "assets/lifecycle-data.js",
  "assets/lifecycle-explorer.js",
  "assets/reference.js",
  "assets/lifecycle-map.svg",
  "data/lifecycle-states.json",
  "schema/lifecycle-dataset.schema.json",
  "CITATION.cff",
  "DATA-LICENSE.md",
  "LICENSE",
  "CHANGELOG.md",
  "scripts/build.mjs",
  "scripts/serve.mjs",
  "SOURCE-NOTES.md"
];

const errors = [];
for (const file of requiredFiles) {
  try {
    await stat(resolve(root, file));
  } catch {
    errors.push(`Missing required file: ${file}`);
  }
}

const htmlFiles = ["index.html", "reference.html", "404.html"];
for (const htmlFile of htmlFiles) {
  const html = await readFile(resolve(root, htmlFile), "utf8");
  if (!/<html\s+lang="en"/.test(html)) errors.push(`${htmlFile}: missing language declaration`);
  if (!/<meta\s+name="viewport"/.test(html)) errors.push(`${htmlFile}: missing viewport meta`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${htmlFile}: missing title`);

  const localLinks = [...html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)]
    .map((match) => match[1])
    .filter((link) => !/^(?:https?:|mailto:|tel:|data:)/.test(link));

  for (const link of localLinks) {
    const clean = link.split(/[?#]/)[0];
    if (!clean || clean === "./") continue;
    const target = resolve(root, clean.replace(/^\//, ""));
    try {
      await stat(target);
    } catch {
      errors.push(`${htmlFile}: broken local reference ${link}`);
    }
  }
}

const indexHtml = await readFile(resolve(root, "index.html"), "utf8");
const referenceHtml = await readFile(resolve(root, "reference.html"), "utf8");
const publicUrl = "https://miuuyy2-bit.github.io/cardflow-activation-lifecycle/";
if (!indexHtml.includes(`<link rel="canonical" href="${publicUrl}">`)) errors.push("index.html: canonical URL is missing or incorrect");
const referenceUrl = `${publicUrl}reference.html`;
if (!referenceHtml.includes(`<link rel="canonical" href="${referenceUrl}">`)) errors.push("reference.html: canonical URL is missing or incorrect");

const sitemap = await readFile(resolve(root, "sitemap.xml"), "utf8");
if (!sitemap.includes(`<loc>${publicUrl}</loc>`)) errors.push("sitemap.xml: public URL is missing or incorrect");
if (!sitemap.includes(`<loc>${referenceUrl}</loc>`)) errors.push("sitemap.xml: reference URL is missing or incorrect");
const requiredSourceHosts = [
  "support.apple.com",
  "support.google.com",
  "mastercard.us",
  "consumerfinance.gov",
  "consumer.ftc.gov"
];

for (const host of requiredSourceHosts) {
  if (!indexHtml.includes(host)) errors.push(`index.html: missing official source ${host}`);
}

const forbiddenPatterns = [
  /enter (?:your )?(?:gift )?card (?:number|code|pin)/i,
  /upload (?:your )?(?:card|receipt)/i,
  /best (?:gift card )?rate/i,
  /guaranteed (?:payout|recovery|refund)/i,
  /current (?:gift card )?rate/i
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(indexHtml)) errors.push(`index.html: prohibited intent matched ${pattern}`);
  if (pattern.test(referenceHtml)) errors.push(`reference.html: prohibited intent matched ${pattern}`);
}

const appJs = await readFile(resolve(root, "assets/app.js"), "utf8");
const lifecycleData = await readFile(resolve(root, "assets/lifecycle-data.js"), "utf8");
if (!indexHtml.includes('<script type="module" src="assets/app.js"></script>')) errors.push("index.html: module entry script is missing");
if (!appJs.includes('from "./lifecycle-data.js"')) errors.push("app.js: lifecycle data module is not imported");
if (!appJs.includes('from "./lifecycle-explorer.js"')) errors.push("app.js: lifecycle explorer module is not imported");
for (const state of ["purchased", "activated", "redeemed", "balance", "approved"]) {
  if (!new RegExp(`\\b${state}\\s*:`).test(lifecycleData)) errors.push(`lifecycle-data.js: missing state ${state}`);
}

let dataset;
let schema;
try {
  dataset = JSON.parse(await readFile(resolve(root, "data/lifecycle-states.json"), "utf8"));
} catch (error) {
  errors.push(`data/lifecycle-states.json: invalid JSON (${error.message})`);
}
try {
  schema = JSON.parse(await readFile(resolve(root, "schema/lifecycle-dataset.schema.json"), "utf8"));
} catch (error) {
  errors.push(`schema/lifecycle-dataset.schema.json: invalid JSON (${error.message})`);
}

if (dataset) {
  const expectedIds = ["purchased", "activated", "redeemed", "balance", "approved"];
  if (dataset.version !== "1.0.0") errors.push("dataset: expected version 1.0.0");
  if (dataset.license !== "CC-BY-4.0") errors.push("dataset: expected CC-BY-4.0 license");
  if (!Array.isArray(dataset.states) || dataset.states.length !== 5) {
    errors.push("dataset: expected exactly 5 lifecycle states");
  } else {
    const ids = dataset.states.map((state) => state.id);
    const positions = dataset.states.map((state) => state.position);
    if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) errors.push("dataset: lifecycle state order is incorrect");
    if (JSON.stringify(positions) !== JSON.stringify([1, 2, 3, 4, 5])) errors.push("dataset: lifecycle positions are incorrect");

    const sourceIds = new Set((dataset.sources || []).map((source) => source.id));
    for (const state of dataset.states) {
      for (const key of ["canSupport", "cannotProve", "primaryOwner", "usefulEvidence", "sourceIds"]) {
        if (!Array.isArray(state[key])) errors.push(`dataset: ${state.id}.${key} must be an array`);
      }
      for (const sourceId of state.sourceIds || []) {
        if (!sourceIds.has(sourceId)) errors.push(`dataset: ${state.id} references missing source ${sourceId}`);
      }
    }

    for (const source of dataset.sources || []) {
      if (!/^https:\/\//.test(source.url)) errors.push(`dataset: source ${source.id} must use HTTPS`);
    }
  }
}

if (schema) {
  if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") errors.push("schema: expected JSON Schema 2020-12");
  if (!schema.$defs?.state || !schema.$defs?.source) errors.push("schema: state or source definition is missing");
}

const svg = await readFile(resolve(root, "assets/lifecycle-map.svg"), "utf8");
if (!svg.includes("<title") || !svg.includes("<desc")) errors.push("lifecycle-map.svg: accessible title or description is missing");
const serveScript = await readFile(resolve(root, "scripts/serve.mjs"), "utf8");
if (!serveScript.includes('".svg": "image/svg+xml; charset=utf-8"')) errors.push("serve.mjs: SVG content type is missing");
if (!referenceHtml.includes('href="data/lifecycle-states.json"')) errors.push("reference.html: dataset download is missing");
if (!referenceHtml.includes('href="schema/lifecycle-dataset.schema.json"')) errors.push("reference.html: schema link is missing");
if (!referenceHtml.includes('href="CITATION.cff"')) errors.push("reference.html: citation download is missing");

if (errors.length) {
  console.error("Validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${requiredFiles.length} required files, ${htmlFiles.length} HTML pages, ${requiredSourceHosts.length} official sources, 5 lifecycle states and the open reference dataset.`);
