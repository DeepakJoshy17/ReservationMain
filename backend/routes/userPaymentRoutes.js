const express = require('express');
const router = express.Router();
const { bookSeats, getPricing, createPayment } = require('../controllers/userPaymentController');

// Route to fetch pricing based on start_stop_id and end_stop_id
router.get('/stopPricing/:start_stop_id/:end_stop_id', getPricing);

// Route to create a payment
router.post('/payment', createPayment);

// Route to book seats and associate with payment
router.post('/book', bookSeats);

module.exports = router;
