const logger = require("../../config/winstonLoggerConfig");

const getIndividualLedgerReport = asyncHandler(async (req, res, next) => {
  try {
    let { fromDate, toDate, ledger_id } = req.query;

    const result = await reportServices.getIndividualLedgerReport(
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
});

module.exports = {
  getIndividualLedgerReport,
};
