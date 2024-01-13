import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const { DB_NAME, DB_USER, DB_PASS, DB_HOST } = process.env;

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS ?? "", {
  host: DB_HOST,
  port: 3307,
  dialect: "mysql",
  define: {
    timestamps: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  operatorAliases: false,
});

export default db;