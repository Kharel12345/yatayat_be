const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const {
  vechileRegistrationValidation,
} = require("../../middlewares/validation/master");
const { vehicleController } = require("../../controllers/master");
const upload = require("../../middlewares/upload");
// const { preauthorize } = require('../../utils/preAuthorize');

router.post(
  "/creatememberregistartion",
  auth,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "billBookPhoto", maxCount: 1 },
    { name: "licensePaper", maxCount: 1 },
    { name: "insurancePaper", maxCount: 1 },
    { name: "operatorPhoto", maxCount: 1 },
    { name: "helperPhoto", maxCount: 1 },
    { name: "driverPhoto[0]", maxCount: 5 },
    { name: "driverPhoto[1]", maxCount: 5 },
  ]),
  vechileRegistrationValidation.vechileRegistrationValidation,
  vehicleController.createVehicle
);
router.get(
  "/getmemberregistartionpagination",
  vehicleController.getVehiclesPaginated
);
router.get("/getmemberregistartionbyid/:id", vehicleController.getVehicleById);
router.put(
  "/updatememberregistartion/:id",
  vechileRegistrationValidation.vechileRegistrationValidation,
  vehicleController.updateVehicle
);
router.delete("/deletememberregistartion/:id", vehicleController.deleteVehicle);

module.exports = router;
