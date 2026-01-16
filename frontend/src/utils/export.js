/**
 * Exports raw data to a CSV file
 */
export const exportToCSV = (data) => {
  if (!data || data.length === 0) return;

  const headers = ['Region', 'Skill', 'Category', 'Postings', 'Last Updated'];
  
  const csvRows = [
    headers.join(','),
    ...data.map(row => {
      // Wrap strings in quotes to handle commas within the data correctly
      return [
        `"${row.region}"`,
        `"${row.skill}"`,
        `"${row.category}"`,
        row.demandCount,
        `"${new Date(row.lastUpdated).toLocaleDateString()}"`
      ].join(',');
    })
  ];

  downloadFile(csvRows.join('\n'), 'text/csv', 'csv');
};

/**
 * Exports data to a JSON file
 */
export const exportToJSON = (data) => {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, 'application/json', 'json');
};

/**
 * Core download logic
 */
const downloadFile = (content, type, extension) => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const fileName = `skill_gap_ph_${new Date().toISOString().slice(0, 10)}.${extension}`;
  
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  
  document.body.appendChild(a);
  a.click();
  
  // Cleanup memory
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};