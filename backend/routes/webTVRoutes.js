import express from "express";
import {
  getWebTV,
  getDefaultsWebTV,
  updateWebTV,
  getAllSchedules,
  createOrUpdateSchedule,
  updateScheduleById,
  deleteSchedule,
  toggleScheduleActive
} from "../controllers/webTVController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public route: get active Web TV stream configuration for homepage (scheduled check + fallback by language)
router.get("/", getWebTV);

// Protected routes: Admin and Editor can get/update the default 24x7 Web TV live streams by language
router.get("/defaults", protect, authorize("admin", "editor"), getDefaultsWebTV);
router.put("/", protect, authorize("admin", "editor"), updateWebTV);
router.post("/", protect, authorize("admin", "editor"), updateWebTV);

// Schedule routes: Admin and Editor can manage date-wise and language-wise schedules
router.get("/schedules", protect, authorize("admin", "editor"), getAllSchedules);
router.post("/schedules", protect, authorize("admin", "editor"), createOrUpdateSchedule);
router.put("/schedules/:id", protect, authorize("admin", "editor"), updateScheduleById);
router.delete("/schedules/:id", protect, authorize("admin", "editor"), deleteSchedule);
router.put("/schedules/:id/toggle", protect, authorize("admin", "editor"), toggleScheduleActive);

export default router;
