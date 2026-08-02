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
    amount: Joi.number().positive().required().messages({
  "number.base": "Amount must be a number",
  "number.positive": "Amount must be a positive number",
  "any.required": "Amount is required",
}),
  billing_title_id: Joi.number().integer().positive().required().messages({
    "number.base": "Billing Title ID must be a number",
    "number.integer": "Billing Title ID must be an integer",
    "number.positive": "Billing Title ID must be a positive number",
    "any.required": "Billing Title ID is required",
  }),
  payment_method: Joi.string()
    .valid("cash", "credit", "bank_transfer", "online", "cheque")
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
  status: Joi.number()
    .valid(0, 1) // 0 = inactive, 1 = active
    .optional()
    .messages({
      "number.base": "Status must be a number",
      "any.only": "Status must be either 0 (Inactive) or 1 (Active)",
    }),

  bank_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Bank ID must be a number",
    "number.integer": "Bank ID must be an integer",
    "number.positive": "Bank ID must be a positive number",
  }),
  qrRemarks: Joi.string().max(500).optional().messages({
    "string.base": "Remarks must be a string",
    "string.max": "Remarks cannot exceed 500 characters",
  }),
  functional_year_id: Joi.number().integer().positive().required().messages({
    "number.base": "Functional Year ID must be a number",
    "number.integer": "Functional Year ID must be an integer",
    "number.positive": "Functional Year ID must be a positive number",
    "any.required": "Functional Year ID is required",
  }),
  branch_id: Joi.number().integer().positive().required().messages({
    "number.base": "Branch ID must be a number",
    "number.integer": "Branch ID must be an integer",
    "number.positive": "Branch ID must be a positive number",
    "any.required": "Branch ID is required",
  }),
  //discount part
  discount: Joi.number().min(0).max(100).optional().messages({
  "number.base": "Discount must be a number",
  "number.min": "Discount cannot be negative",
  "number.max": "Discount cannot exceed 100",
}),
});

const updateInvoiceSchema = Joi.object({
  // Existing fields
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

  // Core updatable fields to align with create
  vehicle_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Vehicle ID must be a number",
    "number.integer": "Vehicle ID must be an integer",
    "number.positive": "Vehicle ID must be a positive number",
  }),
  billing_title_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Billing Title ID must be a number",
    "number.integer": "Billing Title ID must be an integer",
    "number.positive": "Billing Title ID must be a positive number",
  }),
  amount: Joi.number().positive().optional().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be a positive number",
  }),
  bill_date_bs: Joi.string().optional().messages({
    "string.base": "Bill date (BS) must be a string",
  }),
  expiry_date_bs: Joi.string().optional().messages({
    "string.base": "Expiry date (BS) must be a string",
  }),
  payment_method: Joi.string()
    .valid("cash", "credit", "bank_transfer", "online", "cheque", "direct bank transfer")
    .optional()
    .messages({
      "string.base": "Payment method must be a string",
    }),
  bank_id: Joi.when("payment_method", {
    is: Joi.string().valid("bank_transfer", "online", "direct bank transfer"),
    then: Joi.number().integer().positive().required().messages({
      "number.base": "Bank ID must be a number",
      "number.integer": "Bank ID must be an integer",
      "number.positive": "Bank ID must be a positive number",
      "any.required": "Bank ID is required for bank/online payments",
    }),
    otherwise: Joi.number().integer().positive().optional(),
  }),
  receipt_no: Joi.string().max(500).optional().messages({
    "string.base": "Receipt number must be a string",
    "string.max": "Receipt number cannot exceed 500 characters",
  }),
  functional_year_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Functional Year ID must be a number",
    "number.integer": "Functional Year ID must be an integer",
    "number.positive": "Functional Year ID must be a positive number",
  }),
  branch_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Branch ID must be a number",
    "number.integer": "Branch ID must be an integer",
    "number.positive": "Branch ID must be a positive number",
  }),
  //discount part
  discount: Joi.number().min(0).max(100).optional().messages({
  "number.base": "Discount must be a number",
  "number.min": "Discount cannot be negative",
  "number.max": "Discount cannot exceed 100",
}),
}).min(1);

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
  status: Joi.number()
    .valid(0, 1) // 0 = inactive, 1 = active
    .optional()
    .messages({
      "number.base": "Status must be a number",
      "any.only": "Status must be either 0 (Inactive) or 1 (Active)",
    }),
  vehicle_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Vehicle ID must be a number",
    "number.integer": "Vehicle ID must be an integer",
    "number.positive": "Vehicle ID must be a positive number",
  }),
  fromDate: Joi.string().optional().messages({
    "date.base": "To date must be a valid date",
  }),
  toDate: Joi.string().optional().messages({
    "date.base": "To date must be a valid date",
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

const validateUpdatePaymentStatus = Joi.object({
  status: Joi.string()
    .valid("pending", "paid", "overdue", "cancelled")
    .optional()
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of: pending, paid, overdue, cancelled",
    }),
});

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
  getInvoicesSchema,
  getRenewalRemindersSchema,
  validateUpdatePaymentStatus
};
