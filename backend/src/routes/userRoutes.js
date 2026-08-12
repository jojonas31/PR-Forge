import express from "express";
const router = express.Router();
import { createUser, loginUser, getUserProfile } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.post("/register", createUser);

router.post("/login", loginUser);

router.get("/profile", verifyToken, getUserProfile);

export default router;
