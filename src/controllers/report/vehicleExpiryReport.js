const logger = require("../../config/winstonLoggerConfig");
const { vehicleExpiryReportService } = require("../../services/report");

const getVehicleExpiryReport = async (req, res, next) => {
  try {
    const { toDate } = req.query;

    const result = await vehicleExpiryReportService.getVehicleExpiryReport(toDate);

    return res.status(200).json({
      status: true,
      message: "Vehicle expiry report fetched successfully",
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
  getVehicleExpiryReport,
};