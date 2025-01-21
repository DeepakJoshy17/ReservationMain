const db = require('../database/db');

// Get session controller (fetch user info from session)
const getSession = (req, res) => {
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

module.exports = { getSession, logout };
