import "dotenv/config";

import app from "./app.js";
import sequelize from "./config/database.js";

const PORT = process.env.PORT || 3001;

let server;
let isShuttingDown = false;

function validateEnvironment() {
  const requiredVariables = ["JWT_SECRET", "FRONTEND_URL"];
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    requiredVariables.push("DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME");
  }

  const missingVariables = requiredVariables.filter((variable) => !process.env[variable]?.trim());

  if (missingVariables.length > 0) {
    throw new Error(`Missing environment variables: ${missingVariables.join(", ")}`);
  }
}

async function startServer() {
  validateEnvironment();

  await sequelize.authenticate();

  console.log("Database connection established");

  server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

async function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`${signal} received. Closing server...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    await sequelize.close();

    console.log("Server and database connection closed.");
  } catch (error) {
    console.error("Failed to close application correctly:", error);
    process.exit(1);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer().catch(async (error) => {
  console.error("Failed to start server:", error);

  await sequelize.close();
  process.exit(1);
});
