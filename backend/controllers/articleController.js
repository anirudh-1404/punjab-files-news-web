import Article from "../models/Article.js";
import { generateEnglishSlug } from "../utils/slugUtils.js";

// Expand bilingual search terms (English <-> Punjabi / Transliterations)
const BILINGUAL_KEYWORDS = {
  punjab: ["ਪੰਜਾਬ", "punjab", "panjab"],
  panjab: ["ਪੰਜਾਬ", "punjab", "panjab"],
  amritsar: ["ਅੰਮ੍ਰਿਤਸਰ", "amritsar"],
  ludhiana: ["ਲੁਧਿਆਣਾ", "ludhiana"],
  jalandhar: ["ਜਲੰਧਰ", "jalandhar"],
  bathinda: ["ਬਠਿੰਡਾ", "bathinda", "bhatinda"],
  bhatinda: ["ਬਠਿੰਡਾ", "bathinda", "bhatinda"],
  patiala: ["ਪਟਿਆਲਾ", "patiala"],
  gurdaspur: ["ਗੁਰਦਾਸਪੁਰ", "gurdaspur"],
  tarn: ["ਤਰਨਤਾਰਨ", "ਤਰਨ", "tarn"],
  tarntaran: ["ਤਰਨਤਾਰਨ", "tarntaran"],
  sangrur: ["ਸੰਗਰੂਰ", "sangrur"],
  moga: ["ਮੋਗਾ", "moga"],
  firozpur: ["ਫ਼ਿਰੋਜ਼ਪੁਰ", "firozpur", "ferozepur"],
  ferozepur: ["ਫ਼ਿਰੋਜ਼ਪੁਰ", "firozpur", "ferozepur"],
  hushiarpur: ["ਹੁਸ਼ਿਆਰਪੁਰ", "hushiarpur", "hoshiarpur"],
  hoshiarpur: ["ਹੁਸ਼ਿਆਰਪੁਰ", "hushiarpur", "hoshiarpur"],
  kapurthala: ["ਕਪੂਰਥਲਾ", "kapurthala"],
  pathankot: ["ਪਠਾਨਕੋਟ", "pathankot"],
  majha: ["ਮਾਝਾ", "majha"],
  malwa: ["ਮਾਲਵਾ", "malwa"],
  doaba: ["ਦੋਆਬਾ", "doaba"],
  sports: ["ਖੇਡ", "ਖੇਡਾਂ", "sport", "sports"],
  sport: ["ਖੇਡ", "ਖੇਡਾਂ", "sport", "sports"],
  health: ["ਸਿਹਤ", "health"],
  religion: ["ਧਰਮ", "religion"],
  religious: ["ਧਰਮ", "religious"],
  entertainment: ["ਮਨੋਰੰਜਨ", "entertainment", "cinema"],
  cinema: ["ਮਨੋਰੰਜਨ", "cinema"],
  travel: ["ਸੈਰ-ਸਪਾਟਾ", "ਵਿਰਸਾ", "travel"],
  heritage: ["ਵਿਰਸਾ", "heritage"],
  world: ["ਦੇਸ਼-ਵਿਦੇਸ਼", "ਵਿਦੇਸ਼", "world"],
  national: ["ਦੇਸ਼-ਵਿਦੇਸ਼", "ਰਾਸ਼ਟਰੀ", "national"],
  farmer: ["ਕਿਸਾਨ", "ਖੇਤੀ", "farmer"],
  farmers: ["ਕਿਸਾਨ", "ਖੇਤੀ", "farmers"],
  kisan: ["ਕਿਸਾਨ", "kisan"],
  police: ["ਪੁਲਿਸ", "police"],
  crime: ["ਜੁਰਮ", "ਅਪਰਾਧ", "crime"],
  darbar: ["ਦਰਬਾਰ", "darbar"],
  mukhwak: ["ਮੁੱਖਵਾਕ", "ਹੁਕਮਨਾਮਾ", "mukhwak"],
  hukamnama: ["ਹੁਕਮਨਾਮਾ", "ਮੁੱਖਵਾਕ", "hukamnama"],
  live: ["ਲਾਈਵ", "live"],
  modi: ["ਮੋਦੀ", "modi"],
  mann: ["ਮਾਨ", "ਭਗਵੰਤ", "mann"],
  bhagwant: ["ਭਗਵੰਤ", "ਮਾਨ", "bhagwant"]
};

const getSearchTerms = (str) => {
  if (!str) return [];
  const clean = str.trim();
  const lower = clean.toLowerCase();
  const terms = new Set([clean, lower]);

  Object.keys(BILINGUAL_KEYWORDS).forEach((key) => {
    if (lower.includes(key)) {
      BILINGUAL_KEYWORDS[key].forEach((t) => terms.add(t));
    }
  });

  return Array.from(terms);
};

// @desc    Get all published articles (Public with filters)
// @route   GET /api/articles
// @access  Public
export const getPublishedArticles = async (req, res) => {
  try {
    const { category, punjabRegion, language, search, page = 1, limit = 20 } = req.query;

    const query = { status: "published" };

    if (category && category !== "all") {
      query.category = category;
    }

    if (punjabRegion && punjabRegion !== "all") {
      query.punjabRegion = punjabRegion;
    }

    if (language && language !== "all") {
      query.language = language;
    }

    if (search && search.trim()) {
      const searchTerms = getSearchTerms(search);
      const orClauses = [];
      searchTerms.forEach((term) => {
        orClauses.push(
          { title: { $regex: term, $options: "i" } },
          { excerpt: { $regex: term, $options: "i" } },
          { content: { $regex: term, $options: "i" } },
          { authorName: { $regex: term, $options: "i" } },
          { category: { $regex: term, $options: "i" } },
          { punjabRegion: { $regex: term, $options: "i" } },
          { slug: { $regex: term, $options: "i" } }
        );
      });
      query.$or = orClauses;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: articles,
      articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching published articles",
      error: error.message
    });
  }
};

// @desc    Get single article by slug or ID & increment view count
// @route   GET /api/articles/:slug
// @access  Public
export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find by slug or ID
    let article;
    if (slug && slug.match(/^[0-9a-fA-F]{24}$/)) {
      article = await Article.findById(slug);
    } else {
      article = await Article.findOne({ slug });
      if (!article) {
        try {
          const decoded = decodeURIComponent(slug);
          article = await Article.findOne({ slug: decoded });
        } catch {}
      }
      // Fallback: match by timestamp suffix if old Gurmukhi slug was requested
      if (!article) {
        const tsMatch = String(slug).match(/(\d{10,14})/);
        if (tsMatch) {
          article = await Article.findOne({ slug: { $regex: tsMatch[1] } });
        }
      }
    }

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    // Auto-upgrade slug to clean English if it still contains non-ASCII characters
    if (article.slug && /[^\x00-\x7F]/.test(article.slug)) {
      article.slug = generateEnglishSlug(article.title, article.slug);
    }

    // Increment views asynchronously
    article.views += 1;
    await article.save({ validateBeforeSave: false });

    // Fetch up to 4 related articles from the same category
    const related = await Article.find({
      category: article.category,
      _id: { $ne: article._id },
      status: "published"
    })
      .sort({ publishedAt: -1 })
      .limit(4);

    res.status(200).json({
      success: true,
      data: article,
      article,
      related
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching article detail",
      error: error.message
    });
  }
};

// @desc    Get top 10 most-viewed published articles (Readers' Choice)
// @route   GET /api/articles/readers-choice
// @access  Public
export const getReadersChoiceTop10 = async (req, res) => {
  try {
    const articles = await Article.find({ status: "published" })
      .sort({ views: -1, createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
      articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching readers' choice articles",
      error: error.message
    });
  }
};

// @desc    Create new article (Only field reporters can create articles)
// @route   POST /api/articles
// @access  Private (Reporter, Editor, Admin)
export const createArticle = async (req, res) => {
  try {
    if (!["reporter", "editor", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create news articles."
      });
    }

    const {
      title,
      content,
      excerpt,
      category,
      punjabRegion,
      language,
      featuredImage,
      mediaType,
      videoUrl,
      isBreaking,
      status,
      slug
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and content"
      });
    }

    // Determine initial status based on permissions
    let articleStatus = "pending_editor";
    if (status === "draft") {
      articleStatus = "draft";
    } else if (req.user.role === "admin" || req.user.role === "editor" || req.user.canDirectPublish) {
      // Admin, Editor, or privileged Reporter publishes live directly
      articleStatus = status === "published" || !status ? "published" : status;
    } else {
      // Regular reporter submits for editorial review
      articleStatus = "pending_editor";
    }

    // Auto-generate excerpt if not provided
    const cleanExcerpt =
      excerpt && excerpt.trim()
        ? excerpt.trim()
        : content.replace(/<[^>]*>?/gm, "").substring(0, 160) + "...";

    const article = await Article.create({
      title: title.trim(),
      slug: generateEnglishSlug(title.trim(), slug),
      content: content.trim(),
      excerpt: cleanExcerpt,
      category: category || "punjab",
      punjabRegion: category === "punjab" ? punjabRegion || null : null,
      language: language || "pa",
      featuredImage: featuredImage || "/img/index_800x400-image01.jpg",
      mediaType: mediaType || (videoUrl ? "video" : "image"),
      videoUrl: videoUrl || null,
      isBreaking: Boolean(isBreaking),
      status: articleStatus,
      author: req.user._id,
      authorName: req.user.name,
      publishedAt: articleStatus === "published" ? new Date() : null
    });

    res.status(201).json({
      success: true,
      message:
        articleStatus === "published"
          ? "Article published live!"
          : "Article submitted for editorial review.",
      data: article,
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating article",
      error: error.message
    });
  }
};

// @desc    Get articles submitted by currently logged in user (Reporter desk)
// @route   GET /api/articles/my-articles
// @access  Private (Reporter, Editor, Admin)
export const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
      articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching your articles",
      error: error.message
    });
  }
};

// @desc    Get all pending articles for editorial review
// @route   GET /api/articles/pending
// @access  Private (Editor, Admin)
export const getPendingArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: "pending_review" })
      .populate("author", "name email role")
      .sort({ createdAt: 1 }); // oldest pending first

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
      articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending articles",
      error: error.message
    });
  }
};

// @desc    Get articles for editorial review desk with filtering by status and summary counts
// @route   GET /api/articles/staff/review-desk
// @access  Private (Editor, Admin)
export const getReviewDeskArticles = async (req, res) => {
  try {
    const { status, category, punjabRegion, language, search, sort } = req.query;

    const queryFilter = {};
    if (status === "pending_editor" || status === "pending") {
      queryFilter.status = { $in: ["pending_editor", "pending_review"] };
    } else if (status === "pending_admin") {
      queryFilter.status = "pending_admin";
    } else if (status && ["published", "rejected"].includes(status)) {
      queryFilter.status = status;
    } else if (!status || status === "all") {
      queryFilter.status = {
        $in: ["pending_editor", "pending_review", "pending_admin", "published", "rejected"]
      };
    }

    if (category && category !== "all") {
      queryFilter.category = category;
    }

    if (punjabRegion && punjabRegion !== "all") {
      queryFilter.punjabRegion = punjabRegion;
    }

    if (language && language !== "all") {
      queryFilter.language = language;
    }

    if (search && search.trim()) {
      const searchTerms = getSearchTerms(search);
      const orClauses = [];
      searchTerms.forEach((term) => {
        orClauses.push(
          { title: { $regex: term, $options: "i" } },
          { authorName: { $regex: term, $options: "i" } },
          { excerpt: { $regex: term, $options: "i" } },
          { content: { $regex: term, $options: "i" } },
          { category: { $regex: term, $options: "i" } },
          { slug: { $regex: term, $options: "i" } }
        );
      });
      queryFilter.$or = orClauses;
    }

    let sortOption = { updatedAt: -1, createdAt: -1 };
    if (sort === "views") {
      sortOption = { views: -1, createdAt: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    const articles = await Article.find(queryFilter)
      .populate("author", "name email role canDirectPublish")
      .populate("reviewedBy", "name email role")
      .populate("editorReviewedBy", "name email role")
      .populate("adminApprovedBy", "name email role")
      .populate("rejectedBy", "name email role")
      .sort(sortOption);

    const [pendingEditorCount, pendingAdminCount, publishedCount, rejectedCount] =
      await Promise.all([
        Article.countDocuments({ status: { $in: ["pending_editor", "pending_review"] } }),
        Article.countDocuments({ status: "pending_admin" }),
        Article.countDocuments({ status: "published" }),
        Article.countDocuments({ status: "rejected" })
      ]);

    res.status(200).json({
      success: true,
      counts: {
        pendingEditor: pendingEditorCount,
        pendingAdmin: pendingAdminCount,
        published: publishedCount,
        rejected: rejectedCount,
        pending: pendingEditorCount, // backward compatibility
        total: pendingEditorCount + pendingAdminCount + publishedCount + rejectedCount
      },
      count: articles.length,
      data: articles,
      articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching editorial review desk articles",
      error: error.message
    });
  }
};

// @desc    Update article status (Approve / Reject / Publish / Forward to Admin)
// @route   PUT /api/articles/:id/status
// @access  Private (Editor, Admin)
export const updateArticleStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const allowedStatuses = [
      "draft",
      "pending_editor",
      "pending_review",
      "pending_admin",
      "published",
      "rejected"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    article.status = status;
    article.reviewedBy = req.user._id;
    article.reviewedAt = new Date();

    if (status === "pending_admin") {
      // Editor approved & recommended for Admin final approval
      article.editorReviewedBy = req.user._id;
      article.editorReviewedAt = new Date();
      article.rejectionReason = null;
    } else if (status === "published") {
      // Admin (or direct-publish reporter) approved live
      article.adminApprovedBy = req.user._id;
      article.adminApprovedAt = new Date();
      if (!article.publishedAt) {
        article.publishedAt = new Date();
      }
      article.rejectionReason = null;
    } else if (status === "rejected") {
      article.rejectionReason =
        rejectionReason || "ਕੋਈ ਵਿਸ਼ੇਸ਼ ਕਾਰਨ ਦਰਜ ਨਹੀਂ (No specific reason given)";
      article.rejectedBy = req.user._id;
    }

    await article.save();

    await article.populate("author", "name email role canDirectPublish");
    await article.populate("reviewedBy", "name email role");
    await article.populate("editorReviewedBy", "name email role");
    await article.populate("adminApprovedBy", "name email role");
    await article.populate("rejectedBy", "name email role");

    res.status(200).json({
      success: true,
      message: `Article status updated to: ${status}`,
      data: article,
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating article status",
      error: error.message
    });
  }
};

// @desc    Update article content
// @route   PUT /api/articles/:id
// @access  Private (Author, Editor, Admin)
export const updateArticle = async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    // Check ownership unless admin/editor
    if (
      article.author &&
      article.author.toString() !== req.user._id.toString() &&
      !["admin", "editor"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this article"
      });
    }

    const fieldsToUpdate = [
      "title",
      "slug",
      "content",
      "excerpt",
      "category",
      "punjabRegion",
      "language",
      "featuredImage",
      "isBreaking"
    ];

    if (["admin", "editor"].includes(req.user.role)) {
      fieldsToUpdate.push("status");
    }

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "slug") {
          article.slug = generateEnglishSlug(article.title, req.body.slug);
        } else {
          article[field] = req.body[field];
        }
      }
    });

    // If title was updated without explicit slug, ensure slug is also clean English
    if (req.body.title && (!article.slug || /[^\x00-\x7F]/.test(article.slug))) {
      article.slug = generateEnglishSlug(article.title);
    }

    if (["admin", "editor"].includes(req.user.role) && req.body.status === "published" && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    // If reporter updates an article, re-flag as pending_review
    if (req.user.role === "reporter" && article.status !== "draft") {
      article.status = "pending_review";
    }

    await article.save();

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating article",
      error: error.message
    });
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private (Author, Editor, Admin)
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    // Check ownership unless admin/editor
    if (
      article.author &&
      article.author.toString() !== req.user._id.toString() &&
      !["admin", "editor"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this article"
      });
    }

    await article.deleteOne();

    res.status(200).json({
      success: true,
      message: "Article deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting article",
      error: error.message
    });
  }
};

// @desc    Render server-side HTML with dynamic Open Graph (og:image) tags for social media previews
// @route   GET /api/articles/share/:slug, GET /share/:slug, GET /news/:slug
// @access  Public
export const renderArticleShareHtml = async (req, res) => {
  try {
    const { slug } = req.params;

    // Helper to escape HTML special characters to prevent XSS/broken attributes
    const escapeHtml = (str = "") =>
      String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // Determine Frontend Base URL
    let frontendUrl = (process.env.FRONTEND_URL || process.env.CLIENT_URL || "").replace(/\/$/, "");
    if (!frontendUrl) {
      const host = req.get("host") || "";
      if (host.includes("localhost") || host.includes("127.0.0.1")) {
        frontendUrl = "http://localhost:5173";
      } else {
        const proto = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
        frontendUrl = `${proto}://${host}`;
      }
    }

    if (!slug) {
      return res.redirect(frontendUrl || "/");
    }

    // Lookup Article by Mongo _id, clean English slug, or decoded Gurmukhi slug
    let article = null;
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      article = await Article.findById(slug);
    } else {
      article = await Article.findOne({ slug });
      if (!article) {
        try {
          const decoded = decodeURIComponent(slug);
          article = await Article.findOne({ slug: decoded });
        } catch {}
      }
      if (!article) {
        const tsMatch = String(slug).match(/(\d{10,14})/);
        if (tsMatch) {
          article = await Article.findOne({ slug: { $regex: tsMatch[1] } });
        }
      }
    }

    if (!article) {
      return res.redirect(`${frontendUrl}/`);
    }

    // Determine target URL for the actual article page on frontend
    const articleSlugOrId = article.slug || article._id;
    const targetUrl = `${frontendUrl}/news/${articleSlugOrId}`;

    // Process article image into high-resolution, absolute URL for social crawlers (1200x630)
    let imageUrl = article.featuredImage || "/img/index_800x400-image01.jpg";
    if (imageUrl.includes("res.cloudinary.com") && imageUrl.includes("/image/upload/")) {
      const uploadIdx = imageUrl.indexOf("/image/upload/");
      const prefix = imageUrl.substring(0, uploadIdx + "/image/upload/".length);
      let suffix = imageUrl.substring(uploadIdx + "/image/upload/".length);
      suffix = suffix.replace(/^(?:w_\d+,?|h_\d+,?|c_[a-z]+,?|q_[a-z0-9:]+,?|f_[a-z0-9]+,?|dpr_[a-z0-9.]+,?)+\//i, "");
      imageUrl = `${prefix}c_fill,w_1200,h_630,g_auto,f_jpg,q_auto:best/${suffix}`;
    } else if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
      imageUrl = `${frontendUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    }

    const title = article.seoTitle || article.title || "Punjab Files | 24h News";
    const description =
      article.metaDescription ||
      article.excerpt ||
      (article.content ? article.content.replace(/<[^>]*>/g, "").slice(0, 180).trim() + "..." : "") ||
      "ਪੰਜਾਬ ਫਾਈਲਜ਼ - 24 ਘੰਟੇ ਨਿਰਪੱਖ, ਸੱਚੀਆਂ ਅਤੇ ਭਰੋਸੇਯੋਗ ਜ਼ਮੀਨੀ ਖ਼ਬਰਾਂ";

    // Set HTML response headers
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");

    const html = `<!DOCTYPE html>
<html lang="pa" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">

  <!-- Open Graph Meta Tags (WhatsApp, Facebook, LinkedIn, Telegram) -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Punjab Files">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="${escapeHtml(title)}">
  <meta property="og:url" content="${escapeHtml(targetUrl)}">

  <!-- Twitter / X Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@punjabfiles">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
  <meta name="twitter:image:alt" content="${escapeHtml(title)}">

  <!-- Instant Browser Redirection for Human Visitors -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(targetUrl)}">
  <script>
    window.location.replace(${JSON.stringify(targetUrl)});
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center;">
  <div style="max-width: 460px; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    <div style="width: 38px; height: 38px; border: 3px solid #f1f5f9; border-top: 3px solid #b71c1c; border-radius: 50%; margin: 0 auto 16px; animation: spin 0.8s linear infinite;"></div>
    <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 800; color: #0f172a;">ਖ਼ਬਰ ਖੁੱਲ੍ਹ ਰਹੀ ਹੈ...</h3>
    <p style="margin: 0 0 16px; font-size: 13px; color: #64748b;">(Redirecting to Punjab Files...)</p>
    <a href="${escapeHtml(targetUrl)}" style="display: inline-block; background-color: #b71c1c; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 9px 20px; border-radius: 6px;">ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ (Click here if not redirected)</a>
  </div>
  <style>
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</body>
</html>`;

    return res.status(200).send(html);
  } catch (error) {
    console.error("Error in renderArticleShareHtml:", error);
    const fallbackUrl = process.env.FRONTEND_URL || "https://punjabfiles.com";
    return res.redirect(fallbackUrl);
  }
};
