const { where } = require("sequelize");
const IndexInfo = require("../../../models/master/index_info.model");

// Constants for index codes
const RECEIPT_INDEX_CODE = "receipt_no";
const TRANSACTION_INDEX_CODE = "transaction_id";

const getIndexInfo = async (functionalYearId, indexCode) => {
  try {
    const record = await IndexInfo.findOne({
      attributes: ['max_id', 'index_code'],
    }, {
      where: {
        functional_year_id: functionalYearId,
        index_code: indexCode
      }
    });
    return record?.dataValues;
  } catch (error) {
    console.error(`Error fetching index info for ${indexCode}:`, error);
    throw error;
  }
};

const getReceiptNo = async (functionalYearId) => {
  return await getIndexInfo(functionalYearId, RECEIPT_INDEX_CODE);
};

const getTransactionId = async (functionalYearId) => {
  return await getIndexInfo(functionalYearId, TRANSACTION_INDEX_CODE);
};

module.exports = {
  getReceiptNo,
  getTransactionId,
};
