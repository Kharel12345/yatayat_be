const express = require("express");
const router = express.Router();

const { messageSettingInfoController } = require("../../controllers/master");
const auth = require("../../middlewares/auth");


router.post(
  "/messagesetting",
  auth,
  messageSettingInfoController.upsertMessageSetting
);


router.get(
  "/messagesetting",
  auth,
  messageSettingInfoController.getMessageSetting
);


router.get(
  "/messagesetting/mine",
  auth,
  messageSettingInfoController.getMyMessageSetting
);


router.put(
  "/messagesetting/:id",
  auth,
  messageSettingInfoController.updateMessageSetting
);


router.delete(
  "/messagesetting/:id",
  auth,
  messageSettingInfoController.deleteMessageSetting
);


module.exports = router;