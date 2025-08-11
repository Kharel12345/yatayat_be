// services/billingTitleInfo.service.js
const { BillingTitleInfo } = require("../../../models/master");

const checkBillingTitleExists = async ({ billing_title_code }) => {
  return await BillingTitleInfo.findOne({
    where: { status: 1, billing_title_code },
  });
};

const createBillingTitle = async (data) => {
  const existing = await checkBillingTitleExists({
    billing_title_code: data.billing_title_code,
  });
  if (existing) {
    throw new Error("Billing title with this code already exists");
  }
  return await BillingTitleInfo.create(data);
};

const getBillingTitles = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  return await BillingTitleInfo.findAndCountAll({
    where: { status: 1 },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["billing_title_id", "DESC"]],
  });
};

const getBillingTitleById = async (id) => {
  return await BillingTitleInfo.findOne({
    where: { billing_title_id: id, status: 1 },
  });
};

const updateBillingTitle = async (id, data) => {
  // Check if billing_title_code in data and is being changed
  if (data.billing_title_code !== undefined) {
    // Find if another record with same billing_title_code exists and is NOT the current record
    const existing = await BillingTitleInfo.findOne({
      where: {
        billing_title_code: data.billing_title_code,
        status: 1,
        billing_title_id: { [Op.ne]: id }, // Exclude current record
      },
    });
    if (existing) {
      throw new Error("Billing title code already exists for another record");
    }
  }

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

module.exports = {
  createBillingTitle,
  getBillingTitles,
  getBillingTitleById,
  updateBillingTitle,
  softDeleteBillingTitle,
};
