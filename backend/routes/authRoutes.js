const express = require('express');
const { signup, login, logout, getProfile } = require('../controllers/authController');

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Profile route (to get user info if logged in)
router.get('/profile', getProfile);

// Logout route
router.post('/logout', logout);

module.exports = router;
