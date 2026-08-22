// controllers/billingTitleInfo.controller.js
const { Op } = require("sequelize");
const logger = require("../../config/winstonLoggerConfig");
const { DATA_SAVED, SUCCESS_API_FETCH } = require("../../helpers/response");
const { BillingTitleService } = require("../../services/master");
const { BillingTitleInfo } = require("../../../models/master");
const nepaliOnly = /^[\u0900-\u097F\s]+$/;
const englishOnly = /^[A-Za-z\s]+$/;


const createBillingTitle = async (req, res, next) => {
  try {
    const { billing_title, billing_title_english, } = req.body;

    // Validate Nepali title
    if (!nepaliOnly.test(billing_title.trim())) {
      return res.status(400).json({
        status: false,
        message: "Billing title must contain Nepali characters only!!!",
      });
    }

    // Validate English title
    if (!englishOnly.test(billing_title_english.trim())) {
      return res.status(400).json({
        status: false,
        message: "English billing title must contain English letters only!!!",
      });
    }

    const existing = await BillingTitleService.checkBillingTitleExists({
      billing_title_code: req.body.billing_title_code,
    });

    if (existing) {
      return res.status(208).json({
        status: false,
        message: "Billing code already exists!!!",
      });
    }
    const newTitle = await BillingTitleService.createBillingTitle(
      req.body
    );
    res.status(201).json(DATA_SAVED(newTitle));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getBillingTitles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const data = await BillingTitleService.getBillingTitles(page, limit, status);

    res.json({
      total: data.count,
      page: parseInt(page),
      pages: Math.ceil(data.count / limit),
      data: data.rows,
    });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getBillingTitleById = async (req, res, next) => {
  try {
    const title = await BillingTitleService.getBillingTitleById(req.params.id);
    if (!title) return res.status(404).json({ error: "Not found" });
    res.json(SUCCESS_API_FETCH(title));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const updateBillingTitle = async (req, res, next) => {
  try {
    const {
      billing_title,
      billing_title_english,
    } = req.body;

    // Validate Nepali title if provided
    if (
      billing_title !== undefined &&
      !nepaliOnly.test(billing_title.trim())
    ) {
      return res.status(400).json({
        status: false,
        message: "Billing title must contain Nepali characters only!!!",
      });
    }

    // Validate English title if provided
    if (
      billing_title_english !== undefined &&
      !englishOnly.test(billing_title_english.trim())
    ) {
      return res.status(400).json({
        status: false,
        message: "English billing title must contain English letters only!!!",
      });
    }

    const existing = await BillingTitleInfo.findOne({
      where: {
        billing_title_code: req.body.billing_title_code,
        status: 1,
        billing_title_id: { [Op.ne]: req.params.id },
      },
    });

    if (existing) {
      return res.status(208).json({
        status: false,
        message: "Billing title code already exists!!!",
      });
    }

    await BillingTitleService.updateBillingTitle(
      req.params.id,
      req.body
    );

    res.status(201).json({
      status: true,
      message: "Billing title updated successfully!!!",
    });

  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const deleteBillingTitle = async (req, res, next) => {
  try {
    const [updated] = await BillingTitleService.softDeleteBillingTitle(
      req.params.id
    );
    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Status updated to 0 (soft delete)" });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};
const getAllBillingTitleList = async (req, res, next) => {
  try {
    const billingTitles = await BillingTitleService.getAllBillingTitleList();
    res.json({
      success: true,
      data: billingTitles,
    });
  } catch (error) {
    console.error("Error fetching billing titles:", error);
    next(error);
  }
};

const getAllLabelList = async (req, res, next) => {
  try {
    const labels = await BillingTitleService.getAllLabelList();
    res.json({
      success: true,
      data: labels,
    });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const checkBillingTileMapped = async (req, res, next) => {
  try {
    const result = await BillingTitleService.checkSpecificBillingTitles();

    res.json(result);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

module.exports = {
  createBillingTitle,
  updateBillingTitle,
  getBillingTitleById,
  getBillingTitles,
  deleteBillingTitle,
  getAllBillingTitleList,
  getAllLabelList,
  checkBillingTileMapped
};
