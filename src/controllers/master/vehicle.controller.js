const { DATA_SAVED, SUCCESS_API_FETCH } = require("../../helpers/response");
const logger = require("../../config/winstonLoggerConfig");
const { vehicleService } = require("../../services/master");
const { 
  cleanupUploadedFiles, 
  cleanupFilesByPaths,
  manageFileUpdates,
  managePersonFileUpdate,
  manageDriverFileUpdates
} = require("../../utils/fileCleanup");

const createVehicle = async (req, res, next) => {
  try {
    // Basic vehicle data
    const vehicleData = {
      ...req.body,
      createdBy: req.user.user_id,
      photo: req.files?.photo?.[0]?.filename || null, // vehicle photo
      billbookphoto: req.files?.billBookPhoto?.[0]?.filename || null, // vehicle photo
      licensePaper: req.files?.licensePaper?.[0]?.filename || null,
      insurancePaper: req.files?.insurancePaper?.[0]?.filename || null,
      routePermit: req.files?.routePermit?.[0]?.filename || null,
      jachPass: req.files?.jachPass?.[0]?.filename || null,
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
    // Clean up uploaded files if database save fails
    cleanupUploadedFiles(req.files, req.file);
    
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getVehiclesPaginated = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      organization,
      vehicleNo,
      fromDate,
      toDate,
      branch
    } = req.query;

    const result = await vehicleService.getVehiclesPaginated(page, limit, {
      organization,
      vehicleNo,
      fromDate,
      toDate,
      branch
    });
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
  let allFilesToDelete = [];
  let allNewFilesToCleanup = [];
  
  try {

    // Step 1: Get existing vehicle data with all related records
    const existingVehicle = await vehicleService.getVehicleById(req.params.id);
    if (!existingVehicle) {
      cleanupUploadedFiles(req.files, req.file);
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Step 2: Handle main vehicle file updates
    const vehicleFileFields = [
      'photo', 
      'billBookPhoto', 
      'licensePaper', 
      'insurancePaper', 
      'routePermit', 
      'jachPass'
    ];
    
    const vehicleFileManagement = manageFileUpdates(
      existingVehicle, 
      req.files, 
      vehicleFileFields
    );
    
    allFilesToDelete.push(...vehicleFileManagement.filesToDelete);
    allNewFilesToCleanup.push(...vehicleFileManagement.newFilesToCleanup);

    // Step 3: Prepare vehicle data for update
    const vehicleData = {
      ...req.body,
      updatedBy: req.user.user_id,
      // Map billBookPhoto to billbookphoto (database field name)
      ...(vehicleFileManagement.updatedFields.billBookPhoto && {
        billbookphoto: vehicleFileManagement.updatedFields.billBookPhoto
      }),
      // Add other updated file fields
      ...Object.fromEntries(
        Object.entries(vehicleFileManagement.updatedFields)
          .filter(([key]) => key !== 'billBookPhoto')
      )
    };

    // Step 4: Handle operator file updates
    if (req.body.operator) {
      const operatorFileManagement = managePersonFileUpdate(
        existingVehicle.operator,
        req.body.operator,
        req.files,
        'operatorPhoto'
      );
      
      vehicleData.operator = {
        ...operatorFileManagement.updatedData,
        updatedBy: req.user.user_id,
      };
      
      allFilesToDelete.push(...operatorFileManagement.filesToDelete);
      allNewFilesToCleanup.push(...operatorFileManagement.newFilesToCleanup);
    }

    // Step 5: Handle helper file updates
    if (req.body.helper) {
      const helperFileManagement = managePersonFileUpdate(
        existingVehicle.helper,
        req.body.helper,
        req.files,
        'helperPhoto'
      );
      
      vehicleData.helper = {
        ...helperFileManagement.updatedData,
        updatedBy: req.user.user_id,
      };
      
      allFilesToDelete.push(...helperFileManagement.filesToDelete);
      allNewFilesToCleanup.push(...helperFileManagement.newFilesToCleanup);
    }

    // Step 6: Handle driver file updates
    if (req.body.drivers?.length) {
      const driverFileManagement = manageDriverFileUpdates(
        existingVehicle.drivers || [],
        req.body.drivers,
        req.files
      );
      
      vehicleData.drivers = driverFileManagement.updatedDrivers.map(d => ({
        ...d,
        updatedBy: req.user.user_id,
      }));
      
      allFilesToDelete.push(...driverFileManagement.filesToDelete);
      allNewFilesToCleanup.push(...driverFileManagement.newFilesToCleanup);
    }

    // Step 7: Update the vehicle in database
    const updated = await vehicleService.updateVehicle(req.params.id, vehicleData);
    if (!updated) {
      // Clean up new uploaded files if update failed
      cleanupFilesByPaths(allNewFilesToCleanup);
      return res.status(404).json({ error: "Vehicle update failed" });
    }

    // Step 8: Delete old files only after successful database update
    if (allFilesToDelete.length > 0) {
      cleanupFilesByPaths(allFilesToDelete);
      logger.info(`Successfully deleted ${allFilesToDelete.length} old files after vehicle update`);
    }

    res.json({ 
      message: "Vehicle updated successfully",
      filesUpdated: allNewFilesToCleanup.length > 0,
      oldFilesRemoved: allFilesToDelete.length
    });
    
  } catch (error) {
    // Clean up new uploaded files if database update fails
    if (allNewFilesToCleanup.length > 0) {
      cleanupFilesByPaths(allNewFilesToCleanup);
      logger.info(`Cleaned up ${allNewFilesToCleanup.length} new files after update failure`);
    }
    
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);

    // Return error details to caller to aid debugging (will show in frontend console)
    try {
      return res.status(500).json({
        error: error.message,
        stack: error.stack ? String(error.stack) : undefined,
      });
    } catch (sendErr) {
      // Fallback to next if response cannot be sent
      return next(error);
    }
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

const getVechilesForDropdown = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getVechilesForDropdown();
    res.json(SUCCESS_API_FETCH(vehicles));
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
  getVechilesForDropdown,
};
