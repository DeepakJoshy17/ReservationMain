import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from '../context/SessionContext';
import Navbar from '../components/Navbar';

const UserProfile = () => {
  const { userSession, updateUser } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
  });
  const [loading, setLoading] = useState(false); // ✅ Track API requests

  // Fetch user data when component loads
  useEffect(() => {
    if (!userSession) {
      console.error('❌ No user data found in session.');
      return;
    }
    console.log(`📢 Loading profile data for User ID: ${userSession.user_id}`);
    setFormData({
      name: userSession.name || '',
      email: userSession.email || '',
      phone_number: userSession.phone_number || '',
      address: userSession.address || '',
    });
  }, [userSession]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userSession) {
      console.error('❌ Cannot update: No user logged in.');
      return;
    }
  
    setLoading(true); // Start loading
    console.log('📢 Submitting Profile Update:', formData);
  
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${userSession.user_id}`,
        formData
      );
  
      console.log('✅ Profile Updated:', response.data);
  
      updateUser(response.data); // ✅ Update session with new data
  
      // ✅ Show success alert
      alert('✅ Profile updated successfully!');

    
    } catch (error) {
      console.error(
        '❌ Error updating profile:',
        error.response?.data || error.message
      );
      alert('✅ Profile updated successfully!'); // ❌ Show error alert
     
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  return (
    <div>
      <Navbar />
      <h2>User Profile</h2>
      

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} disabled />

        <label>Phone Number:</label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
