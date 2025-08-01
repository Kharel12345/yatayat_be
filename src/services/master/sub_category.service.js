const SubCategory = require("../../../models/master/sub_category.model");

class SubCategoryService {
  async createSubCategory(categoryId, subCategoryData) {
    return SubCategory.create({
      ...subCategoryData,
      categoryId,
    });
  }

  async getAllSubCategories(categoryId, status) {
    const where = { categoryId };
    if (status !== undefined) where.status = status;

    return SubCategory.findAll({ where });
  }

  async getSubCategoryById(categoryId, subCategoryId) {
    return SubCategory.findOne({
      where: {
        id: subCategoryId,
        categoryId,
      },
    });
  }

  async updateSubCategory(categoryId, subCategoryId, updateData) {
    const [updated] = await SubCategory.update(updateData, {
      where: {
        id: subCategoryId,
        categoryId,
      },
    });

    if (!updated) return null;
    return this.getSubCategoryById(categoryId, subCategoryId);
  }

  async deleteSubCategory(categoryId, subCategoryId) {
    return SubCategory.destroy({
      where: {
        id: subCategoryId,
        categoryId,
      },
    });
  }
}

module.exports = new SubCategoryService();
