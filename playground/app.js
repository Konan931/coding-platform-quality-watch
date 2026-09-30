(() => {
  const embeddedReports = [
    {
      id: "PG-JS-0001",
      platform: "Playground",
      category: "runtime",
      language: "JavaScript",
      title: "Embedded fallback fixture",
      confidence: "reproduced",
      status: "monitoring",
      lastVerified: "2026-09-30",
      observation: {
        expected: "The UI remains usable when external JSON cannot be fetched.",
        actual: "The playground falls back to an embedded fixture."
      }
    }
  ];

  const findings = document.querySelector("#findings");
  const filter = document.querySelector("#filter");
  const runtime = document.querySelector("#runtime");
  let reports = [];

  function addRuntimeItem(label, value) {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value;
    row.append(dt, dd);
    runtime.append(row);
  }

  function render(items) {
    findings.replaceChildren();

    for (const report of items) {
      const article = document.createElement("article");
      article.className = "finding";

      const category = document.createElement("span");
      category.className = "tag";
      category.textContent = report.category || "unknown";

      const body = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = report.title || report.id || "Untitled finding";
      const meta = document.createElement("p");
      meta.textContent = `${report.platform || "unknown"} · ${report.id || "no-id"} · ${report.lastVerified || "unverified"}`;
      body.append(title, meta);

      const state = document.createElement("span");
      state.className = "tag";
      state.textContent = `${report.confidence || "unknown"} / ${report.status || "unknown"}`;

      article.append(category, body, state);
      findings.append(article);
    }
  }

  async function loadReports() {
    if (location.protocol === "file:") {
      return { reports: embeddedReports, source: "embedded fallback (file://)" };
    }

    if (typeof fetch !== "function") {
      return { reports: embeddedReports, source: "embedded fallback (fetch unavailable)" };
    }

    try {
      const response = await fetch("../data/reports.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("report bundle is not an array");
      return { reports: data, source: "generated HTTP bundle" };
    } catch (error) {
      console.warn("Quality Watch playground fallback:", error);
      return { reports: embeddedReports, source: `embedded fallback (${error.message})` };
    }
  }

  function applyFilter() {
    const query = filter.value.trim().toLowerCase();
    render(reports.filter((report) =>
      [report.id, report.platform, report.category, report.title, report.confidence, report.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    ));
  }

  async function boot() {
    const result = await loadReports();
    reports = result.reports;

    addRuntimeItem("Protocol", location.protocol || "unknown");
    addRuntimeItem("Fetch", typeof fetch === "function" ? "available" : "unavailable");
    addRuntimeItem("Modules", "not required");
    addRuntimeItem("Data source", result.source);
    addRuntimeItem("Reports", String(reports.length));
    addRuntimeItem("Mode", "PLAYGROUND");

    render(reports);
    filter.addEventListener("input", applyFilter);
  }

  boot().catch((error) => {
    console.error(error);
    reports = embeddedReports;
    render(reports);
  });
})();
