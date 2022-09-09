// Importing Libraries
import express from "express";

// Importing dependencies
import { createPost } from "../../controllers/posts/post.controller";
import { authMiddleware } from "../../middlewares/auth/authMiddleware";
const postRoute = express.Router();

// ================================================================
// Create Post
// ================================================================

postRoute.post("/create-post", authMiddleware, createPost);

export default postRoute;
