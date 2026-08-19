const express = require("express");
const { cashReceiptController } = require("../../controllers/accounting");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.post("/create", auth, cashReceiptController.createCashReceipt);
router.get("/list", auth, cashReceiptController.getAllCashReceipts);
router.get("/:id", auth, cashReceiptController.getCashReceiptById);
router.put("/:id", auth, cashReceiptController.updateCashReceipt);
router.delete("/:id", auth, cashReceiptController.deleteCashReceipt);

module.exports = router;
