const { ORGANIZATION_NAME_PREFIX } = require("../../config/constant");
const {
  createInvoiceSchema,
  updateInvoiceSchema,
  getInvoicesSchema,
  getRenewalRemindersSchema,
  validateUpdatePaymentStatus,
} = require("../../middlewares/validation/accounting/invoice.validation");
const {
  invoiceServices,
  ledgerServices,
} = require("../../services/accounting");
const {
  IndexInfo,
  billingTitleMappingService,
} = require("../../services/master");
const { ValidationError } = require("../../utils/error");

const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const { getTransactionId } = require("../../utils/index_info");
const { getCurrentDateTime } = require("../../helpers/date");
const moment = require("moment");

// Create a new invoice
const createInvoice = async (req, res, next) => {
  try {

    // Validate request body
    const { error } = createInvoiceSchema.validate(req.body);

    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    const functional_year_id = req.body.functional_year_id;

    const transaction_id = await getTransactionId(functional_year_id);
    if (transaction_id == null) {
      return res.status(500).json({ error: "Failed to fetch transaction ID" });
    }

    //get ledger_id for pharmacy_sales_payment_info
    let cashLedgerData = await ledgerServices.getAssociatedLedgerId(
      "Cash in Hand"
    );

    const cash_ledger_id = cashLedgerData.ledger_id;

    if (cash_ledger_id == null) {
      return res.status(409).json({
        status: false,
        message:
          "Ledger mapping not done of ledger group Cash in Hand. Please do ledger mapping first.",
      });
    }

    let renewMappingData = await ledgerServices.getAssociatedLedgerId("Sales Ledger");

    const sales_ledger_id = renewMappingData.ledger_id;
    if (sales_ledger_id == null) {
      return res.status(409).json({
        status: false,
        message:
          "Ledger mapping not done of ledger group Sales Ledger. Please do ledger mapping first.",
      });
    }
    const created_by = req.user.user_id;
    const body = {
      ...req.body,
      transaction_id,
      cash_ledger_id,
      sales_ledger_id,
      created_by,
    };
    const invoice = await invoiceServices.createInvoice(body);

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
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
      message: "Invoices fetched successfully",
      data: invoices,
      total: count,
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
      throw new ValidationError("Valid invoice ID is required");
    }

    const invoice = await invoiceServices.getInvoiceById(id);

    res.json({
      success: true,
      message: "Invoice fetched successfully",
      data: invoice,
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
      throw new ValidationError("Valid invoice ID is required");
    }

    // Validate request body
    const { error, value } = updateInvoiceSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const invoice = await invoiceServices.updateInvoice(parseInt(id), value);

    return res.json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice,
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
      throw new ValidationError("Valid vehicle ID is required");
    }

    const result = await invoiceServices.getInvoicesByVehicle(
      parseInt(vehicleId),
      { page, limit }
    );

    res.json({
      success: true,
      message: "Vehicle invoices fetched successfully",
      data: {
        vehicle: result.vehicle,
        invoices: result.invoices,
      },
      pagination: result.pagination,
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

    const invoices = await invoiceServices.getRenewalReminders(req.query.days);

    return res.json({
      success: true,
      message: `Renewal reminders for next ${value.days} days`,
      data: {
        count: invoices.length,
        invoices,
      },
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
      message: "Dashboard statistics fetched successfully",
      data: stats,
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
      message: "Receipt number fetched successfully",
      data: receipt_no,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getVehicleExpiryDate = async (req, res, next) => {
  try {

    const calendar = new Nepali_Calendar();

    const { billing_title_id, vehicle_id } = req.query;
    if (!billing_title_id || !vehicle_id) {
      return res.status(200).json({
        success: false,
        message: "billing_title_id and vehicle_id are required",
      });
    }

    const lastExpiry = await invoiceServices.getVehicleExpiryDate(req.query);
    console.log("lastExpiry", lastExpiry);

    // Fetch billing title mapping
    const billingTitleMapped =
      await billingTitleMappingService.getBillingMappedByBillingTitle(
        req.query.billing_title_id
      );

    const billing_label =
      billingTitleMapped?.dataValues?.labelInfo?.dataValues?.label_name;

    // No mapping found at all 
    if (!billingTitleMapped) {
      return res.status(200).json({
        success: false,
        message:
          "This billing title has not been mapped to a category (yearly/monthly). Please map it first under Billing Title Mapping.",
      });
    }

    if (
      billing_label !== "yearly" &&
      billing_label !== "monthly" &&
      billing_label !== "both"
    ) {
      return res.status(200).json({
        success: false,
        message: `This billing title is mapped with an unrecognized label ("${billing_label}"). Expected yearly, monthly, or both.`,
      });
    }
    let baseDate = lastExpiry?.expiry_date
      ? lastExpiry.expiry_date
      : getCurrentDateTime(); 

    let dateOfExpiry;
    if (billing_label === "yearly" || billing_label === "both") {
      dateOfExpiry = moment(baseDate).add(1, "year").toDate();
    } else {
      // monthly
      dateOfExpiry = moment(baseDate).add(1, "month").toDate();
    }

    const bsExpiry = calendar.ADToBsConvert(
      moment(dateOfExpiry).format("YYYY-MM-DD")
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle expiry date fetched successfully",
      data: bsExpiry,
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
      message: "Payment status updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    await invoiceServices.deleteInvoice(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Invoice deleted successfully"
    });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
}

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
  updatePaymentStatus,
  deleteInvoice
};
