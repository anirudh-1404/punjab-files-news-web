import express from "express";
import {
  getActiveBreaking,
  createBreaking,
  updateBreaking,
  deleteBreaking
} from "../controllers/breakingController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public route
router.get("/", getActiveBreaking);

// Protected Editor/Admin routes
router.post("/", protect, authorize("editor", "admin"), createBreaking);
router.put("/:id", protect, authorize("editor", "admin"), updateBreaking);
router.delete("/:id", protect, authorize("editor", "admin"), deleteBreaking);

export default router;
