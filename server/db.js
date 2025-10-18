import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: process.env.DIALECT || "mysql",
    logging: false, 
  }
);

const connection = () => {
  db.authenticate()
    .then(() => console.log("Connection established"))
    .catch(err => console.error("Unable to connect to db", err));
};

connection();

export default db; 
