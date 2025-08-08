const logger = require("../../config/winstonLoggerConfig");
const {
  SUCCESS_API_FETCH,
  DATA_SAVED,
  DATA_UPDATED,
} = require("../../helpers/response");

const CustomErrorHandler = require("../../utils/CustomErrorHandler");
const {
  isUniqueforSave,
  isUniqueforUpdate,
} = require("../../utils/checkUniqueness");
const bcrypt = require("bcryptjs");
const { modules } = require("../../utils/moduleDetails");
const { getCurrentDateTime } = require("../../helpers/date");
const { getCurrentValue } = require("../../utils/dbUtils");
const { deepEqual } = require("../../helpers/objects");
const { userServices } = require("../../services/auth");

const getUserList = async (req, res, next) => {
  try {
    const users = await userServices.getUserList();
    return res.status(200).json(SUCCESS_API_FETCH(users));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, address, contact, username, password, status, branch } =
      req.body;

    //check if the username already exists
    const usernameCount = await isUniqueforSave(
      "user",
      "username",
      JSON.stringify(username)
    );
    if (usernameCount > 0) {
      return next(CustomErrorHandler.alreadyExists("Username already exists"));
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userDetails = {
      name,
      address,
      contact,
      username,
      password: hashedPassword,
      status,
      created_by: req.user.user_id,
      branch,
    };

    await userServices.createUser(userDetails);

    return res.status(201).json(DATA_SAVED("User created successfully!!!"));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getModuleList = async (req, res, next) => {
  try {
    return res.status(200).json(SUCCESS_API_FETCH(modules));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getUserPagination = async (req, res, next) => {
  try {
    const name = req.query.name || "";
    const status = parseInt(req.query.status);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const viewAll =
      req.permission["user"] && req.permission["user"].includes("viewall_user");

    let { data, total } = await userServices.getUserPagination(
      limit,
      offset,
      status,
      name,
      viewAll,
      req.user.user_id
    );

    return res.status(200).json({
      status: true,
      message: "Data found successfully!!!",
      data: data,
      total: total[0].total,
    });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getPermissionDetail = async (req, res, next) => {
  try {
    if (req.user.user_type === "admin") {
      return res.status(200).json(SUCCESS_API_FETCH(modules));
    }
    const permission = await userServices.getPermissionDetail(req.user.user_id);
    if (permission.length == 0) {
      return res.status(200).json(SUCCESS_API_FETCH({}));
    }

    return res.status(200).json(SUCCESS_API_FETCH(permission[0].permission));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const {
      user_id,
      name,
      address,
      contact,
      username,
      password,
      status,
      branch_id,
      branch,
    } = req.body;

    //check username
    let usernameCount = await isUniqueforUpdate(
      "user",
      "username",
      JSON.stringify(username),
      "user_id",
      user_id
    );

    if (usernameCount > 0) {
      return next(CustomErrorHandler.alreadyExists("Username already exists"));
    }

    let hashedPassword = null;

    if (password !== null) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user_type = await userServices.getUserType(user_id);

    const user_old_value = await getCurrentValue("user", "user_id", user_id);

    const userObj = {
      user_id,
      name,
      address,
      contact,
      username,
      password: hashedPassword,
      status,
      branch_id,
      branch,
      created_by: req.user.user_id,
    };

    const userLogDetails = {
      module_name: "user",
      table_name: "user",
      row_id: user_id,
      new_value: userObj,
      old_value: user_old_value,
      operation: status == 0 ? "delete" : "update",
      remarks: "",
      user_id: req.user.user_id,
      transaction_date: getCurrentDateTime(),
    };

    await userServices.updateUser(userObj, userLogDetails, user_type);

    return res.status(201).json(DATA_UPDATED("User updated successfully!!!"));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const createUserPermission = async (req, res, next) => {
  try {
    const { user_id, permission } = req.body;

    const obj = {
      user_id,
      permission,
      created_by: req.user.user_id,
    };

    let permissionDetail = await userServices.getPermissionDetail(user_id);
    if (permissionDetail.length == 0) {
      //save permission
      await userServices.createUserPermission(obj);
      return res
        .status(201)
        .json(DATA_SAVED("User permission created successfully!!!"));
    }

    //update permission
    await userServices.updateUserPermission(obj);
    return res
      .status(201)
      .json(DATA_UPDATED("User Permission updated successfully!!!"));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getPermissionDetailByUserId = async (req, res, next) => {
  try {
    let user_type = await userServices.getUserType(req.params.user_id);
    if (user_type === "admin") {
      return res.status(200).json(SUCCESS_API_FETCH(modules));
    }
    const permission = await userServices.getPermissionDetail(
      req.params.user_id
    );
    if (permission.length == 0) {
      return res.status(200).json(SUCCESS_API_FETCH({}));
    }

    return res.status(200).json(SUCCESS_API_FETCH(permission[0].permission));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

module.exports = {
  getUserList,
  createUser,
  getModuleList,
  getUserPagination,
  getPermissionDetail,
  updateUser,
  createUserPermission,
  getPermissionDetailByUserId,
};
