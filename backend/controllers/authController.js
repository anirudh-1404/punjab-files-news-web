import User from "../models/User.js";

// Helper to send token response with secure cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  };

  const effectiveRoles =
    Array.isArray(user.roles) && user.roles.length > 0
      ? user.roles
      : [user.role || "reporter"];

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roles: effectiveRoles,
        avatar: user.avatar,
        isActive: user.isActive,
        canDirectPublish: Boolean(user.canDirectPublish)
      }
    });
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password"
      });
    }

    // Check for user (must select +password)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated. Contact admin."
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const userObj = user.toObject();
    if (!Array.isArray(userObj.roles) || userObj.roles.length === 0) {
      userObj.roles = [userObj.role || "reporter"];
    }
    res.status(200).json({
      success: true,
      user: userObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message
    });
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

// @desc    Register a new user / staff member
// @route   POST /api/auth/register
// @access  Private (Admin only)
export const registerStaff = async (req, res) => {
  try {
    let { name, email, password, role, roles, canDirectPublish } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Determine roles array and primary role
    const validRoles = ["admin", "editor", "reporter"];
    let finalRoles = [];
    if (Array.isArray(roles) && roles.length > 0) {
      finalRoles = roles.filter((r) => validRoles.includes(r));
    }
    if (finalRoles.length === 0 && role && validRoles.includes(role)) {
      finalRoles = [role];
    }
    if (finalRoles.length === 0) {
      finalRoles = ["reporter"];
    }

    let primaryRole = "reporter";
    if (finalRoles.includes("admin")) primaryRole = "admin";
    else if (finalRoles.includes("editor")) primaryRole = "editor";
    else primaryRole = "reporter";

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: primaryRole,
      roles: finalRoles,
      canDirectPublish: finalRoles.includes("reporter") ? Boolean(canDirectPublish) : true
    });

    res.status(201).json({
      success: true,
      message: `Staff member ${user.name} created successfully with roles: ${finalRoles.join(", ")}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roles: user.roles,
        isActive: user.isActive,
        canDirectPublish: Boolean(user.canDirectPublish)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating staff user",
      error: error.message
    });
  }
};
