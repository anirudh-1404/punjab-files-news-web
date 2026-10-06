import mongoose from "mongoose";

const webTVSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
      trim: true,
      default: "https://www.youtube.com/watch?v=6OW56yMNB1g"
    },
    embedUrl: {
      type: String,
      required: true,
      trim: true,
      default: "https://www.youtube-nocookie.com/embed/6OW56yMNB1g?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0"
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
    isActive: {
      type: Boolean,
      default: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    updatedByName: {
      type: String,
      default: "Admin"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("WebTV", webTVSchema);
