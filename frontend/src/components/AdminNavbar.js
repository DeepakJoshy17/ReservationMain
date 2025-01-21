import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { FaUserCircle } from 'react-icons/fa';

const AdminNavbar = () => {
  const { user, clearSession } = useSession(); // Access user data from context

  const handleLogout = () => {
    clearSession(); // Clear session data
  };

  return (
    <nav>
      <ul>
        <li>
        <Link to="/admin">Home</Link>
        </li>
        <li>
          <Link to="/admin/users">User</Link>
        </li>

        {user ? (
          <>
                  <li>
          <Link to="/admin/boats">Boat</Link>
        </li>
        <li>
          <Link to="/admin/routes">Route</Link>
        </li>
        <li>
          <Link to="/admin/route-stops">Stop</Link>
        </li>
        <li>
          <Link to="/admin/stop-pricings">Price</Link>
        </li>
        <li>
          <Link to="/admin/stop-timings">Time</Link>
        </li>
        <li>
          <Link to="/admin/seats">Seat</Link>
        </li>
        <li>
          <Link to="/admin/schedules">Schedule</Link>
        </li>
        <li>
          <Link to="/admin/payments">Payment</Link>
        </li>
        <li>
          <Link to="/admin/bookings">Booking</Link>
        </li>
            <li className="user-profile">
              <FaUserCircle size={24} /> {/* Profile icon */}
              <span className="user-name"> {user.name}</span>
            </li>
            <li>
              <Link to="/" onClick={handleLogout} className="logout-link">
                Logout
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default AdminNavbar;
