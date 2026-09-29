import mongoose from "mongoose";
import { generateEnglishSlug } from "../utils/slugUtils.js";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Article title is required"],
      trim: true,
      maxlength: [300, "Title cannot exceed 300 characters"]
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"]
    },
    content: {
      type: String,
      required: [true, "Article content is required"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "punjab",
        "religion",
        "world",
        "sport",
        "sports",
        "health",
        "travel",
        "art-entertainment",
        "entertainment",
        "deals",
        "environment",
        "autos",
        "general",
        "politics"
      ],
      default: "punjab"
    },
    punjabRegion: {
      type: String,
      enum: ["majha", "malwa", "doaba", null],
      default: null
    },
    language: {
      type: String,
      enum: ["pa", "hi", "en"],
      default: "pa"
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    authorName: {
      type: String,
      default: "ਪੰਜਾਬ ਫਾਈਲਜ਼ ਪੱਤਰਕਾਰ"
    },
    featuredImage: {
      type: String,
      default: "/img/index_800x400-image01.jpg"
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image"
    },
    videoUrl: {
      type: String,
      default: null
    },
    isBreaking: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["draft", "pending_review", "pending_editor", "pending_admin", "published", "rejected"],
      default: "pending_editor"
    },
    publishedAt: {
      type: Date,
      default: null
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    editorReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    editorReviewedAt: {
      type: Date,
      default: null
    },
    adminApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    adminApprovedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      default: null
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate clean English slug and manage publishedAt before save
articleSchema.pre("save", function () {
  // If slug is missing or contains any non-ASCII characters (like Gurmukhi \u0A00-\u0A7F)
  if (!this.slug || /[^\x00-\x7F]/.test(this.slug)) {
    this.slug = generateEnglishSlug(this.title, this.slug);
  } else {
    // Sanitize existing slug to ensure it only has lowercase letters, numbers, and hyphens
    this.slug = this.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // If status is published and publishedAt is not set, set it to now
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

// Index for high performance queries
articleSchema.index({ status: 1, category: 1, punjabRegion: 1, language: 1 });
articleSchema.index({ views: -1 });
articleSchema.index({ createdAt: -1 });

const Article = mongoose.model("Article", articleSchema);

export default Article;
