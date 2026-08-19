const { Op } = require("sequelize");
const moment = require("moment");
const { NotFoundError, ValidationError } = require("../../utils/error");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const Receipt = require("../../../models/accounting/receipt.model");
const IndexInfo = require("../../../models/master/index_info.model");
const sequelize = require("../../config/database");

const createReceipt = async (receiptData) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      payer_name,
      payer_address,
      bill_date_bs,
      payment_method,
      amount,
      bill_title,
      vehicle_no,
      remarks,
      branch_id,
      functional_year_id,
      created_by,
    } = receiptData;

    console.log('receipt data');


    const nepaliCalendar = new Nepali_Calendar();
    const bill_date = nepaliCalendar.BSToADConvert(bill_date_bs);

    const receiptIndex = await IndexInfo.findOne({
      where: { functional_year_id, index_code: "cash_receipt_no" },
      attributes: ["max_id", "index_code"],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    const nextReceipt = (parseInt(receiptIndex?.max_id || 0) + 1);
    const receipt_no = `${String(nextReceipt).padStart(4, '0')}`;

    const receipt = await Receipt.create(
      {
        payer_name,
        payer_address,
        bill_date: bill_date || new Date(),
        bill_date_bs,
        receipt_no,
        payment_method: payment_method.toLowerCase(),
        amount,
        bill_title,
        vehicle_no,
        remarks,
        branch_id,
        functional_year_id,
        created_by,
        status: 1,
      },
      { transaction }
    );

    if (receiptIndex) {
      await IndexInfo.update(
        { max_id: sequelize.literal("max_id + 1") },
        { where: { functional_year_id, index_code: "cash_receipt_no" }, transaction }
      );
    }

    await transaction.commit();
    return receipt;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getAllReceipts = async (filters = {}) => {
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
    const whereClause = { status };

    if (payment_method) {
      whereClause.payment_method = payment_method;
    }

    if (branch_id) {
      whereClause.branch_id = branch_id;
    }

    if (functional_year_id) {
      whereClause.functional_year_id = functional_year_id;
    }

    if (search) {
      whereClause[Op.or] = [
        { payer_name: { [Op.like]: `%${search}%` } },
        { payer_address: { [Op.like]: `%${search}%` } },
        { receipt_no: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Receipt.findAndCountAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return {
      receipts: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw error;
  }
};

const getReceiptById = async (id) => {
  try {
    const receipt = await Receipt.findByPk(id);

    if (!receipt) {
      throw new NotFoundError("Receipt not found");
    }

    return receipt;
  } catch (error) {
    throw error;
  }
};

const updateReceipt = async (id, updateData) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      payer_name,
      payer_address,
      bill_date_bs,
      payment_method,
      amount,
      bill_title,
      vehicle_no,
      remarks,
      branch_id,
      status,
      functional_year_id,
    } = updateData;

    const receipt = await Receipt.findByPk(id);
    if (!receipt) {
      throw new NotFoundError("Receipt not found");
    }

    let bill_date = receipt.bill_date;
    if (bill_date_bs) {
      const nepaliCalendar = new Nepali_Calendar();
      bill_date = nepaliCalendar.BSToADConvert(bill_date_bs);
    }

    await receipt.update(
      {
        payer_name: payer_name !== undefined ? payer_name : receipt.payer_name,
        payer_address: payer_address !== undefined ? payer_address : receipt.payer_address,
        bill_date: bill_date,
        bill_date_bs: bill_date_bs || receipt.bill_date_bs,
        payment_method: payment_method ? payment_method.toLowerCase() : receipt.payment_method,
        amount: amount !== undefined ? amount : receipt.amount,
        bill_title: bill_title !== undefined ? bill_title : receipt.bill_title,
        vehicle_no: vehicle_no !== undefined ? vehicle_no : receipt.vehicle_no,
        remarks: remarks !== undefined ? remarks : receipt.remarks,
        branch_id: branch_id || receipt.branch_id,
        functional_year_id: functional_year_id || receipt.functional_year_id,
        status: status !== undefined ? status : receipt.status,
        updated_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();
    return receipt;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteReceipt = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const receipt = await Receipt.findByPk(id);
    if (!receipt) {
      throw new NotFoundError("Receipt not found");
    }

    await receipt.update(
      {
        status: 0,
        updated_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();
    return { message: "Receipt deleted successfully" };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
};
