const logger = require("../../config/winstonLoggerConfig")
const { DATA_SAVED, SUCCESS_API_FETCH, DATA_NOT_FOUND } = require("../../helpers/response")
const { branchServices } = require("../../services/auth")

const branchSetup = async (req, res, next) => {
    try {
        const { status, name, } = req.body;

        const isBranchNameAvailable = await branchServices.checkBranchNameAvailable(
            name);
        if (!isBranchNameAvailable) {
            return res.status(208).json({
                status: false,
                message: "Branch name already exists"
            });
        }

        const branchSetupDetails = {
            name,
            status,
            created_by: req.user.user_id
        }

        await branchServices.branchSetup(branchSetupDetails)
        res.status(201).json(DATA_SAVED('Branch created successfully!!!'))
    } catch (error) {
        logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`)
        return next(error)
    }
}

const updateBranch = async (req, res, next) => {
    try {
        const { status, name } = req.body;

        const isBranchNameAvailable = await branchServices.checkBranchNameAvailable(
            name, req?.params.id);
        if (!isBranchNameAvailable) {
            return res.status(208).json({
                status: false,
                message: "Branch name already exists"
            });
        }
        const branchSetupDetails = {
            name,
            status,
            updated_by: req.user.user_id
        };

        await branchServices.updateBranch(branchSetupDetails, req.params.id);
        res.status(201).json(DATA_SAVED('Branch updated successfully!!!'));
    } catch (error) {
        logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
        return next(error);
    }
}

const getBranchList = async (req, res, next) => {
    try {
        const { status } = req.query;
        const branches = await branchServices.getBranchList(status)
        res.status(200).json(SUCCESS_API_FETCH(branches))
    } catch (error) {
        logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`)
        return next(error)
    }
}

module.exports = {
    branchSetup,
    getBranchList,
    updateBranch
}