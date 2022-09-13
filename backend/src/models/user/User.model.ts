// Importing Libraries
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Importing Types
import { User } from "../../interfaces/User";

// User Schema
const UserSchema = new Schema(
  {
    firstName: { type: String, required: [true, "First Name is required"] },
    lastName: { type: String, required: [true, "Last Name is required"] },
    profilePhoto: {
      type: String,
      default:
        "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/",
    },
    email: { type: String, required: [true, "Email is required"] },
    bio: { type: String },
    password: { type: String, required: [true, "password is required"] },
    postCount: { type: Number, default: 0 },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: { type: Boolean, default: false },
    role: { type: String, enum: ["Admin", "Guest", "Blogger"] },
    isFollowing: { type: Boolean, default: false },
    isUnFollowing: { type: Boolean, default: false },
    isAccountVerified: { type: Boolean, default: false },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    viewBy: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    followers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    following: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// ================================================================
// Virtual Method to populate created postCount
// ================================================================
UserSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

// Validate ID
UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
// ================================================================
// Hashing the password
// ================================================================

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ================================================================
// Matching password
// ================================================================

UserSchema.methods.isPasswordMatched = async function (
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ================================================================
// Verify Account
// ================================================================

UserSchema.methods.createAccountVerificationToken = async function () {
  //create a token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000; //10 minutes
  return verificationToken;
};

// ================================================================
// Password Reset/Forget Password
// ================================================================

UserSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  return resetToken;
};

export default model<User>("User", UserSchema);
