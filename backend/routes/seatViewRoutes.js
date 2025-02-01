const express = require('express');
const router = express.Router();

// Import the correct controller
const userBookingsController = require('../controllers/userBookingController'); // Adjust the path as needed

// Define the route with 3 parameters
router.get('/seats/:schedule_id/:start_stop_id/:end_stop_id', userBookingsController.getSeats);

module.exports = router;
