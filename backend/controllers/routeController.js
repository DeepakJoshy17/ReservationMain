
const db = require('../database/db'); // Adjust to your database connection file

// Get all routes
exports.getAllRoutes = (req, res) => {
  const query = 'SELECT * FROM Routes';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching routes:', err);
      return res.status(500).json({ error: 'Failed to fetch routes' });
    }
    res.json(rows);
  });
};

// Create a new route
exports.createRoute = (req, res) => {
  const { route_name, start_location, end_location } = req.body;

  if (!route_name || !start_location || !end_location) {
    return res.status(400).json({ error: 'All fields are required ' });
  }

  const query = 'INSERT INTO Routes (route_name, start_location, end_location) VALUES (?, ?, ?)';
  db.run(query, [route_name, start_location, end_location], function (err) {
    if (err) {
      console.error('Error creating route:', err);
      return res.status(500).json({ error: 'Failed to create route ' });
    }
    res.status(201).json({ route_id: this.lastID });
  });
};

// Update a route
exports.updateRoute = (req, res) => {
  const { route_id } = req.params;
  const { route_name, start_location, end_location } = req.body;

  if (!route_name || !start_location || !end_location) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'UPDATE Routes SET route_name = ?, start_location = ?, end_location = ? WHERE route_id = ?';
  db.run(query, [route_name, start_location, end_location, route_id], function (err) {
    if (err) {
      console.error('Error updating route:', err);
      return res.status(500).json({ error: 'Failed to update route' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json({ message: 'Route updated successfully' });
  });
};

// Delete a route
exports.deleteRoute = (req, res) => {
  const { route_id } = req.params;

  const query = 'DELETE FROM Routes WHERE route_id = ?';
  db.run(query, [route_id], function (err) {
    if (err) {
      console.error('Error deleting route:', err);
      return res.status(500).json({ error: 'Failed to delete route' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json({ message: 'Route deleted successfully' });
  });
};
