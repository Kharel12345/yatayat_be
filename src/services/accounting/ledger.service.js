const { getFormattedDate } = require("../../helpers/date");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const {
  AccountingLedgerInfo,
} = require("../../../models/accounting/ledger.model");
const AccountingLedgerGroup = require("../../../models/accounting/ledgergroup.model");
const AccountingLedgerSubGroup = require("../../../models/accounting/ledgersubgroup.model");
const AccountingLedgerMapping = require("../../../models/accounting/ledgermapping.model");
const LedgerInfo = require("../../../models/accounting/ledger.model");
const { Sequelize } = require("sequelize");

const getledgerGrouplist = async () => {
  try {
    const result = await AccountingLedgerGroup.findAll({
      attributes: [["id", "ledger_group_id"], "ledger_group_name", "formula"],
      where: { status: 1 },
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getledgerSubGrouplist = async () => {
  try {
    const result = await AccountingLedgerSubGroup.findAll({
      attributes: [["id", "ledger_sub_group_id"], "sub_group_name"],
      where: { status: 1 },
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const saveLedger = async (jsonObject) => {
  try {
    const result = AccountingLedgerInfo.saveLedger(jsonObject);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getLedgerPagination = async (
  limit,
  offset,
  status,
  ledgerName,
  viewAll,
  user_id
) => {
  try {
    let { data, total } = await AccountingLedgerInfo.getLedgerPagination(
      limit,
      offset,
      status,
      ledgerName,
      viewAll,
      user_id
    );
    let cal = new Nepali_Calendar();

    data = data.map((d) => {
      d = {
        ...d,
        opening_balance_date_bs: cal.ADToBsConvert(
          getFormattedDate(d.opening_balance_date)
        ),
        transaction_type: d.credit == 0 ? "Debit" : "Credit",
      };
      return d;
    });

    return { data, total };
  } catch (error) {
    throw new Error(error);
  }
};

const updateLedger = async (jsonObject, logDetails) => {
  try {
    const result = await AccountingLedgerInfo.updateLedger(
      jsonObject,
      logDetails
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const saveLedgerMapping = async (body) => {
  try {
    const result = await AccountingLedgerMapping.saveLedgerMapping(body);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getLedgerMappingPagination = async (limit, offset) => {
  try {
    let { data, total } =
      await getLedgerMappingModelPagination(limit, offset);
    data = data.map((d) => {
      d = {
        ...d,
        ledger_id: d.ledger_id == 0 ? "" : d.ledger_id,
      };
      return d;
    });
    return { data, total };
  } catch (error) {
    throw new Error(error);
  }
};

const getLedgerMappingModelPagination = async (limit, offset) => {
  const { count, rows } = await AccountingLedgerMapping.findAndCountAll({
    attributes: ["id", "label", "ledger_id"],
    include: [
      {
        model: LedgerInfo,
        as: "ledger",
        attributes: [
          [
            Sequelize.fn("COALESCE", Sequelize.col("ledger.ledgername"), ""),
            "ledgername",
          ],
        ],
        required: false, 
      },
    ],
    limit,
    offset,
  });

  return {
    data: rows,
    total: count,
  };
};

const getledgerGroup = async (name) => {
  try {
    const result = await AccountingLedgerGroup.findOne({
      attributes: ["id"],
      where: { ledger_group_name: name, status: 1 },
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getActiveLedger = async () => {
  try {
    let result = await AccountingLedgerInfo.getActiveLedger();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAssociatedLedgerId = async (groupname) => {
  try {
    let result = await AccountingLedgerInfo.getLedgerInfo(groupname);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getMappedLedgerIdByLabel = async (ledgerName) => {
  try {
    let result = await AccountingLedgerMapping.getMappedLedgerIdByLabel(
      ledgerName
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getLedgerForVechileRegistration = async () => {
  const ledgerInfo = await AccountingLedgerGroup.findOne({
    attributes: ['ledger_group_name', 'id'],
    where: {
      ledger_group_name: 'Account Payable'
    }
  });

  return ledgerInfo;
};


module.exports = {
  getledgerGrouplist,
  getledgerSubGrouplist,
  saveLedger,
  getLedgerPagination,
  updateLedger,
  saveLedgerMapping,
  getLedgerMappingPagination,
  getledgerGroup,
  getActiveLedger,
  getAssociatedLedgerId,
  getMappedLedgerIdByLabel,
  getLedgerForVechileRegistration
};
