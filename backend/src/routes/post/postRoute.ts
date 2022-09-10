// Importing Libraries
import express, { NextFunction } from "express";

// Importing dependencies
import {
  createPost,
  fetchAllPosts,
  fetchSinglePost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
} from "../../controllers/posts/post.controller";
import { authMiddleware } from "../../middlewares/auth/authMiddleware";
import {
  photoUploads,
  postImageResize,
} from "../../middlewares/uploads/photoUploads";
const postRoute = express.Router();

// ================================================================
// Create Post
// ================================================================

postRoute.post(
  "/create-post",
  authMiddleware,
  [
    photoUploads.single("image"),
    (req: any, res: any, next: NextFunction) => {
      console.log(req.file, req.body);
      next();
    },
  ],
  postImageResize,
  createPost
);

// ================================================================
// Like Post
// ================================================================

postRoute.put("/likes", authMiddleware, likePost);
// ================================================================
// Dislike Post
// ================================================================

postRoute.put("/dislikes", authMiddleware, dislikePost);

// ================================================================
// Fetch All Post
// ================================================================

postRoute.get("/", authMiddleware, fetchAllPosts);

// ================================================================
// Fetch Single Post
// ================================================================

postRoute.get("/:id", authMiddleware, fetchSinglePost);

// ================================================================
// Update Post
// ================================================================

postRoute.put("/:id", authMiddleware, updatePost);

// ================================================================
// Delete Post
// ================================================================

postRoute.delete("/:id", authMiddleware, deletePost);

export default postRoute;
