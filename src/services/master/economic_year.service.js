const { FunctionalYear } = require("../../../models/master")

const setupEconomicYear = async (economicYearDetail) => {
    try {
        let result = await FunctionalYear.economicYearSetup(economicYearDetail)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const setInactiveEconomicYear = async () => {
    try {
        let result = await FunctionalYear.setInactiveEconomicYear()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getEconomicYearList = async () => {
    try {
        let result = await FunctionalYear.getEconomicYearList()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getActiveEconomicYearInfo = async () => {
    try {
        let result = await FunctionalYear.getActiveEconomicYearInfo()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getEconomicYearInfo = async (functional_year_id) => {
    try {
        let result = await FunctionalYear.getEconomicYearInfo(functional_year_id);
        return result
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    setupEconomicYear,
    getEconomicYearList,
    setInactiveEconomicYear,
    getActiveEconomicYearInfo,
    getEconomicYearInfo
}