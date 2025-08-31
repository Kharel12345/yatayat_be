const Joi = require("joi");

const createInvoiceSchema = Joi.object({
  receipt_no: Joi.string().max(500).optional().messages({
    "string.base": "Remarks must be a string",
    "string.max": "Remarks cannot exceed 500 characters",
  }),
  vehicle_id: Joi.number().integer().positive().required().messages({
    "number.base": "Vehicle ID must be a number",
    "number.integer": "Vehicle ID must be an integer",
    "number.positive": "Vehicle ID must be a positive number",
    "any.required": "Vehicle ID is required",
  }),
    amount: Joi.number().integer().positive().required().messages({
    "number.base": "Billing Title ID must be a number",
    "number.integer": "Billing Title ID must be an integer",
    "number.positive": "Billing Title ID must be a positive number",
    "any.required": "Billing Title ID is required",
  }),
  billing_title_id: Joi.number().integer().positive().required().messages({
    "number.base": "Billing Title ID must be a number",
    "number.integer": "Billing Title ID must be an integer",
    "number.positive": "Billing Title ID must be a positive number",
    "any.required": "Billing Title ID is required",
  }),
  payment_method: Joi.string()
    .valid("Cash", "credit", "bank_transfer", "online", "cheque")
    .optional()
    .messages({
      "string.base": "Payment mode must be a string",
      "any.only":
        "Payment mode must be one of: cash, card, bank_transfer, online, cheque",
    }),
  remarks: Joi.string().max(500).optional().messages({
    "string.base": "Remarks must be a string",
    "string.max": "Remarks cannot exceed 500 characters",
  }),
  bill_date_bs: Joi.string().optional().messages({
    "date.base": "Invoice date must be a valid date",
  }),
  expiry_date_bs: Joi.string().optional().messages({
    "date.base": "Invoice date must be a valid date",
  }),
});

const updateInvoiceSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "paid", "overdue", "cancelled")
    .optional()
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of: pending, paid, overdue, cancelled",
    }),
  payment_mode: Joi.string()
    .valid("cash", "credit", "bank_transfer", "online", "cheque")
    .optional()
    .messages({
      "string.base": "Payment mode must be a string",
      "any.only":
        "Payment mode must be one of: cash, card, bank_transfer, online, cheque",
    }),
  payment_date: Joi.date().optional().messages({
    "date.base": "Payment date must be a valid date",
  }),
  remarks: Joi.string().max(500).optional().messages({
    "string.base": "Remarks must be a string",
    "string.max": "Remarks cannot exceed 500 characters",
  }),
});

const getInvoicesSchema = Joi.object({
  page: Joi.number().integer().positive().optional().default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.positive": "Page must be a positive number",
  }),
  limit: Joi.number()
    .integer()
    .positive()
    .max(100)
    .optional()
    .default(10)
    .messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.positive": "Limit must be a positive number",
      "number.max": "Limit cannot exceed 100",
    }),
  status: Joi.string()
    .valid("pending", "paid", "overdue", "cancelled")
    .optional()
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of: pending, paid, overdue, cancelled",
    }),
  vehicle_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Vehicle ID must be a number",
    "number.integer": "Vehicle ID must be an integer",
    "number.positive": "Vehicle ID must be a positive number",
  }),
});

const getRenewalRemindersSchema = Joi.object({
  days: Joi.number()
    .integer()
    .positive()
    .max(90)
    .optional()
    .default(7)
    .messages({
      "number.base": "Days must be a number",
      "number.integer": "Days must be an integer",
      "number.positive": "Days must be a positive number",
      "number.max": "Days cannot exceed 90",
    }),
});

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
  getInvoicesSchema,
  getRenewalRemindersSchema,
};
