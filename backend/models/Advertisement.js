import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Advertisement title / sponsor name is required"],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, "Ad banner image URL is required"],
      trim: true
    },
    targetUrl: {
      type: String,
      trim: true,
      default: ""
    },
    slot: {
      type: String,
      required: [true, "Placement slot is required"],
      enum: [
        "header_leaderboard",      // 728x90 Next to Logo / Header
        "home_middle_banner",      // 970x90 or 820x100 Mid-feed Horizontal Strip
        "sidebar_rectangle",       // 300x250 Medium Rectangle Box
        "sidebar_halfpage",        // 300x600 Vertical Half-Page Banner
        "article_top_banner",      // 728x90 / Responsive Top of Article
        "article_bottom_banner",   // 728x90 / Responsive End of Article
        "podcasts_banner"          // 970x90 / Responsive on Podcasts page
      ],
      index: true
    },
    sizeLabel: {
      type: String,
      trim: true,
      default: "Responsive"
    },
    startDate: {
      type: String, // "YYYY-MM-DD"
      default: null
    },
    endDate: {
      type: String, // "YYYY-MM-DD"
      default: null
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    openInNewTab: {
      type: Boolean,
      default: true
    },
    priority: {
      type: Number,
      default: 0
    },
    clicksCount: {
      type: Number,
      default: 0
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    createdByName: {
      type: String,
      default: "Admin"
    }
  },
  {
    timestamps: true
  }
);

advertisementSchema.index({ slot: 1, isActive: 1, priority: -1 });

export default mongoose.model("Advertisement", advertisementSchema);
