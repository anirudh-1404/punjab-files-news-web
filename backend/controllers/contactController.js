import ContactMessage from "../models/ContactMessage.js";

// @desc    Submit a new contact / feedback query
// @route   POST /api/contact
// @access  Public
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖਾਨੇ ਭਰੋ (Name, Email, Phone, and Message are required)"
      });
    }

    const newMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      status: "unread"
    });

    res.status(201).json({
      success: true,
      message: "ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਸਫ਼ਲਤਾਪੂਰਵਕ ਦਰਜ ਹੋ ਗਿਆ ਹੈ! (Message submitted successfully)",
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ਸੁਨੇਹਾ ਦਰਜ ਕਰਨ ਵਿੱਚ ਖ਼ਾਮੀ ਆਈ (Error saving message)",
      error: error.message
    });
  }
};

// @desc    Get all contact messages (Admin / Editor)
// @route   GET /api/contact
// @access  Protected (Admin, Editor)
export const getContactMessages = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && (status === "unread" || status === "read")) {
      filter.status = status;
    }

    const [messages, unreadCount, totalCount] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }),
      ContactMessage.countDocuments({ status: "unread" }),
      ContactMessage.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      count: messages.length,
      unreadCount,
      totalCount,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ਸੁਨੇਹੇ ਲੋਡ ਕਰਨ ਵਿੱਚ ਖ਼ਾਮੀ ਆਈ (Error loading messages)",
      error: error.message
    });
  }
};

// @desc    Update contact message status (mark as read/unread)
// @route   PUT /api/contact/:id/status
// @access  Protected (Admin, Editor)
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["unread", "read"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'unread' or 'read'"
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "ਸੁਨੇਹਾ ਨਹੀਂ ਮਿਲਿਆ (Message not found)"
      });
    }

    res.status(200).json({
      success: true,
      message: `ਸੁਨੇਹਾ '${status === "read" ? "ਪੜ੍ਹ ਲਿਆ" : "ਅਣਪੜ੍ਹਿਆ"}' ਮਾਰਕ ਹੋ ਗਿਆ।`,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ਸਟੇਟਸ ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਖ਼ਾਮੀ ਆਈ",
      error: error.message
    });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Protected (Admin)
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "ਸੁਨੇਹਾ ਨਹੀਂ ਮਿਲਿਆ (Message not found)"
      });
    }

    res.status(200).json({
      success: true,
      message: "ਸੁਨੇਹਾ ਸਫ਼ਲਤਾਪੂਰਵਕ ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ (Message deleted successfully)"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ਸੁਨੇਹਾ ਹਟਾਉਣ ਵਿੱਚ ਖ਼ਾਮੀ ਆਈ",
      error: error.message
    });
  }
};
