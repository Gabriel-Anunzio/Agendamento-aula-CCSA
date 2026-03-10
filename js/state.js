/**
 * state.js - Application state management
 */

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

window.state = {
    activeStage: 1,
    viewMode: 'weekly', // 'weekly' or 'daily'
    currentWeekStart: getStartOfWeek(new Date()),
    activeDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    assignments: {},
    events: {},
};

window.editingSlot = null;
window.pendingDeleteIdx = null;
window.pendingDeleteDate = null;
window.pendingDeleteType = 'assignment';
window.requireAdminForDelete = false;
