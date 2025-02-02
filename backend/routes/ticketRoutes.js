const express = require('express');
const { generateTicket } = require('../controllers/ticketController');

const router = express.Router();

// Define the route for generating a ticket
router.post('/generate', generateTicket); // Make sure it's POST, not GET

module.exports = router;
