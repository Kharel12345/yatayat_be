const CustomErrorHandler = require('../utils/CustomErrorHandler')
const { jwtServices } = require('../services/auth')
const { JWT_SECRET } = require('../config/constant')
const logger = require('../config/winstonLoggerConfig')

const auth = (req, res, next) => {
    let authHeader = req.headers.authorization
    if (!authHeader) return next(CustomErrorHandler.unAthorized())

    const token = authHeader.split(' ')[1]

    try {
        const { user_id, username, email } = jwtServices.verify(token, JWT_SECRET)
        req.user = { user_id, username, email }
        next()
    }
    catch (error) {
        logger.error(`{Api:${req.url}, Error:${error.message}, stack:${error.stack} }`)
        return next(CustomErrorHandler.unAthorized())
    }
}

module.exports = auth