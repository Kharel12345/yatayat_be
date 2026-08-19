const express = require("express");
const { cashInvoiceController } = require("../../controllers/accounting");
const auth = require("../../middlewares/auth");
const router = express.Router();

// Cash Invoice routes
router.post("/create", auth, cashInvoiceController.createCashInvoice);
router.get("/list", auth, cashInvoiceController.getAllCashInvoices);
router.get("/:id", auth, cashInvoiceController.getCashInvoiceById);
router.put("/:id", auth, cashInvoiceController.updateCashInvoice);
router.delete("/:id", auth, cashInvoiceController.deleteCashInvoice);
router.get("/vehicle/:vehicleId", auth, cashInvoiceController.getCashInvoicesByVehicle);

module.exports = router;