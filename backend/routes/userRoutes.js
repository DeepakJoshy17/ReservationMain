const express = require('express');
const {
  getAllUsers,
  addUser,
} = require('../controllers/userController');

const router = express.Router();

// Route to get all users
router.get('/', getAllUsers);

// Route to add a new user
router.post('/', addUser);

module.exports = router;
