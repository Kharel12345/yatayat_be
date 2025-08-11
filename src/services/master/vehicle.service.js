// services/vehicle.service.js
const { Vehicle, Operator, Helper, Driver } = require("../../../models/master");

const createVehicle = async (data) => {
  const { drivers, operator, helper, ...vehicleData } = data;

  const vehicle = await Vehicle.create(vehicleData);

  if (operator) await Operator.create({ ...operator, vehicleId: vehicle.id });
  if (helper) await Helper.create({ ...helper, vehicleId: vehicle.id });
  if (drivers?.length) {
    const driverData = drivers.map((d) => ({ ...d, vehicleId: vehicle.id }));
    await Driver.bulkCreate(driverData);
  }

  return vehicle;
};

const getVehiclesPaginated = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const data = await Vehicle.findAndCountAll({
    include: [
      { model: Operator, as: "operator" },
      { model: Helper, as: "helper" },
      { model: Driver, as: "drivers" },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
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
    include: ["operator", "helper", "drivers"],
  });
};

const updateVehicle = async (id, data) => {
  const { drivers, operator, helper, ...vehicleData } = data;
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) return null;

  await vehicle.update(vehicleData);

  if (operator) await Operator.update(operator, { where: { vehicleId: id } });
  if (helper) await Helper.update(helper, { where: { vehicleId: id } });
  if (drivers) {
    await Driver.destroy({ where: { vehicleId: id } });
    await Driver.bulkCreate(drivers.map((d) => ({ ...d, vehicleId: id })));
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
