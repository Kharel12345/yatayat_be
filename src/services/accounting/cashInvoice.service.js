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
    } = cashInvoiceData;

    const nepaliCalendar = new Nepali_Calendar();
    const bill_date = nepaliCalendar.BSToADConvert(bill_date_bs);

    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicle_id, {
      where: { status: 1 }
    });
    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }

    // Create cash invoice
    const cashInvoice = await CashInvoice.create(
      {
        vehicle_id,
        bill_date: bill_date || new Date(),
        bill_date_bs,
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
    if (search) {
      whereClause[Op.or] = [
        { remarks: { [Op.like]: `%${search}%` } },
      ];
    }

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

    const { count, rows } = await CashInvoice.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Vehicle,
          as: "vehicle",
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

const getCashInvoiceById = async (id) => {
  try {
    const cashInvoice = await CashInvoice.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: "vehicle",
          attributes: ["id", "vehicle_number", "vehicle_type"],
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
    } = updateData;

    const cashInvoice = await CashInvoice.findByPk(id);
    if (!cashInvoice) {
      throw new NotFoundError("Cash invoice not found");
    }

    // Check if vehicle exists (if vehicle_id is being updated)
    if (vehicle_id && vehicle_id !== cashInvoice.vehicle_id) {
      const vehicle = await Vehicle.findByPk(vehicle_id, {
        where: { status: 1 }
      });
      if (!vehicle) {
        throw new NotFoundError("Vehicle not found");
      }
    }

    // Convert BS date to AD if provided
    let bill_date = cashInvoice.bill_date;
    if (bill_date_bs) {
      const nepaliCalendar = new Nepali_Calendar();
      bill_date = nepaliCalendar.BSToADConvert(bill_date_bs);
    }

    // Update cash invoice
    await cashInvoice.update(
      {
        vehicle_id: vehicle_id || cashInvoice.vehicle_id,
        bill_date: bill_date || cashInvoice.bill_date,
        bill_date_bs: bill_date_bs || cashInvoice.bill_date_bs,
        payment_method: payment_method ? payment_method.toLowerCase() : cashInvoice.payment_method,
        amount: amount || cashInvoice.amount,
        remarks: remarks !== undefined ? remarks : cashInvoice.remarks,
        branch_id: branch_id || cashInvoice.branch_id,
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
          attributes: ["id", "vehicle_number", "vehicle_type"],
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