class CustomErrorHandler extends Error {
    constructor(status, msg) {
        super()
        this.status = status;
        this.message = msg
    }

    static alreadyExists(message) {
        return new CustomErrorHandler(409, message)
    }

    static wrongCredentials(message = 'Invalid credentials') {
        return new CustomErrorHandler(401, message)
    }

    static unAuthorized(message = 'Unauthorized') {
        return new CustomErrorHandler(401, message)
    }

    static inValidCaptchaResponse(message = 'Invalid captcha response') {
        return new CustomErrorHandler(400, message)
    }

    static mappingNotDone(message = 'Something went wrong') {
        return new CustomErrorHandler(409, message)
    }

    static validationError(message = 'Validation error') {
        return new CustomErrorHandler(400, message)
    }

    static forbidden(message = 'You do not have permission to access this resource') {
        return new CustomErrorHandler(403, message)
    }

    static notFound(message = 'Not found') {
        return new CustomErrorHandler(404, message)
    }

}

module.exports = CustomErrorHandler