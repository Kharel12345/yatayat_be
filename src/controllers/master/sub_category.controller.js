const { subCategoryService } = require("../../services/master");
const logger = require("../../config/winstonLoggerConfig");

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
    return res.status(400).json({ error: error.message });
  }
};

const getAllSubCategory = async (req, res, next) => {
  try {
    const data = req.query;
    const subCategories = await subCategoryService.getAllSubCategories(data);
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
      req.query.categoryId,
      req.params.id
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
      req.params.id,
      value
    );

    if (!updatedSubCategory)
      return res.status(404).json({ error: "Sub-category not found" });

    res.json(updatedSubCategory);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return res.status(400).json({ error: error.message });
  }
};

const deleteSubCategory = async (req, res, next) => {
  try {
    const deleted = await subCategoryService.deleteSubCategory(req.params.id);

    if (!deleted)
      return res.status(404).json({
        status: false,
        message: "Sub-category not found"
      });

    res.status(204).json({
      status: true,
      message: "Sub-category deleted successfully",
    });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getAllSubCategoriesList = async (req, res, next) => {
  try {
    const subCategories = await subCategoryService.getAllSubCategoriesList();
    res.status(200).json({
      status: true,
      message: "Sub-categories list",
      data: subCategories
    });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getSubCategoryByCategory = async (req, res, next) => {
  try {
    const subCategories = await subCategoryService.getSubCategoryByCategory(req.params.id);
    res.status(200).json({
      status: true,
      message: "Sub-categories list",
      data: subCategories
    });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
}

module.exports = {
  createSubCategory,
  getAllSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getByIdSubCategory,
  getAllSubCategoriesList,
  getSubCategoryByCategory
};
