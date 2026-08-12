import "dotenv/config";

import express from "express";
import cors from "cors";

import sequelize from "./config/database.js";
import "./models/index.js";

import userRoutes from "./routes/userRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import routineRoutes from "./routes/routineRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import userExerciseMaxRoutes from "./routes/userExerciseMaxRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await sequelize.query("SELECT 1");

    return res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch {
    return res.status(503).json({
      status: "unavailable",
      database: "disconnected",
    });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/maxes", userExerciseMaxRoutes);

export default app;
