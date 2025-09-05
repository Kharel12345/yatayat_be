const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const { Vehicle, BillingTitleInfo } = require("../master");

const Invoice = sequelize.define(
  "Invoice",
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
        model: "vehicles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    billing_title_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "billing_titles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    invoice_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    invoice_date_bs: {
      type: DataTypes.STRING(244),
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Rate must be a decimal number",
        },
        min: {
          args: [0],
          msg: "Rate cannot be negative",
        },
      },
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expire_date_bs: {
      type: DataTypes.STRING(244),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "overdue", "cancelled"),
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["pending", "paid", "overdue", "cancelled"]],
          msg: "Status must be pending, paid, overdue, or cancelled",
        },
      },
    },
    payment_mode: {
      type: DataTypes.ENUM("cash", "card", "bank_transfer", "online", "credit"),
      allowNull: true,
      validate: {
        isIn: {
          args: [["cash", "card", "bank_transfer", "online", "credit"]],
          msg: "Invalid payment mode",
        },
      },
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Tax amount cannot be negative",
        },
      },
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Discount amount cannot be negative",
        },
      },
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "Total amount cannot be negative",
        },
      },
    },
  },
  {
    tableName: "invoices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["vehicle_id"],
      },
      {
        fields: ["billing_title_id"],
      },
      {
        fields: ["invoice_number"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["invoice_date"],
      },
      {
        fields: ["expiry_date"],
      },
    ],
    hooks: {
      beforeValidate: (invoice) => {
        // Calculate total amount before validation
        if (invoice.rate !== undefined) {
          const rate = parseFloat(invoice.rate) || 0;
          const tax = parseFloat(invoice.tax_amount) || 0;
          const discount = parseFloat(invoice.discount_amount) || 0;
          invoice.total_amount = rate + tax - discount;
        }
      },
    },
  }
);

Invoice.belongsTo(Vehicle, {
  foreignKey: "vehicle_id",
  targetKey: "id",
  as: "vehicleInfo",
});

Invoice.belongsTo(BillingTitleInfo, {
  foreignKey: "billing_title_id",
  targetKey: "billing_title_id",
  as: "billingInfo",
});


module.exports = Invoice;
