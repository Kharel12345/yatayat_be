const { FunctionalYear } = require("../../../models/master")
const { checkFunctionalYearExists } = require("../../../models/master/economic_year.model")

const setupEconomicYear = async (economicYearDetail) => {
    try {
        //if exists 
        const exists = await FunctionalYear.checkFunctionalYearExists(
            economicYearDetail.functional_year_start_bs,
            economicYearDetail.functional_year_end_bs
        );
        if (exists) {
            const err = new Error("This economic year has already been set up and cannot be saved again.");
            err.statusCode = 409;
            throw err;
        }
        return await FunctionalYear.economicYearSetup(economicYearDetail);
    } catch (error) {
        console.error("Error setting economic year:", error.message);
        throw error;
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