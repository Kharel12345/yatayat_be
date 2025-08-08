const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
// const { preauthorize } = require('../../utils/preAuthorizeModule')
const { branchControllers } = require('../controllers/auth')
const { setupEconomicYearValidation } = require('../middlewares/validation/master')

router.post('/branchsetup', auth, setupEconomicYearValidation.branchSetupValidation, branchControllers.branchSetup)

router.get('/getbranchlist', auth, branchControllers.getBranchList)


module.exports = router