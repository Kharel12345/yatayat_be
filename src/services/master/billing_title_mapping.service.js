const { BillingTitleMappingInfo } = require("../../../models/master");

const createBillingMapping = (data) => {
  return BillingTitleMappingInfo.create(data);
};

const findAllBillingMapping = (filters = {}) => {
  const where = {};
  if (filters.branch_id) where.branch_id = filters.branch_id;
  if (filters.status !== undefined) where.status = filters.status; else where.status = 1;

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
  return BillingTitleMappingInfo.findOne({
    where: { id, status: 1 },
    include: [
      { association: "billing_title" },
      { association: "label" },
      { association: "branch" },
      { association: "creator" },
    ],
  });
};

const updateBillingMapping = async (id, data) => {
  const mapping = await BillingTitleMappingInfo.findOne({ where: { id, status: 1 } });
  if (!mapping) return null;

  return mapping.update(data);
};

const deleteBillingMapping = async (id) => {
  const mapping = await BillingTitleMappingInfo.findOne({ where: { id } });
  if (!mapping) return null;

  await mapping.update({ status: 0 });
  return true;
};

module.exports = {
  createBillingMapping,
  updateBillingMapping,
  deleteBillingMapping,
  findOneBillingMapping,
  findAllBillingMapping,
};
