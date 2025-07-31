const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth/auth')
const { ledgerControllers } = require('../../controllers')
const {
    saveLedgerValidation,
    getLedgerPaginationValidation,
    updateLedgerValidation,
    saveLedgerMappingValidation,
    getLedgerMappingPaginationValidation
} = require('../../middlewares/Accounting/ledgerValidation')
const { preauthorize } = require('../../utils/preAuthorizeModule')

router
    .route('/getledgergrouplist')
    .get(
        auth,
        ledgerControllers.getledgerGrouplist
    )

router
    .route('/getledgersubgrouplist')
    .get(
        auth,
        ledgerControllers.getledgerSubGrouplist
    )

router
    .route('/saveledger')
    .post(
        auth,
        preauthorize('create_ledger'),
        saveLedgerValidation,
        ledgerControllers.saveLedger
    )

router
    .route('/getledgerpagination')
    .get(
        auth,
        preauthorize('view_ledger'),
        getLedgerPaginationValidation,
        ledgerControllers.getLedgerPagination
    )

router
    .route('/updateledger')
    .put(
        auth,
        preauthorize('update_ledger'),
        updateLedgerValidation,
        ledgerControllers.updateLedger
    )

router
    .route('/saveledgermapping')
    .put(
        auth,
        preauthorize('update_ledger_mapping'),
        saveLedgerMappingValidation,
        ledgerControllers.saveLedgerMapping
    )

router
    .route('/getledgermappingpagination')
    .get(
        auth,
        preauthorize('view_ledger_mapping'),
        getLedgerMappingPaginationValidation,
        ledgerControllers.getLedgerMappingPagination
    )
router
    .route('/getactiveledger')
    .get(
        auth,
        ledgerControllers.getActiveLedger
    )

module.exports = router