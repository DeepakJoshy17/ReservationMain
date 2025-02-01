import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const BookPage = () => {
  const [routesWithStops, setRoutesWithStops] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [startStop, setStartStop] = useState('');
  const [endStop, setEndStop] = useState('');
  const [date, setDate] = useState('');
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000';
    fetchRoutesWithStops();
  }, []);

  const fetchRoutesWithStops = async () => {
    setError('');
    try {
      const response = await axios.get('/api/userBookings/routes-with-stops');
      setRoutesWithStops(response.data);
    } catch (err) {
      console.error('Error fetching routes with stops:', err);
      setError('Failed to fetch routes. Please try again later.');
    }
  };

  const searchBoats = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await axios.get('/api/userBookings/search', {
        params: {
          date,
          route_id: selectedRoute,
          start_stop_id: startStop,
          end_stop_id: endStop,
        },
      });
  
      // Boats with the stop time (arrival time) included
      setBoats(response.data);
    } catch (err) {
      console.error('Error searching boats:', err);
      setError('Failed to search boats. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  const validateSearch = () => {
    if (!selectedRoute || !startStop || !endStop || !date) {
      setError('Please fill in all fields before searching.');
      return false;
    }
    if (startStop === endStop) {
      setError('Start stop and end stop cannot be the same.');
      return false;
    }
    return true;
  };

  const selectedRouteStops = routesWithStops.find((route) => route.route_id === parseInt(selectedRoute))?.stops || [];

  return (
    <div>
      <Navbar />
      <h4>Book Page</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (validateSearch()) {
            searchBoats();
          }
        }}
      >
        <div>
          <label>Route:</label>
          <select
            value={selectedRoute}
            onChange={(e) => {
              setSelectedRoute(e.target.value);
              setStartStop('');
              setEndStop('');
            }}
          >
            <option value="">Select Route</option>
            {routesWithStops.map((route) => (
              <option key={route.route_id} value={route.route_id}>
                {route.route_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Start Stop:</label>
          <select value={startStop} onChange={(e) => setStartStop(e.target.value)}>
            <option value="">Select Start Stop</option>
            {selectedRouteStops.map((stop) => (
              <option key={stop.stop_id} value={stop.stop_id}>
                {stop.location}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>End Stop:</label>
          <select value={endStop} onChange={(e) => setEndStop(e.target.value)}>
            <option value="">Select End Stop</option>
            {selectedRouteStops.map((stop) => (
              <option key={stop.stop_id} value={stop.stop_id}>
                {stop.location}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Boats'}
        </button>
      </form>
      <h3>Available Boats</h3>
     {/* // In the table, display the stop_time as well*/}
{boats.length > 0 ? (
  <table>
    <thead>
      <tr>
        <th>Boat Name</th>
        <th>Departure Time</th>
        <th>Arrival Time</th>
        <th>Stop Time</th> {/* New column for stop time */}
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {boats.map((boat) => (
        <tr key={boat.schedule_id}>
          <td>{boat.boat_name}</td>
          <td>{boat.departure_time}</td>
          <td>{boat.arrival_time}</td>
          <td>{boat.stop_time}</td> {/* Display stop time */}
          <td>
            <button
              onClick={() =>
                navigate(`/seats/${boat.schedule_id}/${startStop}/${endStop}`, {
                  state: { startStop, endStop }, // Pass startStop and endStop here
                })
              }
            >
              View Seats
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No boats available for the selected criteria.</p>
)}
    </div>
  );
};

export default BookPage;
