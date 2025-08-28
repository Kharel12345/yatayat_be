// routes/billingTitleInfo.routes.js
const express = require("express");
const { individualLedgerReport } = require("../../controllers/report");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/getindividualledgerreport")
  .get(
    auth,
  // individualLedgerReportValidation,
    individualLedgerReport.getIndividualLedgerReport
  );

module.exports = router;
