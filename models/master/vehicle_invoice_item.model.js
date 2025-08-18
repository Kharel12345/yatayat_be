const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class VehicleInvoiceItem extends Model {}

VehicleInvoiceItem.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  billing_title_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  label_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rate: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'VehicleInvoiceItem',
  tableName: 'vehicle_invoice_item',
  timestamps: false,
  underscored: true,
});

module.exports = VehicleInvoiceItem; 