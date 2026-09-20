import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

// @desc    Upload media (Image or Video) to Cloudinary
// @route   POST /api/upload
// @access  Private (Admin, Editor, Reporter)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a photo or video file to upload"
      });
    }

    const isVideo = req.file.mimetype.startsWith("video/");
    const uploadOptions = {
      folder: isVideo ? "punjab_files/videos" : "punjab_files/news",
      resource_type: isVideo ? "video" : "image"
    };

    if (!isVideo) {
      uploadOptions.transformation = [
        { quality: "auto", fetch_format: "auto" } // automatic compression & optimal web format
      ];
    }

    // Pipe the multer buffer directly to Cloudinary upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          let friendlyMsg = error.message || "Cloudinary upload failed";
          if (friendlyMsg.includes("cloud_name is disabled")) {
            friendlyMsg = "Cloudinary account / cloud_name disabled hai. Kripya Cloudinary console me account status ya verification check karein.";
          } else if (friendlyMsg.includes("missing permissions") || friendlyMsg.includes("403")) {
            friendlyMsg = "Cloudinary API key permissions error (403). Kripya full write access API key use karein.";
          }
          return res.status(500).json({
            success: false,
            message: friendlyMsg,
            error: error.message
          });
        }

        return res.status(200).json({
          success: true,
          message: isVideo ? "Video uploaded successfully" : "Image uploaded successfully",
          mediaType: isVideo ? "video" : "image",
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width || null,
          height: result.height || null,
          format: result.format,
          duration: result.duration || null
        });
      }
    );

    // Convert buffer to stream and pipe
    const stream = Readable.from(req.file.buffer);
    stream.pipe(uploadStream);
  } catch (error) {
    console.error("Upload controller exception:", error);
    res.status(500).json({
      success: false,
      message: "Server error during media upload",
      error: error.message
    });
  }
};

