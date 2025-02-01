// // controllers/userBookingsController.js
// const db = require('../database/db');

// // Fetch seats for a specific boat schedule
// const getSeats = (req, res) => {
//   const { schedule_id, start_stop_id, end_stop_id } = req.params; // Capture all 3 params
//   const query = `
//     SELECT s.seat_id, s.seat_number, s.type,
//       CASE 
//         WHEN EXISTS (
//           SELECT 1 
//           FROM Seat_Bookings sb 
//           WHERE sb.seat_id = s.seat_id 
//             AND sb.schedule_id = ? 
//             AND sb.start_stop_id = ? 
//             AND sb.end_stop_id = ?
//         ) THEN 1
//         ELSE 0
//       END AS is_booked
//     FROM Seats s
//     JOIN Schedules sc ON s.boat_id = sc.boat_id
//     WHERE sc.schedule_id = ?
//   `;

//   db.all(query, [schedule_id, start_stop_id, end_stop_id, schedule_id], (err, rows) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to fetch seats' });
//     }
//     res.status(200).json(rows); // Return the seat data
//   });
// };

// module.exports = { getSeats };
