// controllers/bookingController.js
const db = require('../database/db');

// Fetch all bookings
const getAllBookings = (req, res) => {
  const query = 'SELECT * FROM Seat_Bookings';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
    res.status(200).json(rows);
  });
};

// Create a new booking
const createBooking = (req, res) => {
  const { schedule_id, user_id, seat_id, start_stop_id, end_stop_id, payment_status, payment_id } = req.body;
  const query = `INSERT INTO Seat_Bookings (schedule_id, user_id, seat_id, start_stop_id, end_stop_id, payment_status, payment_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(query, [schedule_id, user_id, seat_id, start_stop_id, end_stop_id, payment_status || 'Pending', payment_id || null], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create booking' });
    }
    res.status(201).json({ booking_id: this.lastID });
  });
};

// Update a booking
const updateBooking = (req, res) => {
  const { booking_id } = req.params;
  const { schedule_id, user_id, seat_id, start_stop_id, end_stop_id, payment_status, payment_id } = req.body;
  const query = `UPDATE Seat_Bookings SET schedule_id = ?, user_id = ?, seat_id = ?, start_stop_id = ?, end_stop_id = ?, payment_status = ?, payment_id = ?
                 WHERE booking_id = ?`;
  db.run(query, [schedule_id, user_id, seat_id, start_stop_id, end_stop_id, payment_status, payment_id, booking_id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update booking' });
    }
    res.status(200).json({ updated: this.changes });
  });
};


// Delete a booking
const deleteBooking = (req, res) => {
  const { booking_id } = req.params;
  const query = 'DELETE FROM Seat_Bookings WHERE booking_id = ?';
  db.run(query, [booking_id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete booking' });
    }
    res.status(200).json({ deleted: this.changes });
  });
};

// Fetch all dropdown data (schedules, users, seats, route stops, and payments)
const getAllSchedules = (req, res) => {
  const query = 'SELECT * FROM Schedules';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch schedules' });
    }
    res.status(200).json(rows);
  });
};

const getAllUsers = (req, res) => {
  const query = 'SELECT * FROM Users';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.status(200).json(rows);
  });
};

const getAllSeats = (req, res) => {
  const query = 'SELECT * FROM Seats';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch seats' });
    }
    res.status(200).json(rows);
  });
};

const getAllRouteStops = (req, res) => {
  const query = 'SELECT * FROM Route_Stops';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch route stops' });
    }
    res.status(200).json(rows);
  });
};

const getAllPayments = (req, res) => {
  const query = 'SELECT * FROM Payments';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch payments' });
    }
    res.status(200).json(rows);
  });
};

module.exports = {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getAllSchedules,
  getAllUsers,
  getAllSeats,
  getAllRouteStops,
  getAllPayments
};
