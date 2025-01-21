
const db = require('../database/db');

// Get all boats
exports.getAllBoats = (req, res) => {
  const query = 'SELECT * FROM Boats';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching boats:', err);
      return res.status(500).json({ error: 'Failed to fetch boats' });
    }
    res.json(rows);
  });
};

// Create a new boat
exports.createBoat = (req, res) => {
  const { boat_name, capacity, status } = req.body;

  if (!boat_name || !capacity) {
    return res.status(400).json({ error: 'Boat name and capacity are required' });
  }

  const query = 'INSERT INTO Boats (boat_name, capacity, status) VALUES (?, ?, ?)';
  db.run(query, [boat_name, capacity, status || 'Active'], function (err) {
    if (err) {
      console.error('Error creating boat:', err);
      return res.status(500).json({ error: 'Failed to create boat' });
    }
    res.status(201).json({ boat_id: this.lastID });
  });
};

// Update a boat
exports.updateBoat = (req, res) => {
  const { boat_id } = req.params;
  const { boat_name, capacity, status } = req.body;

  if (!boat_name || !capacity) {
    return res.status(400).json({ error: 'Boat name and capacity are required' });
  }

  const query = 'UPDATE Boats SET boat_name = ?, capacity = ?, status = ? WHERE boat_id = ?';
  db.run(query, [boat_name, capacity, status, boat_id], function (err) {
    if (err) {
      console.error('Error updating boat:', err);
      return res.status(500).json({ error: 'Failed to update boat' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Boat not found' });
    }

    res.json({ message: 'Boat updated successfully' });
  });
};

// Delete a boat
exports.deleteBoat = (req, res) => {
  const { boat_id } = req.params;

  const query = 'DELETE FROM Boats WHERE boat_id = ?';
  db.run(query, [boat_id], function (err) {
    if (err) {
      console.error('Error deleting boat:', err);
      return res.status(500).json({ error: 'Failed to delete boat' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Boat not found' });
    }

    res.json({ message: 'Boat deleted successfully' });
  });
};
