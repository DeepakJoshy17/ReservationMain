import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const { user, clearSession } = useSession(); // Access session context

  const handleLogout = () => {
    clearSession(); // Clear session and redirect to the home page
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/book">Book</Link>
        </li>
        {user ? (
          <>
            <li className="user-profile">
              <FaUserCircle size={24} />
              <span className="user-name">{user.name}</span>
            </li>
            <li>
              <Link to="/" onClick={handleLogout} className="logout-link">
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
