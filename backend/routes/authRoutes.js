import express from "express";
import { login, getMe, logout, registerStaff } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.post("/register", protect, authorize("admin"), registerStaff);

export default router;
