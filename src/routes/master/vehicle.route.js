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
  upload.single("photo"),
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
