const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class MessageSetting extends Model {}

MessageSetting.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   message_setting_type: {
    type: DataTypes.STRING,
    allowNull: false,
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
  modelName: 'MessageSetting',
  tableName: 'message_setting',
  timestamps: false,
  underscored: true,
});

module.exports = MessageSetting;