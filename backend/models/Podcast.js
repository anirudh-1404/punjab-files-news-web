import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Podcast title is required"],
      trim: true,
      maxlength: [300, "Title cannot exceed 300 characters"]
    },
    description: {
      type: String,
      required: [true, "Podcast description is required"],
      trim: true
    },
    host: {
      type: String,
      default: "ਪੰਜਾਬ ਫਾਈਲਜ਼ ਟੀਮ",
      trim: true
    },
    mediaType: {
      type: String,
      enum: ["youtube", "audio"],
      default: "youtube"
    },
    mediaUrl: {
      type: String,
      required: [true, "Media URL or YouTube link is required"],
      trim: true
    },
    thumbnail: {
      type: String,
      default: "/img/index_800x400-image01.jpg"
    },
    duration: {
      type: String,
      default: "20:00",
      trim: true
    },
    episodeNumber: {
      type: Number,
      default: 1
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    authorName: {
      type: String,
      default: "ਪੱਤਰਕਾਰ"
    },
    status: {
      type: String,
      enum: ["draft", "pending_editor", "pending_admin", "published", "rejected"],
      default: "pending_editor"
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
    views: {
      type: Number,
      default: 0
    },
    publishedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for fast query
podcastSchema.index({ status: 1, publishedAt: -1, createdAt: -1 });

export default mongoose.model("Podcast", podcastSchema);
