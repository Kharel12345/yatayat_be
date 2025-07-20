const { ValidationError } = require('joi')
const CustomErrorHandler = require('./CustomErrorHandler')
const { NODE_ENV } = require('../config/constant')

const errorHandler = (err, req, res, next) => {

    //default error
    let statusCode = 500
    let data = {
        message: "Internal Server Error",
        ...(NODE_ENV == "development" && { originalMessage: err.message })
    }

    //handling validation error 
    if (err instanceof ValidationError) {
        statusCode = 400
        data = {
            message: err.message
        }
    }

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status
        data = {
            message: err.message
        }
    }

    res.status(statusCode).json(data)

}

module.exports = errorHandler