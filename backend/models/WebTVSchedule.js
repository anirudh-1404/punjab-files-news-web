import mongoose from "mongoose";

const webTVScheduleSchema = new mongoose.Schema(
  {
    scheduledDate: {
      type: String, // Format "YYYY-MM-DD" e.g. "2026-10-07"
      required: [true, "Scheduled date is required"],
      trim: true,
      index: true
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
      trim: true
    },
    embedUrl: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      trim: true,
      default: "24x7 HD ਪ੍ਰਸਾਰਣ"
    },
    badge: {
      type: String,
      trim: true,
      default: "ON AIR • WEB TV"
    },
    quality: {
      type: String,
      trim: true,
      default: "1080p HD"
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
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

webTVScheduleSchema.index({ scheduledDate: 1, isActive: 1 });

export default mongoose.model("WebTVSchedule", webTVScheduleSchema);
