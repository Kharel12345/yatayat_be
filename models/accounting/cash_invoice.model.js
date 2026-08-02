const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const { Vehicle } = require("../master");

const CashInvoice = sequelize.define(
  "CashInvoice",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Vehicles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    bill_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    bill_date_bs: {
      type: DataTypes.STRING(244),
      allowNull: false,
    },
    receipt_no: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.ENUM("cash", "online"),
      allowNull: false,
      defaultValue: "cash",
      validate: {
        isIn: {
          args: [["cash", "online"]],
          msg: "Payment method must be either cash or online",
        },
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Amount must be a decimal number",
        },
        min: {
          args: [0],
          msg: "Amount cannot be negative",
        },
      },
    },
    remarks: {
      type: DataTypes.TEXT,
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
      defaultValue: DataTypes.NOW,
    },
  
  },
  {
    tableName: "cash_invoice",
    timestamps: false,
    underscored: true,
  },
  
  
);

// Define associations
CashInvoice.belongsTo(Vehicle, {
  foreignKey: "vehicle_id",
  as: "vehicle",
});

module.exports = CashInvoice;