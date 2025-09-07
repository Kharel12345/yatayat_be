const cashInvoiceService = require("../../services/accounting/cashInvoice.service");
const { SUCCESS_API_FETCH, DATA_SAVED } = require("../../helpers/response");
const logger = require("../../config/winstonLoggerConfig");
const { createCashReceiptSchema } = require("../../middlewares/validation/accounting/cash_invoice.validation");
const { ValidationError } = require("../../utils/error");

const createCashInvoice = async (req, res, next) => {
    try {
        const { error, value } = createCashReceiptSchema.validate(req.body);
        if (error) {
            throw new ValidationError(error.details[0].message);
        }
        const payload = {
            ...value,
            created_by: req.user.user_id,
        };

        const result = await cashInvoiceService.createCashInvoice(payload);

        res.status(201).json(
            {
                success: true,
                message: "Cash invoice created successfully",
                data: result
            }
        );
    } catch (error) {
        logger.error(
            `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
        );
        return next(error);
    }
};

const { listCashReceiptSchema } = require("../../middlewares/validation/accounting/cash_invoice.validation");

const getAllCashInvoices = async (req, res, next) => {
    try {
        const { error, value } = listCashReceiptSchema.validate(req.query);
        if (error) {
            throw new ValidationError(error.details[0].message);
        }

        const result = await cashInvoiceService.getAllCashInvoices(value);

        res.json(
            SUCCESS_API_FETCH(result, "Cash invoices fetched successfully")
        );
    } catch (error) {
        logger.error(
            `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
        );
        return next(error);
    }
};

const getCashInvoiceById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "Valid cash invoice ID is required",
            });
        }

        const result = await cashInvoiceService.getCashInvoiceById(parseInt(id));

        res.json(
            SUCCESS_API_FETCH(result, "Cash invoice fetched successfully")
        );
    } catch (error) {
        logger.error(
            `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
        );
        return next(error);
    }
};

const updateCashInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "Valid cash invoice ID is required",
            });
        }

        const result = await cashInvoiceService.updateCashInvoice(
            parseInt(id),
            updateData
        );

        res.json(
            SUCCESS_API_FETCH(result, "Cash invoice updated successfully")
        );
    } catch (error) {
        logger.error(
            `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
        );
        return next(error);
    }
};

const deleteCashInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "Valid cash invoice ID is required",
            });
        }

        const result = await cashInvoiceService.deleteCashInvoice(parseInt(id));

        res.json(
            SUCCESS_API_FETCH(result, "Cash invoice deleted successfully")
        );
    } catch (error) {
        logger.error(
            `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
        );
        return next(error);
    }
};

const getCashInvoicesByVehicle = async (req, res, next) => {
    try {
        const { vehicleId } = req.params;
        const filters = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
        };

        if (!vehicleId || isNaN(parseInt(vehicleId))) {
            return res.status(400).json({
                success: false,
                message: "Valid vehicle ID is required",
            });
        }

        const result = await cashInvoiceService.getCashInvoicesByVehicle(
            parseInt(vehicleId),
            filters
        );

        res.json(
            SUCCESS_API_FETCH(result, "Vehicle cash invoices fetched successfully")
        );
    } catch (error) {
        logger.error(
            `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
        );
        return next(error);
    }
};

module.exports = {
    createCashInvoice,
    getAllCashInvoices,
    getCashInvoiceById,
    updateCashInvoice,
    deleteCashInvoice,
    getCashInvoicesByVehicle,
};