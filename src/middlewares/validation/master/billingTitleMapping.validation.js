const Joi = require("joi");

const createSchema = Joi.object({
  billing_title_id: Joi.number().integer().required(),
  label_id: Joi.number().integer().required(),
  branch_id: Joi.number().integer().required(),
  status: Joi.boolean().default(true),
  created_by: Joi.number().integer().required(),
});

const updateSchema = Joi.object({
  billing_title_id: Joi.number().integer().optional(),
  label_id: Joi.number().integer().optional(),
  branch_id: Joi.number().integer().optional(),
  status: Joi.boolean().optional(),
}).min(1);

const createBillingTitleMappingValidation = (req, res, next) => {
  const { error } = createSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

const updateBillingTitleMappingValidation = (req, res, next) => {
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  next();
};

module.exports = {
  createBillingTitleMappingValidation,
  updateBillingTitleMappingValidation,
};
