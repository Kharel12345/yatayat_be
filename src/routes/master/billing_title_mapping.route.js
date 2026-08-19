const express = require("express");
const { BillingTitleMappingInfo } = require("../../controllers/master");
const {
  createBillingTitleMappingValidation,
  updateBillingTitleMappingValidation,
} = require("../../middlewares/validation/master/billingTitleMapping.validation");
const router = express.Router();

// CRUD routes
router.post(
  "/createbillmapping",
  createBillingTitleMappingValidation,
  BillingTitleMappingInfo.createBillingMapping
);
router.get("/getallbillmapping", BillingTitleMappingInfo.findAllBillingMapping);
router.get(
  "/getbillmappingbyid/:id",
  BillingTitleMappingInfo.findOneBillingMapping
);
router.put(
  "/updatebillmapping/:id",
  updateBillingTitleMappingValidation,
  BillingTitleMappingInfo.updateBillingMapping
);
router.delete(
  "/deletebillmapping/:id",
  BillingTitleMappingInfo.deleteBillingMapping
);

module.exports = router;
