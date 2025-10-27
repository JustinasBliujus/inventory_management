import { DataTypes } from "sequelize";
import db from '../db.js';

const Item = db.define("item", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  custom_id: {
    type: DataTypes.STRING(1024)
  },
  inventory_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  creator_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // ---------- Custom single-line fields ----------
  custom_line1: { type: DataTypes.STRING(255), allowNull: true },
  custom_line2: { type: DataTypes.STRING(255), allowNull: true },
  custom_line3: { type: DataTypes.STRING(255), allowNull: true },

  // ---------- Custom multi-line fields ----------
  custom_multiline1: { type: DataTypes.TEXT, allowNull: true },
  custom_multiline2: { type: DataTypes.TEXT, allowNull: true },
  custom_multiline3: { type: DataTypes.TEXT, allowNull: true },

  // ---------- Custom number fields ----------
  custom_number1: { type: DataTypes.FLOAT, allowNull: true },
  custom_number2: { type: DataTypes.FLOAT, allowNull: true },
  custom_number3: { type: DataTypes.FLOAT, allowNull: true },

  // ---------- Custom URL fields ----------
  custom_url1: { type: DataTypes.STRING(255), allowNull: true },
  custom_url2: { type: DataTypes.STRING(255), allowNull: true },
  custom_url3: { type: DataTypes.STRING(255), allowNull: true },

  // ---------- Custom boolean fields ----------
  custom_bool1: { type: DataTypes.BOOLEAN, allowNull: true },
  custom_bool2: { type: DataTypes.BOOLEAN, allowNull: true },
  custom_bool3: { type: DataTypes.BOOLEAN, allowNull: true },

}, {
  tableName: "items",
  timestamps: true,
  indexes: [
    { name: "index_inventory_id", fields: ["inventory_id"] },
    { name: "index_creator_email", fields: ["creator_email"] },
  ],
});

export default Item;
