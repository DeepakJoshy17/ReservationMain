const db = require('../database/db');

// Fetch all routes and their stops in one response
const getRoutesWithStops = (req, res) => {
  const queryRoutes = 'SELECT route_id, route_name FROM Routes';
  const queryStops = `
    SELECT route_id, stop_id, location, stop_order 
    FROM Route_Stops 
    ORDER BY route_id, stop_order ASC`;

  db.all(queryRoutes, [], (err, routes) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch routes' });
    }

    db.all(queryStops, [], (err, stops) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch route stops' });
      }

      // Combine routes with their corresponding stops
      const routesWithStops = routes.map((route) => ({
        ...route,
        stops: stops.filter((stop) => stop.route_id === route.route_id),
      }));

      res.status(200).json(routesWithStops);
    });
  });
};

// Fetch boats based on schedule, route, and stops
const searchBoats = (req, res) => {
  const { date, route_id, start_stop_id, end_stop_id } = req.query;

  const query = `
    SELECT s.schedule_id, b.boat_name, s.departure_time, s.arrival_time 
    FROM Schedules s
    JOIN Boats b ON s.boat_id = b.boat_id
    WHERE s.route_id = ? AND s.departure_time LIKE ? 
      AND EXISTS (
        SELECT 1 FROM Route_Stops rs 
        WHERE rs.route_id = s.route_id AND rs.stop_id = ?
      )
      AND EXISTS (
        SELECT 1 FROM Route_Stops rs 
        WHERE rs.route_id = s.route_id AND rs.stop_id = ?
      )`;

  const params = [route_id, `${date}%`, start_stop_id, end_stop_id];

  db.all(query, params, (err, boats) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch boats' });
    }

    // Fetch the stop time for the start stop
    const stopTimeQuery = `
      SELECT arrival_time 
      FROM Route_Stop_Times 
      WHERE route_id = ? AND stop_id = ?`;

    db.all(stopTimeQuery, [route_id, start_stop_id], (err, stopTimes) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch stop time' });
      }

      // Assuming we only expect one stop time per route and stop
      const stopTime = stopTimes.length > 0 ? stopTimes[0].arrival_time : null;

      // Function to add departure time to stop time
      const addTimes = (departureTime, stopTime) => {
        if (!departureTime || !stopTime) return null; // Return null for invalid times

        // Convert departure time and stop time to minutes
        const [depHours, depMinutes] = departureTime.split(':').map(Number);
        const [stopHours, stopMinutes] = stopTime.split(':').map(Number);

        const totalMinutes = depHours * 60 + depMinutes + stopHours * 60 + stopMinutes;

        // Convert total minutes back to hours and minutes
        const resultHours = Math.floor(totalMinutes / 60);
        const resultMinutes = totalMinutes % 60;

        // Format the time as HH:mm
        return `${String(resultHours).padStart(2, '0')}:${String(resultMinutes).padStart(2, '0')}`;
      };

      // Combine boat schedule data with the calculated stop time
      const boatsWithStopTime = boats.map((boat) => {
        const departureTime = boat.departure_time.split('T')[1].slice(0, 5); // Extract time from departure_time
        const updatedStopTime = addTimes(departureTime, stopTime); // Calculate the updated stop time
        return {
          ...boat,
          stop_time: updatedStopTime, // Add the updated stop time
        };
      });

      res.status(200).json(boatsWithStopTime);
    });
  });
};



// Fetch seats for a specific boat schedule
// Fetch seats for a specific boat schedule
const getSeats = (req, res) => {
  const { schedule_id, start_stop_id, end_stop_id } = req.params; // Capture all 3 params

  const query = `
    SELECT 
      s.seat_id, 
      s.seat_number, 
      s.type,
      CASE 
        WHEN EXISTS (
          SELECT 1 
          FROM Seat_Bookings sb
          JOIN Route_Stops rss_start ON rss_start.stop_id = sb.start_stop_id
          JOIN Route_Stops rss_end ON rss_end.stop_id = sb.end_stop_id
          JOIN Route_Stops rqs_start ON rqs_start.stop_id = ?
          JOIN Route_Stops rqs_end ON rqs_end.stop_id = ?
          WHERE sb.seat_id = s.seat_id 
            AND sb.schedule_id = ?
            AND (
              (rss_start.stop_order < rqs_end.stop_order AND rss_end.stop_order > rqs_start.stop_order)
              OR (rss_start.stop_order = rqs_start.stop_order AND rss_end.stop_order = rqs_end.stop_order)
            )
        ) THEN 1 -- Mark as booked
        ELSE 0 -- Mark as available
      END AS is_booked
    FROM Seats s
    JOIN Schedules sc ON s.boat_id = sc.boat_id
    WHERE sc.schedule_id = ?
  `;

  db.all(
    query, 
    [start_stop_id, end_stop_id, schedule_id, schedule_id], 
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch seats" });
      }

      // Return the seat data
      res.status(200).json(rows);
    }
  );
};

module.exports = {
  getRoutesWithStops,
  searchBoats,
  getSeats,
};
