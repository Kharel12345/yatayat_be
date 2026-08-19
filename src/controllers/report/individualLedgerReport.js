const logger = require("../../config/winstonLoggerConfig");
const { ledgerReportService } = require("../../services/report");

const getIndividualLedgerReport = async (req, res, next) => {
  try {
    let { fromDate, toDate, ledgerId } = req.query;

    const result = await ledgerReportService.getIndividualLedgerReport(
      fromDate,
      toDate,
      ledgerId
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
