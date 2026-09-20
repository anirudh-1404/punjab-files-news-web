import express from "express";
import {
  getUsers,
  updateUserRole,
  updateUserStatus,
  updateDirectPublish,
  deleteUser
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All user management routes are protected and restricted to admin
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getUsers);
router.route("/:id/role").put(updateUserRole);
router.route("/:id/status").put(updateUserStatus);
router.route("/:id/direct-publish").put(updateDirectPublish);
router.route("/:id").delete(deleteUser);

export default router;
