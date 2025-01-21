const express = require('express');
const router = express.Router();
const stopPricingController = require('../controllers/stopPricingController');

// Get all stop pricing
router.get('/', stopPricingController.getAllPricing);

// Create new pricing
router.post('/', stopPricingController.createPricing);

// Update pricing
router.put('/:pricing_id', stopPricingController.updatePricing);

// Delete pricing
router.delete('/:pricing_id', stopPricingController.deletePricing);

module.exports = router;