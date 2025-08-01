const Category = require("../../../models/master/category.model");
const SubCategory = require("../../../models/master/sub_category.model");

const createCategory = (categoryData) => {
  return Category.create(categoryData);
};

const getAllCategories = (status) => {
  const where = {};
  if (status !== undefined) where.status = status;

  return Category.findAll({
    where,
    include: [
      {
        model: SubCategory,
        as: "subCategories",
        attributes: ["id", "name", "status"],
      },
    ],
  });
};

const getCategoryById = (id) => {
  return db.Category.findByPk(id, {
    include: [
      {
        model: db.SubCategory,
        as: "subCategories",
        attributes: ["id", "name", "status"],
      },
    ],
  });
};

const updateCategory = async (id, updateData) => {
  const [updated] = await Category.update(updateData, {
    where: { id },
  });

  if (!updated) return null;
  return this.getCategoryById(id);
};

const deleteCategory = (id) => {
  return Category.destroy({
    where: { id },
  });
};

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
};
