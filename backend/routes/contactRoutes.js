import express from "express";
import {
  createContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public route to submit query
router.post("/", createContactMessage);

// Protected staff routes
router.get("/", protect, authorize("admin", "editor"), getContactMessages);
router.put("/:id/status", protect, authorize("admin", "editor"), updateContactStatus);
router.delete("/:id", protect, authorize("admin"), deleteContactMessage);

export default router;
