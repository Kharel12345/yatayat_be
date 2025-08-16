const { DATA_SAVED, SUCCESS_API_FETCH } = require("../../helpers/response");
const logger = require("../../config/winstonLoggerConfig");
const { vehicleService } = require("../../services/master");

const createVehicle = async (req, res, next) => {
  try {
    // Basic vehicle data
    const vehicleData = {
      ...req.body,
      createdBy: req.user.user_id,
      photo: req.files?.photo?.[0]?.filename || null, // vehicle photo
      licensePaper: req.files?.licensePaper?.[0]?.filename || null,
      insurancePaper: req.files?.insurancePaper?.[0]?.filename || null,
    };

    // Operator data (optional)
    if (req.body.operator) {
      vehicleData.operator = {
        ...req.body.operator,
        createdBy: req.user.user_id,
        photo: req.files?.operatorPhoto?.[0]?.filename || null,
      };
    }

    // Helper data (optional)
    if (req.body.helper) {
      vehicleData.helper = {
        ...req.body.helper,
        createdBy: req.user.user_id,
        photo: req.files?.helperPhoto?.[0]?.filename || null,
      };
    }

    // console.log(req.files);
    const driverPhotoKeys = Object.keys(req.files || {}).filter((key) =>
      key.startsWith("driverPhoto")
    );


    // Map photos to drivers
    if (req.body.drivers?.length) {
      vehicleData.drivers = req.body.drivers.map((d, index) => {
        const photoKey = driverPhotoKeys.find((key) =>
          key.endsWith(`[${index}]`)
        );
        return {
          ...d,
          createdBy: req.user.user_id,
          photo: req.files?.[photoKey]?.[0]?.filename || null, // assign photo by its fieldname
        };
      });
    }

    const vehicle = await vehicleService.createVehicle(vehicleData);
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

    // const vehicle = await Vehicle.findByPk(id);
    // if (!vehicle) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Vehicle not found" });
    // }
    // if (req.body.photo && vehicle.photo) {
    //   const oldPath = path.join(__dirname, "../uploads", vehicle.photo);
    //   if (fs.existsSync(oldPath)) {
    //     fs.unlinkSync(oldPath); // remove old file
    //   }
    // }
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
