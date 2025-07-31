const Joi = require('joi')

const saveLedgerValidationSchema = Joi.object({
    ledger_name: Joi.string().required(),
    master_ledger_group_id: Joi.number().required(),
    ledger_sub_group_id: Joi.number().required().allow(null),
    address: Joi.string().required().allow(null),
    contact: Joi.number().required().allow(null),
    opening_balance_date_bs: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
    opening_balance: Joi.number().required(),
    transaction_type: Joi.string().required().valid('Credit', 'Debit'),
    status: Joi.number().required().valid(0, 1),
    functional_year_id: Joi.number().required(),
    branch_id: Joi.number().required(),
})

const getLedgerPaginationValidationSchema = Joi.object({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    status: Joi.number().required(),
    ledgerName: Joi.string().optional().allow('', null),
})

const updateLedgerValidationSchema = Joi.object({
    ledger_id: Joi.number().required(),
    ledger_name: Joi.string().required(),
    master_ledger_group_id: Joi.number().required(),
    ledger_sub_group_id: Joi.number().required().allow(null),
    address: Joi.string().required().allow(null),
    contact: Joi.number().required().allow(null),
    opening_balance_date_bs: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
    opening_balance: Joi.number().required(),
    transaction_type: Joi.string().required().valid('Credit', 'Debit'),
    status: Joi.number().required().valid(0, 1),
    functional_year_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    remarks: Joi.string().required()
})

const saveLedgerMappingValidationSchema = Joi.object({
    id: Joi.number().required(),
    ledger_id: Joi.number().required()
})

const getLedgerMappingPaginationValidationSchema=Joi.object({
    page: Joi.number().required(),
    limit: Joi.number().required()
})

const getLedgerMappingPaginationValidation= (req, res, next) => {
    const { error } = getLedgerMappingPaginationValidationSchema.validate(req.query)
    if (error) {
        return next(error)
    }
    next()
}

const saveLedgerMappingValidation = (req, res, next) => {
    const { error } = saveLedgerMappingValidationSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    next()
}

const updateLedgerValidation = (req, res, next) => {
    const { error } = updateLedgerValidationSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    next()
}


const getLedgerPaginationValidation = (req, res, next) => {
    const { error } = getLedgerPaginationValidationSchema.validate(req.query)
    if (error) {
        return next(error)
    }
    next()
}


const saveLedgerValidation = (req, res, next) => {
    console.log(req.body);
    
    const { error } = saveLedgerValidationSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    next()
}

module.exports = {
    saveLedgerValidation,
    getLedgerPaginationValidation,
    updateLedgerValidation,
    saveLedgerMappingValidation,
    getLedgerMappingPaginationValidation
}