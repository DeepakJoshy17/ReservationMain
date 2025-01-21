const express = require('express');
const router = express.Router();
const boatController = require('../controllers/boatController');

// Route to get all boats
router.get('/', boatController.getAllBoats);

// Route to create a new boat
router.post('/', boatController.createBoat);

// Route to update a boat
router.put('/:boat_id', boatController.updateBoat);

// Route to delete a boat
router.delete('/:boat_id', boatController.deleteBoat);

module.exports = router;
