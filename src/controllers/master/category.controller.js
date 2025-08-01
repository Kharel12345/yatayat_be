const {categoryService} = require("../../services/master");

const logger = require("../../config/winstonLoggerConfig");
const { getFormattedDate } = require("../../helpers/date");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const { DATA_SAVED, SUCCESS_API_FETCH } = require("../../helpers/response");

const createCategory = async (req, res, next) => {
  try {
    const value = req.body;

    const category = await categoryService.createCategory(value);
    res.status(201).json(DATA_SAVED(category));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories(req.query.status);
    res.json(categories);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const value = req.body;

    const updatedCategory = await categoryService.updateCategory(
      req.params.id,
      value
    );
    if (!updatedCategory)
      return res.status(404).json({ error: "Category not found" });
    res.json(updatedCategory);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.status(204).json();
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
};
