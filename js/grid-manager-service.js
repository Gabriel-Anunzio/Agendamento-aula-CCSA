/**
 * grid-manager-service.js - Admin Academic Grid Management
 */

window.gmSelectedCourse = null;
window.gmActiveAxis = 'specific'; // 'specific' or 'common'
window.gmActiveStage = null;

window.openGridManager = function () {
    window.closeAdminSettings();
    window.gmActiveStage = window.state.activeStage;
    document.getElementById('gm-stage-select').value = window.gmActiveStage;
    window.setGMAxis('specific'); // Default
    document.getElementById('grid-manager-modal').classList.remove('hidden');
};

window.changeGMStage = function (val) {
    window.gmActiveStage = parseInt(val);
    window.gmSelectedCourse = null;
    window.renderGMCourses();
    window.renderGMSubjects();
};

window.setGMAxis = function (axis) {
    window.gmActiveAxis = axis;
    window.gmSelectedCourse = null;

    const btnSpecific = document.getElementById('gm-btn-specific');
    const btnCommon = document.getElementById('gm-btn-common');
    const courseSection = document.getElementById('gm-courses-section');
    const subjectsHeader = document.getElementById('gm-subjects-header');
    const noSelection = document.getElementById('gm-no-selection');

    if (axis === 'specific') {
        btnSpecific.className = "py-2.5 rounded-lg text-[10px] font-black uppercase transition-all bg-white dark:bg-slate-700 text-red-600 shadow-sm";
        btnCommon.className = "py-2.5 rounded-lg text-[10px] font-black uppercase transition-all text-slate-500 hover:text-slate-700";
        courseSection.classList.remove('hidden');
        subjectsHeader.classList.add('hidden');
        noSelection.classList.remove('hidden');
        document.getElementById('gm-selected-course-name').textContent = "Selecione um curso";
    } else {
        btnCommon.className = "py-2.5 rounded-lg text-[10px] font-black uppercase transition-all bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm";
        btnSpecific.className = "py-2.5 rounded-lg text-[10px] font-black uppercase transition-all text-slate-500 hover:text-slate-700";
        courseSection.classList.add('hidden');
        subjectsHeader.classList.remove('hidden');
        noSelection.classList.add('hidden');
        document.getElementById('gm-selected-course-name').textContent = "Disciplinas de Eixo Comum";
    }

    window.renderGMCourses();
    window.renderGMSubjects();
};

window.closeGridManager = function () {
    document.getElementById('grid-manager-modal').classList.add('hidden');
    window.gmSelectedCourse = null;
    document.getElementById('gm-subjects-header').classList.add('hidden');
    document.getElementById('gm-no-selection').classList.remove('hidden');
};

window.renderGMCourses = function () {
    if (window.gmActiveAxis === 'common') return;
    const list = document.getElementById('gm-courses-list');
    const stage = window.gmActiveStage;
    const courses = Object.keys(window.ACADEMIC_GRID[stage] || {});

    list.innerHTML = courses.map(c => `
        <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 group ${window.gmSelectedCourse === c ? 'ring-2 ring-red-500' : ''}">
            <span class="text-sm font-bold text-slate-800 dark:text-slate-100">${c}</span>
            <div class="flex items-center gap-2">
                <button onclick="selectCourseForGM('${c}')" class="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition text-slate-500">
                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteCourseGM('${c}')" class="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition opacity-0 group-hover:opacity-100">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `).join('') || '<p class="text-xs text-slate-400 italic">Nenhum curso cadastrado.</p>';
    if (window.lucide) window.lucide.createIcons();
};

window.selectCourseForGM = function (courseName) {
    window.gmSelectedCourse = courseName;
    document.getElementById('gm-selected-course-name').textContent = courseName;
    document.getElementById('gm-subjects-header').classList.remove('hidden');
    document.getElementById('gm-no-selection').classList.add('hidden');
    window.renderGMSubjects();
    window.renderGMCourses();
};

window.renderGMSubjects = function () {
    const list = document.getElementById('gm-subjects-list');
    const stage = window.gmActiveStage;
    let subjects = [];

    if (window.gmActiveAxis === 'specific') {
        if (!window.gmSelectedCourse) return;
        subjects = window.ACADEMIC_GRID[stage][window.gmSelectedCourse] || [];
    } else {
        subjects = window.COMMON_SUBJECTS[stage] || [];
    }

    list.innerHTML = subjects.map((s, idx) => `
        <div class="flex flex-col p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 group">
            <div class="flex justify-between items-start mb-1">
                <span class="text-xs font-bold text-slate-800 dark:text-slate-100">${s.subject}</span>
                <button onclick="deleteSubjectGM(${idx})" class="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition opacity-0 group-hover:opacity-100">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
            </div>
            <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">${s.teacher}</span>
        </div>
    `).join('') || '<p class="text-xs text-slate-400 italic">Nenhuma disciplina cadastrada.</p>';
    if (window.lucide) window.lucide.createIcons();
};

window.addNewCourse = function () {
    const name = prompt("Nome do Novo Curso:");
    if (!name) return;
    const stage = window.gmActiveStage;
    if (!window.ACADEMIC_GRID[stage]) window.ACADEMIC_GRID[stage] = {};
    if (window.ACADEMIC_GRID[stage][name]) return alert("Curso já existe!");

    window.ACADEMIC_GRID[stage][name] = [];
    window.renderGMCourses();
};

window.deleteCourseGM = function (name) {
    if (!confirm(`Excluir curso "${name}" e TODAS as suas disciplinas?`)) return;
    delete window.ACADEMIC_GRID[window.gmActiveStage][name];
    if (window.gmSelectedCourse === name) {
        window.gmSelectedCourse = null;
        document.getElementById('gm-subjects-header').classList.add('hidden');
        document.getElementById('gm-no-selection').classList.remove('hidden');
    }
    window.renderGMCourses();
};

window.addNewSubject = function () {
    if (window.gmActiveAxis === 'specific' && !window.gmSelectedCourse) return;
    const subject = prompt("Nome da Disciplina:");
    if (!subject) return;
    const teacher = prompt("Nome do Professor(a):");
    if (!teacher) return;

    const stage = window.gmActiveStage;
    if (window.gmActiveAxis === 'specific') {
        window.ACADEMIC_GRID[stage][window.gmSelectedCourse].push({ subject, teacher });
    } else {
        if (!window.COMMON_SUBJECTS[stage]) window.COMMON_SUBJECTS[stage] = [];
        window.COMMON_SUBJECTS[stage].push({ subject, teacher });
    }
    window.renderGMSubjects();
};

window.deleteSubjectGM = function (idx) {
    const stage = window.gmActiveStage;
    if (window.gmActiveAxis === 'specific') {
        window.ACADEMIC_GRID[stage][window.gmSelectedCourse].splice(idx, 1);
    } else {
        window.COMMON_SUBJECTS[stage].splice(idx, 1);
    }
    window.renderGMSubjects();
};

window.toggleBulkEntry = function () {
    const shouldShow = document.getElementById('gm-bulk-overlay').classList.contains('hidden');

    if (shouldShow && window.gmActiveAxis === 'specific' && !window.gmSelectedCourse) {
        return alert("Selecione um curso primeiro!");
    }

    const overlay = document.getElementById('gm-bulk-overlay');
    overlay.classList.toggle('hidden');
    if (!overlay.classList.contains('hidden')) {
        document.getElementById('gm-bulk-input').value = '';
        document.getElementById('gm-bulk-input').focus();
    }
};

window.processBulkEntry = function () {
    const input = document.getElementById('gm-bulk-input').value;
    const lines = input.split('\n').filter(line => line.trim() !== '');
    const stage = window.gmActiveStage;

    let addedCount = 0;
    lines.forEach(line => {
        const parts = line.split(/[|;]/); // Split by | or ;
        if (parts.length >= 2) {
            const subject = parts[0].trim();
            const teacher = parts[1].trim();
            if (subject && teacher) {
                if (window.gmActiveAxis === 'specific') {
                    window.ACADEMIC_GRID[stage][window.gmSelectedCourse].push({ subject, teacher });
                } else {
                    if (!window.COMMON_SUBJECTS[stage]) window.COMMON_SUBJECTS[stage] = [];
                    window.COMMON_SUBJECTS[stage].push({ subject, teacher });
                }
                addedCount++;
            }
        }
    });

    if (addedCount > 0) {
        window.renderGMSubjects();
        window.toggleBulkEntry();
        window.showToast(`${addedCount} disciplinas adicionadas!`);
    } else {
        alert("Nenhuma disciplina válida encontrada. Use o formato: Disciplina | Professor");
    }
};

window.saveGridToFirebase = function () {
    if (!confirm("Deseja salvar as alterações da grade acadêmica no banco de dados? Isso afetará todos os usuários.")) return;

    const data = {
        academic_grid: window.ACADEMIC_GRID,
        common_subjects: window.COMMON_SUBJECTS
    };

    window.db.ref('/').update(data)
        .then(() => {
            alert("Grade Acadêmica e Eixo Comum salvos com sucesso!");
            window.showToast("Grade atualizada.");
            window.syncLocalStorage();
        })
        .catch(err => alert("Erro ao salvar: " + err.message));
};
