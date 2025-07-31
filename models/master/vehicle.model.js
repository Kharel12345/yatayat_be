const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class Vehicle extends Model {}

Vehicle.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  registration_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  vehicle_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Vehicle',
  tableName: 'vehicle',
  timestamps: false,
  underscored: true,
});

module.exports = Vehicle; 