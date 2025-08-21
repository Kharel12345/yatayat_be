// services/billingTitleInfo.service.js
const { Op } = require("sequelize");
const { BillingTitleInfo } = require("../../../models/master");
const BranchInfo = require("../../../models/branch.model");
const LabelInfo = require("../../../models/master/label_info.model");

const checkBillingTitleExists = async ({ billing_title_code }) => {
  return await BillingTitleInfo.findOne({
    where: { status: 1, billing_title_code },
  });
};

const createBillingTitle = async (data) => {
  return await BillingTitleInfo.create(data);
};

const getBillingTitles = async (page = 1, limit = 10, status) => {
  const offset = (page - 1) * limit;

  return await BillingTitleInfo.findAndCountAll({
    where: { status },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["billing_title_id", "DESC"]],
    include: [
      {
        model: BranchInfo,
        as: "branch",
        attributes: ["branch_id", "name"], // 👈 only fetch id + name
      },
    ],
  });
};
const getBillingTitleById = async (id) => {
  return await BillingTitleInfo.findOne({
    where: { billing_title_id: id, status: 1 },
  });
};

const updateBillingTitle = async (id, data) => {
  return await BillingTitleInfo.update(data, {
    where: { billing_title_id: id },
  });
};
const softDeleteBillingTitle = async (id) => {
  return await BillingTitleInfo.update(
    { status: 0 },
    { where: { billing_title_id: id } }
  );
};

const getAllBillingTitleList = async () => {
  return await BillingTitleInfo.findAll({
    attributes: ["billing_title_id", "billing_title"], // only select these fields
    where: { status: 1 }, // optional: only active
    order: [["billing_title", "DESC"]], // optional: sort alphabetically
  });
};

const getAllLabelList = async () => {
  return await LabelInfo.findAll({
    attributes: [["id", "label_id"], "label_name"], // ✅ fixed
    where: { status: 1 },
    order: [["id", "DESC"]], // use original column name for ordering
  });
};


module.exports = {
  createBillingTitle,
  getBillingTitles,
  getBillingTitleById,
  updateBillingTitle,
  softDeleteBillingTitle,
  checkBillingTitleExists,
  getAllBillingTitleList,
  getAllLabelList
};
