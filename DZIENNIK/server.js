const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const users = {}; // "Baza danych" w pamięci

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/register', (req, res) => {
    console.log('Otrzymano żądanie rejestracji:', req.body);
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ message: "Brak loginu lub hasła." });
    if (users[login]) return res.status(400).json({ message: "Taki login już istnieje." });
    users[login] = password;
    console.log('Zarejestrowano użytkownika:', login);
    res.sendStatus(200);
});

app.post('/api/login', (req, res) => {
    console.log('Otrzymano żądanie logowania:', req.body);
    const { login, password } = req.body;
    if (!users[login] || users[login] !== password) {
        console.log('Błąd logowania - nieprawidłowe dane dla:', login);
        return res.status(401).json({ message: "Nieprawidłowy login lub hasło." });
    }
    console.log('Zalogowano użytkownika:', login);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na http://localhost:${PORT}`);
});