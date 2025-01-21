import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setSession } = useSession(); // Access the setSession function from context

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password }, { withCredentials: true });

      if (response.status === 200) {
        setSession(response.data.user); // Set user session in context
        alert('Login successful');

        // Navigate based on the user's role
        if (response.data.user.role === 'Admin') {
          navigate('/admin');  // Redirect to admin management page
        } else {
          navigate('/');  // Redirect to homepage for normal users
        }
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <div>
   
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Login</button>
        <br/>
        <Link to="/signup">Register</Link>
          
      </form>
    </div>
  );
};

export default LoginPage;
