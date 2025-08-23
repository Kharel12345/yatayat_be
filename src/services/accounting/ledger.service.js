const { getFormattedDate } = require("../../helpers/date");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const {
  AccountingLedgerInfo,
} = require("../../../models/accounting/ledger.model");
const AccountingLedgerGroup = require("../../../models/accounting/ledgergroup.model");
const AccountingLedgerSubGroup = require("../../../models/accounting/ledgersubgroup.model");
const AccountingLedgerMapping = require("../../../models/accounting/ledgermapping.model");
const LedgerInfo = require("../../../models/accounting/ledger.model");
const { Sequelize, Op } = require("sequelize");
const BranchInfo = require("../../../models/branch.model");

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
    const result = LedgerInfo.create(jsonObject);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// const getLedgerPagination = async (
//   limit,
//   offset,
//   status,
//   ledgerName,
//   viewAll,
//   user_id
// ) => {
//   try {
//     let { data, total } = await AccountingLedgerInfo.getLedgerPagination(
//       limit,
//       offset,
//       status,
//       ledgerName,
//       viewAll,
//       user_id
//     );
//     let cal = new Nepali_Calendar();

//     data = data.map((d) => {
//       d = {
//         ...d,
//         opening_balance_date_bs: cal.ADToBsConvert(
//           getFormattedDate(d.opening_balance_date)
//         ),
//         transaction_type: d.credit == 0 ? "Debit" : "Credit",
//       };
//       return d;
//     });

//     return { data, total };
//   } catch (error) {
//     throw new Error(error);
//   }
// };

const getLedgerPagination = async (limit, offset, status, ledgerName, user_id) => {
  try {
    const whereClause = {};
    if (status !== undefined) whereClause.status = status;
    if (ledgerName) whereClause.ledgername = { [Op.like]: `%${ledgerName}%` };
    if (user_id) whereClause.created_by = user_id;

    // Ensure numeric
    limit = parseInt(limit) || 10;
    offset = parseInt(offset) || 0;

    const data = await LedgerInfo.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['id', 'DESC']], // ensure your DB really has "id" column
      include: [
        {
          model: BranchInfo,
          as: "branch",
          attributes: ["branch_id", "name"], // 👈 only fetch id + name
        },
        {
          model: AccountingLedgerGroup,
          as: "ledgerGroup",
          attributes: ["id", "ledger_group_name"], // 👈 only fetch id + name
        },
        {
          model: AccountingLedgerSubGroup,
          as: "ledgerSubGroup",
          attributes: ["id", "sub_group_name"], // 👈 only fetch id + name
        },
      ],
    });
    return data;
    // return { rows, count };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateLedger = async (jsonObject, logDetails) => {
  const { ledger_id, ...rest } = jsonObject;
  try {
    const result = await LedgerInfo.update(rest, { where: { id: ledger_id } });
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
