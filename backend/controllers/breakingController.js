import BreakingNews from "../models/BreakingNews.js";

// @desc    Get all active breaking news (Public for top marquee)
// @route   GET /api/breaking
// @access  Public
export const getActiveBreaking = async (req, res) => {
  try {
    const items = await BreakingNews.find({ isActive: true }).sort({ priority: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching breaking news",
      error: error.message
    });
  }
};

// @desc    Create new breaking news item
// @route   POST /api/breaking
// @access  Private (Editor, Admin)
export const createBreaking = async (req, res) => {
  try {
    const { tag, text, priority } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Breaking news text is required"
      });
    }

    const item = await BreakingNews.create({
      tag: tag || "ਪੰਜਾਬ",
      text: text.trim(),
      priority: parseInt(priority, 10) || 0
    });

    res.status(201).json({
      success: true,
      message: "Breaking news added successfully",
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating breaking news",
      error: error.message
    });
  }
};

// @desc    Update breaking news item
// @route   PUT /api/breaking/:id
// @access  Private (Editor, Admin)
export const updateBreaking = async (req, res) => {
  try {
    const item = await BreakingNews.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Breaking news item not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Breaking news updated successfully",
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating breaking news",
      error: error.message
    });
  }
};

// @desc    Delete breaking news item
// @route   DELETE /api/breaking/:id
// @access  Private (Editor, Admin)
export const deleteBreaking = async (req, res) => {
  try {
    const item = await BreakingNews.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Breaking news item not found"
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Breaking news item deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting breaking news",
      error: error.message
    });
  }
};
