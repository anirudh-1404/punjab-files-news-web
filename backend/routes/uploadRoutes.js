import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

// Allow authenticated staff (Admin, Editor, Reporter) to upload news images
router.post(
  "/",
  protect,
  authorize("admin", "editor", "reporter"),
  upload.single("image"),
  uploadImage
);

export default router;
