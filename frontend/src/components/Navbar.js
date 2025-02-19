import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const { userSession, clearSession } = useSession(); // ✅ Use userSession instead of user

  const handleLogout = () => {
    clearSession(); // ✅ Clears session data
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/book">Book</Link></li>

        {userSession ? (
          <>
            
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/ticket-view">My Tickets</Link></li>
            <li><Link to="/user-chat">Enquiries</Link></li>
            <li className="user-profile">
              <FaUserCircle size={24} />
              <span className="user-name">{userSession.name}</span>
            </li>
            <li>
              <Link to="/" onClick={handleLogout} className="logout-link">
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
