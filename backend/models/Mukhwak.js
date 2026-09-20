import mongoose from "mongoose";

const mukhwakSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Mukhwak date is required"],
      trim: true
    },
    title: {
      type: String,
      default: "ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ • ਰੋਜ਼ਾਨਾ ਹੁਕਮਨਾਮਾ",
      trim: true
    },
    location: {
      type: String,
      default: "ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ",
      trim: true
    },
    raag: {
      type: String,
      required: [true, "Raag information is required"],
      trim: true
    },
    ang: {
      type: String,
      required: [true, "Ang (page number) is required"],
      trim: true
    },
    gurbani: {
      type: String,
      required: [true, "Gurbani lines are required"]
    },
    viakhya: {
      type: String,
      required: [true, "Punjabi viakhya (translation/meaning) is required"]
    },
    englishTranslation: {
      type: String,
      default: "",
      trim: true
    },
    image: {
      type: String,
      default: "/img/darbar-sahib-mukhwak.jpg"
    },
    sgpcLink: {
      type: String,
      default: "https://sgpc.net/hukamnama/"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    authorName: {
      type: String,
      default: "ਸੰਪਾਦਕੀ ਡੈਸਕ"
    }
  },
  {
    timestamps: true
  }
);

// Indexing for rapid retrieval
mukhwakSchema.index({ isActive: 1, createdAt: -1 });

const Mukhwak = mongoose.model("Mukhwak", mukhwakSchema);
export default Mukhwak;
