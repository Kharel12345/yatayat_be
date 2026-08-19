// validations/billingTitleInfo.validation.js
const Joi = require('joi');

const createBillingTitleSchema = Joi.object({
  billing_title_code: Joi.number().integer().required(),
  billing_title: Joi.string().required(),
  rate: Joi.number().precision(2).required(),
  branch_id: Joi.number().integer().required(),
  functional_year_id: Joi.number().integer().required(),
  created_by: Joi.number().integer().required(),
  status: Joi.number().integer().valid(0, 1)
});

const updateBillingTitleSchema = Joi.object({
  billing_title_code: Joi.number().integer(),
  billing_title: Joi.string(),
  rate: Joi.number().precision(2),
  branch_id: Joi.number().integer(),
  functional_year_id: Joi.number().integer(),
  created_by: Joi.number().integer(),
  status: Joi.number().integer().valid(0, 1)
});


const createBillingTitleValidation = (req, res, next) => {
    const { error } = createBillingTitleSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    next()
}


const updateBillingTitleValidation = (req, res, next) => {
    const { error } = updateBillingTitleSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    next()
}


module.exports = {
  createBillingTitleValidation,
  updateBillingTitleValidation
};
