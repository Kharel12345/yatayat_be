const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class SmsSettingInfo extends Model {
  static async createOrUpdate(data) {
    const existing = await SmsSettingInfo.findOne();
    if (existing) {
      await existing.update(data);
      return existing;
    } else {
      return await SmsSettingInfo.create(data);
    }
  }

  static async getSetting() {
    return await SmsSettingInfo.findOne();
  }
}

SmsSettingInfo.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  api_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  api_key: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sender_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  route_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_in: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'SmsSettingInfo',
  tableName: 'sms_setting_info',
  timestamps: false,
  underscored: true,
});

module.exports = SmsSettingInfo; 