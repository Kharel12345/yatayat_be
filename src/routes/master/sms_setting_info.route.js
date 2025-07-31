const express = require("express");
const router = express.Router();
const { smsSettingInfoController } = require("../../controllers/master");
const auth = require("../../middlewares/auth/auth");
const { preauthorize } = require("../../utils/preAuthorize");

router.post(
  "/smssettinginfo",
  auth,
  preauthorize("create_sms_setting_info"),
  smsSettingInfoController.upsertSmsSetting
);

router.get(
  "/smssettinginfo",
  auth,
  preauthorize("view_sms_setting_info"),
  smsSettingInfoController.getSmsSetting
);

module.exports = router; 