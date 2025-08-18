const economicYearControllers = require("./economic_year.controller");
const smsSettingInfoController = require("./sms_setting_info.controller");
const vehicleController = require("./vehicle.controller");
const categoryController = require("./category.controller");
const subCategoryController = require("./sub_category.controller");
const BillingTitleController= require('./billing_title.controller');
const BillingTitleMappingInfo=require('./billing_title_mapping.controller');
const vehicleBillingController = require("./vehicle_billing.controller");
const uploadController = require("./upload.controller");

module.exports = {
  economicYearControllers,
  smsSettingInfoController,
  vehicleController,
  vehicleBillingController,
  uploadController,
  categoryController,
  subCategoryController,
  BillingTitleController,
  BillingTitleMappingInfo
};
