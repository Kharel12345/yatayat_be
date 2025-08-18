const FunctionalYear = require("./economic_year.model");
const SmsSettingInfo = require("./sms_setting_info.model");
const Vehicle = require("./vehicle.model");
const VehicleRenewal = require("./vehicle_renewal.model");
const VehicleTransaction = require("./vehicle_transaction.model");
const Operator = require("./operator.model");
const Helper = require("./helper.model");
const Driver = require("./driver.model");
const BillingTitleInfo=require('./billing_title.model');
const BillingTitleMappingInfo=require('./billing_title_mappingInfo');
const VehicleInvoice = require("./vehicle_invoice.model");
const VehicleInvoiceItem = require("./vehicle_invoice_item.model");

module.exports = {
  FunctionalYear,
  SmsSettingInfo,
  Vehicle,
  VehicleRenewal,
  VehicleTransaction,
  Operator,
  Helper,
  Driver,
  BillingTitleInfo,
  BillingTitleMappingInfo,
  VehicleInvoice,
  VehicleInvoiceItem,
};
