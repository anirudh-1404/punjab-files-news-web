import mongoose from "mongoose";

const breakingNewsSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: [true, "Breaking news tag is required"],
      trim: true,
      default: "ਪੰਜਾਬ"
    },
    text: {
      type: String,
      required: [true, "Breaking news text is required"],
      trim: true
    },
    slug: {
      type: String,
      default: null,
      trim: true
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    priority: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

breakingNewsSchema.index({ isActive: 1, priority: -1, createdAt: -1 });

const BreakingNews = mongoose.model("BreakingNews", breakingNewsSchema);

export default BreakingNews;
