import express from "express";
import {
  getPublicGallery,
  getAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  togglePublish
} from "../controllers/galleryController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public: Get published gallery photos
router.get("/", getPublicGallery);

// Protected: Admin & Editor routes
router.get("/admin", protect, authorize("admin", "editor"), getAdminGallery);
router.post("/", protect, authorize("admin", "editor"), createGalleryItem);
router.put("/:id", protect, authorize("admin", "editor"), updateGalleryItem);
router.delete("/:id", protect, authorize("admin", "editor"), deleteGalleryItem);
router.put("/:id/toggle", protect, authorize("admin", "editor"), togglePublish);

export default router;
