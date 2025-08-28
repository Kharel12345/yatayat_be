const express = require("express");
const { invoiceControllers } = require("../../controllers/accounting");
const router = express.Router();

// Invoice routes
router.post("/", invoiceControllers.createInvoice);
router.get("/", invoiceControllers.getAllInvoices);
router.get("/dashboard/stats", invoiceControllers.getDashboardStats);
router.get("/renewal-reminders", invoiceControllers.getRenewalReminders);
router.get("/vehicle/:vehicleId", invoiceControllers.getInvoicesByVehicle);
router.get("/:id", invoiceControllers.getInvoiceById);
router.put("/:id", invoiceControllers.updateInvoice);

module.exports = router;
