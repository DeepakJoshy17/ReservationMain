// src/pages/HomePage.js

import React from 'react';
import { useSession } from '../context/SessionContext';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const { user } = useSession(); // Access user data from context

  return (
    <div>
      <Navbar />
      {user ? (
        <h4>Welcome, {user.name}!</h4> // Display user name if logged in
      ) : (
        <h4>Welcome to the Home Page! Please log in.</h4>
      )}
    </div>
  );
};

export default HomePage;
