import express from "express";
const router = express.Router();
import {
  createRoutine,
  getAllRoutines,
  deleteRoutine,
  getActiveRoutine,
} from "../controllers/routineController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.use(verifyToken);

router.post("/", createRoutine);

router.get("/", getAllRoutines);

router.delete("/:routineId", deleteRoutine);

router.get("/active", getActiveRoutine);

export default router;
