const express = require("express");
const { invoiceControllers } = require("../../controllers/accounting");
const auth = require("../../middlewares/auth");
const router = express.Router();

// Invoice routes
router.post("/createinvoice", auth, invoiceControllers.createInvoice);
router.delete("/invoice/:id", auth, invoiceControllers.deleteInvoice);
router.get("/getallinvoice", auth, invoiceControllers.getAllInvoices);
router.get("/getinvoicedashboard/stats", auth, invoiceControllers.getDashboardStats);
router.get("/renewalreminder", auth, invoiceControllers.getRenewalReminders);
router.get("/fetchvehiclebyinvoice/:vehicleId", auth, invoiceControllers.getInvoicesByVehicle);
router.get("/invoice/:id", auth, invoiceControllers.getInvoiceById);
router.put("/updateinvoice/:id", auth, invoiceControllers.updateInvoice);
router.get('/getreceiptno', auth, invoiceControllers.getReceiptNo);
router.get('/getvehicleexpirydate', auth, invoiceControllers.getVehicleExpiryDate);
router.put('/updatepaymentstatus/:id', auth, invoiceControllers.updatePaymentStatus);

module.exports = router;
