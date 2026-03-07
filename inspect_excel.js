const XLSX = require('xlsx');
const workbook = XLSX.readFile('c:/Users/anunz/Desktop/Agendamento Ficticio/AGENDAMENTO AULAS.xlsx');
console.log('Sheet Names:', workbook.SheetNames);
const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
console.log('First 5 rows:', data.slice(0, 5));
