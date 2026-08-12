import express from "express";
const router = express.Router();
import {
  saveWorkoutHistory,
  getWorkoutPreparation,
  getWeeklyProgress,
} from "../controllers/workoutController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.use(verifyToken);

router.post("/history", saveWorkoutHistory);

router.get("/prepare/:routineId", getWorkoutPreparation);

router.get("/weekly-progress", getWeeklyProgress);

export default router;
