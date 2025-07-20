const User = require('../../../models/user.model')
const CustomErrorHandler = require('../../utils/CustomErrorHandler')
const bcrypt = require('bcryptjs')
const jwtServices = require('./jwt.service')
const { JWT_SECRET, JWT_EXPIRY, REFRESH_EXPIRY, REFRESH_SECRET, CAPTCHA, CAPTCHA_SECRET_KEY } = require('../../config/constant')
const axios = require('axios')
const RefreshToken = require('../../../models/refreshToken.model')
const { Op } = require('sequelize');

const login = async (username, password, captchaResponse) => {

    //verify captcha response
    const captchaVerification = await verifyCaptchaResponse(captchaResponse)
    if (!captchaVerification) {
        return CustomErrorHandler.inValidCaptchaResponse()
    }

    //validate username and password
    const user = await User.findOne({ where: { username } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return CustomErrorHandler.wrongCredentials()
    }

    //generate access token and refresh token 
    const payload = { user_id: user.id, username, email: user.email }
    const access_token = jwtServices.generateToken(payload, JWT_SECRET, JWT_EXPIRY)
    const refresh_token = jwtServices.generateToken(payload, REFRESH_SECRET, REFRESH_EXPIRY)

    //save refresh token in the database
    await RefreshToken.create({ user_id: user.id, token: refresh_token })

    return { access_token, refresh_token }
}

const verifyCaptchaResponse = async (captchaResponse) => {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_SECRET_KEY}&response=${captchaResponse}`
    if (CAPTCHA == "true") {
        const response = await axios.post(url);
        return response.data.success
    }
    return true
}

const logout = async (refresh_token) => {
    const result = await RefreshToken.destroy({ where: { token: refresh_token } })
    return result
}

const refresh = async (refresh_token) => {
    const token = await RefreshToken.findOne({ where: { token: refresh_token } })
    if (token == null) return CustomErrorHandler.unAthorized()

    //verify the refresh token 
    const { user_id, username, email } = jwtServices.verify(refresh_token, REFRESH_SECRET)

    //check if user exists 
    const user = await User.findOne({ where: { id: user_id } })
    if (user == null) return CustomErrorHandler.unAthorized('No user found')

    //generate new tokens
    let payload = { user_id, username, email }
    let new_access_token = jwtServices.generateToken(payload, JWT_SECRET, JWT_EXPIRY)
    let new_refresh_token = jwtServices.generateToken(payload, REFRESH_SECRET, REFRESH_EXPIRY)

    await RefreshToken.update(
        { token: new_refresh_token },
        {
            where: {
                [Op.and]: [
                    { token: refresh_token },
                    { user_id: user_id }
                ]

            }
        }
    )

    return { access_token: new_access_token, refresh_token: new_refresh_token }
}

module.exports = {
    login,
    logout,
    refresh
}