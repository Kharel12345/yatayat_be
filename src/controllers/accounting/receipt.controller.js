const receiptService = require("../../services/accounting/receipt.service");
const { SUCCESS_API_FETCH } = require("../../helpers/response");
const logger = require("../../config/winstonLoggerConfig");
const {
  createReceiptSchema,
  listReceiptSchema,
  updateReceiptSchema,
} = require("../../middlewares/validation/accounting/receipt.validation");
const { ValidationError } = require("../../utils/error");

const createReceipt = async (req, res, next) => {
  try {
    const { error, value } = createReceiptSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    const payload = {
      ...value,
      created_by: req.user.user_id,
    };

    const result = await receiptService.createReceipt(payload);

    res.status(201).json({
      success: true,
      message: "Receipt created successfully",
      data: result,
    });
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

const getAllReceipts = async (req, res, next) => {
  try {
    const { error, value } = listReceiptSchema.validate(req.query);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const result = await receiptService.getAllReceipts(value);

    res.json(SUCCESS_API_FETCH(result, "Receipts fetched successfully"));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

const getReceiptById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid receipt ID is required",
      });
    }

    const result = await receiptService.getReceiptById(parseInt(id));

    res.json(SUCCESS_API_FETCH(result, "Receipt fetched successfully"));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

const updateReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid receipt ID is required",
      });
    }

    const { error, value } = updateReceiptSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const result = await receiptService.updateReceipt(parseInt(id), value);

    res.json(SUCCESS_API_FETCH(result, "Receipt updated successfully"));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

const deleteReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid receipt ID is required",
      });
    }

    const result = await receiptService.deleteReceipt(parseInt(id));

    res.json(SUCCESS_API_FETCH(result, "Receipt deleted successfully"));
  } catch (error) {
    logger.error(`{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
    return next(error);
  }
};

module.exports = {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
};
