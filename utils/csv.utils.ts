// ============================================================
// utils/csv.utils.ts
// Generación y descarga de archivos CSV en el navegador.
// ============================================================

/**
 * Convierte un arreglo de objetos a texto CSV, escapando comas,
 * comillas y saltos de línea según RFC 4180.
 */
export function arrayToCSV<T extends Record<string, unknown>>(
  rows: T[],
  columns: { key: keyof T; label: string }[]
): string {
  const escapeCell = (value: unknown): string => {
    const str = value === null || value === undefined ? '' : String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = columns.map((c) => escapeCell(c.label)).join(',');
  const body = rows.map((row) => columns.map((c) => escapeCell(row[c.key])).join(','));

  return [header, ...body].join('\n');
}

/**
 * Dispara la descarga de un archivo CSV en el navegador.
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([`﻿${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
