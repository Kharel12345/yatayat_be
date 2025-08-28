const {
  Invoice,
  Vehicle,
  BillingTitle,
  BillingMapping,
  sequelize,
} = require("../../../models");
const { Sequelize, Op } = require("sequelize");
const moment = require("moment");
const {
  NotFoundError,
  ValidationError,
  DatabaseError,
} = require("../../utils/error");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const e = require("express");

const createInvoice = async (invoiceData) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      vehicle_id,
      billing_title_id,
      payment_mode,
      remarks,
      invoice_date_bs,
      receipt_no,
      expire_date_bs,
    } = invoiceData;
    const nepaliCalendar = new Nepali_Calendar();
    const invoice_date = nepaliCalendar.bsToAd(invoice_date_bs);
    const expire_date = nepaliCalendar.bsToAd(expire_date_bs);

    // Get vehicle and billing title details
    const vehicle = await Vehicle.findByPk(vehicle_id, { transaction });
    const billingTitle = await BillingTitle.findByPk(billing_title_id, {
      transaction,
    });

    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }

    if (!billingTitle) {
      throw new NotFoundError("Billing title not found");
    }

    if (billingTitle.status !== "active") {
      throw new ValidationError("Billing title is not active");
    }

    // Check if billing title matches vehicle subscription type
    const billingMappings = await BillingMapping.findAll({
      where: { billing_title_id },
      transaction,
    });

    const mappingTypes = billingMappings.map((m) => m.mapping_type);

    if (
      !mappingTypes.includes(vehicle.subscription_type) &&
      vehicle.subscription_type !== "both"
    ) {
      throw new ValidationError(
        `Billing title not compatible with vehicle's subscription type`
      );
    }

    // Calculate expiry date based on billing type
    let expiryDate = moment(invoice_date || new Date());
    if (mappingTypes.includes("yearly")) {
      expiryDate = expiryDate.add(1, "year");
    } else {
      expiryDate = expiryDate.add(1, "month");
    }

    // Create invoice
    const invoice = await Invoice.create(
      {
        vehicle_id,
        billing_title_id,
        rate: billingTitle.rate,
        expiry_date: expiryDate.toDate(),
        payment_mode,
        remarks,
        invoice_date: invoice_date || new Date(),
        invoice_date_bs,
        expire_date_bs,
        receipt_no,
      },
      { transaction }
    );

    await transaction.commit();

    // Get full invoice details with associations
    const fullInvoice = await this.getInvoiceById(invoice.id);
    return fullInvoice;
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
          attributes: ["id", "name", "subscription_type"],
        },
        {
          model: BillingTitle,
          attributes: ["id", "billing_title", "rate"],
        },
      ],
      order: [["invoice_date", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    return {
      invoices,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        page: parseInt(page),
        limit: parseInt(limit),
      },
    };
  } catch (error) {
    throw new DatabaseError("Error fetching invoices", error);
  }
};

// Get invoice by ID
const getInvoiceById = async (id) => {
  try {
    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: Vehicle,
          attributes: ["id", "name", "subscription_type"],
        },
        {
          model: BillingTitle,
          attributes: ["id", "billing_title", "rate"],
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
          model: BillingTitle,
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
          model: BillingTitle,
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

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  getInvoicesByVehicle,
  getRenewalReminders,
  getDashboardStats,
};
