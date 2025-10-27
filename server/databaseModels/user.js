import { DataTypes } from "sequelize";
import db from '../db.js';

const User = db.define("user", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  surname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },

  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  status: {
    type: DataTypes.ENUM("unverified", "verified", "blocked"),
    allowNull: false,
    defaultValue: "unverified",
  },

  prev_status: {
    type: DataTypes.ENUM("unverified", "verified"),
    allowNull: true,
    defaultValue: "unverified",
  },

  verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },

  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  google: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  facebook: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: "user", 
  timestamps: true, 
  indexes: [
    {
      name: "index_email",
      unique: true,
      fields: ["email"],
    },
    { name: "fulltext_user_search", type: "FULLTEXT", fields: ["name", "surname", "email"] },
  ],
});

export default User;
