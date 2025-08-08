const logger = require("../../config/winstonLoggerConfig")
const { DATA_SAVED, SUCCESS_API_FETCH, DATA_NOT_FOUND } = require("../../helpers/response")
const { branchServices } = require("../../services/auth")

const CustomErrorHandler = require("../../utils/CustomErrorHandler")

const branchSetup = async (req, res, next) => {
    try {
        const { branch_code, name, address, contact } = req.body

        const branchSetupDetails = {
            branch_code,
            name,
            address,
            contact,
            created_by: req.user.user_id
        }
        //check if the branch code already exists
        const branchInfo = await branchServices.findBranchCode(branch_code)
        if (branchInfo.count > 0) {
            return next(CustomErrorHandler.alreadyExists('Branch code already exists'))
        }

        await branchServices.branchSetup(branchSetupDetails)
        res.status(201).json(DATA_SAVED('Branch created successfully!!!'))
    } catch (error) {
        logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`)
        return next(error)
    }
}

const getBranchList = async (req, res, next) => {
    try {
        const branches = await branchServices.getBranchList()
        res.status(200).json(SUCCESS_API_FETCH(branches))
    } catch (error) {
        logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`)
        return next(error)
    }
}

module.exports = {
    branchSetup,
    getBranchList
}