import "dotenv/config";
import { Sequelize } from "sequelize";

const databaseName = process.env.DB_NAME;
const databaseUrl = process.env.DATABASE_URL?.trim();
const isTestEnvironment = process.env.NODE_ENV === "test";

if (isTestEnvironment && !databaseName?.endsWith("_test")) {
  throw new Error(`Refusing to run tests against unsafe database: "${databaseName}".`);
}

const shouldUseDatabaseUrl = Boolean(databaseUrl) && !isTestEnvironment;

const sequelize = shouldUseDatabaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: "postgres",
      logging: false,
    })
  : new Sequelize(databaseName, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: "postgres",
      port: Number(process.env.DB_PORT),
      logging: false,
    });

export default sequelize;
