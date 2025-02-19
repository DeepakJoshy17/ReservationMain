import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const TicketPage = () => {
  const location = useLocation();
  const { seat_booking_ids } = location.state || {}; // Ensure seat_booking_ids is retrieved correctly

  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Checking for existing ticket with seat_booking_ids:", seat_booking_ids);

    if (!seat_booking_ids || seat_booking_ids.length === 0) {
      setError('Invalid ticket data');
      setLoading(false);
      return;
    }

    // ✅ Prevent duplicate API calls using sessionStorage
    if (sessionStorage.getItem(`processing_ticket_${seat_booking_ids.join('_')}`)) {
      console.warn("⚠️ Duplicate request blocked for:", seat_booking_ids);
      return;
    }

    sessionStorage.setItem(`processing_ticket_${seat_booking_ids.join('_')}`, 'true'); // Set flag

    axios.post('/api/tickets/generate', { seat_booking_ids })
      .then((response) => {
        console.log("✅ Ticket Generated:", response.data);
        setTicket(response.data);
        sessionStorage.setItem(`ticket_${seat_booking_ids.join('_')}`, JSON.stringify(response.data));
      })
      .catch((err) => {
        console.error('❌ Error generating ticket:', err);
        setError('Failed to generate ticket');
      })
      .finally(() => {
        sessionStorage.removeItem(`processing_ticket_${seat_booking_ids.join('_')}`); // Remove flag
        setLoading(false);
      });

  }, []); // ✅ Empty dependency list ensures API is only called once

  if (loading) return <p>🔄 Loading ticket...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!ticket) return null;

  return (
    <div>
      <Navbar/>
      <h2>Your Ticket</h2>
      <p><strong>Ticket ID:</strong> {ticket.ticket_id}</p>
      <p><strong>Total Amount:</strong> ₹{ticket.amount}</p>
      <p><strong>Seat Bookings:</strong> {ticket.seat_booking_ids.join(', ')}</p>

      <h3>Scan QR Code</h3>
      <QRCodeCanvas value={`TICKET:${ticket.ticket_id}`} size={150} />

      <p>Show this QR code for verification.</p>
    </div>
  );
};

export default TicketPage;
