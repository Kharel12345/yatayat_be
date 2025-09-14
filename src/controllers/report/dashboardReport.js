
const logger = require("../../config/winstonLoggerConfig");
const { dashboardReportServices } = require("../../services/report");

const getDashboardReport = async (req, res, next) => {
    try {

        console.log('getDashboardReport');


        const result = await dashboardReportServices.getDashboardReport();

        console.log('result', result);

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
    getDashboardReport,
};
