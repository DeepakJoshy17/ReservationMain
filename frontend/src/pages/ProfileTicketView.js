import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSession } from '../context/SessionContext';
import Navbar from '../components/Navbar';
import { QRCodeCanvas } from 'qrcode.react';

const ProfileTicketView = () => {
  const { userSession } = useSession();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // ✅ Fetch tickets
  const fetchTickets = useCallback(async () => {
    if (!userSession) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/profile-tickets/user/${userSession.user_id}`);
      setTickets(response.data);
    } catch (error) {
      console.error('❌ Error fetching tickets:', error);
    }
    setLoading(false);
  }, [userSession]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // ✅ Fetch ticket details when "View Ticket" is clicked
  const viewTicketDetails = async (ticketId) => {
    setSelectedTicket(ticketId === selectedTicket?.ticket_id ? null : tickets.find((t) => t.ticket_id === ticketId)); // Toggle ticket view
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/profile-tickets/details/${ticketId}`);
      setTicketDetails(response.data);
      setSelectedSeats([]); // Reset selected seats on new selection
    } catch (error) {
      console.error('❌ Error fetching ticket details:', error);
    }
    setLoading(false);
  };

  // ✅ Toggle seat selection for cancellation
  const toggleSeatSelection = (bookingId) => {
    setSelectedSeats((prev) =>
      prev.includes(bookingId) ? prev.filter((id) => id !== bookingId) : [...prev, bookingId]
    );
  };

  // ✅ Cancel selected seats & update UI immediately
  const cancelSelectedSeats = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select seats to cancel.');
      return;
    }

    setCancelLoading(true);
    try {
      const responses = await Promise.all(
        selectedSeats.map((bookingId) =>
          axios.post(`http://localhost:5000/api/profile-tickets/cancel`, {
            bookingId,
            ticketId: selectedTicket.ticket_id,
          })
        )
      );

      // ✅ Calculate total refund from all responses
      let totalRefund = responses.reduce((sum, res) => sum + res.data.refundAmount, 0);

      // ✅ Update ticket price in UI immediately
      setTickets((prevTickets) =>
        prevTickets.map((t) =>
          t.ticket_id === selectedTicket.ticket_id
            ? { ...t, amount: t.amount - totalRefund } // Update ticket price
            : t
        )
      );

      // ✅ Remove canceled seats from UI immediately
      setTicketDetails((prev) => prev.filter((b) => !selectedSeats.includes(b.booking_id)));

      // ✅ Show refund alert
      alert(`✅ Seats canceled successfully!\n💰 Total Refund: ₹${totalRefund}`);

      // ✅ Reset selected seats
      setSelectedSeats([]);
    } catch (error) {
      console.error('❌ Error canceling selected seats:', error);
      alert('❌ Failed to cancel selected seats.');
    }
    setCancelLoading(false);
  };

  return (
    <div className="container">
      <Navbar />
      <h2>My Tickets</h2>

      {loading ? <p>Loading tickets...</p> : null}

      <ul className="ticket-list">
        {tickets.length === 0 ? <p>No tickets found.</p> : tickets.map((ticket) => (
          <li key={ticket.ticket_id} className="ticket-card">
            <div className="ticket-info">
              <strong>Ticket #{ticket.ticket_id}</strong> - ₹{ticket.amount} ({ticket.total_seats} seats)
            </div>
            <button className="view-btn" onClick={() => viewTicketDetails(ticket.ticket_id)}>
              {selectedTicket?.ticket_id === ticket.ticket_id ? "Hide Details" : "View Ticket"}
            </button>
          </li>
        ))}
      </ul>

      {selectedTicket && (
        <div className="ticket-details">
          <h3>Ticket Details</h3>
          {/* <p><strong>Ticket ID:</strong> {selectedTicket.ticket_id}</p>
          <p><strong>Price:</strong> ₹{selectedTicket.amount}</p> */}

          {/* ✅ QR Code Display */}
          <QRCodeCanvas value={`Ticket ID: ${selectedTicket.ticket_id}, Price: ₹${selectedTicket.amount}`} size={150} />

          <h4>Select seats to cancel:</h4>
          {loading ? <p>Loading details...</p> : (
            <ul className="seat-list">
              {ticketDetails.map((booking) => (
                <li key={booking.booking_id} className="seat-item">
                  <input
                    type="checkbox"
                    checked={selectedSeats.includes(booking.booking_id)}
                    onChange={() => toggleSeatSelection(booking.booking_id)}
                  />
                  Seat {booking.seat_id} | Stops: {booking.start_stop_id} → {booking.end_stop_id}
                </li>
              ))}
            </ul>
          )}

          <button className="cancel-btn" onClick={cancelSelectedSeats} disabled={cancelLoading || selectedSeats.length === 0}>
            {cancelLoading ? "Canceling..." : "Cancel Selected Seats"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileTicketView;
