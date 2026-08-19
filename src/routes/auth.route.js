const express = require('express')
const router = express.Router()
const { authControllers } = require('../controllers/auth')
const { validateLogin, validateToken, validatePasswordChange } = require('../middlewares/validation/auth/auth.validation');
const auth = require('../middlewares/auth')

router.route('/login').post(validateLogin, authControllers.login);
router.route('/logout').post(auth, authControllers.logout)
router.route('/getuserdetails').get(auth, authControllers.getUserDetails)
router.route('/me').get(auth, authControllers.getUserDetailsById);
router.route('/userpermission/:id').get(authControllers.getUserPermission);
router.route('/users').get(auth, authControllers.getUserList);
router.route('/updateuserpermission/:id').post(auth, authControllers.updateUserPermission);
router.route('/changepassword').post(auth, validatePasswordChange, authControllers.changePassword);


module.exports = router