import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    role: 'User',
  });

  // Fetch users
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure that all required fields are filled out
    if (!userData.name || !userData.email || !userData.password) {
      alert("Name, email, and password are required fields.");
      return;
    }
  
    try {
      // Sending POST request to add a new user
      const response = await axios.post('http://localhost:5000/api/users', userData);
      
      if (response.status === 201) {
        alert(response.data.message);
        setUserData({
          name: '',
          email: '',
          password: '',
          phone_number: '',
          address: '',
          role: 'User',
        });
  
        // Re-fetch users after adding a new one
        const updatedUsers = await axios.get('http://localhost:5000/api/users');
        setUsers(updatedUsers.data);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to add user. Please check the console for details.');
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Form to Add a New User */}
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={userData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={userData.email} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={userData.password} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="text" name="phone_number" value={userData.phone_number} onChange={handleInputChange} />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={userData.address} onChange={handleInputChange} />
        </div>
        <div>
          <label>Role:</label>
          <input type="text" name="role" value={userData.role} onChange={handleInputChange} />
        </div>
        <button type="submit">Add User</button>
      </form>

      {/* User List */}
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.user_id}>
            {user.name} - {user.email} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AddUser