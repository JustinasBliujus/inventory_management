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
  part_1: { type: DataTypes.STRING(255), defaultValue: null },
  part_2: { type: DataTypes.STRING(255), defaultValue: null },
  part_3: { type: DataTypes.STRING(255), defaultValue: null },
  part_4: { type: DataTypes.STRING(255), defaultValue: null },
  part_5: { type: DataTypes.STRING(255), defaultValue: null },
  part_6: { type: DataTypes.STRING(255), defaultValue: null },
  part_7: { type: DataTypes.STRING(255), defaultValue: null },
  part_8: { type: DataTypes.STRING(255), defaultValue: null },
  part_9: { type: DataTypes.STRING(255), defaultValue: null },
  part_10: { type: DataTypes.STRING(255), defaultValue: null },
}, {
  tableName: "customID",
  timestamps: true,
});

export default CustomID;
