const { getFormattedDate } = require("../../helpers/date")
const Nepali_Calendar = require("../../helpers/nepaliCalendar")
const { LedgerGroup, LedgerSubGroup, AccountingLedgerInfo, AccountingLedgerMapping } = require("../../../models/accounting/ledger.model")

const getledgerGrouplist = async () => {
    try {
        const result = await LedgerGroup.findAll({
            attributes: [
                ['id', 'ledger_group_id'],
                'ledger_group_name',
                'formula'
            ],
            where: { status: 1 }
        })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getledgerSubGrouplist = async () => {
    try {
        const result = await LedgerSubGroup.findAll({
            attributes: [
                ['id', 'ledger_sub_group_id'],
                'sub_group_name'
            ],
            where: { status: 1 }
        })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const saveLedger = async (jsonObject) => {
    try {
        const result = AccountingLedgerInfo.saveLedger(jsonObject)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getLedgerPagination = async (limit, offset, status, ledgerName, viewAll, user_id) => {
    try {
        let { data, total } = await AccountingLedgerInfo.getLedgerPagination(limit, offset, status, ledgerName, viewAll, user_id)
        let cal = new Nepali_Calendar()

        data = data.map((d) => {
            d = {
                ...d,
                opening_balance_date_bs: cal.ADToBsConvert(getFormattedDate(d.opening_balance_date)),
                transaction_type: d.credit == 0 ? 'Debit' : 'Credit'
            }
            return d
        })

        return { data, total }
    } catch (error) {
        throw new Error(error)
    }
}

const updateLedger = async (jsonObject, logDetails) => {
    try {
        const result = await AccountingLedgerInfo.updateLedger(jsonObject, logDetails)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const saveLedgerMapping = async (body) => {
    try {
        const result = await AccountingLedgerMapping.saveLedgerMapping(body)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getLedgerMappingPagination = async (limit, offset) => {
    try {
        let { data, total } = await AccountingLedgerMapping.getLedgerMappingPagination(limit, offset)
        data = data.map((d) => {
            d = {
                ...d,
                ledger_id: d.ledger_id == 0 ? '' : d.ledger_id
            }
            return d
        })
        return { data, total }
    } catch (error) {
        throw new Error(error)
    }
}

const getledgerGroup = async (name) => {
    try {
        const result = await LedgerGroup.findOne({
            attributes: ['id'],
            where: { ledger_group_name: name, status: 1 }
        })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getActiveLedger = async () => {
    try {
        let result = await AccountingLedgerInfo.getActiveLedger()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getAssociatedLedgerId = async (groupname) => {
    try {
        let result=await AccountingLedgerInfo.getLedgerInfo(groupname)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getMappedLedgerIdByLabel = async (ledgerName) => {
    try {
        let result = await AccountingLedgerMapping.getMappedLedgerIdByLabel(ledgerName)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    getledgerGrouplist,
    getledgerSubGrouplist,
    saveLedger,
    getLedgerPagination,
    updateLedger,
    saveLedgerMapping,
    getLedgerMappingPagination,
    getledgerGroup,
    getActiveLedger,
    getAssociatedLedgerId,
    getMappedLedgerIdByLabel
}