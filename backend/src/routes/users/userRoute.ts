// Importing Libraries
import express from "express";

// Importing dependencies
import {
  userLogin,
  userRegister,
  fetchAllUsers,
  deleteUser,
  fetchUserDetails,
  userProfile,
  updateUserProfile,
  updateUserPassword,
  followingUser,
  unfollowUser,
  blockUser,
  unblockUser,
  generateVerificationToken,
  forgetPasswordToken,
  passwordReset,
  profilePhotoUploading,
  accountVerification,
} from "../../controllers/users/user.controller";
import {
  profilePhotoUploads,
  profilePhotoResize,
} from "../../middlewares/uploads/profilePhotoUploads";

import { authMiddleware } from "../../middlewares/auth/authMiddleware";
const userRoute = express.Router();

// ================================================================
// Get Registration Details
// ================================================================

userRoute.post("/register", userRegister);

// ================================================================
// Fetch Login Details
// ================================================================

userRoute.post("/login", userLogin);

// ================================================================
// Profile Photo Upload
// ================================================================

userRoute.put(
  "/profile-photo-upload",
  authMiddleware,
  [
    profilePhotoUploads.single("image"),
    (req: any, res: any) => res.json({ file: req.file }),
  ],
  profilePhotoResize,
  profilePhotoUploading
);

// ================================================================
// Fetch all users
// ================================================================

userRoute.get("/", authMiddleware, fetchAllUsers);

// ================================================================
// Forget Password Token
// ================================================================

userRoute.post("/forget-password-token", forgetPasswordToken);

// ================================================================
// Reset Password
// ================================================================

userRoute.put("/reset-password", passwordReset);

// ================================================================
// Update User Password
// ================================================================

userRoute.put("/password", authMiddleware, updateUserPassword);

// ================================================================
// Following User
// ================================================================

userRoute.put("/follow", authMiddleware, followingUser);

// ================================================================
// Generate Email Verification Token
// ================================================================

userRoute.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateVerificationToken
);

// ================================================================
//  Verify Email
// ================================================================

userRoute.post("/verify-account", authMiddleware, accountVerification);

// ================================================================
// unFollow User
// ================================================================

userRoute.put("/unfollow", authMiddleware, unfollowUser);

// ================================================================
// Block User
// ================================================================

userRoute.put("/block/:id", authMiddleware, blockUser);

// ================================================================
// UnBlock User
// ================================================================

userRoute.put("/unblock/:id", authMiddleware, unblockUser);

// ================================================================
// Fetch User Profile
// ================================================================

userRoute.get("/profile/:id", authMiddleware, userProfile);

// ================================================================
// Update User Profile
// ================================================================

userRoute.put("/:id", authMiddleware, updateUserProfile);

// ================================================================
// Delete all users
// ================================================================

userRoute.delete("/:id", deleteUser);

// ================================================================
// Fetch Single User Details By ID
// ================================================================

userRoute.get("/:id", fetchUserDetails);

export default userRoute;
