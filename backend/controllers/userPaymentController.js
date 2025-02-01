const db = require('../database/db'); // Import SQLite connection

// Fetch price based on start_stop_id and end_stop_id
// Controller method to get pricing data based on start_stop_id and end_stop_id
const getPricing = (req, res) => {
  const { start_stop_id, end_stop_id } = req.params;

  const query = `
    SELECT price FROM Stop_Pricing
    WHERE start_stop_id = ? AND end_stop_id = ?
  `;
  
  db.get(query, [start_stop_id, end_stop_id], (err, row) => {
    if (err) {
      console.error('Error fetching pricing:', err);
      return res.status(500).json({ error: 'Failed to fetch pricing data' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Pricing not found for these stops' });
    }
    res.status(200).json(row); // Send price data back to frontend
  });
};


// Insert payment into Payments table
const createPayment = (req, res) => {
  const { amount, payment_method, payment_status, transaction_id } = req.body;

  const query = `
    INSERT INTO Payments (amount, payment_method, payment_status, transaction_id)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [amount, payment_method, payment_status, transaction_id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create payment' });
    }
    res.status(200).json({ payment_id: this.lastID }); // Return payment ID
  });
};

// Book selected seats and associate with payment_id
const bookSeats = (req, res) => {
  const { schedule_id, user_id, seat_ids, start_stop_id, end_stop_id, payment_id } = req.body;

  if (!payment_id) {
    return res.status(400).json({ error: 'Payment ID is required' });
  }

  if (!user_id || !schedule_id || !Array.isArray(seat_ids) || seat_ids.length === 0 || !start_stop_id || !end_stop_id) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  // Prepare placeholders for the SQL query
  const placeholders = seat_ids.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
  const values = seat_ids.flatMap((seat_id) => [
    schedule_id,
    user_id, 
    seat_id,
    start_stop_id,
    end_stop_id,
    'Pending',
    payment_id, // Associate payment_id with the booking
  ]);

  const query = `
    INSERT INTO Seat_Bookings (
      schedule_id, user_id, seat_id, start_stop_id, end_stop_id, payment_status, payment_id
    ) VALUES ${placeholders}
  `;

  db.run(query, values, function (err) {
    if (err) {
      console.error('Error booking seats:', err);
      return res.status(500).json({ error: 'Failed to book seats' });
    }
    res.status(200).json({ message: 'Seats booked successfully' });
  });
};

module.exports = { createPayment, bookSeats, getPricing };
