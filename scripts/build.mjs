import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "_site");
const publicFiles = [
  "index.html",
  "reference.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  ".nojekyll",
  "CITATION.cff",
  "DATA-LICENSE.md",
  "CHANGELOG.md",
  "LICENSE"
];
const publicDirectories = ["assets", "data", "schema"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of publicFiles) {
  await copyFile(resolve(root, file), resolve(output, file));
}

for (const directory of publicDirectories) {
  await cp(resolve(root, directory), resolve(output, directory), { recursive: true });
}

console.log(`Built ${publicFiles.length} public files and ${publicDirectories.length} public directories in _site/.`);
