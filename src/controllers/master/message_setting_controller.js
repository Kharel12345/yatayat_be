const { messageSettingInfoService } = require("../../services/master");
const { DATA_SAVED, SUCCESS_API_FETCH } = require("../../helpers/response");
const logger = require("../../config/winstonLoggerConfig");

const upsertMessageSetting = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      created_by: req.user.user_id,
    };

    await messageSettingInfoService.upsertMessageSetting(data);

    res
      .status(201)
      .json(DATA_SAVED("Message Setting saved successfully!"));

  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );

    return next(error);
  }
};


const getMessageSetting = async (req, res, next) => {
  try {
    const setting = await messageSettingInfoService.getMessageSetting();

    res.status(200).json(SUCCESS_API_FETCH(setting));

  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );

    return next(error);
  }
};


const getMyMessageSetting = async (req, res, next) => {
  try {
    const { type } = req.query;

    if (!type) {
      const error = new Error("type query parameter is required");
      error.statusCode = 400;
      return next(error);
    }

    const setting = await messageSettingInfoService.getMessageSettingByUserAndType(
      req.user.user_id,
      type
    );

    res.status(200).json(SUCCESS_API_FETCH(setting));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};


const updateMessageSetting = async (req, res, next) => {
  try {
    const { id } = req.params;

    await messageSettingInfoService.updateMessageSetting(
      id,
      req.user.user_id,
      req.body
    );

    res
      .status(200)
      .json(DATA_SAVED("Message Setting updated successfully!"));

  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );

    return next(error);
  }
};


const deleteMessageSetting = async (req, res, next) => {
  try {
    const { id } = req.params;

    await messageSettingInfoService.deleteMessageSetting(
      id,
      req.user.user_id
    );

    res
      .status(200)
      .json(DATA_SAVED("Message Setting deleted successfully!"));

  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );

    return next(error);
  }
};


module.exports = {
  upsertMessageSetting,
  getMessageSetting,
  getMyMessageSetting,
  updateMessageSetting,
  deleteMessageSetting,
};