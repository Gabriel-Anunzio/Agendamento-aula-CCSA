/**
 * main.js - Application entry point and global events
 */

window.init = function () {
    // 1. Restore data
    window.restoreFromPersistence();

    // 2. Check Global Access
    if (sessionStorage.getItem('mack_access') === 'granted') {
        if (window.dom.globalAccessModal) window.dom.globalAccessModal.classList.add('hidden');
    }

    // 3. Setup UI
    window.renderStageButtons();
    window.renderCalendar();
    window.setupFirebaseListeners();
    window.setupMobileSync();
    // 4. Attach Date Select Listeners
    if (window.dom.monthSelect) window.dom.monthSelect.onchange = window.handleDateSelectChange;
    if (window.dom.yearSelect) window.dom.yearSelect.onchange = window.handleDateSelectChange;

    if (window.lucide) window.lucide.createIcons();
};

window.handleDateSelectChange = function () {
    const y = parseInt(window.dom.yearSelect.value);
    const m = parseInt(window.dom.monthSelect.value);
    const newDate = new Date(y, m, 1);
    window.state.currentWeekStart = new Date(newDate); // Start exactly on the 1st
    window.state.activeDate = newDate.toISOString().split('T')[0];
    window.renderCalendar();
};

// Global Events
window.updateFormVisibility = function () {
    const typeRadio = document.querySelector('input[name="axis-type"]:checked');
    if (!typeRadio) return;
    const wrapper = document.getElementById('course-select-wrapper');
    if (typeRadio.value === 'specific') wrapper?.classList.remove('hidden');
    else wrapper?.classList.add('hidden');
    window.updateSubjectOptions();
};

window.openEditModal = function (dateStr, hIdx) {
    window.editingSlot = { dateStr, hourIdx: hIdx };
    window.dom.errorMsg.classList.add('hidden');
    if (window.dom.syncExpandable) window.dom.syncExpandable.classList.add('hidden');

    const past = window.isDatePast(dateStr);
    const isAdminSession = sessionStorage.getItem('admin_edit_past') === 'granted';
    sessionStorage.removeItem('admin_edit_past');

    const key = `${window.state.activeStage}-${dateStr}-${hIdx}`;
    const items = window.state.assignments[key] || [];

    const dayName = new Date(dateStr).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    document.getElementById('edit-slot-info').textContent = `${dayName} • ${window.HOURS[hIdx]}`;

    window.dom.existingItemsContainer.innerHTML = '';
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
                <button type="button" onclick="window.deleteAssignment(${idx})" class="text-red-400 hover:bg-slate-200 p-1.5 rounded transition delete-btn">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>`;
            window.dom.existingItemsContainer.appendChild(row);
        });
        if (window.lucide) window.lucide.createIcons();
    } else {
        window.dom.existingItemsContainer.innerHTML = '<div class="text-slate-500 text-sm italic py-2">Nenhuma aula agendada.</div>';
    }

    const pastWarning = document.getElementById('past-date-warning');
    const pastUnlockSelect = document.getElementById('past-admin-unlock');
    const availableCourses = [...(Object.keys(window.ACADEMIC_GRID[window.state.activeStage] || {})), "ADMIN"];
    window.dom.courseSelect.innerHTML = availableCourses.map(cName => `<option value="${cName}">${cName}</option>`).join('');

    if (past && !isAdminSession) {
        pastWarning?.classList.remove('hidden');
        window.dom.form.classList.add('hidden');
        if (pastUnlockSelect) {
            pastUnlockSelect.innerHTML = '<option value="">-- Selecione --</option>' +
                '<option value="ADMIN">ADMIN (Liberar todos)</option>' +
                (Object.keys(window.ACADEMIC_GRID[window.state.activeStage] || {})).map(cName => `<option value="${cName}">${cName}</option>`).join('');
        }
        window.dom.editModal.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
        return;
    } else {
        pastWarning?.classList.add('hidden');
        window.dom.form.classList.remove('hidden');
    }

    if (window.dom.teacherInput) window.dom.teacherInput.value = '';
    window.dom.subjectSelect.classList.remove('hidden');
    window.dom.subjectInput.classList.add('hidden');
    window.dom.subjectInput.value = '';
    window.dom.subjectIcon.classList.remove('hidden');
    if (window.dom.adminBlockWrapper) window.dom.adminBlockWrapper.classList.add('hidden');
    if (window.dom.adminIsCommon) window.dom.adminIsCommon.checked = false;

    window.updateFormVisibility();
    window.dom.editModal.classList.remove('hidden');
};

window.closeEditModal = function () {
    window.dom.editModal.classList.add('hidden');
};

window.setViewMode = function (mode) {
    window.state.viewMode = mode;

    // Update Button Styles
    const weeklyBtn = document.getElementById('view-weekly-btn');
    const dailyBtn = document.getElementById('view-daily-btn');

    if (mode === 'daily') {
        dailyBtn.className = "flex-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 bg-white text-red-600 shadow-lg";
        weeklyBtn.className = "flex-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 text-red-100 hover:bg-white/10";
    } else {
        weeklyBtn.className = "flex-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 bg-white text-red-600 shadow-lg";
        dailyBtn.className = "flex-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 text-red-100 hover:bg-white/10";
    }

    window.renderCalendar();
};

// Overwrite changeWeek to handle days if in daily mode
window.changeWeek = function (delta) {
    if (window.state.viewMode === 'daily') {
        const current = new Date(window.state.activeDate + 'T12:00:00');
        current.setDate(current.getDate() + delta);
        window.state.activeDate = current.toISOString().split('T')[0];

        // If the new date is outside the current week view, shift the week
        const weekStart = new Date(window.state.currentWeekStart);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        if (current < weekStart || current > weekEnd) {
            function getStartOfWeek(date) {
                const d = new Date(date);
                const day = d.getDay();
                const diff = d.getDate() - day;
                return new Date(d.setDate(diff));
            }
            window.state.currentWeekStart = getStartOfWeek(current);
        }
    } else {
        window.state.currentWeekStart.setDate(window.state.currentWeekStart.getDate() + (delta * 7));
    }
    window.renderCalendar();
};

// Start
window.init();
