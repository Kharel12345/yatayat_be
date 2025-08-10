require('dotenv').config()

const {
    PORT,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRY,
    REFRESH_SECRET,
    REFRESH_EXPIRY,
    CAPTCHA_SECRET_KEY,
    CAPTCHA,
    COOKIE_EXPIRY,
} = process.env

module.exports = {
    PORT,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRY,
    REFRESH_SECRET,
    REFRESH_EXPIRY,
    CAPTCHA_SECRET_KEY,
    CAPTCHA,
    COOKIE_EXPIRY
}