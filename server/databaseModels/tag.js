import { DataTypes } from "sequelize";
import db from "../db.js";

const Tag = db.define("tag", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "tags",
  timestamps: true,
  indexes: [
    { name: "index_tag_name", unique: true, fields: ["name"] },
  ],
});

export default Tag;
