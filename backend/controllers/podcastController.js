import Podcast from "../models/Podcast.js";

// @desc    Get published podcasts (Public)
// @route   GET /api/podcasts
// @access  Public
export const getPublishedPodcasts = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query = { status: "published" };
    const total = await Podcast.countDocuments(query);
    const podcasts = await Podcast.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: podcasts.length,
      total,
      data: podcasts,
      podcasts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching published podcasts",
      error: error.message
    });
  }
};

// @desc    Get staff podcasts (Reporter, Editor, Admin)
// @route   GET /api/podcasts/staff/all
// @access  Private (Staff)
export const getAllStaffPodcasts = async (req, res) => {
  try {
    const userRole = req.user?.role || "reporter";
    const userId = req.user?._id;

    let query = {};
    if (userRole === "reporter") {
      // Reporter only sees their own podcasts
      query.author = userId;
    }
    // Editor and Admin see all podcasts

    const podcasts = await Podcast.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "name email role")
      .populate("editorReviewedBy", "name email")
      .populate("adminApprovedBy", "name email");

    res.status(200).json({
      success: true,
      count: podcasts.length,
      data: podcasts,
      podcasts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching staff podcasts",
      error: error.message
    });
  }
};

// @desc    Create new podcast
// @route   POST /api/podcasts
// @access  Private (Staff)
export const createPodcast = async (req, res) => {
  try {
    const {
      title,
      description,
      host,
      mediaType,
      mediaUrl,
      thumbnail,
      duration,
      episodeNumber
    } = req.body;

    if (!title || !description || !mediaUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description and media URL"
      });
    }

    const userRole = req.user?.role || "reporter";
    let status = "pending_editor";
    let publishedAt = null;

    if (userRole === "admin") {
      status = "published";
      publishedAt = new Date();
    } else if (userRole === "editor") {
      status = "pending_admin";
    } else {
      // Reporter
      status = "pending_editor";
    }

    const podcast = await Podcast.create({
      title,
      description,
      host: host || req.user?.name || "ਪੰਜਾਬ ਫਾਈਲਜ਼ ਟੀਮ",
      mediaType: mediaType || "youtube",
      mediaUrl,
      thumbnail: thumbnail || "/img/index_800x400-image01.jpg",
      duration: duration || "20:00",
      episodeNumber: episodeNumber || 1,
      author: req.user?._id,
      authorName: req.user?.name || "ਸਟਾਫ਼",
      status,
      publishedAt
    });

    res.status(201).json({
      success: true,
      data: podcast,
      message:
        status === "published"
          ? "ਪੋਡਕਾਸਟ ਸਫਲਤਾਪੂਰਵਕ ਪ੍ਰਕਾਸ਼ਿਤ ਹੋ ਗਿਆ ਹੈ।"
          : status === "pending_admin"
          ? "ਪੋਡਕਾਸਟ ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ ਲਈ ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ।"
          : "ਪੋਡਕਾਸਟ ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਲਈ ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ।"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating podcast",
      error: error.message
    });
  }
};

// @desc    Update podcast status (Editor / Admin workflow)
// @route   PUT /api/podcasts/:id/status
// @access  Private (Editor, Admin)
export const updatePodcastStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user?.role;

    const podcast = await Podcast.findById(id);
    if (!podcast) {
      return res.status(404).json({
        success: false,
        message: "Podcast not found"
      });
    }

    // Role-based status transitions
    if (userRole === "editor") {
      if (!["pending_admin", "rejected"].includes(status)) {
        return res.status(403).json({
          success: false,
          message: "Editors can only review and forward to Admin (pending_admin) or reject."
        });
      }
      podcast.status = status;
      podcast.editorReviewedBy = req.user._id;
      podcast.editorReviewedAt = new Date();
    } else if (userRole === "admin") {
      podcast.status = status;
      if (status === "published") {
        podcast.publishedAt = new Date();
      }
      podcast.adminApprovedBy = req.user._id;
      podcast.adminApprovedAt = new Date();
    } else {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update podcast status"
      });
    }

    await podcast.save();

    res.status(200).json({
      success: true,
      data: podcast,
      message: `Podcast status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating podcast status",
      error: error.message
    });
  }
};

// @desc    Delete podcast
// @route   DELETE /api/podcasts/:id
// @access  Private (Staff)
export const deletePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    const podcast = await Podcast.findById(id);
    if (!podcast) {
      return res.status(404).json({
        success: false,
        message: "Podcast not found"
      });
    }

    const userRole = req.user?.role;
    const userId = req.user?._id.toString();

    // Admin, Editor, or original Author can delete
    if (userRole !== "admin" && userRole !== "editor" && podcast.author?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this podcast"
      });
    }

    await Podcast.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Podcast deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting podcast",
      error: error.message
    });
  }
};
