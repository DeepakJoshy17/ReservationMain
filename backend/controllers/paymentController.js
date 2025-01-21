const db = require('../database/db');

// Fetch all payments
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

// Create a new payment
const createPayment = (req, res) => {
  const { amount, payment_method, payment_status, transaction_id } = req.body;
  const query = `INSERT INTO Payments (amount, payment_method, payment_status, transaction_id) 
                 VALUES (?, ?, ?, ?)`;
  db.run(query, [amount, payment_method, payment_status || 'Pending', transaction_id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create payment' });
    }
    res.status(201).json({ payment_id: this.lastID });
  });
};

// Update a payment
const updatePayment = (req, res) => {
  const { payment_id } = req.params;
  const { amount, payment_method, payment_status, transaction_id } = req.body;
  const query = `UPDATE Payments SET amount = ?, payment_method = ?, payment_status = ?, transaction_id = ? 
                 WHERE payment_id = ?`;
  db.run(query, [amount, payment_method, payment_status, transaction_id, payment_id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update payment' });
    }
    res.status(200).json({ updated: this.changes });
  });
};

// Delete a payment
const deletePayment = (req, res) => {
  const { payment_id } = req.params;
  const query = 'DELETE FROM Payments WHERE payment_id = ?';

  db.run(query, [payment_id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete payment' });
    }
    res.status(200).json({ deleted: this.changes });
  });
};

module.exports = {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
};
