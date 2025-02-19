import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setSession } = useSession(); // ✅ Access setSession function

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const loggedInUser = response.data.user;
        setSession(loggedInUser); // ✅ Set session based on role

        alert(`Login successful as ${loggedInUser.role}`);

        if (loggedInUser.role === 'Admin') {
          navigate('/admin'); // ✅ Redirect Admin to Admin Panel
        } else {
          navigate('/'); // ✅ Redirect User to Homepage
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while logging in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading} className="btn">
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <br />
        <Link to="/signup">Register</Link>
      </form>
    </div>
  );
};

export default LoginPage;
