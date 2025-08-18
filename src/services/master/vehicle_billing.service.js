const { Vehicle, VehicleRenewal, VehicleTransaction, VehicleInvoice, VehicleInvoiceItem, BillingTitleInfo, BillingTitleMappingInfo } = require("../../../models/master");
const { Op } = require("sequelize");

// Get mapped billing titles for a branch
const getMappedBillingTitles = async (branch_id) => {
  return await BillingTitleMappingInfo.findAll({
    where: { status: 1, branch_id },
    include: [{ association: 'billing_title' }]
  });
};

// Generate invoice number
const generateInvoiceNo = async () => {
  const last = await VehicleInvoice.findOne({ order: [["id", "DESC"]] });
  const seq = last ? last.id + 1 : 1;
  return `INV-${seq.toString().padStart(6, '0')}`;
};

// Create renewal invoice based on subscription type
const createRenewalInvoice = async ({ vehicle_id, branch_id, functional_year_id, created_by, renewal_type, payment_method }) => {
  // renewal_type: 'monthly', 'yearly', or 'both'
  const vehicle = await Vehicle.findOne({ where: { id: vehicle_id, status: 1 } });
  if (!vehicle) throw new Error('Vehicle not found');

  const mappings = await getMappedBillingTitles(branch_id);
  if (!mappings || mappings.length === 0) throw new Error('No billing titles mapped for branch');

  // Find the appropriate billing title based on renewal type
  let billingTitle = null;
  for (const map of mappings) {
    const bt = map.billing_title;
    const title = bt.billing_title.toLowerCase();
    
    if (renewal_type === 'monthly' && title.includes('monthly')) {
      billingTitle = { ...bt, mapping: map };
      break;
    } else if (renewal_type === 'yearly' && title.includes('yearly')) {
      billingTitle = { ...bt, mapping: map };
      break;
    } else if (renewal_type === 'both' && title.includes('both')) {
      billingTitle = { ...bt, mapping: map };
      break;
    }
  }

  if (!billingTitle) {
    throw new Error(`No billing title found for renewal type: ${renewal_type}`);
  }

  // Create invoice
  const invoice_no = await generateInvoiceNo();
  const invoice = await VehicleInvoice.create({
    vehicle_id,
    renewal_id: null,
    invoice_no,
    branch_id,
    functional_year_id,
    total_amount: billingTitle.rate,
    created_by,
  });

  // Create invoice item
  await VehicleInvoiceItem.create({
    invoice_id: invoice.id,
    billing_title_id: billingTitle.billing_title_id,
    label_id: billingTitle.mapping.label_id,
    rate: billingTitle.rate,
    quantity: 1,
    amount: billingTitle.rate,
  });

  // Create renewal and transaction
  const { renewVehicle } = require('./vehicle.service');
  await renewVehicle(vehicle_id, renewal_type, billingTitle.rate, payment_method);

  return { invoice };
};

// Get invoice by ID
const getInvoice = async (id) => {
  return await VehicleInvoice.findOne({
    where: { id, status: 1 },
    include: [
      { 
        model: VehicleInvoiceItem, 
        required: false,
        include: [
          { model: BillingTitleInfo, as: 'billing_title' },
          { model: require("../../../models/master/label_info.model"), as: 'label' }
        ]
      },
      { model: Vehicle, required: false }
    ]
  });
};

// List invoices with pagination
const listInvoices = async ({ vehicle_id, page = 1, limit = 10 }) => {
  const where = { status: 1 };
  if (vehicle_id) where.vehicle_id = vehicle_id;
  const offset = (page - 1) * limit;
  
  const { rows, count } = await VehicleInvoice.findAndCountAll({ 
    where, 
    limit, 
    offset, 
    order: [["id","DESC"]],
    include: [
      { model: Vehicle, required: false },
      { model: VehicleInvoiceItem, required: false }
    ]
  });
  
  return { 
    total: count, 
    page: Number(page), 
    totalPages: Math.ceil(count / limit), 
    records: rows 
  };
};

// Get vehicles that need renewal (expired or expiring soon)
const getVehiclesNeedingRenewal = async (daysThreshold = 30) => {
  const vehicles = await Vehicle.findAll({
    where: { status: 1 },
    include: [
      {
        model: VehicleRenewal,
        where: { status: 1 },
        required: false,
        order: [['end_date', 'DESC']],
      }
    ]
  });

  const today = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(today.getDate() + daysThreshold);

  const vehiclesNeedingRenewal = vehicles.filter(vehicle => {
    const renewals = vehicle.VehicleRenewals || [];
    if (renewals.length === 0) return true; // No renewals at all

    // Check latest renewal for each type
    const latestMonthly = renewals.filter(r => r.renewal_type === 'monthly')
      .sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0];
    const latestYearly = renewals.filter(r => r.renewal_type === 'yearly')
      .sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0];

    // Check if any renewal is expired or expiring soon
    const monthlyExpired = !latestMonthly || new Date(latestMonthly.end_date) <= thresholdDate;
    const yearlyExpired = !latestYearly || new Date(latestYearly.end_date) <= thresholdDate;

    return monthlyExpired || yearlyExpired;
  });

  return vehiclesNeedingRenewal;
};

module.exports = {
  createRenewalInvoice,
  getInvoice,
  listInvoices,
  getVehiclesNeedingRenewal,
}; 