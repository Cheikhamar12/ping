const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
// Configuration de CORS
app.use(cors({
    origin: 'http://localhost:5173', // URL de votre frontend
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Si vous utilisez des cookies ou des sessions
}));

const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Routes

// 1. Inscription
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, hashedPassword, phone], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de l\'inscription', error: err });
      }
      res.status(201).json({ message: 'Utilisateur créé avec succès' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// 2. Connexion
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Connexion réussie', userId: user.id });
  });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
