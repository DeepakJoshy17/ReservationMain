const db = require('../database/db');

// Signup controller

const signup = (req, res) => {
  const { name, email, password, phone_number, address, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // SQL query to insert the user
  const query = 'INSERT INTO users (name, email, password, phone_number, address, role) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.run(query, [name, email, password, phone_number, address, role], function (err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to create user' });
    }
    res.status(201).json({ message: 'User created successfully', userId: this.lastID });
  });
};

module.exports = { signup };


// Login controller
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
    req.session.userName = user.name; // Save the user's name in the session
    res.json({ message: 'Logged in successfully', user });
  });
};

// Get Profile controller (fetch user info from session)
const getProfile = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const query = 'SELECT * FROM users WHERE id = ?';
  db.get(query, [req.session.userId], (err, user) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    res.json({ user });
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

module.exports = { signup, login, logout, getProfile };
