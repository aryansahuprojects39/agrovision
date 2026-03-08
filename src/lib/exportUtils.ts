export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((h) => {
        const val = row[h] ?? "";
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      }).join(",")
    ),
  ];
  downloadFile(csvRows.join("\n"), `${filename}.csv`, "text/csv");
}

export function exportToPDF(title: string, sections: { heading: string; rows: string[][] }[]) {
  // Generate a printable HTML document and trigger print dialog
  const html = `
    <!DOCTYPE html>
    <html><head><title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
      h1 { color: #2d6a4f; border-bottom: 2px solid #2d6a4f; padding-bottom: 8px; }
      h2 { color: #40916c; margin-top: 24px; }
      table { width: 100%; border-collapse: collapse; margin: 12px 0 24px; }
      th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 13px; }
      th { background: #f0f7f4; font-weight: 600; }
      tr:nth-child(even) { background: #fafafa; }
      .meta { color: #666; font-size: 12px; margin-bottom: 20px; }
    </style></head><body>
    <h1>${title}</h1>
    <p class="meta">Generated on ${new Date().toLocaleString()}</p>
    ${sections.map((s) => `
      <h2>${s.heading}</h2>
      <table>
        <thead><tr>${s.rows[0]?.map((h) => `<th>${h}</th>`).join("") || ""}</tr></thead>
        <tbody>${s.rows.slice(1).map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    `).join("")}
    </body></html>
  `;
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.print();
  }
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
