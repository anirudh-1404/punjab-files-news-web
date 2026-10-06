import express from "express";
import {
  getActiveAds,
  getAllAds,
  createAd,
  updateAd,
  deleteAd,
  toggleAdActive,
  trackAdClick
} from "../controllers/adController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public route: get active ads by slot or all active ads
router.get("/active", getActiveAds);

// Public route: record ad click
router.post("/:id/click", trackAdClick);

// Protected routes for Admin & Editor
router.get("/", protect, authorize("admin", "editor"), getAllAds);
router.post("/", protect, authorize("admin", "editor"), createAd);
router.put("/:id", protect, authorize("admin", "editor"), updateAd);
router.delete("/:id", protect, authorize("admin", "editor"), deleteAd);
router.put("/:id/toggle", protect, authorize("admin", "editor"), toggleAdActive);

export default router;
