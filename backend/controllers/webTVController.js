import WebTV from "../models/WebTV.js";
import WebTVSchedule from "../models/WebTVSchedule.js";

const DEFAULT_CONFIG = {
  videoUrl: "https://www.youtube.com/watch?v=6OW56yMNB1g",
  embedUrl: "https://www.youtube-nocookie.com/embed/6OW56yMNB1g?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0",
  title: "24x7 HD ਪ੍ਰਸਾਰਣ",
  badge: "ON AIR • WEB TV",
  quality: "1080p HD",
  isActive: true,
  updatedByName: "Admin"
};

/**
 * Returns today's date string in YYYY-MM-DD format (Asia/Kolkata timezone)
 */
export function getTodayDateString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

/**
 * Helper to convert any YouTube or video link / iframe into a clean embed URL
 */
export function buildEmbedUrl(url) {
  if (!url || typeof url !== "string") {
    return DEFAULT_CONFIG.embedUrl;
  }

  let cleanUrl = url.trim();

  // If user pasted an iframe tag, extract the src attribute
  const iframeMatch = cleanUrl.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    cleanUrl = iframeMatch[1].trim();
  }

  // Regex for extracting YouTube video ID
  const ytRegex = /(?:youtube\.com\/(?:watch\?.*v=|embed\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = cleanUrl.match(ytRegex);

  if (match && match[1]) {
    const videoId = match[1];
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0`;
  }

  // If it's already an embed URL with params, ensure autoplay & mute
  if (cleanUrl.includes("youtube.com/embed/") || cleanUrl.includes("youtube-nocookie.com/embed/")) {
    if (!cleanUrl.includes("autoplay=1")) {
      const sep = cleanUrl.includes("?") ? "&" : "?";
      cleanUrl = `${cleanUrl}${sep}autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0`;
    }
    return cleanUrl;
  }

  return cleanUrl;
}

// @desc    Get active Web TV stream config for Homepage (Checks today's schedule first, then default)
// @route   GET /api/webtv
export const getWebTV = async (req, res) => {
  try {
    const todayStr = getTodayDateString();

    // 1. Check if there is an active scheduled broadcast for today's date
    const todaySchedule = await WebTVSchedule.findOne({
      scheduledDate: todayStr,
      isActive: true
    });

    if (todaySchedule) {
      return res.status(200).json({
        success: true,
        data: {
          _id: todaySchedule._id,
          videoUrl: todaySchedule.videoUrl,
          embedUrl: todaySchedule.embedUrl,
          title: todaySchedule.title || "24x7 HD ਪ੍ਰਸਾਰਣ",
          badge: todaySchedule.badge || "ON AIR • WEB TV",
          quality: todaySchedule.quality || "1080p HD",
          isActive: todaySchedule.isActive,
          isScheduled: true,
          scheduledDate: todaySchedule.scheduledDate,
          notes: todaySchedule.notes || ""
        },
        todayDate: todayStr
      });
    }

    // 2. Fallback to default/ongoing 24x7 Web TV config
    let config = await WebTV.findOne().sort({ updatedAt: -1 });

    if (!config) {
      config = await WebTV.create(DEFAULT_CONFIG);
    }

    return res.status(200).json({
      success: true,
      data: {
        ...config.toObject(),
        isScheduled: false,
        scheduledDate: null
      },
      todayDate: todayStr
    });
  } catch (error) {
    console.error("Error fetching WebTV stream:", error);
    return res.status(200).json({
      success: true,
      data: { ...DEFAULT_CONFIG, isScheduled: false, scheduledDate: null },
      todayDate: getTodayDateString()
    });
  }
};

// @desc    Update default 24x7 Web TV stream config (Protected for Admin & Editor)
// @route   PUT /api/webtv or POST /api/webtv
export const updateWebTV = async (req, res) => {
  try {
    const { videoUrl, title, badge, quality, isActive } = req.body;

    if (!videoUrl || !videoUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "Video link is required (ਵੀਡੀਓ ਲਿੰਕ ਦਰਜ ਕਰਨਾ ਲਾਜ਼ਮੀ ਹੈ)"
      });
    }

    const embedUrl = buildEmbedUrl(videoUrl);

    let config = await WebTV.findOne().sort({ updatedAt: -1 });

    const updatePayload = {
      videoUrl: videoUrl.trim(),
      embedUrl,
      title: title && title.trim() ? title.trim() : "24x7 HD ਪ੍ਰਸਾਰਣ",
      badge: badge && badge.trim() ? badge.trim() : "ON AIR • WEB TV",
      quality: quality && quality.trim() ? quality.trim() : "1080p HD",
      isActive: typeof isActive === "boolean" ? isActive : true,
      updatedBy: req.user?._id || null,
      updatedByName: req.user?.name || "Admin"
    };

    if (config) {
      config = await WebTV.findByIdAndUpdate(config._id, updatePayload, { new: true });
    } else {
      config = await WebTV.create(updatePayload);
    }

    return res.status(200).json({
      success: true,
      message: "ਮੂਲ ਵੈੱਬ ਟੀਵੀ ਸਟ੍ਰੀਮ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਹੋ ਗਈ ਹੈ! (Default Web TV stream updated successfully)",
      data: config
    });
  } catch (error) {
    console.error("Error updating WebTV:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਵੈੱਬ ਟੀਵੀ ਅੱਪਡੇਟ ਨਹੀਂ ਹੋ ਸਕਿਆ",
      error: error.message
    });
  }
};

// @desc    Get all scheduled broadcasts (Protected for Admin & Editor)
// @route   GET /api/webtv/schedules
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await WebTVSchedule.find().sort({ scheduledDate: 1 });
    const todayDate = getTodayDateString();

    return res.status(200).json({
      success: true,
      data: schedules,
      todayDate
    });
  } catch (error) {
    console.error("Error fetching WebTV schedules:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਸ਼ਡਿਊਲ ਸੂਚੀ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੋ ਸਕੀ",
      error: error.message
    });
  }
};

// @desc    Create or update a scheduled broadcast for a date (Protected for Admin & Editor)
// @route   POST /api/webtv/schedules
export const createOrUpdateSchedule = async (req, res) => {
  try {
    const { scheduledDate, videoUrl, title, badge, quality, notes, isActive } = req.body;

    if (!scheduledDate || !scheduledDate.trim()) {
      return res.status(400).json({
        success: false,
        message: "ਤਾਰੀਖ਼ ਦਰਜ ਕਰਨੀ ਲਾਜ਼ਮੀ ਹੈ (Scheduled date is required)"
      });
    }

    if (!videoUrl || !videoUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "ਵੀਡੀਓ ਲਿੰਕ ਦਰਜ ਕਰਨਾ ਲਾਜ਼ਮੀ ਹੈ (Video link is required)"
      });
    }

    const cleanDate = scheduledDate.trim();
    const embedUrl = buildEmbedUrl(videoUrl);

    const payload = {
      scheduledDate: cleanDate,
      videoUrl: videoUrl.trim(),
      embedUrl,
      title: title && title.trim() ? title.trim() : "24x7 HD ਪ੍ਰਸਾਰਣ",
      badge: badge && badge.trim() ? badge.trim() : "ON AIR • WEB TV",
      quality: quality && quality.trim() ? quality.trim() : "1080p HD",
      notes: notes && notes.trim() ? notes.trim() : "",
      isActive: typeof isActive === "boolean" ? isActive : true,
      createdBy: req.user?._id || null,
      createdByName: req.user?.name || "Admin"
    };

    // If schedule for this date already exists, update it, otherwise create new
    let schedule = await WebTVSchedule.findOne({ scheduledDate: cleanDate });

    if (schedule) {
      schedule = await WebTVSchedule.findByIdAndUpdate(schedule._id, payload, { new: true });
    } else {
      schedule = await WebTVSchedule.create(payload);
    }

    return res.status(200).json({
      success: true,
      message: `ਤਾਰੀਖ਼ ${cleanDate} ਲਈ ਵੀਡੀਓ ਸ਼ਡਿਊਲ ਹੋ ਗਈ ਹੈ! (Broadcast scheduled successfully)`,
      data: schedule
    });
  } catch (error) {
    console.error("Error creating WebTV schedule:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਸ਼ਡਿਊਲ ਸੇਵ ਨਹੀਂ ਹੋ ਸਕਿਆ",
      error: error.message
    });
  }
};

// @desc    Update a scheduled broadcast by ID (Protected for Admin & Editor)
// @route   PUT /api/webtv/schedules/:id
export const updateScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledDate, videoUrl, title, badge, quality, notes, isActive } = req.body;

    let schedule = await WebTVSchedule.findById(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "ਸ਼ਡਿਊਲ ਨਹੀਂ ਮਿਲਿਆ (Scheduled item not found)"
      });
    }

    if (videoUrl && videoUrl.trim()) {
      schedule.videoUrl = videoUrl.trim();
      schedule.embedUrl = buildEmbedUrl(videoUrl);
    }

    if (scheduledDate && scheduledDate.trim()) {
      schedule.scheduledDate = scheduledDate.trim();
    }

    if (typeof title === "string") schedule.title = title.trim();
    if (typeof badge === "string") schedule.badge = badge.trim();
    if (typeof quality === "string") schedule.quality = quality.trim();
    if (typeof notes === "string") schedule.notes = notes.trim();
    if (typeof isActive === "boolean") schedule.isActive = isActive;

    await schedule.save();

    return res.status(200).json({
      success: true,
      message: "ਸ਼ਡਿਊਲ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਹੋ ਗਿਆ ਹੈ!",
      data: schedule
    });
  } catch (error) {
    console.error("Error updating schedule by ID:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਸ਼ਡਿਊਲ ਅੱਪਡੇਟ ਨਹੀਂ ਹੋ ਸਕਿਆ",
      error: error.message
    });
  }
};

// @desc    Delete a scheduled broadcast (Protected for Admin & Editor)
// @route   DELETE /api/webtv/schedules/:id
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await WebTVSchedule.findByIdAndDelete(id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "ਸ਼ਡਿਊਲ ਨਹੀਂ ਮਿਲਿਆ (Schedule not found)"
      });
    }

    return res.status(200).json({
      success: true,
      message: "ਸ਼ਡਿਊਲ ਸਫ਼ਲਤਾਪੂਰਵਕ ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ! (Schedule deleted successfully)"
    });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਸ਼ਡਿਊਲ ਹਟਾਇਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
      error: error.message
    });
  }
};

// @desc    Toggle active state of a schedule (Protected for Admin & Editor)
// @route   PUT /api/webtv/schedules/:id/toggle
export const toggleScheduleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await WebTVSchedule.findById(id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "ਸ਼ਡਿਊਲ ਨਹੀਂ ਮਿਲਿਆ (Schedule not found)"
      });
    }

    schedule.isActive = !schedule.isActive;
    await schedule.save();

    return res.status(200).json({
      success: true,
      message: `ਸ਼ਡਿਊਲ ਹੁਣ ${schedule.isActive ? "ਸਰਗਰਮ (Active)" : "ਬੰਦ (Inactive)"} ਹੈ!`,
      data: schedule
    });
  } catch (error) {
    console.error("Error toggling schedule:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਸਟੇਟਸ ਬਦਲਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
      error: error.message
    });
  }
};
