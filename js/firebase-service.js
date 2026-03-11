/**
 * firebase-service.js - Firebase initialization and data synchronization
 */

// Initialize Firebase
try {
    firebase.initializeApp(window.firebaseConfig);
    console.log("Firebase inicializado com sucesso.");
} catch (err) {
    console.error("Erro crítico ao inicializar Firebase:", err);
}

window.db = firebase.database();

window.setupFirebaseListeners = function () {
    // Listen for Assignments
    db.ref('assignments').on('value', (snapshot) => {
        window.state.assignments = snapshot.val() || {};
        window.syncLocalStorage(); // Save backup
        window.renderCalendar();
    }, (error) => {
        console.error("Firebase Sync Error (Assignments):", error);
    });

    // Listen for Events
    db.ref('events').on('value', (snapshot) => {
        window.state.events = snapshot.val() || {};
        window.syncLocalStorage(); // Save backup
        window.renderCalendar();
    }, (error) => {
        console.error("Firebase Sync Error (Events):", error);
    });

    // Listen for Academic Grid
    db.ref('academic_grid').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            window.ACADEMIC_GRID = data;
            // Refresh Grid Manager UI if open
            const gmModal = document.getElementById('grid-manager-modal');
            if (gmModal && !gmModal.classList.contains('hidden')) {
                window.renderGMCourses();
                if (window.gmSelectedCourse) window.renderGMSubjects();
            }
            // Refresh Edit Modal if open to update course options
            if (window.editingSlot) {
                const { dateStr, hourIdx } = window.editingSlot;
                window.openEditModal(dateStr, hourIdx);
            }
        }
    }, (error) => {
        console.error("Firebase Sync Error (Grid):", error);
    });

    // Listen for Common Subjects
    db.ref('common_subjects').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            window.COMMON_SUBJECTS = data;
            const gmModal = document.getElementById('grid-manager-modal');
            if (gmModal && !gmModal.classList.contains('hidden') && window.gmActiveAxis === 'common') {
                window.renderGMSubjects();
            }
        }
    }, (error) => {
        console.error("Firebase Sync Error (Common):", error);
    });

    // Listen for Blocks
    db.ref('blocks').on('value', (snapshot) => {
        window.state.blocks = snapshot.val() || {};
        window.syncLocalStorage();
        window.renderCalendar();
    });
};

window.saveAssignments = function () {
    if (sessionStorage.getItem('mack_access') !== 'granted') return;
    window.syncLocalStorage();
    window.db.ref('assignments').set(window.state.assignments);
};

window.saveEvents = function () {
    if (sessionStorage.getItem('mack_access') !== 'granted') return;
    window.db.ref('events').set(window.state.events);
};

window.saveBlocks = function () {
    if (sessionStorage.getItem('mack_access') !== 'granted') return;
    window.syncLocalStorage();
    window.db.ref('blocks').set(window.state.blocks);
};

window.syncLocalStorage = function () {
    localStorage.setItem('agenda_assignments', JSON.stringify(window.state.assignments));
    localStorage.setItem('agenda_events', JSON.stringify(window.state.events));
    localStorage.setItem('agenda_blocks', JSON.stringify(window.state.blocks));
};

window.restoreFromPersistence = function () {
    try {
        const cachedAssignments = localStorage.getItem('agenda_assignments');
        const cachedEvents = localStorage.getItem('agenda_events');
        const cachedBlocks = localStorage.getItem('agenda_blocks');
        if (cachedAssignments) window.state.assignments = JSON.parse(cachedAssignments);
        if (cachedEvents) window.state.events = JSON.parse(cachedEvents);
        if (cachedBlocks) window.state.blocks = JSON.parse(cachedBlocks);
    } catch (e) {
        console.warn("Persistence Restore Error:", e);
    }
};
