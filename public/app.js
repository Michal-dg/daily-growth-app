'use strict';
console.log("START: Wczytano plik app.js");

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
const quotes = [ "Nawet najdalszą podróż zaczyna się od pierwszego kroku. 🌱", "Bądź zmianą, którą pragniesz ujrzeć w świecie. 🚀", "Jedynym sposobem na wielką pracę jest kochanie tego, co robisz. ✨" ];

let currentQuestions, currentHabits, currentSentimentQuestions, currentDate, isAppInitialized = false;

// --- KLASY ---
class AppStorage {
    static get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
    static set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) { console.error("Błąd zapisu do localStorage", e); } }
    static userKey(prefix) { return `dg_${prefix}_${sessionStorage.getItem('dg_user')}`; }
    static getDayEntry(date) { return this.get(this.userKey(`entry_${date}`)) || {}; }
    static saveDayEntry(date, entry) { this.set(this.userKey(`entry_${date}`), entry); showNotification("Auto-zapisano ✅"); }
    static getQuestions() { return this.get(this.userKey('questions')) || initialQuestions; }
    static getHabits() { return this.get(this.userKey('habits')) || initialHabits; }
    static getSentimentQuestions() { return this.get(this.userKey('sentiments')) || initialSentimentQuestions; }
}

class UI {
    static buildSection(sectionId, title, emoji, containerSelector) {
        const panel = document.querySelector(containerSelector);
        if (!panel) return;
        console.log(`[UI.buildSection] Budowanie sekcji: ${sectionId}`);
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

        console.log(`[UI.buildSection] Podpinanie zdarzeń dla sekcji: ${sectionId}`);
        panel.querySelectorAll('textarea').forEach(el => el.addEventListener('input', e => UI.saveInput(sectionId, e.target)));
        panel.querySelectorAll('input[type="checkbox"]').forEach(el => el.addEventListener('change', e => UI.saveHabitStatus(e.target)));
        panel.querySelectorAll('.sentiment-star').forEach(star => star.addEventListener('click', e => UI.setSentiment(e.currentTarget)));
        console.log(`[UI.buildSection] Zdarzenia podpięte dla: ${sectionId}`);
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
        console.log(`Zapisuję tekst dla ${sectionId}...`);
        const id = target.dataset.id;
        const entry = AppStorage.getDayEntry(currentDate);
        if (!entry[sectionId]) entry[sectionId] = {};
        entry[sectionId][id] = target.value;
        AppStorage.saveDayEntry(currentDate, entry);
    }
    static saveHabitStatus(checkbox) {
        const name = checkbox.dataset.habitName;
        console.log(`Zapisuję status nawyku: ${name} - ${checkbox.checked}`);
        const entry = AppStorage.getDayEntry(currentDate);
        if (!entry.wieczor) entry.wieczor = {};
        if (!entry.wieczor.habits) entry.wieczor.habits = {};
        entry.wieczor.habits[name] = checkbox.checked;
        AppStorage.saveDayEntry(currentDate, entry);
    }
    static setSentiment(starEl) {
        const value = starEl.dataset.value;
        const catId = starEl.parentElement.dataset.id;
        console.log(`Zapisuję ocenę: ${catId} - ${value}`);
        UI.updateStars(starEl.parentElement, value);
        const entry = AppStorage.getDayEntry(currentDate);
        if (!entry.wieczor) entry.wieczor = {};
        entry.wieczor[catId + 'Sent'] = value;
        AppStorage.saveDayEntry(currentDate, entry);
    }
    static updateStars(container, value) {
        if (!container) return;
        const stars = container.querySelectorAll('.sentiment-star');
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) { stars.forEach(star => star.classList.remove('active')); return; }
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value, 10);
            star.classList.toggle('active', numericValue >= starValue);
        });
    }
}

// --- LOGIKA GŁÓWNA ---
function initializeApp() {
    console.log("2. Uruchamianie initializeApp...");
    if (isAppInitialized) return;
    isAppInitialized = true;
    
    loadAppData();
    currentDate = dateFns.format(new Date(), 'yyyy-MM-dd');
    document.getElementById('dailyQuote').textContent = quotes[Math.floor(Math.random() * quotes.length)];
    bindAppEventListeners();
    rebuildAllSections();
    loadDate(currentDate);
    console.log("3. Aplikacja zainicjalizowana.");
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
    }));
}

function rebuildAllSections() {
    console.log("4. Przebudowywanie sekcji...");
    ['poranek', 'wieczor'].forEach(s => UI.buildSection(s, s.charAt(0).toUpperCase()+s.slice(1), {'poranek':'🌅','wieczor':'🌙'}[s], `#${s}-panel`));
    console.log("5. Sekcje przebudowane.");
}

function loadDate(newDate) {
    console.log(`Ładowanie danych dla daty: ${newDate}`);
    currentDate = newDate;
    document.getElementById('currentDate').value = currentDate;
    ['poranek', 'wieczor'].forEach(s => UI.loadSectionData(s, currentDate));
}

function changeDate(d) {
    const dt = dateFns.addDays(new Date(currentDate), d);
    loadDate(dateFns.format(dt, 'yyyy-MM-dd'));
}

function showNotification(msg) {
    const el = document.getElementById('notification');
    if (el) {
        el.innerHTML = msg;
        el.classList.add('active');
        setTimeout(() => el.classList.remove('active'), 2800);
    }
}

// Nasłuchiwanie na załadowanie strony
document.addEventListener('DOMContentLoaded', () => {
    console.log("1. DOMContentLoaded - strona gotowa.");
    if (!sessionStorage.getItem('dg_user')) {
        sessionStorage.setItem('dg_user', 'default_user');
    }
    initializeApp();
});