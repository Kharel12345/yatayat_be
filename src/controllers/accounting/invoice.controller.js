const { ORGANIZATION_NAME_PREFIX } = require('../../config/constant');
const {
  createInvoiceSchema,
  updateInvoiceSchema,
  getInvoicesSchema,
  getRenewalRemindersSchema,
  validateUpdatePaymentStatus
} = require('../../middlewares/validation/accounting/invoice.validation');
const { invoiceServices } = require('../../services/accounting');
const { IndexInfo, billingTitleMappingService } = require('../../services/master');
const { ValidationError } = require('../../utils/error');

const Nepali_Calendar = require('../../helpers/nepaliCalendar');


// Create a new invoice
const createInvoice = async (req, res, next) => {
  try {

// Validate request body
    const { error } = createInvoiceSchema.validate(req.body);

    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const invoice = await invoiceServices.createInvoice(req.body);

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Get all invoices
const getAllInvoices = async (req, res, next) => {
  try {
    // Validate query parameters
    const { error, value } = getInvoicesSchema.validate(req.query);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const { invoices, count } = await invoiceServices.getInvoices(req.query);

    return res.status(200).json({
      success: true,
      message: 'Invoices fetched successfully',
      data: invoices,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

// Get invoice by ID
const getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      throw new ValidationError('Valid invoice ID is required');
    }

    const invoice = await invoiceServices.getInvoiceById(id);

    res.json({
      success: true,
      message: 'Invoice fetched successfully',
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Update invoice
const updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      throw new ValidationError('Valid invoice ID is required');
    }

    // Validate request body
    const { error, value } = updateInvoiceSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const invoice = await invoiceServices.updateInvoice(parseInt(id), value);

    return res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Get invoices by vehicle ID
const getInvoicesByVehicle = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!vehicleId || isNaN(parseInt(vehicleId))) {
      throw new ValidationError('Valid vehicle ID is required');
    }

    const result = await invoiceServices.getInvoicesByVehicle(parseInt(vehicleId), { page, limit });

    res.json({
      success: true,
      message: 'Vehicle invoices fetched successfully',
      data: {
        vehicle: result.vehicle,
        invoices: result.invoices
      },
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

// Get renewal reminders
const getRenewalReminders = async (req, res, next) => {
  try {
    // Validate query parameters
    const { error, value } = getRenewalRemindersSchema.validate(req.query);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const invoices = await invoiceServices.getRenewalReminders(value.days);

    res.json({
      success: true,
      message: `Renewal reminders for next ${value.days} days`,
      data: {
        count: invoices.length,
        invoices
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await invoiceServices.getDashboardStats();

    res.json({
      success: true,
      message: 'Dashboard statistics fetched successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

const getReceiptNo = async (req, res, next) => {
  try {

    let result = await IndexInfo.getReceiptNo(req.query.economic_year_id);

    let max_id = result.max_id;
    let index_code = result.index_code;
    let receipt_no =
      ORGANIZATION_NAME_PREFIX +
      "-" +
      index_code +
      "-" +
      (parseInt(max_id) + 1);
    return res.status(200).json({
      success: true,
      message: 'Receipt number fetched successfully',
      data: receipt_no
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getVehicleExpiryDate = async (req, res, next) => {
  try {
    const lastExpiry = await invoiceServices.getVehicleExpiryDate(req.query);
    console.log('last expiry', lastExpiry);

    let dateOfExpiry = null;
    let calendar = new Nepali_Calendar();

    // Fetch billing title mapping
    const billingTitleMapped =
      await billingTitleMappingService.getBillingMappedByBillingTitle(
        req.query.billing_title_id
      );

    const billing_label =
      billingTitleMapped?.dataValues?.labelInfo?.dataValues?.label_name;

    // use dayjs to handle date logic
    let baseDate = lastExpiry?.expiry_date
      ? lastExpiry.expiry_date
      : calendar.ADToBsConvert(new Date(), "YYYY-MM-DD"); // if no last expiry → today

    if (billing_label === "yearly" || billing_label === "both") {
      dateOfExpiry = baseDate.add(1, "year").toDate();
    } else if (billing_label === "monthly") {
      dateOfExpiry = baseDate.add(1, "month").toDate();
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle expiry date fetched successfully",
      data: dateOfExpiry,
    });

  } catch (error) {
    console.error("Error fetching vehicle expiry date:", error);
    return res.status(400).json({
      success: false,
      message: "Error fetching vehicle expiry date",
      error: error.message,
    });
  }
};

const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = validateUpdatePaymentStatus.validate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const result = await invoiceServices.updatePaymentStatus(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  getInvoicesByVehicle,
  getRenewalReminders,
  getDashboardStats,
  getReceiptNo,
  getVehicleExpiryDate,
  updatePaymentStatus
};