import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; // Correct import
import axios from 'axios';

const TicketPage = () => {
  const location = useLocation();
  const { seat_booking_ids } = location.state || {}; // Ensure seat_booking_ids is retrieved correctly

  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Received seat_booking_ids in frontend:", seat_booking_ids); // Debugging

    if (!seat_booking_ids || seat_booking_ids.length === 0) {
      setError('Invalid ticket data');
      setLoading(false);
      return;
    }

    axios.post('/api/tickets/generate', { seat_booking_ids })
      .then((response) => {
        console.log("Ticket generated:", response.data);
        setTicket(response.data);
      })
      .catch((err) => {
        console.error('Error generating ticket:', err);
        setError('Failed to generate ticket');
      })
      .finally(() => setLoading(false));
  }, [seat_booking_ids]);

  if (loading) return <p>Processing your ticket...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!ticket) return null;

  return (
    <div>
      <h2>Your Ticket</h2>
      <p><strong>Ticket ID:</strong> {ticket.ticket_id}</p>
      <p><strong>Total Amount:</strong> ${ticket.amount}</p>
      <p><strong>Seat Bookings:</strong> {ticket.seat_booking_ids.join(', ')}</p>

      <h3>Scan QR Code</h3>
      <QRCodeCanvas value={`TICKET:${ticket.ticket_id}`} size={150} />

      <p>Show this QR code for verification.</p>
    </div>
  );
};

export default TicketPage;
