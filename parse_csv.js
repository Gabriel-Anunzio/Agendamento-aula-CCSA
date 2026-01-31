const fs = require('fs');

const data = fs.readFileSync('ETAPA 1.csv', 'utf8'); // Assuming default encoding, might be logic needed if latin1
const lines = data.split(/\r?\n/);

const common = [];
const specific = {}; // { CourseName: [ { subject, teacher } ] }
const coursesFound = new Set();

lines.forEach(line => {
    const parts = line.split(';');
    if (parts.length < 8) return;

    const course = parts[0].trim().replace(/\s+/g, ' '); // Normalize spaces
    const subject = parts[1].trim();
    const stage = parts[2].trim();
    const teacher = parts[7].trim();

    // Skip header or empty rows (Checking if 'stage' is '1' or valid)
    // The CSV has "TODOS OS CURSOS" which are events, we might skip those for now if they are not subjects.
    // Real subjects seem to have specific course names or "EIXO COMUM".

    // Filter out rows that don't have a teacher (likely events or headers)
    if (!teacher || teacher === 'PROFESSOR') return;

    if (course === 'EIXO COMUM') {
        // Avoid duplicates
        if (!common.find(i => i.subject === subject)) {
            common.push({ subject, teacher });
        }
    } else if (course !== 'TODOS OS CURSOS' && course !== 'CURSO' && course !== 'FERIADOS' && course !== 'ATRIBUIÇÕES') {
        // Specific Course
        if (!specific[course]) specific[course] = [];

        // Avoid duplicates
        if (!specific[course].find(i => i.subject === subject)) {
            specific[course].push({ subject, teacher });
            coursesFound.add(course);
        }
    }
});

console.log(JSON.stringify({
    common,
    specific,
    courses: Array.from(coursesFound)
}, null, 2));
