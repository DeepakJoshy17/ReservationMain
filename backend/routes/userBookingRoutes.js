const express = require('express');
const router = express.Router();
const userBookingController = require('../controllers/userBookingController');

// Route to get all routes with stops
router.get('/routes-with-stops', userBookingController.getRoutesWithStops);

// Route to search boats based on date and stops
router.get('/search', userBookingController.searchBoats);

// Route to get seats for a specific schedule
router.get('/seats/:schedule_id/:start_stop_id/:end_stop_id', userBookingController.getSeats);

module.exports = router;
