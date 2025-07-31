<!DOCTYPE html>
<html lang="pl" data-theme="las">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Daily Growth 4.2 🌱 – Wersja Finalna</title>
    <meta name="description" content="Finalna wersja Daily Growth. Uproszczony interfejs, działająca analiza trendów, eksport PDF i pełna personalizacja.">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">

    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌱</text></svg>">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#ffffff">
    
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Daily Growth">
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png">

    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/date-fns@3.6.0/cdn.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" defer></script>


    <style>
        /* === SYSTEM DESIGNU v4.2 === */
        :root {
            --primary: #2c6e49; --accent: #f9a620;
            --bg: #f7f9f9; --card: #ffffff;
            --text-main: #1f292e; --text-muted: #6a7881;
            --border: #e8ecef;
            --header-overlay: rgba(30, 41, 46, 0.4);
            
            --border-radius-sm: 8px; --border-radius-md: 12px; --border-radius-lg: 16px;
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
            --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        html[data-theme='las'].dark-mode {
            --primary: #4ab779; --accent: #ffb84d; --bg: #12181b; --card: #1c2328;
            --text-main: #e8e8e8; --text-muted: #8e9a9f; --border: #2d373c;
            --header-overlay: rgba(0, 0, 0, 0.5);
        }
        html[data-theme='ocean'] {
            --primary: #006f8a; --accent: #ee9b00; --bg: #f0f8ff; --card: #ffffff;
            --text-main: #023047; --text-muted: #5e7c8b; --border: #e0f2f8;
            --header-overlay: rgba(1, 42, 64, 0.5);
        }
        html[data-theme='ocean'].dark-mode {
            --primary: #219ebc; --accent: #ffc254; --bg: #012a40; --card: #013754;
            --text-main: #e0f2f8; --text-muted: #a6bfcc; --border: #025078;
        }
        html[data-theme='fokus'] {
            --primary: #1a1a1a; --accent: #007aff; --bg: #f6f6f6; --card: #ffffff;
            --text-main: #1a1a1a; --text-muted: #6b6b6b; --border: #e5e5e5;
            --header-overlay: rgba(255, 255, 255, 0.3);
        }
        html[data-theme='fokus'].dark-mode {
            --primary: #f0f0f0; --accent: #0a84ff; --bg: #000000; --card: #1c1c1e;
            --text-main: #f0f0f0; --text-muted: #a0a0a0; --border: #38383a;
            --header-overlay: rgba(0, 0, 0, 0.6);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text-main); line-height: 1.6; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; transition: background-color var(--transition), color var(--transition); }
        .hidden { display: none !important; }

        .container { max-width: 900px; margin: 0 auto; padding: 20px 15px; }
        header { 
            position: relative;
            color: white; 
            border-radius: var(--border-radius-lg); 
            padding: 60px 40px; 
            margin-bottom: 40px; 
            text-align: center; 
            overflow: hidden;
            background-image: url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80');
            background-size: cover;
            background-position: center;
        }
        header::before {
            content: '';
            position: absolute;
            inset: 0;
            background-color: var(--header-overlay);
            z-index: 1;
            transition: background-color var(--transition);
        }
        header > * {
            position: relative;
            z-index: 2;
        }
        header h1 { color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
        .quote { font-style: normal; font-size: 1.2rem; max-width: 600px; margin: 15px auto 0; opacity: 0.95; }

        .controls { display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .btn { padding: 10px 20px; border-radius: var(--border-radius-md); border: 1px solid transparent; cursor: pointer; font-size: 0.95rem; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; transition: all var(--transition); user-select: none; }
        .btn:active { transform: scale(0.97); }
        .btn-primary { background: var(--primary); color: white; }
        html[data-theme='fokus'].dark-mode .btn-primary { color: #000; }
        .btn-secondary { background: var(--accent); color: var(--text-main); }
        .btn-tertiary { background: var(--card); color: var(--text-main); border-color: var(--border); box-shadow: var(--shadow-sm); }
        .btn-tertiary:hover { background-color: var(--bg); border-color: color-mix(in srgb, var(--border) 80%, var(--text-muted)); }

        .tabs-container { border-bottom: 1px solid var(--border); }
        .tabs { display: flex; gap: 12px; justify-content: flex-start; margin-bottom: -1px; min-width: max-content; overflow-x: auto; scrollbar-width: none;}
        .tabs::-webkit-scrollbar { display: none; }
        .tab { padding: 10px 16px; border-radius: var(--border-radius-md) var(--border-radius-md) 0 0; background: transparent; color: var(--text-muted); cursor: pointer; font-weight: 600; border: 1px solid transparent; white-space: nowrap; }
        .tab.active { background: var(--card); color: var(--primary); border-color: var(--border); border-bottom-color: var(--card); }
        .tab svg { margin-right: 8px; width: 16px; height: 16px; }

        .section { display: none; }
        .section.active { display: block; animation: fadeIn 0.5s var(--transition); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

        .content-card, .auth-container { background: var(--card); padding: 40px; border-radius: var(--border-radius-lg); margin-top: 25px; box-shadow: var(--shadow-md); border: 1px solid var(--border); transition: all var(--transition); }
        .content-header { font-size: 1.8rem; margin-bottom: 30px; color: var(--primary); font-weight: 700; padding-bottom: 15px; border-bottom: 1px solid var(--border); }
        
        textarea, input, select { width: 100%; padding: 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--border); background: var(--bg); color: var(--text-main); font-size: 1rem; font-family: 'Inter', sans-serif; transition: all var(--transition); }
        textarea:focus, input:focus, select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
        textarea { min-height: 120px; resize: vertical; }
        .question-group { margin-bottom: 30px; }
        label { display: block; font-weight: 600; margin-bottom: 10px; }

        .sentiment-buttons { display: flex; gap: 8px; margin-top: 10px; }
        .sentiment-star { font-size: 2.2rem; cursor: pointer; color: var(--border); transition: all 0.15s ease-in-out; }
        .sentiment-buttons:hover .sentiment-star { color: color-mix(in srgb, var(--accent) 50%, transparent); }
        .sentiment-buttons .sentiment-star:hover ~ .sentiment-star { color: var(--border); }
        .sentiment-star.active { color: var(--accent); }
        
        .habit-item { display: flex; align-items: center; gap: 12px; }
        .habit-item label { display: flex; align-items: center; gap: 12px; font-weight: normal; width: 100%; padding: 8px 0; }
        .habit-item input[type="checkbox"] { width: 20px; height: 20px; accent-color: var(--primary); flex-shrink: 0; }

        .modal, #auth-page { display: none; position: fixed; z-index: 1000; inset: 0; align-items: center; justify-content: center; background-color: color-mix(in srgb, var(--bg) 80%, transparent); backdrop-filter: blur(8px); }
        .modal.active, #auth-page.active { display: flex; animation: fadeIn 0.3s forwards; }
        .modal-content { max-width: 600px; width: 90%; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .close-modal-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); }
        .auth-container { max-width: 400px; } .auth-form { display: flex; flex-direction: column; gap: 15px; margin-top: 25px; }
        .settings-item { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
        .settings-item input { flex-grow: 1; }
        .settings-item button { background-color: #e53e3e; color: white; flex-shrink: 0; } .settings-item button:hover { background-color: #c53030; }

        .stats-grid { display: grid; grid-template-columns: 1fr; gap: 40px; }
        .chart-container { position: relative; min-height: 350px; }
        #stats-placeholder { text-align: center; padding: 60px 20px; color: var(--text-muted); }
        #notification { position:fixed; bottom:-100px; left:50%; transform:translateX(-50%); background:var(--card); color:var(--text-main); padding:12px 24px; border-radius:var(--border-radius-md); box-shadow:var(--shadow-md); z-index:2000; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity:0; }
        #notification.active { bottom: 20px; opacity: 1; }

        @media (max-width: 768px) {
            header, .content-card, .modal-content { padding: 40px 20px; }
            .controls { flex-direction: column; align-items: stretch; gap: 10px; }
            .actions, .date-controls { justify-content: space-between; width: 100%; }
            input[type="date"] { text-align: center; }
        }
    </style>
</head>
<body>

    <div id="auth-page">
        <div class="auth-container content-card">
            <h1 style="text-align:center;">🌱 Witaj</h1>
            <div id="auth-form-container">
                <form id="authForm" class="auth-form">
                    <h2 id="authTitle" class="content-header" style="margin-bottom: 15px; text-align: center; border: none;">Logowanie</h2>
                    <div id="authError" style="color: #e53e3e; text-align:center; min-height: 1.2em;"></div>
                    <div><input type="text" id="authLogin" placeholder="Login" autocomplete="username" required></div>
                    <div><input type="password" id="authPassword" placeholder="Hasło" autocomplete="current-password" required></div>
                    <button class="btn btn-primary" id="authSubmitBtn" type="submit">Zaloguj się</button>
                </form>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <span id="toggleText">Nie masz konta?</span>
                <button id="toggleAuthBtn" type="button" style="all:unset; cursor:pointer; font-weight:bold; color:var(--primary); text-decoration:underline; margin-left: 5px;">Zarejestruj się</button>
            </div>
        </div>
    </div>

    <div id="main-app" class="hidden">
        <div class="container">
            <header>
                <h1>Daily Growth</h1>
                <p class="quote" id="dailyQuote"></p>
            </header>

            <div class="controls">
                <div class="date-controls">
                    <button class="btn btn-tertiary" id="prev-day-btn" aria-label="Poprzedni dzień"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.3333 13.666L4.66667 7.99935L10.3333 2.33268" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                    <input type="date" id="currentDate">
                    <button class="btn btn-tertiary" id="next-day-btn" aria-label="Następny dzień"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.66669 2.33398L11.3334 8.00065L5.66669 13.6673" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                </div>
                <div class="actions">
                    <button class="btn btn-tertiary" id="pdf-btn">PDF</button>
                    <button class="btn btn-tertiary" id="settings-btn">Ustawienia</button>
                    <button class="btn btn-primary" id="logout-btn">Wyloguj</button>
                </div>
            </div>

            <div class="tabs-container">
                <div class="tabs" role="tablist">
                    <div class="tab active" data-section="morning">🌅 Poranek</div>
                    <div class="tab" data-section="evening">🌙 Wieczór</div>
                    <div class="tab" data-section="stats"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 13.3333H4V8H2V13.3333ZM6.66667 13.3333H8.66667V2.66667H6.66667V13.3333ZM11.3333 13.3333H13.3333V5.33333H11.3333V13.3333Z" fill="currentColor"/></svg>Analiza</div>
                </div>
            </div>

            <section id="morning-panel" class="section active"></section>
            <section id="evening-panel" class="section"></section>
            <section id="stats-panel" class="section"></section>
        </div>
        
        <div class="modal" id="settingsModal">
            <div class="content-card modal-content">
                <div class="modal-header"><h2 class="content-header" style="border:none; margin:0; padding:0;">Ustawienia</h2><button class="close-modal-btn">✖</button></div>
                <div class="modal-tabs" style="border-bottom: 1px solid var(--border); margin-bottom: 20px;">
                    <div class="modal-tab active" data-section="appearance">🎨 Wygląd</div>
                    <div class="modal-tab" data-section="morning">🌅 Poranek</div>
                    <div class="modal-tab" data-section="evening">🌙 Wieczór</div>
                    <div class="modal-tab" data-section="summary">📊 Podsumowanie</div>
                    <div class="modal-tab" data-section="habits">✅ Nawyki</div>
                </div>
                <div id="s-appearance-panel" class="modal-tab-panel active"></div>
                <div id="s-morning-panel" class="modal-tab-panel"></div>
                <div id="s-evening-panel" class="modal-tab-panel"></div>
                <div id="s-summary-panel" class="modal-tab-panel"></div>
                <div id="s-habits-panel" class="modal-tab-panel"></div>
                <button class="btn btn-primary" id="save-settings-btn" style="margin-top: 20px; width: 100%;">Zapisz i zamknij</button>
            </div>
        </div>
        <div id="notification"></div>
    </div>
<script>
    'use strict';
    // --- GLOBALNE STAŁE ---
    const initialQuestions = {
        morning: [ {id:"m1", text:"Za co jestem dziś wdzięczny/a?"}, {id:"m2", text:"Jaki jest mój najważniejszy cel na dzisiaj?"}, {id:"m3", text:"Jaką pozytywną afirmację wybieram na dziś?"} ],
        evening: [ {id:"e1", text:"Trzy dobre rzeczy, które się dzisiaj wydarzyły, to…"}, {id:"e2", text:"Czego nowego się dzisiaj nauczyłem/am?"}, {id:"e3",text:"Za co jestem sobie dzisiaj wdzięczny/a?"} ]
    };
    const initialHabits = ["Medytacja", "Ćwiczenia fizyczne", "Czytanie książki", "Nauka czegoś nowego"];
    const initialSentimentQuestions = [
        { id: 'health', question: '💪 Jak oceniasz swoje samopoczucie fizyczne?' }, 
        { id: 'mood', question: '😊 Jak oceniam swój nastrój?' }, 
        { id: 'productivity', question: '🚀 Jak oceniam swoją produktywność?' }
    ];
    const quotes = [ 
        "Nawet najdalszą podróż zaczyna się od pierwszego kroku. 🌱", "Bądź zmianą, którą pragniesz ujrzeć w świecie. 🚀", "Jedynym sposobem na wielką pracę jest kochanie tego, co robisz. ✨",
        "Każdy dzień to nowa szansa, aby stać się lepszą wersją siebie.", "Małe kroki w dobrym kierunku mogą okazać się największym krokiem w Twoim życiu.", "Tajemnica postępu polega na tym, by zacząć.",
        "Nie licz dni, spraw, by dni się liczyły.", "Sukces to suma małych wysiłków, powtarzanych dzień po dniu.", "Wzrost i komfort nie mogą współistnieć.",
        "Dyscyplina to most między celami a osiągnięciami.", "Umysł jest wszystkim. Stajesz się tym, o czym myślisz.", "Jesteś silniejszy, niż myślisz. Bardziej zdolny, niż sobie wyobrażasz.",
        "Zacznij tam, gdzie jesteś. Użyj tego, co masz. Zrób, co możesz.", "Cierpliwość, wytrwałość i pot tworzą niezwyciężoną kombinację sukcesu.", "Nigdy nie jest za późno, by być tym, kim mogłeś być.",
        "W samym środku trudności kryją się możliwości.", "Charakteru nie można rozwinąć w spokoju i ciszy. Tylko przez doświadczenie prób i cierpienia można wzmocnić duszę.",
        "Natura nie spieszy się, a jednak wszystko jest osiągnięte.", "Spójrz głęboko w naturę, a wtedy wszystko zrozumiesz lepiej.", "Najlepszy czas na zasadzenie drzewa był 20 lat temu. Drugi najlepszy czas jest teraz."
    ];
    let currentQuestions, currentHabits, currentSentimentQuestions, currentDate, isAppInitialized = false;

    // --- KLASA ZARZĄDZANIA DANYMI ---
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

    // --- KLASA INTERFEJSU UŻYTKOWNIKA ---
    class UI {
        static buildSection(sectionId, title, emoji, containerSelector) {
            const panel = document.querySelector(containerSelector);
            if (!panel) return;
            const questions = currentQuestions[sectionId] || [];
            let html = `<div class="content-card" id="pdf-content-${sectionId}"><h2 class="content-header">${emoji} ${title}</h2><div>`;
            questions.forEach(q => html += `<div class="question-group"><label for="q-${q.id}">${q.text}</label><textarea id="q-${q.id}" data-id="${q.id}"></textarea></div>`);
            if (sectionId === 'evening') {
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
            if (sectionId === 'evening') {
                const eveningData = entry.evening || {};
                currentSentimentQuestions.forEach(sq => UI.updateStars(document.querySelector(`#evening-panel .sentiment-buttons[data-id="${sq.id}"]`), eveningData[sq.id + 'Sent']));
                const habits = eveningData.habits || {};
                currentHabits.forEach(h => { const cb = document.querySelector(`#evening-panel [data-habit-name="${h}"]`); if(cb) cb.checked = habits[h] || false; });
            }
        }
        static saveInput(sectionId, target) { const id = target.dataset.id, entry = AppStorage.getDayEntry(currentDate); if(!entry[sectionId]) entry[sectionId] = {}; entry[sectionId][id] = target.value; AppStorage.saveDayEntry(currentDate, entry); }
        static saveHabitStatus(checkbox) { const name = checkbox.dataset.habitName, entry = AppStorage.getDayEntry(currentDate); if(!entry.evening) entry.evening = {}; if(!entry.evening.habits) entry.evening.habits = {}; entry.evening.habits[name] = checkbox.checked; AppStorage.saveDayEntry(currentDate, entry); }
        static setSentiment(starEl) { const value = starEl.dataset.value, container = starEl.parentElement, catId = container.dataset.id; UI.updateStars(container, value); const entry = AppStorage.getDayEntry(currentDate); if(!entry.evening) entry.evening = {}; entry.evening[catId + 'Sent'] = value; AppStorage.saveDayEntry(currentDate, entry); }
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

    // --- KLASA STATYSTYK ---
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
                const dateKey = dateFns.formatISO(date, { representation: 'date' });
                data.labels.push(dateKey);
                const entry = AppStorage.getDayEntry(dateKey);
                if (entry && entry.evening) {
                    entriesFound++;
                    currentSentimentQuestions.forEach(sq => { data.sentiments[sq.id].push(entry.evening[sq.id + 'Sent'] || null); });
                    currentHabits.forEach(habit => { if (entry.evening.habits && entry.evening.habits[habit]) data.habits[habit]++; });
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
            Chart.defaults.font.family = "'Inter', sans-serif";
            Chart.defaults.color = style.getPropertyValue('--text-muted');
            const chartOptions = (scales) => ({
                responsive: true, maintainAspectRatio: false, scales, plugins: { legend: { position: 'bottom' } },
                interaction: { intersect: false, mode: 'index' }, layout: { padding: 10 }
            });
            this.chartInstances.sentiment = new Chart(document.getElementById('sentimentChart'), {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: currentSentimentQuestions.map((sq, i) => ({
                        label: sq.question.split(' ').slice(1).join(' '),
                        data: data.sentiments[sq.id],
                        borderColor: [style.getPropertyValue('--primary'), style.getPropertyValue('--accent'), '#00bcd4'][i],
                        tension: 0.4, spanGaps: true, pointRadius: 3, pointHoverRadius: 6, borderWidth: 2
                    }))
                },
                options: chartOptions({ x: { type: 'time', time: { unit: 'day' }, grid: { display: false } }, y: { beginAtZero: true, max: 5 } }),
            });
            this.chartInstances.habits = new Chart(document.getElementById('habitsChart'), {
                type: 'bar',
                data: { labels: Object.keys(data.habits), datasets: [{ label: 'Dni zrealizowane (ostatnie 30)', data: Object.values(data.habits), backgroundColor: [style.getPropertyValue('--primary'), style.getPropertyValue('--accent'), '#00bcd4'], borderRadius: 4 }] },
                options: chartOptions({ y: { max: 30 } })
            });
        }
    }

    // --- KLASA USTAwień ---
    class Settings {
        static init() {
            document.getElementById('save-settings-btn').addEventListener('click', () => this.saveAndClose());
            document.getElementById('settings-btn').addEventListener('click', () => this.open());
            const modal = document.getElementById('settingsModal');
            document.querySelector('.close-modal-btn').addEventListener('click', () => closeModal('settingsModal'));
            modal.addEventListener('click', e => {
                const tab = e.target.closest('.modal-tab');
                if (tab) this.switchTab(tab);
                const themeOption = e.target.closest('.theme-option');
                if (themeOption) this.handleThemeChange(themeOption);
                const actionBtn = e.target.closest('.action-btn');
                if(actionBtn) {
                    const { action, section, index } = actionBtn.dataset;
                    this[action](section, index);
                }
            });
            modal.addEventListener('input', e => {
                const { section, index, id } = e.target.dataset;
                if(section === 'summary') this.tempSentimentQuestions[index].question = e.target.value;
                else if (section === 'habits') this.tempHabits[index] = e.target.value;
                else this.tempQuestions[section].find(q => q.id === id).text = e.target.value;
            });
        }
        static open() {
            this.tempQuestions = JSON.parse(JSON.stringify(AppStorage.getQuestions()));
            this.tempHabits = [...AppStorage.getHabits()];
            this.tempSentimentQuestions = JSON.parse(JSON.stringify(AppStorage.getSentimentQuestions()));
            this.switchTab(document.querySelector('#settingsModal .modal-tab.active'));
            openModal('settingsModal');
        }
        static switchTab(tabEl) {
            document.querySelectorAll('#settingsModal .modal-tab, #settingsModal .modal-tab-panel').forEach(el => el.classList.remove('active'));
            tabEl.classList.add('active');
            const sectionId = tabEl.dataset.section;
            document.getElementById(`s-${sectionId}-panel`).classList.add('active');
            this.render(sectionId);
        }
        static render(sectionId) {
            const container = document.getElementById(`s-${sectionId}-panel`);
            let html = '';
            const renderItem = (value, section, index, placeholder, id = '') => `<div class="settings-item"><input type="text" data-section="${section}" data-index="${index}" ${id ? `data-id="${id}"` : ''} value="${value}" placeholder="${placeholder}"><button class="btn action-btn" data-action="deleteItem" data-section="${section}" data-index="${index}">Usuń</button></div>`;
            const renderList = (title, items, section, placeholder, textKey) => `<h4>${title}</h4><div class="settings-list">${items.map((item, i) => renderItem(textKey ? item[textKey] : item, section, i, placeholder, textKey ? item.id : '')).join('')}</div><button class="btn btn-tertiary action-btn" data-action="addItem" data-section="${section}">+ Dodaj</button>`;
            
            switch(sectionId) {
                case 'appearance': const theme = AppStorage.getSetting('theme') || 'las'; html = `<h4>Wybierz motyw</h4><div class="theme-selector" style="display:flex; gap:10px;">${['las', 'ocean', 'fokus'].map(t => `<div class="theme-option" data-theme="${t}" style="flex:1; text-align:center; padding:10px; border:2px solid ${theme === t ? 'var(--accent)' : 'var(--border)'}; border-radius:var(--border-radius-md); cursor:pointer;"><span>${{'las':'🌱','ocean':'🌊','fokus':'⚡'}[t]}</span> ${t.charAt(0).toUpperCase() + t.slice(1)}</div>`).join('')}</div><h4 style="margin-top:20px;">Tryb Ciemny</h4><button id="dark-mode-btn" class="btn btn-tertiary">${document.documentElement.classList.contains('dark-mode') ? 'Wyłącz' : 'Włącz'} tryb ciemny</button>`; break;
                case 'morning': case 'evening': html = renderList(`Pytania - ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`, this.tempQuestions[sectionId], sectionId, 'Treść pytania', 'text'); break;
                case 'summary': html = renderList('Pytania Podsumowujące', this.tempSentimentQuestions, 'summary', 'Treść pytania', 'question'); break;
                case 'habits': html = renderList('Twoje Nawyki', this.tempHabits, 'habits', 'Nazwa nawyku'); break;
            }
            container.innerHTML = html;
            const darkModeBtn = document.getElementById('dark-mode-btn');
            if(darkModeBtn) darkModeBtn.addEventListener('click', toggleDarkMode);
        }
        static handleThemeChange(option) { applyTheme(option.dataset.theme); this.render('appearance'); }
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
    document.querySelector('#auth-page').classList.remove('active');
    applyTheme(AppStorage.getSetting('theme'));
    document.documentElement.classList.toggle('dark-mode', AppStorage.getSetting('darkMode'));
    loadAppData();
    currentDate = dateFns.formatISO(new Date(), { representation: 'date' });
    document.getElementById('dailyQuote').textContent = quotes[Math.floor(Math.random() * quotes.length)];
    bindAppEventListeners();
    rebuildAllSections();
    loadDate(currentDate);

    // LOGIKA REJESTRACJI I AKTUALIZACJI SERVICE WORKERA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(reg => {
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            showNotification('Dostępna jest nowa wersja aplikacji!', true);
                        }
                    }
                });
            });
        }).catch(error => {
            console.error('Rejestracja Service Workera nie powiodła się:', error);
        });
    }
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
        document.getElementById('pdf-btn').addEventListener('click', exportPDF);
        document.getElementById('logout-btn').addEventListener('click', () => { sessionStorage.clear(); window.location.reload(); });
        document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', e => {
            document.querySelectorAll('.tab, .section').forEach(el => el.classList.remove('active'));
            const sectionId = e.currentTarget.dataset.section;
            e.currentTarget.classList.add('active');
            document.getElementById(`${sectionId}-panel`).classList.add('active');
            if (sectionId === 'stats') Stats.render('#stats-panel');
        }));
    }
    function rebuildAllSections() { ['morning', 'evening'].forEach(s => UI.buildSection(s, s.charAt(0).toUpperCase()+s.slice(1), {'morning':'🌅','evening':'🌙'}[s], `#${s}-panel`)); }
    function loadDate(newDate) { currentDate = newDate; document.getElementById('currentDate').value = currentDate; ['morning', 'evening'].forEach(s => UI.loadSectionData(s, currentDate)); }
    function changeDate(d) { const dt = dateFns.addDays(new Date(currentDate), d); loadDate(dateFns.formatISO(dt, { representation: 'date' })); }
    function applyTheme(themeName) { document.documentElement.dataset.theme = themeName; AppStorage.setSetting('theme', themeName); const metaThemeColor = document.querySelector('meta[name="theme-color"]'); if(metaThemeColor) metaThemeColor.content = getComputedStyle(document.documentElement).getPropertyValue('--card').trim(); }
    function toggleDarkMode() { const isDark = document.documentElement.classList.toggle('dark-mode'); AppStorage.setSetting('darkMode', isDark); applyTheme(AppStorage.getSetting('theme')); if(document.getElementById('dark-mode-btn')) document.getElementById('dark-mode-btn').textContent = `${isDark ? 'Wyłącz' : 'Włącz'} tryb ciemny`;}
    function showNotification(msg, withReloadButton = false) {
    const el = document.getElementById('notification');
    if (el) {
        el.innerHTML = msg; // Użyj innerHTML, aby móc wstawić przycisk
        if (withReloadButton) {
            const reloadBtn = document.createElement('button');
            reloadBtn.textContent = 'Odśwież';
            reloadBtn.className = 'btn btn-primary';
            reloadBtn.style.marginLeft = '15px';
            reloadBtn.onclick = () => window.location.reload();
            el.appendChild(reloadBtn);
        }
        el.classList.add('active');
        // Powiadomienie nie zniknie automatycznie, jeśli ma przycisk
        if (!withReloadButton) {
            setTimeout(() => el.classList.remove('active'), 2800);
        }
    }
}
    function openModal(id) { document.getElementById(id)?.classList.add('active'); }
    function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }
    async function exportPDF() {
        showNotification('Przygotowuję PDF...');
        try {
            const { jsPDF } = window.jspdf;
            const morningEl = document.getElementById('pdf-content-morning');
            const eveningEl = document.getElementById('pdf-content-evening');
            if (!morningEl || !eveningEl) throw new Error('Nie znaleziono treści do eksportu.');

            const morningCanvas = await html2canvas(morningEl, { scale: 2, backgroundColor: getComputedStyle(document.body).getPropertyValue('--card') });
            const eveningCanvas = await html2canvas(eveningEl, { scale: 2, backgroundColor: getComputedStyle(document.body).getPropertyValue('--card') });
            
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 10;
            const contentWidth = pageWidth - 2 * margin;

            const addImageToPdf = (canvas, yOffset) => {
                const imgData = canvas.toDataURL('image/png');
                const imgHeight = canvas.height * contentWidth / canvas.width;
                doc.addImage(imgData, 'PNG', margin, yOffset, contentWidth, imgHeight);
                return imgHeight;
            };
            
            doc.setFontSize(10); doc.setTextColor(150);
            doc.text(`Daily Growth - ${currentDate}`, pageWidth / 2, margin, { align: 'center' });

            let currentY = margin + 5;
            currentY += addImageToPdf(morningCanvas, currentY);
            currentY += 5;
            
            const eveningImgHeight = eveningCanvas.height * contentWidth / eveningCanvas.width;
            if (currentY + eveningImgHeight > pageHeight - margin) {
                doc.addPage();
                currentY = margin;
            }
            addImageToPdf(eveningCanvas, currentY);

            const pdfBlob = doc.output('blob');
            const blobUrl = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `Daily-Growth-${currentDate}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);

            showNotification('PDF pobrany pomyślnie! ✅');

        } catch (error) {
            console.error('Błąd podczas generowania PDF:', error);
            showNotification('Wystąpił błąd przy tworzeniu PDF.');
        }
    }

    // --- INICJALIZACJA APLIKACJI ---
    document.addEventListener('DOMContentLoaded', () => {
        if (sessionStorage.getItem('isLoggedIn')) {
            initializeApp();
        } else {
            const authPage = document.querySelector('#auth-page');
            authPage.classList.add('active');
            const authForm = document.getElementById('authForm');
            const toggleBtn = document.getElementById('toggleAuthBtn');
            const authTitle = document.getElementById('authTitle');
            const authSubmitBtn = document.getElementById('authSubmitBtn');
            const toggleText = document.getElementById('toggleText');
            let isLogin = true;
            toggleBtn.addEventListener('click', () => {
                isLogin = !isLogin;
                authTitle.textContent = isLogin ? 'Logowanie' : 'Rejestracja';
                authSubmitBtn.textContent = isLogin ? 'Zaloguj się' : 'Zarejestruj się';
                toggleText.textContent = isLogin ? 'Nie masz konta?' : 'Masz już konto?';
                toggleBtn.textContent = isLogin ? 'Zarejestruj się' : 'Zaloguj się';
            });
            authForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const login = document.getElementById('authLogin').value;
                if (!login) { document.getElementById('authError').textContent = 'Login nie może być pusty.'; return; }
                document.getElementById('authError').textContent = '';
                // Symulacja logowania/rejestracji bez backendu
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('dg_user', login);
                initializeApp();
            });
        }
        Settings.init();
    });

</script>
</body>
</html>