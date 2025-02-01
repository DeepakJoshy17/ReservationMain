import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useSession } from '../context/SessionContext'; // Import session context

const SeatViewPage = () => {
  const { schedule_id, start_stop_id, end_stop_id } = useParams(); // Use start_stop_id and end_stop_id from the URL parameters
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSession(); // Get user from session context

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { startStop, endStop } = location.state || {}; // Retrieve startStop and endStop from the state

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000';
  }, []);

  const fetchSeats = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const response = await axios.get(`/api/userBookings/seats/${schedule_id}/${startStop}/${endStop}`);
      setSeats(response.data); // Save seats data
    } catch (err) {
      console.error('Error fetching seats:', err);
      setError(`Failed to load seats. Error: ${err.response ? err.response.data : err.message}`);
    } finally {
      setLoading(false);
    }
  }, [schedule_id, startStop, endStop]);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  const toggleSeatSelection = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = () => {
    if (!user) {
      setError('You must be logged in to proceed with the payment.');
      alert('Please log in to proceed with booking.');
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat to book.');
      return;
    }

    // Pass selected seats, start_stop_id, and end_stop_id to the payment page
    navigate('/payment', { 
      state: { 
        selectedSeats, 
        schedule_id, 
        startStop, 
        endStop,
        start_stop_id, // Pass start stop id
        end_stop_id, // Pass end stop id
        numSeats: selectedSeats.length // Pass number of selected seats
      } 
    });
  };

  return (
    <div>
      <Navbar />
      <h4>Seat Selection</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading seats...</p>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            {seats.map((seat) => (
              <div
                key={seat.seat_id}
                onClick={() => !seat.is_booked && toggleSeatSelection(seat.seat_id)} // Only toggle if not booked
                style={{
                  padding: '10px',
                  border: '1px solid black',
                  textAlign: 'center',
                  backgroundColor: seat.is_booked
                    ? 'gray' // Gray out the booked seats
                    : selectedSeats.includes(seat.seat_id)
                    ? 'green' // Green for selected seats
                    : 'white', // White for available seats
                  color: seat.is_booked ? 'white' : 'black',
                  cursor: seat.is_booked ? 'not-allowed' : 'pointer', // Disable cursor for booked seats
                }}
              >
                {seat.seat_number} {seat.is_booked ? '(Booked)' : ''}
              </div>
            ))}
          </div>
          <button onClick={handleBooking} disabled={loading}>
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatViewPage;
