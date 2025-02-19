const db = require('../database/db');

// Get all tickets for a user
const getUserTickets = (req, res) => {
  const userId = req.params.userId;
  console.log(`📢 Fetching tickets for User ID: ${userId}`);

  const query = `
    SELECT t.ticket_id, t.amount, COUNT(tb.booking_id) AS total_seats
    FROM Tickets t
    LEFT JOIN Ticket_Bookings tb ON t.ticket_id = tb.ticket_id
    WHERE t.user_id = ?
    GROUP BY t.ticket_id
  `;

  db.all(query, [userId], (err, tickets) => {
    if (err) {
      console.error('❌ Database Error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tickets);
  });
};

// Get ticket details (seat bookings)
const getTicketDetails = (req, res) => {
  const ticketId = req.params.ticketId;
  console.log(`📢 Fetching details for Ticket ID: ${ticketId}`);

  const query = `
    SELECT sb.booking_id, sb.seat_id, sb.schedule_id, sb.start_stop_id, sb.end_stop_id
    FROM Ticket_Bookings tb
    JOIN Seat_Bookings sb ON tb.booking_id = sb.booking_id
    WHERE tb.ticket_id = ?
  `;

  db.all(query, [ticketId], (err, bookings) => {
    if (err) {
      console.error('❌ Database Error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(bookings);
  });
};

// Cancel a seat booking
const cancelSeatBooking = (req, res) => {
  const { bookingId, ticketId } = req.body;

  console.log(`📢 Cancelling Booking ID: ${bookingId} from Ticket ID: ${ticketId}`);

  db.serialize(() => {
      // Step 1: Get payment_id and total payment amount
      db.get(
          `SELECT sb.payment_id, p.amount AS total_payment
           FROM Seat_Bookings sb
           JOIN Payments p ON sb.payment_id = p.payment_id
           WHERE sb.booking_id = ?`, 
          [bookingId], 
          (err, data) => {
              if (err || !data) {
                  console.error('❌ Error fetching payment details:', err?.message);
                  return res.status(500).json({ error: 'Failed to fetch payment details' });
              }

              const { payment_id, total_payment } = data;
              
              // Step 2: Calculate seat price (equally distributed among booked seats)
              db.get(
                  `SELECT COUNT(*) AS total_seats FROM Seat_Bookings WHERE payment_id = ?`, 
                  [payment_id], 
                  (err, seatData) => {
                      if (err || !seatData.total_seats) {
                          console.error('❌ Error fetching seat count:', err?.message);
                          return res.status(500).json({ error: 'Failed to fetch seat count' });
                      }

                      const seatPrice = total_payment / seatData.total_seats;
                      const refundAmount = seatPrice * 0.75;

                      // Step 3: Delete seat from Seat_Bookings
                      db.run(`DELETE FROM Seat_Bookings WHERE booking_id = ?`, [bookingId], function (err) {
                          if (err) {
                              console.error('❌ Error deleting from Seat_Bookings:', err.message);
                              return res.status(500).json({ error: 'Failed to cancel booking' });
                          }

                          // Step 4: Delete from Ticket_Bookings
                          db.run(`DELETE FROM Ticket_Bookings WHERE booking_id = ?`, [bookingId], function (err) {
                              if (err) {
                                  console.error('❌ Error deleting from Ticket_Bookings:', err.message);
                                  return res.status(500).json({ error: 'Failed to update ticket booking' });
                              }

                              // Step 5: Check remaining seats for the ticket
                              db.get(`SELECT COUNT(*) AS remaining FROM Ticket_Bookings WHERE ticket_id = ?`, [ticketId], (err, result) => {
                                  if (err) {
                                      console.error('❌ Database Error:', err.message);
                                      return res.status(500).json({ error: 'Database error' });
                                  }

                                  if (result.remaining === 0) {
                                      // Step 6: No more seats, delete the ticket
                                      console.log(`📢 No remaining seats, cancelling Ticket ID: ${ticketId}`);
                                      db.run(`DELETE FROM Tickets WHERE ticket_id = ?`, [ticketId], function (err) {
                                          if (err) {
                                              console.error('❌ Error deleting ticket:', err.message);
                                              return res.status(500).json({ error: 'Failed to cancel ticket' });
                                          }

                                          console.log(`💰 Processing full refund of ₹${refundAmount}`);
                                          return res.json({ message: 'Ticket canceled successfully with refund', refundAmount });
                                      });

                                  } else {
                                      // Step 7: Update the ticket price in the Tickets table
                                      db.run(
                                          `UPDATE Tickets SET amount = amount - ? WHERE ticket_id = ?`, 
                                          [refundAmount, ticketId], 
                                          function (err) {
                                              if (err) {
                                                  console.error('❌ Error updating ticket price:', err.message);
                                                  return res.status(500).json({ error: 'Failed to update ticket price' });
                                              }

                                              // Step 8: Update the payment amount in Payments table
                                              db.run(
                                                  `UPDATE Payments SET amount = amount - ? WHERE payment_id = ?`, 
                                                  [refundAmount, payment_id], 
                                                  function (err) {
                                                      if (err) {
                                                          console.error('❌ Error updating payment amount:', err.message);
                                                          return res.status(500).json({ error: 'Failed to update payment amount' });
                                                      }

                                                      // Step 9: If all seats linked to this payment are canceled, mark payment as refunded
                                                      db.get(
                                                          `SELECT COUNT(*) AS remainingSeats FROM Seat_Bookings WHERE payment_id = ?`, 
                                                          [payment_id], 
                                                          (err, remainingData) => {
                                                              if (err) {
                                                                  console.error('❌ Error checking remaining seats:', err.message);
                                                                  return res.status(500).json({ error: 'Database error' });
                                                              }

                                                              if (remainingData.remainingSeats === 0) {
                                                                  db.run(
                                                                      `UPDATE Payments SET payment_status = 'Refunded' WHERE payment_id = ?`, 
                                                                      [payment_id], 
                                                                      function (err) {
                                                                          if (err) {
                                                                              console.error('❌ Error updating payment status:', err.message);
                                                                              return res.status(500).json({ error: 'Failed to update payment status' });
                                                                          }
                                                                          console.log(`✅ Payment ID: ${payment_id} fully refunded.`);
                                                                      }
                                                                  );
                                                              }

                                                              console.log(`💰 Partial refund processed: ₹${refundAmount}`);
                                                              return res.json({ message: 'Seat booking canceled with refund', refundAmount });
                                                          }
                                                      );
                                                  }
                                              );
                                          }
                                      );
                                  }
                              });
                          });
                      });
                  }
              );
          }
      );
  });
};


  
  

module.exports = { getUserTickets, getTicketDetails, cancelSeatBooking };
