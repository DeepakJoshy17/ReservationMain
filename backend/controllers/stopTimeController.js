const db = require('../database/db');

// Get all routes
exports.getAllRoutes = (req, res) => {
  const query = 'SELECT route_id, route_name FROM Routes';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching routes:', err);
      return res.status(500).json({ error: 'Failed to fetch routes' });
    }
    res.json(rows); // Return list of routes
  });
};

// Get stops for a specific route
exports.getStopsForRoute = (req, res) => {
  const { route_id } = req.params;
  
  const query = `
    SELECT stop_id, location
    FROM Route_Stops
    WHERE route_id = ?
    ORDER BY stop_order
  `;
  
  db.all(query, [route_id], (err, rows) => {
    if (err) {
      console.error('Error fetching stops for route:', err);
      return res.status(500).json({ error: 'Failed to fetch stops for route' });
    }
    res.json(rows); // Return list of stops for the selected route
  });
};

// Fetch stop times for a given route
// Fetch stop times for a given route with route_name and stop_name
exports.getStopTimes = (req, res) => {
  const { route_id } = req.params;

  const query = `
    SELECT rst.route_id, rst.stop_id, rs.location AS stop_name, r.route_name, rst.arrival_time
    FROM Route_Stop_Times rst
    JOIN Route_Stops rs ON rst.stop_id = rs.stop_id
    JOIN Routes r ON rst.route_id = r.route_id
    WHERE rst.route_id = ?
  `;

  db.all(query, [route_id], (err, rows) => {
    if (err) {
      console.error('Error fetching stop times:', err);
      return res.status(500).json({ error: 'Failed to fetch stop times' });
    }
    res.json(rows);
  });
};


// Create a stop time entry
exports.createStopTime = (req, res) => {
  const { route_id, stop_id, arrival_time } = req.body;

  if (!route_id || !stop_id || !arrival_time) {
    return res.status(400).json({ error: 'Route, Stop, and Time are required' });
  }

  const query = `
    INSERT INTO Route_Stop_Times (route_id, stop_id, arrival_time)
    VALUES (?, ?, ?)
  `;

  db.run(query, [route_id, stop_id, arrival_time], function (err) {
    if (err) {
      console.error('Error creating stop time:', err);
      return res.status(500).json({ error: 'Failed to create stop time' });
    }
    res.status(201).json({ stop_time_id: this.lastID });
  });
};

// Update an existing stop time
exports.updateStopTime = (req, res) => {
  const { route_id, stop_id } = req.params;
  const { arrival_time } = req.body;

  if (!arrival_time) {
    return res.status(400).json({ error: 'Arrival time is required' });
  }

  const query = `
    UPDATE Route_Stop_Times
    SET arrival_time = ?
    WHERE route_id = ? AND stop_id = ?
  `;

  db.run(query, [arrival_time, route_id, stop_id], function (err) {
    if (err) {
      console.error('Error updating stop time:', err);
      return res.status(500).json({ error: 'Failed to update stop time' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Stop time not found' });
    }

    res.json({ message: 'Stop time updated successfully' });
  });
};

// Delete a stop time entry
exports.deleteStopTime = (req, res) => {
  const { route_id, stop_id } = req.params;

  const query = `
    DELETE FROM Route_Stop_Times
    WHERE route_id = ? AND stop_id = ?
  `;

  db.run(query, [route_id, stop_id], function (err) {
    if (err) {
      console.error('Error deleting stop time:', err);
      return res.status(500).json({ error: 'Failed to delete stop time' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Stop time not found' });
    }

    res.json({ message: 'Stop time deleted successfully' });
  });
};
