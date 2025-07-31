const { smsSettingInfoService } = require("../../services/master");
const { DATA_SAVED, SUCCESS_API_FETCH } = require("../../helpers/response");
const logger = require("../../config/winstonLoggerConfig");

const upsertSmsSetting = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      created_by: req.user.user_id,
      created_in: new Date(),
    };
    await smsSettingInfoService.upsertSmsSetting(data);
    res.status(201).json(DATA_SAVED("SMS Setting saved/updated successfully!"));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

const getSmsSetting = async (req, res, next) => {
  try {
    const setting = await smsSettingInfoService.getSmsSetting();
    res.status(200).json(SUCCESS_API_FETCH(setting));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

module.exports = {
  upsertSmsSetting,
  getSmsSetting,
}; 