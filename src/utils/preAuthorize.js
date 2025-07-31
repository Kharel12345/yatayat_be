const { UserPermissionInfo } = require("../models");
const CustomErrorHandler = require("./CustomErrorHandler");
const { modules } = require('../utils/modulesDetails')


function preauthorize(value) {
    return async function (req, res, next) {
        const { user } = req;

        const modulesDetails = await UserPermissionInfo.getUserModuleDetails(user.user_id)

        if (user.user_type === "admin") {
            req.permission = modules
            return next()
        }

        if (modulesDetails.length > 0) {

            let modules = modulesDetails[0].permission
            req.permission = modules

            for (const key in modules) {
                if (modules.hasOwnProperty(key)) {
                    if (modules[key].includes(value)) {
                        return next()
                    }
                }
            }
        }
        return next(CustomErrorHandler.forbidden())
    };
}

module.exports = {
    preauthorize
}