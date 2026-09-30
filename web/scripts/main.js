const reportPaths = [
  "../reports/examples/SL-JS-0001.json"
];

const findings = document.querySelector("#findings");
const filter = document.querySelector("#filter");

const reports = await Promise.all(
  reportPaths.map(async (path) => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.json();
  })
);

function render(items) {
  findings.replaceChildren();

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
  document.querySelector("#report-count").textContent = reports.length;
  document.querySelector("#verified-count").textContent =
    reports.filter((report) => ["reproduced", "confirmed"].includes(report.confidence)).length;
  document.querySelector("#platform-count").textContent =
    new Set(reports.map((report) => report.platform)).size;
}

filter.addEventListener("input", () => {
  const query = filter.value.trim().toLowerCase();
  render(reports.filter((report) =>
    [report.id, report.platform, report.category, report.title, report.confidence, report.status]
      .join(" ")
      .toLowerCase()
      .includes(query)
  ));
});

updateMetrics();
render(reports);
