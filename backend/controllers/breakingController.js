import BreakingNews from "../models/BreakingNews.js";
import Article from "../models/Article.js";

// @desc    Get all active breaking news (Public for top marquee)
// @route   GET /api/breaking
// @access  Public
export const getActiveBreaking = async (req, res) => {
  try {
    // 1. Fetch standalone breaking ticker items
    const customItems = await BreakingNews.find({ isActive: true })
      .populate("articleId", "slug _id title")
      .sort({ priority: -1, createdAt: -1 });

    // 2. Fetch published articles marked as isBreaking
    const breakingArticles = await Article.find({
      status: "published",
      isBreaking: true
    })
      .select("_id title slug category punjabRegion createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    const items = [];

    // Add breaking articles first
    for (const art of breakingArticles) {
      items.push({
        _id: art._id,
        tag: art.punjabRegion || art.category || "ਬਰੇਕਿੰਗ",
        text: art.title,
        slug: art.slug || art._id.toString(),
        articleId: art._id,
        isArticle: true
      });
    }

    // Add custom breaking ticker items
    for (const ci of customItems) {
      if (!items.some((it) => it.text.trim() === ci.text.trim())) {
        let slug = ci.slug || (ci.articleId ? ci.articleId.slug : null);
        let articleId = ci.articleId ? (ci.articleId._id || ci.articleId) : null;

        // If no explicit slug, find if an article with matching title exists
        if (!slug) {
          const matched = await Article.findOne({
            status: "published",
            $or: [{ title: ci.text }, { title: { $regex: ci.text.substring(0, 30), $options: "i" } }]
          }).select("slug _id");
          if (matched) {
            slug = matched.slug || matched._id.toString();
            articleId = matched._id;
          }
        }

        items.push({
          _id: ci._id,
          tag: ci.tag || "ਪੰਜਾਬ",
          text: ci.text,
          slug: slug || null,
          articleId: articleId || null,
          priority: ci.priority
        });
      }
    }

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
    const { tag, text, priority, slug, articleId } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Breaking news text is required"
      });
    }

    const item = await BreakingNews.create({
      tag: tag || "ਪੰਜਾਬ",
      text: text.trim(),
      priority: parseInt(priority, 10) || 0,
      slug: slug || null,
      articleId: articleId || null
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
