const { SmsSettingInfo } = require("../../../models/master");

const upsertSmsSetting = async (data) => {
  try {
    return await (SmsSettingInfo).createOrUpdate(data);
  } catch (error) {
    throw new Error(error);
  }
};

const getSmsSetting = async () => {
  try {
    return await (SmsSettingInfo).getSetting();
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  upsertSmsSetting,
  getSmsSetting,
}; 