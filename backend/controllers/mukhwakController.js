import Mukhwak from "../models/Mukhwak.js";

// Default fallback data if collection is empty
const DEFAULT_MUKHWAK = {
  _id: "default_mukhwak",
  date: "20 ਸਤੰਬਰ 2026",
  title: "ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ • ਰੋਜ਼ਾਨਾ ਹੁਕਮਨਾਮਾ",
  location: "ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ",
  raag: "ਰਾਗੁ ਸੋਰਠਿ ਮਹਲਾ ੫ ਘਰੁ ੨ ਚਉਪਦੇ",
  ang: "੬੫੪",
  gurbani: `ਗੁਰੁ ਪੂਰਾ ਭੇਟਿਆ ਵਡਭਾਗੀ ਮਨਹਿ ਭਇਆ ਪਰਗਾਸਾ ॥\nਕੋਇ ਨ ਪਹੁਚਨਹਾਰਾ ਦੂਜਾ ਅਪਨੇ ਠਾਕੁਰ ਕਾ ਭਰਵਾਸਾ ॥੧॥\nਅਪਨੇ ਸੇਵਕ ਕੀ ਆਪੇ ਰਾਖੈ ਨਿਮਖ ਨ ਬਿਸਰੈ ਸਾਸਾ ॥\nਹਰਿ ਕਾ ਨਾਮੁ ਜਪਹੁ ਮੇਰੇ ਮੀਤਾ ਨਾਨਕ ਕੀ ਅਰਦਾਸਾ ॥੨॥`,
  viakhya: "ਹੇ ਭਾਈ! ਜਿਸ ਮਨੁੱਖ ਨੂੰ ਵੱਡੇ ਭਾਗਾਂ ਨਾਲ ਪੂਰਾ ਗੁਰੂ ਮਿਲ ਪੈਂਦਾ ਹੈ, ਉਸ ਦੇ ਮਨ ਵਿੱਚ ਆਤਮਕ ਜੀਵਨ ਦਾ ਚਾਨਣ ਹੋ ਜਾਂਦਾ ਹੈ। ਉਸ ਨੂੰ ਆਪਣੇ ਮਾਲਕ-ਪ੍ਰਭੂ ਦਾ ਪੱਕਾ ਆਸਰਾ ਬਣ ਜਾਂਦਾ ਹੈ। ਪਰਮਾਤਮਾ ਆਪਣੇ ਭਗਤਾਂ ਤੇ ਸੇਵਕਾਂ ਦੀ ਹਰ ਪਲ ਰਾਖੀ ਕਰਦਾ ਹੈ।",
  image: "/img/darbar-sahib-mukhwak.jpg",
  sgpcLink: "https://sgpc.net/hukamnama/",
  isActive: true
};

// @desc    Get active Mukhwak (Public for homepage)
// @route   GET /api/mukhwak/today
// @access  Public
export const getActiveMukhwak = async (req, res) => {
  try {
    let mukhwak = await Mukhwak.findOne({ isActive: true }).sort({ updatedAt: -1 });

    if (!mukhwak) {
      mukhwak = await Mukhwak.findOne().sort({ createdAt: -1 });
    }

    if (!mukhwak) {
      // Auto-create initial default entry so DB is initialized
      try {
        mukhwak = await Mukhwak.create(DEFAULT_MUKHWAK);
      } catch {
        return res.status(200).json({
          success: true,
          data: DEFAULT_MUKHWAK
        });
      }
    }

    res.status(200).json({
      success: true,
      data: mukhwak
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Mukhwak",
      error: error.message,
      data: DEFAULT_MUKHWAK
    });
  }
};

// @desc    Get all Mukhwaks (For Admin/Editor management)
// @route   GET /api/mukhwak
// @access  Private (Admin, Editor)
export const getAllMukhwaks = async (req, res) => {
  try {
    const list = await Mukhwak.find().sort({ isActive: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Mukhwak list",
      error: error.message
    });
  }
};

// @desc    Create new Mukhwak
// @route   POST /api/mukhwak
// @access  Private (Admin, Editor)
export const createMukhwak = async (req, res) => {
  try {
    const {
      date,
      title,
      location,
      raag,
      ang,
      gurbani,
      viakhya,
      englishTranslation,
      image,
      sgpcLink,
      isActive = true
    } = req.body;

    if (!date || !raag || !ang || !gurbani || !viakhya) {
      return res.status(400).json({
        success: false,
        message: "ਕਿਰਪਾ ਕਰਕੇ ਮਿਤੀ, ਰਾਗ, ਅੰਗ, ਗੁਰਬਾਣੀ ਤੁਕਾਂ ਅਤੇ ਵਿਆਖਿਆ ਦਰਜ ਕਰੋ (Required fields missing)"
      });
    }

    // If marked active, deactivate all previous entries
    if (Boolean(isActive)) {
      await Mukhwak.updateMany({}, { isActive: false });
    }

    const newMukhwak = await Mukhwak.create({
      date: date.trim(),
      title: title ? title.trim() : "ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ • ਰੋਜ਼ਾਨਾ ਹੁਕਮਨਾਮਾ",
      location: location ? location.trim() : "ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ",
      raag: raag.trim(),
      ang: ang.trim(),
      gurbani: gurbani.trim(),
      viakhya: viakhya.trim(),
      englishTranslation: englishTranslation ? englishTranslation.trim() : "",
      image: image || "/img/darbar-sahib-mukhwak.jpg",
      sgpcLink: sgpcLink || "https://sgpc.net/hukamnama/",
      isActive: Boolean(isActive),
      createdBy: req.user._id,
      authorName: req.user.name || "ਸੰਪਾਦਕੀ ਡੈਸਕ"
    });

    res.status(201).json({
      success: true,
      message: "ਮੁੱਖ ਵਾਕ ਸਫ਼ਲਤਾਪੂਰਵਕ ਸ਼ਾਮਲ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ (Mukhwak added successfully)",
      data: newMukhwak
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ਮੁੱਖ ਵਾਕ ਸੇਵ ਕਰਨ ਵਿੱਚ ਦਿੱਕਤ ਆਈ",
      error: error.message
    });
  }
};

// @desc    Update Mukhwak
// @route   PUT /api/mukhwak/:id
// @access  Private (Admin, Editor)
export const updateMukhwak = async (req, res) => {
  try {
    const { id } = req.params;
    const mukhwak = await Mukhwak.findById(id);

    if (!mukhwak) {
      return res.status(404).json({
        success: false,
        message: "ਮੁੱਖ ਵਾਕ ਨਹੀਂ ਮਿਲਿਆ (Mukhwak not found)"
      });
    }

    const {
      date,
      title,
      location,
      raag,
      ang,
      gurbani,
      viakhya,
      englishTranslation,
      image,
      sgpcLink,
      isActive
    } = req.body;

    if (isActive && !mukhwak.isActive) {
      await Mukhwak.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    if (date !== undefined) mukhwak.date = date.trim();
    if (title !== undefined) mukhwak.title = title.trim();
    if (location !== undefined) mukhwak.location = location.trim();
    if (raag !== undefined) mukhwak.raag = raag.trim();
    if (ang !== undefined) mukhwak.ang = ang.trim();
    if (gurbani !== undefined) mukhwak.gurbani = gurbani.trim();
    if (viakhya !== undefined) mukhwak.viakhya = viakhya.trim();
    if (englishTranslation !== undefined) mukhwak.englishTranslation = englishTranslation.trim();
    if (image !== undefined) mukhwak.image = image;
    if (sgpcLink !== undefined) mukhwak.sgpcLink = sgpcLink;
    if (isActive !== undefined) mukhwak.isActive = Boolean(isActive);

    const updated = await mukhwak.save();

    res.status(200).json({
      success: true,
      message: "ਮੁੱਖ ਵਾਕ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਹੋ ਗਿਆ ਹੈ (Mukhwak updated successfully)",
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ਮੁੱਖ ਵਾਕ ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਗ਼ਲਤੀ ਆਈ",
      error: error.message
    });
  }
};

// @desc    Set Mukhwak as Active (Live on homepage)
// @route   PUT /api/mukhwak/:id/set-active
// @access  Private (Admin, Editor)
export const setActiveMukhwak = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await Mukhwak.findById(id);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "ਮੁੱਖ ਵਾਕ ਨਹੀਂ ਮਿਲਿਆ"
      });
    }

    // Set all others to false
    await Mukhwak.updateMany({}, { isActive: false });

    // Set target to true
    target.isActive = true;
    await target.save();

    res.status(200).json({
      success: true,
      message: "ਮੁੱਖ ਵਾਕ ਹੋਮਪੇਜ 'ਤੇ ਲਾਈਵ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ (Set as live Mukhwak)",
      data: target
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ਸਟੇਟਸ ਬਦਲਣ ਵਿੱਚ ਦਿੱਕਤ ਆਈ",
      error: error.message
    });
  }
};

// @desc    Delete Mukhwak
// @route   DELETE /api/mukhwak/:id
// @access  Private (Admin, Editor)
export const deleteMukhwak = async (req, res) => {
  try {
    const { id } = req.params;
    const mukhwak = await Mukhwak.findById(id);

    if (!mukhwak) {
      return res.status(404).json({
        success: false,
        message: "ਮੁੱਖ ਵਾਕ ਨਹੀਂ ਮਿਲਿਆ"
      });
    }

    const wasActive = mukhwak.isActive;
    await Mukhwak.findByIdAndDelete(id);

    // If the active one was deleted, make the latest one active
    if (wasActive) {
      const remaining = await Mukhwak.findOne().sort({ createdAt: -1 });
      if (remaining) {
        remaining.isActive = true;
        await remaining.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "ਮੁੱਖ ਵਾਕ ਸਫ਼ਲਤਾਪੂਰਵਕ ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ (Mukhwak deleted successfully)"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ਮੁੱਖ ਵਾਕ ਹਟਾਉਣ ਵਿੱਚ ਦਿੱਕਤ ਆਈ",
      error: error.message
    });
  }
};
