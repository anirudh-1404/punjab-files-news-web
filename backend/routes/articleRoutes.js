import express from "express";
import {
  getPublishedArticles,
  getArticleBySlug,
  getReadersChoiceTop10,
  createArticle,
  getMyArticles,
  getPendingArticles,
  getReviewDeskArticles,
  updateArticleStatus,
  updateArticle,
  deleteArticle,
  renderArticleShareHtml
} from "../controllers/articleController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getPublishedArticles);
router.get("/readers-choice", getReadersChoiceTop10);
router.get("/share/:slug", renderArticleShareHtml);
router.get("/detail/:slug", getArticleBySlug);
router.get("/:slug", getArticleBySlug);

// Protected Staff routes (Reporters, editors, and admins can create articles)
router.post("/", protect, authorize("reporter", "editor", "admin"), createArticle);
router.get("/staff/my-articles", protect, getMyArticles);
router.get("/staff/pending", protect, authorize("editor", "admin"), getPendingArticles);
router.get("/staff/review-desk", protect, authorize("editor", "admin"), getReviewDeskArticles);
router.put("/:id/status", protect, authorize("editor", "admin"), updateArticleStatus);
router.put("/:id", protect, updateArticle);
router.delete("/:id", protect, deleteArticle);

export default router;
