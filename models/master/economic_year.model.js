const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../src/config/database');

class FunctionalYear extends Model {
  static async economicYearSetup(data) {
    return await FunctionalYear.create(data);
  }

  static async setInactiveEconomicYear() {
    return await FunctionalYear.update({ status: 0 }, { where: { status: 1 } });
  }

  static async getEconomicYearList() {
    return await FunctionalYear.findAll({
      order: [["functional_year_id", "DESC"]],
    });
  }

  static async getActiveEconomicYearInfo() {
    return await FunctionalYear.findOne({ where: { status: 1 } });
  }

  static async getEconomicYearInfo(id) {
    return await FunctionalYear.findOne({ where: { functional_year_id: id } });
  }
}

FunctionalYear.init({
    functional_year_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    functional_year: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    functional_year_start_ad: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    functional_year_start_bs: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    functional_year_end_ad: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    functional_year_end_bs: {
      type: DataTypes.STRING(45),
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
    updated_at: {
      type: DataTypes.DATE,
    },
}, {
  sequelize,
  modelName: 'FunctionalYear',
  tableName: 'functional_year',
    timestamps: false,
    underscored: true,
});

// Associations (if needed, you can define them in a separate function)
FunctionalYear.associate = (models) => {
  FunctionalYear.belongsTo(models.User, {
    foreignKey: "created_by",
    as: "creator",
  });
};

module.exports = FunctionalYear;