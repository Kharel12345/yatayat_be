// services/vehicle.service.js
const { Vehicle, Operator, Helper, Driver } = require("../../../models/master");
const LedgerInfo = require("../../../models/accounting/ledger.model");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const { Op } = require("sequelize");
const { ledgerServices } = require("../accounting");
const { sequelize } = require("../../../models");

const createOrUpdateLedgerForVehicle = async (vehicle, meta, transaction) => {
  const {
    functionalYear,
    branchId,
    ledger_sub_group_id,
    address,
    contact,
    createdBy,
  } = meta || {};
  const functional_year_id = functionalYear;
  const branch_id = branchId;
  const masterLedgerId = await ledgerServices.getLedgerForVechileRegistration();
  if (!masterLedgerId || !masterLedgerId.dataValues) {
    throw new Error("Master ledger for vehicle registration not found");
  }

  const master_ledger_group_id = masterLedgerId.dataValues.id;

  if (!functional_year_id || !branch_id || !master_ledger_group_id) {
    throw new Error("Missing required fields for creating ledger");
  }

  const ledgername = vehicle.vehicleNo;
  const opening_balance_date = new Date();

  const existing = await LedgerInfo.findOne({
    where: { ledgername },
    transaction,
  });

  if (existing) {
    await existing.update(
      {
        ledger_type: "Transportation",
        master_ledger_group_id,
        ledger_sub_group_id: ledger_sub_group_id || null,
        address: address || null,
        contact: contact || null,
        functional_year_id,
        branch_id,
        status: 1,
      },
      { transaction }
    );
    return existing;
  }

  return await LedgerInfo.create(
    {
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
    },
    { transaction }
  );
};

const createVehicle = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const { drivers, operator, helper, ...vehicleData } = data;

    // Step 1: Create a temporary vehicle object just to pass vehicleNo to ledger
    const tempVehicle = { vehicleNo: vehicleData.vehicleNo };

    // Step 2: Create Ledger first
    const ledger = await createOrUpdateLedgerForVehicle(
      tempVehicle,
      vehicleData,
      transaction
    );

    // Step 3: Create vehicle and associate ledgerId
    const vehicle = await Vehicle.create(
      {
        ...vehicleData,
        ledgerId: ledger.id,
      },
      { transaction }
    );

    // Step 4: Save operator if provided
    if (
      operator &&
      Object.values(operator).some(
        (v) => v != null && typeof v === "string" && v.trim() !== ""
      )
    ) {
      await Operator.create(
        { ...operator, vehicleId: vehicle.id },
        { transaction }
      );
    }

    // Step 5: Save helper if provided
    if (
      helper &&
      Object.values(helper).some(
        (v) => v != null && typeof v === "string" && v.trim() !== ""
      )
    ) {
      await Helper.create(
        { ...helper, vehicleId: vehicle.id },
        { transaction }
      );
    }

    // Step 6: Save drivers if provided
    if (Array.isArray(drivers)) {
      const driverData = drivers
        .filter((d) =>
          Object.values(d).some(
            (v) => v != null && typeof v === "string" && v.trim() !== ""
          )
        )
        .map((d) => ({
          ...d,
          vehicleId: vehicle.id,
          status: 1,
          createdBy: d.createdBy,
          photo: d.photo || null,
        }));

      if (driverData.length > 0) {
        await Driver.bulkCreate(driverData, { transaction });
      }
    }

    // Step 7: Commit transaction if everything succeeded
    await transaction.commit();

    return vehicle;
  } catch (error) {
    // Rollback if any error happens
    await transaction.rollback();
    console.error("Error creating vehicle and ledger:", error);
    throw error;
  }
};

const getVehiclesPaginated = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = { status: 1 };

  // Organization filter
  if (filters.organization) {
    where.organization = { [Op.like]: `%${filters.organization}%` };
  }

  // Vehicle number filter
  if (filters.vehicleNo) {
    const vehicleLike = { [Op.like]: `%${filters.vehicleNo}%` };
    where[Op.or] = [
      { vehicleNo: vehicleLike }
    ];
  }

  // Branch filter (correct field name)
  if (filters.branch) {
    where.branchId = filters.branch;
  }

  // Date Filters BS -> AD conversion
  const calendar = new Nepali_Calendar();
  const dateField = "registrationDate";

  if (filters.fromDate || filters.toDate) {
    const startAd = filters.fromDate
      ? new Date(calendar.BSToADConvert(filters.fromDate))
      : null;

    const endAd = filters.toDate
      ? new Date(calendar.BSToADConvert(filters.toDate))
      : null;

    if (endAd) endAd.setHours(23, 59, 59, 999);

    if (startAd && endAd) {
      where[dateField] = { [Op.between]: [startAd, endAd] };
    } else if (startAd) {
      where[dateField] = { [Op.gte]: startAd };
    } else if (endAd) {
      where[dateField] = { [Op.lte]: endAd };
    }
  }

  const data = await Vehicle.findAndCountAll({
    where,
    include: [
      { model: Operator, as: "operator", required: false },
      { model: Helper, as: "helper", required: false },
      { model: Driver, as: "drivers", required: false },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true,
    order: [[dateField, "DESC"]],
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
  const transaction = await sequelize.transaction();
  try {
    const { drivers, operator, helper, ...vehicleData } = data;

    // Find the vehicle
    const vehicle = await Vehicle.findOne({
      where: { id, status: 1 },
      transaction,
    });
    if (!vehicle) {
      await transaction.rollback();
      return null;
    }

    // Step 1: Update or create ledger first
    const ledger = await createOrUpdateLedgerForVehicle(
      vehicle,
      vehicleData,
      transaction
    );

    // Step 2: Update main vehicle fields with ledgerId
    await vehicle.update(
      { ...vehicleData, ledgerId: ledger.id },
      { transaction }
    );

    // --- Step 3: Handle Operator ---
    // if (operator && Object.values(operator).some((v) => v && v?.trim() !== "")) {
    //   const existingOperator = await Operator.findOne({
    //     where: { vehicleId: id },
    //     transaction,
    //   });
    //   if (existingOperator) {
    //     await existingOperator.update(
    //       { ...operator, status: 1 },
    //       { transaction }
    //     );
    //   } else {
    //     await Operator.create(
    //       { ...operator, vehicleId: id, status: 1 },
    //       { transaction }
    //     );
    //   }
    // } else {
    //   await Operator.update(
    //     { status: 0 },
    //     { where: { vehicleId: id }, transaction }
    //   );
    // }
    if (
      operator &&
      Object.values(operator).some(
        (v) => typeof v === "string" && v.trim() !== ""
      )
    ) {
      const existingOperator = await Operator.findOne({
        where: { vehicleId: id },
        transaction,
      });

      if (existingOperator) {
        await existingOperator.update(
          { ...operator, status: 1 },
          { transaction }
        );
      } else {
        await Operator.create(
          { ...operator, vehicleId: id, status: 1 },
          { transaction }
        );
      }
    } else {
      await Operator.update(
        { status: 0 },
        { where: { vehicleId: id }, transaction }
      );
    }


    // --- Step 4: Handle Helper ---
    // if (helper && Object.values(helper).some((v) => v && v.trim() !== "")) {
    //   const existingHelper = await Helper.findOne({
    //     where: { vehicleId: id },
    //     transaction,
    //   });
    //   if (existingHelper) {
    //     await existingHelper.update({ ...helper, status: 1 }, { transaction });
    //   } else {
    //     await Helper.create(
    //       { ...helper, vehicleId: id, status: 1 },
    //       { transaction }
    //     );
    //   }
    // } else {
    //   await Helper.update(
    //     { status: 0 },
    //     { where: { vehicleId: id }, transaction }
    //   );
    // }
    if (
      helper &&
      Object.values(helper).some(
        (v) => typeof v === "string" && v.trim() !== ""
      )
    ) {
      const existingHelper = await Helper.findOne({
        where: { vehicleId: id },
        transaction,
      });

      if (existingHelper) {
        await existingHelper.update({ ...helper, status: 1 }, { transaction });
      } else {
        await Helper.create(
          { ...helper, vehicleId: id, status: 1 },
          { transaction }
        );
      }
    } else {
      await Helper.update(
        { status: 0 },
        { where: { vehicleId: id }, transaction }
      );
    }


    // --- Step 5: Handle Drivers ---
    // if (Array.isArray(drivers)) {
    //   const validDrivers = drivers
    //     .filter((d) => Object.values(d).some((v) => v && v.trim() !== ""))
    //     .map((d) => ({ ...d, vehicleId: id, status: 1 }));

    //   // Mark all drivers inactive first
    //   await Driver.update(
    //     { status: 0 },
    //     { where: { vehicleId: id }, transaction }
    //   );

    //   // Add new active drivers if present
    //   if (validDrivers.length > 0) {
    //     await Driver.bulkCreate(validDrivers, { transaction });
    //   }
    // }
    if (Array.isArray(drivers)) {
      const validDrivers = drivers
        .filter((d) =>
          Object.values(d).some(
            (v) => typeof v === "string" && v.trim() !== ""
          )
        )
        .map((d) => ({ ...d, vehicleId: id, status: 1 }));

      // Mark all drivers inactive first
      await Driver.update(
        { status: 0 },
        { where: { vehicleId: id }, transaction }
      );

      // Add new active drivers if present
      if (validDrivers.length > 0) {
        await Driver.bulkCreate(validDrivers, { transaction });
      }
    }


    // Commit the transaction if all steps succeed
    await transaction.commit();
    return vehicle;
  } catch (error) {
    // Rollback if any error occurs
    await transaction.rollback();
    console.error("Error updating vehicle:", error);
    throw error;
  }
};

const deleteVehicle = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    // Find the vehicle first
    const vehicle = await Vehicle.findOne({
      where: { id, status: 1 },
      transaction,
    });
    if (!vehicle) {
      await transaction.rollback();
      return null;
    }

    // Soft delete the vehicle
    await Vehicle.update({ status: 0 }, { where: { id }, transaction });

    // Soft delete related Operator, Helper, and Drivers
    await Operator.update(
      { status: 0 },
      { where: { vehicleId: id }, transaction }
    );
    await Helper.update(
      { status: 0 },
      { where: { vehicleId: id }, transaction }
    );
    await Driver.update(
      { status: 0 },
      { where: { vehicleId: id }, transaction }
    );

    // Optional: Soft delete related ledger if linked
    if (vehicle.ledgerId) {
      await LedgerInfo.update(
        { status: 0 },
        { where: { id: vehicle.ledgerId }, transaction }
      );
    }

    // Commit the transaction
    await transaction.commit();
    return true;
  } catch (error) {
    // Rollback if any error happens
    await transaction.rollback();
    console.error("Error deleting vehicle:", error);
    throw error;
  }
};

const getVechilesForDropdown = async () => {
  const ledgers = await Vehicle.findAll({
    where: {
      status: 1,
      // ledger_type: "Transportation",
    },
    order: [["id", "DESC"]],
  });

  return ledgers.map((ledger) => ledger.get({ plain: true }));
};

module.exports = {
  createVehicle,
  updateVehicle,
  getVehicleById,
  getVehiclesPaginated,
  deleteVehicle,
  getVechilesForDropdown,
};
