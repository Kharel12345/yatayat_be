// routes/billingTitleInfo.routes.js
const express = require("express");
const router = express.Router();
const {
  createBillingTitleValidation,
  updateBillingTitleValidation,
} = require("../../middlewares/validation/master/billing_title.validation");
const { BillingTitleController } = require("../../controllers/master");

router.post(
  "/createbillingtitle",
  createBillingTitleValidation,
  BillingTitleController.createBillingTitle
);
router.get(
  "/getbillingtitlepagination",
  BillingTitleController.getBillingTitles
);
router.get(
  "/getbillingtitlebyid/:id",
  BillingTitleController.getBillingTitleById
);
router.put(
  "/updatebillingtitle/:id",
  updateBillingTitleValidation,
  BillingTitleController.updateBillingTitle
);
router.delete(
  "/deletebillingtitle/:id",
  BillingTitleController.deleteBillingTitle
);

router.get(
  '/get-billings-title-list',
  BillingTitleController.getAllBillingTitleList
);


router.get(
  '/get-label-list',
  BillingTitleController.getAllLabelList
)


module.exports = router;
