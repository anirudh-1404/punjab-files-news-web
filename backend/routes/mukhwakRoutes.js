import express from "express";
import {
  getActiveMukhwak,
  getAllMukhwaks,
  createMukhwak,
  updateMukhwak,
  setActiveMukhwak,
  deleteMukhwak
} from "../controllers/mukhwakController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public route for homepage
router.get("/today", getActiveMukhwak);

// Protected routes for Admin & Editor management
router.use(protect);
router.use(authorize("admin", "editor"));

router.get("/", getAllMukhwaks);
router.post("/", createMukhwak);
router.put("/:id", updateMukhwak);
router.put("/:id/set-active", setActiveMukhwak);
router.delete("/:id", deleteMukhwak);

export default router;
