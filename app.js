// --- FIREBASE CONFIG ---
const firebaseConfig = {
    apiKey: "AIzaSyAwhBLj8uybWMUJdw0hKPYORSyLnXR2hPw",
    authDomain: "agenda-ccsa.firebaseapp.com",
    databaseURL: "https://agenda-ccsa-default-rtdb.firebaseio.com",
    projectId: "agenda-ccsa",
    storageBucket: "agenda-ccsa.firebasestorage.app",
    messagingSenderId: "104981884551",
    appId: "1:104981884551:web:52048c97f42ef854451222",
    measurementId: "G-KQ83Z5YQP9"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
} catch (err) {
    console.error("Erro ao inicializar Firebase:", err);
}
const db = firebase.database();

// --- DATA & CONFIG ---
const STAGES = [1, 2, 3, 4];

const COURSES_BY_STAGE = {
    1: ['GESTÃO DE RECURSOS HUMANOS', 'GESTÃO COMERCIAL', 'LOGÍSTICA', 'GESTÃO COMERCIAL/MARKETING', 'PROCESSOS GERENCIAIS', 'GESTÃO FINANCEIRA'],
    2: ['PROCESSOS GERENCIAIS', 'GESTÃO COMERCIAL', 'GESTÃO DE RECURSOS HUMANOS', 'MARKETING', 'GESTÃO FINANCEIRA'],
    3: ['GESTÃO FINANCEIRA', 'MARKETING', 'GESTÃO COMERCIAL', 'GESTÃO DE RECURSOS HUMANOS', 'PROCESSOS GERENCIAIS', 'GESTÃO COMERCIAL/MARKETING'],
    4: ['GESTÃO FINANCEIRA', 'GESTÃO COMERCIAL', 'GESTÃO COMERCIAL/GESTÃO FINANCEIRA', 'GESTÃO COMERCIAL/MARKETING', 'GESTÃO DE RECURSOS HUMANOS', 'MARKETING', 'PROCESSOS GERENCIAIS']
};

const SUBJECTS_DB = {
    1: {
        'GESTÃO DE RECURSOS HUMANOS': [{ subject: 'CLIMA ORGANIZACIONAL', teacher: 'ALMIR MARTINS VIEIRA' }],
        'GESTÃO COMERCIAL': [{ subject: 'DIREITOS DO CONSUMIDOR', teacher: 'FABIO DANIEL ROMANELLO VASQUES' }],
        'LOGÍSTICA': [{ subject: 'INTRODUÇÃO À LOGÍSTICA', teacher: 'NATHALIE BARBOSA REIS MONTEIRO' }],
        'GESTÃO COMERCIAL/MARKETING': [{ subject: 'DEFIN DE CONSUM E SEU COMPORTAMENTO', teacher: 'TOMAZ AFFONSO PENNER' }],
        'PROCESSOS GERENCIAIS': [{ subject: 'ECONOMIA', teacher: 'WALESKA ANDREZA FERREIRA' }],
        'GESTÃO FINANCEIRA': [{ subject: 'ECONOMIA E MERCADO', teacher: 'WALESKA ANDREZA FERREIRA' }]
    },
    2: {
        'PROCESSOS GERENCIAIS': [{ subject: 'DESENVOLVIMENTO DE HABILIDADES HUMANAS DE GESTÃO', teacher: 'CARLOS JONATHAN DA SILVA' }],
        'GESTÃO COMERCIAL': [{ subject: 'PLANEJAMENTO E PREVISÃO DE VENDAS', teacher: 'EDUARDO NEDER ISSA JUNIOR' }],
        'GESTÃO DE RECURSOS HUMANOS': [{ subject: 'TÉCNICAS DE RECRUTAMENTO E SELEÇÃO DE PESSOAL', teacher: 'ELZA FÁTIMA ROSA VELOSO' }],
        'MARKETING': [{ subject: 'MARKETING DE PRODUTO', teacher: 'KAREN PERROTTA LOPES DE ALMEIDA PRADO' }],
        'GESTÃO FINANCEIRA': [{ subject: 'CONTABILIDADE E CONTROLADORIA', teacher: 'KELLY TEIXEIRA RODRIGUES' }]
    },
    3: {
        'GESTÃO FINANCEIRA': [
            { subject: 'ADMINISTRAÇÃO DE CAPITAL DE GIRO', teacher: 'ALEXANDRE MENDES DA SILVA' },
            { subject: 'ANÁLISE DE CUSTO', teacher: 'ALINE MARIANE DE FARIA' },
            { subject: 'MATEMÁTICA FINANCEIRA', teacher: 'BRUNO LESSA MEIRELES' },
            { subject: 'LEGISLAÇÃO E PLANEJAMENTO TRIBUTÁRIO', teacher: 'FABIO DANIEL ROMANELLO VASQUES' },
            { subject: 'MERCADO FINANCEIRO E DE CAPITAIS', teacher: 'JOÃO PAULO CAVALCANTE LIMA' },
            { subject: 'GOVERNANÇA CORPORATIVA', teacher: 'JOÃO PAULO CAVALCANTE LIMA' },
            { subject: 'DEMONSTRAÇÕES FINANCEIRAS E RELATÓRIOS CONTÁBEIS', teacher: 'WELINGTON NORBERTO CARNEIRO' }
        ],
        'MARKETING': [
            { subject: 'ESTRATÉGIA DE PREÇOS', teacher: 'CARLOS AUGUSTO DA SILVA LOURES' },
            { subject: 'MARKETING DO SERVIÇO', teacher: 'EDUARDO NEDER ISSA JUNIOR' },
            { subject: 'SEGMENTAÇÃO E POSICIONAMENTO DE MERCADO', teacher: 'FÁTIMA GUARDANI ROMITO' },
            { subject: 'DISTRIBUIÇÃO, LOGÍSTICA E ADMINISTRAÇÃO DE VAREJO', teacher: 'LILIAN APARECIDA PASQUINI MIGUEL' }
        ],
        'GESTÃO COMERCIAL': [
            { subject: 'FORMAÇÃO DE PREÇO', teacher: 'CARLOS AUGUSTO DA SILVA LOURES' },
            { subject: 'REMUNERAÇÃO', teacher: 'CELSO LIKIO YAMAGUTI' },
            { subject: 'TRIBUTAÇÃO', teacher: 'PATRICIA SATOMI NISHIMURA' },
            { subject: 'MÉTRICAS DE DESEMPENHO', teacher: 'TOMAZ AFFONSO PENNER' }
        ],
        'GESTÃO DE RECURSOS HUMANOS': [
            { subject: 'APRENDIZAGEM ORGANIZACIONAL E EDUCAÇÃO CORPORATIVA', teacher: 'CARLOS JONATHAN DA SILVA SANTOS' },
            { subject: 'PROCESSO ADMISSIONAL E DEMISSIONAL', teacher: 'CARLOS JONATHAN DA SILVA SANTOS' },
            { subject: 'TÉCNICAS DE TREINAMENTO E DESENVOLVIMENTO', teacher: 'CARLOS JONATHAN DA SILVA SANTOS' },
            { subject: 'GESTÃO DE CARREIRAS', teacher: 'MIRIAM RODRIGUES' },
            { subject: 'TÉCNICAS DE REMUNERAÇÃO I', teacher: 'WERENNA FERNANNDA GARCIA BATISTA' },
            { subject: 'RELAÇÕES TRABALHISTAS', teacher: 'WERENNA FERNANNDA GARCIA BATISTA' }
        ],
        'PROCESSOS GERENCIAIS': [
            { subject: 'GESTÃO DE MARKETING', teacher: 'FÁTIMA GUARDANI ROMITO' },
            { subject: 'GESTÃO FINANCEIRA', teacher: 'JOÃO PAULO CAVALCANTE LIMA' },
            { subject: 'GESTÃO COMERCIAL', teacher: 'LILIAN APARECIDA PASQUINI MIGUEL' },
            { subject: 'MODELAGEM DE PROCESSOS DE NEGÓCIOS', teacher: 'MARIA CAMPOS LAGE' },
            { subject: 'GESTÃO DE OPERAÇÕES E LOGÍSTICA', teacher: 'MAURICIO HENRIQUE BENEDETTI' },
            { subject: 'CONTABILIDADE GERENCIAL', teacher: 'WELINGTON NORBERTO CARNEIRO' }
        ],
        'GESTÃO COMERCIAL/MARKETING': [
            { subject: 'COMUNICAÇÃO INTEGRADA I', teacher: 'TOMAZ AFFONSO PENNER' },
            { subject: 'DEFIN DE CONSUM E SEU COMPORTAMENTO', teacher: 'TOMAZ AFFONSO PENNER' }
        ]
    },
    4: {
        'GESTÃO FINANCEIRA': [
            { subject: 'OPERAÇÕES CAMBIAIS E INTERNACIONAIS', teacher: 'ALEXANDRE MENDES DA SILVA' },
            { subject: 'PROJETO INTEGRADOR', teacher: 'ALEXANDRE MENDES DA SILVA' },
            { subject: 'ADMINISTRAÇÃO FINANCEIRA', teacher: 'ALINE MARIANE DE FARIA' },
            { subject: 'DERIVATIVOS FINANCEIROS', teacher: 'ALINE MARIANE DE FARIA' },
            { subject: 'PLANEJAMENTO E ORÇAMENTO EMPRESARIAL', teacher: 'ALINE MARIANE DE FARIA' },
            { subject: 'ANÁLISE DE INVESTIMENTO', teacher: 'JOÃO PAULO CAVALCANTE LIMA' },
            { subject: 'PROJETO INTEGRADOR', teacher: 'JOÃO PAULO CAVALCANTE LIMA' }
        ],
        'GESTÃO COMERCIAL': [
            { subject: 'MODELOS DE NEGÓCIO', teacher: 'CARLOS JONATHAN DA SILVA SANTOS' },
            { subject: 'PROJETO INTEGRADOR', teacher: 'CARLOS JONATHAN DA SILVA SANTOS' },
            { subject: 'HABILIDADES NEGOCIAIS', teacher: 'MARTA FABIANO SAMBIASE' },
            { subject: 'SISTEMAS DE INFORMAÇÃO', teacher: 'SUELI DOS SANTOS LEITÃO' },
            { subject: 'PROJETO INTEGRADOR', teacher: 'TOMAZ AFFONSO PENNER' }
        ],
        'GESTÃO COMERCIAL/GESTÃO FINANCEIRA': [
            { subject: 'ANÁLISE DE CRÉDITO, COBRANÇA E RISCO', teacher: 'CARLOS EDUARDO GOMES' }
        ],
        'GESTÃO COMERCIAL/MARKETING': [
            { subject: 'COMUNICAÇÃO INTEGRADA II', teacher: 'TOMAZ AFFONSO PENNER' }
        ],
        'GESTÃO DE RECURSOS HUMANOS': [
            { subject: 'TÉCNICAS DE REMUNERAÇÃO II', teacher: 'DARCY MITIKO MORI HANASHIRO' },
            { subject: 'TÉCNICAS DE AVALIAÇÃO DE DESEMPENHO DE PESSOAS', teacher: 'MARIA LUISA MENDES TEIXEIRA' },
            { subject: 'HIGIENE, MEDICINA E SEGURANÇA DO TRABALHO', teacher: 'NATHALIE BARBOSA REIS MONTEIRO' },
            { subject: 'PROJETO INTEGRADOR', teacher: 'NATHALIE BARBOSA REIS MONTEIRO' },
            { subject: 'TÉCNICAS DE CONSULTORIA INTERNA AO RH', teacher: 'SUELI DOS SANTOS LEITÃO' },
            { subject: 'PROJETO INTEGRADOR', teacher: 'WERENNA FERNANNDA GARCIA BATISTA' },
            { subject: 'COMUNICAÇÃO INTERNA', teacher: 'WERENNA FERNANNDA GARCIA BATISTA' }
        ],
        'MARKETING': [
            { subject: 'MARKETING VERDE', teacher: 'CARLOS AUGUSTO DA SILVA LOURES' },
            { subject: 'PROJETO INTEGRADOR', teacher: 'CARLOS AUGUSTO DA SILVA LOURES' },
            { subject: 'CUSTOMER RELATIONSHIP MANAGEMENT', teacher: 'FÁTIMA GUARDANI ROMITO' },
            { subject: 'PLANO DE MARKETING E SISTEMAS DE INFORMAÇÃO', teacher: 'FÁTIMA GUARDANI ROMITO' },
            { subject: 'PROJETO INTEGRADOR', teacher: 'FÁTIMA GUARDANI ROMITO' },
            { subject: 'GESTÃO DE MARCAS', teacher: 'KAREN PERROTTA LOPES DE ALMEIDA' },
            { subject: 'MARKETING DIGITAL', teacher: 'TOMAZ AFFONSO PENNER' }
        ],
        'PROCESSOS GERENCIAIS': [
            { subject: 'ANÁLISE EXPLORATÓRIA DE DADOS E RACIOCÍNIO ANALÍTICO', teacher: 'BRUNO LESSA MEIRELES' },
            { subject: 'ESTRATÉGIA ORGANIZACIONAL', teacher: 'CLAUDIA FERNANDA FRANCESCHI KLEMENT' },
            { subject: 'PROJETO INTEGRADOR', teacher: 'EDUARDO NEDER ISSA JUNIOR' },
            { subject: 'RECURSOS HUMANOS ESTRATÉGICO', teacher: 'ELZA FÁTIMA ROSA VELOSO' },
            { subject: 'GESTÃO DE SERVIÇOS TERCEIRIZADOS', teacher: 'NATHALIE BARBOSA REIS MONTEIRO' },
            { subject: 'TÉCNICAS E GERENCIAMENTO DA INFORMAÇÃO', teacher: 'SUELI DOS SANTOS LEITÃO' }
        ]
    }
};

// Fallback: If no subjects found for a stage, use Generic list
const GENERIC_SUBJECTS = {
    'GESTÃO DE RECURSOS HUMANOS': [{ subject: 'CLIMA ORGANIZACIONAL', teacher: 'ALMIR MARTINS VIEIRA' }],
    'GESTÃO COMERCIAL': [{ subject: 'DIREITOS DO CONSUMIDOR', teacher: 'FABIO DANIEL ROMANELLO VASQUES' }],
    'LOGÍSTICA': [{ subject: 'INTRODUCAO A LOGISTICA', teacher: 'NATHALIE BARBOSA REIS MONTEIRO' }],
    'GESTÃO FINANCEIRA': [{ subject: 'ECONOMIA E MERCADO', teacher: 'WALESKA ANDREZA FERREIRA' }],
    'PROCESSOS GERENCIAIS': [{ subject: 'ECONOMIA', teacher: 'WALESKA ANDREZA FERREIRA' }],
    'GESTÃO COMERCIAL/MARKETING': [{ subject: 'DEFIN DE CONSUM E SEU COMPORTAMENTO', teacher: 'TOMAZ AFFONSO PENNER' }]
};

const COMMON_SUBJECTS = {
    1: [
        { subject: 'ADMINISTRAÇÃO CONTEMPORÂNEA', teacher: 'CLAUDIA FERNANDA FRANCESCHI KLEMENT' },
        { subject: 'PRINCÍPIOS DE MARKETING', teacher: 'KAREN PERROTTA LOPES DE ALMEIDA PRADO' },
        { subject: 'COMPORTAMENTO ORGANIZACIONAL', teacher: 'NATACHA BERTOIA DA SILVA' },
        { subject: 'FUNDAMENTOS DE CONTABILIDADE E FINANÇAS', teacher: 'PATRICIA SATOMI NISHIMURA' }
    ],
    2: [
        { subject: 'MATEMÁTICA E ESTATÍSTICA', teacher: 'BRUNO LESSA MEIRELES' },
        { subject: 'SUSTENTABILIDADE E RESPONSABILIDADE SOCIAL', teacher: 'CLAUDIA FERNANDA FRANCESCHI KLEMENT' },
        { subject: 'PLANEJAMENTO E GESTÃO DE PROJETOS', teacher: 'MAURICIO HENRIQUE BENEDETTI' },
        { subject: 'GESTÃO DE PESSOAS', teacher: 'WERENNA FERNANNDA GARCIA BATISTA' }
    ],
    3: [
        { subject: 'DIREITO EMPRESARIAL', teacher: 'FABIO DANIEL ROMANELLO VASQUES' }
    ],
    4: [
        { subject: 'PLANEJAMENTO E PROJETO DE CARREIRA', teacher: 'NATACHA BERTOIA DA SILVA' }
    ]
};

// --- SYNC CONFIG ---
// Define subjects that should be synchronized across multiple stages
const SYNC_CONFIG = [
    {
        courseName: 'GESTÃO COMERCIAL/MARKETING',
        subject: 'DEFIN DE CONSUM E SEU COMPORTAMENTO',
        stages: [1, 3]
    }
];

// Expand Hours: 19:00 to 22:00
const HOURS_START = 19;
const HOURS_END = 22;
const HOURS = [];
for (let h = HOURS_START; h < HOURS_END; h++) {
    HOURS.push(`${h.toString().padStart(2, '0')}:00 - ${(h + 1).toString().padStart(2, '0')}:00`);
}

// --- STATE ---
const state = {
    activeStage: 1,
    currentWeekStart: getStartOfWeek(new Date()), // Sunday of current week
    assignments: {}, // Managed by Firebase
    events: {},      // Managed by Firebase
};

// --- DOM ELEMENTS ---
const weekGrid = document.getElementById('week-grid');
const currentMonthYear = document.getElementById('current-month-year');
const editModal = document.getElementById('edit-modal');
const form = document.getElementById('assignment-form');
const existingItemsContainer = document.getElementById('existing-items');
const courseSelect = document.getElementById('course-select');
const subjectSelect = document.getElementById('subject-select');
const teacherInput = document.getElementById('teacher-name');
const errorMsg = document.getElementById('error-msg');
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');

// Admin Elements
const adminLoginModal = document.getElementById('admin-login-modal');
const adminSettingsModal = document.getElementById('admin-settings-modal');
const adminPasswordInput = document.getElementById('admin-password');
const adminPasswordError = document.getElementById('admin-password-error');
const eventForm = document.getElementById('admin-event-form');
const eventText = document.getElementById('event-text');
const eventDate = document.getElementById('event-date');

// Sync Elements
const syncWrapper = document.getElementById('sync-ui-wrapper');
const syncSelect = document.getElementById('sync-select');

const deletePasswordInput = document.getElementById('delete-password');
const passwordError = document.getElementById('password-error');
const passwordModal = document.getElementById('password-modal');

let editingSlot = null; // { dateStr, hourIdx }
let pendingDeleteIdx = null;

// --- INIT ---
function init() {
    renderStageButtons();
    renderCalendar(); // Render immediately (don't wait for cloud)
    setupFirebaseListeners();
    lucide.createIcons();
}

// --- PERSISTENCE (Firebase) ---
function setupFirebaseListeners() {
    // Listen for Assignments
    db.ref('assignments').on('value', (snapshot) => {
        state.assignments = snapshot.val() || {};
        renderCalendar();
    }, (error) => {
        console.error("Erro ao carregar agendamentos:", error);
    });

    // Listen for Events
    db.ref('events').on('value', (snapshot) => {
        state.events = snapshot.val() || {};
        renderCalendar();
    }, (error) => {
        console.error("Erro ao carregar eventos:", error);
    });
}

function saveAssignments() {
    db.ref('assignments').set(state.assignments);
}

function saveEvents() {
    db.ref('events').set(state.events);
}

// --- CORE RENDERING ---
function renderStageButtons() {
    STAGES.forEach(s => {
        const btn = document.getElementById(`stage-btn-${s}`);
        if (btn) {
            if (state.activeStage === s) {
                btn.className = "px-3 py-1 text-sm rounded-md transition bg-white text-red-600 font-bold shadow";
            } else {
                btn.className = "px-3 py-1 text-sm rounded-md transition hover:bg-red-700 text-red-100";
            }
        }
    });
}

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

function renderHeader() {
    // Render Dates in sticky header
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const ids = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const start = new Date(state.currentWeekStart);

    // Update Day Headers
    const midWeek = new Date(start);
    midWeek.setDate(midWeek.getDate() + 3);

    // Robust Month/Year Fix:
    // If selecting January (0), we want to stay in Jan even if week starts in Dec
    // If selecting December (11), we want to stay in Dec even if week ends in Jan
    const targetMonth = parseInt(monthSelect.value);
    const targetYear = parseInt(yearSelect.value);

    let preferredMonth = midWeek.getMonth();
    let preferredYear = midWeek.getFullYear();

    // Loop through days in week to see if target month/year exists
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        if (d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
            preferredMonth = targetMonth;
            preferredYear = targetYear;
            break;
        }
    }

    monthSelect.value = preferredMonth;
    yearSelect.value = Math.max(2026, preferredYear);

    // Update Day Headers
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dayContainer = document.getElementById(`header-${ids[i]}`);

        if (dayContainer) {
            const isToday = new Date().toDateString() === d.toDateString();
            const dateNum = d.getDate();

            dayContainer.innerHTML = `
                <div class="text-xs ${isToday ? 'text-red-600' : 'text-slate-500'} uppercase font-bold">${days[i]}</div>
                <div class="text-xl font-bold ${isToday ? 'bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mt-1' : 'text-slate-800'}">${dateNum}</div>
            `;
        }
    }
}

function renderCalendar() {
    renderHeader();
    if (!weekGrid) return;
    weekGrid.innerHTML = '';

    // Grid Layout:
    // Left: Time Labels
    // Col 1-7: Slots

    const start = new Date(state.currentWeekStart);

    HOURS.forEach((hLabel, hIdx) => {
        // 1. Time Label Cell
        const timeCell = document.createElement('div');
        timeCell.className = 'border-b border-r border-slate-200 p-2 text-xs text-slate-400 text-right sticky left-0 bg-white z-10';
        timeCell.innerHTML = `<span class="-mt-2 block">${hLabel.split(' - ')[0]}</span>`;
        weekGrid.appendChild(timeCell);

        // 2. Day Slot Cells (7)
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];

            const cell = document.createElement('div');
            cell.className = 'border-b border-r border-slate-200 min-h-[60px] relative hover:bg-slate-50 transition cursor-pointer p-1 flex flex-col gap-1';
            cell.onclick = (e) => {
                if (!e.target.closest('.delete-btn')) {
                    openEditModal(dateStr, hIdx);
                }
            };

            // Render Assignments
            const key = `${state.activeStage}-${dateStr}-${hIdx}`;
            const items = state.assignments[key] || [];

            // Group Layout
            if (items.length > 0) {
                // Check if Common
                const common = items.find(it => it.type === 'common');
                if (common) {
                    const pill = createPill(common, true, dateStr, hIdx);
                    cell.appendChild(pill);
                } else {
                    // Specifics - Stack them
                    const container = document.createElement('div');
                    container.className = 'flex flex-row flex-wrap gap-1';
                    items.forEach((it, idx) => {
                        container.appendChild(createPill(it, false, dateStr, hIdx, idx));
                    });
                    cell.appendChild(container);
                }
            }

            weekGrid.appendChild(cell);
        }
    });

    // 3. Special Events Row
    const eventTimeCell = document.createElement('div');
    eventTimeCell.className = 'border-b border-r border-slate-200 p-2 text-[10px] text-red-600 font-bold text-right sticky left-0 bg-slate-50 z-10';
    eventTimeCell.textContent = 'EVENTOS';
    weekGrid.appendChild(eventTimeCell);

    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];

        const cell = document.createElement('div');
        cell.className = 'border-b border-r border-slate-200 min-h-[40px] bg-slate-50/50 p-1 flex flex-col gap-1';

        const dayEvents = state.events[dateStr] || [];
        dayEvents.forEach(evtText => {
            const pill = document.createElement('div');
            pill.className = 'bg-slate-800 text-white text-[10px] p-1.5 rounded shadow-sm flex items-center gap-1';
            pill.innerHTML = `<i data-lucide="star" class="w-3 h-3 text-yellow-400"></i> ${evtText}`;
            cell.appendChild(pill);
        });
        weekGrid.appendChild(cell);
    }
    lucide.createIcons();
}

function createPill(data, isCommon, dateStr, hIdx, itemIndex) {
    const el = document.createElement('div');
    const courseName = data.courseName || '';

    // Shorten course name
    let shortName = courseName;
    if (courseName.includes('RECURSOS HUMANOS')) shortName = 'RH';
    else if (courseName.includes('COMERCIAL/MARKETING')) shortName = 'COM/MKT';
    else if (courseName.includes('COMERCIAL/GESTÃO FINANCEIRA')) shortName = 'COM/FIN';
    else if (courseName.includes('COMERCIAL')) shortName = 'COM';
    else if (courseName.includes('MARKETING')) shortName = 'MKT';
    else if (courseName.includes('LOGÍSTICA')) shortName = 'LOG';
    else if (courseName.includes('PROCESSOS')) shortName = 'PG';
    else if (courseName.includes('FINANCEIRA')) shortName = 'GF';

    if (isCommon) {
        el.className = 'w-full bg-slate-700 text-white text-[10px] p-1 rounded shadow-sm overflow-hidden whitespace-nowrap border-l-2 border-slate-900';
        el.innerHTML = `<strong>Comum</strong>: ${data.subject}`;
    } else {
        el.className = 'flex-1 min-w-[45%] bg-red-600 text-white text-[10px] p-1 rounded shadow-sm overflow-hidden border-l-2 border-red-800 group relative hover:z-20';
        el.innerHTML = `<div class="font-bold opacity-90">${shortName}</div><div class="truncate" title="${data.subject}">${data.subject}</div>`;
    }

    return el;
}

// --- ACTIONS ---
window.switchStage = function (id) {
    state.activeStage = id;
    renderStageButtons();
    renderCalendar();
}

window.changeWeek = function (delta) {
    state.currentWeekStart.setDate(state.currentWeekStart.getDate() + (delta * 7));
    renderCalendar();
}

window.goToToday = function () {
    state.currentWeekStart = getStartOfWeek(new Date());
    renderCalendar();
}

window.updateFormVisibility = function () {
    const typeRadio = document.querySelector('input[name="axis-type"]:checked');
    if (!typeRadio) return;

    const type = typeRadio.value;
    const wrapper = document.getElementById('course-select-wrapper');
    if (type === 'specific') {
        wrapper.classList.remove('hidden');
    } else {
        wrapper.classList.add('hidden');
    }
    updateSubjectOptions();
}

// --- MODAL ---
window.openEditModal = function (dateStr, hIdx) {
    editingSlot = { dateStr, hourIdx: hIdx };
    errorMsg.classList.add('hidden');

    const key = `${state.activeStage}-${dateStr}-${hIdx}`;
    const items = state.assignments[key] || [];

    // Title info
    const dayName = new Date(dateStr).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    document.getElementById('edit-slot-info').textContent = `${dayName} • ${HOURS[hIdx]}`;

    // Render Existing
    existingItemsContainer.innerHTML = '';
    if (items.length > 0) {
        items.forEach((item, idx) => {
            const row = document.createElement('div');
            row.className = 'flex justify-between items-center bg-slate-100 p-2 rounded text-xs border border-slate-200 item-row';
            const courseName = item.type === 'common' ? 'Todos os Cursos' : (item.courseName || 'Curso Desconhecido');

            row.innerHTML = `
                <div>
                    <span class="font-bold ${item.type === 'common' ? 'text-slate-600' : 'text-red-600'}">${item.type === 'common' ? 'Comum' : 'Específico'}</span>
                    <div class="text-slate-800 font-medium">${item.subject}</div>
                    <div class="text-slate-500 opacity-75">${courseName} • ${item.teacher}</div>
                </div>
                <button type="button" onclick="deleteAssignment(${idx})" class="text-red-400 hover:bg-slate-200 p-1.5 rounded transition delete-btn">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            `;
            existingItemsContainer.appendChild(row);
        });
        lucide.createIcons();
    } else {
        existingItemsContainer.innerHTML = '<div class="text-slate-500 text-sm italic py-2">Nenhuma aula agendada.</div>';
    }

    // Reset Form
    teacherInput.value = '';

    // Fill Course Select
    const availableCourses = COURSES_BY_STAGE[state.activeStage] || [];
    courseSelect.innerHTML = availableCourses.map(cName => `<option value="${cName}">${cName}</option>`).join('');

    updateFormVisibility(); // Triggers subject options
    editModal.classList.remove('hidden');
}

window.closeEditModal = function () {
    editModal.classList.add('hidden');
}

window.updateSubjectOptions = function () {
    const typeRadio = document.querySelector('input[name="axis-type"]:checked');
    if (!typeRadio) return;
    const type = typeRadio.value;
    const stage = state.activeStage;
    let options = [];

    if (type === 'common') {
        options = COMMON_SUBJECTS[stage] || [];
    } else {
        const courseName = courseSelect.value;
        if (!courseName) return;

        // Get subjects from DB or Generic fallback
        const stageSubjects = SUBJECTS_DB[stage] && SUBJECTS_DB[stage][courseName];
        options = stageSubjects || GENERIC_SUBJECTS[courseName] || [];
    }

    subjectSelect.innerHTML = options.length ?
        options.map(o => `<option value="${o.subject}" data-teacher="${o.teacher}">${o.subject}</option>`).join('') :
        '<option value="">Sem opções</option>';

    autoFillTeacher();
    checkSyncRequirement();
}

function checkSyncRequirement() {
    const course = courseSelect.value;
    const subject = subjectSelect.value;
    const type = document.querySelector('input[name="axis-type"]:checked').value;

    if (type === 'common') {
        syncWrapper.classList.add('hidden');
        return;
    }

    const rule = SYNC_CONFIG.find(r => r.courseName === course && r.subject === subject && r.stages.includes(state.activeStage));

    if (rule) {
        syncWrapper.classList.remove('hidden');
        const otherStages = rule.stages.filter(s => s !== state.activeStage);

        let html = '<option value="none">Não (Apenas esta etapa)</option>';
        otherStages.forEach(s => {
            html += `<option value="${s}">Sim (Compartilhar com Etapa ${s})</option>`;
        });
        syncSelect.innerHTML = html;
        lucide.createIcons();
    } else {
        syncWrapper.classList.add('hidden');
    }
}

window.autoFillTeacher = function () {
    const opt = subjectSelect.options[subjectSelect.selectedIndex];
    if (opt) {
        teacherInput.value = opt.getAttribute('data-teacher');
    } else {
        teacherInput.value = '';
    }
}

// --- LOGIC ---
window.deleteAssignment = function (idx) {
    pendingDeleteIdx = idx;
    deletePasswordInput.value = '';
    passwordError.classList.add('hidden');
    passwordModal.classList.remove('hidden');
    deletePasswordInput.focus();
}

window.closePasswordModal = function () {
    passwordModal.classList.add('hidden');
    pendingDeleteIdx = null;
}

window.checkPassword = function () {
    const password = deletePasswordInput.value;
    if (password === 'mackenzie') {
        executeDelete();
    } else {
        passwordError.classList.remove('hidden');
    }
}

function executeDelete() {
    if (!editingSlot || pendingDeleteIdx === null) return;
    const { dateStr, hourIdx } = editingSlot;
    const key = `${state.activeStage}-${dateStr}-${hourIdx}`;

    const items = state.assignments[key];
    if (!items) return;

    const deletedItem = items[pendingDeleteIdx];

    // Check for SYNC Deletion via syncGroupId
    if (deletedItem.syncGroupId) {
        // Find all entries in state with same syncGroupId and delete them
        for (const k in state.assignments) {
            state.assignments[k] = state.assignments[k].filter(it => it.syncGroupId !== deletedItem.syncGroupId);
            if (state.assignments[k].length === 0) delete state.assignments[k];
        }
    } else {
        // Normal deletion
        items.splice(pendingDeleteIdx, 1);
        if (items.length === 0) delete state.assignments[key];
    }

    saveAssignments();

    closePasswordModal();
    // Refresh modal
    openEditModal(dateStr, hourIdx);
    renderCalendar();
}

form.onsubmit = (e) => {
    e.preventDefault();
    if (!editingSlot) return;

    const { dateStr, hourIdx } = editingSlot;
    const type = document.querySelector('input[name="axis-type"]:checked').value;
    const teacher = teacherInput.value;
    const subject = subjectSelect.value;

    if (!teacher) return;

    // Prepare Entry
    const newEntry = {
        type,
        teacher,
        subject,
        courseName: (type === 'specific') ? courseSelect.value : null
    };

    // Check Sharing selection
    const targetSyncStage = syncSelect.value !== 'none' ? parseInt(syncSelect.value) : null;
    if (targetSyncStage) {
        newEntry.syncGroupId = Date.now().toString(); // Identificador único do espelhamento
    }

    const key = `${state.activeStage}-${dateStr}-${hourIdx}`;
    if (!state.assignments[key]) state.assignments[key] = [];
    const currentItems = state.assignments[key];

    // --- CONFLICT CHECKS ---

    // 1. Common vs Specific
    if (type === 'common') {
        // Cannot add Common if ANY items exist (Specific or Common)
        if (currentItems.length > 0) {
            errorMsg.textContent = "Conflito: Remova as aulas existentes antes de adicionar um Eixo Comum.";
            errorMsg.classList.remove('hidden');
            return;
        }
    } else {
        // Specific
        // Cannot add Specific if Common exists
        if (currentItems.some(it => it.type === 'common')) {
            errorMsg.textContent = "Conflito: Horário bloqueado por Eixo Comum.";
            errorMsg.classList.remove('hidden');
            return;
        }
        // Cannot add Specific if SAME Course already has class
        if (currentItems.some(it => it.courseName === newEntry.courseName)) {
            errorMsg.textContent = "Conflito: Este curso já tem aula neste horário.";
            errorMsg.classList.remove('hidden');
            return;
        }
    }

    // 2. Teacher Availability (Global Check across all Stages)
    const conflict = checkGlobalTeacherConflict(dateStr, hourIdx, teacher);
    if (conflict) {
        errorMsg.textContent = conflict;
        errorMsg.classList.remove('hidden');
        return;
    }

    // Add It
    currentItems.push(newEntry);

    // --- SYNC ADDITION (Based on User Choice) ---
    if (targetSyncStage) {
        const syncKey = `${targetSyncStage}-${dateStr}-${hourIdx}`;
        if (!state.assignments[syncKey]) state.assignments[syncKey] = [];
        state.assignments[syncKey].push({ ...newEntry });
    }

    saveAssignments();

    renderCalendar();
    openEditModal(dateStr, hourIdx); // Reload modal to show new item

    // Toast
    const toast = document.getElementById('toast');
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

function checkGlobalTeacherConflict(dateStr, hIdx, teacher) {
    // Iterate ALL assignments in state (all keys)
    for (const [k, items] of Object.entries(state.assignments)) {
        // key: stage-date-hour
        const [stg, d, h] = k.split('-');
        if (d === dateStr && parseInt(h) === hIdx) {
            // Same time
            for (const it of items) {
                if (it.teacher === teacher) {
                    return `Conflito! Professor(a) ${teacher} já está ocupado na Etapa ${stg}.`;
                }
            }
        }
    }
    return null;
}

// --- EVENTS ---
function handleDateSelectChange() {
    const y = parseInt(yearSelect.value);
    const m = parseInt(monthSelect.value);
    // Set to 1st of selected month
    const newDate = new Date(y, m, 1);
    state.currentWeekStart = getStartOfWeek(newDate);
    renderCalendar();
}

monthSelect.onchange = handleDateSelectChange;
yearSelect.onchange = handleDateSelectChange;

// --- ADMIN ACTIONS ---
window.openAdminLogin = function () {
    adminPasswordInput.value = '';
    adminPasswordError.classList.add('hidden');
    adminLoginModal.classList.remove('hidden');
    adminPasswordInput.focus();
}

window.closeAdminLogin = function () {
    adminLoginModal.classList.add('hidden');
}

window.checkAdminPassword = function () {
    if (adminPasswordInput.value === 'Anunzio') {
        adminLoginModal.classList.add('hidden');
        openAdminSettings();
    } else {
        adminPasswordError.classList.remove('hidden');
    }
}

window.openAdminSettings = function () {
    adminSettingsModal.classList.remove('hidden');
}

window.closeAdminSettings = function () {
    adminSettingsModal.classList.add('hidden');
}

window.confirmClearAll = function () {
    if (confirm('TEM CERTEZA? Isso irá apagar todos os horários e eventos salvos.')) {
        state.assignments = {};
        state.events = {};
        saveAssignments();
        saveEvents();
        renderCalendar();
        closeAdminSettings();
        alert('Todos os dados foram excluídos.');
    }
}

eventForm.onsubmit = (e) => {
    e.preventDefault();
    const date = eventDate.value;
    const text = eventText.value;
    if (!date || !text) return;

    if (!state.events[date]) state.events[date] = [];
    state.events[date].push(text);

    saveEvents();
    renderCalendar();
    eventForm.reset();
    alert('Evento adicionado!');
}

// Boot
init();
