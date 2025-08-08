const SubCategory = require("../../../models/master/sub_category.model");
const sequelize = require("../../../config/database");
class SubCategoryService {
  async createSubCategory(categoryId, subCategoryData) {
    // Check for duplicate name in same category
    const existing = await SubCategory.findOne({
      where: {
        name: subCategoryData.name,
        categoryId,
      },
    });

    if (existing) {
      throw new Error("Sub-category name already exists in this category.");
    }

    return SubCategory.create({
      ...subCategoryData,
      categoryId,
    });
  }

  async getAllSubCategories({ page = 1, limit = 10, categoryId, status }) {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;

    // Build WHERE conditions dynamically
    let whereClauses = [];
    let replacements = { limit, offset };

    if (categoryId !== undefined && categoryId !== '') {
      whereClauses.push('sc.categoryId = :categoryId');
      replacements.categoryId = Number(categoryId);
    }

    if (status !== undefined) {
      if (status === 'active') {
        whereClauses.push('sc.status = 1');
      } else if (status === 'inactive') {
        whereClauses.push('sc.status = 0');
      } else {
        whereClauses.push('sc.status = :status');
        replacements.status = Number(status);
      }
    }

    const whereSQL = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';

    // --- SQL for data
    const dataSql = `
    SELECT sc.*, c.name AS categoryName
    FROM SubCategories sc
    LEFT JOIN categories c ON sc.categoryId = c.id
    ${whereSQL}
    ORDER BY sc.createdAt DESC
    LIMIT :limit OFFSET :offset
  `;

    // --- SQL for count
    const countSql = `
    SELECT COUNT(*) AS total
    FROM SubCategories sc
    ${whereSQL}
  `;

    // 🟢 FIX: Do not destructure
    const rows = await sequelize.query(dataSql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    const [countResult] = await sequelize.query(countSql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    return {
      total: Number(countResult.total),
      page,
      limit,
      data: rows, // Now correctly an array
    };
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
    // Check for duplicate name (if name is changing)
    if (updateData.name) {
      const existing = await SubCategory.findOne({
        where: {
          name: updateData.name,
          categoryId,
          id: { [SubCategory.sequelize.Op.ne]: subCategoryId },
        },
      });

      if (existing) {
        throw new Error("Sub-category name already exists in this category.");
      }
    }

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
