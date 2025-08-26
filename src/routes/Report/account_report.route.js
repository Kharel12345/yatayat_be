// routes/billingTitleInfo.routes.js
const express = require("express");
const { individualLedgerReportValidation } = require("../../middlewares/indivudual_ledger_report.validation");
const { individualLedgerReport } = require("../../controllers/report");
const router = express.Router();

router
  .route("/getindividualledgerreport")
  .get(
    auth,
    individualLedgerReportValidation,
    individualLedgerReport.getIndividualLedgerReport
  );

module.exports = router;
