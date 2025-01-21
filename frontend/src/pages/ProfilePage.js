import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/profile', { withCredentials: true })
      .then((response) => {
        setUser(response.data.user); // Fetch user data
      })
      .catch(() => {
        alert('You need to log in first!');
      });
  }, []);

  return (
    <div>
      <Navbar />
      {user ? (
        <div>
          <h4>User Profile</h4>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          {/* Add more user details here */}
        </div>
      ) : (
        <h4>Loading user profile...</h4>
      )}
    </div>
  );
};

export default ProfilePage;
