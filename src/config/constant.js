require('dotenv').config()

const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    JWT_SECRET,
    JWT_EXPIRY,
    REFRESH_SECRET,
    REFRESH_EXPIRY,
    CAPTCHA_SECRET_KEY,
    CAPTCHA,
} = process.env

module.exports = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    JWT_SECRET,
    JWT_EXPIRY,
    REFRESH_SECRET,
    REFRESH_EXPIRY,
    CAPTCHA_SECRET_KEY,
    CAPTCHA
}