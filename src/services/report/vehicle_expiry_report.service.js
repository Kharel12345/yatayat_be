const Invoice = require("../../../models/accounting/invoice.model");
const Vehicle = require("../../../models/master/vehicle.model");
const BillingTitleInfo = require("../../../models/master/billing_title.model");
const { Op } = require("sequelize");

const getVehicleExpiryReport = async (toDate) => {
  try {

    // Convert YYYY-MM-DD string → Date object
    const dateObj = new Date(`${toDate}T23:59:59`); // include the whole day

    const result = await Invoice.findAll({
      where: {
        status: 1,
        expiry_date: {
          [Op.lte]: dateObj, // all expiry_date <= toDate end of day
        },
      },
      include: [
        { model: Vehicle, as: "vehicleInfo" },
        { model: BillingTitleInfo, as: "billingInfo" },
      ],
      order: [["expiry_date", "ASC"]],
      group: ["vehicle_id"],
    });

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
        expiryDate: invoice.expiry_date
          ? invoice.expiry_date.toISOString().split("T")[0]
          : "N/A",
        expiryDateBS: invoice.expire_date_bs || "N/A",
        lastRenewDate: invoice.invoice_date
          ? invoice.invoice_date.toISOString().split("T")[0]
          : "N/A",
        lastRenewDateBS: invoice.invoice_date_bs || "N/A",
        billingTitle: billing?.billing_title || "N/A",
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