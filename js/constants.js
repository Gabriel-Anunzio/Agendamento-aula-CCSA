/**
 * constants.js - Global configuration and static data
 */

window.firebaseConfig = {
    apiKey: "AIzaSyAwhBLj8uybWMUJdw0hKPYORSyLnXR2hPw",
    authDomain: "agenda-ccsa.firebaseapp.com",
    databaseURL: "https://agenda-ccsa-default-rtdb.firebaseio.com",
    projectId: "agenda-ccsa",
    storageBucket: "agenda-ccsa.firebasestorage.app",
    messagingSenderId: "104981884551",
    appId: "1:104981884551:web:52048c97f42ef854451222",
    measurementId: "G-KQ83Z5YQP9"
};

window.STAGES = [1, 2, 3, 4];

window.ACADEMIC_GRID = {
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

window.GENERIC_SUBJECTS = {
    'ENGENHARIA DE PROPULSÃO': [{ subject: 'DINÂMICA DE DOBRA ESPACIAL', teacher: 'PROF. ELIAS VORTEX' }],
    'LOGÍSTICA DE TELETRANSPORTE': [{ subject: 'ESTABILIZAÇÃO DE PORTAIS', teacher: 'DRA. TESS QUARK' }],
    'NAVEGAÇÃO INTERSTELAR': [{ subject: 'CARTOGRAFIA DE BURACOS NEGROS', teacher: 'DRA. LYRA NEBULA' }],
    'CIÊNCIA DE DADOS ESTELARES': [{ subject: 'BIG DATA GALÁCTICO', teacher: 'ENG. CLOUD NEBULA' }],
    'SEGURANÇA ORBITAL': [{ subject: 'DEFESA CONTRA ASTEROIDES', teacher: 'CAP. ION STORM' }],
    'ADMINISTRAÇÃO DE ESTAÇÕES': [{ subject: 'GOVERNANÇA ORBITAL', teacher: 'GEN. BASE COMMAND' }]
};
window.COMMON_SUBJECTS = {
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

const HOURS_START = 19;
const HOURS_END = 22;
window.HOURS = [];
for (let h = HOURS_START; h < HOURS_END; h++) {
    window.HOURS.push(`${h.toString().padStart(2, '0')}:00 - ${(h + 1).toString().padStart(2, '0')}:00`);
}

window.PASS_GLOBAL_ENCODED = 'Y2NzYW1hY2tlbnppZQ==';
window.PASS_ADMIN_ENCODED = 'QW51bnppbw==';
window.PASS_DELETE_ENCODED = 'bWFja2Vuemll';
