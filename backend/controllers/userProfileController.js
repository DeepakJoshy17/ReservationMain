const db = require('../database/db');

// Get user details
const getUserProfile = (req, res) => {
  const userId = req.params.id;
  console.log(`📢 Fetching profile for User ID: ${userId}`); // Log user ID

  const query = 'SELECT user_id, name, email, phone_number, address FROM Users WHERE user_id = ?';

  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error('❌ Database Error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      console.warn(`⚠️ User with ID ${userId} not found`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ Profile found:`, row);
    res.json(row);
  });
};

// Update user details
const updateUserProfile = (req, res) => {
  const userId = req.params.id;
  const { name, phone_number, address } = req.body;

  console.log(`📢 Updating profile for User ID: ${userId}`, req.body); // Log incoming data

  const query = 'UPDATE Users SET name = ?, phone_number = ?, address = ? WHERE user_id = ?';

  db.run(query, [name, phone_number, address, userId], function (err) {
    if (err) {
      console.error('❌ Database Error:', err.message);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    if (this.changes === 0) {
      console.warn(`⚠️ No changes made or User ID ${userId} not found`);
      return res.status(404).json({ error: 'User not found or no changes made' });
    }

    console.log(`✅ Profile updated for User ID: ${userId}`);
    res.json({ user_id: userId, name, phone_number, address });
  });
};

module.exports = { getUserProfile, updateUserProfile };
