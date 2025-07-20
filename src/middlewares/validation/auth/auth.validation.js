const Joi = require("joi")
const { CAPTCHA } = require('../../../config/constant')

const validateLogin = async (req, res, next) => {
    const Schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        ...(CAPTCHA == "true" && { captchaResponse: Joi.string().required() })
    })

    const { error } = Schema.validate(req.body)
    if (error) {
        return next(error)
    }
    next(error)
}

const validateToken = async (req, res, next) => {
    const Schema = Joi.object({
        refresh_token: Joi.string().required()
    })

    const { error } = Schema.validate(req.body)
    if (error) {
        return next(error)
    }
    next(error)
}

module.exports = {
    validateLogin,
    validateToken
}