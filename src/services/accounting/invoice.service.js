const { Op } = require("sequelize");
const {
  NotFoundError,
  ValidationError,
  DatabaseError,
} = require("../../utils/error");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const TRANSACTION_INDEX_CODE = process.env.TRANSACTION_INDEX_CODE;
const RECEIPT_NO = process.env.RECEIPT_INDEX_CODE;

const {
  Vehicle,
  BillingTitleInfo,
  BillingTitleMappingInfo,
  Operator,
  Driver,
  Helper,
} = require("../../../models/master");
const Invoice = require("../../../models/accounting/invoice.model");
const sequelize = require("../../config/database");
const accounting_transaction_detailModel = require("../../../models/accounting/accounting_transaction_detail.model");
const AccountingTransactionDetail = require("../../../models/accounting/accounting_transaction_detail.model");
const LedgerInfo = require("../../../models/accounting/ledger.model");
const IndexInfo = require("../../../models/master/index_info.model");

const createInvoice = async (invoiceData) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      vehicle_id,
      billing_title_id,
      payment_method,
      remarks,
      bill_date_bs,
      receipt_no,
      expiry_date_bs,
      amount,
      status,
      transaction_id,
      cash_ledger_id,
      sales_ledger_id,
      functional_year_id, //renew mapping title
      bank_id,
      branch_id,
      created_by,
    } = invoiceData;

    const nepaliCalendar = new Nepali_Calendar();
    const invoice_date = nepaliCalendar.BSToADConvert(bill_date_bs);
    const expire_date = nepaliCalendar.BSToADConvert(expiry_date_bs);

    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicle_id, { status: 1 });
    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }
    const vechile_ledger_id = vehicle.ledgerId;

    // Check if billing title exists
    const billingTitle = await BillingTitleInfo.findByPk(billing_title_id, {
      status: 1,
    });
    if (!billingTitle) {
      throw new NotFoundError("Billing title not found");
    }
    const narration = "test vechole";

    // Create invoice
    const invoice = await Invoice.create(
      {
        invoice_number: `INV-${Date.now()}`,
        vehicle_id,
        billing_title_id,
        rate: amount,
        expiry_date: expire_date,
        payment_mode: payment_method.toLowerCase(),
        remarks,
        invoice_date: invoice_date || new Date(),
        invoice_date_bs: bill_date_bs,
        expire_date_bs: expiry_date_bs,
        receipt_no,
        total_amount: amount,
        status: status,
      },
      { transaction }
    );

    const tableId = invoice.id;

    if (payment_method.toUpperCase() === "CASH") {
      // Cash in hand ledger (Debit)
      await accounting_transaction_detailModel.create(
        {
          comes_from: "SALES ENTRY",
          ledger_id: cash_ledger_id,
          credit: 0.0,
          debit: amount,
          table_id: tableId,
          transaction_id,
          voucher_date_ad: invoice_date,
          voucher_date_bs: bill_date_bs,
          voucher_number: receipt_no,
          voucher_type: "Renew Voucher",
          functional_year_id,
          branch_id,
          narration: `Cash Paid By ${narration}`,
          created_by,
        },
        { transaction }
      );

      // Sales ledger (Credit - without VAT)
      await accounting_transaction_detailModel.create(
        {
          comes_from: "SALES ENTRY",
          ledger_id: sales_ledger_id,
          credit: amount, //grand_total_amount - vat_amount
          debit: 0.0,
          table_id: tableId,
          transaction_id,
          voucher_date_ad: invoice_date,
          voucher_date_bs: bill_date_bs,
          voucher_number: receipt_no,
          voucher_type: "Renew Voucher",
          functional_year_id,
          branch_id,
          narration: `Cash Paid By ${narration}`,
          created_by,
        },
        { transaction }
      );

      // VAT payable ledger
      // if (vat_amount > 0) {
      //   await AccountingTransactionDetail.create(
      //     {
      //       comes_from: "SALES ENTRY",
      //       ledger_id: process.env.VAT_LEDGER_ID, // Ensure vat_payable_ledger_id is mapped properly
      //       credit: vat_amount,
      //       debit: 0.0,
      //       table_id: salesId,
      //       transaction_id,
      //       voucher_date_ad: invoice_date,
      //       voucher_date_bs: bill_date_bs,
      //       voucher_number: receipt_no,
      //       voucher_type: "Sales Voucher",
      //       functional_year_id,
      //       branch_id,
      //       narration: `Cash Paid By ${narration}`,
      //       created_by,
      //     },
      //     { transaction }
      //   );
      // }
    }

    /** ---------------------- CREDIT ---------------------- **/
    if (payment_method.toUpperCase() === "CREDIT") {
      // Sales ledger credit

      await AccountingTransactionDetail.create(
        {
          comes_from: "SALES ENTRY",
          ledger_id: sales_ledger_id,
          credit: amount, // - vat_amount,
          debit: 0.0,
          table_id: tableId,
          transaction_id,
          voucher_date_ad: invoice_date,
          voucher_date_bs: bill_date_bs,
          voucher_number: receipt_no,
          voucher_type: "Renew Voucher",
          functional_year_id,
          branch_id,
          narration: `Credit Sales ${narration}`,
          created_by,
        },
        { transaction }
      );

      // Party ledger debit
      await AccountingTransactionDetail.create(
        {
          comes_from: "SALES ENTRY",
          ledger_id: vechile_ledger_id,
          credit: 0.0,
          debit: amount,
          table_id: tableId,
          transaction_id,
          voucher_date_ad: invoice_date,
          voucher_date_bs: bill_date_bs,
          voucher_number: receipt_no,
          voucher_type: "Renew Voucher",
          functional_year_id,
          branch_id,
          narration: `Credit Sales ${narration}`,
          created_by,
        },
        { transaction }
      );

      // VAT payable
      // if (vat_amount > 0) {
      //   await AccountingTransactionDetail.create(
      //     {
      //       comes_from: "SALES ENTRY",
      //       ledger_id: process.env.VAT_LEDGER_ID,
      //       credit: vat_amount,
      //       debit: 0.0,
      //       table_id: salesId,
      //       transaction_id,
      //       voucher_date_ad: invoice_date_ad,
      //       voucher_date_bs: invoice_date_bs,
      //       voucher_number: receipt_no,
      //       voucher_type: "Sales Voucher",
      //       functional_year_id,
      //       branch_id,
      //       narration: `Credit Sales ${narration}`,
      //       created_by,
      //     },
      //     { transaction }
      //   );
      // }
    }

    /** ---------------------- DIRECT BANK TRANSFER ---------------------- **/
    if (payment_method.toUpperCase() === "DIRECT BANK TRANSFER") {
      // Sales ledger credit
      await AccountingTransactionDetail.create(
        {
          comes_from: "SALES ENTRY",
          ledger_id: sales_ledger_id,
          credit: amount, //rand_total_amount - vat_amount
          debit: 0.0,
          table_id: tableId,
          transaction_id,
          voucher_date_ad: invoice_date,
          voucher_date_bs: bill_date_bs,
          voucher_number: receipt_no,
          voucher_type: "Renew Voucher",
          functional_year_id,
          branch_id,
          narration: `Direct Bank Transfer Invoice ${narration}`,
          created_by,
        },
        { transaction }
      );

      // Bank ledger debit
      await AccountingTransactionDetail.create(
        {
          comes_from: "SALES ENTRY",
          ledger_id: bank_id,
          credit: 0.0,
          debit: amount,
          table_id: tableId,
          transaction_id,
          voucher_date_ad: invoice_date,
          voucher_date_bs: bill_date_bs,
          voucher_number: receipt_no,
          voucher_type: "Renew Voucher",
          functional_year_id,
          branch_id,
          narration: `Direct Bank Transfer Sales ${narration}`,
          created_by,
        },
        { transaction }
      );

      // VAT payable ledger
      // if (vat_amount > 0) {
      //   await AccountingTransactionDetail.create(
      //     {
      //       comes_from: "SALES ENTRY",
      //       ledger_id: process.env.VAT_LEDGER_ID,
      //       credit: vat_amount,
      //       debit: 0.0,
      //       table_id: salesId,
      //       transaction_id,
      //       voucher_date_ad: invoice_date_ad,
      //       voucher_date_bs: invoice_date_bs,
      //       voucher_number: receipt_no,
      //       voucher_type: "Sales Voucher",
      //       functional_year_id,
      //       branch_id,
      //       narration: `Direct Bank Transfer Sales ${narration}`,
      //       created_by,
      //     },
      //     { transaction }
      //   );
      // }
    }
    await IndexInfo.update(
      { max_id: transaction_id },
      {
        where: {
          index_code: "transaction_id",
          functional_year_id: functional_year_id,
        },
      }
    );

    await IndexInfo.update(
      { max_id: sequelize.literal("max_id + 1") },
      {
        where: {
          index_code: "receipt_no",
          functional_year_id: functional_year_id,
        },
      }
    );

    await transaction.commit();
    return invoice;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Get all invoices with pagination and filtering
const getInvoices = async (filters = {}) => {
  try {
    const { page = 1, limit = 10, status, vehicle_id } = filters;
    const offset = (page - 1) * limit;

    let whereClause = {};

    if (status !== undefined) {
      whereClause.status = Number(status); // ensure numeric
    }

    if (vehicle_id !== undefined) {
      whereClause.vehicle_id = Number(vehicle_id); // ensure numeric
    }

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where: whereClause,
      include: [
        { model: Vehicle, as: "vehicleInfo" },
        { model: BillingTitleInfo, as: "billingInfo" },
        {
          model: LedgerInfo,
          as: "bankInfo",
          attributes: ["id", "ledgername"],
          required: false, // LEFT JOIN
        },
      ],
      order: [["invoice_date", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    return { invoices, count };
  } catch (error) {
    throw new DatabaseError("Error fetching invoices", error);
  }
};

const getInvoiceById = async (id) => {
  try {
    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: "vehicleInfo",
          include: [
            {
              model: Operator,
              as: "operator",
            },
            {
              model: Helper,
              as: "helper",
            },
            {
              model: Driver,
              as: "drivers",
            },
          ],
        },
        {
          model: BillingTitleInfo,
          as: "billingInfo",
        },
      ],
    });

    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }

    return invoice;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new DatabaseError("Error fetching invoice", error);
  }
};

// Update invoice
const updateInvoice = async (id, updateData) => {
  const transaction = await sequelize.transaction();

  try {
    const invoice = await Invoice.findByPk(id, { transaction });

    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }

    // Extract updatable fields
    const {
      vehicle_id,
      billing_title_id,
      amount,
      bill_date_bs,
      expiry_date_bs,
      payment_method,
      bank_id,
      receipt_no,
      functional_year_id,
      branch_id,
      status,
      payment_mode,
      payment_date,
      remarks,
    } = updateData;

    // Validate related entities if changed
    let vehicle = null;
    const newVehicleId = vehicle_id || invoice.vehicle_id;
    if (vehicle_id && vehicle_id !== invoice.vehicle_id) {
      vehicle = await Vehicle.findByPk(vehicle_id);
      if (!vehicle) throw new NotFoundError("Vehicle not found");
    } else {
      vehicle = await Vehicle.findByPk(newVehicleId);
      if (!vehicle) throw new NotFoundError("Vehicle not found");
    }

    if (billing_title_id && billing_title_id !== invoice.billing_title_id) {
      const billing = await BillingTitleInfo.findByPk(billing_title_id);
      if (!billing) throw new NotFoundError("Billing title not found");
    }

    // Convert BS dates if provided
    let newInvoiceDate = invoice.invoice_date;
    let newInvoiceDateBs = invoice.invoice_date_bs;
    let newExpiryDate = invoice.expiry_date;
    let newExpiryDateBs = invoice.expire_date_bs;
    const np = new Nepali_Calendar();
    if (bill_date_bs) {
      newInvoiceDateBs = bill_date_bs;
      newInvoiceDate = np.BSToADConvert(bill_date_bs);
    }
    if (expiry_date_bs) {
      newExpiryDateBs = expiry_date_bs;
      newExpiryDate = np.BSToADConvert(expiry_date_bs);
    }

    // Determine payment method/mode changes
    const newPaymentMethod = (payment_method || invoice.payment_mode || payment_mode || "").toString().toLowerCase();
    const effectivePaymentMode = newPaymentMethod || invoice.payment_mode;

    // Update accounting entries for this invoice (comes_from = 'SALES ENTRY')
    const entries = await AccountingTransactionDetail.findAll({
      where: { comes_from: "SALES ENTRY", table_id: id },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!entries || entries.length < 2) {
      // In some cases, invoices could be created without entries; we won't hard fail update
      // but will proceed updating invoice only.
    } else {
      // Identify debit and credit rows
      const debitRow = entries.find((e) => parseFloat(e.debit) > 0);
      const creditRow = entries.find((e) => parseFloat(e.credit) > 0);

      const voucherNumber = receipt_no || debitRow?.voucher_number || creditRow?.voucher_number || invoice.receipt_no;
      const voucherType = debitRow?.voucher_type || creditRow?.voucher_type || "Renew Voucher";

      // Recompute ledgers based on payment mode
      let debitLedgerId = debitRow?.ledger_id;
      let creditLedgerId = creditRow?.ledger_id;

      // Resolve sales ledger mapping
      const salesMap = await LedgerInfo.findOne({ where: { status: 1, ledgername: { [Op.like]: "%Sales%" } } });
      const salesLedgerId = salesMap?.id;

      const amountVal = amount !== undefined ? amount : Number(invoice.total_amount);
      const functionalYearId = functional_year_id || debitRow?.functional_year_id || invoice.functional_year_id;
      const branchId = branch_id || debitRow?.branch_id || invoice.branch_id;

      if (effectivePaymentMode === "cash") {
        // Debit: Cash in Hand, Credit: Sales
        const { ledgerServices } = require("./index");
        const cashLedgerData = await ledgerServices.getAssociatedLedgerId("Cash in Hand");
        if (!cashLedgerData?.ledger_id) throw new ValidationError("Ledger mapping for 'Cash in Hand' is missing.");
        debitLedgerId = cashLedgerData.ledger_id;
        creditLedgerId = salesLedgerId || creditLedgerId;
      } else if (effectivePaymentMode === "credit") {
        // Debit: Party (vehicle ledger), Credit: Sales
        debitLedgerId = vehicle.ledgerId;
        creditLedgerId = salesLedgerId || creditLedgerId;
      } else if (effectivePaymentMode === "bank_transfer" || effectivePaymentMode === "online" || effectivePaymentMode === "direct bank transfer") {
        // Debit: Bank, Credit: Sales
        if (!bank_id && !(debitRow && parseFloat(debitRow.debit) > 0)) {
          throw new ValidationError("bank_id is required for bank/online payments");
        }
        debitLedgerId = bank_id || debitRow.ledger_id;
        creditLedgerId = salesLedgerId || creditLedgerId;
      }

      // Update entries
      if (debitRow) {
        await debitRow.update(
          {
            ledger_id: debitLedgerId,
            debit: amountVal,
            credit: 0.0,
            voucher_date_ad: newInvoiceDate,
            voucher_date_bs: newInvoiceDateBs,
            voucher_number: voucherNumber,
            voucher_type: voucherType,
            functional_year_id: functionalYearId,
            branch_id: branchId,
            narration: `Renew invoice for vehicle ${newVehicleId}`,
            updated_at: new Date(),
          },
          { transaction }
        );
      }

      if (creditRow) {
        await creditRow.update(
          {
            ledger_id: creditLedgerId,
            credit: amountVal,
            debit: 0.0,
            voucher_date_ad: newInvoiceDate,
            voucher_date_bs: newInvoiceDateBs,
            voucher_number: voucherNumber,
            voucher_type: voucherType,
            functional_year_id: functionalYearId,
            branch_id: branchId,
            narration: `Renew invoice for vehicle ${newVehicleId}`,
            updated_at: new Date(),
          },
          { transaction }
        );
      }
    }

    // Update main invoice
    await invoice.update(
      {
        vehicle_id: newVehicleId,
        billing_title_id: billing_title_id || invoice.billing_title_id,
        rate: amount !== undefined ? amount : invoice.rate,
        total_amount: amount !== undefined ? amount : invoice.total_amount,
        invoice_date: newInvoiceDate,
        invoice_date_bs: newInvoiceDateBs,
        expiry_date: newExpiryDate,
        expire_date_bs: newExpiryDateBs,
        payment_mode: effectivePaymentMode,
        bank_id: bank_id !== undefined ? bank_id : invoice.bank_id,
        receipt_no: receipt_no || invoice.receipt_no,
        status: status !== undefined ? status : invoice.status,
        payment_date: payment_date !== undefined ? payment_date : invoice.payment_date,
        remarks: remarks !== undefined ? remarks : invoice.remarks,
        updated_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    // Return updated invoice with associations
    const updatedInvoice = await module.exports.getInvoiceById(id);
    return updatedInvoice;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof NotFoundError) throw error;
    throw new DatabaseError("Error updating invoice", error);
  }
};

const getInvoicesByVehicle = async (vehicleId, filters = {}) => {
  try {
    const { page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where: { vehicle_id: vehicleId },
      include: [
        {
          model: BillingTitleInfo,
          attributes: ["id", "billing_title", "rate"],
        },
      ],
      order: [["invoice_date", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    return {
      vehicle,
      invoices,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        page: parseInt(page),
        limit: parseInt(limit),
      },
    };
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new DatabaseError("Error fetching vehicle invoices", error);
  }
};

// Get renewal reminders
const getRenewalReminders = async (days = 7) => {
  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + parseInt(days));

    const invoices = await Invoice.findAll({
      where: {
        expiry_date: {
          [Op.lte]: targetDate,
        },
        status: 1,
      },
      include: [
        {
          model: Vehicle,
          as: "vehicleInfo",
        },
        {
          model: BillingTitleInfo,
          as: "billingInfo",
        },
      ],
      order: [["expiry_date", "ASC"]],
    });

    return invoices;
  } catch (error) {
    throw new DatabaseError("Error fetching renewal reminders", error);
  }
};

// Get dashboard statistics
const getDashboardStats = async () => {
  try {
    const totalInvoices = await Invoice.count();
    const pendingInvoices = await Invoice.count({
      where: { status: "pending" },
    });
    const paidInvoices = await Invoice.count({ where: { status: "paid" } });
    const overdueInvoices = await Invoice.count({
      where: { status: "overdue" },
    });

    const totalRevenue = await Invoice.sum("rate", {
      where: { status: "paid" },
    });
    const monthlyRevenue = await Invoice.sum("rate", {
      where: {
        status: "paid",
        payment_date: {
          [Op.gte]: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ),
        },
      },
    });

    return {
      totalInvoices,
      pendingInvoices,
      paidInvoices,
      overdueInvoices,
      totalRevenue: totalRevenue || 0,
      monthlyRevenue: monthlyRevenue || 0,
    };
  } catch (error) {
    throw new DatabaseError("Error fetching dashboard statistics", error);
  }
};

const getVehicleExpiryDate = async (data) => {
  try {
    const result = await Invoice.findOne({
      where: {
        vehicle_id: data.vehicle_id,
        status: 1,
      },
      order: [["created_at", "DESC"]],
    });
    return result?.dataValues || null;
  } catch (error) {
    throw new DatabaseError("Error fetching vehicle expiry date", error);
  }
};

const updatePaymentStatus = async (id, status) => {
  try {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }
    invoice.status = status.status;
    await invoice.save();
    return invoice;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new DatabaseError("Error updating payment status", error);
  }
};

const deleteInvoice = async (id) => {
  try {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }
    invoice.status = 0;
    await invoice.save();
    return invoice;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new DatabaseError("Error deleting invoice", error);
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  getInvoicesByVehicle,
  getRenewalReminders,
  getDashboardStats,
  getVehicleExpiryDate,
  updatePaymentStatus,
  deleteInvoice,
};
