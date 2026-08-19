const cashReceiptService = require("../../services/accounting/cashReceipt.service");
const { SUCCESS_API_FETCH } = require("../../helpers/response");
const logger = require("../../config/winstonLoggerConfig");
const {
  createCashReceiptSchema,
  listCashReceiptSchema,
  updateCashReceiptSchema,
} = require("../../middlewares/validation/accounting/cash_receipt.validation");
const { ValidationError } = require("../../utils/error");

const createCashReceipt = async (req, res, next) => {
  try {
    const { error, value } = createCashReceiptSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    const payload = {
      ...value,
      created_by: req.user.user_id,
    };

    const result = await cashReceiptService.createCashReceipt(payload);

    res.status(201).json({
      success: true,
      message: "Cash Receipt created successfully",
      data: result,
    });
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

const getAllCashReceipts = async (req, res, next) => {
  try {
    const { error, value } = listCashReceiptSchema.validate(req.query);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const result = await cashReceiptService.getAllCashReceipts(value);

    res.json(SUCCESS_API_FETCH(result, "Cash Receipts fetched successfully"));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

const getCashReceiptById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid cash receipt ID is required",
      });
    }

    const result = await cashReceiptService.getCashReceiptById(parseInt(id));

    res.json(SUCCESS_API_FETCH(result, "Cash Receipt fetched successfully"));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

const updateCashReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid cash receipt ID is required",
      });
    }

    const { error, value } = updateCashReceiptSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const result = await cashReceiptService.updateCashReceipt(parseInt(id), value);

    res.json(SUCCESS_API_FETCH(result, "Cash Receipt updated successfully"));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

const deleteCashReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid cash receipt ID is required",
      });
    }

    const result = await cashReceiptService.deleteCashReceipt(parseInt(id));

    res.json(SUCCESS_API_FETCH(result, "Cash Receipt deleted successfully"));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

module.exports = {
  createCashReceipt,
  getAllCashReceipts,
  getCashReceiptById,
  updateCashReceipt,
  deleteCashReceipt,
};
