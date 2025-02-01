import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useSession } from '../context/SessionContext'; // Import session context

const UserPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSession(); // Get user from session context

  const { selectedSeats, schedule_id, startStop, endStop, start_stop_id, end_stop_id, numSeats } = location.state || {};
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000';
  
    if (!selectedSeats || !schedule_id || !user) {
      navigate(`/seats/${schedule_id}`);
    } else {
      // Fetch price from the Stop_Pricing table based on startStop and endStop
      axios.get(`/api/userBookings/stopPricing/${start_stop_id}/${end_stop_id}`)
      .then(response => {
        const pricePerSeat = response.data.price;
        setTotalPrice(pricePerSeat * numSeats);
      })
      .catch(err => {
        setError('Error fetching pricing data');
        console.error('Error fetching pricing data:', err); // Log the full error for debugging
      });
    
    }
  }, [selectedSeats, schedule_id, navigate, user, start_stop_id, end_stop_id, numSeats]);
  
  const handlePayment = async () => {
    if (!user || !user.user_id) {
      setError('You must be logged in to proceed with the payment.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment entry first
      const paymentResponse = await axios.post('/api/payments', {
        amount: totalPrice,
        payment_method: 'Credit Card', // Example, adjust accordingly
        payment_status: 'Pending',
        transaction_id: '12345ABC', // Example, adjust accordingly
      });

      const payment_id = paymentResponse.data.payment_id;

      // Now, book seats and associate with payment
      await axios.post('/api/userBookings/book', {
        schedule_id,
        user_id: user.user_id,
        seat_ids: selectedSeats,
        start_stop_id: start_stop_id,  // Use start_stop_id passed from SeatViewPage
        end_stop_id: end_stop_id,      // Use end_stop_id passed from SeatViewPage
        payment_id: payment_id,
      });

      alert('Payment successful!');
      navigate('/ticket');
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <h4>Payment Page</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <p><strong>Selected Seats:</strong> {selectedSeats ? selectedSeats.join(', ') : 'None'}</p>
        <p><strong>Total Price:</strong> ${totalPrice}</p>
        <p><strong>User Email:</strong> {user?.email}</p>
        <button onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default UserPaymentPage;
