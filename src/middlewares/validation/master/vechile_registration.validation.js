// validations/vehicle.validation.js
const Joi = require("joi");
const fs = require("fs");

const driverSchema = Joi.object({
  driverName: Joi.string().required(),
  registrationNumber: Joi.string().allow(""),
  panNo: Joi.string().allow(""),
  licenseNo: Joi.string().allow(""),
  address: Joi.string().allow(""),
  photo: Joi.string().allow(""),
});

const operatorSchema = Joi.object({
  operatorName: Joi.string().allow(""),
  address: Joi.string().allow(""),
  registrationNumber: Joi.string().allow(""),
  panNo: Joi.string().allow(""),
  photo: Joi.string().allow(""),
});

const helperSchema = Joi.object({
  helperName: Joi.string().allow(""),
  address: Joi.string().allow(""),
  registrationNumber: Joi.string().allow(""),
  panNo: Joi.string().allow(""),
  photo: Joi.string().allow(""),
});

const vehicleSchema = Joi.object({
  vehicleNo: Joi.string().required(),
  ownerName: Joi.string().required(),
  address: Joi.string().required(),
  panNo: Joi.string().allow(""),
  membershipNo: Joi.string().allow(""),
  photo: Joi.string().allow(""),
  licensePaper: Joi.string().allow(""),
  insurancePaper: Joi.string().allow(""),
  registrationDate: Joi.date().required(),
  categoryId: Joi.number().required(),
  subCategoryId: Joi.number().required(),
  functionalYear: Joi.string().required(),
  branchId: Joi.number().required(),
  organization: Joi.string().required().allow("", null),
  drivers: Joi.array().items(driverSchema).allow(null).optional(),
  operator: operatorSchema,
  helper: helperSchema,
});

const vechileRegistrationValidation = (req, res, next) => {
  try {
    // Parse JSON fields if they come as strings (from form-data)
    ["drivers", "operator", "helper"].forEach((field) => {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          req.body[field] = req.body[field];
        }
      }
    });

    // Validate the vehicle data
    const { error } = vehicleSchema.validate(req.body, { abortEarly: false });

    if (error) {
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path); // remove uploaded file if validation fails
      }
      return next(error);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  vechileRegistrationValidation,
};
