const { getCurrentDateTime } = require("../../helpers/date");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const {
  SUCCESS_API_FETCH,
  DATA_SAVED,
  DATA_UPDATED,
} = require("../../helpers/response");
const {
  isFutureDate,
  validateAdDateAgainstFunctionalYear,
  isBackDate,
} = require("../../middlewares/dateValidation");
const { ledgerServices } = require("../../services/accounting");
const { getCurrentValue } = require("../../utils/dbUtils")

const logger = require("../../config/winstonLoggerConfig");

const getledgerGrouplist = async (req, res, next) => {
  try {
    const ledgerGroup = await ledgerServices.getledgerGrouplist();
    return res.status(200).json(SUCCESS_API_FETCH(ledgerGroup));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getledgerSubGrouplist = async (req, res, next) => {
  try {
    const ledgerSubGroup = await ledgerServices.getledgerSubGrouplist();
    return res.status(200).json(SUCCESS_API_FETCH(ledgerSubGroup));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const saveLedger = async (req, res, next) => {
  try {
    const {
      ledger_name,
      master_ledger_group_id,
      ledger_sub_group_id,
      address,
      contact,
      opening_balance_date_bs,
      opening_balance,
      transaction_type,
      status,
      functional_year_id,
      branch_id,
    } = req.body;

    let calendar = new Nepali_Calendar();
    let opening_balance_date_ad = calendar.BSToADConvert(
      opening_balance_date_bs
    );

    let isValidDate = await validateAdDateAgainstFunctionalYear(
      functional_year_id,
      opening_balance_date_ad
    );
    if (!isValidDate) {
      return res.status(400).json({
        status: false,
        message: "The provided date do not lie within the functional year",
      });
    }

    //check future date
    let isFuture = isFutureDate(opening_balance_date_ad);
    if (isFuture) {
      return res.status(400).json({
        status: false,
        message: "Future date is not allowed",
      });
    }

    //check for backdate
    let allow_backdate_entry_ledger =
      req.permission["ledger"] &&
      req.permission["ledger"].includes("allow_backdate_entry_ledger");
    if (!allow_backdate_entry_ledger) {
      let result = isBackDate(opening_balance_date_ad);
      if (result) {
        return res.status(400).json({
          status: false,
          message: "You do not have permission for back date entry",
        });
      }
    }

    const jsonObject = {
      ledger_name,
      master_ledger_group_id,
      ledger_sub_group_id,
      ledger_type: "Accounting",
      address,
      contact,
      opening_balance_date_ad,
      opening_balance_date_bs,
      opening_balance,
      transaction_type,
      status,
      functional_year_id,
      branch_id,
      created_by: req.user.user_id,
    };

    await ledgerServices.saveLedger(jsonObject);

    return res.status(201).json(DATA_SAVED());
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getLedgerPagination = async (req, res, next) => {
  try {
    const ledgerName = req.query.ledgerName || "";
    const status = parseInt(req.query.status);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const viewAll =
      req.permission["ledger"] &&
      req.permission["ledger"].includes("viewall_ledger");

    let { data, total } = await ledgerServices.getLedgerPagination(
      limit,
      offset,
      status,
      ledgerName,
      viewAll,
      req.user.user_id
    );

    return res.status(200).json({
      status: true,
      message: "Data found successfully!!!",
      data: data,
      total: total[0].total,
    });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const updateLedger = async (req, res, next) => {
  try {
    const {
      ledger_id,
      ledger_name,
      master_ledger_group_id,
      ledger_sub_group_id,
      address,
      contact,
      opening_balance_date_bs,
      opening_balance,
      transaction_type,
      status,
      functional_year_id,
      branch_id,
      remarks,
    } = req.body;

    let calendar = new Nepali_Calendar();
    let opening_balance_date_ad = calendar.BSToADConvert(
      opening_balance_date_bs
    );

    let isValidDate = await validateAdDateAgainstFunctionalYear(
      functional_year_id,
      opening_balance_date_ad
    );
    if (!isValidDate) {
      return res.status(400).json({
        status: false,
        message: "The provided date do not lie within the functional year",
      });
    }

    //check future date
    let isFuture = isFutureDate(opening_balance_date_ad);
    if (isFuture) {
      return res.status(400).json({
        status: false,
        message: "Future date is not allowed",
      });
    }

    const old_value = await getCurrentValue(
      "accounting_ledgerinfo",
      "id",
      ledger_id
    );

    const jsonObject = {
      ledger_id,
      ledger_name,
      master_ledger_group_id,
      ledger_sub_group_id,
      address,
      contact,
      opening_balance_date_ad,
      opening_balance_date_bs,
      opening_balance,
      transaction_type,
      status,
      functional_year_id,
      branch_id,
    };

    const logDetails = {
      module_name: "ledger",
      table_name: "accounting_ledgerinfo",
      row_id: ledger_id,
      new_value: jsonObject,
      old_value: old_value,
      operation: status == 0 ? "delete" : "update",
      remarks: remarks,
      user_id: req.user.user_id,
      transaction_date: getCurrentDateTime(),
    };

    await ledgerServices.updateLedger(jsonObject, logDetails);

    return res.status(201).json(DATA_UPDATED());
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const saveLedgerMapping = async (req, res, next) => {
  try {
    await ledgerServices.saveLedgerMapping(req.body);
    return res
      .status(201)
      .json(DATA_UPDATED("Ledger mapping done successfully!!!"));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getLedgerMappingPagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let { data, total } = await ledgerServices.getLedgerMappingPagination(
      limit,
      offset
    );

    return res.status(200).json({
      status: true,
      message: "Data found successfully!!!",
      data: data,
      total: total[0].total,
    });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getActiveLedger = async (req, res, next) => {
  try {
    const ledger = await ledgerServices.getActiveLedger();
    return res.status(200).json(SUCCESS_API_FETCH(ledger));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

module.exports = {
  getledgerGrouplist,
  getledgerSubGrouplist,
  saveLedger,
  getLedgerPagination,
  updateLedger,
  saveLedgerMapping,
  getLedgerMappingPagination,
  getActiveLedger,
};
