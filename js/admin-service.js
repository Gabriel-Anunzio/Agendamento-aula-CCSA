/**
 * admin-service.js - Admin specific logic and password checks
 */

window.openAdminLogin = function () {
    window.dom.adminPasswordInput.value = '';
    window.dom.adminPasswordError.classList.add('hidden');
    window.dom.adminLoginModal.classList.remove('hidden');
    window.dom.adminPasswordInput.focus();
};

window.closeAdminLogin = function () {
    window.dom.adminLoginModal.classList.add('hidden');
};

window.checkAdminPassword = function () {
    if (btoa(window.dom.adminPasswordInput.value) === window.PASS_ADMIN_ENCODED) {
        window.dom.adminLoginModal.classList.add('hidden');
        window.openAdminSettings();
    } else {
        window.dom.adminPasswordError.classList.remove('hidden');
    }
};

window.openAdminSettings = function () {
    window.dom.adminSettingsModal.classList.remove('hidden');
};

window.closeAdminSettings = function () {
    window.dom.adminSettingsModal.classList.add('hidden');
};

window.confirmClearAll = function () {
    if (confirm('TEM CERTEZA? Isso irá apagar todos os horários e eventos salvos.')) {
        window.state.assignments = {};
        window.state.events = {};
        window.saveAssignments();
        window.saveEvents();
        window.renderCalendar();
        window.closeAdminSettings();
        alert('Todos os dados foram excluídos.');
    }
};

window.checkGlobalAccess = function () {
    if (btoa(window.dom.globalPasswordInput.value) === window.PASS_GLOBAL_ENCODED) {
        sessionStorage.setItem('mack_access', 'granted');
        window.dom.globalAccessModal.classList.add('hidden');
    } else {
        window.dom.globalPasswordError.classList.remove('hidden');
        window.dom.globalPasswordInput.value = '';
    }
};

window.tryUnlockPastDate = function () {
    if (!window.dom.syncExpandable) return; // Quick check
    const pastUnlockSelect = document.getElementById('past-admin-unlock');
    if (!pastUnlockSelect || pastUnlockSelect.value !== 'ADMIN') return;

    if (sessionStorage.getItem('admin_verified') !== 'granted') {
        const pass = prompt('Acesso restrito. Digite a senha Admin:');
        if (pass === null) {
            pastUnlockSelect.value = '';
            return;
        }
        if (btoa(pass) === window.PASS_ADMIN_ENCODED) {
            sessionStorage.setItem('admin_verified', 'granted');
        } else {
            alert('Senha incorreta!');
            pastUnlockSelect.value = '';
            return;
        }
    }

    sessionStorage.setItem('admin_edit_past', 'granted');
    if (window.editingSlot) {
        const { dateStr, hourIdx } = window.editingSlot;
        window.closeEditModal();
        window.openEditModal(dateStr, hourIdx);
        setTimeout(() => {
            window.dom.courseSelect.value = 'ADMIN';
            window.updateAdminUI();
        }, 0);
    }
};

window.updateAdminUI = function () {
    window.dom.subjectSelect.classList.add('hidden');
    window.dom.subjectInput.classList.remove('hidden');
    window.dom.subjectInput.value = '';
    window.dom.subjectIcon.classList.add('hidden');
    window.dom.teacherInput.value = 'Admin';
    if (window.dom.adminBlockWrapper) window.dom.adminBlockWrapper.classList.remove('hidden');
    window.checkSyncRequirement();
};

window.openBlocksModal = function () {
    document.getElementById('blocks-modal').classList.remove('hidden');
    window.renderBlocksList();
};

window.closeBlocksModal = function () {
    document.getElementById('blocks-modal').classList.add('hidden');
};

window.renderBlocksList = function () {
    const list = document.getElementById('blocks-list');
    const year = document.getElementById('blocks-year-filter').value;
    if (!list) return;

    list.innerHTML = '';

    // Combined set of all keys from constants and current state
    const holidayKeys = window.HOLIDAYS[year] || {};
    const stateKeys = {};

    // Filter state blocks for this year
    for (const [date, label] of Object.entries(window.state.blocks)) {
        if (date.startsWith(year)) {
            stateKeys[date.substring(5)] = label; // MM-DD
        }
    }

    // Merge all possible keys for the selected year
    const allMMDD = new Set([...Object.keys(holidayKeys), ...Object.keys(stateKeys)]);
    const sortedMMDD = Array.from(allMMDD).sort();

    sortedMMDD.forEach(mmdd => {
        const fullDate = `${year}-${mmdd}`;
        const blockObj = window.state.blocks[fullDate];
        const isBlocked = !!blockObj;
        const label = isBlocked ? (typeof blockObj === 'string' ? blockObj : blockObj.label) : (holidayKeys[mmdd] || "Bloqueio Customizado");
        const timeInfo = (isBlocked && blockObj.startTime) ? `<span class="block text-[9px] text-red-500 font-bold">${blockObj.startTime} - ${blockObj.endTime}</span>` : '';

        const item = document.createElement('div');
        item.className = `flex items-center justify-between p-4 rounded-2xl border transition-all ${isBlocked ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`;

        item.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black uppercase text-[10px] ${isBlocked ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}">
                    <span>${mmdd.split('-')[1]}</span>
                    <span>${new Date(fullDate + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' }).substring(0, 3)}</span>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-slate-800 dark:text-white capitalize">${label}</h4>
                    ${timeInfo}
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${isBlocked ? '⚠️ Horário Bloqueado' : '✅ Horário Disponível'}</p>
                </div>
            </div>
            <button onclick="window.toggleBlock('${fullDate}', '${label}')" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${isBlocked ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20' : 'bg-slate-800 text-white hover:bg-black dark:bg-slate-100 dark:text-slate-900'}">
                ${isBlocked ? 'Desbloquear' : 'Bloquear Dia'}
            </button>
        `;
        list.appendChild(item);
    });
};

window.toggleBlock = function (dateStr, label, timedData = null) {
    if (window.state.blocks[dateStr]) {
        delete window.state.blocks[dateStr];
    } else {
        if (timedData) {
            window.state.blocks[dateStr] = {
                label: label,
                startTime: timedData.startTime,
                endTime: timedData.endTime,
                hours: timedData.hours
            };
        } else {
            window.state.blocks[dateStr] = label;
        }
    }
    window.saveBlocks();
    window.renderBlocksList();
    window.renderCalendar();
};

window.addCustomBlockPrompt = function () {
    const year = document.getElementById('blocks-year-filter').value;
    const dateInput = prompt("Digite o dia e mês para o bloqueio (Ex: 10/05 para 10 de Maio):");
    if (!dateInput) return;

    const parts = dateInput.split('/');
    if (parts.length !== 2) {
        alert("Formato inválido. Use DD/MM");
        return;
    }

    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const label = prompt("Título do Bloqueio (Ex: Recesso Escolar):") || "Bloqueio Manual";

    const isTimed = confirm("Deseja bloquear um horário específico?\n(OK para escolher horário, Cancelar para o dia todo)");
    
    let timedData = null;
    if (isTimed) {
        const start = prompt("Início (Ex: 19):", "19");
        const end = prompt("Fim (Ex: 22):", "22");
        
        if (start && end) {
            const hStart = parseInt(start);
            const hEnd = parseInt(end);
            const hours = [];
            for (let i = hStart; i < hEnd; i++) {
                // Map to indices in window.HOURS (19:00 is index 0)
                const idx = i - 19;
                if (idx >= 0 && idx < window.HOURS.length) {
                    hours.push(idx);
                }
            }
            timedData = {
                startTime: `${start}:00`,
                endTime: `${end}:00`,
                hours: hours
            };
        }
    }

    const fullDate = `${year}-${month}-${day}`;
    window.toggleBlock(fullDate, label, timedData);
};
