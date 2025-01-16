const db = require('../database/db');

// Controller to get all users
const getAllUsers = (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
};

// Controller to add a new user
const addUser = (req, res) => {
  const { name, email, password, phone_number, address, role } = req.body;

  // Log incoming request data for debugging
  console.log('Received data:', req.body);

  // Validation check for required fields
  if (!name || !email || !password) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const query =
    'INSERT INTO users (name, email, password, phone_number, address, role) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(query, [name, email, password, phone_number, address, role || 'User'], function (err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: err.message });
    } else {
      console.log('User added successfully with ID:', this.lastID);
      res.status(201).json({ message: 'User added successfully', userId: this.lastID });
    }
  });
};

module.exports = { getAllUsers, addUser };
