/**
 * logic-service.js - Core business logic, scheduling, conflicts and deletions
 */

window.deleteAssignment = function (idx) {
    if (!window.editingSlot) return;
    window.pendingDeleteIdx = idx;
    window.pendingDeleteType = 'assignment';
    window.pendingDeleteDate = window.editingSlot.dateStr;
    window.requireAdminForDelete = window.isDatePast(window.pendingDeleteDate);

    window.dom.deletePasswordInput.value = '';
    window.dom.passwordError.classList.add('hidden');

    const title = window.dom.passwordModal.querySelector('h3');
    const desc = window.dom.passwordModal.querySelector('p');
    if (window.requireAdminForDelete) {
        if (title) title.innerHTML = '<i data-lucide="shield-alert" class="w-5 h-5 text-red-600"></i> Bloqueio Admin';
        if (desc) desc.textContent = 'Esta aula é de um dia que já passou. Somente o Administrador pode excluir.';
    } else {
        if (title) title.innerHTML = '<i data-lucide="trash-2" class="w-5 h-5 text-red-600"></i> Excluir Aula';
        if (desc) desc.textContent = 'Para confirmar a exclusão, digite a senha de segurança.';
    }
    if (window.lucide) window.lucide.createIcons();
    window.dom.passwordModal.classList.remove('hidden');
    window.dom.deletePasswordInput.focus();
};

window.openDeleteEventModal = function (dateStr, idx) {
    window.pendingDeleteIdx = idx;
    window.pendingDeleteType = 'event';
    window.pendingDeleteDate = dateStr;
    window.requireAdminForDelete = window.isDatePast(dateStr);

    window.dom.deletePasswordInput.value = '';
    window.dom.passwordError.classList.add('hidden');

    const title = window.dom.passwordModal.querySelector('h3');
    const desc = window.dom.passwordModal.querySelector('p');
    if (window.requireAdminForDelete) {
        if (title) title.innerHTML = '<i data-lucide="shield-alert" class="w-5 h-5 text-red-600"></i> Bloqueio Admin';
        if (desc) desc.textContent = 'Este evento é de um dia que já passou. Somente o Administrador pode excluir.';
    } else {
        if (title) title.innerHTML = '<i data-lucide="trash-2" class="w-5 h-5 text-red-600"></i> Excluir Evento';
        if (desc) desc.textContent = 'Deseja excluir este evento especial? Digite a senha para confirmar.';
    }
    if (window.lucide) window.lucide.createIcons();
    window.dom.passwordModal.classList.remove('hidden');
    window.dom.deletePasswordInput.focus();
};

window.closePasswordModal = function () {
    window.dom.passwordModal.classList.add('hidden');
    window.pendingDeleteIdx = null;
};

window.checkPassword = function () {
    const password = window.dom.deletePasswordInput.value;
    const correctPassword = window.requireAdminForDelete ? window.PASS_ADMIN_ENCODED : window.PASS_DELETE_ENCODED;
    if (btoa(password) === correctPassword) {
        if (window.pendingDeleteType === 'assignment') window.executeDelete();
        else window.executeDeleteEvent();
    } else {
        window.dom.passwordError.classList.remove('hidden');
    }
};

window.executeDeleteEvent = function () {
    const dayEvents = window.state.events[window.pendingDeleteDate];
    if (dayEvents) {
        dayEvents.splice(window.pendingDeleteIdx, 1);
        if (dayEvents.length === 0) delete window.state.events[window.pendingDeleteDate];
        window.saveEvents();
        window.renderCalendar();
    }
    window.closePasswordModal();
    window.showToast('Evento excluído com sucesso!');
};

window.executeDelete = function () {
    const { dateStr, hourIdx } = window.editingSlot;
    const key = `${window.state.activeStage}-${dateStr}-${hourIdx}`;
    const items = window.state.assignments[key];
    if (!items) return;

    const deletedItem = items[window.pendingDeleteIdx];
    if (deletedItem.syncGroupId) {
        for (const k in window.state.assignments) {
            window.state.assignments[k] = window.state.assignments[k].filter(it => it.syncGroupId !== deletedItem.syncGroupId);
            if (window.state.assignments[k].length === 0) delete window.state.assignments[k];
        }
    } else {
        items.splice(window.pendingDeleteIdx, 1);
        if (items.length === 0) delete window.state.assignments[key];
    }
    window.saveAssignments();
    window.closePasswordModal();
    window.openEditModal(dateStr, hourIdx);
    window.renderCalendar();
};

window.handleFormSubmit = function (e) {
    e.preventDefault();
    if (!window.editingSlot) return;
    const { dateStr, hourIdx } = window.editingSlot;
    const type = document.querySelector('input[name="axis-type"]:checked').value;
    const teacher = window.dom.teacherInput.value;
    const course = window.dom.courseSelect.value;
    const subject = (course === 'ADMIN') ? window.dom.subjectInput.value : window.dom.subjectSelect.value;

    if (!teacher || !subject) return;

    let finalType = type;
    if (course === 'ADMIN' && window.dom.adminIsCommon.checked) finalType = 'common';

    const newEntry = { type: finalType, teacher, subject, courseName: (finalType === 'specific') ? course : null };
    const key = `${window.state.activeStage}-${dateStr}-${hourIdx}`;
    if (!window.state.assignments[key]) window.state.assignments[key] = [];
    const currentItems = window.state.assignments[key];

    // Conflict Checks
    if (finalType === 'common') {
        if (currentItems.length > 0) {
            window.dom.errorMsg.textContent = "Conflito: Remova as aulas existentes antes de adicionar um Eixo Comum.";
            window.dom.errorMsg.classList.remove('hidden');
            return;
        }
    } else {
        if (currentItems.some(it => it.type === 'common')) {
            window.dom.errorMsg.textContent = "Conflito: Horário bloqueado por Eixo Comum.";
            window.dom.errorMsg.classList.remove('hidden');
            return;
        }
        if (currentItems.some(it => it.courseName === newEntry.courseName)) {
            window.dom.errorMsg.textContent = "Conflito: Este curso já tem aula neste horário.";
            window.dom.errorMsg.classList.remove('hidden');
            return;
        }
    }

    const conflict = window.checkGlobalTeacherConflict(dateStr, hourIdx, teacher);
    if (conflict) {
        window.dom.errorMsg.textContent = conflict;
        window.dom.errorMsg.classList.remove('hidden');
        return;
    }

    currentItems.push(newEntry);

    // Sync
    const syncValue = window.dom.syncSelect.value;
    if (syncValue !== 'none') {
        newEntry.syncGroupId = Date.now().toString();
        let targetStages = (syncValue === 'all') ? window.STAGES.filter(s => s !== window.state.activeStage) : [parseInt(syncValue)];
        targetStages.forEach(ts => {
            const syncKey = `${ts}-${dateStr}-${hourIdx}`;
            if (!window.state.assignments[syncKey]) window.state.assignments[syncKey] = [];
            if (!window.state.assignments[syncKey].some(it => it.courseName === newEntry.courseName || it.type === 'common')) {
                window.state.assignments[syncKey].push({ ...newEntry });
            }
        });
    }

    window.saveAssignments();
    window.renderCalendar();
    window.openEditModal(dateStr, hourIdx);
    window.showToast('Aula adicionada com sucesso!');
};

window.checkGlobalTeacherConflict = function (dateStr, hIdx, teacher) {
    if (teacher === 'Admin') return null;
    for (const [k, items] of Object.entries(window.state.assignments)) {
        const [stg, d, h] = k.split('-');
        if (d === dateStr && parseInt(h) === hIdx) {
            for (const it of items) {
                if (it.teacher === teacher) return `Conflito! Professor(a) ${teacher} já está ocupado na Etapa ${stg}.`;
            }
        }
    }
    return null;
};

window.updateSubjectOptions = function () {
    const typeRadio = document.querySelector('input[name="axis-type"]:checked');
    if (!typeRadio) return;
    const type = typeRadio.value;
    const stage = window.state.activeStage;
    let options = [];

    if (type === 'common') {
        options = window.COMMON_SUBJECTS[stage] || [];
        window.dom.subjectSelect.classList.remove('hidden');
        window.dom.subjectInput.classList.add('hidden');
        window.dom.subjectIcon.classList.remove('hidden');
    } else {
        const courseName = window.dom.courseSelect.value;
        if (!courseName) return;
        if (courseName === 'ADMIN') {
            if (sessionStorage.getItem('admin_verified') !== 'granted') {
                const pass = prompt("Acesso restrito. Digite a senha Admin:");
                if (pass === null || btoa(pass) !== window.PASS_ADMIN_ENCODED) {
                    if (pass !== null) alert("Senha incorreta!");
                    window.dom.courseSelect.selectedIndex = 0;
                    window.resetToStandardUI();
                    return;
                }
                sessionStorage.setItem('admin_verified', 'granted');
            }
            window.updateAdminUI();
            return;
        }
        window.resetToStandardUI();
        const stageSubjects = window.ACADEMIC_GRID[stage] && window.ACADEMIC_GRID[stage][courseName];
        options = stageSubjects || window.GENERIC_SUBJECTS[courseName] || [];
    }

    window.dom.subjectSelect.innerHTML = options.length ?
        options.map(o => `<option value="${o.subject}" data-teacher="${o.teacher}">${o.subject}</option>`).join('') :
        '<option value="">Sem opções</option>';

    window.autoFillTeacher();
    window.checkSyncRequirement();
};

window.resetToStandardUI = function () {
    if (window.dom.adminBlockWrapper) window.dom.adminBlockWrapper.classList.add('hidden');
    window.dom.subjectSelect.classList.remove('hidden');
    window.dom.subjectInput.classList.add('hidden');
    window.dom.subjectIcon.classList.remove('hidden');
};

window.autoFillTeacher = function () {
    const opt = window.dom.subjectSelect.options[window.dom.subjectSelect.selectedIndex];
    window.dom.teacherInput.value = opt ? opt.getAttribute('data-teacher') : '';
};

window.checkSyncRequirement = function () {
    const course = window.dom.courseSelect.value;
    const type = document.querySelector('input[name="axis-type"]:checked')?.value;
    if (type === 'common') { window.dom.syncWrapper.classList.add('hidden'); return; }
    window.dom.syncWrapper.classList.remove('hidden');
    let html = '<option value="none">Não (Apenas esta etapa)</option>';
    html += '<option value="all">Sim (Todas as Etapas: 1, 2, 3 e 4)</option>';
    window.STAGES.filter(s => s !== window.state.activeStage).forEach(s => html += `<option value="${s}">Sim (Compartilhar com Etapa ${s})</option>`);
    window.dom.syncSelect.innerHTML = html;
};

window.toggleSyncArea = function () {
    if (window.dom.syncExpandable) window.dom.syncExpandable.classList.toggle('hidden');
};
