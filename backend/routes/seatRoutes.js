const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// Routes for seat management
router.get('/seats/:boat_id', seatController.getSeats);  // Get all seats for a boat
router.post('/seats', seatController.createSeat);  // Create a new seat
router.put('/seats/:seat_id', seatController.updateSeat);  // Update a seat
router.delete('/seats/:seat_id', seatController.deleteSeat);  // Delete a seat

// Route to fetch all boats (for the dropdown)
router.get('/boats', seatController.getBoats); // Get all boats

module.exports = router;
