import express from "express";
const router = express.Router();
import {
  upsertUserMax,
  getUserMaxes,
  getUserStrength,
} from "../controllers/userExerciseMaxController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.use(verifyToken);

router.get("/", getUserMaxes);

router.get("/strength", getUserStrength);

router.post("/", upsertUserMax);

export default router;
