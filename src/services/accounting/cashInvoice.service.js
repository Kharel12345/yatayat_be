const { Op } = require("sequelize");
const moment = require("moment");
const {
  NotFoundError,
  ValidationError,
  DatabaseError,
} = require("../../utils/error");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const { Vehicle } = require("../../../models/master");
const CashInvoice = require("../../../models/accounting/cash_invoice.model");
const AccountingTransactionDetail = require("../../../models/accounting/accounting_transaction_detail.model");
const IndexInfo = require("../../../models/master/index_info.model");
const { ORGANIZATION_NAME_PREFIX } = require("../../config/constant");
const { ledgerServices } = require("./index");
const sequelize = require("../../config/database");

const createCashInvoice = async (cashInvoiceData) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      vehicle_id,
      bill_date_bs,
      payment_method,
      amount,
      remarks,
      branch_id,
      functional_year_id,
      created_by,
      bank_id,
    } = cashInvoiceData;

    const nepaliCalendar = new Nepali_Calendar();
    const bill_date = nepaliCalendar.BSToADConvert(bill_date_bs);

    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicle_id, { where: { status: 1 } });
    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }

    // Prepare receipt_no and transaction_id
    const receiptIndex = await IndexInfo.findOne({
      where: { functional_year_id, index_code: "receipt_no" },
      attributes: ["max_id", "index_code"],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    const txnIndex = await IndexInfo.findOne({
      where: { functional_year_id, index_code: "transaction_id" },
      attributes: ["max_id", "index_code"],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    const nextReceipt = (parseInt(receiptIndex?.max_id || 0) + 1);
    const receipt_no = `${ORGANIZATION_NAME_PREFIX}-${receiptIndex?.index_code || "receipt_no"}-${nextReceipt}`;
    const transaction_id = parseInt((txnIndex?.max_id || 0)) + 1;

    // Create cash invoice
    const cashInvoice = await CashInvoice.create(
      {
        vehicle_id,
        bill_date: bill_date || new Date(),
        bill_date_bs,
        receipt_no,
        payment_method: payment_method.toLowerCase(),
        amount,
        remarks,
        branch_id,
        functional_year_id,
        created_by,
        status: 1,
      },
      { transaction }
    );

    // Ledger postings: Receipt
    const narration = `Receipt from vehicle ID ${vehicle_id}`;

    if (payment_method.toLowerCase() === "cash") {
      // Get Cash in Hand ledger
      const cashLedgerData = await ledgerServices.getAssociatedLedgerId("Cash in Hand");
      const cash_ledger_id = cashLedgerData?.ledger_id;
      if (!cash_ledger_id) {
        throw new ValidationError("Ledger mapping for 'Cash in Hand' is missing.");
      }
      // Debit Cash in Hand
      await AccountingTransactionDetail.create(
        {
          comes_from: "CASH RECEIPT",
          ledger_id: cash_ledger_id,
          credit: 0.0,
          debit: amount,
          table_id: cashInvoice.id,
          transaction_id,
          voucher_date_ad: bill_date,
          voucher_date_bs: bill_date_bs,
          voucher_number: receipt_no,
          voucher_type: "Receipt Voucher",
          functional_year_id,
          branch_id,
          narration,
          created_by,
        },
        { transaction }
      );
      // Credit Vehicle ledger
      await AccountingTransactionDetail.create(
        {
          comes_from: "CASH RECEIPT",
          ledger_id: vehicle.ledgerId,
          credit: amount,
          debit: 0.0,
          table_id: cashInvoice.id,
          transaction_id,
          voucher_date_ad: bill_date,
          voucher_date_bs: bill_date_bs,
          voucher_number: receipt_no,
          voucher_type: "Receipt Voucher",
          functional_year_id,
          branch_id,
          narration,
          created_by,
        },
        { transaction }
      );
    }

    if (payment_method.toLowerCase() === "online") {
      if (!bank_id) {
        throw new ValidationError("bank_id is required for online payments");
      }
      // Debit Bank ledger (bank_id)
      await AccountingTransactionDetail.create(
        {
          comes_from: "CASH RECEIPT",
          ledger_id: bank_id,
          credit: 0.0,
          debit: amount,
          table_id: cashInvoice.id,
          transaction_id,
          voucher_date_ad: bill_date,
          voucher_date_bs: bill_date_bs,
          voucher_number: receipt_no,
          voucher_type: "Receipt Voucher",
          functional_year_id,
          branch_id,
          narration,
          created_by,
        },
        { transaction }
      );
      // Credit Vehicle ledger
      await AccountingTransactionDetail.create(
        {
          comes_from: "CASH RECEIPT",
          ledger_id: vehicle.ledgerId,
          credit: amount,
          debit: 0.0,
          table_id: cashInvoice.id,
          transaction_id,
          voucher_date_ad: bill_date,
          voucher_date_bs: bill_date_bs,
          voucher_number: receipt_no,
          voucher_type: "Receipt Voucher",
          functional_year_id,
          branch_id,
          narration,
          created_by,
        },
        { transaction }
      );
    }

    // Update indices
    if (txnIndex) {
      await IndexInfo.update(
        { max_id: transaction_id },
        { where: { functional_year_id, index_code: "transaction_id" }, transaction }
      );
    }
    if (receiptIndex) {
      await IndexInfo.update(
        { max_id: sequelize.literal("max_id + 1") },
        { where: { functional_year_id, index_code: "receipt_no" }, transaction }
      );
    }

    await transaction.commit();
    return cashInvoice;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getAllCashInvoices = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      payment_method = "",
      status = 1,
      branch_id,
      functional_year_id,
    } = filters;

    const offset = (page - 1) * limit;
    const whereClause = {
      status: status,
    };

    // Add search filter
    // if (search) {
    //   whereClause[Op.or] = [
    //     { vehicleNo: { [Op.like]: `%${search}%` } },
    //   ];
    // }

    // Add payment method filter
    if (payment_method) {
      whereClause.payment_method = payment_method;
    }

    // Add branch filter
    if (branch_id) {
      whereClause.branch_id = branch_id;
    }

    // Add functional year filter
    if (functional_year_id) {
      whereClause.functional_year_id = functional_year_id;
    }

    const includeClause = [
      {
        model: Vehicle,
        as: "vehicle",
        attributes: ["id", "vehicleNo"],
        ...(search
          ? { where: { vehicleNo: { [Op.like]: `%${search}%` } } }
          : {}),
      },
    ];

    const { count, rows } = await CashInvoice.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return {
      cashInvoices: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw error;
  }
};

const getCashInvoiceById = async (id) => {
  try {
    const cashInvoice = await CashInvoice.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: "vehicle",
        },
      ],
    });

    if (!cashInvoice) {
      throw new NotFoundError("Cash invoice not found");
    }

    return cashInvoice;
  } catch (error) {
    throw error;
  }
};

const updateCashInvoice = async (id, updateData) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      vehicle_id,
      bill_date_bs,
      payment_method,
      amount,
      remarks,
      branch_id,
      status,
      functional_year_id,
      bank_id,
      created_by,
    } = updateData;

    const cashInvoice = await CashInvoice.findByPk(id);
    if (!cashInvoice) {
      throw new NotFoundError("Cash invoice not found");
    }

    const newVehicleId = vehicle_id || cashInvoice.vehicle_id;

    // Ensure vehicle exists and get its ledger mapping
    let vehicle = null;
    if (vehicle_id && vehicle_id !== cashInvoice.vehicle_id) {
      vehicle = await Vehicle.findByPk(vehicle_id, {
        where: { status: 1 },
      });
      if (!vehicle) {
        throw new NotFoundError("Vehicle not found");
      }
    } else {
      vehicle = await Vehicle.findByPk(newVehicleId);
      if (!vehicle) {
        throw new NotFoundError("Vehicle not found");
      }
    }

    // Convert BS date to AD if provided
    let bill_date = cashInvoice.bill_date;
    let newBillDateBs = cashInvoice.bill_date_bs;
    if (bill_date_bs) {
      const nepaliCalendar = new Nepali_Calendar();
      bill_date = nepaliCalendar.BSToADConvert(bill_date_bs);
      newBillDateBs = bill_date_bs;
    }

    // Determine effective payment method
    const newPaymentMethod = payment_method
      ? payment_method.toLowerCase()
      : cashInvoice.payment_method;

    // Fetch existing accounting entries for this invoice
    const existingEntries = await AccountingTransactionDetail.findAll({
      where: { comes_from: "CASH RECEIPT", table_id: id },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!existingEntries || existingEntries.length < 2) {
      throw new DatabaseError(
        "Associated accounting entries not found for this cash invoice"
      );
    }

    const debitRow = existingEntries.find((e) => parseFloat(e.debit) > 0);
    const creditRow = existingEntries.find((e) => parseFloat(e.credit) > 0);

    const txnId = debitRow?.transaction_id || creditRow?.transaction_id || null;
    const voucherNumber =
      debitRow?.voucher_number || creditRow?.voucher_number || cashInvoice.receipt_no;
    const voucherType =
      debitRow?.voucher_type || creditRow?.voucher_type || "Receipt Voucher";

    // Determine debit ledger based on payment method
    let debitLedgerId;
    if (newPaymentMethod === "cash") {
      const cashLedgerData = await ledgerServices.getAssociatedLedgerId(
        "Cash in Hand"
      );
      debitLedgerId = cashLedgerData?.ledger_id;
      if (!debitLedgerId) {
        throw new ValidationError(
          "Ledger mapping for 'Cash in Hand' is missing."
        );
      }
    } else if (newPaymentMethod === "online") {
      if (bank_id) {
        debitLedgerId = bank_id;
      } else if (debitRow && parseFloat(debitRow.debit) > 0) {
        // Keep existing bank ledger if present
        debitLedgerId = debitRow.ledger_id;
      } else {
        throw new ValidationError("bank_id is required for online payments");
      }
    } else {
      throw new ValidationError("Invalid payment method");
    }

    const newAmount = amount !== undefined ? amount : cashInvoice.amount;
    const newBranchId = branch_id || cashInvoice.branch_id;
    const newFunctionalYearId = functional_year_id || cashInvoice.functional_year_id;
    const newRemarks = remarks !== undefined ? remarks : cashInvoice.remarks;

    // Update accounting entries
    if (debitRow) {
      await debitRow.update(
        {
          ledger_id: debitLedgerId,
          credit: 0.0,
          debit: newAmount,
          voucher_date_ad: bill_date,
          voucher_date_bs: newBillDateBs,
          voucher_number: voucherNumber,
          voucher_type: voucherType,
          functional_year_id: newFunctionalYearId,
          branch_id: newBranchId,
          narration: `Receipt from vehicle ID ${newVehicleId}`,
          updated_at: new Date(),
        },
        { transaction }
      );
    }

    if (creditRow) {
      await creditRow.update(
        {
          ledger_id: vehicle.ledgerId,
          credit: newAmount,
          debit: 0.0,
          voucher_date_ad: bill_date,
          voucher_date_bs: newBillDateBs,
          voucher_number: voucherNumber,
          voucher_type: voucherType,
          functional_year_id: newFunctionalYearId,
          branch_id: newBranchId,
          narration: `Receipt from vehicle ID ${newVehicleId}`,
          updated_at: new Date(),
        },
        { transaction }
      );
    }

    // Update main cash invoice
    await cashInvoice.update(
      {
        vehicle_id: newVehicleId,
        bill_date: bill_date || cashInvoice.bill_date,
        bill_date_bs: newBillDateBs,
        payment_method: newPaymentMethod,
        amount: newAmount,
        remarks: newRemarks,
        branch_id: newBranchId,
        functional_year_id: newFunctionalYearId,
        status: status !== undefined ? status : cashInvoice.status,
        updated_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();
    return cashInvoice;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteCashInvoice = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const cashInvoice = await CashInvoice.findByPk(id);
    if (!cashInvoice) {
      throw new NotFoundError("Cash invoice not found");
    }

    // Soft delete by setting status to 0
    await cashInvoice.update(
      {
        status: 0,
        updated_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();
    return { message: "Cash invoice deleted successfully" };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getCashInvoicesByVehicle = async (vehicleId, filters = {}) => {
  try {
    const { page = 1, limit = 10 } = filters;

    if (!vehicleId || isNaN(parseInt(vehicleId))) {
      throw new ValidationError("Valid vehicle ID is required");
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await CashInvoice.findAndCountAll({
      where: {
        vehicle_id: parseInt(vehicleId),
        status: 1,
      },
      include: [
        {
          model: Vehicle,
          as: "vehicle",
          attributes: ["id", "vehicleNo"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return {
      cashInvoices: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCashInvoice,
  getAllCashInvoices,
  getCashInvoiceById,
  updateCashInvoice,
  deleteCashInvoice,
  getCashInvoicesByVehicle,
};