import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email"
      ]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false // Do not return password by default
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "editor", "reporter"],
        message: "{VALUE} is not a valid role"
      },
      default: "reporter"
    },
    roles: {
      type: [String],
      enum: {
        values: ["admin", "editor", "reporter"],
        message: "{VALUE} is not a valid role"
      }
    },
    avatar: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    canDirectPublish: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password and sync role/roles before save
userSchema.pre("save", async function () {
  // Synchronize role and roles
  if (Array.isArray(this.roles) && this.roles.length > 0) {
    if (this.roles.includes("admin")) {
      this.role = "admin";
    } else if (this.roles.includes("editor")) {
      this.role = "editor";
    } else {
      this.role = "reporter";
    }
  } else if (this.role) {
    this.roles = [this.role];
  } else {
    this.role = "reporter";
    this.roles = ["reporter"];
  }

  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  const effectiveRoles = (this.roles && this.roles.length > 0) ? this.roles : [this.role || "reporter"];
  return jwt.sign(
    { id: this._id, role: this.role, roles: effectiveRoles, email: this.email, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "30d" }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
