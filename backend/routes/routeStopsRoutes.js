const express = require('express');
const router = express.Router();
const routeStopController = require('../controllers/routeStopController');

// Get all route stops
router.get('/', routeStopController.getAllRouteStops);

// Create a new route stop
router.post('/', routeStopController.createRouteStop);

// Update a route stop
router.put('/:stop_id', routeStopController.updateRouteStop);

// Delete a route stop
router.delete('/:stop_id', routeStopController.deleteRouteStop);

module.exports = router;
