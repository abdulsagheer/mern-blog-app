// Importing Libraries
import express, { NextFunction } from "express";

// Importing dependencies
import {
  createComment,
  fetchAllComment,
  fetchSingleComment,
  updateComment,
  deleteComment,
} from "../../controllers/comments/comment.controller";
import { authMiddleware } from "../../middlewares/auth/authMiddleware";

const commentRoute = express.Router();

// ================================================================
// Create Comment
// ================================================================

commentRoute.post("/create-comment", authMiddleware, createComment);

// ================================================================
// Fetch All Comment
// ================================================================

commentRoute.get("/", authMiddleware, fetchAllComment);

// ================================================================
// Fetch Single Comment Details
// ================================================================

commentRoute.get("/:id", authMiddleware, fetchSingleComment);

// ================================================================
// Fetch Single Comment Details
// ================================================================

commentRoute.put("/:id", authMiddleware, updateComment);

// ================================================================
// Delete Comment
// ================================================================

commentRoute.delete("/:id", authMiddleware, deleteComment);

export default commentRoute;
