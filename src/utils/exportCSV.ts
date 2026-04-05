export const exportCSV = (data: Record<string, any>[], filename: string): void => {
  if (!data.length) return;

  // 1. Get headers from the first object keys
  const keys = Object.keys(data[0]);

  // 2. Build CSV rows
  const csv = [
    keys.join(','), // Header row
    ...data.map((row) =>
      keys
        .map((k) => {
          const val = row[k] ?? '';
          // Escape quotes and wrap in quotes to handle commas within values
          return `"${val.toString().replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\n');

  // 3. Create a blob and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  
  // Append to body, click, and cleanup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
