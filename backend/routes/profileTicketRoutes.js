const express = require('express');
const router = express.Router();
const { getUserTickets, getTicketDetails, cancelSeatBooking } = require('../controllers/profileTicketcontroller')

router.get('/user/:userId', getUserTickets);
router.get('/details/:ticketId', getTicketDetails);
router.post('/cancel', cancelSeatBooking);

console.log('✅ Profile Ticket Routes Loaded');

module.exports = router;
