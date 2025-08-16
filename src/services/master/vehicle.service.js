// services/vehicle.service.js
const { Vehicle, Operator, Helper, Driver } = require("../../../models/master");

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
        createdBy: data.createdBy,
        status: 1,
        photo: d.driverPhoto?.[index]?.filename || null,
      }));

    if (driverData.length > 0) {
      await Driver.bulkCreate(driverData);
    }
  }

  return vehicle;
};

const getVehiclesPaginated = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const data = await Vehicle.findAndCountAll({
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
    distinct: true, // ensures count is correct when using include
  });

  return {
    total: data.count,
    page: parseInt(page),
    totalPages: Math.ceil(data.count / limit),
    records: data.rows,
  };
};

const getVehicleById = async (id) => {
  return await Vehicle.findByPk(id, {
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

  const vehicle = await Vehicle.findByPk(id);
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

  return vehicle;
};

const deleteVehicle = async (id) => {
  return await Vehicle.destroy({ where: { id } });
};

module.exports = {
  createVehicle,
  updateVehicle,
  getVehicleById,
  getVehiclesPaginated,
  deleteVehicle,
};
