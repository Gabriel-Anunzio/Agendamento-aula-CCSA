/**
 * dom-utils.js - DOM element selections and basic helpers
 */

window.dom = {
    weekGrid: document.getElementById('week-grid'),
    currentMonthYear: document.getElementById('current-month-year'),
    editModal: document.getElementById('edit-modal'),
    form: document.getElementById('assignment-form'),
    existingItemsContainer: document.getElementById('existing-items'),
    courseSelect: document.getElementById('course-select'),
    subjectSelect: document.getElementById('subject-select'),
    subjectInput: document.getElementById('subject-input'),
    subjectIcon: document.getElementById('subject-dropdown-icon'),
    teacherInput: document.getElementById('teacher-name'),
    errorMsg: document.getElementById('error-msg'),
    monthSelect: document.getElementById('month-select'),
    yearSelect: document.getElementById('year-select'),

    // Admin Elements
    adminLoginModal: document.getElementById('admin-login-modal'),
    adminSettingsModal: document.getElementById('admin-settings-modal'),
    adminPasswordInput: document.getElementById('admin-password'),
    adminPasswordError: document.getElementById('admin-password-error'),
    eventForm: document.getElementById('admin-event-form'),
    eventText: document.getElementById('event-text'),
    eventDate: document.getElementById('event-date'),

    // Sync Elements
    syncWrapper: document.getElementById('sync-ui-wrapper'),
    syncSelect: document.getElementById('sync-select'),
    syncExpandable: document.getElementById('sync-expandable'),
    adminBlockWrapper: document.getElementById('admin-block-wrapper'),
    adminIsCommon: document.getElementById('admin-is-common'),

    // Auth Modals
    globalAccessModal: document.getElementById('global-access-modal'),
    globalPasswordInput: document.getElementById('global-password-input'),
    globalPasswordError: document.getElementById('global-password-error'),

    // Deletion
    deletePasswordInput: document.getElementById('delete-password'),
    passwordError: document.getElementById('password-error'),
    passwordModal: document.getElementById('password-modal')
};

window.isDatePast = function (dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + 'T00:00:00');
    return target < today;
};
