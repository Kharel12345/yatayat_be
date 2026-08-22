const Joi = require('joi')

const createUserSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required().allow(null, ''),
    contact: Joi.number().required().allow(null, ''),
    username: Joi.string().required(),
    password: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            "string.min": "Password must be at least 8 characters long",
            "any.required": "Password is required"
        }),
    status: Joi.number().required().valid(0, 1),
    branch: Joi.array().min(1).items(
        Joi.number().required()
    ).required().allow(""),
})

const updateUserValidationSchema = Joi.object({
    // user_id: Joi.number().required(),
    name: Joi.string().required(),
    address: Joi.string().allow(null, ''),
    contact: Joi.number().allow(null, ''),
    username: Joi.string().required(),
    password: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            "string.min": "Password must be at least 8 characters long",
            "any.required": "Password is required"
        }).allow(null),
    status: Joi.number().required().valid(0, 1),
    branch: Joi.array().min(1).items(
        Joi.number().required()
    ).required().allow(''),
})

const getUserPaginationSchema = Joi.object({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    status: Joi.number().required(),
    name: Joi.string().optional().allow('', null),
})

const createUserPermissionValidationSchema = Joi.object({
    user_id: Joi.number().required(),
    permission: Joi.object().required()
})

const createUserPermissionValidation = (req, res, next) => {
    const { error } = createUserPermissionValidationSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    next()
}

const updateUserValidation = (req, res, next) => {
    const { error } = updateUserValidationSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    next()
}

const getUserPaginationValidation = (req, res, next) => {
    const { error } = getUserPaginationSchema.validate(req.query)
    if (error) {
        return next(error)
    }
    next()
}

const createUserValidation = (req, res, next) => {
    const { error } = createUserSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    next()
}

module.exports = {
    createUserValidation,
    getUserPaginationValidation,
    updateUserValidation,
    createUserPermissionValidation
}