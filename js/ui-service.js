/**
 * ui-service.js - UI helpers like toasts and pills
 */

window.showToast = function (msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;

    toastMsg.innerText = msg;
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 4000);
};

window.createPill = function (data, isCommon, dateStr, hIdx, itemIndex) {
    const el = document.createElement('div');
    const courseName = data.courseName || '';

    // Short Names mapping for cleaner UI
    const mapping = {
        'PROPULSÃO': 'PROP', 'NAVEGAÇÃO': 'NAV', 'ASTROBIOLOGIA': 'BIO',
        'DIPLOMACIA': 'DIP', 'ENERGIA': 'ENE', 'SEGURANÇA': 'SEG',
        'CIBERNÉTICA': 'CIB', 'TELETRANSPORTE': 'TELE', 'COLÔNIAS': 'COL',
        'MINERAÇÃO': 'MIN', 'ARQUITETURA': 'ARQ', 'DEFESA': 'DEF',
        'ESTRATÉGIA': 'EST', 'MEDICINA': 'MED', 'COMUNICAÇÃO': 'COM',
        'MATERIAIS': 'MAT', 'ARQUEOLOGIA': 'ARQ', 'DADOS': 'DAT',
        'ESTAÇÕES': 'EST', 'TURISMO': 'TUR', 'RELAÇÕES': 'REL',
        'TERRAFORMAÇÃO': 'TERA', 'EXPLORAÇÃO': 'EXP'
    };

    let shortName = courseName;
    for (const [key, val] of Object.entries(mapping)) {
        if (courseName.includes(key)) {
            shortName = val;
            break;
        }
    }

    el.className = 'w-full mb-1 last:mb-0 rounded-xl shadow-sm border border-slate-200/50 overflow-hidden flex flex-col group relative transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-card';

    if (isCommon) {
        el.className += ' bg-[#B9141A] border-none shadow-[0_4px_12px_-2px_rgba(185,20,26,0.3)]';
        el.innerHTML = `
            <div class="px-2 py-1.5 flex flex-col justify-center min-h-[40px]">
                <div class="flex items-center gap-1 mb-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                    <span class="text-[9px] font-black text-white/70 uppercase tracking-widest">Eixo Comum</span>
                </div>
                <div class="text-[10px] sm:text-[11px] font-bold text-white leading-tight truncate px-0.5">${data.subject}</div>
            </div>`;
    } else {
        el.className += ' bg-white dark:bg-slate-800 dark:border-slate-700';
        el.innerHTML = `
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-[#B9141A]"></div>
            <div class="pl-2.5 pr-2 py-1.5 flex flex-col justify-center min-h-[42px]">
                <div class="flex items-center justify-between mb-0.5">
                    <span class="text-[9px] font-black text-[#B9141A] dark:text-red-400 uppercase tracking-wider">${shortName}</span>
                    <i data-lucide="tag" class="w-2.5 h-2.5 text-slate-300 dark:text-slate-500 group-hover:text-[#B9141A]/40 transition-colors"></i>
                </div>
                <div class="text-[10px] sm:text-[11px] font-bold text-gray-800 dark:text-slate-100 leading-tight truncate" title="${data.subject}">${data.subject}</div>
            </div>`;
    }
    return el;
};

window.setupMobileSync = function () {
    const scrollContainer = document.getElementById('calendar-scroll');
    const headerContainer = document.querySelector('#week-header')?.parentElement;
    if (scrollContainer && headerContainer) {
        scrollContainer.addEventListener('scroll', () => {
            headerContainer.scrollLeft = scrollContainer.scrollLeft;
        });
    }
};
