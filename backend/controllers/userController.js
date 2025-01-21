const db = require('../database/db');

// Create User
const createUser = (req, res) => {
  const { name, email, password, phone_number, address, role } = req.body;

  const query = 'INSERT INTO Users (name, email, password, phone_number, address, role) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(query, [name, email, password, phone_number, address, role || 'User'], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error creating user', details: err.message });
    }
    res.status(201).json({ message: 'User created successfully', userId: this.lastID });
  });
};
const updateUser = (req, res) => {
  const { user_id, name, email, password, phone_number, address, role } = req.body;

  const query = 'UPDATE Users SET name = ?, email = ?, password = ?, phone_number = ?, address = ?, role = ? WHERE user_id = ?';
  db.run(query, [name, email, password, phone_number, address, role, user_id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error updating user', details: err.message });
    }
    res.json({ message: 'User updated successfully' });
  });
};
const deleteUser = (req, res) => {
  const { user_id } = req.params;

  const query = 'DELETE FROM Users WHERE user_id = ?';
  db.run(query, [user_id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error deleting user', details: err.message });
    }
    res.json({ message: 'User deleted successfully' });
  });
};
const getUsers = (req, res) => {
  const query = 'SELECT * FROM Users';
  db.all(query, [], (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching users', details: err.message });
    }
    res.json({ users });
  });
};

module.exports = { getUsers, createUser, deleteUser, updateUser };
