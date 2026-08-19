const Joi = require("joi");
const individualLedgerReportValidationSchema = Joi.object({
  fromDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      "string.pattern.base": 'Date must be in the format "yyyy-mm-dd"',
    })
    .required(),
  toDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      "string.pattern.base": 'Date must be in the format "yyyy-mm-dd"',
    })
    .required(),
  ledger_id: Joi.number().required(),
});


const individualLedgerReportValidation = (req, res, next) => {
  const { error } = individualLedgerReportValidationSchema.validate(req.query);
  if (error) {
    return next(error);
  }
  next();
};


module.exports = {
  individualLedgerReportValidation,
};
