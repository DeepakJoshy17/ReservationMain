const db = require('../database/db'); // Ensure the db connection is correct

// Get all route stops
exports.getAllRouteStops = (req, res) => {
  const query = 'SELECT * FROM Route_Stops';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching route stops:', err);
      return res.status(500).json({ error: 'Failed to fetch route stops' });
    }
    res.json(rows); // Send route stops data
  });
};

// Create a new route stop
exports.createRouteStop = (req, res) => {
  const { route_id, location, stop_order, distance_km } = req.body;

  if (!route_id || !location || stop_order === undefined || distance_km === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO Route_Stops (route_id, location, stop_order, distance_km) VALUES (?, ?, ?, ?)';
  db.run(query, [route_id, location, stop_order, distance_km], function (err) {
    if (err) {
      console.error('Error creating route stop:', err);
      return res.status(500).json({ error: 'Failed to create route stop' });
    }
    res.status(201).json({ stop_id: this.lastID });
  });
};

// Update a route stop
exports.updateRouteStop = (req, res) => {
  const { stop_id } = req.params;
  const { route_id, location, stop_order, distance_km } = req.body;

  if (!route_id || !location || stop_order === undefined || distance_km === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'UPDATE Route_Stops SET route_id = ?, location = ?, stop_order = ?, distance_km = ? WHERE stop_id = ?';
  db.run(query, [route_id, location, stop_order, distance_km, stop_id], function (err) {
    if (err) {
      console.error('Error updating route stop:', err);
      return res.status(500).json({ error: 'Failed to update route stop' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Route stop not found' });
    }

    res.json({ message: 'Route stop updated successfully' });
  });
};

// Delete a route stop
exports.deleteRouteStop = (req, res) => {
  const { stop_id } = req.params;

  const query = 'DELETE FROM Route_Stops WHERE stop_id = ?';
  db.run(query, [stop_id], function (err) {
    if (err) {
      console.error('Error deleting route stop:', err);
      return res.status(500).json({ error: 'Failed to delete route stop' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Route stop not found' });
    }

    res.json({ message: 'Route stop deleted successfully' });
  });
};
