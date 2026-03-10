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
