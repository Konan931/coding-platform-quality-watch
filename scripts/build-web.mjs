import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const webRoot = join(repoRoot, "web");
const reportsRoot = join(repoRoot, "reports");
const playgroundRoot = join(repoRoot, "playground");
const distRoot = join(repoRoot, "dist");

async function collectJsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectJsonFiles(path));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(path);
    }
  }

  return files;
}

const reportFiles = (await collectJsonFiles(reportsRoot)).sort();
const reports = [];

for (const path of reportFiles) {
  reports.push(JSON.parse(await readFile(path, "utf8")));
}

await rm(distRoot, { recursive: true, force: true });
await mkdir(distRoot, { recursive: true });
await cp(webRoot, distRoot, { recursive: true });

await mkdir(join(distRoot, "data"), { recursive: true });
await writeFile(
  join(distRoot, "data", "reports.json"),
  JSON.stringify(reports, null, 2) + "\n",
  "utf8"
);

await cp(playgroundRoot, join(distRoot, "playground"), { recursive: true });

console.log(
  `Quality Watch web build complete: ${reports.length} report(s) -> dist/data/reports.json`
);
