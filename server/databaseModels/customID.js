import { DataTypes } from "sequelize";
import db from '../db.js';

const CustomID = db.define("customID", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  inventory_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  part_1_type: { type: DataTypes.STRING(255), defaultValue: null },
  part_1_format: { type: DataTypes.STRING(255), defaultValue: null },
  part_1_value: { type: DataTypes.STRING(255), defaultValue: null },
  part_2_type: { type: DataTypes.STRING(255), defaultValue: null },
  part_2_format: { type: DataTypes.STRING(255), defaultValue: null },
  part_2_value: { type: DataTypes.STRING(255), defaultValue: null },
  part_3_type: { type: DataTypes.STRING(255), defaultValue: null },
  part_3_format: { type: DataTypes.STRING(255), defaultValue: null },
  part_3_value: { type: DataTypes.STRING(255), defaultValue: null },
  part_4_type: { type: DataTypes.STRING(255), defaultValue: null },
  part_4_format: { type: DataTypes.STRING(255), defaultValue: null },
  part_4_value: { type: DataTypes.STRING(255), defaultValue: null },
  part_5_type: { type: DataTypes.STRING(255), defaultValue: null },
  part_5_format: { type: DataTypes.STRING(255), defaultValue: null },
  part_5_value: { type: DataTypes.STRING(255), defaultValue: null },
  part_6_type: { type: DataTypes.STRING(255), defaultValue: null },
  part_6_format: { type: DataTypes.STRING(255), defaultValue: null },
  part_6_value: { type: DataTypes.STRING(255), defaultValue: null },
  part_7_type: { type: DataTypes.STRING(255), defaultValue: null },
  part_7_format: { type: DataTypes.STRING(255), defaultValue: null },
  part_7_value: { type: DataTypes.STRING(255), defaultValue: null },
  part_8_type: { type: DataTypes.STRING(255), defaultValue: null },
  part_8_format: { type: DataTypes.STRING(255), defaultValue: null },
  part_8_value: { type: DataTypes.STRING(255), defaultValue: null },
  part_9_type: { type: DataTypes.STRING(255), defaultValue: null },
  part_9_format: { type: DataTypes.STRING(255), defaultValue: null },
  part_9_value: { type: DataTypes.STRING(255), defaultValue: null },
  part_10_type: { type: DataTypes.STRING(255), defaultValue: null },
  part_10_format: { type: DataTypes.STRING(255), defaultValue: null },
  part_10_value: { type: DataTypes.STRING(255), defaultValue: null },
}, {
  tableName: "customID",
  timestamps: true,
  indexes: [
    { name: "index_inventory_id", fields: ["inventory_id"] },
  ],
});

export default CustomID;
