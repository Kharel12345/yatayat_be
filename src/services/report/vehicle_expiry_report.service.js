const Invoice = require("../../../models/accounting/invoice.model");
const Vehicle = require("../../../models/master/vehicle.model");
const BillingTitleInfo = require("../../../models/master/billing_title.model");
const { Op } = require("sequelize");

const getVehicleExpiryReport = async (toDate) => {
  try {
    // If no toDate provided, use today's date
    const targetDate = toDate ? new Date(toDate) : new Date();

    // Set time to end of day for inclusive comparison
    targetDate.setHours(23, 59, 59, 999);

    const result = await Invoice.findAll({
      where: {
        status: { [Op.in]: ["pending", "paid", "overdue"] }, // Exclude cancelled invoices
        expiry_date: { [Op.lte]: targetDate }, // Vehicles expiring on or before the target date
      },
      include: [
        {
          model: Vehicle,
          as: "vehicleInfo",
          // attributes: ["vehicleNo", "ownerName", "address", "panNo", "membershipNo"],
        },
        {
          model: BillingTitleInfo,
          as: "billingInfo",
          // attributes: ["billing_title_name"],
        },
      ],
      order: [
        ["expiry_date", "ASC"], // Show most urgent expiries first
        ["vehicleInfo", "vehicleNo", "ASC"],
      ],
      raw: false,
    });

    // Transform the data to match the frontend requirements
    const transformedData = result.map((invoice) => {
      const vehicle = invoice.vehicleInfo;
      const billing = invoice.billingInfo;

      return {
        key: invoice.id,
        vehicleNo: vehicle?.vehicleNo || "N/A",
        ownerName: vehicle?.ownerName || "N/A",
        address: vehicle?.address || "N/A",
        panNo: vehicle?.panNo || "N/A",
        membershipNo: vehicle?.membershipNo || "N/A",
        contactNumber: "N/A", // This field doesn't exist in current schema
        expiryDate: invoice.expiry_date ? invoice.expiry_date.toISOString().split('T')[0] : "N/A",
        expiryDateBS: invoice.expire_date_bs || "N/A",
        lastRenewDate: invoice.invoice_date ? invoice.invoice_date.toISOString().split('T')[0] : "N/A",
        lastRenewDateBS: invoice.invoice_date_bs || "N/A",
        billingTitle: billing?.billing_title_name || "N/A",
        invoiceNumber: invoice.invoice_number || "N/A",
        status: invoice.status,
        rate: invoice.rate || 0,
        totalAmount: invoice.total_amount || 0,
      };
    });

    return transformedData;
  } catch (error) {
    console.error("Error fetching vehicle expiry report:", error);
    throw new Error("Failed to fetch vehicle expiry report");
  }
};

module.exports = {
  getVehicleExpiryReport,
};