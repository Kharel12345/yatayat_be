const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  createUserValidation,
  getUserPaginationValidation,
  updateUserValidation,
  createUserPermissionValidation,
} = require("../middlewares/userValidation");
const { userControllers } = require("../controllers/auth");
// const { preauthorize } = require('../../utils/preAuthorizeModule')

//user routes

router.route("/getuserlist").get(auth, userControllers.getUserList);

router.route("/createuser").post(
  auth,
  // preauthorize('create_user'),
  createUserValidation,
  userControllers.createUser
);

router
  .route("/createuserpermission")
  .post(
    auth,
    createUserPermissionValidation,
    userControllers.createUserPermission
  );

router.route("/getmodulelist").get(auth, userControllers.getModuleList);

router.route("/getuserpagination").get(
  auth,
  //  preauthorize('view_user'),
  getUserPaginationValidation,
  userControllers.getUserPagination
);

router
  .route("/getpermissiondetail")
  .get(auth, userControllers.getPermissionDetail);

router
  .route("/getpermissiondetail/:user_id")
  .get(auth, userControllers.getPermissionDetailByUserId);

router.route("/updateuser").put(
  auth,
  //  preauthorize('update_user'),
  updateUserValidation,
  userControllers.updateUser
);

module.exports = router;
