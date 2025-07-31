const asyncHandler = require('../../middlewares/asyncHandler');
const { registerVehicle, renewVehicle, getVehiclesWithRenewalDue } = require('../../services/master/vehicle.service');
const { DATA_SAVED, SUCCESS_API_FETCH } = require('../../helpers/response');
const logger = require('../../config/winstonLoggerConfig');

const register = asyncHandler(async (req, res, next) => {
  const data = req.body;
  await registerVehicle(data);
  res.status(201).json(DATA_SAVED('Vehicle registered successfully!'));
});

const renew = asyncHandler(async (req, res, next) => {
  const { vehicle_id, renewal_type, amount, payment_method } = req.body;
  const result = await renewVehicle(vehicle_id, renewal_type, amount, payment_method);
  res.status(201).json(SUCCESS_API_FETCH(result, 'Vehicle renewed successfully!'));
});

const getDue = asyncHandler(async (req, res, next) => {
  const dueVehicles = await getVehiclesWithRenewalDue();
  res.status(200).json(SUCCESS_API_FETCH(dueVehicles));
});

module.exports = {
  register,
  renew,
  getDue,
}; 