// routes/billingTitleInfo.routes.js
const express = require("express");
const { individualLedgerReport, vehicleExpiryReport } = require("../../controllers/report");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/getindividualledgerreport")
  .get(
    auth,
  // individualLedgerReportValidation,
    individualLedgerReport.getIndividualLedgerReport
  );

router
  .route("/getvehicleexpiryreport")
  .get(
    auth,
    vehicleExpiryReport.getVehicleExpiryReport
  );

module.exports = router;
