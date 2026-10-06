import WebTV from "../models/WebTV.js";
import WebTVSchedule from "../models/WebTVSchedule.js";

const DEFAULT_CONFIG = {
  videoUrl: "https://www.youtube.com/watch?v=6OW56yMNB1g",
  embedUrl: "https://www.youtube-nocookie.com/embed/6OW56yMNB1g?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0",
  title: "24x7 HD ਪ੍ਰਸਾਰਣ",
  badge: "ON AIR • WEB TV",
  quality: "1080p HD",
  isActive: true,
  language: "pa",
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

// @desc    Get active Web TV stream config for Homepage (Checks language + today's schedule first, then default)
// @route   GET /api/webtv
export const getWebTV = async (req, res) => {
  try {
    const requestedLang = ["pa", "hi", "en"].includes(req.query.language)
      ? req.query.language
      : "pa";
    const todayStr = getTodayDateString();

    // 1. Check if there is an active scheduled broadcast for today's date & requested language
    const todaySchedule = await WebTVSchedule.findOne({
      scheduledDate: todayStr,
      isActive: true,
      $or: [
        { language: requestedLang },
        ...(requestedLang === "pa" ? [{ language: { $exists: false } }, { language: null }] : [])
      ]
    });

    if (todaySchedule) {
      return res.status(200).json({
        success: true,
        requestedLanguage: requestedLang,
        language: todaySchedule.language || "pa",
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
          language: todaySchedule.language || "pa",
          notes: todaySchedule.notes || ""
        },
        todayDate: todayStr
      });
    }

    // 2. Check if there is a default stream for this language
    let langConfig = await WebTV.findOne({
      language: requestedLang,
      isActive: true
    });

    if (langConfig) {
      return res.status(200).json({
        success: true,
        requestedLanguage: requestedLang,
        language: langConfig.language || requestedLang,
        data: {
          ...langConfig.toObject(),
          isScheduled: false,
          scheduledDate: null
        },
        todayDate: todayStr
      });
    }

    // 3. Fallback: If not Punjabi, check if Punjabi has today's schedule
    if (requestedLang !== "pa") {
      const fallbackSchedule = await WebTVSchedule.findOne({
        scheduledDate: todayStr,
        isActive: true,
        $or: [{ language: "pa" }, { language: { $exists: false } }, { language: null }]
      });

      if (fallbackSchedule) {
        return res.status(200).json({
          success: true,
          requestedLanguage: requestedLang,
          language: "pa",
          isFallback: true,
          data: {
            _id: fallbackSchedule._id,
            videoUrl: fallbackSchedule.videoUrl,
            embedUrl: fallbackSchedule.embedUrl,
            title: fallbackSchedule.title || "24x7 HD ਪ੍ਰਸਾਰਣ",
            badge: fallbackSchedule.badge || "ON AIR • WEB TV",
            quality: fallbackSchedule.quality || "1080p HD",
            isActive: fallbackSchedule.isActive,
            isScheduled: true,
            scheduledDate: fallbackSchedule.scheduledDate,
            language: "pa",
            notes: fallbackSchedule.notes || ""
          },
          todayDate: todayStr
        });
      }
    }

    // 4. Fallback to default Punjabi or any latest Web TV config
    let config = await WebTV.findOne({ language: "pa" });
    if (!config) {
      config = await WebTV.findOne().sort({ updatedAt: -1 });
    }

    if (!config) {
      config = await WebTV.create({ ...DEFAULT_CONFIG, language: "pa" });
    }

    return res.status(200).json({
      success: true,
      requestedLanguage: requestedLang,
      language: config.language || "pa",
      isFallback: requestedLang !== (config.language || "pa"),
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
      requestedLanguage: "pa",
      language: "pa",
      data: { ...DEFAULT_CONFIG, language: "pa", isScheduled: false, scheduledDate: null },
      todayDate: getTodayDateString()
    });
  }
};

// @desc    Get all default 24x7 Web TV streams by language (Protected for Admin & Editor)
// @route   GET /api/webtv/defaults
export const getDefaultsWebTV = async (req, res) => {
  try {
    const configs = await WebTV.find();
    const defaults = {
      pa: configs.find((c) => c.language === "pa") || { ...DEFAULT_CONFIG, language: "pa" },
      hi: configs.find((c) => c.language === "hi") || {
        ...DEFAULT_CONFIG,
        language: "hi",
        title: "24x7 HD प्रसारण"
      },
      en: configs.find((c) => c.language === "en") || {
        ...DEFAULT_CONFIG,
        language: "en",
        title: "24x7 HD Broadcast"
      }
    };

    return res.status(200).json({
      success: true,
      data: defaults
    });
  } catch (error) {
    console.error("Error fetching WebTV defaults:", error);
    return res.status(500).json({
      success: false,
      message: "ਸਰਵਰ ਤਰੁੱਟੀ: ਡਿਫਾਲਟ ਸਟ੍ਰੀਮ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੋ ਸਕੀ",
      error: error.message
    });
  }
};

// @desc    Update default 24x7 Web TV stream config for a specific language (Protected for Admin & Editor)
// @route   PUT /api/webtv or POST /api/webtv
export const updateWebTV = async (req, res) => {
  try {
    const { videoUrl, title, badge, quality, isActive, language } = req.body;

    if (!videoUrl || !videoUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "Video link is required (ਵੀਡੀਓ ਲਿੰਕ ਦਰਜ ਕਰਨਾ ਲਾਜ਼ਮੀ ਹੈ)"
      });
    }

    const lang = ["pa", "hi", "en"].includes(language) ? language : "pa";
    const embedUrl = buildEmbedUrl(videoUrl);

    let config = await WebTV.findOne({ language: lang });

    const defaultTitle =
      lang === "hi" ? "24x7 HD प्रसारण" : lang === "en" ? "24x7 HD Broadcast" : "24x7 HD ਪ੍ਰਸਾਰਣ";

    const updatePayload = {
      videoUrl: videoUrl.trim(),
      embedUrl,
      title: title && title.trim() ? title.trim() : defaultTitle,
      badge: badge && badge.trim() ? badge.trim() : "ON AIR • WEB TV",
      quality: quality && quality.trim() ? quality.trim() : "1080p HD",
      language: lang,
      isActive: typeof isActive === "boolean" ? isActive : true,
      updatedBy: req.user?._id || null,
      updatedByName: req.user?.name || "Admin"
    };

    if (config) {
      config = await WebTV.findByIdAndUpdate(config._id, updatePayload, { new: true });
    } else {
      config = await WebTV.create(updatePayload);
    }

    const langLabel = lang === "hi" ? "हिंदी" : lang === "en" ? "English" : "ਪੰਜਾਬੀ";

    return res.status(200).json({
      success: true,
      message: `${langLabel} ਲਈ ਮੂਲ ਵੈੱਬ ਟੀਵੀ ਸਟ੍ਰੀਮ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਹੋ ਗਈ ਹੈ!`,
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
    const query = {};
    if (req.query.language && ["pa", "hi", "en"].includes(req.query.language)) {
      query.$or = [
        { language: req.query.language },
        ...(req.query.language === "pa" ? [{ language: { $exists: false } }, { language: null }] : [])
      ];
    }

    const schedules = await WebTVSchedule.find(query).sort({ scheduledDate: 1, language: 1 });
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

// @desc    Create or update a scheduled broadcast for a date and language (Protected for Admin & Editor)
// @route   POST /api/webtv/schedules
export const createOrUpdateSchedule = async (req, res) => {
  try {
    const { scheduledDate, videoUrl, title, badge, quality, notes, isActive, language } = req.body;

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
    const itemLang = ["pa", "hi", "en"].includes(language) ? language : "pa";
    const embedUrl = buildEmbedUrl(videoUrl);

    const defaultTitle =
      itemLang === "hi" ? "विशेष प्रसारण (Live)" : itemLang === "en" ? "Special Broadcast (Live)" : "ਵਿਸ਼ੇਸ਼ ਪ੍ਰਸਾਰਣ";

    const payload = {
      scheduledDate: cleanDate,
      language: itemLang,
      videoUrl: videoUrl.trim(),
      embedUrl,
      title: title && title.trim() ? title.trim() : defaultTitle,
      badge: badge && badge.trim() ? badge.trim() : "ON AIR • WEB TV",
      quality: quality && quality.trim() ? quality.trim() : "1080p HD",
      notes: notes && notes.trim() ? notes.trim() : "",
      isActive: typeof isActive === "boolean" ? isActive : true,
      createdBy: req.user?._id || null,
      createdByName: req.user?.name || "Admin"
    };

    // If schedule for this date AND language already exists, update it, otherwise create new
    let schedule = await WebTVSchedule.findOne({
      scheduledDate: cleanDate,
      $or: [
        { language: itemLang },
        ...(itemLang === "pa" ? [{ language: { $exists: false } }, { language: null }] : [])
      ]
    });

    if (schedule) {
      schedule = await WebTVSchedule.findByIdAndUpdate(schedule._id, payload, { new: true });
    } else {
      schedule = await WebTVSchedule.create(payload);
    }

    const langLabel = itemLang === "hi" ? "हिंदी" : itemLang === "en" ? "English" : "ਪੰਜਾਬੀ";

    return res.status(200).json({
      success: true,
      message: `ਤਾਰੀਖ਼ ${cleanDate} (${langLabel}) ਲਈ ਵੀਡੀਓ ਸ਼ਡਿਊਲ ਹੋ ਗਈ ਹੈ!`,
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
    const { scheduledDate, videoUrl, title, badge, quality, notes, isActive, language } = req.body;

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

    if (language && ["pa", "hi", "en"].includes(language)) {
      schedule.language = language;
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
