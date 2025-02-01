const db = require('../database/db'); // Import SQLite connection

// Check for schedule conflicts
const checkScheduleConflict = (boat_id, route_id, departure_time, arrival_time, callback) => {
  const query = `
    SELECT COUNT(*) AS conflict_count
    FROM Schedules
    WHERE 
      (
        -- Check if the same boat is already scheduled during the time interval
        boat_id = ?
        AND (
          (departure_time BETWEEN ? AND ?)
          OR (arrival_time BETWEEN ? AND ?)
          OR (? BETWEEN departure_time AND arrival_time)
          OR (? BETWEEN departure_time AND arrival_time)
        )
      )
      OR
      (
        -- Check if another boat is scheduled for the same route and time interval
        route_id = ?
        AND (
          (departure_time BETWEEN ? AND ?)
          OR (arrival_time BETWEEN ? AND ?)
          OR (? BETWEEN departure_time AND arrival_time)
          OR (? BETWEEN departure_time AND arrival_time)
        )
      )
  `;
  const params = [
    boat_id,
    departure_time,
    arrival_time,
    departure_time,
    arrival_time,
    departure_time,
    arrival_time,
    route_id,
    departure_time,
    arrival_time,
    departure_time,
    arrival_time,
    departure_time,
    arrival_time,
  ];

  db.get(query, params, (err, row) => {
    if (err) {
      console.error('Error checking schedule conflict:', err.message);
      return callback(err, null);
    }
    callback(null, row.conflict_count > 0);
  });
};

// Create a new schedule
// Create a new schedule
const createSchedule = (req, res) => {
  const { boat_id, route_id, departure_time, arrival_time, status } = req.body;

  if (!boat_id || !route_id || !departure_time || !arrival_time || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  checkScheduleConflict(boat_id, route_id, departure_time, arrival_time, (err, isConflict) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to check schedule conflict' });
    }

    if (isConflict) {
      return res.status(400).json({
        error: 'Schedule conflict detected. Either the boat is already scheduled or another boat is scheduled for the same route and time interval.',
      });
    }

    const query = `
      INSERT INTO Schedules (boat_id, route_id, departure_time, arrival_time, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [boat_id, route_id, departure_time, arrival_time, status];

    db.run(query, params, function (err) {
      if (err) {
        console.error('Error creating schedule:', err.message);
        return res.status(500).json({ error: 'Failed to create schedule' });
      }
      res.json({ message: 'Schedule created successfully', schedule_id: this.lastID });
    });
  });
};


// Update an existing schedule
const updateSchedule = (req, res) => {
  const { schedule_id } = req.params;
  const { boat_id, route_id, departure_time, arrival_time, status } = req.body;

  if (!boat_id || !route_id || !departure_time || !arrival_time || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if schedule conflicts with existing schedules
  checkScheduleConflict(boat_id, route_id, departure_time, arrival_time, (err, isConflict) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to check schedule conflict' });
    }

    if (isConflict) {
      return res.status(400).json({
        error: 'Schedule conflict detected. Either the boat is already scheduled or another boat is scheduled for the same route and time interval.',
      });
    }

    // Update the schedule if no conflict
    const query = `
      UPDATE Schedules
      SET boat_id = ?, route_id = ?, departure_time = ?, arrival_time = ?, status = ?
      WHERE schedule_id = ?
    `;
    const params = [boat_id, route_id, departure_time, arrival_time, status, schedule_id];

    db.run(query, params, function (err) {
      if (err) {
        console.error('Error updating schedule:', err.message);
        return res.status(500).json({ error: 'Failed to update schedule' });
      }

      // Check if any row was affected
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      res.json({ message: 'Schedule updated successfully', updated: this.changes });
    });
  });
};


// Delete a schedule
const deleteSchedule = (req, res) => {
  const { schedule_id } = req.params;

  const query = `DELETE FROM Schedules WHERE schedule_id = ?`;

  db.run(query, [schedule_id], function (err) {
    if (err) {
      console.error('Error deleting schedule:', err.message);
      return res.status(500).json({ error: 'Failed to delete schedule' });
    }
    res.json({ message: 'Schedule deleted successfully', deleted: this.changes });
  });
};

// Get all schedules
const getSchedules = (req, res) => {
  const query = `
    SELECT s.*, b.boat_name, r.route_name
    FROM Schedules s
    JOIN Boats b ON s.boat_id = b.boat_id
    JOIN Routes r ON s.route_id = r.route_id
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching schedules:', err.message);
      return res.status(500).json({ error: 'Failed to fetch schedules' });
    }
    res.json(rows);
  });
};

// Get all boats
const getBoats = (req, res) => {
  const query = `SELECT boat_id, boat_name FROM Boats`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching boats:', err.message);
      return res.status(500).json({ error: 'Failed to fetch boats' });
    }
    res.json(rows);
  });
};

// Get all routes
const getRoutes = (req, res) => {
  const query = `SELECT route_id, route_name FROM Routes`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching routes:', err.message);
      return res.status(500).json({ error: 'Failed to fetch routes' });
    }
    res.json(rows);
  });
};

module.exports = {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getBoats,
  getRoutes,
};
