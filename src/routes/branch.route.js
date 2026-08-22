const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth');
const { branchControllers } = require('../controllers/auth')
const { setupEconomicYearValidation } = require('../middlewares/validation/master')

router.post('/branch', auth, setupEconomicYearValidation.branchSetupValidation, branchControllers.branchSetup);

router.put('/branch/:id', auth, setupEconomicYearValidation.branchSetupValidation, branchControllers.updateBranch)

router.get('/branch', auth, branchControllers.getBranchList)


module.exports = router