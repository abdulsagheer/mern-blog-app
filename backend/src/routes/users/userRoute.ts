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
} from "../../controllers/users/user.controller";
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
// Fetch all users
// ================================================================

userRoute.get("/", authMiddleware, fetchAllUsers);

// ================================================================
// Update User Password
// ================================================================

userRoute.put("/password", authMiddleware, updateUserPassword);

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
