import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes - verifies token from Authorization header or cookies
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. No token provided."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact an administrator."
      });
    }

    if (!Array.isArray(user.roles) || user.roles.length === 0) {
      user.roles = [user.role || "reporter"];
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message
    });
  }
};

// Grant access to specific roles (checks against user's roles array and primary role)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: "User role 'guest' is not authorized to access this action"
      });
    }

    const userRoles =
      Array.isArray(req.user.roles) && req.user.roles.length > 0
        ? req.user.roles
        : [req.user.role || "reporter"];

    const isAuthorized = roles.some((r) => userRoles.includes(r));

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: `User roles '${userRoles.join(", ")}' are not authorized to access this action`
      });
    }
    next();
  };
};
