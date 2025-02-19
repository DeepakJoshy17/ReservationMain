const db = require('../database/db');

const generateTicket = (req, res) => {
  const { seat_booking_ids } = req.body;

  if (!Array.isArray(seat_booking_ids) || seat_booking_ids.length === 0) {
    return res.status(400).json({ error: 'Invalid seat booking data' });
  }

  console.log("🔍 Checking existing ticket for Seat Booking IDs:", seat_booking_ids);

  // Step 1: Check if all seat bookings already belong to the same ticket
  const checkTicketQuery = `
    SELECT tb.ticket_id, t.amount
    FROM Ticket_Bookings tb
    JOIN Tickets t ON tb.ticket_id = t.ticket_id
    WHERE tb.booking_id IN (${seat_booking_ids.map(() => '?').join(', ')})
    GROUP BY tb.ticket_id
    HAVING COUNT(tb.booking_id) = ?
  `;

  db.get(checkTicketQuery, [...seat_booking_ids, seat_booking_ids.length], (err, existingTicket) => {
    if (err) {
      console.error('❌ Error checking existing ticket:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingTicket) {
      console.log(`✅ Ticket already exists (ID: ${existingTicket.ticket_id})`);
      return res.status(200).json({
        ticket_id: existingTicket.ticket_id,
        amount: existingTicket.amount,
        seat_booking_ids
      });
    }

    // Step 2: Get payment amount and user_id from the first booking
    const paymentQuery = `
      SELECT p.amount, sb.user_id
      FROM Seat_Bookings sb
      JOIN Payments p ON sb.payment_id = p.payment_id
      WHERE sb.booking_id = ?
    `;

    db.get(paymentQuery, [seat_booking_ids[0]], (err, paymentData) => {
      if (err || !paymentData) {
        console.error('❌ Error fetching payment amount:', err);
        return res.status(500).json({ error: 'Failed to fetch payment data' });
      }

      const { amount, user_id } = paymentData;

      // Step 3: Insert a new ticket into the Tickets table
      const ticketQuery = `INSERT INTO Tickets (amount, user_id) VALUES (?, ?)`;

      db.run(ticketQuery, [amount, user_id], function (err) {
        if (err) {
          console.error('❌ Error creating ticket:', err);
          return res.status(500).json({ error: 'Failed to generate ticket' });
        }

        const ticket_id = this.lastID;
        console.log(`✅ New Ticket Generated (ID: ${ticket_id})`);

        // Step 4: Link the ticket to seat bookings in Ticket_Bookings table
        const ticketBookingQuery = `
          INSERT OR IGNORE INTO Ticket_Bookings (ticket_id, booking_id) 
          VALUES ${seat_booking_ids.map(() => '(?, ?)').join(', ')}
        `;

        db.run(ticketBookingQuery, seat_booking_ids.flatMap(id => [ticket_id, id]), function (err) {
          if (err) {
            console.error('❌ Error linking ticket to bookings:', err);
            return res.status(500).json({ error: 'Failed to associate ticket with bookings' });
          }

          console.log(`✅ Ticket ID ${ticket_id} linked to seat bookings`);
          res.status(200).json({ ticket_id, amount, seat_booking_ids });
        });
      });
    });
  });
};

module.exports = { generateTicket };
