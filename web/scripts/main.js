const findings = document.querySelector("#findings");
const filter = document.querySelector("#filter");
const reportCount = document.querySelector("#report-count");
const verifiedCount = document.querySelector("#verified-count");
const platformCount = document.querySelector("#platform-count");

let reports = [];

function render(items) {
  findings.replaceChildren();

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No findings match the current filter.";
    findings.append(empty);
    return;
  }

  for (const report of items) {
    const article = document.createElement("article");
    article.className = "finding";

    const category = document.createElement("span");
    category.className = "tag";
    category.textContent = report.category;

    const body = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = report.title;
    const meta = document.createElement("p");
    meta.textContent = `${report.platform} · ${report.id} · last verified ${report.lastVerified}`;
    body.append(title, meta);

    const state = document.createElement("span");
    state.className = "tag";
    state.textContent = `${report.confidence} / ${report.status}`;

    article.append(category, body, state);
    findings.append(article);
  }
}

function updateMetrics() {
  reportCount.textContent = reports.length;
  verifiedCount.textContent =
    reports.filter((report) => ["reproduced", "confirmed"].includes(report.confidence)).length;
  platformCount.textContent = new Set(reports.map((report) => report.platform)).size;
}

function showDataError(error) {
  reportCount.textContent = "!";
  verifiedCount.textContent = "!";
  platformCount.textContent = "!";

  const panel = document.createElement("article");
  panel.className = "finding";
  panel.setAttribute("role", "alert");

  const label = document.createElement("span");
  label.className = "tag";
  label.textContent = "data pipeline error";

  const body = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = "Reports could not be loaded.";
  const message = document.createElement("p");
  message.textContent =
    "Run npm test and npm run build, then inspect the browser console for the underlying error.";
  body.append(title, message);

  const state = document.createElement("span");
  state.className = "tag";
  state.textContent = error?.message || "unknown error";

  findings.replaceChildren(panel);
  panel.append(label, body, state);
}

async function loadReports() {
  const response = await fetch("./data/reports.json", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`reports.json returned HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("reports.json is not an array");
  }

  return data;
}

filter.addEventListener("input", () => {
  const query = filter.value.trim().toLowerCase();

  render(reports.filter((report) =>
    [report.id, report.platform, report.category, report.title, report.confidence, report.status]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query)
  ));
});

try {
  reports = await loadReports();
  updateMetrics();
  render(reports);
} catch (error) {
  console.error("Quality Watch failed to initialize:", error);
  showDataError(error);
}
