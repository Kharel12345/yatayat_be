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
    const result = await AccountingLedgerMapping.update({
      ledger_id: body.ledger_id,
    }, {
      where: {
        id: body.id
      }
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllLedgerList = async () => {
  try {
    const ledger = await LedgerInfo.findAll({
      attributes: ["id", "ledgername"],
      where: { status: 1 },
    });
    return ledger;
  } catch (error) {
    throw new Error(error);
  }
};

const getLedgerMappingPagination = async (limit, offset) => {
  try {

    const data = await AccountingLedgerMapping.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: LedgerInfo,
          as: 'ledgerInfo',
          attributes: ['id', 'ledgername'], // select the fields you need
          required: false, // will still return AccountingLedgerMapping even if ledger_id = 0
        },
      ],
      order: [['id', 'ASC']],
    });
    return data;
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

// const getActiveLedger = async () => {
//   try {
//     let result = await AccountingLedgerMapping.getActiveLedger();
//     return result;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const getAssociatedLedgerId = async (groupname) => {
//   try {
//     let result = await AccountingLedgerMapping.getLedgerInfo(groupname);
//     return result;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

const getActiveLedger = async () => {
  try {
    const result = await AccountingLedgerMapping.findAll({
      where: { status: 1 },  
      attributes: ['id', 'ledger_name', 'group_name'], 
      order: [['ledger_name', 'ASC']] 
    });
    return result;
  } catch (error) {
    console.error('Error fetching active ledgers:', error);
    throw new Error('Failed to fetch active ledgers');
  }
};

// Get a ledger by group name
const getAssociatedLedgerId = async (groupName) => {
  try {
    const result = await AccountingLedgerMapping.findOne({
      attributes: ['ledger_id', 'label'],
      where: { label: groupName },
      include: [
        {
          model: LedgerInfo,
          as: 'ledgerInfo',
          attributes: ['id'],
          where: { status: 1 },
          required: false, // allows groups even if no active ledgers
        },
      ],
    });

    return result;
  } catch (error) {
    throw new Error(`Error fetching ledger info: ${error.message}`);
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

const getBankLedger = async () => {
  try {
    let result = await LedgerInfo.findAll({
      attributes: ["id", "ledgername"],
      where: { master_ledger_group_id: 3, status: 1 },
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}


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
  getLedgerForVechileRegistration,
  getAllLedgerList,
  getBankLedger
};
