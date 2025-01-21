import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { FaUserCircle } from 'react-icons/fa'; // Import a user profile icon

const Navbar = () => {
  const { user, clearSession } = useSession(); // Access user data from context

  const handleLogout = () => {
    clearSession(); // Clear session data
    // Redirect to login page after logout (optional)
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
        {/* <li>
          <Link to="/adminmanagement">Admin</Link>
        </li> */}
        {user ? (
          <>
            <li className="user-profile">
              <FaUserCircle size={24} /> {/* Profile icon */}
              <span className="user-name"> {user.name}</span>
            </li>
            <li>
              {/* Make the logout a link but keep the functionality */}
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
