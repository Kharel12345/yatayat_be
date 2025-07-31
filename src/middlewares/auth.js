const { JWT_SECRET, REFRESH_SECRET, JWT_EXPIRY, REFRESH_EXPIRY, COOKIE_EXPIRY } = require("../config/constant");
const { jwtServices, authServices } = require("../services/auth");
const CustomErrorHandler = require("../utils/CustomErrorHandler");

const auth = async (req, res, next) => {

    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    //check access token exists or not
    if (!accessToken) {
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
        return next(CustomErrorHandler.unAuthorized());
    }

    try {

        const { user_id, username, name, } = jwtServices.verify(accessToken, JWT_SECRET);
        req.user = { user_id, username, name };
        next();

    } catch (error) {
        try {

            const { user_id, username, name } = jwtServices.verify(refreshToken, REFRESH_SECRET);

            //generate new access token and refresh token and update old refresh token with new one 
            if (user_id) {
                const { access_token, refresh_token } = await authServices.refresh(refreshToken);
                res.cookie('refresh_token', access_token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: COOKIE_EXPIRY,
                });

                res.cookie('access_token', refresh_token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: COOKIE_EXPIRY,
                });

                req.user = { user_id, username, name };
                next();
            }
        } catch (error) {
            return next(CustomErrorHandler.unAuthorized());
        }

    }
};

module.exports = auth;