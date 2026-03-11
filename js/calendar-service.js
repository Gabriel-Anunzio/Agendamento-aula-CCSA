/**
 * calendar-service.js - Core calendar rendering and navigation
 */

window.renderHeader = function () {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const ids = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const start = new Date(window.state.currentWeekStart);
    const midWeek = new Date(start);
    midWeek.setDate(midWeek.getDate() + 3);

    const targetMonth = parseInt(window.dom.monthSelect.value);
    const targetYear = parseInt(window.dom.yearSelect.value);

    let preferredMonth = midWeek.getMonth();
    let preferredYear = midWeek.getFullYear();

    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        if (d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
            preferredMonth = targetMonth;
            preferredYear = targetYear;
            break;
        }
    }

    if (window.dom.monthSelect) window.dom.monthSelect.value = preferredMonth;
    if (window.dom.yearSelect) window.dom.yearSelect.value = Math.max(2026, preferredYear);

    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const dayContainer = document.getElementById(`header-${ids[i]}`);
        if (dayContainer) {
            const isToday = new Date().toDateString() === d.toDateString();
            const isActive = window.state.activeDate === dateStr;

            dayContainer.innerHTML = `
                <div class="text-xs ${isToday ? 'text-red-600' : 'text-slate-500'} uppercase font-bold">${days[i]}</div>
                <div class="text-xl font-bold ${isActive ? 'bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mt-1' : 'text-slate-800'}">${d.getDate()}</div>`;

            // CSS Toggle for visibility
            if (window.state.viewMode === 'daily') {
                if (isActive) dayContainer.classList.remove('hidden');
                else dayContainer.classList.add('hidden');
            } else {
                dayContainer.classList.remove('hidden');
            }
        }
    }

    // Grid adjustment for Daily mode
    if (window.dom.weekGrid) {
        if (window.state.viewMode === 'daily') {
            window.dom.weekGrid.style.gridTemplateColumns = '65px 1fr';
            window.dom.weekGrid.classList.add('daily-view');
            document.getElementById('week-header').style.gridTemplateColumns = '65px 1fr';
        } else {
            window.dom.weekGrid.style.gridTemplateColumns = '';
            window.dom.weekGrid.classList.remove('daily-view');
            document.getElementById('week-header').style.gridTemplateColumns = '';
        }
    }
};

window.renderCalendar = function () {
    window.renderHeader();
    if (!window.dom.weekGrid) return;
    window.dom.weekGrid.innerHTML = '';

    const start = new Date(window.state.currentWeekStart);

    // Slots
    HOURS.forEach((hLabel, hIdx) => {
        const timeCell = document.createElement('div');
        timeCell.className = 'border-b border-r border-slate-200 dark:border-slate-800 p-2 text-[10px] sm:text-xs text-slate-400 text-right sticky left-0 bg-white dark:bg-slate-900 z-10';
        timeCell.innerHTML = `<span class="-mt-2 block">${hLabel.split(' - ')[0]}</span>`;
        window.dom.weekGrid.appendChild(timeCell);

        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const cellIsPast = window.isDatePast(dateStr);
            const blockLabel = window.state.blocks[dateStr];

            // Skip other columns in daily mode
            const isActive = window.state.activeDate === dateStr;
            if (window.state.viewMode === 'daily' && !isActive) continue;

            const cell = document.createElement('div');
            cell.className = 'border-b border-r border-slate-200 dark:border-slate-800 min-h-[60px] relative transition p-1 flex flex-col gap-1 ' +
                (cellIsPast ? 'bg-slate-100/60 dark:bg-slate-800/40 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer');

            if (blockLabel) {
                cell.className += ' bg-red-100/30 dark:bg-red-900/10';
                const blockIndicator = document.createElement('div');
                blockIndicator.className = 'absolute inset-0 flex items-center justify-center pointer-events-none opacity-20';
                blockIndicator.innerHTML = `<span class="text-[10px] font-black text-red-600 uppercase rotate-12 border-2 border-red-600 px-1 rounded">${blockLabel}</span>`;
                cell.appendChild(blockIndicator);
            }

            if (cellIsPast) {
                const lockIcon = document.createElement('div');
                lockIcon.className = 'absolute top-0.5 right-0.5 text-slate-300 dark:text-slate-600';
                lockIcon.innerHTML = '<i data-lucide="lock" class="w-2.5 h-2.5"></i>';
                cell.appendChild(lockIcon);
            }

            cell.onclick = (e) => {
                if (!e.target.closest('.delete-btn')) window.openEditModal(dateStr, hIdx);
            };

            const key = `${window.state.activeStage}-${dateStr}-${hIdx}`;
            const items = window.state.assignments[key] || [];

            if (items.length > 0) {
                const common = items.find(it => it.type === 'common');
                if (common) {
                    cell.appendChild(window.createPill(common, true, dateStr, hIdx));
                } else {
                    const container = document.createElement('div');
                    container.className = 'flex flex-row flex-wrap gap-1';
                    items.forEach((it, idx) => container.appendChild(window.createPill(it, false, dateStr, hIdx, idx)));
                    cell.appendChild(container);
                }
            }
            window.dom.weekGrid.appendChild(cell);
        }
    });

    // Events Row (Special visual for blocked days in events row too)
    const eventTimeCell = document.createElement('div');
    eventTimeCell.className = 'border-b border-r border-slate-200 p-2 text-[10px] sm:text-xs text-red-600 font-bold text-right sticky left-0 bg-slate-50 z-10';
    eventTimeCell.textContent = 'EVENTOS';
    window.dom.weekGrid.appendChild(eventTimeCell);

    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const blockLabel = window.state.blocks[dateStr];

        if (window.state.viewMode === 'daily' && window.state.activeDate !== dateStr) continue;

        const cell = document.createElement('div');
        cell.className = 'border-b border-r border-slate-200 min-h-[40px] bg-slate-50/50 p-1 flex flex-col gap-1';

        if (blockLabel) {
            const blockPill = document.createElement('div');
            blockPill.className = 'bg-red-600 text-white text-[9px] px-2 py-1 rounded-full font-black uppercase text-center shadow-sm';
            blockPill.textContent = `BLOQUEIO: ${blockLabel}`;
            cell.appendChild(blockPill);
        }

        (window.state.events[dateStr] || []).forEach((evtText, evtIdx) => {
            const pill = document.createElement('div');
            pill.className = 'bg-slate-800 text-white text-[10px] p-1.5 rounded shadow-sm flex items-center gap-1 cursor-pointer hover:bg-black transition-colors';
            pill.innerHTML = `<i data-lucide="star" class="w-3 h-3 text-yellow-400"></i> ${evtText}`;
            pill.onclick = (e) => {
                e.stopPropagation();
                window.openDeleteEventModal(dateStr, evtIdx);
            };
            cell.appendChild(pill);
        });
        window.dom.weekGrid.appendChild(cell);
    }
    if (window.lucide) window.lucide.createIcons();
};

window.renderStageButtons = function () {
    window.STAGES.forEach(s => {
        const btn = document.getElementById(`stage-btn-${s}`);
        if (btn) {
            btn.className = (window.state.activeStage === s)
                ? "btn-premium flex-1 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg whitespace-nowrap transition-all duration-300 bg-white text-red-600 shadow-xl scale-105 z-10"
                : "btn-premium flex-1 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg whitespace-nowrap transition-all duration-300 text-red-100 hover:bg-white/10";
        }
    });
};

window.switchStage = function (id) {
    window.state.activeStage = id;
    window.renderStageButtons();
    window.renderCalendar();
};


window.goToToday = function () {
    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }
    const today = new Date();
    window.state.currentWeekStart = getStartOfWeek(today);
    window.state.activeDate = today.toISOString().split('T')[0];
    window.renderCalendar();
};
