const express = require("express");
const { invoiceControllers } = require("../../controllers/accounting");
const router = express.Router();

// Invoice routes
router.post("/createinvoice", invoiceControllers.createInvoice);
router.get("/getallinvoice", invoiceControllers.getAllInvoices);
router.get("/getinvoicedashboard/stats", invoiceControllers.getDashboardStats);
router.get("/fetch-renewal-reminders", invoiceControllers.getRenewalReminders);
router.get("/fetchvehiclebyinvoice/:vehicleId", invoiceControllers.getInvoicesByVehicle);
router.get("/getinvoicebyid/:id", invoiceControllers.getInvoiceById);
router.put("/updateinvoice:id", invoiceControllers.updateInvoice);
router.get('/getreceiptno', invoiceControllers.getReceiptNo);
router.get('/getvehicleexpirydate', invoiceControllers.getVehicleExpiryDate);
router.put('/updatepaymentstatus/:id', invoiceControllers.updatePaymentStatus);

module.exports = router;
