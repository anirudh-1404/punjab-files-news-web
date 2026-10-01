import express from "express";
import {
  getPublishedPodcasts,
  getAllStaffPodcasts,
  createPodcast,
  updatePodcastStatus,
  deletePodcast
} from "../controllers/podcastController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getPublishedPodcasts);

// Protected Staff routes
router.get("/staff/all", protect, authorize("reporter", "editor", "admin"), getAllStaffPodcasts);
router.post("/", protect, authorize("reporter", "editor", "admin"), createPodcast);
router.put("/:id/status", protect, authorize("editor", "admin"), updatePodcastStatus);
router.delete("/:id", protect, deletePodcast);

export default router;
