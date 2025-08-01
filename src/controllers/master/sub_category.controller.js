const {subCategoryService} = require("../../services/master");

const logger = require("../../config/winstonLoggerConfig");
const { getFormattedDate } = require("../../helpers/date");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const { DATA_SAVED, SUCCESS_API_FETCH } = require("../../helpers/response");

const createSubCategory = async (req, res, next) => {
  try {
    const value = req.body;

    const subCategory = await subCategoryService.createSubCategory(
      value.categoryId,
      value
    );
    res.status(201).json(subCategory);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getAllSubCategory = async (req, res, next) => {
  try {
    const subCategories = await subCategoryService.getAllSubCategories(
      req.params.categoryId,
      req.query.status
    );
    res.json(subCategories);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getByIdSubCategory = async (req, res, next) => {
  try {
    const subCategory = await subCategoryService.getSubCategoryById(
      req.params.categoryId,
      req.params.subCategoryId
    );
    if (!subCategory)
      return res.status(404).json({ error: "Sub-category not found" });
    res.json(subCategory);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const updateSubCategory = async (req, res, next) => {
  try {
    const value = req.body;

    const updatedSubCategory = await subCategoryService.updateSubCategory(
      value.categoryId,
      req.params.subCategoryId,
      value
    );
    if (!updatedSubCategory)
      return res.status(404).json({ error: "Sub-category not found" });
    res.json(updatedSubCategory);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const deleteSubCategory = async (req, res, next) => {
  try {
    const deleted = await subCategoryService.deleteSubCategory(
      req.params.categoryId,
      req.params.subCategoryId
    );
    if (!deleted)
      return res.status(404).json({ error: "Sub-category not found" });
    res.status(204).json();
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

module.exports = {
  createSubCategory,
  getAllSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getByIdSubCategory,
};
