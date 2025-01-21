const express = require('express');
const router = express.Router();
const stopTimeController = require('../controllers/stopTimeController');

// Route for fetching all routes
router.get('/routes', stopTimeController.getAllRoutes);

// Route for fetching stops based on route_id
router.get('/stops/:route_id', stopTimeController.getStopsForRoute);

// Fetch stop times for a specific route
router.get('/stop-times/:route_id', stopTimeController.getStopTimes);

// Create a new stop time
router.post('/stop-times', stopTimeController.createStopTime);

// Update an existing stop time
router.put('/stop-times/:route_id/:stop_id', stopTimeController.updateStopTime);

// Delete a stop time entry
router.delete('/stop-times/:route_id/:stop_id', stopTimeController.deleteStopTime);

module.exports = router;
