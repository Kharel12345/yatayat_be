const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { vehicleBillingController } = require('../../controllers/master');

// Create renewal invoice
router.post('/renewal', auth, vehicleBillingController.createInvoice);

// Get invoice by ID
router.get('/invoice/:id', auth, vehicleBillingController.getInvoice);

// List invoices with pagination
router.get('/invoices', auth, vehicleBillingController.listInvoices);

// Get vehicles needing renewal (report)
router.get('/vehicles-needing-renewal', auth, vehicleBillingController.getVehiclesNeedingRenewal);

module.exports = router; 