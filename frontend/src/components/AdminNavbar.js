import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { FaUserCircle } from 'react-icons/fa';

const AdminNavbar = () => {
  const { adminSession, clearSession } = useSession(); // ✅ Use adminSession instead of user

  const handleLogout = () => {
    clearSession(); // ✅ Clears session data
  };

  return (
    <nav>
      <ul>
        <li><Link to="/admin">Home</Link></li>
        <li><Link to="/admin/users">Users</Link></li>

        {adminSession ? (
          <>
            <li><Link to="/admin/boats">Boats</Link></li>
            <li><Link to="/admin/routes">Routes</Link></li>
            <li><Link to="/admin/route-stops">Stops</Link></li>
            <li><Link to="/admin/stop-pricings">Prices</Link></li>
            <li><Link to="/admin/stop-timings">Timings</Link></li>
            <li><Link to="/admin/seats">Seats</Link></li>
            <li><Link to="/admin/schedules">Schedules</Link></li>
            <li><Link to="/admin/payments">Payments</Link></li>
            <li><Link to="/admin/bookings">Bookings</Link></li>
            <li><Link to="/admin-chat">Responses</Link></li>
            <li><Link to="/admin/knowledge">Knowledge</Link></li>
      
            

            {/* ✅ Admin Profile Section */}
            <li className="user-profile">
              <FaUserCircle size={24} />
              <span className="user-name"> {adminSession.name}</span>
            </li>

            {/* ✅ Logout */}
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
