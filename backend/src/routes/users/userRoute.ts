// Importing Libraries
import express from "express";

// Importing dependencies
import {
  userLogin,
  userRegister,
  fetchAllUsers,
  deleteUser,
  fetchUserDetails,
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
// Delete all users
// ================================================================

userRoute.delete("/:id", deleteUser);

// ================================================================
// Fetch Single User Details By ID
// ================================================================

userRoute.get("/:id", fetchUserDetails);

export default userRoute;
