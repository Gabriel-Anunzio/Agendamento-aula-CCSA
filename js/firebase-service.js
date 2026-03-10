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
            // Refresh Grid Manager if open
            const gmModal = document.getElementById('grid-manager-modal');
            if (gmModal && !gmModal.classList.contains('hidden') && window.gmActiveAxis === 'common') {
                window.renderGMSubjects();
            }
        }
    }, (error) => {
        console.error("Firebase Sync Error (Common):", error);
    });
};

window.saveAssignments = function () {
    if (sessionStorage.getItem('mack_access') !== 'granted') return;
    window.syncLocalStorage(); // Immediate local save
    window.db.ref('assignments').set(window.state.assignments);
};

window.saveEvents = function () {
    if (sessionStorage.getItem('mack_access') !== 'granted') return;
    console.log("Tentando salvar eventos...", window.state.events);
    window.db.ref('events').set(window.state.events)
        .then(() => console.log("Eventos salvos com sucesso!"))
        .catch((err) => {
            console.error("FALHA AO SALVAR EVENTOS:", err);
            alert("Erro ao salvar evento: " + err.message);
        });
};

window.syncLocalStorage = function () {
    localStorage.setItem('agenda_assignments', JSON.stringify(window.state.assignments));
    localStorage.setItem('agenda_events', JSON.stringify(window.state.events));
};

window.restoreFromPersistence = function () {
    try {
        const cachedAssignments = localStorage.getItem('agenda_assignments');
        const cachedEvents = localStorage.getItem('agenda_events');
        if (cachedAssignments) window.state.assignments = JSON.parse(cachedAssignments);
        if (cachedEvents) window.state.events = JSON.parse(cachedEvents);
    } catch (e) {
        console.warn("Persistence Restore Error:", e);
    }
};
