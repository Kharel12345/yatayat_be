const smsSettingInfoRoute = require("./sms_setting_info.route");
const vehicleRoute = require("./vehicle.route");
const economicYearRoute = require("./economic_year.route");
const vechileCategoryRoutes = require("./category.route");
const vechileSubCategoryRoutes = require("./sub_category.route");
const BillingTitleRoutes=require('./billing_title.route');
const BillingTitleMappingInfoRoutes= require('./billing_title_mapping.route');
const userRoutes = require("./user.route");
const vehicleBillingRoute = require("./vehicle_billing.route");
const uploadRoute = require("./upload.route");

module.exports = {
  smsSettingInfoRoute,
  vehicleRoute,
  economicYearRoute,
  vechileCategoryRoutes,
  vechileSubCategoryRoutes,
  BillingTitleRoutes,
  BillingTitleMappingInfoRoutes,
  userRoutes,
  vehicleBillingRoute,
  uploadRoute
};
