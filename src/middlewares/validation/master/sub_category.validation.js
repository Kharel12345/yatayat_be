const Joi = require('joi');

const subCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  status: Joi.number().valid(0, 1).default(1)
});

const updateSubCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50),
  status: Joi.number().valid(0, 1)
}).min(1); // At least one field required

module.exports = {
  subCategorySchema,
  updateSubCategorySchema
};