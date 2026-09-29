import mongoose from "mongoose";
import Category, { DEFAULT_CATEGORIES } from "../models/Category.js";

// Helper to slugify English text
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// Seed default categories if none exist and ensure core categories have isDefault: true
export const ensureDefaultCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      console.log("Successfully seeded default categories into MongoDB.");
    } else {
      // Ensure all 9 core default categories have isDefault: true
      const coreSlugs = DEFAULT_CATEGORIES.map((c) => c.slug);
      await Category.updateMany(
        { slug: { $in: coreSlugs } },
        { $set: { isDefault: true } }
      );
    }
  } catch (error) {
    console.error("Error auto-seeding categories:", error.message);
  }
};

/**
 * @desc    Get all categories (public)
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    let categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

    // Auto-seed on first fetch if completely empty
    if (categories.length === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error("getCategories error:", error);
    res.status(500).json({
      success: false,
      message: "ਕੈਟੇਗਰੀਆਂ ਲੋਡ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ (Error loading categories)",
      error: error.message
    });
  }
};

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res) => {
  try {
    const { namePa, nameEn, slug, icon, order } = req.body;

    if (!namePa || !nameEn) {
      return res.status(400).json({
        success: false,
        message: "ਪੰਜਾਬੀ ਨਾਮ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਨਾਮ ਦੋਵੇਂ ਲਾਜ਼ਮੀ ਹਨ (Both Punjabi and English names are required)"
      });
    }

    const finalSlug = slug ? slugify(slug) : slugify(nameEn);

    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਸਹੀ ਸਲੱਗ/URL ਕੀ ਦਰਜ ਕਰੋ (Invalid slug)"
      });
    }

    const existing = await Category.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `ਇਸ ਸਲੱਗ ('${finalSlug}') ਨਾਲ ਕੈਟੇਗਰੀ ਪਹਿਲਾਂ ਤੋਂ ਮੌਜੂਦ ਹੈ (Category with this slug already exists)`
      });
    }

    const category = await Category.create({
      namePa: namePa.trim(),
      nameEn: nameEn.trim(),
      slug: finalSlug,
      icon: icon ? icon.trim() : "fa-newspaper-o",
      order: order !== undefined ? Number(order) : 10,
      isDefault: false,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: "ਨਵੀਂ ਕੈਟੇਗਰੀ ਸਫ਼ਲਤਾਪੂਰਵਕ ਬਣਾਈ ਗਈ (Category created successfully)",
      data: category
    });
  } catch (error) {
    console.error("createCategory error:", error);
    res.status(500).json({
      success: false,
      message: "ਕੈਟੇਗਰੀ ਬਣਾਉਣ ਵਿੱਚ ਗਲਤੀ (Error creating category)",
      error: error.message
    });
  }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { namePa, nameEn, icon, order, isActive, slug } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ਗਲਤ ਕੈਟੇਗਰੀ ਆਈ.ਡੀ (Invalid category ID)"
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "ਕੈਟੇਗਰੀ ਨਹੀਂ ਮਿਲੀ (Category not found)"
      });
    }

    if (namePa) category.namePa = namePa.trim();
    if (nameEn) category.nameEn = nameEn.trim();
    if (icon) category.icon = icon.trim();
    if (order !== undefined) category.order = Number(order);
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    // Only allow changing slug if not a default core category
    if (slug && !category.isDefault) {
      const newSlug = slugify(slug);
      const duplicate = await Category.findOne({ slug: newSlug, _id: { $ne: id } });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `ਇਸ ਸਲੱਗ ('${newSlug}') ਨਾਲ ਦੂਜੀ ਕੈਟੇਗਰੀ ਪਹਿਲਾਂ ਤੋਂ ਹੈ (Slug already in use)`
        });
      }
      category.slug = newSlug;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "ਕੈਟੇਗਰੀ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਕੀਤੀ ਗਈ (Category updated successfully)",
      data: category
    });
  } catch (error) {
    console.error("updateCategory error:", error);
    res.status(500).json({
      success: false,
      message: "ਕੈਟੇਗਰੀ ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਗਲਤੀ (Error updating category)",
      error: error.message
    });
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ਗਲਤ ਕੈਟੇਗਰੀ ਆਈ.ਡੀ (Invalid category ID)"
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "ਕੈਟੇਗਰੀ ਨਹੀਂ ਮਿਲੀ (Category not found)"
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "ਕੈਟੇਗਰੀ ਸਫ਼ਲਤਾਪੂਰਵਕ ਡਿਲੀਟ ਕੀਤੀ ਗਈ (Category deleted successfully)"
    });
  } catch (error) {
    console.error("deleteCategory error:", error);
    res.status(500).json({
      success: false,
      message: "ਕੈਟੇਗਰੀ ਡਿਲੀਟ ਕਰਨ ਵਿੱਚ ਗਲਤੀ (Error deleting category)",
      error: error.message
    });
  }
};
