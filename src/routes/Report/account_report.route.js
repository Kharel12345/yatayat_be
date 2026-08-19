// routes/billingTitleInfo.routes.js
const express = require("express");
const { individualLedgerReport, vehicleExpiryReport, dashboardReport } = require("../../controllers/report");
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

router
  .route("/getdashboardreport")
  .get(
    auth,
    dashboardReport.getDashboardReport
  );

module.exports = router;
