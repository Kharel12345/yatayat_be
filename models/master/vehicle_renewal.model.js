const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../src/config/database');
const Vehicle = require('./vehicle.model');

class VehicleRenewal extends Model {}

VehicleRenewal.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vehicle,
      key: 'id',
    },
  },
  renewal_type: {
    type: DataTypes.ENUM('monthly', 'yearly'),
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'VehicleRenewal',
  tableName: 'vehicle_renewal',
  timestamps: false,
  underscored: true,
});

VehicleRenewal.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });
Vehicle.hasMany(VehicleRenewal, { foreignKey: 'vehicle_id' });

module.exports = VehicleRenewal; 