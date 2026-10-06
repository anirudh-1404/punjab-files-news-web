import Advertisement from "../models/Advertisement.js";

// Helper to get today's date in "YYYY-MM-DD" format (Asia/Kolkata timezone)
function getTodayDateString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

// @desc    Get all active ads (Public for frontend placements)
// @route   GET /api/ads/active
export const getActiveAds = async (req, res) => {
  try {
    const todayStr = getTodayDateString();
    const { slot } = req.query;

    const query = {
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: null },
            { startDate: "" },
            { startDate: { $lte: todayStr } }
          ]
        },
        {
          $or: [
            { endDate: null },
            { endDate: "" },
            { endDate: { $gte: todayStr } }
          ]
        }
      ]
    };

    if (slot && slot !== "all") {
      query.slot = slot;
    }

    const ads = await Advertisement.find(query).sort({ priority: -1, updatedAt: -1 });

    // Build a map by slot for easy frontend lookup
    const adsBySlot = {};
    for (const ad of ads) {
      if (!adsBySlot[ad.slot]) {
        adsBySlot[ad.slot] = ad;
      }
    }

    return res.status(200).json({
      success: true,
      count: ads.length,
      data: ads,
      bySlot: adsBySlot,
      todayDate: todayStr
    });
  } catch (error) {
    console.error("Error fetching active ads:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਇਸ਼ਤਿਹਾਰ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੋ ਸਕੇ",
      error: error.message
    });
  }
};

// @desc    Get all ads (Protected for Admin & Editor)
// @route   GET /api/ads
export const getAllAds = async (req, res) => {
  try {
    const { slot, status } = req.query;
    const query = {};

    if (slot && slot !== "all") {
      query.slot = slot;
    }

    if (status === "active") {
      query.isActive = true;
    } else if (status === "inactive") {
      query.isActive = false;
    }

    const ads = await Advertisement.find(query).sort({ createdAt: -1 });
    const todayDate = getTodayDateString();

    return res.status(200).json({
      success: true,
      count: ads.length,
      data: ads,
      todayDate
    });
  } catch (error) {
    console.error("Error fetching all ads:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਇਸ਼ਤਿਹਾਰ ਸੂਚੀ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੋ ਸਕੀ",
      error: error.message
    });
  }
};

// @desc    Create a new advertisement (Protected for Admin & Editor)
// @route   POST /api/ads
export const createAd = async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      targetUrl,
      slot,
      sizeLabel,
      startDate,
      endDate,
      isActive,
      openInNewTab,
      priority,
      notes
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "ਇਸ਼ਤਿਹਾਰ ਦਾ ਸਿਰਲੇਖ / ਸਪਾਂਸਰ ਨਾਮ ਲਾਜ਼ਮੀ ਹੈ (Title is required)"
      });
    }

    if (!imageUrl || !imageUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "ਇਸ਼ਤਿਹਾਰ ਦੀ ਫੋਟੋ / ਬੈਨਰ ਲਿੰਕ ਲਾਜ਼ਮੀ ਹੈ (Banner image is required)"
      });
    }

    if (!slot || !slot.trim()) {
      return res.status(400).json({
        success: false,
        message: "ਪਲੇਸਮੈਂਟ ਸਲਾਟ ਚੁਣਨਾ ਲਾਜ਼ਮੀ ਹੈ (Slot placement is required)"
      });
    }

    const newAd = await Advertisement.create({
      title: title.trim(),
      imageUrl: imageUrl.trim(),
      targetUrl: targetUrl && targetUrl.trim() ? targetUrl.trim() : "",
      slot: slot.trim(),
      sizeLabel: sizeLabel && sizeLabel.trim() ? sizeLabel.trim() : "Responsive",
      startDate: startDate && startDate.trim() ? startDate.trim() : null,
      endDate: endDate && endDate.trim() ? endDate.trim() : null,
      isActive: typeof isActive === "boolean" ? isActive : true,
      openInNewTab: typeof openInNewTab === "boolean" ? openInNewTab : true,
      priority: Number(priority) || 0,
      notes: notes && notes.trim() ? notes.trim() : "",
      createdBy: req.user?._id || null,
      createdByName: req.user?.name || "Admin"
    });

    return res.status(201).json({
      success: true,
      message: "ਇਸ਼ਤਿਹਾਰ ਸਫ਼ਲਤਾਪੂਰਵਕ ਪ੍ਰਕਾਸ਼ਿਤ ਹੋ ਗਿਆ ਹੈ! (Ad created successfully)",
      data: newAd
    });
  } catch (error) {
    console.error("Error creating ad:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਇਸ਼ਤਿਹਾਰ ਸੇਵ ਨਹੀਂ ਹੋ ਸਕਿਆ",
      error: error.message
    });
  }
};

// @desc    Update advertisement by ID (Protected for Admin & Editor)
// @route   PUT /api/ads/:id
export const updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findById(id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "ਇਸ਼ਤਿਹਾਰ ਨਹੀਂ ਮਿਲਿਆ (Advertisement not found)"
      });
    }

    const {
      title,
      imageUrl,
      targetUrl,
      slot,
      sizeLabel,
      startDate,
      endDate,
      isActive,
      openInNewTab,
      priority,
      notes
    } = req.body;

    if (title && title.trim()) ad.title = title.trim();
    if (imageUrl && imageUrl.trim()) ad.imageUrl = imageUrl.trim();
    if (typeof targetUrl === "string") ad.targetUrl = targetUrl.trim();
    if (slot && slot.trim()) ad.slot = slot.trim();
    if (sizeLabel && sizeLabel.trim()) ad.sizeLabel = sizeLabel.trim();
    if (startDate !== undefined) ad.startDate = startDate && startDate.trim() ? startDate.trim() : null;
    if (endDate !== undefined) ad.endDate = endDate && endDate.trim() ? endDate.trim() : null;
    if (typeof isActive === "boolean") ad.isActive = isActive;
    if (typeof openInNewTab === "boolean") ad.openInNewTab = openInNewTab;
    if (priority !== undefined) ad.priority = Number(priority) || 0;
    if (typeof notes === "string") ad.notes = notes.trim();

    await ad.save();

    return res.status(200).json({
      success: true,
      message: "ਇਸ਼ਤਿਹਾਰ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਹੋ ਗਿਆ ਹੈ!",
      data: ad
    });
  } catch (error) {
    console.error("Error updating ad:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਇਸ਼ਤਿਹਾਰ ਅੱਪਡੇਟ ਨਹੀਂ ਹੋ ਸਕਿਆ",
      error: error.message
    });
  }
};

// @desc    Delete advertisement by ID (Protected for Admin & Editor)
// @route   DELETE /api/ads/:id
export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findByIdAndDelete(id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "ਇਸ਼ਤਿਹਾਰ ਨਹੀਂ ਮਿਲਿਆ (Advertisement not found)"
      });
    }

    return res.status(200).json({
      success: true,
      message: "ਇਸ਼ਤਿਹਾਰ ਸਫ਼ਲਤਾਪੂਰਵਕ ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ! (Ad deleted successfully)"
    });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਇਸ਼ਤਿਹਾਰ ਹਟਾਇਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
      error: error.message
    });
  }
};

// @desc    Toggle active state of an ad (Protected for Admin & Editor)
// @route   PUT /api/ads/:id/toggle
export const toggleAdActive = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findById(id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "ਇਸ਼ਤਿਹਾਰ ਨਹੀਂ ਮਿਲਿਆ (Advertisement not found)"
      });
    }

    ad.isActive = !ad.isActive;
    await ad.save();

    return res.status(200).json({
      success: true,
      message: `ਇਸ਼ਤਿਹਾਰ ਹੁਣ ${ad.isActive ? "ਸਰਗਰਮ (Active)" : "ਬੰਦ (Inactive)"} ਹੈ!`,
      data: ad
    });
  } catch (error) {
    console.error("Error toggling ad:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਸਟੇਟਸ ਬਦਲਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
      error: error.message
    });
  }
};

// @desc    Track click on an advertisement (Public)
// @route   POST /api/ads/:id/click
export const trackAdClick = async (req, res) => {
  try {
    const { id } = req.params;
    await Advertisement.findByIdAndUpdate(id, { $inc: { clicksCount: 1 } });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(200).json({ success: false });
  }
};
