import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import AddUser from './pages/AddUser';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Welcome to the Authentication App</h1>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adduser" element={<AddUser />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
