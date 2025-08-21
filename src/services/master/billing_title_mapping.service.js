const BranchInfo = require("../../../models/branch.model");
const { BillingTitleMappingInfo, BillingTitleInfo } = require("../../../models/master");
const LabelInfo = require("../../../models/master/label_info.model");

const createBillingMapping = (data) => {
  return BillingTitleMappingInfo.create(data);
};

const findAllBillingMapping = async (filters = {}) => {
  const where = {};
  if (filters.branch_id) where.branch_id = filters.branch_id;
  if (filters.status !== undefined) where.status = filters.status;
  else where.status = 1;

  return await BillingTitleMappingInfo.findAndCountAll({
    where,
    include: [
      { model: BillingTitleInfo, as: "billingInfo", attributes: ['billing_title_id', 'billing_title'] },
      { model: LabelInfo, as: "labelInfo", attributes: ['id', 'label_name'] },
      { model: BranchInfo, as: "branchInfo", attributes: ["branch_id", "name"], },
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
