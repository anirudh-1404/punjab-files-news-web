import express from "express";
import {
  getWebTV,
  updateWebTV,
  getAllSchedules,
  createOrUpdateSchedule,
  updateScheduleById,
  deleteSchedule,
  toggleScheduleActive
} from "../controllers/webTVController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public route: get active Web TV stream configuration for homepage (scheduled check + fallback)
router.get("/", getWebTV);

// Protected routes: Admin and Editor can update the default 24x7 Web TV live stream
router.put("/", protect, authorize("admin", "editor"), updateWebTV);
router.post("/", protect, authorize("admin", "editor"), updateWebTV);

// Schedule routes: Admin and Editor can manage date-wise schedules
router.get("/schedules", protect, authorize("admin", "editor"), getAllSchedules);
router.post("/schedules", protect, authorize("admin", "editor"), createOrUpdateSchedule);
router.put("/schedules/:id", protect, authorize("admin", "editor"), updateScheduleById);
router.delete("/schedules/:id", protect, authorize("admin", "editor"), deleteSchedule);
router.put("/schedules/:id/toggle", protect, authorize("admin", "editor"), toggleScheduleActive);

export default router;

