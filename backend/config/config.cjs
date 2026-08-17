const path = require("node:path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
  quiet: true,
});

const databaseUrl = process.env.DATABASE_URL?.trim();
const isTestEnvironment = process.env.NODE_ENV === "test";
const shouldUseDatabaseUrl = Boolean(databaseUrl) && !isTestEnvironment;

const requiredVariables = shouldUseDatabaseUrl
  ? []
  : ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];

const missingVariables = requiredVariables.filter((variable) => !process.env[variable]?.trim());

if (missingVariables.length > 0) {
  throw new Error(`Missing migration environment variables: ${missingVariables.join(", ")}`);
}

if (isTestEnvironment && !process.env.DB_NAME?.endsWith("_test")) {
  throw new Error(`Refusing to migrate unsafe test database: "${process.env.DB_NAME}".`);
}

const connectionConfig = shouldUseDatabaseUrl
  ? {
      use_env_variable: "DATABASE_URL",
    }
  : {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
    };

const databaseConfig = {
  ...connectionConfig,
  dialect: "postgres",
  logging: false,
  migrationStorage: "sequelize",
  migrationStorageTableName: "SequelizeMeta",
};

module.exports = {
  development: databaseConfig,
  test: databaseConfig,
  production: databaseConfig,
};
