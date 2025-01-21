const db = require('../database/db');

// Controller function to fetch all boats (to use in dropdown)
exports.getBoats = (req, res) => {
  db.all('SELECT * FROM Boats', [], (err, boats) => {
    if (err) {
      console.error('Error fetching boats:', err);
      return res.status(500).json({ message: 'Failed to fetch boats' });
    }
    res.json(boats);
  });
};

// Controller function to fetch all seats for a specific boat
exports.getSeats = (req, res) => {
  const boat_id = req.params.boat_id;

  db.all('SELECT * FROM Seats WHERE boat_id = ?', [boat_id], (err, rows) => {
    if (err) {
      console.error('Error fetching seats:', err);
      return res.status(500).json({ message: 'Failed to fetch seats' });
    }
    res.json(rows);
  });
};

// Controller function to create a new seat
exports.createSeat = (req, res) => {
  const { boat_id, seat_number, type } = req.body;

  db.run(
    'INSERT INTO Seats (boat_id, seat_number, type) VALUES (?, ?, ?)',
    [boat_id, seat_number, type],
    function (err) {
      if (err) {
        console.error('Error creating seat:', err);
        return res.status(500).json({ message: 'Failed to create seat' });
      }
      res.status(201).json({ seat_id: this.lastID });
    }
  );
};

// Controller function to update an existing seat
exports.updateSeat = (req, res) => {
  const { seat_id } = req.params;
  const { seat_number, type, boat_id } = req.body;

  db.run(
    'UPDATE Seats SET seat_number = ?, type = ?, boat_id = ? WHERE seat_id = ?',
    [seat_number, type, boat_id, seat_id],
    function (err) {
      if (err) {
        console.error('Error updating seat:', err);
        return res.status(500).json({ message: 'Failed to update seat' });
      }
      res.status(200).json({ message: 'Seat updated successfully' });
    }
  );
};

// Controller function to delete a seat
exports.deleteSeat = (req, res) => {
  const { seat_id } = req.params;

  db.run(
    'DELETE FROM Seats WHERE seat_id = ?',
    [seat_id],
    function (err) {
      if (err) {
        console.error('Error deleting seat:', err);
        return res.status(500).json({ message: 'Failed to delete seat' });
      }
      res.status(200).json({ message: 'Seat deleted successfully' });
    }
  );
};
