const fs = require('fs');

const FILES = {
    1: 'ETAPA 1.csv',
    2: 'ETAPA 2.csv'
};

const result = {
    1: {},
    2: {},
    3: {}, // Placeholder
    4: {}  // Placeholder
};

// Global Common Subjects Store (if we want to separate them per stage, we can)
// The app currently uses a global COMMON_SUBJECTS, but the user wants strict separation.
// So we will put common subjects into the stage dict under a special key 'EIXO COMUM' 
// and we will update the app to look for them there.

function parseFile(stage, filename) {
    if (!fs.existsSync(filename)) {
        console.warn(`File not found: ${filename}`);
        return;
    }

    // Read with correct encoding if possible, but JS usually assumes UTF8. 
    // CSV exported from Excel is often Latin1/ANSI. We'll try to handle basic standard chars.
    // If we see diamond symbols, we might need iconv-lite, but let's try reading as buffer for now or utf8.
    const content = fs.readFileSync(filename, 'latin1'); // Using latin1 as it's common for these files in Brazil (Windows-1252)
    const lines = content.split(/\r?\n/);

    lines.forEach(line => {
        const parts = line.split(';');
        if (parts.length < 8) return;

        // Columns based on previous "ETAPA 2.csv" reading
        // 0: Curso, 1: Componente/Disciplina, 7: Professor
        let course = parts[0].trim().replace(/\s+/g, ' ');
        let subject = parts[1].trim();
        let teacher = parts[7].trim();

        // Cleanup
        if (!teacher || teacher === 'PROFESSOR' || teacher === '' || course === 'CURSO') return;
        if (course === 'TODOS OS CURSOS') return; // Events

        if (course === 'EIXO COMUM') {
            // "EIXO COMUM" - Shared subjects for this stage
            if (!result[stage]['EIXO COMUM']) result[stage]['EIXO COMUM'] = [];
            // Remove duplicates
            const exists = result[stage]['EIXO COMUM'].find(s => s.subject === subject);
            if (!exists) {
                result[stage]['EIXO COMUM'].push({ subject, teacher });
            }
        } else {
            // Specific Course
            // Normalize Course Name if needed to match App's IDs? 
            // The App has IDs but stored by Name in SUBJECTS_DB:
            // 'GESTÃO DE RECURSOS HUMANOS': [...]

            if (!result[stage][course]) result[stage][course] = [];

            const exists = result[stage][course].find(s => s.subject === subject);
            if (!exists) {
                result[stage][course].push({ subject, teacher });
            }
        }
    });
}

// Run
try {
    parseFile(1, FILES[1]);
    parseFile(2, FILES[2]);

    // Output just the JS object part
    console.log(JSON.stringify(result, null, 2));

} catch (err) {
    console.error(err);
}
