const asyncHandler = require('../../middlewares/asyncHandler')
const { authServices, jwtServices } = require('../../services/auth');
const { JWT_SECRET, JWT_EXPIRY, REFRESH_SECRET, REFRESH_EXPIRY, COOKIE_EXPIRY } = require('../../config/constant');
const CustomErrorHandler = require('../../utils/CustomErrorHandler');
const logger = require('../../config/winstonLoggerConfig');

const login = asyncHandler(async (req, res, next) => {
    const { username, password, captchaResponse } = req.body

    const captchaVerification = await authServices.verifyCaptchaResponse(captchaResponse);
    if (!captchaVerification) {
        return CustomErrorHandler.inValidCaptchaResponse();
    }

    const user = await authServices.findUser(username);
    const validatePassword = await authServices.validatePassword(password, user);

    if (!user || !validatePassword) {
        return res.status(400).json({
            message: "Invalid username or password"
        });
    }

    //generate access token and refresh token 
    const payload = { user_id: user.id, username, email: user.email };

    const access_token = jwtServices.generateToken(payload, JWT_SECRET, JWT_EXPIRY);
    const refresh_token = jwtServices.generateToken(payload, REFRESH_SECRET, REFRESH_EXPIRY);

    //save refresh token in the database
    await authServices.createRefreshToken(user.id, refresh_token);

    res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: false,
        maxAge: COOKIE_EXPIRY,
    });

    res.cookie('access_token', access_token, {
        httpOnly: false,
        secure: false,
        maxAge: COOKIE_EXPIRY,
    });

    res.status(200).json({
        status: true,
        message: 'Logged in successfully!!!'
    });
})

const logout = asyncHandler(async (req, res, next) => {

    const refreshToken = req.cookies.refresh_token;
    await authServices.logout(refreshToken);

    //clear cookies from browser
    res.cookie('refresh_token', '', {
        httpOnly: true,
        secure: false,
        expires: new Date(0),
    });

    res.cookie('access_token', '', {
        httpOnly: false,
        secure: false,
        expires: new Date(0),
    });

    logger.info(`Username: ${req.user.username} logged out successfully`);

    return res.status(200).json({
        status: true,
        message: 'Logged out successfully!!!'
    });
})

const refresh = asyncHandler(async (req, res, next) => {
    const { refresh_token } = req.body
    const result = await authServices.refresh(refresh_token)
    return res.status(200).json(result)
})

const getUserDetails = asyncHandler(async (req, res, next) => {
    const result = await authServices.getUserDetails()
    return res.status(200).json(result)
})

const getUserDetailsById = asyncHandler(async (req, res, next) => {
    const user_id = req.user.user_id;

    const result = await authServices.getUserDetailsById(user_id)
    return res.status(200).json(result)
})

module.exports = {
    login,
    logout,
    refresh,
    getUserDetails,
    getUserDetailsById
}