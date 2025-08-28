const logger = require("../../config/winstonLoggerConfig");
const { ledgerReportService } = require("../../services/report");

const getIndividualLedgerReport = async (req, res, next) => {
  try {
    let { fromDate, toDate, ledger_id } = req.query;

    const result = await ledgerReportService.getIndividualLedgerReport(
      fromDate,
      toDate,
      ledger_id
    );

    return res.status(200).json({
      status: true,
      message: "Data found successfully!!!",
      data: result,
    });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

module.exports = {
  getIndividualLedgerReport,
};
