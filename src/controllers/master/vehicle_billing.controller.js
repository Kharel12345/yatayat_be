const { vehicleBillingService } = require('../../services/master');
const { DATA_SAVED, SUCCESS_API_FETCH } = require('../../helpers/response');
const logger = require('../../config/winstonLoggerConfig');

const createInvoice = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user.user_id,
    };
    const result = await vehicleBillingService.createRenewalInvoice(payload);
    res.status(201).json(SUCCESS_API_FETCH(result, 'Invoice created successfully'));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await vehicleBillingService.getInvoice(req.params.id);
    res.status(200).json(SUCCESS_API_FETCH(invoice));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

const listInvoices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, vehicle_id } = req.query;
    const result = await vehicleBillingService.listInvoices({ page, limit, vehicle_id });
    res.status(200).json(SUCCESS_API_FETCH(result));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

const getVehiclesNeedingRenewal = async (req, res, next) => {
  try {
    const { days_threshold = 30 } = req.query;
    const vehicles = await vehicleBillingService.getVehiclesNeedingRenewal(Number(days_threshold));
    res.status(200).json(SUCCESS_API_FETCH(vehicles));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

module.exports = {
  createInvoice,
  getInvoice,
  listInvoices,
  getVehiclesNeedingRenewal,
}; 