const express = require("express");
const { receiptController } = require("../../controllers/accounting");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.post("/create", auth, receiptController.createReceipt);
router.get("/list", auth, receiptController.getAllReceipts);
router.get("/:id", auth, receiptController.getReceiptById);
router.put("/:id", auth, receiptController.updateReceipt);
router.delete("/:id", auth, receiptController.deleteReceipt);

module.exports = router;
