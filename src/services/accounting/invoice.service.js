const { Op } = require("sequelize");
const moment = require("moment");
const {
  NotFoundError,
  ValidationError,
  DatabaseError,
} = require("../../utils/error");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const e = require("express");
const {
  Vehicle,
  BillingTitleInfo,
  BillingTitleMappingInfo,
} = require("../../../models/master");
const Invoice = require("../../../models/accounting/invoice.model");
const sequelize = require("../../config/database");
const accounting_transaction_detailModel = require("../../../models/accounting/accounting_transaction_detail.model");
const AccountingTransactionDetail = require("../../../models/accounting/accounting_transaction_detail.model");

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
        status: status || "pending",
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
          credit: amount,// - vat_amount,
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
          ledger_id: 1,
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
    if (status) whereClause.status = status;
    if (vehicle_id) whereClause.vehicle_id = vehicle_id;

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where: whereClause,
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
      order: [["invoice_date", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    return {
      invoices,
      count,
    };
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

    // Update fields
    const allowedFields = ["status", "payment_mode", "payment_date", "remarks"];
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        invoice[field] = updateData[field];
      }
    });

    // If status is paid and payment_date is not provided, set to current date
    if (updateData.status === "paid" && !invoice.payment_date) {
      invoice.payment_date = new Date();
    }

    await invoice.save({ transaction });
    await transaction.commit();

    // Return updated invoice with associations
    const updatedInvoice = await this.getInvoiceById(id);
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
        status: "paid",
      },
      include: [
        {
          model: Vehicle,
          attributes: ["id", "name", "subscription_type"],
        },
        {
          model: BillingTitleInfo,
          attributes: ["id", "billing_title", "rate"],
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
        // vehicle_id: data.vehicle_id,
        billing_title_id: data.billing_title_id,
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
};
