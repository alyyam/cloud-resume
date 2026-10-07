// Visitor counter. The API (/api/visitors) will be created in Phase 3.
// Until then, the page shows a short message instead of a number.
async function updateVisitorCount() {
  const countEl = document.getElementById("visitor-count");
  const noteEl = document.getElementById("visitor-note");

  try {
    const response = await fetch("/api/visitors", { method: "POST" });
    if (!response.ok) throw new Error("API returned " + response.status);
    const data = await response.json();
    countEl.textContent = Number(data.count).toLocaleString("en-AU");
  } catch (error) {
    countEl.textContent = "–";
    noteEl.textContent = "Visitor count is not available right now.";
  }
}

updateVisitorCount();
