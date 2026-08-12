import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
  quiet: true,
});

process.env.NODE_ENV = "test";

const requiredVariables = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME", "JWT_SECRET"];

const missingVariables = requiredVariables.filter((variableName) => !process.env[variableName]);

if (missingVariables.length > 0) {
  throw new Error(`Missing test environment variables: ${missingVariables.join(", ")}`);
}

if (!process.env.DB_NAME.endsWith("_test")) {
  throw new Error(
    `Unsafe test database: "${process.env.DB_NAME}". The database name must end with "_test".`,
  );
}
