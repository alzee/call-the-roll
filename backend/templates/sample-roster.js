const XLSX = require('xlsx');

// Sample data for the roster template
const sampleData = [
  {
    'Name': 'John Doe',
    'Position': 'Software Engineer',
    'Department': 'Engineering'
  },
  {
    'Name': 'Jane Smith',
    'Position': 'Product Manager',
    'Department': 'Product'
  },
  {
    'Name': 'Michael Johnson',
    'Position': 'Data Analyst',
    'Department': 'Analytics'
  },
  {
    'Name': 'Sarah Williams',
    'Position': 'UX Designer',
    'Department': 'Design'
  },
  {
    'Name': 'David Brown',
    'Position': 'Marketing Specialist',
    'Department': 'Marketing'
  }
];

// Create workbook and worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(sampleData);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Roster');

// Write to file
XLSX.writeFile(workbook, 'templates/sample-roster.xlsx');

console.log('Sample roster template created: templates/sample-roster.xlsx');
