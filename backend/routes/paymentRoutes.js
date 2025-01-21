const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Payment routes
router.get('/', paymentController.getAllPayments); // GET all payments
router.post('/', paymentController.createPayment); // POST create a new payment
router.put('/:payment_id', paymentController.updatePayment); // PUT update a payment
router.delete('/:payment_id', paymentController.deletePayment); // DELETE a payment

module.exports = router;
