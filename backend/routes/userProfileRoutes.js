const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userProfileController');

// Get user profile
router.get('/:id', getUserProfile);

// Update user profile
router.put('/:id', updateUserProfile);

console.log('✅ User Profile Routes Loaded'); // Log when routes are initialized

module.exports = router;
