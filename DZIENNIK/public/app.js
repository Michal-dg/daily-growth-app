'use strict';

// Globalne zmienne
let currentDate = null;
let currentQuestions, currentHabits, currentSentimentQuestions;

// Główny obiekt aplikacji
const App = {
  isAppInitialized: false,

  init() {
    document.addEventListener('DOMContentLoaded', this.launch.bind(this));
  },

  launch() {
    if (typeof dateFns === 'undefined' || typeof Chart === 'undefined') {
      document.body.innerHTML = '<div style="padding:2rem; text-align:center;">Błąd ładowania bibliotek. Sprawdź połączenie z internetem i odśwież stronę.</div>';
      return;
    }
    if (this.isAppInitialized) return;
    this.isAppInitialized = true;

    if (!sessionStorage.getItem('dg_user')) {
      sessionStorage.setItem('dg_user', 'default_user');
    }
    
    this.loadAppData(); // Wczytanie danych na starcie
    UI.applyTheme(AppStorage.getSetting('theme') || document.documentElement.getAttribute('data-theme') || 'jasny');
    
    document.getElementById('dailyQuote').textContent = AppData.quotes[Math.floor(Math.random() * AppData.quotes.length)];

    this.bindEvents();

    UI.renderSection('poranek');
    UI.renderSection('wieczor');
    
    currentDate = dateFns.format(new Date(), 'yyyy-MM-dd');
    this.loadDate(currentDate);
  },
  
  loadAppData() {
    currentQuestions = AppStorage.getQuestions();
    currentHabits = AppStorage.getHabits();
    currentSentimentQuestions = AppStorage.getSentimentQuestions();
  },

  bindEvents() {
    document.getElementById('settings-btn')?.addEventListener('click', () => UI.openSettingsModal());
    // ZAKTUALIZOWANY EVENT LISTENER DLA WYKRESÓW
    document.getElementById('show-chart-btn')?.addEventListener('click', () => {
      Stats.render('#analiza-panel-content'); // Renderuj wykresy
      openModal('chartModal'); // Otwórz modal
    });

    // data
    document.getElementById('prev-day-btn')?.addEventListener('click', () => this.changeDate(-1));
    document.getElementById('next-day-btn')?.addEventListener('click', () => this.changeDate(1));
    document.getElementById('currentDate')?.addEventListener('input', (e) => this.loadDate(e.target.value));

    // modale zamknięcia
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') || e.target.closest('.close-modal-btn')) {
          closeModal(modal.id);
        }
      });
    });
    
    // Zakładki
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', e => {
            document.querySelectorAll('.tab, .section').forEach(el => el.classList.remove('active'));
            const sectionId = e.currentTarget.dataset.section;
            e.currentTarget.classList.add('active');
            document.getElementById(`${sectionId}-panel`).classList.add('active');
        });
    });

    // Sync motywu między kartami
    window.addEventListener('storage', (event) => {
      if (event.key === AppStorage.userKey('settings')) {
        const theme = AppStorage.getSetting('theme') || 'jasny';
        UI.applyTheme(theme);
      }
    });
  },

  loadDate(newDate) {
    currentDate = newDate;
    const input = document.getElementById('currentDate');
    if (input) input.value = currentDate;
    UI.loadDailyData(currentDate);
  },

  changeDate(offset) {
    const newDate = dateFns.addDays(new Date(currentDate), offset);
    this.loadDate(dateFns.format(newDate, 'yyyy-MM-dd'));
  }
};

// Storage
class AppStorage {
  static get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; } }
  static set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) { console.error('Błąd zapisu do localStorage', e);} }
  static userKey(prefix) { return `dziennik_${prefix}_${sessionStorage.getItem('dg_user')}`; }
  
  static getDayEntry(date) { return this.get(this.userKey(`entry_${date}`)) || {}; }
  static saveDayEntry(date, entry) { this.set(this.userKey(`entry_${date}`), entry); showNotification('Auto-zapisano ✅'); }

  static getSetting(key) {
    const s = this.get(this.userKey('settings'));
    return s ? s[key] : null;
  }
  static setSetting(key, value) {
    const s = this.get(this.userKey('settings')) || {};
    s[key] = value;
    this.set(this.userKey('settings'), s);
  }
  
  static getQuestions() { return this.get(this.userKey('questions')) || AppData.initialQuestions; }
  static getHabits() { return this.get(this.userKey('habits')) || AppData.initialHabits; }
  static getSentimentQuestions() { return this.get(this.userKey('sentiments')) || AppData.initialSentimentQuestions; }
}

// UI
class UI {
  static renderSection(sectionId) {
    const container = document.getElementById(`${sectionId}-panel`);
    if (!container) return;
    
    const questions = currentQuestions[sectionId] || [];
    const title = sectionId === 'poranek' ? '🌅 Poranek' : '🌙 Wieczór';

    let html = `<div class="content-card"><h2 class="content-header">${title}</h2>`;
    questions.forEach(q => {
        html += `<div class="form-group"><label for="q-${q.id}">${q.text}</label><textarea id="q-${q.id}" data-id="${q.id}" data-section="${sectionId}"></textarea></div>`;
    });

    if (sectionId === 'wieczor') {
        html += currentSentimentQuestions.map(sq => `<div class="form-group"><label>${sq.question}</label><div class="sentiment-buttons" data-id="${sq.id}">${[1, 2, 3, 4, 5].map(v => `<span class="sentiment-star" data-value="${v}">☆</span>`).join('')}</div></div>`).join('');
        if (currentHabits.length > 0) {
            html += `<div class="form-group"><label>Nawyki</label><div class="habit-container">${currentHabits.map(h => `<div class="habit-item"><label><input type="checkbox" data-habit-name="${h}"> ${h}</label></div>`).join('')}</div></div>`;
        }
    }

    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('textarea').forEach(textarea => {
      textarea.addEventListener('input', (e) => {
        const entry = AppStorage.getDayEntry(currentDate);
        const section = e.target.dataset.section;
        const qId = e.target.dataset.id;
        if (!entry[section]) entry[section] = {};
        entry[section][qId] = e.target.value;
        AppStorage.saveDayEntry(currentDate, entry);
      });
    });

    if (sectionId === 'wieczor') {
        container.querySelectorAll('.sentiment-star').forEach(star => star.addEventListener('click', e => UI.setSentiment(e.currentTarget)));
        container.querySelectorAll('input[type="checkbox"]').forEach(el => el.addEventListener('change', e => UI.saveHabitStatus(e.target)));
    }
  }

  static loadDailyData(date) {
    const entry = AppStorage.getDayEntry(date);
    ['poranek', 'wieczor'].forEach(sectionId => {
        const sectionData = entry[sectionId] || {};
        const panel = document.getElementById(`${sectionId}-panel`);
        if (!panel) return;

        panel.querySelectorAll('textarea').forEach(el => {
            el.value = sectionData[el.dataset.id] || '';
        });

        if (sectionId === 'wieczor') {
            currentSentimentQuestions.forEach(sq => {
                const container = panel.querySelector(`.sentiment-buttons[data-id="${sq.id}"]`);
                UI.updateStars(container, sectionData[sq.id + 'Sent']);
            });
            const habits = sectionData.habits || {};
            currentHabits.forEach(h => {
                const cb = panel.querySelector(`[data-habit-name="${h}"]`);
                if (cb) cb.checked = habits[h] || false;
            });
        }
    });
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
    stars.forEach(star => {
        const starValue = parseInt(star.dataset.value, 10);
        const isActive = !isNaN(numericValue) && numericValue >= starValue;
        star.classList.toggle('active', isActive);
        star.textContent = isActive ? '★' : '☆';
    });
  }

  static openSettingsModal() {
    const container = document.getElementById('themeSelectorContainer');
    const currentTheme = AppStorage.getSetting('theme') || 'jasny';
    const themes = [
      { id: 'jasny', name: 'Jasny', icon: '☀️' },
      { id: 'ciemny', name: 'Ciemny', icon: '🌑' },
      { id: 'fokus', name: 'Fokus', icon: '⚡' },
      { id: 'las',   name: 'Las',   icon: '🌱' },
      { id: 'ocean', name: 'Ocean', icon: '🌊' },
      { id: 'blask', name: 'Blask', icon: '✨' },
    ];
    container.innerHTML = themes.map(t =>
      `<div class="theme-option ${currentTheme === t.id ? 'is-active' : ''}" data-theme-id="${t.id}">
        <span>${t.icon}</span>${t.name}
      </div>`).join('');

    container.querySelectorAll('.theme-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const themeId = e.currentTarget.dataset.themeId;
        UI.applyTheme(themeId);
        UI.openSettingsModal();
      });
    });

    openModal('settingsModal');
  }

  static applyTheme(themeName) {
    document.documentElement.dataset.theme = themeName;
    AppStorage.setSetting('theme', themeName);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const bgSecondary = getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim();
      meta.setAttribute('content', bgSecondary || '#FFFFFF');
    }
  }
}

// KLASA DO OBSŁUGI STATYSTYK
class Stats {
    static chartInstances = {};

    static destroyCharts() {
        Object.values(this.chartInstances).forEach(chart => chart.destroy());
        this.chartInstances = {};
    }

    static render(containerSelector) {
        const panel = document.querySelector(containerSelector);
        if (!panel) return;
        panel.innerHTML = `
            <div class="content-card">
                <div class="chart-container" style="height: 250px;"><canvas id="sentimentChart"></canvas></div>
                <div class="chart-container" style="height: 250px; margin-top: 1.5rem;"><canvas id="habitsChart"></canvas></div>
                <div id="stats-placeholder" class="hidden"></div>
            </div>`;
        this.renderCharts();
    }

    static gatherData(days = 30) {
        const data = { labels: [], sentiments: {}, habits: {} };
        currentSentimentQuestions.forEach(sq => data.sentiments[sq.id] = []);
        currentHabits.forEach(h => data.habits[h] = 0);
        
        let entriesFound = 0;
        for (let i = 0; i < days; i++) {
            const date = dateFns.subDays(new Date(), i);
            const dateKey = dateFns.format(date, 'yyyy-MM-dd');
            data.labels.unshift(dateKey); // Dodajemy daty od najstarszej do najnowszej
            
            const entry = AppStorage.getDayEntry(dateKey);
            if (entry && entry.wieczor) {
                entriesFound++;
                currentSentimentQuestions.forEach(sq => {
                    data.sentiments[sq.id].unshift(entry.wieczor[sq.id + 'Sent'] || null);
                });
                currentHabits.forEach(habit => {
                    if (entry.wieczor.habits && entry.wieczor.habits[habit]) {
                        data.habits[habit]++;
                    }
                });
            } else {
                currentSentimentQuestions.forEach(sq => data.sentiments[sq.id].unshift(null));
            }
        }
        return entriesFound > 1 ? data : null;
    }

    static renderCharts() {
        this.destroyCharts();
        const data = this.gatherData();
        const placeholder = document.getElementById('stats-placeholder');
        const chartContainers = document.querySelectorAll('.chart-container');

        if (!data) {
            if (placeholder) {
                placeholder.classList.remove('hidden');
                placeholder.textContent = 'Brak wystarczających danych do analizy. Wypełnij Dziennik przez co najmniej 2 dni.';
            }
            chartContainers.forEach(c => c.classList.add('hidden'));
            return;
        }

        if (placeholder) placeholder.classList.add('hidden');
        chartContainers.forEach(c => c.classList.remove('hidden'));

        const style = getComputedStyle(document.body);
        Chart.defaults.font.family = "inherit";
        Chart.defaults.color = style.getPropertyValue('--text-tertiary');
        
        const chartOptions = (title, scales) => ({
            responsive: true, maintainAspectRatio: false, scales, 
            plugins: { 
                legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15 } },
                title: { display: true, text: title, font: { size: 16 } }
            },
            interaction: { intersect: false, mode: 'index' },
        });

        this.chartInstances.sentiment = new Chart(document.getElementById('sentimentChart'), {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: currentSentimentQuestions.map((sq, i) => ({
                    label: sq.question.split(' ').slice(2).join(' '),
                    data: data.sentiments[sq.id],
                    borderColor: ['#3B82F6', '#10B981', '#F59E0B'][i % 3],
                    tension: 0.4,
                    spanGaps: true,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    borderWidth: 2.5
                }))
            },
            options: chartOptions('Oceny z ostatnich 30 dni', { 
                x: { type: 'time', time: { unit: 'day', tooltipFormat: 'dd.MM.yyyy' }, grid: { display: false } }, 
                y: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } } 
            }),
        });

        this.chartInstances.habits = new Chart(document.getElementById('habitsChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(data.habits),
                datasets: [{
                    label: 'Dni zrealizowane',
                    data: Object.values(data.habits),
                    backgroundColor: style.getPropertyValue('--accent-secondary'),
                    borderRadius: 4
                }]
            },
            options: chartOptions('Realizacja nawyków w ostatnich 30 dniach', { 
                y: { ticks: { stepSize: 1 } } 
            })
        });
    }
}

// Pomocnicze
function openModal(id) { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

let notificationTimeout;
function showNotification(msg) {
  const el = document.getElementById('notification');
  if (!el) return;
  clearTimeout(notificationTimeout);
  el.textContent = msg;
  el.classList.add('active');
  notificationTimeout = setTimeout(() => el.classList.remove('active'), 2600);
}

// Start
App.init();
