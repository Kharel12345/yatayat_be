const asyncHandler = require('../../middlewares/asyncHandler')
const { authServices } = require('../../services/auth')
const { LOGOUT } = require('../../helpers/response')

const login = asyncHandler(async (req, res, next) => {
    const { username, password, captchaResponse } = req.body
    const result = await authServices.login(username, password, captchaResponse)
    return res.status(200).json(result)
})

const logout = asyncHandler(async (req, res, next) => {
    const { refresh_token } = req.body
    await authServices.logout(refresh_token)
    return res.status(200).json(LOGOUT())
})

const refresh = asyncHandler(async (req, res, next) => {
    const { refresh_token } = req.body
    const result = await authServices.refresh(refresh_token)
    return res.status(200).json(result)
})

module.exports = {
    login,
    logout,
    refresh
}