const Category = require("../../../models/master/category.model");
const { Op } = require('sequelize');

const createCategory = (categoryData) => {
  return Category.create(categoryData);
};


const checkCategoryNameAvailable = async (name, id) => {
  const whereClause = {
    name,
  };
  // Exclude this specific ID if it's provided
  if (id !== null && id !== undefined) {
    whereClause.id = { [Op.ne]: id };
  }

  const category = await Category.findOne({ where: whereClause });

  return !category; // true if name is available (not taken by others), false if taken
};

const updateCategory = async (id, updateData) => {
  const [updated] = await Category.update(updateData, {
    where: { id },
  });
  return updated;
};


const getAllCategories = async (page, limit, status) => {
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const offset = (page - 1) * limit;

  // Convert to boolean only if status is explicitly passed
  let where = {};

  if (status !== undefined) {
    where = { status: status == 'active' ? true : false };
  } else {
    where = { status: 1 };
  }

  const { count, rows } = await Category.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return {
    total: count,
    page,
    limit,
    data: rows,
  };
};


const getCategoryById = async (id) => {
  return await Category.findOne({
    where: { id, status: 1 },
  });
};


const deleteCategory = async (id) => {
  await Category.update({ status: 0 }, { where: { id } });
  return true;
};

const getAllCategoriesList = async () => {
  return await Category.findAll({
    attributes: ['id', 'name'],
    where: { status: 1 },
  });
};


module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  checkCategoryNameAvailable,
  getAllCategoriesList
};
