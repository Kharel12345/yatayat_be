const express = require("express");
const router = express.Router();
const {
  economicYearControllers,
  categoryController,
} = require("../../controllers/master");
const {
  setupEconomicYearValidation,
} = require("../../middlewares/validation/master");
const auth = require("../../middlewares/auth");
const { getReceiptNo } = require("../../utils/index_info");
// const { preauthorize } = require("../../utils/preAuthorize");

router.post(
  "/economicyearsetup",
  auth,
  // preauthorize("create_functional_year"),
  setupEconomicYearValidation.setupEconomicYearValidation,
  economicYearControllers.setupEconomicYear
);

router.get(
  "/addatetocustomdate",
  auth,
  setupEconomicYearValidation.adDateToCustomDateValidation,
  economicYearControllers.adDateToCustomDate
);

router.get(
  "/geteconomicyearlist",
  auth,
  economicYearControllers.getEconomicYearList
);

router.get("/getlatestreceiptno", auth, categoryController.getLatestReceiptNo);

module.exports = router;
