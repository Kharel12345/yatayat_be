const Joi = require('joi')

const setupEconomicYearValidationSchema = Joi.object({
    functional_year: Joi.string(),
    functional_year_start_bs: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
    functional_year_end_bs: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required()
})

const adDateToCustomDateValidationSchema = Joi.object({
    adDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required()
})

const branchSetupValidationSchema = Joi.object({
    branch_code: Joi.number().required(),
    name: Joi.string().required(),
    address: Joi.string().required().allow("", null),
    contact: Joi.string().required().allow("", null)
})

const branchSetupValidation = (req, res, next) => {
    const { error } = branchSetupValidationSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    next()
}

const adDateToCustomDateValidation = (req, res, next) => {
    const { error } = adDateToCustomDateValidationSchema.validate(req.query)
    if (error) {
        return next(error)
    }
    next()
}

const setupEconomicYearValidation = (req, res, next) => {
    const { error } = setupEconomicYearValidationSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    next()
}


module.exports = {
    setupEconomicYearValidation,
    adDateToCustomDateValidation,
    branchSetupValidation
}