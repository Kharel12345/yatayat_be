const { BillingTitleMappingInfo } = require("../../../models/master");

const createBillingMapping = (data) => {
  return BillingTitleMappingInfo.create(data);
};

const findAllBillingMapping = (filters = {}) => {
  const where = {};
  if (filters.branch_id) where.branch_id = filters.branch_id;
  if (filters.status !== undefined) where.status = filters.status;

  return BillingTitleMappingInfo.findAll({
    where,
    include: [
      { association: "billing_title" },
      { association: "label" },
      { association: "branch" },
      { association: "creator" },
    ],
  });
};

const findOneBillingMapping = (id) => {
  return BillingTitleMappingInfo.findByPk(id, {
    include: [
      { association: "billing_title" },
      { association: "label" },
      { association: "branch" },
      { association: "creator" },
    ],
  });
};

const updateBillingMapping = async (id, data) => {
  const mapping = await BillingTitleMappingInfo.findByPk(id);
  if (!mapping) return null;

  return mapping.update(data);
};

const deleteBillingMapping = async (id) => {
  const mapping = await BillingTitleMappingInfo.findByPk(id);
  if (!mapping) return null;

  return mapping.destroy();
};

module.exports = {
  createBillingMapping,
  updateBillingMapping,
  deleteBillingMapping,
  findOneBillingMapping,
  findAllBillingMapping,
};
