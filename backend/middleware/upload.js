import multer from "multer";

// Use in-memory storage so we can stream directly to Cloudinary without saving to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Image formats
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "image/avif",
    "image/gif",
    // Video formats
    "video/mp4",
    "video/webm",
    "video/quicktime", // .mov
    "video/x-matroska", // .mkv
    "video/ogg"
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, WEBP, GIF, and MP4/WEBM/MOV videos are allowed."
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB limit for photos & videos
  },
  fileFilter
});

