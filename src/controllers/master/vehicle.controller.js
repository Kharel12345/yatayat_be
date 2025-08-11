const { DATA_SAVED, SUCCESS_API_FETCH } = require("../../helpers/response");
const logger = require("../../config/winstonLoggerConfig");
const { vehicleService } = require("../../services/master");

const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json({ message: "Vehicle created", vehicle });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getVehiclesPaginated = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await vehicleService.getVehiclesPaginated(page, limit);
    res.json(SUCCESS_API_FETCH(result));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getVehicleById = async (req, res, next) => {
  try {
    console.log(req.params.id);
    
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(SUCCESS_API_FETCH(vehicle));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const updated = await vehicleService.updateVehicle(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Vehicle not found" });
    res.json({ message: "Vehicle updated successfully" });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

module.exports = {
  createVehicle,
  getVehicleById,
  getVehiclesPaginated,
  updateVehicle,
  deleteVehicle,
};
