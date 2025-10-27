import { DataTypes } from "sequelize";
import db from '../db.js';

const Inventory = db.define("inventory", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  category: {
    type: DataTypes.ENUM(
      "Electronics",
       "Office",
        "Tools",
        "Clothing",
        "Home",
        "Food",
        "Health",
        "Sports",
        "Miscellaneous"
      ),
    allowNull: true,
    defaultValue: null,
  },

  is_public: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  // ---------- Custom single-line fields ----------
  custom_line1_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_line1_name: { type: DataTypes.STRING(255) },
  custom_line1_desc: { type: DataTypes.STRING(255) },
  custom_line1_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  custom_line2_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_line2_name: { type: DataTypes.STRING(255) },
  custom_line2_desc: { type: DataTypes.STRING(255) },
  custom_line2_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  custom_line3_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_line3_name: { type: DataTypes.STRING(255) },
  custom_line3_desc: { type: DataTypes.STRING(255) },
  custom_line3_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  // ---------- Custom multi-line fields ----------
  custom_multiline1_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_multiline1_name: { type: DataTypes.STRING(255) },
  custom_multiline1_desc: { type: DataTypes.STRING(255) },
  custom_multiline1_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  custom_multiline2_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_multiline2_name: { type: DataTypes.STRING(255) },
  custom_multiline2_desc: { type: DataTypes.STRING(255) },
  custom_multiline2_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  custom_multiline3_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_multiline3_name: { type: DataTypes.STRING(255) },
  custom_multiline3_desc: { type: DataTypes.STRING(255) },
  custom_multiline3_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  // ---------- Custom number fields ----------
  custom_number1_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_number1_name: { type: DataTypes.STRING(255) },
  custom_number1_desc: { type: DataTypes.STRING(255) },
  custom_number1_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  custom_number2_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_number2_name: { type: DataTypes.STRING(255) },
  custom_number2_desc: { type: DataTypes.STRING(255) },
  custom_number2_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  custom_number3_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_number3_name: { type: DataTypes.STRING(255) },
  custom_number3_desc: { type: DataTypes.STRING(255) },
  custom_number3_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  // ---------- Custom URL fields ----------
  custom_url1_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_url1_name: { type: DataTypes.STRING(255) },
  custom_url1_desc: { type: DataTypes.STRING(255) },
  custom_url1_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  custom_url2_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_url2_name: { type: DataTypes.STRING(255) },
  custom_url2_desc: { type: DataTypes.STRING(255) },
  custom_url2_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  custom_url3_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_url3_name: { type: DataTypes.STRING(255) },
  custom_url3_desc: { type: DataTypes.STRING(255) },
  custom_url3_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  // ---------- Custom boolean fields ----------
  custom_bool1_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_bool1_name: { type: DataTypes.STRING(255) },
  custom_bool1_desc: { type: DataTypes.STRING(255) },
  custom_bool1_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  custom_bool2_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_bool2_name: { type: DataTypes.STRING(255) },
  custom_bool2_desc: { type: DataTypes.STRING(255) },
  custom_bool2_show: { type: DataTypes.BOOLEAN, defaultValue: false },

  custom_bool3_state: { type: DataTypes.BOOLEAN, defaultValue: false },
  custom_bool3_name: { type: DataTypes.STRING(255) },
  custom_bool3_desc: { type: DataTypes.STRING(255) },
  custom_bool3_show: { type: DataTypes.BOOLEAN, defaultValue: false },

}, 
{
  tableName: "inventory",
  timestamps: true,
  indexes: [
    { name: "index_user_id", fields: ["user_id"] },
    { name: "index_category", fields: ["category"] },
    { name: "fulltext_inventory_search", type: "FULLTEXT", fields: ["name", "description"]},
  ],
});

export default Inventory;