// services/vehicle.service.js
const { Vehicle, Operator, Helper, Driver } = require("../../../models/master");
const LedgerInfo = require("../../../models/accounting/ledger.model");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const { Op } = require("sequelize");

const createOrUpdateLedgerForVehicle = async (vehicle, meta) => {
  const {
    functional_year_id,
    branch_id,
    master_ledger_group_id,
    ledger_sub_group_id,
    address,
    contact,
    createdBy,
  } = meta || {};

  if (!functional_year_id || !branch_id || !master_ledger_group_id) {
    return null; // insufficient meta to create ledger
  }

  const ledgername = vehicle.vehicleNo || vehicle.registration_no;
  const opening_balance_date = new Date();

  const existing = await LedgerInfo.findOne({ where: { ledgername } });
  if (existing) {
    await existing.update({
      ledger_type: "Transportation",
      master_ledger_group_id,
      ledger_sub_group_id: ledger_sub_group_id || null,
      address: address || null,
      contact: contact || null,
      functional_year_id,
      branch_id,
      status: 1,
    });
    return existing;
  }

  return await LedgerInfo.create({
    ledgername,
    ledger_type: "Transportation",
    master_ledger_group_id,
    ledger_sub_group_id: ledger_sub_group_id || null,
    address: address || null,
    contact: contact || null,
    opening_balance: 0,
    opening_balance_date,
    functional_year_id,
    branch_id,
    status: 1,
    created_by: createdBy || null,
  });
};

const createVehicle = async (data) => {
  const { drivers, operator, helper, ...vehicleData } = data;

  const vehicle = await Vehicle.create(vehicleData);

  // Save operator only if it has at least one non-empty string field
  if (
    operator &&
    Object.values(operator).some(
      (v) => v != null && typeof v === "string" && v.trim() !== ""
    )
  ) {
    await Operator.create({ ...operator, vehicleId: vehicle.id });
  }

  // Save helper only if it has at least one non-empty string field
  if (
    helper &&
    Object.values(helper).some(
      (v) => v != null && typeof v === "string" && v.trim() !== ""
    )
  ) {
    await Helper.create({ ...helper, vehicleId: vehicle.id });
  }

  // Save drivers only if there is at least one driver with real data
  if (Array.isArray(drivers)) {
    const driverData = drivers
      .filter((d) =>
        Object.values(d).some(
          (v) => v != null && typeof v === "string" && v.trim() !== ""
        )
      )
      .map((d, index) => ({
        ...d,
        vehicleId: vehicle.id,
        status: 1,
        createdBy: d.createdBy,
        photo: d.photo || null,
      }));

    if (driverData.length > 0) {
      await Driver.bulkCreate(driverData);
    }
  }

  // Create ledger entry (if sufficient meta provided in payload)
  await createOrUpdateLedgerForVehicle(vehicle, vehicleData);

  return vehicle;
};

const getVehiclesPaginated = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = { status: 1 };

  // Organization filter (partial match)
  if (filters.organization) {
    where.organization = { [Op.like]: `%${filters.organization}%` };
  }

  // Vehicle number filter (supports both vehicleNo and registration_no)
  if (filters.vehicle_no) {
    const vehicleLike = { [Op.like]: `%${filters.vehicle_no}%` };
    where[Op.or] = [
      { vehicleNo: vehicleLike },
      { registration_no: vehicleLike },
    ];
  }

  // Date filters (BS -> AD). Using registrationDate if available; otherwise created_at
  const calendar = new Nepali_Calendar();
  const hasRegistrationDate = !!Vehicle.rawAttributes?.registrationDate;
  const dateField = hasRegistrationDate ? 'registrationDate' : 'created_at';

  if (filters.date_bs) {
    const ad = calendar.BSToADConvert(filters.date_bs);
    const start = new Date(ad);
    const end = new Date(ad);
    end.setHours(23, 59, 59, 999);
    where[dateField] = { [Op.between]: [start, end] };
  } else if (filters.from_date_bs || filters.to_date_bs) {
    const startAd = filters.from_date_bs ? new Date(calendar.BSToADConvert(filters.from_date_bs)) : null;
    const endAd = filters.to_date_bs ? new Date(calendar.BSToADConvert(filters.to_date_bs)) : null;
    if (startAd && endAd) {
      endAd.setHours(23, 59, 59, 999);
      where[dateField] = { [Op.between]: [startAd, endAd] };
    } else if (startAd) {
      where[dateField] = { [Op.gte]: startAd };
    } else if (endAd) {
      endAd.setHours(23, 59, 59, 999);
      where[dateField] = { [Op.lte]: endAd };
    }
  }

  const data = await Vehicle.findAndCountAll({
    where,
    include: [
      {
        model: Operator,
        as: "operator",
        where: { status: 1 },
        required: false,
      },
      { model: Helper, as: "helper", where: { status: 1 }, required: false },
      { model: Driver, as: "drivers", where: { status: 1 }, required: false },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true,
    order: [[dateField, 'DESC']],
  });

  return {
    total: data.count,
    page: parseInt(page),
    totalPages: Math.ceil(data.count / limit),
    records: data.rows,
  };
};

const getVehicleById = async (id) => {
  return await Vehicle.findOne({
    where: { id, status: 1 },
    include: [
      {
        model: Operator,
        as: "operator",
        where: { status: 1 },
        required: false,
      },
      { model: Helper, as: "helper", where: { status: 1 }, required: false },
      { model: Driver, as: "drivers", where: { status: 1 }, required: false },
    ],
  });
};

const updateVehicle = async (id, data) => {
  const { drivers, operator, helper, ...vehicleData } = data;

  const vehicle = await Vehicle.findOne({ where: { id, status: 1 } });
  if (!vehicle) return null;

  // update main vehicle fields
  await vehicle.update(vehicleData);

  // --- Operator ---
  if (operator && Object.values(operator).some((v) => v && v.trim() !== "")) {
    const existingOperator = await Operator.findOne({
      where: { vehicleId: id },
    });
    if (existingOperator) {
      await existingOperator.update({ ...operator, status: 1 });
    } else {
      await Operator.create({ ...operator, vehicleId: id, status: 1 });
    }
  } else {
    await Operator.update({ status: 0 }, { where: { vehicleId: id } });
  }

  // --- Helper ---
  if (helper && Object.values(helper).some((v) => v && v.trim() !== "")) {
    const existingHelper = await Helper.findOne({ where: { vehicleId: id } });
    if (existingHelper) {
      await existingHelper.update({ ...helper, status: 1 });
    } else {
      await Helper.create({ ...helper, vehicleId: id, status: 1 });
    }
  } else {
    await Helper.update({ status: 0 }, { where: { vehicleId: id } });
  }

  // --- Drivers ---
  if (Array.isArray(drivers)) {
    const validDrivers = drivers
      .filter((d) => Object.values(d).some((v) => v && v.trim() !== ""))
      .map((d) => ({ ...d, vehicleId: id, status: 1 }));

    if (validDrivers.length > 0) {
      // mark all old drivers inactive
      await Driver.update({ status: 0 }, { where: { vehicleId: id } });

      // insert new active drivers
      await Driver.bulkCreate(validDrivers);
    } else {
      // no valid drivers in request → mark all old drivers inactive
      await Driver.update({ status: 0 }, { where: { vehicleId: id } });
    }
  }

  // Upsert ledger entry (if sufficient meta provided in payload)
  await createOrUpdateLedgerForVehicle(vehicle, vehicleData);

  return vehicle;
};

const deleteVehicle = async (id) => {
  // Soft delete: set status to 0
  await Vehicle.update({ status: 0 }, { where: { id } });
  return true;
};

module.exports = {
  createVehicle,
  updateVehicle,
  getVehicleById,
  getVehiclesPaginated,
  deleteVehicle,
};
