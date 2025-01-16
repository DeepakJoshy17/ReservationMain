const db = require('../database/db');

// Signup controller
const signup = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.run(query, [name, email, password], function (err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to create user' });
    }
    res.status(201).json({ message: 'User created successfully', userId: this.lastID });
  });
};

// Login controller
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.get(query, [email, password], (err, user) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to log in' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Save session
    req.session.userId = user.id;
    res.json({ message: 'Logged in successfully', user });
  });
};

// Logout controller
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session error:', err.message);
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};

module.exports = { signup, login, logout };
