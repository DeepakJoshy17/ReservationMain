// src/pages/HomePage.js

import React from 'react';
import { useSession } from '../context/SessionContext';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const { userSession } = useSession(); // ✅ Access user session from context

  return (
    <div>
      <Navbar />
      <div className="home-container">
        {userSession ? (
          <h4>Welcome, {userSession.name}!</h4> // ✅ Ensure userSession exists before accessing name
        ) : (
          <h4>Welcome to the Home Page! Please <a href="/login">log in</a> to continue.</h4> // ✅ Added login link for better UX
        )}
      </div>
    </div>
  );
};

export default HomePage;
