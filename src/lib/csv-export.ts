/**
 * CSV export helper for admin lists.
 */
type CsvRow = (string | number | boolean | null | undefined)[];

export function rowsToCsv(headers: string[], rows: CsvRow[]): string {
  const escape = (val: string | number | boolean | null | undefined): string => {
    if (val === null || val === undefined) return "";
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };
  const csvRows = [headers.map(escape).join(",")];
  for (const row of rows) {
    csvRows.push(row.map(escape).join(","));
  }
  return csvRows.join("\n");
}

/**
 * Trigger a CSV file download in the browser.
 */
export function downloadCsv(filename: string, headers: string[], rows: CsvRow[]): void {
  const csv = rowsToCsv(headers, rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
