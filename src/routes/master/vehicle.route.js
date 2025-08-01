const express = require("express");
const router = express.Router();
const {
  register,
  renew,
  getDue,
} = require("../../controllers/master/vehicle.controller");
const auth = require("../../middlewares/auth");
// const { preauthorize } = require('../../utils/preAuthorize');

router.post("/register", auth, 
    // preauthorize("create_vehicle"),
     register);
router.post("/renew", auth,
    //  preauthorize("renew_vehicle"), 
     renew);
router.get("/due", auth,
    //  preauthorize("view_due_vehicle"), 
     getDue);

module.exports = router;
