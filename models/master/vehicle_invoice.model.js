const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class VehicleInvoice extends Model {}

VehicleInvoice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  renewal_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  invoice_no: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  functional_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'VehicleInvoice',
  tableName: 'vehicle_invoice',
  timestamps: false,
  underscored: true,
});

module.exports = VehicleInvoice; 