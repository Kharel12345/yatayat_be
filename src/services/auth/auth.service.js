const User = require("../../../models/user.model");
const CustomErrorHandler = require("../../utils/CustomErrorHandler");
const bcrypt = require("bcryptjs");
const jwtServices = require("./jwt.service");
const {
  JWT_SECRET,
  JWT_EXPIRY,
  REFRESH_EXPIRY,
  REFRESH_SECRET,
  CAPTCHA,
  CAPTCHA_SECRET_KEY,
} = require("../../config/constant");
const axios = require("axios");
const RefreshToken = require("../../../models/refreshToken.model");
const { Op } = require("sequelize");

const findUser = async (username) => {
  return await User.findOne({ where: { username } });
};

const validatePassword = async (password, user) => {
  return await bcrypt.compare(password, user.password);
};

const createRefreshToken = async (userId, refresh_token) => {
  await RefreshToken.create({ user_id: userId, token: refresh_token });
  return refresh_token;
};

const verifyCaptchaResponse = async (captchaResponse) => {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_SECRET_KEY}&response=${captchaResponse}`;
  if (CAPTCHA == "true") {
    const response = await axios.post(url);
    return response.data.success;
  }
  return true;
};

const logout = async (refresh_token) => {
  const result = await RefreshToken.destroy({
    where: { token: refresh_token },
  });
  return result;
};

const refresh = async (refresh_token) => {
  const token = await RefreshToken.findOne({ where: { token: refresh_token } });
  if (token == null) return CustomErrorHandler.unAuthorized();

  //verify the refresh token
  const { user_id, username, email } = jwtServices.verify(
    refresh_token,
    REFRESH_SECRET
  );

  //check if user exists
  const user = await User.findOne({ where: { id: user_id } });
  if (user == null) return CustomErrorHandler.unAuthorized("No user found");

  //generate new tokens
  let payload = { user_id, username, email };
  let new_access_token = jwtServices.generateToken(
    payload,
    JWT_SECRET,
    JWT_EXPIRY
  );
  let new_refresh_token = jwtServices.generateToken(
    payload,
    REFRESH_SECRET,
    REFRESH_EXPIRY
  );

  await RefreshToken.update(
    { token: new_refresh_token },
    {
      where: {
        [Op.and]: [{ token: refresh_token }, { user_id: user_id }],
      },
    }
  );

  return { access_token: new_access_token, refresh_token: new_refresh_token };
};

const getUserDetails = async () => {
  return await User.findAll();
};

const getUserDetailsById = async (user_id) => {
  const user = await User.findOne({
    where: { user_id },
    attributes: { exclude: ['password'] }
  });

  return user;
};

module.exports = {
  logout,
  refresh,
  findUser,
  verifyCaptchaResponse,
  validatePassword,
  createRefreshToken,
  getUserDetails,
  getUserDetailsById
};
