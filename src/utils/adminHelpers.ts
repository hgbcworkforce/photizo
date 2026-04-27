/**
 * Admin utility functions for dashboard operations
 */

/**
 * Convert array of objects to CSV format and trigger download
 * @param data Array of objects to export
 * @param filename Name of the CSV file to download
 */
export function downloadCSV<T extends Record<string, any>>(data: T[], filename: string): void {
  if (!data.length) {
    console.warn('No data to export');
    return;
  }

  const keys = Object.keys(data[0]);
  const rows = [
    keys.join(','),
    ...data.map((r) =>
      keys
        .map((k) => {
          const v = Array.isArray(r[k]) ? r[k].join('; ') : r[k];
          return `"${String(v ?? '').replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ];

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format date string to readable format (e.g., "27 Apr 2026")
 * @param date Date string or Date object
 * @returns Formatted date string
 */
export function fmt(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Color palette for charts and UI
 */
export const CHART_COLORS: string[] = ['#F97316', '#111111', '#FBBF24', '#6b7280', '#d1d5db'];
export const ORANGE: string = '#F97316';