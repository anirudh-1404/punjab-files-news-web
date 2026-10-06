import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "ਫ਼ੋਟੋ ਦਾ ਸਿਰਲੇਖ ਲਾਜ਼ਮੀ ਹੈ (Title is required)"],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, "ਫ਼ੋਟੋ ਦਾ ਲਿੰਕ / ਫਾਈਲ ਲਾਜ਼ਮੀ ਹੈ (Image URL is required)"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "ਕੈਟੇਗਰੀ ਚੁਣਨਾ ਲਾਜ਼ਮੀ ਹੈ (Category is required)"],
      default: "punjab",
      trim: true,
      lowercase: true
    },
    categoryNamePa: {
      type: String,
      default: "ਪੰਜਾਬ",
      trim: true
    },
    caption: {
      type: String,
      trim: true,
      default: ""
    },
    photographer: {
      type: String,
      trim: true,
      default: "ਪੰਜਾਬ ਫਾਈਲਜ਼ ਡੈਸਕ"
    },
    eventDate: {
      type: String,
      trim: true,
      default: ""
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
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

// Indexes for fast category filtering and sorting
gallerySchema.index({ category: 1, isPublished: 1, createdAt: -1 });
gallerySchema.index({ isPublished: 1, createdAt: -1 });

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
