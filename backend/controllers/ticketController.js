const db = require('../database/db');

const generateTicket = (req, res) => {
  const { seat_booking_ids } = req.body;

  // Check if seat_booking_ids are valid
  if (!Array.isArray(seat_booking_ids) || seat_booking_ids.length === 0) {
    return res.status(400).json({ error: 'Invalid seat booking data' });
  }

  // Step 1: Get the payment amount from the first booking using seat_booking_ids
  const paymentQuery = `
    SELECT p.amount 
    FROM Seat_Bookings sb
    JOIN Payments p ON sb.payment_id = p.payment_id
    WHERE sb.booking_id IN (${seat_booking_ids.map(() => '?').join(', ')})
  `;

  db.all(paymentQuery, seat_booking_ids, (err, rows) => {
    if (err) {
      console.error('Error fetching payment amounts:', err);
      return res.status(500).json({ error: 'Failed to fetch payment amounts' });
    }

    if (rows.length === 0) {
      return res.status(400).json({ error: 'No payment data found for the selected bookings' });
    }

    // Step 2: Get the amount from the first payment
    const amount = rows[0].amount;

    // Step 3: Insert a new ticket into the Tickets table
    const ticketQuery = `
      INSERT INTO Tickets (amount, user_id)
      VALUES (?, (SELECT user_id FROM Seat_Bookings WHERE booking_id = ? LIMIT 1))
    `;

    db.run(ticketQuery, [amount, seat_booking_ids[0]], function (err) {
      if (err) {
        console.error('Error creating ticket:', err);
        return res.status(500).json({ error: 'Failed to generate ticket' });
      }

      const ticket_id = this.lastID;
      console.log("Generated Ticket ID:", ticket_id);

      // Step 4: Link the ticket to the seat bookings in Ticket_Bookings table
      const ticketBookingQuery = `
        INSERT INTO Ticket_Bookings (ticket_id, booking_id) 
        VALUES ${seat_booking_ids.map(() => '(?, ?)').join(', ')}
      `;

      db.run(ticketBookingQuery, seat_booking_ids.flatMap((id) => [ticket_id, id]), function (err) {
        if (err) {
          console.error('Error linking ticket to bookings:', err);
          return res.status(500).json({ error: 'Failed to associate ticket with bookings' });
        }

        console.log("Ticket linked successfully!");
        res.status(200).json({ ticket_id, amount, seat_booking_ids });
      });
    });
  });
};

module.exports = { generateTicket };
