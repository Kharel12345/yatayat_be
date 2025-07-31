const express = require('express')
const router = express.Router()
const { authControllers } = require('../controllers/auth')
const { validateLogin, validateToken } = require('../middlewares/validation/auth/auth.validation')
const auth = require('../middlewares/auth')

router.route('/login').post(validateLogin, authControllers.login);
router.route('/logout').post(auth, authControllers.logout)

module.exports = router