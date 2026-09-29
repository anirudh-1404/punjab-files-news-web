import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    namePa: {
      type: String,
      required: [true, "Category Punjabi name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    nameEn: {
      type: String,
      required: [true, "Category English name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    icon: {
      type: String,
      default: "fa-newspaper-o",
      trim: true
    },
    order: {
      type: Number,
      default: 0
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-seed default core categories helper
export const DEFAULT_CATEGORIES = [
  { namePa: "ਪੰਜਾਬ", nameEn: "Punjab", slug: "punjab", icon: "fa-map-marker", order: 1, isDefault: true },
  { namePa: "ਧਰਮ ਤੇ ਵਿਰਾਸਤ", nameEn: "Religion", slug: "religion", icon: "fa-sun-o", order: 2, isDefault: true },
  { namePa: "ਦੇਸ਼-ਵਿਦੇਸ਼", nameEn: "National & World", slug: "world", icon: "fa-globe", order: 3, isDefault: true },
  { namePa: "ਖੇਡਾਂ", nameEn: "Sports", slug: "sport", icon: "fa-trophy", order: 4, isDefault: true },
  { namePa: "ਸਿਹਤ", nameEn: "Health", slug: "health", icon: "fa-heartbeat", order: 5, isDefault: true },
  { namePa: "ਸੈਰ-ਸਪਾਟਾ", nameEn: "Travel", slug: "travel", icon: "fa-plane", order: 6, isDefault: true },
  { namePa: "ਮਨੋਰੰਜਨ", nameEn: "Entertainment", slug: "art-entertainment", icon: "fa-film", order: 7, isDefault: true },
  { namePa: "ਰਾਜਨੀਤੀ", nameEn: "Politics", slug: "politics", icon: "fa-university", order: 8, isDefault: true },
  { namePa: "ਵਪਾਰ", nameEn: "Business", slug: "business", icon: "fa-line-chart", order: 9, isDefault: true }
];

const Category = mongoose.model("Category", categorySchema);

export default Category;
