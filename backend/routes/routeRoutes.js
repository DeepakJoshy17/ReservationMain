const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Get all routes
router.get('/', routeController.getAllRoutes);

// Create a new route
router.post('/', routeController.createRoute);

// Update a route
router.put('/:route_id', routeController.updateRoute);

// Delete a route
router.delete('/:route_id', routeController.deleteRoute);

module.exports = router;
