import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../reports/", import.meta.url);
const required = [
  "id",
  "platform",
  "category",
  "title",
  "observation",
  "environment",
  "reproduction",
  "evidence",
  "confidence",
  "status",
  "firstSeen",
  "lastVerified"
];

const categories = new Set([
  "content",
  "pedagogy",
  "autograder",
  "runtime",
  "sandbox",
  "ux",
  "accessibility",
  "security",
  "privacy",
  "reliability",
  "compatibility",
  "positive-pattern"
]);

const confidenceStates = new Set([
  "unverified",
  "reproduced",
  "confirmed",
  "ambiguous",
  "environment-specific"
]);

const lifecycleStates = new Set([
  "open",
  "monitoring",
  "fixed",
  "regression",
  "outdated",
  "unreproducible"
]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await walk(path));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(path);
    }
  }

  return files;
}

function validate(report, path) {
  const errors = [];

  for (const key of required) {
    if (!(key in report)) {
      errors.push(`missing required field: ${key}`);
    }
  }

  if (!/^[A-Z0-9]+(?:-[A-Z0-9]+){2,}$/.test(report.id ?? "")) {
    errors.push("id must contain at least three uppercase/alphanumeric segments");
  }

  if (!categories.has(report.category)) {
    errors.push(`unsupported category: ${report.category}`);
  }

  if (!confidenceStates.has(report.confidence)) {
    errors.push(`unsupported confidence: ${report.confidence}`);
  }

  if (!lifecycleStates.has(report.status)) {
    errors.push(`unsupported status: ${report.status}`);
  }

  if (!report.observation?.expected || !report.observation?.actual) {
    errors.push("observation.expected and observation.actual are required");
  }

  if (!Array.isArray(report.reproduction?.steps) || report.reproduction.steps.length === 0) {
    errors.push("reproduction.steps must contain at least one step");
  }

  if (!Array.isArray(report.evidence)) {
    errors.push("evidence must be an array");
  }

  return errors.map((error) => `${path}: ${error}`);
}

const files = await walk(root);
const failures = [];

for (const path of files) {
  try {
    const report = JSON.parse(await readFile(path, "utf8"));
    failures.push(...validate(report, path));
  } catch (error) {
    failures.push(`${path}: ${error.message}`);
  }
}

if (failures.length > 0) {
  console.error("Quality Watch validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Quality Watch validation passed: ${files.length} JSON report(s).`);
}
