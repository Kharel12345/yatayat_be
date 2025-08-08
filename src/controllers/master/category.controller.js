const { categoryService } = require("../../services/master");
const logger = require("../../config/winstonLoggerConfig");
const { DATA_SAVED, SUCCESS_API_FETCH } = require("../../helpers/response");

const { UniqueConstraintError } = require("sequelize");

const createCategory = async (req, res, next) => {
  try {
    const value = req.body;
    const isCategoryNameAvailable = await categoryService.checkCategoryNameAvailable(
      value.name);
    if (!isCategoryNameAvailable) {
      return res.status(208).json({
        status: false,
        message: "Category name must be unique"
      });
    }
    const category = await categoryService.createCategory(value);
    res.status(201).json({
      status: true,
      message: "Category created successfully",
      data: category
    });
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
    const checkData = await categoryService.getCategoryById(req.params.id);

    if (!checkData) {
      return res.status(404).json({
        status: false,
        message: "Category not found!!!"
      });
    }

    const isCategoryNameAvailable = await categoryService.checkCategoryNameAvailable(
      value.name, req.params.id);

    if (!isCategoryNameAvailable) {
      return res.status(208).json({
        status: false,
        message: "Category name must be unique"
      });
    }

    const updatedCategory = await categoryService.updateCategory(
      req.params.id,
      value
    );

    return res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: updatedCategory
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({ error: "Category name must be unique" });
    }
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};


const getAllCategories = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const categories = await categoryService.getAllCategories(page, limit, status);
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

const getAllCategoriesList = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategoriesList();
    res.json(categories);
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
  getAllCategoriesList
};
