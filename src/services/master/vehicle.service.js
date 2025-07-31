const { Vehicle, VehicleRenewal, VehicleTransaction } = require("../../../models/master");
const { Op } = require("sequelize");

const registerVehicle = async (data) => {
  return await Vehicle.create(data);
};

const renewVehicle = async (vehicle_id, renewal_type, amount, payment_method) => {
  // Find the latest renewal for this vehicle and type
  const lastRenewal = await VehicleRenewal.findOne({
    where: { vehicle_id, renewal_type },
    order: [['end_date', 'DESC']],
  });

  let start_date, end_date;
  const today = new Date();

  if (lastRenewal && new Date(lastRenewal.end_date) >= today) {
    // Extend from last end_date
    start_date = new Date(lastRenewal.end_date);
    start_date.setDate(start_date.getDate() + 1);
  } else {
    // Start from today
    start_date = today;
  }

  // Calculate end_date
  end_date = new Date(start_date);
  if (renewal_type === 'monthly') {
    end_date.setMonth(end_date.getMonth() + 1);
    end_date.setDate(end_date.getDate() - 1); // End on the last day of the month
  } else if (renewal_type === 'yearly') {
    end_date.setFullYear(end_date.getFullYear() + 1);
    end_date.setDate(end_date.getDate() - 1); // End on the last day of the year
  }

  // Create renewal
  const renewal = await VehicleRenewal.create({
    vehicle_id,
    renewal_type,
    start_date,
    end_date,
    amount,
  });

  // Create transaction
  const transaction = await VehicleTransaction.create({
    renewal_id: renewal.id,
    payment_method,
    amount,
  });

  return { renewal, transaction };
};

const getVehiclesWithRenewalDue = async () => {
  // Get all vehicles and their latest monthly/yearly renewal
  const vehicles = await Vehicle.findAll({
    include: [{
      model: VehicleRenewal,
      required: false,
      order: [["end_date", "DESC"]],
    }],
  });

  const today = new Date();
  // Filter vehicles where either monthly or yearly renewal is missing or expired
  return vehicles.filter(vehicle => {
    const renewals = vehicle.VehicleRenewals || [];
    const latestMonthly = renewals.filter(r => r.renewal_type === 'monthly').sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0];
    const latestYearly = renewals.filter(r => r.renewal_type === 'yearly').sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0];
    return (
      !latestMonthly || new Date(latestMonthly.end_date) < today ||
      !latestYearly || new Date(latestYearly.end_date) < today
    );
  });
};

module.exports = {
  registerVehicle,
  renewVehicle,
  getVehiclesWithRenewalDue,
}; 