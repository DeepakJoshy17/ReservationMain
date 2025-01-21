import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import AdminNavbar from '../components/AdminNavbar';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({
    schedule_id: '',
    user_id: '',
    seat_id: '',
    start_stop_id: '',
    end_stop_id: '',
    payment_status: 'Pending',
    payment_id: '',
  });
  const [updateBooking, setUpdateBooking] = useState(null);
  const [dropdownData, setDropdownData] = useState({
    schedules: [],
    users: [],
    seats: [],
    startStops: [],
    endStops: [],
    payments: [],
  });

  // Fetch dropdown data
  useEffect(() => {
    axios.get('http://localhost:5000/api/seat-bookings/schedules').then((res) => setDropdownData((prev) => ({ ...prev, schedules: res.data })));
    axios.get('http://localhost:5000/api/seat-bookings/users').then((res) => setDropdownData((prev) => ({ ...prev, users: res.data })));
    axios.get('http://localhost:5000/api/seat-bookings/seats').then((res) => setDropdownData((prev) => ({ ...prev, seats: res.data })));
    axios.get('http://localhost:5000/api/seat-bookings/route-stops').then((res) => setDropdownData((prev) => ({ ...prev, startStops: res.data, endStops: res.data })));
    axios.get('http://localhost:5000/api/seat-bookings/payments').then((res) => setDropdownData((prev) => ({ ...prev, payments: res.data })));
  }, []);

  // Fetch bookings
  useEffect(() => {
    axios.get('http://localhost:5000/api/seat-bookings').then((res) => setBookings(res.data));
  }, []);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/seat-bookings', newBooking)
      .then(() => {
        alert('Booking added successfully!');
        setNewBooking({
          schedule_id: '',
          user_id: '',
          seat_id: '',
          start_stop_id: '',
          end_stop_id: '',
          payment_status: 'Pending',
          payment_id: '',
        });
        axios.get('http://localhost:5000/api/seat-bookings').then((res) => setBookings(res.data));
      })
      .catch((err) => alert('Error creating booking'));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/seat-bookings/${updateBooking.booking_id}`, updateBooking)
      .then(() => {
        alert('Booking updated successfully!');
        setUpdateBooking(null);
        axios.get('http://localhost:5000/api/seat-bookings').then((res) => setBookings(res.data));
      })
      .catch((err) => alert('Error updating booking'));
  };
  

  const handleDelete = (booking_id) => {
    axios
      .delete(`http://localhost:5000/api/seat-bookings/${booking_id}`)
      .then(() => {
        alert('Booking deleted successfully!');
        axios.get('http://localhost:5000/api/seat-bookings').then((res) => setBookings(res.data));
      })
      .catch((err) => alert('Error deleting booking'));
  };
  
  return (
    <div className="booking-management">
      <AdminNavbar/>
      <h1>Booking Management</h1>

      {/* Create Booking Form */}
      <form onSubmit={handleCreateSubmit}>
        <h2>Create New Booking</h2>

        <div className="form-group">
          <label>Schedule</label>
          <select
            value={newBooking.schedule_id}
            onChange={(e) => setNewBooking({ ...newBooking, schedule_id: e.target.value })}
          >
            <option value="">Select Schedule</option>
            {dropdownData.schedules.map((schedule) => (
              <option key={schedule.schedule_id} value={schedule.schedule_id}>
                {`${schedule.schedule_id} - ${schedule.boat_name} - ${format(new Date(schedule.departure_time), 'MM/dd/yyyy HH:mm')}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>User</label>
          <select
            value={newBooking.user_id}
            onChange={(e) => setNewBooking({ ...newBooking, user_id: e.target.value })}
          >
            <option value="">Select User</option>
            {dropdownData.users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.name} {/* Adjust to show the user's name */}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Seat</label>
          <select
            value={newBooking.seat_id}
            onChange={(e) => setNewBooking({ ...newBooking, seat_id: e.target.value })}
          >
            <option value="">Select Seat</option>
            {dropdownData.seats.map((seat) => (
              <option key={seat.seat_id} value={seat.seat_id}>
                {seat.seat_number} {/* Adjust to show the seat number */}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Start Stop</label>
          <select
            value={newBooking.start_stop_id}
            onChange={(e) => setNewBooking({ ...newBooking, start_stop_id: e.target.value })}
          >
            <option value="">Select Start Stop</option>
            {dropdownData.startStops.map((stop) => (
              <option key={stop.stop_id} value={stop.stop_id}>
                {stop.location} {/* Adjust to show the location */}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>End Stop</label>
          <select
            value={newBooking.end_stop_id}
            onChange={(e) => setNewBooking({ ...newBooking, end_stop_id: e.target.value })}
          >
            <option value="">Select End Stop</option>
            {dropdownData.endStops.map((stop) => (
              <option key={stop.stop_id} value={stop.stop_id}>
                {stop.location} {/* Adjust to show the location */}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Payment</label>
          <select
            value={newBooking.payment_id}
            onChange={(e) => setNewBooking({ ...newBooking, payment_id: e.target.value })}
          >
            <option value="">Select Payment</option>
            {dropdownData.payments.map((payment) => (
              <option key={payment.payment_id} value={payment.payment_id}>
                {`${payment.payment_status} - $${payment.amount}`} {/* Show payment status and amount */}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Create Booking</button>
      </form>

     {/* Update Booking Form */}
{updateBooking && (
  <form onSubmit={handleUpdateSubmit}>
    <h2>Update Booking</h2>

    <div className="form-group">
      <label>Schedule</label>
      <select
        value={updateBooking.schedule_id}
        onChange={(e) => setUpdateBooking({ ...updateBooking, schedule_id: e.target.value })}
      >
        <option value="">Select Schedule</option>
        {dropdownData.schedules.map((schedule) => (
          <option key={schedule.schedule_id} value={schedule.schedule_id}>
            {`${schedule.schedule_id} - ${schedule.boat_name} - ${format(new Date(schedule.departure_time), 'MM/dd/yyyy HH:mm')}`}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>User</label>
      <select
        value={updateBooking.user_id}
        onChange={(e) => setUpdateBooking({ ...updateBooking, user_id: e.target.value })}
      >
        <option value="">Select User</option>
        {dropdownData.users.map((user) => (
          <option key={user.user_id} value={user.user_id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Seat</label>
      <select
        value={updateBooking.seat_id}
        onChange={(e) => setUpdateBooking({ ...updateBooking, seat_id: e.target.value })}
      >
        <option value="">Select Seat</option>
        {dropdownData.seats.map((seat) => (
          <option key={seat.seat_id} value={seat.seat_id}>
            {seat.seat_number}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Start Stop</label>
      <select
        value={updateBooking.start_stop_id}
        onChange={(e) => setUpdateBooking({ ...updateBooking, start_stop_id: e.target.value })}
      >
        <option value="">Select Start Stop</option>
        {dropdownData.startStops.map((stop) => (
          <option key={stop.stop_id} value={stop.stop_id}>
            {stop.location}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>End Stop</label>
      <select
        value={updateBooking.end_stop_id}
        onChange={(e) => setUpdateBooking({ ...updateBooking, end_stop_id: e.target.value })}
      >
        <option value="">Select End Stop</option>
        {dropdownData.endStops.map((stop) => (
          <option key={stop.stop_id} value={stop.stop_id}>
            {stop.location}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Payment</label>
      <select
        value={updateBooking.payment_id}
        onChange={(e) => setUpdateBooking({ ...updateBooking, payment_id: e.target.value })}
      >
        <option value="">Select Payment</option>
        {dropdownData.payments.map((payment) => (
          <option key={payment.payment_id} value={payment.payment_id}>
            {`${payment.payment_status} - $${payment.amount}`}
          </option>
        ))}
      </select>
    </div>

    <button type="submit">Update Booking</button>
  </form>
)}

      {/* Booking List */}
      <h2>All Bookings</h2>
<ul>
  {bookings.map((booking) => (
    <li key={booking.booking_id}>
      <div>
        <strong>Booking ID:</strong> {booking.booking_id}
      </div>
      <div>
        <strong>Schedule:</strong> {booking.schedule_id} {/* You might want to display schedule details instead of just ID */}
      </div>
      <div>
        <strong>User:</strong> {booking.user_id} {/* You might want to display the user's name */}
      </div>
      <div>
        <strong>Seat:</strong> {booking.seat_id} {/* You might want to display the seat number */}
      </div>
      <div>
        <strong>Start Stop:</strong> {booking.start_stop_id} {/* Display location for start stop */}
      </div>
      <div>
        <strong>End Stop:</strong> {booking.end_stop_id} {/* Display location for end stop */}
      </div>
      <div>
        <strong>Payment Status:</strong> {booking.payment_status}
      </div>
      <div>
        <strong>Payment ID:</strong> {booking.payment_id}
      </div>
      
      {/* Actions */}
      <button onClick={() => setUpdateBooking(booking)}>Update</button>
      <button onClick={() => handleDelete(booking.booking_id)}>Delete</button>
    </li>
  ))}
</ul>

    </div>
  );
};

export default BookingManagement;
