const Joi = require("joi");

const createCashReceiptSchema = Joi.object({
  vehicle_id: Joi.number().integer().positive().required().messages({
    "number.base": "Vehicle ID must be a number",
    "number.integer": "Vehicle ID must be an integer",
    "number.positive": "Vehicle ID must be a positive number",
    "any.required": "Vehicle ID is required",
  }),
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be a positive number",
    "any.required": "Amount is required",
  }),
  bill_date_bs: Joi.string().required().messages({
    "string.base": "Bill date (BS) must be a string",
    "any.required": "Bill date (BS) is required",
  }),
  payment_method: Joi.string().valid("cash", "online").required().messages({
    "string.base": "Payment method must be a string",
    "any.only": "Payment method must be either cash or online",
    "any.required": "Payment method is required",
  }),
  bank_id: Joi.when("payment_method", {
    is: "online",
    then: Joi.number().integer().positive().required().messages({
      "number.base": "Bank ID must be a number",
      "number.integer": "Bank ID must be an integer",
      "number.positive": "Bank ID must be a positive number",
      "any.required": "Bank ID is required for online payments",
    }),
    otherwise: Joi.forbidden(),
  }),
  remarks: Joi.string().max(500).optional(),
  qrremarks: Joi.string().max(500).optional(),
  branch_id: Joi.number().integer().positive().required().messages({
    "number.base": "Branch ID must be a number",
    "number.integer": "Branch ID must be an integer",
    "number.positive": "Branch ID must be a positive number",
    "any.required": "Branch ID is required",
  }),
  functional_year_id: Joi.number().integer().positive().required().messages({
    "number.base": "Functional Year ID must be a number",
    "number.integer": "Functional Year ID must be an integer",
    "number.positive": "Functional Year ID must be a positive number",
    "any.required": "Functional Year ID is required",
  }),
});

const listCashReceiptSchema = Joi.object({
  page: Joi.number().integer().positive().optional().default(1),
  limit: Joi.number().integer().positive().max(100).optional().default(10),
  search: Joi.string().allow("").optional().default(""),
  payment_method: Joi.string().valid("cash", "online").allow("").optional().default(""),
  status: Joi.number().valid(0, 1).optional().default(1),
  branch_id: Joi.number().integer().positive().optional(),
  functional_year_id: Joi.number().integer().positive().optional(),
});

const updateCashReceiptSchema = Joi.object({
  vehicle_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Vehicle ID must be a number",
    "number.integer": "Vehicle ID must be an integer",
    "number.positive": "Vehicle ID must be a positive number",
  }),
  amount: Joi.number().positive().optional().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be a positive number",
  }),
  bill_date_bs: Joi.string().optional().messages({
    "string.base": "Bill date (BS) must be a string",
  }),
  payment_method: Joi.string().valid("cash", "online").optional().messages({
    "string.base": "Payment method must be a string",
    "any.only": "Payment method must be either cash or online",
  }),
  bank_id: Joi.when("payment_method", {
    is: "online",
    then: Joi.number().integer().positive().required().messages({
      "number.base": "Bank ID must be a number",
      "number.integer": "Bank ID must be an integer",
      "number.positive": "Bank ID must be a positive number",
      "any.required": "Bank ID is required for online payments",
    }),
    otherwise: Joi.number().integer().positive().optional(),
  }),
  remarks: Joi.string().max(500).optional(),
  branch_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Branch ID must be a number",
    "number.integer": "Branch ID must be an integer",
    "number.positive": "Branch ID must be a positive number",
  }),
  functional_year_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Functional Year ID must be a number",
    "number.integer": "Functional Year ID must be an integer",
    "number.positive": "Functional Year ID must be a positive number",
  }),
  status: Joi.number().valid(0, 1).optional(),
}).min(1);

module.exports = {
  createCashReceiptSchema,
  listCashReceiptSchema,
  updateCashReceiptSchema,
};