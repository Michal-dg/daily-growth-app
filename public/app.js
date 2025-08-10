'use strict';
const initialQuestions = {
    poranek: [ {id:"m1", text:"Za co jestem dziś wdzięczny/a?"}, {id:"m2", text:"Jaki jest mój najważniejszy cel na dzisiaj?"}],
    wieczor: [ {id:"e1", text:"Trzy dobre rzeczy, które się dzisiaj wydarzyły, to…"}, {id:"e2", text:"Czego nowego się dzisiaj nauczyłem/am?"}]
};
const initialHabits = ["Medytacja", "Ćwiczenia fizyczne", "Czytanie książki", "Nauka czegoś nowego"];
const initialSentimentQuestions = [ { id: 'health', question: '💪 Jak oceniasz swoje samopoczucie fizyczne?' }, { id: 'mood', question: '😊 Jak oceniam swój nastrój?' }, { id: 'productivity', question: '🚀 Jak oceniam swoją produktywność?' }];
const quotes = [ "Nawet najdalszą podróż zaczyna się od pierwszego kroku. 🌱", "Bądź zmianą, którą pragniesz ujrzeć w świecie. 🚀", "Jedynym sposobem na wielką pracę jest kochanie tego, co robisz. ✨", "Każdy dzień to nowa szansa, aby stać się lepszą wersją siebie.", "Małe kroki w dobrym kierunku mogą okazać się największym krokiem w Twoim życiu.", "Tajemnica postępu polega na tym, by zacząć.", "Nie licz dni, spraw, by dni się liczyły.", "Sukces to suma małych wysiłków, powtarzanych dzień po dniu.", "Wzrost i komfort nie mogą współistnieć.", "Dyscyplina to most między celami a osiągnięciami.", "Umysł jest wszystkim. Stajesz się tym, o czym myślisz.", "Jesteś silniejszy, niż myślisz. Bardziej zdolny, niż sobie wyobrażasz.", "Zacznij tam, gdzie jesteś. Użyj tego, co masz. Zrób, co możesz.", "Cierpliwość, wytrwałość i pot tworzą niezwyciężoną kombinację sukcesu.", "Nigdy nie jest za późno, by być tym, kim mogłeś być.", "W samym środku trudności kryją się możliwości.", "Charakteru nie można rozwinąć w spokoju i ciszy. Tylko przez doświadczenie prób i cierpienia można wzmocnić duszę.", "Natura nie spieszy się, a jednak wszystko jest osiągnięte.", "Spójrz głęboko w naturę, a wtedy wszystko zrozumiesz lepiej.", "Najlepszy czas na zasadzenie drzewa był 20 lat temu. Drugi najlepszy czas jest teraz."];
const suggestedMorningQuestions = ["Jaka jedna rzecz sprawiłaby, że ten dzień będzie wspaniały?", "Jak mogę dzisiaj zadbać o swoje ciało i umysł?", "Z jakim nastawieniem chcę rozpocząć ten dzień?", "Czego chcę się dziś nauczyć?", "Kto potrzebuje dzisiaj mojej dobroci?", "Jaką małą przyjemność mogę sobie dziś sprawić?", "Jaki jest pierwszy krok w kierunku mojego dużego celu?", "Jak mogę wyjść ze swojej strefy komfortu?", "Czego nie mogę się doczekać w dzisiejszym dniu?", "Jaką pozytywną energię wnoszę do świata?", "Za jaką trudną lekcję z przeszłości jestem wdzięczny?", "Jak mogę dziś okazać miłość bliskiej osobie?", "Jaki problem mogę dziś spróbować rozwiązać?", "Co mogę zrobić, aby poczuć się bardziej zorganizowanym?", "Jaka myśl dodaje mi siły?", "Jakie są moje 3 priorytety na dziś?", "Jak mogę być bardziej obecny/a w tej chwili?", "Jaką jedną rzecz mogę odpuścić?", "Co pięknego dostrzegam wokół siebie w tej chwili?", "Jaką obietnicę składam sobie na ten dzień?"];
const suggestedEveningQuestions = ["Co dzisiaj poszło lepiej, niż się spodziewałem/am?", "Kiedy czułem/am się dzisiaj najbardziej sobą?", "Co dzisiaj wywołało mój uśmiech?", "Jaką jedną rzecz zrobiłbym/zrobiłabym inaczej?", "Kto mi dzisiaj pomógł lub kogo ja wsparłem/wsparłam?", "W jaki sposób ruszyłem/am do przodu w kierunku moich celów?", "Co dzisiaj mnie zaskoczyło?", "Czego się dzisiaj pozbyłem/pozbyłam (np. złego nawyku, negatywnej myśli)?", "Jaka była najpiękniejsza rzecz, którą dziś widziałem/widziałam?", "O czym nowym dziś myślałem/myślałam?", "Jakie uczucie dominowało w moim dniu?", "Co mogę zrobić jutro, aby było jeszcze lepsze?", "Kiedy czułem/am się najbardziej zrelaksowany/a?", "Jaka piosenka pasowałaby do dzisiejszego dnia?", "Czego nauczyła mnie dzisiejsza porażka lub wyzwanie?", "Za co chciałbym/chciałabym sobie podziękować?", "Jakie małe zwycięstwo dzisiaj odniosłem/odniosłam?", "Jak oceniłbym/oceniłabym dziś swoją cierpliwość?", "Co dobrego zjadłem/zjadłam?", "Z jaką myślą chcę zasnąć?"];
const suggestedSummaryQuestions = ["Jaką jedną emocję najczęściej dziś odczuwałem/am?", "Co było największym wyzwaniem, z którym się zmierzyłem/am?", "Gdybym miał/a opisać ten dzień jednym słowem, jakie by to było?", "Co dzisiaj zabrało mi najwięcej energii?", "Co dzisiaj dało mi najwięcej energii?", "Czy zrobiłem/am dziś coś tylko dla siebie?", "Jaki był najbardziej pamiętny moment dnia?", "Czy moje dzisiejsze działania były zgodne z moimi wartościami?", "Jaką jedną rzecz chciałbym/chciałabym zapamiętać z tego dnia?", "Czy jestem zadowolony/a z tego, jak spędziłem/am dziś czas?"];
const suggestedHabits = ["Picie 2l wody", "Spacer 30 minut", "Bez social mediów rano", "Joga lub rozciąganie", "Nauka 5 nowych słówek", "Pisanie dziennika", "Planowanie następnego dnia", "Zdrowy posiłek", "Kontakt z naturą", "Poświęcenie czasu na hobby", "Słuchanie podcastu rozwojowego", "Praktyka uważności (mindfulness)"];

let currentQuestions, currentHabits, currentSentimentQuestions, currentDate;

const App = {
    isAppInitialized: false,

    init() {
        window.addEventListener('load', () => {
            if (!sessionStorage.getItem('dg_user')) {
                sessionStorage.setItem('dg_user', 'default_user');
            }
            this.launch();
        });
    },

    launch() {
        if (this.isAppInitialized) return;
        this.isAppInitialized = true;

        this.loadAppData();
        
        applyTheme(AppStorage.getSetting('theme'));
        applyFont(AppStorage.getSetting('font'));
        document.documentElement.classList.toggle('dark-mode', AppStorage.getSetting('darkMode'));
        
        document.getElementById('dailyQuote').textContent = quotes[Math.floor(Math.random() * quotes.length)];
        
        this.bindMainEventListeners();
        this.rebuildAllSections();
        
        currentDate = dateFns.format(new Date(), 'yyyy-MM-dd');
        this.loadDate(currentDate);

        Settings.init();
        this.checkTimeCapsule();
    },

    loadAppData() {
        currentQuestions = AppStorage.getQuestions();
        currentHabits = AppStorage.getHabits();
        currentSentimentQuestions = AppStorage.getSentimentQuestions();
    },

    bindMainEventListeners() {
        document.getElementById('settings-btn').addEventListener('click', () => Settings.open());
        document.getElementById('backup-btn').addEventListener('click', () => openModal('backupModal'));
        document.getElementById('download-backup-btn').addEventListener('click', downloadBackup);
        document.getElementById('restore-backup-btn').addEventListener('click', restoreBackup);
        document.getElementById('prev-day-btn').addEventListener('click', () => this.changeDate(-1));
        document.getElementById('next-day-btn').addEventListener('click', () => this.changeDate(1));
        document.getElementById('currentDate').addEventListener('input', e => this.loadDate(e.target.value));
        
        document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', e => {
            document.querySelectorAll('.tab, .section').forEach(el => el.classList.remove('active'));
            const sectionId = e.currentTarget.dataset.section;
            e.currentTarget.classList.add('active');
            document.getElementById(`${sectionId}-panel`).classList.add('active');
            if (sectionId === 'stats') Stats.render('#stats-panel');
        }));
    },

    rebuildAllSections() {
        ['poranek', 'wieczor'].forEach(s => UI.buildSection(s, s.charAt(0).toUpperCase()+s.slice(1), {'poranek':'🌅','wieczor':'🌙'}[s], `#${s}-panel`));
    },

    loadDate(newDate) {
        currentDate = newDate;
        document.getElementById('currentDate').value = currentDate;
        ['poranek', 'wieczor'].forEach(s => UI.loadSectionData(s, currentDate));
    },
    
    changeDate(offset) {
        const newDate = dateFns.addDays(new Date(currentDate), offset);
        this.loadDate(dateFns.format(newDate, 'yyyy-MM-dd'));
    },

    checkTimeCapsule() {
        const today = new Date(currentDate);
        const oneYearAgoDate = dateFns.format(dateFns.subYears(today, 1), 'yyyy-MM-dd');
        const sessionKey = `capsule_${oneYearAgoDate}`;
        if (sessionStorage.getItem(sessionKey)) return;

        const pastEntry = AppStorage.getDayEntry(oneYearAgoDate);
        if (Object.keys(pastEntry).length > 0) {
            let content = '';
            ['poranek', 'wieczor'].forEach(sId => {
                if(pastEntry[sId]) {
                    content += `<h4>${sId.charAt(0).toUpperCase() + sId.slice(1)}</h4><ul>`;
                    for(const key in pastEntry[sId]) {
                        const q = this.currentQuestions[sId].find(q => q.id === key);
                        if(q && pastEntry[sId][key]) {
                            content += `<li><strong>${q.text}</strong><br><em>${pastEntry[sId][key]}</em></li>`;
                        }
                    }
                    content += '</ul>';
                }
            });
            if (content) {
                document.getElementById('timeCapsuleContent').innerHTML = content;
                openModal('timeCapsuleModal');
                sessionStorage.setItem(sessionKey, 'true');
            }
        }
    }
};

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
    static getAllDataForBackup() { const d = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('dg_')) d[k] = localStorage.getItem(k); } return d; }
    static restoreDataFromBackup(d) { for (let i = localStorage.length - 1; i >= 0; i--) { if (localStorage.key(i).startsWith('dg_')) localStorage.removeItem(localStorage.key(i)); } for (const k in d) { if (k.startsWith('dg_')) localStorage.setItem(k, d[k]); } }
}

class UI {
    static buildSection(sectionId, title, emoji, containerSelector) {
        const panel = document.querySelector(containerSelector);
        if (!panel) return;
        const questions = App.currentQuestions[sectionId] || [];
        let html = `<div class="content-card"><h2 class="content-header">${emoji} ${title}</h2><div>`;
        questions.forEach(q => html += `<div class="question-group"><label for="q-${q.id}">${q.text}</label><textarea id="q-${q.id}" data-id="${q.id}"></textarea></div>`);
        if (sectionId === 'wieczor') {
            html += App.currentSentimentQuestions.map(sq => `<div class="question-group"><label>${sq.question}</label><textarea id="text-${sq.id}"></textarea><div class="sentiment-buttons"><button class="btn-sent pos" data-id="${sq.id}" data-value="pos">😊</button><button class="btn-sent neg" data-id="${sq.id}" data-value="neg">😞</button></div></div>`).join('');
            if (App.currentHabits.length > 0) html += `<div class="question-group"><label>Nawyki</label>${App.currentHabits.map(h => `<div class="habit-item"><label><input type="checkbox" data-habit-name="${h}"> ${h}</label></div>`).join('')}</div>`;
        }
        html += `</div></div>`;
        panel.innerHTML = html;
        panel.querySelectorAll('textarea').forEach(el => el.addEventListener('input', e => UI.saveInput(sectionId, e.target)));
        panel.querySelectorAll('input[type="checkbox"]').forEach(el => el.addEventListener('change', e => UI.saveHabitStatus(e.target)));
        panel.querySelectorAll('.btn-sent').forEach(btn => btn.addEventListener('click', e => UI.setSentiment(e.currentTarget)));
    }
    static loadSectionData(sectionId, date) {
        const entry = AppStorage.getDayEntry(date);
        const data = entry[sectionId] || {};
        document.querySelectorAll(`#${sectionId}-panel textarea`).forEach(el => {
            const id = el.id.startsWith('text-') ? el.id.replace('text-', '') : el.dataset.id;
            const key = el.id.startsWith('text-') ? `${id}Text` : id;
            if (data[key]) {
                el.value = data[key];
            } else {
                el.value = '';
            }
        });
        if (sectionId === 'wieczor') {
            const eveningData = entry.wieczor || {};
            App.currentSentimentQuestions.forEach(sq => {
                const sentiment = eveningData[sq.id + 'Sent'];
                const container = document.querySelector(`#wieczor-panel .sentiment-buttons[data-id="${sq.id}"]`);
                if (container) {
                    container.querySelectorAll('.btn-sent').forEach(btn => btn.classList.remove('active'));
                    if (sentiment) {
                        const activeBtn = container.querySelector(`.btn-sent[data-value="${sentiment}"]`);
                        if (activeBtn) activeBtn.classList.add('active');
                    }
                }
            });
            const habits = eveningData.habits || {};
            App.currentHabits.forEach(h => { const cb = document.querySelector(`#wieczor-panel [data-habit-name="${h}"]`); if(cb) cb.checked = habits[h] || false; });
        }
    }
    static saveInput(sectionId, target) {
        const entry = AppStorage.getDayEntry(App.currentDate);
        if(!entry[sectionId]) entry[sectionId] = {};
        const id = target.id.startsWith('text-') ? target.id.replace('text-', '') : target.dataset.id;
        const key = target.id.startsWith('text-') ? `${id}Text` : id;
        entry[sectionId][key] = target.value;
        AppStorage.saveDayEntry(App.currentDate, entry);
    }
    static saveHabitStatus(checkbox) { const name = checkbox.dataset.habitName, entry = AppStorage.getDayEntry(App.currentDate); if(!entry.wieczor) entry.wieczor = {}; if(!entry.wieczor.habits) entry.wieczor.habits = {}; entry.wieczor.habits[name] = checkbox.checked; AppStorage.saveDayEntry(App.currentDate, entry); }
    static setSentiment(button) {
        const value = button.dataset.value;
        const container = button.parentElement;
        const catId = button.dataset.id;
        container.querySelectorAll('.btn-sent').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const entry = AppStorage.getDayEntry(App.currentDate);
        if(!entry.wieczor) entry.wieczor = {};
        entry.wieczor[catId + 'Sent'] = value;
        AppStorage.saveDayEntry(App.currentDate, entry);
    }
}

class Stats {
    static chartInstances = {};
    static destroyCharts() { Object.values(this.chartInstances).forEach(chart => chart.destroy()); this.chartInstances = {}; }
    static render(containerSelector) {
        const panel = document.querySelector(containerSelector);
        if (!panel) return;
        panel.innerHTML = `<div class="content-card"><div class="stats-grid"><div class="chart-container"><canvas id="sentimentChart"></canvas></div><div class="chart-container"><canvas id="habitsChart"></canvas></div></div><div id="stats-placeholder" class="hidden">Brak wystarczających danych do analizy.</div></div>`;
        this.renderCharts();
    }
    static gatherData(days = 30) {
        const data = { labels: [], sentiments: { pos: [], neg: [] }, habits: {} };
        const today = new Date();
        App.currentHabits.forEach(h => data.habits[h] = 0);
        let entriesFound = 0;
        for (let i = days - 1; i >= 0; i--) {
            const date = dateFns.subDays(today, i);
            const dateKey = dateFns.format(date, 'yyyy-MM-dd');
            const entry = AppStorage.getDayEntry(dateKey);
            if (entry && entry.wieczor) {
                entriesFound++;
                data.labels.push(dateKey);
                let posCount = 0; let negCount = 0; let totalCount = 0;
                App.currentSentimentQuestions.forEach(sq => {
                    const sentiment = entry.wieczor[sq.id + 'Sent'];
                    if (sentiment) {
                        totalCount++;
                        if (sentiment === 'pos') posCount++;
                        else if (sentiment === 'neg') negCount++;
                    }
                });
                data.sentiments.pos.push(totalCount > 0 ? (posCount / totalCount) * 100 : null);
                data.sentiments.neg.push(totalCount > 0 ? (negCount / totalCount) * 100 : null);
                App.currentHabits.forEach(habit => { if (entry.wieczor.habits && entry.wieczor.habits[habit]) data.habits[habit]++; });
            }
        }
        return entriesFound > 1 ? data : null;
    }
    static renderCharts() {
        this.destroyCharts();
        const data = this.gatherData();
        const placeholder = document.getElementById('stats-placeholder');
        const grid = document.querySelector('.stats-grid');
        if (!data || data.labels.length < 2) {
            if(placeholder) placeholder.classList.remove('hidden');
            grid?.classList.add('hidden');
            return;
        }
        if(placeholder) placeholder.classList.add('hidden');
        grid?.classList.remove('hidden');
        const style = getComputedStyle(document.body);
        Chart.defaults.font.family = "inherit";
        Chart.defaults.color = style.getPropertyValue('--text-muted');
        const chartOptions = (scales) => ({ responsive: true, maintainAspectRatio: false, scales, plugins: { legend: { position: 'bottom' } }, interaction: { intersect: false, mode: 'index' }, layout: { padding: 10 } });
        
        this.chartInstances.sentiment = new Chart(document.getElementById('sentimentChart'), {
            type: 'line', data: { labels: data.labels, datasets: [
                { label: '% Ocen Pozytywnych', data: data.sentiments.pos, borderColor: 'var(--positive, #4ade80)', tension: 0.4, spanGaps: true, pointRadius: 3, pointHoverRadius: 6, borderWidth: 2, fill: true, backgroundColor: 'rgba(74, 222, 128, 0.2)' },
                { label: '% Ocen Negatywnych', data: data.sentiments.neg, borderColor: 'var(--negative, #ff5e5e)', tension: 0.4, spanGaps: true, pointRadius: 3, pointHoverRadius: 6, borderWidth: 2, fill: true, backgroundColor: 'rgba(255, 94, 94, 0.2)' }
            ]}, options: chartOptions({ x: { type: 'time', time: { unit: 'day' }, grid: { display: false } }, y: { beginAtZero: true, max: 100, ticks: {callback: (v) => `${v}%`} } }),
        });
        
        const totalHabitDays = data.labels.length;
        this.chartInstances.habits = new Chart(document.getElementById('habitsChart'), {
            type: 'bar', data: { labels: Object.keys(data.habits), datasets: [{ 
                label: '% Realizacji (ostatnie 30 dni)', 
                data: Object.values(data.habits).map(count => (count / totalHabitDays) * 100), 
                backgroundColor: style.getPropertyValue('--primary'), borderRadius: 4 
            }] },
            options: chartOptions({ y: { max: 100, ticks: {callback: (v) => `${v}%`} } })
        });
    }
}

class Settings {
    static init() {
        document.getElementById('save-settings-btn').addEventListener('click', () => this.saveAndClose());
        const settingsModal = document.getElementById('settingsModal');
        const suggestionsModal = document.getElementById('suggestionsModal');
        [settingsModal, suggestionsModal].forEach(modal => { modal.addEventListener('click', e => { if (e.target.closest('.close-modal-btn')) { closeModal(e.target.closest('.modal').id); } }); });
        settingsModal.addEventListener('click', e => {
            const header = e.target.closest('.settings-section-header');
            if (header) this.toggleSection(header);
        });
        suggestionsModal.addEventListener('click', e => {
            const addBtn = e.target.closest('.add-suggestion-btn');
            if (addBtn) {
                this.addSuggestion(addBtn.dataset.section, addBtn.dataset.index);
                addBtn.textContent = 'Dodano ✔'; addBtn.disabled = true;
            }
        });
        settingsModal.addEventListener('input', e => {
            const { section, index, id } = e.target.dataset;
            if (section === 'summary') this.tempSentimentQuestions[index].question = e.target.value;
            else if (section === 'habits') this.tempHabits[index] = e.target.value;
            else if (this.tempQuestions[section]) {
                const question = this.tempQuestions[section].find(q => q.id === id);
                if (question) question.text = e.target.value;
            }
        });
    }
    static toggleSection(header) {
        const sectionEl = header.parentElement;
        const sectionId = header.dataset.section;
        const isOpen = sectionEl.classList.contains('is-open');
        document.querySelectorAll('#settingsModal .settings-section.is-open').forEach(openSection => {
            if (openSection !== sectionEl) { 
                openSection.classList.remove('is-open');
                openSection.querySelector('.settings-edit-btn').textContent = 'Edytuj';
            }
        });
        sectionEl.classList.toggle('is-open');
        const button = header.querySelector('.settings-edit-btn');
        if (!isOpen) { this.render(sectionId); button.textContent = 'Zwiń'; } 
        else { button.textContent = 'Edytuj'; }
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
        const renderItem = (value, section, index, placeholder, id = '') => `<div class="settings-item"><input type="text" data-section="${section}" data-index="${index}" ${id ? `data-id="${id}"` : ''} value="${String(value || '').replace(/"/g, '&quot;')}" placeholder="${placeholder}"><button class="btn action-btn" data-action="deleteItem" data-section="${section}" data-index="${index}">Usuń</button></div>`;
        const renderList = (title, items, section, placeholder, textKey) => {
            let listHtml = `<h4>${title}</h4><div class="settings-list">${items.map((item, i) => renderItem(textKey ? item[textKey] : item, section, i, placeholder, textKey ? item.id : '')).join('')}</div>
            <div class="settings-action-buttons">
                <button class="btn btn-tertiary action-btn" data-action="showSuggestions" data-section="${section}">Zainspiruj mnie</button>
                <button class="btn btn-secondary action-btn" data-action="addItem" data-section="${section}">+ Dodaj</button>
            </div>`;
            return listHtml;
        };
        switch (sectionId) {
            case 'appearance':
                const theme = AppStorage.getSetting('theme') || 'las';
                const font = AppStorage.getSetting('font') || 'sans-serif';
                html = `<h4 class="settings-header-4">Wybierz motyw</h4><div class="settings-group theme-selector">${['las', 'ocean', 'fokus'].map(t => `<div class="theme-option ${theme === t ? 'is-active' : ''}" data-theme="${t}"><span>${{'las':'🌱','ocean':'🌊','fokus':'⚡'}[t]}</span> ${t.charAt(0).toUpperCase() + t.slice(1)}</div>`).join('')}</div>
                <h4 class="settings-header-4">Wybierz czcionkę</h4><div class="settings-group font-selector">${['sans-serif', 'serif', 'rounded'].map(f => `<button data-font="${f}" class="btn ${font === f ? 'btn-primary' : 'btn-tertiary'}">${{'sans-serif':'Nowoczesna','serif':'Klasyczna','rounded':'Swobodna'}[f]}</button>`).join('')}</div>
                <h4 class="settings-header-4">Tryb Ciemny</h4><button id="dark-mode-btn" class="btn btn-tertiary">${document.documentElement.classList.contains('dark-mode') ? 'Wyłącz' : 'Włącz'} tryb ciemny</button>`;
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
    static showSuggestions(section) {
        let suggestions = [], title = "Sugerowane Pytania";
        switch(section) {
            case 'poranek': suggestions = suggestedMorningQuestions; title = "Sugestie - Poranek"; break;
            case 'wieczor': suggestions = suggestedEveningQuestions; title = "Sugestie - Wieczór"; break;
            case 'summary': suggestions = suggestedSummaryQuestions; title = "Sugerowane Pytania Podsumowujące"; break;
            case 'habits': suggestions = suggestedHabits; title = "Sugerowane Nawyki"; break;
        }
        const suggestionsList = document.getElementById('suggestionsList');
        if (!suggestionsList) return;
        suggestionsList.innerHTML = suggestions.map((q, index) => `<div class="suggestion-item"><span>${q}</span><button class="btn btn-secondary add-suggestion-btn" data-section="${section}" data-index="${index}">Dodaj</button></div>`).join('');
        document.getElementById('suggestionsTitle').textContent = title;
        openModal('suggestionsModal');
    }
    static addSuggestion(section, index) {
        let textToAdd;
        switch(section) {
            case 'poranek': textToAdd = suggestedMorningQuestions[index]; this.tempQuestions.poranek.push({id: `m${Date.now()}`, text: textToAdd}); break;
            case 'wieczor': textToAdd = suggestedEveningQuestions[index]; this.tempQuestions.wieczor.push({id: `e${Date.now()}`, text: textToAdd}); break;
            case 'summary': textToAdd = suggestedSummaryQuestions[index]; this.tempSentimentQuestions.push({id: `s${Date.now()}`, question: textToAdd}); break;
            case 'habits': textToAdd = suggestedHabits[index]; this.tempHabits.push(textToAdd); break;
        }
        this.render(section);
    }
    static addItem(section) {
        if(section === 'habits') this.tempHabits.push('');
        else if (section === 'summary') this.tempSentimentQuestions.push({id: `s${Date.now()}`, question: ''});
        else { this.tempQuestions[section].push({id: `${section.charAt(0)}${Date.now()}`, text: ''}); }
        this.render(section);
    }
    static deleteItem(section, index) {
        if(section === 'habits') this.tempHabits.splice(index, 1);
        else if (section === 'summary') this.tempSentimentQuestions.splice(index, 1);
        else { this.tempQuestions[section].splice(index, 1); }
        this.render(section);
    }
    static saveAndClose() {
        Object.keys(this.tempQuestions).forEach(s => this.tempQuestions[s] = this.tempQuestions[s].filter(q => q.text.trim()));
        this.tempHabits = this.tempHabits.filter(h => h.trim());
        this.tempSentimentQuestions = this.tempSentimentQuestions.filter(q => q.question.trim());
        AppStorage.saveQuestions(this.tempQuestions);
        AppStorage.saveHabits(this.tempHabits);
        AppStorage.saveSentimentQuestions(this.tempSentimentQuestions);
        App.loadAppData();
        App.rebuildAllSections();
        App.loadDate(currentDate);
        closeModal('settingsModal');
        showNotification("Ustawienia zapisane! ✅");
    }
}

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
function downloadBackup() { 
    const data = AppStorage.getAllDataForBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily_growth_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("Backup pobrany ✅");
    closeModal('backupModal');
}
function restoreBackup() { 
    const fileInput = document.getElementById('restoreFile');
    const file = fileInput.files[0];
    if (!file) { showNotification("Wybierz plik!"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            AppStorage.restoreDataFromBackup(data);
            showNotification("Dane przywrócone! Aplikacja zostanie odświeżona.");
            closeModal('backupModal');
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            showNotification("Błąd: Plik backupu jest uszkodzony.");
        } finally {
            fileInput.value = '';
        }
    };
    reader.readAsText(file);
}

App.init();