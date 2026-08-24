import { readFile, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "index.html",
  "404.html",
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
  "assets/styles.css",
  "assets/app.js",
  "assets/lifecycle-data.js",
  "assets/lifecycle-explorer.js",
  "scripts/build.mjs",
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

const htmlFiles = ["index.html", "404.html"];
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
const publicUrl = "https://miuuyy2-bit.github.io/cardflow-activation-lifecycle/";
if (!indexHtml.includes(`<link rel="canonical" href="${publicUrl}">`)) errors.push("index.html: canonical URL is missing or incorrect");

const sitemap = await readFile(resolve(root, "sitemap.xml"), "utf8");
if (!sitemap.includes(`<loc>${publicUrl}</loc>`)) errors.push("sitemap.xml: public URL is missing or incorrect");
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
}

const appJs = await readFile(resolve(root, "assets/app.js"), "utf8");
const lifecycleData = await readFile(resolve(root, "assets/lifecycle-data.js"), "utf8");
if (!indexHtml.includes('<script type="module" src="assets/app.js"></script>')) errors.push("index.html: module entry script is missing");
if (!appJs.includes('from "./lifecycle-data.js"')) errors.push("app.js: lifecycle data module is not imported");
if (!appJs.includes('from "./lifecycle-explorer.js"')) errors.push("app.js: lifecycle explorer module is not imported");
for (const state of ["purchased", "activated", "redeemed", "balance", "approved"]) {
  if (!new RegExp(`\\b${state}\\s*:`).test(lifecycleData)) errors.push(`lifecycle-data.js: missing state ${state}`);
}

if (errors.length) {
  console.error("Validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${requiredFiles.length} required files, ${htmlFiles.length} HTML pages, ${requiredSourceHosts.length} official sources and 5 lifecycle states.`);
