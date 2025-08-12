const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database'); // adjust path accordingly

const LabelInfo = sequelize.define('LabelInfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  label_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
  }
}, {
  tableName: 'label_info',
  timestamps: false,
  underscored: true,
});

module.exports = LabelInfo;
