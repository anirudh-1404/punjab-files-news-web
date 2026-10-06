import Gallery from "../models/Gallery.js";

// Helper map for default Punjabi category names
const CATEGORY_NAMES_MAP = {
  punjab: "ਪੰਜਾਬ (Punjab)",
  events: "ਸਮਾਗਮ ਤੇ ਰੈਲੀਆਂ (Events)",
  heritage: "ਵਿਰਸਾ ਤੇ ਸੱਭਿਆਚਾਰ (Heritage)",
  sports: "ਖੇਡ ਜਗਤ (Sports)",
  religion: "ਧਰਮ ਤੇ ਅਧਿਆਤਮ (Religion)",
  politics: "ਰਾਜਨੀਤੀ (Politics)",
  entertainment: "ਮਨੋਰੰਜਨ (Entertainment)",
  general: "ਆਮ ਤਸਵੀਰਾਂ (General)"
};

// @desc    Get published gallery photos (Public for frontend)
// @route   GET /api/gallery
export const getPublicGallery = async (req, res) => {
  try {
    const { category, limit = 50, page = 1 } = req.query;

    const query = { isPublished: true };

    if (category && category !== "all") {
      query.category = category.toLowerCase().trim();
    }

    const pageSize = Math.min(Number(limit) || 50, 100);
    const skip = (Math.max(Number(page) || 1, 1) - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      Gallery.find(query)
        .sort({ order: -1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Gallery.countDocuments(query)
    ]);

    // Aggregate unique categories with counts
    const categoryCounts = await Gallery.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    return res.status(200).json({
      success: true,
      count: items.length,
      total: totalCount,
      page: Number(page) || 1,
      totalPages: Math.ceil(totalCount / pageSize),
      data: items,
      categories: categoryCounts
    });
  } catch (error) {
    console.error("Error fetching gallery photos:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਗੈਲਰੀ ਤਸਵੀਰਾਂ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੋ ਸਕੀਆਂ",
      error: error.message
    });
  }
};

// @desc    Get all gallery photos (Protected for Admin & Editor)
// @route   GET /api/gallery/admin
export const getAdminGallery = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const query = {};

    if (category && category !== "all") {
      query.category = category.toLowerCase().trim();
    }

    if (status === "published") {
      query.isPublished = true;
    } else if (status === "draft") {
      query.isPublished = false;
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { caption: { $regex: search.trim(), $options: "i" } },
        { photographer: { $regex: search.trim(), $options: "i" } }
      ];
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error("Error fetching admin gallery photos:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਗੈਲਰੀ ਸੂਚੀ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੋ ਸਕੀ",
      error: error.message
    });
  }
};

// @desc    Create a new gallery photo item (Protected for Admin & Editor)
// @route   POST /api/gallery
export const createGalleryItem = async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      category,
      categoryNamePa,
      caption,
      photographer,
      eventDate,
      isPublished,
      order
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "ਫ਼ੋਟੋ ਦਾ ਸਿਰਲੇਖ ਲਾਜ਼ਮੀ ਹੈ (Title is required)"
      });
    }

    if (!imageUrl || !imageUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "ਫ਼ੋਟੋ ਦੀ ਫਾਈਲ ਜਾਂ URL ਲਿੰਕ ਲਾਜ਼ਮੀ ਹੈ (Image URL is required)"
      });
    }

    const cleanCategory = (category || "punjab").toLowerCase().trim();
    const resolvedNamePa =
      categoryNamePa && categoryNamePa.trim()
        ? categoryNamePa.trim()
        : CATEGORY_NAMES_MAP[cleanCategory] || cleanCategory;

    const newItem = await Gallery.create({
      title: title.trim(),
      imageUrl: imageUrl.trim(),
      category: cleanCategory,
      categoryNamePa: resolvedNamePa,
      caption: caption ? caption.trim() : "",
      photographer: photographer ? photographer.trim() : "ਪੰਜਾਬ ਫਾਈਲਜ਼ ਡੈਸਕ",
      eventDate: eventDate ? eventDate.trim() : "",
      isPublished: isPublished !== false,
      order: Number(order) || 0,
      createdBy: req.user?._id,
      createdByName: req.user?.name || req.user?.username || "Admin"
    });

    return res.status(201).json({
      success: true,
      message: "ਫ਼ੋਟੋ ਗੈਲਰੀ ਵਿੱਚ ਸਫ਼ਲਤਾਪੂਰਵਕ ਸ਼ਾਮਲ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ!",
      data: newItem
    });
  } catch (error) {
    console.error("Error creating gallery photo:", error);
    return res.status(500).json({
      success: false,
      message: "ਫ਼ੋਟੋ ਸੇਵ ਕਰਨ ਵਿੱਚ ਤਰੁੱਟੀ",
      error: error.message
    });
  }
};

// @desc    Update a gallery photo (Protected for Admin & Editor)
// @route   PUT /api/gallery/:id
export const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "ਫ਼ੋਟੋ ਨਹੀਂ ਮਿਲੀ (Gallery photo not found)"
      });
    }

    const {
      title,
      imageUrl,
      category,
      categoryNamePa,
      caption,
      photographer,
      eventDate,
      isPublished,
      order
    } = req.body;

    if (title) item.title = title.trim();
    if (imageUrl) item.imageUrl = imageUrl.trim();
    if (category) {
      item.category = category.toLowerCase().trim();
      item.categoryNamePa =
        categoryNamePa && categoryNamePa.trim()
          ? categoryNamePa.trim()
          : CATEGORY_NAMES_MAP[item.category] || item.category;
    }
    if (caption !== undefined) item.caption = caption.trim();
    if (photographer !== undefined) item.photographer = photographer.trim();
    if (eventDate !== undefined) item.eventDate = eventDate.trim();
    if (isPublished !== undefined) item.isPublished = Boolean(isPublished);
    if (order !== undefined) item.order = Number(order) || 0;

    await item.save();

    return res.status(200).json({
      success: true,
      message: "ਗੈਲਰੀ ਫ਼ੋਟੋ ਅੱਪਡੇਟ ਹੋ ਗਈ ਹੈ!",
      data: item
    });
  } catch (error) {
    console.error("Error updating gallery photo:", error);
    return res.status(500).json({
      success: false,
      message: "ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਤਰੁੱਟੀ",
      error: error.message
    });
  }
};

// @desc    Delete a gallery photo (Protected for Admin & Editor)
// @route   DELETE /api/gallery/:id
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "ਫ਼ੋਟੋ ਨਹੀਂ ਮਿਲੀ"
      });
    }

    await Gallery.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "ਗੈਲਰੀ ਫ਼ੋਟੋ ਹਟਾ ਦਿੱਤੀ ਗਈ ਹੈ।"
    });
  } catch (error) {
    console.error("Error deleting gallery photo:", error);
    return res.status(500).json({
      success: false,
      message: "ਹਟਾਉਣ ਵਿੱਚ ਤਰੁੱਟੀ",
      error: error.message
    });
  }
};

// @desc    Toggle published status (Protected for Admin & Editor)
// @route   PUT /api/gallery/:id/toggle
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "ਫ਼ੋਟੋ ਨਹੀਂ ਮਿਲੀ"
      });
    }

    item.isPublished = !item.isPublished;
    await item.save();

    return res.status(200).json({
      success: true,
      message: item.isPublished ? "ਫ਼ੋਟੋ ਪਬਲਿਸ਼ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ।" : "ਫ਼ੋਟੋ ਨੂੰ ਅਣ-ਪਬਲਿਸ਼ (ਡਰਾਫਟ) ਕੀਤਾ ਗਿਆ।",
      isPublished: item.isPublished,
      data: item
    });
  } catch (error) {
    console.error("Error toggling gallery publish status:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਟੇਟਸ ਬਦਲਣ ਵਿੱਚ ਤਰੁੱਟੀ",
      error: error.message
    });
  }
};
