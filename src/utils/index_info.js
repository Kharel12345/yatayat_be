const { economicYearServices, IndexInfo } = require("../services/master");


const getReceiptNo = async (functional_year_id) => {
  try {
    let result = await IndexInfo.getReceiptNo(functional_year_id);
    let max_id = result.max_id;
    let index_code = result.index_code;
    let economicYearDetail = await economicYearServices.getEconomicYearInfo(
      functional_year_id
    );
    let functional_year_start_bs =
      economicYearDetail[0].functional_year_start_bs;
    let functional_year_end_bs = economicYearDetail[0].functional_year_end_bs;
    let receipt_no =
      ORGANIZATION_NAME_PREFIX +
      "-" +
      index_code +
      "-" +
      functional_year_start_bs.split("-")[0] +
      "-" +
      functional_year_end_bs.split("-")[0].slice(-3) +
      "-" +
      (parseInt(max_id) + 1);
    return receipt_no;
  } catch (error) {
    throw new Error(error);
  }
};

const getTransactionId = async (functional_year_id) => {
  try {
    let result = await IndexInfo.getTransactionId(functional_year_id);
    let max_id = result.max_id;
    return parseInt(max_id) + 1;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getTransactionId,
  getReceiptNo,
};
