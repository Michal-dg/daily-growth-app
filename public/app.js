'use strict';

// --- GLOBALNE STAŁE ---
const initialQuestions = {
    poranek: [ {id:"m1", text:"Za co jestem dziś wdzięczny/a?"}, {id:"m2", text:"Jaki jest mój najważniejszy cel na dzisiaj?"}, {id:"m3", text:"Jaką pozytywną afirmację wybieram na dziś?"} ],
    wieczor: [ {id:"e1", text:"Trzy dobre rzeczy, które się dzisiaj wydarzyły, to…"}, {id:"e2", text:"Czego nowego się dzisiaj nauczyłem/am?"}, {id:"e3",text:"Za co jestem sobie dzisiaj wdzięczny/a?"} ]
};
const initialHabits = ["Medytacja", "Ćwiczenia fizyczne", "Czytanie książki", "Nauka czegoś nowego"];
const initialSentimentQuestions = [
    { id: 'health', question: '💪 Jak oceniasz swoje samopoczucie fizyczne?' }, 
    { id: 'mood', question: '😊 Jak oceniam swój nastrój?' }, 
    { id: 'productivity', question: '🚀 Jak oceniam swoją produktywność?' }
];
const quotes = [ 
    "Nawet najdalszą podróż zaczyna się od pierwszego kroku. 🌱", "Bądź zmianą, którą pragniesz ujrzeć w świecie. 🚀", "Jedynym sposobem na wielką pracę jest kochanie tego, co robisz. ✨"
];

let currentQuestions, currentHabits, currentSentimentQuestions, currentDate, isAppInitialized = false;

// --- KLASY ---
class AppStorage {
    static get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
    static set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) { console.error("Błąd zapisu do localStorage", e); } }
    static userKey(prefix) { return `dg_${prefix}_${sessionStorage.getItem('dg_user')}`; }
    static getDayEntry(date) { return this.get(this.userKey(`entry_${date}`)) || {}; }
    static saveDayEntry(date, entry) { this.set(this.userKey(`entry_${date}`), entry); showNotification("Auto-zapisano ✅"); }
    static getSetting(key) { const s = this.get(this.userKey('settings')); return s ? s[key] : null; }
    static setSetting(key, value) { const s = this.get(this.userKey('settings')) || {}; s[key] = value; this.set(this.userKey('settings'), s); }
    static getQuestions() { return this.get(this.userKey('questions')) || initialQuestions; }
    static saveQuestions(q) { this.set(this.userKey('questions'), q); }
    static getHabits() { return this.get(this.userKey('habits')) || initialHabits; }
    static saveHabits(h) { this.set(this.userKey('habits'), h); }
    static getSentimentQuestions() { return this.get(this.userKey('sentiments')) || initialSentimentQuestions; }
    static saveSentimentQuestions(sq) { this.set(this.userKey('sentiments'), sq); }
}

class UI {
    static buildSection(sectionId, title, emoji, containerSelector) {
        const panel = document.querySelector(containerSelector);
        if (!panel) return;
        const questions = currentQuestions[sectionId] || [];
        let html = `<div class="content-card"><h2 class="content-header">${emoji} ${title}</h2><div>`;
        questions.forEach(q => {
            html += `<div class="question-group"><label for="q-${q.id}">${q.text}</label><textarea id="q-${q.id}" data-id="${q.id}"></textarea></div>`;
        });
        if (sectionId === 'wieczor') {
            html += currentSentimentQuestions.map(sq => `<div class="question-group"><label>${sq.question}</label><div class="sentiment-buttons" data-id="${sq.id}">${[1,2,3,4,5].map(v => `<span class="sentiment-star" data-value="${v}">☆</span>`).join('')}</div></div>`).join('');
            if (currentHabits.length > 0) html += `<div class="question-group"><label>Nawyki</label>${currentHabits.map(h => `<div class="habit-item"><label><input type="checkbox" data-habit-name="${h}"> ${h}</label></div>`).join('')}</div>`;
        }
        html += `</div></div>`;
        panel.innerHTML = html;

        panel.querySelectorAll('textarea').forEach(el => el.addEventListener('input', e => UI.saveInput(sectionId, e.target)));
        panel.querySelectorAll('input[type="checkbox"]').forEach(el => el.addEventListener('change', e => UI.saveHabitStatus(e.target)));
        panel.querySelectorAll('.sentiment-star').forEach(star => star.addEventListener('click', e => UI.setSentiment(e.currentTarget)));
    }

    static loadSectionData(sectionId, date) {
        const entry = AppStorage.getDayEntry(date);
        const data = entry[sectionId] || {};
        document.querySelectorAll(`#${sectionId}-panel textarea`).forEach(el => el.value = data[el.dataset.id] || '');
        if (sectionId === 'wieczor') {
            const eveningData = entry.evening || {};
            currentSentimentQuestions.forEach(sq => UI.updateStars(document.querySelector(`#wieczor-panel .sentiment-buttons[data-id="${sq.id}"]`), eveningData[sq.id + 'Sent']));
            const habits = eveningData.habits || {};
            currentHabits.forEach(h => { const cb = document.querySelector(`#wieczor-panel [data-habit-name="${h}"]`); if(cb) cb.checked = habits[h] || false; });
        }
    }
    static saveInput(sectionId, target) {
        const id = target.dataset.id;
        const entry = AppStorage.getDayEntry(currentDate);
        if (!entry[sectionId]) entry[sectionId] = {};
        entry[sectionId][id] = target.value;
        AppStorage.saveDayEntry(currentDate, entry);
    }
    static saveHabitStatus(checkbox) {
        const name = checkbox.dataset.habitName;
        const entry = AppStorage.getDayEntry(currentDate);
        if (!entry.wieczor) entry.wieczor = {};
        if (!entry.wieczor.habits) entry.wieczor.habits = {};
        entry.wieczor.habits[name] = checkbox.checked;
        AppStorage.saveDayEntry(currentDate, entry);
    }
    static setSentiment(starEl) {
        const value = starEl.dataset.value;
        const container = starEl.parentElement;
        const catId = container.dataset.id;
        UI.updateStars(container, value);
        const entry = AppStorage.getDayEntry(currentDate);
        if (!entry.wieczor) entry.wieczor = {};
        entry.wieczor[catId + 'Sent'] = value;
        AppStorage.saveDayEntry(currentDate, entry);
    }
    static updateStars(container, value) {
        if (!container) return;
        const stars = container.querySelectorAll('.sentiment-star');
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) {
            stars.forEach(star => star.classList.remove('active'));
            return;
        };
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value, 10);
            star.classList.toggle('active', numericValue >= starValue);
        });
    }
}

class Stats {
    static chartInstances = {};
    static destroyCharts() { Object.values(this.chartInstances).forEach(chart => chart.destroy()); this.chartInstances = {}; }
    static render(containerSelector) {
        const panel = document.querySelector(containerSelector);
        if (!panel) return;
        panel.innerHTML = `<div class="content-card"><div class="stats-grid"><div class="chart-container"><canvas id="sentimentChart"></canvas></div><div class="chart-container"><canvas id="habitsChart"></canvas></div></div><div id="stats-placeholder" class="hidden">Brak wystarczających danych do analizy. Wprowadź dane z co najmniej dwóch dni.</div></div>`;
        this.renderCharts();
    }
    static gatherData(days = 30) {
        const data = { labels: [], sentiments: { health: [], mood: [], productivity: [] }, habits: {} };
        const today = new Date();
        currentHabits.forEach(h => data.habits[h] = 0);
        let entriesFound = 0;
        for (let i = days - 1; i >= 0; i--) {
            const date = dateFns.subDays(today, i);
            const dateKey = dateFns.format(date, 'yyyy-MM-dd');
            data.labels.push(dateKey);
            const entry = AppStorage.getDayEntry(dateKey);
            if (entry && entry.wieczor) {
                entriesFound++;
                currentSentimentQuestions.forEach(sq => { data.sentiments[sq.id].push(entry.wieczor[sq.id + 'Sent'] || null); });
                currentHabits.forEach(habit => { if (entry.wieczor.habits && entry.wieczor.habits[habit]) data.habits[habit]++; });
            } else {
                currentSentimentQuestions.forEach(sq => data.sentiments[sq.id].push(null));
            }
        }
        return entriesFound > 1 ? data : null;
    }
    static renderCharts() {
        this.destroyCharts();
        const data = this.gatherData();
        const placeholder = document.getElementById('stats-placeholder');
        if (!data) { placeholder?.classList.remove('hidden'); return; }
        placeholder?.classList.add('hidden');
        const style = getComputedStyle(document.body);
        Chart.defaults.font.family = "inherit";
        Chart.defaults.color = style.getPropertyValue('--text-muted');
        const chartOptions = (scales) => ({
            responsive: true, maintainAspectRatio: false, scales, plugins: { legend: { position: 'bottom' } },
            interaction: { intersect: false, mode: 'index' }, layout: { padding: 10 }
        });
        this.chartInstances.sentiment = new Chart(document.getElementById('sentimentChart'), {
            type: 'line', data: { labels: data.labels, datasets: currentSentimentQuestions.map((sq, i) => ({
                label: sq.question.split(' ').slice(1).join(' '), data: data.sentiments[sq.id],
                borderColor: [style.getPropertyValue('--primary'), style.getPropertyValue('--accent'), '#00bcd4'][i],
                tension: 0.4, spanGaps: true, pointRadius: 3, pointHoverRadius: 6, borderWidth: 2 }))
            }, options: chartOptions({ x: { type: 'time', time: { unit: 'day' }, grid: { display: false } }, y: { beginAtZero: true, max: 5 } }),
        });
        this.chartInstances.habits = new Chart(document.getElementById('habitsChart'), {
            type: 'bar', data: { labels: Object.keys(data.habits), datasets: [{ label: 'Dni zrealizowane (ostatnie 30)', data: Object.values(data.habits), backgroundColor: [style.getPropertyValue('--primary'), style.getPropertyValue('--accent'), '#00bcd4'], borderRadius: 4 }] },
            options: chartOptions({ y: { max: 30 } })
        });
    }
}

class Settings {
    static init() {
        document.getElementById('save-settings-btn').addEventListener('click', () => this.saveAndClose());
        document.getElementById('settings-btn').addEventListener('click', () => this.open());
        const settingsModal = document.getElementById('settingsModal');
        settingsModal.addEventListener('click', e => {
            const editBtn = e.target.closest('.settings-edit-btn');
            if (editBtn) this.toggleSection(editBtn);
            const closeBtn = e.target.closest('.close-modal-btn');
            if(closeBtn) closeModal(closeBtn.dataset.modalId);
        });
        settingsModal.addEventListener('input', e => {
            const { section, index, id } = e.target.dataset;
            if (section === 'summary') this.tempSentimentQuestions[index].question = e.target.value;
            else if (section === 'habits') this.tempHabits[index] = e.target.value;
            else this.tempQuestions[section].find(q => q.id === id).text = e.target.value;
        });
    }
    static toggleSection(button) {
        const sectionEl = button.closest('.settings-section');
        const sectionId = button.dataset.section;
        const isOpen = sectionEl.classList.contains('is-open');
        document.querySelectorAll('#settingsModal .settings-section.is-open').forEach(openSection => {
            if (openSection !== sectionEl) { openSection.classList.remove('is-open'); openSection.querySelector('.settings-edit-btn').textContent = 'Edytuj'; }
        });
        sectionEl.classList.toggle('is-open');
        if (!isOpen) { this.render(sectionId); button.textContent = 'Zwiń'; } else { button.textContent = 'Edytuj'; }
    }
    static open() {
        this.tempQuestions = JSON.parse(JSON.stringify(AppStorage.getQuestions()));
        this.tempHabits = [...AppStorage.getHabits()];
        this.tempSentimentQuestions = JSON.parse(JSON.stringify(AppStorage.getSentimentQuestions()));
        document.querySelectorAll('#settingsModal .settings-section').forEach(section => {
            section.classList.remove('is-open');
            section.querySelector('.settings-edit-btn').textContent = 'Edytuj';
            section.querySelector('.settings-section-content').innerHTML = '';
        });
        openModal('settingsModal');
    }
    static render(sectionId) {
        const container = document.getElementById(`s-${sectionId}-panel`);
        if (!container) return;
        let html = '';
        const renderItem = (value, section, index, placeholder, id = '') => `<div class="settings-item"><input type="text" data-section="${section}" data-index="${index}" ${id ? `data-id="${id}"` : ''} value="${value.replace(/"/g, '&quot;')}" placeholder="${placeholder}"><button class="btn action-btn" data-action="deleteItem" data-section="${section}" data-index="${index}">Usuń</button></div>`;
        const renderList = (title, items, section, placeholder, textKey) => {
            let listHtml = `<h4 class="settings-header-4">${title}</h4><div class="settings-list">${items.map((item, i) => renderItem(textKey ? item[textKey] : item, section, i, placeholder, textKey ? item.id : '')).join('')}</div>`;
            listHtml += `<div class="settings-action-buttons"><button class="btn btn-secondary action-btn" data-action="addItem" data-section="${section}">+ Dodaj</button></div>`;
            return listHtml;
        };
        switch (sectionId) {
            case 'appearance':
                const theme = AppStorage.getSetting('theme') || 'las';
                const font = AppStorage.getSetting('font') || 'sans-serif';
                html = `
                    <h4 class="settings-header-4">Wybierz motyw</h4>
                    <div class="settings-group theme-selector">${['las', 'ocean', 'fokus'].map(t => `<div class="theme-option ${theme === t ? 'is-active' : ''}" data-theme="${t}"><span>${{'las':'🌱','ocean':'🌊','fokus':'⚡'}[t]}</span> ${t.charAt(0).toUpperCase() + t.slice(1)}</div>`).join('')}</div>
                    <h4 class="settings-header-4" style="margin-top:20px;">Wybierz czcionkę</h4>
                    <div class="settings-group font-selector">${['sans-serif', 'serif', 'rounded'].map(f => `<button data-font="${f}" class="btn ${font === f ? 'btn-primary' : 'btn-tertiary'}">${{'sans-serif':'Nowoczesna','serif':'Klasyczna','rounded':'Swobodna'}[f]}</button>`).join('')}</div>
                    <h4 class="settings-header-4" style="margin-top:20px;">Tryb Ciemny</h4>
                    <button id="dark-mode-btn" class="btn btn-tertiary">${document.documentElement.classList.contains('dark-mode') ? 'Wyłącz' : 'Włącz'} tryb ciemny</button>
                `;
                break;
            case 'poranek': case 'wieczor': html = renderList(`Pytania - ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`, this.tempQuestions[sectionId], sectionId, 'Treść pytania', 'text'); break;
            case 'summary': html = renderList('Pytania Podsumowujące', this.tempSentimentQuestions, 'summary', 'Treść pytania', 'question'); break;
            case 'habits': html = renderList('Twoje Nawyki', this.tempHabits, 'habits', 'Nazwa nawyku'); break;
        }
        container.innerHTML = html;
        container.querySelectorAll('.action-btn').forEach(btn => btn.addEventListener('click', e => { const { action, section, index } = e.currentTarget.dataset; if (this[action]) this[action](section, index); }));
        container.querySelectorAll('.theme-option').forEach(opt => opt.addEventListener('click', e => this.handleThemeChange(e.currentTarget)));
        container.querySelectorAll('.font-selector button').forEach(btn => btn.addEventListener('click', e => this.handleFontChange(e.currentTarget)));
        const darkModeBtn = container.querySelector('#dark-mode-btn');
        if (darkModeBtn) darkModeBtn.addEventListener('click', toggleDarkMode);
    }
    static handleThemeChange(option) { applyTheme(option.dataset.theme); this.render('appearance'); }
    static handleFontChange(btn) { applyFont(btn.dataset.font); this.render('appearance'); }
    static addItem(section) {
        if(section === 'habits') this.tempHabits.push('');
        else if (section === 'summary') this.tempSentimentQuestions.push({id: `s${Date.now()}`, question: ''});
        else this.tempQuestions[section].push({id: `${section.charAt(0)}${Date.now()}`, text: ''});
        this.render(section);
    }
    static deleteItem(section, index) {
        if(section === 'habits') this.tempHabits.splice(index, 1);
        else if (section === 'summary') this.tempSentimentQuestions.splice(index, 1);
        else this.tempQuestions[section].splice(index, 1);
        this.render(section);
    }
    static saveAndClose() {
        Object.keys(this.tempQuestions).forEach(s => this.tempQuestions[s] = this.tempQuestions[s].filter(q => q.text.trim()));
        this.tempHabits = this.tempHabits.filter(h => h.trim());
        this.tempSentimentQuestions = this.tempSentimentQuestions.filter(q => q.question.trim());
        AppStorage.saveQuestions(this.tempQuestions);
        AppStorage.saveHabits(this.tempHabits);
        AppStorage.saveSentimentQuestions(this.tempSentimentQuestions);
        loadAppData();
        rebuildAllSections();
        loadDate(currentDate);
        closeModal('settingsModal');
        showNotification("Ustawienia zapisane! ✅");
    }
}

// --- LOGIKA GŁÓWNA I OBSŁUGA ZDARZEŃ ---
function initializeApp() {
    if (isAppInitialized) return;
    isAppInitialized = true;
    document.querySelector('#main-app').classList.remove('hidden');
    applyTheme(AppStorage.getSetting('theme'));
    applyFont(AppStorage.getSetting('font'));
    document.documentElement.classList.toggle('dark-mode', AppStorage.getSetting('darkMode'));
    loadAppData();
    currentDate = dateFns.format(new Date(), 'yyyy-MM-dd');
    document.getElementById('dailyQuote').textContent = quotes[Math.floor(Math.random() * quotes.length)];
    bindAppEventListeners();
    rebuildAllSections();
    loadDate(currentDate);
}

function loadAppData() {
    currentQuestions = AppStorage.getQuestions();
    currentHabits = AppStorage.getHabits();
    currentSentimentQuestions = AppStorage.getSentimentQuestions();
}

function bindAppEventListeners() {
    document.getElementById('prev-day-btn').addEventListener('click', () => changeDate(-1));
    document.getElementById('next-day-btn').addEventListener('click', () => changeDate(1));
    document.getElementById('currentDate').addEventListener('input', e => loadDate(e.target.value));
    document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', e => {
        document.querySelectorAll('.tab, .section').forEach(el => el.classList.remove('active'));
        const sectionId = e.currentTarget.dataset.section;
        e.currentTarget.classList.add('active');
        document.getElementById(`${sectionId}-panel`).classList.add('active');
        if (sectionId === 'stats') Stats.render('#stats-panel');
    }));
}

function rebuildAllSections() { ['poranek', 'wieczor'].forEach(s => UI.buildSection(s, s.charAt(0).toUpperCase()+s.slice(1), {'poranek':'🌅','wieczor':'🌙'}[s], `#${s}-panel`)); }
function loadDate(newDate) { currentDate = newDate; document.getElementById('currentDate').value = currentDate; ['poranek', 'wieczor'].forEach(s => UI.loadSectionData(s, currentDate)); }
function changeDate(d) { const dt = dateFns.addDays(new Date(currentDate), d); loadDate(dateFns.format(dt, 'yyyy-MM-dd')); }
function applyTheme(themeName = 'las') { document.documentElement.dataset.theme = themeName; AppStorage.setSetting('theme', themeName); const meta = document.querySelector('meta[name="theme-color"]'); if(meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--card').trim(); }
function applyFont(fontName = 'sans-serif') {
    document.body.classList.remove('font-serif', 'font-rounded');
    if (fontName === 'serif') document.body.classList.add('font-serif');
    else if (fontName === 'rounded') document.body.classList.add('font-rounded');
    AppStorage.setSetting('font', fontName);
}
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    AppStorage.setSetting('darkMode', isDark);
    applyTheme(AppStorage.getSetting('theme'));
    const btn = document.getElementById('dark-mode-btn');
    if (btn) btn.textContent = `${isDark ? 'Wyłącz' : 'Włącz'} tryb ciemny`;
}
function showNotification(msg, withReloadButton = false) {
    const el = document.getElementById('notification');
    if (el) {
        el.innerHTML = msg;
        if (withReloadButton) {
            const reloadBtn = document.createElement('button');
            reloadBtn.textContent = 'Odśwież';
            reloadBtn.className = 'btn btn-primary';
            reloadBtn.style.marginLeft = '15px';
            reloadBtn.onclick = () => window.location.reload();
            el.appendChild(reloadBtn);
        }
        el.classList.add('active');
        if (!withReloadButton) {
            setTimeout(() => el.classList.remove('active'), 2800);
        }
    }
}
function openModal(id) { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('dg_user')) {
        sessionStorage.setItem('dg_user', 'default_user');
    }
    initializeApp();
    Settings.init();
});