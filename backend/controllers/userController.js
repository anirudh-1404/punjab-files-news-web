import User from "../models/User.js";

// @desc    Get all users (Staff list)
// @route   GET /api/users
// @access  Private (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users list",
      error: error.message
    });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["admin", "editor", "reporter"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified. Must be 'admin', 'editor', or 'reporter'."
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Role updated to ${role} for ${user.name}`,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: error.message
    });
  }
};

// @desc    Update user status (activate / deactivate)
// @route   PUT /api/users/:id/status
// @access  Private (Admin only)
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean (true or false)"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${user.name} is now ${isActive ? "Active" : "Deactivated"}`,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user status",
      error: error.message
    });
  }
};

// @desc    Toggle direct publish permission for reporter
// @route   PUT /api/users/:id/direct-publish
// @access  Private (Admin only)
export const updateDirectPublish = async (req, res) => {
  try {
    const { canDirectPublish } = req.body;
    if (typeof canDirectPublish !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "canDirectPublish must be a boolean (true or false)"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { canDirectPublish },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Direct publish permission for ${user.name} set to ${canDirectPublish ? "Enabled" : "Disabled"}`,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating direct publish permission",
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account"
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message
    });
  }
};
