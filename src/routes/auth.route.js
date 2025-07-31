const express = require('express')
const router = express.Router()
const { authControllers } = require('../controllers/auth')
const { validateLogin, validateToken } = require('../middlewares/validation/auth/auth.validation')
const auth = require('../middlewares/auth')

router.route('/login').post(validateLogin, authControllers.login);
router.route('/logout').post(auth, authControllers.logout)
router.route('/getuserdetails').get(auth, authControllers.getUserDetails)
router.route('/me').get(auth, authControllers.getUserDetailsById)

module.exports = router