export const exportToCSV = (data, filename = 'skill-gap-ph-data.csv') => {
  if (!data || !data.length) return;

  // Define headers based on the API response keys
  const headers = ['Region', 'Skill', 'Category', 'Demand Count', 'Last Updated'];
  
  // Map data to rows
  const rows = data.map(item => [
    `"${item.region}"`,
    `"${item.skill}"`,
    `"${item.category}"`,
    item.demandCount,
    item.lastUpdated
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};