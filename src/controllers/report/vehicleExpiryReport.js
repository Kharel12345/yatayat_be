const logger = require("../../config/winstonLoggerConfig");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const { vehicleExpiryReportService } = require("../../services/report");

const getVehicleExpiryReport = async (req, res, next) => {
  try {
    const { toDate } = req.query;

    const calendar = new Nepali_Calendar();

    const adDate = calendar.BSToADConvert(toDate);

    const result = await vehicleExpiryReportService.getVehicleExpiryReport(adDate);

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