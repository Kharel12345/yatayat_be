const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1 = active, 0 = inactive
      validate: {
        isIn: [[0, 1]],
      },
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "categories", // optional: for custom table naming
  }
);

// Define associations in a separate function to be called after all models are initialized
Category.associate = (models) => {
  Category.hasMany(models.SubCategory, {
    foreignKey: "categoryId",
    as: "subCategories",
  });
};

module.exports = Category;
