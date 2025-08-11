// controllers/billingTitleInfo.controller.js
const logger = require("../../config/winstonLoggerConfig");
const { DATA_SAVED, SUCCESS_API_FETCH } = require("../../helpers/response");
const { BillingTitleService } = require("../../services/master");


const createBillingTitle = async (req, res, next) => {
  try {
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
    const { page = 1, limit = 10 } = req.query;
    const data = await BillingTitleService.getBillingTitles(page, limit);

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
    const [updated] = await BillingTitleService.updateBillingTitle(
      req.params.id,
      req.body
    );
    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Updated successfully" });
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

module.exports = {
  createBillingTitle,
  updateBillingTitle,
  getBillingTitleById,
  getBillingTitles,
  deleteBillingTitle,
};
