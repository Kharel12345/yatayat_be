// validations/vehicle.validation.js
const Joi = require('joi');

const driverSchema = Joi.object({
  driverName: Joi.string().required(),
  registrationNumber: Joi.string().allow(''),
  panNo: Joi.string().allow(''),
  licenseNo: Joi.string().allow(''),
  address: Joi.string().allow(''),
  photo: Joi.string().allow('')
});

const operatorSchema = Joi.object({
  operatorName: Joi.string().allow(''),
  address: Joi.string().allow(''),
  registrationNumber: Joi.string().allow(''),
  panNo: Joi.string().allow(''),
  photo: Joi.string().allow('')
});

const helperSchema = Joi.object({
  helperName: Joi.string().allow(''),
  address: Joi.string().allow(''),
  registrationNumber: Joi.string().allow(''),
  panNo: Joi.string().allow(''),
  photo: Joi.string().allow('')
});

const vehicleSchema = Joi.object({
  vehicleNo: Joi.string().required(),
  ownerName: Joi.string().required(),
  address: Joi.string().required(),
  panNo: Joi.string().allow(''),
  membershipNo: Joi.string().allow(''),
  photo: Joi.string().allow(''),
  registrationDate: Joi.date().required(),
  drivers: Joi.array().items(driverSchema).min(1),
  operator: operatorSchema,
  helper: helperSchema
});

const vechileRegistrationValidation = (req, res, next) => {
    const { error } = vehicleSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    next()
}

module.exports = {
  vechileRegistrationValidation
};
