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
    console.log("Firebase inicializado com sucesso.");
} catch (err) {
    console.error("Erro crítico ao inicializar Firebase:", err);
}
const db = firebase.database();

// --- DATA & CONFIG ---
const STAGES = [1, 2, 3, 4];

// --- ACADEMIC GRID (Internal Data Structure) ---
// Interlinked "Grids": Stage -> Course -> [Subject/Professor]
const ACADEMIC_GRID = {
    1: {
        'ENGENHARIA DE PROPULSÃO': [{ subject: 'DINÂMICA DE DOBRA ESPACIAL', teacher: 'PROF. ELIAS VORTEX' }],
        'NAVEGAÇÃO INTERSTELAR': [{ subject: 'CARTOGRAFIA DE BURACOS NEGROS', teacher: 'DRA. LYRA NEBULA' }],
        'ASTROBIOLOGIA': [{ subject: 'GENÉTICA DE EXOPLANETAS', teacher: 'ME. KAEL STARLIGHT' }],
        'DIPLOMACIA GALÁCTICA': [{ subject: 'PROTOCOLOS DA FEDERAÇÃO', teacher: 'EMB. NOVA SOLARIS' }],
        'PROCESSAMENTO DE ENERGIA': [{ subject: 'TERMODINÂMICA DE QUASARES', teacher: 'PROF. JAXON PULSAR' }],
        'SEGURANÇA ORBITAL': [{ subject: 'DEFESA CONTRA ASTEROIDES', teacher: 'CAP. ION STORM' }]
    },
    2: {
        'CIBERNÉTICA AVANÇADA': [{ subject: 'SINCRO-INTERFACE NEURAL', teacher: 'ENG. CYRUS CORE' }],
        'LOGÍSTICA DE TELETRANSPORTE': [{ subject: 'ESTABILIZAÇÃO DE PORTAIS', teacher: 'DRA. TESS QUARK' }],
        'GESTÃO DE COLÔNIAS': [{ subject: 'SOCIOLOGIA DE ASTEROIDES', teacher: 'PROF. MIRA ZENITH' }],
        'MINERAÇÃO ESPACIAL': [{ subject: 'EXTRAÇÃO DE CRISTAIS KYBER', teacher: 'ME. ROARK GRAVITY' }],
        'ARQUITETURA PLANETÁRIA': [{ subject: 'TERRAFORMAÇÃO SUSTENTÁVEL', teacher: 'ARQ. SOLA LUNAR' }]
    },
    3: {
        'SISTEMAS DE DEFESA': [
            { subject: 'ARTILHARIA DE PLASMA', teacher: 'GEN. ATLAS TITAN' },
            { subject: 'CAMPOS DE FORÇA', teacher: 'DRA. VERA SHIELD' },
            { subject: 'TACTICAS DE COMBATE NO VÁCUO', teacher: 'COM. DRAKE VOID' },
            { subject: 'CRIPTOGRAFIA QUÂNTICA', teacher: 'ENG. BYTE BINARY' },
            { subject: 'HIDRÁULICA EM ZERO G', teacher: 'PROF. FLUX FLOW' },
            { subject: 'SENSORES DE LONGO ALCANCE', teacher: 'ME. SCAN RADAR' },
            { subject: 'MANUTENÇÃO DE ANDROIDES', teacher: 'TECH. GEAR BOLT' }
        ],
        'ESTRATÉGIA DE GUERRA': [
            { subject: 'LOGÍSTICA DE FROTAS', teacher: 'ALM. RIGEL VEGA' },
            { subject: 'INTELIGÊNCIA DE CAMPO', teacher: 'AGENT Z-10' },
            { subject: 'RECONHECIMENTO DE TERRENO', teacher: 'SCOUT NOVA' },
            { subject: 'ESQUADRÕES DE CAÇA', teacher: 'LID. PILOT ACE' }
        ],
        'MEDICINA ESPACIAL': [
            { subject: 'BIO-REGENERAÇÃO ACELERADA', teacher: 'DR. MEDI SCAN' },
            { subject: 'PSICOLOGIA DO ISOLAMENTO', teacher: 'DRA. PSI MIND' },
            { subject: 'CIRURGIA ROBÓTICA', teacher: 'ME. SURGE AUTO' },
            { subject: 'TOXICOLOGIA ALIENÍGENA', teacher: 'PROF. BIO HAZARD' }
        ],
        'COMUNICAÇÃO SUB-ESPACIAL': [
            { subject: 'ANTENAS DE MATÉRIA ESCURA', teacher: 'DRA. SIGNAL WAVE' },
            { subject: 'LINGUÍSTICA INTER-ESPÉCIES', teacher: 'PROF. GLOSSA TALK' },
            { subject: 'REDES DE RELÉ GALÁCTICO', teacher: 'ENG. LINK MESH' },
            { subject: 'HISTÓRIA DA GALÁXIA', teacher: 'DESC. CHRONO PAST' },
            { subject: 'Ética Robótica', teacher: 'DRA. LOGIC RULE' },
            { subject: 'FILOSOFIA DO COSMOS', teacher: 'ME. SAGE THOUGHT' }
        ],
        'ENGENHARIA DE MATERIAIS': [
            { subject: 'LIGAS DE ADAMANTIUM', teacher: 'ENG. FORGE IRON' },
            { subject: 'ESTRUTURAS MONOLÍTICAS', teacher: 'ARQ. BLOCK STONE' },
            { subject: 'MANUFATURA EM ÓRBITA', teacher: 'PROF. PRINT 3D' },
            { subject: 'SÍNTESE DE COMBUSTÍVEL', teacher: 'ME. FUEL GAS' },
            { subject: 'MECÂNICA DE EXOPLANETAS', teacher: 'ENG. GEAR SHIFT' },
            { subject: 'SISTEMAS DE SUPORTE À VIDA', teacher: 'DRA. OXY BREATH' }
        ],
        'XENO-ARQUEOLOGIA': [
            { subject: 'RUÍNAS DE CIVILIZAÇÕES EXTINTAS', teacher: 'DRA. RELIC FIND' },
            { subject: 'ARTEFATOS TECNOLÓGICOS', teacher: 'PROF. ANCIENT TECH' }
        ]
    },
    4: {
        'CIÊNCIA DE DADOS ESTELARES': [
            { subject: 'ALGORITMOS DE PREDIÇÃO DE SUPERNOVAS', teacher: 'PROF. DATA BYTE' },
            { subject: 'PROJETO FINAL: EXPLORAÇÃO', teacher: 'DRA. VISION SCOPE' },
            { subject: 'BIG DATA GALÁCTICO', teacher: 'ENG. CLOUD NEBULA' },
            { subject: 'SISTEMAS AUTÔNOMOS', teacher: 'ME. BOT AUTO' },
            { subject: 'MODELAGEM DE GALÁXIAS', teacher: 'PROF. SIM COSMOS' },
            { subject: 'ESTATÍSTICA DE PÚSAR', teacher: 'DRA. MATH STAR' },
            { subject: 'INTELIGÊNCIA ARTIFICIAL SENTIENTE', teacher: 'IA ORACLE' }
        ],
        'ADMINISTRAÇÃO DE ESTAÇÕES': [
            { subject: 'GOVERNANÇA ORBITAL', teacher: 'GEN. BASE COMMAND' },
            { subject: 'PROJETO FINAL: GESTÃO', teacher: 'PROF. PLAN LEAD' },
            { subject: 'DIREITO ESPACIAL', teacher: 'ADV. LAW SPACE' },
            { subject: 'SISTEMAS DE SEGURANÇA', teacher: 'OFF. GUARD SHIELD' },
            { subject: 'OPERAÇÕES DE ATracagem', teacher: 'DOCK MASTER B' }
        ],
        'TURISMO INTERPLANETÁRIO': [
            { subject: 'CRUZEIROS DE LUXO EM SATURNO', teacher: 'STWD. LUX STAR' }
        ],
        'RELAÇÕES DIPLOMÁTICAS': [
            { subject: 'NEGOCIAÇÃO COM XENOS', teacher: 'EMB. PEACE TALK' }
        ],
        'ENGENHARIA DE TERRAFORMAÇÃO': [
            { subject: 'CONTROLE ATMOSFÉRICO', teacher: 'DRA. AIR FLOW' },
            { subject: 'OCEANOGRAFIA DE EUROPA', teacher: 'PROF. DEEP SEA' },
            { subject: 'ECOLOGIA DE MARTE', teacher: 'ME. GREEN RED' },
            { subject: 'PROJETO FINAL: NOVO MUNDO', teacher: 'ENG. WORLD BUILD' },
            { subject: 'BIOLOGIA SINTÉTICA', teacher: 'DRA. DNA SYNTH' },
            { subject: 'AGRICULTURA HIDROPÔNICA', teacher: 'ME. PLANT GROW' },
            { subject: 'ESTUDOS DE GRAVIDADE', teacher: 'PROF. WEIGHT LESS' }
        ],
        'EXPLORAÇÃO DE FRONTEIRA': [
            { subject: 'CARTOGRAFIA DO VÁCUO', teacher: 'CAPT. MAP WAY' },
            { subject: 'PROJETO FINAL: FRONTEIRA', teacher: 'SCOUT X-1' },
            { subject: 'SOBREVIVÊNCIA EM AMBIENTES EXTREMOS', teacher: 'SPEC. SURVIVE Z' },
            { subject: 'GEOLOGIA DE COMETAS', teacher: 'PROF. ROCK DUST' },
            { subject: 'PRIMEIRO CONTATO', teacher: 'DRA. HELLO WORLD' },
            { subject: 'FOTOGRAFIA CÓSMICA', teacher: 'PHO. LENS LIGHT' },
            { subject: 'MARCADORES DE NAVEGAÇÃO', teacher: 'ME. BEACON SIGN' }
        ],
        'TÉCNICA DE PROPULSÃO': [
            { subject: 'MOTORES DE ANTIMATÉRIA', teacher: 'ENG. CORE HEAT' },
            { subject: 'FÍSICA DE BURACOS DE MINHOCA', teacher: 'PROF. HOLE TUBE' },
            { subject: 'TESTES DE VOO EM ZERO-G', teacher: 'PIL. TEST FLY' },
            { subject: 'RECURSOS DE INFRAESTRUTURA', teacher: 'ME. BASE WORK' },
            { subject: 'MANUTENÇÃO DE NAVE-MÃE', teacher: 'ENG. SHIP FIX' },
            { subject: 'CRONO-MECÂNICA', teacher: 'DRA. TIME GEAR' }
        ]
    }
};

// Fallback: If no subjects found for a stage, use Generic list
const GENERIC_SUBJECTS = {
    'ENGENHARIA DE PROPULSÃO': [{ subject: 'DINÂMICA DE DOBRA ESPACIAL', teacher: 'PROF. ELIAS VORTEX' }],
    'LOGÍSTICA DE TELETRANSPORTE': [{ subject: 'ESTABILIZAÇÃO DE PORTAIS', teacher: 'DRA. TESS QUARK' }],
    'NAVEGAÇÃO INTERSTELAR': [{ subject: 'CARTOGRAFIA DE BURACOS NEGROS', teacher: 'DRA. LYRA NEBULA' }],
    'CIÊNCIA DE DADOS ESTELARES': [{ subject: 'BIG DATA GALÁCTICO', teacher: 'ENG. CLOUD NEBULA' }],
    'SEGURANÇA ORBITAL': [{ subject: 'DEFESA CONTRA ASTEROIDES', teacher: 'CAP. ION STORM' }],
    'ADMINISTRAÇÃO DE ESTAÇÕES': [{ subject: 'GOVERNANÇA ORBITAL', teacher: 'GEN. BASE COMMAND' }]
};

const COMMON_SUBJECTS = {
    1: [
        { subject: 'ÉTICA INTERGALÁCTICA', teacher: 'CONSELHEIRO ZOG' },
        { subject: 'SOBREVIVÊNCIA NO VÁCUO', teacher: 'INST. OXYGEN' },
        { subject: 'MATEMÁTICA MULTIDIMENSIONAL', teacher: 'PROF. CALC STRATOS' },
        { subject: 'HISTÓRIA DA TERRA ANTIGA', teacher: 'DRA. ARCHEO EARTH' }
    ],
    2: [
        { subject: 'FÍSICA DE PARTÍCULAS EXÓTICAS', teacher: 'DRA. ATOM SPLIT' },
        { subject: 'BIOESTATÍSTICA ALIEN', teacher: 'ME. GENE LAB' },
        { subject: 'PROJETOS DE ENGENHARIA CÓSMICA', teacher: 'ENG. BUILD FAST' },
        { subject: 'PSICOLOGIA DE MASSAS PLANETÁRIAS', teacher: 'DRA. MIND FOCUS' }
    ],
    3: [
        { subject: 'LEGISLAÇÃO PLANETÁRIA', teacher: 'ADV. JUSTICE STAR' }
    ],
    4: [
        { subject: 'PREPARAÇÃO PARA O PRIMEIRO CONTATO', teacher: 'EMB. WELCOME' }
    ]
};


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
const subjectInput = document.getElementById('subject-input');
const subjectIcon = document.getElementById('subject-dropdown-icon');
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
const syncExpandable = document.getElementById('sync-expandable');
const adminBlockWrapper = document.getElementById('admin-block-wrapper');
const adminIsCommon = document.getElementById('admin-is-common');

const deletePasswordInput = document.getElementById('delete-password');
const passwordError = document.getElementById('password-error');
const passwordModal = document.getElementById('password-modal');

// Security Keys (Encoded)
const PASS_GLOBAL_ENCODED = 'Y2NzYW1hY2tlbnppZQ=='; // ccsamackenzie
const PASS_ADMIN_ENCODED = 'QW51bnppbw==';       // Anunzio
const PASS_DELETE_ENCODED = 'bWFja2Vuemll';       // mackenzie

let editingSlot = null; // { dateStr, hourIdx }
let pendingDeleteIdx = null;
let pendingDeleteDate = null;
let pendingDeleteType = 'assignment'; // 'assignment' or 'event'
let requireAdminForDelete = false;

function isDatePast(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + 'T00:00:00');
    return target < today;
}

// --- INIT ---
function init() {
    // 1. Restore data from cache immediately (Safety first)
    restoreFromPersistence();

    // 2. Check Global Access
    if (sessionStorage.getItem('mack_access') === 'granted') {
        const modal = document.getElementById('global-access-modal');
        if (modal) modal.classList.add('hidden');
    }

    renderStageButtons();
    renderCalendar();
    setupFirebaseListeners();
    setupMobileSync();
    lucide.createIcons();
}

function restoreFromPersistence() {
    try {
        const cachedAssignments = localStorage.getItem('agenda_assignments');
        const cachedEvents = localStorage.getItem('agenda_events');
        if (cachedAssignments) state.assignments = JSON.parse(cachedAssignments);
        if (cachedEvents) state.events = JSON.parse(cachedEvents);
    } catch (e) {
        console.warn("Persistence Restore Error:", e);
    }
}

function syncLocalStorage() {
    localStorage.setItem('agenda_assignments', JSON.stringify(state.assignments));
    localStorage.setItem('agenda_events', JSON.stringify(state.events));
}
function setupMobileSync() {
    const scrollContainer = document.getElementById('calendar-scroll');
    const headerContainer = document.getElementById('week-header').parentElement;

    if (scrollContainer && headerContainer) {
        scrollContainer.addEventListener('scroll', () => {
            headerContainer.scrollLeft = scrollContainer.scrollLeft;
        });
    }
}

// --- PERSISTENCE (Firebase) ---
function setupFirebaseListeners() {
    // Listen for Assignments
    db.ref('assignments').on('value', (snapshot) => {
        state.assignments = snapshot.val() || {};
        syncLocalStorage(); // Save backup
        renderCalendar();
    }, (error) => {
        console.error("Firebase Sync Error (Assignments):", error);
    });

    // Listen for Events
    db.ref('events').on('value', (snapshot) => {
        state.events = snapshot.val() || {};
        syncLocalStorage(); // Save backup
        renderCalendar();
    }, (error) => {
        console.error("Firebase Sync Error (Events):", error);
    });
}

function saveAssignments() {
    if (sessionStorage.getItem('mack_access') !== 'granted') return;
    syncLocalStorage(); // Immediate local save
    db.ref('assignments').set(state.assignments);
}

function saveEvents() {
    if (sessionStorage.getItem('mack_access') !== 'granted') return;
    console.log("Tentando salvar eventos...", state.events);
    db.ref('events').set(state.events)
        .then(() => console.log("Eventos salvos com sucesso!"))
        .catch((err) => {
            console.error("FALHA AO SALVAR EVENTOS:", err);
            alert("Erro ao salvar evento: " + err.message);
        });
}

// --- CORE RENDERING ---
function renderStageButtons() {
    STAGES.forEach(s => {
        const btn = document.getElementById(`stage-btn-${s}`);
        if (btn) {
            if (state.activeStage === s) {
                btn.className = "btn-premium flex-1 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg whitespace-nowrap transition-all duration-300 bg-white text-red-600 shadow-xl scale-105 z-10";
            } else {
                btn.className = "btn-premium flex-1 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg whitespace-nowrap transition-all duration-300 text-red-100 hover:bg-white/10";
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
        timeCell.className = 'border-b border-r border-slate-200 p-2 text-[10px] sm:text-xs text-slate-400 text-right sticky left-0 bg-white z-10';
        timeCell.innerHTML = `<span class="-mt-2 block">${hLabel.split(' - ')[0]}</span>`;
        weekGrid.appendChild(timeCell);

        // 2. Day Slot Cells (7)
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];

            const cellIsPast = isDatePast(dateStr);
            const cell = document.createElement('div');
            cell.className = 'border-b border-r border-slate-200 min-h-[60px] relative transition p-1 flex flex-col gap-1 ' +
                (cellIsPast ? 'bg-slate-100/60 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer');

            // Past-date lock indicator (top-right corner)
            if (cellIsPast) {
                const lockIcon = document.createElement('div');
                lockIcon.className = 'absolute top-0.5 right-0.5 text-slate-300';
                lockIcon.innerHTML = '<i data-lucide="lock" class="w-2.5 h-2.5"></i>';
                cell.appendChild(lockIcon);
            }

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
    eventTimeCell.className = 'border-b border-r border-slate-200 p-2 text-[10px] sm:text-xs text-red-600 font-bold text-right sticky left-0 bg-slate-50 z-10';
    eventTimeCell.textContent = 'EVENTOS';
    weekGrid.appendChild(eventTimeCell);

    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];

        const cell = document.createElement('div');
        cell.className = 'border-b border-r border-slate-200 min-h-[40px] bg-slate-50/50 p-1 flex flex-col gap-1';

        const dayEvents = state.events[dateStr] || [];
        dayEvents.forEach((evtText, evtIdx) => {
            const pill = document.createElement('div');
            pill.className = 'bg-slate-800 text-white text-[10px] p-1.5 rounded shadow-sm flex items-center gap-1 cursor-pointer hover:bg-black transition-colors';
            pill.innerHTML = `<i data-lucide="star" class="w-3 h-3 text-yellow-400"></i> ${evtText}`;
            pill.onclick = (e) => {
                e.stopPropagation();
                openDeleteEventModal(dateStr, evtIdx);
            };
            cell.appendChild(pill);
        });
        weekGrid.appendChild(cell);
    }
    lucide.createIcons();
}

function createPill(data, isCommon, dateStr, hIdx, itemIndex) {
    const el = document.createElement('div');
    const courseName = data.courseName || '';

    // Advanced Short Names mapping for cleaner UI
    let shortName = courseName;
    const mapping = {
        'PROPULSÃO': 'PROP',
        'NAVEGAÇÃO': 'NAV',
        'ASTROBIOLOGIA': 'BIO',
        'DIPLOMACIA': 'DIP',
        'ENERGIA': 'ENE',
        'SEGURANÇA': 'SEG',
        'CIBERNÉTICA': 'CIB',
        'TELETRANSPORTE': 'TELE',
        'COLÔNIAS': 'COL',
        'MINERAÇÃO': 'MIN',
        'ARQUITETURA': 'ARQ',
        'DEFESA': 'DEF',
        'ESTRATÉGIA': 'EST',
        'MEDICINA': 'MED',
        'COMUNICAÇÃO': 'COM',
        'MATERIAIS': 'MAT',
        'ARQUEOLOGIA': 'ARQ',
        'DADOS': 'DAT',
        'ESTAÇÕES': 'EST',
        'TURISMO': 'TUR',
        'RELAÇÕES': 'REL',
        'TERRAFORMAÇÃO': 'TERA',
        'EXPLORAÇÃO': 'EXP'
    };

    for (const [key, val] of Object.entries(mapping)) {
        if (courseName.includes(key)) {
            shortName = val;
            break;
        }
    }

    // Base Styles
    el.className = 'w-full mb-1 last:mb-0 rounded-xl shadow-sm border border-slate-200/50 overflow-hidden flex flex-col group relative hover:z-20 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-card';

    if (isCommon) {
        // Common Axis: Solid Bold Professional Look
        el.className += ' bg-[#B9141A] border-none shadow-[0_4px_12px_-2px_rgba(185,20,26,0.3)]';
        el.innerHTML = `
            <div class="px-2 py-1.5 flex flex-col justify-center min-h-[40px]">
                <div class="flex items-center gap-1 mb-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                    <span class="text-[9px] font-black text-white/70 uppercase tracking-widest">Eixo Comum</span>
                </div>
                <div class="text-[10px] sm:text-[11px] font-bold text-white leading-tight truncate px-0.5">${data.subject}</div>
            </div>
        `;
    } else {
        // Specific Axis: Clean White Premium Look with Color Indicator
        el.className += ' bg-white';
        el.innerHTML = `
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-[#B9141A]"></div>
            <div class="pl-2.5 pr-2 py-1.5 flex flex-col justify-center min-h-[42px]">
                <div class="flex items-center justify-between mb-0.5">
                    <span class="text-[9px] font-black text-[#B9141A] uppercase tracking-wider">${shortName}</span>
                    <i data-lucide="tag" class="w-2.5 h-2.5 text-slate-300 group-hover:text-[#B9141A]/40 transition-colors"></i>
                </div>
                <div class="text-[10px] sm:text-[11px] font-bold text-gray-800 leading-tight truncate" title="${data.subject}">${data.subject}</div>
            </div>
        `;
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
    if (syncExpandable) syncExpandable.classList.add('hidden');

    const past = isDatePast(dateStr);
    const isAdminSession = sessionStorage.getItem('admin_edit_past') === 'granted';
    // Clear one-time admin edit token after use
    sessionStorage.removeItem('admin_edit_past');

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

    // --- PAST DATE LOCK ---
    const pastWarning = document.getElementById('past-date-warning');
    const formEl = document.getElementById('assignment-form');
    const pastUnlockSelect = document.getElementById('past-admin-unlock');

    // Always populate the course select
    const availableCourses = [...(Object.keys(ACADEMIC_GRID[state.activeStage] || {})), "ADMIN"];
    courseSelect.innerHTML = availableCourses.map(cName => `<option value="${cName}">${cName}</option>`).join('');

    if (past && !isAdminSession) {
        // Show warning with admin-unlock dropdown, hide form
        if (pastWarning) pastWarning.classList.remove('hidden');
        if (formEl) formEl.classList.add('hidden');
        // Populate the dedicated unlock select in the warning panel
        if (pastUnlockSelect) {
            pastUnlockSelect.innerHTML = '<option value="">-- Selecione --</option>' +
                (Object.keys(ACADEMIC_GRID[state.activeStage] || {})).map(cName => `<option value="${cName}">${cName}</option>`).join('');
        }
        editModal.classList.remove('hidden');
        lucide.createIcons();
        return;
    } else {
        if (pastWarning) pastWarning.classList.add('hidden');
        if (formEl) formEl.classList.remove('hidden');
    }

    // Reset Form
    teacherInput.value = '';
    subjectSelect.classList.remove('hidden');
    subjectInput.classList.add('hidden');
    subjectInput.value = '';
    subjectIcon.classList.remove('hidden');
    if (adminBlockWrapper) adminBlockWrapper.classList.add('hidden');
    if (adminIsCommon) adminIsCommon.checked = false;

    updateFormVisibility(); // Triggers subject options
    editModal.classList.remove('hidden');
}

window.closeEditModal = function () {
    editModal.classList.add('hidden');
}

// Attempt to unlock past date scheduling (called from the warning panel's select)
window.tryUnlockPastDate = function () {
    const pastUnlockSelect = document.getElementById('past-admin-unlock');
    if (!pastUnlockSelect || pastUnlockSelect.value !== 'ADMIN') return;

    // Use session-based admin verification
    if (sessionStorage.getItem('admin_verified') !== 'granted') {
        const pass = prompt('Acesso restrito. Digite a senha Admin:');
        if (pass === null) {
            pastUnlockSelect.value = '';
            return;
        }
        if (btoa(pass) !== PASS_ADMIN_ENCODED) {
            alert('Senha incorreta!');
            pastUnlockSelect.value = '';
            return;
        }
        sessionStorage.setItem('admin_verified', 'granted');
    }

    // Grant admin edit token and re-open modal
    sessionStorage.setItem('admin_edit_past', 'granted');
    if (editingSlot) {
        const { dateStr, hourIdx } = editingSlot;
        closeEditModal();
        openEditModal(dateStr, hourIdx);
        // Auto-select ADMIN course and set up the admin form
        setTimeout(() => {
            courseSelect.value = 'ADMIN';
            // Trigger UI update manually without prompt
            updateAdminUI();
        }, 0);
    }
}

// Helper to set Admin UI state without triggering prompts
function updateAdminUI() {
    subjectSelect.classList.add('hidden');
    subjectInput.classList.remove('hidden');
    subjectInput.value = '';
    subjectIcon.classList.add('hidden');
    teacherInput.value = 'Admin';
    if (adminBlockWrapper) adminBlockWrapper.classList.remove('hidden');
    checkSyncRequirement();
}

window.updateSubjectOptions = function () {
    const typeRadio = document.querySelector('input[name="axis-type"]:checked');
    if (!typeRadio) return;
    const type = typeRadio.value;
    const stage = state.activeStage;
    let options = [];

    if (type === 'common') {
        options = COMMON_SUBJECTS[stage] || [];
        subjectSelect.classList.remove('hidden');
        subjectInput.classList.add('hidden');
        subjectIcon.classList.remove('hidden');
    } else {
        const courseName = courseSelect.value;
        if (!courseName) return;

        if (courseName === 'ADMIN') {
            if (sessionStorage.getItem('admin_verified') !== 'granted') {
                const pass = prompt("Acesso restrito. Digite a senha Admin:");
                if (pass === null || btoa(pass) !== PASS_ADMIN_ENCODED) {
                    if (pass !== null) alert("Senha incorreta!");
                    // Reset to first available course safely
                    courseSelect.selectedIndex = 0;
                    // Do NOT call updateSubjectOptions recursively here if it triggers prompt again
                    // Instead, just reset the standard UI
                    resetToStandardUI();
                    return;
                }
                sessionStorage.setItem('admin_verified', 'granted');
            }
            // Admin setup
            updateAdminUI();
            return;
        }

        // Standard setup
        resetToStandardUI();

        // Get subjects from DB or Generic fallback
        const stageSubjects = ACADEMIC_GRID[stage] && ACADEMIC_GRID[stage][courseName];
        options = stageSubjects || GENERIC_SUBJECTS[courseName] || [];
    }

    subjectSelect.innerHTML = options.length ?
        options.map(o => `<option value="${o.subject}" data-teacher="${o.teacher}">${o.subject}</option>`).join('') :
        '<option value="">Sem opções</option>';

    autoFillTeacher();
    checkSyncRequirement();
}

function resetToStandardUI() {
    if (adminBlockWrapper) adminBlockWrapper.classList.add('hidden');
    subjectSelect.classList.remove('hidden');
    subjectInput.classList.add('hidden');
    subjectIcon.classList.remove('hidden');
}

function checkSyncRequirement() {
    const course = courseSelect.value;
    const subject = (course === 'ADMIN') ? subjectInput.value : subjectSelect.value;
    const type = document.querySelector('input[name="axis-type"]:checked').value;

    if (type === 'common') {
        syncWrapper.classList.add('hidden');
        return;
    }

    // Now available for ALL specific subjects
    syncWrapper.classList.remove('hidden');

    let html = '<option value="none">Não (Apenas esta etapa)</option>';
    html += '<option value="all">Sim (Todas as Etapas: 1, 2, 3 e 4)</option>';

    STAGES.filter(s => s !== state.activeStage).forEach(s => {
        html += `<option value="${s}">Sim (Compartilhar com Etapa ${s})</option>`;
    });

    syncSelect.innerHTML = html;
    lucide.createIcons();
}

window.toggleSyncArea = function () {
    if (!syncExpandable) return;
    const isHidden = syncExpandable.classList.contains('hidden');
    if (isHidden) {
        syncExpandable.classList.remove('hidden');
    } else {
        syncExpandable.classList.add('hidden');
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
    if (!editingSlot) return;
    pendingDeleteIdx = idx;
    pendingDeleteType = 'assignment';
    pendingDeleteDate = editingSlot.dateStr;
    requireAdminForDelete = isDatePast(pendingDeleteDate);

    deletePasswordInput.value = '';
    passwordError.classList.add('hidden');

    // Update modal text if admin required
    const title = passwordModal.querySelector('h3');
    const desc = passwordModal.querySelector('p');
    if (requireAdminForDelete) {
        if (title) title.innerHTML = '<i data-lucide="shield-alert" class="w-5 h-5 text-red-600"></i> Bloqueio Admin';
        if (desc) desc.textContent = 'Esta aula é de um dia que já passou. Somente o Administrador pode excluir.';
    } else {
        if (title) title.innerHTML = '<i data-lucide="trash-2" class="w-5 h-5 text-red-600"></i> Excluir Aula';
        if (desc) desc.textContent = 'Para confirmar a exclusão, digite a senha de segurança.';
    }
    lucide.createIcons();

    passwordModal.classList.remove('hidden');
    deletePasswordInput.focus();
}

window.openDeleteEventModal = function (dateStr, idx) {
    pendingDeleteIdx = idx;
    pendingDeleteType = 'event';
    pendingDeleteDate = dateStr;
    requireAdminForDelete = isDatePast(dateStr);

    deletePasswordInput.value = '';
    passwordError.classList.add('hidden');

    const title = passwordModal.querySelector('h3');
    const desc = passwordModal.querySelector('p');
    if (requireAdminForDelete) {
        if (title) title.innerHTML = '<i data-lucide="shield-alert" class="w-5 h-5 text-red-600"></i> Bloqueio Admin';
        if (desc) desc.textContent = 'Este evento é de um dia que já passou. Somente o Administrador pode excluir.';
    } else {
        if (title) title.innerHTML = '<i data-lucide="trash-2" class="w-5 h-5 text-red-600"></i> Excluir Evento';
        if (desc) desc.textContent = 'Deseja excluir este evento especial? Digite a senha para confirmar.';
    }
    lucide.createIcons();

    passwordModal.classList.remove('hidden');
    deletePasswordInput.focus();
}

window.closePasswordModal = function () {
    passwordModal.classList.add('hidden');
    pendingDeleteIdx = null;
}

window.checkGlobalAccess = function () {
    const input = document.getElementById('global-password-input');
    const error = document.getElementById('global-password-error');
    const modal = document.getElementById('global-access-modal');

    // Simple comparison with encoded key
    if (btoa(input.value) === PASS_GLOBAL_ENCODED) {
        sessionStorage.setItem('mack_access', 'granted');
        modal.classList.add('hidden');
    } else {
        error.classList.remove('hidden');
        input.value = '';
    }
}

window.checkPassword = function () {
    const password = deletePasswordInput.value;
    const correctPassword = requireAdminForDelete ? PASS_ADMIN_ENCODED : PASS_DELETE_ENCODED;

    if (btoa(password) === correctPassword) {
        if (pendingDeleteType === 'assignment') {
            executeDelete();
        } else {
            executeDeleteEvent();
        }
    } else {
        passwordError.classList.remove('hidden');
    }
}

function executeDeleteEvent() {
    if (!pendingDeleteDate || pendingDeleteIdx === null) return;
    const dayEvents = state.events[pendingDeleteDate];
    if (dayEvents) {
        dayEvents.splice(pendingDeleteIdx, 1);
        if (dayEvents.length === 0) delete state.events[pendingDeleteDate];
        saveEvents();
        renderCalendar();
    }
    closePasswordModal();
    showToast('Evento excluído com sucesso!');
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
    const course = courseSelect.value;

    // Admin Override: If "ADMIN" is selected and "Bloquear horário" is checked, treat as Common Axis
    let finalType = type;
    if (course === 'ADMIN' && adminIsCommon.checked) {
        finalType = 'common';
    }

    // Choose subject from select OR custom input (ADMIN)
    const subject = (course === 'ADMIN') ? subjectInput.value : subjectSelect.value;

    if (!teacher || !subject) return;

    // Prepare Entry
    const newEntry = {
        type: finalType,
        teacher,
        subject,
        courseName: (finalType === 'specific') ? course : null
    };

    const key = `${state.activeStage}-${dateStr}-${hourIdx}`;
    if (!state.assignments[key]) state.assignments[key] = [];
    const currentItems = state.assignments[key];

    // --- CONFLICT CHECKS ---

    // 1. Common vs Specific
    if (finalType === 'common') {
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
    const syncValue = syncSelect.value;
    if (syncValue !== 'none') {
        newEntry.syncGroupId = Date.now().toString(); // Identificador único do espelhamento

        let targetStages = [];
        if (syncValue === 'all') {
            targetStages = STAGES.filter(s => s !== state.activeStage);
        } else {
            targetStages = [parseInt(syncValue)];
        }

        targetStages.forEach(ts => {
            const syncKey = `${ts}-${dateStr}-${hourIdx}`;
            if (!state.assignments[syncKey]) state.assignments[syncKey] = [];

            // Check for conflicts in the target stage before syncing
            // We'll add it anyway but it might show overlapping in UI if conflicts exist.
            // Usually we want to avoid double scheduling the same course.
            const targetItems = state.assignments[syncKey];
            const hasCourseConflict = targetItems.some(it => it.courseName === newEntry.courseName);
            const hasCommonConflict = targetItems.some(it => it.type === 'common');

            if (!hasCourseConflict && !hasCommonConflict) {
                state.assignments[syncKey].push({ ...newEntry });
            }
        });
    }

    saveAssignments();

    renderCalendar();
    openEditModal(dateStr, hourIdx); // Reload modal to show new item

    // Toast
    showToast('Aula adicionada com sucesso!');
}


function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    toastMsg.innerText = msg;
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 4000);
}

function checkGlobalTeacherConflict(dateStr, hIdx, teacher) {
    if (teacher === 'Admin') return null; // Admin can be everywhere
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
    if (btoa(adminPasswordInput.value) === PASS_ADMIN_ENCODED) {
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

window.exportReport = async function () {
    const assignments = state.assignments;
    if (!assignments || Object.keys(assignments).length === 0) {
        showToast("Nenhum dado encontrado para exportar.");
        return;
    }

    showToast("Gerando relatório Excel...");

    try {
        const workbook = XLSX.utils.book_new();

        const monthNames = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        // Preparar dados para a planilha
        const rows = [];
        // Cabeçalho solicitado pelo usuário:
        // Coluna A: Nome curso
        // Coluna B: Nome da disciplina
        // Coluna C: Etapa que foi agendado
        // Coluna D: Nome Professor
        // Coluna E: Mês
        // Coluna F: Data
        // Coluna G: Hora
        rows.push(["Nome curso", "Nome da disciplina", "Etapa", "Nome Professor", "Mês", "Data", "Hora"]);

        // Ordenar chaves para garantir ordem cronológica
        const keys = Object.keys(assignments).sort((a, b) => {
            const partsA = a.split('-');
            const partsB = b.split('-');
            const dateA = new Date(`${partsA[1]}-${partsA[2]}-${partsA[3]}T00:00:00`);
            const dateB = new Date(`${partsB[1]}-${partsB[2]}-${partsB[3]}T00:00:00`);
            if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
            if (partsA[0] !== partsB[0]) return partsA[0] - partsB[0];
            return partsA[partsA.length - 1] - partsB[partsB.length - 1];
        });

        keys.forEach(key => {
            const parts = key.split('-');
            const stageId = parts[0];
            const dateStr = `${parts[1]}-${parts[2]}-${parts[3]}`;
            const hourIdx = parts[parts.length - 1];
            const hourRange = HOURS[parseInt(hourIdx)];
            const hourOnly = hourRange.split(' - ')[0];

            const dateObj = new Date(dateStr + 'T00:00:00');
            const dayOnly = dateObj.getDate();
            const monthName = monthNames[dateObj.getMonth()];

            // Formatar hora completa (Ex: 19:00:00 - 20:00:00)
            const fullHourRange = hourRange.replace(/(\d{2}:\d{2})/g, "$1:00");

            assignments[key].forEach(it => {
                // Remover prefixos do professor (Prof., Dra., Me., etc)
                let cleanTeacherName = it.teacher
                    .replace(/^(PROF\.|DRA\.|DR\.|ME\.|CAPT\.|EMB\.|ENG\.|GEN\.|COM\.|AGENT|LID\.|TECH\.|CONSELHEIRO|INST\.|OFF\.|DOCK MASTER|STWD\.|ADV\.|ARQ\.|SCOUT|PILOT|SPEC\.|PHO\.|IA)\s+/i, '')
                    .trim();

                rows.push([
                    it.type === 'common' ? 'EIXO COMUM' : (it.courseName || 'N/A'),
                    it.subject,
                    parseInt(stageId), // Apenas o número da etapa como dado numérico
                    cleanTeacherName,
                    monthName,
                    dayOnly, // Apenas o dia
                    fullHourRange // Hora completa com segundos
                ]);
            });
        });

        // Criar worksheet
        const ws = XLSX.utils.aoa_to_sheet(rows);

        // Configurar larguras das colunas
        ws['!cols'] = [
            { wch: 30 }, // Curso
            { wch: 40 }, // Disciplina
            { wch: 10 }, // Etapa
            { wch: 25 }, // Professor
            { wch: 15 }, // Mês
            { wch: 12 }, // Data
            { wch: 10 }  // Hora
        ];

        XLSX.utils.book_append_sheet(workbook, ws, "Relatório Geral");

        // Exportar arquivo
        const fileName = `Relatorio_Agendamento_Simplificado_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);

        showToast("Relatório Excel exportado com sucesso!");

    } catch (err) {
        console.error("Erro na exportação:", err);
        alert("Erro ao exportar Excel: " + err.message);
    }
}

init();
