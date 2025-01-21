// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Seat Booking Routes
router.get('/', bookingController.getAllBookings);
router.post('/', bookingController.createBooking);
router.put('/:booking_id', bookingController.updateBooking);
router.delete('/:booking_id', bookingController.deleteBooking);

// Fetch data for dropdowns
router.get('/schedules', bookingController.getAllSchedules);
router.get('/users', bookingController.getAllUsers);
router.get('/seats', bookingController.getAllSeats);
router.get('/route-stops', bookingController.getAllRouteStops);
router.get('/payments', bookingController.getAllPayments);

module.exports = router;
